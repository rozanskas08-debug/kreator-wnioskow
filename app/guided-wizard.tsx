import { useState, useRef } from "react";
import { ScrollView, Pressable, Text, TextInput, View, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const COMPETITION_TYPES = [
  "FIO (Fundusz Inicjatyw Obywatelskich)",
  "PROO (Program Rozwoju Org. Obywatelskich)",
  "Aktywni+",
  "PFRON",
  "Fundusze Europejskie",
  "Dotacja samorządowa",
  "Inny",
];

const FIRST_QUESTION = "Opowiedz mi o swoim pomyśle na projekt (1-2 zdania). Co chcesz zrobić?";

interface Message {
  role: "assistant" | "user";
  text: string;
  feedback?: string;
  suggestion?: string | null;
}

export default function GuidedWizardScreen() {
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);

  const [competitionType, setCompetitionType] = useState("");
  const [showCompetitionPicker, setShowCompetitionPicker] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);

  const guidedMutation = trpc.ai.guidedQuestion.useMutation();

  const startWizard = (competition: string) => {
    haptic();
    setCompetitionType(competition);
    setShowCompetitionPicker(false);
    setStarted(true);
    setMessages([
      {
        role: "assistant",
        text: `Świetnie! Pomogę Ci stworzyć wniosek do konkursu **${competition}**.\n\nOdpowiadaj na moje pytania, a ja zbuduję z Ciebie profesjonalny wniosek krok po kroku. Zacznijmy!`,
      },
      {
        role: "assistant",
        text: FIRST_QUESTION,
      },
    ]);
  };

  const sendAnswer = async () => {
    if (!currentInput.trim() || guidedMutation.isPending) return;
    haptic();

    const answer = currentInput.trim();
    setCurrentInput("");

    setMessages((prev) => [...prev, { role: "user", text: answer }]);

    try {
      const result = await guidedMutation.mutateAsync({
        step: currentStep,
        userAnswer: answer,
        projectSoFar: projectData,
        competitionType,
      });

      const newProjectData = { ...projectData };
      if (result.extractedData?.key && result.extractedData?.value) {
        newProjectData[result.extractedData.key] = result.extractedData.value;
        setProjectData(newProjectData);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.nextQuestion,
          feedback: result.feedback,
          suggestion: result.suggestion,
        },
      ]);

      setCurrentStep(result.nextStep);
      if (result.isComplete) setIsComplete(true);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Przepraszam, wystąpił błąd. Spróbuj ponownie." },
      ]);
    }
  };

  if (showCompetitionPicker) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginBottom: 12 })}>
            <IconSymbol name="chevron.left" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Kreator AI</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800" }}>Stwórz wniosek ze mną</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 6 }}>Odpowiadaj na pytania — AI zbuduje wniosek za Ciebie</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>Wybierz konkurs</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 16 }}>Dopasujemy wniosek do wymagań konkretnego programu</Text>

          {COMPETITION_TYPES.map((comp) => (
            <Pressable
              key={comp}
              onPress={() => startWizard(comp)}
              style={({ pressed }) => ({
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "600", flex: 1 }}>{comp}</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Stwórz ze mną</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{competitionType}</Text>
          </View>
          {/* Step indicator */}
          <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>Krok {Math.min(currentStep + 1, 6)}/6</Text>
          </View>
        </View>
        {/* Progress bar */}
        <View style={{ height: 3, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 12 }}>
          <View style={{ height: 3, backgroundColor: "#86EFAC", borderRadius: 2, width: `${Math.min((currentStep / 6) * 100, 100)}%` as any }} />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View key={i} style={{ marginBottom: 12, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "assistant" && (
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, maxWidth: "90%" }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#1E3A5F", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <Text style={{ fontSize: 14 }}>🤖</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    {msg.feedback && (
                      <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, padding: 10, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: "#16A34A" }}>
                        <Text style={{ color: "#166534", fontSize: 13, lineHeight: 19 }}>{msg.feedback}</Text>
                        {msg.suggestion && (
                          <Text style={{ color: "#15803D", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>💡 {msg.suggestion}</Text>
                        )}
                      </View>
                    )}
                    <View style={{ backgroundColor: colors.surface, borderRadius: 12, borderTopLeftRadius: 2, padding: 12, borderWidth: 1, borderColor: colors.border }}>
                      <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 21 }}>{msg.text}</Text>
                    </View>
                  </View>
                </View>
              )}

              {msg.role === "user" && (
                <View style={{ backgroundColor: "#1E3A5F", borderRadius: 12, borderTopRightRadius: 2, padding: 12, maxWidth: "80%" }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 21 }}>{msg.text}</Text>
                </View>
              )}
            </View>
          ))}

          {guidedMutation.isPending && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#1E3A5F", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 14 }}>🤖</Text>
              </View>
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}>
                <ActivityIndicator size="small" color="#1E3A5F" />
              </View>
            </View>
          )}

          {isComplete && (
            <View style={{ backgroundColor: "#EFF6FF", borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: "#BFDBFE" }}>
              <Text style={{ color: "#1D4ED8", fontSize: 15, fontWeight: "800", marginBottom: 8 }}>🎉 Gotowe! Mam wszystkie dane</Text>
              <Text style={{ color: "#1E40AF", fontSize: 13, lineHeight: 20, marginBottom: 12 }}>
                Zebrałem informacje do Twojego wniosku. Możesz teraz przejść do oceny eksperta lub zapisać projekt.
              </Text>
              <Pressable
                onPress={() => { haptic(); router.push("/expert-review"); }}
                style={({ pressed }) => ({
                  backgroundColor: "#1E3A5F", borderRadius: 10, padding: 14,
                  alignItems: "center", opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>Oceń wniosek z ekspertem →</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* Input area */}
        {!isComplete && (
          <View style={{
            flexDirection: "row", alignItems: "flex-end", gap: 10,
            padding: 12, borderTopWidth: 1, borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}>
            <TextInput
              value={currentInput}
              onChangeText={setCurrentInput}
              placeholder="Wpisz odpowiedź..."
              placeholderTextColor={colors.muted}
              multiline
              style={{
                flex: 1, color: colors.foreground, fontSize: 14,
                backgroundColor: colors.surface, borderRadius: 20,
                paddingHorizontal: 16, paddingVertical: 10,
                borderWidth: 1, borderColor: colors.border,
                maxHeight: 100, lineHeight: 20,
              }}
            />
            <Pressable
              onPress={sendAnswer}
              disabled={!currentInput.trim() || guidedMutation.isPending}
              style={({ pressed }) => ({
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: currentInput.trim() ? "#1E3A5F" : colors.border,
                alignItems: "center", justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              {guidedMutation.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
