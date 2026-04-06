# Connect Now Bottom Sheet - Solution 3 (with Subtitle)

> **Technical Requirements Document**
> Scope: Solution variant `3` only, with `showSubtitle: true`.
> This document covers the full user journey from tapping "Connect Now" on a Profile Card through the bottom sheet interaction, message sending, phone-number validation error flow, and what happens on the Profile Card after a Connect is sent.

---

## 1. Profile Card - Pre-Connect States

### 1.1 First Profile (no saved Message yet)

The bottom of the Profile Card shows a simple inline row:

```
 ┌─────────────────────────────────────────────────┐
 │  "Like this profile?"  "Connect Now"     ( ✓ )  │
 └─────────────────────────────────────────────────┘
```

- Left side: italic light text "Like this profile?" + bold teal "Connect Now" label
- Right side: 52px circular gradient button (teal-to-green, `-37.6deg`) with a white checkmark icon
- Tapping the circular button OR the "Connect Now" text area triggers `onConnect(profile)`
- This opens the **Connect Now Bottom Sheet** (Section 2)

### 1.2 Subsequent Profiles (saved Message exists)

Once the user has sent their first Connect (and a `savedMessage` exists), the card layout changes to a full-width CTA + message preview tile:

```
 ┌─────────────────────────────────────────────────┐
 │  [ ✓  Connect Now                          ]    │  ← 44px, full-width, gradient pill
 │  [ 💬 "Hi Priya, I came across your..."  Edit]  │  ← frosted glass preview tile
 └─────────────────────────────────────────────────┘
```

**Full-width "Connect Now" button:**
- Height: 44px, full-width, rounded-full (pill shape)
- Background: `linear-gradient(-37.6deg, #0AA4B8 13.3%, #09BF6C 85.8%)`
- Box shadow: `0 2px 10px rgba(10,164,184,0.3)`
- Icon: white checkmark (20px) + "Connect Now" label (16px/700)
- On tap: calls `onConnect(profile)` which opens the bottom sheet with the saved message pre-filled

**Message preview tile:**
- Background: `rgba(255,255,255,0.1)` with `0.5px solid rgba(255,255,255,0.2)` border
- Border radius: 14px
- Padding: `4.5px 8px`
- Content: chat icon (12px) + truncated message preview (max 38 chars) + "Edit" label
- On tap: opens the bottom sheet in edit mode (message pre-filled, phase = `ready`, cursor in textarea)

### 1.3 Container Heights

| State | Height |
|---|---|
| First Connect (simple row) | 76px |
| Subsequent (button + preview tile) | 88px |
| Post-Connect (contact CTAs) | 126px |

Height transitions use: `duration: 0.4s, ease: [0.25, 0.1, 0.25, 1]`

---

## 2. Connect Now Bottom Sheet

### 2.1 Sheet Chrome

| Property | Value |
|---|---|
| Background | `var(--color-sheet-bg)` |
| Corner radius | 28px (top-left, top-right) |
| Max height | 85% of viewport |
| Z-index | 70 (sheet), 60 (overlay) |
| Position | Anchored to bottom of viewport |

**Overlay:** `bg-black/50`, fades in 250ms. Tap overlay to dismiss.

**Entry animation:**
- Type: spring
- Damping: 30, Stiffness: 300, Mass: 0.8
- From: `y: 100%` To: `y: 0`

**Exit animation:** Same spring parameters, `y: 0` to `y: 100%`

**Drag handle:**
- Centered, 40px wide, 4px tall, rounded-full, `bg-border` color
- Acts as the sole touch target for `useDragControls` (drag-to-dismiss)
- `dragListener: false` on the sheet itself to protect textarea and horizontal swipes
- Dismiss threshold: `y > 120px` offset OR `velocity.y > 500`

### 2.2 Sheet Layout

```
 ┌──────────────────────────────────────────┐
 │              ── drag handle ──           │
 │                                          │
 │            ( avatar 64px )               │
 │         "Connect with {firstName}"       │  ← 20px/500
 │   "Your first Message matters.           │  ← 14px/400, muted
 │          Make it personal."              │
 │                                          │
 │  ┌──────────────────────────────────┐    │
 │  │                                  │    │
 │  │     Message compose area         │    │  ← 140px fixed height
 │  │     (3 phases - see 2.3)         │    │
 │  │                                  │    │
 │  │  [  arrows  ]   [SIA pill btn]   │    │  ← bottom row inside card
 │  └──────────────────────────────────┘    │
 │                                          │
 │  [ ✓ Connect Now                    ]    │  ← 48px gradient CTA
 │                                          │
 │  "Your Message will be personalized      │  ← 12px/400, muted, centered
 │     for each Profile."                   │
 └──────────────────────────────────────────┘
```

**Avatar:** 64px round, object-cover, with `0.5px solid rgba(0,0,0,0.1)` inset ring.

**Title:** "Connect with {firstName}" - 20px/500, `text-foreground`.

**Subtitle** (when `showSubtitle: true`): "Your first Message matters. Make it personal." - 14px/400, `text-muted-foreground`.

### 2.3 Compose Card - Three Phases

The compose area is a rounded card (`rounded-2xl`, bordered) with a fixed 140px message area. It cycles through three mutually exclusive phases. All three phase layers are **always in the DOM** (no mount/unmount) and crossfade via CSS `opacity` transitions (150ms). This avoids animation library caching bugs.

#### Phase 1: `generating`

Shown for ~1200ms after the sheet opens (first Connect) or after tapping "Try another".

```
 ┌──────────────────────────────────────────┐
 │  [SIA logo]  "SIA is writing your       │
 │               message..."                │
 │                                          │
 │                                          │
 └──────────────────────────────────────────┘
```

- SIA Logo (V4 variant): 20px, flower silhouette rotates via SMIL `<animateTransform>` at 1.6s/revolution; gradient and central sparkle stay static
- Label: "SIA is writing your message..." - 14px/400, `text-muted-foreground`
- Bottom row (arrows + SIA pill): rendered but `opacity: 0, pointer-events: none`

#### Phase 2: `typing`

Word-by-word reveal of the AI-generated message.

```
 ┌──────────────────────────────────────────┐
 │  Hi Priya, I came across your profile    │
 │  and really liked what you shared|       │  ← blinking cursor
 │                                          │
 │                                          │
 └──────────────────────────────────────────┘
```

- Text appears word-by-word at `40ms` per word
- Blinking cursor (1.4px wide, 16px tall, brand-500 color, 0.6s blink cycle)
- When all words are revealed, 300ms delay, then transition to `ready`
- Bottom row: still `opacity: 0`
- Text style: 16px/24px, weight 400, `text-foreground`

#### Phase 3: `ready`

Editable textarea with full interactivity.

```
 ┌──────────────────────────────────────────┐
 │  Hi Priya, I came across your profile    │
 │  and really liked what you shared about  │
 │  yourself. I'm Pratik, and I think we    │
 │  could have some great conversations.    │
 │                                          │
 │  [< 1/3 >]              [Try another]   │
 └──────────────────────────────────────────┘
```

- Full message visible in a `<textarea>` (no border, transparent background)
- Max characters: 700. Min characters to enable send: 10
- Editing the message clears any active `phoneError`
- Placeholder: "Say something nice..."
- Bottom row fades in (`opacity: 1`, 200ms transition)

### 2.4 Bottom Row (inside Compose Card)

Appears only during `ready` phase.

**Left side - History Navigation** (only when `showStats: true`):
- Left arrow + counter (e.g., "1/3") + right arrow
- Arrows disable at boundaries (`opacity: 0.25`)
- Swipe left/right on the message area also navigates history (50px threshold, 40% damping)

**Left side** (when `showStats: false`): empty spacer

**Right side - SIA Action Pill:**
- Gradient border: `linear-gradient(157.9deg, #FF5A60 5%, #CC7AFF 36.25%, #0094FF 77.5%, #00BCD5 120%)`
- 1.5px border via `background-image` on outer element, inner has `var(--color-sia-pill-bg)` background
- Height: 32px, rounded-full
- **Label changes based on message state:**
  - Empty message: sparkle icon + "Write with SIA"
  - Has message text: retry icon + "Try another"
- On tap: triggers `handleGenerate` (cycles back to `generating` phase)
- Disabled (40% opacity) during `generating` and `typing` phases
- **Important:** Tapping "Try another" also clears `phoneError` if active

### 2.5 Stats Row (optional, below Compose Card)

Only rendered when `showStats: true`. Shows character count and credit balance.

```
  42/700                              3 credits left
```

- Font: 11px/400, `text-muted-foreground/70`
- Warning color at >90% chars or <=1 credit: `var(--color-warning-500)`
- Dims to 40% opacity during busy states

### 2.6 Primary CTA - "Connect Now" Button

```
 [ ✓ Connect Now ]
```

| Property | Value |
|---|---|
| Height | 48px |
| Shape | rounded-full (pill) |
| Background | `linear-gradient(-6.59deg, #0AA4B8 13.3%, #09BF6C 85.8%)` |
| Text | White, 16px/700 |
| Icon | White checkmark (24px), 3px gap to text |
| Shadow | `0 4px 16px rgba(10,164,184,0.2)` when enabled |
| Disabled state | 50% opacity, `pointer-events: none` |
| Active press | `scale(0.98)` |

**Enable condition:** `phase === 'ready'` AND `message.trim().length >= 10` AND not currently sending.

### 2.7 Send Flow (on CTA tap)

```
                    ┌────────────────┐
User taps CTA ───> │  isSending=true │
                    │  Show spinner   │ ─── 2 second timer ───┐
                    └────────────────┘                        │
                                                              ▼
                                              ┌───────────────────────────┐
                                              │  Check for phone number   │
                                              │  (regex: 5+ digits)       │
                                              └─────────┬─────────────────┘
                                                        │
                                      ┌─────────────────┴─────────────────┐
                                      │                                   │
                                      ▼                                   ▼
                              No phone found                     Phone detected
                              ┌─────────────┐                   ┌──────────────┐
                              │ onSend()    │                   │ phoneError   │
                              │ Close sheet │                   │ = true       │
                              └─────────────┘                   └──────────────┘
```

**Spinner state:**
- The "Connect Now" label + icon are replaced by a spinning loader
- Loader: 24px SVG with a white circle track (`rgba(255,255,255,0.3)`) and a white arc
- Rotation: 360deg, 0.8s, linear, infinite

**Phone number regex:** `/(?:\+?\d[\d\s\-().]{4,}\d|\b\d{5,}\b)/`
- Matches 5+ consecutive digits with optional spaces, dashes, dots, or parens

### 2.8 Phone Number Error State

When a phone number is detected, the sheet transitions to the error state:

```
 ┌──────────────────────────────────────────┐
 │              ── drag handle ──           │
 │            ( avatar 64px )               │
 │         "Connect with Priya"             │
 │   "Your first Message matters.           │
 │          Make it personal."              │
 │                                          │
 │  ┌──────────────────────────────────┐    │
 │  │  Hi Priya, my number is         │    │
 │  │  9876543210 call me...           │    │
 │  │                                  │    │
 │  │  [< 1/1 >]       [Try another]  │    │
 │  └──────────────────────────────────┘    │
 │                                          │
 │  ⓘ Only Premium Members can share       │  ← error message (accent-700)
 │    Contact details                       │
 │                                          │
 │  [ 👑 Upgrade Now                   ]    │  ← primary button (48px)
 │  [    Edit Message                  ]    │  ← secondary button (48px)
 │                                          │  ← footer text HIDDEN
 └──────────────────────────────────────────┘
```

**Error message:**
- Icon: 14px circle with exclamation mark, `var(--color-accent-palette-700)`
- Text: "Only Premium Members can share Contact details" - 12px/500
- Animates in: `opacity: 0, y: -4` to `opacity: 1, y: 0` (200ms)

**CTA Area Transition (Normal to Error):**

Both CTA states are **always in the DOM** (no mount/unmount). They crossfade using CSS transitions:

| Property | Normal State | Error State |
|---|---|---|
| Container height | 48px | 106px (48 + 10 gap + 48) |
| Height transition | `0.25s cubic-bezier(0.25, 0.1, 0.25, 1)` | Same |
| "Connect Now" layer | `opacity: 1, z-index: 2` | `opacity: 0, pointer-events: none, z-index: 0` |
| Error buttons layer | `opacity: 0, pointer-events: none, z-index: 0` | `opacity: 1, z-index: 2` |
| Opacity transition | 200ms | 200ms |

**"Upgrade Now" button:**
- Design system `Button` component, `variant="default"`, `size="lg"`
- Full width, 16px/700
- Icon: `CrownFilledIcon` from design system icons (20px, `!w-5 !h-5`)
- On tap: navigates to premium upgrade flow (placeholder)

**"Edit Message" button:**
- Design system `Button` component, `variant="secondary"`, `size="lg"`
- Full width, 16px/500
- On tap:
  1. Sets `phoneError = false`
  2. After 50ms, focuses the textarea

**Footer text behavior:**
- When `phoneError` is `true`: footer collapses to `maxHeight: 0, opacity: 0`
- Transition: `max-height 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease`

### 2.9 Error Recovery Paths

There are three ways to exit the phone error state:

| Action | Behavior |
|---|---|
| Tap "Edit Message" | Clears `phoneError`, focuses textarea |
| Tap "Try another" (SIA pill) | Clears `phoneError`, starts new `generating` cycle |
| Manually edit the textarea | Clears `phoneError` on any `onChange` event |

All three paths return the CTA area to the normal "Connect Now" button state.

### 2.10 Footer Text

Below the CTA, centered:

> "Your Message will be personalized for each Profile."

- Font: 12px/16px, weight 400, `text-muted-foreground`
- Margin top: 8px (mt-2)
- Dims to 40% opacity during busy states
- Collapses (hidden) during phone error state

---

## 3. After Sending a Connect

### 3.1 Sheet Dismissal

When the message passes phone validation and `onSend` is called:

1. `savedConnectMessage` is stored in `App.tsx` state
2. `savedMessageFirstName` captures the Profile's first name (for future name substitution)
3. `autoSendEnabled` is set to `true` (for S3, always true)
4. Profile ID is added to `connectedProfileIds` Set
5. `isFirstConnect` becomes `false`
6. `showConnectSheet` is set to `false` (triggers exit animation)
7. After **500ms delay**, `connectingProfile` is set to `null` (lets spring exit animation complete before unmount)

### 3.2 All State Reset on Sheet Close

When the sheet closes (either via send, swipe-dismiss, or overlay tap):

| State | Reset Value |
|---|---|
| `phase` | `'ready'` |
| `typingWordIndex` | `0` |
| `messageHistory` | `[]` |
| `historyIndex` | `0` |
| `touchStartX` | `null` |
| `swipeDeltaX` | `0` |
| `isSending` | `false` |
| `phoneError` | `false` |

All pending timers (generate, typing, send) are cleared.

### 3.3 Profile Card - Post-Connect State

The Profile Card's bottom CTA area transitions from the pre-connect row to the post-connect contact options:

```
 ┌─────────────────────────────────────────────────┐
 │  To Contact her directly, Upgrade Now >         │  ← 12px, teal link
 │                                                 │
 │   (Shaadi Chat)    (WhatsApp)      (Call)       │  ← 52px circular buttons
 └─────────────────────────────────────────────────┘
```

**Transition animation:**
- Pre-connect fades out: `opacity: 0, y: -8` (200ms ease-out)
- Post-connect fades in: `opacity: 0, y: 20` to `opacity: 1, y: 0` (350ms, 100ms delay, cubic-bezier)
- Container height animates from pre-connect height (76px or 88px) to 126px (400ms)

**Contact buttons:**
- Shaadi Chat: 52px teal circle (`#0AA4B8`), chat icon, shadow
- WhatsApp: 52px green circle (imported Figma component)
- Call: 52px blue circle (imported Figma component)

### 3.4 Name Personalization for Subsequent Profiles

When the user swipes to the next Profile Card:

1. The `savedConnectMessage` has the first Connect's name in it (e.g., "Hi Priya, ...")
2. For the next Profile (e.g., "Neha"), the name is automatically replaced: "Hi Neha, ..."
3. Replacement uses a word-boundary regex: `/\bPriya\b/g` -> "Neha"
4. The message preview tile on the card shows this personalized version (truncated to 38 chars)

### 3.5 Subsequent Connect Flow (Auto-Send)

For the 2nd Profile onwards (when `autoSendEnabled: true`):

- Tapping the "Connect Now" button **does NOT open the bottom sheet**
- Instead, the Connect is sent instantly with the personalized saved message
- The Profile Card immediately transitions to the post-connect CTA state
- The user can still tap "Edit" on the message preview tile to open the sheet and modify the message before connecting

### 3.6 Subsequent Connect Flow (Edit before Send)

If the user taps "Edit" on the message preview tile:

- The bottom sheet opens with `savedMessage` pre-filled (name already personalized)
- Phase starts as `ready` (no generating/typing animation)
- The user can modify the message and tap "Connect Now"
- The same phone validation flow applies

---

## 4. Animation Summary

| Element | Type | Duration | Easing |
|---|---|---|---|
| Sheet entry | Spring | ~400ms | damping: 30, stiffness: 300, mass: 0.8 |
| Sheet exit | Spring | ~400ms | Same |
| Overlay fade | Tween | 250ms | Linear |
| Phase crossfade | CSS transition | 150ms | Linear (opacity) |
| Bottom row fade | CSS transition | 200ms | Linear (opacity) |
| CTA height change | CSS transition | 250ms | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| CTA opacity swap | CSS transition | 200ms | Linear |
| Footer collapse | CSS transition | 250ms / 200ms | cubic-bezier / ease |
| Error message entry | Spring/tween | 200ms | Default |
| Card CTA swap | Tween | 200-400ms | ease-out / cubic-bezier |
| Typing cursor blink | Tween | 600ms | Linear (repeat) |
| Send spinner | Tween | 800ms/rev | Linear (infinite) |
| SIA logo rotation | SMIL | 1600ms/rev | Linear (infinite) |

---

## 5. Key Constants

```
MAX_CHARS          = 700        // Maximum message length
MIN_CHARS          = 10         // Minimum to enable send
TYPING_SPEED_MS    = 40         // Per-word typing interval
SWIPE_THRESHOLD    = 50         // Horizontal swipe to navigate history
DISMISS_THRESHOLD  = 120        // Vertical drag to dismiss sheet
SEND_DELAY         = 2000       // Simulated API call duration
UNMOUNT_DELAY      = 500        // Delay before nulling connectingProfile
```

---

## 6. Color Tokens

| Token | Usage |
|---|---|
| `--color-sheet-bg` | Sheet background |
| `--color-compose-card-bg` | Compose card background |
| `--color-compose-card-border` | Compose card border |
| `--color-sia-pill-bg` | SIA pill inner background |
| `--color-brand-500` | Typing cursor |
| `--color-accent-palette-700` | Phone error text + icon |
| `--color-post-connect-cta-bg` | Post-connect contact area |
| `--color-foreground` | Primary text |
| `--color-muted-foreground` | Secondary/helper text |
| `#0AA4B8` | Teal brand (CTA gradient start, Shaadi Chat) |
| `#09BF6C` | Green brand (CTA gradient end) |

---

## 7. Data Flow

```
App.tsx (state owner)
  ├── connectingProfile: Profile | null
  ├── showConnectSheet: boolean
  ├── savedConnectMessage: string
  ├── savedMessageFirstName: string
  ├── isFirstConnect: boolean
  ├── autoSendEnabled: boolean
  ├── connectedProfileIds: Set<string>
  │
  ├── handleConnect(profile)
  │     → if first connect: open sheet
  │     → if subsequent + autoSend: instant connect
  │
  ├── handleSendConnect(message, autoSend)
  │     → save message, mark connected, close sheet
  │
  ├── handleEditMessage(profile)
  │     → open sheet with saved message
  │
  └── handleCloseSheet()
        → close sheet, 500ms delay, clear profile

ConnectMessageSheet (all internal state)
  ├── message, phase, phoneError, isSending
  ├── messageHistory[], historyIndex
  └── reuseForFuture (unused in S3)

ProfileCard (stateless, driven by props)
  ├── isConnected (derived from connectedProfileIds)
  ├── savedMessage (personalized)
  └── isFirstConnect
```
