// ============================================================
// MODULES DATA — Competition Guidelines, Fragment Library,
// Budget Models, KPIs, Legal Basics, Expert Review
// ============================================================

// ─── COMPETITION GUIDELINES ──────────────────────────────────

export interface ScoringCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description: string;
  zeroPointsWhen: string[];
  maxPointsWhen: string[];
  tips: string[];
}

export interface CompetitionProgram {
  id: string;
  name: string;
  fullName: string;
  operator: string;
  targetApplicants: string[];
  maxGrant: number;
  minGrant: number;
  cofinancing: boolean;
  cofinancingPct?: number;
  description: string;
  website: string;
  criteria: ScoringCriterion[];
  requiredDocuments: string[];
  commonMistakes: string[];
  tags: string[];
}

export const COMPETITION_PROGRAMS: CompetitionProgram[] = [
  {
    id: "fio",
    name: "FIO",
    fullName: "Fundusz Inicjatyw Obywatelskich NOWEFIO",
    operator: "NIW-CRSO",
    targetApplicants: ["Organizacje pozarządowe", "Fundacje", "Stowarzyszenia"],
    maxGrant: 200000,
    minGrant: 5000,
    cofinancing: true,
    cofinancingPct: 10,
    description: "Program wspierający inicjatywy obywatelskie, aktywność społeczną i wolontariat.",
    website: "https://niw.gov.pl/nasze-programy/nowefio/",
    criteria: [
      {
        id: "trafnosc",
        name: "Trafność i zasadność projektu",
        maxPoints: 20,
        description: "Czy projekt odpowiada na realny, udokumentowany problem społeczny?",
        zeroPointsWhen: [
          "Brak diagnozy problemu",
          "Problem opisany ogólnikowo bez danych",
          "Brak uzasadnienia potrzeby realizacji",
          "Projekt nie odpowiada na cel programu FIO",
        ],
        maxPointsWhen: [
          "Konkretna diagnoza z danymi liczbowymi (statystyki, badania)",
          "Jasne powiązanie z celami NOWEFIO",
          "Udokumentowane potrzeby grupy docelowej",
          "Opis skali problemu na poziomie lokalnym/regionalnym",
        ],
        tips: [
          "Podaj konkretne liczby: np. '35% dzieci w gminie X nie ma dostępu do...'",
          "Odwołaj się do lokalnych badań, raportów GUS, danych samorządu",
          "Pokaż, że organizacja zna środowisko i problem z pierwszej ręki",
        ],
      },
      {
        id: "grupy",
        name: "Opis grupy docelowej",
        maxPoints: 15,
        description: "Czy grupa docelowa jest konkretnie zdefiniowana i uzasadniona?",
        zeroPointsWhen: [
          "Grupa docelowa: 'wszyscy mieszkańcy'",
          "Brak liczby beneficjentów",
          "Brak opisu potrzeb grupy",
          "Grupa docelowa niespójna z problemem",
        ],
        maxPointsWhen: [
          "Konkretna, zawężona grupa (np. 'kobiety 40+ z gminy X zagrożone wykluczeniem cyfrowym')",
          "Podana liczba bezpośrednich i pośrednich beneficjentów",
          "Opis barier i potrzeb grupy",
          "Uzasadnienie wyboru właśnie tej grupy",
        ],
        tips: [
          "Zawęź grupę: im bardziej konkretna, tym lepiej",
          "Podaj liczbę: min. X osób bezpośrednich beneficjentów",
          "Opisz bariery, z którymi zmaga się ta grupa",
        ],
      },
      {
        id: "cele",
        name: "Cel i rezultaty",
        maxPoints: 20,
        description: "Czy cel jest SMART? Czy rezultaty są mierzalne?",
        zeroPointsWhen: [
          "Cel ogólny bez wskaźników",
          "Brak rezultatów twardych",
          "Wskaźniki niemierzalne ('poprawa sytuacji')",
          "Brak metody pomiaru rezultatów",
        ],
        maxPointsWhen: [
          "Cel SMART: konkretny, mierzalny, osiągalny, istotny, terminowy",
          "Rezultaty twarde z liczbami (np. '50 osób ukończy szkolenie')",
          "Rezultaty miękkie z metodą pomiaru (ankieta pre/post)",
          "Wskaźniki produktu, rezultatu i oddziaływania",
        ],
        tips: [
          "Cel: 'Do [data] X osób z grupy Y osiągnie Z'",
          "Każde działanie musi mieć swój wskaźnik",
          "Opisz jak zmierzysz rezultaty (ankieta, test, zaświadczenie)",
        ],
      },
      {
        id: "dzialania",
        name: "Działania i harmonogram",
        maxPoints: 15,
        description: "Czy działania są realne, spójne z celem i dobrze zaplanowane?",
        zeroPointsWhen: [
          "Działania niespójne z celem",
          "Brak harmonogramu",
          "Działania zbyt ogólne ('organizacja spotkań')",
          "Nierealistyczny harmonogram",
        ],
        maxPointsWhen: [
          "Każde działanie powiązane z konkretnym rezultatem",
          "Szczegółowy harmonogram miesięczny",
          "Realistyczna liczba działań",
          "Opis metodyki (jak będą prowadzone szkolenia, warsztaty)",
        ],
        tips: [
          "Każde działanie: kto, co, kiedy, ile osób",
          "Harmonogram: miesiąc po miesiącu",
          "Pokaż logikę: działanie A → rezultat B",
        ],
      },
      {
        id: "budzet",
        name: "Budżet i efektywność kosztowa",
        maxPoints: 15,
        description: "Czy budżet jest uzasadniony, spójny z działaniami i efektywny?",
        zeroPointsWhen: [
          "Koszty nieuzasadnione",
          "Budżet niespójny z działaniami",
          "Zawyżone stawki (np. trener 500 zł/h)",
          "Brak wkładu własnego (jeśli wymagany)",
        ],
        maxPointsWhen: [
          "Każda pozycja budżetowa powiązana z działaniem",
          "Stawki rynkowe z uzasadnieniem",
          "Efektywność: koszt na beneficjenta",
          "Wkład własny powyżej minimum",
        ],
        tips: [
          "Trener/ekspert: 80-150 zł/h to rynkowe stawki",
          "Podaj koszt na 1 beneficjenta",
          "Każda pozycja: skąd ta kwota (kalkulacja)",
        ],
      },
      {
        id: "potencjal",
        name: "Potencjał organizacji",
        maxPoints: 15,
        description: "Czy organizacja ma doświadczenie i zasoby do realizacji projektu?",
        zeroPointsWhen: [
          "Brak doświadczenia w podobnych projektach",
          "Brak opisu zasobów ludzkich",
          "Organizacja nowo powstała bez dorobku",
        ],
        maxPointsWhen: [
          "Udokumentowane doświadczenie w podobnych projektach",
          "Opis kompetencji zespołu",
          "Partnerstwa i współpraca",
          "Zasoby własne (lokal, sprzęt)",
        ],
        tips: [
          "Wymień 2-3 podobne projekty zrealizowane wcześniej",
          "Opisz kwalifikacje kluczowych osób",
          "Pokaż sieć kontaktów w środowisku",
        ],
      },
    ],
    requiredDocuments: [
      "Aktualny statut organizacji",
      "Odpis z KRS (nie starszy niż 3 miesiące)",
      "Sprawozdanie finansowe za ostatni rok",
      "Sprawozdanie merytoryczne za ostatni rok",
      "Uchwała o przystąpieniu do konkursu",
    ],
    commonMistakes: [
      "Zbyt szeroka grupa docelowa",
      "Brak danych liczbowych w diagnozie",
      "Wskaźniki niemierzalne",
      "Budżet niespójny z działaniami",
      "Brak harmonogramu",
    ],
    tags: ["NGO", "Fundacje", "Stowarzyszenia", "Aktywność obywatelska"],
  },
  {
    id: "proo",
    name: "PROO",
    fullName: "Program Rozwoju Organizacji Obywatelskich",
    operator: "NIW-CRSO",
    targetApplicants: ["Organizacje pozarządowe", "Fundacje", "Stowarzyszenia"],
    maxGrant: 700000,
    minGrant: 100000,
    cofinancing: true,
    cofinancingPct: 10,
    description: "Program wspierający rozwój instytucjonalny organizacji pozarządowych.",
    website: "https://niw.gov.pl/nasze-programy/proo/",
    criteria: [
      {
        id: "strategia",
        name: "Strategia rozwoju organizacji",
        maxPoints: 25,
        description: "Czy organizacja ma jasną strategię i plan rozwoju?",
        zeroPointsWhen: [
          "Brak strategii lub plan zbyt ogólny",
          "Cele strategiczne niespójne z działalnością",
          "Brak analizy SWOT lub potrzeb",
        ],
        maxPointsWhen: [
          "Konkretna strategia z mierzalnymi celami",
          "Analiza potrzeb i możliwości organizacji",
          "Plan wdrożenia z harmonogramem",
          "Wskaźniki sukcesu dla każdego celu",
        ],
        tips: [
          "Pokaż gdzie jesteś teraz i gdzie chcesz być za 3 lata",
          "Każdy cel strategiczny musi mieć wskaźnik",
          "Opisz co zmieni się w organizacji dzięki dotacji",
        ],
      },
      {
        id: "zarzadzanie",
        name: "System zarządzania i governance",
        maxPoints: 20,
        description: "Czy organizacja ma sprawne struktury zarządzania?",
        zeroPointsWhen: [
          "Brak opisu struktur zarządzania",
          "Jedna osoba zarządza wszystkim",
          "Brak procedur wewnętrznych",
        ],
        maxPointsWhen: [
          "Jasny podział ról i odpowiedzialności",
          "Procedury finansowe i HR",
          "Aktywna rada/organ nadzorczy",
          "Regularne sprawozdania i ewaluacje",
        ],
        tips: [
          "Opisz strukturę organizacyjną",
          "Pokaż jak działają organy statutowe",
          "Wymień kluczowe procedury wewnętrzne",
        ],
      },
      {
        id: "komunikacja",
        name: "Komunikacja i widoczność",
        maxPoints: 15,
        description: "Czy organizacja skutecznie komunikuje swoją misję i działania?",
        zeroPointsWhen: [
          "Brak strony www lub nieaktualna",
          "Brak mediów społecznościowych",
          "Brak planu komunikacji",
        ],
        maxPointsWhen: [
          "Aktywna strona www i social media",
          "Plan komunikacji z grupami interesariuszy",
          "Regularne raporty i publikacje",
          "Budowanie marki organizacji",
        ],
        tips: [
          "Pokaż zasięg: liczba obserwujących, odwiedzin strony",
          "Opisz jak informujesz o działaniach",
          "Zaplanuj komunikację projektu",
        ],
      },
    ],
    requiredDocuments: [
      "Statut organizacji",
      "KRS aktualny",
      "Sprawozdania za 3 ostatnie lata",
      "Strategia rozwoju organizacji",
      "Uchwała zarządu",
    ],
    commonMistakes: [
      "Brak strategii lub zbyt ogólna",
      "Nieudokumentowane doświadczenie",
      "Budżet na działania, nie na rozwój instytucjonalny",
      "Brak wskaźników rozwoju organizacji",
    ],
    tags: ["NGO", "Rozwój instytucjonalny", "Fundacje"],
  },
  {
    id: "aktywni_plus",
    name: "Aktywni+",
    fullName: "Program Aktywni+ (seniorzy)",
    operator: "MRiPS",
    targetApplicants: ["Organizacje pozarządowe", "Fundacje", "Stowarzyszenia"],
    maxGrant: 250000,
    minGrant: 20000,
    cofinancing: false,
    description: "Program wspierający aktywność społeczną seniorów (60+).",
    website: "https://www.gov.pl/web/senior/aktywni-plus",
    criteria: [
      {
        id: "seniorzy",
        name: "Adekwatność dla seniorów",
        maxPoints: 25,
        description: "Czy projekt realnie odpowiada na potrzeby seniorów?",
        zeroPointsWhen: [
          "Brak opisu potrzeb seniorów",
          "Projekt nie jest skierowany do 60+",
          "Brak diagnozy sytuacji seniorów w środowisku",
        ],
        maxPointsWhen: [
          "Konkretna diagnoza potrzeb seniorów (badania, konsultacje)",
          "Projekt odpowiada na zidentyfikowane potrzeby",
          "Seniorzy współtworzyli projekt (partycypacja)",
          "Uwzględnienie barier (mobilność, cyfryzacja, zdrowie)",
        ],
        tips: [
          "Opisz specyficzne potrzeby seniorów w Twojej gminie",
          "Powołaj się na lokalne dane demograficzne",
          "Pokaż że seniorzy byli konsultowani przy tworzeniu projektu",
        ],
      },
    ],
    requiredDocuments: [
      "Statut",
      "KRS",
      "Sprawozdania za 2 lata",
      "Uchwała zarządu",
    ],
    commonMistakes: [
      "Projekt zbyt ogólny, nie skupiony na seniorach",
      "Brak partycypacji seniorów w planowaniu",
      "Działania niedostosowane do możliwości seniorów",
    ],
    tags: ["Seniorzy", "60+", "Aktywność społeczna"],
  },
  {
    id: "ue_efs",
    name: "EFS+",
    fullName: "Europejski Fundusz Społeczny Plus",
    operator: "Ministerstwo Funduszy / PARP / WUP",
    targetApplicants: ["NGO", "Firmy", "Instytucje publiczne", "Partnerstwa"],
    maxGrant: 5000000,
    minGrant: 100000,
    cofinancing: true,
    cofinancingPct: 15,
    description: "Unijny fundusz wspierający zatrudnienie, edukację, włączenie społeczne.",
    website: "https://www.funduszeeuropejskie.gov.pl",
    criteria: [
      {
        id: "zgodnosc_ue",
        name: "Zgodność z celami programu UE",
        maxPoints: 20,
        description: "Czy projekt jest zgodny z celami szczegółowymi EFS+?",
        zeroPointsWhen: [
          "Projekt niezgodny z typami operacji w SZOP",
          "Brak odniesienia do celów programu",
          "Działania niekwalifikowalne",
        ],
        maxPointsWhen: [
          "Pełna zgodność z typami operacji",
          "Odniesienie do wskaźników programu",
          "Komplementarność z innymi projektami UE",
          "Wkład w realizację celów klimatycznych/cyfrowych",
        ],
        tips: [
          "Sprawdź SZOP (Szczegółowy Opis Priorytetów) dla swojego regionu",
          "Każde działanie musi być w katalogu działań kwalifikowalnych",
          "Odwołaj się do wskaźników programowych",
        ],
      },
      {
        id: "kwalifikowalnosc",
        name: "Kwalifikowalność kosztów",
        maxPoints: 20,
        description: "Czy wszystkie koszty są kwalifikowalne i uzasadnione?",
        zeroPointsWhen: [
          "Koszty niekwalifikowalne w budżecie",
          "Brak uzasadnienia stawek",
          "Podwójne finansowanie",
          "Koszty bez powiązania z działaniami",
        ],
        maxPointsWhen: [
          "Wszystkie koszty z katalogu kwalifikowalnych",
          "Stawki zgodne z rozeznaniem rynku",
          "Uproszczone metody rozliczania (stawki jednostkowe)",
          "Efektywność kosztowa udokumentowana",
        ],
        tips: [
          "Sprawdź Wytyczne kwalifikowalności wydatków dla EFS+",
          "Stosuj stawki jednostkowe gdzie możliwe",
          "Każda pozycja: podstawa wyliczenia + uzasadnienie",
        ],
      },
    ],
    requiredDocuments: [
      "Formularz wniosku w systemie SL2021/CST2021",
      "Statut / KRS",
      "Sprawozdania finansowe",
      "Dokumenty partnerów (jeśli partnerstwo)",
      "Zaświadczenia o niezaleganiu (ZUS, US)",
      "Oświadczenia o pomocy de minimis",
    ],
    commonMistakes: [
      "Koszty niekwalifikowalne w budżecie",
      "Brak rozeznania rynku dla usług",
      "Wskaźniki niezgodne z programem",
      "Brak opisu metodyki realizacji",
      "Podwójne finansowanie z innymi projektami",
    ],
    tags: ["UE", "EFS", "Zatrudnienie", "Edukacja", "Włączenie społeczne"],
  },
];

// ─── FRAGMENT LIBRARY ────────────────────────────────────────

export type FragmentCategory = "problem" | "target_group" | "goal" | "activity" | "result_hard" | "result_soft" | "kpi" | "justification";

export interface TextFragment {
  id: string;
  category: FragmentCategory;
  title: string;
  text: string;
  tags: string[];
  applicantTypes: string[];
}

export const FRAGMENT_LIBRARY: TextFragment[] = [
  // PROBLEMS
  {
    id: "p1",
    category: "problem",
    title: "Wykluczenie cyfrowe seniorów",
    text: "Osoby starsze (60+) w Polsce w znacznym stopniu są wykluczone cyfrowo — według danych GUS ponad 60% seniorów nie korzysta regularnie z internetu. Brak kompetencji cyfrowych ogranicza ich dostęp do usług publicznych, e-zdrowia, kontaktu z rodziną oraz aktywności społecznej. Problem ten jest szczególnie dotkliwy na obszarach wiejskich i w małych miastach, gdzie dostęp do alternatywnych form wsparcia jest ograniczony.",
    tags: ["seniorzy", "cyfryzacja", "wykluczenie"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "p2",
    category: "problem",
    title: "Brak kompetencji wychowawczych rodziców/nauczycieli",
    text: "Współczesne wyzwania wychowawcze — uzależnienia od technologii, agresja rówieśnicza, zaburzenia emocjonalne — wymagają od rodziców i nauczycieli nowych kompetencji. Badania wskazują, że ponad 70% nauczycieli czuje się niewystarczająco przygotowanych do pracy z trudnymi zachowaniami uczniów. Brak wsparcia merytorycznego prowadzi do wypalenia zawodowego pedagogów i nieefektywnej pomocy dzieciom w kryzysie.",
    tags: ["edukacja", "nauczyciele", "kompetencje", "dzieci"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "p3",
    category: "problem",
    title: "Wykluczenie społeczne osób długotrwale bezrobotnych",
    text: "Długotrwałe bezrobocie (powyżej 12 miesięcy) dotyka w Polsce ponad [X]% osób w wieku produkcyjnym. Osoby te tracą nie tylko dochód, ale też kompetencje zawodowe, sieć kontaktów i poczucie własnej wartości. Bez kompleksowego wsparcia (doradztwo, szkolenia, aktywizacja społeczna) powrót na rynek pracy jest dla nich niezwykle trudny.",
    tags: ["bezrobocie", "aktywizacja", "wykluczenie", "rynek pracy"],
    applicantTypes: ["ngo", "business", "institution"],
  },
  {
    id: "p4",
    category: "problem",
    title: "Niewystarczające wsparcie dla dzieci z rodzin dysfunkcyjnych",
    text: "Dzieci wychowujące się w rodzinach dotkniętych ubóstwem, uzależnieniami lub przemocą mają znacznie ograniczone szanse edukacyjne i społeczne. W gminie [X] według danych MOPS/GOPS, [Y]% dzieci objętych pomocą społeczną pochodzi z rodzin wieloproblemowych. Brak dostępu do zajęć pozalekcyjnych, wsparcia psychologicznego i wyrównania szans edukacyjnych pogłębia dziedziczenie biedy.",
    tags: ["dzieci", "rodziny", "pomoc społeczna", "edukacja"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "p5",
    category: "problem",
    title: "Niska aktywność obywatelska i społeczna mieszkańców",
    text: "Zaangażowanie obywatelskie w Polsce pozostaje na niskim poziomie — według badań CBOS jedynie [X]% Polaków angażuje się w działalność organizacji pozarządowych lub wolontariat. Brak tradycji działania wspólnotowego, nieufność do instytucji oraz brak wiedzy o możliwościach uczestnictwa prowadzą do atomizacji społecznej i słabości kapitału społecznego na poziomie lokalnym.",
    tags: ["aktywność obywatelska", "wolontariat", "społeczność lokalna"],
    applicantTypes: ["ngo"],
  },

  // TARGET GROUPS
  {
    id: "tg1",
    category: "target_group",
    title: "Seniorzy 60+ zagrożeni wykluczeniem cyfrowym",
    text: "Grupą docelową projektu jest [X] osób w wieku 60 lat i więcej, zamieszkałych na terenie gminy [Y], zagrożonych lub dotkniętych wykluczeniem cyfrowym. Są to osoby, które nie posiadają podstawowych umiejętności korzystania z komputera, smartfona i internetu, co ogranicza ich dostęp do e-usług publicznych, telemedycyny i kontaktu z bliskimi. Spośród nich [Z]% to osoby samotne lub z ograniczoną mobilnością.",
    tags: ["seniorzy", "60+", "cyfryzacja"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "tg2",
    category: "target_group",
    title: "Nauczyciele i wychowawcy szkół podstawowych",
    text: "Grupą docelową projektu jest [X] nauczycieli i wychowawców zatrudnionych w [Y] szkołach podstawowych na terenie [Z]. Są to osoby pracujące bezpośrednio z dziećmi w wieku 7-15 lat, które w codziennej pracy napotykają trudności wychowawcze wynikające z zaburzeń emocjonalnych uczniów, agresji rówieśniczej i wpływu mediów społecznościowych. Większość z nich nie uczestniczyła w szkoleniach z zakresu nowoczesnych metod wychowawczych w ciągu ostatnich 3 lat.",
    tags: ["nauczyciele", "edukacja", "szkoły"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "tg3",
    category: "target_group",
    title: "Osoby długotrwale bezrobotne 45+",
    text: "Grupą docelową projektu jest [X] osób długotrwale bezrobotnych (powyżej 12 miesięcy), w wieku 45-64 lata, zarejestrowanych w Powiatowym Urzędzie Pracy w [Y]. Są to osoby, które utraciły pracę w wyniku restrukturyzacji lub likwidacji zakładu pracy i mają trudności z powrotem na rynek pracy ze względu na nieaktualne kwalifikacje, niską samoocenę i ograniczoną sieć kontaktów zawodowych.",
    tags: ["bezrobocie", "45+", "aktywizacja"],
    applicantTypes: ["ngo", "business", "institution"],
  },

  // GOALS
  {
    id: "g1",
    category: "goal",
    title: "Cel SMART — wzrost kompetencji cyfrowych",
    text: "Celem projektu jest wzrost kompetencji cyfrowych [X] seniorów (60+) z gminy [Y] do poziomu umożliwiającego samodzielne korzystanie z e-usług publicznych, do dnia [data zakończenia projektu]. Cel zostanie osiągnięty poprzez realizację [Z] godzin szkoleń praktycznych, indywidualnego mentoringu cyfrowego oraz udostępnienie materiałów edukacyjnych.",
    tags: ["seniorzy", "cyfryzacja", "SMART"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "g2",
    category: "goal",
    title: "Cel SMART — wzmocnienie kompetencji wychowawczych",
    text: "Celem projektu jest wzmocnienie kompetencji wychowawczych [X] nauczycieli ze szkół podstawowych w [Y] w zakresie pracy z dziećmi z trudnościami emocjonalnymi i wychowawczymi, do dnia [data]. Efektem będzie wzrost skuteczności interwencji wychowawczych mierzony ankietą ewaluacyjną (wzrost o min. 30% w skali samoooceny kompetencji).",
    tags: ["nauczyciele", "kompetencje", "SMART"],
    applicantTypes: ["ngo", "institution"],
  },

  // HARD RESULTS
  {
    id: "rh1",
    category: "result_hard",
    title: "Liczba przeszkolonych uczestników",
    text: "[X] osób ukończyło szkolenie/warsztaty/kurs w ramach projektu (potwierdzone zaświadczeniem/certyfikatem uczestnictwa).",
    tags: ["szkolenia", "uczestnicy"],
    applicantTypes: ["ngo", "business", "institution"],
  },
  {
    id: "rh2",
    category: "result_hard",
    title: "Liczba godzin wsparcia",
    text: "Zrealizowano łącznie [X] godzin wsparcia (szkoleń, doradztwa, mentoringu) dla [Y] beneficjentów projektu.",
    tags: ["wsparcie", "godziny"],
    applicantTypes: ["ngo", "business", "institution"],
  },
  {
    id: "rh3",
    category: "result_hard",
    title: "Liczba wydanych materiałów",
    text: "Opracowano i wydano [X] egzemplarzy materiałów edukacyjnych/informacyjnych, które zostały bezpłatnie przekazane uczestnikom projektu.",
    tags: ["materiały", "publikacje"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "rh4",
    category: "result_hard",
    title: "Liczba zorganizowanych wydarzeń",
    text: "Zorganizowano [X] wydarzeń (szkoleń/warsztatów/konferencji/spotkań) w ramach projektu, w których łącznie wzięło udział [Y] osób.",
    tags: ["wydarzenia", "spotkania"],
    applicantTypes: ["ngo", "business", "institution"],
  },

  // SOFT RESULTS
  {
    id: "rs1",
    category: "result_soft",
    title: "Wzrost kompetencji uczestników",
    text: "[X]% uczestników projektu zadeklarowało wzrost kompetencji w obszarze [Y] (mierzone ankietą ewaluacyjną pre/post — wzrost o min. [Z] punktów w skali 1-10).",
    tags: ["kompetencje", "ankieta", "ewaluacja"],
    applicantTypes: ["ngo", "business", "institution"],
  },
  {
    id: "rs2",
    category: "result_soft",
    title: "Wzrost motywacji i pewności siebie",
    text: "[X]% uczestników projektu zadeklarowało wzrost motywacji do działania i pewności siebie po udziale w projekcie (mierzone ankietą ewaluacyjną — wzrost o min. [Z] punktów).",
    tags: ["motywacja", "pewność siebie", "ewaluacja"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "rs3",
    category: "result_soft",
    title: "Wzrost aktywności społecznej",
    text: "[X]% uczestników projektu podjęło lub zintensyfikowało aktywność społeczną (wolontariat, działalność w organizacji, uczestnictwo w wydarzeniach lokalnych) w ciągu 3 miesięcy od zakończenia projektu.",
    tags: ["aktywność", "wolontariat", "społeczność"],
    applicantTypes: ["ngo"],
  },

  // KPIs
  {
    id: "k1",
    category: "kpi",
    title: "Wskaźnik ukończenia szkoleń",
    text: "Wskaźnik: Liczba osób, które ukończyły szkolenie z certyfikatem / Liczba osób, które rozpoczęły szkolenie × 100% ≥ 80%. Metoda pomiaru: listy obecności, protokoły egzaminów, zaświadczenia.",
    tags: ["szkolenia", "wskaźnik"],
    applicantTypes: ["ngo", "business", "institution"],
  },
  {
    id: "k2",
    category: "kpi",
    title: "Wskaźnik satysfakcji uczestników",
    text: "Wskaźnik: Średnia ocena satysfakcji z projektu ≥ 4,0/5,0. Metoda pomiaru: ankieta ewaluacyjna wypełniana przez uczestników na zakończenie każdego działania projektowego.",
    tags: ["satysfakcja", "ewaluacja", "ankieta"],
    applicantTypes: ["ngo", "business", "institution"],
  },
  {
    id: "k3",
    category: "kpi",
    title: "Wskaźnik wzrostu kompetencji (test pre/post)",
    text: "Wskaźnik: Wzrost wyniku testu wiedzy/umiejętności między pomiarem wstępnym (pre) a końcowym (post) o min. 30%. Metoda pomiaru: standaryzowany test przeprowadzany na początku i końcu szkolenia.",
    tags: ["kompetencje", "test", "pre-post"],
    applicantTypes: ["ngo", "institution"],
  },
  {
    id: "k4",
    category: "kpi",
    title: "Wskaźnik aktywizacji zawodowej",
    text: "Wskaźnik: Liczba uczestników, którzy podjęli zatrudnienie w ciągu 3 miesięcy od zakończenia projektu / Liczba wszystkich uczestników × 100% ≥ 40%. Metoda pomiaru: ankieta follow-up po 3 miesiącach od zakończenia projektu.",
    tags: ["zatrudnienie", "aktywizacja", "follow-up"],
    applicantTypes: ["ngo", "business", "institution"],
  },
];

// ─── BUDGET MODELS ────────────────────────────────────────────

export interface BudgetCategory {
  id: string;
  name: string;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  name: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  typicalPrice: number;
  notes: string;
  kwalifikowalny: boolean;
  warningThreshold: number; // price above this triggers warning
}

export const BUDGET_MODELS: BudgetCategory[] = [
  {
    id: "personel",
    name: "Koszty personelu",
    items: [
      { id: "trener", name: "Trener / ekspert prowadzący szkolenie", unit: "godzina", minPrice: 80, maxPrice: 200, typicalPrice: 120, notes: "Stawka rynkowa dla trenera z doświadczeniem. Powyżej 200 zł/h wymaga szczegółowego uzasadnienia.", kwalifikowalny: true, warningThreshold: 200 },
      { id: "koordynator", name: "Koordynator projektu", unit: "miesiąc", minPrice: 3000, maxPrice: 6000, typicalPrice: 4500, notes: "Zależnie od zakresu obowiązków i wymiaru etatu. Podaj % etatu.", kwalifikowalny: true, warningThreshold: 7000 },
      { id: "ksiegowy", name: "Obsługa księgowa projektu", unit: "miesiąc", minPrice: 500, maxPrice: 2000, typicalPrice: 1000, notes: "Zewnętrzna obsługa księgowa. Wewnętrzna — proporcjonalnie do czasu pracy.", kwalifikowalny: true, warningThreshold: 2500 },
      { id: "psycholog", name: "Psycholog / doradca", unit: "godzina", minPrice: 100, maxPrice: 250, typicalPrice: 150, notes: "Stawka dla specjalisty z uprawnieniami.", kwalifikowalny: true, warningThreshold: 300 },
      { id: "animator", name: "Animator społeczny", unit: "godzina", minPrice: 50, maxPrice: 120, typicalPrice: 80, notes: "Praca z grupami, organizacja wydarzeń.", kwalifikowalny: true, warningThreshold: 150 },
    ],
  },
  {
    id: "szkolenia",
    name: "Koszty szkoleń i warsztatów",
    items: [
      { id: "sala", name: "Wynajem sali szkoleniowej", unit: "dzień", minPrice: 200, maxPrice: 800, typicalPrice: 400, notes: "Zależy od lokalizacji i wyposażenia. W NGO często możliwe nieodpłatnie.", kwalifikowalny: true, warningThreshold: 1000 },
      { id: "catering", name: "Catering / przerwy kawowe", unit: "osoba/dzień", minPrice: 20, maxPrice: 60, typicalPrice: 35, notes: "Maks. 60 zł/os./dzień. Posiłki pełne wymagają uzasadnienia.", kwalifikowalny: true, warningThreshold: 70 },
      { id: "materialy_szkoleniowe", name: "Materiały szkoleniowe (druk)", unit: "komplet/osoba", minPrice: 15, maxPrice: 60, typicalPrice: 30, notes: "Skrypty, ćwiczenia, certyfikaty.", kwalifikowalny: true, warningThreshold: 80 },
      { id: "sprzet_szkoleniowy", name: "Sprzęt szkoleniowy (wynajem)", unit: "dzień", minPrice: 100, maxPrice: 400, typicalPrice: 200, notes: "Projektor, laptop, flipchart. Zakup tylko jeśli uzasadniony.", kwalifikowalny: true, warningThreshold: 500 },
    ],
  },
  {
    id: "komunikacja",
    name: "Promocja i komunikacja",
    items: [
      { id: "strona_www", name: "Strona internetowa projektu", unit: "jednorazowo", minPrice: 500, maxPrice: 3000, typicalPrice: 1500, notes: "Prosta strona informacyjna. Rozbudowane portale wymagają uzasadnienia.", kwalifikowalny: true, warningThreshold: 5000 },
      { id: "druk_plakaty", name: "Druk plakatów i ulotek", unit: "komplet", minPrice: 300, maxPrice: 1500, typicalPrice: 700, notes: "Projekt graficzny + druk. Podaj nakład.", kwalifikowalny: true, warningThreshold: 2000 },
      { id: "social_media", name: "Obsługa social media", unit: "miesiąc", minPrice: 500, maxPrice: 2000, typicalPrice: 1000, notes: "Zewnętrzna agencja lub freelancer.", kwalifikowalny: true, warningThreshold: 3000 },
    ],
  },
  {
    id: "administracja",
    name: "Koszty administracyjne",
    items: [
      { id: "biuro", name: "Koszty biurowe (materiały, poczta)", unit: "miesiąc", minPrice: 100, maxPrice: 500, typicalPrice: 250, notes: "Ryczałt lub faktury. Maks. 5-10% budżetu projektu.", kwalifikowalny: true, warningThreshold: 600 },
      { id: "transport", name: "Transport uczestników", unit: "osoba/kurs", minPrice: 10, maxPrice: 50, typicalPrice: 25, notes: "Zwrot kosztów dojazdu lub wynajem busa.", kwalifikowalny: true, warningThreshold: 80 },
      { id: "ubezpieczenie", name: "Ubezpieczenie uczestników", unit: "osoba", minPrice: 5, maxPrice: 30, typicalPrice: 15, notes: "NNW na czas trwania projektu.", kwalifikowalny: true, warningThreshold: 50 },
    ],
  },
];

// ─── LEGAL BASICS ─────────────────────────────────────────────

export interface LegalAct {
  id: string;
  name: string;
  shortName: string;
  date: string;
  description: string;
  keyProvisions: string[];
  whatIsAllowed: string[];
  whatIsNotAllowed: string[];
  isapUrl: string;
}

export const LEGAL_ACTS_GRANTS: LegalAct[] = [
  {
    id: "pozytku",
    name: "Ustawa o działalności pożytku publicznego i o wolontariacie",
    shortName: "Ustawa o pożytku",
    date: "24 kwietnia 2003 r.",
    description: "Podstawa prawna dla NGO w Polsce. Reguluje zasady udzielania dotacji, zlecania zadań publicznych i statusu OPP.",
    keyProvisions: [
      "Art. 5 — zasady współpracy NGO z administracją publiczną",
      "Art. 11-19 — tryby zlecania zadań publicznych (konkurs ofert, z wolnej ręki)",
      "Art. 20-32 — status organizacji pożytku publicznego (OPP)",
      "Art. 42-50 — wolontariat i prawa wolontariuszy",
    ],
    whatIsAllowed: [
      "Realizacja zadań publicznych na zlecenie samorządu lub ministerstwa",
      "Ubieganie się o status OPP i 1,5% podatku",
      "Zatrudnianie wolontariuszy bez wynagrodzenia",
      "Prowadzenie odpłatnej działalności pożytku publicznego",
      "Prowadzenie działalności gospodarczej (odrębnie od statutowej)",
    ],
    whatIsNotAllowed: [
      "Przeznaczanie zysku na cele inne niż statutowe",
      "Udzielanie pożyczek lub zabezpieczeń z majątku organizacji na rzecz członków zarządu",
      "Nabywanie towarów lub usług od podmiotów powiązanych na warunkach innych niż rynkowe",
      "Łączenie odpłatnej działalności pożytku z działalnością gospodarczą w tym samym zakresie",
    ],
    isapUrl: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20030960873",
  },
  {
    id: "finanse_publiczne",
    name: "Ustawa o finansach publicznych",
    shortName: "UFP",
    date: "27 sierpnia 2009 r.",
    description: "Reguluje zasady wydatkowania środków publicznych, w tym dotacji dla NGO.",
    keyProvisions: [
      "Art. 126-127 — definicja i rodzaje dotacji",
      "Art. 150-152 — dotacje celowe dla NGO",
      "Art. 207 — zwrot dotacji wykorzystanej niezgodnie z przeznaczeniem",
      "Art. 216 — zasada roczności budżetu",
    ],
    whatIsAllowed: [
      "Wydatkowanie dotacji wyłącznie na cele określone w umowie",
      "Przenoszenie środków między pozycjami budżetowymi (w granicach określonych umową)",
      "Rozliczanie kosztów pośrednich ryczałtem (jeśli umowa to przewiduje)",
    ],
    whatIsNotAllowed: [
      "Wydatkowanie dotacji na cele niezgodne z umową",
      "Przeznaczanie dotacji na działalność gospodarczą",
      "Zwrot niewykorzystanej dotacji po terminie",
      "Podwójne finansowanie tych samych kosztów z różnych źródeł publicznych",
    ],
    isapUrl: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20091571240",
  },
  {
    id: "kwalifikowalnosc_ue",
    name: "Wytyczne dotyczące kwalifikowalności wydatków (UE)",
    shortName: "Wytyczne kwalifikowalności",
    date: "2021-2027",
    description: "Zasady określające, jakie koszty mogą być finansowane ze środków UE w perspektywie 2021-2027.",
    keyProvisions: [
      "Zasada faktycznego poniesienia kosztu",
      "Zasada konieczności i proporcjonalności",
      "Zasada przejrzystości i rozeznania rynku",
      "Uproszczone metody rozliczania (stawki jednostkowe, ryczałty)",
    ],
    whatIsAllowed: [
      "Koszty personelu zatrudnionego przy projekcie (proporcjonalnie)",
      "Koszty podróży i zakwaterowania (zgodnie z limitami)",
      "Koszty sprzętu (zakup lub amortyzacja)",
      "Koszty zewnętrznych usług i ekspertyz",
      "Koszty pośrednie (ryczałt do 25% kosztów bezpośrednich)",
    ],
    whatIsNotAllowed: [
      "Podatek VAT (jeśli beneficjent może go odliczyć)",
      "Odsetki od zadłużenia",
      "Koszty poniesione przed datą kwalifikowalności",
      "Koszty związane z przygotowaniem wniosku",
      "Grzywny, kary i wydatki na spory sądowe",
      "Zakup nieruchomości powyżej 10% kosztów kwalifikowalnych",
    ],
    isapUrl: "https://www.funduszeeuropejskie.gov.pl/strony/o-funduszach/dokumenty/wytyczne-dotyczace-kwalifikowalnosci-wydatkow-na-lata-2021-2027/",
  },
];

// ─── EXPERT REVIEW ENGINE ─────────────────────────────────────

export interface ReviewCriterion {
  id: string;
  name: string;
  maxScore: number;
  weight: number; // 1-3
  checkFn: (data: ProjectReviewData) => ReviewScore;
}

export interface ReviewScore {
  score: number;
  maxScore: number;
  issues: string[];
  suggestions: string[];
}

export interface ProjectReviewData {
  title: string;
  problemDescription: string;
  targetGroup: string;
  targetGroupCount: number;
  goal: string;
  activities: string[];
  hardResults: string[];
  softResults: string[];
  kpis: string[];
  budget: number;
  budgetItems: { name: string; amount: number; justification: string }[];
  organizationExperience: string;
  competitionId?: string;
}

export interface ExpertReviewResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  verdict: "high_risk" | "medium_risk" | "good_chance" | "excellent";
  verdictLabel: string;
  verdictColor: string;
  criteriaScores: { criterionId: string; name: string; score: number; maxScore: number; issues: string[]; suggestions: string[] }[];
  topIssues: string[];
  topSuggestions: string[];
  expertComment: string;
}

export function runExpertReview(data: ProjectReviewData): ExpertReviewResult {
  const criteria = [
    {
      id: "problem_diagnosis",
      name: "Diagnoza problemu",
      maxScore: 20,
      evaluate: (d: ProjectReviewData) => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (!d.problemDescription || d.problemDescription.length < 50) {
          issues.push("Brak opisu problemu lub opis zbyt krótki");
          suggestions.push("Opisz problem w min. 3-5 zdaniach z konkretnymi danymi");
        } else {
          score += 5;
        }

        const hasNumbers = /\d+%|\d+ osób|\d+ tys/.test(d.problemDescription);
        if (hasNumbers) {
          score += 7;
        } else {
          issues.push("Brak danych liczbowych w diagnozie problemu");
          suggestions.push("Dodaj konkretne liczby: np. '35% mieszkańców gminy X nie ma dostępu do...'");
        }

        const hasSource = /GUS|CBOS|badani|raport|dane|statystyk/i.test(d.problemDescription);
        if (hasSource) {
          score += 5;
        } else {
          issues.push("Brak odwołania do źródeł danych (GUS, badania, raporty)");
          suggestions.push("Odwołaj się do konkretnych badań lub raportów statystycznych");
        }

        if (d.problemDescription.length > 200) score += 3;

        return { score: Math.min(score, 20), maxScore: 20, issues, suggestions };
      },
    },
    {
      id: "target_group",
      name: "Grupa docelowa",
      maxScore: 15,
      evaluate: (d: ProjectReviewData) => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (!d.targetGroup || d.targetGroup.length < 20) {
          issues.push("Brak opisu grupy docelowej");
          suggestions.push("Opisz konkretnie kto jest beneficjentem projektu");
        } else {
          score += 3;
        }

        const isTooGeneral = /wszyscy|ogół|społeczeństwo|mieszkańcy$/i.test(d.targetGroup);
        if (isTooGeneral) {
          issues.push("Grupa docelowa opisana zbyt ogólnie ('wszyscy mieszkańcy')");
          suggestions.push("Zawęź grupę: np. 'kobiety 40+ z gminy X zagrożone wykluczeniem cyfrowym'");
        } else {
          score += 5;
        }

        if (d.targetGroupCount > 0) {
          score += 5;
        } else {
          issues.push("Brak podanej liczby beneficjentów");
          suggestions.push("Podaj konkretną liczbę: min. X osób bezpośrednich beneficjentów");
        }

        const hasBarriers = /bariera|trudność|problem|brak|ograniczen/i.test(d.targetGroup);
        if (hasBarriers) {
          score += 2;
        } else {
          suggestions.push("Opisz bariery i trudności, z którymi zmaga się ta grupa");
        }

        return { score: Math.min(score, 15), maxScore: 15, issues, suggestions };
      },
    },
    {
      id: "goal_smart",
      name: "Cel projektu (SMART)",
      maxScore: 20,
      evaluate: (d: ProjectReviewData) => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (!d.goal || d.goal.length < 20) {
          issues.push("Brak celu projektu");
          suggestions.push("Sformułuj cel zgodnie z metodologią SMART");
          return { score: 0, maxScore: 20, issues, suggestions };
        }

        score += 3;

        const hasMeasure = /\d+|%|liczba|wzrost|zmniejszenie/i.test(d.goal);
        if (hasMeasure) {
          score += 6;
        } else {
          issues.push("Cel nie zawiera mierzalnych wskaźników");
          suggestions.push("Dodaj liczbę: np. 'wzrost kompetencji 50 uczestników o min. 30%'");
        }

        const hasTime = /do|termin|miesiąc|rok|\d{4}/i.test(d.goal);
        if (hasTime) {
          score += 4;
        } else {
          issues.push("Cel nie zawiera ram czasowych");
          suggestions.push("Dodaj termin: np. 'do dnia 31.12.2025'");
        }

        if (d.kpis && d.kpis.length > 0) {
          score += 7;
        } else {
          issues.push("Brak wskaźników realizacji celu (KPI)");
          suggestions.push("Dodaj min. 2-3 mierzalne wskaźniki sukcesu projektu");
        }

        return { score: Math.min(score, 20), maxScore: 20, issues, suggestions };
      },
    },
    {
      id: "activities_coherence",
      name: "Działania i spójność logiczna",
      maxScore: 15,
      evaluate: (d: ProjectReviewData) => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (!d.activities || d.activities.length === 0) {
          issues.push("Brak opisu działań projektowych");
          suggestions.push("Opisz konkretne działania: co, kiedy, dla kogo, ile osób");
          return { score: 0, maxScore: 15, issues, suggestions };
        }

        score += 3;

        if (d.activities.length >= 3) {
          score += 4;
        } else {
          suggestions.push("Dodaj więcej działań — minimum 3-5 konkretnych aktywności");
        }

        const hasResults = d.hardResults && d.hardResults.length > 0;
        if (hasResults) {
          score += 5;
        } else {
          issues.push("Brak powiązania działań z rezultatami");
          suggestions.push("Każde działanie powinno prowadzić do konkretnego rezultatu");
        }

        if (d.activities.length > 0 && hasResults) {
          score += 3;
        }

        return { score: Math.min(score, 15), maxScore: 15, issues, suggestions };
      },
    },
    {
      id: "budget",
      name: "Budżet i efektywność kosztowa",
      maxScore: 15,
      evaluate: (d: ProjectReviewData) => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (d.budget <= 0) {
          issues.push("Brak informacji o budżecie projektu");
          suggestions.push("Podaj całkowitą kwotę wnioskowanej dotacji");
          return { score: 0, maxScore: 15, issues, suggestions };
        }

        score += 3;

        if (d.budgetItems && d.budgetItems.length > 0) {
          score += 5;

          const hasJustification = d.budgetItems.every((item) => item.justification && item.justification.length > 5);
          if (hasJustification) {
            score += 4;
          } else {
            issues.push("Niektóre pozycje budżetowe nie mają uzasadnienia");
            suggestions.push("Każda pozycja budżetowa musi mieć uzasadnienie (skąd ta kwota)");
          }
        } else {
          issues.push("Brak szczegółowego budżetu projektu");
          suggestions.push("Rozpisz budżet na kategorie i pozycje z uzasadnieniem");
        }

        if (d.targetGroupCount > 0 && d.budget > 0) {
          const costPerPerson = d.budget / d.targetGroupCount;
          if (costPerPerson < 5000) {
            score += 3;
          } else {
            issues.push(`Wysoki koszt na beneficjenta: ${Math.round(costPerPerson).toLocaleString("pl-PL")} zł/os. — może budzić wątpliwości komisji`);
            suggestions.push("Uzasadnij koszt na beneficjenta lub zwiększ liczbę uczestników");
          }
        }

        return { score: Math.min(score, 15), maxScore: 15, issues, suggestions };
      },
    },
    {
      id: "organization",
      name: "Potencjał organizacji",
      maxScore: 15,
      evaluate: (d: ProjectReviewData) => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (!d.organizationExperience || d.organizationExperience.length < 20) {
          issues.push("Brak opisu doświadczenia organizacji");
          suggestions.push("Opisz 2-3 podobne projekty zrealizowane wcześniej");
          return { score: 3, maxScore: 15, issues, suggestions };
        }

        score += 5;

        const hasProjects = /projekt|realizował|zrealizował|dofinansowanie|grant/i.test(d.organizationExperience);
        if (hasProjects) {
          score += 5;
        } else {
          issues.push("Brak opisu konkretnych zrealizowanych projektów");
          suggestions.push("Wymień konkretne projekty z nazwą, rokiem i kwotą dofinansowania");
        }

        const hasTeam = /zespół|koordynator|ekspert|trener|specjalista/i.test(d.organizationExperience);
        if (hasTeam) {
          score += 5;
        } else {
          suggestions.push("Opisz kompetencje kluczowych osób w zespole projektowym");
        }

        return { score: Math.min(score, 15), maxScore: 15, issues, suggestions };
      },
    },
  ];

  const criteriaScores = criteria.map((c) => {
    const result = c.evaluate(data);
    return {
      criterionId: c.id,
      name: c.name,
      score: result.score,
      maxScore: result.maxScore,
      issues: result.issues,
      suggestions: result.suggestions,
    };
  });

  const totalScore = criteriaScores.reduce((sum, c) => sum + c.score, 0);
  const maxScore = criteriaScores.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  let verdict: ExpertReviewResult["verdict"];
  let verdictLabel: string;
  let verdictColor: string;

  if (percentage < 40) {
    verdict = "high_risk";
    verdictLabel = "Wysokie ryzyko odrzucenia";
    verdictColor = "#DC2626";
  } else if (percentage < 60) {
    verdict = "medium_risk";
    verdictLabel = "Średnie ryzyko — wymaga poprawek";
    verdictColor = "#D97706";
  } else if (percentage < 80) {
    verdict = "good_chance";
    verdictLabel = "Dobra szansa — drobne poprawki";
    verdictColor = "#2563EB";
  } else {
    verdict = "excellent";
    verdictLabel = "Silny wniosek — wysokie szanse";
    verdictColor = "#16A34A";
  }

  const allIssues = criteriaScores.flatMap((c) => c.issues);
  const allSuggestions = criteriaScores.flatMap((c) => c.suggestions);

  const expertComment = generateExpertComment(percentage, criteriaScores, data);

  return {
    totalScore,
    maxScore,
    percentage,
    verdict,
    verdictLabel,
    verdictColor,
    criteriaScores,
    topIssues: allIssues.slice(0, 5),
    topSuggestions: allSuggestions.slice(0, 5),
    expertComment,
  };
}

function generateExpertComment(
  pct: number,
  scores: ExpertReviewResult["criteriaScores"],
  data: ProjectReviewData
): string {
  const weakest = [...scores].sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))[0];
  const strongest = [...scores].sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))[0];

  if (pct < 40) {
    return `Projekt w obecnej formie wymaga gruntownej przebudowy. Najsłabszym elementem jest "${weakest.name}" — to właśnie tutaj komisja prawdopodobnie odrzuci wniosek. Diagnoza problemu i opis grupy docelowej są zbyt ogólne, by przekonać oceniających. Zalecam zacząć od nowa od solidnej diagnozy opartej na danych.`;
  } else if (pct < 60) {
    return `Projekt ma potencjał, ale wymaga istotnych poprawek przed złożeniem. Komisja doceni ${strongest.name.toLowerCase()}, jednak "${weakest.name}" znacząco obniża ocenę. Kluczowe jest uzupełnienie brakujących danych liczbowych i doprecyzowanie wskaźników. Bez tych zmian ryzyko odrzucenia jest wysokie.`;
  } else if (pct < 80) {
    return `Projekt jest dobrze przygotowany i ma realne szanse na dofinansowanie. Mocną stroną jest ${strongest.name.toLowerCase()}. Przed złożeniem warto dopracować "${weakest.name}" — to może być różnica między przyjęciem a odrzuceniem. Komisja zwróci uwagę na spójność logiki projektowej i mierzalność rezultatów.`;
  } else {
    return `Projekt jest bardzo dobrze przygotowany i ma wysokie szanse na pozytywną ocenę komisji. Wszystkie kluczowe elementy są na miejscu. Szczególnie mocna jest diagnoza problemu i opis grupy docelowej. Przed złożeniem warto jeszcze raz sprawdzić spójność budżetu z działaniami i upewnić się, że wszystkie wskaźniki są mierzalne.`;
  }
}
