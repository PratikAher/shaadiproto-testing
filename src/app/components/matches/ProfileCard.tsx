import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Pencil,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react';
import {
  CrownFilledIcon,
  PhotoFilledIcon,
  MoreFilledIcon,
  VerificationFilledIcon,
  MatchesFilledIcon,
  AstroFilledIcon,
  NavigationIcon,
  ChatFilledIcon,
} from '../icons';
import WhatsAppButton from '../../../imports/CircularButtons-8002-144';
import CallButton from '../../../imports/CircularButtons-8002-323';
import svgChatIconV2 from '../../../imports/svg-vpsohqxhfz';
import svgCtaIcons from '../../../imports/svg-61w1ckspo6';
import type { SolutionVariant } from './ConnectMessageSheet';

export interface Profile {
  id: string;
  displayId?: string;
  name: string;
  gender?: string;
  birthDate?: string;
  age: number;
  maritalStatus?: string;
  /** Partner filter: no | yes_living_together | yes_not_living_together */
  hasChildren?: string;
  profileManagedBy?: string;
  aboutMe?: string;
  photos?: { full: string; avatar: string };
  imageUrl?: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastActive?: string;
  badges?: string[];
  location?: { city: string; state: string; country: string };
  city?: string;
  state?: string;
  religion?: string;
  community: string;
  motherTongue?: string;
  diet?: string;
  horoscopeSign?: string;
  profession: string;
  companyName?: string;
  annualIncome?: string;
  highestQualification?: string;
  educationField?: string;
  collegeName?: string;
  manglik?: string;
  countryGrewUp?: string;
  professionArea?: string;
  incomeUsdK?: number;
  family?: {
    fatherProfession: string;
    motherProfession: string;
    siblings: { brothers: number; sisters: number };
    financialStatus: string;
    familyType: string;
    nativePlace: string;
    parentsContact: string;
  };
  contact?: { email: string; phone: string };
  astroMatchScore?: number;
  verified?: { id: boolean; selfie: boolean };
  isVerified?: boolean;
  heightCm?: number;
  height?: string;
  distanceKm?: number;
  distance?: string;
  createdAt?: string;
  updatedAt?: string;
  isPremium: boolean;
  isVip?: boolean;
  photoCount?: number;
  photoProtected?: boolean;
  hasMutuals?: boolean;
  hobbies?: string[];
  hasAstroDetails?: boolean;
  familyCountry?: string;
  familyState?: string;
  familyCity?: string;
}

interface ProfileCardProps {
  profile: Profile;
  onConnect?: (profile: Profile) => void;
  isConnected?: boolean;
  solutionVariant?: SolutionVariant;
  savedMessage?: string;
  onEditMessage?: (profile: Profile) => void;
  isFirstConnect?: boolean;
  onViewProfile?: (profile: Profile) => void;
  isCurrentUserPremium?: boolean;
  isCurrentUserVip?: boolean;
  useGreenGradient?: boolean;
}

const formatHeight = (cm?: number, str?: string) => {
  if (str) return str;
  if (!cm) return "5' 5\"";
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}' ${remainingInches}"`;
};

// ══════════════════════════════════════════════════════
// PROFILE CARD
// ═══════════════════════════════════════════════════════

export const ProfileCard = ({
  profile,
  onConnect,
  isConnected,
  solutionVariant = '1.2b',
  savedMessage,
  onEditMessage,
  isFirstConnect = true,
  onViewProfile,
  isCurrentUserPremium = false,
  useGreenGradient = false,
}: ProfileCardProps) => {
  const fullImage = profile.photos?.full ?? profile.imageUrl;
  const city = profile.location?.city ?? profile.city;
  const state = profile.location?.state ?? profile.state;
  const distanceLabel = profile.distanceKm
    ? `Within ${profile.distanceKm} km`
    : profile.distance ?? 'Nearby';
  const heightLabel = formatHeight(profile.heightCm, profile.height);
  const isVerified = profile.verified?.id ?? profile.isVerified ?? false;
  const photoCount = profile.photoCount ?? 4;
  const firstName = profile.name.split(' ')[0];

  // ═══ Variant logic ═══
  const isS3 = solutionVariant === '3';
  const isS12 = solutionVariant.startsWith('1.2');
  const hasNote = !isFirstConnect && !!savedMessage;
  const showNoteAwareness = isS3 && hasNote && !isConnected;
  const hideMetadata = isS12 && !!isConnected;

  // Truncated previews
  const noteBubblePreview = savedMessage
    ? savedMessage.length > 55 ? savedMessage.substring(0, 55) + '...' : savedMessage
    : '';
  const notePreview = savedMessage ?? '';

  // ═══ S1.2: Edit countdown (5-second window) ═══
  const [editCountdown, setEditCountdown] = useState(0);
  const prevConnectedRef = useRef(isConnected);

  useEffect(() => {
    if (isConnected && !prevConnectedRef.current && isS12 && hasNote) {
      setEditCountdown(5);
      const interval = setInterval(() => {
        setEditCountdown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    prevConnectedRef.current = isConnected;
  }, [isConnected]);

  const isPendingEdit = editCountdown > 0;
  const showSentMessage = isS12 && !!isConnected && hasNote;

  // ═══ Heights ═══
  const preConnectHeight = showNoteAwareness ? 98 : 60;
  const postConnectHeight = 126;

  // ═══════════════════════════════════════════════════════
  // S3: PRE-CONNECT RENDERERS
  // ═══════════════════════════════════════════════════════

  // Exact Figma gradients
  const greenPrimaryGradient = 'linear-gradient(-6.59deg, #0AA4B8 13%, #09BF6C 86%)';
  const greenPrimaryShadow = '0px 2px 16px 0px rgba(10,164,184,0.25)';
  const pinkPrimaryGradientVal = 'linear-gradient(179.692deg, rgb(229,58,65) 1.7722%, rgb(215,6,102) 98.228%)';
  const pinkPrimaryShadowVal = '0px 2px 16px 0px rgba(0,0,0,0.12)';
  const pinkPrimaryGradient = useGreenGradient ? greenPrimaryGradient : pinkPrimaryGradientVal;
  const pinkPrimaryShadow = useGreenGradient ? greenPrimaryShadow : pinkPrimaryShadowVal;
  const vipPrimaryGradient = 'linear-gradient(180deg, rgb(118,76,165) 0%, rgb(73,43,108) 100%)';
  const vipPrimaryShadow = '0px 2px 16px 0px rgba(0,0,0,0.12)';

  // Card secondary — unified dark background for ALL secondary elements (slightly darker than FPV island)
  const cardSecondaryStyle: React.CSSProperties = {
    backgroundColor: '#292c30',
    boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
    color: 'white',
  };

  // Derived profile tier flag
  const isProfileVip = !!profile.isVip;

  // Filled phone icon — same size & fill for both Consultant and View Contact
  const FilledPhoneSvg = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );

  // Tick icon — exact Figma SVG
  const TickSvg = ({ vip = false }: { vip?: boolean }) => (
    <svg
      width="15" height="11.8"
      viewBox="0 0 13.7334 10.6606"
      fill="none"
      className="shrink-0"
      style={vip
        ? { filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))', paddingBottom: '1px' }
        : { paddingBottom: '1px' }}
    >
      <path d={svgCtaIcons.p3d2cf500} fill="white" stroke={vip ? undefined : 'white'} strokeWidth={vip ? undefined : '0.4'} />
    </svg>
  );

  // Standard row: no saved note — no divider, no centering, flush to bottom
  const renderStandardConnectRow = () => (
    <div className="px-3 pb-2">
      <div className="flex items-center gap-[8px]">
        {isProfileVip ? (
          /* ── VIP profile: Consultant (filled phone icon) + purple Connect Now ── */
          <>
            <button
              className="flex-1 h-[48px] rounded-[52px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
              style={cardSecondaryStyle}
            >
              <FilledPhoneSvg />
              <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>Consultant</span>
            </button>
            <button
              className="flex-1 h-[48px] rounded-[52px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
              style={{ backgroundImage: vipPrimaryGradient, boxShadow: vipPrimaryShadow }}
              onClick={() => onConnect?.(profile)}
            >
              <TickSvg vip />
              <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', paddingBottom: '1px' }}>Connect Now</span>
            </button>
          </>
        ) : isCurrentUserPremium ? (
          /* ── Premium user (non-VIP): View Contact (filled phone icon) + pink Connect Now ── */
          <>
            <button
              className="flex-1 h-[48px] rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
              style={cardSecondaryStyle}
            >
              <FilledPhoneSvg />
              <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>View Contact</span>
            </button>
            <button
              className="flex-1 h-[48px] rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
              style={{ backgroundImage: pinkPrimaryGradient, boxShadow: pinkPrimaryShadow }}
              onClick={() => onConnect?.(profile)}
            >
              <TickSvg />
              <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', paddingBottom: '1px' }}>Connect Now</span>
            </button>
          </>
        ) : (
          /* ── Free user + non-VIP: single pink Connect Now ── */
          <button
            className="w-full h-[48px] rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={{ backgroundImage: pinkPrimaryGradient, boxShadow: pinkPrimaryShadow }}
            onClick={() => onConnect?.(profile)}
          >
            <TickSvg />
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', paddingBottom: '1px' }}>Connect Now</span>
          </button>
        )}
      </div>
    </div>
  );

  // ── S3: Full-width "Connect With Message" button + message preview below
  const renderS3PreConnect = () => (
    <div className="flex flex-col px-3 gap-[8px] pb-[4px]">
      {isProfileVip ? (
        /* ── VIP: Consultant (filled phone icon) + purple Connect Now ── */
        <div className="flex items-center gap-[8px]">
          <button
            className="flex-1 h-[48px] rounded-[52px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={cardSecondaryStyle}
          >
            <FilledPhoneSvg />
            <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>Consultant</span>
          </button>
          <button
            onClick={() => onConnect?.(profile)}
            className="flex-1 h-[48px] rounded-[52px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={{ backgroundImage: vipPrimaryGradient, boxShadow: vipPrimaryShadow }}
          >
            <TickSvg vip />
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', paddingBottom: '1px' }}>Connect Now</span>
          </button>
        </div>
      ) : isCurrentUserPremium ? (
        /* ── Premium user: View Contact (filled phone icon) + pink Connect Now ── */
        <div className="flex items-center gap-[8px]">
          <button
            className="flex-1 h-[48px] rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={cardSecondaryStyle}
          >
            <FilledPhoneSvg />
            <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>View Contact</span>
          </button>
          <button
            onClick={() => onConnect?.(profile)}
            className="flex-1 h-[48px] rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={{ backgroundImage: pinkPrimaryGradient, boxShadow: pinkPrimaryShadow }}
          >
            <TickSvg />
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', paddingBottom: '1px' }}>Connect Now</span>
          </button>
        </div>
      ) : (
        /* ── Free user + non-VIP: single pink Connect Now ── */
        <button
          onClick={() => onConnect?.(profile)}
          className="w-full h-[48px] rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.98]"
          style={{ backgroundImage: pinkPrimaryGradient, boxShadow: pinkPrimaryShadow }}
        >
          <TickSvg />
          <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', paddingBottom: '1px' }}>Connect Now</span>
        </button>
      )}

      {/* Note preview tile */}
      <button
        type="button"
        onClick={() => onEditMessage?.(profile)}
        className="h-[30px] w-full flex items-center active:opacity-70 transition-opacity overflow-hidden"
        style={{ backgroundColor: '#292c30', borderRadius: '30px', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
      >
        <div className="flex gap-[8px] items-center pl-[9px] pr-[11px] py-[5px] w-full">
          <div className="flex flex-1 gap-[6px] items-center min-w-0">
            <svg width="12" height="12" viewBox="0 0 12.0359 11.9501" fill="none" className="shrink-0">
              <path d={svgChatIconV2.p24798f00} stroke="#B1B3B9" strokeLinejoin="round" strokeWidth="0.878658" />
            </svg>
            <span
              className="flex-1 min-w-0 truncate"
              style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#cdced1', letterSpacing: '0.2px' }}
            >
              {notePreview}
            </span>
          </div>
          <span
            className="shrink-0"
            style={{ fontSize: '12px', fontWeight: 700, lineHeight: '16px', color: 'white', letterSpacing: '0.2px' }}
          >
            Edit
          </span>
        </div>
      </button>
    </div>
  );

  const renderPreConnect = () => {
    if (showNoteAwareness) return renderS3PreConnect();
    return renderStandardConnectRow();
  };

  // ═══════════════════════════════════════════════════════
  // S1.2: SENT MESSAGE CONFIRMATION (Chat-bubble card)
  // Rendered between name and CTA border in dark zone.
  // Post-connect CTAs are NEVER modified.
  // Metadata hides when connected.
  // After timer: Edit → plain tick (no green).
  // ═══════════════════════════════════════════════════════

  const renderSentMessage = () => {
    if (!showSentMessage) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        style={{ marginTop: '-4px', marginBottom: '4px' }}
      >
        <button
          type="button"
          onClick={() => isPendingEdit && onEditMessage?.(profile)}
          className="w-full text-left active:opacity-70 transition-opacity px-3.5 py-2.5"
          style={{
            backgroundColor: 'rgba(255,255,255,0.10)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: '14px 14px 0px 14px',
            cursor: isPendingEdit ? 'pointer' : 'default',
          }}
        >
          <div className="flex items-center gap-2.5">
            <p className="flex-1 min-w-0 truncate" style={{ fontSize: '12px', lineHeight: '16px', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.2px' }}>
              {noteBubblePreview}
            </p>
            <AnimatePresence mode="wait">
              {isPendingEdit ? (
                <motion.span
                  key="edit"
                  className="flex items-center gap-1 shrink-0"
                  style={{ color: 'rgba(255,255,255,0.95)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <Pencil className="w-[10px] h-[10px]" />
                  <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}>Edit {editCountdown}s</span>
                </motion.span>
              ) : (
                <motion.div
                  key="tick"
                  className="shrink-0"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // POST-CONNECT CTA AREA (NEVER modified by any S1.2)
  // ═══════════════════════════════════════════════════════

  const renderPostConnectCTAs = () => (
    <div className="px-1 pt-3 pb-3 flex flex-col items-center gap-2.5 relative" style={{ backgroundColor: 'var(--color-post-connect-cta-bg)' }}>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 400 }}>
          To Contact her directly,
        </span>
        <button className="flex items-center gap-0.5 text-[#0AA4B8]" style={{ fontSize: '12px', fontWeight: 600 }}>
          Upgrade Now
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center justify-evenly w-full">
        <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#0AA4B8',
              boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.08), 0px 1px 11px 0px rgba(0,0,0,0.06), 0px 2px 5px 0px rgba(0,0,0,0.06)',
            }}
          >
            <ChatFilledIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-foreground" style={{ fontSize: '11px', fontWeight: 300 }}>Shaadi Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
          <div className="w-[52px] h-[52px] relative overflow-visible">
            <WhatsAppButton />
          </div>
          <span className="text-foreground" style={{ fontSize: '11px', fontWeight: 300 }}>WhatsApp</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
          <div className="w-[52px] h-[52px] relative overflow-visible">
            <CallButton />
          </div>
          <span className="text-foreground" style={{ fontSize: '11px', fontWeight: 300 }}>Call</span>
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════

  return (
    <div className="w-full h-full relative snap-start shrink-0">
      <div
        className="w-full h-full rounded-3xl p-[1.5px]"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(0,0,0,0.12))' }}
      >
        <div className="w-full h-full relative rounded-[22.5px] bg-muted/20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 cursor-pointer"
            onClick={() => onViewProfile?.(profile)}
          >
            {fullImage ? (
              <img src={fullImage} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/90 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
            {profile.isVip ? (
              /* VIP badge — purple pill, no shadow, same h-8 as photo pill */
              <div
                className="h-8 px-3 rounded-full flex items-center justify-center gap-1.5 text-white"
                style={{ backgroundColor: '#5b318b' }}
              >
                <CrownFilledIcon className="w-3.5 h-3.5" />
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.2px' }}>VIP</span>
              </div>
            ) : profile.isPremium ? (
              /* Regular premium badge — red circle */
              <button className="w-[30px] h-[30px] rounded-full bg-[#FF5A60] flex items-center justify-center text-white shadow-lg">
                <CrownFilledIcon className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <div className="h-8 px-3 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center gap-1.5 text-white border border-white/10">
              <PhotoFilledIcon className="w-4 h-4" />
              <span className="text-sm font-medium leading-none">{photoCount}</span>
            </div>
            <button className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
              <MoreFilledIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pt-12 pb-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white flex flex-col gap-1.5">

            {/* VIP Consultant tag — flush left edge, Figma NearMe style */}
            {profile.isVip && (
              <div
                className="self-start rounded-tr-[11px] rounded-br-[11px] -ml-3 mb-0.5"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  paddingLeft: '12px',
                  paddingRight: '10px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                }}
              >
                <p
                  style={{
                    fontStyle: 'italic',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                    color: '#c8ae76',
                    letterSpacing: '0.2px',
                  }}
                >
                  Profile Managed by VIP Consultant
                </p>
              </div>
            )}

            {/* Name & Age — always visible */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium tracking-tight">
                {profile.name}, {profile.age}
              </h2>
              {isVerified && <VerificationFilledIcon className="w-5 h-5 text-blue-500" />}
            </div>

            {/* Metadata wrapper — hides for S1.2 post-connect */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: hideMetadata ? '0fr' : '1fr',
                transition: 'grid-template-rows 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  opacity: hideMetadata ? 0 : 1,
                  transition: 'opacity 0.25s ease',
                }}
              >
                <div className="flex flex-col gap-1.5">
                  {/* Demographics */}
                  <div className="flex items-center gap-2 text-sm text-white font-normal truncate">
                    <span>{heightLabel}</span>
                    <span className="w-[1px] h-3 bg-white/24 rounded-full" />
                    <span>{profile.community}</span>
                    <span className="w-[1px] h-3 bg-white/24 rounded-full" />
                    <span className="truncate">{profile.profession}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-white">
                    <span>{city}, {state}</span>
                    <span className="w-[1px] h-3 bg-white/24 rounded-full" />
                    <div className="flex items-center gap-1">
                      <NavigationIcon className="w-3 h-3" />
                      <span>{distanceLabel}</span>
                    </div>
                  </div>

                  {/* Chips Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    {profile.isOnline && (
                      <div className="h-6 flex items-center gap-0.5 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span>Online</span>
                      </div>
                    )}
                    <div className="h-6 flex items-center gap-0.5 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal text-white">
                      <MatchesFilledIcon className="w-3 h-3 text-[#FF5A60]" />
                      <span>You & Her</span>
                    </div>
                    <div className="h-6 flex items-center gap-0.5 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal text-white">
                      <AstroFilledIcon className="w-3 h-3 text-amber-400" />
                      <span>Astro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* S1.2: Sent message (appears after metadata hides) */}
            {renderSentMessage()}

            {/* CTA Container (height-animated) */}
            <motion.div
              initial={false}
              animate={{ height: isConnected ? postConnectHeight : preConnectHeight }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="-mx-3 overflow-hidden relative"
            >
              {/* PRE-CONNECT */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isConnected ? 0 : 1,
                  y: isConnected ? -8 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute inset-0"
                style={{ pointerEvents: isConnected ? 'none' : 'auto' }}
              >
                {renderPreConnect()}
              </motion.div>

              {/* POST-CONNECT CTAs (NEVER modified) */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isConnected ? 1 : 0,
                  y: isConnected ? 0 : 20,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: isConnected ? 0.1 : 0,
                }}
                className="absolute inset-x-0 top-0"
                style={{ pointerEvents: isConnected ? 'auto' : 'none' }}
              >
                {renderPostConnectCTAs()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};