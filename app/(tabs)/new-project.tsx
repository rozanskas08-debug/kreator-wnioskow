import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { createProject, saveProject } from "@/lib/supabase-storage";
import { APPLICANT_TYPES, ApplicantType, WIZARD_STEPS } from "@/lib/data/grant-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export default function NewProjectScreen() {
  const colors = useColors();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantType, setApplicantType] = useState<ApplicantType>("ngo");
  const [competition, setCompetition] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [deadline, setDeadline] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !applicantName.trim()) {
      Alert.alert("Uzupełnij dane", "Tytuł projektu i nazwa wnioskodawcy są wymagane.");
      return;
    }
    haptic();
    const project = createProject(title.trim(), applicantName.trim(), applicantType, competition.trim(), fundingSource.trim());
    if (deadline.trim()) project.submissionDeadline = deadline.trim();
    if (amount.trim()) project.requestedAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;
    await saveProject(project);
    setTitle(""); setApplicantName(""); setCompetition(""); setFundingSource(""); setDeadline(""); setAmount("");
    router.push({ pathname: "/project/[id]", params: { id: project.id } });
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Kreator Wniosków</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginBottom: 6 }}>Nowy wniosek</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 18 }}>
            Wypełnij podstawowe dane, a następnie przejdź przez 6 kroków kreatora.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 12 }}>Kreator obejmuje 6 kroków:</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {WIZARD_STEPS.map((step) => (
              <View key={step.id} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: step.color, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>{step.stepNumber}</Text>
                </View>
                <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "600" }}>{step.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 24, gap: 16, paddingBottom: 40 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800" }}>Dane projektu</Text>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Tytuł projektu <Text style={{ color: colors.error }}>*</Text></Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="np. Kompetencje wychowawcze nauczycieli" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }} />
          </View>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Nazwa wnioskodawcy <Text style={{ color: colors.error }}>*</Text></Text>
            <TextInput value={applicantName} onChangeText={setApplicantName} placeholder="np. Fundacja Aktywni Razem" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }} />
          </View>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 10 }}>Typ wnioskodawcy</Text>
            {APPLICANT_TYPES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => { haptic(); setApplicantType(t.id); }}
                style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: applicantType === t.id ? "#EEF2FF" : colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: applicantType === t.id ? "#1E3A5F" : colors.border, opacity: pressed ? 0.8 : 1 })}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: applicantType === t.id ? "#1E3A5F" : colors.border, alignItems: "center", justifyContent: "center" }}>
                  <IconSymbol name={t.icon as any} size={18} color={applicantType === t.id ? "#FFFFFF" : colors.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{t.label}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{t.description}</Text>
                </View>
                {applicantType === t.id && <IconSymbol name="checkmark.circle.fill" size={20} color="#1E3A5F" />}
              </Pressable>
            ))}
          </View>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Nazwa konkursu / programu</Text>
            <TextInput value={competition} onChangeText={setCompetition} placeholder="np. FIO 2025, PROO, Aktywni+" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }} />
          </View>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Źródło finansowania</Text>
            <TextInput value={fundingSource} onChangeText={setFundingSource} placeholder="np. NIW-CRSO, Ministerstwo Edukacji" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }} />
          </View>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Termin składania wniosku</Text>
            <TextInput value={deadline} onChangeText={setDeadline} placeholder="np. 2025-06-30" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }} />
          </View>

          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Wnioskowana kwota dotacji (zł)</Text>
            <TextInput value={amount} onChangeText={setAmount} placeholder="np. 50000" placeholderTextColor={colors.muted} keyboardType="numeric" style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }} />
          </View>

          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 14, padding: 18, alignItems: "center", marginTop: 8, opacity: pressed ? 0.8 : 1 })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Utwórz wniosek i przejdź do kreatora</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
