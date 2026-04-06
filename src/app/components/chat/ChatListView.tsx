import React from 'react';
import { cn } from '../../../utils/cn';
import { VerificationFilledIcon } from '../icons';
import type { ChatConversation, OnlineUser } from '../../../data/mockChats';

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
    style={{ width: 24, height: 24, backgroundColor: '#0ED279' }}
  >
    <span
      className="text-white text-center"
      style={{ fontSize: 16, lineHeight: '24px', fontWeight: 700 }}
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
}: {
  conversation: ChatConversation;
  onTap: () => void;
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

      {/* Content — with bottom border */}
      <div className="flex-1 min-w-0 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
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
// Main ChatListView
// ═══════════════════════════════════════════════════════

export const ChatListView = ({
  conversations,
  onlineUsers,
  onOpenChat,
  onOpenOnlineChat,
  showOnlineUsers = true,
  listBottomSpacerClassName = 'h-0',
}: ChatListViewProps) => {
  return (
    <div className="flex flex-col w-full">
      {showOnlineUsers ? <OnlineUsersRow users={onlineUsers} onTapUser={onOpenOnlineChat} /> : null}
      <div className="flex flex-col">
        {conversations.map((convo) => (
          <ChatListItem key={convo.id} conversation={convo} onTap={() => onOpenChat(convo)} />
        ))}
        <div className={listBottomSpacerClassName} />
      </div>
    </div>
  );
};