import { useState, useCallback, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Modal,
  Alert,
  Share,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getEditableStatute,
  buildStatuteText,
  countPlaceholders,
  STATUTE_SECTIONS,
  type StatuteParagraph,
} from "@/lib/data/statute-template";

function haptic(style: "light" | "medium" = "light") {
  if (Platform.OS !== "web") {
    if (style === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  required: { bg: "#FEF3E8", text: "#E07B1A", label: "Obowiązkowy" },
  optional: { bg: "#E8F7EF", text: "#22A45D", label: "Opcjonalny" },
  fill_in: { bg: "#E8F0FB", text: "#1A5FA8", label: "Do wypełnienia" },
};

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] ?? TYPE_COLORS.required;
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: c.text, fontSize: 10, fontWeight: "700" }}>{c.label}</Text>
    </View>
  );
}

function PlaceholderHighlight({ text }: { text: string }) {
  const colors = useColors();
  // Split text by [[...]] placeholders
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 21 }}>
      {parts.map((part, i) => {
        if (part.startsWith("[[") && part.endsWith("]]")) {
          return (
            <Text key={i} style={{ color: "#E07B1A", fontWeight: "700", backgroundColor: "#FEF3E8" }}>
              {part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

export default function StatuteTemplateScreen() {
  const colors = useColors();
  const router = useRouter();
  const [paragraphs, setParagraphs] = useState<StatuteParagraph[]>(getEditableStatute);
  const [mode, setMode] = useState<"list" | "preview">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>("general");
  const [showHint, setShowHint] = useState<string | null>(null);

  const editingParagraph = paragraphs.find((p) => p.id === editingId);
  const unfilled = countPlaceholders(paragraphs);
  const enabledCount = paragraphs.filter((p) => p.enabled).length;

  const openEdit = useCallback((p: StatuteParagraph) => {
    haptic();
    setEditingId(p.id);
    setEditText(p.text);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingId) return;
    haptic("medium");
    setParagraphs((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, text: editText } : p))
    );
    setEditingId(null);
  }, [editingId, editText]);

  const toggleEnabled = useCallback((id: string) => {
    haptic();
    setParagraphs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  }, []);

  const handleReset = () => {
    Alert.alert(
      "Resetuj szablon",
      "Wszystkie zmiany zostaną utracone. Czy na pewno chcesz przywrócić domyślny szablon?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Resetuj",
          style: "destructive",
          onPress: () => {
            haptic("medium");
            setParagraphs(getEditableStatute());
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    haptic();
    const text = buildStatuteText(paragraphs);
    if (unfilled > 0) {
      Alert.alert(
        "Niezapisane miejsca",
        `Statut zawiera ${unfilled} nieuzupełnionych miejsc oznaczonych [[...]]. Czy mimo to chcesz go udostępnić?`,
        [
          { text: "Anuluj", style: "cancel" },
          { text: "Udostępnij", onPress: () => Share.share({ message: text, title: "Statut Fundacji" }) },
        ]
      );
    } else {
      await Share.share({ message: text, title: "Statut Fundacji" });
    }
  };

  return (
    <ScreenContainer>
      {/* ── Header ── */}
      <View style={{ backgroundColor: "#1A5FA8", paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Pressable onPress={() => { haptic(); router.back(); }} style={{ marginRight: 12, padding: 4 }}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase" }}>
              Narzędzie konsultanta
            </Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>Szablon Statutu Fundacji</Text>
          </View>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => ({
              backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 10, opacity: pressed ? 0.7 : 1,
            })}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>{enabledCount}</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "600" }}>Aktywnych §</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: unfilled > 0 ? "rgba(239,68,68,0.25)" : "rgba(34,164,93,0.25)", borderRadius: 10, padding: 10, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>{unfilled}</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "600" }}>
              {unfilled === 0 ? "Gotowy!" : "Do uzupełnienia"}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, alignItems: "center" }}>
            <Pressable onPress={() => { haptic(); setMode(mode === "list" ? "preview" : "list"); }}>
              <IconSymbol name={mode === "list" ? "doc.text.fill" : "list.bullet"} size={18} color="#fff" />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "600", marginTop: 2 }}>
                {mode === "list" ? "Podgląd" : "Edycja"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Info banner ── */}
      {unfilled > 0 && (
        <View style={{ backgroundColor: "#FEF3E8", paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#E07B1A" />
          <Text style={{ color: "#E07B1A", fontSize: 12, fontWeight: "600", flex: 1 }}>
            Uzupełnij {unfilled} miejsc oznaczonych [[...]] przed wysłaniem klientowi.
          </Text>
        </View>
      )}

      {mode === "preview" ? (
        /* ── PREVIEW MODE ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 20 }}>
              STATUT FUNDACJI
            </Text>
            {STATUTE_SECTIONS.map((section) => {
              const sectionParagraphs = paragraphs.filter(
                (p) => p.section === section.id && p.enabled
              );
              if (sectionParagraphs.length === 0) return null;
              return (
                <View key={section.id} style={{ marginBottom: 20 }}>
                  <Text style={{ color: section.color, fontSize: 13, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                    {section.title}
                  </Text>
                  {sectionParagraphs.map((p) => (
                    <View key={p.id} style={{ marginBottom: 16 }}>
                      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", marginBottom: 6 }}>
                        {p.number}
                      </Text>
                      <PlaceholderHighlight text={p.text} />
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => ({
              backgroundColor: "#1A5FA8", borderRadius: 14, padding: 16, alignItems: "center",
              marginTop: 20, flexDirection: "row", justifyContent: "center", gap: 8,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <IconSymbol name="square.and.arrow.up" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Udostępnij statut</Text>
          </Pressable>
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => ({
              backgroundColor: colors.surface, borderRadius: 14, padding: 14, alignItems: "center",
              marginTop: 10, borderWidth: 1, borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600" }}>Resetuj do domyślnego</Text>
          </Pressable>
        </ScrollView>
      ) : (
        /* ── LIST / EDIT MODE ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {STATUTE_SECTIONS.map((section) => {
            const sectionParagraphs = paragraphs.filter((p) => p.section === section.id);
            const isExpanded = expandedSection === section.id;
            const activeCount = sectionParagraphs.filter((p) => p.enabled).length;

            return (
              <View key={section.id} style={{ marginBottom: 4 }}>
                {/* Section header */}
                <Pressable
                  onPress={() => { haptic(); setExpandedSection(isExpanded ? null : section.id); }}
                  style={({ pressed }) => ({
                    flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14,
                    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: section.color, marginRight: 12 }} />
                  <Text style={{ flex: 1, color: colors.foreground, fontSize: 14, fontWeight: "800" }}>
                    {section.title}
                  </Text>
                  <View style={{ backgroundColor: section.color + "22", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 8 }}>
                    <Text style={{ color: section.color, fontSize: 11, fontWeight: "700" }}>{activeCount}/{sectionParagraphs.length}</Text>
                  </View>
                  <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                </Pressable>

                {/* Paragraphs */}
                {isExpanded && sectionParagraphs.map((p) => {
                  const hasPlaceholders = p.text.includes("[[");
                  const placeholderCount = (p.text.match(/\[\[.*?\]\]/g) || []).length;

                  return (
                    <View
                      key={p.id}
                      style={{
                        marginHorizontal: 12, marginTop: 8, borderRadius: 14,
                        backgroundColor: p.enabled ? colors.background : colors.surface,
                        borderWidth: 1.5,
                        borderColor: !p.enabled ? colors.border : hasPlaceholders && p.enabled ? "#E07B1A" : "#22A45D",
                        opacity: p.enabled ? 1 : 0.6,
                        overflow: "hidden",
                      }}
                    >
                      {/* Paragraph header */}
                      <View style={{ flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <Text style={{ color: section.color, fontSize: 13, fontWeight: "800" }}>{p.number}</Text>
                            <TypeBadge type={p.type} />
                            {hasPlaceholders && p.enabled && (
                              <View style={{ backgroundColor: "#FEF3E8", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
                                <Text style={{ color: "#E07B1A", fontSize: 10, fontWeight: "700" }}>
                                  {placeholderCount} do uzupełnienia
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>{p.title}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          {p.hint && (
                            <Pressable
                              onPress={() => { haptic(); setShowHint(showHint === p.id ? null : p.id); }}
                              style={{ padding: 4 }}
                            >
                              <IconSymbol name="info.circle.fill" size={18} color={showHint === p.id ? "#1A5FA8" : colors.muted} />
                            </Pressable>
                          )}
                          {p.type === "optional" && (
                            <Switch
                              value={p.enabled}
                              onValueChange={() => toggleEnabled(p.id)}
                              trackColor={{ false: colors.border, true: "#22A45D" }}
                              thumbColor="#fff"
                              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                          )}
                        </View>
                      </View>

                      {/* Hint */}
                      {showHint === p.id && p.hint && (
                        <View style={{ backgroundColor: "#E8F0FB", padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                          <Text style={{ color: "#1A5FA8", fontSize: 12, lineHeight: 18 }}>
                            💡 {p.hint}
                          </Text>
                        </View>
                      )}

                      {/* Paragraph text preview */}
                      {p.enabled && (
                        <View style={{ padding: 14 }}>
                          <PlaceholderHighlight text={p.text.length > 200 ? p.text.slice(0, 200) + "…" : p.text} />
                          <Pressable
                            onPress={() => openEdit(p)}
                            style={({ pressed }) => ({
                              marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "center",
                              backgroundColor: "#1A5FA8", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16,
                              gap: 6, opacity: pressed ? 0.85 : 1,
                            })}
                          >
                            <IconSymbol name="pencil" size={14} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Edytuj paragraf</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  );
                })}
                {isExpanded && <View style={{ height: 8 }} />}
              </View>
            );
          })}

          {/* Bottom actions */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 10 }}>
            <Pressable
              onPress={() => { haptic(); setMode("preview"); }}
              style={({ pressed }) => ({
                backgroundColor: "#1A5FA8", borderRadius: 14, padding: 16, alignItems: "center",
                flexDirection: "row", justifyContent: "center", gap: 8, opacity: pressed ? 0.85 : 1,
              })}
            >
              <IconSymbol name="doc.text.fill" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Podgląd pełnego statutu</Text>
            </Pressable>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => ({
                backgroundColor: colors.surface, borderRadius: 14, padding: 14, alignItems: "center",
                borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600" }}>Resetuj do domyślnego</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* ── Edit Modal ── */}
      <Modal
        visible={editingId !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditingId(null)}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Modal header */}
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Edycja paragrafu
              </Text>
              <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800" }}>
                {editingParagraph?.number} — {editingParagraph?.title}
              </Text>
            </View>
            <Pressable onPress={() => setEditingId(null)} style={{ padding: 6 }}>
              <IconSymbol name="xmark" size={20} color={colors.muted} />
            </Pressable>
          </View>

          {/* Hint in modal */}
          {editingParagraph?.hint && (
            <View style={{ backgroundColor: "#E8F0FB", margin: 16, borderRadius: 12, padding: 14, flexDirection: "row", gap: 8 }}>
              <IconSymbol name="info.circle.fill" size={16} color="#1A5FA8" />
              <Text style={{ color: "#1A5FA8", fontSize: 12, lineHeight: 18, flex: 1 }}>
                {editingParagraph.hint}
              </Text>
            </View>
          )}

          {/* Placeholder guide */}
          <View style={{ backgroundColor: "#FEF3E8", marginHorizontal: 16, borderRadius: 12, padding: 12, flexDirection: "row", gap: 8 }}>
            <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#E07B1A" />
            <Text style={{ color: "#E07B1A", fontSize: 11, lineHeight: 17, flex: 1 }}>
              Miejsca do uzupełnienia oznaczone są [[...]]. Zastąp je właściwymi danymi klienta lub usuń całą linię jeśli nie dotyczy.
            </Text>
          </View>

          {/* Text editor */}
          <ScrollView style={{ flex: 1, padding: 16 }}>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
              textAlignVertical="top"
              style={{
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 16,
                color: colors.foreground,
                fontSize: 14,
                lineHeight: 22,
                borderWidth: 1.5,
                borderColor: "#1A5FA8",
                minHeight: 300,
              }}
            />
          </ScrollView>

          {/* Save button */}
          <View style={{ padding: 16, paddingBottom: 32, gap: 10 }}>
            <Pressable
              onPress={saveEdit}
              style={({ pressed }) => ({
                backgroundColor: "#1A5FA8", borderRadius: 14, padding: 16, alignItems: "center",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>Zapisz zmiany</Text>
            </Pressable>
            <Pressable
              onPress={() => setEditingId(null)}
              style={({ pressed }) => ({
                backgroundColor: colors.surface, borderRadius: 14, padding: 14, alignItems: "center",
                borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: colors.muted, fontSize: 14, fontWeight: "600" }}>Anuluj</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
