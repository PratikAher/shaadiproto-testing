import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { FullProfileView } from '../matches/FullProfileView';
import { Button } from '../Button';
import { TickFilledIcon, CrownFilledIcon, ChatIcon } from '../icons';
import type { Profile } from '../matches/ProfileCard';
import svgPaths from '../../../imports/svg-5y984fxn6c';

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

interface SiaResurfacingScreenProps {
  onBack: () => void;
  onComplete: () => void;
  profiles: Profile[];
  isCurrentUserPremium?: boolean;
  initialVisibleCount?: number; // v2: show 5 first + "View More"
  useGreenGradient?: boolean;
}

type UserAction = null | 'connect' | 'skip' | 'all_individual';

// Chat steps
const STEP_TYPING_GREETING = 0;
const STEP_GREETING = 1;
const STEP_TYPING_VALUE = 2;
const STEP_VALUE = 3;
const STEP_TYPING_CTA = 4;
const STEP_CTA = 5;

// Post-action steps
const POST_USER_BUBBLE = 0;
const POST_TYPING_1 = 1;
const POST_REPLY_1 = 2;
const POST_TYPING_2 = 2.5;
const POST_REPLY_2 = 3;

// ═══════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

// ═══════════════════════════════════════════════════════
// Typing Indicator
// ═══════════════════════════════════════════════════════

const TypingIndicator = () => (
  <motion.div
    className="flex gap-2 items-end"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    <div className="bg-card relative px-4 py-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]">
      <div className="flex gap-1 items-center h-5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-[6px] h-[6px] rounded-full bg-neutral-400"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 0.9,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// SIA Header Icon
// ═══════════════════════════════════════════════════════

const SiaHeaderIcon = ({ size = 34 }: { size?: number }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <svg className="absolute inset-0 block" width={size} height={size} fill="none" viewBox="0 0 36.363 36.363">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="siaResurfGrad" x1="36.356" x2="28.966" y1="8.018" y2="37.087">
          <stop stopColor="#FF4596" />
          <stop offset="0.5" stopColor="#9472FA" />
          <stop stopColor="#0DD2F5" offset="1" />
        </linearGradient>
      </defs>
      <path d={svgPaths.p1f875600} fill="currentColor" className="text-foreground" />
      <path d={svgPaths.p1f875600} fill="url(#siaResurfGrad)" />
    </svg>
    <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: size * 0.38, height: size * 0.38 }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
        <path d={svgPaths.p3b0a2300} fill="white" />
      </svg>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// Chat Bubbles
// ═══════════════════════════════════════════════════════

const ChatBubble = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="flex gap-2 items-end"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
  >
    <div className="bg-card relative p-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  </motion.div>
);

const UserBubble = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="flex justify-end w-full"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
  >
    <div className="bg-neutral-50 relative p-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl max-w-[75%] border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// Profile Mini Card
// ═══════════════════════════════════════════════════════

interface ProfileMiniCardProps {
  profile: Profile;
  onTap: () => void;
  onConnected?: () => void;
  connectAll?: boolean;
  connectAllDelay?: number;
  isConnected?: boolean;
}

type CardButtonState = 'connect' | 'sent' | 'chat';

const ProfileMiniCard = ({ profile, onTap, onConnected, connectAll, connectAllDelay = 0, isConnected = false }: ProfileMiniCardProps) => {
  const [btnState, setBtnState] = useState<CardButtonState>(isConnected ? 'chat' : 'connect');
  const fullImage = profile.photos?.full || profile.imageUrl || '';
  const firstName = profile.name.split(' ')[0];
  const lastInitial = profile.name.split(' ')[1]?.[0] || '';
  const displayName = `${firstName} ${lastInitial}`;
  const age = profile.age;
  const height = profile.heightCm ? cmToFeetInches(profile.heightCm) : profile.height || '';
  const motherTongue = profile.motherTongue || '';
  const community = [motherTongue || profile.religion, profile.community].filter(Boolean).join(', ');
  const city = profile.location?.city || profile.city || '';
  const state = profile.location?.state || profile.state || '';
  const location = [city, state].filter(Boolean).join(', ');

  const handleConnectClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnState !== 'connect') return;
    setBtnState('sent');
    setTimeout(() => onConnected?.(), 600);
  }, [btnState, onConnected]);

  useEffect(() => {
    if (isConnected && btnState === 'connect') {
      setBtnState('sent');
    }
  }, [isConnected]);

  // Auto-transition from 'sent' → 'chat' after 0.8s
  useEffect(() => {
    if (btnState === 'sent' && !connectAll) {
      const timer = setTimeout(() => setBtnState('chat'), 800);
      return () => clearTimeout(timer);
    }
  }, [btnState, connectAll]);

  useEffect(() => {
    if (connectAll && btnState === 'connect') {
      const timer = setTimeout(() => {
        setBtnState('sent');
      }, connectAllDelay);
      return () => clearTimeout(timer);
    }
  }, [connectAll, connectAllDelay, btnState]);

  return (
    <div
      className="bg-card rounded-2xl shrink-0 cursor-pointer overflow-hidden border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]"
      style={{ width: 200 }}
      onClick={onTap}
    >
      <div className="relative w-[200px] h-[200px] overflow-hidden">
        <img src={fullImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        {(profile.isPremium || profile.isVip) && (
          <div
            className="absolute top-2.5 rounded-full size-6 flex items-center justify-center"
            style={{
              right: '10px',
              backgroundColor: profile.isVip ? '#6f3ba9' : 'var(--color-accent-palette-500)',
            }}
          >
            <CrownFilledIcon className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 items-start pb-4 pt-3 px-4 w-full border-t border-border">
        <p className="font-sans text-foreground text-[16px] leading-[24px] font-bold">
          {displayName}
        </p>
        <div className="flex flex-col w-full font-sans text-muted-foreground text-[14px] leading-[20px]">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {age} yrs, {height}{motherTongue ? `, ${motherTongue}` : ''}
          </p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {community}
          </p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {location}
          </p>
        </div>

        <div className="pt-2 w-full">
          <AnimatePresence mode="wait">
            {btnState === 'connect' && (
              <motion.div
                key="connect-btn"
                initial={false}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="md"
                  shape="pill"
                  className="w-full gap-1 text-primary border-primary"
                  onClick={handleConnectClick}
                >
                  <TickFilledIcon className="w-4 h-4" />
                  <span>Connect Now</span>
                </Button>
              </motion.div>
            )}

            {btnState === 'sent' && (
              <motion.div
                key="sent-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              >
                <Button
                  variant="outline"
                  size="md"
                  shape="pill"
                  className="w-full gap-1 border-white text-emerald-600 pointer-events-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#10B981" />
                      <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                  <span>Connect Sent</span>
                </Button>
              </motion.div>
            )}

            {btnState === 'chat' && (
              <motion.div
                key="chat-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <Button
                  variant="outline"
                  size="md"
                  shape="pill"
                  className="w-full gap-1.5 text-primary border-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChatIcon className="w-4 h-4" />
                  <span>Shaadi Chat</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// Decorative Background
// ═══════════════════════════════════════════════════════

const DecorativeBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute" style={{ top: '5%', right: '-2%', width: '80px', height: '80px', opacity: 0.4 }} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="40" rx="30" ry="18" fill="#DAF8FF" transform="rotate(-25 40 40)" />
      <ellipse cx="50" cy="35" rx="22" ry="12" fill="#DAF8FF" transform="rotate(15 50 35)" />
    </svg>
    <svg className="absolute" style={{ top: '35%', left: '-3%', width: '60px', height: '70px', opacity: 0.35 }} viewBox="0 0 60 70" fill="none">
      <ellipse cx="30" cy="35" rx="25" ry="15" fill="#DAF8FF" transform="rotate(-40 30 35)" />
    </svg>
    <svg className="absolute" style={{ bottom: '10%', right: '-4%', width: '90px', height: '90px', opacity: 0.3 }} viewBox="0 0 90 90" fill="none">
      <ellipse cx="45" cy="45" rx="35" ry="20" fill="#DAF8FF" transform="rotate(20 45 45)" />
      <ellipse cx="55" cy="50" rx="28" ry="14" fill="#DAF8FF" transform="rotate(-30 55 50)" />
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════

export const SiaResurfacingScreen = ({
  onBack,
  onComplete,
  profiles,
  isCurrentUserPremium = false,
  initialVisibleCount,
  useGreenGradient = false,
}: SiaResurfacingScreenProps) => {
  const [chatStep, setChatStep] = useState(STEP_TYPING_GREETING);
  const [viewingProfileIndex, setViewingProfileIndex] = useState<number | null>(null);
  const [carouselExpanded, setCarouselExpanded] = useState(false);
  const [userAction, setUserAction] = useState<UserAction>(null);
  const [postActionStep, setPostActionStep] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  // Individual connect tracking
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  // Profile data
  const allCarouselProfiles = useMemo(() => profiles.filter(p => !p.isVip).slice(0, 10), [profiles]);

  // Progressive reveal (v2)
  const hasProgressiveReveal = initialVisibleCount !== undefined && initialVisibleCount < allCarouselProfiles.length;
  const carouselProfiles = useMemo(() => {
    if (hasProgressiveReveal && !carouselExpanded) {
      return allCarouselProfiles.slice(0, initialVisibleCount);
    }
    return allCarouselProfiles;
  }, [allCarouselProfiles, hasProgressiveReveal, carouselExpanded, initialVisibleCount]);

  const hiddenCount = hasProgressiveReveal && !carouselExpanded
    ? allCarouselProfiles.length - (initialVisibleCount ?? 0)
    : 0;

  const connectedCount = connectedIds.size;
  const totalCount = carouselProfiles.length;
  const remainingCount = totalCount - connectedCount;

  // ─── Chat message sequencing ───
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Step 0: typing for greeting (starts immediately)
    // 1.2s → show greeting, typing for value prop
    timers.push(setTimeout(() => setChatStep(STEP_GREETING), 1200));
    // +0.6s → typing for value
    timers.push(setTimeout(() => setChatStep(STEP_TYPING_VALUE), 1800));
    // +1.0s → show value + carousel
    timers.push(setTimeout(() => setChatStep(STEP_VALUE), 2800));
    // +0.6s → typing for CTA
    timers.push(setTimeout(() => setChatStep(STEP_TYPING_CTA), 3400));
    // +1.0s → show CTA
    timers.push(setTimeout(() => setChatStep(STEP_CTA), 4400));
    return () => timers.forEach(clearTimeout);
  }, []);

  // ─── Post-action sequencing ───
  useEffect(() => {
    if (userAction === null) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (userAction === 'skip') {
      // Dismiss immediately — back to browsing
      timers.push(setTimeout(() => onComplete(), 300));
    } else if (userAction === 'connect') {
      setPostActionStep(POST_USER_BUBBLE);
      timers.push(setTimeout(() => setPostActionStep(POST_TYPING_1), 800));
      timers.push(setTimeout(() => setPostActionStep(POST_REPLY_1), 2000));
      timers.push(setTimeout(() => setPostActionStep(POST_TYPING_2), 2500));
      timers.push(setTimeout(() => setPostActionStep(POST_REPLY_2), 3500));
      timers.push(setTimeout(() => onComplete(), 5000));
    } else if (userAction === 'all_individual') {
      setPostActionStep(POST_TYPING_1);
      timers.push(setTimeout(() => setPostActionStep(POST_REPLY_1), 1200));
      timers.push(setTimeout(() => setPostActionStep(POST_TYPING_2), 1700));
      timers.push(setTimeout(() => setPostActionStep(POST_REPLY_2), 2700));
      timers.push(setTimeout(() => onComplete(), 4200));
    }

    return () => timers.forEach(clearTimeout);
  }, [userAction, onComplete]);

  // ─── Detect all connected individually ───
  useEffect(() => {
    if (connectedCount === totalCount && totalCount > 0 && userAction === null && chatStep >= STEP_CTA) {
      const timer = setTimeout(() => {
        setUserAction('all_individual');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [connectedCount, totalCount, userAction, chatStep]);

  // ─── Auto-scroll on new content ───
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 150);
  }, [chatStep, postActionStep]);

  // Handlers
  const handleViewProfile = useCallback((index: number) => {
    setViewingProfileIndex(index);
  }, []);

  const handleBackFromProfile = useCallback(() => {
    setViewingProfileIndex(null);
  }, []);

  const handleNavigateProfile = useCallback((index: number) => {
    setViewingProfileIndex(index);
  }, []);

  const handleConnect = useCallback(() => {
    if (userAction !== null) return;
    setUserAction('connect');
  }, [userAction]);

  const handleSkip = useCallback(() => {
    if (userAction !== null) return;
    setUserAction('skip');
  }, [userAction]);

  const scrollCarouselToCard = useCallback((cardIndex: number) => {
    const container = carouselScrollRef.current;
    if (!container) return;
    const cardWidth = 200;
    const gap = 16;
    const paddingLeft = 16;
    const containerWidth = container.clientWidth;
    const cardLeft = paddingLeft + cardIndex * (cardWidth + gap);
    const cardCenter = cardLeft + cardWidth / 2;
    const scrollTo = cardCenter - containerWidth / 2;
    container.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
  }, []);

  const handleExpandCarousel = useCallback(() => {
    setCarouselExpanded(true);
    if (initialVisibleCount !== undefined) {
      setTimeout(() => {
        scrollCarouselToCard(initialVisibleCount);
      }, 100);
    }
  }, [initialVisibleCount, scrollCarouselToCard]);

  const handleCardConnected = useCallback((cardIndex: number) => {
    const profileId = carouselProfiles[cardIndex]?.id;
    if (profileId) {
      setConnectedIds(prev => {
        const next = new Set(prev);
        next.add(profileId);
        return next;
      });
    }
    const nextIndex = cardIndex + 1;
    if (nextIndex < carouselProfiles.length) {
      scrollCarouselToCard(nextIndex);
    } else {
      const container = carouselScrollRef.current;
      if (container) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      }
    }
  }, [carouselProfiles, scrollCarouselToCard]);

  // Full Profile Connect handler
  const autoNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleFullProfileConnect = useCallback((profile: Profile) => {
    const profileId = profile.id;
    if (connectedIds.has(profileId)) return;

    setConnectedIds(prev => {
      const next = new Set(prev);
      next.add(profileId);
      return next;
    });

    const currentIdx = carouselProfiles.findIndex(p => p.id === profileId);
    const isLastProfile = currentIdx >= carouselProfiles.length - 1;

    if (!isLastProfile && currentIdx !== -1) {
      if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
      autoNavTimerRef.current = setTimeout(() => {
        setViewingProfileIndex(currentIdx + 1);
        autoNavTimerRef.current = null;
      }, 2000);
    }
  }, [connectedIds, carouselProfiles]);

  useEffect(() => {
    return () => {
      if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
    };
  }, []);

  // ═══════════════════════════════════════════════════════
  // Full Profile View Overlay
  // ═══════════════════════════════════════════════════════

  if (viewingProfileIndex !== null) {
    const currentProfile = carouselProfiles[viewingProfileIndex];
    const isCurrentProfileConnected = currentProfile ? connectedIds.has(currentProfile.id) : false;

    return (
      <div className="w-full h-full relative">
        <FullProfileView
          profiles={carouselProfiles}
          currentIndex={viewingProfileIndex}
          onBack={handleBackFromProfile}
          onNavigate={handleNavigateProfile}
          onConnect={handleFullProfileConnect}
          isConnected={isCurrentProfileConnected}
          solutionVariant="3"
          savedMessage=""
          savedMessageFirstName=""
          isFirstConnect={false}
          onEditMessage={() => {}}
          isCurrentUserPremium={isCurrentUserPremium}
          useGreenGradient={useGreenGradient}
        />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // Chat Phase (no loading phase — goes directly to chat)
  // ═══════════════════════════════════════════════════════

  return (
    <div className="w-full h-full flex flex-col relative bg-brand-50 overflow-hidden">
      <DecorativeBg />

      {/* ── Sticky Header ── */}
      <div className="flex-none h-16 bg-card relative z-20 shrink-0 border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2 h-full">
          <SiaHeaderIcon size={34} />
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <p className="font-sans text-foreground text-[20px] leading-[28px] font-medium">
              SIA
            </p>
            <p className="font-sans text-muted-foreground text-[12px] leading-[16px] tracking-[0.2px]">
              Your matchmaking companion
            </p>
          </div>
        </div>
      </div>

      {/* ── Scrollable Chat Area ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}
      >
        <div className="flex flex-col gap-2.5 items-start px-4 pt-4 pb-24">

          {/* ── Slot 1: Typing → Greeting ── */}
          <AnimatePresence mode="wait">
            {chatStep === STEP_TYPING_GREETING ? (
              <TypingIndicator key="typing-greeting" />
            ) : chatStep >= STEP_GREETING ? (
              <ChatBubble key="msg-greeting">
                <p className="font-sans text-foreground text-[16px] leading-[24px]">
                  Hi Pratik 👋
                </p>
              </ChatBubble>
            ) : null}
          </AnimatePresence>

          {/* ── Slot 2: Typing → Value prop (V4 copy) ── */}
          <AnimatePresence mode="wait">
            {chatStep === STEP_TYPING_VALUE ? (
              <TypingIndicator key="typing-value" />
            ) : chatStep >= STEP_VALUE ? (
              <ChatBubble key="msg-value">
                <p className="font-sans text-foreground text-[16px] leading-[24px]">I found a few promising Matches for you.</p>
              </ChatBubble>
            ) : null}
          </AnimatePresence>

          {/* ── Profile Cards Carousel ── */}
          {chatStep >= STEP_VALUE && (
            <motion.div
              className="-mx-4 self-stretch"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <div ref={carouselScrollRef} className="overflow-x-auto scrollbar-hide" style={{ touchAction: 'auto' }}>
                <div className="flex gap-4 pl-4">
                  {carouselProfiles.map((profile, i) => (
                    <ProfileMiniCard
                      key={profile.id}
                      profile={profile}
                      onTap={() => handleViewProfile(i)}
                      onConnected={() => handleCardConnected(i)}
                      connectAll={userAction === 'connect'}
                      connectAllDelay={0}
                      isConnected={connectedIds.has(profile.id)}
                    />
                  ))}

                  {/* "View X More" card */}
                  {hiddenCount > 0 && (
                    <motion.div
                      className="bg-card rounded-2xl shrink-0 cursor-pointer overflow-hidden border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center"
                      style={{ width: 200, minHeight: 340 }}
                      onClick={handleExpandCarousel}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="flex flex-col items-center gap-4 px-4 text-center">
                        <div className="flex -space-x-4">
                          {allCarouselProfiles.slice(initialVisibleCount, (initialVisibleCount ?? 0) + hiddenCount).slice(0, 5).map((p, i) => (
                            <div
                              key={p.id}
                              className="w-[40px] h-[40px] rounded-full border-2 border-white overflow-hidden shadow-sm"
                              style={{ zIndex: 5 - i }}
                            >
                              <img
                                src={p.photos?.full || p.imageUrl || ''}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="font-sans text-primary text-[16px] leading-[24px] font-bold flex items-center gap-1">
                          View {hiddenCount} More
                          <ArrowRight className="w-4 h-4" />
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Right padding spacer */}
                  <div className="shrink-0 w-4" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Slot 3: Typing → CTA bubble ── */}
          <AnimatePresence mode="wait">
            {chatStep === STEP_TYPING_CTA ? (
              <TypingIndicator key="typing-cta" />
            ) : chatStep >= STEP_CTA && userAction === null && remainingCount > 0 ? (
              <motion.div
                key="msg-cta"
                className="flex gap-2 items-end"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="bg-card relative p-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]" style={{ maxWidth: 240 }}>
                  <p className="mb-3 font-sans text-foreground text-[16px] leading-[24px]">
                    {connectedCount === 0
                      ? "Would you like to Connect with all Matches?"
                      : "Would you like to Connect with the remaining Matches?"
                    }
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      variant="default"
                      size="md"
                      shape="pill"
                      className="w-full"
                      onClick={handleConnect}
                    >
                      Yes, Let's Connect
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      shape="pill"
                      className="w-full gap-1 text-primary border-primary"
                      onClick={handleSkip}
                    >
                      Skip For Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════
              Post-action messages — BULK CONNECT
          ═══════════════════════════════════════════════ */}
          {userAction === 'connect' && postActionStep >= POST_USER_BUBBLE && (
            <>
              <UserBubble>
                <p className="font-sans text-foreground text-[16px] leading-[24px]">
                  Yes, Let's Connect
                </p>
              </UserBubble>

              {postActionStep >= POST_TYPING_1 && (
                <AnimatePresence mode="wait">
                  {postActionStep < POST_REPLY_1 ? (
                    <TypingIndicator key="typing-post-connect-1" />
                  ) : (
                    <ChatBubble key="msg-post-connect-1">
                      <p className="font-sans text-foreground text-[16px] leading-[24px]">
                        We'll notify you when they Accept 🤞
                      </p>
                    </ChatBubble>
                  )}
                </AnimatePresence>
              )}

              {postActionStep >= POST_TYPING_2 && (
                <AnimatePresence mode="wait">
                  {postActionStep < POST_REPLY_2 ? (
                    <TypingIndicator key="typing-post-connect-2" />
                  ) : (
                    <ChatBubble key="msg-post-connect-2">
                      <p className="font-sans text-foreground text-[16px] leading-[24px]">
                        Let's explore more Matches…
                      </p>
                    </ChatBubble>
                  )}
                </AnimatePresence>
              )}
            </>
          )}

          {/* ═══════════════════════════════════════════════
              Post-action messages — ALL CONNECTED INDIVIDUALLY
          ═══════════════════════════════════════════════ */}
          {userAction === 'all_individual' && postActionStep >= POST_TYPING_1 && (
            <>
              <AnimatePresence mode="wait">
                {postActionStep < POST_REPLY_1 ? (
                  <TypingIndicator key="typing-post-all-1" />
                ) : (
                  <ChatBubble key="msg-post-all-1">
                    <p className="font-sans text-foreground text-[16px] leading-[24px]">
                      We'll notify you when they Accept 🤞
                    </p>
                  </ChatBubble>
                )}
              </AnimatePresence>

              {postActionStep >= POST_TYPING_2 && (
                <AnimatePresence mode="wait">
                  {postActionStep < POST_REPLY_2 ? (
                    <TypingIndicator key="typing-post-all-2" />
                  ) : (
                    <ChatBubble key="msg-post-all-2">
                      <p className="font-sans text-foreground text-[16px] leading-[24px]">
                        Let's explore more Matches…
                      </p>
                    </ChatBubble>
                  )}
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};