import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { saveAiReview, getRecentReviews, buildLearningContext } from "./supabase-server";

// ─── AI ROUTER ──────────────────────────────────────────────────────────────

const REVIEW_SYSTEM_PROMPT = [
  "Jesteś ekspertem-oceniającym wnioski o dofinansowanie NGO w Polsce z 15-letnim doświadczeniem.",
  "Twoja rola to BRUTALNA, SZCZERA ocena wniosku — dokładnie tak jak robi to komisja konkursowa.",
  "NIE bądź uprzejmy. Mów wprost co jest złe i dlaczego wniosek może odpaść.",
  "Oceniaj jak prawdziwa komisja: szukaj luk, niespójności, ogólników, brakujących danych.",
  "",
  "Odpowiedz WYŁĄCZNIE w formacie JSON (bez markdown, bez backticks):",
  '{',
  '  "overallScore": liczba 0-100,',
  '  "verdict": "PRZEJDZIE" lub "RYZYKOWNY" lub "NIE PRZEJDZIE",',
  '  "verdictReason": "jedno zdanie dlaczego",',
  '  "scores": {',
  '    "relevance": liczba 0-10,',
  '    "targetGroup": liczba 0-10,',
  '    "goals": liczba 0-10,',
  '    "activities": liczba 0-10,',
  '    "budget": liczba 0-10,',
  '    "results": liczba 0-10',
  '  },',
  '  "criticalErrors": ["blad1", "blad2"],',
  '  "warnings": ["ryzyko1", "ryzyko2"],',
  '  "positives": ["plus1", "plus2"],',
  '  "improvements": ["konkretna poprawa1", "konkretna poprawa2", "konkretna poprawa3"],',
  '  "expertComment": "komentarz eksperta jak z prawdziwej recenzji komisji (2-3 zdania)"',
  '}',
].join("\n");

const IMPROVE_SYSTEM_PROMPT = (competitionName: string) => [
  "Jesteś ekspertem od pisania wygrywajacych wnioskow o dofinansowanie NGO w Polsce.",
  "Twoje zadanie: POPRAW podany fragment wniosku tak, zeby maksymalizowal punktacje komisji.",
  "Pisz konkretnie, uzywaj liczb, dat, nazw. Unikaj ogolnikow.",
  "Kontekst konkursu: " + (competitionName || "ogolny konkurs NGO") + ".",
  "",
  "Odpowiedz WYLACZNIE w formacie JSON (bez markdown, bez backticks):",
  '{',
  '  "improvedText": "poprawiony tekst gotowy do wklejenia do wniosku",',
  '  "changes": ["zmiana1 — dlaczego", "zmiana2 — dlaczego"],',
  '  "scoreImpact": "szacowany wzrost punktacji np. +2-3 pkt",',
  '  "tip": "jedna praktyczna wskazowka jak jeszcze bardziej wzmocnic ten fragment"',
  '}',
].join("\n");

const BUDGET_SYSTEM_PROMPT = [
  "Jesteś ekspertem od budzetow projektow NGO w Polsce (2024-2026).",
  "Znasz aktualne stawki rynkowe: trener 80-200 zl/h, sala 50-200 zl/h, materialy 30-80 zl/os, catering 40-80 zl/os/dzien.",
  "Koszty administracyjne zazwyczaj max 20% budzetu.",
  "Zasady kwalifikowalnosci: koszty musza byc niezbedne, racjonalne, zgodne z rynkiem.",
  "",
  "Odpowiedz WYLACZNIE w formacie JSON (bez markdown, bez backticks):",
  '{',
  '  "budgetItems": [',
  '    {',
  '      "category": "administracyjne" lub "programowe",',
  '      "name": "nazwa pozycji",',
  '      "quantity": liczba,',
  '      "unit": "jednostka (h, os, szt, mies)",',
  '      "unitPrice": cena w zl,',
  '      "total": suma w zl,',
  '      "isEligible": true lub false,',
  '      "warning": "ostrzezenie jesli jest ryzyko lub null"',
  '    }',
  '  ],',
  '  "adminTotal": suma kosztow administracyjnych,',
  '  "programTotal": suma kosztow programowych,',
  '  "grandTotal": laczna suma,',
  '  "adminPercent": procent kosztow admin,',
  '  "isAdminOk": czy admin mniejszy niz 20%,',
  '  "warnings": ["ostrzezenie1", "ostrzezenie2"],',
  '  "tips": ["wskazowka budzetowa1", "wskazowka2"]',
  '}',
].join("\n");

const LOGIC_SYSTEM_PROMPT = [
  "Jesteś ekspertem od logiki projektowej NGO. Analizujesz spojnosc projektu.",
  "Sprawdz czy: problem → cel → dzialania → rezultaty → wskazniki sa logicznie powiazane.",
  "Wykryj 'dziury' w logice projektu.",
  "",
  "Odpowiedz WYLACZNIE w formacie JSON (bez markdown, bez backticks):",
  '{',
  '  "overallCoherence": liczba 0-100,',
  '  "links": [',
  '    {',
  '      "from": "problem" lub "targetGroup" lub "goal" lub "activities" lub "results" lub "indicators",',
  '      "to": "problem" lub "targetGroup" lub "goal" lub "activities" lub "results" lub "indicators",',
  '      "status": "ok" lub "weak" lub "missing",',
  '      "comment": "krotki komentarz"',
  '    }',
  '  ],',
  '  "gaps": ["dziura w logice 1", "dziura 2"],',
  '  "strengths": ["mocna strona logiki 1", "mocna strona 2"],',
  '  "suggestions": ["konkretna sugestia poprawy 1", "sugestia 2"]',
  '}',
].join("\n");

const GUIDED_STEPS = [
  "Opowiedz mi o swoim pomysle na projekt (1-2 zdania). Co chcesz zrobic?",
  "Dla kogo jest ten projekt? Opisz grupe docelowa (kto, ile osob, skad, jakie problemy).",
  "Jaki konkretny problem rozwiazuje Twoj projekt? Podaj liczby jesli masz.",
  "Jakie dzialania planujesz? (np. szkolenia, warsztaty, kampania, konferencja)",
  "Jaki jest Twoj budzet? Ile potrzebujesz dotacji i na co?",
  "Jakie rezultaty osiagnie projekt? (np. 30 osob przeszkolonych, 5 certyfikatow)",
];

function buildGuidedSystemPrompt(step: number, totalSteps: number, competitionType: string, isLastStep: boolean, nextQuestion: string): string {
  return [
    "Jestes przyjaznym ekspertem od wnioskow o dofinansowanie NGO.",
    "Prowadzisz uzytkownika przez tworzenie wniosku krok po kroku.",
    "Twoj styl: ciepły, konkretny, zachecajacy. Dajesz krotki feedback na odpowiedz i zadajesz nastepne pytanie.",
    "Typ konkursu: " + (competitionType || "ogolny NGO") + ".",
    "",
    "Odpowiedz WYLACZNIE w formacie JSON (bez markdown, bez backticks):",
    '{',
    '  "feedback": "krotki (1-2 zdania) pozytywny feedback na odpowiedz uzytkownika",',
    '  "suggestion": "opcjonalna wskazowka jak wzmocnic te odpowiedz (1 zdanie) lub null",',
    '  "nextQuestion": "' + (isLastStep ? "Swietnie! Mam juz wszystkie informacje. Czy chcesz zebym wygenerował szkic wniosku?" : nextQuestion) + '",',
    '  "isComplete": ' + isLastStep + ',',
    '  "extractedData": {',
    '    "key": "nazwa pola (np. problem, targetGroup, goal, activities, budget, results)",',
    '    "value": "wyekstrahowana kluczowa informacja z odpowiedzi uzytkownika"',
    '  }',
    '}',
  ].join("\n");
}

export const aiRouter = router({

  // ─── 1. BRUTAL REVIEW ─────────────────────────────────────────────────────
  reviewApplication: publicProcedure
    .input(z.object({
      projectTitle: z.string(),
      problem: z.string(),
      targetGroup: z.string(),
      mainGoal: z.string(),
      activities: z.string(),
      budget: z.string(),
      results: z.string(),
      competitionName: z.string().optional(),
      organizationExperience: z.string().optional(),
      projectId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const applicationText = [
        "TYTUL PROJEKTU: " + input.projectTitle,
        "KONKURS: " + (input.competitionName || "nieokreslony"),
        "DIAGNOZA PROBLEMU: " + input.problem,
        "GRUPA DOCELOWA: " + input.targetGroup,
        "CEL GLOWNY: " + input.mainGoal,
        "DZIALANIA: " + input.activities,
        "BUDZET: " + input.budget,
        "REZULTATY: " + input.results,
        "DOSWIADCZENIE ORGANIZACJI: " + (input.organizationExperience || "nieokreslone"),
      ].join("\n");

      // Load history for learning context
      const recentReviews = await getRecentReviews(15);
      const learningContext = buildLearningContext(recentReviews);
      const systemPromptWithLearning = learningContext
        ? REVIEW_SYSTEM_PROMPT + "\n\n" + learningContext
        : REVIEW_SYSTEM_PROMPT;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPromptWithLearning },
          { role: "user", content: "Oceń ten wniosek o dofinansowanie:\n\n" + applicationText },
        ],
        response_format: { type: "json_object" },
        maxTokens: 2000,
      });
      const content = response.choices[0].message.content as string;
      const result = JSON.parse(content);

      // Save review to Supabase for future learning
      const reviewId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      await saveAiReview({
        id: reviewId,
        project_id: input.projectId ?? null,
        project_title: input.projectTitle,
        competition_name: input.competitionName ?? null,
        overall_score: result.overallScore ?? 0,
        verdict: result.verdict ?? 'NIE PRZEJDZIE',
        verdict_reason: result.verdictReason ?? '',
        scores: result.scores ?? {},
        critical_errors: result.criticalErrors ?? [],
        warnings: result.warnings ?? [],
        positives: result.positives ?? [],
        improvements: result.improvements ?? [],
        expert_comment: result.expertComment ?? '',
      });

      return { ...result, reviewId };
    }),

  // ─── 2. IMPROVE APPLICATION ───────────────────────────────────────────────
  improveApplication: publicProcedure
    .input(z.object({
      section: z.enum(["problem", "targetGroup", "goal", "activities", "budget", "results", "all"]),
      currentText: z.string(),
      projectContext: z.string().optional(),
      competitionName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const sectionNames: Record<string, string> = {
        problem: "diagnoza problemu",
        targetGroup: "opis grupy docelowej",
        goal: "cel glowny SMART",
        activities: "opis dzialan",
        budget: "uzasadnienie budzetu",
        results: "rezultaty projektu",
        all: "caly wniosek",
      };

      const response = await invokeLLM({
        messages: [
          { role: "system", content: IMPROVE_SYSTEM_PROMPT(input.competitionName || "") },
          {
            role: "user",
            content: "Popraw sekcje: " + sectionNames[input.section] + "\n\nKontekst projektu: " + (input.projectContext || "brak") + "\n\nAktualny tekst:\n" + input.currentText,
          },
        ],
        response_format: { type: "json_object" },
        maxTokens: 1500,
      });

      const content = response.choices[0].message.content as string;
      return JSON.parse(content);
    }),

  // ─── 3. GUIDED WIZARD ─────────────────────────────────────────────────────
  guidedQuestion: publicProcedure
    .input(z.object({
      step: z.number(),
      userAnswer: z.string(),
      projectSoFar: z.record(z.string(), z.string()).optional(),
      competitionType: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const nextStep = input.step + 1;
      const isLastStep = nextStep >= GUIDED_STEPS.length;
      const nextQuestion = isLastStep ? "" : GUIDED_STEPS[nextStep];

      const projectContext = Object.entries(input.projectSoFar || {})
        .map(([k, v]) => k + ": " + v)
        .join("\n");

      const systemPrompt = buildGuidedSystemPrompt(
        input.step,
        GUIDED_STEPS.length,
        input.competitionType || "",
        isLastStep,
        nextQuestion,
      );

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: "Krok " + (input.step + 1) + "/" + GUIDED_STEPS.length + "\nPytanie bylo: \"" + (GUIDED_STEPS[input.step] || "poprzednie pytanie") + "\"\nOdpowiedz uzytkownika: \"" + input.userAnswer + "\"\n\nDotychczasowy projekt:\n" + projectContext,
          },
        ],
        response_format: { type: "json_object" },
        maxTokens: 800,
      });

      const content = response.choices[0].message.content as string;
      const parsed = JSON.parse(content);
      return {
        ...parsed,
        currentStep: input.step,
        nextStep,
        totalSteps: GUIDED_STEPS.length,
        firstQuestion: input.step === 0 ? GUIDED_STEPS[0] : undefined,
      };
    }),

  // ─── 4. AUTO BUDGET GENERATOR ────────────────────────────────────────────
  generateBudget: publicProcedure
    .input(z.object({
      activities: z.string(),
      duration: z.string(),
      participantsCount: z.number(),
      requestedAmount: z.number(),
      competitionType: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const userMsg = [
        "Wygeneruj budzet projektu NGO:",
        "Dzialania: " + input.activities,
        "Czas trwania: " + input.duration,
        "Liczba uczestnikow: " + input.participantsCount,
        "Wnioskowana kwota: " + input.requestedAmount + " zl",
        "Typ konkursu: " + (input.competitionType || "ogolny"),
      ].join("\n");

      const response = await invokeLLM({
        messages: [
          { role: "system", content: BUDGET_SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
        maxTokens: 2000,
      });

      const content = response.choices[0].message.content as string;
      return JSON.parse(content);
    }),

  // ─── 5. PROJECT LOGIC CHECKER ────────────────────────────────────────────
  checkProjectLogic: publicProcedure
    .input(z.object({
      problem: z.string(),
      targetGroup: z.string(),
      mainGoal: z.string(),
      activities: z.string(),
      results: z.string(),
      indicators: z.string(),
    }))
    .mutation(async ({ input }) => {
      const userMsg = [
        "Sprawdz logike projektu:",
        "Problem: " + input.problem,
        "Grupa docelowa: " + input.targetGroup,
        "Cel glowny: " + input.mainGoal,
        "Dzialania: " + input.activities,
        "Rezultaty: " + input.results,
        "Wskazniki: " + input.indicators,
      ].join("\n");

      const response = await invokeLLM({
        messages: [
          { role: "system", content: LOGIC_SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
        maxTokens: 1500,
      });

      const content = response.choices[0].message.content as string;
      return JSON.parse(content);
    }),

  // ─── 6. GET REVIEW HISTORY ───────────────────────────────────────────────────────────────────────────────────
  getReviewHistory: publicProcedure
    .input(z.object({
      projectId: z.string().optional(),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      const reviews = await getRecentReviews(input.limit);
      if (input.projectId) {
        return reviews.filter(r => r.project_id === input.projectId);
      }
      return reviews;
    }),
});
