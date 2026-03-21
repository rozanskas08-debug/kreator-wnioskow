# NGO Rejestracja — Interface Design Plan

## App Concept
A professional mobile assistant for paid NGO registration services in Poland. Guides users step-by-step through founding foundations (fundacje), associations (stowarzyszenia), and other non-profit organizations. The app acts as a consultant in your pocket — warm, professional, trustworthy.

---

## Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `primary` | `#E07B1A` | `#F59E3A` | Orange — energy, civic engagement (matches ngo.pl brand) |
| `background` | `#FAFAF8` | `#141412` | Warm white / near-black |
| `surface` | `#FFFFFF` | `#1E1E1A` | Cards, modals |
| `foreground` | `#1A1A16` | `#F0EFE8` | Primary text |
| `muted` | `#6B6B5E` | `#9B9A8E` | Secondary text, labels |
| `border` | `#E8E7DF` | `#2E2E28` | Dividers, card borders |
| `success` | `#22A45D` | `#34D399` | Completed steps |
| `warning` | `#E07B1A` | `#F59E3A` | Warnings (same as primary) |
| `error` | `#DC2626` | `#F87171` | Errors |
| `accent` | `#1A5FA8` | `#60A5FA` | Secondary accent — trust/legal blue |

---

## Screen List

### Tab 1: Strona Główna (Home)
- Hero section with app tagline
- Quick-start cards for each NGO type (Fundacja, Stowarzyszenie, Inne)
- "Moje projekty" — list of in-progress registrations
- News/tips banner

### Tab 2: Kreator (Wizard)
- NGO type selection screen
- Step-by-step wizard with progress indicator
- Individual step screens (dynamic based on type)
- Summary & document checklist screen

### Tab 3: Akty Prawne (Legal Acts)
- List of key legal acts with descriptions
- Detail view for each act (summary, key articles, links)
- Search functionality

### Tab 4: Usługi & Cennik (Services & Pricing)
- Pricing tiers (Basic, Standard, Premium)
- Service descriptions
- Contact/booking form
- FAQ section

### Tab 5: Profil (Profile)
- User's saved registrations
- Progress tracking
- Settings

---

## Key User Flows

### Flow 1: Start Foundation Registration
1. Home → tap "Zakładam Fundację" card
2. Wizard: Step 1 — Cel fundacji (define purpose)
3. Wizard: Step 2 — Fundator (founder details)
4. Wizard: Step 3 — Majątek (initial assets)
5. Wizard: Step 4 — Statut (statute preparation checklist)
6. Wizard: Step 5 — Notariusz (notary act)
7. Wizard: Step 6 — Rejestracja KRS (KRS registration)
8. Wizard: Step 7 — Po rejestracji (post-registration tasks)
9. Summary screen with document checklist

### Flow 2: Start Association Registration
1. Home → tap "Zakładam Stowarzyszenie" card
2. Wizard: Step 1 — Cel i misja
3. Wizard: Step 2 — Założyciele (min. 7 persons)
4. Wizard: Step 3 — Statut
5. Wizard: Step 4 — Zebranie założycielskie
6. Wizard: Step 5 — Rejestracja KRS
7. Wizard: Step 6 — Rejestracja w urzędach
8. Summary screen

### Flow 3: Browse Legal Acts
1. Legal Acts tab → list of acts
2. Tap act → detail screen with summary and key provisions
3. Link to official source (isap.sejm.gov.pl)

### Flow 4: Book Paid Service
1. Services tab → view pricing
2. Select tier → see included services
3. Tap "Zamów" → contact form
4. Confirmation screen

---

## Navigation Structure

```
Tab Bar (bottom):
├── 🏠 Główna       (index)
├── 📋 Kreator      (wizard)
├── ⚖️  Prawo        (legal)
├── 💼 Usługi       (services)
└── 👤 Profil       (profile)
```

---

## Component Design Principles

- **Cards**: Rounded corners (16px), subtle shadow, warm white background
- **Progress bar**: Horizontal, orange fill, step numbers below
- **Step items**: Large numbered circles (orange), title, description, status indicator
- **Legal act cards**: Icon (scale of justice), act name, date, short description
- **Pricing cards**: Highlighted "Polecany" tier in orange, feature list with checkmarks
- **Buttons**: Primary = orange fill, Secondary = outlined orange, Destructive = red

---

## Typography

- Headers: Bold, 24-28px
- Section titles: SemiBold, 18-20px
- Body: Regular, 15-16px, line-height 1.5
- Captions/labels: Regular, 12-13px, muted color
- Legal text: Regular, 14px, slightly muted

---

## iOS HIG Compliance

- Tab bar with SF Symbols (mapped to Material Icons for Android)
- Large title navigation headers on list screens
- Card-based layout with standard iOS spacing (16px margins)
- Haptic feedback on primary actions
- Native-feeling transitions
- Safe area handling via ScreenContainer
