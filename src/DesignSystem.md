# MeowUI Design System Documentation
### Shaadi.com Mobile-First Design System
**Last Updated:** February 15, 2026

---

## Overview

MeowUI is a mobile-first design system showcase for Shaadi.com, built with **Tailwind CSS v4**, **React**, and **Motion** (Framer Motion). The system is rendered inside a **375x812px phone-frame simulator** (`MobileWrapper`).

---

## 1. Foundations

### 1.1 Typography
- **Font Family:** Roboto
- **Weights:** Thin (100), Light (300), Normal (400), Medium (500), Bold (700)
- **Type Scale:** xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (32px)

### 1.2 Color System

#### Solid Palettes
Each palette has steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

| Palette | CSS Variable Prefix | Base Hex |
|---|---|---|
| Brand (Primary) | `--color-brand-*` | #0AA4B8 |
| Accent (Coral Red) | `--color-accent-palette-*` | #FF5A60 |
| Neutral (Secondary) | `--color-neutral-*` | Slate |
| Success (Emerald) | `--color-success-*` | #10B981 |
| Warning (Amber) | `--color-warning-*` | #F59E0B |

#### Gradients

| Name | Stops | Usage |
|---|---|---|
| **Connect (CTA)** | `linear-gradient(-6.59deg, #0AA4B8 13%, #09BF6C 86%)` | Green CTA button, always gradient (50% opacity when disabled, not gray) |
| **SIA (AI Brand)** | `linear-gradient(157.9deg, #FF5A60 5%, #CC7AFF 36%, #0094FF 78%, #00BCD5 120%)` | SIA chip borders, "Write with SIA" button |
| **SIA Logo V1** | `linear-gradient(135deg, #FF4596 0%, #9472FA 50%, #0DD2F5 100%)` | SIA flower/heart logo overlay |

---

## 2. UI Kit

### 2.1 Buttons
**Component:** `Button.tsx`
**Shape:** Pill-shaped (full rounded)

#### Variants
- `default` (Primary)
- `secondary`
- `outline`
- `ghost`
- `destructive`
- `link`

#### Sizes
| Size | Height | Label |
|---|---|---|
| `xs` | 20px | Extra Small |
| `sm` | 32px | Small |
| `md` | 36px | Medium |
| `default` | 40px | Default |
| `lg` | 48px | Large |
| `icon` | 40x40px | Icon Only |

#### States
- Default, Hover, Active, Disabled, Loading (spinner)

### 2.2 Chips
**Component:** `Chip.tsx`
**Shape:** Pill-shaped

#### Sizes
| Size | Height |
|---|---|
| Default (md) | 32px |
| Small (sm) | 28px |
| Extra Small (xs) | 20px |

#### States
- Unselected, Selected, With Icon

### 2.3 Select Chips
**Component:** `SelectChip.tsx` + `SelectChipShowcase.tsx`
Type 2 selection chips for multi-select use cases.

### 2.4 AI Chips (SIA)
Gradient-bordered chips for AI actions. Used in the compose card bottom row.

| Size | Height | Font Size |
|---|---|---|
| Default | 32px | 12px |
| Large | 36px | 13px |

**Structure:** Outer 1.5px border uses SIA gradient, inner fill is `background` color.
**Icon:** SIA Sparkle (13-14px) or AI Retry icon.

**Labels:**
- "Write with SIA" (empty state)
- "Try another" (has message)

**Disabled state:** `opacity: 0.4` + `pointer-events: none`

### 2.5 Circular Buttons

| Button | Source | Description |
|---|---|---|
| **WhatsApp** | `CircularButtons-8002-144.tsx` | Green gradient circular button with phone icon |
| **Call** | `CircularButtons-8002-323.tsx` | Teal gradient circular button with phone icon |

### 2.6 Cards
**Component:** `Card.tsx`
Base card container with border, rounded corners, shadow.

---

## 3. Inputs

### 3.1 Text Fields
**Component:** `FloatingLabelInput.tsx`
- Rounded 16px corners
- Floating label animation (lifts on focus/value)
- Types: email, password, text
- States: default, focused, disabled, error

### 3.2 Select Dropdown
**Component:** `FloatingLabelSelect.tsx`
- Floating label dropdown
- Animated open/close (Motion)
- Checkmark on selected option

### 3.3 Search Input
Standard `Input.tsx` with left icon (Search).

### 3.4 Compose Textarea
Multi-line message compose card used in the Connect Message bottom sheet.

**Specifications:**
- Container: `rounded-2xl` border, muted background
- Message area: `height: 140px`, `overflow: hidden`
- Font: 16px / 24px line-height / weight 400
- Placeholder: "Say something nice..."
- Bottom row: SIA action chip (gradient-bordered) aligned right
- Max chars: 700

---

## 4. Icons

### 4.1 System Icons
**Location:** `/src/app/components/icons/index.tsx`
All icons come in **Outline** and **Filled** variants. Default size: 24x24px (`w-6 h-6`).

| Icon | Export Names |
|---|---|
| Home | `HomeIcon`, `HomeFilledIcon` |
| Matches | `MatchesIcon`, `MatchesFilledIcon` |
| Inbox | `InboxIcon`, `InboxFilledIcon` |
| Chat | `ChatIcon`, `ChatFilledIcon` |
| Premium/Crown | `CrownIcon`, `CrownFilledIcon` |
| Camera | `CameraIcon`, `CameraFilledIcon` |
| Photo | `PhotoIcon`, `PhotoFilledIcon` |
| Tick/Check | `TickIcon`, `TickFilledIcon` |
| More (3 dots) | `MoreIcon`, `MoreFilledIcon` |
| Verification | `VerificationIcon`, `VerificationFilledIcon` |
| Menu/Hamburger | `HamburgerIcon`, `HamburgerFilledIcon` |
| Search | `SearchIcon`, `SearchFilledIcon` |
| Notification | `NotificationIcon`, `NotificationFilledIcon` |
| Filter | `FilterIcon`, `FilterFilledIcon` |
| Back Arrow | `BackArrowIcon`, `BackArrowFilledIcon` |
| Call/Phone | `CallIcon`, `CallFilledIcon` |
| WhatsApp | `WhatsAppIcon`, `WhatsAppFilledIcon` |
| Astro | `AstroIcon`, `AstroFilledIcon` |
| Navigation | `NavigationIcon`, `NavigationFilledIcon` |
| Users | `UsersFilledIcon` (filled only) |
| Globe | `GlobeFilledIcon` (filled only) |

### 4.2 SIA / AI Icons
**Location:** `/src/app/components/matches/ConnectMessageSheet.tsx` (exported)

| Icon | Export | Default Size | Description |
|---|---|---|---|
| SIA Sparkle | `SiaIcon` | 13px | Sparkle/edit icon for "Write with SIA" |
| AI Retry | `AiRetryIcon` | 13px | Circular arrow refresh icon for "Try another" |
| SIA Logo V1 | `SiaLogo` | 36px | Flower/heart shape with gradient + inner white sparkle |
| SIA Logo V2 | `SiaLogoV2` | 36px | Separated flower bg (static) + inner star (rotating at 2.4s) |
| SIA Logo V3 | `SiaLogoV3` | 36px | Shape rotates but gradient stays fixed — "gradient window" effect. Uses SVG clipPath + SMIL animateTransform |
| SIA Logo V4 | `SiaLogoV4` | 36px | Only flower shape rotates; gradient AND sparkle stay static — "static sparkle" effect. Same clipPath technique as V3 |

**SVG Sources:**
- `svg-5gq4uxh03u.ts` — SIA logo V1 paths (flower shape, inner sparkle, retry icon)
- `svg-4xjmmghtl6.ts` — Connect paths (sparkle, checkmark)
- `svg-unyd39tp2z.ts` — SIA logo V2 paths (separated flower bg + star)
- `svg-4b22t52yoi.ts` — SIA raw paths (flower bg + star, used for V3 clipPath)

---

## 5. Pictorials
**Location:** `/src/app/components/icons/pictorials.tsx`
**Showcase:** `PictorialsShowcase.tsx`

Colored icon pictograms using custom CSS variables for theming.

**Color Palette:**
| Color | CSS Variable | Light Hex |
|---|---|---|
| Orange | `--color-pictorial-orange` | #FBAC62 |
| Purple | `--color-pictorial-purple` | #9472FA |
| Green | `--color-pictorial-green` | #0ED279 |
| Gold | `--color-pictorial-gold` | #E8C33B |
| Pink | `--color-pictorial-pink` | #FF8888 |
| Blue | `--color-pictorial-blue` | #7EADF8 |

---

## 6. Animations / Micro-interactions

### 6.1 Typing Cursor
**Component:** `TypingCursor` (exported from `ConnectMessageSheet.tsx`)

| Property | Value |
|---|---|
| Width | 1.4px |
| Height | 16px |
| Color | `--color-brand-500` |
| Animation | Opacity pulse 0→1, 0.6s, infinite reverse |
| Border Radius | Full rounded |

### 6.2 SIA Generating State
**Component:** `SiaGeneratingState` (exported from `ConnectMessageSheet.tsx`)

Layout: `flex items-center gap-2.5`, top-left aligned. No skeleton bars.
Text: "SIA is writing your message..." (14px, weight 400, muted-foreground)

**Prop:** `animationType: 'full-rotate' | 'star-rotate'`

#### Animation A — Full Rotate
- Logo: SIA Logo V1 (20px)
- The entire logo rotates 360deg continuously
- Duration: 1.6s, linear, infinite

#### Animation B — Star Rotate
- Logo: SIA Logo V2 (20px)
- Flower background stays static
- Only the inner white star rotates 360deg
- Duration: 2.4s, linear, infinite

### 6.3 Logo Animations at Multiple Sizes
Available at: 20px, 28px, 36px, 48px

**Three variants:**
| Variant | Export | Behavior |
|---|---|---|
| V1 — Full Rotate | `SiaLogo` + `motion.div` | Entire logo rotates (shape + gradient + sparkle). 1.6s |
| V2 — Star Rotate | `SiaLogoV2` | Flower bg stays static, only inner star rotates. 2.4s |
| V3 — Gradient Window | `SiaLogoV3` | Shape + sparkle rotate, gradient stays fixed. 1.6s default (configurable via `duration` prop) |
| V4 — Static Sparkle | `SiaLogoV4` | Only shape rotates; gradient AND sparkle stay fixed. 1.6s default (configurable via `duration` prop) |

---

## 7. Screens

### 7.1 Profile Card
**Component:** `ProfileCardScreen.tsx` -> `ProfileCard.tsx`
Full match profile card with:
- Photo carousel
- Name, age, location, badges
- Community, profession, income
- Connect CTA (variant-dependent)
- Inline message preview (post-connect)
- WhatsApp/Call circular buttons

### 7.2 Registration & Onboarding
**Components:** `OnboardingScreen.tsx` -> `ProfileForScreen.tsx` -> `RegistrationFlow.tsx`
Multi-step sign-up flow:
1. Onboarding splash
2. Profile For selection (self/family)
3. Registration form (name, DOB, religion, etc.)

### 7.3 Connect Message Sheet
**Component:** `ConnectMessageScreen.tsx` -> `ConnectMessageSheet.tsx`
Bottom sheet for composing personalized connect messages with SIA.

**Features:**
- 64px avatar, centered title + optional subtitle
- Compose card: fixed 140px height, overflow hidden
- SIA generation: rotating logo + "SIA is writing..." text
- Word-by-word typing animation with blinking cursor
- Message history navigation (swipe or arrows)
- SIA gradient-bordered action chip (Write with SIA / Try another)
- 48px green gradient CTA (always gradient, 50% opacity when disabled)
- Variant `1.2b`: checkbox footer ("Use for future connects")
- Variant `3`: passive footer text
- Stats row: character count + AI credits (togglable)

**Props:**
| Prop | Type | Description |
|---|---|---|
| `variant` | `'1.2b' \| '3'` | Controls footer type |
| `showStats` | `boolean` | Shows nav arrows, char count, AI credits |
| `showSubtitle` | `boolean` | Shows subtitle under title |
| `siaAnimation` | `'full-rotate' \| 'star-rotate'` | Animation variant for generating state |

---

## 8. Components Reference

### Core Components

| Component | File | Description |
|---|---|---|
| `MobileWrapper` | `MobileWrapper.tsx` | 375x812px phone frame simulator |
| `Button` | `Button.tsx` | Pill-shaped button with variants/sizes |
| `Chip` | `Chip.tsx` | Compact selection/attribute element |
| `SelectChip` | `SelectChip.tsx` | Type 2 multi-select chips |
| `Input` | `Input.tsx` | Base text input |
| `FloatingLabelInput` | `FloatingLabelInput.tsx` | Input with animated floating label |
| `FloatingLabelSelect` | `FloatingLabelSelect.tsx` | Dropdown with animated floating label |
| `Card` | `Card.tsx` | Base card container |
| `FilterBar` | `FilterBar.tsx` | Horizontal scrollable chip filter bar + settings |

### Matches Components

| Component | File | Description |
|---|---|---|
| `ProfileCard` | `matches/ProfileCard.tsx` | Full match profile card |
| `MatchesView` | `matches/MatchesView.tsx` | Scrollable profile card grid |
| `ConnectMessageSheet` | `matches/ConnectMessageSheet.tsx` | SIA compose bottom sheet |

### Figma Imports

| Import | File | Description |
|---|---|---|
| WhatsApp Button | `CircularButtons-8002-144.tsx` | Green gradient circular action |
| Call Button | `CircularButtons-8002-323.tsx` | Teal gradient circular action |
| Shaadi Logo | `ShaadiLogo.tsx` | Brand logo |

---

## 9. Data & Types

### Types
| Type | File | Description |
|---|---|---|
| `Profile` | `types/profile.ts` + `matches/ProfileCard.tsx` | Match profile data shape |
| `User` | `types/user.ts` | Current user data shape |
| `SolutionVariant` | `matches/ConnectMessageSheet.tsx` | `'1.2b' \| '3'` |
| `SiaAnimationType` | `matches/ConnectMessageSheet.tsx` | `'full-rotate' \| 'star-rotate'` |

### Mock Data
| Data | File | Description |
|---|---|---|
| `CURRENT_USER` | `data/currentUser.ts` | Logged-in user (Pratik Aher) |
| `MOCK_PROFILES` | `data/mockProfiles.ts` | 10+ match profiles with photos |
| `findingMatchesLottie` | `data/findingMatchesLottie.ts` | Lottie animation JSON |

### Utilities
| Utility | File | Description |
|---|---|---|
| `cn()` | `utils/cn.ts` | Tailwind class merge (clsx + twMerge) |
| `replaceNameInMessage()` | `matches/ConnectMessageSheet.tsx` | Swaps first name in saved message for each profile |

---

## 10. Theme & Styles

| File | Purpose |
|---|---|
| `styles/theme.css` | Design tokens, color variables, defaults |
| `styles/fonts.css` | Font imports (Roboto) |
| `styles/index.css` | Base styles |
| `styles/tailwind.css` | Tailwind v4 config |

---

*This document will be updated as new components, icons, and screens are added to the system.*