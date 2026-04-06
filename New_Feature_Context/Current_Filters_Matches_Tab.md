# Shaadi.com — Current Filters: Matches Tab ("Refine")

> **Source**: "Filters in Matches Tab.pdf" — live app screenshot audit  
> **Screen title**: Refine  
> **Toggle at top**: "Get more Matches" (OFF by default)  
> **CTA at bottom**: "Show Matches" (teal pill button)  
> **Default state of all filters**: Open to All

---

## Overview

The "Refine" screen (accessed from the Matches tab) contains **16 filter fields**. All fields default to "Open to All". Each field opens a drill-down sub-screen with specific selectable options. The filters are not organized into categories on this screen — they appear as a flat vertically-scrolling list.

---

## Filter Fields — Full List

| # | Filter Field | Default Value | Icon / Indicator |
|---|-------------|---------------|-----------------|
| 1 | Verification Status | Open to All | Blue checkmark (✔️) |
| 2 | Photo Settings | Open to All | — |
| 3 | Recently Joined | Open to All | — |
| 4 | Active Members | Open to All | — |
| 5 | Annual Income | Open to All | — |
| 6 | Marital Status | Open to All | — |
| 7 | Religion | Open to All | — |
| 8 | Mother Tongue | Open to All | — |
| 9 | Country Living In | Open to All | — |
| 10 | Country Grew Up In | Open to All | — |
| 11 | Education Level | Open to All | — |
| 12 | Education Area | Open to All | — |
| 13 | Working With | Open to All | — |
| 14 | Profession Area | Open to All | — |
| 15 | Profile Managed By | Open to All | — |
| 16 | Eating Habits | Open to All | — |

---

## Filter Options — Per Field

### 1. Verification Status
- Open to All
- *(Presumably: Verified Only)*

---

### 2. Photo Settings
- Open to All
- Visible to all *(~1,100,164 profiles)*
- Protected Photo *(~181,118 profiles)*

---

### 3. Recently Joined
*Input type: Radio button dialog (inline dropdown)*

| Option | Profile Count |
|--------|--------------|
| Open to All | — |
| Within a month | ~227,711 |
| Within a week | ~67,642 |
| Within a day | ~35,480 |

---

### 4. Active Members
- Open to All
- *(Presumably time-based activity options, similar to Recently Joined)*

---

### 5. Annual Income
*Input type: Checkbox list*

| Option | Profile Count |
|--------|--------------|
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

---

### 6. Marital Status
*Input type: Checkbox list*

| Option | Profile Count |
|--------|--------------|
| Open to All | — |
| Never Married | ~742,747 |
| Divorced | ~191,129 |
| Awaiting Divorce | ~29,693 |
| Widowed | ~28,751 |
| Annulled | ~8,417 |

---

### 7. Religion
- Open to All
- Hindu
- Muslim
- Christian
- Sikh
- Parsi
- Jain
- Buddhist
- No Religion
- Spiritual – not religious
- Other

---

### 8. Mother Tongue
- Open to All
- Search-based input with "Suggested for you" personalized suggestions
- Full language list available via search

---

### 9. Country Living In
*Input type: Checkbox list with search*

| Option | Profile Count |
|--------|--------------|
| Open to All | — |
| India | ~322,xxx |
| USA | ~611,xxx |
| UAE | ~248,xxx |
| Canada | ~359,xxx |
| United Arab Emirates | ~29,xxx |
| United Kingdom | ~271,xxx |
| Pakistan | ~17,xxx |
| Australia | ~173,xxx |
| Saudi Arabia | ~96,xxx |
| Bangladesh | ~4,xxx |

---

### 10. Country Grew Up In
- Open to All
- *(Same country list as "Country Living In" — NRI-relevant field)*

---

### 11. Education Level
*Input type: Checkbox list*

| Option | Profile Count |
|--------|--------------|
| Open to All | — |
| Bachelor | ~118,017 |
| Master | ~53,861 |
| High School | ~26,198 |
| Diploma | ~28,792 |
| Doctorate | ~11,845 |
| Associate | ~1,888 |
| Undergraduate | ~760 |
| Less than High School | ~6,870 |

---

### 12. Education Area
- Open to All
- Search-based input
- *(Engineering, Medicine, Commerce, Arts, etc. — search driven)*

---

### 13. Working With
*Input type: Checkbox list*

| Option | Profile Count |
|--------|--------------|
| Open to All | — |
| Private Company | ~1,302,514 |
| Business / Self Employed | ~959,896 |
| Government / Public Sector | ~338,068 |
| Non Working | ~68,439 |
| Defence / Civil Services | ~17,606 |
| Other | ~24,567 |

---

### 14. Profession Area
*Input type: Checkbox list*

| Option | Profile Count |
|--------|--------------|
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

---

### 15. Profile Managed By
*Input type: Checkbox list*

| Option | Profile Count |
|--------|--------------|
| Open to All | — |
| Self | ~163,762 |
| Parent / Guardian | ~108,004 |
| Sibling | ~31,988 |
| Relative | ~23,898 |
| Other | ~6,614 |

---

### 16. Eating Habits
*Input type: Checkbox list*

- Open to All
- Vegetarian
- Eggetarian
- Non Vegetarian
- *(Additional options may exist: Jain, Vegan, Occasionally Non-Veg)*

---

## UI / UX Notes

| Aspect | Details |
|--------|---------|
| **Screen title** | "Refine" |
| **Top toggle** | "Get more Matches" (toggle, default OFF) |
| **Filter layout** | Flat vertical list — no category grouping |
| **Navigation pattern** | Each filter row → opens a drill-down sub-screen |
| **Sub-screen pattern** | Checkbox list or radio dialog with "Cancel / Apply" or "Cancel / OK" buttons |
| **Default state** | All filters = "Open to All" |
| **Bottom CTA** | "Show Matches" (teal pill) |
| **Profile counts** | Shown next to each option in sub-screens (real-time counts) |
| **Input types** | Radio (single-select) for some, Checkbox (multi-select) for most, Search+chips for large datasets |

---

*Sourced from: "Filters in Matches Tab.pdf" — live Shaadi.com app screenshots.*
