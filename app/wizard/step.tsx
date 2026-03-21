import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { FOUNDATION_WIZARD_STEPS } from "@/lib/data/foundation-data";
import { getRegistrationById, saveRegistration, getStepCompletionRate, getRequiredItemsForStep } from "@/lib/storage";

function haptic(type?: string) {
  if (Platform.OS === "web") return;
  if (type === "success") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (type === "error") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export default function WizardStepScreen() {
  const colors = useColors();
  const router = useRouter();
  const { registrationId } = useLocalSearchParams<{ registrationId: string }>();
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTips, setShowTips] = useState(false);

  const loadRegistration = useCallback(async () => {
    if (!registrationId) return;
    const reg = await getRegistrationById(registrationId as string);
    setRegistration(reg);
    setLoading(false);
  }, [registrationId]);

  useEffect(() => { loadRegistration(); }, [loadRegistration]);

  if (loading || !registration) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>Ładowanie...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const currentStepIndex = Math.min(registration.currentStep, FOUNDATION_WIZARD_STEPS.length - 1);
  const step = FOUNDATION_WIZARD_STEPS[currentStepIndex];
  const checkedItems: string[] = registration.checkedItems[step.id] ?? [];
  const totalItems = step.checklist.length;
  const requiredIds = step.checklist.filter((c: any) => c.required).map((c: any) => c.id);
  const completionRate = getStepCompletionRate(registration, step.id, totalItems);
  const { missing: missingRequired } = getRequiredItemsForStep(registration, step.id, requiredIds);
  const allRequiredChecked = missingRequired.length === 0;
  const isLastStep = currentStepIndex === FOUNDATION_WIZARD_STEPS.length - 1;
  const isComplete = registration.currentStep >= FOUNDATION_WIZARD_STEPS.length;

  const toggleItem = async (itemId: string) => {
    haptic();
    const current: string[] = registration.checkedItems[step.id] ?? [];
    const updated = current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId];
    const updatedReg = { ...registration, checkedItems: { ...registration.checkedItems, [step.id]: updated }, updatedAt: new Date().toISOString() };
    setRegistration(updatedReg);
    await saveRegistration(updatedReg);
  };

  const handleNextStep = async () => {
    if (!allRequiredChecked) {
      haptic("error");
      Alert.alert("Brakuje wymaganych elementów", `Zaznacz wszystkie obowiązkowe pozycje (${missingRequired.length} pozostało).`, [{ text: "OK" }]);
      return;
    }
    haptic("success");
    const updatedReg = { ...registration, currentStep: currentStepIndex + 1, updatedAt: new Date().toISOString() };
    setRegistration(updatedReg);
    await saveRegistration(updatedReg);
  };

  const handlePrevStep = async () => {
    if (currentStepIndex === 0) { router.back(); return; }
    haptic();
    const updatedReg = { ...registration, currentStep: currentStepIndex - 1, updatedAt: new Date().toISOString() };
    setRegistration(updatedReg);
    await saveRegistration(updatedReg);
  };

  if (isComplete) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: "Ukończono!", headerShown: true }} />
        <ScrollView contentContainerStyle={{ padding: 24, alignItems: "center" }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#E8F7EF", alignItems: "center", justifyContent: "center", marginBottom: 20, marginTop: 20 }}>
            <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
          </View>
          <Text style={{ color: colors.foreground, fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 8 }}>Gratulacje!</Text>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>{registration.name}</Text>
          <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 32 }}>
            Ukończyłeś/aś wszystkie kroki procesu rejestracji fundacji. Twoja fundacja powinna być teraz zarejestrowana w KRS!
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, width: "100%", borderWidth: 1, borderColor: colors.border, marginBottom: 20 }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>Pamiętaj o dalszych krokach:</Text>
            {["Zgłoś beneficjentów do CRBR (14 dni od rejestracji)", "Złóż formularz NIP-8 do urzędu skarbowego (21 dni)", "Otwórz konto bankowe dla fundacji", "Przekaż fundusz założycielski na konto fundacji", "Zadbaj o prowadzenie księgowości"].map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#E8F7EF", alignItems: "center", justifyContent: "center", marginRight: 10, marginTop: 1 }}>
                  <Text style={{ color: colors.success, fontSize: 10, fontWeight: "800" }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, color: colors.foreground, fontSize: 13, lineHeight: 19 }}>{item}</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={() => router.push("/")} style={({ pressed }) => ({ backgroundColor: "#E07B1A", borderRadius: 14, padding: 16, width: "100%", alignItems: "center", opacity: pressed ? 0.85 : 1 })}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Wróć do strony głównej</Text>
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: `Krok ${step.stepNumber}/${FOUNDATION_WIZARD_STEPS.length}`, headerShown: true, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.foreground }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600" }}>KROK {step.stepNumber} Z {FOUNDATION_WIZARD_STEPS.length}</Text>
            <Text style={{ color: colors.muted, fontSize: 11 }}>{completionRate}% ukończone</Text>
          </View>
          <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
            <View style={{ height: 6, width: `${(currentStepIndex / FOUNDATION_WIZARD_STEPS.length) * 100}%` as any, backgroundColor: step.color, borderRadius: 3 }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            {FOUNDATION_WIZARD_STEPS.map((s, i) => {
              const isDone = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <View key={s.id} style={{ alignItems: "center" }}>
                  <View style={{ width: isCurrent ? 28 : 20, height: isCurrent ? 28 : 20, borderRadius: isCurrent ? 14 : 10, backgroundColor: isDone ? colors.success : isCurrent ? step.color : colors.border, alignItems: "center", justifyContent: "center" }}>
                    {isDone ? <IconSymbol name="checkmark" size={10} color="#fff" /> : <Text style={{ color: isCurrent ? "#fff" : colors.muted, fontSize: isCurrent ? 11 : 9, fontWeight: "700" }}>{s.stepNumber}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 20, backgroundColor: step.color + "15", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: step.color + "33" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: step.color + "25", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <IconSymbol name={step.icon as any} size={24} color={step.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: step.color, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>Krok {step.stepNumber}</Text>
              <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>{step.title}</Text>
            </View>
          </View>
          <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 20 }}>{step.description}</Text>
          <View style={{ flexDirection: "row", marginTop: 12, gap: 8, flexWrap: "wrap" }}>
            {step.estimatedCost && (
              <View style={{ backgroundColor: "#FEF3E8", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="banknote.fill" size={12} color="#E07B1A" />
                <Text style={{ color: "#E07B1A", fontSize: 11, fontWeight: "700", marginLeft: 4 }}>{step.estimatedCost}</Text>
              </View>
            )}
            {step.estimatedTime && (
              <View style={{ backgroundColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="clock.fill" size={12} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600", marginLeft: 4 }}>{step.estimatedTime}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800" }}>Lista kontrolna</Text>
            <View style={{ backgroundColor: allRequiredChecked ? "#E8F7EF" : "#FEF3E8", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ color: allRequiredChecked ? colors.success : "#E07B1A", fontSize: 11, fontWeight: "700" }}>{checkedItems.length}/{totalItems} zaznaczono</Text>
            </View>
          </View>
          {step.checklist.map((item: any) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <Pressable key={item.id} onPress={() => toggleItem(item.id)} style={({ pressed }) => ({ backgroundColor: isChecked ? (colors.success + "12") : colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "flex-start", borderWidth: 1.5, borderColor: isChecked ? colors.success : colors.border, opacity: pressed ? 0.82 : 1 })}>
                <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: isChecked ? colors.success : colors.background, borderWidth: isChecked ? 0 : 2, borderColor: isChecked ? "transparent" : (item.required ? step.color : colors.border), alignItems: "center", justifyContent: "center", marginRight: 12, flexShrink: 0, marginTop: 1 }}>
                  {isChecked && <IconSymbol name="checkmark" size={14} color="#fff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                    <Text style={{ color: isChecked ? colors.muted : colors.foreground, fontSize: 14, fontWeight: "600", lineHeight: 20, textDecorationLine: isChecked ? "line-through" : "none", flex: 1 }}>{item.label}</Text>
                    {item.required && !isChecked && (
                      <View style={{ backgroundColor: "#FEF3E8", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 }}>
                        <Text style={{ color: "#E07B1A", fontSize: 9, fontWeight: "800" }}>WYM.</Text>
                      </View>
                    )}
                  </View>
                  {item.description && !isChecked && <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 }}>{item.description}</Text>}
                  {item.tip && !isChecked && (
                    <View style={{ backgroundColor: "#FEF3E8", borderRadius: 8, padding: 8, marginTop: 6, flexDirection: "row" }}>
                      <IconSymbol name="info.circle.fill" size={12} color="#E07B1A" />
                      <Text style={{ color: "#E07B1A", fontSize: 11, marginLeft: 5, flex: 1, lineHeight: 16 }}>{item.tip}</Text>
                    </View>
                  )}
                  {item.legalRef && !isChecked && <Text style={{ color: colors.muted, fontSize: 10, marginTop: 4, fontStyle: "italic" }}>{item.legalRef}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Pressable onPress={() => { haptic(); setShowTips(!showTips); }} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
            <IconSymbol name="lightbulb.fill" size={18} color="#E07B1A" />
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginLeft: 10, flex: 1 }}>Wskazówki i porady ({step.tips.length})</Text>
            <IconSymbol name={showTips ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
          </Pressable>
          {showTips && (
            <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginTop: 8, borderWidth: 1, borderColor: colors.border }}>
              {step.tips.map((tip: string, i: number) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: i < step.tips.length - 1 ? 10 : 0 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#E07B1A", marginTop: 6, marginRight: 10, flexShrink: 0 }} />
                  <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19, flex: 1 }}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {step.legalRefs && step.legalRefs.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 8 }}>
            <View style={{ backgroundColor: "#E8F0FB", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#1A5FA822" }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <IconSymbol name="book.fill" size={14} color="#1A5FA8" />
                <Text style={{ color: "#1A5FA8", fontSize: 12, fontWeight: "700", marginLeft: 6 }}>Podstawa prawna</Text>
              </View>
              {step.legalRefs.map((ref: string, i: number) => (
                <Text key={i} style={{ color: "#1A5FA8", fontSize: 12, lineHeight: 18, marginBottom: i < step.legalRefs.length - 1 ? 4 : 0 }}>• {ref}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border, padding: 16, paddingBottom: 32, flexDirection: "row", gap: 12 }}>
        <Pressable onPress={handlePrevStep} style={({ pressed }) => ({ flex: 1, backgroundColor: colors.surface, borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700" }}>{currentStepIndex === 0 ? "← Wróć" : "← Poprzedni"}</Text>
        </Pressable>
        <Pressable onPress={handleNextStep} style={({ pressed }) => ({ flex: 2, backgroundColor: allRequiredChecked ? step.color : colors.border, borderRadius: 14, padding: 16, alignItems: "center", opacity: pressed ? 0.85 : 1 })}>
          <Text style={{ color: allRequiredChecked ? "#fff" : colors.muted, fontSize: 15, fontWeight: "700" }}>{isLastStep ? "Zakończ ✓" : "Następny krok →"}</Text>
          {!allRequiredChecked && <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>{missingRequired.length} wymaganych do zaznaczenia</Text>}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
