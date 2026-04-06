import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import GroupBackIcon from '../../../imports/Group';
import imgMoneyBackBanner from '/images/money-back-guarantee.png';

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

interface PremiumUpgradeScreenProps {
  onSkip: () => void;
  onContinue?: () => void;
  mode?: 'onboarding' | 'tab';
  onBack?: () => void;
}

type PlanTab = 'premium' | 'vip';

interface PlanCard {
  id: string;
  tier: string;
  tierGradient: [string, string]; // from → to colors for the badge
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  perMonth?: number;
  discountPercent: number;
  extraOffer: string;
  contacts: number;
  features: string[];
}

const PREMIUM_PLANS: PlanCard[] = [
  {
    id: 'silver',
    tier: 'SILVER',
    tierGradient: ['#F5F3F3', '#C9C9C9'],
    duration: '1 Month',
    originalPrice: 2999,
    discountedPrice: 1200,
    discountPercent: 58,
    extraOffer: '+ Extra 5% off + 20 days',
    contacts: 15,
    features: [
      'View upto 15 Contact Numbers',
      'Video call & Chat with Matches',
      'Stand out from other Profiles',
      'Let Matches Contact you directly',
    ],
  },
  {
    id: 'gold',
    tier: 'GOLD',
    tierGradient: ['#FFEDC8', '#F9CA6E'],
    duration: '3 Months',
    originalPrice: 4540,
    discountedPrice: 1816,
    perMonth: 605,
    discountPercent: 58,
    extraOffer: '+ Extra 5% off',
    contacts: 75,
    features: [
      'View upto 75 Contact Numbers',
      'Video call & Chat with Matches',
      'Stand out from other Profiles',
      'Let Matches Contact you directly',
    ],
  },
  {
    id: 'diamond',
    tier: 'DIAMOND',
    tierGradient: ['#E0F7FF', '#7DD3FC'],
    duration: '6 Months',
    originalPrice: 7999,
    discountedPrice: 2999,
    perMonth: 500,
    discountPercent: 63,
    extraOffer: '+ Extra 10% off',
    contacts: 150,
    features: [
      'View upto 150 Contact Numbers',
      'Video call & Chat with Matches',
      'Stand out from other Profiles',
      'Let Matches Contact you directly',
    ],
  },
  {
    id: 'platinum',
    tier: 'PLATINUM',
    tierGradient: ['#F0E6FF', '#C4A0FF'],
    duration: '12 Months',
    originalPrice: 14999,
    discountedPrice: 4999,
    perMonth: 417,
    discountPercent: 67,
    extraOffer: '+ Extra 15% off',
    contacts: 300,
    features: [
      'View upto 300 Contact Numbers',
      'Video call & Chat with Matches',
      'Stand out from other Profiles',
      'Let Matches Contact you directly',
    ],
  },
];

const VIP_PLANS: PlanCard[] = [
  {
    id: 'vip-1',
    tier: 'VIP',
    tierGradient: ['#F3E8FF', '#9333EA'],
    duration: '1 Month',
    originalPrice: 9999,
    discountedPrice: 5999,
    discountPercent: 40,
    extraOffer: '+ Priority Support',
    contacts: 50,
    features: [
      'View upto 50 Contact Numbers',
      'Dedicated Relationship Manager',
      'Premium Profile Boost',
      'Let Matches Contact you directly',
    ],
  },
  {
    id: 'vip-3',
    tier: 'VIP GOLD',
    tierGradient: ['#FFEDC8', '#D4A017'],
    duration: '3 Months',
    originalPrice: 24999,
    discountedPrice: 14999,
    perMonth: 5000,
    discountPercent: 40,
    extraOffer: '+ Priority Support',
    contacts: 150,
    features: [
      'View upto 150 Contact Numbers',
      'Dedicated Relationship Manager',
      'Premium Profile Boost',
      'Let Matches Contact you directly',
    ],
  },
];

// ═══════════════════════════════════════════════════════
// Feature Icons (inline SVGs matching the Figma design)
// ═══════════════════════════════════════════════════════

const ContactNumberIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
    <path d="M3 6.00661C3 3.67731 3 2.51267 3.75315 1.78905C4.50631 1.06543 5.71849 1.06543 8.14286 1.06543H9.85714C12.2815 1.06543 13.4937 1.06543 14.2468 1.78905C15 2.51267 15 3.67731 15 6.00661V10.1243C15 12.4535 15 13.6182 14.2468 14.3418C13.4937 15.0654 12.2815 15.0654 9.85714 15.0654H8.14286C5.71849 15.0654 4.50631 15.0654 3.75315 14.3418C3 13.6182 3 12.4535 3 10.1243V6.00661Z" stroke="#41404D" />
    <circle cx="8.0" cy="5.0" r="1.3" stroke="#41404D" />
    <path d="M10.96 11.76H6.71C6.32 11.76 6 11.44 6 11.05C6 9.87 6.95 8.92 8.13 8.92H9.54C10.72 8.92 11.67 9.87 11.67 11.05C11.67 11.44 11.35 11.76 10.96 11.76Z" stroke="#41404D" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="2.5" x2="1.5" y1="4.57" y2="4.57" stroke="#41404D" strokeLinecap="round" />
    <line x1="2.5" x2="1.5" y1="8.57" y2="8.57" stroke="#41404D" strokeLinecap="round" />
    <line x1="2.5" x2="1.5" y1="12.57" y2="12.57" stroke="#41404D" strokeLinecap="round" />
  </svg>
);

const VideoChatIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
    <path d="M8.06657 1.5C11.9512 1.50015 15.2326 4.22671 15.2326 7.74023C15.2325 11.1439 12.153 13.8083 8.42887 13.9717L8.06657 13.9805C7.60571 13.981 7.14623 13.9417 6.69352 13.8652C6.53592 13.8386 6.43372 13.8219 6.35758 13.8125C6.27948 13.8029 6.26629 13.8063 6.27848 13.8047C6.29474 13.8025 6.28178 13.8021 6.20036 13.8369C6.12343 13.8698 6.02085 13.9187 5.8654 13.9932C4.91612 14.4475 3.81309 14.6065 2.75114 14.4287C2.57108 14.3986 2.42165 14.2729 2.36149 14.1006C2.30141 13.9281 2.3406 13.7361 2.46305 13.6006C2.77046 13.2602 2.97726 12.8541 3.06852 12.4229C3.08361 12.3476 3.05408 12.2066 2.87516 12.043C1.66141 10.9337 0.899644 9.42096 0.899577 7.74023C0.899577 4.22661 4.18179 1.5 8.06657 1.5Z" stroke="#41404D" strokeLinejoin="round" />
    <rect x="4.67" y="5.34" width="5" height="5.33" rx="1" stroke="#41404D" strokeWidth="0.9" />
    <path d="M9.67 6.98L9.71 6.94C10.41 6.36 10.77 6.07 11.05 6.21C11.33 6.35 11.33 6.82 11.33 7.75V8.27C11.33 9.2 11.33 9.67 11.05 9.81C10.77 9.95 10.41 9.66 9.71 9.08L9.67 9.04" stroke="#41404D" strokeLinecap="round" strokeWidth="0.9" />
  </svg>
);

const StandOutIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
    <circle cx="6.67" cy="5.33" r="3.33" stroke="#41404D" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13.33C2 10.76 4.09 8.67 6.67 8.67C7.52 8.67 8.31 8.89 9 9.29" stroke="#41404D" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.07 9.67L12.48 10.5C12.54 10.61 12.69 10.72 12.81 10.75L13.56 10.87C14.03 10.95 14.14 11.3 13.8 11.64L13.22 12.22C13.12 12.32 13.07 12.51 13.1 12.65L13.27 13.37C13.4 13.94 13.1 14.17 12.59 13.87L11.9 13.45C11.77 13.38 11.56 13.38 11.44 13.45L10.74 13.87C10.24 14.17 9.94 13.94 10.07 13.37L10.23 12.65C10.26 12.51 10.21 12.32 10.11 12.22L9.53 11.64C9.19 11.3 9.3 10.95 9.78 10.87L10.52 10.75C10.64 10.72 10.79 10.61 10.85 10.5L11.26 9.67C11.48 9.22 11.85 9.22 12.07 9.67Z" stroke="#41404D" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CallIncomingIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
    <path d="M0.45 1.66V4.07H2.87M4.07 0.45L0.7 3.83" stroke="#41404D" strokeLinecap="round" strokeLinejoin="round" transform="translate(2, 2) scale(0.75)" />
    <path d="M4.61 2.31L4.34 1.7C4.16 1.31 4.07 1.11 3.94 0.96C3.78 0.77 3.56 0.63 3.32 0.56C3.13 0.5 2.92 0.5 2.48 0.5C1.85 0.5 1.54 0.5 1.27 0.62C0.96 0.76 0.68 1.08 0.56 1.4C0.47 1.68 0.49 1.96 0.55 2.53C1.13 8.56 4.44 11.87 10.47 12.45C11.04 12.51 11.32 12.53 11.6 12.44C11.92 12.32 12.24 12.04 12.38 11.73C12.5 11.46 12.5 11.15 12.5 10.52C12.5 10.08 12.5 9.87 12.44 9.68C12.37 9.44 12.23 9.22 12.04 9.06C11.89 8.93 11.69 8.84 11.3 8.66L10.69 8.39C10.26 8.2 10.05 8.11 9.83 8.09C9.62 8.07 9.42 8.1 9.22 8.17C9.02 8.25 8.84 8.4 8.48 8.7C8.12 9 7.94 9.15 7.72 9.23C7.53 9.3 7.27 9.33 7.07 9.3C6.84 9.26 6.66 9.17 6.31 8.98C5.21 8.39 4.61 7.79 4.02 6.69C3.83 6.34 3.74 6.16 3.7 5.93C3.67 5.73 3.7 5.47 3.77 5.28C3.85 5.06 4 4.88 4.3 4.52C4.6 4.16 4.75 3.98 4.83 3.78C4.9 3.58 4.93 3.38 4.91 3.17C4.89 2.95 4.8 2.74 4.61 2.31Z" stroke="#41404D" strokeLinecap="round" transform="translate(2, 2) scale(0.85)" />
  </svg>
);

const FEATURE_ICONS = [ContactNumberIcon, VideoChatIcon, StandOutIcon, CallIncomingIcon];

// ═══════════════════════════════════════════════════════
// Timer Hook
// ═══════════════════════════════════════════════════════

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
  };
}

// ═══════════════════════════════════════════════════════
// Plan Card Component
// ═══════════════════════════════════════════════════════

const PlanCardComponent = ({
  plan,
  isActive,
}: {
  plan: PlanCard;
  isActive: boolean;
}) => {
  return (
    <div
      className="bg-card rounded-3xl shrink-0 flex flex-col overflow-hidden relative"
      style={{
        width: 280,
        minHeight: 380,
        border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: isActive
          ? '0px 4px 8px rgba(0,0,0,0.08), 0px 1px 11px rgba(0,0,0,0.06), 0px 2px 5px rgba(0,0,0,0.06)'
          : '0px 3.6px 7.3px rgba(0,0,0,0.08), 0px 0.9px 10px rgba(0,0,0,0.06)',
      }}
    >
      {/* Offer ribbon at top */}
      <div className="relative w-full h-[42px] overflow-hidden">
        <div className="absolute inset-0 -scale-y-100">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 42">
            <path
              d="M0 0L6.74 2.5C12.86 4.77 19.57 4.92 25.79 2.94L26.34 2.76C31.97 0.97 38.09 1.06 43.67 2.97C49.34 4.92 55.58 4.94 61.25 3C66.92 1.06 73.08 1.06 78.75 3C84.42 4.94 90.58 4.94 96.25 3C101.92 1.06 108.08 1.06 113.75 3C119.42 4.94 125.58 4.94 131.25 3C136.92 1.06 143.08 1.06 148.75 3C154.42 4.94 160.58 4.94 166.25 3C171.92 1.06 178.08 1.06 183.75 3C189.42 4.94 195.58 4.94 201.25 3C206.92 1.06 213.17 1.09 218.84 3.03C224.4 4.94 230.52 4.97 236.08 3.06L236.69 2.85C242.07 1.01 247.91 1.08 253.23 3.05C258.39 4.96 264.03 5.09 269.27 3.42L280 0V42H0V0Z"
              fill="url(#offerGrad)"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="offerGrad" x1="0" x2="280" y1="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7DF9BE" />
                <stop offset="1" stopColor="#FACB7D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.06)]">
          <span className="text-[16px] leading-[24px]">🎉</span>
          <div className="flex items-center gap-1">
            <span className="font-sans text-[16px] leading-[24px] text-[#049b56]">
              Flat <span className="font-bold">{plan.discountPercent}%</span>
            </span>
            <span className="font-sans text-[14px] leading-[24px] text-[#41404d]">
              {plan.extraOffer}
            </span>
          </div>
        </div>
      </div>

      {/* Plan details */}
      <div className="flex flex-col items-center gap-4 flex-1 px-5 pb-5 pt-3">
        {/* Tier badge + duration */}
        <div className="flex items-center gap-1">
          <div className="relative h-[26px] px-4 flex items-center rounded-sm overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 78 28" fill="none">
              <path
                d="M72.8937 0.5C76.0191 0.5 78.1926 3.61 77.1203 6.54L70.5432 24.54C69.8946 26.32 68.2062 27.5 66.3166 27.5H5.00506C1.82655 27.5 -0.350213 24.29 0.822447 21.34L7.96698 3.34C8.64741 1.63 10.3054 0.5 12.1496 0.5H72.8937Z"
                fill={`url(#tierGrad-${plan.id})`}
                stroke="white"
              />
              <defs>
                <linearGradient id={`tierGrad-${plan.id}`} x1="76" x2="-15" y1="0.5" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor={plan.tierGradient[0]} />
                  <stop offset="1" stopColor={plan.tierGradient[1]} />
                </linearGradient>
              </defs>
            </svg>
            <span className="relative font-sans font-medium italic text-[16px] leading-[24px] text-[#41404d]">
              {plan.tier}
            </span>
          </div>
          <span className="font-sans text-[16px] leading-[24px] text-muted-foreground text-center">
            {plan.duration}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <span className="font-sans text-[20px] leading-[32px] text-muted-foreground line-through">
              ₹{plan.originalPrice}
            </span>
            <span className="font-sans font-bold text-[36px] leading-[48px] text-[#41404d]">
              ₹{plan.discountedPrice}
            </span>
          </div>
          {plan.perMonth && (
            <span className="font-sans text-[16px] leading-[24px] text-muted-foreground text-center">
              ₹{plan.perMonth} per month
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-col gap-3 w-full mt-1">
          {plan.features.map((feature, i) => {
            const IconComp = FEATURE_ICONS[i] || FEATURE_ICONS[0];
            // Silver plan: last 2 features are crossed out (not available)
            const isCrossedOut = plan.id === 'silver' && i >= 2;
            return (
              <div key={i} className="flex items-center gap-2 w-full">
                <IconComp />
                <span
                  className={`font-sans text-[14px] leading-[20px] text-[#41404d] ${isCrossedOut ? 'line-through' : ''}`}
                >
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════

export const PremiumUpgradeScreen = ({ onSkip, onContinue, mode = 'onboarding', onBack }: PremiumUpgradeScreenProps) => {
  const [activeTab, setActiveTab] = useState<PlanTab>('premium');
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default to Gold (index 1)
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);
  const timer = useCountdown(6 * 3600 + 10 * 60 + 34); // 06h:10m:34s

  const plans = activeTab === 'premium' ? PREMIUM_PLANS : VIP_PLANS;

  // Scroll to Gold card on initial mount
  useEffect(() => {
    if (!hasInitialScrolled.current && carouselRef.current) {
      const cardWidth = 280;
      const gap = 20;
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollTarget = 1 * (cardWidth + gap) - (containerWidth - cardWidth) / 2;
      carouselRef.current.scrollLeft = Math.max(0, scrollTarget);
      hasInitialScrolled.current = true;
    }
  }, []);

  // Reset card index on tab change
  useEffect(() => {
    const defaultIndex = activeTab === 'premium' ? 1 : 0;
    setActiveCardIndex(defaultIndex);
    if (carouselRef.current) {
      const cardWidth = 280;
      const gap = 20;
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollTarget = defaultIndex * (cardWidth + gap) - (containerWidth - cardWidth) / 2;
      carouselRef.current.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, [activeTab]);

  // Scroll-snap detection to update active dot
  const handleScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = 280;
    const gap = 20;
    const paddingLeft = 40;
    const scrollLeft = container.scrollLeft;
    const index = Math.round((scrollLeft - paddingLeft + cardWidth / 2) / (cardWidth + gap));
    setActiveCardIndex(Math.max(0, Math.min(index, plans.length - 1)));
  }, [plans.length]);

  return (
    <div className="w-full h-full flex flex-col relative bg-background overflow-hidden">
      {/* ── Header ── */}
      <div
        className="flex-none flex items-center px-4 py-2"
        style={{
          height: 'calc(env(safe-area-inset-top, 0px) + 64px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {mode === 'tab' && onBack ? (
          <>
            <div className="flex items-center gap-0.5">
              <button
                onClick={onBack}
                className="-ml-2 w-11 h-11 p-0 flex items-center justify-center cursor-pointer"
                aria-label="Go back"
              >
                <div className="w-6 h-6 relative">
                  <GroupBackIcon />
                </div>
              </button>
              <p className="font-sans font-medium text-[20px] leading-[28px] text-foreground ml-1">
                Upgrade to Premium
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="font-sans font-medium text-[20px] leading-[28px] text-foreground">
              Upgrade to Premium
            </p>
            <button
              onClick={onSkip}
              className="flex items-center gap-0 pr-3 cursor-pointer"
            >
              <span className="font-sans text-[14px] leading-[20px] text-muted-foreground">Skip</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center gap-5 pb-4">
          {/* ── Tab Switcher ── */}
          <div className="flex items-center justify-center px-[10px] w-full">
            <div className="bg-neutral-100 h-10 rounded-full relative w-[320px] flex items-center p-1">
              {/* Animated slider */}
              <motion.div
                className="absolute h-8 rounded-full bg-card"
                style={{
                  width: 153,
                  top: 4,
                  boxShadow: '0px 8px 12px rgba(0,0,0,0.08), 0px 3px 14px rgba(0,0,0,0.06), 0px 5px 5px rgba(0,0,0,0.06)',
                  border: '1px solid #dfe0e3',
                }}
                animate={{ left: activeTab === 'premium' ? 4 : 163 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              <button
                className="relative z-10 flex-1 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => setActiveTab('premium')}
              >
                <span className="font-sans font-medium text-[14px] leading-[20px] text-foreground">
                  Premium
                </span>
              </button>
              <button
                className="relative z-10 flex-1 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => setActiveTab('vip')}
              >
                <span className="font-sans font-medium text-[14px] leading-[20px] text-foreground">
                  VIP
                </span>
              </button>
            </div>
          </div>

          {/* ── Money-Back Guarantee Banner ── */}
          <div className="flex items-center justify-center px-[18px] w-full">
            <img
              src={imgMoneyBackBanner}
              alt="Get 30-Day Money Back Guarantee"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* ── Plan Cards Carousel ── */}
          <div className="w-full">
            <div
              ref={carouselRef}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory py-3"
              style={{ touchAction: 'pan-x', scrollSnapType: 'x mandatory' }}
              onScroll={handleScroll}
            >
              <div className="flex gap-5 px-10">
                {plans.map((plan, i) => (
                  <div key={plan.id} className="snap-center shrink-0" style={{ scrollSnapAlign: 'center' }}>
                    <PlanCardComponent plan={plan} isActive={i === activeCardIndex} />
                  </div>
                ))}
                {/* Right padding spacer */}
                <div className="shrink-0 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* ── Carousel Dots ── */}
          <div className="flex items-center justify-center gap-2 pb-32">
            {plans.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeCardIndex ? 24 : 8,
                  height: 8,
                  backgroundColor: i === activeCardIndex ? '#41404d' : '#dfe0e3',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Sticky: Timer + CTA ── */}
      <div
        className="flex-none w-full bg-background"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
      >
        <div className="flex flex-col items-center gap-2 w-full px-[10px] pt-3">
          {/* Timer */}
          <div className="flex items-center justify-center gap-[3px]">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
              <mask id="timerMask" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16" style={{ maskType: 'alpha' }}>
                <rect fill="#D9D9D9" width="16" height="16" />
              </mask>
              <g mask="url(#timerMask)">
                <path d="M6.13 1.83V0.83H9.87V1.83H6.13ZM7.5 9.21H8.5V5.46H7.5V9.21ZM8 14.33C7.22 14.33 6.49 14.18 5.8 13.89C5.11 13.59 4.51 13.18 4 12.67C3.48 12.15 3.08 11.55 2.78 10.87C2.48 10.18 2.33 9.45 2.33 8.67C2.33 7.89 2.48 7.15 2.78 6.47C3.08 5.78 3.48 5.18 4 4.66C4.51 4.15 5.11 3.74 5.8 3.45C6.49 3.15 7.22 3 8 3C8.67 3 9.31 3.11 9.93 3.34C10.55 3.57 11.12 3.89 11.65 4.31L12.48 3.48L13.18 4.18L12.35 5.02C12.78 5.55 13.1 6.12 13.33 6.74C13.55 7.36 13.67 8 13.67 8.67C13.67 9.45 13.52 10.18 13.22 10.87C12.92 11.55 12.52 12.15 12 12.67C11.49 13.18 10.89 13.59 10.2 13.89C9.51 14.18 8.78 14.33 8 14.33ZM8 13.33C9.29 13.33 10.39 12.88 11.3 11.97C12.21 11.06 12.67 9.96 12.67 8.67C12.67 7.38 12.21 6.28 11.3 5.37C10.39 4.46 9.29 4 8 4C6.71 4 5.61 4.46 4.7 5.37C3.79 6.28 3.33 7.38 3.33 8.67C3.33 9.96 3.79 11.06 4.7 11.97C5.61 12.88 6.71 13.33 8 13.33Z" fill="#272631" />
              </g>
            </svg>
            <span className="font-sans text-[12px] leading-[16px] tracking-[0.2px] text-[#41404d]">
              Offer expires in:
            </span>
            <span className="font-sans font-semibold text-[12.6px] leading-[20px] text-[#41404d]">
              {timer.hours}h : {timer.minutes}m : {timer.seconds}s
            </span>
          </div>

          {/* Continue Button */}
          <Button
            variant="default"
            size="default"
            shape="pill"
            className="w-[280px]"
            onClick={onContinue}
          >
            Continue
          </Button>

          {/* Fine print */}
          <p className="font-sans text-[12px] leading-[16px] tracking-[0.2px] text-muted-foreground text-center">
            Auto-renews on expiry. Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};