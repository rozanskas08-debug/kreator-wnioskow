import { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getProjectById,
  updateProjectStatus,
  updateStepStatus,
  updateConsultantNotes,
  getProjectProgress,
  deleteProject,
} from "@/lib/supabase-storage";
import {
  GrantProject,
  ProjectStatus,
  StepStatus,
  WIZARD_STEPS,
  PROJECT_STATUS_CONFIG,
  STEP_STATUS_CONFIG,
} from "@/lib/data/grant-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const STATUS_CYCLE: ProjectStatus[] = ["draft", "in_progress", "review", "submitted", "approved", "rejected"];
const STEP_STATUS_CYCLE: StepStatus[] = ["not_started", "in_progress", "done"];
const STEP_COLORS = ["#1E3A5F", "#7C3AED", "#D97706", "#059669", "#1E3A5F", "#DC2626"];

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const [project, setProject] = useState<GrantProject | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [notesSaved, setNotesSaved] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getProjectById(id).then((p) => {
          setProject(p);
          setNotesText(p?.consultantNotes ?? "");
          if (p && expandedStep === null) {
            const firstActive = WIZARD_STEPS.find((s) => p.stepStatuses[s.id] !== "done");
            setExpandedStep(firstActive?.id ?? WIZARD_STEPS[0]?.id ?? null);
          }
        });
      }
    }, [id]),
  );

  const cycleProjectStatus = async () => {
    if (!project) return;
    haptic();
    const currentIdx = STATUS_CYCLE.indexOf(project.status);
    const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
    await updateProjectStatus(project.id, nextStatus);
    setProject({ ...project, status: nextStatus });
  };

  const cycleStepStatus = async (stepId: string) => {
    if (!project) return;
    haptic();
    const current = project.stepStatuses[stepId] ?? "not_started";
    const currentIdx = STEP_STATUS_CYCLE.indexOf(current);
    const nextStatus = STEP_STATUS_CYCLE[(currentIdx + 1) % STEP_STATUS_CYCLE.length];
    const newStatuses = { ...project.stepStatuses, [stepId]: nextStatus };
    await updateStepStatus(project.id, stepId, nextStatus);
    setProject({ ...project, stepStatuses: newStatuses });
  };

  const saveNotes = async () => {
    if (!project) return;
    await updateConsultantNotes(project.id, notesText);
    setNotesSaved(true);
  };

  const handleDelete = () => {
    Alert.alert(
      "Usu\u0144 projekt",
      `Czy na pewno chcesz usun\u0105\u0107 "${project?.title}"? Tej operacji nie mo\u017cna cofn\u0105\u0107.`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usu\u0144",
          style: "destructive",
          onPress: async () => {
            if (!project) return;
            await deleteProject(project.id);
            router.back();
          },
        },
      ],
    );
  };

  if (!project) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>
            \u0141adowanie projektu...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const statusCfg = PROJECT_STATUS_CONFIG[project.status];
  const progress = getProjectProgress(project);

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={{ backgroundColor: "#E07B1A", paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", opacity: 0.8, flex: 1 }}>
            WNIOSEK GRANTOWY
          </Text>
          <Pressable onPress={handleDelete} style={{ padding: 4 }}>
            <IconSymbol name="trash.fill" size={18} color="#fff" />
          </Pressable>
        </View>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 26 }}>
          {project.title}
        </Text>
        <Text style={{ color: "#fff", fontSize: 13, opacity: 0.85, marginTop: 4 }}>
          {project.applicantName}
        </Text>
        {project.competitionName ? (
          <Text style={{ color: "#fff", fontSize: 12, opacity: 0.7, marginTop: 2 }}>
            {project.competitionName}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 10, flexWrap: "wrap" }}>
          <Pressable
            onPress={cycleProjectStatus}
            style={{ backgroundColor: statusCfg.bg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Text style={{ color: statusCfg.color, fontSize: 12, fontWeight: "700" }}>
              {statusCfg.label} \u2014 dotknij aby zmieni\u0107
            </Text>
          </Pressable>
          {project.requestedAmount > 0 && (
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                {project.requestedAmount.toLocaleString("pl-PL")} z\u0142
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Progress */}
        <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>POST\u0118P WNIOSKU</Text>
            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700" }}>
              {progress.doneSteps}/{progress.totalSteps} krok\u00f3w \u00b7 {progress.pct}%
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
            <View style={{ height: 8, width: `${progress.pct}%` as any, backgroundColor: "#E07B1A", borderRadius: 4 }} />
          </View>
        </View>

        {/* Step pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}>
          {WIZARD_STEPS.map((step, idx) => {
            const status = project.stepStatuses[step.id] ?? "not_started";
            const cfg = STEP_STATUS_CONFIG[status];
            const color = STEP_COLORS[idx % STEP_COLORS.length];
            const isActive = expandedStep === step.id;
            return (
              <Pressable
                key={step.id}
                onPress={() => { haptic(); setExpandedStep(isActive ? null : step.id); }}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isActive ? color + "22" : colors.surface,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: isActive ? color : colors.border,
                  opacity: pressed ? 0.8 : 1,
                  gap: 6,
                })}
              >
                <Text style={{ fontSize: 10, fontWeight: "800", color }}>{idx + 1}</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600" }}>{step.title}</Text>
                <View style={{ backgroundColor: cfg.color + "22", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 }}>
                  <Text style={{ color: cfg.color, fontSize: 9, fontWeight: "700" }}>{cfg.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Steps */}
        <View style={{ marginTop: 8 }}>
          {WIZARD_STEPS.map((step, idx) => {
            const status = project.stepStatuses[step.id] ?? "not_started";
            const cfg = STEP_STATUS_CONFIG[status];
            const color = STEP_COLORS[idx % STEP_COLORS.length];
            const isExpanded = expandedStep === step.id;
            const stepData = project.stepData[step.id] ?? {};
            const filledFields = step.fields.filter((f) => stepData[f.id]?.trim()).length;
            const totalFields = step.fields.length;
            const requiredFields = step.fields.filter((f) => f.required).length;
            const filledRequired = step.fields.filter((f) => f.required && stepData[f.id]?.trim()).length;

            return (
              <View key={step.id} style={{ marginHorizontal: 16, marginBottom: 8 }}>
                <Pressable
                  onPress={() => { haptic(); setExpandedStep(isExpanded ? null : step.id); }}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface,
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: isExpanded ? color : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: color + "22", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                      <IconSymbol name={step.icon as any} size={16} color={color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{step.title}</Text>
                      <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                        {filledFields}/{totalFields} p\u00f3l \u00b7 {filledRequired}/{requiredFields} wymaganych
                      </Text>
                    </View>
                    <Pressable
                      onPress={(e) => { e.stopPropagation(); cycleStepStatus(step.id); }}
                      style={{ marginRight: 8, backgroundColor: cfg.color + "22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}
                    >
                      <Text style={{ color: cfg.color, fontSize: 10, fontWeight: "700" }}>{cfg.label}</Text>
                    </Pressable>
                    <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                  </View>
                  <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 10 }}>
                    <View style={{ height: 4, width: `${totalFields > 0 ? (filledFields / totalFields) * 100 : 0}%` as any, backgroundColor: color, borderRadius: 2 }} />
                  </View>
                </Pressable>

                {isExpanded && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginTop: 4, padding: 14, borderWidth: 1, borderColor: color }}>
                    {step.fields.map((field) => {
                      const val = stepData[field.id];
                      return (
                        <View key={field.id} style={{ marginBottom: 10 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", flex: 1 }}>
                              {field.label.toUpperCase()}
                            </Text>
                            {field.required && (
                              <View style={{ backgroundColor: "#FEF3E8", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                                <Text style={{ color: "#E07B1A", fontSize: 9, fontWeight: "700" }}>WYM.</Text>
                              </View>
                            )}
                          </View>
                          {val ? (
                            <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18 }}>{val}</Text>
                          ) : (
                            <Text style={{ color: colors.muted, fontSize: 13, fontStyle: "italic" }}>nie wype\u0142niono</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Consultant notes */}
        <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", flex: 1 }}>NOTATKI KONSULTANTA</Text>
            {!notesSaved && (
              <Pressable onPress={saveNotes} style={{ backgroundColor: "#E07B1A", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>Zapisz</Text>
              </Pressable>
            )}
          </View>
          <TextInput
            value={notesText}
            onChangeText={(text) => { setNotesText(text); setNotesSaved(false); }}
            onBlur={saveNotes}
            placeholder="Dodaj notatki do projektu..."
            placeholderTextColor={colors.muted}
            multiline
            style={{ backgroundColor: colors.background, borderRadius: 10, padding: 10, color: colors.foreground, fontSize: 13, borderWidth: 1, borderColor: colors.border, minHeight: 80, textAlignVertical: "top" }}
          />
        </View>

        {/* Key info */}
        {(project.submissionDeadline || project.fundingSource || project.requestedAmount > 0) && (
          <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", marginBottom: 10 }}>INFORMACJE O PROJEKCIE</Text>
            {project.fundingSource ? (
              <View style={{ flexDirection: "row", marginBottom: 6 }}>
                <Text style={{ color: colors.muted, fontSize: 12, width: 130 }}>
                  \u0179r\u00f3d\u0142o finansowania:
                </Text>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", flex: 1 }}>{project.fundingSource}</Text>
              </View>
            ) : null}
            {project.submissionDeadline ? (
              <View style={{ flexDirection: "row", marginBottom: 6 }}>
                <Text style={{ color: colors.muted, fontSize: 12, width: 130 }}>Termin z\u0142o\u017cenia:</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", flex: 1 }}>
                  {new Date(project.submissionDeadline).toLocaleDateString("pl-PL", { day: "2-digit", month: "long", year: "numeric" })}
                </Text>
              </View>
            ) : null}
            {project.requestedAmount > 0 ? (
              <View style={{ flexDirection: "row", marginBottom: 6 }}>
                <Text style={{ color: colors.muted, fontSize: 12, width: 130 }}>Kwota dotacji:</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", flex: 1 }}>{project.requestedAmount.toLocaleString("pl-PL")} z\u0142</Text>
              </View>
            ) : null}
            {project.ownContribution > 0 ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: colors.muted, fontSize: 12, width: 130 }}>Wk\u0142ad w\u0142asny:</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", flex: 1 }}>{project.ownContribution.toLocaleString("pl-PL")} z\u0142</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Edit button */}
        <View style={{ marginHorizontal: 16, marginTop: 16 }}>
          <Pressable
            onPress={() => router.push({ pathname: "/guided-wizard", params: { projectId: project.id } } as any)}
            style={({ pressed }) => ({
              backgroundColor: "#E07B1A",
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <IconSymbol name="pencil" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Edytuj wniosek</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
