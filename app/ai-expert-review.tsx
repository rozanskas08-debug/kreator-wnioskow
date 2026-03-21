import { useState } from "react";
import { ScrollView, Pressable, Text, TextInput, View, Platform, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 8 ? "#16A34A" : score >= 6 ? "#D97706" : "#DC2626";
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ fontSize: 13, color: "#374151", fontWeight: "600" }}>{label}</Text>
        <Text style={{ fontSize: 13, color, fontWeight: "800" }}>{score}/10</Text>
      </View>
      <View style={{ height: 6, backgroundColor: "#E5E7EB", borderRadius: 3 }}>
        <View style={{ height: 6, backgroundColor: color, borderRadius: 3, width: `${score * 10}%` as any }} />
      </View>
    </View>
  );
}

const SCORE_LABELS: Record<string, string> = {
  relevance: "Trafność projektu",
  targetGroup: "Grupa docelowa",
  goals: "Cele SMART",
  activities: "Działania",
  budget: "Budżet",
  results: "Rezultaty",
};

export default function AIExpertReviewScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"form" | "result">("form");
  const [form, setForm] = useState({
    projectTitle: "",
    competitionName: "",
    problem: "",
    targetGroup: "",
    mainGoal: "",
    activities: "",
    budget: "",
    results: "",
    organizationExperience: "",
  });
  const [result, setResult] = useState<any>(null);
  const [improveResult, setImproveResult] = useState<any>(null);
  const [improvingSection, setImprovingSection] = useState<string | null>(null);

  const reviewMutation = trpc.ai.reviewApplication.useMutation();
  const improveMutation = trpc.ai.improveApplication.useMutation();

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const runReview = async () => {
    haptic();
    try {
      const res = await reviewMutation.mutateAsync(form);
      setResult(res);
      setActiveTab("result");
    } catch (e) {
      // error shown via mutation state
    }
  };

  const improveSection = async (section: string, text: string) => {
    haptic();
    setImprovingSection(section);
    setImproveResult(null);
    try {
      const res = await improveMutation.mutateAsync({
        section: section as any,
        currentText: text,
        projectContext: form.projectTitle,
        competitionName: form.competitionName,
      });
      setImproveResult(res);
    } catch {
      setImproveResult({ error: true });
    }
  };

  const verdictConfig: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    "PRZEJDZIE": { color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC", icon: "✅" },
    "RYZYKOWNY": { color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", icon: "⚠️" },
    "NIE PRZEJDZIE": { color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", icon: "❌" },
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#7C1D1D", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginBottom: 12 })}>
          <IconSymbol name="chevron.left" size={20} color="rgba(255,255,255,0.8)" />
        </Pressable>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>AI Ocena</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800" }}>Tryb NIE PRZEJDZIE 🔥</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>Brutalna ocena AI jak prawdziwa komisja konkursowa</Text>

        {/* Tabs */}
        <View style={{ flexDirection: "row", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 3, marginTop: 14 }}>
          {(["form", "result"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => { haptic(); setActiveTab(tab); }}
              style={({ pressed }) => ({
                flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center",
                backgroundColor: activeTab === tab ? "#FFFFFF" : "transparent",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: activeTab === tab ? "#7C1D1D" : "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "700" }}>
                {tab === "form" ? "📝 Wniosek" : "📊 Ocena AI"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {activeTab === "form" ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <View style={{ backgroundColor: "#FFF7ED", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#FED7AA" }}>
            <Text style={{ color: "#9A3412", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>🤖 Jak to działa?</Text>
            <Text style={{ color: "#7C2D12", fontSize: 12, lineHeight: 18 }}>
              Wypełnij formularz → AI ocenia wniosek jak prawdziwa komisja → dostajesz scoring, błędy krytyczne i konkretne poprawki. Możesz też poprawić każdą sekcję jednym kliknięciem.
            </Text>
          </View>

          {[
            { key: "projectTitle", label: "Tytuł projektu *", placeholder: "np. Kompetencje wychowawcze nauczycieli", multi: false },
            { key: "competitionName", label: "Konkurs / program", placeholder: "np. FIO 2025, PROO, Aktywni+", multi: false },
            { key: "problem", label: "Diagnoza problemu *", placeholder: "Opisz problem z liczbami i źródłami...", multi: true },
            { key: "targetGroup", label: "Grupa docelowa *", placeholder: "Kim są beneficjenci? Ile osób? Skąd? Jakie problemy?", multi: true },
            { key: "mainGoal", label: "Cel główny (SMART) *", placeholder: "np. Wzrost kwalifikacji 20 nauczycieli o 75% do 30.04.2025", multi: true },
            { key: "activities", label: "Działania *", placeholder: "Opisz działania: szkolenia, warsztaty, kampanie...", multi: true },
            { key: "budget", label: "Budżet (opis) *", placeholder: "np. Trenerzy 32h x 120 zł, sala 32h x 50 zł...", multi: true },
            { key: "results", label: "Rezultaty *", placeholder: "np. 20 certyfikatów, wzrost wyników o 75%...", multi: true },
            { key: "organizationExperience", label: "Doświadczenie organizacji", placeholder: "Podobne projekty, lata działalności, sukcesy...", multi: true },
          ].map((field) => (
            <View key={field.key} style={{ marginBottom: 14 }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>{field.label}</Text>
              <TextInput
                value={form[field.key as keyof typeof form]}
                onChangeText={(v) => updateField(field.key, v)}
                placeholder={field.placeholder}
                placeholderTextColor={colors.muted}
                multiline={field.multi}
                numberOfLines={field.multi ? 3 : 1}
                style={{
                  color: colors.foreground, fontSize: 13,
                  backgroundColor: colors.surface, borderRadius: 10,
                  padding: 12, borderWidth: 1, borderColor: colors.border,
                  minHeight: field.multi ? 80 : 44, lineHeight: 20,
                  textAlignVertical: field.multi ? "top" : "center",
                }}
              />
            </View>
          ))}

          <Pressable
            onPress={runReview}
            disabled={reviewMutation.isPending || !form.projectTitle || !form.problem}
            style={({ pressed }) => ({
              backgroundColor: "#7C1D1D", borderRadius: 14, padding: 18,
              alignItems: "center", marginTop: 8,
              opacity: (reviewMutation.isPending || !form.projectTitle || !form.problem) ? 0.6 : pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            {reviewMutation.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Komisja AI ocenia...</Text>
              </View>
            ) : (
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>🔥 Oceń brutalnie</Text>
            )}
          </Pressable>
          {reviewMutation.isError && (
            <Text style={{ color: "#DC2626", fontSize: 13, textAlign: "center", marginTop: 8 }}>
              Błąd połączenia z AI. Sprawdź połączenie i spróbuj ponownie.
            </Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {!result ? (
            <View style={{ alignItems: "center", padding: 40 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>Brak oceny AI</Text>
              <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", marginBottom: 16 }}>Wypełnij formularz i kliknij "Oceń brutalnie"</Text>
              <Pressable
                onPress={() => setActiveTab("form")}
                style={({ pressed }) => ({ backgroundColor: "#7C1D1D", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, opacity: pressed ? 0.8 : 1 })}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Przejdź do formularza</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Verdict */}
              {(() => {
                const cfg = verdictConfig[result.verdict] || verdictConfig["RYZYKOWNY"];
                return (
                  <View style={{ backgroundColor: cfg.bg, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: cfg.border, alignItems: "center" }}>
                    <Text style={{ fontSize: 36, marginBottom: 8 }}>{cfg.icon}</Text>
                    <Text style={{ color: cfg.color, fontSize: 26, fontWeight: "900", letterSpacing: 1 }}>{result.verdict}</Text>
                    <Text style={{ color: cfg.color, fontSize: 14, textAlign: "center", marginTop: 6, lineHeight: 20 }}>{result.verdictReason}</Text>
                    <View style={{ marginTop: 12, backgroundColor: cfg.color, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6 }}>
                      <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>{result.overallScore}/100 pkt</Text>
                    </View>
                  </View>
                );
              })()}

              {/* Scores */}
              <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 14 }}>📊 Ocena punktowa</Text>
                {result.scores && Object.entries(result.scores).map(([key, score]) => (
                  <ScoreBar key={key} label={SCORE_LABELS[key] || key} score={score as number} />
                ))}
              </View>

              {/* Expert comment */}
              <View style={{ backgroundColor: "#1E3A5F", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>🧠 Komentarz komisji AI</Text>
                <Text style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 22, fontStyle: "italic" }}>"{result.expertComment}"</Text>
              </View>

              {/* Critical errors */}
              {result.criticalErrors?.length > 0 && (
                <View style={{ backgroundColor: "#FEF2F2", borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#FCA5A5" }}>
                  <Text style={{ color: "#DC2626", fontSize: 15, fontWeight: "800", marginBottom: 10 }}>❌ Błędy krytyczne — wniosek odpadnie</Text>
                  {result.criticalErrors.map((err: string, i: number) => (
                    <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                      <Text style={{ color: "#DC2626", fontWeight: "700" }}>•</Text>
                      <Text style={{ color: "#991B1B", fontSize: 13, flex: 1, lineHeight: 19 }}>{err}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <View style={{ backgroundColor: "#FFFBEB", borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#FCD34D" }}>
                  <Text style={{ color: "#D97706", fontSize: 15, fontWeight: "800", marginBottom: 10 }}>⚠️ Ryzyka — mogą obniżyć punktację</Text>
                  {result.warnings.map((w: string, i: number) => (
                    <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                      <Text style={{ color: "#D97706" }}>•</Text>
                      <Text style={{ color: "#92400E", fontSize: 13, flex: 1, lineHeight: 19 }}>{w}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Positives */}
              {result.positives?.length > 0 && (
                <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#86EFAC" }}>
                  <Text style={{ color: "#16A34A", fontSize: 15, fontWeight: "800", marginBottom: 10 }}>✅ Mocne strony</Text>
                  {result.positives.map((p: string, i: number) => (
                    <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                      <Text style={{ color: "#16A34A" }}>•</Text>
                      <Text style={{ color: "#166534", fontSize: 13, flex: 1, lineHeight: 19 }}>{p}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <View style={{ backgroundColor: "#EFF6FF", borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#BFDBFE" }}>
                  <Text style={{ color: "#1D4ED8", fontSize: 15, fontWeight: "800", marginBottom: 10 }}>🔧 Co poprawić — konkrety</Text>
                  {result.improvements.map((imp: string, i: number) => (
                    <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#1D4ED8", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>{i + 1}</Text>
                      </View>
                      <Text style={{ color: "#1E40AF", fontSize: 13, flex: 1, lineHeight: 19 }}>{imp}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* AI Improve section */}
              <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 4 }}>✨ Popraw sekcję z AI</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 12 }}>Wybierz fragment — AI przepisze go pod maksymalną punktację</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { key: "problem", label: "Problem", text: form.problem },
                    { key: "targetGroup", label: "Grupa", text: form.targetGroup },
                    { key: "goal", label: "Cel", text: form.mainGoal },
                    { key: "activities", label: "Działania", text: form.activities },
                    { key: "budget", label: "Budżet", text: form.budget },
                    { key: "results", label: "Rezultaty", text: form.results },
                  ].map((s) => (
                    <Pressable
                      key={s.key}
                      onPress={() => improveSection(s.key, s.text)}
                      disabled={improveMutation.isPending}
                      style={({ pressed }) => ({
                        backgroundColor: improvingSection === s.key ? "#1E3A5F" : colors.background,
                        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                        borderWidth: 1, borderColor: improvingSection === s.key ? "#1E3A5F" : colors.border,
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Text style={{ color: improvingSection === s.key ? "#FFFFFF" : colors.foreground, fontSize: 13, fontWeight: "600" }}>{s.label}</Text>
                    </Pressable>
                  ))}
                </View>

                {improveMutation.isPending && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}>
                    <ActivityIndicator size="small" color="#1E3A5F" />
                    <Text style={{ color: colors.muted, fontSize: 13 }}>AI przepisuje tekst...</Text>
                  </View>
                )}

                {improveResult && !improveResult.error && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ color: "#16A34A", fontSize: 12, fontWeight: "700", marginBottom: 6 }}>✅ Poprawiony tekst ({improveResult.scoreImpact})</Text>
                    <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#86EFAC", marginBottom: 8 }}>
                      <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20 }}>{improveResult.improvedText}</Text>
                    </View>
                    {improveResult.changes?.map((c: string, i: number) => (
                      <Text key={i} style={{ color: colors.muted, fontSize: 12, marginBottom: 3 }}>• {c}</Text>
                    ))}
                    {improveResult.tip && (
                      <Text style={{ color: "#1D4ED8", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>💡 {improveResult.tip}</Text>
                    )}
                  </View>
                )}
              </View>

              <Pressable
                onPress={() => { haptic(); setActiveTab("form"); }}
                style={({ pressed }) => ({
                  backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                  alignItems: "center", borderWidth: 1, borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>← Popraw i oceń ponownie</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
