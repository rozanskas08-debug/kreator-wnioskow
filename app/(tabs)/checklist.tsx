import { useCallback, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CONTROL_CHECKLIST } from "@/lib/data/grant-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const CATEGORIES = [
  { id: "all", label: "Wszystkie" },
  { id: "merit", label: "Merytoryczne" },
  { id: "budget", label: "Budżet" },
  { id: "formal", label: "Formalne" },
  { id: "peer", label: "Peer review" },
];

export default function ChecklistScreen() {
  const colors = useColors();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleItem = useCallback((id: string) => {
    haptic();
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const filtered = activeCategory === "all"
    ? CONTROL_CHECKLIST
    : CONTROL_CHECKLIST.filter((item) => item.category === activeCategory);

  const total = CONTROL_CHECKLIST.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>Weryfikacja wniosku</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>Lista Kontrolna</Text>
          </View>
          <Pressable
            onPress={() => { haptic(); setChecked({}); }}
            style={({ pressed }) => ({ backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, opacity: pressed ? 0.7 : 1 })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>Resetuj</Text>
          </Pressable>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Postęp weryfikacji</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>{done}/{total} ({pct}%)</Text>
          </View>
          <View style={{ height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
            <View style={{ height: 6, backgroundColor: pct >= 80 ? "#86EFAC" : pct >= 50 ? "#FCD34D" : "#FCA5A5", borderRadius: 3, width: `${pct}%` as any }} />
          </View>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 6 }}>
            {pct >= 80 ? "✅ Wniosek gotowy do złożenia" : pct >= 50 ? "⚠️ Wymaga uzupełnienia" : "❌ Wniosek niekompletny"}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 12, paddingHorizontal: 16, maxHeight: 52 }}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => { haptic(); setActiveCategory(cat.id); }}
            style={({ pressed }) => ({
              paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8,
              backgroundColor: activeCategory === cat.id ? "#1E3A5F" : colors.surface,
              borderWidth: 1, borderColor: activeCategory === cat.id ? "#1E3A5F" : colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: activeCategory === cat.id ? "#FFFFFF" : colors.muted, fontSize: 12, fontWeight: "600" }}>{cat.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const isChecked = !!checked[item.id];
          return (
            <Pressable
              onPress={() => toggleItem(item.id)}
              style={({ pressed }) => ({
                flexDirection: "row", alignItems: "flex-start",
                backgroundColor: isChecked ? "#F0FDF4" : colors.surface,
                borderRadius: 12, padding: 14, marginBottom: 8,
                borderWidth: 1, borderColor: isChecked ? "#86EFAC" : colors.border,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View style={{
                width: 24, height: 24, borderRadius: 12, borderWidth: 2,
                borderColor: isChecked ? "#16A34A" : colors.border,
                backgroundColor: isChecked ? "#16A34A" : "transparent",
                alignItems: "center", justifyContent: "center",
                marginRight: 12, marginTop: 1, flexShrink: 0,
              }}>
                {isChecked && <IconSymbol name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: isChecked ? "#16A34A" : colors.foreground,
                  fontSize: 14, fontWeight: "600", lineHeight: 20,
                  textDecorationLine: isChecked ? "line-through" : "none",
                  marginBottom: 4,
                }}>
                  {item.question}
                </Text>
                {item.hint ? (
                  <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 17, marginBottom: 6 }}>{item.hint}</Text>
                ) : null}
                <View style={{
                  alignSelf: "flex-start",
                  paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
                  backgroundColor: item.required === true && item.category === "merit" ? "#FEE2E2" : item.required === true ? "#FEF9C3" : "#F0F9FF",
                }}>
                  <Text style={{
                    fontSize: 10, fontWeight: "700",
                    color: item.required === true && item.category === "merit" ? "#DC2626" : item.required === true ? "#D97706" : "#0369A1",
                  }}>
                    {item.required === true && item.category === "merit" ? "KRYTYCZNE" : item.required === true ? "WAŻNE" : "ZALECANE"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </ScreenContainer>
  );
}
