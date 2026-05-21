import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../utils/cn';
import { VerificationFilledIcon } from '../icons';
import type { ChatConversation, OnlineUser } from '../../../data/mockChats';
import type { InboxRequest } from '../inbox/InboxReceivedView';

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

interface ChatListViewProps {
  conversations: ChatConversation[];
  onlineUsers: OnlineUser[];
  onOpenChat: (conversation: ChatConversation) => void;
  onOpenOnlineChat?: (user: OnlineUser) => void;
  showOnlineUsers?: boolean;
  listBottomSpacerClassName?: string;
  topRequests?: InboxRequest[];
  moreRequests?: InboxRequest[];
  onOpenRequest?: (request: InboxRequest) => void;
}

// ═══════════════════════════════════════════════════════
// Online Dot — matches Figma: 12px, fill #0ED279, stroke white
// ═══════════════════════════════════════════════════════

const OnlineDot = ({ size = 12, className }: { size?: number; className?: string }) => (
  <svg className={cn("block", className)} width={size} height={size} viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5.5" fill="#0ED279" stroke="white" />
  </svg>
);

// ═══════════════════════════════════════════════════════
// Online Users Row — Figma: 60px avatars, 8px gap to name, 12px text
// ═══════════════════════════════════════════════════════

const OnlineUserAvatar = ({ user, onTap }: { user: OnlineUser; onTap?: () => void }) => {
  const firstName = user.profile.name.split(' ')[0];
  const lastInitial = user.profile.name.split(' ')[1]?.charAt(0) || '';
  const avatarUrl = user.profile.photos?.avatar || user.profile.avatarUrl;

  return (
    <button className="flex flex-col items-center gap-[8px] shrink-0 cursor-pointer" onClick={onTap}>
      {/* 60px avatar with online dot */}
      <div className="relative" style={{ width: 60, height: 60 }}>
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-muted">
          {avatarUrl ? (
            <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary" style={{ fontSize: 20 }}>
              {firstName.charAt(0)}
            </div>
          )}
        </div>
        {/* Green dot — bottom-4px, right-3.28px per Figma */}
        <div className="absolute" style={{ bottom: 4, right: 3.28 }}>
          <OnlineDot size={12} />
        </div>
      </div>
      <p
        className="text-center truncate w-full"
        style={{
          fontSize: 12,
          lineHeight: '16px',
          letterSpacing: '0.2px',
          color: 'var(--color-muted-foreground)',
          maxWidth: 60,
        }}
      >
        {firstName} {lastInitial}
      </p>
    </button>
  );
};

const OnlineUsersRow = ({ users, onTapUser }: { users: OnlineUser[]; onTapUser?: (user: OnlineUser) => void }) => {
  if (users.length === 0) return null;
  return (
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-hide no-scrollbar">
        {/* Figma: gap-20px between profiles, px-16px */}
        <div className="flex items-start gap-[20px] px-4 py-3">
          {users.map((user) => (
            <OnlineUserAvatar key={user.id} user={user} onTap={() => onTapUser?.(user)} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// Unread Count Badge — Figma: 24px circle, bg #0ED279, 16px bold white
// ═══════════════════════════════════════════════════════

const UnreadBadge = ({ count }: { count: number }) => (
  <div
    className="flex items-center justify-center rounded-full shrink-0"
    style={{ width: 20, height: 20, backgroundColor: '#0ED279' }}
  >
    <span
      className="text-white text-center"
      style={{ fontSize: 12, lineHeight: '20px', fontWeight: 700 }}
    >
      {count}
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════
// Reply Button — Figma: h-28px, rounded-full, border #0aa4b8, 12px medium
// ═══════════════════════════════════════════════════════

const ReplyButton = () => (
  <div
    className="flex items-center justify-center shrink-0 rounded-full"
    style={{
      height: 28,
      paddingLeft: 16,
      paddingRight: 16,
      border: '1px solid var(--color-primary)',
    }}
  >
    <span
      className="text-center whitespace-nowrap"
      style={{
        fontSize: 12,
        lineHeight: '16px',
        letterSpacing: '0.2px',
        fontWeight: 500,
        color: 'var(--color-primary)',
      }}
    >
      Reply
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════
// Chat List Item — Figma: 54px avatar, 12px gap, 16px name, 14px message
// ═══════════════════════════════════════════════════════

const ChatListItem = ({
  conversation,
  onTap,
  hideDivider = false,
}: {
  conversation: ChatConversation;
  onTap: () => void;
  hideDivider?: boolean;
}) => {
  const { profile, lastMessage, lastMessageTime, unreadCount, isAccepted } = conversation;
  const avatarUrl = profile.photos?.avatar || profile.avatarUrl;
  const firstName = profile.name.split(' ')[0];
  const lastInitial = profile.name.split(' ')[1]?.charAt(0) || '';
  const displayName = `${firstName} ${lastInitial}`;
  const isVerified = profile.isVerified || profile.verified?.id || profile.verified?.selfie;
  const hasUnread = unreadCount > 0;
  // Figma: green time color for unread/recent chats
  const timeColor = hasUnread ? '#00b860' : 'var(--color-muted-foreground)';

  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-[12px] text-left cursor-pointer active:bg-muted/40 transition-colors"
      style={{ padding: '0 16px' }}
    >
      {/* Avatar — 54px round */}
      <div className="shrink-0 rounded-full overflow-hidden" style={{ width: 54, height: 54 }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted" style={{ fontSize: 20, color: 'var(--color-muted-foreground)' }}>
            {firstName.charAt(0)}
          </div>
        )}
      </div>

      {/* Content — with bottom border (suppressed when followed by a full-width divider) */}
      <div
        className={cn('flex-1 min-w-0 py-4', hideDivider ? '' : 'border-b')}
        style={{ borderColor: 'var(--color-neutral-100)' }}
      >
        {/* Row 1: Name + Tick | Time */}
        <div className="flex items-center gap-[8px]">
          <div className="flex flex-1 items-center gap-[2px] min-w-0">
            <span
              className="truncate"
              style={{
                fontSize: 16,
                lineHeight: '24px',
                fontWeight: 500,
                color: 'var(--color-foreground)',
              }}
            >
              {displayName}
            </span>
            {isVerified && (
              <VerificationFilledIcon className="w-4 h-4 text-[#0094FF] shrink-0" />
            )}
          </div>
          <span
            className="shrink-0"
            style={{
              fontSize: 12,
              lineHeight: '16px',
              letterSpacing: '0.2px',
              color: timeColor,
              fontWeight: hasUnread ? 500 : 400,
            }}
          >
            {lastMessageTime}
          </span>
        </div>

        {/* Row 2: Message | Badge/Reply */}
        <div className="flex items-center gap-[10px]">
          <p
            className="flex-1 min-w-0 truncate"
            style={{
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--color-muted-foreground)',
            }}
          >
            {lastMessage}
          </p>
          {hasUnread && <UnreadBadge count={unreadCount} />}
          {!hasUnread && !isAccepted && <ReplyButton />}
        </div>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════
// Locked Request Item — request whose message is hidden until accepted
// Figma: blurred preview text, green unread "1" badge
// ═══════════════════════════════════════════════════════

const LockedRequestItem = ({
  request,
  onTap,
}: {
  request: InboxRequest;
  onTap?: () => void;
}) => {
  const { profile } = request;
  const avatarUrl = profile.photos?.avatar || profile.avatarUrl;
  const firstName = profile.name.split(' ')[0];
  const lastInitial = profile.name.split(' ')[1]?.charAt(0) || '';
  const displayName = `${firstName} ${lastInitial}`;
  const isVerified = profile.isVerified || profile.verified?.id || profile.verified?.selfie;

  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-[12px] text-left cursor-pointer active:bg-muted/40 transition-colors"
      style={{ padding: '0 16px' }}
    >
      <div className="shrink-0 rounded-full overflow-hidden" style={{ width: 54, height: 54 }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted" style={{ fontSize: 20, color: 'var(--color-muted-foreground)' }}>
            {firstName.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 py-4 border-b" style={{ borderColor: 'var(--color-neutral-100)' }}>
        <div className="flex items-center gap-[8px]">
          <div className="flex flex-1 items-center gap-[2px] min-w-0">
            <span
              className="truncate"
              style={{
                fontSize: 16,
                lineHeight: '24px',
                fontWeight: 500,
                color: 'var(--color-foreground)',
              }}
            >
              {displayName}
            </span>
            {isVerified && (
              <VerificationFilledIcon className="w-4 h-4 text-[#0094FF] shrink-0" />
            )}
          </div>
          <span
            className="shrink-0"
            style={{
              fontSize: 12,
              lineHeight: '16px',
              letterSpacing: '0.2px',
              color: '#00b860',
              fontWeight: 500,
            }}
          >
            {request.timestamp}
          </span>
        </div>

        <div className="flex items-center gap-[10px]">
          <p
            className="flex-1 min-w-0 truncate select-none"
            style={{
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--color-muted-foreground)',
              filter: 'blur(4px)',
            }}
            aria-hidden
          >
            {request.message}
          </p>
          <UnreadBadge count={1} />
        </div>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════
// More Requests Bar — collapsible header showing stacked avatars + count
// ═══════════════════════════════════════════════════════

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 200ms ease',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MoreRequestsBar = ({
  requests,
  expanded,
  onToggle,
}: {
  requests: InboxRequest[];
  expanded: boolean;
  onToggle: () => void;
}) => {
  const stacked = requests.slice(0, 3);
  const remainingCount = Math.max(0, requests.length - stacked.length);
  const AVATAR_SIZE = 28;
  const OVERLAP = 10;
  // Full chip-stack width when laid out: first avatar full + remaining items each contributing (size - overlap)
  const chipCount = stacked.length + (remainingCount > 0 ? 1 : 0);
  const chipStackWidth = chipCount > 0 ? AVATAR_SIZE + (chipCount - 1) * (AVATAR_SIZE - OVERLAP) : 0;
  const CHIP_GAP = 8; // matches gap between chips and label in collapsed state
  // Easing + duration used across every animated property so motion stays synced
  const EASE = [0.32, 0.72, 0, 1] as const;
  const DURATION = 0.75;
  const transition = { duration: DURATION, ease: EASE };

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center cursor-pointer active:bg-muted/40 transition-colors"
      style={{
        padding: '14px 16px',
        // Fixed min height accommodating the chip stack so bar doesn't reflow on toggle
        minHeight: AVATAR_SIZE + 4 + 28,
        borderTop: '1px solid var(--color-neutral-100)',
        borderBottom: '1px solid var(--color-neutral-100)',
        backgroundColor: 'var(--color-neutral-50)',
      }}
    >
      {/* Left cluster: chips (animated) + label translate as one synced motion.
          2px optical-alignment offset when expanded so the text feels aligned
          with the avatars in the chat rows above/below. */}
      <motion.div
        className="flex items-center min-w-0"
        animate={{ x: expanded ? -(chipStackWidth + CHIP_GAP) + 2 : 0 }}
        transition={transition}
        style={{ gap: CHIP_GAP }}
      >
        {/* Chip stack — each chip animates individually with staggered "string-pull" feel:
            leftmost moves first/fastest, trailing chips lag slightly. Spring damping
            gives a subtle elastic settle. */}
        <div
          className="flex items-center shrink-0"
          style={{ width: chipStackWidth, pointerEvents: expanded ? 'none' : 'auto' }}
          aria-hidden={expanded}
        >
          {(() => {
            const chipCountTotal = stacked.length + (remainingCount > 0 ? 1 : 0);
            // Travel distance: enough to clear the bar's left edge
            const TRAVEL = -(chipStackWidth + 16);
            // Stagger increases with index — trailing chips lag slightly
            const stagger = (idx: number) => idx * 0.045;
            const chipSpring = (idx: number) => ({
              type: 'spring' as const,
              stiffness: 280 - idx * 12,
              damping: 22 + idx * 1.5,
              mass: 0.9 + idx * 0.08,
              delay: expanded ? stagger(idx) : stagger(chipCountTotal - 1 - idx),
            });

            return (
              <>
                {stacked.map((req, idx) => {
                  const avatarUrl = req.profile.photos?.avatar || req.profile.avatarUrl;
                  return (
                    <motion.div
                      key={req.profile.id}
                      className="rounded-full overflow-hidden bg-muted shrink-0"
                      animate={{ x: expanded ? TRAVEL : 0, opacity: expanded ? 0 : 1 }}
                      transition={chipSpring(idx)}
                      style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        marginLeft: idx === 0 ? 0 : -OVERLAP,
                        boxShadow: '0 0 0 2px var(--color-background)',
                        position: 'relative',
                        zIndex: idx + 1,
                      }}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </motion.div>
                  );
                })}
                {remainingCount > 0 && (
                  <motion.div
                    className="rounded-full flex items-center justify-center shrink-0"
                    animate={{ x: expanded ? TRAVEL : 0, opacity: expanded ? 0 : 1 }}
                    transition={chipSpring(stacked.length)}
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
                        fontSize: 12,
                        lineHeight: 1,
                        fontWeight: 600,
                        color: 'var(--color-foreground)',
                      }}
                    >
                      +{remainingCount}
                    </span>
                  </motion.div>
                )}
              </>
            );
          })()}
        </div>

        <span
          className="truncate"
          style={{
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 500,
            color: 'var(--color-foreground)',
          }}
        >
          More Requests
        </span>
      </motion.div>

      <div
        className="flex items-center gap-[4px] shrink-0 ml-auto"
        style={{
          fontSize: 14,
          lineHeight: '20px',
          fontWeight: 500,
          color: 'var(--color-primary)',
        }}
      >
        <span>{expanded ? 'Hide' : 'View All'}</span>
        <ChevronIcon expanded={expanded} />
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════
// Main ChatListView
// ═══════════════════════════════════════════════════════

export const ChatListView = ({
  conversations,
  onlineUsers,
  onOpenChat,
  onOpenOnlineChat,
  showOnlineUsers = true,
  listBottomSpacerClassName = 'h-0',
  topRequests = [],
  moreRequests = [],
  onOpenRequest,
}: ChatListViewProps) => {
  const [moreExpanded, setMoreExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full">
      {showOnlineUsers ? <OnlineUsersRow users={onlineUsers} onTapUser={onOpenOnlineChat} /> : null}
      <div className="flex flex-col">
        {topRequests.map((req) => (
          <LockedRequestItem
            key={`top_${req.profile.id}`}
            request={req}
            onTap={() => onOpenRequest?.(req)}
          />
        ))}
        {conversations.map((convo, idx) => {
          const isLast = idx === conversations.length - 1;
          const hideDivider = isLast && moreRequests.length > 0;
          return (
            <ChatListItem
              key={convo.id}
              conversation={convo}
              onTap={() => onOpenChat(convo)}
              hideDivider={hideDivider}
            />
          );
        })}
        {moreRequests.length > 0 && (
          <>
            <MoreRequestsBar
              requests={moreRequests}
              expanded={moreExpanded}
              onToggle={() => setMoreExpanded((v) => !v)}
            />
            <AnimatePresence initial={false}>
              {moreExpanded && (
                <motion.div
                  key="more-requests-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.75, ease: [0.32, 0.72, 0, 1] },
                    opacity: { duration: 0.5, ease: 'easeOut' },
                  }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="flex flex-col">
                    {moreRequests.map((req) => (
                      <LockedRequestItem
                        key={`more_${req.profile.id}`}
                        request={req}
                        onTap={() => onOpenRequest?.(req)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        <div className={listBottomSpacerClassName} />
      </div>
    </div>
  );
};