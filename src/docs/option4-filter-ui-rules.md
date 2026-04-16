# Option 4 Filter UI Rules

This document defines the agreed UI behavior for **Option 4 – Redesigned discovery** in the Matches filter bottom sheet.

## Scope

- UI file: `src/app/components/filters/SharedFilterBottomSheet.tsx`
- Filter definitions/catalog: `src/app/components/filters/sharedFilters.ts`
- Shared catalog values: `src/data/filterOptionCatalog.ts`

## Basic Details Rules

- `Marital Status` and `Has Children` must be visible in Option 4 Basic Details.
- Do not conditionally hide `Has Children` in Option 4 based on marital status.

## Location Rules (Option 4)

Sections in order:
1. Country Living In
2. State Living In
3. City Living In
4. Country grew up in
5. Residency Status

Dependency behavior:
1. `State Living In` depends on selecting at least one `Country Living In`.
2. `City Living In` depends on selecting at least one `State Living In`.
3. `Country grew up in` depends on selecting at least one non-India country in `Country Living In`.
4. `Residency Status` depends on selecting at least one non-India country in `Country Living In`.

Locked dependency UI behavior:
1. Dependent sections remain visible even when blocked.
2. Blocked sections are dimmed (`opacity` reduced).
3. A white overlay is shown on top.
4. Overlay contains an italic pill message explaining the prerequisite.

State-clearing behavior:
1. If `Country Living In` becomes empty, clear `State Living In` and `City Living In`.
2. If `Country Living In` has no non-India country, clear `Country grew up in` and `Residency Status`.

## Religion Rules (Option 4)

`Religion` options:
1. Hindu
2. Muslim
3. Christian
4. Sikh
5. Parsi
6. Jain
7. Buddhist
8. Jewish
9. No Religion
10. Spiritual - not religious
11. Other

`Manglik` options:
1. Yes
2. No
3. Don't Know

Important:
1. Option 4 Religion must not be narrowed by prototype persona filtering.
2. Use `skipResolve: true` on Option 4 religion filter definition.

## Family Rules (Option 4)

Sections in order:
1. Family Type
2. Financial Status
3. Family Location

Behavior:
1. Do not render separate `Family State` or `Family City` sections in Option 4.
2. Rename copy from "Family's country" to `Family Location`.
3. `Family Location` is search-first:
4. Show search bar immediately.
5. Before user types in search, do not render the city option list.

## Diet / Hobbies Rules (Option 4)

1. Remove `Lifestyle` as a left-panel category.
2. Add separate left-panel category `Diet` with a single `Diet` checkbox section.
3. Add separate left-panel category `Hobbies & Interests` with a single searchable checkbox section.
4. Order should be `Diet` first, then `Hobbies & Interests`.
5. Remove `Astro Details` category from Option 4.

## Checkbox List Rules (View More + Search)

For checkbox-style option lists:
1. If total options are `<= 5`, show full list and no `View More`.
2. If total options are `> 5`, show `View More`; collapsed state shows first 5.
3. If total options are `> 10`, show search bar.

For checkbox labels/count formatting:
1. Every checkbox option label must include a profile count suffix in parentheses.
2. Format must be: `Label (count)` for every checkbox filter option.
3. This rule applies across all filter panes (including single-section panes like Community).
4. If a new option is added, add its count in config at the same time.

## View More Visibility Rule (Pane-level)

`View More` should appear only when the right pane has multiple sections/types of filters.

1. If the pane effectively has a single section (example: only Community list), do not show `View More`.
2. If the pane has multiple sections, `View More` can appear (subject to list-size thresholds above).

## Residency Status Notes

`Residency Status` is currently modeled as:
1. Multi-select
2. Premium filter
3. Values:
   1. Citizen
   2. Permanent Resident
   3. Student Visa
   4. Temporary Visa
   5. Work Permit

## Implementation References

If behavior regresses, check these areas first:
1. `resolveFilterDefinition()` and prototype preference filters in `SharedFilterBottomSheet.tsx`
2. Option 4 category blocks in `sharedFilters.ts`
3. Custom Option 4 pane renderers:
   1. `RightPaneOption4Location`
   2. `RightPaneOption4Community`
4. Generic checkbox renderers:
   1. `renderFilterFlat`
   2. `ProgressiveMultiSelect`
