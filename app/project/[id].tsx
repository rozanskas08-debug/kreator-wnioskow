import { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getProjectById, saveProject, getStepCompletion } from "@/lib/client-storage";
import type { ClientProject, ClientStep, ClientDocument, DocumentStatus } from "@/lib/data/client-types";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const DOC_STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: "Oczekuje", color: "#6B7280", bg: "#F3F4F6", icon: "circle" },
  received: { label: "Otrzymano", color: "#1A5FA8", bg: "#E8F0FB", icon: "clock.fill" },
  needs_correction: { label: "Do poprawy", color: "#E07B1A", bg: "#FEF3E8", icon: "exclamationmark.triangle.fill" },
  approved: { label: "Zaakceptowano", color: "#22A45D", bg: "#ECFDF5", icon: "checkmark.circle.fill" },
};

const STATUS_CYCLE: DocumentStatus[] = ["pending", "received", "needs_correction", "approved"];

function DocRow({ doc, onCycle, onNote }: { doc: ClientDocument; onCycle: () => void; onNote: () => void }) {
  const colors = useColors();
  const cfg = DOC_STATUS_CONFIG[doc.status];
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
      <Pressable onPress={onCycle} style={{ marginRight: 10, marginTop: 2 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: cfg.bg, alignItems: "center", justifyContent: "center" }}>
          <IconSymbol name={cfg.icon as any} size={14} color={cfg.color} />
        </View>
      </Pressable>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", flex: 1 }}>{doc.label}</Text>
          {doc.required && (
            <View style={{ backgroundColor: "#FEF3E8", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
              <Text style={{ color: "#E07B1A", fontSize: 9, fontWeight: "700" }}>WYM.</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
          <View style={{ backgroundColor: cfg.bg, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ color: cfg.color, fontSize: 10, fontWeight: "700" }}>{cfg.label}</Text>
          </View>
          {doc.note ? (
            <Text style={{ color: colors.muted, fontSize: 11, flex: 1 }} numberOfLines={1}>📝 {doc.note}</Text>
          ) : null}
        </View>
      </View>
      <Pressable onPress={onNote} style={{ padding: 6 }}>
        <IconSymbol name="pencil" size={14} color={colors.muted} />
      </Pressable>
    </View>
  );
}

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const [project, setProject] = useState<ClientProject | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<{ stepId: string; docId: string; current: string } | null>(null);
  const [noteText, setNoteText] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (id) getProjectById(id).then((p) => {
        setProject(p);
        if (p && expandedStep === null) setExpandedStep(p.steps[p.currentStep]?.id ?? p.steps[0]?.id ?? null);
      });
    }, [id]),
  );

  const cycleDocStatus = async (stepId: string, docId: string) => {
    if (!project) return;
    haptic();
    const step = project.steps.find((s) => s.id === stepId)!;
    const doc = step.documents.find((d) => d.id === docId)!;
    const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(doc.status) + 1) % STATUS_CYCLE.length];
    doc.status = nextStatus;
    doc.updatedAt = new Date().toISOString();
    const allRequired = step.documents.filter((d) => d.required);
    const allRequiredApproved = allRequired.every((d) => d.status === "approved");
    const anyProgress = step.documents.some((d) => d.status !== "pending");
    step.status = allRequiredApproved && allRequired.length > 0 ? "done" : anyProgress ? "in_progress" : "not_started";
    const firstIncomplete = project.steps.findIndex((s) => s.status !== "done");
    project.currentStep = firstIncomplete >= 0 ? firstIncomplete : project.steps.length - 1;
    await saveProject(project);
    setProject({ ...project });
  };

  const openNoteModal = (stepId: string, docId: string, current: string) => {
    haptic();
    setNoteModal({ stepId, docId, current });
    setNoteText(current);
  };

  const saveNote = async () => {
    if (!project || !noteModal) return;
    const step = project.steps.find((s) => s.id === noteModal.stepId)!;
    const doc = step.documents.find((d) => d.id === noteModal.docId)!;
    doc.note = noteText;
    await saveProject(project);
    setProject({ ...project });
    setNoteModal(null);
  };

  if (!project) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>Ładowanie...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const STEP_COLORS = ["#8B5CF6", "#E07B1A", "#1A5FA8", "#22A45D", "#E11D48"];

  return (
    <ScreenContainer>
      <View style={{ backgroundColor: "#E07B1A", paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" }}>Projekt klienta</Text>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }} numberOfLines={1}>{project.foundationName}</Text>
          </View>
          <Pressable
            onPress={() => router.push({ pathname: "/statute-writer", params: { projectId: project.id } })}
            style={({ pressed }) => ({ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, opacity: pressed ? 0.7 : 1 })}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>✍️ Statut</Text>
          </Pressable>
        </View>
        <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
          Klient: {project.clientName}{project.phone ? ` · ${project.phone}` : ""}{project.email ? `\n${project.email}` : ""}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 16, gap: 6 }}>
          {project.steps.map((step, idx) => {
            const color = STEP_COLORS[idx] ?? "#999";
            const isDone = step.status === "done";
            const isActive = step.id === expandedStep;
            return (
              <Pressable key={step.id} onPress={() => { haptic(); setExpandedStep(isActive ? null : step.id); }} style={{ flex: 1, alignItems: "center" }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isDone ? color : isActive ? color + "22" : colors.border, alignItems: "center", justifyContent: "center", borderWidth: isActive ? 2 : 0, borderColor: color }}>
                  {isDone
                    ? <IconSymbol name="checkmark" size={14} color="#fff" />
                    : <Text style={{ color: isActive ? color : colors.muted, fontSize: 12, fontWeight: "800" }}>{idx + 1}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        {project.steps.map((step, idx) => {
          const color = STEP_COLORS[idx] ?? "#999";
          const isExpanded = expandedStep === step.id;
          const { total, approved, required, requiredApproved } = getStepCompletion(step);
          const isDone = step.status === "done";

          return (
            <View key={step.id} style={{ marginHorizontal: 16, marginBottom: 10 }}>
              <Pressable
                onPress={() => { haptic(); setExpandedStep(isExpanded ? null : step.id); }}
                style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: isDone ? color + "66" : colors.border, opacity: pressed ? 0.9 : 1 })}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: color + "22", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    {isDone ? <IconSymbol name="checkmark.circle.fill" size={20} color={color} /> : <Text style={{ color, fontSize: 15, fontWeight: "800" }}>{idx + 1}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>{step.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{approved}/{total} dok. · {requiredApproved}/{required} wymaganych</Text>
                  </View>
                  <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                </View>
                <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 10 }}>
                  <View style={{ height: 4, width: `${total > 0 ? (approved / total) * 100 : 0}%` as any, backgroundColor: color, borderRadius: 2 }} />
                </View>
              </Pressable>

              {isExpanded && (
                <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginTop: 4, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                  {step.documents.map((doc) => (
                    <DocRow key={doc.id} doc={doc} onCycle={() => cycleDocStatus(step.id, doc.id)} onNote={() => openNoteModal(step.id, doc.id, doc.note)} />
                  ))}
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", marginBottom: 6 }}>NOTATKA KONSULTANTA</Text>
                    <TextInput
                      value={step.consultantNote}
                      onChangeText={(text) => { step.consultantNote = text; setProject({ ...project }); }}
                      onBlur={() => saveProject(project)}
                      placeholder="Dodaj notatkę do tego kroku..."
                      placeholderTextColor={colors.muted}
                      multiline
                      style={{ backgroundColor: colors.background, borderRadius: 10, padding: 10, color: colors.foreground, fontSize: 13, borderWidth: 1, borderColor: colors.border, minHeight: 60, textAlignVertical: "top" }}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", marginBottom: 10 }}>LEGENDA — DOTKNIJ IKONĘ ABY ZMIENIĆ STATUS</Text>
          {(Object.entries(DOC_STATUS_CONFIG) as [DocumentStatus, typeof DOC_STATUS_CONFIG[DocumentStatus]][]).map(([key, cfg]) => (
            <View key={key} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <View style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: cfg.bg, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <IconSymbol name={cfg.icon as any} size={13} color={cfg.color} />
              </View>
              <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600" }}>{cfg.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {noteModal && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 12 }}>Notatka do dokumentu</Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="np. 'Klient ma dostarczyć do piątku'"
              placeholderTextColor={colors.muted}
              multiline
              autoFocus
              style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border, minHeight: 80, textAlignVertical: "top", marginBottom: 14 }}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable onPress={() => setNoteModal(null)} style={({ pressed }) => ({ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 })}>
                <Text style={{ color: colors.muted, fontWeight: "700" }}>Anuluj</Text>
              </Pressable>
              <Pressable onPress={saveNote} style={({ pressed }) => ({ flex: 1, backgroundColor: "#E07B1A", borderRadius: 12, padding: 14, alignItems: "center", opacity: pressed ? 0.8 : 1 })}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Zapisz</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
