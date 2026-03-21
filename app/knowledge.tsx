import { useState } from "react";
import { ScrollView, Text, View, Pressable, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

function haptic() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

type KnowledgeTab = "laws" | "costs" | "deadlines" | "tips";

const LEGAL_ACTS = [
  {
    id: "fundacje",
    title: "Ustawa o fundacjach",
    date: "6 kwietnia 1984 r.",
    description: "Podstawowy akt prawny regulujacy tworzenie, dzialanie i likwidacje fundacji w Polsce. Definiuje pojecie fundacji, wymogi dotyczace statutu, organy fundacji i nadzor.",
    keyPoints: [
      "Fundacje moga tworzyc osoby fizyczne i prawne (art. 2)",
      "Cel musi byc spolecznie lub gospodarczo uzyteczny (art. 1)",
      "Obowiazkowe elementy statutu (art. 5)",
      "Nadzor ministra wlasciwego dla celu fundacji (art. 13)",
      "Obowiazek skladania sprawozdan (art. 12)",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19840210097",
    color: "#E07B1A",
  },
  {
    id: "krs",
    title: "Ustawa o Krajowym Rejestrze Sadowym",
    date: "20 sierpnia 1997 r.",
    description: "Reguluje zasady wpisu do KRS, procedury rejestracyjne, obowiazki sprawozdawcze. Fundacje wpisywane sa do rejestru stowarzyszen i innych organizacji.",
    keyPoints: [
      "Wniosek KRS-W20 — rejestracja fundacji",
      "Formularz KRS-WK — dane organow",
      "Termin rozpatrzenia: 7 dni (e-KRS) lub do 14 dni",
      "Obowiazek aktualizacji danych w KRS",
      "Bezplatny dostep do rejestru: rejestr.io",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19971210769",
    color: "#1A5FA8",
  },
  {
    id: "pozytekpubliczny",
    title: "Ustawa o dzialalnosci pozytku publicznego i wolontariacie",
    date: "24 kwietnia 2003 r.",
    description: "Reguluje status organizacji pozytku publicznego (OPP), mozliwosc otrzymywania 1.5% podatku, zasady wolontariatu i wspolpracy z administracja publiczna.",
    keyPoints: [
      "Status OPP — mozliwosc zbierania 1.5% podatku",
      "Wymogi dla OPP: 2 lata dzialania, brak dzialalnosci gosp. na wlasny rachunek",
      "Obowiazki OPP: sprawozdania, publikacja w bazie NGO",
      "Wolontariat — zasady wspolpracy z wolontariuszami",
      "Zlecanie zadan publicznych przez samorzady",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20030960873",
    color: "#22A45D",
  },
  {
    id: "rachunkowosc",
    title: "Ustawa o rachunkowosci",
    date: "29 wrzesnia 1994 r.",
    description: "Fundacje zobowiazane sa do prowadzenia pelnej ksiegowosci. Ustawa reguluje zasady prowadzenia ksiag rachunkowych, sporzadzania sprawozdan finansowych.",
    keyPoints: [
      "Pelna ksiegowosc obowiazkowa dla fundacji",
      "Rok obrotowy: zazwyczaj rok kalendarzowy",
      "Sprawozdanie finansowe: do 31 marca za rok poprzedni",
      "Obowiazek przechowywania dokumentow przez 5 lat",
      "Fundacje > 2 mln zl przychodu — badanie przez bieglego",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19941210591",
    color: "#8B5CF6",
  },
  {
    id: "stowarzyszenia",
    title: "Ustawa — Prawo o stowarzyszeniach",
    date: "7 kwietnia 1989 r.",
    description: "Reguluje tworzenie i dzialanie stowarzyszen. Przydatna przy porownaniu fundacji ze stowarzyszeniem — inne wymogi, inne organy, inne zasady czlonkostwa.",
    keyPoints: [
      "Stowarzyszenie: min. 7 czlonkow zalozycieli",
      "Walne zebranie czlonkow jako najwyzszy organ",
      "Stowarzyszenie zwykle: bez rejestracji w KRS",
      "Stowarzyszenie rejestrowe: wpis do KRS",
      "Roznica: fundacja — majatek; stowarzyszenie — czlonkowie",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19890200104",
    color: "#E11D48",
  },
];

const COSTS = [
  { label: "Akt notarialny (fundusz do 3000 zl)", amount: "100 zl + VAT", required: true, note: "Taksa notarialna. Przy wyzszym funduszu — wyzsza taksa wg rozporzadzenia." },
  { label: "Oplata sadowa KRS", amount: "500 zl", required: true, note: "Oplata za wpis do rejestru stowarzyszen/fundacji." },
  { label: "Ogloszenie w MSiG", amount: "100 zl", required: true, note: "Monitor Sadowy i Gospodarczy — obowiazkowe ogloszenie." },
  { label: "Konto bankowe", amount: "0-50 zl/mies.", required: true, note: "Wiele bankow oferuje bezplatne konta dla NGO." },
  { label: "Pieczatka fundacji", amount: "30-80 zl", required: false, note: "Nie jest obowiazkowa prawnie, ale przydatna w praktyce." },
  { label: "Biuro rachunkowe", amount: "200-500 zl/mies.", required: false, note: "Jesli fundacja nie ma wlasnego ksiegowego." },
  { label: "RAZEM (minimum)", amount: "ok. 723 zl", required: true, note: "Bez kosztow biezacych (ksiegowosc, konto)." },
];

const DEADLINES = [
  { days: "0", label: "Rejestracja w KRS", description: "Zlozenie wniosku KRS-W20 z kompletem dokumentow. Termin rozpatrzenia: 7 dni (e-KRS) lub do 14 dni.", color: "#E07B1A", icon: "building.columns.fill" },
  { days: "14", label: "CRBR — beneficjent rzeczywisty", description: "Zgłoszenie do Centralnego Rejestru Beneficjentow Rzeczywistych. Brak zgłoszenia = kara do 1 mln zl. Adres: crbr.podatki.gov.pl", color: "#E11D48", icon: "person.fill.checkmark" },
  { days: "21", label: "NIP-8 — urzad skarbowy", description: "Formularz uzupelniajacy NIP-8: numer konta bankowego, dane o zatrudnieniu, rok obrotowy. Zloz do US wlasciwego dla siedziby.", color: "#1A5FA8", icon: "doc.text.fill" },
  { days: "30", label: "Konto bankowe", description: "Zalozenie konta bankowego na nazwe fundacji. Potrzebny: odpis z KRS, statut, PESEL/dowod prezesa.", color: "#8B5CF6", icon: "creditcard.fill" },
  { days: "30", label: "Wplata funduszu zalozycielskiego", description: "Przelew od fundatora na konto fundacji z tytulem: 'fundusz zalozycielski'. Kwota zgodna z aktem fundacyjnym.", color: "#22A45D", icon: "banknote.fill" },
  { days: "90", label: "Polityka rachunkowosci", description: "Uchwala zarzadu przyjmujaca polityke rachunkowosci. Rok obrotowy, metoda wyceny, zasady ksiegowania.", color: "#E07B1A", icon: "chart.bar.fill" },
];

const TIPS = [
  {
    category: "Nazwa fundacji",
    color: "#E07B1A",
    items: [
      "Musi zawierac slowo 'Fundacja' — np. 'Fundacja Pomocna Dlon'",
      "Sprawdz unikalnosc nazwy w rejestrze: rejestr.io lub prs.ms.gov.pl",
      "Unikaj nazw zbyt ogolnych — sad moze odrzucic wniosek",
      "Mozna uzywac imienia patrona: 'Fundacja im. Jana Kowalskiego'",
    ],
  },
  {
    category: "Cel fundacji",
    color: "#1A5FA8",
    items: [
      "Cel musi byc 'spolecznie lub gospodarczo uzyteczny' (art. 1 ustawy)",
      "Unikaj celow zbyt szerokich — 'poprawa jakosci zycia' to za malo",
      "Dobry cel: 'wspieranie edukacji dzieci z rodzin wielodzietnych w wieku 6-18 lat'",
      "Cele w statucie musza byc zgodne z celami w akcie fundacyjnym",
      "Zmiana celow wymaga zgody ministra nadzorujacego",
    ],
  },
  {
    category: "Statut",
    color: "#22A45D",
    items: [
      "Statut moze byc zawarty w akcie fundacyjnym lub jako osobny dokument",
      "Obowiazkowe elementy: nazwa, siedziba, majatek, cele, zasady dzialania, organy, likwidacja",
      "Zakaz: udzielania pozyczek fundatorowi/organom/pracownikom",
      "Zakaz: przekazywania majatku na rzecz fundatora na preferencyjnych warunkach",
      "Sposob reprezentacji musi byc jasno okreslony",
    ],
  },
  {
    category: "Zarzad",
    color: "#8B5CF6",
    items: [
      "Zarzad to jedyny obowiazkowy organ fundacji",
      "Prezes zarzadu jest wymagany — musi byc wskazany w statucie",
      "Czlonkowie zarzadu moga byc wynagradzani (jesli statut na to pozwala)",
      "Fundator moze byc czlonkiem zarzadu",
      "Kadencja: zazwyczaj 3-5 lat, mozna przedluzac",
    ],
  },
  {
    category: "Po rejestracji",
    color: "#E11D48",
    items: [
      "CRBR — 14 dni od rejestracji (kara do 1 mln zl za brak!)",
      "NIP-8 — 21 dni od rejestracji do urzedu skarbowego",
      "Konto bankowe — jak najszybciej po rejestracji",
      "Sprawozdanie roczne: do 31 marca za rok poprzedni",
      "Sprawozdanie merytoryczne: do 31 marca, publikacja w bazie NGO",
    ],
  },
];

export default function KnowledgeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<KnowledgeTab>("laws");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs: { id: KnowledgeTab; label: string }[] = [
    { id: "laws", label: "Ustawy" },
    { id: "costs", label: "Koszty" },
    { id: "deadlines", label: "Terminy" },
    { id: "tips", label: "Wskazowki" },
  ];

  return (
    <ScreenContainer>
      <View style={{ backgroundColor: "#22A45D", paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" }}>Narzedzie konsultanta</Text>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Baza Wiedzy</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 3 }}>
          {tabs.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => { haptic(); setActiveTab(t.id); setExpandedId(null); }}
              style={{ flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: "center", backgroundColor: activeTab === t.id ? "#fff" : "transparent" }}
            >
              <Text style={{ color: activeTab === t.id ? "#22A45D" : "#fff", fontSize: 11, fontWeight: "700" }}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {activeTab === "laws" && (
          <>
            <View style={{ backgroundColor: "#E8F7EF", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text style={{ color: "#22A45D", fontSize: 13, lineHeight: 19 }}>
                Kluczowe akty prawne dotyczace fundacji w Polsce. Dotknij ustaw, aby zobaczyc kluczowe przepisy i link do pelnego tekstu.
              </Text>
            </View>
            {LEGAL_ACTS.map((law) => (
              <View key={law.id} style={{ marginBottom: 10 }}>
                <Pressable
                  onPress={() => { haptic(); setExpandedId(expandedId === law.id ? null : law.id); }}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
                    borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: law.color + "22", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                      <IconSymbol name="doc.text.fill" size={20} color={law.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>{law.title}</Text>
                      <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>z dnia {law.date}</Text>
                    </View>
                    <IconSymbol name={expandedId === law.id ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                  </View>
                </Pressable>
                {expandedId === law.id && (
                  <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginTop: 4, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19, marginBottom: 12 }}>{law.description}</Text>
                    <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", marginBottom: 8 }}>KLUCZOWE PRZEPISY:</Text>
                    {law.keyPoints.map((point, i) => (
                      <View key={i} style={{ flexDirection: "row", marginBottom: 6 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: law.color, marginTop: 6, marginRight: 8 }} />
                        <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, flex: 1 }}>{point}</Text>
                      </View>
                    ))}
                    <Pressable
                      onPress={() => Linking.openURL(law.url)}
                      style={({ pressed }) => ({
                        marginTop: 12, backgroundColor: law.color + "22", borderRadius: 10, padding: 10,
                        flexDirection: "row", alignItems: "center", gap: 8, opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <IconSymbol name="link" size={14} color={law.color} />
                      <Text style={{ color: law.color, fontSize: 12, fontWeight: "700" }}>Otworz pelny tekst w ISAP (sejm.gov.pl)</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
            <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginTop: 4, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", marginBottom: 8 }}>PRZYDATNE PORTALE</Text>
              {[
                { label: "poradnik.ngo.pl — Biblioteka aktow prawnych", url: "https://poradnik.ngo.pl/biblioteka-aktow-prawnych" },
                { label: "rejestr.io — Bezplatny podglad KRS", url: "https://rejestr.io" },
                { label: "crbr.podatki.gov.pl — Rejestr beneficjentow", url: "https://crbr.podatki.gov.pl" },
                { label: "prs.ms.gov.pl — Portal Rejestrow Sadowych", url: "https://prs.ms.gov.pl" },
              ].map((link, i) => (
                <Pressable key={i} onPress={() => Linking.openURL(link.url)} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: i < 3 ? 0.5 : 0, borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 })}>
                  <IconSymbol name="link" size={13} color="#22A45D" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#22A45D", fontSize: 12, fontWeight: "600", flex: 1 }}>{link.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {activeTab === "costs" && (
          <>
            <View style={{ backgroundColor: "#E8F7EF", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text style={{ color: "#22A45D", fontSize: 13, lineHeight: 19 }}>
                Szacunkowe koszty zalozenia fundacji. Kwoty moga sie roznic w zaleznosci od notariusza i banku.
              </Text>
            </View>
            {COSTS.map((cost, i) => (
              <View key={i} style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: cost.label.includes("RAZEM") ? "#22A45D" : colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: cost.label.includes("RAZEM") ? "800" : "600" }}>{cost.label}</Text>
                      {cost.required && !cost.label.includes("RAZEM") && (
                        <View style={{ backgroundColor: "#FEF3E8", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                          <Text style={{ color: "#E07B1A", fontSize: 9, fontWeight: "700" }}>OBOWIAZKOWY</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 16 }}>{cost.note}</Text>
                  </View>
                  <Text style={{ color: cost.label.includes("RAZEM") ? "#22A45D" : "#E07B1A", fontSize: 14, fontWeight: "800", minWidth: 80, textAlign: "right" }}>{cost.amount}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === "deadlines" && (
          <>
            <View style={{ backgroundColor: "#E8F7EF", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text style={{ color: "#22A45D", fontSize: 13, lineHeight: 19 }}>
                Kluczowe terminy po rejestracji fundacji. Liczba dni od daty wpisu do KRS.
              </Text>
            </View>
            {DEADLINES.map((d, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 14 }}>
                <View style={{ alignItems: "center", marginRight: 14 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: d.color + "22", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: d.color, fontSize: 13, fontWeight: "800" }}>+{d.days}</Text>
                    <Text style={{ color: d.color, fontSize: 8, fontWeight: "600" }}>dni</Text>
                  </View>
                  {i < DEADLINES.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 }} />}
                </View>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 4 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <IconSymbol name={d.icon as any} size={16} color={d.color} />
                    <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", flex: 1 }}>{d.label}</Text>
                  </View>
                  <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>{d.description}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === "tips" && (
          <>
            <View style={{ backgroundColor: "#E8F7EF", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text style={{ color: "#22A45D", fontSize: 13, lineHeight: 19 }}>
                Praktyczne wskazowki dla konsultanta. Najczestsze pytania i problemy przy zakladaniu fundacji.
              </Text>
            </View>
            {TIPS.map((tip, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Pressable
                  onPress={() => { haptic(); setExpandedId(expandedId === `tip-${i}` ? null : `tip-${i}`); }}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
                    borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: tip.color + "22", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                      <IconSymbol name="lightbulb.fill" size={18} color={tip.color} />
                    </View>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", flex: 1 }}>{tip.category}</Text>
                    <IconSymbol name={expandedId === `tip-${i}` ? "chevron.up" : "chevron.down"} size={16} color={colors.muted} />
                  </View>
                </Pressable>
                {expandedId === `tip-${i}` && (
                  <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginTop: 4, borderWidth: 1, borderColor: colors.border }}>
                    {tip.items.map((item, j) => (
                      <View key={j} style={{ flexDirection: "row", marginBottom: 10 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tip.color, marginTop: 6, marginRight: 10 }} />
                        <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19, flex: 1 }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
