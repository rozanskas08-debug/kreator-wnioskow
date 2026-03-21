import type { VerificationSection } from "./client-types";

// ============================================================
// VERIFICATION DATA
// Detailed checklist for consultant to verify each step
// Based on PDF materials
// ============================================================

export const VERIFICATION_SECTIONS: VerificationSection[] = [
  {
    id: "step1_prep",
    title: "Krok 1: Decyzja i przygotowania",
    subtitle: "Zanim wyjdziemy do notariusza",
    icon: "lightbulb.fill",
    color: "#8B5CF6",
    items: [
      {
        id: "v1_1",
        label: "Cel fundacji jest jasno określony",
        description: "Cel musi być społecznie lub gospodarczo użyteczny. Nie może być sprzeczny z prawem.",
        example: "np. 'wspieranie edukacji dzieci z ubogich rodzin', 'ochrona środowiska naturalnego'",
        checked: false,
        required: true,
      },
      {
        id: "v1_2",
        label: "Fundator jest zidentyfikowany (osoba fizyczna lub prawna)",
        description: "Fundatorem może być osoba fizyczna (Polak lub cudzoziemiec) lub osoba prawna (spółka, inna fundacja).",
        example: "Osoba fizyczna: imię, nazwisko, PESEL, adres zamieszkania",
        checked: false,
        required: true,
      },
      {
        id: "v1_3",
        label: "Ustalono wysokość funduszu założycielskiego",
        description: "Brak ustawowego minimum. W praktyce min. 500–1000 zł. Jeśli planowana działalność gospodarcza — min. 1000 zł.",
        example: "Typowo: 1000 zł. Fundusz pozostaje w fundacji jako majątek.",
        checked: false,
        required: true,
      },
      {
        id: "v1_4",
        label: "Wybrano siedzibę fundacji (miejscowość)",
        description: "Siedziba to miejscowość, nie ulica. Ważne przy wyborze sądu rejestrowego.",
        example: "np. 'Warszawa', 'Kraków', 'Gdańsk'",
        checked: false,
        required: true,
      },
      {
        id: "v1_5",
        label: "Ustalono skład zarządu (imiona, nazwiska, adresy)",
        description: "Zarząd to jedyny obowiązkowy organ fundacji. Min. 1 osoba. Prezes zarządu jest wymagany.",
        example: "Prezes: Jan Kowalski, ul. Kwiatowa 1, 00-001 Warszawa",
        checked: false,
        required: true,
      },
      {
        id: "v1_6",
        label: "Wybrano notariusza i umówiono wizytę",
        description: "Akt fundacyjny musi być sporządzony w formie aktu notarialnego. Taksa: 100 zł + VAT (do 3000 zł funduszu).",
        example: "Notariusz w miejscowości siedziby fundacji lub dowolny notariusz w Polsce",
        checked: false,
        required: true,
      },
      {
        id: "v1_7",
        label: "Przygotowano projekt statutu",
        description: "Statut może być dołączony do aktu fundacyjnego lub sporządzony osobno. Musi zawierać wszystkie obowiązkowe elementy.",
        example: "Użyj kreatora statutu w tej aplikacji",
        checked: false,
        required: true,
      },
    ],
  },
  {
    id: "step2_statute",
    title: "Krok 2: Akt fundacyjny i statut",
    subtitle: "Weryfikacja dokumentów notarialnych",
    icon: "doc.text.fill",
    color: "#E07B1A",
    items: [
      {
        id: "v2_1",
        label: "Akt fundacyjny zawiera: oświadczenie woli fundatora",
        description: "Fundator oświadcza, że ustanawia fundację i przeznacza majątek na jej cele.",
        example: "'Ja, Jan Kowalski, ustanawiam fundację pod nazwą... i przeznaczam na jej cele kwotę...'",
        checked: false,
        required: true,
      },
      {
        id: "v2_2",
        label: "Akt fundacyjny zawiera: cel fundacji",
        description: "Cel musi być zgodny z celami w statucie.",
        example: "Cel: 'wspieranie edukacji dzieci i młodzieży'",
        checked: false,
        required: true,
      },
      {
        id: "v2_3",
        label: "Akt fundacyjny zawiera: wysokość funduszu założycielskiego",
        description: "Kwota funduszu musi być podana cyframi i słownie.",
        example: "1000 zł (słownie: jeden tysiąc złotych)",
        checked: false,
        required: true,
      },
      {
        id: "v2_4",
        label: "Statut zawiera: nazwę fundacji ze słowem 'Fundacja'",
        description: "Nazwa musi zawierać słowo 'Fundacja'. Nazwa musi odróżniać się od innych fundacji.",
        example: "Fundacja Pomocna Dłoń, Fundacja im. Jana Kowalskiego",
        checked: false,
        required: true,
      },
      {
        id: "v2_5",
        label: "Statut zawiera: siedzibę fundacji",
        description: "Siedziba to miejscowość (nie ulica).",
        example: "Siedzibą Fundacji jest Warszawa.",
        checked: false,
        required: true,
      },
      {
        id: "v2_6",
        label: "Statut zawiera: majątek fundacji (fundusz założycielski)",
        description: "Kwota funduszu musi być zgodna z aktem fundacyjnym.",
        example: "Majątek Fundacji stanowi fundusz założycielski w kwocie 1000 zł.",
        checked: false,
        required: true,
      },
      {
        id: "v2_7",
        label: "Statut zawiera: cele fundacji",
        description: "Cele muszą być zgodne z celami w akcie fundacyjnym.",
        example: "Celami Fundacji są: 1) wspieranie edukacji...",
        checked: false,
        required: true,
      },
      {
        id: "v2_8",
        label: "Statut zawiera: zasady działania fundacji (formy realizacji celów)",
        description: "Jak fundacja będzie realizować cele — np. organizowanie szkoleń, przyznawanie stypendiów.",
        example: "Fundacja realizuje cele poprzez: organizowanie szkoleń, przyznawanie stypendiów...",
        checked: false,
        required: true,
      },
      {
        id: "v2_9",
        label: "Statut zawiera: skład i organizację zarządu",
        description: "Min. liczba członków, sposób powoływania, kadencja, kompetencje.",
        example: "Zarząd składa się z 1 do 3 osób powoływanych przez Fundatora na 3-letnią kadencję.",
        checked: false,
        required: true,
      },
      {
        id: "v2_10",
        label: "Statut zawiera: sposób reprezentacji fundacji",
        description: "Kto i jak podpisuje dokumenty w imieniu fundacji.",
        example: "Oświadczenia woli składa Prezes Zarządu samodzielnie.",
        checked: false,
        required: true,
      },
      {
        id: "v2_11",
        label: "Statut zawiera: zasady zmiany statutu",
        description: "Kto może zmieniać statut i w jakim trybie.",
        example: "Zmian w Statucie dokonuje Fundator.",
        checked: false,
        required: true,
      },
      {
        id: "v2_12",
        label: "Statut zawiera: zasady likwidacji fundacji",
        description: "Kiedy i jak fundacja może być zlikwidowana, co dzieje się z majątkiem.",
        example: "Fundacja ulega likwidacji w razie osiągnięcia celów lub wyczerpania środków.",
        checked: false,
        required: true,
      },
      {
        id: "v2_13",
        label: "Statut NIE zawiera zakazanych postanowień (art. 5 ust. 5 ustawy o fundacjach)",
        description: "Zakaz: udzielania pożyczek fundatorowi/organom/pracownikom, przekazywania majątku na ich rzecz na preferencyjnych warunkach, zakupu towarów od nich po zawyżonych cenach.",
        example: "Sprawdź czy statut nie zawiera klauzul umożliwiających czerpanie korzyści przez fundatora",
        checked: false,
        required: true,
      },
    ],
  },
  {
    id: "step3_krs",
    title: "Krok 3: Wniosek do KRS",
    subtitle: "Kompletność dokumentów przed złożeniem",
    icon: "building.columns.fill",
    color: "#1A5FA8",
    items: [
      {
        id: "v3_1",
        label: "Formularz KRS-W20 (wniosek o rejestrację fundacji) — wypełniony",
        description: "Wniosek o rejestrację podmiotu w rejestrze stowarzyszeń, innych organizacji społecznych i zawodowych, fundacji oraz samodzielnych publicznych zakładów opieki zdrowotnej.",
        example: "Dostępny na: prs.ms.gov.pl lub w sądzie rejestrowym",
        checked: false,
        required: true,
      },
      {
        id: "v3_2",
        label: "Formularz KRS-WK (organy podmiotu) — wypełniony",
        description: "Dane wszystkich członków zarządu: imię, nazwisko, PESEL, adres zamieszkania, funkcja.",
        example: "Jeden formularz KRS-WK na każdego członka zarządu",
        checked: false,
        required: true,
      },
      {
        id: "v3_3",
        label: "Akt fundacyjny — oryginał lub odpis notarialny",
        description: "Oryginał aktu notarialnego lub jego poświadczony odpis.",
        example: "Notariusz wydaje kilka egzemplarzy — jeden do KRS",
        checked: false,
        required: true,
      },
      {
        id: "v3_4",
        label: "Statut fundacji — 2 egzemplarze podpisane przez fundatora",
        description: "Statut musi być podpisany przez fundatora. Jeśli statut jest w akcie notarialnym — nie trzeba osobno.",
        example: "Podpis fundatora na każdej stronie lub na ostatniej stronie",
        checked: false,
        required: true,
      },
      {
        id: "v3_5",
        label: "Uchwała zarządu o przyjęciu funkcji (jeśli wymagana)",
        description: "Oświadczenie członków zarządu o przyjęciu powołania na stanowisko.",
        example: "Uchwała nr 1/2024 Zarządu Fundacji... z dnia...",
        checked: false,
        required: false,
      },
      {
        id: "v3_6",
        label: "Oświadczenie o adresie do doręczeń (każdy członek zarządu)",
        description: "Każdy członek zarządu składa oświadczenie o adresie do doręczeń.",
        example: "Formularz dostępny w sądzie lub na prs.ms.gov.pl",
        checked: false,
        required: true,
      },
      {
        id: "v3_7",
        label: "Dowód opłaty sądowej (500 zł) lub wniosek o zwolnienie",
        description: "Opłata za rejestrację: 500 zł (sąd) + 100 zł (Monitor Sądowy i Gospodarczy). Łącznie 600 zł.",
        example: "Przelew na konto sądu rejestrowego z tytułem: 'opłata sądowa KRS-W20'",
        checked: false,
        required: true,
      },
      {
        id: "v3_8",
        label: "Wniosek podpisany przez CAŁY zarząd",
        description: "Pod wnioskiem muszą podpisać się WSZYSCY członkowie zarządu — bez wyjątku.",
        example: "Brak podpisu choćby jednego członka zarządu = zwrot wniosku",
        checked: false,
        required: true,
      },
      {
        id: "v3_9",
        label: "Adres siedziby fundacji potwierdzony (tytuł prawny do lokalu)",
        description: "Sąd może wymagać dokumentu potwierdzającego prawo do lokalu (umowa najmu, akt własności).",
        example: "Umowa najmu, oświadczenie właściciela o udostępnieniu lokalu",
        checked: false,
        required: false,
      },
    ],
  },
  {
    id: "step4_after",
    title: "Krok 4: Po rejestracji w KRS",
    subtitle: "Obowiązki w ciągu 14–21 dni",
    icon: "checkmark.seal.fill",
    color: "#22A45D",
    items: [
      {
        id: "v4_1",
        label: "CRBR — zgłoszenie beneficjenta rzeczywistego (14 dni od rejestracji)",
        description: "Centralny Rejestr Beneficjentów Rzeczywistych. Zgłoszenie przez crbr.podatki.gov.pl. Brak zgłoszenia = kara do 1 mln zł.",
        example: "Beneficjent rzeczywisty fundacji = fundator i/lub osoby sprawujące kontrolę",
        checked: false,
        required: true,
      },
      {
        id: "v4_2",
        label: "NIP-8 — zgłoszenie uzupełniające do urzędu skarbowego (21 dni)",
        description: "Formularz NIP-8 zawiera m.in. numer konta bankowego, dane o zatrudnieniu, rok obrotowy.",
        example: "Złóż do urzędu skarbowego właściwego dla siedziby fundacji",
        checked: false,
        required: true,
      },
      {
        id: "v4_3",
        label: "Konto bankowe — założone na nazwę fundacji",
        description: "Fundacja musi mieć konto bankowe. Potrzebny: odpis z KRS, statut, PESEL/dowód prezesa.",
        example: "Banki często oferują bezpłatne konta dla NGO",
        checked: false,
        required: true,
      },
      {
        id: "v4_4",
        label: "Odpis z KRS — pobrany (do okazania w banku, US, ZUS)",
        description: "Bezpłatny odpis dostępny na rejestr.io lub prs.ms.gov.pl.",
        example: "Numer KRS nadawany automatycznie, NIP i REGON też nadawane z urzędu",
        checked: false,
        required: true,
      },
      {
        id: "v4_5",
        label: "Pieczątka fundacji — zamówiona (opcjonalnie)",
        description: "Pieczątka nie jest obowiązkowa prawnie, ale przydatna w praktyce.",
        example: "Nazwa fundacji, adres, NIP, KRS",
        checked: false,
        required: false,
      },
      {
        id: "v4_6",
        label: "Polityka rachunkowości — przyjęta przez zarząd",
        description: "Fundacja musi prowadzić pełną księgowość. Zarząd przyjmuje politykę rachunkowości uchwałą.",
        example: "Rok obrotowy: 1 stycznia – 31 grudnia. Metoda kasowa lub memoriałowa.",
        checked: false,
        required: true,
      },
      {
        id: "v4_7",
        label: "Sprawozdawczość — ustalono kto prowadzi księgowość",
        description: "Fundacja składa roczne sprawozdanie finansowe i merytoryczne. Termin: do 31 marca za rok poprzedni.",
        example: "Biuro rachunkowe, zewnętrzny księgowy lub wolontariusz z uprawnieniami",
        checked: false,
        required: true,
      },
      {
        id: "v4_8",
        label: "Fundusz założycielski — wpłacony na konto fundacji",
        description: "Fundusz założycielski zadeklarowany w akcie fundacyjnym musi trafić na konto fundacji.",
        example: "Przelew od fundatora na konto fundacji z tytułem: 'fundusz założycielski'",
        checked: false,
        required: true,
      },
    ],
  },
];

// ── Compute verification score ────────────────────────────────
export function getVerificationScore(sections: VerificationSection[]): {
  total: number;
  checked: number;
  required: number;
  requiredChecked: number;
  pct: number;
} {
  const allItems = sections.flatMap((s) => s.items);
  const total = allItems.length;
  const checked = allItems.filter((i) => i.checked).length;
  const required = allItems.filter((i) => i.required).length;
  const requiredChecked = allItems.filter((i) => i.required && i.checked).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  return { total, checked, required, requiredChecked, pct };
}
