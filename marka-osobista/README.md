# Marka osobista — Sylwia Ida Różańska

**Marketing Beauty & Meta Ads · „Od reklamy do rezerwacji.”**

W tym folderze są dwie rzeczy:

1. **Branding** (`brand/`): brandbook, logo, portret, przykłady i zrzut siatki Instagrama.
2. **Kreator Karuzel** (`kreator-karuzel/`): program, który od zera tworzy karuzele na Instagram w Twoim stylu.

## Branding

- `brand/brandbook.html` — otwórz w przeglądarce. Zawiera esencję marki, głos, kolory, typografię, elementy graficzne, analizę Twojej siatki, miks treści i zasady karuzel 2026 (ze źródłami).
- `brand/logo/` — logo-podpis (PNG), sygnet „S” (SVG), portret.
- `brand/inspiracje/` — zrzut siatki Instagrama, na którym oparty jest styl karuzel.
- Tokeny marki dla programu (kolory, fonty, głos, oferta, opublikowane tematy): `kreator-karuzel/js/marka.js`.

## Kreator Karuzel

### Jak używać
Otwórz `kreator-karuzel/index.html` w przeglądarce (Chrome, Edge, Safari). Nie trzeba niczego instalować, a fonty są w środku.

1. **Wybierz gotową karuzelę** z biblioteki albo **napisz nową z AI**. Na claude.ai przycisk „Napisz karuzelę” robi to od razu. Lokalnie kliknij „Kopiuj prompt”, wklej go Claude i wklej odpowiedź (JSON) z powrotem.
2. **Edytuj slajdy**: typ, motyw, teksty, zdjęcia. Słowo w `*gwiazdkach*` dostaje kursywę w kolorze akcentu. Panel „Uwagi” podpowiada, co poprawić (hak, slajd 2, długość tekstu, slajd do zapisania, CTA).
3. **Pobierz**: „Pobierz wszystkie slajdy (ZIP)” daje PNG 1080×1440 (3:4) albo 1080×1350 (4:5) oraz gotowy opis posta z hashtagami.
4. **Zapisz projekt** (JSON), żeby wrócić do karuzeli później. Ostatni szkic zapisuje się też w przeglądarce.

### Typy slajdów
Okładka (sam tekst / zdjęcie z prawej / zdjęcie w tle) · Teza · Punkt numerowany · Mit vs fakt · Przed/po · Gotowa wiadomość · Checklista · Liczba/krok · Cytat · Opinia klientki · Zdjęcie · Ściąga (zbiera punkty automatycznie) · CTA ze słowem-kluczem.

### Co wynika z trendów 2026
- format 3:4, bo tak siatka pokazuje posty;
- 7–10 slajdów;
- hak na okładce, a slajd 2 od razu daje wartość;
- jedna myśl na slajd;
- ciągłość między slajdami: łuki, nić i cień liści liczone są jako jedna panorama, więc płynnie przechodzą przez krawędzie;
- slajd do zapisania i CTA ze słowem-kluczem oraz zachętą do wysłania w DM.

### Render z linii poleceń (opcjonalnie)
```bash
cd kreator-karuzel
npm install && npx playwright install chromium
node narzedzia/render.mjs przyklady/voucher-swieta.json wyniki   # jedna karuzela
node narzedzia/render.mjs --wszystkie wyniki                     # cała biblioteka
```

### Zmiana zdjęć i logo
Podmień pliki w `brand/logo/` i uruchom `node narzedzia/zasoby.mjs` w folderze `kreator-karuzel`. Własne zdjęcia na slajdy możesz też po prostu wgrać w edytorze.

Fonty: Playfair Display, Cormorant Garamond i Manrope, wszystkie na licencji SIL Open Font License (`kreator-karuzel/fonts/OFL.txt`).
