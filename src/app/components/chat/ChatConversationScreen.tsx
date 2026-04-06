import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { VerificationFilledIcon } from '../icons';
import GroupBackIcon from '../../../imports/Group';
import chatSvgPaths from '../../../imports/svg-psnhs5alme';
import type { ChatConversation, ChatMessage } from '../../../data/mockChats';
import SendButtonIcon from '../../../imports/SendButtonIcon';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import { Button } from '../Button';
import { motion, AnimatePresence } from 'motion/react';
import chatBackgroundImage from '../../../assets/chat/chat-background.png';

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

export type ConnectionStatus = 'accepted' | 'inbox_pending' | 'connect_sent' | 'not_connected';

interface ChatConversationScreenProps {
  conversation: ChatConversation;
  onBack: () => void;
  onFirstMessageSent?: (conversation: ChatConversation, messageText: string) => void;
  onMessageUpdate?: (profileId: string, messages: ChatMessage[]) => void;
  connectionStatus?: ConnectionStatus;
  onConnectFromChat?: (profileId: string) => void;
  onSendConnectMessage?: (profileId: string, message: string) => void;
  onAcceptFromChat?: (profileId: string, replyMessage?: string) => void;
  onDeclineFromChat?: (profileId: string) => void;
}

// ═══════════════════════════════════════════════════════
// Figma Icons — extracted exactly from ChatView.tsx
// ═══════════════════════════════════════════════════════

/** Video Call — 24px, two SVG paths */
const VideoCallIcon = () => (
  <div className="overflow-clip relative shrink-0" style={{ width: 24, height: 24 }}>
    <div className="absolute" style={{ inset: '16.67% 29.17% 16.67% 8.33%' }}>
      <div className="absolute" style={{ inset: '-4.69% -5%' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 17.5">
          <path d={chatSvgPaths.p12433580} stroke="var(--fill-0, #41404D)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
    <div className="absolute" style={{ inset: '27.08% 8.33% 27.08% 70.83%' }}>
      <div className="absolute" style={{ inset: '-6.83% -15%' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.50002 12.502">
          <path d={chatSvgPaths.p240827b0} stroke="var(--fill-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  </div>
);

/** Call — 24px */
const CallIcon = () => (
  <div className="overflow-clip relative shrink-0" style={{ width: 24, height: 24 }}>
    <div className="absolute" style={{ inset: '12.5%' }}>
      <div className="absolute" style={{ inset: '-4.17%' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4999 19.5">
          <path d={chatSvgPaths.p334c9180} stroke="var(--fill-0, #41404D)" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  </div>
);

/** More 01 — 32px container */
const MoreIcon = () => (
  <div className="overflow-clip relative shrink-0" style={{ width: 32, height: 32 }}>
    {/* Top dot */}
    <div className="absolute" style={{ inset: '17.71% 42.67% 67.71% 42.71%' }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.67867 4.66667">
        <path clipRule="evenodd" d={chatSvgPaths.p8c01b00} fill="var(--fill-0, #41404D)" fillRule="evenodd" />
      </svg>
    </div>
    {/* Middle dot */}
    <div className="absolute" style={{ inset: '42.71% 42.7% 42.71% 42.68%' }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.67867 4.66667">
        <path d={chatSvgPaths.p21a1a8f0} fill="var(--fill-0, #41404D)" stroke="var(--fill-0, #41404D)" strokeWidth="1.33333" />
      </svg>
    </div>
    {/* Bottom dot */}
    <div className="absolute" style={{ inset: '67.71% 42.74% 17.71% 42.64%' }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.67867 4.66667">
        <path d={chatSvgPaths.p21a1a8f0} fill="var(--fill-0, #41404D)" stroke="var(--fill-0, #41404D)" strokeWidth="1.33333" />
      </svg>
    </div>
  </div>
);

/** Shield — 16px for safety notice */
const ShieldIcon = () => (
  <div className="flex items-center justify-center shrink-0" style={{ width: 16, height: 16 }}>
    <svg className="block" width="11.354" height="13.333" viewBox="0 0 11.3544 13.3333" fill="none">
      <path d={chatSvgPaths.p11730a00} stroke="var(--fill-0, #41404D)" strokeWidth="1.33333" />
      <path d={chatSvgPaths.p1cac280} fill="var(--fill-0, #41404D)" />
    </svg>
  </div>
);

/** + icon — 24px */
const AddIcon = () => (
  <div className="overflow-clip relative shrink-0" style={{ width: 24, height: 24 }}>
    <div className="absolute" style={{ inset: '16.67% 16.66% 16.66% 16.67%' }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.002 16.0019">
        <path d={chatSvgPaths.p1c338900} fill="var(--fill-0, #41404D)" />
      </svg>
    </div>
  </div>
);

/** Premium crown — Figma: 20px circle bg #ff5a60, 10px crown icon */
const PremiumTag = () => (
  <div
    className="flex items-center justify-center rounded-full absolute"
    style={{ width: 20, height: 20, backgroundColor: '#ff5a60', top: 8, left: 8 }}
  >
    <svg className="block" width="10" height="8" viewBox="0 0 8.95838 7.70833" fill="none">
      <path clipRule="evenodd" d={chatSvgPaths.p2bf9c600} fill="white" fillRule="evenodd" />
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════
// Profile Info Card — with animated bottom section transitions
// ═══════════════════════════════════════════════════════

/** Tick icon for Connect Now / Accept buttons */
const ConnectTickIcon = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileInfoCard = ({
  conversation,
  status,
  onConnect,
  onAccept,
  onDecline,
}: {
  conversation: ChatConversation;
  status: ConnectionStatus;
  onConnect?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}) => {
  const { profile } = conversation;
  const avatarUrl = profile.photos?.avatar || profile.avatarUrl;
  const fullImageUrl = profile.photos?.full || profile.imageUrl;
  const isVerified = profile.isVerified || profile.verified?.id || profile.verified?.selfie;
  const firstName = profile.name.split(' ')[0];
  const lastInitial = profile.name.split(' ')[1]?.charAt(0) || '';

  const heightDisplay = profile.height || (profile.heightCm
    ? `${Math.floor(profile.heightCm / 30.48)}' ${Math.round((profile.heightCm % 30.48) / 2.54)}"`
    : '');
  const locationDisplay = profile.location
    ? `${profile.location.city}, India`
    : (profile.city || '');
  const [cardImageSrc, setCardImageSrc] = useState(fullImageUrl || avatarUrl || '');

  useEffect(() => {
    setCardImageSrc(fullImageUrl || avatarUrl || '');
  }, [fullImageUrl, avatarUrl, profile.id]);

  // Animated bottom section content based on connection status
  const renderBottomSection = () => {
    switch (status) {
      case 'accepted':
        return (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center pt-[12px] relative w-full px-4 pb-4">
              <div className="absolute inset-0 border-t pointer-events-none" style={{ borderColor: '#dfe0e3' }} />
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
                style={{ fontSize: 14, lineHeight: '20px', color: '#41404d', textAlign: 'center' }}
              >
                This is an Accepted Member.
              </motion.p>
            </div>
          </motion.div>
        );

      case 'not_connected':
        return (
          <motion.div
            key="not_connected"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-[8px] pt-[12px] relative w-full px-4 pb-4">
              <div className="absolute inset-0 border-t pointer-events-none" style={{ borderColor: '#dfe0e3' }} />
              <p style={{ fontSize: 14, lineHeight: '20px', color: '#72727d', textAlign: 'center' }}>
                Connect with her to start a Conversation
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={onConnect}
                className="w-full gap-[4px] text-primary border-primary"
              >
                <ConnectTickIcon />
                Connect Now
              </Button>
            </div>
          </motion.div>
        );

      case 'inbox_pending':
        return (
          <motion.div
            key="inbox_pending"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-[8px] pt-[12px] relative w-full px-4 pb-4">
              <div className="absolute inset-0 border-t pointer-events-none" style={{ borderColor: '#dfe0e3' }} />
              <p style={{ fontSize: 14, lineHeight: '20px', color: '#72727d', textAlign: 'center' }}>
                She has sent you Connect
              </p>
              <div className="flex items-center gap-[8px] w-full">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onDecline}
                  className="flex-1 text-muted-foreground border-border"
                >
                  Decline
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={onAccept}
                  className="flex-1 gap-[4px] text-primary border-primary"
                >
                  <ConnectTickIcon />
                  Accept
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'connect_sent':
        return (
          <motion.div
            key="connect_sent"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center pt-[12px] relative w-full px-4 pb-4">
              <div className="absolute inset-0 border-t pointer-events-none" style={{ borderColor: '#dfe0e3' }} />
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
                style={{ fontSize: 14, lineHeight: '20px', color: '#95959d', textAlign: 'center' }}
              >
                Request sent
              </motion.p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="bg-card rounded-2xl relative overflow-hidden"
      style={{ border: '1px solid #dfe0e3' }}
    >
      <div className="flex gap-[12px] items-start p-4">
        {/* Profile Image — 120px square, rounded-12px */}
        <div className="shrink-0 overflow-hidden rounded-xl relative" style={{ width: 120, height: 120 }}>
          {cardImageSrc ? (
            <img
              src={cardImageSrc}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={() => {
                if (cardImageSrc !== avatarUrl && avatarUrl) {
                  setCardImageSrc(avatarUrl);
                  return;
                }
                setCardImageSrc('');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-2xl font-medium">
              {firstName.charAt(0)}
            </div>
          )}
          {profile.isPremium && <PremiumTag />}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-[4px] items-start min-w-0 flex-1">
          {/* Name + tick */}
          <div className="flex items-center gap-[2px] w-full">
            <span
              className="shrink-0 whitespace-nowrap"
              style={{ fontSize: 16, lineHeight: '24px', fontWeight: 700, color: '#41404d' }}
            >
              {firstName} {lastInitial}
            </span>
            {isVerified && (
              <VerificationFilledIcon className="w-4 h-4 text-[#0094FF] shrink-0" />
            )}
          </div>
          {/* Details — 14px regular, leading-20px, gap-2px, color #72727d */}
          <div className="flex flex-col gap-[2px]" style={{ fontSize: 14, lineHeight: '20px', color: '#72727d' }}>
            <p className="truncate">{profile.age} yrs{heightDisplay ? `, ${heightDisplay}` : ''}</p>
            {profile.community && <p className="truncate">{profile.motherTongue ? `${profile.motherTongue}, ` : ''}{profile.community}</p>}
            <p className="truncate">{profile.profession}</p>
            {locationDisplay && <p className="truncate">{locationDisplay}</p>}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {renderBottomSection()}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// Safety Notice — Figma: bg #fcf8e7, rounded-12px, shadow, p-8px
// ═══════════════════════════════════════════════════════

const SafetyNotice = () => (
  <div
    className="relative rounded-xl overflow-hidden"
    style={{
      backgroundColor: '#fcf8e7',
      boxShadow: '0px 6px 12px 0px rgba(0,0,0,0.08), 0px 2px 12px 0px rgba(0,0,0,0.06), 0px 3px 4px 0px rgba(0,0,0,0.06)',
      border: '1px solid #dfe0e3',
    }}
  >
    <div className="flex gap-[8px] items-center p-2">
      <div className="flex flex-1 flex-col gap-[2px] min-w-0">
        {/* Title row */}
        <div className="flex items-center justify-center gap-[2px] w-full">
          <ShieldIcon />
          <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500, color: '#41404d', textAlign: 'center' }}>
            Safety First
          </span>
        </div>
        {/* Body */}
        <p style={{ fontSize: 14, lineHeight: '20px', color: '#72727d', textAlign: 'center' }}>
          {`Be respectful to others. Never share financial details & avoid sharing personal details with matches you don't know.`}
        </p>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// Date — Figma: plain text, 12px, leading-16px, tracking-0.2px, #72727d
// ═══════════════════════════════════════════════════════

const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex items-center justify-center w-full">
    <p style={{ fontSize: 12, lineHeight: '16px', letterSpacing: '0.2px', color: '#72727d', textAlign: 'center' }}>
      {date}
    </p>
  </div>
);

// ═══════════════════════════════════════════════════════
// Read Receipt Checkmarks
// ═══════════════════════════════════════════════════════

const ReadReceipt = ({ read }: { read: boolean }) => (
  <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="shrink-0 ml-[2px]">
    {/* First check */}
    <path
      d="M1.5 5.5L5 9L10.5 1.5"
      stroke={read ? '#0094FF' : '#95959D'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Second check */}
    <path
      d="M5.5 5.5L9 9L14.5 1.5"
      stroke={read ? '#0094FF' : '#95959D'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ═══════════════════════════════════════════════════════
// Message Bubble — animated entrance
// ═══════════════════════════════════════════════════════

const MessageBubble = ({ message, isMe }: { message: ChatMessage; isMe: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    className={cn("flex flex-col px-4 mb-3 w-full", isMe ? "items-end" : "items-start")}
  >
    <div
      className={cn(
        "max-w-[75%] min-w-0 relative p-3 border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]",
        isMe
          ? "bg-neutral-50 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
          : "bg-card rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
      )}
    >
      <p className="text-foreground" style={{ fontSize: 16, lineHeight: '24px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{message.text}</p>
      {/* Timestamp + read receipt — inside bubble, bottom-right */}
      <div className="flex items-center justify-end gap-[2px] mt-1">
        <span
          style={{
            fontSize: 11,
            lineHeight: '16px',
            color: '#95959D',
          }}
        >
          {message.timestamp}
        </span>
        {isMe && <ReadReceipt read={message.read} />}
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════

export const ChatConversationScreen = ({ conversation, onBack, onFirstMessageSent, onMessageUpdate, connectionStatus, onConnectFromChat, onSendConnectMessage, onAcceptFromChat, onDeclineFromChat }: ChatConversationScreenProps) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasNotifiedFirstMessage = useRef(false);

  // Sync messages when conversation changes (e.g., after accept creates new conversation,
  // or connect-from-chat creates a new persisted conversation with sent message)
  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.id, conversation.messages]);

  // Local connection status — initializes from prop, but can transition locally
  // (e.g. Connect Now -> Request sent, Accept -> Accepted)
  const [localStatus, setLocalStatus] = useState<ConnectionStatus>(connectionStatus || 'accepted');

  // Sync local status when the prop changes (e.g., parent state updated)
  useEffect(() => {
    if (connectionStatus) {
      setLocalStatus(connectionStatus);
    }
  }, [connectionStatus]);

  const { profile } = conversation;
  const firstName = profile.name.split(' ')[0];
  const lastInitial = profile.name.split(' ')[1]?.charAt(0) || '';
  const displayName = `${firstName} ${lastInitial}`;
  const isVerified = profile.isVerified || profile.verified?.id || profile.verified?.selfie;
  const isOnline = profile.isOnline;
  const avatarUrl = profile.photos?.avatar || profile.avatarUrl;
  const [headerAvatarSrc, setHeaderAvatarSrc] = useState(avatarUrl || '');

  useEffect(() => {
    setHeaderAvatarSrc(avatarUrl || '');
  }, [avatarUrl, conversation.id]);

  // Smooth scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // If not_connected, typing a message and sending acts as a direct connect request
    if (localStatus === 'not_connected') {
      const msgText = inputText.trim();
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
        textareaRef.current.style.overflow = 'hidden';
      }
      setLocalStatus('connect_sent');
      onSendConnectMessage?.(conversation.profile.id, msgText);
      return;
    }

    // If inbox_pending, typing a message and sending acts as accept + reply
    if (localStatus === 'inbox_pending') {
      const msgText = inputText.trim();
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
        textareaRef.current.style.overflow = 'hidden';
      }
      setLocalStatus('accepted');
      // Accept first, then the reply message will be added via the accepted flow
      onAcceptFromChat?.(conversation.profile.id, msgText);
      return;
    }

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      text: inputText.trim(),
      timestamp: 'Just now',
      read: false,
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText('');
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
      textareaRef.current.style.overflow = 'hidden';
    }
    // Persist messages to parent state
    if (onMessageUpdate) {
      onMessageUpdate(conversation.profile.id, updatedMessages);
    }
    // Call onFirstMessageSent if provided
    if (onFirstMessageSent && conversation.messages.length === 0 && !hasNotifiedFirstMessage.current) {
      onFirstMessageSent(conversation, inputText.trim());
      hasNotifiedFirstMessage.current = true;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = '0px'; // collapse to measure true scrollHeight
      const scrollH = ta.scrollHeight;
      // Max 5 lines: (24px line-height * 5) + 24px padding = 144px
      ta.style.height = `${Math.min(scrollH, 144)}px`;
      // Switch to scroll if max height reached
      ta.style.overflow = scrollH > 144 ? 'auto' : 'hidden';
    }
  }, [inputText]);

  // Show safety banner only when no new messages have been sent beyond the initial ones,
  // and the conversation is still at the early stage (<=2 initial messages).
  const initialMessageCount = conversation.messages.length;
  const showSafetyBanner = messages.length <= initialMessageCount && messages.length <= 2;

  const { isKeyboardVisible } = useKeyboardVisible();

  // Scroll to bottom when keyboard opens so latest messages stay visible
  useEffect(() => {
    if (isKeyboardVisible && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isKeyboardVisible]);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* -- Header -- */}
      <div
        className="flex-none flex items-center bg-background border-b border-border"
        style={{ height: 64 }}
      >
        <div className="flex items-center gap-[4px] w-full px-1 py-2">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex flex-col items-center justify-center shrink-0 cursor-pointer"
            style={{ height: 44 }}
            aria-label="Go back"
          >
            <div className="flex items-center justify-center p-2">
              <div className="relative" style={{ width: 24, height: 24 }}>
                <GroupBackIcon />
              </div>
            </div>
          </button>

          {/* Avatar + Name */}
          <div className="flex flex-1 items-center gap-[8px] min-w-0">
            <div className="shrink-0 rounded-full overflow-hidden" style={{ width: 40, height: 40 }}>
              {headerAvatarSrc ? (
                <img
                  src={headerAvatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={() => setHeaderAvatarSrc('')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted" style={{ fontSize: 16, color: 'var(--color-muted-foreground)' }}>
                  {firstName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <p
                className="truncate"
                style={{ fontSize: 20, lineHeight: '28px', fontWeight: 500, color: 'var(--color-foreground)' }}
              >
                {displayName}
              </p>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: '16px',
                  letterSpacing: '0.2px',
                  color: isOnline ? '#00b860' : 'var(--color-muted-foreground)',
                }}
              >
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Trailing icons */}
          <div className="flex items-center justify-end shrink-0" style={{ height: 48 }}>
            <button className="flex flex-col items-center justify-center shrink-0 cursor-pointer" style={{ height: 44 }}>
              <div className="flex items-center justify-center p-2">
                <VideoCallIcon />
              </div>
            </button>
            <button className="flex flex-col items-center justify-center shrink-0 cursor-pointer" style={{ height: 44 }}>
              <div className="flex items-center justify-center p-2">
                <CallIcon />
              </div>
            </button>
            <button className="flex flex-col items-center justify-center shrink-0 cursor-pointer" style={{ width: 44, height: 48 }}>
              <div className="flex items-center justify-center p-2">
                <MoreIcon />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* -- Chat Body -- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{
          backgroundImage: `url('${chatBackgroundImage}'), linear-gradient(90deg, rgba(212,247,255,0.3) 0%, rgba(212,247,255,0.3) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)`,
          backgroundSize: '231px 356px, auto, auto',
          backgroundPosition: 'top left',
        }}
      >
        {/* Profile card + date */}
        <div className="flex flex-col gap-4 p-4">
          <ProfileInfoCard
            conversation={conversation}
            status={localStatus}
            onConnect={() => {
              onConnectFromChat?.(conversation.profile.id);
            }}
            onAccept={() => {
              setLocalStatus('accepted');
              onAcceptFromChat?.(conversation.profile.id);
            }}
            onDecline={() => {
              onDeclineFromChat?.(conversation.profile.id);
              onBack();
            }}
          />
          {/* Date separator — animated entrance */}
          <AnimatePresence>
            {messages.length > 0 && (
              <motion.div
                key="date-sep"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <DateSeparator date="Today" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages — each bubble animates in */}
        <div className="pb-4 pt-1 overflow-hidden">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === 'me'} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* -- Bottom area: Safety Notice overlaid above Input Bar -- */}
      <div className="flex-none relative">
        {/* Safety Notice — animated fade out */}
        <AnimatePresence>
          {showSafetyBanner && (
            <motion.div
              key="safety-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute bottom-full left-0 right-0 px-4 pb-2 z-10"
            >
              <SafetyNotice />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Input Bar */}
        <div
          className="bg-background border-t border-border/40"
          style={{ paddingBottom: isKeyboardVisible ? 0 : 32, transition: 'padding-bottom 0.1s ease' }}
        >
          <div className="flex items-end gap-2 px-3 py-[13px]">
            {/* + button */}
            <button
              tabIndex={-1}
              className="shrink-0 rounded-full flex items-center justify-center cursor-pointer"
              style={{ width: 48, height: 48, backgroundColor: '#f9f9fb', border: '1px solid #dfe0e3' }}
            >
              <AddIcon />
            </button>

            {/* Input pill */}
            <div
              className="flex-1 flex items-end rounded-[24px] min-w-0"
              style={{ minHeight: 48, backgroundColor: '#f9f9fb', border: '1px solid #dfe0e3' }}
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={localStatus === 'connect_sent' ? 'Connect request sent...' : localStatus === 'inbox_pending' ? 'Reply to accept...' : 'Type a message'}
                disabled={localStatus === 'connect_sent'}
                rows={1}
                enterKeyHint="send"
                autoComplete="off"
                className="flex-1 bg-transparent outline-none min-w-0 scrollbar-hide disabled:opacity-50"
                style={{
                  fontSize: 16,
                  lineHeight: '24px',
                  color: 'var(--color-foreground)',
                  paddingLeft: 20,
                  paddingRight: 8,
                  paddingTop: 12,
                  paddingBottom: 12,
                  resize: 'none',
                  overflow: 'hidden',
                }}
              />
              {/* Send button */}
              <button
                onClick={handleSend}
                tabIndex={-1}
                className="shrink-0 cursor-pointer mr-[6px] mb-[6px]"
                style={{ width: 36, height: 36 }}
              >
                <SendButtonIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
