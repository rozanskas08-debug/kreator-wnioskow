import type { StatuteFormData } from "./data/client-types";

// ============================================================
// STATUTE GENERATOR
// Generates full Polish foundation statute text from form data
// Based on: Jak_zalozyc_fundacje_napisac_statut_poradnik.pdf
// ============================================================

export interface StatuteSection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  tips: string[];
}

export function generateStatute(data: StatuteFormData): StatuteSection[] {
  const sections: StatuteSection[] = [];

  // ── ROZDZIAŁ I — Postanowienia ogólne ───────────────────────
  sections.push({
    id: "general",
    title: "Rozdział I. Postanowienia ogólne",
    required: true,
    tips: [
      "Nazwa fundacji musi zawierać słowo 'Fundacja'.",
      "Siedziba to miejscowość (nie ulica) — np. 'Warszawa'.",
      "Teren działania: Polska lub cały świat.",
    ],
    content: `§ 1
1. Fundacja pod nazwą „${data.foundationName}" (zwana dalej „Fundacją") ustanowiona przez ${data.founderName} (zwanego dalej „Fundatorem"), aktem notarialnym sporządzonym w dniu ………………… roku, działa na podstawie przepisów ustawy z dnia 6 kwietnia 1984 r. o fundacjach (Dz. U. z 2023 r. poz. 166 ze zm.) oraz niniejszego Statutu.

§ 2
1. Siedzibą Fundacji jest ${data.foundationCity}.
2. Czas trwania Fundacji jest nieoznaczony.
3. Fundacja działa na obszarze ${data.operationArea === "world" ? "Rzeczypospolitej Polskiej i za granicą" : "Rzeczypospolitej Polskiej"}.
4. Fundacja może tworzyć oddziały, zakłady, filie i przedstawicielstwa w kraju i za granicą.
5. Fundacja może być członkiem krajowych i zagranicznych organizacji o podobnym profilu działania.
6. Fundacja używa pieczęci z nazwą i adresem Fundacji.`,
  });

  // ── ROZDZIAŁ II — Cele i zasady działania ──────────────────
  const purposesList = data.purposes.length > 0
    ? data.purposes.map((p, i) => `   ${i + 1}) ${p}`).join("\n")
    : "   1) [uzupełnij cel fundacji]";

  sections.push({
    id: "purposes",
    title: "Rozdział II. Cele i zasady działania Fundacji",
    required: true,
    tips: [
      "Cel musi być społecznie lub gospodarczo użyteczny.",
      "Cele powinny być konkretne i mierzalne — unikaj zbyt ogólnych sformułowań.",
      "Możesz wpisać kilka celów — każdy w osobnym punkcie.",
    ],
    content: `§ 3
Celami Fundacji są:
${purposesList}

§ 4
Fundacja realizuje swoje cele poprzez:
1) organizowanie i finansowanie projektów, programów i inicjatyw służących realizacji celów statutowych,
2) prowadzenie działalności edukacyjnej, szkoleniowej i informacyjnej,
3) współpracę z organami administracji publicznej, organizacjami pozarządowymi i innymi podmiotami w zakresie celów Fundacji,
4) przyznawanie nagród, stypendiów i dotacji osobom fizycznym i prawnym zasłużonym dla celów Fundacji,
5) organizowanie konferencji, seminariów, warsztatów i innych wydarzeń,
6) wydawanie publikacji, materiałów informacyjnych i edukacyjnych.`,
  });

  // ── ROZDZIAŁ III — Majątek i dochody ───────────────────────
  sections.push({
    id: "assets",
    title: "Rozdział III. Majątek i dochody Fundacji",
    required: true,
    tips: [
      `Fundusz założycielski: ${data.initialFund} zł — wpisz tę kwotę w akcie fundacyjnym.`,
      "Nie ma ustawowego minimum funduszu, ale w praktyce min. 500–1000 zł.",
      "Fundusz założycielski przeznaczony na działalność gospodarczą musi wynosić min. 1000 zł.",
    ],
    content: `§ 5
1. Majątek Fundacji stanowi fundusz założycielski w kwocie ${data.initialFund} złotych (słownie: ………………………………) wniesiony przez Fundatora oraz środki finansowe, nieruchomości i ruchomości nabyte przez Fundację w toku jej działania.
2. Fundacja odpowiada za swoje zobowiązania całym swoim majątkiem.

§ 6
Dochody Fundacji mogą pochodzić z:
1) darowizn, spadków i zapisów krajowych i zagranicznych,
2) dotacji i subwencji osób prawnych,
3) dochodów ze zbiórek i imprez publicznych,
4) dochodów z majątku nieruchomego i ruchomego,
5) odsetek bankowych i innych dochodów kapitałowych,${data.hasEconomicActivity ? "\n6) dochodów z działalności gospodarczej prowadzonej przez Fundację." : ""}

§ 7
1. Dochody Fundacji przeznaczane są wyłącznie na realizację celów statutowych.
2. Fundacja nie może udzielać pożyczek lub zabezpieczać zobowiązań majątkiem Fundacji w stosunku do jej fundatora, członków organów lub pracowników oraz osób bliskich tym osobom.
3. Fundacja nie może przekazywać majątku na rzecz fundatora, członków organów lub pracowników na zasadach innych niż w stosunku do osób trzecich.`,
  });

  // ── ROZDZIAŁ IV — Organy Fundacji ──────────────────────────
  const supervisorySection = data.hasSupervisoryBoard
    ? `\n§ 12\n1. ${data.supervisoryBoardName || "Rada Fundacji"} jest organem kontrolnym i opiniodawczym Fundacji.\n2. ${data.supervisoryBoardName || "Rada Fundacji"} składa się z 3 do 5 członków powoływanych przez Fundatora na czas nieoznaczony.\n3. Do kompetencji ${data.supervisoryBoardName || "Rady Fundacji"} należy:\n   1) ocena pracy Zarządu,\n   2) opiniowanie rocznych sprawozdań finansowych i merytorycznych,\n   3) wnioskowanie do Fundatora o odwołanie Zarządu.\n4. Członkowie ${data.supervisoryBoardName || "Rady Fundacji"} nie mogą być członkami Zarządu ani pozostawać z nimi w związku małżeńskim, we wspólnym pożyciu, w stosunku pokrewieństwa, powinowactwa lub podległości służbowej.`
    : "";

  sections.push({
    id: "organs",
    title: "Rozdział IV. Organy Fundacji",
    required: true,
    tips: [
      "Zarząd jest jedynym obowiązkowym organem fundacji.",
      `Minimalna liczba członków zarządu: ${data.boardMinMembers} osób.`,
      `Kadencja zarządu: ${data.boardTermYears} lata/lat.`,
      "Rada Fundacji jest opcjonalna, ale zalecana przy większych fundacjach.",
    ],
    content: `§ 8
Organami Fundacji są:
1) Zarząd Fundacji,${data.hasSupervisoryBoard ? `\n2) ${data.supervisoryBoardName || "Rada Fundacji"}.` : ""}

§ 9 — Zarząd Fundacji
1. Zarząd Fundacji (zwany dalej „Zarządem") składa się z ${data.boardMinMembers} do ${data.boardMaxMembers} osób, w tym Prezesa Zarządu.
2. Zarząd powoływany jest przez Fundatora na ${data.boardTermYears}-letnią kadencję.
3. Funkcję członka Zarządu można pełnić przez więcej niż jedną kadencję.
4. Fundator może odwołać Zarząd lub poszczególnych jego członków w każdym czasie.

§ 10
1. Zarząd kieruje działalnością Fundacji i reprezentuje ją na zewnątrz.
2. Do kompetencji Zarządu należy:
   1) uchwalanie rocznych planów działania i budżetu Fundacji,
   2) sprawowanie zarządu nad majątkiem Fundacji,
   3) przyjmowanie darowizn, spadków i zapisów,
   4) ustanawianie regulaminów wewnętrznych,
   5) zatrudnianie pracowników i ustalanie ich wynagrodzenia,
   6) sporządzanie sprawozdań z działalności Fundacji.
3. Zarząd podejmuje decyzje na posiedzeniach w formie uchwał, zwykłą większością głosów. W przypadku równej liczby głosów decyduje głos Prezesa Zarządu.

§ 11
1. Oświadczenia woli w imieniu Fundacji składa: ${data.boardRepresentation}.
2. W sprawach majątkowych wymagany jest podpis ${data.boardRepresentation}.${supervisorySection}`,
  });

  // ── ROZDZIAŁ V — Działalność gospodarcza (opcjonalnie) ─────
  if (data.hasEconomicActivity) {
    sections.push({
      id: "economic",
      title: "Rozdział V. Działalność gospodarcza Fundacji",
      required: false,
      tips: [
        "Działalność gospodarcza musi służyć realizacji celów statutowych.",
        "Fundacja prowadząca działalność gospodarczą musi być wpisana do rejestru przedsiębiorców KRS.",
        "Fundusz przeznaczony na działalność gospodarczą musi wynosić min. 1000 zł.",
      ],
      content: `§ ${data.hasSupervisoryBoard ? "13" : "12"}
1. Fundacja może prowadzić działalność gospodarczą w rozmiarach służących realizacji jej celów statutowych.
2. Fundacja prowadzi działalność gospodarczą w zakresie:
   1) PKD 85.59.B — Pozostałe pozaszkolne formy edukacji, gdzie indziej niesklasyfikowane,
   2) PKD 82.30.Z — Działalność związana z organizacją targów, wystaw i kongresów,
   3) PKD 58.14.Z — Wydawanie czasopism i pozostałych periodyków,
   4) PKD 73.11.Z — Działalność agencji reklamowych.
3. Działalność gospodarcza jest działalnością dodatkową w stosunku do działalności pożytku publicznego.
4. Dochody z działalności gospodarczej przeznaczane są wyłącznie na realizację celów statutowych.`,
    });
  }

  // ── ROZDZIAŁ — Zmiana Statutu i Likwidacja ─────────────────
  const chapterNum = data.hasEconomicActivity
    ? (data.hasSupervisoryBoard ? "VII" : "VI")
    : (data.hasSupervisoryBoard ? "VI" : "V");

  sections.push({
    id: "changes",
    title: `Rozdział ${chapterNum}. Zmiana Statutu i Likwidacja Fundacji`,
    required: true,
    tips: [
      "Zmiana celów fundacji wymaga zgody ministra.",
      "Przy likwidacji majątek musi być przekazany na cele zbliżone do celów fundacji.",
      `Beneficjent majątku po likwidacji: ${data.liquidationBeneficiary || "wskazany przez Zarząd podmiot o zbliżonych celach"}.`,
    ],
    content: `§ ${data.hasEconomicActivity ? (data.hasSupervisoryBoard ? "16" : "14") : (data.hasSupervisoryBoard ? "14" : "13")}
1. Zmian w Statucie Fundacji dokonuje Fundator.
2. Zmiany Statutu nie mogą dotyczyć celów określonych w akcie fundacyjnym.

§ ${data.hasEconomicActivity ? (data.hasSupervisoryBoard ? "17" : "15") : (data.hasSupervisoryBoard ? "15" : "14")}
1. Fundacja ulega likwidacji w razie osiągnięcia celów, dla których została powołana, lub wobec wyczerpania środków finansowych i majątku Fundacji.
2. Decyzję o likwidacji Fundacji podejmuje Fundator.
3. Likwidatora Fundacji wyznacza Fundator.
4. Środki finansowe i majątek pozostały po likwidacji Fundacji mogą zostać przeznaczone na rzecz ${data.liquidationBeneficiary || "działających w Rzeczypospolitej Polskiej fundacji lub stowarzyszeń o zbliżonych celach"}.`,
  });

  // ── Postanowienia końcowe ───────────────────────────────────
  const lastChapterNum = data.hasEconomicActivity
    ? (data.hasSupervisoryBoard ? "VIII" : "VII")
    : (data.hasSupervisoryBoard ? "VII" : "VI");

  sections.push({
    id: "final",
    title: `Rozdział ${lastChapterNum}. Postanowienia końcowe`,
    required: true,
    tips: [
      "Statut wchodzi w życie z dniem wpisania Fundacji do KRS.",
      "Rok obrotowy fundacji to rok kalendarzowy (1 stycznia – 31 grudnia).",
    ],
    content: `§ ${data.hasEconomicActivity ? (data.hasSupervisoryBoard ? "18" : "16") : (data.hasSupervisoryBoard ? "16" : "15")}
1. W sprawach nieuregulowanych w niniejszym Statucie stosuje się przepisy ustawy z dnia 6 kwietnia 1984 r. o fundacjach oraz inne obowiązujące przepisy prawa.
2. Statut wchodzi w życie z dniem wpisania Fundacji do Krajowego Rejestru Sądowego.
3. Rokiem obrotowym Fundacji jest rok kalendarzowy.

Statut sporządzono w …………………, dnia ………………… roku.

Fundator:
${data.founderName}
…………………………………………
(podpis)`,
  });

  return sections;
}

// ── Full statute as plain text ────────────────────────────────
export function generateStatuteText(data: StatuteFormData): string {
  const sections = generateStatute(data);
  const header = `STATUT FUNDACJI\n„${data.foundationName}"\n\n`;
  const body = sections.map((s) => `${s.title}\n\n${s.content}`).join("\n\n" + "─".repeat(60) + "\n\n");
  return header + body;
}

// ── Default empty form data ───────────────────────────────────
export function emptyStatuteForm(): StatuteFormData {
  return {
    foundationName: "",
    foundationCity: "",
    foundationAddress: "",
    founderName: "",
    founderType: "person",
    founderAddress: "",
    initialFund: "1000",
    purposes: [""],
    boardMinMembers: "1",
    boardMaxMembers: "3",
    boardTermYears: "3",
    boardRepresentation: "Prezes Zarządu samodzielnie",
    hasEconomicActivity: false,
    hasOPP: false,
    hasVolunteerProgram: false,
    hasSupervisoryBoard: false,
    supervisoryBoardName: "Rada Fundacji",
    operationArea: "poland",
    liquidationBeneficiary: "",
  };
}
