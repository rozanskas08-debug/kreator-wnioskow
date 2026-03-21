import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { BUDGET_MODELS, BudgetItem } from "@/lib/data/modules-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

interface BudgetEntry {
  itemId: string;
  itemName: string;
  quantity: string;
  price: string;
  justification: string;
  unit: string;
  warningThreshold: number;
}

function BudgetItemRow({ item, onAdd }: { item: BudgetItem; onAdd: (item: BudgetItem) => void }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
      <Pressable onPress={() => { haptic(); setExpanded(!expanded); }} style={({ pressed }) => ({ padding: 12, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
              {item.minPrice.toLocaleString("pl-PL")} – {item.maxPrice.toLocaleString("pl-PL")} zł / {item.unit}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ color: "#4F46E5", fontSize: 11, fontWeight: "700" }}>~{item.typicalPrice.toLocaleString("pl-PL")} zł</Text>
            </View>
            <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={14} color={colors.muted} />
          </View>
        </View>
      </Pressable>
      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: 12, gap: 10 }}>
          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 8, padding: 10 }}>
            <Text style={{ color: "#92400E", fontSize: 12, lineHeight: 17 }}>💡 {item.notes}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1, backgroundColor: "#F0FDF4", borderRadius: 8, padding: 8, alignItems: "center" }}>
              <Text style={{ color: "#16A34A", fontSize: 11, fontWeight: "700" }}>Min</Text>
              <Text style={{ color: "#16A34A", fontSize: 13, fontWeight: "800" }}>{item.minPrice.toLocaleString("pl-PL")} zł</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#EEF2FF", borderRadius: 8, padding: 8, alignItems: "center" }}>
              <Text style={{ color: "#4F46E5", fontSize: 11, fontWeight: "700" }}>Typowe</Text>
              <Text style={{ color: "#4F46E5", fontSize: 13, fontWeight: "800" }}>{item.typicalPrice.toLocaleString("pl-PL")} zł</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#FFF1F2", borderRadius: 8, padding: 8, alignItems: "center" }}>
              <Text style={{ color: "#DC2626", fontSize: 11, fontWeight: "700" }}>Max</Text>
              <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "800" }}>{item.maxPrice.toLocaleString("pl-PL")} zł</Text>
            </View>
          </View>
          <Pressable onPress={() => { haptic(); onAdd(item); }} style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, opacity: pressed ? 0.8 : 1 })}>
            <IconSymbol name="plus.circle.fill" size={16} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>Dodaj do kalkulatora</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function BudgetModelsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"models" | "calculator">("models");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [beneficiaryCount, setBeneficiaryCount] = useState("");

  const addToBudget = (item: BudgetItem) => {
    haptic();
    const entry: BudgetEntry = {
      itemId: item.id + "_" + Date.now(),
      itemName: item.name,
      quantity: "1",
      price: String(item.typicalPrice),
      justification: "",
      unit: item.unit,
      warningThreshold: item.warningThreshold,
    };
    setBudgetEntries((prev) => [...prev, entry]);
    setActiveTab("calculator");
  };

  const updateEntry = (id: string, field: keyof BudgetEntry, value: string) => {
    setBudgetEntries((prev) => prev.map((e) => e.itemId === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id: string) => {
    haptic();
    setBudgetEntries((prev) => prev.filter((e) => e.itemId !== id));
  };

  const totalBudget = budgetEntries.reduce((sum, e) => {
    const qty = parseFloat(e.quantity) || 0;
    const price = parseFloat(e.price) || 0;
    return sum + qty * price;
  }, 0);

  const costPerBeneficiary = beneficiaryCount && parseInt(beneficiaryCount) > 0
    ? totalBudget / parseInt(beneficiaryCount)
    : 0;

  const warnings = budgetEntries.filter((e) => {
    const price = parseFloat(e.price) || 0;
    return price > e.warningThreshold;
  });

  const filteredCategories = selectedCategory
    ? BUDGET_MODELS.filter((c) => c.id === selectedCategory)
    : BUDGET_MODELS;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Dashboard</Text>
          </Pressable>
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>Modele budżetów</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Widełki cen, kalkulator i wykrywanie zawyżonych kosztów</Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingTop: 16, gap: 8, marginBottom: 4 }}>
          {[
            { id: "models", label: "Widełki cen" },
            { id: "calculator", label: `Kalkulator${budgetEntries.length > 0 ? ` (${budgetEntries.length})` : ""}` },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => { haptic(); setActiveTab(tab.id as any); }}
              style={({ pressed }) => ({ flex: 1, padding: 12, borderRadius: 12, backgroundColor: activeTab === tab.id ? "#1E3A5F" : colors.surface, borderWidth: 1, borderColor: activeTab === tab.id ? "#1E3A5F" : colors.border, alignItems: "center", opacity: pressed ? 0.8 : 1 })}
            >
              <Text style={{ color: activeTab === tab.id ? "#FFFFFF" : colors.muted, fontSize: 13, fontWeight: "700" }}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 12 }}>
          {/* MODELS TAB */}
          {activeTab === "models" && (
            <View style={{ gap: 4 }}>
              {/* Category filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
                <Pressable onPress={() => { haptic(); setSelectedCategory(null); }} style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: !selectedCategory ? "#1E3A5F" : colors.surface, borderWidth: 1, borderColor: !selectedCategory ? "#1E3A5F" : colors.border, opacity: pressed ? 0.8 : 1 })}>
                  <Text style={{ color: !selectedCategory ? "#FFFFFF" : colors.muted, fontSize: 12, fontWeight: "700" }}>Wszystkie</Text>
                </Pressable>
                {BUDGET_MODELS.map((cat) => (
                  <Pressable key={cat.id} onPress={() => { haptic(); setSelectedCategory(selectedCategory === cat.id ? null : cat.id); }} style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: selectedCategory === cat.id ? "#1E3A5F" : colors.surface, borderWidth: 1, borderColor: selectedCategory === cat.id ? "#1E3A5F" : colors.border, opacity: pressed ? 0.8 : 1 })}>
                    <Text style={{ color: selectedCategory === cat.id ? "#FFFFFF" : colors.muted, fontSize: 12, fontWeight: "700" }}>{cat.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {filteredCategories.map((category) => (
                <View key={category.id} style={{ marginBottom: 16 }}>
                  <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 10 }}>{category.name}</Text>
                  {category.items.map((item) => (
                    <BudgetItemRow key={item.id} item={item} onAdd={addToBudget} />
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* CALCULATOR TAB */}
          {activeTab === "calculator" && (
            <View style={{ gap: 14 }}>
              {/* Warnings */}
              {warnings.length > 0 && (
                <View style={{ backgroundColor: "#FFF1F2", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FECDD3" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 16 }}>⚠️</Text>
                    <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "800" }}>Zawyżone koszty — komisja może zakwestionować!</Text>
                  </View>
                  {warnings.map((w) => (
                    <Text key={w.itemId} style={{ color: "#7F1D1D", fontSize: 12, lineHeight: 17, marginBottom: 4 }}>
                      • {w.itemName}: {parseFloat(w.price).toLocaleString("pl-PL")} zł/{w.unit} (próg: {w.warningThreshold.toLocaleString("pl-PL")} zł)
                    </Text>
                  ))}
                </View>
              )}

              {/* Budget entries */}
              {budgetEntries.length === 0 ? (
                <View style={{ alignItems: "center", padding: 40 }}>
                  <IconSymbol name="cart.fill" size={48} color={colors.border} />
                  <Text style={{ color: colors.muted, fontSize: 14, marginTop: 12, textAlign: "center" }}>Brak pozycji w kalkulatorze.{"\n"}Przejdź do "Widełki cen" i dodaj pozycje.</Text>
                </View>
              ) : (
                budgetEntries.map((entry) => {
                  const total = (parseFloat(entry.quantity) || 0) * (parseFloat(entry.price) || 0);
                  const isWarning = parseFloat(entry.price) > entry.warningThreshold;
                  return (
                    <View key={entry.itemId} style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: isWarning ? "#FECDD3" : colors.border }}>
                      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", flex: 1 }}>{entry.itemName}</Text>
                        <Pressable onPress={() => removeEntry(entry.itemId)}>
                          <IconSymbol name="trash.fill" size={16} color="#DC2626" />
                        </Pressable>
                      </View>
                      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Ilość ({entry.unit})</Text>
                          <TextInput value={entry.quantity} onChangeText={(v) => updateEntry(entry.itemId, "quantity", v)} keyboardType="numeric" style={{ backgroundColor: colors.background, borderRadius: 8, padding: 10, color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border }} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Cena (zł/{entry.unit})</Text>
                          <TextInput value={entry.price} onChangeText={(v) => updateEntry(entry.itemId, "price", v)} keyboardType="numeric" style={{ backgroundColor: colors.background, borderRadius: 8, padding: 10, color: isWarning ? "#DC2626" : colors.foreground, fontSize: 14, borderWidth: 1, borderColor: isWarning ? "#FECDD3" : colors.border }} />
                        </View>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 4 }}>
                          <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Łącznie</Text>
                          <Text style={{ color: "#1E3A5F", fontSize: 15, fontWeight: "800" }}>{total.toLocaleString("pl-PL")} zł</Text>
                        </View>
                      </View>
                      <TextInput value={entry.justification} onChangeText={(v) => updateEntry(entry.itemId, "justification", v)} placeholder="Uzasadnienie pozycji budżetowej..." placeholderTextColor={colors.muted} style={{ backgroundColor: colors.background, borderRadius: 8, padding: 10, color: colors.foreground, fontSize: 13, borderWidth: 1, borderColor: colors.border }} />
                      {isWarning && <Text style={{ color: "#DC2626", fontSize: 11, marginTop: 6 }}>⚠️ Cena powyżej progu rynkowego — dodaj uzasadnienie!</Text>}
                    </View>
                  );
                })
              )}

              {/* Summary */}
              {budgetEntries.length > 0 && (
                <View style={{ backgroundColor: "#1E3A5F", borderRadius: 16, padding: 16, gap: 12 }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "800" }}>Podsumowanie budżetu</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>Łączna kwota:</Text>
                    <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>{totalBudget.toLocaleString("pl-PL")} zł</Text>
                  </View>
                  <View>
                    <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 6 }}>Liczba beneficjentów (do kalkulacji kosztu/os.):</Text>
                    <TextInput value={beneficiaryCount} onChangeText={setBeneficiaryCount} keyboardType="numeric" placeholder="np. 50" placeholderTextColor="rgba(255,255,255,0.4)" style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, color: "#FFFFFF", fontSize: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
                  </View>
                  {costPerBeneficiary > 0 && (
                    <View style={{ backgroundColor: costPerBeneficiary > 5000 ? "#DC2626" : "#16A34A", borderRadius: 10, padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>Koszt na 1 beneficjenta:</Text>
                      <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "900" }}>{Math.round(costPerBeneficiary).toLocaleString("pl-PL")} zł</Text>
                    </View>
                  )}
                  {costPerBeneficiary > 5000 && (
                    <Text style={{ color: "#FCA5A5", fontSize: 12 }}>⚠️ Wysoki koszt na beneficjenta może budzić wątpliwości komisji. Rozważ zwiększenie liczby uczestników lub zmniejszenie budżetu.</Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
