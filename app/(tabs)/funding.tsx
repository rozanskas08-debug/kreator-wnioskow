import { useState } from "react";
import { FlatList, Linking, Pressable, ScrollView, Text, View, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { FUNDING_SOURCES, FUNDING_CATEGORIES, FundingSource } from "@/lib/data/grant-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const CATEGORY_COLORS: Record<string, string> = {
  ngo_national: "#7C3AED",
  eu: "#1D4ED8",
  corporate: "#D97706",
  business: "#059669",
  international: "#DC2626",
  other: "#6B7280",
};

function FundingCard({ source }: { source: FundingSource }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[source.category] ?? "#1E3A5F";
  const catLabel = FUNDING_CATEGORIES.find((c) => c.id === source.category)?.label ?? source.category;

  return (
    <Pressable
      onPress={() => { haptic(); setExpanded((v) => !v); }}
      style={({ pressed }) => ({
        backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 10,
        borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", lineHeight: 20 }}>{source.name}</Text>
        </View>
        <View style={{ backgroundColor: catColor + "22", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
          <Text style={{ color: catColor, fontSize: 10, fontWeight: "800" }}>{catLabel.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }} numberOfLines={expanded ? undefined : 2}>
        {source.description}
      </Text>

      {expanded && (
        <View style={{ marginTop: 12, gap: 8 }}>
          {source.examples ? (
            <View style={{ backgroundColor: colors.background, borderRadius: 8, padding: 10 }}>
              <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700", marginBottom: 4 }}>Przykładowe programy:</Text>
              <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>{source.examples}</Text>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <IconSymbol name="building.2.fill" size={13} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              Dla: {source.applicantTypes.map((t) => t === "ngo" ? "NGO" : t === "business" ? "Firma" : "Instytucja").join(", ")}
            </Text>
          </View>
          <Pressable
            onPress={() => { haptic(); Linking.openURL(source.url); }}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 6,
              backgroundColor: "#1E3A5F", paddingHorizontal: 14, paddingVertical: 8,
              borderRadius: 10, alignSelf: "flex-start", opacity: pressed ? 0.8 : 1,
            })}
          >
            <IconSymbol name="arrow.up.right" size={14} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>Otwórz stronę</Text>
          </Pressable>
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 8, gap: 4 }}>
        <Text style={{ color: colors.muted, fontSize: 11 }}>{expanded ? "Zwiń" : "Rozwiń szczegóły"}</Text>
        <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={14} color={colors.muted} />
      </View>
    </Pressable>
  );
}

export default function FundingScreen() {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? FUNDING_SOURCES
    : FUNDING_SOURCES.filter((s) => s.category === activeCategory);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Źródła finansowania</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 12 }}>Baza Dotacji</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "Wszystkie", value: FUNDING_SOURCES.length, color: "#FFFFFF" },
            { label: "NGO", value: FUNDING_SOURCES.filter((s) => s.applicantTypes.includes("ngo")).length, color: "#86EFAC" },
            { label: "Firmy", value: FUNDING_SOURCES.filter((s) => s.applicantTypes.includes("business")).length, color: "#FCD34D" },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 10, alignItems: "center" }}>
              <Text style={{ color: s.color, fontSize: 22, fontWeight: "800" }}>{s.value}</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "600", marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 12, paddingHorizontal: 16, maxHeight: 52 }}>
        {[{ id: "all", label: "Wszystkie" }, ...FUNDING_CATEGORIES.filter((c) => c.id !== "all")].map((cat) => (
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
        renderItem={({ item }) => <FundingCard source={item} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 40 }}>
            <IconSymbol name="banknote.fill" size={48} color={colors.border} />
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginTop: 16 }}>Brak wyników</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
