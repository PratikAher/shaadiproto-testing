import React, { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'motion/react';
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

// Tuned so depth-2's visible bottom edge clears depth-1's by a few px — gives
// the stack a clear 3-card depth read (active + 2 peeks). Each deeper layer
// scales down a bit more AND offsets down more so the lower edges step out.
const StackedCardBack = ({ depth }: { depth: 1 | 2 }) => {
  const scale = depth === 1 ? 0.96 : 0.92;
  const translateY = depth === 1 ? 8 : 22;
  return (
    <div
      className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        zIndex: -depth,
      }}
    >
      <div
        className="bg-white rounded-[16px] h-full w-full"
        style={{
          boxShadow: depth === 1
            ? '0px 2px 8px rgba(0,0,0,0.07), 0px 0px 1px rgba(0,0,0,0.08)'
            : '0px 2px 6px rgba(0,0,0,0.05), 0px 0px 1px rgba(0,0,0,0.06)',
        }}
      />
    </div>
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
  request: InboxRequest;
  isCurrentUserPremium: boolean;
  onDismissComplete: (dir: 'left' | 'right') => void;
  onTap?: () => void;
}

function SwipeableCard({ request, isCurrentUserPremium, onDismissComplete, onTap }: SwipeableCardProps) {
  const x = useMotionValue(0);
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
        cursor: 'grab',
        willChange: 'transform',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      initial={{ scale: 0.95, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 28,
        mass: 0.8,
      }}
    >
      <InboxCard
        request={request}
        isCurrentUserPremium={isCurrentUserPremium}
        onAccept={handleAcceptBtn}
        onDecline={handleDeclineBtn}
        onTap={onTap}
        acceptStampOpacity={acceptStampOpacity}
        declineStampOpacity={declineStampOpacity}
      />
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
}: InboxReceivedViewProps) {
  // No internal currentIndex needed — the parent filters out dismissed profiles,
  // so requests[0] is always the correct current card.
  const showingFallback = hasActiveFilters && requests.length === 0 && (fallbackRequests?.length ?? 0) > 0;
  const sourceRequests = showingFallback ? (fallbackRequests as InboxRequest[]) : requests;
  const remaining = sourceRequests.length;

  const handleDismissComplete = useCallback(
    (direction: 'left' | 'right') => {
      const req = sourceRequests[0];
      if (!req) return;
      if (direction === 'right') {
        onAccept?.(req.profile);
      } else {
        onDecline?.(req.profile);
      }
      // No index increment needed — parent removes dismissed profile from requests array
    },
    [sourceRequests, onAccept, onDecline]
  );

  if (remaining <= 0) {
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
    <div className="relative w-full flex-1 px-[10px] flex flex-col items-center pt-[4px]">
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
      {/* Stack container — extra bottom padding so the depth-2 peek isn't clipped */}
      <div className="relative w-full flex-1 flex flex-col pb-[28px]" style={{ isolation: 'isolate' }}>
        {/* Stacked card shells — clearly visible behind */}
        {remaining > 2 && <StackedCardBack depth={2} />}
        {remaining > 1 && <StackedCardBack depth={1} />}

        {/* Active card */}
        <SwipeableCard
          key={currentRequest.profile.id}
          request={currentRequest}
          isCurrentUserPremium={isCurrentUserPremium}
          onDismissComplete={handleDismissComplete}
          onTap={() => onViewProfile?.(currentRequest.profile)}
        />
      </div>
    </div>
  );
}