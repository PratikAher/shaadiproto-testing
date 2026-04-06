# MeowUI - Master Project Context

## 1. Project Identity
* **Goal:** High-fidelity prototyping tool for "MeowUI" (Matrimony/Dating App).
* **Nature:** Prototype ONLY. No backend, no auth, no real database.
* **Target Audience:** Product designers & stakeholders (for decision making).

## 2. Tech Stack & Architecture
* **Web (Source):** React, TypeScript, Tailwind CSS v4, Vite.
* **Mobile (Target):** Native iOS (SwiftUI) and Native Android (Jetpack Compose).
* **Data Strategy:** Hardcoded dummy data in `src/data/users.ts`. NO API calls.
* **Image Strategy:**
    * **Current:** Use placeholders or local assets in `src/assets`.
    * **Goal:** Real images must be bundled with the app (no external URLs).

## 3. The "Hybrid" Workflow Rules
* **Source of Truth:** The React code in `src/` is the visual reference.
* **Design Tokens:** Strict adherence to `Guidelines.md` (Typography, Colors, Shapes).
* **Asset Handshake:**
    * **Figma Make:** If you add a new icon, list it in `ASSETS_LOG.md`.
    * **Cursor:** Check `ASSETS_LOG.md` to see if assets are ready to be used in Native code.