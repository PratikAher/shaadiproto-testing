# Promising Matches — Option 3 Sub-Variants Context

## Overview

Option 3 for the Promising Matches floating section has been expanded into **7 genuinely different visual explorations** (3A through 3G). Each varies in composition, motion language, information hierarchy, and visual weight — not just color or spacing tweaks.

All variants share the same core interaction rules:
- Collapsed state is a floating element above the tab bar
- Message snippets are hidden/obfuscated by default (lock emoji + masked text)
- Auto-rotating snippets cycle through promising matches every ~2.8 seconds
- Tapping the collapsed element expands an accordion showing chat-like rows
- Premium users see real message snippets; free users see locked copy

## Bell Icon Controller

- In Chat tab, tapping the bell icon opens a variant controller modal
- The modal shows Option 1 / Option 2 / Option 3 as top-level choices
- When Option 3 is selected, a sub-variant grid appears (3A through 3G)
- In non-Chat tabs, bell continues opening the existing experiment settings panel

## Sub-Variant Descriptions

### 3A — Dark Capsule
- Full-width dark pill container
- Stacked overlapping avatars on the left
- Rotating grey message bubble in the center (masked text)
- Circle chevron expand button on the right
- High visual weight, strong contrast, feels like a persistent notification dock
- Closest to the Instagram note reference but adapted to app visual language

### 3B — Conversation Peek
- Mimics a real chat row "peeking" from below the fold
- Shows one profile at a time — avatar, name, locked message
- Rotates between profiles with scale and fade transitions
- Green online dot on avatar creates urgency
- Count badge shows total interested
- Feels like a new message just arrived organically

### 3C — Depth Stack
- Layered card backgrounds with parallax offset create visual depth
- 2-3 cards peek from behind the active foreground card
- Active avatar card-flips on rotation (rotateY transition)
- Header shows "N interested in you" count
- Active name + masked message rotate inline
- Communicates "pile of unread interest" through spatial metaphor

### 3D — Ambient Presence
- Full-width translucent gradient bar (subtle primary tint)
- Glowing pulsing ring around the active avatar
- Message text fades in/out with a blur transition (typewriter-like)
- Other avatars shown as small cluster on the right
- Lowest visual weight of all variants — more mood than literal UI
- Best for users who find floating elements distracting

### 3E — Split Capsule
- Two-zone horizontal layout inside a dark capsule
- Left zone: avatar cluster + count number (dark bg)
- Right zone: rotating sender name + masked message (slightly lighter bg)
- Clear spatial separation between "who" and "what they said"
- Chevron in a bordered circle on the far right
- Most structured information hierarchy

### 3F — Thread Preview
- Shows 2-3 stacked mini-rows simultaneously (not just one at a time)
- Each row: small avatar + name + masked message
- Active row is full opacity; inactive rows are dimmed (0.45 opacity, slightly scaled down)
- Creates the feeling of an ongoing multi-person conversation you are missing
- Header shows "N interested in you"
- Most information-dense collapsed state

### 3G — Notification Dock
- Compact pill/chip shape (rounded-full when collapsed)
- Switches to rounded-2xl when expanded
- Small avatar + name + truncated locked snippet + green count badge
- Minimal footprint — feels like a persistent notification chip
- Fastest scan speed due to compact size
- Best for maximum chat list visibility

## Premium / Free Behavior

- Collapsed state (all sub-variants): always shows masked snippet with lock emoji
- Expanded accordion rows:
  - Premium user: real message snippet visible, green timestamp color
  - Free user: "🔒 Message hidden. Upgrade to view." with muted timestamp
- Uses existing `isCurrentUserPremium` state from App.tsx
- Home tab premium toggle immediately updates chat UI

## Data Source

- `inboxPendingRequestsRaw.slice(0, 4)` from App.tsx
- Excludes dismissed and already-chatting profiles

## State Variables

- `promisingMatchesVariant`: 'option1' | 'option2' | 'option3'
- `option3SubVariant`: '3a' | '3b' | '3c' | '3d' | '3e' | '3f' | '3g'
- `showPromisingMatchesController`: boolean
- `option3Expanded`: boolean
- `option3ActiveIndex`: number (auto-increments on timer)
- `shouldShowPromisingMatches`: derived gate

## File Map

- Variant component: `src/app/components/chat/PromisingMatches.tsx`
- Wiring and state: `src/app/App.tsx`

## Selection Criteria for Final Pick

- **Scan speed**: Can user infer "new interest messages" within 1 second?
- **Motion restraint**: Subtle enough to avoid distraction in chat tab?
- **Tap confidence**: Is the collapsed element clearly tappable?
- **Density fit**: Does it clash with chat rows and bottom tab?
- **Premium clarity**: Are hidden vs visible snippets obvious without heavy text?
