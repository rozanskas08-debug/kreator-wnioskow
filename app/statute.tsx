import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { STATUTE_SECTIONS } from "@/lib/data/foundation-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export default function StatuteScreen() {
  const colors = useColors();
  const [expandedId, setExpandedId] = useState<string | null>(STATUTE_SECTIONS[0]?.id ?? null);

  const requiredSections = STATUTE_SECTIONS.filter((s) => s.required);
  const optionalSections = STATUTE_SECTIONS.filter((s) => !s.required);

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: "Przewodnik po Statucie",
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Intro */}
        <View style={{ backgroundColor: "#E07B1A", paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20 }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", lineHeight: 30, marginBottom: 8 }}>
            Jak napisać statut fundacji?
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, lineHeight: 20 }}>
            Statut to najważniejszy dokument fundacji — jej "konstytucja". Określa cele, zasady działania i strukturę organizacji. Możesz go napisać samodzielnie.
          </Text>
          <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{requiredSections.length} obowiązkowych</Text>
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{optionalSections.length} opcjonalnych</Text>
            </View>
          </View>
        </View>

        {/* Key info */}
        <View style={{ marginHorizontal: 16, marginTop: -14 }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 8 }}>Podstawa prawna:</Text>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
              Art. 5 Ustawy o fundacjach z dnia 6 kwietnia 1984 r. — określa obowiązkowe elementy statutu fundacji.
            </Text>
          </View>
        </View>

        {/* Required sections */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#E07B1A", marginRight: 8 }} />
            <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>
              Elementy obowiązkowe
            </Text>
            <View style={{ backgroundColor: "#FEF3E8", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 }}>
              <Text style={{ color: "#E07B1A", fontSize: 10, fontWeight: "700" }}>WYMAGANE</Text>
            </View>
          </View>

          {requiredSections.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={{ marginBottom: 10 }}>
                <Pressable
                  onPress={() => { haptic(); setExpandedId(isExpanded ? null : section.id); }}
                  style={({ pressed }) => ({
                    backgroundColor: isExpanded ? "#FEF3E8" : colors.surface,
                    borderRadius: 14, padding: 14,
                    borderWidth: 1.5,
                    borderColor: isExpanded ? "#E07B1A" : colors.border,
                    opacity: pressed ? 0.88 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FEF3E8", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                      <IconSymbol name="doc.text.fill" size={18} color="#E07B1A" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{section.title}</Text>
                    </View>
                    <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                  </View>

                  {isExpanded && (
                    <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E07B1A30" }}>
                      <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 20, marginBottom: 12 }}>
                        {section.description}
                      </Text>

                      {section.example && (
                        <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E07B1A33" }}>
                          <Text style={{ color: "#E07B1A", fontSize: 10, fontWeight: "700", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Przykładowe brzmienie:</Text>
                          <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, fontStyle: "italic" }}>
                            "{section.example}"
                          </Text>
                        </View>
                      )}

                      {section.tips.length > 0 && (
                        <View>
                          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>Wskazówki:</Text>
                          {section.tips.map((tip, i) => (
                            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 6 }}>
                              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#E07B1A", marginTop: 6, marginRight: 8, flexShrink: 0 }} />
                              <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, flex: 1 }}>{tip}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Optional sections */}
        {optionalSections.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#22A45D", marginRight: 8 }} />
              <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>
                Elementy opcjonalne
              </Text>
              <View style={{ backgroundColor: "#E8F7EF", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 }}>
                <Text style={{ color: "#22A45D", fontSize: 10, fontWeight: "700" }}>ZALECANE</Text>
              </View>
            </View>

            {optionalSections.map((section) => {
              const isExpanded = expandedId === section.id;
              return (
                <View key={section.id} style={{ marginBottom: 10 }}>
                  <Pressable
                    onPress={() => { haptic(); setExpandedId(isExpanded ? null : section.id); }}
                    style={({ pressed }) => ({
                      backgroundColor: isExpanded ? "#E8F7EF" : colors.surface,
                      borderRadius: 14, padding: 14,
                      borderWidth: 1.5,
                      borderColor: isExpanded ? "#22A45D" : colors.border,
                      opacity: pressed ? 0.88 : 1,
                    })}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F7EF", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <IconSymbol name="doc.text.fill" size={18} color="#22A45D" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{section.title}</Text>
                      </View>
                      <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                    </View>

                    {isExpanded && (
                      <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#22A45D30" }}>
                        <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 20, marginBottom: 12 }}>
                          {section.description}
                        </Text>
                        {section.example && (
                          <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#22A45D33" }}>
                            <Text style={{ color: "#22A45D", fontSize: 10, fontWeight: "700", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Przykładowe brzmienie:</Text>
                            <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, fontStyle: "italic" }}>
                              "{section.example}"
                            </Text>
                          </View>
                        )}
                        {section.tips.length > 0 && (
                          <View>
                            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>Wskazówki:</Text>
                            {section.tips.map((tip, i) => (
                              <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 6 }}>
                                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#22A45D", marginTop: 6, marginRight: 8, flexShrink: 0 }} />
                                <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, flex: 1 }}>{tip}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        {/* Final note */}
        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
          <View style={{ backgroundColor: "#E8F0FB", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#1A5FA822" }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <IconSymbol name="lightbulb.fill" size={16} color="#1A5FA8" />
              <Text style={{ color: "#1A5FA8", fontSize: 13, fontWeight: "700", marginLeft: 8 }}>Porada eksperta</Text>
            </View>
            <Text style={{ color: "#1A5FA8", fontSize: 12, lineHeight: 18 }}>
              Statut nie musi być napisany przez prawnika — możesz go napisać samodzielnie, korzystając z wzorców dostępnych na poradnik.ngo.pl. Ważne, żeby zawierał wszystkie obowiązkowe elementy i był spójny wewnętrznie.
            </Text>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
