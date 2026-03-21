import { useState } from "react";
import { ScrollView, Pressable, Text, TextInput, View, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

interface MatrixRow {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  columns: {
    goal: string;
    indicator: string;
    verification: string;
    assumptions: string;
  };
}

const INITIAL_MATRIX: MatrixRow[] = [
  {
    id: "goal",
    label: "Cel ogólny",
    description: "Długoterminowy efekt projektu",
    color: "#1E3A5F",
    icon: "star.fill",
    columns: { goal: "", indicator: "", verification: "", assumptions: "" },
  },
  {
    id: "specific_goal",
    label: "Cel szczegółowy",
    description: "Bezpośredni efekt dla grupy docelowej",
    color: "#7C3AED",
    icon: "target",
    columns: { goal: "", indicator: "", verification: "", assumptions: "" },
  },
  {
    id: "results",
    label: "Rezultaty",
    description: "Produkty i usługi projektu",
    color: "#D97706",
    icon: "checkmark.circle.fill",
    columns: { goal: "", indicator: "", verification: "", assumptions: "" },
  },
  {
    id: "activities",
    label: "Działania",
    description: "Co robimy, żeby osiągnąć rezultaty",
    color: "#059669",
    icon: "list.bullet",
    columns: { goal: "", indicator: "", verification: "", assumptions: "" },
  },
];

const COLUMN_LABELS = [
  { id: "goal" as const, label: "Opis / Cel", hint: "Co chcemy osiągnąć?" },
  { id: "indicator" as const, label: "Wskaźniki", hint: "Jak zmierzymy sukces?" },
  { id: "verification" as const, label: "Weryfikacja", hint: "Skąd będziemy wiedzieć?" },
  { id: "assumptions" as const, label: "Założenia", hint: "Co musi być spełnione?" },
];

type ColId = "goal" | "indicator" | "verification" | "assumptions";

function CellEditor({
  value,
  onSave,
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  placeholder: string;
}) {
  const colors = useColors();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <View>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          multiline
          autoFocus
          style={{
            color: colors.foreground,
            fontSize: 12,
            lineHeight: 18,
            borderWidth: 1,
            borderColor: "#1E3A5F",
            borderRadius: 6,
            padding: 6,
            minHeight: 60,
            backgroundColor: colors.background,
          }}
        />
        <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
          <Pressable
            onPress={() => { haptic(); onSave(draft); setEditing(false); }}
            style={({ pressed }) => ({
              flex: 1, backgroundColor: "#1E3A5F", borderRadius: 6, padding: 6,
              alignItems: "center", opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>Zapisz</Text>
          </Pressable>
          <Pressable
            onPress={() => { setDraft(value); setEditing(false); }}
            style={({ pressed }) => ({
              flex: 1, backgroundColor: colors.surface, borderRadius: 6, padding: 6,
              alignItems: "center", borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600" }}>Anuluj</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => { haptic(); setDraft(value); setEditing(true); }}
      style={({ pressed }) => ({
        minHeight: 50, padding: 6, borderRadius: 6,
        backgroundColor: value ? "transparent" : colors.surface,
        borderWidth: value ? 0 : 1,
        borderColor: colors.border,
        borderStyle: "dashed",
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {value ? (
        <Text style={{ color: "#1E3A5F", fontSize: 12, lineHeight: 18 }}>{value}</Text>
      ) : (
        <Text style={{ color: colors.muted, fontSize: 11, fontStyle: "italic" }}>{placeholder}</Text>
      )}
    </Pressable>
  );
}

export default function MatrixScreen() {
  const colors = useColors();
  const [matrix, setMatrix] = useState<MatrixRow[]>(INITIAL_MATRIX);
  const [projectTitle, setProjectTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);

  const updateCell = (rowId: string, colId: ColId, value: string) => {
    setMatrix((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, columns: { ...row.columns, [colId]: value } }
          : row
      )
    );
  };

  const filledCells = matrix.reduce((acc, row) => {
    return acc + Object.values(row.columns).filter((v) => v.trim().length > 0).length;
  }, 0);
  const totalCells = matrix.length * 4;
  const pct = Math.round((filledCells / totalCells) * 100);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Logika projektu</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 12 }}>Matryca Projektu</Text>

        {/* Project title */}
        {editingTitle ? (
          <TextInput
            value={projectTitle}
            onChangeText={setProjectTitle}
            placeholder="Wpisz tytuł projektu..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            onBlur={() => setEditingTitle(false)}
            autoFocus
            style={{
              color: "#FFFFFF", fontSize: 14, backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 8, padding: 10, marginBottom: 10,
            }}
          />
        ) : (
          <Pressable
            onPress={() => { haptic(); setEditingTitle(true); }}
            style={({ pressed }) => ({
              backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 8, padding: 10,
              marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 8,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <IconSymbol name="pencil" size={14} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: projectTitle ? "#FFFFFF" : "rgba(255,255,255,0.4)", fontSize: 14 }}>
              {projectTitle || "Kliknij aby wpisać tytuł projektu..."}
            </Text>
          </Pressable>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Wypełniono: {filledCells}/{totalCells} pól ({pct}%)</Text>
          <View style={{ height: 4, flex: 1, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, marginLeft: 12 }}>
            <View style={{ height: 4, backgroundColor: pct >= 75 ? "#86EFAC" : "#FCD34D", borderRadius: 2, width: `${pct}%` as any }} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Info box */}
        <View style={{ backgroundColor: "#EFF6FF", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#1D4ED8" }}>
          <Text style={{ color: "#1D4ED8", fontSize: 12, fontWeight: "700", marginBottom: 4 }}>💡 Jak używać matrycy?</Text>
          <Text style={{ color: "#1E40AF", fontSize: 12, lineHeight: 18 }}>
            Matryca logiczna projektu (Logical Framework Approach) to narzędzie planowania stosowane w większości konkursów UE i krajowych. Wypełnij każdą komórkę dotykając jej.
          </Text>
        </View>

        {/* Column headers */}
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <View style={{ width: 90 }} />
          {COLUMN_LABELS.map((col) => (
            <View key={col.id} style={{ flex: 1, paddingHorizontal: 4, alignItems: "center" }}>
              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "700", textAlign: "center" }}>{col.label}</Text>
              <Text style={{ color: colors.muted, fontSize: 9, textAlign: "center", marginTop: 1 }}>{col.hint}</Text>
            </View>
          ))}
        </View>

        {/* Matrix rows */}
        {matrix.map((row, rowIdx) => (
          <View
            key={row.id}
            style={{
              flexDirection: "row",
              marginBottom: 8,
              backgroundColor: colors.surface,
              borderRadius: 12,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Row label */}
            <View style={{ width: 90, backgroundColor: row.color, padding: 10, justifyContent: "center", alignItems: "center" }}>
              <IconSymbol name={row.icon as any} size={20} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700", textAlign: "center", marginTop: 4 }}>{row.label}</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, textAlign: "center", marginTop: 2 }}>{row.description}</Text>
            </View>

            {/* Cells */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              {COLUMN_LABELS.map((col, colIdx) => (
                <View
                  key={col.id}
                  style={{
                    flex: 1,
                    padding: 8,
                    borderLeftWidth: 1,
                    borderLeftColor: colors.border,
                  }}
                >
                  <CellEditor
                    value={row.columns[col.id]}
                    onSave={(v) => updateCell(row.id, col.id, v)}
                    placeholder={`${row.label} — ${col.label}`}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Tips */}
        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, padding: 14, marginTop: 8, borderWidth: 1, borderColor: "#86EFAC" }}>
          <Text style={{ color: "#16A34A", fontSize: 13, fontWeight: "700", marginBottom: 8 }}>✅ Wskazówki do matrycy</Text>
          {[
            "Cel ogólny → długoterminowy wpływ na społeczeństwo (nie tylko na beneficjentów)",
            "Cel szczegółowy → bezpośredni efekt dla grupy docelowej po zakończeniu projektu",
            "Rezultaty → konkretne produkty: szkolenia, materiały, certyfikaty, raporty",
            "Działania → co robimy: warsztaty, spotkania, kampanie, rekrutacja",
            "Wskaźniki muszą być mierzalne (liczby, procenty, daty)",
            "Weryfikacja: listy obecności, ankiety, testy, raporty, zdjęcia",
          ].map((tip, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
              <Text style={{ color: "#16A34A", fontSize: 12 }}>•</Text>
              <Text style={{ color: "#166534", fontSize: 12, flex: 1, lineHeight: 18 }}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
