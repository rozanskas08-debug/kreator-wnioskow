import { useState } from "react";
import { ScrollView, Text, View, Pressable, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

const VERDICT_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  "PRZEJDZIE": { color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC", label: "PRZEJDZIE ✅" },
  "RYZYKOWNY": { color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", label: "RYZYKOWNY ⚠️" },
  "NIE PRZEJDZIE": { color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", label: "NIE PRZEJDZIE ❌" },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ReviewHistoryScreen() {
  const colors = useColors();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: reviews, isLoading, error, refetch } = trpc.ai.getReviewHistory.useQuery({ limit: 50 });

  const passed = reviews?.filter(r => r.verdict === "PRZEJDZIE").length ?? 0;
  const risky = reviews?.filter(r => r.verdict === "RYZYKOWNY").length ?? 0;
  const failed = reviews?.filter(r => r.verdict === "NIE PRZEJDZIE").length ?? 0;
  const avgScore = reviews && reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + (r.overall_score ?? 0), 0) / reviews.length)
    : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <Pressable
          onPress={() => { haptic(); router.back(); }}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 6 })}
        >
          <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: "180deg" }] }} />
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Wróć</Text>
        </Pressable>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 4 }}>Historia ocen AI</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
          Wszystkie oceny wniosków — AI uczy się z tej historii
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={{ color: colors.muted, fontSize: 14 }}>Wczytywanie historii...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", textAlign: "center" }}>Błąd wczytywania</Text>
          <Text style={{ color: colors.muted, fontSize: 13, textAlign: "center" }}>Sprawdź połączenie z Supabase</Text>
          <Pressable
            onPress={() => { haptic(); refetch(); }}
            style={({ pressed }) => ({ backgroundColor: "#1E3A5F", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, opacity: pressed ? 0.8 : 1 })}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Spróbuj ponownie</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Stats summary */}
          {reviews && reviews.length > 0 && (
            <View style={{ backgroundColor: "#1E3A5F", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800", marginBottom: 12 }}>📊 Statystyki ocen</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, alignItems: "center" }}>
                  <Text style={{ color: "#4ADE80", fontSize: 20, fontWeight: "900" }}>{passed}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>Przejdzie</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, alignItems: "center" }}>
                  <Text style={{ color: "#FBBF24", fontSize: 20, fontWeight: "900" }}>{risky}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>Ryzykowny</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, alignItems: "center" }}>
                  <Text style={{ color: "#F87171", fontSize: 20, fontWeight: "900" }}>{failed}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>Nie przejdzie</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, alignItems: "center" }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "900" }}>{avgScore}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>Śr. wynik</Text>
                </View>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontStyle: "italic" }}>
                AI analizuje tę historię, żeby dawać coraz trafniejsze oceny
              </Text>
            </View>
          )}

          {/* Review list */}
          {!reviews || reviews.length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center", padding: 40, gap: 12 }}>
              <Text style={{ fontSize: 48 }}>📋</Text>
              <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800", textAlign: "center" }}>Brak historii ocen</Text>
              <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", lineHeight: 20 }}>
                Oceń swój pierwszy wniosek przez "NIE PRZEJDZIE 🔥", a wyniki pojawią się tutaj
              </Text>
            </View>
          ) : (
            reviews.map((review) => {
              const vc = VERDICT_CONFIG[review.verdict] ?? VERDICT_CONFIG["NIE PRZEJDZIE"];
              const isExpanded = expanded === review.id;
              return (
                <Pressable
                  key={review.id}
                  onPress={() => { haptic(); setExpanded(isExpanded ? null : review.id); }}
                  style={({ pressed }) => ({
                    backgroundColor: vc.bg,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: vc.border,
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  {/* Header row */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", marginBottom: 2 }} numberOfLines={2}>
                        {review.project_title}
                      </Text>
                      {review.competition_name && (
                        <Text style={{ color: colors.muted, fontSize: 11 }}>{review.competition_name}</Text>
                      )}
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <View style={{ backgroundColor: vc.color, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>{review.overall_score}/100</Text>
                      </View>
                      <Text style={{ color: vc.color, fontSize: 10, fontWeight: "700" }}>{vc.label}</Text>
                    </View>
                  </View>

                  {/* Date */}
                  <Text style={{ color: colors.muted, fontSize: 11, marginBottom: isExpanded ? 10 : 0 }}>
                    {review.created_at ? formatDate(review.created_at) : ""}
                  </Text>

                  {/* Expanded details */}
                  {isExpanded && (
                    <View style={{ borderTopWidth: 1, borderTopColor: vc.border, paddingTop: 10, gap: 8 }}>
                      {review.expert_comment && (
                        <View>
                          <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", marginBottom: 3 }}>KOMENTARZ EKSPERTA</Text>
                          <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 18, fontStyle: "italic" }}>
                            "{review.expert_comment}"
                          </Text>
                        </View>
                      )}
                      {review.critical_errors && review.critical_errors.length > 0 && (
                        <View>
                          <Text style={{ color: "#DC2626", fontSize: 11, fontWeight: "700", marginBottom: 3 }}>KRYTYCZNE BŁĘDY</Text>
                          {review.critical_errors.map((e: string, i: number) => (
                            <Text key={i} style={{ color: "#DC2626", fontSize: 12, marginBottom: 2 }}>• {e}</Text>
                          ))}
                        </View>
                      )}
                      {review.improvements && review.improvements.length > 0 && (
                        <View>
                          <Text style={{ color: "#1D4ED8", fontSize: 11, fontWeight: "700", marginBottom: 3 }}>CO POPRAWIĆ</Text>
                          {review.improvements.map((imp: string, i: number) => (
                            <Text key={i} style={{ color: "#1D4ED8", fontSize: 12, marginBottom: 2 }}>→ {imp}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  )}

                  {/* Expand hint */}
                  <Text style={{ color: colors.muted, fontSize: 10, marginTop: 4, textAlign: "right" }}>
                    {isExpanded ? "▲ zwiń" : "▼ rozwiń szczegóły"}
                  </Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
