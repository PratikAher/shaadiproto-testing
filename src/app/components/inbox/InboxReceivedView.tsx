import React, { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, type MotionValue, type PanInfo } from 'motion/react';
import type { Profile } from '../matches/ProfileCard';
import svgPaths from '../../../imports/svg-73td7n7p03';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface InboxRequest {
  profile: Profile;
  message: string;
  timestamp: string;
}

interface InboxReceivedViewProps {
  requests: InboxRequest[];
  isCurrentUserPremium: boolean;
  onAccept?: (profile: Profile) => void;
  onDecline?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  /** If true, user has applied filters (used for empty-state messaging). */
  hasActiveFilters?: boolean;
  /** Optional clear filters action (used when no matches). */
  onClearFilters?: () => void;
  /** Optional fallback requests shown when there are zero matches. */
  fallbackRequests?: InboxRequest[];
  /**
   * Optional override for the active card. When provided, the active swipeable
   * card slot renders `content` instead of an InboxCard from `requests[0]`.
   * Used to slot a "you're all caught up" / "your top requests will appear here"
   * card into the stack so the user can swipe it off to reveal the More-tier
   * profiles already peeking behind it. The peek shells in this mode use
   * `requests[0]` (back-1) and `requests[1]` (back-2) — i.e. the indices
   * shift down by 1 since the active slot is no longer drawn from requests.
   */
  activeCardOverride?: {
    content: React.ReactNode;
    onDismiss: (dir: 'left' | 'right') => void;
    /** Stable key so React doesn't remount on every render. */
    key?: string;
  };
  /**
   * A "tail card" inserted at the END of the regular requests queue. When the
   * user is approaching the end of the requests pool and one of the visible
   * peek slots would otherwise be empty, this card fills that slot instead.
   * Used for the in-card B state peeking behind the last Top profile.
   */
  tailCard?: {
    content: React.ReactNode;
    /** Stable key so React doesn't remount across re-renders. */
    key?: string;
  };
  /**
   * Optional list of profiles that come AFTER the tail card in the conceptual
   * queue. When the user has only 1 Top profile left, the queue reads:
   *   [Mrunal (active), tailCard (peek-1), afterTailRequests[0] (peek-2)]
   * So the user sees a real More-tier profile already peeking behind the
   * tail-card B state, completing the 3-card depth read.
   */
  afterTailRequests?: InboxRequest[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Micro-components using svg-73td7n7p03 paths
// ─────────────────────────────────────────────────────────────────────────────

const DotSeparator = () => (
  <div className="relative shrink-0 size-[4px]">
    <svg className="block size-full" fill="none" viewBox="0 0 4 4">
      <path d={svgPaths.p2d5a3780} fill="#95959D" />
    </svg>
  </div>
);

const BlueTick = () => (
  <div className="relative shrink-0 size-[24px]">
    <div className="absolute left-[2.5px] top-[2.5px] size-[19px]">
      <div className="absolute inset-[-7.89%]">
        <svg className="block size-full" fill="none" viewBox="0 0 22 22">
          <path d={svgPaths.p9deb400} fill="#0094FF" />
        </svg>
      </div>
    </div>
    <div className="absolute h-[4.4px] left-[8.8px] top-[9.7px] w-[6.4px]">
      <div className="absolute inset-[-22.73%_-15.63%]">
        <svg className="block size-full" fill="none" viewBox="0 0 8.39995 6.39995">
          <path d={svgPaths.p22ab8040} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>
    </div>
  </div>
);

const PremiumTag = ({ isPremium, isVip }: { isPremium: boolean; isVip?: boolean }) => {
  if (!isPremium && !isVip) return null;
  const bg = isVip ? '#6f3ba9' : '#ff5a60';
  return (
    <div className="flex items-center justify-center rounded-full shrink-0 size-[24px]" style={{ backgroundColor: bg }}>
      <div className="overflow-clip relative shrink-0 size-[12px]">
        <div className="absolute inset-[11.46%_5.21%]">
          <svg className="absolute block size-full" fill="none" viewBox="0 0 10.7501 9.25">
            <path clipRule="evenodd" d={svgPaths.p16a6f0c0} fill="white" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const DeclineButton = ({ onPress }: { onPress: () => void }) => (
  <button onClick={onPress} className="flex items-center gap-[8px] active:scale-95 transition-transform">
    <div
      className="bg-[#f1f1f2] overflow-clip relative rounded-full shrink-0 size-[48px]"
      style={{ boxShadow: '0px 3.7px 7.4px rgba(0,0,0,0.08), 0px 0.9px 10.2px rgba(0,0,0,0.06), 0px 1.8px 4.6px rgba(0,0,0,0.06)' }}
    >
      <div className="absolute inset-[23.08%] overflow-clip">
        <svg className="block size-full" fill="none" viewBox="0 0 25.8462 25.8462">
          <path d={svgPaths.p25b8b700} fill="#B1B3B9" />
        </svg>
      </div>
    </div>
    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px', lineHeight: '16px', letterSpacing: '0.2px', color: '#95959D' }}>
      Decline
    </p>
  </button>
);

const AcceptButton = ({ onPress }: { onPress: () => void }) => (
  <button onClick={onPress} className="flex items-center gap-[8px] active:scale-95 transition-transform">
    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px', lineHeight: '16px', letterSpacing: '0.2px', color: '#0AA4B8', fontWeight: 700 }}>
      Accept
    </p>
    <div
      className="overflow-clip relative rounded-full shrink-0 size-[48px]"
      style={{
        backgroundImage: 'linear-gradient(-37.6125deg, rgb(10, 164, 184) 13.336%, rgb(9, 191, 108) 85.792%)',
        boxShadow: '0px 3.7px 7.4px rgba(0,0,0,0.08), 0px 0.9px 10.2px rgba(0,0,0,0.06), 0px 1.8px 4.6px rgba(0,0,0,0.06)',
      }}
    >
      <div className="absolute inset-[17.86%]">
        <div className="absolute bottom-[21.17%] left-[16.67%] right-[16.67%] top-1/4">
          <svg className="block size-full" fill="none" viewBox="0 0 20.5714 16.6114">
            <path d={svgPaths.p3e41cb00} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  </button>
);

const MoreChevron = () => (
  <div className="flex items-center shrink-0">
    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', color: '#0AA4B8', fontWeight: 500 }}>
      more
    </p>
    <div className="pt-[1px]">
      <div className="overflow-clip relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
          <path d={svgPaths.p33cf2d80} fill="#0AA4B8" />
        </svg>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Chat Bubble — tail at TOP pointing upward toward sender's avatar photo
// Premium: shows actual message + "more"
// Free: shows "{Name} has sent you a Message" + "Upgrade" teal text link
// ────────────────────────────────────────────────────────────────────────────

interface ChatBubbleProps {
  message: string;
  senderName: string;
  isCurrentUserPremium: boolean;
}

const ChatBubble = ({ message, senderName, isCurrentUserPremium }: ChatBubbleProps) => (
  <div className="relative w-full px-[16px] mt-[14px]">
    {/* Arrow — slightly right of center, pointing UP toward avatar */}
    <div
      className="absolute z-[2]"
      style={{ top: '-7px', left: '55%', transform: 'translateX(-50%)' }}
    >
      {/* 18×9 upward-pointing triangle */}
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White fill to mask the bubble's top border underneath */}
        <path d="M0 10L9 1L18 10Z" fill="white" />
        {/* Left stroke of the arrow */}
        <path d="M0.5 10L9 1.5" stroke="#00BCD5" strokeWidth="1.5" />
        {/* Right stroke of the arrow */}
        <path d="M17.5 10L9 1.5" stroke="#00BCD5" strokeWidth="1.5" />
        {/* White bar to fully erase the top border line where arrow meets bubble */}
        <rect x="0" y="7.5" width="18" height="3" fill="white" />
      </svg>
    </div>

    {/* Bubble body */}
    <div
      className="relative w-full bg-white overflow-visible"
      style={{
        border: '1.5px solid #00BCD5',
        borderRadius: '12px',
      }}
    >
      {isCurrentUserPremium ? (
        <div className="flex items-center gap-[8px] px-[14px] py-[10px] w-full">
          <p
            className="flex-1 min-w-0"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '14px',
              lineHeight: '20px',
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#51505D',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {message}
          </p>
          <MoreChevron />
        </div>
      ) : (
        <div className="flex items-center gap-[8px] px-[14px] py-[10px] w-full">
          <p
            className="flex-1 min-w-0"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 500,
              color: '#51505D',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {senderName.split(' ')[0]} has sent you a Message
          </p>
          <div className="flex items-center shrink-0">
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', color: '#0AA4B8', fontWeight: 500 }}>
              Upgrade
            </p>
            <div className="pt-[1px]">
              <div className="overflow-clip relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                  <path d={svgPaths.p33cf2d80} fill="#0AA4B8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Inbox Card — full visual card
// ─────────────────────────────────────────────────────────────────────────────

interface InboxCardProps {
  request: InboxRequest;
  isCurrentUserPremium: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onTap?: () => void;
  acceptStampOpacity?: any;
  declineStampOpacity?: any;
}

const InboxCard = React.memo(({ request, isCurrentUserPremium, onAccept, onDecline, onTap, acceptStampOpacity, declineStampOpacity }: InboxCardProps) => {
  const { profile, message, timestamp } = request;
  const avatarUrl = profile.imageUrl || profile.photos?.full || '';
  const name = profile.name;
  const age = profile.age;
  const height = profile.heightCm ? cmToFeetInches(profile.heightCm) : profile.height || '';
  const profession = profile.profession;
  const religionCommunity = [profile.motherTongue || profile.religion, profile.community].filter(Boolean).join(', ');
  const city = profile.location?.city || profile.city || '';
  const hasVerifiedBadge = profile.badges?.includes('Blue Tick') || profile.verified?.id;

  return (
    <div
      className="bg-white flex flex-col items-center rounded-[16px] w-full h-full select-none"
      style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.10), 0px 1px 6px rgba(0,0,0,0.06)' }}
    >
      {/* Tappable area */}
      <div className="w-full flex-1 flex flex-col cursor-pointer" onClick={onTap}>
        {/* Top: premium tag + timestamp */}
        <div className="flex items-center justify-between px-[14px] pt-[10px] w-full shrink-0">
          <PremiumTag isPremium={profile.isPremium} isVip={profile.isVip} />
          {!profile.isPremium && !profile.isVip && <div />}
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px', lineHeight: '16px', letterSpacing: '0.2px', color: '#95959D' }}>
            {timestamp}
          </p>
        </div>

        {/* Avatar — large, centered, grows to fill available space */}
        <div className="flex-1 flex items-center justify-center w-full py-[8px] min-h-0">
          <div className="relative rounded-full overflow-hidden bg-[#f1f1f2] aspect-square" style={{ height: '100%', maxHeight: '280px', maxWidth: '280px' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f1f1f2]">
                <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#B1B3B9" strokeWidth="1.6" />
                  <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="#B1B3B9" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {/* Accept stamp */}
            {acceptStampOpacity && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                style={{ opacity: acceptStampOpacity }}
              >
                <div
                  className="px-[16px] py-[6px] rounded-[6px]"
                  style={{
                    border: '3px solid #22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    transform: 'rotate(-15deg)',
                  }}
                >
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '28px',
                    lineHeight: '34px',
                    fontWeight: 800,
                    color: '#22c55e',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>
                    Accept
                  </p>
                </div>
              </motion.div>
            )}

            {/* Decline stamp */}
            {declineStampOpacity && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                style={{ opacity: declineStampOpacity }}
              >
                <div
                  className="px-[16px] py-[6px] rounded-[6px]"
                  style={{
                    border: '3px solid #ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    transform: 'rotate(15deg)',
                  }}
                >
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '28px',
                    lineHeight: '34px',
                    fontWeight: 800,
                    color: '#ef4444',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>
                    Decline
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Chat bubble message */}
        <ChatBubble
          message={message}
          senderName={name}
          isCurrentUserPremium={isCurrentUserPremium}
        />

        {/* Profile info */}
        <div className="flex flex-col gap-[1px] items-start w-full shrink-0 mt-[14px] pb-[4px]">
          <div className="flex gap-[4px] items-center px-[16px] shrink-0">
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '18px', lineHeight: '26px', color: '#41404D', fontWeight: 700 }}>
              {name.split(' ')[0]} {name.split(' ')[1]?.[0]}
            </p>
            {hasVerifiedBadge && <BlueTick />}
          </div>
          <div className="flex gap-[8px] items-center px-[16px] w-full">
            <p className="shrink-0" style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', color: '#72727D' }}>
              {age} yrs, {height}
            </p>
            <DotSeparator />
            <p
              className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', color: '#72727D' }}
            >
              {profession}
            </p>
          </div>
          <div className="flex gap-[8px] items-center px-[16px] shrink-0">
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', color: '#72727D' }}>
              {religionCommunity}
            </p>
            <DotSeparator />
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', color: '#72727D' }}>
              {city}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full px-[16px] shrink-0">
        <div className="h-px w-full bg-[#E8E8EB]" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between py-[12px] px-[32px] w-full shrink-0">
        <DeclineButton onPress={onDecline} />
        <AcceptButton onPress={onAccept} />
      </div>
    </div>
  );
});

InboxCard.displayName = 'InboxCard';

// ─────────────────────────────────────────────────────────────────────────────
// Stacked card shells — more visible, peeking from below
// ─────────────────────────────────────────────────────────────────────────────

// Depth slot transforms. With the stack container's pb-[16px] moved up to
// the outer wrapper, BOTH the active card (flex-1, height H) and the absolute
// peek shells (inset-x-0 top-0 bottom-0, height H) share the same H. So:
//   slot 0 (active size)  → s=1, y=0  ⇒ shell ≡ active exactly
// The peeks below the active card live in the outer wrapper's bottom padding
// area (16px), so SLOT[1] and SLOT[2] use positive y values that push their
// visible bottom edges PAST the stack container, into the padding space.
//
// With H≈600 (typical mobile inbox height):
//   SLOT[0] bottom = H              → matches active
//   SLOT[1] bottom = 0.98·H + 18    ≈ H + 6   (6px peek below active)
//   SLOT[2] bottom = 0.96·H + 36    ≈ H + 12  (6px peek below back-1)
//
// The step between adjacent slots' bottoms is a constant ≈6px, so as back-1
// morphs slot 1 → 0 and back-2 morphs slot 2 → 1, both visible bottom edges
// move up by exactly the same amount in lockstep. Peeks stay constant — no
// apparent shrinking. And at slot 0, the shell matches active card 1:1.
const SLOT: Record<0 | 1 | 2, { scale: number; y: number }> = {
  0: { scale: 1,    y: 0 },
  1: { scale: 0.96, y: 18 },
  2: { scale: 0.92, y: 36 },
};

// Animated peek shell. Subscribes to a shared swipeProgress MotionValue
// (0 = resting, 1 = active card fully swiped off) and interpolates its
// transform continuously between its current slot and the slot one
// step forward. This couples the back-card motion to the active card's
// drag in real time — no remount-pop, no pause between fly-off and
// stack-advance.
//
// If a `request` is provided, the shell renders the real InboxCard with that
// profile's content (so the user sees the next profile peeking behind the
// active card and can recognise it before they finish swiping). Otherwise
// falls back to an empty white shell (used as a graceful placeholder when
// the pool doesn't have a next-next-next request to preview).
const StackedCardBack = ({
  depth,
  swipeProgress,
  request,
  isCurrentUserPremium,
  children,
}: {
  depth: 1 | 2;
  swipeProgress: MotionValue<number>;
  request?: InboxRequest;
  isCurrentUserPremium?: boolean;
  /**
   * Custom content for the peek shell. When provided, replaces the default
   * InboxCard render — used for the "you've viewed all your top requests"
   * tail card that peeks behind the last Top profile.
   */
  children?: React.ReactNode;
}) => {
  const resting = SLOT[depth];
  const advanced = SLOT[(depth - 1) as 0 | 1];
  const scale = useTransform(swipeProgress, [0, 1], [resting.scale, advanced.scale]);
  const y = useTransform(swipeProgress, [0, 1], [resting.y, advanced.y]);
  // No-op handlers — the wrapper has pointer-events-none so taps never reach
  // these, but the props are required by InboxCard's type signature.
  const noop = () => undefined;
  return (
    <motion.div
      className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"
      style={{ zIndex: -depth, scale, y }}
      // No mount-time opacity fade. The previous frame's OLD back-1 ended at
      // the same visible pixel position as where this NEW shell mounts, so
      // a fade-in would briefly blank out content the user was already seeing
      // — reads as a "refresh flash" on every Accept/Decline. Continuous
      // swipeProgress-driven transforms handle the visual continuity.
    >
      {children ? (
        children
      ) : request ? (
        <InboxCard
          request={request}
          isCurrentUserPremium={!!isCurrentUserPremium}
          onAccept={noop}
          onDecline={noop}
          onTap={noop}
        />
      ) : (
        <div
          className="bg-white rounded-[16px] h-full w-full"
          style={{
            boxShadow: depth === 1
              ? '0px 2px 8px rgba(0,0,0,0.07), 0px 0px 1px rgba(0,0,0,0.08)'
              : '0px 2px 6px rgba(0,0,0,0.05), 0px 0px 1px rgba(0,0,0,0.06)',
          }}
        />
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Swipe constants
// ─────────────────────────────────────────────────────────────────────────────

const SWIPE_VELOCITY_THRESHOLD = 350;
const SWIPE_DISTANCE_THRESHOLD = 90;
const FLY_OFF_DISTANCE = 450;
const ROTATION_PER_PX = 0.06;

// ─────────────────────────────────────────────────────────────────────────────
// Swipeable Card — imperative animate() for smooth exit
// ─────────────────────────────────────────────────────────────────────────────

interface SwipeableCardProps {
  /** Profile request — rendered as an InboxCard if no `children` are passed. */
  request?: InboxRequest;
  isCurrentUserPremium: boolean;
  onDismissComplete: (dir: 'left' | 'right') => void;
  onTap?: () => void;
  /**
   * Parent-owned drag MotionValue. Hoisted so the back-card peeks can subscribe
   * to it via useTransform and slide forward continuously as the user swipes.
   */
  x: MotionValue<number>;
  /**
   * Optional custom content for the swipeable card. When provided, replaces the
   * default InboxCard render — used for the "you're all caught up" / "your top
   * requests will appear here" card-stack empty states so they participate in
   * the same swipe interactions.
   */
  children?: React.ReactNode;
  /**
   * When true, drag gestures are fully disabled (left/right swipes do nothing).
   * Used for the in-card empty state (B / C) where only the View All tap
   * dismisses the card. The motion.div still respects the parent-owned x value
   * but won't react to user pointer drag.
   */
  dragDisabled?: boolean;
}

function SwipeableCard({ request, isCurrentUserPremium, onDismissComplete, onTap, x, children, dragDisabled = false }: SwipeableCardProps) {
  const isFlying = useRef(false);

  const rotate = useTransform(x, (v) => v * ROTATION_PER_PX);

  // Stamps appear early — visible hint at 15px, full at 100px
  const acceptStampOpacity = useTransform(x, [0, 15, 100], [0, 0.15, 1]);
  const declineStampOpacity = useTransform(x, [-100, -15, 0], [1, 0.15, 0]);

  const flyOff = useCallback(
    (dir: 'left' | 'right') => {
      if (isFlying.current) return;
      isFlying.current = true;
      const targetX = dir === 'right' ? FLY_OFF_DISTANCE : -FLY_OFF_DISTANCE;

      animate(x, targetX, {
        duration: 0.35,
        ease: [0.32, 0.72, 0, 1],
        onComplete: () => {
          onDismissComplete(dir);
        },
      });
    },
    [x, onDismissComplete]
  );

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const { offset, velocity } = info;
      if (Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD) {
        flyOff(velocity.x > 0 ? 'right' : 'left');
        return;
      }
      if (Math.abs(offset.x) > SWIPE_DISTANCE_THRESHOLD) {
        flyOff(offset.x > 0 ? 'right' : 'left');
        return;
      }
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    },
    [flyOff, x]
  );

  const handleAcceptBtn = useCallback(() => flyOff('right'), [flyOff]);
  const handleDeclineBtn = useCallback(() => flyOff('left'), [flyOff]);

  return (
    <motion.div
      className="flex-1 flex flex-col"
      style={{
        x,
        rotate,
        transformOrigin: 'center 85%',
        touchAction: 'pan-y',
        cursor: dragDisabled ? 'default' : 'grab',
        willChange: 'transform',
      }}
      drag={dragDisabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={dragDisabled ? undefined : handleDragEnd}
      whileDrag={dragDisabled ? undefined : { cursor: 'grabbing' }}
      // No mount entrance. After a dismiss, the OLD back-1 ended at the exact
      // same visible position (and showed the SAME profile) as where this new
      // active mounts — a fade/scale entrance would visually "reload" the
      // same content the user was already seeing.
    >
      {children ?? (
        request && (
          <InboxCard
            request={request}
            isCurrentUserPremium={isCurrentUserPremium}
            onAccept={handleAcceptBtn}
            onDecline={handleDeclineBtn}
            onTap={onTap}
            acceptStampOpacity={acceptStampOpacity}
            declineStampOpacity={declineStampOpacity}
          />
        )
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Card Stack View
// ─────────────────────────────────────────────────────────────────────────────

export function InboxReceivedView({
  requests,
  isCurrentUserPremium,
  onAccept,
  onDecline,
  onViewProfile,
  hasActiveFilters = false,
  onClearFilters,
  fallbackRequests,
  activeCardOverride,
  tailCard,
  afterTailRequests,
}: InboxReceivedViewProps) {
  // No internal currentIndex needed — the parent filters out dismissed profiles,
  // so requests[0] is always the correct current card.
  const showingFallback = hasActiveFilters && requests.length === 0 && (fallbackRequests?.length ?? 0) > 0;
  const sourceRequests = showingFallback ? (fallbackRequests as InboxRequest[]) : requests;
  const remaining = sourceRequests.length;

  // ── Shared drag motion value ─────────────────────────────────────────
  // Parent-owned so the back-card peeks can subscribe to it via useTransform
  // and slide forward continuously as the user drags the active card. The
  // value is reset to 0 inside handleDismissComplete after each card
  // resolves, so the next active card starts fresh.
  const swipeX = useMotionValue(0);
  // Progress = 0 at rest, 1 at full fly-off distance in either direction.
  // Symmetric mapping (negative or positive drag both advance the stack).
  const swipeProgress = useTransform(
    swipeX,
    [-FLY_OFF_DISTANCE, 0, FLY_OFF_DISTANCE],
    [1, 0, 1],
  );

  const handleDismissComplete = useCallback(
    (direction: 'left' | 'right') => {
      const req = sourceRequests[0];
      if (!req) return;
      if (direction === 'right') {
        onAccept?.(req.profile);
      } else {
        onDecline?.(req.profile);
      }
      // Snap swipeX back to 0 for the next card. Use set() not animate() —
      // we want an instantaneous reset (the next card's SwipeableCard
      // remount + entrance handles its own fade-in from depth-1 slot).
      swipeX.set(0);
    },
    [sourceRequests, onAccept, onDecline, swipeX]
  );

  // Wraps the override's onDismiss so swipeX is reset on the way out, matching
  // what handleDismissComplete does for the normal-flow active card.
  const handleOverrideDismiss = useCallback(
    (direction: 'left' | 'right') => {
      activeCardOverride?.onDismiss(direction);
      swipeX.set(0);
    },
    [activeCardOverride, swipeX]
  );

  // When an override is in play, we always render the card stack (the override
  // is the active card, peeks come from `requests`). Skip the standalone empty
  // state fallback below — that's only meant for the pure-empty case.
  if (remaining <= 0 && !activeCardOverride) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="p-6 bg-[#f1f1f2] rounded-full mb-4">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#95959D" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '16px', color: '#41404D', fontWeight: 700 }}>
          {hasActiveFilters ? 'No matches found for your filters' : "You're all caught up!"}
        </p>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', lineHeight: '18px', color: '#95959D', marginTop: '6px' }}>
          {hasActiveFilters ? 'Try removing a filter or clear all.' : 'No more pending requests'}
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-3 text-[#0AA4B8] active:opacity-70 transition-opacity"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', fontWeight: 700 }}
          >
            Clear all
          </button>
        )}
      </div>
    );
  }

  const currentRequest = sourceRequests[0];

  return (
    <div className="relative w-full flex-1 px-[10px] flex flex-col items-center pt-[4px] pb-[16px]">
      {showingFallback && (
        <div className="w-full px-[6px] pt-[4px] pb-[10px]">
          <div className="flex items-center justify-between gap-3">
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '16px', color: '#41404D', fontWeight: 700 }}>
              No Matches found for your filters
            </p>
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-[#0AA4B8] active:opacity-70 transition-opacity"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', fontWeight: 700 }}
              >
                Clear filters
              </button>
            )}
          </div>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', lineHeight: '18px', color: '#95959D', marginTop: '6px' }}>
            Showing Similar Matches
          </p>
        </div>
      )}
      {/* Stack container — no padding here. The outer wrapper owns the
          bottom padding so the active card (flex child) and the absolute peek
          shells share the SAME height; SLOT[0] (s=1, y=0) then makes a shell
          visually identical to the active card with no over-grow on advance. */}
      <div className="relative w-full flex-1 flex flex-col" style={{ isolation: 'isolate' }}>
        {/* Stacked card shells — transforms driven continuously by swipeProgress
            so they slide forward in real time as the user drags. Each shell
            now renders the NEXT-in-line request so the user sees profile
            previews peeking behind the active card (not just empty shells).
            Keyed by the active profile id so each new active card brings a
            fresh pair of shells (they fade in instead of inheriting the
            previous frame's advanced transform). */}
        {/* Peek slot resolution.
            Conceptual queue:
              [activeCardOverride?, ...sourceRequests, tailCard?, ...afterTailRequests]
            For each visible peek slot (back-2 = deepest, back-1 = closer),
            resolve to either a Profile peek, the tailCard peek, or nothing.
            Indices shift down by 1 when activeCardOverride is present. */}
        {(() => {
          const peekStart = activeCardOverride ? 0 : 1;
          const backTwoIdx = peekStart + 1; // queue position for back-2 slot
          const backOneIdx = peekStart;     // queue position for back-1 slot
          const keyId = activeCardOverride
            ? (activeCardOverride.key ?? 'empty-state-active')
            : currentRequest?.profile.id;
          const tailIdx = sourceRequests.length; // queue position of tail card
          const tailKey = tailCard?.key ?? 'tail-card';

          // Resolve each slot to one of: 'profile', 'tail', null.
          //   - queue 0..sourceRequests.length-1 → profile from sourceRequests
          //   - queue sourceRequests.length → tail card (if present)
          //   - queue beyond tail card → profile from afterTailRequests
          const resolveSlot = (queueIdx: number) => {
            if (queueIdx < sourceRequests.length) {
              return { type: 'profile' as const, request: sourceRequests[queueIdx] };
            }
            if (tailCard && queueIdx === tailIdx) {
              return { type: 'tail' as const };
            }
            const afterTailIdx = queueIdx - tailIdx - (tailCard ? 1 : 0);
            if (afterTailIdx >= 0 && afterTailIdx < (afterTailRequests?.length ?? 0)) {
              return { type: 'profile' as const, request: afterTailRequests![afterTailIdx] };
            }
            return null;
          };

          const backTwo = resolveSlot(backTwoIdx);
          const backOne = resolveSlot(backOneIdx);

          return (
            <>
              {backTwo && (
                backTwo.type === 'profile' ? (
                  <StackedCardBack
                    key={`back-2-${keyId}`}
                    depth={2}
                    swipeProgress={swipeProgress}
                    request={backTwo.request}
                    isCurrentUserPremium={isCurrentUserPremium}
                  />
                ) : (
                  <StackedCardBack
                    key={`back-2-tail-${tailKey}`}
                    depth={2}
                    swipeProgress={swipeProgress}
                  >
                    {tailCard!.content}
                  </StackedCardBack>
                )
              )}
              {backOne && (
                backOne.type === 'profile' ? (
                  <StackedCardBack
                    key={`back-1-${keyId}`}
                    depth={1}
                    swipeProgress={swipeProgress}
                    request={backOne.request}
                    isCurrentUserPremium={isCurrentUserPremium}
                  />
                ) : (
                  <StackedCardBack
                    key={`back-1-tail-${tailKey}`}
                    depth={1}
                    swipeProgress={swipeProgress}
                  >
                    {tailCard!.content}
                  </StackedCardBack>
                )
              )}
            </>
          );
        })()}

        {/* Active card — either the regular profile InboxCard, or the in-card
            empty state when the parent passes activeCardOverride. In both cases
            the SwipeableCard wrapper handles drag/swipe/dismiss the same way. */}
        {activeCardOverride ? (
          <SwipeableCard
            key={activeCardOverride.key ?? 'empty-state-active'}
            isCurrentUserPremium={isCurrentUserPremium}
            onDismissComplete={handleOverrideDismiss}
            x={swipeX}
            // Empty-state card (B / C) is dismiss-by-click only — the only
            // valid action is tapping the View All pill (or Explore Matches).
            // Disabling drag prevents accidental left/right swipes.
            dragDisabled
          >
            {activeCardOverride.content}
          </SwipeableCard>
        ) : (
          currentRequest && (
            <SwipeableCard
              key={currentRequest.profile.id}
              request={currentRequest}
              isCurrentUserPremium={isCurrentUserPremium}
              onDismissComplete={handleDismissComplete}
              onTap={() => onViewProfile?.(currentRequest.profile)}
              x={swipeX}
            />
          )
        )}
      </div>
    </div>
  );
}