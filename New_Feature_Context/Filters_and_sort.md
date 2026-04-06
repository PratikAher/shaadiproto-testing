# Shaadi.com — Filters, Sort & Views: Complete Specification

> **Purpose**: Single source of truth consolidating all research, PM discussions, PDF analyses (Shaadi Filters.pdf + Inbox Experience Study.pdf), prototypes, competitive benchmarks, user behavior data, and design decisions for the Filters, Sort, and Views system on Shaadi.com Inbox.
>
> **Sources Synthesized**: Shaadi Filters.pdf, Inbox Experience Study.pdf, PM prototypes (Radhika Saxena), stakeholder feedback (Harsh Singh), Claude artifact prototypes, live app audit, and user behavior research.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State — What Exists Today](#2-current-state--what-exists-today)
3. [Problem Statement & Pain Points](#3-problem-statement--pain-points)
4. [Key Metrics & Targets](#4-key-metrics--targets)
5. [Proposed UI Architecture](#5-proposed-ui-architecture)
6. [Sort System — Full Specification](#6-sort-system--full-specification)
7. [Filter System — Full Specification](#7-filter-system--full-specification)
8. [View Toggle — Card vs. List](#8-view-toggle--card-vs-list)
9. [Inbox-Specific Filter Bottom Sheet](#9-inbox-specific-filter-bottom-sheet)
10. [Dependent Fields Logic — State Machine](#10-dependent-fields-logic--state-machine)
11. [Filter Display & Personalization Logic](#11-filter-display--personalization-logic)
12. [Filter Behavior Rules](#12-filter-behavior-rules)
13. [Premium / Monetization Strategy](#13-premium--monetization-strategy)
14. [User Behavior Insights & Decision Drivers](#14-user-behavior-insights--decision-drivers)
15. [Competitive Benchmarks](#15-competitive-benchmarks)
16. [Edge Cases & Error States](#16-edge-cases--error-states)
17. [Stakeholder Notes & Open Decisions](#17-stakeholder-notes--open-decisions)
18. [Prototype References](#18-prototype-references)
19. [Success Metrics — North Star](#19-success-metrics--north-star)
20. [Implementation Summary — What Needs to Be Built](#20-implementation-summary--what-needs-to-be-built)

---

## 1. Executive Summary

Shaadi.com's Inbox (the screen where users see received interests, accepted interests, and contacts) currently has a broken, under-discovered, and under-utilized filtering and sorting system. Only **~5% of DAU** uses filters, sorting is non-functional (all three sort options produce the same order), the List View toggle is hidden inside "Refine" (only ~25% discover it), and the view preference resets on every visit.

The goal of this project is to **completely redesign the filter, sort, and view-toggle experience** in the Inbox to:

- **Increase filter adoption from ~5% to 30%+ of DAU** by making filters visible, accessible, and useful.
- **Fix sorting** so it actually works and users trust it.
- **Surface the Card/List toggle** so users can choose their preferred browsing mode, and persist that choice.
- **Monetize through premium filters** — premium filters behind a paywall become a key conversion lever.
- **Improve Selection Ratio** (Connects Sent per User after filtering) as the North Star metric.

**Hard Constraint**: The primary tabs (`Received`, `Accepted`, `Contacts`, `Sent`) are fixed and cannot be modified. All work happens in the layer below these tabs.

---

## 2. Current State — What Exists Today

### 2.1 UI Layout

| Element | Location | Details |
|---------|----------|---------|
| **Primary Tabs** | Top bar | `Received (99+)` · `Accepted (27)` · `Contacts` — **FIXED, cannot change** |
| **Sub-header** | Below tabs | "All Requests (499)" + filter icon (⚙️) on the right |
| **Views** | Via hidden toggle inside "Refine" | **Card View** (large photo + profile info) and **List View** (compact rows) |
| **Filter Panel** | Opens on filter icon tap | Bottom sheet with basic filters |
| **Default Experience** | Swipe View | Binary accept/reject card swiping |

### 2.2 Current Behavior

- **Default view is Swipe View**, which forces binary accept/reject decisions with no room for nuanced evaluation.
- **List View** exists but is buried inside the "Refine" section — users must first tap the filter icon, then discover the view toggle inside.
- **View preference is not persisted** — every time a user returns to Inbox, it resets to the default Swipe View, ignoring their stated preference.
- **Sorting appears to work** (three options are shown) but **all three produce the identical order** — users who try sorting and see no difference lose trust and never use it again. Current sort usage is **~2%**.
- **Filters are basic** — limited filter options, low discoverability, no premium differentiation.

### 2.3 Current Filter Adoption & Usage

| Metric | Current Value |
|--------|---------------|
| Filter adoption (% of DAU) | ~5% |
| Sort usage | ~2% |
| List View discovery rate | ~25% of users |
| Female users switching to List View | ~8% |
| Male users switching to List View | Negligible |

---

## 3. Problem Statement & Pain Points

### From User Research (Inbox Experience Study.pdf)

| # | Pain Point | User Impact | Severity |
|---|-----------|-------------|----------|
| 1 | **Default Swipe View forces binary accept/reject** | Users feel pressured into decisions without enough information; reduces perceived control over browsing | High |
| 2 | **List View toggle is hidden** inside "Refine" menu | Only ~25% of users discover List View exists; ~8% females switch, negligible males | High |
| 3 | **View preference resets on every visit** | Users who prefer List View must re-enable it each visit; system ignores user intention, causing frustration | High |
| 4 | **Sorting is completely broken** — all options produce same order | Users who try sorting see no change, erode trust in the product; only ~2% bother using sort | Critical |
| 5 | **No search by name or Profile ID** | Explicitly requested by users in research; no way to find a specific profile in Inbox | Medium |
| 6 | **Low filter adoption (~5%)** | Filters exist but are underutilized due to poor discoverability and limited options | High |
| 7 | **36% of all connects are Filtered-Out connects** with only 2.2% accept ratio | Users waste time on low-relevance profiles; filtering could help but isn't being used | High |

### Core Insight

The Inbox is the highest-traffic destination in the app. Users are drowning in volume (499+ requests) with no effective tools to manage, prioritize, or filter that volume. The current "tools" (filter, sort, view toggle) are either broken, hidden, or reset — so users have learned to ignore them.

---

## 4. Key Metrics & Targets

### 4.1 Current Baseline Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Overall Response Rate | 64% | Users who respond to at least one interest |
| Overall Accept Ratio | 7% | Across all users |
| Male Accept Ratio | 29% | Males accept ~1 in 3.5 received interests |
| Female Accept Ratio | 5.3% | Females are far more selective |
| Filtered-Out (FO) Connects | 36% of all connects | Profiles that don't match user's stated preferences |
| FO Accept Ratio (overall) | 2.2% | Very low — these are mostly wasted impressions |
| FO Accept Ratio (Male) | 12% | Males still give some FO profiles a chance |
| FO Accept Ratio (Female) | 2% | Females almost never accept FO profiles |
| Current Filter Adoption | ~5% of DAU | Extremely low |
| Current Sort Usage | ~2% | Broken, so users don't bother |

### 4.2 Target Metrics

| # | Metric | Target | Why It Matters |
|---|--------|--------|---------------|
| 1 | **Improved Selection Ratio** (Connects Sent per User after filtering) | ↑ Increase | **North Star** — better filtering → more relevant connects → higher accept rates |
| 2 | **Filter Adoption Rate** | **30%+ of DAU** (6x current) | If filters work well and are visible, adoption should jump significantly |
| 3 | **Premium Conversion from Filter Paywall** | New metric (track from zero) | Key monetization lever — free users hitting premium filter paywalls |
| 4 | **Sort Usage Rate** | Significant increase from 2% | Fixing sort should restore trust and increase usage |
| 5 | **List View Adoption** | Increase from ~8% (F) / negligible (M) | Making toggle visible should increase adoption across genders |

---

## 5. Proposed UI Architecture

### 5.1 Hard Constraint

The **primary tabs** at the top of Inbox are **fixed and cannot be modified**:

```
┌──────────────────────────────────────────────────────────┐
│  Received (39)    Accepted     Contacts     Sent         │  ← CANNOT CHANGE
└──────────────────────────────────────────────────────────┘
```

All new work happens in the **sub-header area** below these tabs.

### 5.2 New Sub-Header Layout

Based on the PM prototype (Image 1) and PDF wireframes, the new sub-header introduces three new elements arranged horizontally:

```
┌──────────────────────────────────────────────────────────┐
│  Received (39)    Accepted     Contacts                  │  ← FIXED TABS
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌──────────────────┐  ┌──────┬──────┐ │
│  │ 🔽 Filters  │  │ Recommended  ▾   │  │ Card │ List │ │
│  └─────────────┘  └──────────────────┘  └──────┴──────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [Optional: Horizontal Quick Filter Chips Row]           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│        [Profile Cards / List Items Below]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5.3 New Elements — Detailed Specification

| Element | Visual Style | Behavior | Persistence |
|---------|-------------|----------|-------------|
| **Filters Button** | Pill/chip shape; dark background, white text, filter icon (funnel) on left | Taps opens filter bottom sheet; shows badge count when filters are active (e.g., "Filters · 3") | Filters persist during session, reset on exit |
| **Sort Dropdown** | Pill/chip with chevron; "Recommended ▾" as default text | Taps opens dropdown/popover with sort options; selected option replaces the label text | Persists during session |
| **Card/List Toggle** | Segmented control (two buttons side by side); active state has filled background | Switches between Card View and List View instantly | **Persists across sessions** (stored in user preferences) |

### 5.4 Active Filter State

When filters are applied, the sub-header should communicate this:

- **Filter button** updates to show count: `Filters · 3` (where 3 = number of active filter fields)
- **Applied filters appear as removable chips** below the sub-header in a horizontally scrollable row
- Each chip shows the filter name and a ✕ to remove it
- Example: `[Age: 25-30 ✕] [Religion: Hindu ✕] [Location: Mumbai ✕]`

---

## 6. Sort System — Full Specification

### 6.1 Sort Options

| # | Sort Option | Default | Free/Premium | Description |
|---|-------------|---------|-------------|-------------|
| 1 | **Most Relevant** (Recommended) | ✅ Yes | Free | Algorithm-driven ranking based on mutual compatibility, activity, profile completeness, etc. |
| 2 | **Newest First** | | Free | Sorted by the date the interest/request was received, most recent on top |
| 3 | **Oldest First** | | Free | Sorted by the date the interest/request was received, oldest on top |

### 6.2 Sort UX Requirements

- **Default selection**: "Most Relevant" (labeled as "Recommended" in the dropdown trigger)
- **Trigger**: Tapping the sort pill opens a dropdown/popover (NOT a bottom sheet — keep it lightweight)
- **Selection**: Radio button behavior — exactly one option selected at a time
- **Immediate effect**: Sorting applies immediately on selection; no "Apply" button needed
- **Visual feedback**: The sort pill label updates to reflect current selection (e.g., "Newest First ▾")
- **All three options must produce genuinely different orderings** — this is the #1 fix needed

### 6.3 Sort Interaction with Filters

- Sort and filters are **independent** — changing sort does not affect active filters and vice versa
- Sort applies **on top of** whatever filter set is active
- In the Inbox bottom sheet (Section 9), Sort and Filter appear together but operate independently

---

## 7. Filter System — Full Specification

### 7.1 Complete Filter Taxonomy — FREE Filters (21 Fields)

#### 7.1.1 Basic Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 1 | **Age** | Range slider (dual handles) | User's partner preference range | Min/max bounds from platform constraints |
| 2 | **Height** | Range slider (dual handles) | User's partner preference range | Display in ft/inches or cm based on locale |
| 3 | **Marital Status** | Multi-select checkboxes | None selected (show all) | Options: Never Married, Divorced, Widowed, Annulled, etc. |
| 4 | **Have Children** | Toggle (Yes/No/Any) | Any | **Conditional**: Only appears when Marital Status ≠ "Never Married" |

#### 7.1.2 Community Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 5 | **Religion** | Multi-select checkboxes | None selected (show all) | Full list of religions on platform |
| 6 | **Community** | Multi-select with search | None selected | **Dependent on Religion** — options change based on selected religion(s); Top 5 from ADAPT + search for rest |
| 7 | **Mother Tongue** | Multi-select with search | None selected | Top 5 from ADAPT Suggestions API + search for all others |
| 8 | **Manglik Status** | Single select | None selected | Options: Manglik, Non-Manglik, Doesn't Matter |

#### 7.1.3 Education Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 9 | **Qualification** | Multi-select checkboxes | None selected | Options: Doctorate, Masters, Undergraduate, Diploma, etc. |
| 10 | **Education Area** | Multi-select with search | None selected | Engineering, Medicine, Commerce, Arts, etc. |

#### 7.1.4 Career Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 11 | **Working With** | Multi-select | None selected | Private Company, Government, Business, Not Working, etc. |
| 12 | **Profession** | Multi-select with search | None selected | Doctor, Engineer, Lawyer, etc. |
| 13 | **Working As / Occupation** | Multi-select with search | None selected | More specific than Profession (e.g., Software Engineer, Civil Engineer) |
| 14 | **Income** | Range slider | None set | Currency-aware; show in lakhs/year for India, USD/year for NRI |

#### 7.1.5 Location Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 15 | **Country** | Multi-select with search | None selected | **Top 7 most popular** countries on Shaadi shown upfront + search for remaining 180+ countries |
| 16 | **State** | Multi-select with search | None selected | **Dependent on Country** — state options populate based on selected country |
| 17 | **City** | Multi-select with search | None selected | **Dependent on Country** — shows popular cities from ADAPT registration data + full city list via search |

#### 7.1.6 Lifestyle Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 18 | **Diet** | Multi-select | None selected | Vegetarian, Non-Vegetarian, Eggetarian, Vegan, Jain, etc. |
| 19 | **Hobbies & Interests** | Multi-select with search | None selected | Large list — show popular options + search |

#### 7.1.7 Family Filters

| # | Filter Field | Input Type | Default State | Notes |
|---|-------------|------------|---------------|-------|
| 20 | **Family Type** | Single select | None selected | Joint Family, Nuclear Family, Other |
| 21 | **Financial Status** | Single select | None selected | Affluent, Upper Middle Class, Middle Class, etc. |

---

### 7.2 Complete Filter Taxonomy — PREMIUM Filters (17 Fields)

These filters require a paid subscription. Free users see the filter field with a 👑 crown icon. Tapping it triggers the **premium paywall/upsell flow**.

#### 7.2.1 Signal-Based Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 1 | **Recently Joined** | Toggle | High-value social signal — newly joined members are more active and responsive | Low |
| 2 | **Online Now** | Toggle | Real-time activity signal — increases chance of immediate response | Low |
| 3 | **Distance / Nearby** | Range slider or nearby toggle | Requires location intelligence infrastructure | Low |
| 4 | **Premium Profiles** | Toggle | Filter for other premium/paid users — target high-intent users | Low |

#### 7.2.2 Activity-Based Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 5 | **Profiles with Photos** | Toggle | Quality filter — profiles with photos get 10x more responses | Low |
| 6 | **Profiles Managed By** | Single select | Self / Parents / Sibling — indicates who manages the profile | Low |

#### 7.2.3 Education Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 7 | **College / Top Colleges** | Search + chips | High social signal; requires college database and fuzzy matching | **High** |

#### 7.2.4 Career Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 8 | **Employer** | Search + chips | High social signal (e.g., Google, TCS, Infosys); requires employer database | **High** |

#### 7.2.5 Location Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 9 | **Location (in Inbox context)** | Select | Location is free in Search/Match Listings, but **crowned/premium when used specifically in Inbox** context | Low |

#### 7.2.6 NRI-Specific Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort | Visibility Condition |
|---|-------------|------------|-------------|------------|---------------------|
| 10 | **Grew Up In** | Select | Relevant for diaspora users — where someone grew up affects cultural compatibility | Low | Only shown when Country ≠ India |
| 11 | **Residency Status** | Select | Citizen, Permanent Resident, Work Visa, Student Visa, etc. | Low | Only shown when Country ≠ India |

#### 7.2.7 Family Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 12 | **Family Location** | Select | Where the family is based — high social signal for arranged marriage context | Low |
| 13 | **Family Income** | Range slider | Family's financial status — high social signal | Low |

#### 7.2.8 Derived / Other Premium Filters

| # | Filter Field | Input Type | Why Premium | Dev Effort |
|---|-------------|------------|-------------|------------|
| 14 | **Verification Status** | Toggle | Show only verified profiles — trust signal | — |
| 15 | **Photo Setting** | Toggle | Filter based on photo privacy settings | — |
| 16 | **Horoscope** | Select | Horoscope compatibility filter | — |
| 17 | **Active Members** | Toggle | Show only recently active members | — |

---

### 7.3 Filter Categories — Grouping for UI

Filters should be organized into categories for the full filter panel (separate from the curated Inbox bottom sheet):

| Category | Free Filters | Premium Filters |
|----------|-------------|-----------------|
| **Basic** | Age, Height, Marital Status, Have Children | — |
| **Community** | Religion, Community, Mother Tongue, Manglik Status | — |
| **Education** | Qualification, Education Area | College / Top Colleges 👑 |
| **Career** | Working With, Profession, Working As, Income | Employer 👑 |
| **Location** | Country, State, City | Location (Inbox) 👑, Family Location 👑 |
| **Lifestyle** | Diet, Hobbies & Interests | — |
| **Family** | Family Type, Financial Status | Family Location 👑, Family Income 👑 |
| **Signals** | — | Recently Joined 👑, Online Now 👑, Distance 👑, Premium Profiles 👑 |
| **Activity** | — | Profiles with Photos 👑, Managed By 👑 |
| **NRI** | — | Grew Up In 👑, Residency Status 👑 |
| **Derived** | — | Verification Status 👑, Photo Setting 👑, Horoscope 👑, Active Members 👑 |

> **Stakeholder Decision (Harsh Singh & Radhika Saxena)**: "Top Colleges" should be placed **inside the Education & Profession category**, not as a standalone.

---

## 8. View Toggle — Card vs. List

### 8.1 Specification

| Aspect | Details |
|--------|---------|
| **UI Element** | Segmented control with two options: `Card` and `List` |
| **Placement** | Right-aligned in the sub-header row, next to the Sort dropdown |
| **Default** | Card View (current default) |
| **Persistence** | **Must persist across sessions** — stored in user preferences on backend |
| **Transition** | Instant switch, no loading state needed if data is already loaded |

### 8.2 Card View

- Large profile photo (hero image)
- Key info overlay or below photo: Name, Age, Height, Profession, Location
- Accept / Decline action buttons
- One profile per viewport (swipeable) OR stacked cards

### 8.3 List View

- Compact rows — multiple profiles visible at once
- Thumbnail photo (small, left-aligned)
- Key info: Name, Age, Profession, Location in a single row
- Action buttons (shortlist, accept, decline) accessible via row tap or swipe
- Better for users who want to scan many profiles quickly

### 8.4 Current Problem & Fix

**Problem**: List View toggle is currently hidden inside "Refine" → only ~25% of users discover it. ~8% of females switch to it; negligible for males.

**Fix**: Moving the toggle to the always-visible sub-header will dramatically increase discovery and adoption. The system must remember the user's choice (persist across sessions via backend preference storage).

---

## 9. Inbox-Specific Filter Bottom Sheet

### 9.1 Overview

The Inbox bottom sheet is a **curated, simplified version** of the full filter panel. It surfaces the most impactful filters specifically for the Inbox context, combined with sort options in a single sheet.

### 9.2 Bottom Sheet Layout (from PDF wireframe, page 6)

```
┌──────────────────────────────────────────────────────────┐
│                    Sort & Filter                          │
│                                                          │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │  FILTERS             │  │  SORT BY                 │  │
│  │                      │  │                          │  │
│  │  □ Premium Profiles 👑│  │  ◉ Most Relevant         │  │
│  │  □ Income             │  │  ○ Newest First           │  │
│  │  □ Online Profiles  👑│  │  ○ Oldest First           │  │
│  │  □ Photos           👑│  │                          │  │
│  │  □ Verified         👑│  │                          │  │
│  │  □ Location         👑│  │                          │  │
│  │  □ Religion           │  │                          │  │
│  │  □ Career             │  │                          │  │
│  │                      │  │                          │  │
│  └─────────────────────┘  └──────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │            See 247 Matches →                         ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

### 9.3 Curated Inbox Filters

| # | Inbox Filter | Free / Premium | Priority | Rationale |
|---|-------------|----------------|----------|-----------|
| 1 | **Premium Users** | 👑 Premium | High | High-intent users; premium monetization lever |
| 2 | **Members Online** | 👑 Premium | High | Real-time signal increases engagement |
| 3 | **Members with Photos** | 👑 Premium | High | Quality filter; profiles with photos get far more responses |
| 4 | **Verified Users** | 👑 Premium | Medium | Trust signal |
| 5 | **Income** *(especially for female users)* | Free | High | **Key female decision driver** — income is the #1 filter females want in Inbox |
| 6 | **Location** | 👑 Premium (in Inbox) | High | Location is free elsewhere but premium in Inbox context |
| 7 | **Religion** | Free | Medium | Important cultural filter |
| 8 | **Career** | Free | Medium | Professional background matters for decision-making |

### 9.4 Bottom Sheet UX Behavior

- **Two-column layout**: Left column = Filter checkboxes, Right column = Sort By radio buttons
- **Live match count**: The CTA button at the bottom shows real-time count of profiles matching current filter + sort combination: "See 247 Matches →"
- **Premium filter interaction**: When a free user taps a 👑 filter, the premium paywall/upsell modal triggers
- **Apply action**: Tapping "See X Matches →" applies the filters and closes the sheet
- **Reset option**: A "Reset" or "Clear All" link should be available to remove all filters

---

## 10. Dependent Fields Logic — State Machine

These are critical implementation rules where one filter's selection affects another filter's options or visibility.

### 10.1 Dependency Map

| Dependent Field | Parent Field | Rule | Behavior |
|----------------|-------------|------|----------|
| **Have Children** | Marital Status | Only appears when Marital Status ≠ "Never Married" | If user selects "Never Married" only, the "Have Children" field is **hidden entirely**. If they select any other status (Divorced, Widowed, etc.), "Have Children" appears. If they select both "Never Married" AND another status, it still appears. |
| **Community** | Religion | Community options change based on selected Religion(s) | When Religion is "Hindu", show Hindu communities (Brahmin, Rajput, Maratha, etc.). When multiple religions selected, show union of all their communities. When no religion selected, show all communities. |
| **State** | Country | State options populate based on Country selected | Only show states for the selected country(ies). If no country selected, state field is either hidden or shows a "Select country first" prompt. |
| **City** | Country | City options populate based on Country selected | Show popular cities from ADAPT data for the selected country + full city list via search. If no country selected, show a "Select country first" prompt. |
| **Degree** | Qualification | Degree options populate based on Qualification selected | E.g., if "Masters" is selected, show M.Tech, MBA, M.Sc, etc. If "Undergraduate", show B.Tech, B.Com, B.Sc, etc. |
| **Grew Up In** | Country | Only shown when Country ≠ India | NRI-only filter. If the user's selected country (or their own profile country) is not India, this field appears. |
| **Residency Status** | Country | Only shown when Country ≠ India | Same NRI-only condition as "Grew Up In". |

### 10.2 Dependency Behavior on Change

- **When a parent field changes**: Immediately update the dependent field's options. If the dependent field had a selection that is no longer valid under the new parent selection, **clear that selection** and notify the user subtly.
- **When a parent field is cleared**: Reset the dependent field to its default (no selection) state. If the dependent field should be hidden (like Have Children when only "Never Married" is selected), hide it with a smooth animation.

---

## 11. Filter Display & Personalization Logic

### 11.1 Display Rules for Large Option Sets

Several filter fields have very large option sets (180+ countries, thousands of cities, hundreds of communities). These need smart display logic:

| Filter Field | Display Strategy |
|-------------|-----------------|
| **Country** | Show **Top 7 most popular** countries on Shaadi.com upfront as checkboxes. Below that, a "Search more countries" input field that searches the remaining 180+ countries. |
| **City** | Show **popular cities from ADAPT registration data** for the selected country upfront. Below that, a search field for the full city list. |
| **Mother Tongue** | Show **Top 5 from ADAPT Suggestions API** upfront. Below that, a search field for all other languages. |
| **Community** | Show **Top 5 from ADAPT** for the selected religion(s). Below that, a search field for all communities within those religions. |
| **Profession / Occupation** | Show most common professions upfront. Search for the rest. |
| **Education Area** | Show top education areas upfront. Search for the rest. |

### 11.2 ADAPT-Based Personalization

> **Key Insight**: During the first iteration on ADAPT (the registration flow), the system generates the most relevant filter options for each user. These values are currently **not stored** but represent a significant personalization opportunity.

**Opportunity**: If ADAPT suggestions are stored per user, they can be used to:
- Pre-populate the "Top N" suggestions in each filter field with options most relevant to *this specific user*
- Show the user's own preferences as default suggestions
- Rank filter options by relevance to the user's profile and preferences

### 11.3 Quick Filters — Horizontal Chips

Per **Radhika Saxena's** feedback:

> *"Quick filters should be personalized based on the fields a user frequently edits, allowing them to access these filters easily without having to repeat the same effort each time."*

**Quick Filter Chips** are an optional horizontal scrolling row below the sub-header:

```
┌──────────────────────────────────────────────────────────┐
│  [Age: 25-30] [Hindu] [Mumbai] [Engineer] [+ More]      │  ← Quick Filter Chips
└──────────────────────────────────────────────────────────┘
```

- **Source**: Personalized based on the filters a user most frequently applies
- **Behavior**: Tapping a chip toggles it on/off; tapping "+ More" opens the full filter bottom sheet
- **Persistence**: The system learns which filters a user uses most and surfaces them as quick chips over time

---

## 12. Filter Behavior Rules

### 12.1 Core Rules

| Rule | Details | Rationale |
|------|---------|-----------|
| **Session-Based Persistence** | Filters persist during a browsing session within a listing but **reset upon exit** from the Inbox screen | Users often want a fresh start each visit; avoids confusion from "stale" filters |
| **Soft Filtering (NOT Hard Exclusion)** | Instead of completely hiding non-matching profiles, **"matching" profiles surface first**, followed by others with reduced prominence | Avoids empty result states; users can still see all profiles but with matching ones prioritized |
| **Live Match Count** | Show real-time count of profiles matching the current filter combination, both in the bottom sheet CTA and in the sub-header | Gives users confidence their filters are working; competitive standard (Amazon, Zomato) |
| **Active Filter Visibility** | Applied filters appear as removable chips at the top of the results area for easy modification or removal | Users should always know what filters are active and be able to remove them with one tap |

### 12.2 Soft Filtering — Detailed Behavior

This is a critical design decision that distinguishes Shaadi's approach from hard-filter apps:

- **Matching profiles**: Full visibility, normal card/list rendering, sorted according to current sort preference
- **Non-matching profiles**: Still shown, but either:
  - Appear **after** all matching profiles (section separator: "Other profiles")
  - Appear with **reduced visual prominence** (e.g., slightly dimmed, smaller card)
  - Show a badge: "Doesn't match your filters"
- **Rationale**: In matrimonial context, users sometimes find great matches outside their stated preferences (research shows females override age preference for strong income/profession profiles). Hard filtering would hide these potential matches.
- **Exception**: If the user explicitly wants hard filtering, a toggle like "Only show matches" could be offered (consider for future iteration).

### 12.3 Filter Reset Behavior

- **"Clear All" button** in the filter bottom sheet resets all filters to default state
- **Individual chip removal** (✕ on each chip) removes that specific filter
- **Navigating away** from Inbox and returning resets all filters (session-based)
- **Sort preference** also resets to "Most Relevant" on new session

---

## 13. Premium / Monetization Strategy

### 13.1 Premiumization Approach

Premium filters are a key monetization lever. The strategy:

1. **Crown Icon (👑)**: Every premium filter field displays a crown icon next to its label
2. **Paywall Trigger**: When a free user taps any premium filter, the **premium upsell/paywall flow** activates
3. **Paywall Content**: The upsell modal should communicate the value of the specific filter they tried to use (e.g., "Upgrade to filter by Online Members — find people who are active right now!")
4. **Conversion Tracking**: Track `Premium Conversion from Filter Paywall` as a new metric — which premium filters drive the most conversions

### 13.2 Premium Filter Placement — Two Approaches (Open Decision)

Per Radhika Saxena's feedback, two approaches are being considered:

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **A: Nested within main categories** | Premium filters appear within their parent category (e.g., "College" inside Education) with a 👑 icon | Logical grouping; feels natural; doesn't clutter the UI | Premium filters may be less discoverable |
| **B: Surfaced prominently** | Premium filters get their own section at the top or highlighted area with clear premium branding | Maximum visibility; drives more paywall impressions | May feel pushy; separates logically related filters |

> **Decision Needed**: PM team should decide based on A/B testing or stakeholder alignment. Both approaches could be tested.

### 13.3 Revenue Opportunity Sizing

- **Current filter adoption**: ~5% of DAU
- **Target filter adoption**: 30%+ of DAU
- If 30% of DAU uses filters, and premium filters are prominent, even a small conversion rate on paywall impressions creates meaningful revenue
- **Inbox-specific premium filters** (Premium Users, Online, Photos, Verified, Location) are high-value and high-intent — users who want these filters are already engaged and more likely to convert

---

## 14. User Behavior Insights & Decision Drivers

Understanding what drives accept/reject decisions informs which filters to prioritize and how to design the experience.

### 14.1 Gender-Based Decision Drivers

| User Segment | Primary Decision Drivers | Filter Implication |
|-------------|-------------------------|-------------------|
| **Female Users** | **Income** and **Profession** are the top drivers. Research shows females will override their stated age preference for profiles with strong income/profession. | Income filter should be **free and prominent** in Inbox. Career/Profession filters should be easily accessible. |
| **Male Users** | **Looks** (photos) and **Location** are the top drivers. Males are more visual and proximity-oriented. | Photo filter (premium) and Location filter should be prominent for male users. |
| **Both Genders** | **Religion proximity** — Hindu/Jain/Buddhist/Sikh users show more flexibility between these religions than across other religion boundaries. | Soft religion filtering should account for this — when a Hindu user filters by religion, consider showing Jain/Buddhist/Sikh profiles in the "nearby" or "soft match" section. |

### 14.2 Behavior with Filtered-Out Profiles

- **36% of all connects** come from profiles that don't match the user's stated preferences (Filtered-Out / FO connects)
- FO profiles have very low accept ratios: **2.2% overall** (12% male, 2% female)
- This validates the need for better filtering — users are wasting time on low-relevance profiles
- However, the **12% male FO accept ratio** suggests males are more open to profiles outside preferences → supports soft filtering approach

### 14.3 Implications for Design

1. **Surface Income filter for free** — it's the #1 driver for females, and females are the more selective gender (5.3% accept ratio). Helping females filter effectively improves the overall ecosystem.
2. **Photo filter as premium** — it's a high-value filter for males, and since males are less selective (29% accept ratio), making them pay for precision is a fair monetization lever.
3. **Soft filtering by default** — given the non-trivial FO accept rates (especially 12% for males), hard filtering could eliminate viable matches.
4. **Religion proximity logic** — the soft filtering system should account for the Hindu/Jain/Buddhist/Sikh cluster of flexible intermarriage.

---

## 15. Competitive Benchmarks

The Inbox Experience Study PDF references several competitive design patterns:

### 15.1 Amazon

| Pattern | Relevance to Shaadi |
|---------|-------------------|
| Shows **result count** when filtering (e.g., "Showing 247 of 1,203") | Match count indicator in filter bottom sheet CTA and sub-header |
| Category sidebar on left + filter options on right | Potential pattern for full filter panel (category navigation) |

### 15.2 Zomato

| Pattern | Relevance to Shaadi |
|---------|-------------------|
| Sort by: Relevance, Distance, Rating, Delivery Time, Cost | Similar multi-option sort system |
| **Vertical left-nav** for filter categories | Category sidebar pattern for the filter bottom sheet |
| Combined Sort + Filter in one bottom sheet | Exact pattern proposed for Inbox bottom sheet |

### 15.3 Swiggy

| Pattern | Relevance to Shaadi |
|---------|-------------------|
| Filter tabs with category sidebar | Category-based filter navigation |
| Quick filter chips at top | Quick filter chips for personalized filters |

### 15.4 BigBasket

| Pattern | Relevance to Shaadi |
|---------|-------------------|
| Category sidebar with checkbox-based filters | Simple, familiar filter selection pattern |

### 15.5 Key Takeaway

All four benchmarks use a combination of:
- **Horizontal filter chips** for quick access
- **Category sidebar** for organized filter navigation
- **Live result count** that updates as filters change
- **Sort + Filter in close proximity** (often the same panel/sheet)

Shaadi's design should follow these established patterns that users already understand from other apps.

---

## 16. Edge Cases & Error States

### 16.1 Empty Results

| Scenario | Handling |
|----------|---------|
| Filters produce zero matching profiles | **With soft filtering**: This shouldn't happen (non-matching profiles still show). Show a soft message: "No exact matches, but here are similar profiles" |
| Filters produce very few matches (< 5) | Show the matches with a prompt: "Broaden your filters to see more profiles" + suggestion to relax specific filters |

### 16.2 Filter Conflicts

| Scenario | Handling |
|----------|---------|
| User selects contradictory filters (e.g., Age 18-20 + Income 50L+) | Don't prevent selection; let the low/zero match count communicate the mismatch. Optionally suggest: "Very few profiles match this combination" |
| Dependent field becomes invalid after parent change | Clear the dependent field's selection and show a subtle toast: "Community filter cleared — please re-select based on new religion" |

### 16.3 Performance

| Scenario | Handling |
|----------|---------|
| Filter count query takes too long | Show a loading spinner in the CTA button; timeout after 5 seconds and show estimated count or "See Matches →" without count |
| Very large result sets (10,000+) | Paginate or lazy-load; never try to render all at once |
| User rapidly changes multiple filters | Debounce filter count API calls (300-500ms delay after last interaction before firing the count query) |

### 16.4 Session & Persistence Edge Cases

| Scenario | Handling |
|----------|---------|
| User applies filters, navigates to a profile detail, comes back | Filters should still be active (within-session navigation) |
| User force-closes app while filters are active | On reopen, filters reset (session-based behavior) |
| User has Card/List preference stored, but the feature is rolled back | Gracefully fall back to Card View (default) |
| Premium user downgrades to free while premium filters are active | Filters deactivate gracefully; show a message that premium filters require subscription |

---

## 17. Stakeholder Notes & Open Decisions

### 17.1 Radhika Saxena (Product Manager)

- Initially missed Inbox-specific filters — updated doc to include them
- Quick filters should be **personalized** based on frequently used filter fields
- **Top Colleges** should be inside Education & Profession category (agreed with Harsh Singh)
- Two approaches for premium filter placement: nested within categories (A) or surfaced prominently (B) — needs decision
- Updated prototype for Match Listings shared (Claude artifact)

### 17.2 Harsh Singh

- Top Colleges should be inside Education & Profession category
- Quick filters need to be defined (specific set of quick filters)

### 17.3 Open Decisions Requiring Resolution

| # | Decision | Options | Status |
|---|----------|---------|--------|
| 1 | Premium filter placement approach | A: Nested in categories, B: Surfaced prominently | **Open — needs PM decision or A/B test** |
| 2 | Quick filter chip selection | Which filters become quick chips? Personalized vs. static set? | **Open — Harsh Singh requested definition** |
| 3 | Soft filtering visual treatment | Dimmed cards, section separator, or badge on non-matching profiles | **Open — needs design decision** |
| 4 | Search by Name/Profile ID | Where to place? Inbox sub-header or within filter panel? | **Open — user-requested feature, not yet designed** |
| 5 | Default view (Card vs. List) for new users | Keep Card as default or let user choose during onboarding? | **Open** |
| 6 | NRI filter visibility | Auto-detect based on user's country or always show for all users? | **Open** |

---

## 18. Prototype References

| Prototype | Link | Description |
|-----------|------|-------------|
| Match Listings | [Claude Artifact](https://claude.ai/public/artifacts/9dfdb2e6-dc3e-423d-a2fa-58a7fa8dab82) | Shows the Filters pill + Recommended sort dropdown + Card/List toggle in sub-header |
| Inbox Option 1 | [Claude Artifact](https://claude.ai/public/artifacts/4d0869af-552c-4b11-ab09-948db4baca3f) | Bottom sheet with Sort & Filter combined (two-column layout) |
| Inbox Option 2 | [Claude Artifact](https://claude.ai/public/artifacts/39d9dc6e-720d-49f8-96d4-05918b8617b2) | Alternative inbox filter layout |

> **Note**: Claude artifact links may be inaccessible due to Cloudflare CAPTCHA protection. The PM prototype (Image 1) corresponds to the Match Listings prototype, and PDF wireframes on pages 5-6 show the Inbox bottom sheet designs.

---

## 19. Success Metrics — North Star

| # | Metric | Current | Target | Measurement |
|---|--------|---------|--------|-------------|
| 1 | **Improved Selection Ratio** | Baseline | ↑ Increase | Connects Sent per User after filtering vs. before. **This is the North Star.** |
| 2 | **Filter Adoption Rate** | ~5% of DAU | **30%+ of DAU** | % of daily active users who interact with any filter |
| 3 | **Sort Usage Rate** | ~2% | Significant increase | % of users who change the sort option from default |
| 4 | **Premium Conversion from Filter Paywall** | 0 (new) | Track and optimize | % of free users who hit a premium filter paywall and convert |
| 5 | **List View Adoption** | ~8% F, negligible M | Meaningful increase both genders | % of users who switch to List View |
| 6 | **Filter-Assisted Accept Ratio** | N/A | Higher than overall 7% | Accept ratio for users who actively use filters (should be higher than non-filter users) |

---

## 20. Implementation Summary — What Needs to Be Built

### Layer 1 — New Sub-Header (Below Fixed Tabs)

| Component | Type | Key Behavior | Priority |
|-----------|------|-------------|----------|
| **Filters Button** | Pill/chip (dark bg, white text, funnel icon) | Opens filter bottom sheet; shows active count badge | P0 |
| **Sort Dropdown** | Pill/chip with chevron ("Recommended ▾") | Dropdown with 3 sort options; immediate apply; label updates | P0 |
| **Card/List Toggle** | Segmented control | Switches view; **persists across sessions** (backend preference) | P0 |

### Layer 2 — Filter Bottom Sheet (Inbox-Specific)

| Component | Key Behavior | Priority |
|-----------|-------------|----------|
| **Two-column layout** | Left: Curated filter checkboxes; Right: Sort By radio buttons | P0 |
| **Premium filters with 👑 crown** | Paywall trigger on tap for free users | P0 |
| **Live match count in CTA** | "See X Matches →" updates in real-time | P0 |
| **Curated filter set** | Premium Users, Online, Photos, Verified, Income, Location, Religion, Career | P0 |

### Layer 3 — Full Filter Panel (for Match Listings & advanced use)

| Component | Key Behavior | Priority |
|-----------|-------------|----------|
| **21 Free filters** across 7 categories | Category sidebar + filter options | P1 |
| **17 Premium filters** across 7+ categories | Crown icons + paywall integration | P1 |
| **Dependent field logic** | Have Children → Marital Status, Community → Religion, City → Country, etc. | P1 |
| **Smart display logic** | Top N suggestions from ADAPT + search for large option sets | P1 |

### Layer 4 — Quick Filter Chips (Optional Enhancement)

| Component | Key Behavior | Priority |
|-----------|-------------|----------|
| **Horizontal scrolling chips** | Below sub-header; personalized based on user's frequent filters | P2 |
| **Toggle behavior** | One-tap on/off for each chip | P2 |
| **"+ More" chip** | Opens full filter bottom sheet | P2 |

### Layer 5 — Backend & Infrastructure

| Component | Key Behavior | Priority |
|-----------|-------------|----------|
| **Fix sorting** | All three sort options must produce genuinely different orderings | P0 (Critical) |
| **View preference persistence** | Store Card/List preference in user profile on backend | P0 |
| **Filter count API** | Real-time count of matching profiles for current filter combination | P0 |
| **ADAPT suggestion storage** | Store user's ADAPT suggestions for filter personalization | P2 |
| **Premium paywall integration** | Connect premium filter taps to existing paywall/upsell flow | P0 |
| **Filter analytics** | Track filter usage, paywall impressions, conversions per filter | P0 |

---

## Appendix A — Filter Field Count Summary

| Category | Free | Premium | Total |
|----------|------|---------|-------|
| Basic | 4 | 0 | 4 |
| Community | 4 | 0 | 4 |
| Education | 2 | 1 | 3 |
| Career | 4 | 1 | 5 |
| Location | 3 | 1 | 4 |
| Lifestyle | 2 | 0 | 2 |
| Family | 2 | 2 | 4 |
| Signals | 0 | 4 | 4 |
| Activity | 0 | 2 | 2 |
| NRI | 0 | 2 | 2 |
| Derived | 0 | 4 | 4 |
| **TOTAL** | **21** | **17** | **38** |

## Appendix B — Glossary

| Term | Definition |
|------|-----------|
| **ADAPT** | Shaadi.com's registration flow that collects user preferences and generates initial suggestions |
| **DAU** | Daily Active Users |
| **FO / Filtered-Out** | Profiles that don't match a user's stated partner preferences but are still shown |
| **Inbox** | The main screen where users see received interests, accepted interests, contacts, and sent interests |
| **Soft Filtering** | Filtering approach where matching profiles are prioritized (shown first) but non-matching profiles are still shown below, rather than being completely hidden |
| **Quick Filters** | Horizontal scrolling chips for one-tap access to frequently used filters |
| **Crown (👑)** | Visual indicator that a filter is premium-only; triggers paywall when tapped by free users |
| **ADAPT Suggestions API** | API that returns personalized top suggestions for filter fields based on user's registration data |
| **Selection Ratio** | Number of Connects (interests) Sent per User — the North Star metric for this project |

---

*Document compiled from: Shaadi Filters.pdf, Inbox Experience Study.pdf, PM prototypes, stakeholder discussions (Radhika Saxena, Harsh Singh), competitive research, and user behavior analysis.*
