import { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, Switch, Platform, Share } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { generateStatute, generateStatuteText, emptyStatuteForm } from "@/lib/statute-generator";
import type { StatuteFormData } from "@/lib/data/client-types";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

type Tab = "form" | "preview";

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType, hint }: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; multiline?: boolean; keyboardType?: any; hint?: string;
}) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700", marginBottom: 5 }}>{label}</Text>
      {hint ? <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 5, lineHeight: 16 }}>{hint}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        style={{
          backgroundColor: colors.surface, borderRadius: 10, padding: 12,
          color: colors.foreground, fontSize: 14, borderWidth: 1, borderColor: colors.border,
          minHeight: multiline ? 70 : undefined, textAlignVertical: multiline ? "top" : undefined,
        }}
      />
    </View>
  );
}

function Toggle({ label, value, onValueChange, hint }: { label: string; value: boolean; onValueChange: (v: boolean) => void; hint?: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>{label}</Text>
        {hint ? <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: "#E07B1A" }} />
    </View>
  );
}

export default function StatuteWriterScreen() {
  const colors = useColors();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("form");
  const [form, setForm] = useState<StatuteFormData>(emptyStatuteForm());
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [purposes, setPurposes] = useState<string[]>(["", ""]);

  const update = (key: keyof StatuteFormData, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const sections = generateStatute({ ...form, purposes: purposes.filter((p) => p.trim()) });

  const handleShare = async () => {
    haptic();
    const text = generateStatuteText({ ...form, purposes: purposes.filter((p) => p.trim()) });
    await Share.share({ message: text, title: "Statut Fundacji " + form.foundationName });
  };

  const isFormReady = !!(form.foundationName.trim() && form.foundationCity.trim() && form.founderName.trim() && purposes.some((p) => p.trim()));

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={{ backgroundColor: "#E07B1A", paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" }}>Narzedzie konsultanta</Text>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Kreator Statutu Fundacji</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 3 }}>
          {(["form", "preview"] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => { haptic(); setTab(t); }}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center", backgroundColor: tab === t ? "#fff" : "transparent" }}
            >
              <Text style={{ color: tab === t ? "#E07B1A" : "#fff", fontSize: 13, fontWeight: "700" }}>
                {t === "form" ? "Formularz" : "Podglad statutu"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tab === "form" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Dane podstawowe */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 14 }}>Dane podstawowe</Text>
            <Field label="Nazwa fundacji *" value={form.foundationName} onChangeText={(v) => update("foundationName", v)} placeholder="np. Fundacja Pomocna Dlon" hint="Musi zawierac slowo Fundacja" />
            <Field label="Siedziba (miejscowosc) *" value={form.foundationCity} onChangeText={(v) => update("foundationCity", v)} placeholder="np. Warszawa" hint="Podaj tylko miejscowosc, nie ulice" />
            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>Teren dzialania</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
              {(["poland", "world"] as const).map((v) => (
                <Pressable
                  key={v}
                  onPress={() => { haptic(); update("operationArea", v); }}
                  style={{ flex: 1, backgroundColor: form.operationArea === v ? "#FEF3E8" : colors.background, borderRadius: 8, padding: 10, alignItems: "center", borderWidth: 1, borderColor: form.operationArea === v ? "#E07B1A" : colors.border }}
                >
                  <Text style={{ color: form.operationArea === v ? "#E07B1A" : colors.muted, fontSize: 12, fontWeight: "700" }}>
                    {v === "poland" ? "Polska" : "Caly swiat"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Fundator */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 14 }}>Fundator</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
              {(["person", "company"] as const).map((v) => (
                <Pressable
                  key={v}
                  onPress={() => { haptic(); update("founderType", v); }}
                  style={{ flex: 1, backgroundColor: form.founderType === v ? "#FEF3E8" : colors.background, borderRadius: 8, padding: 10, alignItems: "center", borderWidth: 1, borderColor: form.founderType === v ? "#E07B1A" : colors.border }}
                >
                  <Text style={{ color: form.founderType === v ? "#E07B1A" : colors.muted, fontSize: 12, fontWeight: "700" }}>
                    {v === "person" ? "Osoba fizyczna" : "Osoba prawna"}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Field
              label={form.founderType === "person" ? "Imie i nazwisko fundatora *" : "Nazwa firmy *"}
              value={form.founderName}
              onChangeText={(v) => update("founderName", v)}
              placeholder={form.founderType === "person" ? "np. Anna Kowalska" : "np. Spolka XYZ Sp. z o.o."}
            />
            <Field label="Adres fundatora" value={form.founderAddress} onChangeText={(v) => update("founderAddress", v)} placeholder="np. ul. Kwiatowa 1, 00-001 Warszawa" />
          </View>

          {/* Fundusz */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 14 }}>Fundusz zalozycielski</Text>
            <Field
              label="Kwota funduszu (zl) *"
              value={form.initialFund}
              onChangeText={(v) => update("initialFund", v)}
              placeholder="np. 1000"
              keyboardType="numeric"
              hint="Brak ustawowego minimum. W praktyce min. 500-1000 zl. Przy dzialalnosci gosp. min. 1000 zl."
            />
          </View>

          {/* Cele */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 4 }}>Cele fundacji *</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
              Wpisz cele fundacji. Musza byc spolecznie lub gospodarczo uzyteczne.
            </Text>
            {purposes.map((p, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "#FEF3E8", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                  <Text style={{ color: "#E07B1A", fontSize: 11, fontWeight: "800" }}>{i + 1}</Text>
                </View>
                <TextInput
                  value={p}
                  onChangeText={(v) => { const next = [...purposes]; next[i] = v; setPurposes(next); }}
                  placeholder="np. wspieranie edukacji dzieci"
                  placeholderTextColor={colors.muted}
                  style={{ flex: 1, backgroundColor: colors.background, borderRadius: 8, padding: 10, color: colors.foreground, fontSize: 13, borderWidth: 1, borderColor: colors.border }}
                />
                {purposes.length > 1 && (
                  <Pressable onPress={() => setPurposes(purposes.filter((_, j) => j !== i))} style={{ padding: 8 }}>
                    <IconSymbol name="xmark" size={14} color={colors.muted} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable
              onPress={() => setPurposes([...purposes, ""])}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, opacity: pressed ? 0.7 : 1 })}
            >
              <IconSymbol name="plus" size={14} color="#E07B1A" />
              <Text style={{ color: "#E07B1A", fontSize: 13, fontWeight: "600" }}>Dodaj cel</Text>
            </Pressable>
          </View>

          {/* Zarzad */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 14 }}>Zarzad fundacji</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="Min. czlonkow" value={form.boardMinMembers} onChangeText={(v) => update("boardMinMembers", v)} keyboardType="numeric" placeholder="1" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Max. czlonkow" value={form.boardMaxMembers} onChangeText={(v) => update("boardMaxMembers", v)} keyboardType="numeric" placeholder="3" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Kadencja (lata)" value={form.boardTermYears} onChangeText={(v) => update("boardTermYears", v)} keyboardType="numeric" placeholder="3" />
              </View>
            </View>
            <Field
              label="Sposob reprezentacji"
              value={form.boardRepresentation}
              onChangeText={(v) => update("boardRepresentation", v)}
              placeholder="np. Prezes Zarzadu samodzielnie"
              hint="Kto i jak podpisuje dokumenty w imieniu fundacji"
            />
          </View>

          {/* Opcje */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 10 }}>Opcje dodatkowe</Text>
            <Toggle label="Dzialalnosc gospodarcza" value={form.hasEconomicActivity} onValueChange={(v) => update("hasEconomicActivity", v)} hint="Fundacja bedzie prowadzic dzialalnosc zarobkowa" />
            <Toggle label="Rada Fundacji / organ nadzorczy" value={form.hasSupervisoryBoard} onValueChange={(v) => update("hasSupervisoryBoard", v)} hint="Dodatkowy organ kontrolny (opcjonalny)" />
            {form.hasSupervisoryBoard && (
              <View style={{ marginTop: 10 }}>
                <Field label="Nazwa organu nadzorczego" value={form.supervisoryBoardName ?? ""} onChangeText={(v) => update("supervisoryBoardName", v)} placeholder="np. Rada Fundacji" />
              </View>
            )}
            <Toggle label="Organizacja Pozytku Publicznego (OPP)" value={form.hasOPP} onValueChange={(v) => update("hasOPP", v)} hint="Planuje uzyskac status OPP (1% podatku)" />
          </View>

          {/* Likwidacja */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginBottom: 14 }}>Likwidacja</Text>
            <Field
              label="Beneficjent majatku po likwidacji"
              value={form.liquidationBeneficiary ?? ""}
              onChangeText={(v) => update("liquidationBeneficiary", v)}
              placeholder="np. Fundacja XYZ o zblizonych celach"
              hint="Komu trafia majatek fundacji po jej rozwiazaniu"
            />
          </View>

          <Pressable
            onPress={() => { haptic(); setTab("preview"); }}
            style={({ pressed }) => ({ backgroundColor: "#E07B1A", borderRadius: 14, padding: 16, alignItems: "center", opacity: pressed ? 0.85 : 1 })}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>Podglad statutu</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {!isFormReady && (
            <View style={{ backgroundColor: "#FEF3E8", borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <Text style={{ color: "#E07B1A", fontSize: 13, lineHeight: 19 }}>
                Uzupelnij: nazwe fundacji, siedzibe, dane fundatora i co najmniej jeden cel.
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => ({ flex: 1, backgroundColor: "#E07B1A", borderRadius: 12, padding: 12, alignItems: "center", opacity: pressed ? 0.8 : 1 })}
            >
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Udostepnij statut</Text>
            </Pressable>
          </View>
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", textAlign: "center" }}>STATUT FUNDACJI</Text>
            <Text style={{ color: "#E07B1A", fontSize: 18, fontWeight: "800", textAlign: "center", marginTop: 4 }}>
              {form.foundationName || "[nazwa fundacji]"}
            </Text>
          </View>
          {sections.map((section) => (
            <View key={section.id} style={{ marginBottom: 10 }}>
              <Pressable
                onPress={() => { haptic(); setExpandedSection(expandedSection === section.id ? null : section.id); }}
                style={({ pressed }) => ({
                  backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                  borderWidth: 1, borderColor: section.required ? "#E07B1A33" : colors.border,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", flex: 1 }}>{section.title}</Text>
                  <View style={{ backgroundColor: section.required ? "#FEF3E8" : "#ECFDF5", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 }}>
                    <Text style={{ color: section.required ? "#E07B1A" : "#22A45D", fontSize: 9, fontWeight: "700" }}>
                      {section.required ? "OBOWIAZKOWY" : "OPCJONALNY"}
                    </Text>
                  </View>
                  <IconSymbol name={expandedSection === section.id ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                </View>
              </Pressable>
              {expandedSection === section.id && (
                <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 14, marginTop: 4, borderWidth: 1, borderColor: colors.border }}>
                  {section.tips.length > 0 && (
                    <View style={{ backgroundColor: "#FEF3E8", borderRadius: 8, padding: 10, marginBottom: 12 }}>
                      <Text style={{ color: "#E07B1A", fontSize: 11, fontWeight: "700", marginBottom: 4 }}>WSKAZOWKI</Text>
                      {section.tips.map((tip, i) => (
                        <Text key={i} style={{ color: "#E07B1A", fontSize: 11, lineHeight: 17, marginBottom: 2 }}>• {tip}</Text>
                      ))}
                    </View>
                  )}
                  <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 20 }}>{section.content}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
