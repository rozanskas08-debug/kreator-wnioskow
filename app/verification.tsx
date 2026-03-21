import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { VERIFICATION_SECTIONS, getVerificationScore } from "@/lib/data/verification-data";
import type { VerificationSection } from "@/lib/data/client-types";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export default function VerificationScreen() {
  const colors = useColors();
  const router = useRouter();
  const [sections, setSections] = useState<VerificationSection[]>(
    VERIFICATION_SECTIONS.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })),
  );
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.id ?? null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (sectionId: string, itemId: string) => {
    haptic();
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((i) => i.id === itemId ? { ...i, checked: !i.checked } : i) }
          : s,
      ),
    );
  };

  const resetAll = () => {
    haptic();
    setSections(VERIFICATION_SECTIONS.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, checked: false })) })));
  };

  const score = getVerificationScore(sections);

  return (
    <ScreenContainer>
      <View style={{ backgroundColor: "#1A5FA8", paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" }}>Narzedzie konsultanta</Text>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Weryfikacja Dokumentow</Text>
          </View>
          <Pressable onPress={resetAll} style={({ pressed }) => ({ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, opacity: pressed ? 0.7 : 1 })}>
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>Resetuj</Text>
          </Pressable>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{score.checked}/{score.total}</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "600" }}>Wszystkich</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{score.requiredChecked}/{score.required}</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "600" }}>Wymaganych</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: score.pct === 100 ? "#4ADE80" : "#fff", fontSize: 22, fontWeight: "800" }}>{score.pct}%</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "600" }}>Ukonczone</Text>
            </View>
          </View>
          <View style={{ height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 3 }}>
            <View style={{ height: 6, width: `${score.pct}%` as any, backgroundColor: score.pct === 100 ? "#4ADE80" : "#fff", borderRadius: 3 }} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {score.requiredChecked === score.required && score.required > 0 ? (
          <View style={{ backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <IconSymbol name="checkmark.seal.fill" size={22} color="#22A45D" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#22A45D", fontSize: 14, fontWeight: "800" }}>Wszystkie wymagane elementy OK!</Text>
              <Text style={{ color: "#22A45D", fontSize: 12, marginTop: 2 }}>Dokumentacja jest kompletna i gotowa do zlozenia.</Text>
            </View>
          </View>
        ) : score.checked > 0 ? (
          <View style={{ backgroundColor: "#FEF3E8", borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <IconSymbol name="exclamationmark.triangle.fill" size={22} color="#E07B1A" />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#E07B1A", fontSize: 14, fontWeight: "800" }}>Weryfikacja w toku</Text>
              <Text style={{ color: "#E07B1A", fontSize: 12, marginTop: 2 }}>Brakuje {score.required - score.requiredChecked} wymaganych elementow.</Text>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>
              Zaznaczaj kolejne punkty podczas weryfikacji dokumentow klienta. Dotknij ikone "i" aby zobaczyc szczegoly i przyklad.
            </Text>
          </View>
        )}

        {sections.map((section) => {
          const sectionChecked = section.items.filter((i) => i.checked).length;
          const sectionRequired = section.items.filter((i) => i.required).length;
          const sectionRequiredChecked = section.items.filter((i) => i.required && i.checked).length;
          const isExpanded = expandedSection === section.id;
          const allRequiredDone = sectionRequiredChecked === sectionRequired;

          return (
            <View key={section.id} style={{ marginBottom: 12 }}>
              <Pressable
                onPress={() => { haptic(); setExpandedSection(isExpanded ? null : section.id); }}
                style={({ pressed }) => ({
                  backgroundColor: colors.surface, borderRadius: 14, padding: 14,
                  borderWidth: 1.5, borderColor: allRequiredDone && sectionRequired > 0 ? "#22A45D66" : colors.border,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: section.color + "22", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <IconSymbol name={section.icon as any} size={20} color={allRequiredDone && sectionRequired > 0 ? "#22A45D" : section.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{section.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{section.subtitle}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", marginRight: 8 }}>
                    <Text style={{ color: allRequiredDone && sectionRequired > 0 ? "#22A45D" : section.color, fontSize: 13, fontWeight: "800" }}>{sectionChecked}/{section.items.length}</Text>
                    <Text style={{ color: colors.muted, fontSize: 9, fontWeight: "600" }}>wym: {sectionRequiredChecked}/{sectionRequired}</Text>
                  </View>
                  <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                </View>
                <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 10 }}>
                  <View style={{ height: 4, width: `${section.items.length > 0 ? (sectionChecked / section.items.length) * 100 : 0}%` as any, backgroundColor: allRequiredDone && sectionRequired > 0 ? "#22A45D" : section.color, borderRadius: 2 }} />
                </View>
              </Pressable>

              {isExpanded && (
                <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginTop: 4, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
                  {section.items.map((item, idx) => {
                    const isItemExpanded = expandedItem === item.id;
                    return (
                      <View key={item.id} style={{ borderBottomWidth: idx < section.items.length - 1 ? 0.5 : 0, borderBottomColor: colors.border }}>
                        <Pressable
                          onPress={() => toggleItem(section.id, item.id)}
                          style={({ pressed }) => ({
                            flexDirection: "row", alignItems: "flex-start", padding: 12,
                            backgroundColor: item.checked ? section.color + "0D" : "transparent",
                            opacity: pressed ? 0.8 : 1,
                          })}
                        >
                          <View style={{
                            width: 22, height: 22, borderRadius: 6, marginRight: 10, marginTop: 1,
                            backgroundColor: item.checked ? section.color : "transparent",
                            borderWidth: item.checked ? 0 : 2, borderColor: item.required ? section.color : colors.border,
                            alignItems: "center", justifyContent: "center",
                          }}>
                            {item.checked && <IconSymbol name="checkmark" size={12} color="#fff" />}
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <Text style={{ color: item.checked ? colors.muted : colors.foreground, fontSize: 13, fontWeight: "600", flex: 1, textDecorationLine: item.checked ? "line-through" : "none" }}>
                                {item.label}
                              </Text>
                              {item.required && (
                                <View style={{ backgroundColor: item.checked ? "#ECFDF5" : "#FEF3E8", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                                  <Text style={{ color: item.checked ? "#22A45D" : "#E07B1A", fontSize: 9, fontWeight: "700" }}>WYM.</Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <Pressable onPress={(e) => { e.stopPropagation(); haptic(); setExpandedItem(isItemExpanded ? null : item.id); }} style={{ padding: 4 }}>
                            <IconSymbol name="info.circle" size={16} color={colors.muted} />
                          </Pressable>
                        </Pressable>
                        {isItemExpanded && (
                          <View style={{ backgroundColor: colors.background, padding: 12, paddingTop: 4 }}>
                            <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, marginBottom: 6 }}>{item.description}</Text>
                            {item.example && (
                              <View style={{ backgroundColor: section.color + "11", borderRadius: 8, padding: 8 }}>
                                <Text style={{ color: section.color, fontSize: 11, fontWeight: "700", marginBottom: 2 }}>PRZYKLAD:</Text>
                                <Text style={{ color: colors.foreground, fontSize: 11, lineHeight: 17 }}>{item.example}</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}
