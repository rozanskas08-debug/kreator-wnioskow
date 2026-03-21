import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Alert, Platform, Share } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { FRAGMENT_LIBRARY, TextFragment, FragmentCategory } from "@/lib/data/modules-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const CATEGORY_CONFIG: Record<FragmentCategory, { label: string; color: string; bg: string; icon: string }> = {
  problem: { label: "Problem", color: "#DC2626", bg: "#FFF1F2", icon: "exclamationmark.triangle.fill" },
  target_group: { label: "Grupa docelowa", color: "#7C3AED", bg: "#F5F3FF", icon: "person.2.fill" },
  goal: { label: "Cel projektu", color: "#1E3A5F", bg: "#EEF2FF", icon: "target" },
  activity: { label: "Działania", color: "#0369A1", bg: "#E0F2FE", icon: "list.bullet" },
  result_hard: { label: "Rezultaty twarde", color: "#16A34A", bg: "#F0FDF4", icon: "chart.bar.fill" },
  result_soft: { label: "Rezultaty miękkie", color: "#0891B2", bg: "#ECFEFF", icon: "heart.fill" },
  kpi: { label: "Wskaźniki (KPI)", color: "#D97706", bg: "#FEF9C3", icon: "chart.line.uptrend.xyaxis" },
  justification: { label: "Uzasadnienie", color: "#6B7280", bg: "#F9FAFB", icon: "doc.text.fill" },
};

const CATEGORIES: FragmentCategory[] = ["problem", "target_group", "goal", "activity", "result_hard", "result_soft", "kpi"];

function FragmentCard({ fragment, onCopy }: { fragment: TextFragment; onCopy: () => void }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[fragment.category];

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
      <Pressable
        onPress={() => { haptic(); setExpanded(!expanded); }}
        style={({ pressed }) => ({ padding: 14, opacity: pressed ? 0.85 : 1 })}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: cfg.bg, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconSymbol name={cfg.icon as any} size={18} color={cfg.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 4 }}>{fragment.title}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 17 }} numberOfLines={expanded ? undefined : 2}>
              {fragment.text}
            </Text>
          </View>
          <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={14} color={colors.muted} />
        </View>
      </Pressable>

      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: 14 }}>
          <View style={{ backgroundColor: colors.background, borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 20 }}>{fragment.text}</Text>
          </View>

          {/* Tags */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {fragment.tags.map((tag) => (
              <View key={tag} style={{ backgroundColor: cfg.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: cfg.color, fontSize: 11, fontWeight: "600" }}>#{tag}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={onCopy}
            style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 10, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, opacity: pressed ? 0.8 : 1 })}
          >
            <IconSymbol name="doc.on.doc.fill" size={16} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>Kopiuj fragment</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function FragmentLibraryScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<FragmentCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFragments = FRAGMENT_LIBRARY.filter((f) => {
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = async (fragment: TextFragment) => {
    haptic();
    try {
      await Share.share({ message: fragment.text, title: fragment.title });
    } catch {
      Alert.alert("Skopiowano!", "Fragment został skopiowany do schowka.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Sticky Header */}
        <View style={{ backgroundColor: colors.background, paddingBottom: 8 }}>
          <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
            <Pressable onPress={() => router.back()} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, opacity: pressed ? 0.7 : 1 })}>
              <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Dashboard</Text>
            </Pressable>
            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>Biblioteka fragmentów</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Gotowe teksty do wklejenia do wniosku</Text>
          </View>

          {/* Search */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
              <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Szukaj fragmentów..."
                placeholderTextColor={colors.muted}
                style={{ flex: 1, color: colors.foreground, fontSize: 14 }}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery("")}>
                  <IconSymbol name="xmark.circle.fill" size={16} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Category filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
            <Pressable
              onPress={() => { haptic(); setSelectedCategory(null); }}
              style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: !selectedCategory ? "#1E3A5F" : colors.surface, borderWidth: 1, borderColor: !selectedCategory ? "#1E3A5F" : colors.border, opacity: pressed ? 0.8 : 1 })}
            >
              <Text style={{ color: !selectedCategory ? "#FFFFFF" : colors.muted, fontSize: 12, fontWeight: "700" }}>Wszystkie ({FRAGMENT_LIBRARY.length})</Text>
            </Pressable>
            {CATEGORIES.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const count = FRAGMENT_LIBRARY.filter((f) => f.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => { haptic(); setSelectedCategory(isSelected ? null : cat); }}
                  style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: isSelected ? cfg.color : colors.surface, borderWidth: 1, borderColor: isSelected ? cfg.color : colors.border, opacity: pressed ? 0.8 : 1 })}
                >
                  <Text style={{ color: isSelected ? "#FFFFFF" : cfg.color, fontSize: 12, fontWeight: "700" }}>{cfg.label} ({count})</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Fragments */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          {filteredFragments.length === 0 ? (
            <View style={{ alignItems: "center", padding: 40 }}>
              <IconSymbol name="doc.text.fill" size={48} color={colors.border} />
              <Text style={{ color: colors.muted, fontSize: 14, marginTop: 12, textAlign: "center" }}>Brak fragmentów dla wybranych filtrów</Text>
            </View>
          ) : (
            <>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 12 }}>
                {filteredFragments.length} fragment{filteredFragments.length === 1 ? "" : "ów"}
              </Text>
              {filteredFragments.map((fragment) => (
                <FragmentCard key={fragment.id} fragment={fragment} onCopy={() => handleCopy(fragment)} />
              ))}
            </>
          )}

          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 14, padding: 14, marginTop: 8, borderWidth: 1, borderColor: "#FDE68A" }}>
            <Text style={{ color: "#92400E", fontSize: 13, fontWeight: "700", marginBottom: 6 }}>💡 Jak używać biblioteki</Text>
            <Text style={{ color: "#92400E", fontSize: 13, lineHeight: 18 }}>
              Fragmenty zawierają miejsca do uzupełnienia oznaczone [nawiasami]. Skopiuj fragment, wklej do wniosku i zastąp [WARTOŚCI] konkretnymi danymi klienta.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
