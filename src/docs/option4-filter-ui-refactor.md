# Option 4 Filter UI Refactor Context

This document is a working context file for the **Option 4 filter UI refactor**.

Purpose:
- Capture the current UI state
- Record all visual and interaction issues discovered during iteration
- Preserve design decisions already agreed
- Keep a running list of pending changes before the final refactor pass

This is intentionally a living document and should be updated as new UI feedback comes in.

## Scope

Primary implementation file:
- `src/app/components/filters/SharedFilterBottomSheet.tsx`

Supporting filter config:
- `src/app/components/filters/sharedFilters.ts`

Existing behavior/rules doc:
- `src/docs/option4-filter-ui-rules.md`

## Current Product Context

We are working on:
- `Option 4 – Redesigned discovery`

The filter sheet is a two-pane bottom sheet:
- Left panel: category navigation
- Right panel: active category content

The current work is not only about adding fields.
It has now become a broader **UI consistency and refactor task**.

## What Has Already Been Changed

The following Option 4 changes are already in place:

### Filter content and categories
- Basic Details includes `Marital Status` and `Has Children`
- Location supports:
  - Country Living In
  - State Living In
  - City Living In
  - Country grew up in
  - Residency Status
- Religion values updated
- Mother Tongue values updated
- Community values updated
- Education updated to:
  - Education Level
  - Education Area
- Career updated to:
  - Working With
  - Professional Area
- Family updated to:
  - Family Type
  - Financial Status
  - Family Location
- Lifestyle removed and replaced with:
  - Diet
  - Hobbies & Interests
- Astro Details removed from Option 4

### Footer / bottom action area
- Bottom CTA area converted into a floating pill/island style layout
- Close button moved into the sheet header
- `Show Matches` CTA text behavior:
  - default: `Show Matches`
  - with selected filters: `Show X Matches`

### Dependency-state treatment
- `State Living In`, `City Living In`, and `Country grew up in` now use a blocked placeholder-card treatment instead of the older white overlay pill
- `Residency Status` is no longer treated as a blocked dependency card
- `Residency Status` should appear only when a non-India country is selected

## Why A Refactor Is Needed

The UI has evolved through multiple iterative edits.
Because of that, several render paths now behave differently even though they should look the same.

The current issues are not one single bug.
They are mostly **consistency issues across shared patterns**.

## Refactor Goals

The final refactor should make the filter sheet feel like one coherent system.

Primary goals:
- Normalize paddings and spacing
- Normalize checkbox row layout
- Normalize premium crown/icon placement and sizing
- Normalize search bar layout and visual style
- Normalize right-pane section headers
- Normalize handling of multi-line checkbox rows with subtext
- Remove visible scrollbars while preserving scroll behavior
- Reduce custom visual drift between generic and custom pane renderers

## Current UX / UI Problems To Fix

### 1. Scrollbar visibility
- Visible scrollbars are appearing in:
  - left category panel
  - right content panel
- Requirement:
  - hide scrollbars visually
  - keep scrolling functional

### 2. Right-side pane headers are inconsistent
- Some right-side panes have a header
- Some panes do not
- Some panes rely on implicit labels instead of a visible section header
- Requirement:
  - every right-side subpage should have a consistent visible header treatment
  - header typography, spacing, and placement should be standardized

### 3. Checkbox rows are inconsistent
- Padding around checkboxes is inconsistent
- Checkbox vertical alignment changes between rows
- Premium rows and non-premium rows do not align consistently
- Multi-line rows and single-line rows use different spacing systems
- Requirement:
  - one standard checkbox row layout system

### 4. Premium crown/icon is inconsistent
- Crown size varies
- Crown placement varies
- Right-side spacing around crown varies
- Some premium rows feel cramped or misaligned
- Requirement:
  - one consistent crown size and placement pattern

### 5. Search bars are inconsistent
- Search bars appear with slightly different spacing depending on the pane
- Search placement and relationship to headers is inconsistent
- Requirement:
  - one search bar pattern across all panes

### 6. Rows with subtext are not handled well
- `Financial Status` is the clearest example
- Multi-line rows currently feel visually broken
- Description line wrapping is not well balanced
- Checkbox, label, count, crown, and description do not form a stable layout
- Requirement:
  - create a standard “checkbox row with subline” layout

### 7. Basic Details premium checkbox rows need cleanup
- `Profile Managed By` rows show clear spacing problems
- Premium icon padding from the right edge is not right
- Crown alignment is unstable
- Requirement:
  - make Basic Details follow the same checkbox row system as the rest of the sheet

### 8. Footer / floating pill still needs final polish
- The floating footer has been iterated multiple times
- It still needs exact final tuning against the final UI reference
- Requirement:
  - keep collecting footer adjustments here until final design is locked

### 9. Dependency placeholder cards need final standardization
- The dashed placeholder cards are now present, but this should become a proper reusable UI pattern
- Font size, padding, border weight, dash spacing, radius, and copy style should all be standardized
- Requirement:
  - one reusable dependency placeholder component/style

### 10. Left sidebar category rows need consistency review
- Category row heights and typography should feel visually uniform
- Active indicator, count badge, and premium crown need consistent positioning
- Multi-line category labels like `Mother Tongue` and `Hobbies & Interests` need stable vertical rhythm
- Requirement:
  - one consistent left-nav row layout system

### 11. Range sections need to be visually aligned with checkbox sections
- Slider sections currently have their own spacing and header rhythm
- They should still feel like part of the same right-pane system
- Requirement:
  - normalize spacing around range headers, slider values, slider track, and the next section

## Known Render Paths That Need Harmonization

The current UI is rendered through multiple paths inside `SharedFilterBottomSheet.tsx`.

Shared/generic paths:
- `Checkbox`
- `LabelWithCount`
- `OptionLabel`
- `RadioDot`
- `renderFilterFlat`
- `renderFilterProgressive`
- `ProgressiveMultiSelect`
- `ChipSelect`
- slider/range rendering inside `renderFilterFlat`

Pane wrappers:
- `RightPaneFlat`
- `RightPaneSubSectioned`
- `RightPaneProgressive`

Option 4 custom panes:
- `RightPaneOption4Quick`
- `RightPaneOption4Location`
- `RightPaneOption4Income`
- `RightPaneOption4Community`
- `RightPaneOption4Family`

Likely reason for inconsistency:
- layout decisions are duplicated across generic and custom renderers
- spacing rules are not centralized enough

## Important Current Implementation Reality

The current sheet already contains the seeds of a reusable system, but they are not fully normalized yet.

Examples:
- There is a shared `Checkbox` primitive, but row layout around it varies by renderer
- There is a shared `OptionLabel` helper, but subline rows still do not feel stable everywhere
- Premium crown rendering appears in multiple places with different sizes/margins
- Search bars are repeated across generic and custom panes instead of using one shared search-row pattern
- The left and right scroll containers both currently use `overflow-y-auto`, which is why visible scrollbars are appearing

This means the final refactor should not just patch paddings.
It should consolidate the design language around a small number of shared row/header/search primitives.

## Refactor Direction

When we do the actual refactor, the preferred approach is:

1. Audit the current repeated UI patterns
2. Extract consistent layout primitives where possible
3. Unify row spacing and header spacing first
4. Then normalize premium rows, search bars, and subtext rows
5. Then do a final visual pass on the footer island

The intent is:
- fewer special-case styles
- fewer one-off spacing values
- more shared row/header/search primitives

Suggested order for the actual refactor:
1. Hide scrollbars in both panes without affecting scroll
2. Define standard header styles
3. Define standard checkbox row styles
4. Define standard checkbox row with subline styles
5. Standardize premium crown placement/sizing
6. Standardize search bar spacing and visuals
7. Standardize dependency placeholder card
8. Revisit footer island as the final visual pass

## Footer / Island Notes

Current footer behavior:
- floating bottom action island
- `Clear All` on left
- `Show Matches` on right
- bottom inset reserved for iOS home indicator

Current footer implementation characteristics:
- outer pill is absolutely positioned
- CTA width is currently content-driven
- outer stroke and shadow have been iterated several times
- footer still needs exact design lock before final refactor

Recent footer feedback already addressed in iteration:
- moved close action into top-right header
- kept `Show Matches` text on one line
- changed CTA sizing and outer pill sizing
- adjusted screen edge inset
- adjusted stroke darkness multiple times

More footer tweaks may still come before final lock.

Footer decisions that should be captured before final refactor:
- final island height
- final horizontal inset from screen edge
- final outer stroke color
- final shadow strength
- final `Clear All` color and weight
- final CTA left/right padding
- final CTA width behavior when count changes

## Dependency Placeholder Notes

Current intended behavior:
- `State Living In` is blocked until at least one country is selected
- `City Living In` is blocked until at least one state is selected
- `Country grew up in` is blocked until a non-India country is selected
- `Residency Status` is not a blocked dependency card and should simply appear when applicable

Current visual direction:
- blocked state uses a rounded dashed placeholder card
- placeholder copy should be smaller and lighter than regular content
- border should be thin with more space between dashes
- padding should be tight enough that the card does not feel oversized

This should become a reusable pattern, not a one-off inside the location pane.

## Proposed Final UI Primitives

The final refactor should try to normalize around these primitives:

### 1. Pane header
- consistent font size
- consistent weight
- consistent top/bottom spacing
- optional premium crown placement

### 2. Search row
- consistent input height
- consistent icon size
- consistent inset/padding
- consistent spacing below header

### 3. Checkbox row
- fixed control size
- fixed row vertical alignment
- consistent gap between label block and right-side control
- consistent right-side control slot
- profile count should appear immediately after the label
- profile count should use a smaller visual treatment than the main label
- profile count alignment should feel visually centered and stable within the row

### 3a. Primary checkbox variant for filter sheet
- The filter sheet should use a dedicated checkbox-row variant as the primary pattern
- Label/content should be on the left side
- Right-side control should be aligned at the far right end
- This should become the default checkbox row pattern across the entire filter sheet
- Profile count should appear directly after the label in this same left-side content area
- Count should be smaller than the main label but still visually aligned properly

Premium behavior for this variant:
- Free / open rows should use the normal checkbox control on the right
- Premium-locked rows should use the premium icon itself as the right-side control
- The rest of the row layout stays the same
- Premium state should not introduce a second crown slot or a different row structure

### 4. Checkbox row with subline
- fixed primary line spacing
- fixed secondary line spacing
- no overlap between count, crown, and subline
- count placement should remain stable even when a description/subline is present

### 5. Dependency placeholder card
- dashed stroke style
- standard radius
- standard copy size
- standard padding

### 6. Left-nav category row
- consistent height
- stable active bar
- stable count badge slot
- stable premium crown slot

### 7. Footer island
- standard outer pill
- standard text action style
- standard primary CTA style
- stable behavior with changing count text

## Pending Changes Not Yet Implemented

These are pending and should remain here until finalized:

### Pending refactor work
- Remove visible scrollbars from both panes
- Standardize all right-pane headers
- Finish standardizing checkbox row spacing across all pane types
- Roll the dedicated primary checkbox-row variant through any remaining outlier panes
- Standardize premium crown design/placement
- Standardize search bar design/placement
- Properly handle multi-line rows with descriptions
- Normalize Basic Details premium rows
- Standardize dependency placeholder card
- Standardize left navigation row alignment
- Standardize slider section spacing
- Standardize footer island visuals after final UI approval

### Pending final UI decisions
- Final right-pane header spec
- Final checkbox row spacing spec
- Final primary checkbox-row spec:
  - label left / control right
  - free rows use checkbox on the right
  - premium-locked rows use premium icon as the right-side control
  - profile count appears directly after the label in a smaller visual style
- Final premium icon spacing spec
- Final search bar spacing spec
- Final floating footer visual spec
- Final dependency placeholder card spec
- Final left-nav row spec
- Final multiline/subline checkbox row spec

## Acceptance Checklist For Final Refactor

The final refactor should be considered complete only when:

- no visible scrollbars remain in the left or right panes
- every right-side page shows a consistent header treatment
- every checkbox row uses the same spacing logic
- the primary checkbox variant is used consistently across the filter sheet
- profile counts appear consistently after labels with the same smaller visual treatment
- every premium checkbox row uses the same crown size and alignment
- premium-locked rows use the premium icon as the row’s right-side control instead of a separate inconsistent layout
- multiline/subline rows are visually stable
- search bars feel identical across panes
- dependency placeholder cards match one visual spec
- left sidebar rows feel consistent, including multi-line labels
- footer island matches the final approved visual
- no pane-specific implementation visually drifts from the shared design system

## Latest Captured Feedback

### Feedback
- Small UI misses remain across paddings and row spacing
- Scrollbars on both panes should be hidden
- Every right-side subpage should have a header
- Premium crown, checkbox, and search bar should all be visually constant
- Financial Status shows that subline rows are not handled properly
- Basic Details `Profile Managed By` rows show padding and crown alignment problems
- Dependency placeholders should use a smaller, tighter dashed-card treatment
- `Residency Status` should not be presented like a blocked dependency card
- Checkbox design should be refactored into a dedicated filter-sheet variant
- In that variant, label/content should sit on the left and the checkbox should sit on the far right
- For premium-locked rows, the premium icon should become the right-side control while the row layout stays unchanged
- Profile count after the label is part of the row pattern and should be handled consistently, with smaller type but proper visual alignment

### Decision
- Treat final cleanup as a real UI refactor, not patchwork
- Keep collecting feedback in this doc until the UI is locked

### Status
- pending final refactor

## Process Note

Do not treat this file as the source of implementation truth.
This is the **context + refactor planning log**.

Implementation truth still lives in:
- `SharedFilterBottomSheet.tsx`
- `sharedFilters.ts`
- `option4-filter-ui-rules.md`

## Update Instructions

When new feedback is provided:
- append it here under the correct section
- mark whether it is:
  - already implemented
  - pending
  - awaiting final design confirmation

Suggested format for future additions:

### Feedback
- short statement of issue

### Decision
- what is agreed

### Status
- pending / implemented / blocked
