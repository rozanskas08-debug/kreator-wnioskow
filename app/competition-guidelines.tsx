import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { COMPETITION_PROGRAMS, CompetitionProgram, ScoringCriterion } from "@/lib/data/modules-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function CriterionCard({ criterion }: { criterion: ScoringCriterion }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const pct = 0; // placeholder for actual score

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
      <Pressable
        onPress={() => { haptic(); setExpanded(!expanded); }}
        style={({ pressed }) => ({ padding: 14, opacity: pressed ? 0.85 : 1 })}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{criterion.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{criterion.description}</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>max {criterion.maxPoints} pkt</Text>
            </View>
            <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={14} color={colors.muted} />
          </View>
        </View>
      </Pressable>

      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: 14, gap: 14 }}>
          {/* Zero points */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 10 }}>✗</Text>
              </View>
              <Text style={{ color: "#DC2626", fontSize: 12, fontWeight: "800" }}>CO DAJE 0 PUNKTÓW</Text>
            </View>
            {criterion.zeroPointsWhen.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 5 }}>
                <Text style={{ color: "#DC2626", fontSize: 13, lineHeight: 18 }}>•</Text>
                <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Max points */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 10 }}>✓</Text>
              </View>
              <Text style={{ color: "#16A34A", fontSize: 12, fontWeight: "800" }}>CO DAJE MAX PUNKTÓW</Text>
            </View>
            {criterion.maxPointsWhen.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 5 }}>
                <Text style={{ color: "#16A34A", fontSize: 13, lineHeight: 18 }}>•</Text>
                <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 10, padding: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Text style={{ fontSize: 14 }}>💡</Text>
              <Text style={{ color: "#92400E", fontSize: 12, fontWeight: "800" }}>WSKAZÓWKI KONSULTANTA</Text>
            </View>
            {criterion.tips.map((tip, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 5 }}>
                <Text style={{ color: "#92400E", fontSize: 13 }}>→</Text>
                <Text style={{ color: "#92400E", fontSize: 13, lineHeight: 18, flex: 1 }}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function ProgramCard({ program, onPress }: { program: CompetitionProgram; onPress: () => void }) {
  const colors = useColors();
  const totalPoints = program.criteria.reduce((sum, c) => sum + c.maxPoints, 0);

  return (
    <Pressable
      onPress={() => { haptic(); onPress(); }}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "800" }}>{program.name}</Text>
            </View>
            {program.cofinancing && (
              <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ color: "#92400E", fontSize: 10, fontWeight: "700" }}>Wkład własny {program.cofinancingPct}%</Text>
              </View>
            )}
          </View>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{program.fullName}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{program.operator}</Text>
        </View>
        <IconSymbol name="chevron.right" size={18} color={colors.muted} />
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 17, marginBottom: 10 }}>{program.description}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1, backgroundColor: "#EEF2FF", borderRadius: 8, padding: 8, alignItems: "center" }}>
          <Text style={{ color: "#4F46E5", fontSize: 13, fontWeight: "800" }}>{program.minGrant.toLocaleString("pl-PL")} – {program.maxGrant.toLocaleString("pl-PL")} zł</Text>
          <Text style={{ color: "#4F46E5", fontSize: 10, marginTop: 2 }}>Kwota dotacji</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#F0FDF4", borderRadius: 8, padding: 8, alignItems: "center" }}>
          <Text style={{ color: "#16A34A", fontSize: 13, fontWeight: "800" }}>{totalPoints} pkt</Text>
          <Text style={{ color: "#16A34A", fontSize: 10, marginTop: 2 }}>Łączna punktacja</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#FFF7ED", borderRadius: 8, padding: 8, alignItems: "center" }}>
          <Text style={{ color: "#C2410C", fontSize: 13, fontWeight: "800" }}>{program.criteria.length}</Text>
          <Text style={{ color: "#C2410C", fontSize: 10, marginTop: 2 }}>Kryteriów oceny</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function CompetitionGuidelinesScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<CompetitionProgram | null>(null);

  if (selectedProgram) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Program Header */}
          <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
            <Pressable onPress={() => setSelectedProgram(null)} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14, opacity: pressed ? 0.7 : 1 })}>
              <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Programy</Text>
            </Pressable>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>{selectedProgram.name}</Text>
              </View>
            </View>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginBottom: 4 }}>{selectedProgram.fullName}</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{selectedProgram.operator}</Text>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 16, paddingBottom: 40 }}>
            {/* Quick info */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Min. dotacja", value: `${selectedProgram.minGrant.toLocaleString("pl-PL")} zł`, color: "#4F46E5", bg: "#EEF2FF" },
                { label: "Max. dotacja", value: `${selectedProgram.maxGrant.toLocaleString("pl-PL")} zł`, color: "#16A34A", bg: "#F0FDF4" },
                { label: "Wkład własny", value: selectedProgram.cofinancing ? `${selectedProgram.cofinancingPct}%` : "Brak", color: "#D97706", bg: "#FEF9C3" },
              ].map((item) => (
                <View key={item.label} style={{ flex: 1, backgroundColor: item.bg, borderRadius: 12, padding: 10, alignItems: "center" }}>
                  <Text style={{ color: item.color, fontSize: 12, fontWeight: "800", textAlign: "center" }}>{item.value}</Text>
                  <Text style={{ color: item.color, fontSize: 9, marginTop: 2, textAlign: "center" }}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Criteria */}
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 14 }}>
              Kryteria oceny ({selectedProgram.criteria.length})
            </Text>
            {selectedProgram.criteria.map((criterion) => (
              <CriterionCard key={criterion.id} criterion={criterion} />
            ))}

            {/* Required documents */}
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 12, marginTop: 8 }}>Wymagane dokumenty</Text>
            <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }}>
              {selectedProgram.requiredDocuments.map((doc, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
                  <IconSymbol name="doc.fill" size={14} color="#1E3A5F" />
                  <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18, flex: 1 }}>{doc}</Text>
                </View>
              ))}
            </View>

            {/* Common mistakes */}
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 12 }}>Najczęstsze błędy</Text>
            <View style={{ backgroundColor: "#FFF1F2", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FECDD3" }}>
              {selectedProgram.commonMistakes.map((mistake, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
                  <Text style={{ color: "#DC2626", fontSize: 14 }}>✗</Text>
                  <Text style={{ color: "#7F1D1D", fontSize: 13, lineHeight: 18, flex: 1 }}>{mistake}</Text>
                </View>
              ))}
            </View>

            {/* Website link */}
            <View style={{ backgroundColor: "#EEF2FF", borderRadius: 14, padding: 14, marginTop: 16, borderWidth: 1, borderColor: "#C7D2FE" }}>
              <Text style={{ color: "#4F46E5", fontSize: 12, fontWeight: "700", marginBottom: 4 }}>Oficjalna strona programu</Text>
              <Text style={{ color: "#4F46E5", fontSize: 13 }}>{selectedProgram.website}</Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14, opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Dashboard</Text>
          </Pressable>
          <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginBottom: 6 }}>Wytyczne konkursowe</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 18 }}>
            Kryteria oceny, punktacja i wskazówki dla każdego programu. Kliknij program, aby zobaczyć szczegóły.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 20, paddingBottom: 40 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 14 }}>
            Dostępne programy ({COMPETITION_PROGRAMS.length})
          </Text>
          {COMPETITION_PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} onPress={() => setSelectedProgram(program)} />
          ))}

          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 14, padding: 14, marginTop: 8, borderWidth: 1, borderColor: "#FDE68A" }}>
            <Text style={{ color: "#92400E", fontSize: 13, fontWeight: "700", marginBottom: 6 }}>💡 Pro tip</Text>
            <Text style={{ color: "#92400E", fontSize: 13, lineHeight: 18 }}>
              Przed złożeniem wniosku zawsze sprawdź aktualny regulamin na stronie operatora — kryteria oceny mogą się zmieniać w każdej edycji konkursu.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
