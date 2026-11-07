/*
 * Sylwia Ida Różańska · Marketing Beauty & Meta Ads
 * Jedno źródło prawdy o marce: kolory, typografia, głos, filary treści.
 * Używane przez Kreator Karuzel. Opis słowny: ../brand/BRANDBOOK.md.
 */
(function (root) {
  const MARKA = {
    nazwa: "Sylwia Ida Różańska",
    deskryptor: "Marketing Beauty & Meta Ads",
    haslo: "Od reklamy do rezerwacji.",
    obietnica: "Mniej pustych kliknięć. Więcej klientek.",
    instagram: "@sylwiaidarozanska",
    www: "sylwiaidarozanska.pl",
    agencja: "Bloom Agency",

    kolory: {
      bordo: "#541827", // kolor główny marki (logo, CTA, nagłówki)
      wino: "#351018", // najciemniejsze tło, sekcje „manifest”
      roza: "#8b4555", // akcent: kursywa, wyróżnione słowo, linie
      puder: "#e8cbc4", // pudrowy róż: tła, akcent na ciemnym
      brudnyRoz: "#d09a9c", // detal: kropka w sygnecie, ikony
      karmin: "#6e1a2c", // wyróżnione słowa w nagłówkach na jasnym tle
      papier: "#f5f0eb", // główne jasne tło
      krem: "#fffbf6", // tekst na ciemnym, karty
      atrament: "#25191a", // tekst ciągły na jasnym
    },

    // Motywy slajdów: tło, tekst, akcent, etykiety, linie
    motywy: {
      wino: { tlo: "#351018", tekst: "#fffbf6", akcent: "#e8cbc4", etykieta: "#e8cbc4", linia: "rgba(232,203,196,0.28)", ciemny: true },
      bordo: { tlo: "#561522", tekst: "#fffbf6", akcent: "#e8c3ba", etykieta: "#e8cbc4", linia: "rgba(232,203,196,0.30)", ciemny: true },
      papier: { tlo: "#f3ebe3", tekst: "#2a1517", akcent: "#6e1a2c", etykieta: "#541827", linia: "rgba(84,24,39,0.16)", ciemny: false },
      puder: { tlo: "#ead3cc", tekst: "#2a1517", akcent: "#6e1a2c", etykieta: "#541827", linia: "rgba(84,24,39,0.20)", ciemny: false },
    },

    fonty: {
      // Instagram: ciężki, kontrastowy szeryf w nagłówkach (jak na Twojej siatce)
      naglowek: "'Playfair Display', 'Bodoni Moda', Georgia, 'Times New Roman', serif",
      // Strona www: lżejszy, elegancki szeryf; w karuzelach do podtekstów i kursywy
      display: "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif",
      tekst: "'Manrope', 'Segoe UI', Arial, sans-serif", // etykiety, drobne napisy
    },

    // Tematy już opublikowane na Instagramie (stan z listopada 2026) — nie powtarzamy
    opublikowane: [
      "Masz leady, ale gdzie rezerwacje? 5 miejsc, w których uciekają klientki",
      "Lead za 10 zł może być droższy niż lead za 30 zł (sam CPL mówi niewiele)",
      "Nie każdy zabieg nadaje się do reklamy",
      "Marketing nie sprzeda pakietu za Ciebie",
      "Rabat nie uratuje słabej oferty",
      "Booksy nie jest Twoim sprzedawcą",
      "Nie pytaj mnie, ile leadów Ci zagwarantuję",
      "Dobry marketing potrzebuje dobrej współpracy (Standard Współpracy)",
      "5 rzeczy, które sprawdzam, zanim uruchomię reklamę salonu",
      "Najbrzydsza reklama czasem sprzedaje najlepiej (przed → po)",
      "Kiedyś chciałam mieć więcej, dziś wystarczająco dużo (osobisty)",
      "Opinia klientki: odzyskana wiara po martwym sezonie wakacyjnym",
      "„Ile leadów mi zagwarantujesz?” — lead nie jest Twoim celem, zapłaciłam agencji 1 800 zł… (rentowność)",
      "Kampanie SMS: klientka, która mówi „muszę się zastanowić”, wraca po miesiącu (decyzje zakupowe dojrzewają)",
    ],

    glos: {
      zasady: [
        "Mówisz do jednej kobiety, na „Ty”, z feminatywami (klientka, właścicielka, odbiorczyni).",
        "Krótkie zdania. Kontrast w dwóch taktach: „Reklama to nie cel. To pierwszy ruch.”",
        "Konkret zamiast obietnic. Bez „magicznego przycisku”, bez dopisywania efektów.",
        "Język salonu i reklamy: rezerwacja, grafik, Booksy, lead, follow-up, wizyta, powrót klientki.",
        "W nagłówku wyróżniasz słowa kolorem (bordo na jasnym, puder na ciemnym), a pojedyncze zwroty kursywą („dojrzewać”, „muszę się zastanowić”).",
        "Emoji oszczędnie (maks. 1–2 w opisie), nigdy w nagłówkach plansz.",
      ],
      tak: ["rezerwacja", "klientka", "ścieżka decyzji", "system", "pierwszy ruch", "follow-up", "konkret", "grafik", "oferta", "zaufanie"],
      nie: ["magiczny sposób", "gwarantowany viral", "zarób 10k w tydzień", "hack", "100% skuteczności", "CAPS LOCK-owe krzyki", "„tanie leady” jako cel"],
      frazy: [
        "Od reklamy do rezerwacji.",
        "Mniej pustych kliknięć. Więcej klientek.",
        "Reklama to nie cel. To pierwszy ruch.",
        "Marketing nie kończy się w Menedżerze Reklam. Tam dopiero zaczyna się rozmowa.",
        "Nie sprzedaję „samych Adsów”.",
        "Nie obiecuję magicznego przycisku do pełnego grafiku. Uczę systemu.",
        "Nie szukasz kolejnej reklamy. Szukasz skutecznego ruchu.",
      ],
    },

    // System Bloom — 4 etapy, wokół których budujemy treści
    system: [
      { nr: "01", nazwa: "Oferta", opis: "Co ma zatrzymać uwagę właściwej osoby." },
      { nr: "02", nazwa: "Kampania", opis: "Komunikat, który prowadzi do konkretnego działania." },
      { nr: "03", nazwa: "Kontakt", opis: "Tempo, follow-up i odpowiedź na leada." },
      { nr: "04", nazwa: "Rezerwacja", opis: "Wizyta, większy koszyk i powrót klientki." },
    ],

    // Miks treści (z Twojej własnej metodyki)
    filary: [
      { id: "edukacja", nazwa: "Edukacja", udzial: 40, opis: "Meta Ads, Booksy, oferta, follow-up — jak to działa w salonie." },
      { id: "relacja", nazwa: "Relacja", udzial: 30, opis: "Kulisy Bloom, poglądy, manifest, praca z kobietami w biznesie." },
      { id: "sprzedaz", nazwa: "Sprzedaż", udzial: 20, opis: "E-book Booksy, workbook, konsultacja 15 min, współpraca." },
      { id: "dowod", nazwa: "Dowód społeczny", udzial: 10, opis: "Opinie klientek i kursantek, przed/po, case study." },
    ],

    oferta: [
      { nazwa: "E-book „Booksy, które sprzedaje”", cta: "Napisz BOOKSY w komentarzu", szczegol: "12 rozdziałów, BOOKSY SALES PATH™, audyt 60 punktów" },
      { nazwa: "Workbook „Metoda od kliknięcia do klientki”", cta: "Workbook za darmo — link w bio", szczegol: "Audyt drogi reklama → kontakt → rezerwacja" },
      { nazwa: "Konsultacja 15 minut", cta: "Umów 15 minut — link w bio", szczegol: "Sprawdzimy, czy mamy wspólny kierunek" },
      { nazwa: "Bloom Agency — kampanie Meta Ads", cta: "Napisz do mnie w DM", szczegol: "Od reklamy do rezerwacji" },
    ],

    hashtagi: {
      staly: ["#marketingbeauty", "#metaads", "#salonkosmetyczny"],
      rotacja: [
        "#reklamasalonu", "#marketingdlasalonow", "#booksy", "#salonbeauty", "#kosmetologia",
        "#gabinetkosmetyczny", "#wlascicielkasalonu", "#biznesbeauty", "#reklamanainstagramie",
        "#facebookads", "#instagramads", "#marketingdlakobiet", "#kobietywbiznesie", "#bloomagency",
      ],
    },

    // Format karuzel: 4:5, 1080×1350 — aktualny format karuzel na Instagramie
    formaty: {
      "4:5": { w: 1080, h: 1350, opis: "1080×1350 · format karuzel na Instagramie" },
    },
    margines: 96,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = MARKA;
  else root.MARKA = MARKA;
})(typeof window !== "undefined" ? window : globalThis);
