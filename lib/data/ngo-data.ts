// NGO Registration Data — based on official PDF guides from poradnik.ngo.pl

export type NGOType = "fundacja" | "stowarzyszenie" | "stowarzyszenie-zwykle";

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  hint?: string;
}

export interface WizardStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  tips: string[];
  checklist: ChecklistItem[];
  costs?: string;
  timeframe?: string;
  legalBasis?: string;
  warning?: string;
}

export interface NGOWizard {
  type: NGOType;
  label: string;
  labelShort: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  totalCost: string;
  timeframe: string;
  steps: WizardStep[];
}

export interface LegalAct {
  id: string;
  title: string;
  shortTitle: string;
  date: string;
  journalRef: string;
  description: string;
  keyProvisions: string[];
  url: string;
  relevantFor: NGOType[];
}

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  recommended: boolean;
  description: string;
  features: string[];
  notIncluded: string[];
}

// ============================================================
// FOUNDATION WIZARD — based on "fundacja-a4-na-dwoch-stronach-2.pdf"
// ============================================================

const FUNDACJA_STEPS: WizardStep[] = [
  {
    id: "przygotowania",
    stepNumber: 1,
    title: "Przygotowania",
    subtitle: "Krok 1 z 3",
    description:
      "Fundator (lub fundatorzy) mają pomysł na działalność społeczną. Na tym etapie przygotowujesz wszystkie dokumenty i powoływujesz zarząd. Fundacja może być też ustanowiona w testamencie.",
    tips: [
      "Fundatorem może być jedna osoba fizyczna lub prawna — nie potrzebujesz grupy",
      "Fundusz założycielski: nie ma stałej kwoty, w praktyce 500–1000 zł + min. 1000 zł na działalność; może być mniej jeśli fundacja prowadzi działalność gospodarczą",
      "Komisja rewizyjna i rada fundacji nie są obowiązkowe, ale warto je wybrać",
      "Cel fundacji musi być społecznie lub gospodarczo użyteczny",
      "Statut to najważniejszy dokument — warto skonsultować go z prawnikiem NGO",
    ],
    checklist: [
      {
        id: "cel",
        label: "Określony cel fundacji (społecznie lub gospodarczo użyteczny)",
        required: true,
        hint: "Cel musi być wpisany do aktu fundacyjnego i statutu",
      },
      {
        id: "fundusz",
        label: "Fundusz założycielski (środki finansowe lub majątek rzeczowy)",
        required: true,
        hint: "Praktyczne minimum: 500–1000 zł + min. 1000 zł na działalność",
      },
      {
        id: "akt-notarialny",
        label: "Akt fundacyjny sporządzony u notariusza",
        required: true,
        hint: "Opłata notarialna: min. 100 zł. Zawiera: nazwę, cel, majątek fundacji",
      },
      {
        id: "statut",
        label: "Statut fundacji uchwalony przez fundatora",
        required: true,
        hint: "Musi zawierać: nazwę, siedzibę, cele, formy działalności, organy, gospodarkę finansową",
      },
      {
        id: "uchwala-statutu",
        label: "Uchwała fundatora o przyjęciu statutu",
        required: true,
      },
      {
        id: "zarzad",
        label: "Zarząd wybrany przez fundatora",
        required: true,
        hint: "Zarząd jest jedynym obowiązkowym organem fundacji",
      },
      {
        id: "uchwala-zarzadu",
        label: "Uchwała o wyborze zarządu",
        required: true,
      },
      {
        id: "komisja",
        label: "Komisja rewizyjna / Rada fundacji (opcjonalnie)",
        required: false,
        hint: "Nie są obowiązkowe, ale warto je powołać dla transparentności",
      },
      {
        id: "uchwala-komisji",
        label: "Uchwała o wyborze komisji rewizyjnej / rady fundacji (jeśli powołana)",
        required: false,
      },
      {
        id: "minister",
        label: "Oświadczenie o wyborze ministra nadzorującego",
        required: true,
        hint: "Minister właściwy ze względu na cel fundacji (np. edukacja → MEN, środowisko → MŚ)",
      },
      {
        id: "oswiadczenia-zarzad",
        label: "Oświadczenia członków zarządu o adresach do doręczeń (1 egz. na osobę)",
        required: true,
      },
    ],
    costs: "Min. 100 zł (notariusz)",
    legalBasis: "Ustawa o fundacjach z dnia 6 kwietnia 1984 r.",
  },
  {
    id: "rejestracja-krs",
    stepNumber: 2,
    title: "Wniosek o rejestrację w KRS",
    subtitle: "Krok 2 z 3",
    description:
      "Składasz wniosek o wpis fundacji do Krajowego Rejestru Sądowego. Fundacja bez działalności gospodarczej może złożyć wniosek papierowo lub elektronicznie. Fundacja z działalnością gospodarczą — wyłącznie elektronicznie przez portal PRS.",
    tips: [
      "Portal elektroniczny: prs.ms.gov.pl",
      "Pod wnioskiem podpisuje się CAŁY zarząd (bez wyjątku)",
      "Dokumenty elektroniczne: skany/zdjęcia (wtedy wyślij oryginały papierowe do KRS w ciągu 3 dni) ALBO dokumenty podpisane profilem zaufanym",
      "Profil zaufany jest bezpłatny — można go założyć na gov.pl",
      "Czas rejestracji: różnie, średnio 1–1,5 miesiąca",
      "Sąd może wezwać do uzupełnienia braków — reaguj szybko",
    ],
    checklist: [
      {
        id: "krs-w20",
        label: "Formularz KRS-W20 (formularz główny) — 1 szt.",
        required: true,
        hint: "Zawiera: nazwę, adres siedziby, organ nadzoru, datę uchwalenia statutu, listę załączników",
      },
      {
        id: "krs-wk",
        label: "Formularz KRS-WK (zgłoszenie zarządu i ew. rady fundacji) — 1 szt. lub więcej",
        required: true,
        hint: "Liczba formularzy zależy od liczby osób we władzach",
      },
      {
        id: "statut-3egz",
        label: "Statut fundacji — 3 egzemplarze (papierowo) lub 1 plik (elektronicznie)",
        required: true,
      },
      {
        id: "akt-not-krs",
        label: "Akt notarialny (fundacyjny)",
        required: true,
      },
      {
        id: "uchwaly-wladz",
        label: "Uchwały o wyborze władz (zarząd, rada fundacji)",
        required: true,
      },
      {
        id: "oswiadczenie-ministra",
        label: "Oświadczenie o wyborze ministra nadzorującego",
        required: true,
      },
      {
        id: "oswiadczenia-adresy",
        label: "Oświadczenia członków zarządu o adresach do doręczeń — 1 egz. na osobę",
        required: true,
      },
      {
        id: "oplata-krs",
        label: "Dowód opłaty sądowej: 250 zł (bez dz. gosp.) lub 600 zł (z dz. gosp.)",
        required: true,
        hint: "Fundacja bez działalności gospodarczej: 250 zł. Z działalnością gospodarczą: 600 zł",
      },
    ],
    costs: "250 zł (bez dz. gosp.) lub 600 zł (z dz. gosp.)",
    timeframe: "Średnio 1–1,5 miesiąca",
    warning:
      "Pod wnioskiem o rejestrację podpisuje się CAŁY zarząd — bez wyjątku!",
    legalBasis: "Ustawa o KRS z dnia 20 sierpnia 1997 r.",
  },
  {
    id: "po-rejestracji",
    stepNumber: 3,
    title: "Po rejestracji w KRS",
    subtitle: "Krok 3 z 3",
    description:
      "Razem z numerem KRS otrzymujesz automatycznie numery REGON i NIP — nie musisz po nie chodzić do innych urzędów. Następnie zakładasz konto bankowe i zgłaszasz beneficjentów rzeczywistych.",
    tips: [
      "NIP i REGON są nadawane automatycznie przy rejestracji w KRS",
      "Beneficjentów rzeczywistych zgłoś w ciągu 7 dni od rejestracji",
      "Dane uzupełniające (np. numer konta bankowego) zgłoś na formularzu NIP-8 do urzędu skarbowego w ciągu 21 dni",
      "Wiele banków oferuje bezpłatne konta dla organizacji NGO",
      "Od teraz prowadź rzetelną księgowość — zarząd odpowiada za wszystkie działania",
    ],
    checklist: [
      {
        id: "numer-krs",
        label: "Numer KRS otrzymany (wraz z REGON i NIP)",
        required: true,
        hint: "Otrzymujesz automatycznie — nie musisz chodzić do innych urzędów",
      },
      {
        id: "crbr",
        label: "Zgłoszenie beneficjentów rzeczywistych (CRBR) w ciągu 7 dni",
        required: true,
        hint: "Portal: crbr.podatki.gov.pl/adcrbr — zgłasza zarząd",
      },
      {
        id: "konto-bankowe",
        label: "Konto bankowe założone dla fundacji",
        required: true,
        hint: "Wybierz bank oferujący konta dla NGO (często bezpłatne)",
      },
      {
        id: "nip8",
        label: "Formularz NIP-8 złożony do urzędu skarbowego w ciągu 21 dni",
        required: true,
        hint: "Zgłoś dane uzupełniające: numer konta bankowego i inne dane nieznane przy rejestracji",
      },
    ],
    costs: "Bezpłatnie",
    timeframe: "7 dni (CRBR) + 21 dni (NIP-8)",
    legalBasis: "Ustawa o KRS, Ustawa o rachunkowości",
  },
];

// ============================================================
// ASSOCIATION WIZARD — based on "stowarzyszenie-a4-na-dwoch-stronach.pdf"
// ============================================================

const STOWARZYSZENIE_STEPS: WizardStep[] = [
  {
    id: "zebranie",
    stepNumber: 1,
    title: "Zebranie założycielskie",
    subtitle: "Krok 1 z 3",
    description:
      "Założyciele (min. 7 osób) zbierają się i zakładają stowarzyszenie: tworzą i uchwalają statut, wybierają władze. Wszystkie dokumenty z zebrania będą załącznikami do wniosku o rejestrację.",
    tips: [
      "Minimum 7 osób — wszyscy muszą być pełnoletni z pełną zdolnością do czynności prawnych",
      "Wyznacz przewodniczącego i protokolanta zebrania",
      "Uchwały muszą być podjęte zgodnie z procedurą opisaną w statucie",
      "Zachowaj oryginały wszystkich dokumentów z zebrania",
      "Statut to najważniejszy dokument — warto skonsultować go z prawnikiem NGO",
    ],
    checklist: [
      {
        id: "cel-misja",
        label: "Określony cel i misja stowarzyszenia (niezarobkowy)",
        required: true,
        hint: "Cel musi być wpisany do statutu",
      },
      {
        id: "min7",
        label: "Minimum 7 założycieli (pełnoletni, pełna zdolność prawna)",
        required: true,
        hint: "Cudzoziemcy mogą być założycielami na wyjątkowych zasadach",
      },
      {
        id: "statut-stow",
        label: "Statut stowarzyszenia przygotowany i uchwalony",
        required: true,
        hint: "Musi zawierać: nazwę, siedzibę, cele, metody działania, zasady członkostwa, organy, finanse, likwidację",
      },
      {
        id: "lista-czlonkow",
        label: "Lista członków założycieli (imiona, nazwiska, adresy, podpisy)",
        required: true,
      },
      {
        id: "protokol",
        label: "Protokół z zebrania założycielskiego",
        required: true,
        hint: "Podpisany przez przewodniczącego i protokolanta zebrania",
      },
      {
        id: "uchwala-powolanie",
        label: "Uchwała o powołaniu stowarzyszenia",
        required: true,
      },
      {
        id: "uchwala-statut",
        label: "Uchwała o przyjęciu statutu",
        required: true,
      },
      {
        id: "uchwala-zarzad",
        label: "Uchwała o wyborze zarządu",
        required: true,
        hint: "Zarząd jest obowiązkowym organem stowarzyszenia",
      },
      {
        id: "uchwala-komisja",
        label: "Uchwała o wyborze komisji rewizyjnej",
        required: true,
        hint: "Komisja rewizyjna jest obowiązkowym organem stowarzyszenia rejestrowego",
      },
      {
        id: "oswiadczenia-stow",
        label: "Oświadczenia członków zarządu o adresach do doręczeń (1 egz. na osobę)",
        required: true,
      },
    ],
    legalBasis: "Ustawa Prawo o stowarzyszeniach z dnia 7 kwietnia 1989 r.",
  },
  {
    id: "rejestracja-krs-stow",
    stepNumber: 2,
    title: "Wniosek o rejestrację w KRS",
    subtitle: "Krok 2 z 3",
    description:
      "Składasz wniosek o wpis stowarzyszenia do Krajowego Rejestru Sądowego. Stowarzyszenie bez działalności gospodarczej może złożyć wniosek papierowo lub elektronicznie. Z działalnością gospodarczą — wyłącznie elektronicznie.",
    tips: [
      "Portal elektroniczny: prs.ms.gov.pl",
      "Pod wnioskiem podpisuje się CAŁY zarząd",
      "Dokumenty: skany/zdjęcia (wyślij oryginały do KRS w ciągu 3 dni) ALBO podpisane profilem zaufanym",
      "Profil zaufany jest bezpłatny — można go założyć na gov.pl",
      "Stowarzyszenie bez działalności gospodarczej: rejestracja BEZPŁATNA",
      "Czas rejestracji: różnie, średnio 1–1,5 miesiąca",
    ],
    checklist: [
      {
        id: "krs-w20-stow",
        label: "Formularz KRS-W20 (formularz główny) — 1 szt.",
        required: true,
        hint: "Zawiera: nazwę, adres siedziby, organ nadzoru, datę uchwalenia statutu",
      },
      {
        id: "krs-wk-stow",
        label: "Formularz KRS-WK (zgłoszenie zarządu i komisji rewizyjnej) — 2 szt. lub więcej",
        required: true,
        hint: "Liczba formularzy zależy od liczby osób we władzach",
      },
      {
        id: "statut-2egz",
        label: "Statut stowarzyszenia — 2 egzemplarze (papierowo) lub 1 plik (elektronicznie)",
        required: true,
      },
      {
        id: "dokumenty-zebrania",
        label: "Dokumenty z zebrania założycielskiego — 2 egz. (papierowo) lub 1 plik (elektronicznie)",
        required: true,
        hint: "Lista członków, protokół, wszystkie uchwały",
      },
      {
        id: "oswiadczenia-adresy-stow",
        label: "Oświadczenia członków zarządu o adresach do doręczeń — 1 egz. na osobę",
        required: true,
      },
      {
        id: "oplata-krs-stow",
        label: "Dowód opłaty: 0 zł (bez dz. gosp.) lub 600 zł (z dz. gosp.)",
        required: true,
        hint: "Stowarzyszenie bez działalności gospodarczej jest BEZPŁATNE",
      },
    ],
    costs: "0 zł (bez dz. gosp.) lub 600 zł (z dz. gosp.)",
    timeframe: "Średnio 1–1,5 miesiąca",
    warning:
      "Pod wnioskiem o rejestrację podpisuje się CAŁY zarząd — bez wyjątku!",
    legalBasis: "Ustawa o KRS z dnia 20 sierpnia 1997 r.",
  },
  {
    id: "po-rejestracji-stow",
    stepNumber: 3,
    title: "Po rejestracji w KRS",
    subtitle: "Krok 3 z 3",
    description:
      "Razem z numerem KRS otrzymujesz automatycznie numery REGON i NIP. Następnie zakładasz konto bankowe i zgłaszasz beneficjentów rzeczywistych do CRBR.",
    tips: [
      "NIP i REGON są nadawane automatycznie przy rejestracji w KRS",
      "Beneficjentów rzeczywistych zgłoś w ciągu 7 dni od rejestracji",
      "Dane uzupełniające (np. numer konta bankowego) zgłoś na formularzu NIP-8 w ciągu 21 dni",
      "Wiele banków oferuje bezpłatne konta dla organizacji NGO",
      "Organ nadzoru stowarzyszenia: starosta powiatu (ze względu na siedzibę)",
      "Stowarzyszenie nie ma obowiązku corocznego sprawozdania merytorycznego (w odróżnieniu od fundacji)",
    ],
    checklist: [
      {
        id: "numer-krs-stow",
        label: "Numer KRS otrzymany (wraz z REGON i NIP)",
        required: true,
        hint: "Otrzymujesz automatycznie — nie musisz chodzić do innych urzędów",
      },
      {
        id: "crbr-stow",
        label: "Zgłoszenie beneficjentów rzeczywistych (CRBR) w ciągu 7 dni",
        required: true,
        hint: "Portal: crbr.podatki.gov.pl/adcrbr — zgłasza zarząd",
      },
      {
        id: "konto-stow",
        label: "Konto bankowe założone dla stowarzyszenia",
        required: true,
        hint: "Wybierz bank oferujący konta dla NGO (często bezpłatne)",
      },
      {
        id: "nip8-stow",
        label: "Formularz NIP-8 złożony do urzędu skarbowego w ciągu 21 dni",
        required: true,
        hint: "Zgłoś dane uzupełniające: numer konta bankowego i inne dane nieznane przy rejestracji",
      },
    ],
    costs: "Bezpłatnie",
    timeframe: "7 dni (CRBR) + 21 dni (NIP-8)",
    legalBasis: "Ustawa o KRS, Ustawa o rachunkowości",
  },
];

// ============================================================
// SIMPLE ASSOCIATION WIZARD — based on webinar PDF
// ============================================================

const STOWARZYSZENIE_ZWYKLE_STEPS: WizardStep[] = [
  {
    id: "zebranie-zwykle",
    stepNumber: 1,
    title: "Zebranie założycielskie",
    subtitle: "Krok 1 z 3",
    description:
      "Minimum 3 osoby zbierają się i zakładają stowarzyszenie zwykłe. Opracowują regulamin działania i wybierają przedstawiciela lub zarząd. Stowarzyszenie zwykłe NIE ma osobowości prawnej i nie może prowadzić działalności sprzedażowej.",
    tips: [
      "Minimum 3 osoby — mniej niż w stowarzyszeniu rejestrowym",
      "Stowarzyszenie zwykłe NIE ma osobowości prawnej",
      "Nie może prowadzić działalności gospodarczej ani odpłatnej działalności pożytku publicznego",
      "Nie musi mieć zarządu ani komisji rewizyjnej — wystarczą członkowie i przedstawiciel",
      "Jeśli planujesz poważną działalność — rozważ stowarzyszenie rejestrowe",
    ],
    checklist: [
      {
        id: "cel-zwykle",
        label: "Określony cel działania (niezarobkowy)",
        required: true,
      },
      {
        id: "min3",
        label: "Minimum 3 założycieli (pełnoletni)",
        required: true,
      },
      {
        id: "regulamin",
        label: "Regulamin działania stowarzyszenia zwykłego",
        required: true,
        hint: "Musi zawierać: nazwę, cel, teren działania, siedzibę, zasady reprezentacji, zasady członkostwa",
      },
      {
        id: "lista-zwykle",
        label: "Lista osób zakładających (imiona, nazwiska, data i miejsce urodzenia, zamieszkanie, podpis)",
        required: true,
      },
      {
        id: "protokol-zwykle",
        label: "Protokół z zebrania założycielskiego",
        required: true,
      },
      {
        id: "uchwala-zal",
        label: "Uchwała o założeniu stowarzyszenia",
        required: true,
      },
      {
        id: "uchwala-reg",
        label: "Uchwała o przyjęciu regulaminu",
        required: true,
      },
      {
        id: "uchwala-przedstawiciel",
        label: "Uchwała o wyborze przedstawiciela lub zarządu",
        required: true,
      },
    ],
    legalBasis: "Art. 40-43 Ustawy Prawo o stowarzyszeniach (1989)",
  },
  {
    id: "ewidencja-starosty",
    stepNumber: 2,
    title: "Wniosek do ewidencji starosty",
    subtitle: "Krok 2 z 3",
    description:
      "Stowarzyszenie zwykłe nie rejestruje się w KRS — składa wniosek o wpis do ewidencji stowarzyszeń zwykłych prowadzonej przez starostę powiatu właściwego dla siedziby.",
    tips: [
      "Wniosek składasz do starostwa powiatowego właściwego dla siedziby",
      "Rejestracja jest bezpłatna",
      "Starosta może zakazać działalności w ciągu 30 dni od zgłoszenia",
      "Po upływie 30 dni bez sprzeciwu — możesz działać",
      "Ewidencja stowarzyszeń zwykłych jest publiczna",
    ],
    checklist: [
      {
        id: "wniosek-starosta",
        label: "Wniosek o wpis do ewidencji stowarzyszeń zwykłych",
        required: true,
        hint: "Krótka informacja: że stowarzyszenie powstało, kto je reprezentuje, adres siedziby. Możesz użyć gotowego wzoru z urzędu",
      },
      {
        id: "regulamin-kopia",
        label: "Regulamin stowarzyszenia",
        required: true,
      },
      {
        id: "lista-zal-kopia",
        label: "Lista osób zakładających",
        required: true,
      },
      {
        id: "protokol-kopia",
        label: "Protokół z zebrania założycielskiego",
        required: true,
      },
      {
        id: "uchwaly-kopia",
        label: "Uchwały (o założeniu, przyjęciu regulaminu, wyborze przedstawiciela)",
        required: true,
      },
      {
        id: "dane-przedstawiciela",
        label: "Dane przedstawiciela: imię, nazwisko, PESEL, adres zamieszkania",
        required: true,
        hint: "Dane mogą być podane we wniosku lub jako osobny dokument",
      },
    ],
    costs: "Bezpłatnie",
    timeframe: "30 dni (termin na sprzeciw starosty)",
    legalBasis: "Art. 41 Ustawy Prawo o stowarzyszeniach (1989)",
  },
  {
    id: "po-rejestracji-zwykle",
    stepNumber: 3,
    title: "Po wpisie do ewidencji",
    subtitle: "Krok 3 z 3",
    description:
      "Po wpisie do ewidencji starosty możesz rozpocząć działalność. W odróżnieniu od stowarzyszenia rejestrowego, REGON i NIP NIE są nadawane automatycznie — musisz złożyć wnioski samodzielnie.",
    tips: [
      "REGON: złóż wniosek RG-OP do urzędu statystycznego w ciągu 14 dni od wpisu",
      "NIP: złóż wniosek NIP-2 do urzędu skarbowego właściwego dla siedziby",
      "Stowarzyszenie zwykłe może założyć konto bankowe",
      "Pamiętaj: nie możesz prowadzić działalności sprzedażowej",
    ],
    checklist: [
      {
        id: "wpis-ewidencja",
        label: "Wpis do ewidencji stowarzyszeń zwykłych otrzymany",
        required: true,
      },
      {
        id: "regon-zwykle",
        label: "Wniosek RG-OP złożony do urzędu statystycznego (14 dni od wpisu)",
        required: true,
        hint: "REGON nie jest nadawany automatycznie — złóż wniosek samodzielnie",
      },
      {
        id: "nip-zwykle",
        label: "Wniosek NIP-2 złożony do urzędu skarbowego",
        required: true,
        hint: "Urząd skarbowy właściwy dla siedziby stowarzyszenia",
      },
      {
        id: "konto-zwykle",
        label: "Konto bankowe założone (opcjonalnie)",
        required: false,
      },
    ],
    costs: "Bezpłatnie",
    timeframe: "14 dni (REGON)",
    legalBasis: "Ustawa Prawo o stowarzyszeniach (1989)",
  },
];

// ============================================================
// MAIN WIZARDS EXPORT
// ============================================================

export const NGO_WIZARDS: Record<NGOType, NGOWizard> = {
  fundacja: {
    type: "fundacja",
    label: "Fundacja",
    labelShort: "Fundacja",
    icon: "building.2.fill",
    color: "#E07B1A",
    bgColor: "#FEF3E8",
    description: "Organizacja powołana przez fundatora (1 osoba) do realizacji celów społecznie użytecznych",
    totalCost: "Min. 100 zł (notariusz) + 250 zł (KRS)",
    timeframe: "Średnio 1–1,5 miesiąca",
    steps: FUNDACJA_STEPS,
  },
  stowarzyszenie: {
    type: "stowarzyszenie",
    label: "Stowarzyszenie",
    labelShort: "Stowarzyszenie",
    icon: "person.3.fill",
    color: "#1A5FA8",
    bgColor: "#E8F0FB",
    description: "Demokratyczna organizacja zrzeszająca min. 7 osób wokół wspólnego celu",
    totalCost: "0 zł (bez dz. gosp.) lub 600 zł (z dz. gosp.)",
    timeframe: "Średnio 1–1,5 miesiąca",
    steps: STOWARZYSZENIE_STEPS,
  },
  "stowarzyszenie-zwykle": {
    type: "stowarzyszenie-zwykle",
    label: "Stowarzyszenie Zwykłe",
    labelShort: "Stow. Zwykłe",
    icon: "person.3.fill",
    color: "#22A45D",
    bgColor: "#E8F7EF",
    description: "Uproszczona forma — min. 3 osoby, rejestracja u starosty, bez osobowości prawnej",
    totalCost: "Bezpłatnie",
    timeframe: "30 dni (termin na sprzeciw starosty)",
    steps: STOWARZYSZENIE_ZWYKLE_STEPS,
  },
};

// ============================================================
// LEGAL ACTS — from webinar slide "Akty prawne"
// ============================================================

export const LEGAL_ACTS: LegalAct[] = [
  {
    id: "prawo-o-stowarzyszeniach",
    title: "Ustawa z dnia 7 kwietnia 1989 r. Prawo o stowarzyszeniach",
    shortTitle: "Prawo o stowarzyszeniach",
    date: "7 kwietnia 1989 r.",
    journalRef: "Dz.U. 2020 poz. 2261 (tekst jednolity)",
    description:
      "Podstawowy akt prawny regulujący tworzenie, rejestrację i działalność stowarzyszeń w Polsce. Gwarantuje wolność zrzeszania się i określa prawa oraz obowiązki stowarzyszeń.",
    keyProvisions: [
      "Art. 2 — definicja stowarzyszenia: dobrowolne, samorządne, trwałe zrzeszenie o celach niezarobkowych",
      "Art. 9 — minimum 7 założycieli dla stowarzyszenia rejestrowego",
      "Art. 10 — wymagana treść statutu stowarzyszenia",
      "Art. 12 — rejestracja w Krajowym Rejestrze Sądowym",
      "Art. 40–43 — stowarzyszenia zwykłe (min. 3 osoby, ewidencja starosty)",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=wdu19890200104",
    relevantFor: ["stowarzyszenie", "stowarzyszenie-zwykle"],
  },
  {
    id: "ustawa-o-fundacjach",
    title: "Ustawa z dnia 6 kwietnia 1984 r. o fundacjach",
    shortTitle: "Ustawa o fundacjach",
    date: "6 kwietnia 1984 r.",
    journalRef: "Dz.U. 2023 poz. 166 (tekst jednolity)",
    description:
      "Reguluje zasady tworzenia i działalności fundacji w Polsce. Określa wymagania dotyczące aktu fundacyjnego, statutu, majątku oraz nadzoru nad fundacjami.",
    keyProvisions: [
      "Art. 1 — fundacja może być ustanowiona przez osobę fizyczną lub prawną",
      "Art. 3 — akt fundacyjny musi być sporządzony w formie notarialnej",
      "Art. 5 — wymagana treść statutu fundacji",
      "Art. 7 — rejestracja w Krajowym Rejestrze Sądowym",
      "Art. 12 — coroczne sprawozdania z działalności fundacji do właściwego ministra",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=wdu19840210097",
    relevantFor: ["fundacja"],
  },
  {
    id: "ustawa-o-krs",
    title: "Ustawa z dnia 20 sierpnia 1997 r. o Krajowym Rejestrze Sądowym",
    shortTitle: "Ustawa o KRS",
    date: "20 sierpnia 1997 r.",
    journalRef: "Dz.U. 2023 poz. 685 (tekst jednolity)",
    description:
      "Reguluje zasady prowadzenia Krajowego Rejestru Sądowego, w którym rejestrowane są m.in. stowarzyszenia i fundacje. Określa procedury wpisu, zmiany i wykreślenia z rejestru.",
    keyProvisions: [
      "Art. 1 — KRS jako centralny rejestr podmiotów prawnych",
      "Art. 19 — wniosek o wpis składany wyłącznie elektronicznie (od 2021 r.)",
      "Art. 24 — sąd rejestrowy bada wniosek w ciągu 7 dni (etap formalny)",
      "Art. 36 — rejestr stowarzyszeń i innych organizacji społecznych",
      "Art. 49 — obowiązek zgłaszania zmian w ciągu 7 dni",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=wdu19971210769",
    relevantFor: ["fundacja", "stowarzyszenie"],
  },
  {
    id: "ustawa-o-pozytku",
    title: "Ustawa z dnia 24 kwietnia 2003 r. o działalności pożytku publicznego i o wolontariacie",
    shortTitle: "Ustawa o pożytku publicznym",
    date: "24 kwietnia 2003 r.",
    journalRef: "Dz.U. 2023 poz. 571 (tekst jednolity)",
    description:
      "Reguluje zasady prowadzenia działalności pożytku publicznego przez NGO. Określa warunki uzyskania statusu OPP (organizacji pożytku publicznego) i prawa do 1,5% podatku.",
    keyProvisions: [
      "Art. 3 — definicja organizacji pozarządowej (NGO)",
      "Art. 20 — warunki uzyskania statusu OPP",
      "Art. 27 — prawo do 1,5% podatku dochodowego (tylko dla OPP)",
      "Art. 42 — zasady wolontariatu (obowiązkowa umowa o współpracy)",
      "Art. 11 — zlecanie realizacji zadań publicznych NGO przez organy administracji",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=wdu20030960873",
    relevantFor: ["fundacja", "stowarzyszenie"],
  },
  {
    id: "ustawa-o-rachunkowosci",
    title: "Ustawa z dnia 29 września 1994 r. o rachunkowości",
    shortTitle: "Ustawa o rachunkowości",
    date: "29 września 1994 r.",
    journalRef: "Dz.U. 2023 poz. 120 (tekst jednolity)",
    description:
      "Określa zasady rachunkowości dla podmiotów prowadzących działalność w Polsce, w tym dla fundacji i stowarzyszeń. Reguluje obowiązki w zakresie prowadzenia ksiąg rachunkowych i sporządzania sprawozdań finansowych.",
    keyProvisions: [
      "Art. 2 — zakres podmiotowy ustawy (dotyczy m.in. fundacji i stowarzyszeń)",
      "Art. 4 — zasady rzetelności i jasności ksiąg rachunkowych",
      "Art. 45 — obowiązek sporządzania rocznego sprawozdania finansowego",
      "Art. 64 — obowiązek badania sprawozdań przez biegłego rewidenta (przy spełnieniu warunków)",
      "Art. 70 — przechowywanie dokumentacji rachunkowej przez 5 lat",
    ],
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=wdu19941210591",
    relevantFor: ["fundacja", "stowarzyszenie"],
  },
];

// ============================================================
// SERVICES & PRICING
// ============================================================

export const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "basic",
    name: "Podstawowy",
    price: 299,
    priceLabel: "299 zł",
    recommended: false,
    description: "Dla tych, którzy chcą działać samodzielnie z profesjonalnym wsparciem",
    features: [
      "Dostęp do kreatora rejestracji krok po kroku",
      "Checklisty dokumentów dla każdego etapu",
      "Wzory dokumentów (statut, protokół, uchwały)",
      "Dostęp do bazy aktów prawnych",
      "Weryfikacja kompletności dokumentów",
      "Wsparcie e-mail (48h odpowiedź)",
    ],
    notIncluded: [
      "Przygotowanie dokumentów przez prawnika",
      "Konsultacja telefoniczna",
      "Reprezentacja przed sądem",
    ],
  },
  {
    id: "standard",
    name: "Standardowy",
    price: 599,
    priceLabel: "599 zł",
    recommended: true,
    description: "Kompleksowa pomoc prawna w rejestracji organizacji",
    features: [
      "Wszystko z pakietu Podstawowego",
      "Przygotowanie statutu przez prawnika",
      "Weryfikacja wszystkich dokumentów przez prawnika",
      "Konsultacja telefoniczna (1 godz.)",
      "Wsparcie w procesie rejestracji KRS",
      "Wsparcie e-mail (24h odpowiedź)",
      "Poradnik po rejestracji (obowiązki, księgowość)",
    ],
    notIncluded: [
      "Reprezentacja przed sądem",
      "Obsługa prawna po rejestracji",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    priceLabel: "999 zł",
    recommended: false,
    description: "Pełna obsługa od pomysłu do działającej organizacji",
    features: [
      "Wszystko z pakietu Standardowego",
      "Pełne przygotowanie wszystkich dokumentów",
      "Reprezentacja przed sądem rejestrowym",
      "Konsultacje telefoniczne (3 godz.)",
      "Pomoc w rejestracji po KRS (CRBR, NIP-8)",
      "Wsparcie priorytetowe e-mail (4h odpowiedź)",
      "Szkolenie z obowiązków NGO (online, 2 godz.)",
      "3 miesiące wsparcia po rejestracji",
    ],
    notIncluded: [],
  },
];

// ============================================================
// SAVED REGISTRATION TYPE
// ============================================================

export interface SavedRegistration {
  id: string;
  type: NGOType;
  name: string;
  currentStep: number;
  totalSteps: number;
  createdAt: string;
  updatedAt: string;
  checkedItems: Record<string, string[]>; // stepId -> array of checked item IDs
}
