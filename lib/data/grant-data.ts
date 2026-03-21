// ============================================================
// GRANT APP — Core Data Layer
// Based on: matryca projektowa, budżet, harmonogram, lista kontrolna, przydatne strony
// ============================================================

export type ApplicantType = 'ngo' | 'business' | 'institution';
export type ProjectStatus = 'draft' | 'in_progress' | 'review' | 'submitted' | 'approved' | 'rejected';
export type StepStatus = 'not_started' | 'in_progress' | 'done';
export type BudgetCategory = 'admin' | 'program';
export type ContributionType = 'cash' | 'in_kind' | 'volunteer' | 'none';

// ─── APPLICANT TYPES ────────────────────────────────────────
export const APPLICANT_TYPES: { id: ApplicantType; label: string; icon: string; description: string }[] = [
  {
    id: 'ngo',
    label: 'Fundacja / Stowarzyszenie',
    icon: 'building.2.fill',
    description: 'Organizacja pozarządowa (NGO) — fundacja, stowarzyszenie, spółdzielnia socjalna',
  },
  {
    id: 'business',
    label: 'Działalność gospodarcza',
    icon: 'briefcase.fill',
    description: 'Firma, przedsiębiorstwo, spółka — np. wnioski PARP, dotacje unijne dla firm',
  },
  {
    id: 'institution',
    label: 'Instytucja / Szkoła',
    icon: 'building.columns.fill',
    description: 'Szkoła, urząd, instytucja publiczna, jednostka samorządu terytorialnego',
  },
];

// ─── WIZARD STEPS ────────────────────────────────────────────
export interface WizardStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  fields: WizardField[];
}

export interface WizardField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'multiline';
  placeholder?: string;
  hint?: string;
  required: boolean;
  options?: string[];
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'basics',
    stepNumber: 1,
    title: 'Dane podstawowe',
    subtitle: 'Tytuł projektu, wnioskodawca, konkurs',
    icon: 'doc.fill',
    color: '#1E3A5F',
    fields: [
      { id: 'projectTitle', label: 'Tytuł projektu', type: 'text', placeholder: 'np. Kompetencje wychowawcze nauczycieli', required: true, hint: 'Krótki, chwytliwy tytuł opisujący istotę projektu' },
      { id: 'applicantName', label: 'Nazwa wnioskodawcy', type: 'text', placeholder: 'np. Fundacja Aktywni Razem', required: true },
      { id: 'competitionName', label: 'Nazwa konkursu / programu', type: 'text', placeholder: 'np. FIO 2025, PROO, Aktywni+', required: true },
      { id: 'fundingSource', label: 'Źródło finansowania', type: 'text', placeholder: 'np. NIW-CRSO, Ministerstwo Edukacji', required: true },
      { id: 'submissionDeadline', label: 'Termin składania wniosku', type: 'date', required: true },
      { id: 'projectStartDate', label: 'Planowany start projektu', type: 'date', required: true },
      { id: 'projectEndDate', label: 'Planowany koniec projektu', type: 'date', required: true },
      { id: 'requestedAmount', label: 'Wnioskowana kwota dotacji (zł)', type: 'number', placeholder: 'np. 50000', required: true },
      { id: 'ownContribution', label: 'Wkład własny (zł)', type: 'number', placeholder: 'np. 10000', required: false, hint: 'Wymagany przez większość konkursów — min. 10-20% budżetu' },
    ],
  },
  {
    id: 'diagnosis',
    stepNumber: 2,
    title: 'Diagnoza potrzeb',
    subtitle: 'Problem, skąd wiemy, dane statystyczne',
    icon: 'magnifyingglass',
    color: '#7C3AED',
    fields: [
      { id: 'mainProblem', label: 'Główna potrzeba / problem', type: 'textarea', placeholder: 'Opisz główny problem, który projekt ma rozwiązać...', required: true, hint: 'Np. Niski poziom umiejętności wychowawczych nauczycieli z woj. lubelskiego' },
      { id: 'evidenceSource', label: 'Skąd wiemy o potrzebie?', type: 'textarea', placeholder: 'Badania własne, raporty, statystyki GUS, dane lokalne...', required: true, hint: 'Powołaj się na konkretne badania, raporty lub dane statystyczne' },
      { id: 'statisticsData', label: 'Dane statystyczne / liczby', type: 'textarea', placeholder: 'np. 51,7% nauczycieli ma problem z dyscypliną (badanie własne, 04-05.2012, n=29)...', required: false, hint: 'Konkretne liczby zwiększają wiarygodność wniosku' },
      { id: 'targetGroupDescription', label: 'Opis grupy docelowej', type: 'textarea', placeholder: 'Kim są beneficjenci? Ile osób? Skąd? Jakie mają problemy?', required: true, hint: 'Opisz dokładnie: liczba osób, płeć (K/M), wiek, lokalizacja, specyficzne problemy' },
      { id: 'targetGroupSize', label: 'Liczba beneficjentów', type: 'number', placeholder: 'np. 30', required: true },
    ],
  },
  {
    id: 'goals',
    stepNumber: 3,
    title: 'Cele i rezultaty',
    subtitle: 'Cel główny SMART, wskaźniki weryfikacji',
    icon: 'star.fill',
    color: '#D97706',
    fields: [
      { id: 'mainGoal', label: 'Cel główny (SMART)', type: 'textarea', placeholder: 'np. Wzrost kwalifikacji 20 nauczycieli z woj. lubelskiego o 75% do 30.04.2025', required: true, hint: 'Format SMART: Kto? O ile? W jakim zakresie? Do kiedy? Np. "Wzrost X o Y% wśród Z osób do DD.MM.RRRR"' },
      { id: 'specificGoal1', label: 'Cel szczegółowy 1', type: 'textarea', placeholder: 'np. Wzrost umiejętności utrzymywania dyscypliny o 75% u 20 nauczycieli do 30.06.2025', required: true },
      { id: 'specificGoal2', label: 'Cel szczegółowy 2', type: 'textarea', placeholder: 'np. Wzrost umiejętności komunikacji z uczniami o 75%...', required: false },
      { id: 'specificGoal3', label: 'Cel szczegółowy 3', type: 'textarea', placeholder: 'Opcjonalny cel szczegółowy 3...', required: false },
      { id: 'verificationMethods', label: 'Metody weryfikacji osiągnięcia celów', type: 'textarea', placeholder: 'np. listy obecności, test wiedzy (pre/post), ankieta samoopisu, certyfikat udziału, egzamin końcowy', required: true, hint: 'Typowe: listy obecności, test wiedzy x2 (pre/post), ankieta samoopisu x2, certyfikat, egzamin końcowy' },
      { id: 'results', label: 'Rezultaty projektu', type: 'textarea', placeholder: 'np. 20 certyfikatów ukończenia kursu, wzrost wyników testu o min. 75%, raport ewaluacyjny', required: true },
    ],
  },
  {
    id: 'activities',
    stepNumber: 4,
    title: 'Działania i harmonogram',
    subtitle: 'Etapy projektu, terminy, Gantt',
    icon: 'calendar',
    color: '#059669',
    fields: [
      { id: 'phase1Title', label: 'Etap 1 — Tytuł', type: 'text', placeholder: 'np. Rekrutacja uczestników', required: true },
      { id: 'phase1Description', label: 'Etap 1 — Opis działań', type: 'textarea', placeholder: 'Opisz działania w tym etapie...', required: true },
      { id: 'phase1Duration', label: 'Etap 1 — Czas trwania', type: 'text', placeholder: 'np. 03.2025 – 04.2025', required: true },
      { id: 'phase2Title', label: 'Etap 2 — Tytuł', type: 'text', placeholder: 'np. Realizacja szkoleń', required: false },
      { id: 'phase2Description', label: 'Etap 2 — Opis działań', type: 'textarea', placeholder: 'Opisz działania w tym etapie...', required: false },
      { id: 'phase2Duration', label: 'Etap 2 — Czas trwania', type: 'text', placeholder: 'np. 04.2025 – 06.2025', required: false },
      { id: 'phase3Title', label: 'Etap 3 — Tytuł', type: 'text', placeholder: 'np. Konferencja podsumowująca', required: false },
      { id: 'phase3Description', label: 'Etap 3 — Opis działań', type: 'textarea', placeholder: 'Opisz działania w tym etapie...', required: false },
      { id: 'phase3Duration', label: 'Etap 3 — Czas trwania', type: 'text', placeholder: 'np. 06.2025', required: false },
      { id: 'evaluationPlan', label: 'Plan ewaluacji', type: 'textarea', placeholder: 'np. Badania porównawcze na początku i końcu projektu, ankiety uczestników, raport końcowy', required: false },
    ],
  },
  {
    id: 'budget',
    stepNumber: 5,
    title: 'Budżet projektu',
    subtitle: 'Koszty admin i programowe, wkład własny',
    icon: 'banknote.fill',
    color: '#1E3A5F',
    fields: [
      { id: 'adminCosts', label: 'Koszty administracyjne — opis', type: 'textarea', placeholder: 'np. Koordynator (4 mies. x 1200 zł), Księgowość (4 mies. x 300 zł), Biuro (4 mies. x 200 zł)', required: true, hint: 'Zazwyczaj max 20% budżetu. Uwzględnij: wynagrodzenie koordynatora, księgowość, koszty biura' },
      { id: 'adminTotal', label: 'Koszty administracyjne — SUMA (zł)', type: 'number', placeholder: 'np. 6800', required: true },
      { id: 'programCosts', label: 'Koszty programowe — opis', type: 'textarea', placeholder: 'np. Trenerzy (32h x 120 zł), Sale (32h x 50 zł), Materiały (30 os. x 40 zł), Catering (30 os. x 4 dni x 60 zł)', required: true, hint: 'Podziel na etapy. Każda pozycja: nazwa, ilość, jednostka, cena jednostkowa' },
      { id: 'programTotal', label: 'Koszty programowe — SUMA (zł)', type: 'number', placeholder: 'np. 15000', required: true },
      { id: 'ownContributionType', label: 'Rodzaj wkładu własnego', type: 'select', options: ['Środki finansowe własne', 'Wkład rzeczowy (sprzęt, lokal)', 'Wkład osobowy (wolontariat)', 'Mieszany'], required: false },
      { id: 'ownContributionDescription', label: 'Opis wkładu własnego', type: 'textarea', placeholder: 'np. Udostępnienie sal szkoleniowych (32h x 50 zł = 1600 zł) — wkład rzeczowy', required: false },
    ],
  },
  {
    id: 'potential',
    stepNumber: 6,
    title: 'Potencjał organizacji',
    subtitle: 'Doświadczenie, zasoby ludzkie i rzeczowe',
    icon: 'person.3.fill',
    color: '#DC2626',
    fields: [
      { id: 'experienceDescription', label: 'Doświadczenie wnioskodawcy', type: 'textarea', placeholder: 'np. Od 2010 roku realizujemy projekty edukacyjne na terenie woj. lubelskiego. Zrealizowaliśmy 15 projektów dla 500 beneficjentów...', required: true, hint: 'Opisz podobne projekty, lata działalności, sukcesy, nagrody' },
      { id: 'humanResources', label: 'Zasoby ludzkie', type: 'textarea', placeholder: 'np. Zespół 5 osób: koordynator (10 lat doświadczenia), 3 trenerów certyfikowanych, księgowa...', required: true },
      { id: 'materialResources', label: 'Zasoby rzeczowe', type: 'textarea', placeholder: 'np. Własna sala szkoleniowa (50 m², wyposażona), sprzęt multimedialny, samochód służbowy...', required: false },
      { id: 'partnerships', label: 'Partnerzy projektu', type: 'textarea', placeholder: 'np. Urząd Marszałkowski Województwa Lubelskiego (patronat), 5 szkół partnerskich...', required: false },
    ],
  },
];

// ─── BUDGET ITEM ─────────────────────────────────────────────
export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  phase?: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  fromGrant: number;
  ownContribution: number;
  contributionType: ContributionType;
}

// ─── GANTT ACTIVITY ──────────────────────────────────────────
export interface GanttActivity {
  id: string;
  name: string;
  startMonth: number; // 1-based index within project
  durationMonths: number;
  color?: string;
}

// ─── GRANT PROJECT ───────────────────────────────────────────
export interface GrantProject {
  id: string;
  title: string;
  applicantName: string;
  applicantType: ApplicantType;
  competitionName: string;
  fundingSource: string;
  status: ProjectStatus;
  requestedAmount: number;
  ownContribution: number;
  submissionDeadline?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  createdAt: string;
  updatedAt: string;
  // Step data
  stepData: Record<string, Record<string, string>>;
  stepStatuses: Record<string, StepStatus>;
  // Budget
  budgetItems: BudgetItem[];
  // Gantt
  ganttActivities: GanttActivity[];
  // Checklist
  checklistItems: Record<string, boolean>;
  // Notes
  consultantNotes: string;
}

// ─── 33-POINT CONTROL CHECKLIST ──────────────────────────────
export interface ChecklistItem {
  id: string;
  number: number;
  category: 'merit' | 'budget' | 'formal' | 'peer';
  question: string;
  hint?: string;
  required: boolean;
}

export const CONTROL_CHECKLIST: ChecklistItem[] = [
  // Kwestie merytoryczne
  { id: 'c01', number: 1, category: 'merit', question: 'Czy cel projektu jest zgodny z wytycznymi konkursowymi?', hint: 'Sprawdź dokumentację konkursową — cel musi wpisywać się w priorytety programu', required: true },
  { id: 'c02', number: 2, category: 'merit', question: 'Czy cel projektu jest zgodny z misją naszej organizacji?', hint: 'Projekt powinien wynikać z działalności statutowej wnioskodawcy', required: true },
  { id: 'c03', number: 3, category: 'merit', question: 'Czy cel projektu opisany został zgodnie z metodologią SMART?', hint: 'SMART: Specific (konkretny), Measurable (mierzalny), Achievable (osiągalny), Relevant (istotny), Time-bound (określony w czasie)', required: true },
  { id: 'c04', number: 4, category: 'merit', question: 'Czy cel projektu odnosi się do zdiagnozowanych potrzeb?', hint: 'Cel musi wynikać z opisanego problemu i diagnozy potrzeb grupy docelowej', required: true },
  { id: 'c05', number: 5, category: 'merit', question: 'Czy cele projektu są realne do osiągnięcia?', hint: 'Oceń czy masz zasoby, czas i możliwości do realizacji zaplanowanych celów', required: true },
  { id: 'c06', number: 6, category: 'merit', question: 'W jaki sposób sprawdzone zostanie osiągnięcie celów?', hint: 'Wskaż konkretne narzędzia: testy, ankiety, listy obecności, certyfikaty, raporty', required: true },
  { id: 'c07', number: 7, category: 'merit', question: 'Czy dokonano analizy potrzeb na poziomie ogólnym?', hint: 'Odwołaj się do danych krajowych, raportów, statystyk GUS, badań naukowych', required: true },
  { id: 'c08', number: 8, category: 'merit', question: 'Czy dokonano analizy potrzeb na poziomie szczegółowym (grupy docelowej)?', hint: 'Badania własne, ankiety, wywiady z grupą docelową — konkretne liczby i procenty', required: true },
  { id: 'c09', number: 9, category: 'merit', question: 'Czy dokładnie opisano grupę docelową?', hint: 'Liczba osób, płeć (K/M), wiek, lokalizacja, specyficzne cechy i problemy', required: true },
  { id: 'c10', number: 10, category: 'merit', question: 'Czy opisano rezultaty projektu?', hint: 'Rezultaty twarde (certyfikaty, liczba uczestników) i miękkie (zmiana postaw, wiedzy)', required: true },
  { id: 'c11', number: 11, category: 'merit', question: 'W jaki sposób sprawdzone zostanie osiągnięcie zaplanowanych rezultatów?', hint: 'Wskaźniki produktu i rezultatu — jak je zmierzysz?', required: true },
  { id: 'c12', number: 12, category: 'merit', question: 'Czy zaplanowane działania wynikają z diagnozy potrzeb?', hint: 'Każde działanie powinno odpowiadać na konkretny zidentyfikowany problem', required: true },
  { id: 'c13', number: 13, category: 'merit', question: 'Czy zaplanowane działania doprowadzą do opisanych rezultatów i celów?', hint: 'Sprawdź logikę projektu: problem → cel → działania → rezultaty', required: true },
  { id: 'c14', number: 14, category: 'merit', question: 'Czy zaplanowane działania są realne?', hint: 'Czy masz czas, ludzi i zasoby do realizacji wszystkich działań w terminie?', required: true },
  { id: 'c15', number: 15, category: 'merit', question: 'Czy okres realizacji konkursu jest spójny z okresem opisanym w dokumentacji konkursowej?', hint: 'Sprawdź daty w regulaminie — projekt musi się zmieścić w dopuszczalnym oknie czasowym', required: true },
  { id: 'c16', number: 16, category: 'merit', question: 'Czy harmonogram projektu jest spójny z opisanymi działaniami?', hint: 'Każde działanie z opisu powinno mieć odpowiadający termin w harmonogramie', required: true },
  { id: 'c17', number: 17, category: 'merit', question: 'Czy opisano doświadczenie Wnioskodawcy?', hint: 'Zrealizowane projekty, lata działalności, liczba beneficjentów, nagrody, referencje', required: true },
  { id: 'c18', number: 18, category: 'merit', question: 'Czy opisano zasoby ludzkie Wnioskodawcy?', hint: 'Kwalifikacje i doświadczenie kluczowych osób w projekcie', required: true },
  { id: 'c19', number: 19, category: 'merit', question: 'Czy opisano zasoby rzeczowe Wnioskodawcy?', hint: 'Lokal, sprzęt, infrastruktura dostępna dla projektu', required: false },
  // Budżet
  { id: 'c20', number: 20, category: 'budget', question: 'Czy budżet projektu nie zawiera zawyżonych lub zaniżonych stawek?', hint: 'Porównaj z rynkowymi cenami usług, stawkami godzinowymi, cenami materiałów', required: true },
  { id: 'c21', number: 21, category: 'budget', question: 'Czy wszystko co jest w budżecie może być sfinansowane w ramach projektu?', hint: 'Sprawdź katalog kosztów kwalifikowalnych w dokumentacji konkursowej', required: true },
  { id: 'c22', number: 22, category: 'budget', question: 'Czy kwota dotacji mieści się w zakresie określonym w dokumentacji?', hint: 'Sprawdź min. i max. kwotę dotacji w regulaminie konkursu', required: true },
  { id: 'c23', number: 23, category: 'budget', question: 'Czy zaplanowany odpowiedniej wysokości wkład własny?', hint: 'Zazwyczaj min. 10-20% budżetu. Sprawdź wymagania w dokumentacji', required: true },
  { id: 'c24', number: 24, category: 'budget', question: 'Czy wkład własny ma odpowiednią formę (finansową, osobową, rzeczową)?', hint: 'Nie każdy konkurs akceptuje wkład rzeczowy lub wolontariat — sprawdź regulamin', required: true },
  { id: 'c25', number: 25, category: 'budget', question: 'Czy wydatki zaplanowane na administrację projektu nie przekraczają określonego progu?', hint: 'Zazwyczaj max 20% budżetu na koszty administracyjne (koordynacja, księgowość, biuro)', required: true },
  { id: 'c26', number: 26, category: 'budget', question: 'Czy w opisie działań zawarto wszystko co w budżecie?', hint: 'Każda pozycja budżetowa musi mieć uzasadnienie w opisie działań — brak uzasadnienia = ryzyko odrzucenia', required: true },
  // Kwestie formalne
  { id: 'c27', number: 27, category: 'formal', question: 'Czy wniosek projektowy został przygotowany w odpowiedniej formie?', hint: 'Formularz, czcionka, objętość, format pliku — zgodnie z wytycznymi konkursu', required: true },
  { id: 'c28', number: 28, category: 'formal', question: 'Czy mamy wszystkie załączniki?', hint: 'Typowe: statut, KRS, sprawozdanie finansowe, pełnomocnictwa, oświadczenia, referencje', required: true },
  { id: 'c29', number: 29, category: 'formal', question: 'Czy mamy przygotowane wszystko do wysłania/złożenia wniosku?', hint: 'Podpisy, pieczątki, kopie, wersja elektroniczna, potwierdzenie złożenia', required: true },
  { id: 'c30', number: 30, category: 'formal', question: 'Czy czegoś jeszcze nie brakuje?', hint: 'Ostateczne sprawdzenie — przejrzyj całość wniosku i dokumentację konkursową', required: true },
  // Pytania do współpracownika
  { id: 'c31', number: 31, category: 'peer', question: 'Czy wniosek dobrze się czyta?', hint: 'Poproś kogoś niezwiązanego z projektem o przeczytanie i ocenę zrozumiałości', required: false },
  { id: 'c32', number: 32, category: 'peer', question: 'Czy udzieliłbyś dofinansowania na realizację tego projektu?', hint: 'Postaw się w roli oceniającego — czy projekt jest przekonujący?', required: false },
  { id: 'c33', number: 33, category: 'peer', question: 'Czego Twoim zdaniem brakuje w wniosku?', hint: 'Uwagi współpracownika — zapisz je w polu notatek', required: false },
];

// ─── FUNDING SOURCES ─────────────────────────────────────────
export interface FundingSource {
  id: string;
  name: string;
  url: string;
  category: 'ngo_national' | 'ngo_local' | 'eu' | 'corporate' | 'international' | 'business' | 'other';
  applicantTypes: ApplicantType[];
  description: string;
  examples?: string;
}

export const FUNDING_SOURCES: FundingSource[] = [
  // NGO — ogólnopolskie
  { id: 'niw', name: 'NIW-CRSO (FIO, PROO, NOWEFIO)', url: 'https://niw.gov.pl', category: 'ngo_national', applicantTypes: ['ngo'], description: 'Narodowy Instytut Wolności — największy rządowy grantodawca dla NGO. Programy: FIO (do 150 tys. zł), PROO, NOWEFIO, Korpus Solidarności', examples: 'FIO, PROO, NOWEFIO, Korpus Solidarności' },
  { id: 'ngo_pl', name: 'fundusze.ngo.pl — aktualne konkursy', url: 'https://fundusze.ngo.pl/aktualne', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Baza aktualnych konkursów grantowych dla NGO — aktualizowana na bieżąco' },
  { id: 'eurodesk', name: 'Eurodesk — granty zagraniczne', url: 'https://eurodesk.pl', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Baza programów grantowych dla NGO, w tym zagranicznych i europejskich' },
  { id: 'men', name: 'Ministerstwo Edukacji i Nauki', url: 'https://gov.pl/web/edukacja-i-nauka/zadania-publiczne2', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Konkursy MEN — edukacja, nauka, sport szkolny, profilaktyka' },
  { id: 'mkidn', name: 'Ministerstwo Kultury i Dziedzictwa Narodowego', url: 'https://gov.pl/web/kultura/programy-i-projekty', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Programy dotacyjne MKiDN — kultura, dziedzictwo, sztuka, edukacja kulturalna' },
  { id: 'nck', name: 'Narodowe Centrum Kultury', url: 'https://nck.pl/dotacje-i-stypendia/dotacje/programy-dotacyjne-mkidn', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Programy dotacyjne NCK — animacja kultury, edukacja kulturalna, dziedzictwo' },
  { id: 'msit', name: 'Ministerstwo Sportu i Turystyki', url: 'https://gov.pl/web/sport', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Dotacje na sport, turystykę, aktywność fizyczną' },
  { id: 'nfosigw', name: 'Narodowy Fundusz Ochrony Środowiska', url: 'https://gov.pl/web/nfosigw', category: 'ngo_national', applicantTypes: ['ngo', 'business', 'institution'], description: 'Dotacje na ekologię, ochronę środowiska, odnawialne źródła energii' },
  { id: 'nbp', name: 'Narodowy Bank Polski — edukacja ekonomiczna', url: 'https://nbp.pl/edukacja/dofinansowania-nbp', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Dofinansowania NBP na projekty dotyczące edukacji ekonomicznej i finansowej' },
  { id: 'muzeum_hp', name: 'Muzeum Historii Polski — Patriotyzm Jutra', url: 'https://muzhp.pl/patriotyzm-jutra/patriotyzm-jutra-aktualnosci', category: 'ngo_national', applicantTypes: ['ngo', 'institution'], description: 'Program Patriotyzm Jutra — projekty historyczne i patriotyczne' },
  // Fundusze europejskie
  { id: 'fe_gov', name: 'Fundusze Europejskie — portal główny', url: 'https://funduszeeuropejskie.gov.pl', category: 'eu', applicantTypes: ['ngo', 'business', 'institution'], description: 'Portal funduszy UE — wszystkie programy operacyjne, aktualności, wyszukiwarka dotacji' },
  { id: 'efs_men', name: 'EFS — Fundusze unijne dla oświaty', url: 'https://efs.mein.gov.pl', category: 'eu', applicantTypes: ['ngo', 'institution'], description: 'Europejski Fundusz Społeczny dla sektora edukacji — szkolenia, kompetencje, integracja' },
  { id: 'eu_grants', name: 'Spis funduszy unijnych (UE)', url: 'https://european-union.europa.eu/live-work-study/funding-grants-subsidies_pl', category: 'eu', applicantTypes: ['ngo', 'business', 'institution'], description: 'Oficjalny spis wszystkich funduszy i programów Unii Europejskiej' },
  // Fundacje korporacyjne
  { id: 'orange', name: 'Fundacja Orange', url: 'https://fundacja.orange.pl', category: 'corporate', applicantTypes: ['ngo', 'institution'], description: 'Granty na projekty cyfrowe, edukację technologiczną, dostęp do internetu' },
  { id: 'pko', name: 'Fundacja PKO Banku Polskiego', url: 'https://fundacjapkobp.pl/project/projekty', category: 'corporate', applicantTypes: ['ngo'], description: 'Programy grantowe PKO BP — edukacja finansowa, kultura, sport' },
  { id: 'pzu', name: 'Fundacja PZU', url: 'https://fundacja.pzu.pl', category: 'corporate', applicantTypes: ['ngo', 'institution'], description: 'Granty PZU — edukacja, zdrowie, bezpieczeństwo, sport' },
  { id: 'orlen', name: 'Fundacja ORLEN', url: 'https://fundacja.orlen.pl/pl', category: 'corporate', applicantTypes: ['ngo', 'institution'], description: 'Programy Fundacji ORLEN — sport, edukacja, ekologia, społeczności lokalne' },
  { id: 'lotto', name: 'Fundacja Lotto', url: 'https://fundacjalotto.pl/program-grantow', category: 'corporate', applicantTypes: ['ngo'], description: 'Program grantowy Fundacji Lotto — sport, kultura, edukacja' },
  { id: 'kghm', name: 'Fundacja KGHM', url: 'https://fundacjakghm.pl/dla-instytucji', category: 'corporate', applicantTypes: ['ngo', 'institution'], description: 'Granty KGHM — regiony działalności KGHM, edukacja, kultura, sport' },
  { id: 'santander', name: 'Fundacja Santander', url: 'https://fundacja.santander.pl', category: 'corporate', applicantTypes: ['ngo', 'institution'], description: 'Programy Fundacji Santander — edukacja finansowa, przedsiębiorczość' },
  { id: 'mbank', name: 'Fundacja mBanku', url: 'https://mbank.pl/mfundacja/strona-glowna', category: 'corporate', applicantTypes: ['ngo', 'institution'], description: 'Granty mFundacji — edukacja matematyczna, STEM, innowacje' },
  // Dla firm / przedsiębiorców
  { id: 'parp', name: 'PARP — Polska Agencja Rozwoju Przedsiębiorczości', url: 'https://parp.gov.pl', category: 'business', applicantTypes: ['business'], description: 'Dotacje dla firm — innowacje, szkolenia pracowników, internacjonalizacja, B+R' },
  // Zagraniczne
  { id: 'fundsforngos', name: 'Funds for NGOs', url: 'https://fundsforngos.org', category: 'international', applicantTypes: ['ngo'], description: 'Największa baza funduszy zagranicznych dla NGO — granty z całego świata' },
  { id: 'candid', name: 'Candid (Foundation Directory)', url: 'https://candid.org', category: 'international', applicantTypes: ['ngo'], description: 'Baza funduszy dla organizacji pozarządowych — głównie USA i Europa' },
  { id: 'terraviva', name: 'Terra Viva Grants', url: 'https://terravivagrants.org', category: 'international', applicantTypes: ['ngo'], description: 'Granty dotyczące ziemi, klimatu, ekologii i zrównoważonego rozwoju' },
];

export const FUNDING_CATEGORIES = [
  { id: 'all', label: 'Wszystkie', color: '#1E3A5F' },
  { id: 'ngo_national', label: 'NGO Krajowe', color: '#7C3AED' },
  { id: 'eu', label: 'Fundusze UE', color: '#1D4ED8' },
  { id: 'corporate', label: 'Korporacyjne', color: '#D97706' },
  { id: 'business', label: 'Dla firm', color: '#059669' },
  { id: 'international', label: 'Zagraniczne', color: '#DC2626' },
] as const;

// ─── STATUS CONFIG ────────────────────────────────────────────
export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; icon: string }> = {
  draft: { label: 'Szkic', color: '#6B7280', bg: '#F3F4F6', icon: 'pencil' },
  in_progress: { label: 'W trakcie', color: '#D97706', bg: '#FEF3C7', icon: 'clock.fill' },
  review: { label: 'Do weryfikacji', color: '#7C3AED', bg: '#EDE9FE', icon: 'checkmark.circle' },
  submitted: { label: 'Złożony', color: '#1D4ED8', bg: '#DBEAFE', icon: 'paperplane.fill' },
  approved: { label: 'Zatwierdzony', color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark.seal.fill' },
  rejected: { label: 'Odrzucony', color: '#DC2626', bg: '#FEE2E2', icon: 'xmark' },
};

export const STEP_STATUS_CONFIG: Record<StepStatus, { label: string; color: string }> = {
  not_started: { label: 'Nie rozpoczęty', color: '#9CA3AF' },
  in_progress: { label: 'W trakcie', color: '#D97706' },
  done: { label: 'Gotowe', color: '#16A34A' },
};
