import React from 'react';
import { motion } from 'motion/react';
import type { Profile } from '../matches/ProfileCard';
import type { InboxRequest } from './InboxReceivedView';
import { CrownFilledIcon } from '../icons';
import svgPaths from '../../../imports/svg-73td7n7p03';

interface InboxListViewProps {
  requests: InboxRequest[];
  isCurrentUserPremium: boolean;
  onAccept?: (profile: Profile) => void;
  onDecline?: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
  /** If provided, these are soft-filtered "other" requests shown after matching ones */
  otherRequests?: InboxRequest[];
  /** If true, user has applied filters (used for empty-state messaging). */
  hasActiveFilters?: boolean;
  /** Optional clear filters action (used when no matches). */
  onClearFilters?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Micro components
// ─────────────────────────────────────────────────────────────────────────────

const BlueTick = () => (
  <div className="relative shrink-0 size-[18px]">
    <div className="absolute left-[1.9px] top-[1.9px] size-[14.2px]">
      <div className="absolute inset-[-7.89%]">
        <svg className="block size-full" fill="none" viewBox="0 0 22 22">
          <path d={svgPaths.p9deb400} fill="#0094FF" />
        </svg>
      </div>
    </div>
    <div className="absolute h-[3.3px] left-[6.6px] top-[7.3px] w-[4.8px]">
      <div className="absolute inset-[-22.73%_-15.63%]">
        <svg className="block size-full" fill="none" viewBox="0 0 8.39995 6.39995">
          <path d={svgPaths.p22ab8040} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </div>
    </div>
  </div>
);

const CONNECT_GRADIENT_GREEN = 'linear-gradient(-6.59deg, #0AA4B8 13%, #09BF6C 86%)';

// ─────────────────────────────────────────────────────────────────────────────
// List Row
// ─────────────────────────────────────────────────────────────────────────────

interface ListRowProps {
  request: InboxRequest;
  isCurrentUserPremium: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onTap: () => void;
  dimmed?: boolean;
}

interface MessageCapsuleProps {
  senderFirstName: string;
  message: string;
  isCurrentUserPremium: boolean;
}

const MessageCapsule = ({ senderFirstName, message, isCurrentUserPremium }: MessageCapsuleProps) => (
  <div className="relative mt-3">
    <div className="absolute -top-[6px] left-[22%] h-3 w-3 rotate-45 border-l border-t border-[#A4E4EE] bg-white" />
    <div className="flex items-center gap-2 rounded-full border border-[#A4E4EE] bg-white px-4 py-2.5">
      {isCurrentUserPremium ? (
        <>
          <p
            className="min-w-0 flex-1 truncate italic text-[#72727D]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', lineHeight: '20px', fontWeight: 400 }}
          >
            {message}
          </p>
          <span
            className="shrink-0 text-[#0AA4B8]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '15px', lineHeight: '20px', fontWeight: 500 }}
          >
            more &rsaquo;
          </span>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="#95959D" strokeWidth="1.8" strokeLinecap="round" />
              <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="#95959D" strokeWidth="1.8" />
            </svg>
            <p
              className="truncate italic text-[#72727D]"
              style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', lineHeight: '20px', fontWeight: 400 }}
            >
              {senderFirstName} has sent you...
            </p>
          </div>
          <span
            className="shrink-0 text-[#0AA4B8]"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '15px', lineHeight: '20px', fontWeight: 500 }}
          >
            Upgrade to View &rsaquo;
          </span>
        </>
      )}
    </div>
  </div>
);

const ListRow = React.memo(({ request, isCurrentUserPremium, onAccept, onDecline, onTap, dimmed }: ListRowProps) => {
  const { profile, message, timestamp } = request;
  const avatarUrl = profile.imageUrl || profile.photos?.full || '';
  const firstName = profile.name.split(' ')[0];
  const lastInitial = profile.name.split(' ')[1]?.[0] || '';
  const age = profile.age;
  const height = profile.heightCm ? cmToFeetInches(profile.heightCm) : profile.height || '';
  const profession = profile.profession;
  const caste = profile.community || '';
  const city = profile.location?.city || profile.city || '';
  const state = profile.location?.state || profile.state || '';
  const hasVerifiedBadge = profile.badges?.includes('Blue Tick') || profile.verified?.id;
  const senderFirstName = firstName;

  return (
    <motion.div
      className={`px-3 transition-opacity ${dimmed ? 'opacity-60' : ''}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: dimmed ? 0.6 : 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="rounded-[18px] bg-white shadow-[0_8px_22px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="cursor-pointer px-4 pt-4 pb-2" onClick={onTap}>
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-[84px] w-[84px] rounded-full overflow-hidden bg-[#f1f1f2]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={firstName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[#f1f1f2]">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="#B1B3B9" strokeWidth="1.6" />
                      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="#B1B3B9" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
              {(profile.isPremium || profile.isVip) && (
                <div
                  className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: profile.isVip ? '#6f3ba9' : '#ff5a60' }}
                >
                  <CrownFilledIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className="truncate text-[#41404D]"
                      style={{ fontFamily: "'Roboto', sans-serif", fontSize: '18px', lineHeight: '26px', fontWeight: 700 }}
                    >
                      {firstName} {lastInitial}
                    </p>
                    {hasVerifiedBadge && <BlueTick />}
                  </div>
                </div>
                <p
                  className="shrink-0 text-[#95959D]"
                  style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}
                >
                  {timestamp}
                </p>
              </div>
              <p
                className="truncate text-[#72727D]"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}
              >
                {[`${age} yrs, ${height}`, caste].filter(Boolean).join(' \u2022 ')}
              </p>
              <p
                className="truncate text-[#72727D]"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}
              >
                {profession}
              </p>
              <p
                className="truncate text-[#72727D]"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}
              >
                {[city, state].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <MessageCapsule
            senderFirstName={senderFirstName}
            message={message}
            isCurrentUserPremium={isCurrentUserPremium}
          />
        </div>

        <div className="px-4 pb-4 pt-1.5">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onDecline(); }}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#F1F1F2] active:scale-95 transition-transform"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4L12 12M4 12L12 4" stroke="#9B9CA5" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span
                className="text-[#72727D]"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: '15px', lineHeight: '20px', fontWeight: 400 }}
              >
                Decline
              </span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAccept(); }}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-white active:scale-95 transition-transform"
              style={{
                backgroundImage: CONNECT_GRADIENT_GREEN,
              }}
            >
              <svg className="h-[16px] w-[16px]" viewBox="0 0 14 12" fill="none" aria-hidden>
                <path d="M1 6L5 10L13 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: '15px', lineHeight: '20px', fontWeight: 700 }}
              >
                Accept
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ListRow.displayName = 'ListRow';

// ─────────────────────────────────────────────────────────────────────────────
// Main List View
// ─────────────────────────────────────────────────────────────────────────────

export function InboxListView({
  requests,
  isCurrentUserPremium,
  onAccept,
  onDecline,
  onViewProfile,
  otherRequests,
  hasActiveFilters = false,
  onClearFilters,
}: InboxListViewProps) {
  if (requests.length === 0 && (!otherRequests || otherRequests.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
        <div className="p-6 bg-[#f1f1f2] rounded-full mb-4">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#95959D" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '16px', color: '#41404D', fontWeight: 700 }}>
          {hasActiveFilters ? 'No matches found for your filters' : "You're all caught up!"}
        </p>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', lineHeight: '18px', color: '#95959D', marginTop: '6px' }}>
          {hasActiveFilters ? "Try removing a filter or we'll show Similar Matches below." : 'No more pending requests'}
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

  return (
    <div className="flex flex-col w-full gap-3 pt-2">
      {requests.length === 0 && otherRequests && otherRequests.length > 0 && (
        <div className="px-4 pt-1 pb-1">
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
      {requests.map((req) => (
        <ListRow
          key={req.profile.id}
          request={req}
          isCurrentUserPremium={isCurrentUserPremium}
          onAccept={() => onAccept?.(req.profile)}
          onDecline={() => onDecline?.(req.profile)}
          onTap={() => onViewProfile?.(req.profile)}
        />
      ))}

      {/* Fallback: only shown when there are ZERO matches */}
      {requests.length === 0 && otherRequests && otherRequests.length > 0 && (
        <>
          {otherRequests.map((req) => (
            <ListRow
              key={req.profile.id}
              request={req}
              isCurrentUserPremium={isCurrentUserPremium}
              onAccept={() => onAccept?.(req.profile)}
              onDecline={() => onDecline?.(req.profile)}
              onTap={() => onViewProfile?.(req.profile)}
            />
          ))}
        </>
      )}
    </div>
  );
}
