# Fundacja Krok po Kroku — TODO (Narzędzie Konsultanta)

## Koncepcja
Aplikacja dla KONSULTANTA (nie klienta). Zarządzasz projektami rejestracji fundacji dla swoich klientów.
Masz dostęp do: checklisty, weryfikacji dokumentów, kreatora statutu, bazy wiedzy.

## Ekran Główny — Dashboard Konsultanta
- [x] Lista aktywnych projektów klientów (karty z postępem)
- [x] Szybkie statystyki: ile projektów aktywnych / ukończonych
- [x] Przycisk "Nowy klient / nowy projekt"
- [x] Skróty do: Kreator Statutu, Weryfikacja Dokumentów, Baza Wiedzy

## Zarządzanie Projektami Klientów
- [x] Formularz dodania klienta: imię/nazwa fundacji, kontakt, data rozpoczęcia
- [x] Widok projektu klienta z pełną checklistą 5 kroków
- [x] Każdy krok ma: status (nie rozpoczęty / w toku / gotowy), notatki konsultanta, datę
- [x] Możliwość dodania notatek do każdego dokumentu
- [x] Oznaczanie dokumentów: "Otrzymano", "Do poprawy", "Zaakceptowano"
- [x] Historia zmian / log aktywności per projekt
- [x] Eksport listy zadań do tekstu (do wysłania klientowi)

## Kreator Statutu (AI-assisted)
- [x] Formularz zbierający dane fundacji: nazwa, cel, siedziba, fundator, zarząd, fundusz
- [x] Generowanie pełnego tekstu statutu na podstawie danych
- [x] Wszystkie obowiązkowe rozdziały z wypełnionymi danymi klienta
- [x] Opcjonalne rozdziały do wyboru (działalność gospodarcza, OPP, wolontariat)
- [x] Podgląd gotowego statutu z możliwością edycji każdej sekcji
- [x] Kopiowanie do schowka / eksport tekstu
- [x] Wskazówki i przykłady dla każdej sekcji

## Weryfikacja Dokumentów
- [x] Checklist weryfikacyjna dla każdego etapu (co sprawdzić przed złożeniem do KRS)
- [x] Krok 1: Weryfikacja aktu fundacyjnego (lista wymaganych elementów)
- [x] Krok 2: Weryfikacja statutu (lista wymaganych paragrafów)
- [x] Krok 3: Weryfikacja wniosku KRS (formularze, załączniki, podpisy)
- [x] Krok 4: Weryfikacja po rejestracji (CRBR, NIP-8, konto bankowe)
- [x] Każda pozycja: opis co sprawdzić + przykład poprawnego zapisu
- [x] Podsumowanie: ile pozycji OK / ile do poprawy

## Baza Wiedzy (dla konsultanta)
- [x] 5 kluczowych ustaw z opisem i linkami
- [x] Ważne terminy po rejestracji (CRBR 14 dni, NIP-8 21 dni, konto bankowe)
- [x] Typowe błędy i jak ich unikać
- [x] Koszty rejestracji (tabela)
- [x] Przydatne portale (KRS, CRBR, ISAP, ngo.pl)
- [x] Wzory pism (szablony tekstowe)

## Nawigacja
- [x] Tab: Dashboard (lista klientów)
- [x] Tab: Kreator Statutu
- [x] Tab: Weryfikacja
- [x] Tab: Baza Wiedzy

## Szablon Statutu z Edycją

- [x] Ekran szablonu statutu: pelny tekst z wszystkimi paragrafami
- [x] Edycja kazdego paragrafu inline (dotknij -> edytuj -> zapisz)
- [x] Oznaczenie: obowiazkowy / opcjonalny / do wypelnienia
- [x] Podswietlenie miejsc do wypelnienia (np. [NAZWA FUNDACJI])
- [x] Tryb podgladu: caly statut jako ciagly tekst
- [x] Tryb edycji: lista sekcji z przyciskiem edycji
- [x] Udostepnianie gotowego statutu
- [x] Dostep z dashboardu (szybki dostep) i z kreatora statutu

## Nowe funkcje — 7 modułów (priorytetowe)

- [ ] Wytyczne konkursowe — regulaminy NIW, PARP, UE z kryteriami punktowymi
- [ ] Optymalizator pod kryteria — co daje 0 pkt, co daje max pkt
- [ ] Biblioteka fragmentów — opisy problemów, grup docelowych, rezultatów, wskaźników
- [ ] Generator logiki projektu — problem → cel → działania → rezultaty → KPI
- [ ] Modele budżetów — widełki cen, przykładowe budżety, wykrywanie zawyżonych kosztów
- [ ] System błędów — wykrywanie niespójności w projekcie
- [ ] Podstawy prawa — ustawa o pożytku, finanse publiczne, kwalifikowalność kosztów UE
- [ ] Wskaźniki i KPI — generator wskaźników z metodą pomiaru

## KILLER FEATURE — Ekspert ocenia wniosek

- [ ] Ekran "Ocena eksperta" — symulacja oceny komisji konkursowej
- [ ] Ocena punktowa: Trafność, Realność, Budżet, Innowacyjność, Spójność (każde /10)
- [ ] Suma punktów z interpretacją (ryzyko odrzucenia / szansa na dofinansowanie)
- [ ] Lista słabości: konkretne błędy wykryte w projekcie
- [ ] Lista poprawek: konkretne sugestie co zmienić (nie ogólniki)
- [ ] Komentarz eksperta: narracyjna ocena jak z komisji
- [ ] Integracja z kreatorem: przycisk "Sprawdź jak oceni komisja" w projekcie
- [ ] Scoring oparty na realnych kryteriach konkursów NIW/FIO/UE

## Moduły rozszerzone

- [ ] Wytyczne konkursowe — NIW, FIO, PROO, PARP, UE z kryteriami punktowymi
- [ ] Optymalizator pod kryteria — co daje 0 pkt, co daje max pkt
- [ ] Biblioteka fragmentów — opisy problemów, grup docelowych, rezultatów, wskaźników
- [ ] Generator logiki projektu — problem → cel → działania → rezultaty → KPI
- [ ] Modele budżetów — widełki cen, przykładowe budżety, wykrywanie zawyżonych kosztów
- [ ] System błędów — wykrywanie niespójności w projekcie
- [ ] Podstawy prawa — ustawa o pożytku, finanse publiczne, kwalifikowalność kosztów UE
- [ ] Wskaźniki i KPI — generator wskaźników z metodą pomiaru

## Zrealizowane moduły eksperta
- [x] Generator logiki projektu (problem→cel→działania→rezultaty→KPI)
- [x] Ekspert ocenia wniosek (scoring 6 kryteriów, symulacja komisji)
- [x] Modele budżetów (widełki cen, kalkulator, wykrywanie zawyżeń)
- [x] Podstawy prawne (co wolno/czego nie wolno, linki ISAP)
- [x] Integracja wszystkich modułów w nawigacji dashboardu

## Bezpieczeństwo i AI
- [x] System logowania — ekran logowania z hasłem (domyślne: ngo2024)
- [x] AuthProvider — kontekst autentykacji z AsyncStorage
- [x] AuthGuard — ochrona wszystkich zakładek (tabs)
- [x] Ekran Ustawień — zmiana hasła, wylogowanie
- [x] Przycisk Ustawień w nagłówku dashboardu
- [x] Naprawa połączenia AI — frontend teraz poprawnie łączy się z serwerem AI na porcie 3001
- [x] Tryb NIE PRZEJDZIE — brutalna ocena AI działa poprawnie
- [x] Stwórz ze mną — kreator AI działa poprawnie

## Integracja Supabase
- [x] Instalacja @supabase/supabase-js
- [x] Konfiguracja zmiennych środowiskowych (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SECRET_KEY)
- [x] Utworzenie tabel w Supabase (grant_projects, grant_fragments, ai_reviews)
- [x] Dodanie brakujących kolumn do tabeli grant_projects
- [x] Klient Supabase (lib/supabase.ts)
- [x] Warstwa danych z Supabase (lib/supabase-storage.ts) z fallback na AsyncStorage
- [x] Migracja lokalnych danych do Supabase przy starcie aplikacji
- [x] Aktualizacja importów w tabs/index.tsx i new-project.tsx
- [x] Test połączenia z Supabase (vitest)

## OpenAI + Historia ocen AI
- [x] Konfiguracja klucza OpenAI API w serwerze (USER_OPENAI_API_KEY)
- [x] Aktualizacja AI routera — NIE PRZEJDZIE używa GPT-4o
- [x] Aktualizacja AI routera — Ekspert Ocenia używa GPT-4o
- [x] Aktualizacja AI routera — Stwórz ze mną używa GPT-4o
- [x] Zapisywanie wyników ocen do Supabase (tabela ai_reviews)
- [x] Uczenie się z historii — AI analizuje poprzednie oceny przy nowej ocenie
- [x] Ekran historii ocen (Historia Ocen 📊) w dashboardzie
- [x] Statystyki ocen (przejdzie/ryzykowny/nie przejdzie/średni wynik)
