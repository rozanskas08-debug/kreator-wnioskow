import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View, Alert, Modal, TextInput, Platform } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getAllProjects, deleteProject, saveProject, createProject, getProjectProgress } from "@/lib/supabase-storage";
import { GrantProject, PROJECT_STATUS_CONFIG, APPLICANT_TYPES, ApplicantType } from "@/lib/data/grant-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function ProjectCard({ project, onPress, onDelete }: { project: GrantProject; onPress: () => void; onDelete: () => void }) {
  const colors = useColors();
  const progress = getProjectProgress(project);
  const statusCfg = PROJECT_STATUS_CONFIG[project.status];
  const applicantType = APPLICANT_TYPES.find((t) => t.id === project.applicantType);

  return (
    <Pressable
      onPress={() => { haptic(); onPress(); }}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", lineHeight: 20 }} numberOfLines={2}>
            {project.title}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{project.applicantName}</Text>
        </View>
        <View style={{ backgroundColor: statusCfg.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
          <Text style={{ color: statusCfg.color, fontSize: 11, fontWeight: "700" }}>{statusCfg.label}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
        {project.competitionName ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
            <IconSymbol name="tag.fill" size={12} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 12 }} numberOfLines={1}>{project.competitionName}</Text>
          </View>
        ) : null}
        {project.requestedAmount > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <IconSymbol name="banknote.fill" size={12} color="#16A34A" />
            <Text style={{ color: "#16A34A", fontSize: 12, fontWeight: "600" }}>
              {project.requestedAmount.toLocaleString("pl-PL")} zł
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ color: colors.muted, fontSize: 11 }}>Postęp kreatora</Text>
          <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600" }}>{progress.doneSteps}/{progress.totalSteps} kroków</Text>
        </View>
        <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
          <View style={{ height: 4, backgroundColor: "#1E3A5F", borderRadius: 2, width: `${progress.pct}%` as any }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconSymbol name="building.2.fill" size={12} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 11 }}>{applicantType?.label ?? project.applicantType}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {project.submissionDeadline ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <IconSymbol name="calendar" size={12} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 11 }}>
                {new Date(project.submissionDeadline).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" })}
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={(e) => { e.stopPropagation(); haptic(); onDelete(); }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 2 })}
          >
            <IconSymbol name="trash.fill" size={16} color={colors.error} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [projects, setProjects] = useState<GrantProject[]>([]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, isLoading, router]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantType, setApplicantType] = useState<ApplicantType>("ngo");
  const [competition, setCompetition] = useState("");

  useFocusEffect(
    useCallback(() => {
      getAllProjects().then(setProjects);
    }, [])
  );

  const handleCreate = async () => {
    if (!title.trim() || !applicantName.trim()) {
      Alert.alert("Uzupełnij dane", "Tytuł projektu i nazwa wnioskodawcy są wymagane.");
      return;
    }
    haptic();
    const project = createProject(title.trim(), applicantName.trim(), applicantType, competition.trim());
    await saveProject(project);
    setTitle(""); setApplicantName(""); setCompetition(""); setApplicantType("ngo");
    setShowModal(false);
    router.push({ pathname: "/project/[id]", params: { id: project.id } });
  };

  const handleDelete = (id: string, t: string) => {
    Alert.alert("Usuń projekt", `Czy na pewno chcesz usunąć "${t}"?`, [
      { text: "Anuluj", style: "cancel" },
      { text: "Usuń", style: "destructive", onPress: async () => {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }},
    ]);
  };

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => ["draft", "in_progress"].includes(p.status)).length,
    submitted: projects.filter((p) => p.status === "submitted").length,
    approved: projects.filter((p) => p.status === "approved").length,
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="doc.text.fill" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>Panel Konsultanta</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>Kreator Wniosków</Text>
            </View>
            </View>
            <Pressable
              onPress={() => { haptic(); router.push("/settings"); }}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, alignItems: "center", justifyContent: "center" })}
            >
              <IconSymbol name="gearshape.fill" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { label: "Wszystkie", value: stats.total, color: "#FFFFFF" },
              { label: "W trakcie", value: stats.inProgress, color: "#FCD34D" },
              { label: "Złożone", value: stats.submitted, color: "#93C5FD" },
              { label: "Zatwierdzone", value: stats.approved, color: "#86EFAC" },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 10, alignItems: "center" }}>
                <Text style={{ color: s.color, fontSize: 20, fontWeight: "800" }}>{s.value}</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: "600", textAlign: "center", marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 12 }}>Szybki dostęp</Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {[
              { label: "Nowy\nWniosek", icon: "doc.badge.plus" as const, color: "#4F46E5", bg: "#EEF2FF", route: "/(tabs)/new-project" },
              { label: "Lista\nKontrolna", icon: "checkmark.rectangle.fill" as const, color: "#16A34A", bg: "#F0FDF4", route: "/(tabs)/checklist" },
              { label: "Baza\nDotacji", icon: "banknote.fill" as const, color: "#D97706", bg: "#FEF9C3", route: "/(tabs)/funding" },
              { label: "Matryca\nProjektu", icon: "chart.bar.fill" as const, color: "#DC2626", bg: "#FFF1F2", route: "/(tabs)/matrix" },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() => { haptic(); router.push(item.route as any); }}
                style={({ pressed }) => ({ flex: 1, backgroundColor: item.bg, borderRadius: 14, padding: 14, alignItems: "center", opacity: pressed ? 0.8 : 1 })}
              >
                <IconSymbol name={item.icon} size={24} color={item.color} />
                <Text style={{ color: item.color, fontSize: 10, fontWeight: "700", marginTop: 6, textAlign: "center" }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          {/* Expert tools row */}
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 4 }}>Narzędzia eksperta</Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {[
              { label: "Ekspert\nOcenia", icon: "brain" as const, color: "#1E3A5F", bg: "#EEF2FF", route: "/expert-review" },
              { label: "Logika\nProjektu", icon: "arrow.triangle.branch" as const, color: "#7C3AED", bg: "#F5F3FF", route: "/logic-generator" },
              { label: "Biblioteka\nFragmentów", icon: "text.quote" as const, color: "#0369A1", bg: "#E0F2FE", route: "/fragment-library" },
              { label: "Wytyczne\nKonkursów", icon: "star.fill" as const, color: "#D97706", bg: "#FEF9C3", route: "/competition-guidelines" },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() => { haptic(); router.push(item.route as any); }}
                style={({ pressed }) => ({ flex: 1, backgroundColor: item.bg, borderRadius: 14, padding: 14, alignItems: "center", opacity: pressed ? 0.8 : 1 })}
              >
                <IconSymbol name={item.icon} size={24} color={item.color} />
                <Text style={{ color: item.color, fontSize: 10, fontWeight: "700", marginTop: 6, textAlign: "center" }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {[
              { label: "Modele\nBudżetów", icon: "cart.fill" as const, color: "#16A34A", bg: "#F0FDF4", route: "/budget-models" },
              { label: "Podstawy\nPrawne", icon: "building.columns.fill" as const, color: "#DC2626", bg: "#FFF1F2", route: "/legal-basics" },
              { label: "Stwórz\nze mną 🤖", icon: "sparkles" as const, color: "#059669", bg: "#ECFDF5", route: "/guided-wizard" },
              { label: "NIE\nPRZEJDZIE 🔥", icon: "exclamationmark.triangle.fill" as const, color: "#B91C1C", bg: "#FEF2F2", route: "/ai-expert-review" },
              { label: "Historia\nOcen 📊", icon: "clock.fill" as const, color: "#0369A1", bg: "#E0F2FE", route: "/review-history" },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() => { haptic(); router.push(item.route as any); }}
                style={({ pressed }) => ({ flex: 1, backgroundColor: item.bg, borderRadius: 14, padding: 14, alignItems: "center", opacity: pressed ? 0.8 : 1 })}
              >
                <IconSymbol name={item.icon} size={24} color={item.color} />
                <Text style={{ color: item.color, fontSize: 10, fontWeight: "700", marginTop: 6, textAlign: "center" }}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Projects List */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, paddingBottom: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800" }}>Moje wnioski</Text>
            <Pressable
              onPress={() => { haptic(); setShowModal(true); }}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1E3A5F", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, opacity: pressed ? 0.8 : 1 })}
            >
              <IconSymbol name="plus" size={14} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}>Nowy wniosek</Text>
            </Pressable>
          </View>

          {projects.length === 0 ? (
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 32, alignItems: "center", borderWidth: 1, borderColor: colors.border }}>
              <IconSymbol name="doc.text.fill" size={48} color={colors.border} />
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 8 }}>Brak wniosków</Text>
              <Text style={{ color: colors.muted, fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 20 }}>
                Dodaj pierwszy wniosek o dofinansowanie, aby rozpocząć pracę.
              </Text>
              <Pressable
                onPress={() => { haptic(); setShowModal(true); }}
                style={({ pressed }) => ({ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, opacity: pressed ? 0.8 : 1 })}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>Dodaj pierwszy wniosek</Text>
              </Pressable>
            </View>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => router.push({ pathname: "/project/[id]", params: { id: project.id } })}
                onDelete={() => handleDelete(project.id, project.title)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* New Project Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Nowy wniosek</Text>
            <Pressable onPress={() => setShowModal(false)} style={{ padding: 6 }}>
              <IconSymbol name="xmark" size={20} color={colors.muted} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            <View>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Tytuł projektu *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="np. Kompetencje wychowawcze nauczycieli"
                placeholderTextColor={colors.muted}
                style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }}
              />
            </View>
            <View>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Nazwa wnioskodawcy *</Text>
              <TextInput
                value={applicantName}
                onChangeText={setApplicantName}
                placeholder="np. Fundacja Aktywni Razem"
                placeholderTextColor={colors.muted}
                style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }}
              />
            </View>
            <View>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 8 }}>Typ wnioskodawcy</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {APPLICANT_TYPES.map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => setApplicantType(t.id)}
                    style={{ flex: 1, backgroundColor: applicantType === t.id ? "#1E3A5F" : colors.surface, borderRadius: 10, padding: 10, alignItems: "center", borderWidth: 1, borderColor: applicantType === t.id ? "#1E3A5F" : colors.border }}
                  >
                    <Text style={{ color: applicantType === t.id ? "#FFFFFF" : colors.muted, fontSize: 10, fontWeight: "700", textAlign: "center" }}>
                      {t.id === "ngo" ? "NGO" : t.id === "business" ? "Firma" : "Instytucja"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 6 }}>Nazwa konkursu (opcjonalnie)</Text>
              <TextInput
                value={competition}
                onChangeText={setCompetition}
                placeholder="np. FIO 2025, PROO, Aktywni+"
                placeholderTextColor={colors.muted}
                style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, color: colors.foreground, fontSize: 14 }}
              />
            </View>
            <Pressable
              onPress={handleCreate}
              style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 14, padding: 16, alignItems: "center", marginTop: 8, opacity: pressed ? 0.8 : 1 })}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Utwórz wniosek</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
