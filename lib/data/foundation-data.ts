// Foundation registration data based on:
// - "Jak założyć fundację i napisać jej statut" (poradnik.ngo.pl, stan prawny 1.05.2023)
// - "Fundacja A4 na dwóch stronach" checklist
// - Webinar presentation "Zakładanie NGO" (19 lipca 2023)

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  tip?: string;
  required: boolean;
  legalRef?: string;
}

export interface WizardStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  checklist: ChecklistItem[];
  tips: string[];
  legalRefs: string[];
  estimatedTime?: string;
  estimatedCost?: string;
}

export interface LegalAct {
  id: string;
  title: string;
  shortTitle: string;
  date: string;
  description: string;
  url: string;
  relevance: string;
}

export interface StatuteSection {
  id: string;
  title: string;
  required: boolean;
  description: string;
  example?: string;
  tips: string[];
}

// ─── LEGAL ACTS ──────────────────────────────────────────────────────────────

export const LEGAL_ACTS: LegalAct[] = [
  {
    id: "ustawa-fundacje",
    title: "Ustawa z dnia 6 kwietnia 1984 r. o fundacjach",
    shortTitle: "Ustawa o fundacjach",
    date: "6 kwietnia 1984",
    description:
      "Podstawowy akt prawny regulujący zasady tworzenia i działalności fundacji w Polsce. Określa cele fundacji, wymagania dotyczące fundatora, funduszu założycielskiego, statutu oraz rejestracji w KRS.",
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19840210097",
    relevance: "Obowiązkowa lektura przed założeniem fundacji",
  },
  {
    id: "ustawa-stowarzyszenia",
    title: "Ustawa z dnia 7 kwietnia 1989 r. prawo o stowarzyszeniach",
    shortTitle: "Prawo o stowarzyszeniach",
    date: "7 kwietnia 1989",
    description:
      "Reguluje zasady tworzenia i działalności stowarzyszeń, w tym stowarzyszeń zwykłych. Określa minimalną liczbę członków założycieli (7 osób), wymagane dokumenty i procedurę rejestracji.",
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19890200104",
    relevance: "Niezbędna przy zakładaniu stowarzyszenia",
  },
  {
    id: "ustawa-krs",
    title: "Ustawa z dnia 20 sierpnia 1997 r. o Krajowym Rejestrze Sądowym",
    shortTitle: "Ustawa o KRS",
    date: "20 sierpnia 1997",
    description:
      "Reguluje zasady rejestracji podmiotów w KRS, w tym fundacji i stowarzyszeń. Określa procedurę składania wniosków, wymagane dokumenty oraz terminy rozpatrywania wniosków przez sąd.",
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19971210769",
    relevance: "Kluczowa przy rejestracji w KRS",
  },
  {
    id: "ustawa-pozytku",
    title:
      "Ustawa z dnia 24 kwietnia 2003 r. o działalności pożytku publicznego i o wolontariacie",
    shortTitle: "Ustawa o pożytku publicznym",
    date: "24 kwietnia 2003",
    description:
      "Definiuje pojęcie organizacji pozarządowej, działalności pożytku publicznego oraz wolontariatu. Określa zasady uzyskiwania statusu OPP (1%), prowadzenia działalności odpłatnej i nieodpłatnej.",
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20030960873",
    relevance: "Ważna dla działalności odpłatnej i statusu OPP",
  },
  {
    id: "ustawa-rachunkowosc",
    title: "Ustawa z dnia 29 września 1994 r. o rachunkowości",
    shortTitle: "Ustawa o rachunkowości",
    date: "29 września 1994",
    description:
      "Reguluje zasady prowadzenia ksiąg rachunkowych przez fundacje. Fundacje mają obowiązek prowadzenia pełnej księgowości lub uproszczonej ewidencji przychodów i kosztów.",
    url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19941210591",
    relevance: "Obowiązkowa dla prowadzenia księgowości fundacji",
  },
];

// ─── STATUTE SECTIONS ────────────────────────────────────────────────────────

export const STATUTE_SECTIONS: StatuteSection[] = [
  {
    id: "postanowienia-ogolne",
    title: "Postanowienia ogólne",
    required: true,
    description:
      "Pierwszy rozdział statutu, w którym przedstawiamy fundację. Zawiera: pełną nazwę fundacji (identyczną jak w akcie notarialnym), siedzibę (tylko nazwa miejscowości), informację o fundatorze, terenie działania i czasie trwania fundacji.",
    example:
      'Fundacja "Dobra Sprawa" (zwana dalej "Fundacją") została ustanowiona przez Jana Kowalskiego, zwanego dalej Fundatorem, aktem notarialnym sporządzonym w Warszawie w dniu 01.01.2024. Siedzibą Fundacji jest Warszawa. Terenem działania Fundacji jest cały obszar Rzeczpospolitej Polskiej.',
    tips: [
      "Nazwa w statucie musi być identyczna jak w akcie notarialnym",
      "W siedzibie podaj tylko nazwę miejscowości, nie adres",
      "Unikaj nazwy skróconej — KRS może odrzucić wniosek",
      "Sprawdź unikalność nazwy na spis.ngo.pl",
    ],
  },
  {
    id: "cele",
    title: "Cele fundacji",
    required: true,
    description:
      "Jeden z najważniejszych rozdziałów statutu. Cele muszą być społecznie lub gospodarczo użyteczne, możliwe do osiągnięcia i zgodne z interesami RP. Nie mogą służyć partykularnym interesom fundatora ani jego rodziny. Mają charakter publiczny — skierowane do dużych grup społecznych.",
    example:
      "Celem Fundacji jest działalność oświatowo-kulturalna, szczególnie w zakresie wspierania talentu, promocji i pomocy w rozwoju kariery dzieci i młodzieży uzdolnionych muzycznie.",
    tips: [
      "Cele muszą być realne i możliwe do osiągnięcia",
      "Nie mogą służyć indywidualnym interesom fundatora",
      "Dobrze sformułowane cele ułatwiają korzystanie ze zwolnień podatkowych",
      "Zbyt wąskie cele ograniczą działalność — pomyśl perspektywicznie",
      "Nie wpisuj wszystkich zadań pożytku — nikt nie potraktuje poważnie fundacji zajmującej się wszystkim",
    ],
  },
  {
    id: "sposoby-realizacji",
    title: "Sposoby realizacji celów",
    required: true,
    description:
      "Wymienia konkretne działania i metody, poprzez które fundacja będzie realizować swoje cele. Powinny być zarówno konkretne (np. prowadzenie warsztatów), jak i ogólne (np. promowanie zajęć). Nie używaj zwrotów 'w szczególności' ani 'między innymi' — KRS wymaga katalogu zamkniętego.",
    example:
      "Fundacja realizuje swoje cele poprzez: a) organizowanie warsztatów i szkoleń, b) prowadzenie działalności wydawniczej, c) organizowanie festiwali i koncertów, d) fundowanie stypendiów dla uzdolnionych dzieci.",
    tips: [
      "Unikaj zwrotów 'w szczególności', 'między innymi' — KRS wymaga katalogu zamkniętego",
      "Sprawdź, czy każdy sposób realizacji faktycznie służy celom fundacji",
      "Jeśli planujesz działalność odpłatną — wymień ją osobno",
    ],
  },
  {
    id: "majatek",
    title: "Majątek fundacji",
    required: true,
    description:
      "Zawiera informację o wysokości funduszu założycielskiego (musi być identyczna jak w akcie notarialnym) oraz o źródłach przyszłych dochodów fundacji. Katalog źródeł musi być zamknięty. Określa się tu też rok obrotowy (zazwyczaj rok kalendarzowy).",
    example:
      "Majątek Fundacji stanowi fundusz założycielski w kwocie 1000 zł (tysiąc złotych). Przychody Fundacji pochodzą z: a) darowizn, spadków, zapisów, b) dotacji i subwencji, c) zbiórek publicznych, d) majątku fundacji, e) odsetek i lokat bankowych. Rokiem obrotowym jest rok kalendarzowy.",
    tips: [
      "Kwota funduszu musi być identyczna jak w akcie notarialnym",
      "Fundacja bez dz. gosp.: min. 500–1000 zł (brak ustawowego minimum)",
      "Fundacja z dz. gosp.: min. 1000 zł na dz. gosp. + kwota na dz. statutową",
      "Nie używaj 'w szczególności' przy źródłach dochodów",
    ],
  },
  {
    id: "wladze",
    title: "Władze fundacji",
    required: true,
    description:
      "Obowiązkowy jest zarząd jako organ wykonawczy. Statut musi określać: sposób wyboru zarządu, liczbę członków, kadencję, kompetencje, tryb podejmowania decyzji (quorum, większość głosów), sposób reprezentacji fundacji i zaciągania zobowiązań majątkowych. Rada fundacji jest nieobowiązkowa, ale zalecana.",
    example:
      "Zarząd Fundacji składa się z 1 do 5 osób, w tym Prezesa Zarządu, powoływanych przez Fundatora na 3-letnią kadencję. Do składania oświadczeń woli w imieniu Fundacji wymagane jest działanie Prezesa Zarządu samodzielnie lub dwóch członków Zarządu łącznie.",
    tips: [
      "Zarząd jest jedynym obowiązkowym organem fundacji",
      "Rada fundacji jest zalecana jako organ kontroli wewnętrznej",
      "Dokładnie opisz sposób reprezentacji — to kluczowe dla umów i konta bankowego",
      "Fundator może zachować sobie kluczowe kompetencje (np. zmiana władz)",
    ],
  },
  {
    id: "zmiana-statutu",
    title: "Zmiana statutu i likwidacja",
    required: false,
    description:
      "Zalecane zapisy dotyczące procedury zmiany statutu oraz likwidacji fundacji. Każda zmiana statutu wymaga zgłoszenia do KRS w ciągu 7 dni. Przy likwidacji należy określić, co dzieje się z majątkiem fundacji.",
    example:
      "Zmiany statutu dokonuje Zarząd Fundacji uchwałą podjętą jednomyślnie. Fundacja ulega likwidacji w razie osiągnięcia celów, dla których została powołana, lub w razie wyczerpania jej środków finansowych. Majątek pozostały po likwidacji przekazuje się organizacjom o zbliżonych celach.",
    tips: [
      "Każda zmiana statutu wymaga zgłoszenia do KRS w ciągu 7 dni",
      "Określ, kto może zmieniać statut i jaką większością głosów",
      "Opisz, co dzieje się z majątkiem po likwidacji",
    ],
  },
  {
    id: "minister-nadzoru",
    title: "Minister sprawujący nadzór",
    required: false,
    description:
      "Fundacja wskazuje ministra właściwego ze względu na swoje cele. Fundator składa odrębne oświadczenie o wyborze ministra. Nadzór ministerialny jest dodatkowy — podstawowy nadzór sprawuje starosta powiatu właściwy dla siedziby fundacji.",
    example:
      "Ministrem właściwym ze względu na cele Fundacji jest minister właściwy do spraw kultury i ochrony dziedzictwa narodowego.",
    tips: [
      "Wybierz ministra odpowiedniego dla celów fundacji",
      "Złóż odrębne oświadczenie fundatora o wyborze ministra",
      "Podstawowy nadzór sprawuje starosta — minister to nadzór dodatkowy",
    ],
  },
];

// ─── WIZARD STEPS ────────────────────────────────────────────────────────────

export const FOUNDATION_WIZARD_STEPS: WizardStep[] = [
  {
    id: "step-1-decyzja",
    stepNumber: 1,
    title: "Decyzja i przygotowanie",
    subtitle: "Zanim zaczniesz — co warto wiedzieć",
    icon: "lightbulb.fill",
    color: "#E07B1A",
    description:
      "Przed podjęciem decyzji o założeniu fundacji warto odpowiedzieć sobie na kilka kluczowych pytań: Jaki cel ma realizować fundacja? Czy cel jest społecznie użyteczny? Czy masz środki na fundusz założycielski? Czy fundacja jest lepszym wyborem niż stowarzyszenie?",
    checklist: [
      {
        id: "c1-1",
        label: "Zdefiniowałem/am cel fundacji (społecznie lub gospodarczo użyteczny)",
        description:
          "Cel musi być publiczny, skierowany do dużych grup społecznych. Nie może służyć indywidualnym interesom fundatora ani jego rodziny.",
        required: true,
        legalRef: "Art. 1 ustawy o fundacjach",
      },
      {
        id: "c1-2",
        label: "Sprawdziłem/am, że cel jest możliwy do osiągnięcia",
        description: "W odróżnieniu od stowarzyszenia, fundacja nie może mieć celów nierealnych.",
        required: true,
      },
      {
        id: "c1-3",
        label: "Mam środki na fundusz założycielski (min. 500–1000 zł)",
        description:
          "Brak ustawowego minimum dla fundacji bez dz. gosp. W praktyce: 500–1000 zł. Dla fundacji z dz. gosp.: min. 1000 zł na dz. gosp. + kwota na dz. statutową.",
        tip: "Jeśli planujesz dz. gosp.: min. 2000 zł (1000 zł na dz. gosp. + 1000 zł na dz. statutową)",
        required: true,
        legalRef: "Art. 5 ust. 5 ustawy o fundacjach",
      },
      {
        id: "c1-4",
        label: "Rozważyłem/am różnicę między fundacją a stowarzyszeniem",
        description:
          '"Jeśli masz przyjaciół — załóż stowarzyszenie, jeśli masz pieniądze — załóż fundację." Fundacja opiera się na majątku, stowarzyszenie na ludziach.',
        required: false,
      },
      {
        id: "c1-5",
        label: "Zapoznałem/am się z ustawą o fundacjach z 6 kwietnia 1984 r.",
        description: "Podstawowy akt prawny regulujący działalność fundacji w Polsce.",
        required: true,
        legalRef: "Ustawa z dnia 6 kwietnia 1984 r. o fundacjach",
      },
    ],
    tips: [
      "Fundacja to podmiot oparty na majątku — potrzebujesz funduszu założycielskiego",
      "Cel fundacji musi mieć charakter publiczny — nie może służyć tylko fundatorowi",
      "Fundacja uzyskuje osobowość prawną dopiero po wpisie do KRS",
      "Możesz być jedynym fundatorem — nie potrzebujesz innych osób",
    ],
    legalRefs: ["Ustawa z dnia 6 kwietnia 1984 r. o fundacjach (art. 1, 2, 3)"],
    estimatedTime: "1–2 tygodnie",
    estimatedCost: "0 zł",
  },
  {
    id: "step-2-statut",
    stepNumber: 2,
    title: "Napisanie statutu",
    subtitle: "Konstytucja Twojej fundacji",
    icon: "doc.text.fill",
    color: "#1A5FA8",
    description:
      'Statut to najważniejszy wewnętrzny dokument fundacji — jej "konstytucja". Musi być napisany przed wizytą u notariusza. Określa zasady działania fundacji i jest podstawą wszystkich jej działań. Możesz napisać go samodzielnie — nie musi pisać go prawnik.',
    checklist: [
      {
        id: "c2-1",
        label: "Wpisałem/am pełną nazwę fundacji (identyczną jak w przyszłym akcie notarialnym)",
        description:
          "Nazwa musi być identyczna w statucie i akcie notarialnym. Sprawdź unikalność na spis.ngo.pl.",
        tip: "Unikaj nazwy skróconej — KRS może odrzucić wniosek rejestracyjny",
        required: true,
        legalRef: "Art. 5 ust. 1 ustawy o fundacjach",
      },
      {
        id: "c2-2",
        label: "Wpisałem/am siedzibę (tylko nazwę miejscowości, nie adres)",
        description:
          "W statucie podaje się tylko nazwę miejscowości. Zmiana adresu nie wymaga zmiany statutu.",
        required: true,
        legalRef: "Art. 5 ust. 1 ustawy o fundacjach",
      },
      {
        id: "c2-3",
        label: "Określiłem/am cele fundacji (społecznie lub gospodarczo użyteczne)",
        description:
          "Cele muszą być publiczne, realne i możliwe do osiągnięcia. Nie mogą służyć indywidualnym interesom.",
        tip: "Dobrze sformułowane cele ułatwiają korzystanie ze zwolnień podatkowych i otrzymywanie dotacji",
        required: true,
        legalRef: "Art. 5 ust. 1 ustawy o fundacjach",
      },
      {
        id: "c2-4",
        label: "Opisałem/am sposoby realizacji celów (katalog zamknięty)",
        description:
          "Wymień konkretne działania. Nie używaj 'w szczególności' ani 'między innymi' — KRS wymaga katalogu zamkniętego.",
        required: true,
      },
      {
        id: "c2-5",
        label: "Określiłem/am wysokość funduszu założycielskiego i źródła dochodów",
        description:
          "Kwota funduszu musi być identyczna jak w akcie notarialnym. Źródła dochodów — katalog zamknięty.",
        required: true,
        legalRef: "Art. 5 ust. 1 ustawy o fundacjach",
      },
      {
        id: "c2-6",
        label: "Opisałem/am zarząd fundacji (skład, wybór, kompetencje, reprezentacja)",
        description:
          "Zarząd jest jedynym obowiązkowym organem. Opisz: liczbę członków, sposób wyboru, kadencję, kompetencje, sposób reprezentacji.",
        tip: "Dokładnie opisz sposób reprezentacji — to kluczowe dla umów i konta bankowego",
        required: true,
        legalRef: "Art. 5 ust. 1 ustawy o fundacjach",
      },
      {
        id: "c2-7",
        label: "Określiłem/am rok obrotowy (zazwyczaj rok kalendarzowy)",
        description: "Fundacja musi prowadzić księgowość. Rok obrotowy wpisuje się w statucie.",
        required: true,
        legalRef: "Ustawa o rachunkowości",
      },
      {
        id: "c2-8",
        label: "Dodałem/am zapisy o radzie fundacji (zalecane)",
        description:
          "Rada fundacji nie jest obowiązkowa, ale jest zalecana jako organ kontroli wewnętrznej.",
        required: false,
      },
      {
        id: "c2-9",
        label: "Dodałem/am zapisy o zmianie statutu i likwidacji fundacji",
        description: "Zalecane zapisy określające procedurę zmian i co dzieje się z majątkiem.",
        required: false,
      },
      {
        id: "c2-10",
        label: "Sprawdziłem/am, że statut zawiera wszystkie obowiązkowe elementy (art. 5 ust. 1)",
        description:
          "Obowiązkowe: nazwa, siedziba, majątek, cele, sposoby realizacji, władze, sposób reprezentacji.",
        required: true,
        legalRef: "Art. 5 ust. 1 ustawy o fundacjach",
      },
    ],
    tips: [
      "Statut możesz napisać samodzielnie — nie musi pisać go prawnik",
      "Nie kopiuj statutów innych fundacji bez przemyślenia każdego zapisu",
      "Nie obawiaj się zmiany statutu w przyszłości — to normalna praktyka",
      "Każda strona statutu powinna być parafowana, podpis na końcu",
      "Statut jest prawomocny od momentu zatwierdzenia przez sąd, nie od uchwały fundatora",
    ],
    legalRefs: [
      "Art. 5 ust. 1 ustawy o fundacjach",
      "Art. 43 Kodeksu cywilnego (nazwa fundacji z dz. gosp.)",
    ],
    estimatedTime: "1–3 tygodnie",
    estimatedCost: "0 zł (samodzielnie) lub koszt prawnika",
  },
  {
    id: "step-3-notariusz",
    stepNumber: 3,
    title: "Akt notarialny",
    subtitle: "Wizyta u notariusza",
    icon: "signature",
    color: "#7B3FA8",
    description:
      "Fundator udaje się do notariusza i w jego obecności wyraża wolę powołania fundacji (akt fundacyjny). Akt musi zawierać: cele fundacji i składniki majątkowe przeznaczone na ich realizację. Przed wizytą przygotuj projekt statutu.",
    checklist: [
      {
        id: "c3-1",
        label: "Przygotowałem/am projekt statutu (przynajmniej część dotyczącą celów i majątku)",
        description:
          "Notariusz sporządza akt na podstawie statutu. Statut musi być gotowy przed wizytą.",
        required: true,
      },
      {
        id: "c3-2",
        label: "Porównałem/am ceny w kilku kancelariach notarialnych",
        description:
          "Taksa notarialna: 100 zł + VAT (fundusz do 3000 zł) lub 200 zł + VAT (niezależnie od wartości). Warto porównać.",
        tip: "Zadzwoń do kilku kancelarii i zapytaj wprost o wysokość taksy i podstawę prawną",
        required: false,
      },
      {
        id: "c3-3",
        label: "Podpisałem/am akt notarialny (akt fundacyjny)",
        description:
          "Akt zawiera: cele fundacji, majątek przeznaczony na realizację celów, dane fundatora, nazwę fundacji.",
        required: true,
        legalRef: "Art. 3 ust. 2 ustawy o fundacjach",
      },
      {
        id: "c3-4",
        label: "Sprawdziłem/am akt przed podpisaniem (nazwa, dane, kwota funduszu)",
        description:
          "Sprawdź dokładnie: nazwę fundacji (z/bez cudzysłowu jak w statucie), dane fundatora, kwotę funduszu.",
        tip: "Błąd w nazwie (np. cudzysłów) spowoduje zwrot wniosku przez KRS",
        required: true,
      },
      {
        id: "c3-5",
        label: "Zapłaciłem/am taksę notarialną",
        description:
          "Taksa + 23% VAT. Przy funduszu do 3000 zł: 100 zł + VAT = 123 zł. Lub 200 zł + VAT = 246 zł.",
        required: true,
        legalRef:
          "Rozporządzenie MS z dn. 28 czerwca 2004 r. w sprawie maksymalnych stawek taksy notarialnej",
      },
      {
        id: "c3-6",
        label:
          "Uchwalono statut fundacji (uchwała fundatora o przyjęciu statutu) — po akcie notarialnym",
        description:
          "Fundator podejmuje uchwałę o przyjęciu ostatecznego kształtu statutu. Uchwała jest załącznikiem do wniosku KRS.",
        required: true,
        legalRef: "Art. 5 ustawy o fundacjach",
      },
    ],
    tips: [
      "Nie dokonuj zmian w statucie po podpisaniu aktu notarialnego — zapisy muszą być identyczne",
      "Możesz udzielić pełnomocnictwa innej osobie do rejestracji fundacji",
      "Akt fundacyjny można odwołać tylko przed wpisem do KRS — wymaga nowego aktu notarialnego",
      "Jeśli fundatorów jest kilku — wszyscy muszą podpisać akt",
    ],
    legalRefs: [
      "Art. 3 ustawy o fundacjach",
      "Rozporządzenie MS z dn. 28 czerwca 2004 r. w sprawie maksymalnych stawek taksy notarialnej",
    ],
    estimatedTime: "1 dzień",
    estimatedCost: "123–246 zł (taksa notarialna + VAT)",
  },
  {
    id: "step-4-krs",
    stepNumber: 4,
    title: "Rejestracja w KRS",
    subtitle: "Złożenie wniosku do sądu",
    icon: "building.columns.fill",
    color: "#1A8A5A",
    description:
      "Fundacja rejestruje się w rejestrze stowarzyszeń i fundacji KRS. Wniosek można złożyć papierowo (tylko fundacje bez dz. gosp.) lub elektronicznie przez Portal Rejestrów Sądowych (PRS). Po rejestracji fundacja uzyskuje osobowość prawną.",
    checklist: [
      {
        id: "c4-1",
        label: "Wybrałem/am właściwy sąd rejestrowy (według siedziby fundacji)",
        description:
          "Sąd właściwy to sąd rejonowy (wydział KRS) właściwy dla adresu siedziby fundacji.",
        required: true,
      },
      {
        id: "c4-2",
        label: "Przygotowałem/am wniosek KRS-W20 (rejestracja fundacji)",
        description:
          "Formularz KRS-W20 to podstawowy formularz rejestracyjny dla fundacji. Dostępny na stronie MS.",
        required: true,
      },
      {
        id: "c4-3",
        label: "Przygotowałem/am załącznik KRS-WK (informacje o osobach reprezentujących)",
        description: "Dane członków zarządu fundacji.",
        required: true,
      },
      {
        id: "c4-4",
        label: "Dołączyłem/am statut fundacji (podpisany przez fundatora)",
        description:
          "Każda strona parafowana, podpis fundatora na końcu. Oryginalny egzemplarz lub poświadczona kopia.",
        required: true,
      },
      {
        id: "c4-5",
        label: "Dołączyłem/am akt notarialny (akt fundacyjny)",
        description: "Oryginał lub odpis aktu notarialnego.",
        required: true,
      },
      {
        id: "c4-6",
        label: "Dołączyłem/am uchwałę o przyjęciu statutu",
        description: "Uchwała fundatora (lub upoważnionego organu) o przyjęciu statutu fundacji.",
        required: true,
      },
      {
        id: "c4-7",
        label: "Dołączyłem/am uchwałę o wyborze zarządu fundacji",
        description: "Uchwała wskazująca skład zarządu fundacji z danymi osobowymi członków.",
        required: true,
      },
      {
        id: "c4-8",
        label: "Dołączyłem/am oświadczenie fundatora o wyborze ministra nadzoru",
        description: "Oświadczenie wskazujące ministra właściwego ze względu na cele fundacji.",
        required: true,
      },
      {
        id: "c4-9",
        label: "Dołączyłem/am oświadczenia członków zarządu o wyrażeniu zgody na pełnienie funkcji",
        description: "Każdy członek zarządu musi złożyć pisemną zgodę.",
        required: true,
      },
      {
        id: "c4-10",
        label: "Zapłaciłem/am opłatę rejestracyjną",
        description:
          "Fundacja bez dz. gosp.: 250 zł. Fundacja z dz. gosp.: 600 zł (250 zł + 350 zł do rejestru przedsiębiorców).",
        required: true,
        legalRef: "Ustawa o kosztach sądowych w sprawach cywilnych",
      },
      {
        id: "c4-11",
        label: "Złożyłem/am wniosek (papierowo lub elektronicznie przez PRS)",
        description:
          "Papierowo: osobiście lub pocztą do właściwego oddziału KRS. Elektronicznie: przez Portal Rejestrów Sądowych (wymagany profil zaufany lub podpis kwalifikowany).",
        required: true,
      },
    ],
    tips: [
      "Wniosek elektroniczny przez PRS: wymagany profil zaufany, e-dowód lub podpis kwalifikowany",
      "Fundacja z dz. gosp. musi rejestrować się elektronicznie przez PRS",
      "Możesz złożyć wniosek o zwolnienie z kosztów sądowych",
      "Sąd ma 7 dni na rozpatrzenie wniosku (w praktyce bywa dłużej)",
      "Możesz udzielić pełnomocnictwa do rejestracji innej osobie",
    ],
    legalRefs: [
      "Art. 7 ustawy o fundacjach",
      "Ustawa z dnia 20 sierpnia 1997 r. o Krajowym Rejestrze Sądowym",
    ],
    estimatedTime: "7–30 dni (czas rozpatrzenia przez sąd)",
    estimatedCost: "250 zł (bez dz. gosp.) lub 600 zł (z dz. gosp.)",
  },
  {
    id: "step-5-po-rejestracji",
    stepNumber: 5,
    title: "Po rejestracji w KRS",
    subtitle: "Pierwsze kroki po uzyskaniu osobowości prawnej",
    icon: "checkmark.seal.fill",
    color: "#22A45D",
    description:
      "Po wpisie do KRS fundacja uzyskuje osobowość prawną i NIP automatycznie (od 2015 r. sąd przekazuje dane do GUS i US). Jednak jest kilka obowiązkowych kroków, które należy wykonać po rejestracji.",
    checklist: [
      {
        id: "c5-1",
        label: "Otrzymałem/am numer KRS, REGON i NIP (automatycznie po rejestracji)",
        description:
          "Od 2015 r. sąd automatycznie przekazuje dane do GUS i US. Fundacja otrzymuje REGON i NIP bez dodatkowych wizyt.",
        required: true,
      },
      {
        id: "c5-2",
        label: "Złożyłem/am formularz NIP-8 (zgłoszenie danych uzupełniających do US)",
        description:
          "W ciągu 21 dni od rejestracji należy złożyć NIP-8 do urzędu skarbowego z danymi uzupełniającymi (konto bankowe, adres, PKD).",
        required: true,
        legalRef: "Ustawa o zasadach ewidencji i identyfikacji podatników i płatników",
      },
      {
        id: "c5-3",
        label: "Zgłosiłem/am fundację do Centralnego Rejestru Beneficjentów Rzeczywistych (CRBR)",
        description:
          "Obowiązek zgłoszenia w ciągu 14 dni od rejestracji w KRS. Zgłoszenie przez stronę crbr.podatki.gov.pl.",
        required: true,
        legalRef: "Ustawa o przeciwdziałaniu praniu pieniędzy i finansowaniu terroryzmu",
      },
      {
        id: "c5-4",
        label: "Otworzyłem/am konto bankowe fundacji",
        description:
          "Fundacja musi mieć własne konto bankowe. Potrzebne do: przyjmowania darowizn, wypłat, rozliczeń z US.",
        tip: "Do otwarcia konta potrzebny: odpis z KRS, statut, dokumenty tożsamości zarządu",
        required: true,
      },
      {
        id: "c5-5",
        label: "Przekazałem/am fundusz założycielski na konto fundacji",
        description:
          "Fundator zobowiązał się w akcie notarialnym do przekazania funduszu. Teraz czas to zrealizować.",
        required: true,
      },
      {
        id: "c5-6",
        label: "Ustaliłem/am zasady prowadzenia księgowości",
        description:
          "Fundacja musi prowadzić pełną księgowość lub uproszczoną ewidencję przychodów i kosztów (jeśli nie prowadzi dz. gosp. i spełnia warunki).",
        required: true,
        legalRef: "Ustawa o rachunkowości",
      },
      {
        id: "c5-7",
        label: "Zapewniłem/am adres do korespondencji i przechowywania dokumentów",
        description:
          "Fundacja nie musi mieć biura, ale musi mieć adres. Może to być mieszkanie fundatora lub członka zarządu (umowa użyczenia).",
        required: true,
      },
    ],
    tips: [
      "CRBR: zgłoszenie w ciągu 14 dni od rejestracji — kara do 1 mln zł za brak zgłoszenia",
      "NIP-8: złożenie w ciągu 21 dni od rejestracji",
      "Konto bankowe: potrzebny aktualny odpis z KRS (nie starszy niż 3 miesiące)",
      "Fundacja może działać z adresu domowego — wystarczy umowa użyczenia lokalu",
      "Pierwsze sprawozdanie finansowe: do 6 miesięcy po zakończeniu roku obrotowego",
    ],
    legalRefs: [
      "Art. 7 ust. 2 ustawy o fundacjach",
      "Ustawa o przeciwdziałaniu praniu pieniędzy (CRBR)",
      "Ustawa o rachunkowości",
    ],
    estimatedTime: "2–4 tygodnie",
    estimatedCost: "0 zł (konto bankowe: zależnie od banku)",
  },
];

// ─── COST SUMMARY ────────────────────────────────────────────────────────────

export interface CostItem {
  label: string;
  amount: string;
  note: string;
  required: boolean;
}

export const FOUNDATION_COSTS: CostItem[] = [
  {
    label: "Fundusz założycielski",
    amount: "min. 500–1000 zł",
    note: "Pozostaje w fundacji jako majątek",
    required: true,
  },
  {
    label: "Taksa notarialna",
    amount: "123–246 zł",
    note: "100 lub 200 zł + 23% VAT",
    required: true,
  },
  {
    label: "Opłata rejestracyjna KRS",
    amount: "250 zł",
    note: "Fundacja bez dz. gosp. (z dz. gosp.: 600 zł)",
    required: true,
  },
  {
    label: "Konto bankowe",
    amount: "0–50 zł/mies.",
    note: "Zależnie od banku (wiele banków oferuje bezpłatne konta dla NGO)",
    required: true,
  },
  {
    label: "Prawnik / doradca",
    amount: "0–2000 zł",
    note: "Opcjonalnie — statut można napisać samodzielnie",
    required: false,
  },
];

export const TOTAL_MIN_COST = "873 zł";
export const TOTAL_MAX_COST = "ok. 3000 zł";
