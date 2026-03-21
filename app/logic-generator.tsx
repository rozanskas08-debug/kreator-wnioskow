import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Platform, Share, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

interface LogicData {
  problem: string;
  targetGroup: string;
  targetGroupCount: string;
  goal: string;
  activities: string[];
  hardResults: string[];
  softResults: string[];
  kpis: string[];
}

const STEPS = [
  { id: "problem", label: "Problem", icon: "exclamationmark.triangle.fill", color: "#DC2626", bg: "#FFF1F2" },
  { id: "targetGroup", label: "Grupa docelowa", icon: "person.2.fill", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "goal", label: "Cel projektu", icon: "target", color: "#1E3A5F", bg: "#EEF2FF" },
  { id: "activities", label: "Działania", icon: "list.bullet", color: "#0369A1", bg: "#E0F2FE" },
  { id: "results", label: "Rezultaty", icon: "chart.bar.fill", color: "#16A34A", bg: "#F0FDF4" },
  { id: "kpis", label: "Wskaźniki", icon: "chart.line.uptrend.xyaxis", color: "#D97706", bg: "#FEF9C3" },
  { id: "summary", label: "Podsumowanie", icon: "doc.text.fill", color: "#6B7280", bg: "#F9FAFB" },
];

const PROBLEM_SUGGESTIONS = [
  "Osoby starsze (60+) są wykluczone cyfrowo — brak kompetencji do korzystania z e-usług",
  "Nauczyciele nie mają kompetencji do pracy z trudnymi zachowaniami uczniów",
  "Osoby długotrwale bezrobotne (45+) tracą kwalifikacje i nie wracają na rynek pracy",
  "Dzieci z rodzin dysfunkcyjnych mają ograniczony dostęp do wsparcia edukacyjnego",
  "Niska aktywność obywatelska mieszkańców — brak zaangażowania w życie lokalne",
];

const ACTIVITY_SUGGESTIONS = [
  "Szkolenia/warsztaty dla uczestników (cykl X spotkań po Y godzin)",
  "Indywidualne doradztwo/mentoring (X godzin na osobę)",
  "Kampania informacyjna i promocja projektu",
  "Wizyty studyjne / wyjazdy edukacyjne",
  "Konferencja podsumowująca / wydarzenie finałowe",
  "Opracowanie i dystrybucja materiałów edukacyjnych",
];

const KPI_SUGGESTIONS = [
  "Liczba osób, które ukończyły szkolenie z certyfikatem ≥ X",
  "Wzrost kompetencji uczestników o min. 30% (test pre/post)",
  "Satysfakcja uczestników ≥ 4,0/5,0 (ankieta ewaluacyjna)",
  "Liczba zorganizowanych wydarzeń ≥ X",
  "Liczba godzin wsparcia ≥ X",
  "% uczestników, którzy podjęli aktywność po projekcie ≥ 40%",
];

export default function LogicGeneratorScreen() {
  const colors = useColors();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<LogicData>({
    problem: "",
    targetGroup: "",
    targetGroupCount: "",
    goal: "",
    activities: [""],
    hardResults: [""],
    softResults: [""],
    kpis: [""],
  });

  const updateField = (field: keyof LogicData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: "activities" | "hardResults" | "softResults" | "kpis", index: number, value: string) => {
    setData((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: "activities" | "hardResults" | "softResults" | "kpis") => {
    haptic();
    setData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field: "activities" | "hardResults" | "softResults" | "kpis", index: number) => {
    haptic();
    setData((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length > 0 ? arr : [""] };
    });
  };

  const canProceed = () => {
    const step = STEPS[currentStep].id;
    if (step === "problem") return data.problem.length > 20;
    if (step === "targetGroup") return data.targetGroup.length > 10;
    if (step === "goal") return data.goal.length > 20;
    if (step === "activities") return data.activities.some((a) => a.length > 5);
    if (step === "results") return data.hardResults.some((r) => r.length > 5);
    if (step === "kpis") return data.kpis.some((k) => k.length > 5);
    return true;
  };

  const generateSummary = () => {
    const count = data.targetGroupCount ? ` (${data.targetGroupCount} osób)` : "";
    return `LOGIKA PROJEKTU\n${"─".repeat(40)}\n\n` +
      `PROBLEM:\n${data.problem}\n\n` +
      `GRUPA DOCELOWA:\n${data.targetGroup}${count}\n\n` +
      `CEL PROJEKTU:\n${data.goal}\n\n` +
      `DZIAŁANIA:\n${data.activities.filter((a) => a).map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\n` +
      `REZULTATY TWARDE:\n${data.hardResults.filter((r) => r).map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n` +
      `REZULTATY MIĘKKIE:\n${data.softResults.filter((r) => r).map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n` +
      `WSKAŹNIKI (KPI):\n${data.kpis.filter((k) => k).map((k, i) => `${i + 1}. ${k}`).join("\n")}`;
  };

  const handleShare = async () => {
    haptic();
    try {
      await Share.share({ message: generateSummary(), title: "Logika projektu" });
    } catch {
      Alert.alert("Błąd", "Nie udało się udostępnić.");
    }
  };

  const stepId = STEPS[currentStep].id;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Dashboard</Text>
          </Pressable>
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>Generator logiki projektu</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Problem → Cel → Działania → Rezultaty → KPI</Text>
        </View>

        {/* Progress bar */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ flexDirection: "row", gap: 4, marginBottom: 8 }}>
            {STEPS.map((step, i) => (
              <View key={step.id} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= currentStep ? "#1E3A5F" : colors.border }} />
            ))}
          </View>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Krok {currentStep + 1} z {STEPS.length}: <Text style={{ color: colors.foreground, fontWeight: "700" }}>{STEPS[currentStep].label}</Text></Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          {/* Step indicator */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: STEPS[currentStep].bg, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name={STEPS[currentStep].icon as any} size={22} color={STEPS[currentStep].color} />
            </View>
            <View>
              <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>{STEPS[currentStep].label}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Krok {currentStep + 1} z {STEPS.length}</Text>
            </View>
          </View>

          {/* STEP: Problem */}
          {stepId === "problem" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#FFF1F2", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#FECDD3" }}>
                <Text style={{ color: "#7F1D1D", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Co to jest diagnoza problemu?</Text>
                <Text style={{ color: "#7F1D1D", fontSize: 12, lineHeight: 17 }}>Opisz konkretny, udokumentowany problem społeczny. Podaj dane liczbowe (%, liczby, źródła). Im bardziej konkretny opis, tym wyższa ocena komisji.</Text>
              </View>
              <TextInput
                value={data.problem}
                onChangeText={(v) => updateField("problem", v)}
                placeholder="Opisz problem, który projekt ma rozwiązać..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={6}
                style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14, lineHeight: 20, borderWidth: 1, borderColor: colors.border, minHeight: 120, textAlignVertical: "top" }}
              />
              <Text style={{ color: colors.muted, fontSize: 11 }}>{data.problem.length} znaków (min. 200 zalecane)</Text>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginTop: 4 }}>Szybkie szablony:</Text>
              {PROBLEM_SUGGESTIONS.map((s, i) => (
                <Pressable key={i} onPress={() => { haptic(); updateField("problem", s); }} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
                  <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 17 }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* STEP: Target Group */}
          {stepId === "targetGroup" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#DDD6FE" }}>
                <Text style={{ color: "#4C1D95", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Jak opisać grupę docelową?</Text>
                <Text style={{ color: "#4C1D95", fontSize: 12, lineHeight: 17 }}>Zawęź grupę maksymalnie. Unikaj "wszyscy mieszkańcy". Podaj: kto, ile osób, gdzie, jakie bariery mają.</Text>
              </View>
              <TextInput
                value={data.targetGroup}
                onChangeText={(v) => updateField("targetGroup", v)}
                placeholder="Opisz grupę docelową projektu..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14, lineHeight: 20, borderWidth: 1, borderColor: colors.border, minHeight: 100, textAlignVertical: "top" }}
              />
              <View>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 8 }}>Liczba bezpośrednich beneficjentów:</Text>
                <TextInput
                  value={data.targetGroupCount}
                  onChangeText={(v) => updateField("targetGroupCount", v)}
                  placeholder="np. 50"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border }}
                />
              </View>
            </View>
          )}

          {/* STEP: Goal */}
          {stepId === "goal" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#EEF2FF", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#C7D2FE" }}>
                <Text style={{ color: "#1E1B4B", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Cel SMART</Text>
                <Text style={{ color: "#1E1B4B", fontSize: 12, lineHeight: 17 }}>
                  S — Konkretny (co dokładnie?){"\n"}
                  M — Mierzalny (ile? %)  {"\n"}
                  A — Osiągalny (realistyczny){"\n"}
                  R — Istotny (powiązany z problemem){"\n"}
                  T — Terminowy (do kiedy?)
                </Text>
              </View>
              <TextInput
                value={data.goal}
                onChangeText={(v) => updateField("goal", v)}
                placeholder="Sformułuj cel projektu zgodnie z SMART..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14, lineHeight: 20, borderWidth: 1, borderColor: colors.border, minHeight: 100, textAlignVertical: "top" }}
              />
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 4 }}>Przykład celu SMART:</Text>
                <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18, fontStyle: "italic" }}>
                  "Do 31.12.2025 r. wzrost kompetencji cyfrowych 50 seniorów (60+) z gminy X do poziomu umożliwiającego samodzielne korzystanie z e-usług publicznych, mierzony testem pre/post (wzrost o min. 30%)."
                </Text>
              </View>
            </View>
          )}

          {/* STEP: Activities */}
          {stepId === "activities" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#E0F2FE", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#BAE6FD" }}>
                <Text style={{ color: "#0C4A6E", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Jak opisywać działania?</Text>
                <Text style={{ color: "#0C4A6E", fontSize: 12, lineHeight: 17 }}>Każde działanie: CO? DLA KOGO? ILE OSÓB? KIEDY? Każde działanie powinno prowadzić do konkretnego rezultatu.</Text>
              </View>
              {data.activities.map((activity, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#E0F2FE", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
                    <Text style={{ color: "#0369A1", fontSize: 12, fontWeight: "800" }}>{i + 1}</Text>
                  </View>
                  <TextInput
                    value={activity}
                    onChangeText={(v) => updateArrayField("activities", i, v)}
                    placeholder={`Działanie ${i + 1}...`}
                    placeholderTextColor={colors.muted}
                    multiline
                    style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12, color: colors.foreground, fontSize: 14, lineHeight: 20, borderWidth: 1, borderColor: colors.border, minHeight: 60, textAlignVertical: "top" }}
                  />
                  {data.activities.length > 1 && (
                    <Pressable onPress={() => removeArrayItem("activities", i)} style={{ marginTop: 12 }}>
                      <IconSymbol name="minus.circle.fill" size={22} color="#DC2626" />
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable onPress={() => addArrayItem("activities")} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#0369A1", borderStyle: "dashed", opacity: pressed ? 0.7 : 1 })}>
                <IconSymbol name="plus.circle.fill" size={18} color="#0369A1" />
                <Text style={{ color: "#0369A1", fontSize: 14, fontWeight: "700" }}>Dodaj działanie</Text>
              </Pressable>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>Szablony działań:</Text>
              {ACTIVITY_SUGGESTIONS.map((s, i) => (
                <Pressable key={i} onPress={() => { haptic(); const idx = data.activities.findIndex((a) => !a); if (idx >= 0) updateArrayField("activities", idx, s); else addArrayItem("activities"); }} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
                  <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 17 }}>+ {s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* STEP: Results */}
          {stepId === "results" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#BBF7D0" }}>
                <Text style={{ color: "#14532D", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Rezultaty twarde vs miękkie</Text>
                <Text style={{ color: "#14532D", fontSize: 12, lineHeight: 17 }}>
                  <Text style={{ fontWeight: "700" }}>Twarde</Text> — policzalne: liczba osób, godzin, certyfikatów, wydarzeń.{"\n"}
                  <Text style={{ fontWeight: "700" }}>Miękkie</Text> — zmiany postaw, kompetencji, motywacji (mierzone ankietą).
                </Text>
              </View>
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800" }}>Rezultaty twarde:</Text>
              {data.hardResults.map((result, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                    <Text style={{ color: "#16A34A", fontSize: 12, fontWeight: "800" }}>{i + 1}</Text>
                  </View>
                  <TextInput
                    value={result}
                    onChangeText={(v) => updateArrayField("hardResults", i, v)}
                    placeholder={`Rezultat twardy ${i + 1}...`}
                    placeholderTextColor={colors.muted}
                    style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12, color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border, minHeight: 50, textAlignVertical: "top" }}
                  />
                  {data.hardResults.length > 1 && (
                    <Pressable onPress={() => removeArrayItem("hardResults", i)} style={{ marginTop: 10 }}>
                      <IconSymbol name="minus.circle.fill" size={22} color="#DC2626" />
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable onPress={() => addArrayItem("hardResults")} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#16A34A", borderStyle: "dashed", opacity: pressed ? 0.7 : 1 })}>
                <IconSymbol name="plus.circle.fill" size={18} color="#16A34A" />
                <Text style={{ color: "#16A34A", fontSize: 14, fontWeight: "700" }}>Dodaj rezultat twardy</Text>
              </Pressable>

              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", marginTop: 8 }}>Rezultaty miękkie:</Text>
              {data.softResults.map((result, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#ECFEFF", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                    <Text style={{ color: "#0891B2", fontSize: 12, fontWeight: "800" }}>{i + 1}</Text>
                  </View>
                  <TextInput
                    value={result}
                    onChangeText={(v) => updateArrayField("softResults", i, v)}
                    placeholder={`Rezultat miękki ${i + 1}...`}
                    placeholderTextColor={colors.muted}
                    style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12, color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border, minHeight: 50, textAlignVertical: "top" }}
                  />
                  {data.softResults.length > 1 && (
                    <Pressable onPress={() => removeArrayItem("softResults", i)} style={{ marginTop: 10 }}>
                      <IconSymbol name="minus.circle.fill" size={22} color="#DC2626" />
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable onPress={() => addArrayItem("softResults")} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#0891B2", borderStyle: "dashed", opacity: pressed ? 0.7 : 1 })}>
                <IconSymbol name="plus.circle.fill" size={18} color="#0891B2" />
                <Text style={{ color: "#0891B2", fontSize: 14, fontWeight: "700" }}>Dodaj rezultat miękki</Text>
              </Pressable>
            </View>
          )}

          {/* STEP: KPIs */}
          {stepId === "kpis" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#FEF9C3", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#FDE68A" }}>
                <Text style={{ color: "#78350F", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Wskaźniki (KPI)</Text>
                <Text style={{ color: "#78350F", fontSize: 12, lineHeight: 17 }}>Każdy wskaźnik musi być MIERZALNY i mieć metodę pomiaru. Podaj: co mierzysz, jak mierzysz, jaka wartość docelowa.</Text>
              </View>
              {data.kpis.map((kpi, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#FEF9C3", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                    <Text style={{ color: "#D97706", fontSize: 12, fontWeight: "800" }}>{i + 1}</Text>
                  </View>
                  <TextInput
                    value={kpi}
                    onChangeText={(v) => updateArrayField("kpis", i, v)}
                    placeholder={`Wskaźnik ${i + 1}...`}
                    placeholderTextColor={colors.muted}
                    style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12, color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border, minHeight: 50, textAlignVertical: "top" }}
                  />
                  {data.kpis.length > 1 && (
                    <Pressable onPress={() => removeArrayItem("kpis", i)} style={{ marginTop: 10 }}>
                      <IconSymbol name="minus.circle.fill" size={22} color="#DC2626" />
                    </Pressable>
                  )}
                </View>
              ))}
              <Pressable onPress={() => addArrayItem("kpis")} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#D97706", borderStyle: "dashed", opacity: pressed ? 0.7 : 1 })}>
                <IconSymbol name="plus.circle.fill" size={18} color="#D97706" />
                <Text style={{ color: "#D97706", fontSize: 14, fontWeight: "700" }}>Dodaj wskaźnik</Text>
              </Pressable>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>Szablony wskaźników:</Text>
              {KPI_SUGGESTIONS.map((s, i) => (
                <Pressable key={i} onPress={() => { haptic(); const idx = data.kpis.findIndex((k) => !k); if (idx >= 0) updateArrayField("kpis", idx, s); else addArrayItem("kpis"); }} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
                  <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 17 }}>+ {s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* STEP: Summary */}
          {stepId === "summary" && (
            <View style={{ gap: 14 }}>
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BBF7D0" }}>
                <Text style={{ color: "#14532D", fontSize: 14, fontWeight: "800", marginBottom: 10 }}>✅ Logika projektu gotowa!</Text>
                {[
                  { label: "Problem", value: data.problem, color: "#DC2626" },
                  { label: "Grupa docelowa", value: `${data.targetGroup}${data.targetGroupCount ? ` (${data.targetGroupCount} osób)` : ""}`, color: "#7C3AED" },
                  { label: "Cel projektu", value: data.goal, color: "#1E3A5F" },
                  { label: "Działania", value: data.activities.filter((a) => a).map((a, i) => `${i + 1}. ${a}`).join("\n"), color: "#0369A1" },
                  { label: "Rezultaty twarde", value: data.hardResults.filter((r) => r).map((r, i) => `${i + 1}. ${r}`).join("\n"), color: "#16A34A" },
                  { label: "Rezultaty miękkie", value: data.softResults.filter((r) => r).map((r, i) => `${i + 1}. ${r}`).join("\n"), color: "#0891B2" },
                  { label: "Wskaźniki (KPI)", value: data.kpis.filter((k) => k).map((k, i) => `${i + 1}. ${k}`).join("\n"), color: "#D97706" },
                ].map((item) => (
                  <View key={item.label} style={{ marginBottom: 12 }}>
                    <Text style={{ color: item.color, fontSize: 11, fontWeight: "800", marginBottom: 4 }}>{item.label.toUpperCase()}</Text>
                    <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18 }}>{item.value || "—"}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={handleShare} style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, opacity: pressed ? 0.8 : 1 })}>
                <IconSymbol name="square.and.arrow.up" size={20} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Udostępnij logikę projektu</Text>
              </Pressable>
            </View>
          )}

          {/* Navigation buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
            {currentStep > 0 && (
              <Pressable onPress={() => { haptic(); setCurrentStep((p) => p - 1); }} style={({ pressed }) => ({ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
                <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700" }}>← Wstecz</Text>
              </Pressable>
            )}
            {currentStep < STEPS.length - 1 && (
              <Pressable
                onPress={() => { if (canProceed()) { haptic(); setCurrentStep((p) => p + 1); } }}
                style={({ pressed }) => ({ flex: 1, backgroundColor: canProceed() ? "#1E3A5F" : colors.border, borderRadius: 14, padding: 16, alignItems: "center", opacity: pressed ? 0.8 : 1 })}
              >
                <Text style={{ color: canProceed() ? "#FFFFFF" : colors.muted, fontSize: 15, fontWeight: "700" }}>Dalej →</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
