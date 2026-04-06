import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SiaLogoV4 } from '../matches/ConnectMessageSheet';
import { FullProfileView } from '../matches/FullProfileView';
import { Button } from '../Button';
import { TickFilledIcon, CrownFilledIcon, ChatIcon } from '../icons';
import type { Profile } from '../matches/ProfileCard';
import type { SolutionVariant } from '../matches/ConnectMessageSheet';
import svgPaths from '../../../imports/svg-5y984fxn6c';

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

interface SiaOnboardingScreenProps {
  onBack: () => void;
  onComplete: () => void;
  profiles: Profile[];
  isCurrentUserPremium?: boolean;
  solutionVariant?: SolutionVariant;
  useGreenGradient?: boolean;
  initialVisibleCount?: number; // If set, shows this many profiles first + "View X More" card
}

type Phase = 'loading' | 'chat';
// connect = bulk connect remaining, skip = skip, all_individual = user connected all 10 one by one
type UserAction = null | 'connect' | 'skip' | 'all_individual';

// Chat message steps (SIA messages only — each preceded by typing indicator)
// 0 = typing for intro
// 1 = intro shown, typing for education
// 2 = education shown, carousel appears
// 3 = typing for CTA
// 4 = CTA shown
const CHAT_STEP_TYPING_INTRO = 0;
const CHAT_STEP_INTRO = 1;
const CHAT_STEP_EDUCATION = 2;
const CHAT_STEP_TYPING_CTA = 3;
const CHAT_STEP_CTA = 4;

// Post-action steps
// -0.5 = user bubble shown
// 0 = typing for SIA reply 1
// 1 = SIA reply 1 shown, typing for SIA reply 2
// 2 = SIA reply 2 shown
const ACTION_USER_BUBBLE = -0.5;
const ACTION_TYPING_1 = 0;
const ACTION_REPLY_1 = 1;
const ACTION_TYPING_2 = 1.5; // intermediate typing state
const ACTION_REPLY_2 = 2;

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
// Typing Indicator (three pulsing dots)
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
        <linearGradient gradientUnits="userSpaceOnUse" id="siaHeaderGrad" x1="36.356" x2="28.966" y1="8.018" y2="37.087">
          <stop stopColor="#FF4596" />
          <stop offset="0.5" stopColor="#9472FA" />
          <stop stopColor="#0DD2F5" offset="1" />
        </linearGradient>
      </defs>
      <path d={svgPaths.p1f875600} fill="currentColor" className="text-foreground" />
      <path d={svgPaths.p1f875600} fill="url(#siaHeaderGrad)" />
    </svg>
    <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: size * 0.38, height: size * 0.38 }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
        <path d={svgPaths.p3b0a2300} fill="white" />
      </svg>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// Chat Bubble (SIA — left-aligned)
// ═══════════════════════════════════════════════════════

const ChatBubble = ({ children, skipAnimation = false }: { children: React.ReactNode; skipAnimation?: boolean }) => (
  <motion.div
    className="flex gap-2 items-end"
    initial={skipAnimation ? false : { opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={skipAnimation ? { duration: 0 } : { duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
  >
    <div className="bg-card relative p-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// User Bubble (right-aligned, like a sent message)
// ═══════════════════════════════════════════════════════

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

type CardButtonState = 'connect' | 'sent';

const ProfileMiniCard = ({ profile, onTap, onConnected, connectAll, connectAllDelay = 0, isConnected = false }: ProfileMiniCardProps) => {
  const [btnState, setBtnState] = useState<CardButtonState>(isConnected ? 'sent' : 'connect');
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
    // Notify parent after a brief delay so the animation plays first
    setTimeout(() => onConnected?.(), 600);
  }, [btnState, onConnected]);

  useEffect(() => {
    if (isConnected && btnState === 'connect') {
      setBtnState('sent');
    }
  }, [isConnected]);

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

// ══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════

export const SiaOnboardingScreen = ({ onBack, onComplete, profiles, isCurrentUserPremium = false, solutionVariant, useGreenGradient, initialVisibleCount }: SiaOnboardingScreenProps) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [chatStep, setChatStep] = useState(CHAT_STEP_TYPING_INTRO);
  const [viewingProfileIndex, setViewingProfileIndex] = useState<number | null>(null);
  const [carouselExpanded, setCarouselExpanded] = useState(false);
  const [userAction, setUserAction] = useState<UserAction>(null);
  const [actionStep, setActionStep] = useState(-1); // -1 = not started
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselScrollRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // ─── Individual connect tracking ───
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  // Profile data — show all non-VIP profiles upfront
  const allCarouselProfiles = useMemo(() => profiles.filter(p => !p.isVip).slice(0, 10), [profiles]);

  // ─── Progressive reveal: if initialVisibleCount is set, show a subset first ───
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

  // ─── Auto-transition: loading → chat ───
  useEffect(() => {
    const timer = setTimeout(() => setPhase('chat'), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ─── Chat message sequencing (typing → message → typing → message...) ───
  useEffect(() => {
    if (phase !== 'chat') return;

    // If returning from profile view and already animated, skip to final step
    if (hasAnimatedRef.current) {
      setChatStep(CHAT_STEP_CTA);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    // step 0 = typing for intro (starts immediately)
    // 1.2s → show intro, start typing for education
    timers.push(setTimeout(() => setChatStep(CHAT_STEP_INTRO), 1200));
    // +0.8s → show education + carousel
    timers.push(setTimeout(() => setChatStep(CHAT_STEP_EDUCATION), 2000));
    // +0.8s → typing for CTA
    timers.push(setTimeout(() => setChatStep(CHAT_STEP_TYPING_CTA), 2800));
    // +1.0s → show CTA
    timers.push(setTimeout(() => {
      setChatStep(CHAT_STEP_CTA);
      hasAnimatedRef.current = true;
    }, 3800));

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // ─── Post-action message sequencing (for connect / skip / all_individual) ───
  useEffect(() => {
    if (userAction === null) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (userAction === 'all_individual') {
      // No user bubble — SIA initiates
      setActionStep(ACTION_TYPING_1);
      timers.push(setTimeout(() => setActionStep(ACTION_REPLY_1), 1200));
      timers.push(setTimeout(() => setActionStep(ACTION_TYPING_2), 1500));
      timers.push(setTimeout(() => setActionStep(ACTION_REPLY_2), 2500));
      timers.push(setTimeout(() => onComplete(), 4500));
    } else {
      // connect or skip — user bubble shown first
      if (userAction === 'connect') {
        setActionStep(ACTION_USER_BUBBLE); // immediate — user bubble appears
        timers.push(setTimeout(() => setActionStep(ACTION_TYPING_1), 800)); // typing starts
        timers.push(setTimeout(() => setActionStep(ACTION_REPLY_1), 2000)); // SIA reply 1
        timers.push(setTimeout(() => setActionStep(ACTION_TYPING_2), 2300)); // typing for reply 2
        timers.push(setTimeout(() => setActionStep(ACTION_REPLY_2), 3300)); // SIA reply 2
        timers.push(setTimeout(() => onComplete(), 5300)); // exit
      } else {
        // skip — normal pacing
        setActionStep(ACTION_TYPING_1);
        timers.push(setTimeout(() => setActionStep(ACTION_REPLY_1), 1200));
        timers.push(setTimeout(() => setActionStep(ACTION_TYPING_2), 1500));
        timers.push(setTimeout(() => setActionStep(ACTION_REPLY_2), 2500));
        timers.push(setTimeout(() => onComplete(), 4500));
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [userAction, onComplete]);

  // ─── Detect all connected individually ───
  useEffect(() => {
    if (connectedCount === totalCount && totalCount > 0 && userAction === null && chatStep >= CHAT_STEP_CTA) {
      // Small delay so the last card's animation completes visually
      const timer = setTimeout(() => {
        setUserAction('all_individual');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [connectedCount, totalCount, userAction, chatStep]);

  // ─── Auto-scroll on new content ───
  useEffect(() => {
    if (phase === 'chat') {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 150);
    }
  }, [chatStep, actionStep, phase]);

  const skipAnim = hasAnimatedRef.current;

  // Handlers
  const handleViewProfile = useCallback((index: number) => {
    setViewingProfileIndex(index);
  }, []);

  const handleBackFromProfile = useCallback(() => {
    // Cancel any pending auto-navigation
    if (autoNavTimerRef.current) {
      clearTimeout(autoNavTimerRef.current);
      autoNavTimerRef.current = null;
    }
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

  // ─── Scroll carousel to center a specific card index ───
  const scrollCarouselToCard = useCallback((cardIndex: number) => {
    const container = carouselScrollRef.current;
    if (!container) return;
    const cardWidth = 200; // card width
    const gap = 16; // gap-4 = 16px
    const paddingLeft = 16; // pl-4 = 16px
    const containerWidth = container.clientWidth;
    // Calculate scroll position to center the target card
    const cardLeft = paddingLeft + cardIndex * (cardWidth + gap);
    const cardCenter = cardLeft + cardWidth / 2;
    const scrollTo = cardCenter - containerWidth / 2;
    container.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
  }, []);

  const handleExpandCarousel = useCallback(() => {
    setCarouselExpanded(true);
    // Auto-scroll to the first newly revealed card after expansion
    if (initialVisibleCount !== undefined) {
      setTimeout(() => {
        scrollCarouselToCard(initialVisibleCount);
      }, 100);
    }
  }, [initialVisibleCount, scrollCarouselToCard]);

  // ─── Individual card connected handler ───
  const handleCardConnected = useCallback((cardIndex: number) => {
    const profileId = carouselProfiles[cardIndex]?.id;
    if (profileId) {
      setConnectedIds(prev => {
        const next = new Set(prev);
        next.add(profileId);

        return next;
      });
    }

    // Auto-scroll carousel to next card
    const nextIndex = cardIndex + 1;
    if (nextIndex < carouselProfiles.length) {
      scrollCarouselToCard(nextIndex);
    } else {
      // Last card — scroll to end
      const container = carouselScrollRef.current;
      if (container) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      }
    }
  }, [carouselProfiles, scrollCarouselToCard]);

  // ─── Dynamic CTA copy ───
  const ctaBodyText = connectedCount > 0
    ? `Would you like to Connect with the remaining Matches?`
    : "Liked someone? A Connect lets them know you're interested 😊\n\nWould you like to Connect with all Matches?";

  const ctaButtonText = "Yes, Let's Connect";

  // ─── Dynamic user bubble text for connect action ───
  const connectUserBubbleText = "Yes, Let's Connect";

  // ─── Full Profile Connect handler (no ConnectMessageSheet — direct connect) ───
  const autoNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFullProfileConnect = useCallback((profile: Profile) => {
    const profileId = profile.id;
    if (connectedIds.has(profileId)) return; // already connected

    setConnectedIds(prev => {
      const next = new Set(prev);
      next.add(profileId);
      return next;
    });

    // Find current index in carouselProfiles
    const currentIdx = carouselProfiles.findIndex(p => p.id === profileId);
    const isLastProfile = currentIdx >= carouselProfiles.length - 1;

    // Auto-navigate to next profile after 2s (unless it's the last one)
    if (!isLastProfile && currentIdx !== -1) {
      // Clear any existing timer
      if (autoNavTimerRef.current) clearTimeout(autoNavTimerRef.current);
      autoNavTimerRef.current = setTimeout(() => {
        setViewingProfileIndex(currentIdx + 1);
        autoNavTimerRef.current = null;
      }, 2000);
    }
  }, [connectedIds, carouselProfiles]);

  // Cleanup auto-nav timer on unmount
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
          solutionVariant={solutionVariant}
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
  // Loading Phase
  // ═══════════════════════════════════════════════════════

  if (phase === 'loading') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-brand-50">
        <DecorativeBg />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <SiaLogoV4 size={72} duration={1.6} />
        </motion.div>
        <motion.p
          className="mt-6 font-sans text-[14px] text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
        >
          Finding Matches for you
        </motion.p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // Chat Phase
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

          {/* ── Slot 1: Typing → Intro message ── */}
          <AnimatePresence mode="wait">
            {chatStep === CHAT_STEP_TYPING_INTRO && !skipAnim ? (
              <TypingIndicator key="typing-intro" />
            ) : chatStep >= CHAT_STEP_INTRO ? (
              <ChatBubble key="msg-intro" skipAnimation={skipAnim}>
                <p className="font-sans text-foreground text-[16px] leading-[24px]">
                  Hi Pratik! I'm SIA 👋<br />I've handpicked {hasProgressiveReveal ? 'a few' : '10'} Matches you may like.
                </p>
              </ChatBubble>
            ) : null}
          </AnimatePresence>

          {/* ── Slot 2: Typing → Education message ── */}
          <AnimatePresence mode="wait">
            {chatStep === CHAT_STEP_INTRO && !skipAnim ? (
              <TypingIndicator key="typing-education" />
            ) : chatStep >= CHAT_STEP_EDUCATION ? (
              <ChatBubble key="msg-education" skipAnimation={skipAnim}>
                <p className="font-sans text-foreground text-[16px] leading-[24px]">Tap Connect to show your interest.<br /></p>
              </ChatBubble>
            ) : null}
          </AnimatePresence>

          {/* ── Profile Cards Carousel ── */}
          {chatStep >= CHAT_STEP_EDUCATION && (
            <motion.div
              className="-mx-4 self-stretch"
              initial={skipAnim ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={skipAnim ? { duration: 0 } : { duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
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

                  {/* "View X More" card — shown when progressive reveal is active and not yet expanded */}
                  {hiddenCount > 0 && (
                    <motion.div
                      className="bg-card rounded-2xl shrink-0 cursor-pointer overflow-hidden border border-border shadow-[0px_1px_4px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center"
                      style={{ width: 200, minHeight: 340 }}
                      onClick={handleExpandCarousel}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="flex flex-col items-center gap-4 px-4 text-center">
                        {/* 5 overlapping circular avatars */}
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

                  {/* Right padding spacer — ensures last card isn't clipped */}
                  <div className="shrink-0 w-4" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Slot 3: Typing → CTA bubble ── */}
          {/* Only show CTA if not all connected individually and no action taken yet */}
          <AnimatePresence mode="wait">
            {chatStep === CHAT_STEP_TYPING_CTA && !skipAnim ? (
              <TypingIndicator key="typing-cta" />
            ) : chatStep >= CHAT_STEP_CTA && userAction === null && remainingCount > 0 ? (
              <motion.div
                key="msg-cta"
                className="flex gap-2 items-end"
                initial={skipAnim ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={skipAnim ? { duration: 0 } : { duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
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
                      {ctaButtonText}
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
          {userAction === 'connect' && actionStep >= ACTION_USER_BUBBLE && (
            <>
              {/* User sent bubble */}
              <UserBubble>
                <p className="font-sans text-foreground text-[16px] leading-[24px]">
                  {connectUserBubbleText}
                </p>
              </UserBubble>

              {/* Slot 4: Typing → SIA reply 1 */}
              {actionStep >= ACTION_TYPING_1 && (
                <AnimatePresence mode="wait">
                  {actionStep < ACTION_REPLY_1 ? (
                    <TypingIndicator key="typing-action-1" />
                  ) : (
                    <ChatBubble key="msg-action-1">
                      <p className="font-sans text-foreground text-[16px] leading-[24px]">
                        We'll notify you when they Accept 🤞
                      </p>
                    </ChatBubble>
                  )}
                </AnimatePresence>
              )}

              {/* Slot 5: Typing → SIA reply 2 */}
              {actionStep >= ACTION_TYPING_2 && (
                <AnimatePresence mode="wait">
                  {actionStep < ACTION_REPLY_2 ? (
                    <TypingIndicator key="typing-action-2" />
                  ) : (
                    <ChatBubble key="msg-action-2">
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
              Post-action messages — SKIP
          ═══════════════════════════════════════════════ */}
          {userAction === 'skip' && actionStep >= ACTION_TYPING_1 && (
            <>
              {/* User sent bubble */}
              <UserBubble>
                <p className="font-sans text-foreground text-[16px] leading-[24px]">
                  Skip For Now
                </p>
              </UserBubble>

              {/* Slot 4: Typing → SIA reply 1 */}
              <AnimatePresence mode="wait">
                {actionStep < ACTION_REPLY_1 ? (
                  <TypingIndicator key="typing-skip-1" />
                ) : (
                  <ChatBubble key="msg-skip-1">
                    <p className="font-sans text-foreground text-[16px] leading-[24px]">
                      {connectedCount > 0
                        ? `${connectedCount} Connects sent! We'll notify you when they Accept 😊`
                        : "No worries! You can Connect anytime 😊"
                      }
                    </p>
                  </ChatBubble>
                )}
              </AnimatePresence>

              {/* Slot 5: Typing → SIA reply 2 */}
              {actionStep >= ACTION_TYPING_2 && (
                <AnimatePresence mode="wait">
                  {actionStep < ACTION_REPLY_2 ? (
                    <TypingIndicator key="typing-skip-2" />
                  ) : (
                    <ChatBubble key="msg-skip-2">
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
              (No user bubble — SIA initiates)
          ═══════════════════════════════════════════════ */}
          {userAction === 'all_individual' && actionStep >= ACTION_TYPING_1 && (
            <>
              {/* Slot 4: Typing → SIA celebration */}
              <AnimatePresence mode="wait">
                {actionStep < ACTION_REPLY_1 ? (
                  <TypingIndicator key="typing-allind-1" />
                ) : (
                  <ChatBubble key="msg-allind-1">
                    <p className="font-sans text-foreground text-[16px] leading-[24px]">
                      All connected! 🎉🎉 We'll notify you when they Accept.
                    </p>
                  </ChatBubble>
                )}
              </AnimatePresence>

              {/* Slot 5: Typing → explore more */}
              {actionStep >= ACTION_TYPING_2 && (
                <AnimatePresence mode="wait">
                  {actionStep < ACTION_REPLY_2 ? (
                    <TypingIndicator key="typing-allind-2" />
                  ) : (
                    <ChatBubble key="msg-allind-2">
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