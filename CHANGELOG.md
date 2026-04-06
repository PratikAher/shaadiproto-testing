# MeowUI Design System - Comprehensive Component & Token Reference

> **Purpose:** This document is a complete, LLM-readable specification of the MeowUI design system.
> Another AI (e.g., Cursor) should be able to read this file and recreate every component in native
> Android (Kotlin / Jetpack Compose) and iOS (Swift / SwiftUI) with pixel-perfect fidelity.
>
> **Source of truth:** All values below are extracted directly from the web codebase (`/src/`).

---

## Table of Contents

1. [Foundations](#1-foundations)
   - 1.1 Typography
   - 1.2 Color System
   - 1.3 Spacing & Layout
   - 1.4 Border Radius
   - 1.5 Shadows & Elevation
   - 1.6 Utility: `cn()` class merger
2. [UI Kit](#2-ui-kit)
   - 2.1 Button
   - 2.2 Card
   - 2.3 Chip
   - 2.4 SelectChip
   - 2.5 FilterBar
3. [Inputs](#3-inputs)
   - 3.1 Input (Base)
   - 3.2 FloatingLabelInput
   - 3.3 FloatingLabelSelect
4. [Pictorials](#4-pictorials)
5. [Icons (System SVG Icons)](#5-icons-system-svg-icons)
6. [Data: Current User](#6-data-current-user)

---

# 1. Foundations

## 1.1 Typography

### Font Family

- **Primary font:** `Roboto`
- **Fallback stack:** `system-ui, sans-serif`
- **Google Fonts import:** `https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap`
- **CSS variable:** `--font-sans: 'Roboto', system-ui, sans-serif;`

### Font Weights Used

| Weight Value | CSS Name    | Usage Context                                          |
|-------------|-------------|--------------------------------------------------------|
| 100         | Thin        | Rarely used                                            |
| 300         | Light       | Subheaders, helper text (e.g. "Add photos later")      |
| 400         | Regular     | Body text, muted/secondary text, input values          |
| 500         | Medium      | Section headings, selected chip text, buttons           |
| 600         | SemiBold    | Skip links, section headers in cards, preference rows  |
| 700         | Bold        | Page titles, step headings, card titles                 |

### Font Sizes Used in Screens (inline styles, NOT Tailwind classes)

| Size (px) | Weight | Usage Examples                                                       |
|-----------|--------|----------------------------------------------------------------------|
| 9         | mono   | Pictorial showcase color name sub-label                              |
| 10        | 500    | Pictorial showcase icon name, XS chip                                |
| 11        | 400    | Preference row label text                                            |
| 12        | 300    | "Add photos later", photo subtitle                                   |
| 12        | 400    | Helper text, character count, checkbox label text                    |
| 12        | 500    | "Why is income required?" link, "Tap on field to edit"               |
| 13        | 400    | Subtitles, "Verified Profiles get better Matches"                    |
| 13        | 500    | Hobby section "+ More" toggle                                        |
| 14        | 400    | Input text, textarea text, "Finding Matches" text, dropdown options  |
| 14        | 500    | Preference row value text                                            |
| 14        | 600    | "Skip" button text, "Edit" link                                     |
| 15        | 500    | "Date of birth" label, field group headers                           |
| 15        | 600    | Card section headers (e.g. "Creative", "Basic Details")              |
| 18        | 700    | Step headings (steps 0-5, 8-12)                                      |
| 20        | 500    | Step headings (steps 6, 7: "Add Photos", "About yourself")          |

### Tailwind Text Classes (from theme override)

```
--text-3xl: 2rem (32px), line-height: 2.5rem (40px)
```

> **IMPORTANT RULE:** The codebase uses inline `style={{ fontSize: 'XXpx', fontWeight: NNN }}`
> for all screen-level typography. Tailwind font-size classes like `text-2xl`, `text-lg` etc.
> are only used inside reusable components (Button, Card). When building native equivalents,
> use the exact pixel values from the table above, not abstract size tokens.

### Tailwind Text Classes Used in Components

| Tailwind Class | Actual Value | Used In                    |
|---------------|-------------|----------------------------|
| `text-lg`     | 18px        | Button (default, lg sizes) |
| `text-base`   | 16px        | Button (md size)           |
| `text-sm`     | 14px        | Button (sm), Input, Card   |
| `text-xs`     | 12px        | Chip (sm), SelectChip (sm) |
| `text-2xl`    | 24px        | CardTitle                  |

---

## 1.2 Color System

### Brand Palette (Cyan) - Primary

| Token             | Hex       | Usage                                      |
|-------------------|-----------|---------------------------------------------|
| `brand-50`        | `#effcfd` | Very light tint                             |
| `brand-100`       | `#d6f6fa` | Light tint                                  |
| `brand-200`       | `#b3edf6` | Lighter shade                               |
| `brand-300`       | `#7edce9` | Light accent                                |
| `brand-400`       | `#42c3d6` | Medium shade, dark mode ring                |
| `brand-500`       | `#0AA4B8` | **PRIMARY BASE** - buttons, links, focus rings |
| `brand-600`       | `#08849b` | Hover states                                |
| `brand-700`       | `#0e6a7d` | Pressed states                              |
| `brand-800`       | `#135565` | Deep shade                                  |
| `brand-900`       | `#154755` | Very deep                                   |
| `brand-950`       | `#072f3a` | Darkest                                     |

### Accent Palette (Coral Red)

| Token                 | Hex       | Usage                                          |
|-----------------------|-----------|-------------------------------------------------|
| `accent-palette-50`   | `#fff0f1` | Very light tint                                |
| `accent-palette-100`  | `#ffe3e5` | Light tint                                     |
| `accent-palette-200`  | `#ffcbd0` | Lighter shade                                  |
| `accent-palette-300`  | `#ff9aa2` | Light accent                                   |
| `accent-palette-400`  | `#ff6870` | Medium shade                                   |
| `accent-palette-500`  | `#FF5A60` | **ACCENT BASE** - destructive, CTA buttons     |
| `accent-palette-600`  | `#e83641` | Hover states                                   |
| `accent-palette-700`  | `#c21b27` | Pressed states                                 |
| `accent-palette-800`  | `#a01923` | Deep shade                                     |
| `accent-palette-900`  | `#851922` | Dark mode destructive                          |
| `accent-palette-950`  | `#4a060c` | Darkest                                        |

### Success Palette (Emerald)

| Token           | Hex       |
|-----------------|-----------|
| `success-50`    | `#ecfdf5` |
| `success-100`   | `#d1fae5` |
| `success-200`   | `#a7f3d0` |
| `success-300`   | `#6ee7b7` |
| `success-400`   | `#34d399` |
| `success-500`   | `#10b981` |
| `success-600`   | `#059669` |
| `success-700`   | `#047857` |
| `success-800`   | `#065f46` |
| `success-900`   | `#064e3b` |
| `success-950`   | `#022c22` |

### Warning Palette (Amber)

| Token           | Hex       |
|-----------------|-----------|
| `warning-50`    | `#fffbeb` |
| `warning-100`   | `#fef3c7` |
| `warning-200`   | `#fde68a` |
| `warning-300`   | `#fcd34d` |
| `warning-400`   | `#fbbf24` |
| `warning-500`   | `#f59e0b` |
| `warning-600`   | `#d97706` |
| `warning-700`   | `#b45309` |
| `warning-800`   | `#92400e` |
| `warning-900`   | `#78350f` |
| `warning-950`   | `#451a03` |

### Neutral Palette (Zinc)

| Token           | Hex       | Usage                                         |
|-----------------|-----------|------------------------------------------------|
| `neutral-50`    | `#fafafa` | Checkbox background container, light bg        |
| `neutral-100`   | `#f4f4f5` | Secondary bg, muted bg, disabled button bg     |
| `neutral-200`   | `#e4e4e7` | Border, input border                           |
| `neutral-300`   | `#d4d4d8` | Unchecked checkbox border                      |
| `neutral-400`   | `#a1a1aa` | Muted foreground (dark mode), disabled text    |
| `neutral-500`   | `#71717a` | Muted foreground (light mode)                  |
| `neutral-600`   | `#52525b` | Secondary text                                 |
| `neutral-700`   | `#3f3f46` | Deep text                                      |
| `neutral-800`   | `#27272a` | Phone frame border, dark mode surfaces         |
| `neutral-900`   | `#18181b` | Secondary foreground, dark mode card           |
| `neutral-950`   | `#09090b` | Foreground text (light mode)                   |

### Semantic Tokens (Light Mode)

| Token                    | Resolved Value             | Hex         |
|--------------------------|----------------------------|-------------|
| `background`             | `#ffffff`                  | `#ffffff`   |
| `foreground`             | `neutral-950`              | `#09090b`   |
| `card`                   | `#ffffff`                  | `#ffffff`   |
| `card-foreground`        | `neutral-950`              | `#09090b`   |
| `popover`                | `#ffffff`                  | `#ffffff`   |
| `popover-foreground`     | `neutral-950`              | `#09090b`   |
| `primary`                | `brand-500`                | `#0AA4B8`   |
| `primary-foreground`     | `#ffffff`                  | `#ffffff`   |
| `secondary`              | `neutral-100`              | `#f4f4f5`   |
| `secondary-foreground`   | `neutral-900`              | `#18181b`   |
| `muted`                  | `neutral-100`              | `#f4f4f5`   |
| `muted-foreground`       | `neutral-500`              | `#71717a`   |
| `accent`                 | `neutral-100`              | `#f4f4f5`   |
| `accent-foreground`      | `neutral-900`              | `#18181b`   |
| `destructive`            | `accent-palette-500`       | `#FF5A60`   |
| `destructive-foreground` | `#ffffff`                  | `#ffffff`   |
| `success`                | `success-500`              | `#10b981`   |
| `success-foreground`     | `#ffffff`                  | `#ffffff`   |
| `warning`                | `warning-500`              | `#f59e0b`   |
| `warning-foreground`     | `#ffffff`                  | `#ffffff`   |
| `border`                 | `neutral-200`              | `#e4e4e7`   |
| `input`                  | `neutral-200`              | `#e4e4e7`   |
| `ring`                   | `brand-500`                | `#0AA4B8`   |

### Semantic Tokens (Dark Mode)

| Token                    | Resolved Value             | Hex         |
|--------------------------|----------------------------|-------------|
| `background`             | `neutral-950`              | `#09090b`   |
| `foreground`             | `neutral-50`               | `#fafafa`   |
| `card`                   | `neutral-900`              | `#18181b`   |
| `card-foreground`        | `neutral-50`               | `#fafafa`   |
| `popover`                | `neutral-900`              | `#18181b`   |
| `popover-foreground`     | `neutral-50`               | `#fafafa`   |
| `primary`                | `brand-500`                | `#0AA4B8`   |
| `primary-foreground`     | `#ffffff`                  | `#ffffff`   |
| `secondary`              | `neutral-800`              | `#27272a`   |
| `secondary-foreground`   | `neutral-50`               | `#fafafa`   |
| `muted`                  | `neutral-800`              | `#27272a`   |
| `muted-foreground`       | `neutral-400`              | `#a1a1aa`   |
| `accent`                 | `neutral-800`              | `#27272a`   |
| `accent-foreground`      | `neutral-50`               | `#fafafa`   |
| `destructive`            | `accent-palette-900`       | `#851922`   |
| `destructive-foreground` | `#fef2f2`                  | `#fef2f2`   |
| `success`                | `success-600`              | `#059669`   |
| `success-foreground`     | `#ffffff`                  | `#ffffff`   |
| `warning`                | `warning-600`              | `#d97706`   |
| `warning-foreground`     | `#ffffff`                  | `#ffffff`   |
| `border`                 | `neutral-800`              | `#27272a`   |
| `input`                  | `neutral-800`              | `#27272a`   |
| `ring`                   | `brand-400`                | `#42c3d6`   |

### Special-Purpose Colors (used inline, not via tokens)

| Color     | Hex       | Context                                           |
|-----------|-----------|---------------------------------------------------|
| Coral CTA | `#FF5A60` | "Confirm & Continue", "Take a Selfie" button bg   |
| Teal      | `#26D0CE` | ProfileCard gradient accent                        |
| Teal alt  | `#0AA4B8` | Primary, user avatar circle bg, checkbox checked   |

---

## 1.3 Spacing & Layout

### Global Spacing Scale (Tailwind defaults, in use)

| Class   | Value  | Pixels |
|---------|--------|--------|
| `gap-1` | 0.25rem| 4px    |
| `gap-1.5`| 0.375rem| 6px  |
| `gap-2` | 0.5rem | 8px    |
| `gap-2.5`| 0.625rem| 10px |
| `gap-3` | 0.75rem| 12px   |
| `gap-4` | 1rem   | 16px   |
| `gap-5` | 1.25rem| 20px   |
| `gap-6` | 1.5rem | 24px   |
| `gap-8` | 2rem   | 32px   |
| `p-4`   | 1rem   | 16px   |
| `p-5`   | 1.25rem| 20px   |
| `p-6`   | 1.5rem | 24px   |
| `px-4`  | 1rem   | 16px   |
| `px-5`  | 1.25rem| 20px   |
| `px-6`  | 1.5rem | 24px   |

### Page-Level Layout Pattern

- Content padding: `px-6` (24px horizontal), `pt-2` (8px top), `pb-6` (24px bottom)
- Header padding: `pt-4 px-4` (16px top, 16px horizontal)
- Section spacing: `space-y-5` (20px) between form fields
- Bottom CTA padding: `pt-4` (16px) above continue button

### MobileWrapper Dimensions

- **Mobile:** Full viewport (`fixed inset-0`, `w-full h-full`)
- **Desktop:** `375px` wide x `812px` tall (iPhone X aspect), max `90vh`
- **Frame border:** `8px` solid `neutral-800` (`#27272a`)
- **Frame border radius:** `3rem` (48px) - simulated rounded phone corners
- **Shadow:** `shadow-2xl` (Tailwind's largest preset shadow)

---

## 1.4 Border Radius

| Token / Class       | Value   | Pixels | Usage                                      |
|---------------------|---------|--------|---------------------------------------------|
| `--radius-lg`       | 1.5rem  | 24px   | Cards, large containers                     |
| `--radius-md`       | 0.75rem | 12px   | Medium elements                             |
| `--radius-sm`       | 0.5rem  | 8px    | Small elements                              |
| `rounded-full`      | 9999px  | pill   | Buttons (default shape), chips, avatars      |
| `rounded-[16px]`    | 16px    | 16px   | All input fields (Input, FloatingLabel*)     |
| `rounded-2xl`       | 1rem    | 16px   | Checkbox containers, preference cards        |
| `rounded-3xl`       | 1.5rem  | 24px   | Showcase cards                               |
| `rounded-xl`        | 0.75rem | 12px   | Dropdown menu, OTP boxes                     |
| `rounded-lg`        | 24px    | 24px   | Card component (from --radius-lg)            |
| `rounded-md`        | 12px    | 12px   | Button square shape variant                  |
| `rounded-[3rem]`    | 48px    | 48px   | MobileWrapper phone frame                    |

---

## 1.5 Shadows & Elevation

| Class          | CSS Value                                              | Usage              |
|----------------|--------------------------------------------------------|---------------------|
| `shadow-sm`    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                       | Buttons, cards      |
| `shadow-lg`    | `0 10px 15px -3px rgb(0 0 0/0.1), 0 4px 6px -4px ...` | Dropdown menus      |
| `shadow-2xl`   | `0 25px 50px -12px rgb(0 0 0 / 0.25)`                 | MobileWrapper frame |

---

## 1.6 Utility: `cn()` Class Merger

```
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

**Native equivalent:** Create a utility that merges style objects, where later values override earlier ones. In Android (Compose), use `Modifier.then()`. In iOS (SwiftUI), use `.modifier()` chains. The key behavior is: base styles are defined, and `className` overrides can selectively replace specific properties.

---

# 2. UI Kit

## 2.1 Button

**Source:** `/src/app/components/Button.tsx`

### Architecture

Uses `class-variance-authority` (CVA) for variant-driven styling. The button is a `forwardRef` component wrapping a native `<button>`.

### Props

| Prop      | Type                                                           | Default     | Description                        |
|-----------|----------------------------------------------------------------|-------------|------------------------------------|
| `variant` | `'default'` \| `'destructive'` \| `'outline'` \| `'secondary'` \| `'ghost'` \| `'link'` | `'default'` | Visual style variant |
| `size`    | `'lg'` \| `'default'` \| `'md'` \| `'sm'` \| `'icon'` \| `'icon-sm'` \| `'icon-md'` \| `'icon-lg'` | `'default'` | Height & padding |
| `shape`   | `'pill'` \| `'square'`                                        | `'pill'`    | Border radius style                |
| `loading` | `boolean`                                                      | `false`     | Shows spinner, disables button     |
| `asChild` | `boolean`                                                      | `false`     | Render as child element (slot)     |

### Base Styles (all variants share these)

```
- Display: inline-flex, items center, justify center
- Font weight: medium (500)
- Transition: colors
- Focus: outline none, ring-2 ring-[brand-500] ring-offset-2
- Disabled: opacity 50%, pointer-events none
```

### Variant Styles

| Variant       | Background                  | Text                        | Border                | Extra               |
|---------------|-----------------------------|-----------------------------|------------------------|----------------------|
| `default`     | `primary` (#0AA4B8)         | `primary-foreground` (white)| none                  | shadow-sm            |
| `destructive` | `destructive` (#FF5A60)     | white                       | none                  | shadow-sm            |
| `outline`     | `background` (white)        | foreground -> accent on hover| `border-input`        | hover: accent bg     |
| `secondary`   | `secondary` (#f4f4f5)       | `secondary-foreground`      | none                  | hover: 80% opacity   |
| `ghost`       | transparent                 | foreground                  | none                  | hover: accent bg     |
| `link`        | transparent                 | `primary` (#0AA4B8)         | none                  | underline on hover   |

### Size Styles

| Size       | Height | Horizontal Padding | Font Size   | Notes                        |
|------------|--------|--------------------|-------------|-------------------------------|
| `lg`       | 48px   | 24px               | 18px (lg)   | Primary CTAs                  |
| `default`  | 44px   | 22px               | 18px (lg)   | Standard actions              |
| `md`       | 40px   | 20px               | 16px (base) | Medium actions                |
| `sm`       | 36px   | 18px               | 14px (sm)   | Secondary / compact actions   |
| `icon`     | 44x44  | 0                  | -           | Square icon button            |
| `icon-sm`  | 36x36  | 0                  | -           | Small icon button             |
| `icon-md`  | 40x40  | 0                  | -           | Medium icon button            |
| `icon-lg`  | 48x48  | 0                  | -           | Large icon button             |

### Shape Styles

| Shape    | Border Radius         |
|----------|-----------------------|
| `pill`   | `rounded-full` (9999px) - **DEFAULT** |
| `square` | `rounded-md` (12px)   |

### Loading State

When `loading=true`:
- Button is disabled
- A spinning `Loader2` icon (from lucide-react) appears left of the text with `mr-2` spacing
- Icon size: `h-4 w-4` (16x16px)
- Animation: `animate-spin` (360deg rotation, 1s linear infinite)

### Contextual Overrides Used in Screens

| Context                     | Override Applied                                           |
|-----------------------------|-------------------------------------------------------------|
| Coral CTA buttons           | `className="bg-[#FF5A60] hover:bg-[#FF5A60]/90 border-0 shadow-none"` |
| Disabled/invalid continue   | `className="bg-neutral-100 text-neutral-400 border-0 shadow-none"` with `opacity: 1` |
| Back button (ghost + icon)  | `variant="ghost" size="icon" shape="pill"` with `-ml-1`    |

---

## 2.2 Card

**Source:** `/src/app/components/Card.tsx`

### Sub-components

| Component         | Base Styles                                                    |
|-------------------|----------------------------------------------------------------|
| `Card`            | `rounded-lg border bg-card text-card-foreground shadow-sm`     |
| `CardHeader`      | `flex flex-col space-y-1.5 p-6` (24px padding, 6px vertical gap) |
| `CardTitle`       | `text-2xl font-semibold leading-none tracking-tight` (24px)   |
| `CardDescription` | `text-sm text-muted-foreground` (14px, gray)                  |
| `CardContent`     | `p-6 pt-0` (24px sides/bottom, 0 top)                         |
| `CardFooter`      | `flex items-center p-6 pt-0`                                  |

All sub-components accept `className` override via `cn()` merge and use `forwardRef`.

**Native equivalent:** Create a composable Card container with optional Header, Content, Footer sections. The card has:
- Background: system card color (white in light mode)
- Border: 1px solid border color (#e4e4e7)
- Corner radius: 24px (--radius-lg)
- Shadow: subtle drop shadow

---

## 2.3 Chip

**Source:** `/src/app/components/Chip.tsx`

### Purpose
Toggleable tag/filter element. Used in FilterBar, hobby selection, and category browsing.

### Props

| Prop        | Type               | Default  | Description                              |
|-------------|--------------------|---------|--------------------------------------------|
| `label`     | `string`           | required | Display text                              |
| `selected`  | `boolean`          | `false`  | Visual selected state                     |
| `size`      | `'xs'` \| `'sm'` \| `'md'` | `'md'` | Height and text size                     |
| `iconLeft`  | `ReactNode`        | -        | Optional left icon (e.g. emoji)           |
| `iconRight` | `ReactNode`        | -        | Optional right icon                       |
| `onClick`   | `() => void`       | -        | Tap handler                               |

### Size Specifications

| Size | Height | Font Size | Horizontal Padding | Icon Gap |
|------|--------|-----------|--------------------|----------|
| `xs` | 20px   | 10px      | 8px                | 4px      |
| `sm` | 28px   | 12px      | 12px               | 6px      |
| `md` | 32px   | 14px      | 16px               | 8px      |

### State Styles

| State        | Border Color     | Background          | Text Color       | Font Weight |
|-------------|------------------|---------------------|------------------|-------------|
| Unselected   | `border` (#e4e4e7)| `background` (white) | `foreground`     | normal (400)|
| Selected     | `primary` (#0AA4B8)| `primary/10` (10% opacity cyan) | `primary` (#0AA4B8) | medium (500) |
| Hover (unsel)| unchanged        | `muted` (#f4f4f5)   | unchanged        | unchanged   |
| Hover (sel)  | unchanged        | `primary/20`        | unchanged        | unchanged   |

### Shape
- Always `rounded-full` (pill shape)
- Border width: 1px
- `cursor-pointer`, `select-none`, `whitespace-nowrap`

---

## 2.4 SelectChip

**Source:** `/src/app/components/SelectChip.tsx`

### Purpose
Selection chip with a built-in circular check indicator on the left side. Used in onboarding flows (e.g., "Profile created for: Myself / My Son / My Daughter").

### Props

| Prop        | Type               | Default  | Description                          |
|-------------|--------------------|---------|-----------------------------------------|
| `label`     | `string`           | required | Display text                            |
| `selected`  | `boolean`          | `false`  | Whether chip is checked                 |
| `size`      | `'sm'` \| `'md'`  | `'md'`  | Height variant                           |
| `onClick`   | `() => void`       | -        | Tap handler                             |

### Size Specifications

| Size | Height | Font Size | Horizontal Padding | Check Indicator Size |
|------|--------|-----------|--------------------|----------------------|
| `sm` | 32px   | 12px      | 12px               | 16x16px              |
| `md` | 36px   | 14px      | 16px               | 18x18px              |

### Check Indicator (Left Side)

The left indicator is a circle that acts as a radio/check:

| State       | Border                           | Background           | Inner Icon         |
|-------------|----------------------------------|----------------------|---------------------|
| Unselected  | 2px solid `muted-foreground/40`  | transparent          | none                |
| Selected    | 2px solid `primary` (#0AA4B8)    | `primary` (#0AA4B8)  | White checkmark SVG |

**Checkmark SVG** (inside the circle):
```
viewBox="0 0 12 12"
path d="M2.5 6L5 8.5L9.5 3.5"
stroke="white", strokeWidth=2, strokeLinecap="round", strokeLinejoin="round"
Size: 10x10px (sm) or 12x12px (md)
```

### State Styles

Same border/background/text rules as Chip (selected vs unselected), plus the check indicator.

---

## 2.5 FilterBar

**Source:** `/src/app/components/FilterBar.tsx`

### Purpose
Horizontally scrollable chip bar that sticks to the top of a scrollable view. Optionally shows a filter icon button on the left with a gradient fade mask.

### Layout

```
[FilterIcon + gradient mask (optional)] [--- Scrollable Chips ---]
```

- Container: `sticky top-0 z-40 bg-background w-full`
- Inner: `flex items-center gap-2 overflow-x-auto scrollbar-hide px-4`
- When icon shown: chips get `pl-[60px]` left padding to clear the fixed filter button
- Bottom padding: `pb-2` (8px breathing room below)
- Top padding: `pt-0` (chips touch the header edge)

### Filter Icon Button

- Size: 32x32px (`h-8 w-8`)
- Shape: `rounded-full` (circle)
- Border: `1px solid border` (#e4e4e7)
- Background: `background` (white)
- Hover: `muted` (#f4f4f5)
- Icon: `FilterIcon` at 16x16px (`w-4 h-4`), colored `foreground`
- Position: `absolute left-0 top-0` with `pl-4` (16px left margin)
- Gradient mask: `bg-gradient-to-r from-background from-90% to-transparent` (fades content behind)

### Chip Selection

- One chip selected at a time (radio behavior)
- Uses the `Chip` component with `selected` prop
- Default: first chip selected
- External control via `selectedId` + `onSelect` props, or internal state

---


# 3. Inputs

## 3.1 Input (Base)

**Source:** `/src/app/components/Input.tsx`

### Specs

| Property          | Value                                    |
|-------------------|------------------------------------------|
| Height            | 48px (`h-12`)                            |
| Border radius     | 16px (`rounded-[16px]`)                  |
| Border            | 1px solid `input` (#e4e4e7)              |
| Background        | transparent                               |
| Horizontal padding| 20px (`px-5`)                             |
| Vertical padding  | 8px (`py-2`)                             |
| Font size         | 14px (`text-sm`)                         |
| Text color        | foreground                               |
| Placeholder color | `muted-foreground` (#71717a)             |
| Focus ring        | 2px solid `ring` (#0AA4B8), 2px offset   |
| Disabled          | `cursor-not-allowed`, `opacity-50`       |
| Transition        | `transition-all`                          |

---

## 3.2 FloatingLabelInput

**Source:** `/src/app/components/FloatingLabelInput.tsx`

### Purpose
Text input with a floating label that starts inside the field and animates to the top border on focus or when filled.

### Props

| Prop    | Type     | Required | Description           |
|---------|----------|----------|-----------------------|
| `label` | `string` | yes      | The floating label text |
| All other HTML input attributes are passed through.

### Dimensions (same as Input base)

| Property          | Value           |
|-------------------|-----------------|
| Height            | 48px (`h-12`)   |
| Border radius     | 16px            |
| Border            | 1px solid input |
| Horizontal padding| 20px (`px-5`)   |
| Font size         | 14px            |

### Label Animation States

| State                    | Label Position                        | Label Scale | Label Color          | Label Background |
|--------------------------|---------------------------------------|-------------|----------------------|------------------|
| Empty + unfocused        | Centered vertically inside field      | 100%        | `muted-foreground`   | none             |
| Focused OR has value     | Top border (overlapping the border)   | 90%         | `primary` (focused)  | `background`     |

**Label positioning details:**
- Resting: `left: 20px`, `top: 50%`, `translateY: -50%`
- Floating: `left: 14px`, `top: 0`, `translateY: -50%`, `scale: 0.9`, `px: 8px`, `bg: background`
- Transition: `duration-200` (200ms ease)

### Implementation Mechanism
Uses CSS peer selectors:
- `peer-focus:` for focus state
- `peer-[:not(:placeholder-shown)]:` for filled state
- The `placeholder` is set to the label text but rendered `text-transparent` so it's invisible but triggers the `:not(:placeholder-shown)` selector when the field has a value.

---

## 3.3 FloatingLabelSelect

**Source:** `/src/app/components/FloatingLabelSelect.tsx`

### Purpose
Custom dropdown select with the same floating label pattern as FloatingLabelInput. Opens an animated dropdown list on tap.

### Props

| Prop        | Type       | Required | Description                        |
|-------------|------------|----------|------------------------------------|
| `label`     | `string`   | yes      | Floating label text                |
| `value`     | `string`   | yes      | Currently selected value           |
| `options`   | `string[]` | yes      | Array of option strings            |
| `onChange`  | `(val: string) => void` | yes | Selection callback       |
| `required`  | `boolean`  | no       | Appends " *" to label              |
| `className` | `string`   | no       | Additional container classes       |

### Trigger Button Specs

| Property          | Value                          |
|-------------------|--------------------------------|
| Height            | 48px (`h-12`)                  |
| Border radius     | 16px (`rounded-[16px]`)       |
| Border            | 1px solid `input` (#e4e4e7)   |
| Horizontal padding| 20px (`px-5`)                  |
| Font size         | 14px                           |
| Chevron icon      | `ChevronDown` from lucide, 16x16px, `muted-foreground` color |
| Open state ring   | 2px solid `ring` (#0AA4B8), 2px offset |

### Chevron Animation

- Closed: rotation 0deg
- Open: rotation 180deg
- Transition: `duration-200`

### Floating Label (same pattern as FloatingLabelInput)

| State                  | Position & Style                          |
|------------------------|-------------------------------------------|
| No value + closed      | Centered inside, `muted-foreground`, 100% |
| Has value OR open      | Top border, 90% scale, `bg-background`    |
| Open                   | Top border + `text-primary` color         |

### Dropdown Menu

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Position          | Below trigger, `top: 100%`, full width    |
| Margin top        | 6px (`mt-1.5`)                            |
| Background        | `popover` (white)                         |
| Border            | 1px solid default border                  |
| Border radius     | 12px (`rounded-xl`)                       |
| Shadow            | `shadow-lg`                               |
| Max height        | 192px (`max-h-48`)                        |
| Overflow          | `overflow-y-auto scrollbar-hide`          |
| Z-index           | 50                                        |
| Transform origin  | top                                       |

### Dropdown Animation (Motion/Framer)

```
initial:  { opacity: 0, y: -4, scaleY: 0.96 }
animate:  { opacity: 1, y: 0,  scaleY: 1 }
exit:     { opacity: 0, y: -4, scaleY: 0.96 }
duration: 150ms
```

### Option Item Styles

| Property            | Value                              |
|---------------------|------------------------------------|
| Padding             | 10px vertical, 16px horizontal     |
| Font size           | 14px (`text-sm`)                   |
| Text (unselected)   | `foreground`                       |
| Text (selected)     | `primary` (#0AA4B8), font-medium   |
| Hover background    | `accent/50` (semi-transparent gray)|
| Check icon (selected)| `Check` lucide icon, 16x16px, `primary` color |
| Layout              | `flex justify-between items-center`|

### Click-Outside Behavior

Uses a `useRef` + `useEffect` with `document.addEventListener('mousedown', ...)` to close the dropdown when clicking outside the component.

---

# 4. Pictorials

**Source:** `/src/app/components/icons/pictorials.tsx`
**SVG path data:** `/src/imports/svg-gc4b28hb5s.ts`

### Purpose
Colorful illustrative icons used in section headers and visual hierarchy. Each pictorial has a single fixed fill color (not stroke-based like system icons). They are **NOT** theme-responsive - they always use their assigned color.

### Color Palette

| Color Name | Hex       | CSS Key  |
|------------|-----------|----------|
| Orange     | `#FBAC62` | `orange` |
| Purple     | `#9472FA` | `purple` |
| Green      | `#0ED279` | `green`  |
| Gold       | `#E8C33B` | `gold`   |
| Pink       | `#FF8888` | `pink`   |
| Blue       | `#7EADF8` | `blue`   |

### Component Interface

```typescript
interface PictorialIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;  // Default: 36
}
```

Every pictorial renders as an inline SVG with:
- `viewBox="0 0 36 36"` (except PictoNotification which uses `"0 0 32 32"`)
- `fill="none"` on the SVG element
- Individual `<path>` elements with `fill={COLOR}` (solid fill, no stroke)
- Some paths use `clipRule="evenodd"` and `fillRule="evenodd"`
- Default display: `block` (via `cn('block', className)`)

### Complete Pictorial Catalog

| # | Export Name          | Visual Description         | Color  | Hex       | Path Keys (from svg-gc4b28hb5s.ts)             |
|---|----------------------|----------------------------|--------|-----------|--------------------------------------------------|
| 1 | `PictoUser`          | Single person silhouette   | Orange | `#FBAC62` | `p54a8f80`, `p184a2500`                          |
| 2 | `PictoProfile`       | ID card / profile badge    | Purple | `#9472FA` | `p35568900`, `p256dd000`, `p117b3270`, `p1d76ae00`, `p19d45900` |
| 3 | `PictoUsersGreen`    | Two people group           | Green  | `#0ED279` | `p1f3fb00` (evenodd)                             |
| 4 | `PictoUsersPink`     | Two people group (alt)     | Pink   | `#FF8888` | `p1f3fb00` (same path, different color)          |
| 5 | `PictoSafety`        | Shield / security badge    | Gold   | `#E8C33B` | `pec04500` (evenodd)                             |
| 6 | `PictoLocation`      | Map pin / location marker  | Pink   | `#FF8888` | `p35715200` (evenodd), `p3e695e80`               |
| 7 | `PictoQualification` | Graduation cap             | Blue   | `#7EADF8` | `p3429da00` (evenodd), `p1d44d80` (evenodd), `p1372a80` |
| 8 | `PictoProfession`    | Briefcase                  | Green  | `#0ED279` | `p1acdb300` (evenodd)                            |
| 9 | `PictoProfileEdit`   | Document with pencil       | Orange | `#FBAC62` | `p1c4c1af0`, `p1edb680` (evenodd)                |
| 10| `PictoBin`           | Trash can / delete         | Orange | `#FBAC62` | `p11758100` (evenodd), `p346351f0` (evenodd)     |
| 11| `PictoViewOff`       | Eye with slash             | Blue   | `#7EADF8` | `p3f5c300` (evenodd), `p2dd85400` (evenodd)      |
| 12| `PictoEmojiSad`      | Sad face emoji             | Gold   | `#E8C33B` | `p14a7a800` (evenodd)                            |
| 13| `PictoLock`          | Padlock                    | Orange | `#FBAC62` | `p37550880` (evenodd)                            |
| 14| `PictoHearts`        | Multiple hearts            | Pink   | `#FF8888` | `p34e77340`, `p336dd100`, `p17e924b2`, `p2176600`, `p39883720`, `p12cda800` |
| 15| `PictoHelp`          | Question mark circle       | Purple | `#9472FA` | `p341d2400` (evenodd)                            |
| 16| `PictoNotification`  | Bell                       | Pink   | `#FF8888` | `pe5e2b00` (viewBox 32x32)                       |

### Usage Pattern (in screens)

Pictorials are used inside the `PictorialHeader` sub-component:

```
<PictorialHeader icon={PictoProfileEdit} bgColor="#FFF3E0" subtitle="..." />
```

The header renders:
- A 72x72px circle with the `bgColor` background
- The pictorial icon centered inside at 36px
- Optional subtitle text below (13px, regular, muted-foreground, centered)
- Entry animation: scale 0.85 -> 1.0, opacity 0 -> 1, 350ms, 100ms delay

### Background Color Assignments Used in Registration Flow

| Pictorial Used    | Circle Background |
|-------------------|-------------------|
| PictoUsersGreen   | `#D5F5E3` (light green)  |
| PictoLocation     | `#FFE0E0` (light pink)   |
| PictoProfile      | `#EDE5FF` (light purple) |
| PictoQualification| `#DCE8FF` (light blue)   |
| PictoProfession   | `#D5F5E3` (light green)  |
| PictoProfileEdit  | `#FFF3E0` (light orange) |
| PictoSafety       | `#FFF9E0` (light gold)   |
| PictoUsersPink    | `#FFE0E0` (light pink)   |

### Size Scale

Pictorials are designed at 36px default but can be rendered at: **20px, 28px, 36px, 48px**.

---

# 5. Icons (System SVG Icons)

**Source:** `/src/app/components/icons/index.tsx`

### Purpose
Monochrome system icons used in navigation bars, action buttons, and toolbars. Unlike pictorials, these use `currentColor` and respond to the parent's text color. Each icon has an **outline** and a **filled** variant.

### Component Interface

```typescript
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}
```

Every icon renders as an SVG with:
- Default size: `w-6 h-6` (24x24px) via `cn("block w-6 h-6", className)`
- `viewBox="0 0 24 24"` (all icons)
- `fill="none"` on the SVG root
- Color: `currentColor` (inherits from parent text color)

### Rendering Patterns

**Outline icons** use `stroke="currentColor"` with these common attributes:
- `strokeWidth="1.5"` (standard)
- `strokeLinecap="round"`
- `strokeLinejoin="round"`

**Filled icons** use `fill="currentColor"` on `<path>` elements, typically with:
- `clipRule="evenodd"`
- `fillRule="evenodd"`

**"Bold" variants** (e.g., HamburgerFilled, SearchFilled, TickFilled) use the same outline paths but with `strokeWidth="2.5"` instead of `1.5`.

### Complete Icon Catalog

| # | Icon Name            | Outline Export            | Filled Export              | Description               | Path Composition                              |
|---|----------------------|---------------------------|----------------------------|----------------------------|------------------------------------------------|
| 1 | Hamburger            | `HamburgerIcon`           | `HamburgerFilledIcon`      | 3-line menu                | 3 horizontal lines (stroke only)               |
| 2 | Notification / Bell  | `NotificationIcon`        | `NotificationFilledIcon`   | Bell with dot              | Bell body + bottom semi-circle (outline); single path (filled) |
| 3 | Search               | `SearchIcon`              | `SearchFilledIcon`         | Magnifying glass           | Circle + diagonal handle line (stroke only; filled = bold stroke) |
| 4 | Filter               | `FilterIcon`              | `FilterFilledIcon`         | Funnel                     | Single funnel path (stroke outline, fill filled) |
| 5 | Crown / Premium      | `CrownIcon`               | `CrownFilledIcon`          | Crown shape                | 2 paths outline (crown + bar); 1 evenodd filled |
| 6 | Chat                 | `ChatIcon`                | `ChatFilledIcon`           | Speech bubble              | Single bubble path (stroke outline, fill filled) |
| 7 | Home (Shaadi logo S) | `HomeIcon`                | `HomeFilledIcon`           | Shaadi "S" in rounded rect | Rect outline + S fill (outline); single evenodd (filled) |
| 8 | Inbox / Mail         | `InboxIcon`               | `InboxFilledIcon`          | Envelope                   | Chevron flap + rect body (outline); single evenodd (filled) |
| 9 | Matches              | `MatchesIcon`             | `MatchesFilledIcon`        | Two people overlap         | Circle + 2 body paths + secondary (outline); 4 paths (filled) |
| 10| Tick / Check         | `TickIcon`                | `TickFilledIcon`           | Checkmark                  | Single path `M4.5 13L9 17.5L19.5 6.5` (stroke; filled = bold) |
| 11| More (Vertical)      | `MoreIcon`                | `MoreFilledIcon`           | 3 vertical dots            | 3 circle/rect paths (stroke outline, fill filled) |
| 12| Camera               | `CameraIcon`              | `CameraFilledIcon`         | Camera                     | Body + lens circle + flash dot (outline); single evenodd (filled) |
| 13| Photo                | `PhotoIcon`               | `PhotoFilledIcon`          | Image / landscape          | Rect + sun circle + mountain line (outline); single evenodd (filled) |
| 14| Verification Badge   | `VerificationIcon`        | `VerificationFilledIcon`   | Shield with checkmark      | Badge outline + check stroke (outline); badge fill + white check (filled) |
| 15| Users                | -                         | `UsersFilledIcon`          | Group of people            | Single filled path (filled only)                |
| 16| Globe                | -                         | `GlobeFilledIcon`          | Earth globe                | Single filled path (filled only)                |
| 17| Astro                | `AstroIcon`               | `AstroFilledIcon`          | Orbit / astrology          | 2 arc paths (outline); 3 filled paths           |
| 18| Navigation           | `NavigationIcon`          | `NavigationFilledIcon`     | Paper plane / send         | Single path (stroke outline; stroke+fill filled) |

### Bottom Navigation Bar Icons

The bottom navigation bar uses these 5 icons with outline (inactive) and filled (active) variants:

| Tab      | Outline Icon     | Filled Icon         | Active Color    |
|----------|------------------|---------------------|-----------------|
| Home     | `HomeIcon`       | `HomeFilledIcon`    | `#FF5A60` (coral)|
| Matches  | `MatchesIcon`    | `MatchesFilledIcon` | `#FF5A60`       |
| Inbox    | `InboxIcon`      | `InboxFilledIcon`   | `#FF5A60`       |
| Chat     | `ChatIcon`       | `ChatFilledIcon`    | `#FF5A60`       |
| Premium  | `CrownIcon`      | `CrownFilledIcon`   | `#FF5A60`       |

**Inactive state:** `text-muted-foreground` (#71717a)
**Active state:** `text-[#FF5A60]` (coral red accent)

### Verification Badge Special Rendering (Filled)

The filled verification badge has a unique multi-layer rendering:
1. White stroke border (strokeWidth=3) behind the badge for a "cutout" effect
2. Solid fill of the badge shape
3. White checkmark stroke on top (strokeWidth=2)

---

# 6. Data: Current User

**Source:** `/src/data/currentUser.ts`

The current logged-in user is **Pratik Aher**. His data is used as default/pre-filled values throughout the app. Here are the key values:

```
Name:           Pratik Aher
ID:             SH71385132
Gender:         Male
Birth Date:     1999-01-15 (Age: 26)
Marital Status: Never Married
Location:       Mumbai, MH, India
Religion:       Hindu
Community:      96 Kuli Maratha
Mother Tongue:  Marathi
Diet:           Occasionally Non-Vegetarian
Horoscope:      Capricorn
Profession:     Product Designer
Company:        Private Company
Income:         INR 10-15 Lakh
Education:      B.E / B.Tech (Engineering)
Height:         170cm (5'7")
Family:
  Father:       Employed
  Mother:       Employed
  Brothers:     1
  Sisters:      0
  Financial:    High
  Family Type:  Nuclear
  Native Place: Jalgaon, Maharashtra
Phone:          +91-8668XXXXXX
Premium:        true
Verified:       ID + Selfie both true
```

---

# Appendix A: Animation Patterns Used

## Slide Transitions (Step Navigation)

```typescript
// Spring-based horizontal slide (used for step changes)
transition: {
  type: 'spring',
  stiffness: 350,
  damping: 35,
  mass: 0.8,
}
// Direction: +1 (forward) slides left-to-right, -1 (back) slides right-to-left
// enter:  x: direction > 0 ? '100%' : '-100%', opacity: 0
// center: x: 0, opacity: 1
// exit:   x: direction > 0 ? '-100%' : '100%', opacity: 0
```

## Content Entrance Animations

```typescript
// Heading entrance
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
transition: { delay: 0.1-0.15, duration: 0.3 }

// Form content entrance
initial: { opacity: 0, y: 16 }
animate: { opacity: 1, y: 0 }
transition: { delay: 0.15-0.2, duration: 0.35 }

// Pictorial header entrance
initial: { scale: 0.85, opacity: 0 }
animate: { scale: 1, opacity: 1 }
transition: { delay: 0.1, duration: 0.35 }

// Continue button entrance
initial: { opacity: 0, y: 12 }
animate: { opacity: 1, y: 0 }
transition: { delay: 0.25, duration: 0.3 }
```

---

# Appendix B: File Structure Reference

```
/src/
  app/
    App.tsx                          -- Main entry point, state-driven navigation
    components/
      Button.tsx                     -- Variant-driven button (CVA)
      Card.tsx                       -- Card container with sub-components
      Chip.tsx                       -- Toggleable tag/filter chip
      SelectChip.tsx                 -- Chip with check indicator
      FilterBar.tsx                  -- Horizontal scrollable chip bar
      FloatingLabelInput.tsx         -- Text input with floating label
      FloatingLabelSelect.tsx        -- Custom dropdown with floating label
      Input.tsx                      -- Base input component
      MobileWrapper.tsx              -- Phone frame simulator
      PictorialsShowcase.tsx         -- Pictorial icon gallery page
      SelectChipShowcase.tsx         -- SelectChip demo gallery
      icons/
        index.tsx                    -- System SVG icons (outline + filled)
        pictorials.tsx               -- Colorful pictorial icons (16 total)
      screens/
        OnboardingScreen.tsx         -- Onboarding click-through
        ProfileForScreen.tsx         -- Profile creation bottom sheet
        ProfileCardScreen.tsx        -- Profile card preview
        RegistrationFlow.tsx         -- 15-step registration wizard
      matches/
        MatchesView.tsx              -- Matches browse view
        ProfileCard.tsx              -- Individual profile card
    pages/
      DesignSystem.tsx               -- Design system explorer page
  data/
    currentUser.ts                   -- Pratik Aher user data
    mockProfiles.ts                  -- Mock match profiles
    findingMatchesLottie.ts          -- Lottie animation data
  imports/
    svg-gc4b28hb5s.ts               -- SVG path data for pictorials
    ShaadiLogo.tsx                   -- Shaadi.com logo component
    (various Frame*.tsx)             -- Figma-imported frame components
  styles/
    fonts.css                        -- Google Fonts import (Roboto)
    index.css                        -- CSS entry (imports fonts, tailwind, theme)
    tailwind.css                     -- Tailwind v4 config
    theme.css                        -- Design tokens (colors, radii, font)
  types/
    user.ts                          -- User interface definition
    profile.ts                       -- Profile type definition
  utils/
    cn.ts                            -- clsx + tailwind-merge utility
```

---

# Appendix C: Key Design Principles for Native Replication

1. **Reuse, don't recreate:** The 5 core input/control components (`Button`, `Chip`, `SelectChip`, `FloatingLabelInput`, `FloatingLabelSelect`) should be built as reusable components in native. Screen-level code should compose these, never create one-off buttons or inputs.

2. **`className` overrides are for color only:** When a component receives a `className` override, it should only change color context (e.g., background color of a CTA button from cyan to coral). Typography, sizing, and spacing should come from the component's built-in variants.

3. **Pill shape is default:** All buttons and chips default to `rounded-full` (pill/capsule). This is the most common shape in the app. Square/rounded-rect buttons are the exception.

4. **16px input border radius:** All text inputs and selects use 16px corner radius, not the standard pill or card radius.

5. **Squircle shapes:** The app uses `@squircle-js/react` for iOS-style continuous corner radius (superellipse) on some elements. In iOS (SwiftUI), use `.clipShape(RoundedRectangle(cornerRadius: _, style: .continuous))`. In Android (Compose), use a custom `RoundedCornerShape` or a squircle library.

6. **State-driven navigation:** The app does NOT use a router. Navigation is driven by a `currentScreen` state variable in App.tsx. Steps within a flow (RegistrationFlow) use a numeric `step` state. Replicate this pattern natively rather than using navigation stacks.

7. **Bottom tab bar:** 5 tabs (Home, Matches, Inbox, Chat, Premium). Active tab uses coral red (#FF5A60) filled icon + text. Inactive uses muted gray (#71717a) outline icon + text.

8. **Dark mode support:** All semantic tokens have light and dark variants defined. Components should adapt automatically based on the system theme.

---

*Last updated: 2026-02-14*
*Document version: 1.0 - Foundations, UI Kit, Inputs, Pictorials, Icons*
