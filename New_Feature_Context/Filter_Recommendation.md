# Filter System Recommendation: Matches vs. Inbox

> **Principle**: Consistent interaction model + Contextual content  
> **Core idea**: ~80% shared filter surface, ~20% contextual tailoring per tab

---

## Side-by-Side Comparison

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│          MATCHES TAB            │    │           INBOX TAB             │
│   (Exploration / Discovery)     │    │    (Evaluation / Triage)        │
│                                 │    │                                 │
│   User mindset:                 │    │   User mindset:                 │
│   "Who do I want to reach       │    │   "Which of these people        │
│    out to?"                     │    │    should I respond to?"         │
│                                 │    │                                 │
│   User role: SENDER             │    │   User role: RECEIVER           │
│   Pool: Curated for me          │    │   Pool: Raw incoming demand     │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

---

## Filter Bottom Sheet — Layout

### Matches Tab

```
┌──────────────────────────────────────────┐
│  ← Filters                    Clear All  │
├──────────────────────────────────────────┤
│                                          │
│  ┌─ DISCOVERY SIGNALS ───────────────┐   │
│  │                                   │   │
│  │  Recently Joined                  │   │
│  │  ○ All  ◉ This month  ○ This week│   │
│  │                                   │   │
│  │  Active Members                   │   │
│  │  ○ All  ◉ Active recently         │   │
│  │                                   │   │
│  │  Online Now               [ OFF ] │   │
│  │  Verified Only            [ OFF ] │   │
│  │  With Photos              [ OFF ] │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ BASIC DETAILS ──────────────────┐    │
│  │  Age           [22] ━━━━━ [30]   │    │
│  │  Height        [5'0] ━━━━ [5'8]  │    │
│  │  Marital Status       Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ COMMUNITY ──────────────────────┐    │
│  │  Religion             Open to All >   │
│  │  Mother Tongue        Open to All >   │
│  │  Community            Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ LOCATION ───────────────────────┐    │
│  │  Country Living In    Open to All >   │
│  │  Country Grew Up In   Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ EDUCATION & CAREER ─────────────┐    │
│  │  Education Level      Open to All >   │
│  │  Education Area       Open to All >   │
│  │  Working With         Open to All >   │
│  │  Profession Area      Open to All >   │
│  │  Annual Income        Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ LIFESTYLE & OTHER ──────────────┐    │
│  │  Eating Habits        Open to All >   │
│  │  Profile Managed By   Open to All >   │
│  │  Photo Settings       Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │       Show 247 Matches →         │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### Inbox Tab

```
┌──────────────────────────────────────────┐
│  ← Filters                    Clear All  │
├──────────────────────────────────────────┤
│                                          │
│  ┌─ QUICK TRIAGE ────────────────────┐   │
│  │                                   │   │
│  │  Within My Preferences    [ ON  ] │   │
│  │  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  │   │
│  │  Instantly filters out the ~36%   │   │
│  │  of requests that don't match     │   │
│  │  your partner preferences         │   │
│  │                                   │   │
│  │  Mutual Interest          [ OFF ] │   │
│  │  You shortlisted them too         │   │
│  │                                   │   │
│  │  With Message             [ OFF ] │   │
│  │  Sent a personalised message      │   │
│  │                                   │   │
│  │  Verified Only            [ OFF ] │   │
│  │  With Photos              [ OFF ] │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ BASIC DETAILS ──────────────────┐    │
│  │  Age           [22] ━━━━━ [30]   │    │
│  │  Height        [5'0] ━━━━ [5'8]  │    │
│  │  Marital Status       Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ COMMUNITY ──────────────────────┐    │
│  │  Religion             Open to All >   │
│  │  Mother Tongue        Open to All >   │
│  │  Community            Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ LOCATION ───────────────────────┐    │
│  │  Country Living In    Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ EDUCATION & CAREER ─────────────┐    │
│  │  Education Level      Open to All >   │
│  │  Education Area       Open to All >   │
│  │  Working With         Open to All >   │
│  │  Profession Area      Open to All >   │
│  │  Annual Income        Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ LIFESTYLE & OTHER ──────────────┐    │
│  │  Eating Habits        Open to All >   │
│  │  Profile Managed By   Open to All >   │
│  │  Photo Settings       Open to All >   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │     Show 5 of 7 Requests →       │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

---

## Sort Options — Per Tab

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│     MATCHES — Sort Dropdown     │    │      INBOX — Sort Dropdown      │
├─────────────────────────────────┤    ├─────────────────────────────────┤
│                                 │    │                                 │
│  ◉ Recommended        (default) │    │  ◉ Recommended        (default) │
│  ○ Newest Profiles              │    │  ○ Newest Received              │
│  ○ Nearest to Me                │    │  ○ Oldest Received              │
│                                 │    │  ○ Expiring Soon                │
└─────────────────────────────────┘    └─────────────────────────────────┘

  Matches sort = discovery-oriented      Inbox sort = triage-oriented
  "Who is new / nearby?"                 "What needs attention first?"
```

---

## Field-by-Field Breakdown

### Shared Core Filters (present in BOTH tabs)

| # | Filter Field | Input Type | Rationale |
|---|-------------|-----------|-----------|
| 1 | Age | Range slider | Universal compatibility criterion |
| 2 | Height | Range slider | Universal compatibility criterion |
| 3 | Marital Status | Multi-select checkboxes | Universal compatibility criterion |
| 4 | Religion | Multi-select checkboxes | Fundamental cultural filter |
| 5 | Mother Tongue | Search + checkboxes | Fundamental cultural filter |
| 6 | Community | Search + checkboxes | Fundamental cultural filter |
| 7 | Country Living In | Search + checkboxes | Location matters everywhere |
| 8 | Education Level | Multi-select checkboxes | Key partner evaluation criterion |
| 9 | Education Area | Search + checkboxes | Key partner evaluation criterion |
| 10 | Working With | Multi-select checkboxes | Career matters everywhere |
| 11 | Profession Area | Search + checkboxes | Career matters everywhere |
| 12 | Annual Income | Range or bands | Top decision driver (especially for women) |
| 13 | Eating Habits | Multi-select checkboxes | Lifestyle compatibility |
| 14 | Profile Managed By | Multi-select checkboxes | Indicates seriousness / context |
| 15 | Photo Settings | Multi-select checkboxes | Trust / quality signal |
| 16 | Verified Only | Toggle | Trust signal |
| 17 | With Photos | Toggle | Quality signal |

---

### Matches-Only Filters (top section, "Discovery Signals")

| # | Filter Field | Input Type | Why ONLY in Matches |
|---|-------------|-----------|---------------------|
| 1 | **Recently Joined** | Radio (All / Month / Week / Day) | Helps discover fresh profiles. Irrelevant in Inbox — they already sent you a request regardless of when they joined. |
| 2 | **Active Members** | Toggle | Avoids sending connects to dead profiles. Irrelevant in Inbox — they just sent you a request, they're active by definition. |
| 3 | **Country Grew Up In** | Search + checkboxes | NRI discovery filter. Lower priority in Inbox triage — "where they live now" matters more when evaluating incoming requests. |

---

### Inbox-Only Filters (top section, "Quick Triage")

| # | Filter Field | Input Type | Why ONLY in Inbox |
|---|-------------|-----------|-------------------|
| 1 | **Within My Preferences** | Toggle (ON/OFF) | **The single most impactful filter.** Instantly removes ~36% of inbox noise (filtered-out profiles with 2.2% accept rate). Doesn't exist in Matches because "My Matches" already IS preference-matched. |
| 2 | **Mutual Interest** | Toggle | Surfaces people you've also shortlisted/viewed. No equivalent in Matches — you haven't interacted with those profiles yet. |
| 3 | **With Message** | Toggle | Prioritises requests that include a personalised message — signals effort and intent. Connects don't carry messages in the Matches tab. |

---

## Why This Split Matters — The Data

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   INBOX WITHOUT "Within My Preferences" toggle:                 │
│                                                                 │
│   ████████████████████████████████████████  100% of requests    │
│   ████████████████████████░░░░░░░░░░░░░░░                       │
│   ├──── 64% within prefs ────┤├ 36% FO ─┤                      │
│                                  │                              │
│                                  └── 2.2% accept rate           │
│                                      (wasted user effort)       │
│                                                                 │
│   INBOX WITH "Within My Preferences" ON:                        │
│                                                                 │
│   ████████████████████████               64% shown              │
│   ├──── All within prefs ────┤                                  │
│                  │                                               │
│                  └── ~7% accept rate                             │
│                      (3x more efficient)                        │
│                                                                 │
│   One toggle. 36% less noise. 3x better accept rate.            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sub-Header — How It Looks on Each Tab

### Matches Tab

```
┌──────────────────────────────────────────────────────┐
│  Matches                                    Q   🔔   │
├──────────────────────────────────────────────────────┤
│  🔽         ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  Filter  │  New (3)  │ │Daily (10)│ │My Matches│  │
│  icon       └──────────┘ └──────────┘ └──────────┘  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────┐ ┌─────────────────┐  ┌──────┬─────┐ │
│  │ 🔽 Filters │ │ Recommended  ▾  │  │ ▦▦ │ ☰  │ │
│  └────────────┘ └─────────────────┘  └──────┴─────┘ │
│                                                      │
│  No contextual chips needed — tabs already segment   │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│           [ Profile Card ]                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Inbox Tab

```
┌──────────────────────────────────────────────────────┐
│  Inbox                                      Q   🔔   │
├──────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌──────────┐ ┌────────┐ ┌─────┐     │
│  │Received(7)│ │Accepted  │ │Contacts│ │Sent │     │
│  └───────────┘ └──────────┘ └────────┘ └─────┘     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────┐ ┌─────────────────┐  ┌──────┬─────┐ │
│  │ 🔽 Filters │ │ Recommended  ▾  │  │ ▦▦ │ ☰  │ │
│  └────────────┘ └─────────────────┘  └──────┴─────┘ │
│                                                      │
│  Contextual quick-chip (always visible):             │
│  ┌─────────────────────────┐                         │
│  │ ✓ Within My Preferences │  ← teal active chip     │
│  └─────────────────────────┘                         │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│           [ Profile Card ]                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Summary — What's Same, What's Different

```
                    ┌─────────────────────────────┐
                    │      MATCHES + INBOX         │
                    │      (SAME — 17 fields)      │
                    │                               │
                    │  Age, Height, Marital Status  │
                    │  Religion, Mother Tongue      │
                    │  Community, Country Living In │
                    │  Education Level & Area       │
                    │  Working With, Profession     │
                    │  Annual Income                │
                    │  Eating Habits                │
                    │  Profile Managed By           │
                    │  Photo Settings               │
                    │  Verified Only, With Photos   │
                    │                               │
                    └──────────┬──────────┬─────────┘
                               │          │
              ┌────────────────┘          └────────────────┐
              │                                            │
  ┌───────────┴───────────┐                ┌───────────────┴───────────┐
  │   MATCHES ONLY        │                │      INBOX ONLY           │
  │   (3 extra fields)    │                │      (3 extra fields)     │
  │                       │                │                           │
  │  • Recently Joined    │                │  • Within My Preferences  │
  │  • Active Members     │                │  • Mutual Interest        │
  │  • Country Grew Up In │                │  • With Message           │
  │                       │                │                           │
  │  SORT:                │                │  SORT:                    │
  │  • Recommended        │                │  • Recommended            │
  │  • Newest Profiles    │                │  • Newest Received        │
  │  • Nearest to Me      │                │  • Oldest Received        │
  │                       │                │  • Expiring Soon          │
  └───────────────────────┘                └───────────────────────────┘
```

---

*This gives ~80% shared surface (consistency, dev efficiency, user familiarity) with ~20% contextual tailoring (dramatically better UX for each tab's job-to-be-done).*
