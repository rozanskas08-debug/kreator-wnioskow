import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { LEGAL_ACTS_GRANTS, LegalAct } from "@/lib/data/modules-data";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

function LegalActCard({ act }: { act: LegalAct }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
      <Pressable onPress={() => { haptic(); setExpanded(!expanded); }} style={({ pressed }) => ({ padding: 16, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconSymbol name="doc.text.fill" size={20} color="#1E3A5F" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}>{act.shortName}</Text>
              </View>
              <Text style={{ color: colors.muted, fontSize: 11 }}>{act.date}</Text>
            </View>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", lineHeight: 19 }}>{act.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 17 }}>{act.description}</Text>
          </View>
          <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
        </View>
      </Pressable>

      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: 16, gap: 16 }}>
          {/* Key provisions */}
          <View>
            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", marginBottom: 8 }}>Kluczowe przepisy</Text>
            {act.keyProvisions.map((p, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                <View style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Text style={{ color: "#1E3A5F", fontSize: 9, fontWeight: "800" }}>§</Text>
                </View>
                <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, flex: 1 }}>{p}</Text>
              </View>
            ))}
          </View>

          {/* What is allowed */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 10 }}>✓</Text>
              </View>
              <Text style={{ color: "#16A34A", fontSize: 13, fontWeight: "800" }}>CO WOLNO</Text>
            </View>
            {act.whatIsAllowed.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                <Text style={{ color: "#16A34A", fontSize: 13 }}>•</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* What is not allowed */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 10 }}>✗</Text>
              </View>
              <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "800" }}>CZEGO NIE WOLNO</Text>
            </View>
            {act.whatIsNotAllowed.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                <Text style={{ color: "#DC2626", fontSize: 13 }}>•</Text>
                <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Link to ISAP */}
          <Pressable
            onPress={() => Linking.openURL(act.isapUrl)}
            style={({ pressed }) => ({ backgroundColor: "#EEF2FF", borderRadius: 10, padding: 12, flexDirection: "row", alignItems: "center", gap: 8, opacity: pressed ? 0.8 : 1 })}
          >
            <IconSymbol name="link" size={16} color="#1E3A5F" />
            <Text style={{ color: "#1E3A5F", fontSize: 13, fontWeight: "700", flex: 1 }}>Pełny tekst ustawy (ISAP)</Text>
            <IconSymbol name="arrow.up.right.square" size={14} color="#1E3A5F" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function LegalBasicsScreen() {
  const colors = useColors();
  const router = useRouter();

  const USEFUL_LINKS = [
    { name: "ISAP — Internetowy System Aktów Prawnych", url: "https://isap.sejm.gov.pl", desc: "Pełne teksty wszystkich ustaw" },
    { name: "NIW-CRSO — Programy FIO i PROO", url: "https://niw.gov.pl", desc: "Ogłoszenia konkursów, wytyczne" },
    { name: "Fundusze Europejskie", url: "https://www.funduszeeuropejskie.gov.pl", desc: "EFS+, EFRR, programy regionalne" },
    { name: "Poradnik NGO", url: "https://poradnik.ngo.pl", desc: "Praktyczne informacje dla NGO" },
    { name: "PARP — Polska Agencja Rozwoju Przedsiębiorczości", url: "https://www.parp.gov.pl", desc: "Dotacje dla firm i NGO" },
    { name: "Baza ofert NGO.pl", url: "https://bazy.ngo.pl/oferty-pracy", desc: "Oferty grantów i konkursów" },
  ];

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: "#1E3A5F", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, opacity: pressed ? 0.7 : 1 })}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" }}>Dashboard</Text>
          </Pressable>
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginBottom: 4 }}>Podstawy prawne</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 17 }}>Co wolno, czego nie wolno — minimum prawne dla wniosków o dofinansowanie</Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>
          {/* Info */}
          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FDE68A", marginBottom: 20 }}>
            <Text style={{ color: "#92400E", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>💡 Minimum prawne — nie przesadzaj</Text>
            <Text style={{ color: "#92400E", fontSize: 12, lineHeight: 17 }}>
              Nie musisz znać całego prawa. Wystarczy wiedzieć: co wolno wydatkować, czego nie wolno, jakie są zasady kwalifikowalności. Reszta to szczegóły regulaminów konkursowych.
            </Text>
          </View>

          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 14 }}>
            Kluczowe akty prawne ({LEGAL_ACTS_GRANTS.length})
          </Text>
          {LEGAL_ACTS_GRANTS.map((act) => (
            <LegalActCard key={act.id} act={act} />
          ))}

          {/* Useful links */}
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginBottom: 14, marginTop: 8 }}>Przydatne strony</Text>
          {USEFUL_LINKS.map((link, i) => (
            <Pressable
              key={i}
              onPress={() => Linking.openURL(link.url)}
              style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 12, opacity: pressed ? 0.8 : 1 })}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconSymbol name="link" size={18} color="#1E3A5F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>{link.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{link.desc}</Text>
              </View>
              <IconSymbol name="arrow.up.right.square" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
