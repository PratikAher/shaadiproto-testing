# The fastest way to prototype on Shaadi

---

In our [previous post](LINK_TO_PREVIOUS_POST), we explored using Cursor and Xcode to build a design sandbox — a high-fidelity replica of the app that anyone could interact with. The output was promising, but the adoption challenge was clear: IDEs are not tools that PMs, designers, or stakeholders should need to learn.

To solve for that, we built the entire thing inside **Figma Make.**

No setup. No IDE. No terminal. Open it and start building.

> **[IMAGE: Glimpse of the prototype — the app running on a phone]**

---

### See it live

Scan the QR. Add it to your home screen. Experience it as the actual app.

> **[QR CODE IMAGE + LINK TO PROTOTYPE]**
>
> _Some features are still work in progress._

---

### How we built it

**Design system first.**
We created a dedicated design system file with everything baked in — the complete color library, typography scale, and icon system. Every prototype built on top of this will be on-brand from the start.

> **[IMAGE: Design system file — colors, typography, icons]**

**Every core flow of the app.**
We rebuilt the key journeys end to end:
✅ Registration & Onboarding
✅ SIA Onboarding
✅ Matches
✅ Inbox
✅ Chat
✅ AI Assistant (SIA)
✅ Premium Screen

> **[IMAGE/GIF: Core flows overview]**

**Real data to simulate the real experience.**
50+ female profiles and one current user profile — with photos, profile details, and all data points. The prototype doesn't feel like a prototype. It feels like the app.

We also added a **Premium / Free toggle** so you can experience the app as either a free user or a premium user.

> **[IMAGE: Premium vs Free mode toggle]**

**Built-in capabilities:**
- **Theming** — Dark mode and Light mode
- **Desktop support** — Expand the window and it adapts to a full desktop layout
- **Language support** — Switch languages and see how the UI responds

> **[IMAGE: Dark mode / Light mode + Desktop + Language]**

Under the hood, this is built using Figma Make's code environment. Every component is real, responsive, and stateful — not static screens stitched together with hotspots. Interactions, animations, and state transitions all work exactly as they would in the actual app.

---

### Demo: "Let's add a game in our chat"

To show what building with this looks like in practice — here's a quick demo.

> **[VIDEO: Demo of building a new feature using the prototype kit]**

---

### Why this matters

**For Product Managers**
Your prototypes will be on-brand by default. Interactive, scrollable, tappable — indistinguishable from the real app. Build any feature flow and present it with full confidence.

**For Designers**
Fork it. Build on it. The entire design system is baked in. Complex interactions — multi-state filters, conditional logic, animation triggers — that take hours to wire in Figma are already functional here.

**For Developers**
A working blueprint, not a flat mockup. See exactly how every interaction fires, how state transitions, how animations trigger. The guesswork is gone.

**For Leadership & Stakeholders**
See the feature. Don't read about it. Every prototype demo will look and feel like the actual product.

---

### What this doesn't replace

This is a prototyping and decision-making tool. When a feature design is finalized, proper Figma designs are still handed off for engineering. The kit is for **exploring and deciding — fast.**

---

### Next steps

1. **Prompt guidelines** — Creating documentation so anyone can produce high-quality prototypes using this tool with AI assistance.

2. **Production codebase integration** — Currently, developers can't use this code directly as it's built on a different technology. The next goal: work directly on the production codebase to ship designs straight to production.

---

This is the fastest way to prototype any Shaadi feature that **looks and behaves exactly like our app.** PMs can use it. Designers can use it. It's in a tool everyone already knows. Every prototype will be on-brand from day one.

cc: @Anupam @Harsh @Nikita @Disha @Biplab
