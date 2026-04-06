# Shaadi.com — Registration & Onboarding: Complete Field Reference

> **Purpose**: Holistic inventory of every field collected during the registration and onboarding flow, including all possible options a user can select. Sourced from `ProfileForScreen.tsx`, `RegistrationFlow.tsx`, `OnboardingScreen.tsx`, `user.ts`, `profile.ts`, `currentUser.ts`, and `EditProfileView.tsx`.

---

## Table of Contents

1. [Flow Overview](#1-flow-overview)
2. [Pre-Registration: Sign-Up Method](#2-pre-registration-sign-up-method)
3. [Profile For & Gender Selection](#3-profile-for--gender-selection)
4. [Step 0 — Your Name & Date of Birth](#4-step-0--your-name--date-of-birth)
5. [Step 1 — Religion, Community & Country](#5-step-1--religion-community--country)
6. [Step 2 — State, City & Sub-Community](#6-step-2--state-city--sub-community)
7. [Step 3 — Marital Status, Height & Diet](#7-step-3--marital-status-height--diet)
8. [Step 4 — Highest Qualification & College](#8-step-4--highest-qualification--college)
9. [Step 5 — Annual Income & Work Details](#9-step-5--annual-income--work-details)
10. [Step 6 — Photos](#10-step-6--photos)
11. [Step 7 — About Yourself](#11-step-7--about-yourself)
12. [Step 8 — Verify Mobile Number (OTP)](#12-step-8--verify-mobile-number-otp)
13. [Step 9 — Verify Profile (Selfie)](#13-step-9--verify-profile-selfie)
14. [Step 10 — Hobbies & Interests](#14-step-10--hobbies--interests)
15. [Step 11 — Family Details (Screen 1)](#15-step-11--family-details-screen-1)
16. [Step 12 — Family Details (Screen 2)](#16-step-12--family-details-screen-2)
17. [Step 13 — Recommended Partner Preferences](#17-step-13--recommended-partner-preferences)
18. [Step 14 — Finding Matches (Transition)](#18-step-14--finding-matches-transition)
19. [Additional Fields in User Data Model](#19-additional-fields-in-user-data-model)
20. [Complete Field Summary Table](#20-complete-field-summary-table)

---

## 1. Flow Overview

The full registration and onboarding journey is:

```
OnboardingScreen (Sign-Up method)
  → ProfileForScreen (Profile is for / Gender)
    → RegistrationFlow (15 steps: 0–14)
      → SIA Onboarding (AI matchmaking intro)
        → Main App (Matches / Inbox)
```

**Total Registration Steps**: 15 (numbered 0–14)
**Skippable Steps**: 8, 9, 10, 11, 12 (header shows "Skip" button)

---

## 2. Pre-Registration: Sign-Up Method

**Screen**: `OnboardingScreen.tsx`

| # | Field | Type | Options |
|---|-------|------|---------|
| 1 | **Sign-Up Method** | Button selection (one-tap) | `Sign Up with Email`, `Sign Up with Mobile`, `Sign Up with Google` |

> Existing users see: "Already have an account? → Login"

---

## 3. Profile For & Gender Selection

**Screen**: `ProfileForScreen.tsx`

| # | Field | Type | Required | Options |
|---|-------|------|----------|---------|
| 1 | **This Profile is for** | Single-select chips | Yes | `Myself`, `My Son`, `My Daughter`, `My Brother`, `My Sister`, `My Friend`, `My Relative` |
| 2 | **Your Gender** | Single-select chips | Conditional — only if "Myself" is selected | `Male`, `Female` |

**Behavior**: If the user selects anything other than "Myself", they advance immediately (no gender prompt). Gender is inferred from options like "My Son" (Male) or "My Daughter" (Female).

---

## 4. Step 0 — Your Name & Date of Birth

| # | Field | Type | Required | Validation / Notes |
|---|-------|------|----------|--------------------|
| 1 | **First Name** | Text input (floating label) | Yes | Free text |
| 2 | **Last Name** | Text input (floating label) | Yes | Free text |
| 3 | **Date of Birth — Day** | Numeric input | Yes | 2 digits, `DD` format |
| 4 | **Date of Birth — Month** | Numeric input | Yes | 2 digits, `MM` format |
| 5 | **Date of Birth — Year** | Numeric input | Yes | 4 digits, `YYYY` format |

---

## 5. Step 1 — Religion, Community & Country

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **Religion** | Dropdown (floating label) | Yes | `Hindu`, `Muslim`, `Christian`, `Sikh`, `Buddhist`, `Jain`, `Other` |
| 2 | **Community** | Dropdown (floating label) | Yes | `Kannada`, `Tamil`, `Telugu`, `Malayalam`, `Marathi`, `Gujarati`, `Bengali`, `Punjabi`, `Other` |
| 3 | **Living in** (Country) | Dropdown (floating label) | Yes | `India`, `USA`, `UK`, `Canada`, `Australia`, `UAE`, `Germany`, `Other` |

---

## 6. Step 2 — State, City & Sub-Community

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **State** | Dropdown (floating label) | Yes | `Karnataka`, `Maharashtra`, `Tamil Nadu`, `Kerala`, `Andhra Pradesh`, `Telangana`, `Delhi`, `Gujarat`, `Rajasthan`, `Uttar Pradesh` |
| 2 | **City** | Dropdown (floating label) | Yes | `Mumbai`, `Pune`, `Nagpur`, `Nashik`, `Aurangabad`, `Thane`, `Bangalore`, `Delhi`, `Chennai`, `Hyderabad`, `Kolkata` |
| 3 | **Sub-Community** | Dropdown (floating label) | Yes | `96 Kuli Maratha`, `Deshastha Maratha`, `CKP`, `Vokkaliga`, `Lingayat`, `Brahmin`, `Reddy`, `Nair`, `Other` |
| 4 | **Not particular about partner's community** (Caste no bar) | Checkbox | No | `Checked` / `Unchecked` |

---

## 7. Step 3 — Marital Status, Height & Diet

### 7.1 Marital Status

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **Marital Status** | Dropdown (floating label) | Yes | `Never Married`, `Divorced`, `Widowed`, `Awaiting Divorce`, `Annulled` |

### 7.2 Height

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 2 | **Height** | Dropdown (floating label) | Yes | 17 options from **4ft 10in** to **6ft 2in**: |

| Option | Metric |
|--------|--------|
| 4ft 10in | 147cm |
| 4ft 11in | 150cm |
| 5ft 0in | 152cm |
| 5ft 1in | 155cm |
| 5ft 2in | 157cm |
| 5ft 3in | 160cm |
| 5ft 4in | 162cm |
| 5ft 5in | 165cm |
| 5ft 6in | 167cm |
| 5ft 7in | 170cm |
| 5ft 8in | 172cm |
| 5ft 9in | 175cm |
| 5ft 10in | 177cm |
| 5ft 11in | 180cm |
| 6ft 0in | 182cm |
| 6ft 1in | 185cm |
| 6ft 2in | 187cm |

### 7.3 Diet

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 3 | **Diet** | Dropdown (floating label) | Yes | `Veg`, `Non-Veg`, `Occasionally Non-Veg`, `Eggetarian`, `Jain`, `Vegan` |

---

## 8. Step 4 — Highest Qualification & College

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **Qualification** | Dropdown (floating label) | Yes | See full list below |
| 2 | **College** | Text input (floating label) | No | Free text |

### Full Qualification Options (24)

| Category | Degrees |
|----------|---------|
| **Undergraduate** | `B.Tech`, `B.E.`, `B.Arch`, `B.Sc`, `B.Com`, `B.A.`, `BBA`, `BCA`, `MBBS`, `BDS`, `LLB` |
| **Postgraduate** | `M.Tech`, `M.E.`, `M.Sc`, `M.Com`, `M.A.`, `MBA`, `MCA`, `MD`, `MS`, `LLM` |
| **Doctoral** | `Ph.D` |
| **Other** | `Diploma`, `Other` |

---

## 9. Step 5 — Annual Income & Work Details

### 9.1 Annual Income

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **Annual Income** | Dropdown (floating label) | Yes | 11 salary bands (INR): |

| Band |
|------|
| INR 0 to 1 Lakh |
| INR 1 Lakh to 2 Lakh |
| INR 2 Lakh to 4 Lakh |
| INR 4 Lakh to 7 Lakh |
| INR 7 Lakh to 10 Lakh |
| INR 10 Lakh to 15 Lakh |
| INR 15 Lakh to 20 Lakh |
| INR 20 Lakh to 30 Lakh |
| INR 30 Lakh to 50 Lakh |
| INR 50 Lakh to 1 Crore |
| INR 1 Crore and above |

### 9.2 Work Details

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 2 | **You work with** (Company type) | Dropdown (floating label) | Yes | `Private Company`, `Government / Public Sector`, `Defence / Civil Services`, `Business / Self Employed`, `Not Working`, `Other` |
| 3 | **You work as** (Occupation) | Dropdown (floating label) | Yes | `Product Designer`, `Architect`, `Software Engineer`, `Doctor`, `Lawyer`, `Teacher`, `Accountant`, `Civil Engineer`, `Designer`, `Manager`, `Analyst`, `Consultant`, `Entrepreneur`, `Other` |
| 4 | **Company name** | Text input (floating label) | No | Free text |

---

## 10. Step 6 — Photos

| # | Field | Type | Required | Options |
|---|-------|------|----------|---------|
| 1 | **Profile Photos** | Photo upload | No (skippable — "Add photos later") | `Add from Gallery`, `Use Camera`, `Add photos later` (skip) |

---

## 11. Step 7 — About Yourself

| # | Field | Type | Required | Validation / Notes |
|---|-------|------|----------|--------------------|
| 1 | **About Me** | Multi-line textarea | Yes | Max **1000 characters**; system pre-fills a draft based on earlier answers; user can edit |
| 2 | **Do not add my Profile to Shaadi.com's affiliated Matchmaking services** | Checkbox | No | `Checked` / `Unchecked` |

---

## 12. Step 8 — Verify Mobile Number (OTP)

| # | Field | Type | Required | Validation / Notes |
|---|-------|------|----------|--------------------|
| 1 | **Mobile Number** | Pre-filled (editable via "Edit" link) | Yes | Country code + number (e.g. `+91 8668XXXXXX`) |
| 2 | **OTP Code** | 6-digit numeric input | Yes (skippable step) | Exactly 6 digits; numeric-only; "Resend" timer (30s) |

---

## 13. Step 9 — Verify Profile (Selfie)

| # | Field | Type | Required | Options |
|---|-------|------|----------|---------|
| 1 | **Verification Selfie** | Camera capture | No (skippable step) | `Take a Selfie`, `Skip` |

> Note: "Verification Selfies are NOT shown to other members"

---

## 14. Step 10 — Hobbies & Interests

Multi-select chip grid. Users must select **at least 1** hobby. Organized into 4 categories with "View more" expansion.

### 14.1 Creative (15 options)

| # | Emoji | Label | Visibility |
|---|-------|-------|------------|
| 1 | ✍️ | Writing | Default |
| 2 | 🍳 | Cooking | Default |
| 3 | 🎤 | Singing | Default |
| 4 | 📸 | Photography | Default |
| 5 | 🎸 | Playing instruments | View more |
| 6 | 🖌️ | Painting | View more |
| 7 | 🛠️ | DIY crafts | View more |
| 8 | 💃 | Dancing | View more |
| 9 | 🎭 | Acting | View more |
| 10 | 📝 | Poetry | View more |
| 11 | 🌱 | Gardening | View more |
| 12 | ✏️ | Blogging | View more |
| 13 | 🎥 | Content creation | View more |
| 14 | ✂️ | Designing | View more |
| 15 | 🖊️ | Doodling | View more |

### 14.2 Fun (14 options)

| # | Emoji | Label | Visibility |
|---|-------|-------|------------|
| 1 | 🎬 | Movies | Default |
| 2 | 🎵 | Music | Default |
| 3 | ✈️ | Travelling | Default |
| 4 | 📖 | Reading | Default |
| 5 | ⚽ | Sports | View more |
| 6 | 📱 | Social media | View more |
| 7 | 🎮 | Gaming | View more |
| 8 | 📺 | Binge-watching | View more |
| 9 | 🚴 | Biking | View more |
| 10 | 🎉 | Clubbing | View more |
| 11 | 🛍️ | Shopping | View more |
| 12 | 🎭 | Theater & Events | View more |
| 13 | 🏯 | Anime | View more |
| 14 | 🎤 | Stand ups | View more |

### 14.3 Fitness (8 options)

| # | Emoji | Label | Visibility |
|---|-------|-------|------------|
| 1 | 🏃 | Running | Default |
| 2 | 🚴‍♂️ | Cycling | Default |
| 3 | 🧘 | Yoga & Meditation | Default |
| 4 | 🚶 | Walking | Default |
| 5 | 💪 | Working out | View more |
| 6 | 🥾 | Trekking | View more |
| 7 | 🤸 | Aerobics/Zumba | View more |
| 8 | 🏊 | Swimming | View more |

### 14.4 Other Interests (5 options)

| # | Emoji | Label | Visibility |
|---|-------|-------|------------|
| 1 | 🐾 | Pets | Default |
| 2 | 🍔 | Foodie | Default |
| 3 | 🌿 | Vegan | Default |
| 4 | 📰 | News & Politics | View more |
| 5 | 🤝 | Social service | View more |

**Total Hobby Options**: 42

---

## 15. Step 11 — Family Details (Screen 1)

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **Mother's Profession** | Dropdown (floating label) | No (step is skippable) | `Employed`, `Business`, `Homemaker`, `Retired`, `Not Employed`, `Other` |
| 2 | **Father's Profession** | Dropdown (floating label) | No (step is skippable) | `Employed`, `Business`, `Retired`, `Not Employed`, `Other` |
| 3 | **No. of Brothers** | Dropdown (floating label) | No (step is skippable) | `0`, `1`, `2`, `3`, `4`, `5+` |
| 4 | **No. of Sisters** | Dropdown (floating label) | No (step is skippable) | `0`, `1`, `2`, `3`, `4`, `5+` |

---

## 16. Step 12 — Family Details (Screen 2)

| # | Field | Type | Required | All Possible Options |
|---|-------|------|----------|----------------------|
| 1 | **Family's Location** | Text input (floating label) | No (step is skippable) | Free text (e.g. "Jalgaon, Maharashtra") |
| 2 | **Live with family?** | Dropdown (floating label) | No (step is skippable) | `Yes`, `No` |
| 3 | **Family's Financial Status** | Dropdown (floating label) | No (step is skippable) | `Elite`, `High`, `Middle` |
| 4 | **Family Type** | Dropdown (floating label) | No (step is skippable) | `Nuclear`, `Joint`, `Other` |

---

## 17. Step 13 — Recommended Partner Preferences

This step shows system-generated partner preferences based on the user's profile. The user can tap each row to edit.

| # | Preference Field | Default Value (example) | Editable |
|---|------------------|-------------------------|----------|
| 1 | **Age** (range) | 22 to 28 | Yes (tap to edit) |
| 2 | **Height** (range) | 5ft to 5ft 8in | Yes (tap to edit) |
| 3 | **Marital Status** | Never Married | Yes (tap to edit) |
| 4 | **Religion** | Hindu | Yes (tap to edit) |
| 5 | **Community** | Marathi, 96 Kuli Maratha | Yes (tap to edit) |
| 6 | **Mother Tongue** | Marathi | Yes (tap to edit) |

---

## 18. Step 14 — Finding Matches (Transition)

No user input. Animated Lottie screen with "Finding Matches for you" — auto-advances after 6 seconds.

---

## 19. Additional Fields in User Data Model

These fields exist in the `User` and `Profile` type interfaces (`src/types/user.ts`, `src/types/profile.ts`) and appear in the Edit Profile view, but are **not explicitly collected during registration** (they may be derived, system-generated, or added post-registration):

| # | Field | Type in Data Model | Source / Notes |
|---|-------|--------------------|----------------|
| 1 | **Profile ID** (`displayId`) | string | System-generated (e.g. `SH71385132`) |
| 2 | **Age** | number | Derived from Date of Birth |
| 3 | **Profile Managed By** | string | Derived from "Profile is for" selection (e.g. `Self`, `Parents`) |
| 4 | **Mother Tongue** | string | Mapped from Community / displayed in profile, shown in partner preferences |
| 5 | **Horoscope Sign** | string | Derived from Date of Birth (e.g. `Capricorn`) |
| 6 | **Education Field** | string | Broader area of study (e.g. `Engineering`) — possibly derived from Qualification |
| 7 | **Astro Match Score** | number | System-computed compatibility score |
| 8 | **Distance (km)** | number | System-computed based on location |
| 9 | **Verified — ID** | boolean | Based on verification flow |
| 10 | **Verified — Selfie** | boolean | Based on Step 9 selfie verification |
| 11 | **Photos — Full** | string (URL/key) | Uploaded in Step 6 |
| 12 | **Photos — Avatar** | string (URL/key) | Cropped from uploaded photo |
| 13 | **Online Status** | boolean | System-tracked |
| 14 | **Last Active** | timestamp | System-tracked |
| 15 | **Badges** | string[] | Earned/assigned (e.g. `Blue Tick`) |
| 16 | **Premium Status** | boolean | Subscription state |
| 17 | **Contact — Email** | string | Collected at sign-up (Email method) |
| 18 | **Contact — Phone** | string | Collected at sign-up (Mobile method) or Step 8 |
| 19 | **Family — Parents' Contact** | string | Collected post-registration or by family-managed profiles |
| 20 | **Family — Native Place** | string | Maps to "Family's Location" from Step 12 |
| 21 | **Created At** | date | System-generated |
| 22 | **Updated At** | date | System-generated |

---

## 20. Complete Field Summary Table

### User-Collected Fields (Registration + Onboarding)

| # | Field | Step | Input Type | Required | Total Options |
|---|-------|------|-----------|----------|---------------|
| 1 | Sign-Up Method | Pre-reg | Button | Yes | 3 |
| 2 | Profile is for | ProfileFor | Single-select chips | Yes | 7 |
| 3 | Gender | ProfileFor | Single-select chips | Conditional | 2 |
| 4 | First Name | 0 | Text | Yes | Free text |
| 5 | Last Name | 0 | Text | Yes | Free text |
| 6 | Date of Birth (Day) | 0 | Numeric | Yes | 1–31 |
| 7 | Date of Birth (Month) | 0 | Numeric | Yes | 1–12 |
| 8 | Date of Birth (Year) | 0 | Numeric | Yes | 4-digit year |
| 9 | Religion | 1 | Dropdown | Yes | 7 |
| 10 | Community | 1 | Dropdown | Yes | 9 |
| 11 | Living in (Country) | 1 | Dropdown | Yes | 8 |
| 12 | State | 2 | Dropdown | Yes | 10 |
| 13 | City | 2 | Dropdown | Yes | 11 |
| 14 | Sub-Community | 2 | Dropdown | Yes | 9 |
| 15 | Caste No Bar | 2 | Checkbox | No | 2 (on/off) |
| 16 | Marital Status | 3 | Dropdown | Yes | 5 |
| 17 | Height | 3 | Dropdown | Yes | 17 |
| 18 | Diet | 3 | Dropdown | Yes | 6 |
| 19 | Qualification | 4 | Dropdown | Yes | 24 |
| 20 | College | 4 | Text | No | Free text |
| 21 | Annual Income | 5 | Dropdown | Yes | 11 |
| 22 | Company Type | 5 | Dropdown | Yes | 6 |
| 23 | Occupation | 5 | Dropdown | Yes | 14 |
| 24 | Company Name | 5 | Text | No | Free text |
| 25 | Photos | 6 | Upload/Camera | No | Gallery / Camera / Skip |
| 26 | About Me | 7 | Textarea | Yes | Free text (max 1000 chars) |
| 27 | Exclude from affiliate services | 7 | Checkbox | No | 2 (on/off) |
| 28 | Mobile Number | 8 | Pre-filled / Editable | Yes | Phone number |
| 29 | OTP | 8 | Numeric (6-digit) | Skippable | 6 digits |
| 30 | Selfie (verification) | 9 | Camera capture | Skippable | Capture / Skip |
| 31 | Hobbies & Interests | 10 | Multi-select chips | Min 1 | 42 total |
| 32 | Mother's Profession | 11 | Dropdown | Skippable | 6 |
| 33 | Father's Profession | 11 | Dropdown | Skippable | 5 |
| 34 | No. of Brothers | 11 | Dropdown | Skippable | 6 |
| 35 | No. of Sisters | 11 | Dropdown | Skippable | 6 |
| 36 | Family Location | 12 | Text | Skippable | Free text |
| 37 | Live with Family | 12 | Dropdown | Skippable | 2 |
| 38 | Financial Status | 12 | Dropdown | Skippable | 3 |
| 39 | Family Type | 12 | Dropdown | Skippable | 3 |
| 40 | Partner Pref — Age Range | 13 | Editable row | Auto-set | Range |
| 41 | Partner Pref — Height Range | 13 | Editable row | Auto-set | Range |
| 42 | Partner Pref — Marital Status | 13 | Editable row | Auto-set | From field options |
| 43 | Partner Pref — Religion | 13 | Editable row | Auto-set | From field options |
| 44 | Partner Pref — Community | 13 | Editable row | Auto-set | From field options |
| 45 | Partner Pref — Mother Tongue | 13 | Editable row | Auto-set | From field options |

### Totals

| Metric | Count |
|--------|-------|
| **Total user-facing fields** | 45 |
| **Required fields** | ~22 |
| **Optional / skippable fields** | ~23 |
| **Total selectable options across all dropdowns** | ~200+ |
| **Total hobby options** | 42 |
| **Registration steps** | 15 (0–14) |
| **Screens in full flow** (including pre-reg + ProfileFor) | 17 |

---

*Document generated from codebase analysis of: `OnboardingScreen.tsx`, `ProfileForScreen.tsx`, `RegistrationFlow.tsx`, `user.ts`, `profile.ts`, `currentUser.ts`, `EditProfileView.tsx`.*
