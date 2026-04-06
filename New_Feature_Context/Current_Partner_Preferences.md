# Shaadi.com — Current Partner Preferences

> **Source**: "Partner Prefrence.pdf" — live app screenshot audit (collage of all sub-screens)  
> **Screen title**: Your Partner Preferences  
> **Entry point**: Shown during/after registration ("Recommended Partner Preferences" step) and accessible from profile settings  
> **Subtitle**: "Tap on the field to edit"  
> **CTA**: "Confirm & Continue"

---

## Overview

The Partner Preferences screen is a scrollable form organized into **5 sections**. Each field taps into a drill-down sub-screen with specific selectable options. Most fields default to "Open to All". Some fields (Age Range, Height Range) are pre-filled from the user's own profile data.

---

## Main Screen — Section Structure

```
Your Partner Preferences
  ├── Basic Details
  │   ├── Age Range
  │   ├── Height Range
  │   ├── Caste No Bar (checkbox)
  │   └── Marital Status
  ├── Community
  │   ├── Religion
  │   ├── Mother Tongue
  │   └── Caste
  ├── Location
  │   └── Country Living In
  ├── Education & Career
  │   ├── Education Level
  │   ├── Annual Income
  │   └── Working With / Profession
  └── Other Details
      └── Profile Managed By
```

---

## Fields — Full Detail

### Section 1: Basic Details

#### 1.1 Age Range
- **Input type**: Range slider (dual handles)
- **Default**: Auto-set based on user's age (e.g., 27 to 37)
- **Constraint**: Minimum age 18

---

#### 1.2 Height Range
- **Input type**: Range slider (dual handles)
- **Default**: Auto-set (e.g., 4 ft 9 in to 7 ft)

---

#### 1.3 Caste No Bar
- **Input type**: Checkbox
- **Options**: Checked / Unchecked
- **Meaning**: If checked, user is open to all communities (Caste no bar)

---

#### 1.4 Marital Status
- **Input type**: Checkbox list (multi-select)
- **Default**: Open to All

| Option |
|--------|
| Open to All |
| Never Married |
| Divorced |
| Widowed |
| Awaiting Divorce |
| Annulled |

---

#### 1.5 Profile with Children
- **Input type**: Single-select radio
- **Appears conditionally** (shown when Marital Status ≠ Never Married)

| Option |
|--------|
| Open to All |
| Yes, if they live separately |
| No |

---

### Section 2: Community

#### 2.1 Religion
- **Input type**: Checkbox list (multi-select)
- **Default**: Open to All

| Option |
|--------|
| Open to All |
| Hindu |
| Muslim |
| Christian |
| Sikh |
| Parsi |
| Jain |
| Buddhist |
| No Religion |
| Spiritual – not religious |
| Other |

---

#### 2.2 Mother Tongue
- **Input type**: Search + checkbox list
- **Default**: Open to All
- **UX**: Shows "Suggested for you" personalized section at top; full list available via search
- Languages include: Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Punjabi, Malayalam, Odia, Kannada, English, and more

---

#### 2.3 Caste / Sub-Community
- **Input type**: Search-based
- **Default**: Open to All
- **Dependent on**: Religion selection (options change per religion)

---

### Section 3: Location

#### 3.1 Country Living In
- **Input type**: Checkbox list with search
- **Default**: Open to All

| Option | Approximate Profile Count |
|--------|--------------------------|
| Open to All | — |
| India | ~322,xxx |
| USA | ~611,xxx |
| United Arab Emirates | ~248,xxx |
| Canada | ~359,xxx |
| United Kingdom | ~271,xxx |
| Pakistan | ~17,xxx |
| Australia | ~173,xxx |
| Saudi Arabia | ~96,xxx |
| Bangladesh | ~4,xxx |
| *(+ search for more countries)* | — |

---

### Section 4: Education & Career

#### 4.1 Education Level / Qualification
- **Input type**: Checkbox list with search
- **Default**: Open to All
- **UX**: Shows "Suggested for you" section at top (e.g., Bachelor, Masters, Doctorate)

| Option |
|--------|
| Open to All |
| Associate / Diploma |
| Bachelor / Undergraduate |
| Master |
| Doctorate |
| High School and below |

---

#### 4.2 Annual Income
- **Input type**: Two modes — list selection OR range slider
- **Default**: Open to All

**Mode 1 — List selection:**

| Option | Approximate Profile Count |
|--------|--------------------------|
| Open to All | — |
| INR 0 Lakh to 1 Lakh | ~723,208 |
| INR 1 Lakh to 3 Lakh | ~280,023 |
| INR 3 Lakh to 5 Lakh | ~231,997 |
| INR 5 Lakh to 10 Lakh | ~269,381 |
| INR 10 Lakh to 15 Lakh | ~145,410 |
| INR 15 Lakh to 25 Lakh | ~85,424 |
| INR 25 Lakh to 50 Lakh | ~40,245 |
| INR 50 Lakh to 1 Crore | ~14,471 |
| Not applicable | ~109,031 |

**Mode 2 — Range slider (via "Specify an income range" toggle):**
- Currency: INR (Indian Rupee)
- Slider: 1 Lakh to 1 Crore
- Checkbox: "Show profiles who fit my range and have hidden their income"

---

#### 4.3 Working With
- **Input type**: Checkbox list (multi-select)
- **Default**: Open to All

| Option | Approximate Profile Count |
|--------|--------------------------|
| Open to All | — |
| Private Company | ~1,302,514 |
| Business / Self Employed | ~959,896 |
| Government / Public Sector | ~338,068 |
| Non Working | ~68,439 |
| Defence / Civil Services | ~17,606 |
| Other | ~24,567 |

---

#### 4.4 Profession Area
- **Input type**: Checkbox list with search
- **Default**: Open to All

| Option | Approximate Profile Count |
|--------|--------------------------|
| Open to All | — |
| Accounting, Banking & Finance | ~505,664 |
| IT & Software Engineering | ~329,159 |
| Others | ~272,800 |
| Healthcare Professionals | ~138,662 |
| Engineering | ~109,906 |
| Medical & Healthcare | ~73,472 |
| Administrative & HR | ~69,150 |
| Sales & Marketing | ~16,712 |
| Non Working | ~8,400 |
| Agriculture | — |
| Architecture & Design | — |
| Advertising, Media & Entertainment | — |
| Artists, Animations & Web Designers | — |
| Beauty, Fashion & Jewellery Designers | — |
| *(+ search for more)* | — |

---

### Section 5: Other Details

#### 5.1 Profile Managed By
- **Input type**: Checkbox list (multi-select)
- **Default**: Open to All

| Option |
|--------|
| Open to All |
| Self |
| Parent / Guardian |
| Sibling / Friend / Others |

---

#### 5.2 Diet / Eating Habits
- **Input type**: Checkbox list (multi-select)
- **Default**: All Preferences (Open to All)

| Option |
|--------|
| All Preferences |
| Vegetarian |
| Eggetarian |
| Non Vegetarian |

---

#### 5.3 Photo Settings
- **Input type**: Checkbox list
- **Default**: Open to All

| Option | Approximate Profile Count |
|--------|--------------------------|
| Open to All | — |
| Visible to all | ~1,100,164 |
| Protected Photo | ~181,118 |

---

#### 5.4 Recently Joined *(also appears in Refine panel)*
- **Input type**: Radio button (single-select inline dialog)
- **Default**: Open to All

| Option | Approximate Profile Count |
|--------|--------------------------|
| Open to All | — |
| Within a month | ~227,711 |
| Within a week | ~67,642 |
| Within a day | ~35,480 |

---

## UI / UX Notes

| Aspect | Details |
|--------|---------|
| **Screen title** | "Your Partner Preferences" |
| **Subtitle** | "Tap on the field to edit" |
| **Layout** | Scrollable form with 5 collapsible sections |
| **Navigation** | Each field → opens drill-down sub-screen |
| **Sub-screen pattern** | Checkbox / radio list with "Cancel" and "Apply" buttons |
| **Search fields** | Mother Tongue, Country, Education, Profession — all have search bars |
| **Personalization** | "Suggested for you" sections appear for Mother Tongue, Qualification, Profession |
| **Income range** | Toggle between list view and custom range slider |
| **Conditional fields** | "Profile with Children" only appears when Marital Status ≠ Never Married |
| **Default state** | Most fields = "Open to All"; Age and Height = pre-filled from user profile |
| **Bottom CTA** | "Confirm & Continue" (teal pill button) |
| **Profile counts** | Shown next to each option (real-time match counts) |

---

## Field Summary Count

| Section | Fields |
|---------|--------|
| Basic Details | Age Range, Height Range, Caste No Bar, Marital Status, Profile with Children |
| Community | Religion, Mother Tongue, Caste |
| Location | Country Living In |
| Education & Career | Education Level, Annual Income, Working With, Profession Area |
| Other Details | Profile Managed By, Diet, Photo Settings, Recently Joined |
| **Total** | **~17 editable preference fields** |

---

*Sourced from: "Partner Prefrence.pdf" — live Shaadi.com app screenshots (composite of all sub-screens).*
