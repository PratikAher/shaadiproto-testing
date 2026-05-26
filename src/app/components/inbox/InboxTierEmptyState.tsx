import React from 'react';
import { Button } from '../Button';

// ─────────────────────────────────────────────────────────────────────────────
// InboxTierEmptyState
//
// Empty-state block shown in the Inbox → Received view when the user has
// either (a) cleared the Top requests stack, (b) had no Top requests to
// begin with, or (c) exhausted both Top and More pools.
//
// States:
//  - "B"  → "You've viewed all your top Requests" + "+N also interested · View All"
//  - "C"  → "Your top Requests will appear here"  + "+N also interested · View All"
//  - "D"  → "You've viewed all your top Requests" + "Explore Matches"
//
// The component is intentionally view-agnostic — it works both as a full-screen
// block inside the card view and as an inline divider block inside the list view.
// ─────────────────────────────────────────────────────────────────────────────

export type InboxTierEmptyVariant = 'B' | 'C' | 'D';

/**
 * Copy version for the headline + sub-line text.
 *  - 'v1' (default): "You've viewed all your top Requests" etc.
 *  - 'v2':            "You are all caught up", "Nothing new for now" etc.
 *
 * Driven by the dev toggle in ExperimentSettingsPanel so the team can
 * A/B test both phrasings without code changes.
 */
export type InboxTierCopyVersion = 'v1' | 'v2';

const COPY: Record<InboxTierCopyVersion, Record<InboxTierEmptyVariant, { headline: string; subline: string }>> = {
  v1: {
    B: {
      headline: "You've viewed all your top Requests",
      subline: 'A few more Members have shown interest in you. Take a look.',
    },
    C: {
      headline: 'Your top Requests will appear here',
      subline: 'A few Members have shown interest in you. Take a look.',
    },
    D: {
      headline: "You've viewed all your top Requests",
      subline: 'Check back soon for fresh Requests.',
    },
  },
  v2: {
    B: {
      headline: 'You are all caught up',
      subline: 'Thats all you have from your top Requests.',
    },
    C: {
      headline: 'Nothing new for now',
      subline: 'Your top Requests will appear here.',
    },
    D: {
      headline: 'You are all caught up',
      subline: 'Check back soon for new Requests.',
    },
  },
};

interface InboxTierEmptyStateProps {
  variant: InboxTierEmptyVariant;
  /** Which copy block to use (toggled from the dev settings panel). */
  copyVersion?: InboxTierCopyVersion;
  /** Number of profiles in the More pool (used for B & C copy "+N also interested"). */
  moreCount?: number;
  /** Avatar URLs of a few More profiles, shown as overlapping circles in the View-All pill. */
  morePreviewAvatars?: string[];
  /** Tapped when user wants to load the More pool into the active stack/list. */
  onViewAll?: () => void;
  /** Tapped on D's "Explore Matches" button. */
  onExploreMatches?: () => void;
  /** Whether the View All CTA pill should be hidden (used after the user has tapped it). */
  hideViewAllCta?: boolean;
  /**
   * When true, the block grows to fill its flex parent and centers itself vertically.
   * Use this in the card-view full-screen treatment. List view leaves this false so
   * the divider sits inline at the end of the rows.
   */
  centered?: boolean;
  /**
   * When true, the content is wrapped in a card surface (white bg, rounded corners,
   * shadow) so it can be slotted into the card-stack as the active card itself —
   * preserving the card-stack metaphor even when the user has finished their top
   * requests (state B / C) and the More tier is still available.
   */
  cardMode?: boolean;
  className?: string;
}

// Figma asset (Inbox tier empty state — variants B & D).
// 64×64 solid green circle with a white check; no outer halo per design feedback.
const GreenCheckIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 47 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="23.3333" cy="23.3333" r="23.3333" fill="#0ED279" />
    <path
      d="M19.6417 26.9675L15.2471 22.9174C14.6108 22.331 13.6312 22.3305 12.9944 22.9163C12.279 23.5743 12.278 24.7029 12.9922 25.3622L19.502 31.3711C19.5809 31.4439 19.7025 31.4439 19.7814 31.3711L34.8482 17.4738C35.5586 16.8185 35.5598 15.6967 34.8507 15.0399C34.2168 14.4527 33.238 14.4512 32.6022 15.0364L19.6417 26.9675Z"
      fill="white"
    />
  </svg>
);

// Figma asset (Inbox tier empty state — variant C).
// 64×64 muted-grey circle hosting the 30×30 profile/doc glyph centred inside.
const ProfileDocIcon = () => (
  <div className="size-[64px] rounded-full bg-[#F1F1F2] flex items-center justify-center shrink-0">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.71875 13.6357C3.71875 10.1297 3.71875 8.37664 4.80795 7.28744C5.89714 6.19824 7.65018 6.19824 11.1562 6.19824H13.6354C17.1415 6.19824 18.8945 6.19824 19.9837 7.28744C21.0729 8.37664 21.0729 10.1297 21.0729 13.6357V19.8337C21.0729 23.3397 21.0729 25.0927 19.9837 26.1819C18.8945 27.2712 17.1415 27.2712 13.6354 27.2712H11.1562C7.65018 27.2712 5.89714 27.2712 4.80795 26.1819C3.71875 25.0927 3.71875 23.3397 3.71875 19.8337V13.6357Z"
        stroke="#272631"
        strokeWidth="1.65278"
      />
      <path
        d="M20.9799 23.5524C22.3382 22.793 22.8002 21.1236 23.7242 17.7845L25.0309 13.0624C25.955 9.72335 26.417 8.05383 25.6328 6.73858C24.8485 5.42332 23.1242 4.97598 19.6758 4.08128L17.2373 3.44864C13.7888 2.55394 12.0646 2.1066 10.7062 2.86596C9.7391 3.4066 9.22635 4.40861 8.67773 6.14601"
        stroke="#272631"
        strokeWidth="1.65278"
      />
      <path
        d="M14.5671 12.9124C14.5671 14.1105 13.5955 15.0817 12.3968 15.0817C11.1983 15.0817 10.2266 14.1105 10.2266 12.9124C10.2266 11.7144 11.1983 10.7432 12.3968 10.7432C13.5955 10.7432 14.5671 11.7144 14.5671 12.9124Z"
        stroke="#272631"
        strokeWidth="1.65278"
      />
      <path
        d="M15.6491 22.5192H9.14128C8.54225 22.5192 8.05664 22.0335 8.05664 21.4346C8.05664 19.6375 9.51346 18.1807 11.3105 18.1807H13.4798C15.2768 18.1807 16.7337 19.6375 16.7337 21.4346C16.7337 22.0335 16.2481 22.5192 15.6491 22.5192Z"
        stroke="#272631"
        strokeWidth="1.65278"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// Avatar stack — mirrors the chat tab's "More Requests" treatment.
// 3 overlapping 28px circles (2px page-coloured ring) followed by an optional
// "+N" badge circle when there are more profiles than chips shown.
const AvatarStack = ({ urls, totalCount }: { urls: string[]; totalCount: number }) => {
  const AVATAR_SIZE = 28;
  const OVERLAP = 10;
  const stacked = urls.slice(0, 3);
  const remainingCount = Math.max(0, totalCount - stacked.length);

  return (
    <div className="flex items-center shrink-0">
      {stacked.map((src, i) => (
        <div
          key={i}
          className="rounded-full overflow-hidden bg-muted shrink-0"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            marginLeft: i === 0 ? 0 : -OVERLAP,
            boxShadow: '0 0 0 2px var(--color-background)',
            position: 'relative',
            zIndex: i + 1,
          }}
        >
          {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : null}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className="rounded-full flex items-center justify-center shrink-0"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            marginLeft: -OVERLAP,
            backgroundColor: 'var(--color-muted)',
            boxShadow: '0 0 0 2px var(--color-background)',
            position: 'relative',
            zIndex: stacked.length + 1,
          }}
        >
          <span
            style={{
              fontSize: 11,
              lineHeight: 1,
              fontWeight: 500,
              color: '#6B6B73',
            }}
          >
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};

export function InboxTierEmptyState({
  variant,
  copyVersion = 'v1',
  moreCount = 0,
  morePreviewAvatars = [],
  onViewAll,
  onExploreMatches,
  hideViewAllCta = false,
  centered = false,
  cardMode = false,
  className = '',
}: InboxTierEmptyStateProps) {
  const { headline, subline } = COPY[copyVersion][variant];

  // cardMode wraps the same content in a card surface (white bg, rounded corners,
  // shadow). Replaces the default flat-page layout. Used as the active-card slot
  // in the card-stack when Top is exhausted but More tier is available.
  const wrapperClass = cardMode
    ? `w-full h-full bg-white flex flex-col items-center justify-center text-center rounded-[16px] px-6 py-8 select-none ${className}`
    : `w-full flex flex-col items-center text-center px-6 py-8 ${
        centered ? 'flex-1 justify-center' : ''
      } ${className}`;

  const wrapperStyle: React.CSSProperties | undefined = cardMode
    ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.10), 0px 1px 6px rgba(0,0,0,0.06)' }
    : undefined;

  return (
    <div
      className={wrapperClass}
      style={wrapperStyle}
      data-inbox-empty-variant={variant}
      data-inbox-empty-mode={cardMode ? 'card' : 'fullscreen'}
    >
      {variant === 'C' ? <ProfileDocIcon /> : <GreenCheckIcon />}

      <p
        className="mt-4"
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '18px',
          lineHeight: '24px',
          color: '#41404D',
          fontWeight: 600,
        }}
      >
        {headline}
      </p>
      <p
        className="mt-1.5 max-w-[300px]"
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: '14px',
          lineHeight: '20px',
          color: '#6B6B73',
          fontWeight: 400,
        }}
      >
        {subline}
      </p>

      {variant === 'D' ? (
        // Primary button from the design system — same surface used elsewhere in
        // the app for hero CTAs. Default variant = bg-primary; default size = 44px.
        <Button variant="default" size="default" className="mt-5" onClick={onExploreMatches}>
          Explore Matches
        </Button>
      ) : !hideViewAllCta ? (
        <button
          type="button"
          onClick={onViewAll}
          // Tight pill: avatars hug the left, "also interested" sits right next to
          // them (gap-1.5), then a small gap to "View All" on the right.
          className="mt-5 inline-flex items-center gap-1.5 h-11 pl-1.5 pr-3.5 rounded-full border border-border bg-background active:opacity-80 transition-opacity"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)' }}
        >
          {morePreviewAvatars.length > 0 ? (
            <AvatarStack urls={morePreviewAvatars} totalCount={moreCount} />
          ) : null}
          <span
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: '#272631',
            }}
          >
            also interested
          </span>
          <span
            className="ml-3 text-[#0AA4B8]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', fontWeight: 500 }}
          >
            View All
          </span>
        </button>
      ) : null}
    </div>
  );
}
