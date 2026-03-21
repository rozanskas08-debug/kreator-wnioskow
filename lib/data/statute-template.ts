/**
 * Editable statute template for a Polish foundation (fundacja).
 * Based on: Ustawa z dnia 6 kwietnia 1984 r. o fundacjach (Dz.U. 1984 nr 21 poz. 97)
 * and the statute guide PDF provided by the user.
 */

export type ParagraphType = "required" | "optional" | "fill_in";

export interface StatuteParagraph {
  id: string;
  /** Display number, e.g. "§ 1" */
  number: string;
  /** Short title shown in the list */
  title: string;
  /** Full paragraph text — placeholders wrapped in [[...]] */
  text: string;
  type: ParagraphType;
  /** Hint shown below the editor */
  hint?: string;
  /** Whether this paragraph is currently enabled (for optional ones) */
  enabled: boolean;
  /** Section this paragraph belongs to */
  section: string;
}

export interface StatuteSection {
  id: string;
  title: string;
  color: string;
}

export const STATUTE_SECTIONS: StatuteSection[] = [
  { id: "general", title: "Postanowienia ogólne", color: "#E07B1A" },
  { id: "goals", title: "Cele i zasady działania", color: "#1A5FA8" },
  { id: "assets", title: "Majątek i dochody", color: "#22A45D" },
  { id: "board", title: "Władze Fundacji — Zarząd", color: "#8B5CF6" },
  { id: "supervisory", title: "Rada Fundacji (opcjonalna)", color: "#E11D48" },
  { id: "changes", title: "Zmiany statutu i celów", color: "#0891B2" },
  { id: "liquidation", title: "Likwidacja Fundacji", color: "#6B7280" },
  { id: "final", title: "Postanowienia końcowe", color: "#D97706" },
];

export const DEFAULT_STATUTE_PARAGRAPHS: StatuteParagraph[] = [
  // ── POSTANOWIENIA OGÓLNE ──────────────────────────────────────────────────
  {
    id: "p1",
    number: "§ 1",
    title: "Nazwa i osobowość prawna",
    section: "general",
    type: "required",
    enabled: true,
    hint: "Nazwa musi zawierać słowo 'Fundacja'. Sprawdź unikalność w rejestrze KRS.",
    text: `1. Fundacja pod nazwą [[NAZWA FUNDACJI]], zwana dalej „Fundacją", ustanowiona przez [[IMIĘ I NAZWISKO FUNDATORA]], zwanego dalej „Fundatorem", aktem notarialnym sporządzonym przed notariuszem [[IMIĘ I NAZWISKO NOTARIUSZA]] w Kancelarii Notarialnej w [[MIEJSCOWOŚĆ]], w dniu [[DATA AKTU NOTARIALNEGO]], działa na podstawie przepisów ustawy z dnia 6 kwietnia 1984 r. o fundacjach (Dz.U. z 2023 r. poz. 166) oraz niniejszego statutu.

2. Fundacja posiada osobowość prawną.`,
  },
  {
    id: "p2",
    number: "§ 2",
    title: "Siedziba i teren działania",
    section: "general",
    type: "required",
    enabled: true,
    hint: "Siedziba to miejscowość (nie ulica). Teren działania może być Polska lub cały świat.",
    text: `1. Siedzibą Fundacji jest [[MIEJSCOWOŚĆ SIEDZIBY]].

2. Terenem działania Fundacji jest obszar Rzeczypospolitej Polskiej.

3. Dla właściwego realizowania swoich celów Fundacja może prowadzić działalność poza granicami Rzeczypospolitej Polskiej.

4. Fundacja może tworzyć oddziały, zakłady, filie i przedstawicielstwa w kraju i za granicą.`,
  },
  {
    id: "p3",
    number: "§ 3",
    title: "Czas trwania",
    section: "general",
    type: "required",
    enabled: true,
    hint: "Zazwyczaj fundacje zakładane są na czas nieoznaczony.",
    text: `Fundacja jest ustanowiona na czas nieoznaczony.`,
  },
  {
    id: "p4",
    number: "§ 4",
    title: "Nadzór",
    section: "general",
    type: "required",
    enabled: true,
    hint: "Minister nadzorujący zależy od głównego celu fundacji. Np. edukacja → MEN, zdrowie → MZ, kultura → MKiDN.",
    text: `Ministrem właściwym ze względu na cele Fundacji jest [[NAZWA MINISTRA, np. Minister Edukacji Narodowej]].`,
  },
  {
    id: "p5",
    number: "§ 5",
    title: "Pieczęć i oznaczenia",
    section: "general",
    type: "optional",
    enabled: true,
    hint: "Paragraf opcjonalny — możesz go pominąć. Pieczęć nie jest prawnie wymagana.",
    text: `Fundacja może używać pieczęci z napisem wskazującym jej nazwę i siedzibę oraz wyróżniającego ją znaku graficznego (logo).`,
  },

  // ── CELE I ZASADY DZIAŁANIA ───────────────────────────────────────────────
  {
    id: "p6",
    number: "§ 6",
    title: "Cele Fundacji",
    section: "goals",
    type: "required",
    enabled: true,
    hint: "Cele muszą być społecznie lub gospodarczo użyteczne (art. 1 ustawy). Wpisz konkretne cele — im bardziej szczegółowe, tym lepiej.",
    text: `Celami Fundacji są:

1. [[CEL FUNDACJI NR 1, np. wspieranie edukacji dzieci i młodzieży z rodzin w trudnej sytuacji materialnej]];

2. [[CEL FUNDACJI NR 2, np. promocja i organizacja wolontariatu]];

3. [[CEL FUNDACJI NR 3 — opcjonalny, usuń jeśli niepotrzebny]].`,
  },
  {
    id: "p7",
    number: "§ 7",
    title: "Sposoby realizacji celów",
    section: "goals",
    type: "required",
    enabled: true,
    hint: "Wpisz konkretne działania, jakie fundacja będzie podejmować. Muszą być zgodne z celami z § 6.",
    text: `Fundacja realizuje swoje cele poprzez:

1. [[SPOSÓB DZIAŁANIA NR 1, np. organizowanie szkoleń, warsztatów i konferencji]];

2. [[SPOSÓB DZIAŁANIA NR 2, np. przyznawanie stypendiów i nagród]];

3. [[SPOSÓB DZIAŁANIA NR 3, np. prowadzenie działalności wydawniczej i informacyjnej]];

4. [[SPOSÓB DZIAŁANIA NR 4, np. współpracę z organami administracji publicznej, organizacjami pozarządowymi i instytucjami naukowymi]];

5. [[SPOSÓB DZIAŁANIA NR 5 — opcjonalny, usuń jeśli niepotrzebny]].`,
  },
  {
    id: "p8",
    number: "§ 8",
    title: "Działalność odpłatna i nieodpłatna pożytku publicznego",
    section: "goals",
    type: "optional",
    enabled: false,
    hint: "Dodaj ten paragraf jeśli planujesz ubiegać się o status OPP lub prowadzić działalność odpłatną i nieodpłatną pożytku publicznego.",
    text: `1. Fundacja prowadzi działalność pożytku publicznego w rozumieniu ustawy z dnia 24 kwietnia 2003 r. o działalności pożytku publicznego i o wolontariacie.

2. Działalność nieodpłatna pożytku publicznego obejmuje:
   a) [[OPIS DZIAŁALNOŚCI NIEODPŁATNEJ]].

3. Działalność odpłatna pożytku publicznego obejmuje:
   a) [[OPIS DZIAŁALNOŚCI ODPŁATNEJ]].

4. Dochód z działalności odpłatnej pożytku publicznego jest przeznaczany wyłącznie na działalność statutową Fundacji.`,
  },

  // ── MAJĄTEK I DOCHODY ─────────────────────────────────────────────────────
  {
    id: "p9",
    number: "§ 9",
    title: "Majątek Fundacji",
    section: "assets",
    type: "required",
    enabled: true,
    hint: "Kwota funduszu musi być zgodna z aktem fundacyjnym. Brak ustawowego minimum — w praktyce min. 500–1000 zł.",
    text: `1. Majątek Fundacji stanowi fundusz założycielski w kwocie [[KWOTA SŁOWNIE, np. jeden tysiąc]] złotych ([[KWOTA CYFRAMI, np. 1.000]] zł), wniesiony przez Fundatora w akcie fundacyjnym, oraz środki finansowe, nieruchomości i ruchomości nabyte przez Fundację w toku jej działania.

2. Fundacja odpowiada za swoje zobowiązania całym swoim majątkiem.`,
  },
  {
    id: "p10",
    number: "§ 10",
    title: "Źródła dochodów",
    section: "assets",
    type: "required",
    enabled: true,
    hint: "Wymień wszystkie planowane źródła finansowania. Dochody muszą być przeznaczone na cele statutowe.",
    text: `Dochody Fundacji mogą pochodzić z:

1. darowizn, spadków i zapisów krajowych i zagranicznych;
2. dotacji i subwencji od osób prawnych i fizycznych;
3. dochodów ze zbiórek i imprez publicznych;
4. dochodów z majątku Fundacji (odsetki bankowe, dywidendy, najem);
5. [[INNE ŹRÓDŁO DOCHODÓW — opcjonalne, np. wpływy z działalności odpłatnej]];
6. odsetek od lokat kapitałowych i papierów wartościowych.`,
  },
  {
    id: "p11",
    number: "§ 11",
    title: "Zakazy dotyczące majątku",
    section: "assets",
    type: "required",
    enabled: true,
    hint: "Ten paragraf jest wymagany przez ustawę o działalności pożytku publicznego (art. 20). Nie modyfikuj jego treści.",
    text: `Zabrania się:

1. udzielania pożyczek lub zabezpieczania zobowiązań majątkiem Fundacji w stosunku do jej członków, członków organów lub pracowników oraz osób, z którymi członkowie, członkowie organów oraz pracownicy organizacji pozostają w związku małżeńskim, we wspólnym pożyciu albo w stosunku pokrewieństwa lub powinowactwa w linii prostej, pokrewieństwa lub powinowactwa w linii bocznej do drugiego stopnia albo są związani z tytułu przysposobienia, opieki lub kurateli, zwanych dalej „osobami bliskimi";

2. przekazywania majątku Fundacji na rzecz jej członków, członków organów lub pracowników oraz ich osób bliskich, na zasadach innych niż w stosunku do osób trzecich, w szczególności jeżeli przekazanie to następuje bezpłatnie lub na preferencyjnych warunkach;

3. wykorzystywania majątku na rzecz członków, członków organów lub pracowników oraz ich osób bliskich na zasadach innych niż w stosunku do osób trzecich, chyba że to wykorzystanie bezpośrednio wynika ze statutowego celu Fundacji;

4. zakupu towarów lub usług od podmiotów, w których uczestniczą członkowie Fundacji, członkowie jej organów lub pracownicy oraz ich osoby bliskie, na zasadach innych niż w stosunku do osób trzecich lub po cenach wyższych niż rynkowe.`,
  },
  {
    id: "p12",
    number: "§ 12",
    title: "Działalność gospodarcza",
    section: "assets",
    type: "optional",
    enabled: false,
    hint: "Dodaj ten paragraf tylko jeśli fundacja będzie prowadzić działalność gospodarczą. Wymaga wpisu do KRS-WM i min. 1000 zł funduszu.",
    text: `1. Fundacja może prowadzić działalność gospodarczą w rozmiarach służących realizacji jej celów statutowych.

2. Fundacja prowadzi działalność gospodarczą w zakresie:
   [[PRZEDMIOT DZIAŁALNOŚCI GOSPODARCZEJ wg PKD, np.:
   - 85.59.B Pozostałe pozaszkolne formy edukacji, gdzie indziej niesklasyfikowane
   - 82.30.Z Działalność związana z organizacją targów, wystaw i kongresów]]

3. Dochód z działalności gospodarczej Fundacji jest w całości przeznaczany na realizację celów statutowych.

4. Fundacja nie może prowadzić działalności gospodarczej w zakresie:
   a) wyrobu i obrotu wyrobami przemysłu spirytusowego i tytoniowego;
   b) gier losowych i zakładów wzajemnych.`,
  },

  // ── ZARZĄD ────────────────────────────────────────────────────────────────
  {
    id: "p13",
    number: "§ 13",
    title: "Władze Fundacji",
    section: "board",
    type: "required",
    enabled: true,
    hint: "Zarząd jest jedynym obowiązkowym organem fundacji. Rada Fundacji jest opcjonalna.",
    text: `1. Władzami Fundacji jest Zarząd Fundacji, zwany dalej „Zarządem".

2. [[OPCJONALNIE: Organem kontrolnym Fundacji jest Rada Fundacji, zwana dalej „Radą". — usuń jeśli nie dotyczy]]`,
  },
  {
    id: "p14",
    number: "§ 14",
    title: "Skład i powoływanie Zarządu",
    section: "board",
    type: "required",
    enabled: true,
    hint: "Określ minimalną i maksymalną liczbę członków. Kadencja zazwyczaj 3–5 lat. Fundator może być prezesem.",
    text: `1. Zarząd Fundacji składa się z [[MINIMALNA LICZBA, np. jednej]] do [[MAKSYMALNA LICZBA, np. pięciu]] osób, w tym Prezesa Zarządu.

2. Pierwszego Zarządu Fundacji powołuje Fundator.

3. Kolejnych członków Zarządu, w tym Prezesa, powołuje i odwołuje Zarząd uchwałą podjętą zwykłą większością głosów.

4. Członkostwo w Zarządzie ustaje na skutek:
   a) złożenia pisemnej rezygnacji na ręce Zarządu;
   b) utraty praw publicznych na skutek skazania prawomocnym wyrokiem sądu za przestępstwo popełnione z winy umyślnej;
   c) śmierci członka Zarządu;
   d) odwołania przez Zarząd.

5. Kadencja Zarządu trwa [[LICZBA, np. trzy]] lata. Dopuszczalne jest ponowne powołanie tej samej osoby na kolejną kadencję.`,
  },
  {
    id: "p15",
    number: "§ 15",
    title: "Kompetencje Zarządu",
    section: "board",
    type: "required",
    enabled: true,
    hint: "Zarząd kieruje bieżącą działalnością fundacji i reprezentuje ją na zewnątrz.",
    text: `1. Zarząd kieruje działalnością Fundacji i reprezentuje ją na zewnątrz.

2. Do zadań Zarządu należy w szczególności:
   a) uchwalanie rocznych planów działania Fundacji oraz planów finansowych;
   b) uchwalanie regulaminów;
   c) sprawowanie zarządu majątkiem Fundacji;
   d) ustalanie wielkości zatrudnienia i wysokości środków na wynagrodzenia pracowników Fundacji;
   e) przyjmowanie darowizn, spadków i zapisów, subwencji i dotacji;
   f) podejmowanie decyzji we wszelkich sprawach nieprzekazanych do kompetencji innych organów;
   g) podejmowanie decyzji o zmianie statutu, połączeniu z inną fundacją lub likwidacji Fundacji.

3. Zarząd podejmuje decyzje na posiedzeniach w formie uchwał — zwykłą większością głosów jego członków obecnych na posiedzeniu Zarządu. W przypadku równości głosów decyduje głos Prezesa Zarządu.

4. O posiedzeniu muszą być powiadomieni wszyscy członkowie Zarządu.

5. Zarząd może powoływać pełnomocników do kierowania wyodrębnioną sferą spraw należących do zadań Fundacji.`,
  },
  {
    id: "p16",
    number: "§ 16",
    title: "Sposób reprezentacji",
    section: "board",
    type: "required",
    enabled: true,
    hint: "Sposób reprezentacji musi być jasno określony. Najczęściej: Prezes samodzielnie lub dwóch członków łącznie.",
    text: `Do składania oświadczeń woli w imieniu Fundacji, w tym w sprawach majątkowych, uprawniony jest [[SPOSÓB REPREZENTACJI, np. Prezes Zarządu samodzielnie / każdy członek Zarządu samodzielnie / dwóch członków Zarządu działających łącznie]].`,
  },
  {
    id: "p17",
    number: "§ 17",
    title: "Wynagrodzenie członków Zarządu",
    section: "board",
    type: "optional",
    enabled: true,
    hint: "Jeśli chcesz, aby członkowie zarządu mogli być wynagradzani — dodaj ten paragraf. Bez niego nie można im płacić.",
    text: `Członkowie Zarządu mogą otrzymywać wynagrodzenie z tytułu pełnienia funkcji w Zarządzie. Wysokość wynagrodzenia ustala Zarząd uchwałą.`,
  },

  // ── RADA FUNDACJI (OPCJONALNA) ────────────────────────────────────────────
  {
    id: "p18",
    number: "§ 18",
    title: "Rada Fundacji — skład i powoływanie",
    section: "supervisory",
    type: "optional",
    enabled: false,
    hint: "Rada Fundacji to opcjonalny organ nadzorczy. Dodaj go jeśli chcesz mieć dodatkową kontrolę nad zarządem.",
    text: `1. Rada Fundacji jest organem kontrolnym i opiniującym Fundacji.

2. Rada Fundacji składa się z [[LICZBA, np. trzech]] do [[LICZBA, np. pięciu]] członków i wybiera ze swego grona Przewodniczącego Rady.

3. Pierwszą Radę Fundacji powołuje Fundator. Kolejnych członków Rady powołuje i odwołuje Rada Fundacji.

4. Kadencja Rady trwa [[LICZBA, np. trzy]] lata.

5. Członkiem Rady Fundacji nie może być osoba będąca członkiem Zarządu ani pozostająca z nim w stosunku pokrewieństwa, powinowactwa lub podległości służbowej.`,
  },
  {
    id: "p19",
    number: "§ 19",
    title: "Kompetencje Rady Fundacji",
    section: "supervisory",
    type: "optional",
    enabled: false,
    hint: "Kompetencje Rady muszą być wyraźnie określone w statucie.",
    text: `Do zadań Rady Fundacji należy w szczególności:

1. nadzór nad realizacją głównych kierunków działania Fundacji;
2. występowanie z wnioskami dotyczącymi działalności Fundacji;
3. opiniowanie wieloletnich i rocznych programów działania Fundacji;
4. wyrażanie opinii w sprawach przedłożonych jej przez Zarząd;
5. rozpatrywanie i zatwierdzanie sprawozdań z działalności Zarządu;
6. ocena pracy Zarządu, przyjmowanie corocznych sprawozdań lub bilansu i udzielanie członkom Zarządu absolutorium.`,
  },

  // ── ZMIANY STATUTU ────────────────────────────────────────────────────────
  {
    id: "p20",
    number: "§ 20",
    title: "Zmiana statutu",
    section: "changes",
    type: "required",
    enabled: true,
    hint: "Zmiana celów fundacji wymaga zgody ministra nadzorującego. Zmiana innych postanowień — uchwała zarządu.",
    text: `1. Zmiany statutu Fundacji dokonuje Zarząd Fundacji uchwałą podjętą bezwzględną większością głosów przy obecności co najmniej połowy składu Zarządu.

2. Zmiany statutu mogą dotyczyć celów, dla realizacji których Fundacja została ustanowiona, i określonych w akcie założycielskim.`,
  },

  // ── LIKWIDACJA ────────────────────────────────────────────────────────────
  {
    id: "p21",
    number: "§ 21",
    title: "Likwidacja Fundacji",
    section: "liquidation",
    type: "required",
    enabled: true,
    hint: "Wskaż beneficjenta majątku po likwidacji. Powinna to być inna organizacja o zbliżonych celach.",
    text: `1. Fundacja ulega likwidacji w razie osiągnięcia celów, dla których została ustanowiona, lub w razie wyczerpania się jej środków finansowych i majątku.

2. Decyzję o likwidacji podejmuje Zarząd Fundacji uchwałą podjętą bezwzględną większością głosów przy obecności co najmniej połowy składu Zarządu.

3. Likwidatorem Fundacji jest Zarząd Fundacji.

4. Środki finansowe i majątek pozostały po likwidacji Fundacji mogą zostać przeznaczone mocą uchwały Zarządu na rzecz [[BENEFICJENT MAJĄTKU PO LIKWIDACJI, np. innych fundacji lub organizacji pozarządowych działających na terytorium Rzeczypospolitej Polskiej, których cele są zbliżone do celów Fundacji]].`,
  },
  {
    id: "p22",
    number: "§ 22",
    title: "Połączenie z inną fundacją",
    section: "liquidation",
    type: "optional",
    enabled: true,
    hint: "Paragraf opcjonalny, ale zalecany — pozwala na fuzję z inną fundacją bez konieczności likwidacji.",
    text: `1. Fundacja może się połączyć z inną fundacją dla efektywnego realizowania swoich celów.

2. Połączenie z inną fundacją nie może nastąpić, jeżeli w jego wyniku mógłby ulec istotnej zmianie cel Fundacji.

3. W sprawach połączenia z inną fundacją właściwy jest Zarząd, podejmując stosowne uchwały bezwzględną większością głosów.`,
  },

  // ── POSTANOWIENIA KOŃCOWE ─────────────────────────────────────────────────
  {
    id: "p23",
    number: "§ 23",
    title: "Sprawozdania",
    section: "final",
    type: "required",
    enabled: true,
    hint: "Obowiązek składania sprawozdań wynika z art. 12 ustawy o fundacjach.",
    text: `1. Zarząd Fundacji sporządza roczne sprawozdanie z działalności Fundacji.

2. Sprawozdanie obejmuje okres roku kalendarzowego.

3. Zarząd Fundacji przekazuje sprawozdanie właściwemu ministrowi do dnia [[DATA, np. 30 czerwca]] każdego roku następującego po roku, którego sprawozdanie dotyczy.`,
  },
  {
    id: "p24",
    number: "§ 24",
    title: "Postanowienia końcowe",
    section: "final",
    type: "required",
    enabled: true,
    hint: "Statut wchodzi w życie z dniem wpisania fundacji do KRS.",
    text: `1. W sprawach nieuregulowanych w niniejszym statucie mają zastosowanie przepisy ustawy z dnia 6 kwietnia 1984 r. o fundacjach oraz inne powszechnie obowiązujące przepisy prawa.

2. Statut wchodzi w życie z dniem wpisania Fundacji do Krajowego Rejestru Sądowego.`,
  },
];

/** Returns a deep copy of the default paragraphs (for editing) */
export function getEditableStatute(): StatuteParagraph[] {
  return DEFAULT_STATUTE_PARAGRAPHS.map((p) => ({ ...p }));
}

/** Generates full statute text from paragraphs */
export function buildStatuteText(paragraphs: StatuteParagraph[]): string {
  const sections = STATUTE_SECTIONS.map((section) => {
    const sectionParagraphs = paragraphs.filter(
      (p) => p.section === section.id && p.enabled,
    );
    if (sectionParagraphs.length === 0) return null;
    return `\n\n${section.title.toUpperCase()}\n\n${sectionParagraphs.map((p) => `${p.number}\n${p.text}`).join("\n\n")}`;
  });
  return `STATUT FUNDACJI\n${sections.filter(Boolean).join("")}`;
}

/** Returns count of unfilled placeholders */
export function countPlaceholders(paragraphs: StatuteParagraph[]): number {
  const text = paragraphs
    .filter((p) => p.enabled)
    .map((p) => p.text)
    .join(" ");
  const matches = text.match(/\[\[.*?\]\]/g);
  return matches ? matches.length : 0;
}
