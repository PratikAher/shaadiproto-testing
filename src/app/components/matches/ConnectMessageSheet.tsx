import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { cn } from '../../../utils/cn';
import { Button } from '../Button';
import { CrownFilledIcon } from '../icons';
import siaSvgPaths from '../../../imports/svg-5gq4uxh03u';
import connectSvgPaths from '../../../imports/svg-4xjmmghtl6';
import siaV2SvgPaths from '../../../imports/svg-unyd39tp2z';
import siaRawPaths from '../../../imports/svg-4b22t52yoi';
import type { Profile } from './ProfileCard';

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

export type SolutionVariant = '1.2b' | '3';

export type SiaAnimationType = 'full-rotate' | 'star-rotate';

type SheetPhase = 'generating' | 'typing' | 'ready';

interface ConnectMessageSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, autoSend: boolean) => void;
  profile: Profile;
  savedMessage: string;
  isFirstConnect: boolean;
  variant?: SolutionVariant;
  showStats?: boolean;
  showSubtitle?: boolean;
  useGreenGradient?: boolean;
}

// ══════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════

const MAX_CHARS = 700;
const MIN_CHARS = 10;
const TYPING_SPEED_MS = 40;
const SWIPE_THRESHOLD = 50;

/** Detects phone numbers — 5+ consecutive digits (with optional spaces/dashes/dots/parens) */
const PHONE_REGEX = /(?:\+?\d[\d\s\-().]{4,}\d|\b\d{5,}\b)/;
const containsPhone = (text: string): boolean => PHONE_REGEX.test(text);

const CONNECT_GRADIENT_PINK = 'linear-gradient(179.692deg, rgb(229,58,65) 1.7722%, rgb(215,6,102) 98.228%)';
const CONNECT_GRADIENT_VIP  = 'linear-gradient(180deg, rgb(118,76,165) 0%, rgb(73,43,108) 100%)';

/** SIA brand gradient — pink → purple → blue → cyan (from Figma) */
const SIA_GRADIENT = 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)';

const generateAIMessage = (profile: Profile, userName: string): string => {
  const name = profile.name.split(' ')[0];
  const messages = [
    `Hi ${name}, I came across your profile and really liked what you shared about yourself. I'm ${userName}, and I think we could have some great conversations. Would love to get to know you better!`,
    `Hey ${name}! Your profile really stood out to me. I'm ${userName}, and I appreciate how genuine you come across. I'd love to connect and see where things go.`,
    `Hi ${name}, your profile caught my eye and I wanted to reach out! I'm ${userName}, and I feel like we might have a lot in common. Looking forward to hearing from you!`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const replaceNameInMessage = (
  message: string, originalFirstName: string, newFirstName: string
): string => {
  if (!originalFirstName || !newFirstName || originalFirstName === newFirstName) return message;
  const regex = new RegExp(`\\b${originalFirstName}\\b`, 'g');
  return message.replace(regex, newFirstName);
};

// ═══════════════════════════════════════════════════════
// Icons
// ═══════════════════════════════════════════════════════

/** SIA sparkle icon — used in "Write with SIA" button */
const SiaIcon = ({ className, size = 13 }: { className?: string; size?: number }) => (
  <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
      <path d={connectSvgPaths.p1dad1af0} fill="currentColor" />
    </svg>
  </div>
);
export { SiaIcon };

/** AI retry icon — used in "Try another" button */
const AiRetryIcon = ({ className, size = 13 }: { className?: string; size?: number }) => (
  <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
      <path d={siaSvgPaths.p102f0010} fill="currentColor" />
    </svg>
  </div>
);
export { AiRetryIcon };

/** Connect checkmark icon — used in CTA button */
const ConnectIcon = ({ size = 24 }: { size?: number }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d={connectSvgPaths.p2f553b00} fill="currentColor" />
    </svg>
  </div>
);

/**
 * SIA flower/heart logo — the branded logo from Figma.
 * Outer shape with gradient overlay + inner sparkle in white.
 * Used for loading state animation.
 */
const SiaLogo = ({ size = 36, className }: { size?: number; className?: string }) => (
  <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
    <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 88 88">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="siaLogoGrad" x1="83.98" x2="67.73" y1="21.64" y2="85.59">
          <stop stopColor="#FF4596" />
          <stop offset="0.5" stopColor="#9472FA" />
          <stop stopColor="#0DD2F5" offset="1" />
        </linearGradient>
      </defs>
      {/* Outer flower shape — base + gradient overlay */}
      <path d={siaSvgPaths.p32da7d00} fill="var(--color-foreground, #272631)" />
      <path d={siaSvgPaths.p32da7d00} fill="url(#siaLogoGrad)" />
      {/* Inner sparkle */}
      <path d={siaSvgPaths.p234cda80} fill="white" />
    </svg>
  </div>
);
export { SiaLogo };

/**
 * SIA Logo V2 — Static flower background + rotating star.
 * Uses the separated Figma assets (svg-unyd39tp2z).
 * The flower viewBox is 88x88 (roughly 0–83 range in coords)
 * The star viewBox is 35.2x35.2
 * We need to overlay the star centered inside the flower
 * Flower center ≈ 44,44. Star is 35.2 wide → offset = (88 - 35.2) / 2 = 26.4
 */
const SiaLogoV2 = ({ size = 36, className }: { size?: number; className?: string }) => (
  <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
    <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 88 88">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="siaLogoGradV2" x1="0" x2="88" y1="0" y2="88">
          <stop stopColor="#FF5A60" />
          <stop offset="0.33" stopColor="#CC7AFF" />
          <stop offset="0.66" stopColor="#0094FF" />
          <stop offset="1" stopColor="#00BCD5" />
        </linearGradient>
      </defs>
      {/* Static flower background */}
      <path d={siaV2SvgPaths.p178ac180} fill="url(#siaLogoGradV2)" />
      {/* Rotating star — centered inside flower */}
      <motion.g
        style={{ transformOrigin: '44px 44px' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
      >
        <path
          d={siaV2SvgPaths.p20747d80}
          fill="white"
          transform="translate(26.4, 26.4)"
        />
      </motion.g>
    </svg>
  </div>
);
export { SiaLogoV2 };

/**
 * SIA Logo V3 — Shape rotates but gradient stays fixed.
 * Uses SVG <clipPath> with SMIL <animateTransform> so the
 * flower silhouette spins while the gradient rect underneath
 * stays perfectly still. The star also rotates with the shape.
 * This creates a "gradient window" effect — the colors shift
 * across the rotating silhouette like a kaleidoscope.
 */
const SiaLogoV3 = ({ size = 36, className, duration = 1.6 }: { size?: number; className?: string; duration?: number }) => {
  const clipId = React.useId().replace(/:/g, '_');
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 88 88">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={`siaGradV3${clipId}`} x1="83.98" x2="67.73" y1="21.64" y2="85.59">
            <stop stopColor="#FF4596" />
            <stop offset="0.5" stopColor="#9472FA" />
            <stop stopColor="#0DD2F5" offset="1" />
          </linearGradient>
          {/* Rotating clip path — the flower shape spins via SMIL */}
          <clipPath id={`flowerClipV3${clipId}`}>
            <path d={siaRawPaths.p178ac180}>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 44 44"
                to="360 44 44"
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
            </path>
          </clipPath>
        </defs>
        {/* Static gradient rect, visible only through the rotating flower clip */}
        <rect x="0" y="0" width="88" height="88" fill={`url(#siaGradV3${clipId})`} clipPath={`url(#flowerClipV3${clipId})`} />
        {/* Rotating star — spins with the flower shape */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 44 44"
            to="360 44 44"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
          <path d={siaRawPaths.p20747d80} fill="white" transform="translate(26.4, 26.4)" />
        </g>
      </svg>
    </div>
  );
};
export { SiaLogoV3 };

/**
 * SIA Logo V4 — Only the flower shape rotates; gradient AND star stay fixed.
 * Same clipPath + SMIL technique as V3, but the star is a plain static path
 * rendered on top — no animateTransform. The effect is a spinning
 * kaleidoscope silhouette with a perfectly still sparkle at the centre.
 */
const SiaLogoV4 = ({ size = 36, className, duration = 1.6 }: { size?: number; className?: string; duration?: number }) => {
  const clipId = React.useId().replace(/:/g, '_');
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 88 88">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={`siaGradV4${clipId}`} x1="83.98" x2="67.73" y1="21.64" y2="85.59">
            <stop stopColor="#FF4596" />
            <stop offset="0.5" stopColor="#9472FA" />
            <stop stopColor="#0DD2F5" offset="1" />
          </linearGradient>
          {/* Rotating clip path — flower silhouette spins via SMIL */}
          <clipPath id={`flowerClipV4${clipId}`}>
            <path d={siaRawPaths.p178ac180}>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 44 44"
                to="360 44 44"
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
            </path>
          </clipPath>
        </defs>
        {/* Static gradient rect, visible only through the rotating flower clip */}
        <rect x="0" y="0" width="88" height="88" fill={`url(#siaGradV4${clipId})`} clipPath={`url(#flowerClipV4${clipId})`} />
        {/* Static star — stays perfectly still */}
        <path d={siaRawPaths.p20747d80} fill="white" transform="translate(26.4, 26.4)" />
      </svg>
    </div>
  );
};
export { SiaLogoV4 };

// ═══════════════════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════════════════

const TypingCursor = () => (
  <motion.span
    className="inline-block w-[1.4px] h-[16px] rounded-full ml-0.5 align-middle"
    style={{ backgroundColor: 'var(--color-brand-500)' }}
    animate={{ opacity: [1, 0] }}
    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
  />
);
export { TypingCursor };

/**
 * Loading state — hardcoded to SiaLogoV4 (Static Sparkle).
 * The flower silhouette rotates; star and gradient are static.
 */
const SiaGeneratingState = () => (
  <div className="flex items-center gap-2.5 pt-0.5">
    <SiaLogoV4 size={20} />
    <span className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
      SIA is writing your message...
    </span>
  </div>
);
export { SiaGeneratingState };

// ═══════════════════════════════════════════════════════
// MAIN SHEET COMPONENT
// ═══════════════════════════════════════════════════════

export const ConnectMessageSheet = ({
  isOpen, onClose, onSend, profile, savedMessage, isFirstConnect,
  variant,
  showStats = false,
  showSubtitle = true,
  useGreenGradient = false,
}: ConnectMessageSheetProps) => {
  // ── Derived CTA gradient (matches the card button colour for this profile) ──
  const isProfileVip = !!profile.isVip;
  const CONNECT_GRADIENT_GREEN = 'linear-gradient(-6.59deg, #0AA4B8 13%, #09BF6C 86%)';
  const nonVipGradient = useGreenGradient ? CONNECT_GRADIENT_GREEN : CONNECT_GRADIENT_PINK;
  const CONNECT_GRADIENT = isProfileVip ? CONNECT_GRADIENT_VIP : nonVipGradient;
  const greenShadow = '0 4px 16px rgba(10,164,184,0.25)';
  const pinkShadow = '0 4px 16px rgba(215,6,102,0.25)';
  const ctaShadow = isProfileVip ? '0 4px 16px rgba(118,76,165,0.25)' : (useGreenGradient ? greenShadow : pinkShadow);

  // ── State ──
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<SheetPhase>(() =>
    isOpen && !(savedMessage && !isFirstConnect) ? 'generating' : 'ready'
  );
  const [typingWordIndex, setTypingWordIndex] = useState(0);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // ── Swipe state ──
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeDeltaX, setSwipeDeltaX] = useState(0);
  const [reuseForFuture, setReuseForFuture] = useState(true);

  // ── Phone-number validation state ──
  const [isSending, setIsSending] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Refs ──
  const draftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPhaseRef = useRef<SheetPhase>('ready');
  const generateCycleRef = useRef(0);

  // ── Computed ──
  const firstName = profile.name.split(' ')[0];
  const avatarUrl = profile.photos?.avatar || profile.avatarUrl || profile.imageUrl || '';
  const messageWords = message.split(/\s+/).filter(Boolean);
  const typedText = phase === 'typing' ? messageWords.slice(0, typingWordIndex).join(' ') : message;

  const isReady = phase === 'ready';
  const isGenerating = phase === 'generating';
  const isTyping = phase === 'typing';
  const isValid = isReady && message.trim().length >= MIN_CHARS && !isSending;
  const isBusy = isGenerating || isTyping;

  // ── History computed ──
  const historyCount = messageHistory.length;
  // During generation, show the upcoming slot optimistically
  const displayCount = isBusy ? Math.max(historyCount + 1, 2) : Math.max(historyCount, 1);
  const displayIndex = isBusy ? displayCount : (historyCount > 0 ? historyIndex + 1 : 1);
  const historyDisplay = `${displayIndex}/${displayCount}`;
  const canGoPrev = isReady && historyIndex > 0;
  const canGoNext = isReady && historyIndex < historyCount - 1;
  const creditsLeft = Math.max(0, 5 - historyCount);

  // ── Sheet drag-to-dismiss ──
  const dragControls = useDragControls();
  const DISMISS_THRESHOLD = 120;

  // ── Cleanup helper ──
  const clearAllTimers = useCallback(() => {
    if (typingIntervalRef.current) { clearInterval(typingIntervalRef.current); typingIntervalRef.current = null; }
    if (generateTimeoutRef.current) { clearTimeout(generateTimeoutRef.current); generateTimeoutRef.current = null; }
    if (readyDelayRef.current) { clearTimeout(readyDelayRef.current); readyDelayRef.current = null; }
    if (sendTimerRef.current) { clearTimeout(sendTimerRef.current); sendTimerRef.current = null; }
  }, []);

  // ── Cleanup ──
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // ── Typing engine ──
  const startTyping = useCallback((msg: string) => {
    const words = msg.split(/\s+/).filter(Boolean);
    setMessage(msg);
    setTypingWordIndex(0);
    setPhase('typing');
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (readyDelayRef.current) { clearTimeout(readyDelayRef.current); readyDelayRef.current = null; }
    let idx = 0;
    typingIntervalRef.current = setInterval(() => {
      idx++;
      setTypingWordIndex(idx);
      if (idx >= words.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        readyDelayRef.current = setTimeout(() => {
          readyDelayRef.current = null;
          setPhase('ready');
        }, 300);
      }
    }, TYPING_SPEED_MS);
  }, []);

  // ── Open effect ──
  useEffect(() => {
    if (isOpen) {
      if (isFirstConnect || !savedMessage) {
        generateCycleRef.current++;
        setPhase('generating');
        const generated = generateAIMessage(profile, 'Pratik');
        generateTimeoutRef.current = setTimeout(() => {
          generateTimeoutRef.current = null;
          startTyping(generated);
        }, 1200);
        return () => {
          if (generateTimeoutRef.current) { clearTimeout(generateTimeoutRef.current); generateTimeoutRef.current = null; }
        };
      } else {
        setMessage(savedMessage);
        setPhase('ready');
      }
    }
  }, [isOpen, isFirstConnect, profile]);

  // ── Close cleanup ──
  useEffect(() => {
    if (!isOpen) {
      clearAllTimers();
      setPhase('ready'); setTypingWordIndex(0);
      setMessageHistory([]); setHistoryIndex(0);
      setTouchStartX(null); setSwipeDeltaX(0);
      setIsSending(false); setPhoneError(false);
    }
  }, [isOpen, clearAllTimers]);

  // ── Push to history ONLY when AI typing finishes (phase: typing → ready) ──
  // Manual edits in the textarea do NOT create new history entries.
  useEffect(() => {
    if (phase === 'ready' && prevPhaseRef.current === 'typing' && message) {
      setMessageHistory(prev => {
        if (prev.includes(message)) return prev;
        const updated = [...prev, message];
        setHistoryIndex(updated.length - 1);
        return updated;
      });
    }
    prevPhaseRef.current = phase;
  }, [phase, message]);

  // ── Generate new message ──
  const handleGenerate = useCallback(() => {
    // Cancel any pending generate/typing timers from previous cycle
    if (generateTimeoutRef.current) { clearTimeout(generateTimeoutRef.current); generateTimeoutRef.current = null; }
    if (readyDelayRef.current) { clearTimeout(readyDelayRef.current); readyDelayRef.current = null; }
    // Clear phone error state — same as "Edit Message" behavior
    if (phoneError) setPhoneError(false);
    // Save current to history before generating
    setMessageHistory(prev => {
      if (prev.includes(message)) return prev;
      return [...prev, message];
    });
    generateCycleRef.current++;
    setPhase('generating');
    const generated = generateAIMessage(profile, 'Pratik');
    generateTimeoutRef.current = setTimeout(() => {
      generateTimeoutRef.current = null;
      startTyping(generated);
    }, 1200);
  }, [profile, startTyping, message, phoneError]);

  // ── History navigation ──
  const handleHistoryPrev = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setMessage(messageHistory[newIdx]);
    }
  }, [historyIndex, messageHistory]);

  const handleHistoryNext = useCallback(() => {
    if (historyIndex < messageHistory.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setMessage(messageHistory[newIdx]);
    }
  }, [historyIndex, messageHistory]);

  // ── Send — 2s loader mimics API call, then validates phone number ──
  const handleSend = useCallback(() => {
    if (message.trim().length < MIN_CHARS || isSending) return;
    // Clear any previous error
    setPhoneError(false);
    setIsSending(true);

    // Cancel any existing send timer
    if (sendTimerRef.current) { clearTimeout(sendTimerRef.current); sendTimerRef.current = null; }

    sendTimerRef.current = setTimeout(() => {
      sendTimerRef.current = null;
      setIsSending(false);

      if (containsPhone(message)) {
        // Phone number detected — show error, do NOT send
        setPhoneError(true);
      } else {
        // Clean message — proceed with send
        const autoSend = variant === '1.2b' ? reuseForFuture : true;
        onSend(message.trim(), autoSend);
      }
    }, 2000);
  }, [message, onSend, reuseForFuture, variant, isSending]);

  // ── Swipe handlers ──
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isReady || historyCount <= 1) return;
    setTouchStartX(e.touches[0].clientX);
  }, [isReady, historyCount]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.touches[0].clientX - touchStartX;
    const constrained = Math.sign(delta) * Math.min(Math.abs(delta) * 0.4, 80);
    setSwipeDeltaX(constrained);
  }, [touchStartX]);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX === null) return;
    const rawDelta = swipeDeltaX / 0.4;
    if (rawDelta > SWIPE_THRESHOLD && canGoPrev) {
      handleHistoryPrev();
    } else if (rawDelta < -SWIPE_THRESHOLD && canGoNext) {
      handleHistoryNext();
    }
    setSwipeDeltaX(0);
    setTouchStartX(null);
  }, [touchStartX, swipeDeltaX, canGoPrev, canGoNext, handleHistoryPrev, handleHistoryNext]);

  // ── Arrow SVGs ──
  const ArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 5L7.5 10.0001L12.5 15"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="16" strokeWidth="1.25" />
    </svg>
  );
  const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.50004 5L12.5 10L7.5 15"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="16" strokeWidth="1.25" />
    </svg>
  );

  // ════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — fades out as sheet is dragged down */}
          <motion.div className="absolute inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} onClick={onClose} />

          {/* Sheet */}
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-[70] rounded-t-[28px] flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--color-sheet-bg)', maxHeight: '85%' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > DISMISS_THRESHOLD || info.velocity.y > 500) {
                onClose();
              }
            }}
          >

            {/* Drag handle — swipe down to dismiss */}
            <div
              className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
              style={{ touchAction: 'none' }}
            >
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Content — no scrolling, content fits in view */}
            <div className="flex-1 px-5 pb-8">
              <div className="flex flex-col pt-4">

                {/* ── Avatar + Title + Subtitle ── */}
                <div className="flex flex-col items-center text-center gap-2.5">
                  {/* Avatar — 64px, round, no shadow */}
                  <div className="relative rounded-full shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                    </div>
                    <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ border: '0.5px solid rgba(0,0,0,0.1)' }} />
                  </div>
                  <div className="flex flex-col gap-0.5 w-full">
                    <h2 className="text-foreground" style={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px' }}>
                      Connect with {firstName}
                    </h2>
                    {showSubtitle && (
                      <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>
                        Your first Message matters. Make it personal.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Compose Card Group ── */}
                {/* Tighter spacing: 16px above compose, stats snug below, then 12px to CTA */}
                <div className="flex flex-col mt-4">
                  {/* Compose card */}
                  <div
                    className="rounded-2xl border overflow-hidden"
                    style={{
                      backgroundColor: 'var(--color-compose-card-bg)',
                      borderColor: 'var(--color-compose-card-border)',
                    }}
                  >
                    {/* Message area (swipeable) */}
                    <div
                      className="px-3.5 pt-3.5 pb-2 relative overflow-hidden"
                      style={{ height: 140 }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div
                        className="h-full relative"
                        style={{
                          transform: `translateX(${swipeDeltaX}px)`,
                          transition: touchStartX !== null ? 'none' : 'transform 0.3s ease-out',
                        }}
                      >
                        {/* ── Phase layers ──
                             All three are always in the DOM, positioned absolutely.
                             Only the active phase is visible (opacity 1 + pointer-events).
                             This avoids AnimatePresence key-caching bugs in Motion v12
                             where re-entering key="skeleton" after a prior exit keeps
                             the cached exit opacity (0) when initial={false}. */}

                        {/* Generating state — SIA logo + "writing your message…" */}
                        <div
                          className={cn(
                            "absolute inset-0 transition-opacity duration-150",
                            isGenerating
                              ? "opacity-100 z-[2]"
                              : "opacity-0 pointer-events-none z-[0]"
                          )}
                        >
                          {/* key forces SiaLogoV4 SMIL animateTransform to restart each cycle */}
                          <SiaGeneratingState key={`gen-${generateCycleRef.current}`} />
                        </div>

                        {/* Typing state — word-by-word reveal + cursor */}
                        <div
                          className={cn(
                            "absolute inset-0 transition-opacity duration-150",
                            isTyping
                              ? "opacity-100 z-[2]"
                              : "opacity-0 pointer-events-none z-[0]"
                          )}
                        >
                          <p
                            className="text-foreground"
                            style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400 }}
                          >
                            {typedText}{isTyping && <TypingCursor />}
                          </p>
                        </div>

                        {/* Ready state — editable textarea */}
                        <div
                          className={cn(
                            "absolute inset-0 transition-opacity duration-150",
                            isReady
                              ? "opacity-100 z-[2]"
                              : "opacity-0 pointer-events-none z-[0]"
                          )}
                        >
                          <textarea
                            ref={draftTextareaRef}
                            value={message}
                            onChange={(e) => {
                              if (e.target.value.length <= MAX_CHARS) {
                                setMessage(e.target.value);
                                // Clear phone error when user edits the message
                                if (phoneError) setPhoneError(false);
                              }
                            }}
                            placeholder="Say something nice..."
                            rows={5}
                            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none"
                            style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Bottom row: nav arrows + SIA button ──
                         Always rendered to maintain constant card height.
                         Invisible during generating & typing to avoid jerk. */}
                    <div className={cn(
                      "flex items-center justify-between pl-1.5 pr-3 pb-3 pt-1 transition-opacity duration-200",
                      isReady ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                      {/* Navigation arrows — only when showStats is on */}
                      {showStats ? (
                        <div className="flex items-center gap-3 py-1.5 px-1.5 rounded-full">
                          <button
                            type="button"
                            onClick={handleHistoryPrev}
                            disabled={!canGoPrev}
                            className={cn(
                              "w-5 h-5 flex items-center justify-center transition-all",
                              canGoPrev ? "text-muted-foreground active:opacity-60" : "text-muted-foreground/25"
                            )}
                          >
                            <ArrowLeft />
                          </button>
                          <span
                            className={cn(
                              "min-w-[24px] text-center transition-colors",
                              isBusy ? "text-muted-foreground/40" : "text-muted-foreground"
                            )}
                            style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}
                          >
                            {historyDisplay}
                          </span>
                          <button
                            type="button"
                            onClick={handleHistoryNext}
                            disabled={!canGoNext}
                            className={cn(
                              "w-5 h-5 flex items-center justify-center transition-all",
                              canGoNext ? "text-muted-foreground active:opacity-60" : "text-muted-foreground/25"
                            )}
                          >
                            <ArrowRight />
                          </button>
                        </div>
                      ) : (
                        /* Empty spacer when stats hidden */
                        <div />
                      )}

                      {/* SIA action button —
                           "Write with SIA" when no message text exists,
                           "Try another" when text exists */}
                      <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isBusy}
                        className={cn(
                          "h-8 rounded-full flex items-center transition-all active:scale-[0.97] active:opacity-80 p-[1.5px]",
                          isBusy && "opacity-40 pointer-events-none"
                        )}
                        style={{ backgroundImage: SIA_GRADIENT }}
                      >
                        <div className="h-full rounded-full px-2.5 flex items-center gap-1" style={{ backgroundColor: 'var(--color-sia-pill-bg)' }}>
                          {message.trim().length === 0 ? (
                            <>
                              <SiaIcon className="text-foreground" size={13} />
                              <span className="text-foreground" style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Write with SIA
                              </span>
                            </>
                          ) : (
                            <>
                              <AiRetryIcon className="text-foreground" size={13} />
                              <span className="text-foreground" style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Try another
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Stats row (char count + credits) — snug below card, only when showStats is on */}
                  {showStats && (
                    <div
                      className={cn(
                        "flex items-center justify-between px-1 mt-1.5 transition-opacity",
                        isBusy ? "opacity-40" : "opacity-100"
                      )}
                    >
                      <span
                        className={cn(
                          "transition-colors",
                          message.length > MAX_CHARS * 0.9 ? "text-[var(--color-warning-500)]" : "text-muted-foreground/70"
                        )}
                        style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.2px' }}
                      >
                        {message.length}/{MAX_CHARS}
                      </span>
                      <span
                        className={cn(
                          "transition-colors",
                          creditsLeft <= 1 ? "text-[var(--color-warning-500)]" : "text-muted-foreground/70"
                        )}
                        style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.2px' }}
                      >
                        {creditsLeft} credits left
                      </span>
                    </div>
                  )}

                  {/* Phone number / Contact details error */}
                  <AnimatePresence>
                    {phoneError && (
                      <motion.div
                        className="flex items-center gap-1.5 px-1 mt-2"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                          <circle cx="7" cy="7" r="6.25" stroke="var(--color-accent-palette-700)" strokeWidth="1.25" />
                          <path d="M7 4.5V7.5" stroke="var(--color-accent-palette-700)" strokeWidth="1.25" strokeLinecap="round" />
                          <circle cx="7" cy="9.5" r="0.625" fill="var(--color-accent-palette-700)" />
                        </svg>
                        <span
                          className="text-[var(--color-accent-palette-700)]"
                          style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}
                        >
                          Only Premium Members can share Contact details
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── CTA Area — both states always in DOM, crossfade via CSS transitions ──
                       Same pattern as the phase layers above. No AnimatePresence = no jerk.
                       Container height animates smoothly between 48px (1 btn) and 106px (2 btns). */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      marginTop: showStats ? '10px' : '14px',
                      height: phoneError ? 106 : 48,
                      transition: 'height 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                  >
                    {/* Layer: Error CTAs (Upgrade Now + Edit Message) */}
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 flex flex-col gap-2.5 transition-opacity duration-200",
                        phoneError
                          ? "opacity-100 z-[2]"
                          : "opacity-0 pointer-events-none z-[0]"
                      )}
                    >
                      <Button
                        variant="default"
                        size="lg"
                        className="w-full gap-2"
                        style={{ fontSize: '16px', fontWeight: 700 }}
                        onClick={() => {
                          /* Placeholder — would navigate to premium upgrade flow */
                        }}
                      >
                        <CrownFilledIcon className="!w-5 !h-5 shrink-0" />
                        Upgrade Now
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full"
                        style={{ fontSize: '16px', fontWeight: 500 }}
                        onClick={() => {
                          setPhoneError(false);
                          setTimeout(() => {
                            draftTextareaRef.current?.focus();
                          }, 50);
                        }}
                      >
                        Edit Message
                      </Button>
                    </div>

                    {/* Layer: Connect With Message gradient CTA */}
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 transition-opacity duration-200",
                        phoneError ? "pointer-events-none z-[0]" : "z-[2]"
                      )}
                      style={{
                        opacity: phoneError ? 0 : ((isValid || isSending) ? 1 : 0.5),
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={isSending || (!isValid && !isSending)}
                        className={cn(
                          "w-full h-12 rounded-full flex items-center justify-center gap-[3px] transition-all active:scale-[0.98]",
                          !isValid && !isSending && "pointer-events-none"
                        )}
                        style={{
                          backgroundImage: CONNECT_GRADIENT,
                          color: 'white',
                          boxShadow: (isValid || isSending) ? ctaShadow : 'none',
                        }}
                      >
                        {isSending ? (
                          <motion.svg
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          >
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                            <path
                              d="M12 2a10 10 0 0 1 10 10"
                              stroke="white" strokeWidth="2.5" strokeLinecap="round"
                            />
                          </motion.svg>
                        ) : (
                          <>
                            <ConnectIcon size={24} />
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>
                              Connect Now
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ── Footer — variant-conditional, hidden during phone error ── */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: phoneError ? 0 : 60,
                      opacity: phoneError ? 0 : 1,
                      transition: 'max-height 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease',
                    }}
                  >
                    {variant === '1.2b' ? (
                      <div
                        className={cn(
                          "flex flex-col mt-4 transition-opacity",
                          isBusy ? "opacity-40 pointer-events-none" : "opacity-100"
                        )}
                      >
                        <label
                          className="flex items-center gap-2.5 cursor-pointer select-none"
                          htmlFor="reuse-checkbox"
                        >
                          <div className="relative shrink-0" style={{ transform: 'translateY(-1px)' }}>
                            <input
                              id="reuse-checkbox"
                              type="checkbox"
                              checked={reuseForFuture}
                              onChange={(e) => setReuseForFuture(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div
                              className={cn(
                                "w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all",
                                reuseForFuture
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/40 bg-transparent"
                              )}
                            >
                              {reuseForFuture && (
                                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                  <path d="M1.5 4.5L4 7L9.5 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span
                            className="text-muted-foreground"
                            style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}
                          >
                            Use this Message for future Connects
                          </span>
                        </label>
                        <span
                          className="text-muted-foreground/55"
                          style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', marginLeft: '28px' }}
                        >
                          Names are personalized for each Match
                        </span>
                      </div>
                    ) : (
                      <p
                        className={cn(
                          "text-center text-muted-foreground mt-2 transition-opacity",
                          isBusy ? "opacity-40" : "opacity-100"
                        )}
                        style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px' }}
                      >
                        Your Message will be personalized for each Profile.
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════
// Solution Switcher FAB (simplified)
// ═══════════════════════════════════════════════════════

interface SolutionFABProps {
  current: SolutionVariant;
  onChange: (v: SolutionVariant) => void;
  showStats?: boolean;
  onToggleStats?: () => void;
}

const FAB_ITEMS: { id: SolutionVariant; label: string; desc: string; recommended?: boolean }[] = [
  { id: '1.2b', label: 'Chat Bubble', desc: 'Post-connect bubble + message preview', recommended: true },
  { id: '3', label: 'Connect With Message', desc: 'Full-width CTA + preview tile', recommended: true },
];

export const SolutionFAB = ({ current, onChange, showStats = false, onToggleStats }: SolutionFABProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute bottom-[88px] right-3 z-[55] flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="flex flex-col p-2.5 bg-card border border-border rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{ width: 260 }}
          >
            {/* Card CTA group */}
            <p className="text-muted-foreground px-2 pt-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
              CARD CTA
            </p>
            <p className="text-muted-foreground/60 px-2 pb-1.5 mt-0.5" style={{ fontSize: '9px', fontWeight: 400 }}>
              How connect appears on card
            </p>
            <div className="flex flex-col gap-0.5">
              {FAB_ITEMS.map((item) => {
                const isActive = current === item.id;
                return (
                  <button key={item.id} type="button"
                    onClick={() => onChange(item.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    )}>
                    <span className={cn('min-w-[22px] h-[20px] rounded-md flex items-center justify-center shrink-0 px-1',
                      isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    )} style={{ fontSize: '9px', fontWeight: 700 }}>
                      {item.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.label}</span>
                        {item.recommended && (
                          <span className="px-1 py-px rounded text-white" style={{ fontSize: '7.5px', fontWeight: 700, backgroundColor: 'var(--color-accent-palette-500)' }}>REC</span>
                        )}
                      </div>
                      <span className="text-muted-foreground block truncate" style={{ fontSize: '9px' }}>{item.desc}</span>
                    </div>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stats toggle */}
            <div className="h-px bg-border mx-2 my-2" />
            <button type="button" onClick={onToggleStats}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-muted transition-colors">
              <div className={cn("w-8 h-[18px] rounded-full flex items-center px-0.5 transition-colors",
                showStats ? "bg-primary justify-end" : "bg-muted justify-start")}>
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-foreground">Credits & Char Count</span>
                <span className="text-muted-foreground block" style={{ fontSize: '9px' }}>Show stats below compose card</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB trigger button */}
      <button type="button" onClick={() => setExpanded(!expanded)}
        className={cn(
          'h-10 px-3 rounded-full flex items-center gap-1.5 shadow-lg border transition-all',
          expanded ? 'bg-primary text-white border-primary' : 'bg-card text-foreground border-border hover:bg-muted'
        )}>
        <span className={cn('min-w-[22px] h-[18px] rounded flex items-center justify-center px-1 shrink-0',
          expanded ? 'bg-white/20' : 'bg-primary text-white'
        )} style={{ fontSize: '8px', fontWeight: 700 }}>{current}</span>
      </button>
    </div>
  );
};