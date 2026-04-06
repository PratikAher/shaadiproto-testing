**Add your own guidelines here**

Hello world from cursor

# Design System Guidelines

## Typography

- **Font Family:** Roboto (Imported via Google Fonts).
- **Weights:** Full range available (100, 300, 400, 500, 700).
- **Size Scale:**
  - `text-xs` (12px) to `text-3xl` (32px).
  - **Sizes larger than 3xl are excluded from the system.**
- **Accessibility:** Ensure sufficient contrast between text and background.

## Color System

- **Primary Brand:** Cyan (#0AA4B8).
- **Secondary:** Neutral Slate.
- **Accent:** Coral Red (#FF5A60).
- **Success:** Emerald (#10b981).
- **Warning:** Amber (#f59e0b).
- **Dark Mode:** Primary remains Brand-500, Secondary shifts to Neutral-800.

## Shapes & Radii

- **Buttons:** Full Pill (`rounded-full`).
- **Inputs:** 16px Corner Radius (`rounded-[16px]`).
- **Cards/Containers:** 24px Corner Radius (`rounded-3xl` / 1.5rem).

## Iconography

When adding or replacing icons:

1.  **Format:** Provide **React Components** (JSX/TSX) or standard **SVG** files.
2.  **Style:**
    - **Stroke:** 2px width (or consistent with Lucide icons).
    - **Size:** ViewBox `0 0 24 24`.
    - **Color:** Use `currentColor` for strokes so they adapt to text color.
3.  **States:**
    - If using outline vs. filled icons, provide both versions clearly named (e.g., `HeartIcon`, `HeartFilledIcon`).
4.  **Process:**
    - **Upload:** Provide the SVG code or file content.
    - **Clean:** Remove hardcoded hex codes (replace with `currentColor`).
    - **Flattening:** Flatten groups (`<g>`) if possible to reduce DOM size, but not strictly required if paths are clean.

---

## 🤖 AI Workflow Protocols (For Figma Make)

When you generate or update code, you **MUST** perform these cleanup actions:

1.  **Update Changelog:** Append a summary of your changes to `CHANGELOG.md`.
2.  **Log Assets:** If you used a new icon or image, add it to `ASSETS_LOG.md` as a checklist item.
3.  **Check Tokens:** Verify your colors and fonts match the "Design System Guidelines" above.