import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Profile } from '../matches/ProfileCard';

export type PromisingMatchesVariant = 'option1' | 'option2' | 'option3';
export type Option3SubVariant = '3a' | '3b' | '3c' | '3d' | '3e' | '3f' | '3g' | '3h' | '3i' | '3j' | '3k' | '3l' | '3m';

export interface PromisingMatchItem {
  profile: Profile;
  message: string;
  timestamp: string;
}

interface PromisingMatchesControllerModalProps {
  isOpen: boolean;
  selectedVariant: PromisingMatchesVariant;
  selectedOption3Sub: Option3SubVariant;
  onSelectVariant: (variant: PromisingMatchesVariant) => void;
  onSelectOption3Sub: (sub: Option3SubVariant) => void;
  onClose: () => void;
}

interface PromisingMatchesPanelProps {
  variant: PromisingMatchesVariant;
  option3Sub: Option3SubVariant;
  requests: PromisingMatchItem[];
  isCurrentUserPremium: boolean;
  option3ActiveIndex: number;
  option3Expanded: boolean;
  onToggleOption3Expanded: () => void;
  onOpenInbox: () => void;
}

const variantMeta: Record<PromisingMatchesVariant, { title: string; subtitle: string }> = {
  option1: { title: 'Option 1', subtitle: 'Floating avatar strip' },
  option2: { title: 'Option 2', subtitle: 'Sticky inbox-style stack' },
  option3: { title: 'Option 3', subtitle: 'Creative explorations (A–M)' },
};

const option3SubMeta: Record<Option3SubVariant, { label: string; desc: string }> = {
  '3a': { label: '3A', desc: 'Dark Capsule' },
  '3b': { label: '3B', desc: 'Conversation Peek' },
  '3c': { label: '3C', desc: 'Depth Stack' },
  '3d': { label: '3D', desc: 'Ambient Presence' },
  '3e': { label: '3E', desc: 'Split Capsule' },
  '3f': { label: '3F', desc: 'Thread Preview' },
  '3g': { label: '3G', desc: 'Notification Dock' },
  '3h': { label: '3H', desc: 'Figma Dark Pill' },
  '3i': { label: '3I', desc: 'Figma Light Pill' },
  '3j': { label: '3J', desc: 'Dark Full-Width' },
  '3k': { label: '3K', desc: 'Light Elevated Card' },
  '3l': { label: '3L', desc: 'Glass Morphism' },
  '3m': { label: '3M', desc: 'Gradient Border Pill' },
};

const getAvatarUrl = (profile: Profile) => profile.photos?.avatar || profile.avatarUrl;
const getFirstName = (profile: Profile) => profile.name.split(' ')[0] || profile.name;

const maskedSnippet = (message: string) => {
  const normalized = (message || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Message hidden';
  const preview = normalized.slice(0, 18);
  const hidden = preview.replace(/[A-Za-z]/g, '•');
  return `${hidden}${normalized.length > 18 ? '...' : ''}`;
};

const AvatarCircle = ({
  profile,
  size = 36,
  borderColor = 'var(--color-background)',
  borderWidth = 2,
  className = '',
  style,
}: {
  profile: Profile;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const avatarUrl = getAvatarUrl(profile);
  const firstName = getFirstName(profile);
  return (
    <div
      className={`rounded-full overflow-hidden bg-muted shrink-0 ${className}`}
      style={{ width: size, height: size, border: `${borderWidth}px solid ${borderColor}`, ...style }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary" style={{ fontSize: size * 0.35 }}>
          {firstName.charAt(0)}
        </div>
      )}
    </div>
  );
};

const ExpandedRow = ({
  item,
  isCurrentUserPremium,
  onOpenInbox,
}: {
  item: PromisingMatchItem;
  isCurrentUserPremium: boolean;
  onOpenInbox: () => void;
}) => {
  const avatarUrl = getAvatarUrl(item.profile);
  const firstName = getFirstName(item.profile);
  const visibleSnippet = isCurrentUserPremium ? item.message : '🔒 Message hidden. Upgrade to view.';
  const timeColor = isCurrentUserPremium ? '#00b860' : 'var(--color-muted-foreground)';

  return (
    <button
      type="button"
      onClick={onOpenInbox}
      className="w-full flex items-center gap-3 py-3 text-left border-b last:border-b-0"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="w-11 h-11 rounded-full overflow-hidden bg-muted shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-base">
            {firstName.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-[16px] leading-5 truncate text-foreground">{item.profile.name}</span>
          <span className="text-[12px] leading-4 shrink-0" style={{ color: timeColor }}>{item.timestamp}</span>
        </div>
        <p className="text-[14px] leading-5 text-muted-foreground truncate mt-0.5">{visibleSnippet}</p>
      </div>
    </button>
  );
};

const ExpandedAccordion = ({
  isExpanded,
  requests,
  isCurrentUserPremium,
  onOpenInbox,
  bgClassName = 'bg-background',
}: {
  isExpanded: boolean;
  requests: PromisingMatchItem[];
  isCurrentUserPremium: boolean;
  onOpenInbox: () => void;
  bgClassName?: string;
}) => (
  <AnimatePresence initial={false}>
    {isExpanded && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.26, ease: [0.22, 0.68, 0, 1] }}
        className={`overflow-hidden border-t border-border/50 ${bgClassName}`}
      >
        <div className="px-3 pt-1 pb-1">
          {requests.map((item) => (
            <ExpandedRow key={item.profile.id} item={item} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ChevronUpIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FloatingShell = ({ bottom = 86, children }: { bottom?: number; children: React.ReactNode }) => (
  <div className="absolute left-3 right-3 z-40 pointer-events-none" style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bottom}px)` }}>
    <div className="pointer-events-auto">{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════
// 3A — DARK CAPSULE
// Full-width dark pill. Stacked avatars left, rotating grey message bubble center, circle chevron right.
// Feels like a persistent notification dock with high visual weight.
// ═══════════════════════════════════════════════════════
const Option3A = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const active = requests[activeIndex % requests.length];
  return (
    <FloatingShell>
      <div className="rounded-[22px] overflow-hidden shadow-xl">
        <button type="button" onClick={onToggle} className="w-full bg-[#1a1a1f] px-3 py-2.5 flex items-center gap-3">
          <div className="relative shrink-0" style={{ width: 56, height: 40 }}>
            {requests.slice(0, 3).map((item, i) => (
              <AvatarCircle
                key={item.profile.id}
                profile={item.profile}
                size={32}
                borderColor="#1a1a1f"
                className="absolute"
                borderWidth={2}
              />
            )).map((el, i) =>
              React.cloneElement(el, {
                className: `${el.props.className} absolute`,
                style: { ...el.props.style, left: i * 14, top: i === 1 ? 6 : 0, zIndex: 3 - i },
              })
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="flex-1 bg-[#2a2a30] rounded-full px-3.5 py-2 min-w-0"
            >
              <p className="text-[14px] leading-5 text-[#8e8e93] truncate">
                🔒 {maskedSnippet(active.message)}
              </p>
            </motion.div>
          </AnimatePresence>

          <div
            className="w-8 h-8 rounded-full border border-[#3a3a40] flex items-center justify-center shrink-0 transition-transform"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronUpIcon size={16} className="text-[#8e8e93]" />
          </div>
        </button>

        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} bgClassName="bg-[#1a1a1f]" />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3B — CONVERSATION PEEK
// Mimics a real chat row "peeking" from below. Shows one profile at a time,
// rotating through them. Feels like a new message just arrived.
// ═══════════════════════════════════════════════════════
const Option3B = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const active = requests[activeIndex % requests.length];
  const activeName = getFirstName(active.profile);
  const activeAvatar = getAvatarUrl(active.profile);

  return (
    <FloatingShell>
      <div className="rounded-2xl border bg-background/97 backdrop-blur-lg shadow-xl overflow-hidden">
        <button type="button" onClick={onToggle} className="w-full px-3 py-2.5 flex items-center gap-3">
          <div className="relative shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.profile.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.22 }}
                className="w-11 h-11 rounded-full overflow-hidden bg-muted"
              >
                {activeAvatar ? (
                  <img src={activeAvatar} alt={activeName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-base">{activeName.charAt(0)}</div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0ED279] border-2 border-background" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id + '_text'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex-1 min-w-0"
            >
              <p className="text-[15px] font-medium text-foreground truncate">{active.profile.name}</p>
              <p className="text-[13px] text-muted-foreground truncate">🔒 {maskedSnippet(active.message)}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 shrink-0">
            {requests.length > 1 && (
              <span className="text-[11px] font-semibold text-white bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                {requests.length}
              </span>
            )}
            <div
              className="transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <ChevronUpIcon size={18} className="text-muted-foreground" />
            </div>
          </div>
        </button>

        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3C — DEPTH STACK
// Stacked card layers with parallax offset creating visual depth.
// Top card is the active one, background cards peek from behind.
// ═══════════════════════════════════════════════════════
const Option3C = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const active = requests[activeIndex % requests.length];
  const activeName = getFirstName(active.profile);
  const activeAvatar = getAvatarUrl(active.profile);

  return (
    <FloatingShell>
      <div className="relative">
        {requests.length > 2 && (
          <div className="absolute left-2 right-2 -top-2 h-[52px] rounded-2xl bg-muted/40 border border-border/30" />
        )}
        {requests.length > 1 && (
          <div className="absolute left-1 right-1 -top-1 h-[52px] rounded-2xl bg-muted/60 border border-border/40" />
        )}

        <div className="relative rounded-2xl border bg-background/97 backdrop-blur-lg shadow-xl overflow-hidden">
          <button type="button" onClick={onToggle} className="w-full px-3 py-3 flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.profile.id}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0"
              >
                {activeAvatar ? (
                  <img src={activeAvatar} alt={activeName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">{activeName.charAt(0)}</div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-primary">{requests.length} interested in you</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.profile.id + '_msg'}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-[14px] text-muted-foreground truncate"
                >
                  <span className="font-medium text-foreground">{activeName}</span>{' '}
                  <span className="text-muted-foreground/60">🔒 {maskedSnippet(active.message)}</span>
                </motion.p>
              </AnimatePresence>
            </div>

            <div
              className="transition-transform duration-200 shrink-0"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <ChevronUpIcon size={18} className="text-muted-foreground" />
            </div>
          </button>

          <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
        </div>
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3D — AMBIENT PRESENCE
// Full-width translucent bar with a glowing active avatar ring.
// Message text fades in/out with a typewriter-like masked effect.
// Subtle pulsing glow on the active avatar communicates activity.
// ═══════════════════════════════════════════════════════
const Option3D = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const active = requests[activeIndex % requests.length];
  const activeName = getFirstName(active.profile);
  const activeAvatar = getAvatarUrl(active.profile);

  return (
    <FloatingShell bottom={83}>
      <div className="overflow-hidden" style={{ borderRadius: 0 }}>
        <button
          type="button"
          onClick={onToggle}
          className="w-full px-4 py-3 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(10,164,184,0.08) 0%, rgba(14,210,121,0.06) 100%)', borderTop: '1px solid var(--color-border)' }}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-[-3px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(10,164,184,0.3) 0%, transparent 70%)' }} />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.profile.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-10 h-10 rounded-full overflow-hidden bg-muted ring-2 ring-primary/40"
              >
                {activeAvatar ? (
                  <img src={activeAvatar} alt={activeName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">{activeName.charAt(0)}</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-primary/80 mb-0.5">{requests.length} promising matches</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={active.profile.id + '_fade'}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.35 }}
                className="text-[14px] text-muted-foreground truncate"
              >
                {activeName}: <span className="opacity-50">🔒 {maskedSnippet(active.message)}</span>
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex -space-x-1.5">
              {requests.slice(0, 3).filter((_, i) => i !== activeIndex % requests.length).slice(0, 2).map((item) => (
                <AvatarCircle key={item.profile.id} profile={item.profile} size={22} borderColor="var(--color-background)" borderWidth={1} />
              ))}
            </div>
            <div className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <ChevronUpIcon size={16} className="text-muted-foreground" />
            </div>
          </div>
        </button>

        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3E — SPLIT CAPSULE
// Two-zone horizontal layout inside a dark capsule.
// Left zone: avatar cluster + count. Right zone: rotating message.
// Clear spatial separation between "who" and "what they said".
// ═══════════════════════════════════════════════════════
const Option3E = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const active = requests[activeIndex % requests.length];
  const activeName = getFirstName(active.profile);

  return (
    <FloatingShell>
      <div className="rounded-[20px] overflow-hidden shadow-xl">
        <button type="button" onClick={onToggle} className="w-full flex items-stretch" style={{ height: 56 }}>
          <div className="bg-[#1a1a1f] flex items-center gap-2 px-3 shrink-0">
            <div className="flex -space-x-2">
              {requests.slice(0, 3).map((item) => (
                <AvatarCircle key={item.profile.id} profile={item.profile} size={28} borderColor="#1a1a1f" borderWidth={2} />
              ))}
            </div>
            <span className="text-[12px] font-bold text-white/70">{requests.length}</span>
          </div>

          <div className="flex-1 bg-[#252529] flex items-center px-3 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.profile.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[11px] text-[#8e8e93] leading-tight">{activeName}</p>
                <p className="text-[13px] text-[#636366] truncate leading-tight">🔒 {maskedSnippet(active.message)}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-[#252529] flex items-center pr-3">
            <div
              className="w-7 h-7 rounded-full border border-[#3a3a40] flex items-center justify-center transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <ChevronUpIcon size={14} className="text-[#8e8e93]" />
            </div>
          </div>
        </button>

        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} bgClassName="bg-[#1a1a1f]" />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3F — THREAD PREVIEW
// Shows a vertical mini-thread of 2-3 stacked message lines from different senders.
// Creates the feeling of an ongoing multi-person conversation you're missing.
// ═══════════════════════════════════════════════════════
const Option3F = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const visibleSlice = requests.slice(0, 3);

  return (
    <FloatingShell>
      <div className="rounded-2xl border bg-background/97 backdrop-blur-lg shadow-xl overflow-hidden">
        <button type="button" onClick={onToggle} className="w-full px-3 pt-2.5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-foreground">{requests.length} interested in you</p>
            <div className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <ChevronUpIcon size={16} className="text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            {visibleSlice.map((item, i) => {
              const firstName = getFirstName(item.profile);
              const avatarUrl = getAvatarUrl(item.profile);
              const isActive = i === activeIndex % visibleSlice.length;
              return (
                <motion.div
                  key={item.profile.id}
                  animate={{ opacity: isActive ? 1 : 0.45, scale: isActive ? 1 : 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-muted shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] bg-primary/10 text-primary">{firstName.charAt(0)}</div>
                    )}
                  </div>
                  <p className="text-[13px] text-muted-foreground truncate flex-1">
                    <span className="font-medium text-foreground">{firstName}</span>{' '}
                    <span className="opacity-50">🔒 {maskedSnippet(item.message)}</span>
                  </p>
                </motion.div>
              );
            })}
          </div>
        </button>

        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3G — NOTIFICATION DOCK
// Compact chip that looks like a persistent system notification.
// Small avatar, sender name, truncated locked message, and a count badge.
// Minimal visual footprint, maximum information density.
// ═══════════════════════════════════════════════════════
const Option3G = ({
  requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; activeIndex: number; isExpanded: boolean;
  isCurrentUserPremium: boolean; onToggle: () => void; onOpenInbox: () => void;
}) => {
  const active = requests[activeIndex % requests.length];
  const activeName = getFirstName(active.profile);
  const activeAvatar = getAvatarUrl(active.profile);

  return (
    <FloatingShell>
      <div className="rounded-full overflow-hidden shadow-xl border border-border/60" style={{ borderRadius: isExpanded ? 16 : 999 }}>
        <button type="button" onClick={onToggle} className="w-full bg-background/97 backdrop-blur-lg px-2 py-1.5 flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0"
            >
              {activeAvatar ? (
                <img src={activeAvatar} alt={activeName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs">{activeName.charAt(0)}</div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id + '_text'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0"
            >
              <p className="text-[13px] truncate">
                <span className="font-medium text-foreground">{activeName}</span>
                <span className="text-muted-foreground"> · 🔒 {maskedSnippet(active.message).slice(0, 12)}...</span>
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-1 shrink-0">
            {requests.length > 1 && (
              <span className="text-[10px] font-bold text-white bg-[#0ED279] rounded-full w-5 h-5 flex items-center justify-center">
                {requests.length}
              </span>
            )}
            <div className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <ChevronUpIcon size={14} className="text-muted-foreground" />
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="bg-background/97 backdrop-blur-lg px-3 pb-2 border-t border-border/50">
            <div className="pt-1">
              {requests.map((item) => (
                <ExpandedRow key={item.profile.id} item={item} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
              ))}
            </div>
          </div>
        )}
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// SHARED: Figma-style avatar cluster — 3 overlapping circles, front one larger
// ═══════════════════════════════════════════════════════
const FigmaAvatarCluster = ({ requests, borderColor = '#1a1a1f' }: { requests: PromisingMatchItem[]; borderColor?: string }) => (
  <div className="relative shrink-0" style={{ width: 52, height: 40 }}>
    {requests.slice(0, 3).reverse().map((item, reverseI) => {
      const i = 2 - reverseI;
      const isFront = i === 0;
      const size = isFront ? 36 : 30;
      const left = i === 0 ? 0 : i === 1 ? 18 : 30;
      const top = isFront ? 2 : i === 1 ? 0 : 6;
      return (
        <AvatarCircle
          key={item.profile.id}
          profile={item.profile}
          size={size}
          borderColor={borderColor}
          borderWidth={2}
          className="absolute"
          style={{ left, top, zIndex: 3 - i }}
        />
      );
    })}
  </div>
);

const FigmaChevronCircle = ({
  isExpanded,
  dark = false,
  size = 32,
}: {
  isExpanded: boolean;
  dark?: boolean;
  size?: number;
}) => (
  <div
    className="rounded-full flex items-center justify-center shrink-0 transition-transform duration-250"
    style={{
      width: size,
      height: size,
      border: `1.5px solid ${dark ? '#3a3a42' : 'var(--color-border)'}`,
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <ChevronUpIcon size={size * 0.5} className={dark ? 'text-[#8e8e93]' : 'text-muted-foreground'} />
  </div>
);

type FigmaSharedProps = {
  requests: PromisingMatchItem[];
  activeIndex: number;
  isExpanded: boolean;
  isCurrentUserPremium: boolean;
  onToggle: () => void;
  onOpenInbox: () => void;
};

const figmaBubbleContent = (active: PromisingMatchItem, isPremium: boolean) =>
  isPremium ? active.message : `🔒 ${maskedSnippet(active.message)}`;

// ═══════════════════════════════════════════════════════
// 3H — FIGMA DARK PILL
// Direct interpretation of the dark Figma design.
// Dark rounded-full pill, stacked avatars left, dark grey bubble center,
// bordered chevron circle right. Message slides up/down on rotation.
// ═══════════════════════════════════════════════════════
const Option3H = ({ requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox }: FigmaSharedProps) => {
  const active = requests[activeIndex % requests.length];
  return (
    <FloatingShell>
      <div className="overflow-hidden shadow-2xl" style={{ borderRadius: isExpanded ? 20 : 999 }}>
        <button type="button" onClick={onToggle} className="w-full bg-[#1c1c1e] px-2.5 py-2 flex items-center gap-2.5">
          <FigmaAvatarCluster requests={requests} borderColor="#1c1c1e" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex-1 bg-[#2c2c2e] rounded-full px-3.5 py-2 min-w-0"
            >
              <p className="text-[14px] leading-5 text-[#ebebf0] truncate">
                {figmaBubbleContent(active, isCurrentUserPremium)}
              </p>
            </motion.div>
          </AnimatePresence>
          <FigmaChevronCircle isExpanded={isExpanded} dark />
        </button>
        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} bgClassName="bg-[#1c1c1e]" />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3I — FIGMA LIGHT PILL
// Light version of the Figma design.
// White/light pill, stacked avatars left, light grey bubble center,
// bordered chevron circle right. Message fades + slides on rotation.
// ═══════════════════════════════════════════════════════
const Option3I = ({ requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox }: FigmaSharedProps) => {
  const active = requests[activeIndex % requests.length];
  return (
    <FloatingShell>
      <div className="overflow-hidden shadow-xl border border-border/50" style={{ borderRadius: isExpanded ? 20 : 999 }}>
        <button type="button" onClick={onToggle} className="w-full bg-background px-2.5 py-2 flex items-center gap-2.5">
          <FigmaAvatarCluster requests={requests} borderColor="var(--color-background)" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex-1 bg-muted/60 rounded-full px-3.5 py-2 min-w-0"
            >
              <p className="text-[14px] leading-5 text-foreground/80 truncate">
                {figmaBubbleContent(active, isCurrentUserPremium)}
              </p>
            </motion.div>
          </AnimatePresence>
          <FigmaChevronCircle isExpanded={isExpanded} />
        </button>
        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3J — DARK FULL-WIDTH
// Same Figma avatar+bubble+chevron pattern but in a full-width dark bar
// (no pill shape — edge-to-edge). Feels like a system-level notification.
// Message slides from the right on rotation.
// ═══════════════════════════════════════════════════════
const Option3J = ({ requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox }: FigmaSharedProps) => {
  const active = requests[activeIndex % requests.length];
  return (
    <div className="absolute left-0 right-0 z-40 pointer-events-none" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 83px)' }}>
      <div className="pointer-events-auto overflow-hidden">
        <button type="button" onClick={onToggle} className="w-full bg-[#1c1c1e] px-4 py-2.5 flex items-center gap-3 border-t border-[#2c2c2e]">
          <FigmaAvatarCluster requests={requests} borderColor="#1c1c1e" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex-1 bg-[#2c2c2e] rounded-full px-3.5 py-2 min-w-0"
            >
              <p className="text-[14px] leading-5 text-[#ebebf0] truncate">
                {figmaBubbleContent(active, isCurrentUserPremium)}
              </p>
            </motion.div>
          </AnimatePresence>
          <FigmaChevronCircle isExpanded={isExpanded} dark />
        </button>
        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} bgClassName="bg-[#1c1c1e]" />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 3K — LIGHT ELEVATED CARD
// Figma pattern inside a rounded-2xl card with elevation shadow.
// Not a pill — a soft card container. Message scales in on rotation.
// ═══════════════════════════════════════════════════════
const Option3K = ({ requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox }: FigmaSharedProps) => {
  const active = requests[activeIndex % requests.length];
  return (
    <FloatingShell>
      <div className="rounded-2xl overflow-hidden bg-background shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] border border-border/40">
        <button type="button" onClick={onToggle} className="w-full px-3 py-2.5 flex items-center gap-2.5">
          <FigmaAvatarCluster requests={requests} borderColor="var(--color-background)" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.28, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex-1 bg-muted/50 rounded-2xl px-3.5 py-2 min-w-0"
            >
              <p className="text-[14px] leading-5 text-foreground/80 truncate">
                {figmaBubbleContent(active, isCurrentUserPremium)}
              </p>
            </motion.div>
          </AnimatePresence>
          <FigmaChevronCircle isExpanded={isExpanded} />
        </button>
        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3L — GLASS MORPHISM
// Frosted glass pill with backdrop-blur. Avatars left, semi-transparent
// bubble center, chevron right. Message rotates with a blur-to-sharp transition.
// ═══════════════════════════════════════════════════════
const Option3L = ({ requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox }: FigmaSharedProps) => {
  const active = requests[activeIndex % requests.length];
  return (
    <FloatingShell>
      <div
        className="overflow-hidden backdrop-blur-xl shadow-xl border border-white/15"
        style={{
          borderRadius: isExpanded ? 20 : 999,
          background: 'rgba(28,28,30,0.72)',
        }}
      >
        <button type="button" onClick={onToggle} className="w-full px-2.5 py-2 flex items-center gap-2.5">
          <FigmaAvatarCluster requests={requests} borderColor="rgba(28,28,30,0.72)" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.profile.id}
              initial={{ opacity: 0, filter: 'blur(6px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(6px)', y: -10 }}
              transition={{ duration: 0.36, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex-1 rounded-full px-3.5 py-2 min-w-0"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <p className="text-[14px] leading-5 text-white/85 truncate">
                {figmaBubbleContent(active, isCurrentUserPremium)}
              </p>
            </motion.div>
          </AnimatePresence>
          <FigmaChevronCircle isExpanded={isExpanded} dark size={30} />
        </button>
        <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} bgClassName="bg-transparent" />
      </div>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// 3M — GRADIENT BORDER PILL
// Dark pill with a subtle animated gradient border (primary→accent).
// Same interior layout as Figma. Message bubble uses a slight gradient tint.
// The gradient border draws attention without heavy visual weight.
// ═══════════════════════════════════════════════════════
const Option3M = ({ requests, activeIndex, isExpanded, isCurrentUserPremium, onToggle, onOpenInbox }: FigmaSharedProps) => {
  const active = requests[activeIndex % requests.length];
  return (
    <FloatingShell>
      <div
        className="p-[1.5px] overflow-hidden shadow-xl"
        style={{
          borderRadius: isExpanded ? 21 : 999,
          background: 'linear-gradient(135deg, #0AA4B8 0%, #0ED279 50%, #0AA4B8 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease infinite',
        }}
      >
        <div className="overflow-hidden bg-[#1c1c1e]" style={{ borderRadius: isExpanded ? 19.5 : 997 }}>
          <button type="button" onClick={onToggle} className="w-full px-2.5 py-2 flex items-center gap-2.5">
            <FigmaAvatarCluster requests={requests} borderColor="#1c1c1e" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.profile.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: [0.25, 0.8, 0.25, 1] }}
                className="flex-1 rounded-full px-3.5 py-2 min-w-0"
                style={{ background: 'linear-gradient(135deg, rgba(10,164,184,0.1) 0%, rgba(14,210,121,0.06) 100%)' }}
              >
                <p className="text-[14px] leading-5 text-[#ebebf0] truncate">
                  {figmaBubbleContent(active, isCurrentUserPremium)}
                </p>
              </motion.div>
            </AnimatePresence>
            <FigmaChevronCircle isExpanded={isExpanded} dark />
          </button>
          <ExpandedAccordion isExpanded={isExpanded} requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} bgClassName="bg-[#1c1c1e]" />
        </div>
      </div>
      <style>{`@keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
    </FloatingShell>
  );
};

// ═══════════════════════════════════════════════════════
// Option 1 — FLOATING AVATAR STRIP (unchanged)
// ═══════════════════════════════════════════════════════
const Option1FloatingStrip = ({ requests, onOpenInbox }: { requests: PromisingMatchItem[]; onOpenInbox: () => void }) => (
  <FloatingShell>
    <div className="rounded-2xl border bg-background/95 backdrop-blur-md shadow-lg px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Promising Matches</h3>
        <span className="text-[11px] text-muted-foreground">New requests</span>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide no-scrollbar">
        {requests.map((request) => {
          const avatarUrl = getAvatarUrl(request.profile);
          const firstName = getFirstName(request.profile);
          return (
            <button key={request.profile.id} type="button" onClick={onOpenInbox} className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-base">{firstName.charAt(0)}</div>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground max-w-[56px] truncate">{firstName}</span>
            </button>
          );
        })}
      </div>
    </div>
  </FloatingShell>
);

// ═══════════════════════════════════════════════════════
// Option 2 — STICKY INBOX-STYLE STACK (unchanged)
// ═══════════════════════════════════════════════════════
const Option2StickySection = ({
  requests, isCurrentUserPremium, onOpenInbox,
}: {
  requests: PromisingMatchItem[]; isCurrentUserPremium: boolean; onOpenInbox: () => void;
}) => (
  <div className="absolute left-0 right-0 z-40 pointer-events-none" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 83px)' }}>
    <div className="pointer-events-auto bg-background border-t border-border/80 px-4 pt-3 pb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {requests.slice(0, 3).map((item) => (
              <AvatarCircle key={item.profile.id} profile={item.profile} size={24} borderColor="var(--color-background)" borderWidth={1} />
            ))}
          </div>
          <p className="text-[13px] text-muted-foreground">{requests.length} new interested</p>
        </div>
        <button type="button" onClick={onOpenInbox} className="text-[13px] font-medium text-primary">View</button>
      </div>
      <div className="max-h-[146px] overflow-y-auto scrollbar-hide">
        {requests.slice(0, 3).map((item) => (
          <ExpandedRow key={item.profile.id} item={item} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// CONTROLLER MODAL
// ═══════════════════════════════════════════════════════
export const PromisingMatchesControllerModal = ({
  isOpen, selectedVariant, selectedOption3Sub, onSelectVariant, onSelectOption3Sub, onClose,
}: PromisingMatchesControllerModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div className="absolute inset-0 z-[62] bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.div
          className="absolute left-3 right-3 z-[63] rounded-2xl border bg-background shadow-xl p-3 max-h-[75vh] overflow-y-auto scrollbar-hide"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 72px)' }}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Promising Matches Variants</h3>
            <p className="text-[12px] text-muted-foreground">Switch between layout options.</p>
          </div>

          <div className="space-y-2 mb-3">
            {(Object.keys(variantMeta) as PromisingMatchesVariant[]).map((variant) => {
              const selected = selectedVariant === variant;
              return (
                <button
                  key={variant}
                  type="button"
                  onClick={() => { onSelectVariant(variant); if (variant !== 'option3') onClose(); }}
                  className="w-full text-left rounded-xl border px-3 py-2 flex items-center justify-between"
                  style={{ borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)' }}
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{variantMeta[variant].title}</p>
                    <p className="text-[12px] text-muted-foreground">{variantMeta[variant].subtitle}</p>
                  </div>
                  {selected && <span className="text-[12px] font-semibold text-primary">Selected</span>}
                </button>
              );
            })}
          </div>

          {selectedVariant === 'option3' && (
            <div className="border-t border-border/60 pt-3">
              <p className="text-[12px] font-semibold text-foreground mb-2">Option 3 Sub-variants</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(option3SubMeta) as Option3SubVariant[]).map((sub) => {
                  const meta = option3SubMeta[sub];
                  const selected = selectedOption3Sub === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => { onSelectOption3Sub(sub); onClose(); }}
                      className="text-left rounded-lg border px-2.5 py-2"
                      style={{ borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)' }}
                    >
                      <p className="text-[12px] font-semibold text-foreground">{meta.label}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">{meta.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ═══════════════════════════════════════════════════════
// MAIN PANEL (dispatches to correct variant)
// ═══════════════════════════════════════════════════════
export const PromisingMatchesPanel = ({
  variant, option3Sub, requests, isCurrentUserPremium, option3ActiveIndex, option3Expanded, onToggleOption3Expanded, onOpenInbox,
}: PromisingMatchesPanelProps) => {
  if (requests.length === 0) return null;

  if (variant === 'option1') return <Option1FloatingStrip requests={requests} onOpenInbox={onOpenInbox} />;
  if (variant === 'option2') return <Option2StickySection requests={requests} isCurrentUserPremium={isCurrentUserPremium} onOpenInbox={onOpenInbox} />;

  const sharedProps = {
    requests,
    activeIndex: option3ActiveIndex,
    isExpanded: option3Expanded,
    isCurrentUserPremium,
    onToggle: onToggleOption3Expanded,
    onOpenInbox,
  };

  switch (option3Sub) {
    case '3a': return <Option3A {...sharedProps} />;
    case '3b': return <Option3B {...sharedProps} />;
    case '3c': return <Option3C {...sharedProps} />;
    case '3d': return <Option3D {...sharedProps} />;
    case '3e': return <Option3E {...sharedProps} />;
    case '3f': return <Option3F {...sharedProps} />;
    case '3g': return <Option3G {...sharedProps} />;
    case '3h': return <Option3H {...sharedProps} />;
    case '3i': return <Option3I {...sharedProps} />;
    case '3j': return <Option3J {...sharedProps} />;
    case '3k': return <Option3K {...sharedProps} />;
    case '3l': return <Option3L {...sharedProps} />;
    case '3m': return <Option3M {...sharedProps} />;
    default: return <Option3A {...sharedProps} />;
  }
};
