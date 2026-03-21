import { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { getProjectById, saveProject } from "@/lib/supabase-storage";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

type AnalysisResult = {
  competitionName: string | null;
  fundingSource: string | null;
  submissionDeadline: string | null;
  maxAmount: number | null;
  minAmount: number | null;
  ownContributionPct: number | null;
  projectDurationMonths: number | null;
  eligibleApplicants: string | null;
  projectScope: string | null;
  requiredFields: string[];
  importantNotes: string | null;
  projectTitle: string | null;
};

export default function ScanCompetitionScreen() {
  const colors = useColors();
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const analyzeMutation = trpc.ai.analyzeCompetitionScreenshot.useMutation();

  const pickImage = async (fromCamera: boolean) => {
    haptic();
    try {
      let result;
      if (fromCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do aparatu.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setAnalysis(null);
        await analyzeImage(asset.uri, asset.base64 ?? null, asset.mimeType ?? "image/jpeg");
      }
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się wybrać zdjęcia.");
    }
  };

  const analyzeImage = async (uri: string, base64: string | null, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      let imageBase64 = base64;

      // On native, if base64 not provided, read from file
      if (!imageBase64 && Platform.OS !== "web") {
        imageBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // On web, convert data URL to base64
      if (!imageBase64 && Platform.OS === "web" && uri.startsWith("data:")) {
        imageBase64 = uri.split(",")[1];
      }

      if (!imageBase64) {
        Alert.alert("Błąd", "Nie udało się odczytać zdjęcia.");
        return;
      }

      const result = await analyzeMutation.mutateAsync({
        imageBase64,
        mimeType,
      });
      setAnalysis(result);
    } catch (e) {
      Alert.alert("Błąd analizy", "AI nie mógł przeanalizować zdjęcia. Spróbuj z wyraźniejszym screenshotem.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyToProject = async () => {
    if (!analysis || !projectId) return;
    haptic();
    setIsApplying(true);
    try {
      const project = await getProjectById(projectId);
      if (!project) {
        Alert.alert("Błąd", "Nie znaleziono projektu.");
        return;
      }

      // Apply extracted data to project fields
      const updated = { ...project };

      if (analysis.competitionName) updated.competitionName = analysis.competitionName;
      if (analysis.fundingSource) updated.fundingSource = analysis.fundingSource;
      if (analysis.submissionDeadline) updated.submissionDeadline = analysis.submissionDeadline;
      if (analysis.maxAmount) updated.requestedAmount = analysis.maxAmount;
      if (analysis.ownContributionPct && analysis.maxAmount) {
        updated.ownContribution = Math.round((analysis.maxAmount * analysis.ownContributionPct) / 100);
      }

      // Update basics step data
      const basicsData = { ...(updated.stepData["basics"] ?? {}) };
      if (analysis.competitionName) basicsData["competitionName"] = analysis.competitionName;
      if (analysis.fundingSource) basicsData["fundingSource"] = analysis.fundingSource;
      if (analysis.submissionDeadline) basicsData["submissionDeadline"] = analysis.submissionDeadline;
      if (analysis.maxAmount) basicsData["requestedAmount"] = String(analysis.maxAmount);
      if (analysis.projectTitle && !basicsData["projectTitle"]) basicsData["projectTitle"] = analysis.projectTitle;

      updated.stepData = { ...updated.stepData, basics: basicsData };

      await saveProject(updated);
      Alert.alert(
        "Dane zastosowane! ✅",
        `Wypełniono pola:\n${[
          analysis.competitionName && "• Nazwa konkursu",
          analysis.fundingSource && "• Źródło finansowania",
          analysis.submissionDeadline && "• Termin składania",
          analysis.maxAmount && "• Kwota dotacji",
        ].filter(Boolean).join("\n")}`,
        [{ text: "Wróć do wniosku", onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się zastosować danych.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}>
          <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>← Wróć</Text>
          </Pressable>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>AI Analiza</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginBottom: 6 }}>📸 Skanuj konkurs</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 18 }}>
            Zrób screenshot strony z ogłoszeniem o konkursie (np. ORLEN, FIO, NIW), a AI automatycznie wyciągnie wszystkie wymagania i wypełni pola wniosku.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 12 }}>
          {/* Pick image buttons */}
          {!imageUri && (
            <>
              <Pressable
                onPress={() => pickImage(false)}
                style={({ pressed }) => ({
                  backgroundColor: "#1E3A5F",
                  borderRadius: 14,
                  padding: 18,
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 28 }}>🖼️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Wybierz ze zdjęć</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>Wybierz screenshot z galerii</Text>
                </View>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>›</Text>
              </Pressable>

              <Pressable
                onPress={() => pickImage(true)}
                style={({ pressed }) => ({
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 18,
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontSize: 28 }}>📷</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>Zrób zdjęcie</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Sfotografuj stronę z konkursem</Text>
                </View>
                <Text style={{ color: colors.muted, fontSize: 18 }}>›</Text>
              </Pressable>

              {/* Tip */}
              <View style={{ backgroundColor: "#FFF3E0", borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: "#E07B1A" }}>
                <Text style={{ color: "#E07B1A", fontSize: 12, fontWeight: "700", marginBottom: 4 }}>💡 Wskazówka</Text>
                <Text style={{ color: "#7C4A00", fontSize: 12, lineHeight: 18 }}>
                  Najlepiej działa screenshot całej strony z ogłoszeniem o konkursie — z widoczną nazwą programu, terminem i kwotą dotacji. Możesz też sfotografować wydrukowany regulamin.
                </Text>
              </View>
            </>
          )}

          {/* Image preview */}
          {imageUri && (
            <View style={{ borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
              <Image source={{ uri: imageUri }} style={{ width: "100%", height: 200 }} resizeMode="cover" />
              <Pressable
                onPress={() => { setImageUri(null); setAnalysis(null); }}
                style={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 20, width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>
          )}

          {/* Analyzing indicator */}
          {isAnalyzing && (
            <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 24, alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#1E3A5F" }}>
              <ActivityIndicator size="large" color="#1E3A5F" />
              <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "600" }}>AI analizuje screenshot...</Text>
              <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>
                Rozpoznaję wymagania konkursu, termin, kwotę i inne dane
              </Text>
            </View>
          )}

          {/* Analysis results */}
          {analysis && !isAnalyzing && (
            <>
              <View style={{ backgroundColor: "#E8F5E9", borderRadius: 14, padding: 16, borderLeftWidth: 3, borderLeftColor: "#22C55E" }}>
                <Text style={{ color: "#166534", fontSize: 14, fontWeight: "800", marginBottom: 12 }}>✅ AI rozpoznał dane konkursu</Text>

                {analysis.competitionName && (
                  <InfoRow label="Nazwa konkursu" value={analysis.competitionName} />
                )}
                {analysis.fundingSource && (
                  <InfoRow label="Organizator" value={analysis.fundingSource} />
                )}
                {analysis.submissionDeadline && (
                  <InfoRow label="Termin składania" value={analysis.submissionDeadline} />
                )}
                {analysis.maxAmount && (
                  <InfoRow label="Maks. kwota dotacji" value={`${analysis.maxAmount.toLocaleString("pl-PL")} zł`} />
                )}
                {analysis.minAmount && (
                  <InfoRow label="Min. kwota dotacji" value={`${analysis.minAmount.toLocaleString("pl-PL")} zł`} />
                )}
                {analysis.ownContributionPct && (
                  <InfoRow label="Wymagany wkład własny" value={`${analysis.ownContributionPct}%`} />
                )}
                {analysis.projectDurationMonths && (
                  <InfoRow label="Maks. czas trwania" value={`${analysis.projectDurationMonths} miesięcy`} />
                )}
                {analysis.eligibleApplicants && (
                  <InfoRow label="Kto może składać" value={analysis.eligibleApplicants} />
                )}
                {analysis.projectScope && (
                  <InfoRow label="Obszar tematyczny" value={analysis.projectScope} />
                )}
              </View>

              {analysis.requiredFields && analysis.requiredFields.length > 0 && (
                <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 10 }}>📋 Wymagane elementy wniosku</Text>
                  {analysis.requiredFields.map((field, i) => (
                    <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                      <Text style={{ color: "#22C55E", fontSize: 13, fontWeight: "700" }}>✓</Text>
                      <Text style={{ color: colors.foreground, fontSize: 13, flex: 1, lineHeight: 18 }}>{field}</Text>
                    </View>
                  ))}
                </View>
              )}

              {analysis.importantNotes && (
                <View style={{ backgroundColor: "#FFF3E0", borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: "#E07B1A" }}>
                  <Text style={{ color: "#E07B1A", fontSize: 12, fontWeight: "700", marginBottom: 4 }}>⚠️ Ważne uwagi</Text>
                  <Text style={{ color: "#7C4A00", fontSize: 12, lineHeight: 18 }}>{analysis.importantNotes}</Text>
                </View>
              )}

              {/* Action buttons */}
              <View style={{ gap: 10, marginTop: 4 }}>
                {projectId && (
                  <Pressable
                    onPress={applyToProject}
                    disabled={isApplying}
                    style={({ pressed }) => ({
                      backgroundColor: "#22C55E",
                      borderRadius: 14,
                      padding: 16,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                      opacity: pressed || isApplying ? 0.7 : 1,
                    })}
                  >
                    {isApplying ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ fontSize: 18 }}>✅</Text>
                    )}
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
                      {isApplying ? "Wypełnianie..." : "Zastosuj do wniosku"}
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() => { setImageUri(null); setAnalysis(null); }}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface,
                    borderRadius: 14,
                    padding: 14,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>📸 Zeskanuj inne zdjęcie</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 8, gap: 8 }}>
      <Text style={{ color: "#166534", fontSize: 12, fontWeight: "600", width: 130, flexShrink: 0 }}>{label}:</Text>
      <Text style={{ color: "#14532D", fontSize: 12, flex: 1, lineHeight: 18 }}>{value}</Text>
    </View>
  );
}
