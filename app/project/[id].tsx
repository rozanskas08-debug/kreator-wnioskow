import { useState, useCallback, useRef } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Alert, Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import {
  getProjectById,
  updateProjectStatus,
  updateStepStatus,
  updateStepData,
  updateConsultantNotes,
  getProjectProgress,
  deleteProject,
  saveGeneratedDocument,
} from "@/lib/supabase-storage";
import {
  GrantProject,
  ProjectStatus,
  StepStatus,
  WIZARD_STEPS,
  PROJECT_STATUS_CONFIG,
  STEP_STATUS_CONFIG,
  WizardField,
  WizardStep,
} from "@/lib/data/grant-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const STATUS_CYCLE: ProjectStatus[] = ["draft", "in_progress", "review", "submitted", "approved", "rejected"];
const STEP_STATUS_CYCLE: StepStatus[] = ["not_started", "in_progress", "done"];
const STEP_COLORS = ["#1E3A5F", "#7C3AED", "#D97706", "#059669", "#1E3A5F", "#DC2626"];

// ─── Editable Field Component ────────────────────────────────────────────────
function EditableField({
  field,
  step,
  value,
  project,
  onSave,
}: {
  field: WizardField;
  step: WizardStep;
  value: string;
  project: GrantProject;
  onSave: (fieldId: string, val: string) => void;
}) {
  const colors = useColors();
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const suggestMutation = trpc.ai.suggestFieldContent.useMutation();

  const handleAI = async () => {
    haptic();
    setIsEditing(true);
    try {
      const result = await suggestMutation.mutateAsync({
        fieldId: field.id,
        fieldLabel: field.label,
        fieldType: field.type,
        hint: field.hint,
        placeholder: field.placeholder,
        stepId: step.id,
        stepTitle: step.title,
        currentValue: localValue || undefined,
        projectContext: project.stepData,
        projectTitle: project.title,
        applicantName: project.applicantName,
        competitionName: project.competitionName,
      });
      setLocalValue(result.value);
      setAiTip(result.tip);
      onSave(field.id, result.value);
    } catch (e) {
      Alert.alert("Błąd AI", "Nie udało się wygenerować treści. Spróbuj ponownie.");
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(field.id, localValue);
    }
  };

  const isTextArea = field.type === "textarea" || field.type === "multiline";
  const isDateOrNumber = field.type === "date" || field.type === "number";
  const canUseAI = !isDateOrNumber;

  return (
    <View style={{ marginBottom: 14 }}>
      {/* Label row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", flex: 1, letterSpacing: 0.5 }}>
          {field.label.toUpperCase()}
        </Text>
        {field.required && (
          <View style={{ backgroundColor: "#FEF3E8", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1, marginRight: 6 }}>
            <Text style={{ color: "#E07B1A", fontSize: 9, fontWeight: "700" }}>WYM.</Text>
          </View>
        )}
        {canUseAI && (
          <Pressable
            onPress={handleAI}
            disabled={suggestMutation.isPending}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: suggestMutation.isPending ? "#f0f0f0" : "#FFF3E0",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
              gap: 4,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {suggestMutation.isPending ? (
              <ActivityIndicator size="small" color="#E07B1A" />
            ) : (
              <Text style={{ fontSize: 10 }}>✨</Text>
            )}
            <Text style={{ color: "#E07B1A", fontSize: 10, fontWeight: "700" }}>
              {suggestMutation.isPending ? "AI pisze..." : "AI pomoc"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Input */}
      <TextInput
        value={localValue}
        onChangeText={setLocalValue}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        placeholder={field.placeholder || `Wpisz ${field.label.toLowerCase()}...`}
        placeholderTextColor={colors.muted}
        multiline={isTextArea}
        numberOfLines={isTextArea ? 4 : 1}
        keyboardType={field.type === "number" ? "numeric" : "default"}
        style={{
          backgroundColor: isEditing ? colors.background : colors.surface,
          borderRadius: 10,
          padding: 10,
          color: colors.foreground,
          fontSize: 13,
          borderWidth: 1,
          borderColor: isEditing ? "#E07B1A" : colors.border,
          minHeight: isTextArea ? 80 : 40,
          textAlignVertical: isTextArea ? "top" : "center",
          lineHeight: 18,
        }}
      />

      {/* Hint */}
      {field.hint && !isEditing && !localValue && (
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, fontStyle: "italic" }}>
          💡 {field.hint}
        </Text>
      )}

      {/* AI tip */}
      {aiTip && (
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4, backgroundColor: "#FFF3E0", borderRadius: 8, padding: 8, gap: 6 }}>
          <Text style={{ fontSize: 12 }}>✨</Text>
          <Text style={{ color: "#E07B1A", fontSize: 11, flex: 1, lineHeight: 16 }}>{aiTip}</Text>
          <Pressable onPress={() => setAiTip(null)}>
            <Text style={{ color: "#E07B1A", fontSize: 14 }}>✕</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const [project, setProject] = useState<GrantProject | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [notesSaved, setNotesSaved] = useState(true);
  const [generatedDoc, setGeneratedDoc] = useState<{ title: string; sections: { heading: string; content: string }[]; summary: string; generatedAt: string } | null>(null);
  const [showDoc, setShowDoc] = useState(false);
  const pendingSavesRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const generateMutation = trpc.ai.generateFullApplication.useMutation();

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
          // Restore previously generated document
          if (p?.generatedDocument) {
            setGeneratedDoc(p.generatedDocument);
            setShowDoc(true);
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

  const handleFieldSave = (stepId: string, fieldId: string, value: string) => {
    if (!project) return;
    const newStepData = {
      ...project.stepData,
      [stepId]: { ...(project.stepData[stepId] ?? {}), [fieldId]: value },
    };
    const updatedProject = { ...project, stepData: newStepData };
    setProject(updatedProject);

    // Debounce save
    const key = stepId + "." + fieldId;
    if (pendingSavesRef.current[key]) clearTimeout(pendingSavesRef.current[key]);
    pendingSavesRef.current[key] = setTimeout(() => {
      updateStepData(project.id, stepId, newStepData[stepId]);
    }, 800);

    // Auto-update step status based on filled required fields
    const wizardStep = WIZARD_STEPS.find((s) => s.id === stepId);
    if (wizardStep) {
      const requiredFields = wizardStep.fields.filter((f) => f.required);
      const filledRequired = requiredFields.filter((f) => newStepData[stepId]?.[f.id]?.trim());
      const currentStepStatus = updatedProject.stepStatuses[stepId] ?? "not_started";
      let newStepStatus: StepStatus = currentStepStatus;
      if (filledRequired.length === requiredFields.length && requiredFields.length > 0) {
        newStepStatus = "done";
      } else if (filledRequired.length > 0 || Object.values(newStepData[stepId] ?? {}).some((v) => v?.trim())) {
        newStepStatus = "in_progress";
      }
      if (newStepStatus !== currentStepStatus) {
        const newStatuses = { ...updatedProject.stepStatuses, [stepId]: newStepStatus };
        setProject({ ...updatedProject, stepStatuses: newStatuses });
        updateStepStatus(project.id, stepId, newStepStatus);
      }
    }
  };

  const saveNotes = async () => {
    if (!project) return;
    await updateConsultantNotes(project.id, notesText);
    setNotesSaved(true);
  };

  const handleGenerate = async () => {
    if (!project) return;
    haptic();
    try {
      const result = await generateMutation.mutateAsync({
        projectTitle: project.title,
        applicantName: project.applicantName,
        competitionName: project.competitionName || undefined,
        fundingSource: project.fundingSource || undefined,
        requestedAmount: project.requestedAmount || undefined,
        ownContribution: project.ownContribution || undefined,
        submissionDeadline: project.submissionDeadline || undefined,
        stepData: project.stepData,
      });
      const docWithDate = { ...result, generatedAt: new Date().toISOString() };
      setGeneratedDoc(docWithDate);
      setShowDoc(true);
      // Save to project so it persists
      await saveGeneratedDocument(project.id, docWithDate);
      setProject({ ...project, generatedDocument: docWithDate });
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się wygenerować wniosku. Spróbuj ponownie.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Usuń projekt",
      `Czy na pewno chcesz usunąć "${project?.title}"? Tej operacji nie można cofnąć.`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
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
          <Text style={{ color: colors.muted, fontSize: 16 }}>Ładowanie projektu...</Text>
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
              {statusCfg.label} — dotknij aby zmienić
            </Text>
          </Pressable>
          {project.requestedAmount > 0 && (
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                {project.requestedAmount.toLocaleString("pl-PL")} zł
              </Text>
            </View>
          )}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
          {/* Progress */}
          <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>POSTĘP WNIOSKU</Text>
              <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700" }}>
                {progress.doneSteps}/{progress.totalSteps} kroków · {progress.pct}%
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
              <View style={{ height: 8, width: `${progress.pct}%` as any, backgroundColor: "#E07B1A", borderRadius: 4 }} />
            </View>
          </View>

          {/* Step tabs */}
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

          {/* Steps with editable fields */}
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
                  {/* Step header */}
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
                          {filledFields}/{totalFields} pól · {filledRequired}/{requiredFields} wymaganych
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

                  {/* Expanded: editable fields */}
                  {isExpanded && (
                    <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginTop: 4, padding: 14, borderWidth: 1, borderColor: color }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                        <Text style={{ color: colors.muted, fontSize: 11, flex: 1 }}>
                          Kliknij pole aby edytować · ✨ AI pomoc generuje treść automatycznie
                        </Text>
                      </View>
                      {step.fields.map((field) => (
                        <EditableField
                          key={field.id}
                          field={field}
                          step={step}
                          value={stepData[field.id] ?? ""}
                          project={project}
                          onSave={(fieldId, val) => handleFieldSave(step.id, fieldId, val)}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Scan Competition Button */}
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Pressable
              onPress={() => router.push({ pathname: "/scan-competition" as any, params: { projectId: project.id } })}
              style={({ pressed }) => ({
                backgroundColor: "#1E3A5F",
                borderRadius: 14,
                padding: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ fontSize: 18 }}>📸</Text>
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Skanuj stronę konkursu</Text>
            </Pressable>
            <Text style={{ color: colors.muted, fontSize: 11, textAlign: "center", marginTop: 4, marginBottom: 12 }}>
              Zrób screenshot ogłoszenia — AI wypełni pola automatycznie
            </Text>
          </View>

          {/* Generate Application Button */}
          <View style={{ marginHorizontal: 16, marginTop: 0, marginBottom: 8 }}>
            <Pressable
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
              style={({ pressed }) => ({
                backgroundColor: generateMutation.isPending ? "#ccc" : "#E07B1A",
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              {generateMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontSize: 18 }}>✨</Text>
              )}
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
                {generateMutation.isPending ? "AI generuje wniosek..." : project?.generatedDocument ? "Wygeneruj ponownie" : "Wygeneruj pełny wniosek"}
              </Text>
            </Pressable>
            <Text style={{ color: colors.muted, fontSize: 11, textAlign: "center", marginTop: 6 }}>
              AI stworzy profesjonalny tekst wniosku na podstawie wypełnionych pól
            </Text>
          </View>

          {/* Generated Document */}
          {showDoc && generatedDoc && (
            <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 2, borderColor: "#E07B1A" }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ color: "#E07B1A", fontSize: 14, fontWeight: "800", flex: 1 }}>✨ WYGENEROWANY WNIOSEK</Text>
                <Pressable onPress={() => setShowDoc(false)}>
                  <Text style={{ color: colors.muted, fontSize: 18 }}>✕</Text>
                </Pressable>
              </View>
              {generatedDoc.generatedAt && (
                <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 12 }}>
                  Wygenerowano: {new Date(generatedDoc.generatedAt).toLocaleString("pl-PL")}
                </Text>
              )}
              {/* Summary */}
              <View style={{ backgroundColor: "#FFF3E0", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <Text style={{ color: "#E07B1A", fontSize: 12, fontWeight: "700", marginBottom: 4 }}>PODSUMOWANIE</Text>
                <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 20 }}>{generatedDoc.summary}</Text>
              </View>
              {/* Sections */}
              {generatedDoc.sections.map((section, idx) => (
                <View key={idx} style={{ marginBottom: 14 }}>
                  <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 6 }}>{section.heading}</Text>
                  <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 22 }}>{section.content}</Text>
                </View>
              ))}
              <Pressable
                onPress={() => {
                  const fullText = generatedDoc.sections.map((s) => s.heading + "\n" + s.content).join("\n\n");
                  Alert.alert("Skopiuj wniosek", "Zaznacz i skopiuj tekst wniosku z ekranu.");
                }}
                style={{ backgroundColor: "#E07B1A", borderRadius: 10, padding: 12, alignItems: "center", marginTop: 8 }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>📋 Skopiuj tekst wniosku</Text>
              </Pressable>
            </View>
          )}

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
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
