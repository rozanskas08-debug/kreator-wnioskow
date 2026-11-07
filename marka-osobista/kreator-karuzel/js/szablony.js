/*
 * Typy slajdów, gotowe karuzele (Twoim głosem), generator opisu i prompt dla AI.
 * Zapis „*słowo*” = wyróżnienie kursywą w kolorze akcentu.
 */
(function (root) {
  const M = root.MARKA;

  // Pola edytora dla każdego typu slajdu
  const TYPY = {
    okladka: { nazwa: "Okładka z hakiem", pola: ["obraz", "uklad", "wersaliki", "etykieta", "tytul", "podtytul"] },
    teza: { nazwa: "Teza (slajd 2)", pola: ["etykieta", "tytul", "tekst", "wniosek", "wniosekStyl", "wyrownanie", "wersaliki"] },
    artykul: { nazwa: "Nagłówek + tekst + wniosek", pola: ["tytul", "tekst", "wniosek", "wniosekStyl", "wersaliki", "bezTla"] },
    ikony: { nazwa: "Lista z ikonami", pola: ["tytul", "tekst", "pozycje", "styl", "wniosek", "wniosekStyl", "wersaliki", "bezTla"] },
    koszty: { nazwa: "Zestawienie (np. „Załóżmy:”)", pola: ["tytul", "pozycje", "tekst", "wniosek", "wniosekStyl", "wniosekWersaliki", "wersaliki", "bezTla"] },
    punkt: { nazwa: "Punkt numerowany", pola: ["etykieta", "tytul", "tekst"] },
    mitfakt: { nazwa: "Mit vs fakt", pola: ["mit", "fakt"] },
    przedpo: { nazwa: "Przed / po", pola: ["tytul", "etykietaPrzed", "przed", "etykietaPo", "po"] },
    wiadomosc: { nazwa: "Gotowa wiadomość", pola: ["etykieta", "tytul", "tekst", "podpis"] },
    lista: { nazwa: "Checklista", pola: ["tytul", "pozycje"] },
    liczba: { nazwa: "Liczba / krok", pola: ["etykieta", "liczba", "tytul", "tekst"] },
    cytat: { nazwa: "Cytat", pola: ["tekst", "autor"] },
    opinia: { nazwa: "Opinia klientki", pola: ["tekst", "autor", "etykieta", "obraz"] },
    zdjecie: { nazwa: "Zdjęcie", pola: ["obraz", "tytul", "podpis"] },
    sciaga: { nazwa: "Ściąga do zapisania", pola: ["etykieta", "tytul", "pozycje"] },
    cta: { nazwa: "Wezwanie do działania", pola: ["tytul", "slowo", "przycisk", "tekst", "wyslij", "portret"] },
  };

  const POLA = {
    etykieta: { nazwa: "Etykieta (małe litery nad tytułem)" },
    tytul: { nazwa: "Tytuł", dlugie: true },
    podtytul: { nazwa: "Podtytuł", dlugie: true },
    tekst: { nazwa: "Tekst", dlugie: true },
    mit: { nazwa: "Mit", dlugie: true },
    fakt: { nazwa: "Fakt", dlugie: true },
    przed: { nazwa: "Przed (słaba wersja)", dlugie: true },
    po: { nazwa: "Po (lepsza wersja)", dlugie: true },
    etykietaPrzed: { nazwa: "Etykieta „przed”", domyslnie: "Zamiast" },
    etykietaPo: { nazwa: "Etykieta „po”", domyslnie: "Napisz tak" },
    podpis: { nazwa: "Podpis", dlugie: true },
    pozycje: { nazwa: "Pozycje (jedna w linii)", lista: true },
    wniosek: { nazwa: "Wniosek w ramce (opcjonalnie)", dlugie: true },
    wniosekStyl: { nazwa: "Styl ramki wniosku", wybor: [["", "Jasna"], ["ciemny", "Bordowa (mocny akcent)"]] },
    wniosekWersaliki: { nazwa: "Wniosek WERSALIKAMI", przelacznik: true, domyslnie: () => false },
    styl: { nazwa: "Wygląd listy", wybor: [["", "Karty z ikonami"], ["os", "Ikony połączone linią (kroki)"], ["proste", "Same ikony w kółkach"]] },
    bezTla: { nazwa: "Bez zdjęcia tła na tym slajdzie", przelacznik: true, domyslnie: () => false },
    liczba: { nazwa: "Liczba" },
    autor: { nazwa: "Autorka" },
    obraz: { nazwa: "Zdjęcie", obraz: true },
    slowo: { nazwa: "Słowo-klucz do komentarza (np. BOOKSY)" },
    przycisk: { nazwa: "Tekst przycisku (gdy brak słowa-klucza)" },
    wyslij: { nazwa: "Zachęta do wysłania (DM)" },
    portret: { nazwa: "Pokaż moje zdjęcie", przelacznik: true, domyslnie: () => true },
    wersaliki: { nazwa: "Nagłówek WERSALIKAMI", przelacznik: true, domyslnie: (s) => s.typ === "okladka" && (!s.obraz || s.uklad === "tlo") },
    uklad: { nazwa: "Układ okładki", wybor: [["", "Automatycznie"], ["tekst", "Sam tekst, wyśrodkowany"], ["bok", "Zdjęcie z prawej"], ["tlo", "Zdjęcie na całym slajdzie"]] },
    wyrownanie: { nazwa: "Wyrównanie", wybor: [["", "Do lewej"], ["srodek", "Do środka"]] },
  };

  const GOTOWE = [
    {
      id: "voucher-swieta",
      filar: "sprzedaz",
      nazwa: "Voucher świąteczny = nowa klientka",
      seria: "Sezon w salonie",
      nr: "01",
      motyw: "papier",
      slajdy: [
        { typ: "okladka", obraz: "portret", uklad: "bok", etykieta: "Grudzień w salonie", tytul: "Voucher świąteczny może przyprowadzić Ci *nową* klientkę.", podtytul: "Pod warunkiem, że zaplanujesz to, co dzieje się *po świętach*." },
        { typ: "artykul", tytul: "Kupuje jedna osoba. Przychodzi *druga*.", tekst: "Voucher to kontakt z kimś, kto jeszcze Cię nie zna.\n\nJeśli nie zaplanujesz, co dzieje się po wizycie, prezent kończy się na *jednym zabiegu*.", wniosek: "{osoby} Obdarowana to _nowa klientka_, nie jednorazowa wizyta." },
        { typ: "punkt", etykieta: "Krok", tytul: "Nazwij voucher *efektem*, nie kwotą", tekst: "„Wieczór dla skóry” brzmi jak prezent. „Bon na 200 zł” brzmi jak przelew." },
        { typ: "punkt", etykieta: "Krok", tytul: "Pokaż go w reklamie *przed* 20 grudnia", tekst: "Osoba kupująca prezent szuka teraz. Prosty komunikat i jeden link do zakupu." },
        { typ: "punkt", etykieta: "Krok", tytul: "Zbierz *kontakt* do obdarowanej", tekst: "Imię i telefon przy rezerwacji vouchera to Twój kanał do follow-upu." },
        { typ: "punkt", etykieta: "Krok", tytul: "Zaplanuj *drugą* wizytę", tekst: "Przy realizacji zaproponuj kolejny termin albo pakiet startowy." },
        { typ: "wiadomosc", etykieta: "Po realizacji vouchera", tytul: "Żeby prezent zamienił się w *stałą* klientkę:", tekst: "Pani Agnieszko, dziękuję za wizytę! Skóra najlepiej odpowiada na serię zabiegów. Mam dla Pani termin za 4 tygodnie, czwartek 17:00. Zarezerwować?" },
        { typ: "ikony", styl: "os", tytul: "Voucher, który *pracuje*", pozycje: ["{metka} Nazwij go efektem, nie kwotą", "{megafon} Pokaż go w reklamie przed 20 grudnia", "{dymek} Zbierz kontakt do obdarowanej", "{kalendarz} Zaproponuj drugą wizytę"], wniosek: "Zapisz, żeby wrócić do tego w *styczniu*.", wniosekStyl: "ciemny" },
        { typ: "cta", tytul: "Chcesz kampanię świąteczną, która *zostaje* po świętach?", przycisk: "Umów 15 minut — link w bio", tekst: "Sprawdzimy, czy voucher w Twoim salonie może przyprowadzić nowe klientki.", wyslij: "Wyślij koleżance, która właśnie planuje grudzień.", portret: true },
      ],
    },
    {
      id: "booksy-przed-po",
      filar: "sprzedaz",
      nazwa: "Booksy przed i po",
      seria: "Booksy, które sprzedaje",
      nr: "02",
      motyw: "puder",
      slajdy: [
        { typ: "okladka", etykieta: "Booksy sales path™", tytul: "Ten sam zabieg. Inny opis. *Inna* decyzja klientki.", podtytul: "3 poprawki w Booksy, które zrobisz dziś w 15 minut." },
        { typ: "teza", tytul: "Klientka nie czyta Booksy. Ona *skanuje*.", tekst: "Szuka trzech odpowiedzi: czy to dla mnie, ile to trwa i co zyskam." },
        { typ: "przedpo", tytul: "Poprawka 1: *nazwa* usługi", przed: "Mezoterapia igłowa", po: "Mezoterapia igłowa: odświeżenie i nawilżenie skóry twarzy (60 min, z konsultacją)" },
        { typ: "przedpo", tytul: "Poprawka 2: *opis* usługi", przed: "Zabieg wykonywany profesjonalnymi preparatami. Zapraszamy!", po: "Dla Ciebie, jeśli skóra jest szara i zmęczona. Po zabiegu: nawilżenie i blask. W cenie konsultacja i zalecenia do domu." },
        { typ: "przedpo", tytul: "Poprawka 3: *pierwsze* zdjęcie", przed: "Logo salonu na różowym tle.", po: "Zdjęcie efektu albo zabiegu w trakcie. Klientka ma zobaczyć, co dostanie." },
        { typ: "lista", tytul: "Sprawdź swój *profil*:", pozycje: ["Nazwy usług mówią, co klientka zyska", "Każda usługa ma czas trwania i cenę", "Pierwsze zdjęcia pokazują efekt, nie logo", "Opis odpowiada: dla kogo i po co", "Masz świeże opinie z ostatnich tygodni"] },
        { typ: "liczba", etykieta: "W e-booku", liczba: "60", tytul: "punktów kontroli Twojego profilu *Booksy*", tekst: "Tyle sprawdza checklista audytu z e-booka „Booksy, które sprzedaje”." },
        { typ: "cta", tytul: "Chcesz, żeby Booksy *pracowało* za Ciebie?", slowo: "BOOKSY", tekst: "Wyślę Ci link do e-booka: 12 rozdziałów, BOOKSY SALES PATH™ i checklista 60 punktów.", wyslij: "Wyślij koleżance, która ma Booksy.", portret: true },
      ],
    },
    {
      id: "follow-up",
      filar: "edukacja",
      nazwa: "3 wiadomości follow-up",
      seria: "Gotowe wiadomości",
      nr: "03",
      motyw: "papier",
      slajdy: [
        { typ: "okladka", etykieta: "Do skopiowania", tytul: "3 wiadomości, które *odzyskują* klientki", podtytul: "Skopiuj, dopasuj do swojego salonu i wyślij jeszcze dziś." },
        { typ: "teza", tytul: "Brak odpowiedzi to jeszcze nie *„nie”*.", tekst: "Często to zwykłe „zapomniałam”. Follow-up przypomina, a nie naciska." },
        { typ: "wiadomosc", etykieta: "Po 24 godzinach", tytul: "Klientka zapytała i *zamilkła*", tekst: "Pani Moniko, wracam do pytania o laminację brwi. Mam jeszcze dwa wolne terminy w tym tygodniu: środa 17:00 i piątek 12:00. Zarezerwować któryś dla Pani?" },
        { typ: "wiadomosc", etykieta: "Po 3 dniach", tytul: "Klientka *waha się* przy cenie", tekst: "Pani Moniko, klientki często pytają, czy efekt jest wart ceny. W cenie jest koloryzacja, regulacja i pielęgnacja po zabiegu. Jeśli ma Pani pytania, chętnie odpowiem." },
        { typ: "wiadomosc", etykieta: "Po wizycie", tytul: "Żeby klientka *wróciła*", tekst: "Dziękuję za dzisiejszą wizytę! Przypominam: przez pierwsze 24 h bez wody i makijażu brwi. Najlepiej wrócić za ok. 6 tygodni. Zapisać Panią już teraz na termin?" },
        { typ: "ikony", styl: "os", tytul: "Rytm *follow-upu*", tekst: "Trzy momenty, w których warto się odezwać:", pozycje: ["{dymek} Po 24 h: wróć z dwoma konkretnymi terminami.", "{zarowka} Po 3 dniach: odpowiedz na wątpliwość, nie naciskaj.", "{kalendarz} Po wizycie: zalecenia i kolejny termin."], wniosek: "Follow-up _przypomina_, a nie naciska. To *realna szansa*, że klientka wróci.", wniosekStyl: "ciemny" },
        { typ: "cta", tytul: "Zapisz, zanim *zgubisz*.", slowo: "WORKBOOK", tekst: "Wyślę Ci workbook z planem pierwszego ruchu na najbliższe 7 dni.", wyslij: "Wyślij recepcji albo wspólniczce.", portret: true },
      ],
    },
    {
      id: "mity-meta-ads",
      filar: "edukacja",
      nazwa: "4 mity o reklamie salonu",
      seria: "Mity Meta Ads",
      nr: "04",
      motyw: "wino",
      slajdy: [
        { typ: "okladka", obraz: "portret", uklad: "tlo", etykieta: "Bez lukru", tytul: "4 mity, przez które reklama salonu *nie ma szans*", podtytul: "Słyszę je co tydzień. Rozbieramy je po kolei." },
        { typ: "teza", tytul: "Reklama to nie cel. To *pierwszy ruch*.", tekst: "Każdy z tych mitów patrzy tylko na kampanię, a nie na całą drogę klientki." },
        { typ: "mitfakt", mit: "W sezonie wakacyjnym nie warto się reklamować.", fakt: "Spokojniejszy sezon to dobry moment, by *zbierać* bazę klientek na jesień." },
        { typ: "mitfakt", mit: "Wystarczą ładne zdjęcia efektów.", fakt: "Efekt zatrzymuje uwagę. *Decyzję* domyka opis, cena i szybka odpowiedź." },
        { typ: "mitfakt", mit: "Reklama musi działać od pierwszego dnia.", fakt: "Pierwsze dni to *nauka* algorytmu. Oceniaj po danych, nie po emocjach." },
        { typ: "mitfakt", mit: "Opinie zbiorą się same.", fakt: "Zadowolona klientka rzadko pisze sama. *Poproś* o opinię zaraz po wizycie." },
        { typ: "sciaga", etykieta: "Zapisz na później", tytul: "Fakty, nie *mity*", pozycje: ["Sezon to czas na budowanie bazy", "Efekt przyciąga, decyzję domyka komunikacja", "Daj kampanii czas na naukę", "O opinie proś zaraz po wizycie"] },
        { typ: "cta", tytul: "Sprawdźmy *Twoją* kampanię.", przycisk: "Umów 15 minut — link w bio", tekst: "W 15 minut sprawdzimy, czy reklama pracuje na rezerwacje.", wyslij: "Znasz kogoś, kto wierzy w mit nr 1? Wyślij.", portret: true },
      ],
    },
    {
      id: "obserwujacy",
      filar: "relacja",
      nazwa: "Nie potrzebujesz obserwujących",
      seria: "Bez lukru",
      nr: "05",
      motyw: "bordo",
      slajdy: [
        { typ: "okladka", etykieta: "Niepopularna opinia", tytul: "Nie potrzebujesz więcej *obserwujących*.", podtytul: "Potrzebujesz więcej rezerwacji. To nie to samo." },
        { typ: "artykul", wersaliki: true, tytul: "Salon nie zarabia *na zasięgu*.", tekst: "Zarabia na kobietach, które mogą do Ciebie dojechać i *chcą wrócić*.\n\nTysiąc obserwujących z Twojego miasta to więcej niż dziesięć tysięcy z całej Polski.", wniosek: "{wykres} Licz _rezerwacje_, a nie serduszka." },
        { typ: "punkt", etykieta: "Zamiast licznika", tytul: "Mierz *rezerwacje* z Instagrama", tekst: "Pytaj każdą nową klientkę, skąd o Tobie wie. Zapisuj odpowiedzi." },
        { typ: "punkt", etykieta: "Zamiast licznika", tytul: "Pokazuj *efekty* i kulisy", tekst: "Metamorfozy, proces, Twoja twarz. Ludzie rezerwują u ludzi." },
        { typ: "punkt", etykieta: "Zamiast licznika", tytul: "Zamieniaj DM w *wizyty*", tekst: "Każda rozmowa kończy się propozycją konkretnego terminu." },
        { typ: "cytat", tekst: "Marketing nie kończy się w Menedżerze Reklam. Tam dopiero *zaczyna się* rozmowa." },
        { typ: "cta", tytul: "Zgadzasz się czy *nie*?", przycisk: "Napisz w komentarzu: TAK albo NIE", tekst: "Jestem ciekawa Twojego zdania.", wyslij: "Wyślij osobie, która liczy tylko lajki.", portret: true },
      ],
    },
    {
      id: "kalkulator-klientki",
      filar: "edukacja",
      nazwa: "Ile jest warta jedna klientka",
      seria: "Policz to",
      nr: "06",
      motyw: "papier",
      slajdy: [
        { typ: "okladka", etykieta: "Weź kalkulator", tytul: "Ile jest warta *jedna* klientka, która wraca?", podtytul: "Prosty rachunek na Twoich liczbach. Poniżej przykład." },
        { typ: "teza", tytul: "Nie licz *wizyty*. Licz cały rok.", tekst: "Dopiero wtedy widać, ile możesz wydać na pozyskanie klientki i na zadbanie o nią." },
        { typ: "koszty", tytul: "Załóżmy:", pozycje: ["{metka} Średnia wartość wizyty | 280 zł", "{kalendarz} Wizyty jednej klientki w roku | × 4", "{monety} Roczna wartość klientki | 1 120 zł"], tekst: "Tyle może być wart _jeden_ kontakt, na który *nikt nie odpisał*.", wniosek: "{wykres} I dopiero teraz zaczynamy liczyć.", wniosekWersaliki: true },
        { typ: "artykul", tytul: "To nie jest *koszt*. To _brak przychodu_.", tekst: "Nieodpisana wiadomość nie pojawia się w żadnym raporcie.\n\nA właśnie tam najczęściej ucieka *klientka na cały rok*.", wniosek: "{zarowka} Wpisz swoje liczby. To przykład, nie obietnica." },
        { typ: "lista", tytul: "Co zrobić *od jutra*:", pozycje: ["Ustal okno odpowiedzi, np. 2 h w godzinach pracy", "Przygotuj 3 odpowiedzi na najczęstsze pytania", "Kończ każdą rozmowę propozycją dwóch terminów", "Przy każdej wizycie proponuj kolejny termin"] },
        { typ: "cta", tytul: "Policz to na *swoich* danych.", slowo: "WORKBOOK", tekst: "W workbooku masz kalkulator konwersji beauty i plan na 7 dni.", wyslij: "Wyślij właścicielce salonu, którą znasz.", portret: true },
      ],
    },
    {
      id: "kim-jestem",
      filar: "relacja",
      nazwa: "Dlaczego nie sprzedaję samych Adsów",
      seria: "Kulisy Bloom",
      nr: "07",
      motyw: "puder",
      slajdy: [
        { typ: "okladka", obraz: "portret", uklad: "bok", etykieta: "Kim jestem", tytul: "Dlaczego nie sprzedaję *„samych Adsów”*", podtytul: "Krótka historia o tym, co widzę po drugiej stronie kampanii." },
        { typ: "teza", tytul: "Widzę cały proces, a nie tylko *raport*.", tekst: "Od pierwszego kliknięcia, przez rozmowę z leadem, po zapis klientki na konkretną usługę." },
        { typ: "zdjecie", obraz: "portret", tytul: "Cześć, jestem *Sylwia*.", podpis: "Właścicielka Bloom Agency, specjalistka Meta Ads, szkoleniowczyni i certyfikowana doradczyni zawodowa." },
        { typ: "punkt", etykieta: "System Bloom", tytul: "Najpierw *oferta*", tekst: "Doprecyzowujemy, co ma zatrzymać uwagę właściwej osoby." },
        { typ: "punkt", etykieta: "System Bloom", tytul: "Potem *kampania*", tekst: "Komunikat, który prowadzi odbiorczynię do konkretnego działania." },
        { typ: "punkt", etykieta: "System Bloom", tytul: "Potem *kontakt*", tekst: "Co dzieje się z leadem po formularzu: tempo, follow-up i odpowiedź." },
        { typ: "punkt", etykieta: "System Bloom", tytul: "Na końcu *rezerwacja*", tekst: "Wizyta, większy koszyk i to, czy klientka wraca." },
        { typ: "cytat", tekst: "Nie obiecuję magicznego przycisku do pełnego grafiku. Uczę *systemu*, który można wdrożyć." },
        { typ: "cta", tytul: "Sprawdźmy, czy mamy *wspólny kierunek*.", przycisk: "Umów 15 minut — link w bio", tekst: "Krótka rozmowa o Twojej marce beauty. Bez zobowiązań.", portret: false },
      ],
    },
  ];

  const PUSTA = {
    id: "pusta",
    nazwa: "Pusta karuzela",
    seria: "Marketing Beauty",
    nr: "08",
    motyw: "papier",
    slajdy: [
      { typ: "okladka", etykieta: "Temat", tytul: "Twój hak z *jednym* wyróżnionym słowem", podtytul: "Obietnica: co klientka zyska, gdy przesunie dalej." },
      { typ: "teza", tytul: "Slajd 2 od razu daje *wartość*.", tekst: "Bez przedstawiania się. Konkret, który odpowiada na hak." },
      { typ: "artykul", tytul: "Nagłówek z *kolorem* i _kursywą_.", tekst: "Pierwszy akapit: jedna myśl.\n\nDrugi akapit z *pogrubieniem* w kolorze akcentu.", wniosek: "{zarowka} Wniosek w ramce: zdanie, które czytelniczka ma zapamiętać." },
      { typ: "ikony", tytul: "Lista z *ikonami*", pozycje: ["{kalendarz} Ikonę wybierasz w klamrach…", "…albo dobierze się sama z treści", "Na przykład do słowa „SMS” albo „promocja”"] },
      { typ: "koszty", tytul: "Załóżmy:", pozycje: ["Pierwsza pozycja | 1 800 zł", "Druga pozycja | 1 500 zł", "Razem | 3 300 zł"], wniosek: "{wykres} I dopiero teraz zaczynamy liczyć.", wniosekWersaliki: true },
      { typ: "punkt", tytul: "Punkt *numerowany*", tekst: "Jedna myśl na slajd." },
      { typ: "sciaga", tytul: "Ściąga do *zapisania*", pozycje: [] },
      { typ: "opinia", tekst: "[Wklej tu prawdziwą opinię klientki — bez dopisywania efektów.]", autor: "Imię, salon" },
      { typ: "cta", tytul: "Co dalej?", slowo: "WORKBOOK", tekst: "Napisz słowo w komentarzu, a wyślę Ci materiał.", wyslij: "Wyślij to koleżance, której się przyda.", portret: true },
    ],
  };

  // ---------- opis posta ----------
  const bez = (t) => String(t || "").replace(/[*_]/g, "").replace(/\{[^}]*\}\s*/g, "").replace(/\s*\n+\s*/g, " ").trim();

  function opis(k) {
    const sl = k.slajdy;
    const okl = sl.find((s) => s.typ === "okladka") || sl[0] || {};
    const teza = sl.find((s) => s.typ === "teza");
    const cta = sl.find((s) => s.typ === "cta") || {};
    const punkty = sl.filter((s) => ["punkt", "mitfakt", "przedpo", "wiadomosc", "artykul", "ikony", "koszty"].includes(s.typ));
    const linie = [];
    linie.push(bez(okl.tytul));
    if (teza) linie.push("", bez(teza.tytul) + " " + bez(teza.tekst));
    if (punkty.length) {
      linie.push("", "W karuzeli:");
      punkty.slice(0, 6).forEach((p) => linie.push("→ " + bez(p.tytul || p.fakt || p.etykieta)));
    }
    linie.push("");
    if (cta.slowo) linie.push(`Napisz „${cta.slowo}” w komentarzu, a wyślę Ci link w wiadomości.`);
    else if (cta.przycisk) linie.push(bez(cta.przycisk));
    linie.push("Zapisz, żeby wrócić do tego przy planowaniu tygodnia.");
    if (cta.wyslij) linie.push(bez(cta.wyslij));
    linie.push("", hashtagi(k).join(" "));
    return linie.join("\n");
  }

  function hashtagi(k) {
    const tekst = JSON.stringify(k).toLowerCase();
    const rot = M.hashtagi.rotacja.slice();
    const wybrane = [];
    const pasuje = (tag, ...slowa) => slowa.some((s) => tekst.includes(s)) && wybrane.push(tag);
    pasuje("#booksy", "booksy");
    pasuje("#facebookads", "meta ads", "kampani", "reklam");
    pasuje("#reklamasalonu", "reklam");
    pasuje("#wlascicielkasalonu", "salon");
    pasuje("#kobietywbiznesie", "kobiet", "właścicielk");
    pasuje("#bloomagency", "bloom");
    for (const t of rot) if (wybrane.length < 6 && !wybrane.includes(t)) wybrane.push(t);
    return [...M.hashtagi.staly, ...wybrane.slice(0, 6)];
  }

  // ---------- prompt dla Claude ----------
  function prompt({ temat, filar, slajdow, oferta, motyw }) {
    const typy = Object.entries(TYPY)
      .filter(([id]) => id !== "opinia" && id !== "zdjecie")
      .map(([id, t]) => `- "${id}" (${t.nazwa}): pola ${t.pola.filter((p) => !["obraz", "uklad", "wersaliki", "wyrownanie"].includes(p)).join(", ")}`)
      .join("\n");
    const przyklad = JSON.stringify({ seria: GOTOWE[0].seria, motyw: "papier", slajdy: GOTOWE[0].slajdy.slice(0, 4) }, null, 1);
    return `Jesteś redaktorką treści marki osobistej ${M.nazwa} (${M.deskryptor}). Hasło marki: „${M.haslo}”. Obietnica: „${M.obietnica}”.
Odbiorczynie: właścicielki salonów kosmetycznych, gabinetów i marek beauty w Polsce.

Głos marki:
${M.glos.zasady.map((z) => "- " + z).join("\n")}
Słowa, których używamy: ${M.glos.tak.join(", ")}.
Czego unikamy: ${M.glos.nie.join(", ")}.
Nie wymyślaj statystyk ani wyników klientek. Jeśli potrzebna jest liczba, użyj przykładu i oznacz go jako przykład.
Nie powtarzaj tematów, które już były na profilu:
${M.opublikowane.map((t) => "- " + t).join("\n")}

Zasady karuzeli (trendy 2026):
- Slajd 1: okładka z konkretnym, emocjonalnym hakiem (ból albo obietnica), bez clickbaitu.
- Slajd 2: od razu daje wartość (typ "teza"); działa też samodzielnie, bo Instagram potrafi pokazać karuzelę od drugiego slajdu.
- Jedna myśl na slajd, tytuł do ok. 10 słów, tekst do ok. 20 słów.
- Przedostatni slajd: coś do zapisania (ściąga, checklista albo gotowa wiadomość).
- Ostatni slajd: "cta" ze słowem-kluczem do komentarza i zachętą do wysłania komuś w DM.
- Wyróżnienia jak na moich slajdach: *gwiazdki* = słowa w kolorze akcentu (bordo/puder, pogrubione), _podkreślniki_ = kursywa (np. "Decyzje zakupowe potrafią _dojrzewać_."). W nagłówku 1–3 wyróżnione słowa.
- Moje typowe slajdy środkowe: "artykul" (nagłówek + 1–2 krótkie akapity rozdzielone pustą linią + wniosek w ramce), "ikony" (lista z ikonami w kółkach), "koszty" (zestawienie „Etykieta | Wartość”, np. „Załóżmy:”). Pole "wniosek" to krótkie zdanie-puenta w ramce; "wniosekStyl": "ciemny" daje bordową ramkę.
- Ikonę w pozycji lub we wniosku możesz wskazać na początku w klamrach, np. "{kalendarz} Przypominają o terminach". Dostępne ikony: kalendarz, dzwonek, serce, powrot, oko, koperta, metka, osoby, dymek, zarowka, wykres, wzrost, megafon, monety, telefon, gwiazda, zegar, cel, ok, portfel.

Typy slajdów i ich pola:
${typy}
Pole "pozycje" to tablica krótkich tekstów. Pole "portret" w cta to true/false (moje zdjęcie).
Na okładce możesz dodać "obraz": "portret" (moje zdjęcie) i "uklad": "bok" (zdjęcie z prawej) albo "tlo" (zdjęcie na całym slajdzie); bez zdjęcia okładka jest tekstowa, wyśrodkowana, wersalikami.
Nie używaj typu "opinia" ani "zdjecie" (wymagają prawdziwych materiałów).

Oferta, do której prowadzi CTA: ${oferta || "dobierz najlepszą z: " + M.oferta.map((o) => o.nazwa + " (" + o.cta + ")").join("; ")}.

Zadanie: przygotuj karuzelę na temat: „${temat}”.
Filar treści: ${filar || "edukacja"}. Liczba slajdów: ${slajdow || 8}. Motyw kolorystyczny: ${motyw || "papier"} (dozwolone: wino, bordo, papier, puder).

Odpowiedz WYŁĄCZNIE poprawnym JSON-em w tym kształcie (bez komentarzy, bez markdown):
{"seria": "krótka nazwa serii", "motyw": "papier", "slajdy": [ ... ]}

Przykład początku dobrej karuzeli:
${przyklad}`;
  }

  root.Szablony = { TYPY, POLA, GOTOWE, PUSTA, opis, hashtagi, prompt };
})(typeof window !== "undefined" ? window : globalThis);
