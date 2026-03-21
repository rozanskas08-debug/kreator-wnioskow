import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Platform, Share, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { runExpertReview, ProjectReviewData, ExpertReviewResult } from "@/lib/data/modules-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function ScoreBar({ score, maxScore, color }: { score: number; maxScore: number; color: string }) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return (
    <View style={{ height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
      <View style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 4 }} />
    </View>
  );
}

function ResultScreen({ result, onReset }: { result: ExpertReviewResult; onReset: () => void }) {
  const colors = useColors();
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

  const handleShare = async () => {
    haptic();
    const text = `OCENA EKSPERTA — SYMULACJA KOMISJI\n${"─".repeat(40)}\n\n` +
      `WYNIK: ${result.totalScore}/${result.maxScore} pkt (${result.percentage}%)\n` +
      `OCENA: ${result.verdictLabel}\n\n` +
      `KOMENTARZ EKSPERTA:\n${result.expertComment}\n\n` +
      `GŁÓWNE PROBLEMY:\n${result.topIssues.map((i, n) => `${n + 1}. ${i}`).join("\n")}\n\n` +
      `CO POPRAWIĆ:\n${result.topSuggestions.map((s, n) => `${n + 1}. ${s}`).join("\n")}`;
    try {
      await Share.share({ message: text, title: "Ocena eksperta" });
    } catch {
      Alert.alert("Błąd", "Nie udało się udostępnić.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Score Hero */}
        <View style={{ backgroundColor: result.verdictColor, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, alignItems: "center" }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "900" }}>{result.percentage}%</Text>
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>{result.verdictLabel}</Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{result.totalScore} / {result.maxScore} punktów</Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>
          {/* Expert Comment */}
          <View style={{ backgroundColor: "#1E3A5F", borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16 }}>🧠</Text>
              </View>
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>Komentarz eksperta</Text>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 20, fontStyle: "italic" }}>
              "{result.expertComment}"
            </Text>
          </View>

          {/* Criteria scores */}
          <Text style={{ color: "#11181C", fontSize: 16, fontWeight: "800", marginBottom: 14 }}>Ocena punktowa kryteriów</Text>
          {result.criteriaScores.map((c) => {
            const pct = Math.round((c.score / c.maxScore) * 100);
            const barColor = pct >= 70 ? "#16A34A" : pct >= 40 ? "#D97706" : "#DC2626";
            const isExpanded = expandedCriterion === c.criterionId;
            return (
              <Pressable
                key={c.criterionId}
                onPress={() => { haptic(); setExpandedCriterion(isExpanded ? null : c.criterionId); }}
                style={({ pressed }) => ({ backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB", opacity: pressed ? 0.9 : 1 })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ color: "#11181C", fontSize: 14, fontWeight: "700", flex: 1 }}>{c.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: barColor, fontSize: 14, fontWeight: "800" }}>{c.score}/{c.maxScore}</Text>
                    <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={14} color="#687076" />
                  </View>
                </View>
                <ScoreBar score={c.score} maxScore={c.maxScore} color={barColor} />

                {isExpanded && (
                  <View style={{ marginTop: 12, gap: 10 }}>
                    {c.issues.length > 0 && (
                      <View style={{ backgroundColor: "#FFF1F2", borderRadius: 10, padding: 10 }}>
                        <Text style={{ color: "#DC2626", fontSize: 11, fontWeight: "800", marginBottom: 6 }}>PROBLEMY</Text>
                        {c.issues.map((issue, i) => (
                          <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
                            <Text style={{ color: "#DC2626", fontSize: 13 }}>✗</Text>
                            <Text style={{ color: "#7F1D1D", fontSize: 12, lineHeight: 17, flex: 1 }}>{issue}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {c.suggestions.length > 0 && (
                      <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, padding: 10 }}>
                        <Text style={{ color: "#16A34A", fontSize: 11, fontWeight: "800", marginBottom: 6 }}>CO POPRAWIĆ</Text>
                        {c.suggestions.map((s, i) => (
                          <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
                            <Text style={{ color: "#16A34A", fontSize: 13 }}>→</Text>
                            <Text style={{ color: "#14532D", fontSize: 12, lineHeight: 17, flex: 1 }}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}

          {/* Top issues */}
          {result.topIssues.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: "#11181C", fontSize: 16, fontWeight: "800", marginBottom: 12 }}>🚨 Główne problemy do naprawienia</Text>
              <View style={{ backgroundColor: "#FFF1F2", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FECDD3" }}>
                {result.topIssues.map((issue, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>{i + 1}</Text>
                    </View>
                    <Text style={{ color: "#7F1D1D", fontSize: 13, lineHeight: 18, flex: 1 }}>{issue}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Top suggestions */}
          {result.topSuggestions.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: "#11181C", fontSize: 16, fontWeight: "800", marginBottom: 12 }}>✅ Konkretne poprawki</Text>
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#BBF7D0" }}>
                {result.topSuggestions.map((s, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>{i + 1}</Text>
                    </View>
                    <Text style={{ color: "#14532D", fontSize: 13, lineHeight: 18, flex: 1 }}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={{ gap: 12, marginTop: 20 }}>
            <Pressable onPress={handleShare} style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, opacity: pressed ? 0.8 : 1 })}>
              <IconSymbol name="square.and.arrow.up" size={20} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "800" }}>Udostępnij ocenę</Text>
            </Pressable>
            <Pressable onPress={onReset} style={({ pressed }) => ({ backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderWidth: 1, borderColor: "#E5E7EB", opacity: pressed ? 0.8 : 1 })}>
              <IconSymbol name="arrow.counterclockwise" size={18} color="#687076" />
              <Text style={{ color: "#687076", fontSize: 15, fontWeight: "700" }}>Oceń nowy wniosek</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default function ExpertReviewScreen() {
  const colors = useColors();
  const router = useRouter();
  const [result, setResult] = useState<ExpertReviewResult | null>(null);
  const [form, setForm] = useState<ProjectReviewData>({
    title: "",
    problemDescription: "",
    targetGroup: "",
    targetGroupCount: 0,
    goal: "",
    activities: [],
    hardResults: [],
    softResults: [],
    kpis: [],
    budget: 0,
    budgetItems: [],
    organizationExperience: "",
  });
  const [activitiesText, setActivitiesText] = useState("");
  const [hardResultsText, setHardResultsText] = useState("");
  const [kpisText, setKpisText] = useState("");

  const handleReview = () => {
    haptic();
    const reviewData: ProjectReviewData = {
      ...form,
      activities: activitiesText.split("\n").filter((a) => a.trim()),
      hardResults: hardResultsText.split("\n").filter((r) => r.trim()),
      softResults: [],
      kpis: kpisText.split("\n").filter((k) => k.trim()),
    };
    const reviewResult = runExpertReview(reviewData);
    setResult(reviewResult);
  };

  if (result) {
    return <ResultScreen result={result} onReset={() => setResult(null)} />;
  }

  const inputStyle = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.foreground,
    fontSize: 14,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: "top" as const,
  };

  const labelStyle = { color: colors.foreground, fontSize: 13, fontWeight: "700" as const, marginBottom: 6 };
  const hintStyle = { color: colors.muted, fontSize: 11, marginBottom: 8, lineHeight: 16 };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Dashboard</Text>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Text style={{ fontSize: 24 }}>🧠</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>Ekspert ocenia wniosek</Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 17 }}>
            Symulacja oceny komisji — dowiedz się jak komisja oceni Twój wniosek i co poprawić przed złożeniem.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40, gap: 18 }}>
          {/* Info banner */}
          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FDE68A", flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: 20 }}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#92400E", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>Jak działa ocena eksperta?</Text>
              <Text style={{ color: "#92400E", fontSize: 12, lineHeight: 17 }}>
                Wypełnij poniższe pola danymi z wniosku. System oceni go według 6 kryteriów (jak prawdziwa komisja), wskaże słabe punkty i poda konkretne poprawki.
              </Text>
            </View>
          </View>

          {/* Title */}
          <View>
            <Text style={labelStyle}>Tytuł projektu</Text>
            <TextInput value={form.title} onChangeText={(v) => setForm((p) => ({ ...p, title: v }))} placeholder="Wpisz tytuł projektu..." placeholderTextColor={colors.muted} style={inputStyle} />
          </View>

          {/* Problem */}
          <View>
            <Text style={labelStyle}>Diagnoza problemu *</Text>
            <Text style={hintStyle}>Wklej lub wpisz opis problemu z wniosku. Im więcej danych liczbowych, tym wyższa ocena.</Text>
            <TextInput value={form.problemDescription} onChangeText={(v) => setForm((p) => ({ ...p, problemDescription: v }))} placeholder="Opisz problem, który projekt rozwiązuje..." placeholderTextColor={colors.muted} multiline numberOfLines={5} style={{ ...inputStyle, minHeight: 110 }} />
            <Text style={{ color: colors.muted, fontSize: 10, marginTop: 4 }}>{form.problemDescription.length} znaków</Text>
          </View>

          {/* Target group */}
          <View>
            <Text style={labelStyle}>Opis grupy docelowej *</Text>
            <Text style={hintStyle}>Kto jest beneficjentem? Jak konkretnie opisana jest grupa?</Text>
            <TextInput value={form.targetGroup} onChangeText={(v) => setForm((p) => ({ ...p, targetGroup: v }))} placeholder="Opisz grupę docelową..." placeholderTextColor={colors.muted} multiline numberOfLines={3} style={{ ...inputStyle, minHeight: 80 }} />
          </View>

          {/* Target group count */}
          <View>
            <Text style={labelStyle}>Liczba beneficjentów</Text>
            <TextInput value={form.targetGroupCount > 0 ? String(form.targetGroupCount) : ""} onChangeText={(v) => setForm((p) => ({ ...p, targetGroupCount: parseInt(v) || 0 }))} placeholder="np. 50" placeholderTextColor={colors.muted} keyboardType="numeric" style={inputStyle} />
          </View>

          {/* Goal */}
          <View>
            <Text style={labelStyle}>Cel projektu *</Text>
            <Text style={hintStyle}>Czy cel jest SMART? Czy zawiera liczby i termin?</Text>
            <TextInput value={form.goal} onChangeText={(v) => setForm((p) => ({ ...p, goal: v }))} placeholder="Wpisz cel projektu..." placeholderTextColor={colors.muted} multiline numberOfLines={3} style={{ ...inputStyle, minHeight: 80 }} />
          </View>

          {/* Activities */}
          <View>
            <Text style={labelStyle}>Działania projektowe</Text>
            <Text style={hintStyle}>Wpisz działania (każde w nowej linii)</Text>
            <TextInput value={activitiesText} onChangeText={setActivitiesText} placeholder={"Działanie 1...\nDziałanie 2...\nDziałanie 3..."} placeholderTextColor={colors.muted} multiline numberOfLines={4} style={{ ...inputStyle, minHeight: 100 }} />
          </View>

          {/* Hard results */}
          <View>
            <Text style={labelStyle}>Rezultaty twarde</Text>
            <Text style={hintStyle}>Policzalne rezultaty (każdy w nowej linii)</Text>
            <TextInput value={hardResultsText} onChangeText={setHardResultsText} placeholder={"50 osób ukończyło szkolenie...\n10 wydarzeń..."} placeholderTextColor={colors.muted} multiline numberOfLines={3} style={{ ...inputStyle, minHeight: 80 }} />
          </View>

          {/* KPIs */}
          <View>
            <Text style={labelStyle}>Wskaźniki (KPI)</Text>
            <Text style={hintStyle}>Mierzalne wskaźniki sukcesu (każdy w nowej linii)</Text>
            <TextInput value={kpisText} onChangeText={setKpisText} placeholder={"Wzrost kompetencji o 30%...\nSatysfakcja ≥ 4/5..."} placeholderTextColor={colors.muted} multiline numberOfLines={3} style={{ ...inputStyle, minHeight: 80 }} />
          </View>

          {/* Budget */}
          <View>
            <Text style={labelStyle}>Kwota wnioskowanej dotacji (zł)</Text>
            <TextInput value={form.budget > 0 ? String(form.budget) : ""} onChangeText={(v) => setForm((p) => ({ ...p, budget: parseInt(v.replace(/\s/g, "")) || 0 }))} placeholder="np. 50000" placeholderTextColor={colors.muted} keyboardType="numeric" style={inputStyle} />
          </View>

          {/* Organization experience */}
          <View>
            <Text style={labelStyle}>Doświadczenie organizacji</Text>
            <Text style={hintStyle}>Opisz zrealizowane projekty, kompetencje zespołu</Text>
            <TextInput value={form.organizationExperience} onChangeText={(v) => setForm((p) => ({ ...p, organizationExperience: v }))} placeholder="Opisz doświadczenie organizacji w podobnych projektach..." placeholderTextColor={colors.muted} multiline numberOfLines={4} style={{ ...inputStyle, minHeight: 100 }} />
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleReview}
            style={({ pressed }) => ({ backgroundColor: form.problemDescription && form.targetGroup && form.goal ? "#1E3A5F" : colors.border, borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, opacity: pressed ? 0.8 : 1, marginTop: 8 })}
          >
            <Text style={{ fontSize: 22 }}>🧠</Text>
            <Text style={{ color: form.problemDescription && form.targetGroup && form.goal ? "#FFFFFF" : colors.muted, fontSize: 16, fontWeight: "800" }}>
              Sprawdź jak oceni to komisja
            </Text>
          </Pressable>
          {(!form.problemDescription || !form.targetGroup || !form.goal) && (
            <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>Wypełnij pola: Diagnoza problemu, Grupa docelowa i Cel projektu</Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
