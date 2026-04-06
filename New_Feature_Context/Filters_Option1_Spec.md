# Option 1 — Inbox & Matches filter experience (spec)

This document captures the **Option 1** filter structure for the shared **Matches** and **Inbox** filter bottom sheet. **Option 2** and **Option 3** are alternate **layouts** (groupings) over the same underlying filter state for prototyping.

## Naming (product copy)

| Spec term | UI label (recommended) | Alternative |
|-----------|------------------------|-------------|
| Education level | **Highest education** | Education level |
| Education domain | **Field of study** | Education domain |

## Premium markers (Figma)

The following are **visually marked** with a premium/crown affordance in design exploration. **Current build:** all controls remain **fully usable** (no paywall); crowns are decorative only until premium rules are defined.

- Top Colleges  
- Top Matches  
- Recently Active  
- Profile Managed By (when shown in Quick Filters)  
- Premium Profiles  
- Near Me  

## Section order — Option 1

1. **Quick Filters** (top of sheet; fast toggles / chips)  
2. **Basic Details**  
3. **Religion & Community**  
4. **Education**  
5. **Career**  
6. **Location & Family** (includes eating habits)

---

## 1. Quick Filters

| Control | Type | Notes |
|---------|------|--------|
| Verified Profiles | Toggle | |
| Profile with Photos | Toggle | |
| Just Joined Profiles | Toggle | Recently joined |
| Top Colleges | Toggle | Crown (decorative) |
| Top Matches | Toggle | Crown — e.g. high compatibility / score heuristic |
| Recently Active | Toggle | Crown — distinct from “online now” where possible |
| Profile Managed By | Multi-select | All = none selected; Self, Parents, Siblings, Others |
| Premium Profiles | Toggle | Crown |
| Near Me | Toggle | Crown |

**Profile Managed By values:** All (default / empty), Self, Parents, Siblings, Others (maps to underlying Self / Parent / Sibling / Relative+Other in data).

---

## 2. Basic Details

| Field | Control |
|-------|---------|
| Age | Dual-handle slider |
| Height | Dual-handle slider |
| Marital Status | Multi-select: Never Married, Awaiting Divorce, Divorced, Widowed, Annulled |
| Mother Tongue | Searchable multi-select (15+ Indian languages) |

**Mother tongues (minimum set):** Hindi, Marathi, Gujarati, Punjabi, Bengali, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese, Urdu, Konkani, Kashmiri, Sindhi, Sanskrit (extend as needed).

---

## 3. Religion & Community

| Field | Control |
|-------|---------|
| Religion | Multi-select: Open to all = empty; Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Parsi, Jewish, Spiritual (not religious), Other |
| Community | Searchable multi-select; **options depend on selected religions** (union of lists; Hindu-heavy list includes Maratha, Brahmin, Kshatriya, Vaishya, Bania, Kayastha, Yadav, Jat, Gujarati communities, South Indian communities, etc.) |
| Manglik | Single-select: Open to all (null), Don’t know, No, Yes |

---

## 4. Education

| Field | Control |
|-------|---------|
| Highest education | Multi-select: Open to all = empty; Less than high school, High school, Diploma, Associate, Bachelor’s, Master’s, Doctorate, Honors / Professional cert |
| Field of study | Multi-select: Open to all = empty; Engineering, Finance / Commerce, Management, Science, Arts / Design, Medicine, Computers / IT, Law |

---

## 5. Career

| Field | Control |
|-------|---------|
| Working with | Multi-select: Open to all = empty; Private Company, Business / Self Employed, Government / Public Sector, Not working, Defense / Civil Services, Other |
| Profession area | Multi-select: Open to all = empty; Accounting, Banking & Finance, IT & Software Engineering, Medical & Healthcare, Administration & HR, Engineering, Sales & Marketing, Education & Training, Corporate Professionals, Beauty Fashion & Jewellery, BPO KPO & Customer Support, Others, Architecture & Design, Advertising Media & Entertainment, Artists Animators & Web Designers |
| Working as | Searchable multi-select (job titles / roles; grouped in UI where helpful) |
| Annual income (INR) | Dual-handle slider (lakhs) |
| Annual income (USD) | Dual-handle slider ($k) — for NRI / abroad use cases |

**Working as (sample titles):** Banking Professional, Software Consultant, Doctor, Nurse, Civil Engineer, Marketing Professional, Sales Professional, Teacher, Consultant / Supervisor / Team Lead, Admin Professional, Customer Support / KPO Professional, Non-IT Engineer, Medical / Healthcare (Others), Team Member / Staff, Architect, Designer, Lawyer, CA, Data Analyst, Product Manager, HR Professional, Scientist, Researcher, Homemaker, Student, Retired, Other.

---

## 6. Location & Family

| Field | Control |
|-------|---------|
| Country living in | Multi-select — **India first**, then high–Indian-diaspora countries |
| State living in | Multi-select — default all; if countries include India, Indian states first then alphabetical |
| City | Multi-select — default all; if states selected, cities in those states |
| Country grew up in | Multi-select (NRI-oriented) — same country list emphasis |
| Eating habits | Multi-select: Open to all = empty; Non-veg, Occasionally non-veg, Vegetarian, Eggetarian, Vegan, Jain |

**Countries (order):** India, United States, United Arab Emirates, United Kingdom, Canada, Australia, Singapore, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, New Zealand, Ireland, Germany, Netherlands, France, Malaysia, South Africa, Kenya, Tanzania, Uganda, Fiji, Mauritius, Trinidad and Tobago, Other.

---

## Implementation notes (engineering)

- **Community ↔ Religion:** UI shows merged community options for selected religions; empty religion = union of all religion-specific lists (treat as “open to all” for community).  
- **Matchers:** Prototype uses optional `Profile` fields and heuristics (e.g. top colleges list, `astroMatchScore` for “top matches”, `lastActive` for “recently active”).  
- **Income:** INR slider uses lakhs; USD uses thousands USD; matcher respects whichever range is set.

---

## Filter experience versions (bell panel)

| Version | Intent |
|---------|--------|
| **Option 1** | This spec — detailed discovery layout |
| **Option 2** | Decision-funnel style grouping (same state) |
| **Option 3** | Compatibility-first progressive grouping (same state) |
