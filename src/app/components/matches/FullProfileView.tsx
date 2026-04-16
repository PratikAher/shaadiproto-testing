import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Briefcase,
  Users,
  User,
  Phone,
  Mail,
  Lock,
  Check,
  X,
  Calendar,
  MapPin,
  BookOpen,
  Utensils,
  GraduationCap,
  Building2,
  Wallet,
  FileText,
  Landmark,
  Home,
} from 'lucide-react';
import {
  BackArrowIcon,
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
import svgCtaIcons from '../../../imports/svg-61w1ckspo6';
import svgYouHer from '../../../imports/svg-2y2dfmlocp';
import imgYouHerBg from 'figma:asset/5fcec58dae017f1de16b2430c56cf91ecf87e8b7.png';
import imgCurrentUserAvatar from '../../../assets/pratik_avatar.png';
import svgVipCtaIcons from '../../../imports/svg-xjl3xw16o6';
import type { Profile } from './ProfileCard';
import type { SolutionVariant } from './ConnectMessageSheet';
import { CURRENT_USER } from '../../../data/currentUser';

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

const formatHeight = (cm?: number) => {
  if (!cm) return "5' 5\"";
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}' ${remainingInches}"`;
};

const maskPhone = (phone?: string) => {
  if (!phone) return '98XXXXXXXX';
  return phone.substring(0, 4) + 'XXXXXX';
};

const maskEmail = (email?: string) => {
  if (!email) return '****@example.com';
  const [local, domain] = email.split('@');
  return local.substring(0, 3) + '****@' + domain;
};

const formatBirthDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ═══════════════════════════════════════════════════════
// PARTNER PREFERENCE GENERATION (Deterministic per profile)
// ═══════════════════════════════════════════════════════

interface PartnerPref {
  label: string;
  herPref: string;
  matched: boolean;
}

function generatePreferenceMatch(profile: Profile): { prefs: PartnerPref[]; matchCount: number; totalCount: number } {
  const me = CURRENT_USER;
  const id = parseInt(profile.id.replace('u_', ''), 10);
  const seed = id % 10;

  const prefs: PartnerPref[] = [];

  // 1. Age range
  const ageMin = seed < 4 ? 24 : seed < 7 ? 25 : 27;
  const ageMax = seed < 3 ? 30 : seed < 6 ? 32 : 34;
  const ageMatch = me.age >= ageMin && me.age <= ageMax;
  prefs.push({ label: 'Age', herPref: `${ageMin} - ${ageMax} yrs`, matched: ageMatch });

  // 2. Height range
  const hMin = seed < 3 ? 165 : seed < 6 ? 168 : 172;
  const hMax = 188;
  const heightMatch = (me.heightCm || 170) >= hMin && (me.heightCm || 170) <= hMax;
  prefs.push({ label: 'Height', herPref: `${formatHeight(hMin)} - ${formatHeight(hMax)}`, matched: heightMatch });

  // 3. Religion
  const religionMatch = me.religion === profile.religion;
  prefs.push({ label: 'Religion', herPref: profile.religion || 'Hindu', matched: religionMatch });

  // 4. Mother Tongue
  const mtPrefs = seed < 4 ? [profile.motherTongue || 'Marathi'] : ['Marathi', 'Hindi', 'Gujarati'];
  const mtMatch = mtPrefs.includes(me.motherTongue || '');
  prefs.push({ label: 'Mother Tongue', herPref: mtPrefs.join(', '), matched: mtMatch });

  // 5. Education
  const eduPrefs = seed < 5
    ? ['B.E / B.Tech', 'MBA', 'MS', 'CA', 'MBBS']
    : ['Graduate', 'B.E / B.Tech', 'MBA', 'MS', 'CA', 'MBBS', 'B.Des', 'BE'];
  const eduMatch = eduPrefs.some(e => (me.highestQualification || '').includes(e) || e.includes(me.highestQualification || ''));
  prefs.push({ label: 'Education', herPref: eduPrefs.slice(0, 3).join(', ') + (eduPrefs.length > 3 ? '...' : ''), matched: eduMatch });

  // 6. Annual Income
  const incMin = seed < 3 ? 10 : seed < 6 ? 12 : 15;
  const incMax = seed < 3 ? 25 : seed < 6 ? 30 : 40;
  // Pratik: 10-15 Lakh → midpoint ~12.5
  const incomeMatch = 12.5 >= incMin && 12.5 <= incMax;
  prefs.push({ label: 'Annual Income', herPref: `INR ${incMin} - ${incMax} Lakhs`, matched: incomeMatch });

  // 7. Location
  const locPrefs = seed < 5 ? ['Maharashtra'] : ['Maharashtra', 'Gujarat', 'Karnataka'];
  const locMatch = locPrefs.includes('Maharashtra'); // Pratik is in MH
  prefs.push({ label: 'Location', herPref: locPrefs.join(', '), matched: locMatch });

  // 8. Diet
  const dietStrict = seed % 3 === 0;
  const dietMatch = dietStrict ? false : true; // Pratik is Occasionally Non-Veg; strict veg profiles won't match
  prefs.push({
    label: 'Diet',
    herPref: dietStrict ? 'Vegetarian' : 'Doesn\'t Matter',
    matched: dietMatch,
  });

  // 9. Marital Status
  prefs.push({ label: 'Marital Status', herPref: 'Never Married', matched: me.maritalStatus === 'Never Married' });

  const matchCount = prefs.filter(p => p.matched).length;
  return { prefs, matchCount, totalCount: prefs.length };
}

function getCommonalities(profile: Profile): string[] {
  const me = CURRENT_USER;
  const commons: string[] = [];

  if (me.religion === profile.religion) {
    commons.push(`Both are ${me.religion}`);
  }
  if (me.motherTongue === profile.motherTongue) {
    commons.push(`Both speak ${me.motherTongue}`);
  }
  const myState = me.location?.state || 'MH';
  const herState = profile.location?.state || '';
  if (myState === herState) {
    const myCity = me.location?.city || 'Mumbai';
    const herCity = profile.location?.city || '';
    if (myCity === herCity) {
      commons.push(`Both live in ${myCity}`);
    } else {
      commons.push('Both from Maharashtra');
    }
  }
  if (me.maritalStatus === profile.maritalStatus) {
    commons.push('Both Never Married');
  }
  // Diet similarity
  const myDiet = me.diet || '';
  const herDiet = profile.diet || '';
  if (myDiet.includes('Non-Veg') && herDiet.includes('Non-Veg')) {
    commons.push('Both enjoy Non-Vegetarian food');
  } else if (myDiet.includes('Vegetarian') && herDiet.includes('Vegetarian') && !myDiet.includes('Non') && !herDiet.includes('Non')) {
    commons.push('Both are Vegetarian');
  }

  return commons;
}

// ═══════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════

const SectionHeader = ({ title, icon: Icon }: { title: string; icon?: any }) => (
  <div className="flex items-center gap-2 mb-2">
    {Icon && <Icon style={{ width: 16, height: 16, color: 'var(--color-brand-500)' }} />}
    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>{title}</h3>
  </div>
);

// ═══════════════════════════════════════════════════════
// HOBBIES DATA + GENERATOR
// ═════════════════════════════════════════════════════

const ALL_HOBBIES = [
  { emoji: '✍️', label: 'Writing' },
  { emoji: '🎨', label: 'Painting' },
  { emoji: '📸', label: 'Photography' },
  { emoji: '🎤', label: 'Singing' },
  { emoji: '🎸', label: 'Playing instruments' },
  { emoji: '💃', label: 'Dancing' },
  { emoji: '🎭', label: 'Acting' },
  { emoji: '📝', label: 'Poetry' },
  { emoji: '✂️', label: 'Designing' },
  { emoji: '🌱', label: 'Gardening' },
  { emoji: '📚', label: 'Reading' },
  { emoji: '🍳', label: 'Cooking' },
  { emoji: '✈️', label: 'Travelling' },
  { emoji: '🏋️', label: 'Fitness' },
  { emoji: '🧘', label: 'Yoga' },
  { emoji: '🏊', label: 'Swimming' },
  { emoji: '🚴', label: 'Cycling' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '🏔️', label: 'Trekking' },
  { emoji: '🍕', label: 'Food Exploration' },
  { emoji: '🎬', label: 'Films & Web Series' },
  { emoji: '🖊️', label: 'Blogging' },
  { emoji: '🐾', label: 'Pets' },
];

function getProfileHobbies(profile: Profile): { emoji: string; label: string }[] {
  const seed = parseInt((profile.id || 'u_0').replace(/\D/g, '') || '0', 10);
  const count = 7 + (seed % 5); // 7–11 hobbies
  const shuffled = [...ALL_HOBBIES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * (i + 3) * 7919) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// ═══════════════════════════════════════════════════════
// DETAIL ROW — inline label/value (Family)
// ═══════════════════════════════════════════════════════

const DetailRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-2" style={{}}>
      <span className="shrink-0" style={{ fontSize: '13px', fontWeight: 400, color: '#888890', minWidth: 110 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: '#41404D' }}>{value}</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// BASIC DETAIL ROW — icon circle + stacked label / value
// ═══════════════════════════════════════════════════════

const BasicDetailRow = ({
  icon: Icon,
  label,
  value,
  iconBg = '#F3F4F6',
  iconColor = '#888890',
}: {
  icon: any;
  label: string;
  value?: string;
  iconBg?: string;
  iconColor?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3" style={{ paddingTop: 10, paddingBottom: 10 }}>
      <div className="rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ width: 40, height: 40, backgroundColor: iconBg }}>
        <Icon style={{ width: 18, height: 18, color: iconColor }} />
      </div>
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span style={{ fontSize: '11px', color: '#888890', fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#41404D', fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// INFO CARD wrapper
// ═══════════════════════════════════════════════════════

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-3 mb-3 bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0px 1px 12px rgba(0,0,0,0.07)' }}>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════
// OUTLINE CHIP
// ═══════════════════════════════════════════════════════

const OutlineChip = ({ label }: { label: string }) => (
  <div className="rounded-full shrink-0" style={{ border: '1px solid #DDDEE0', paddingLeft: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5 }}>
    <span style={{ fontSize: '12px', color: '#51505D', fontWeight: 400 }}>{label}</span>
  </div>
);

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

interface FullProfileViewProps {
  profiles: Profile[];
  currentIndex: number;
  onBack: () => void;
  onNavigate: (index: number) => void;
  onConnect: (profile: Profile) => void;
  isConnected: boolean;
  solutionVariant: SolutionVariant;
  savedMessage: string;
  savedMessageFirstName: string;
  isFirstConnect: boolean;
  onEditMessage: (profile: Profile) => void;
  isCurrentUserPremium?: boolean;
  isCurrentUserVip?: boolean;
  viewedContactIds?: Set<string>;
  onViewContact?: (profileId: string) => void;
  useGreenGradient?: boolean;
}

export const FullProfileView = ({
  profiles,
  currentIndex,
  onBack,
  onNavigate,
  onConnect,
  isConnected,
  solutionVariant,
  savedMessage,
  savedMessageFirstName,
  isFirstConnect,
  onEditMessage,
  isCurrentUserPremium = false,
  isCurrentUserVip = false,
  viewedContactIds = new Set(),
  onViewContact,
  useGreenGradient = false,
}: FullProfileViewProps) => {
  const profile = profiles[currentIndex];
  const connectGradient = useGreenGradient
    ? 'linear-gradient(-6.59deg, #0AA4B8 13%, #09BF6C 86%)'
    : 'linear-gradient(179.692deg, rgb(229,58,65) 1.7722%, rgb(215,6,102) 98.228%)';
  const connectShadow = useGreenGradient
    ? '0px 2px 16px 0px rgba(10,164,184,0.25)'
    : '0px 2px 16px 0px rgba(0,0,0,0.12)';
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [hobbiesExpanded, setHobbiesExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const showStickyNav = scrollY > 24;
  const showNameInNav = scrollY > 360;

  if (!profile) return null;

  const fullImage = profile.photos?.full ?? profile.imageUrl;
  const city = profile.location?.city ?? profile.city;
  const state = profile.location?.state ?? profile.state;
  const distanceLabel = profile.distanceKm
    ? `Within ${profile.distanceKm} km`
    : profile.distance ?? 'Nearby';
  const heightLabel = formatHeight(profile.heightCm);
  const isVerified = profile.verified?.id ?? profile.isVerified ?? false;
  const photoCount = profile.photoCount ?? 4;
  const firstName = profile.name.split(' ')[0];

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < profiles.length - 1;

  // Connect message logic
  const isS3 = solutionVariant === '3';
  const hasNote = !isFirstConnect && !!savedMessage;
  const showNoteAwareness = isS3 && hasNote && !isConnected;

  // Replace name in message for this profile
  const profileFirstName = profile.name.split(' ')[0];

  // "You & Her" matching
  const { prefs, matchCount, totalCount } = generatePreferenceMatch(profile);
  const commonalities = getCommonalities(profile);

  // Contact reveal state
  const hasViewedContact = viewedContactIds.has(profile.id);

  // About text
  const aboutText = profile.aboutMe || '';
  const aboutIsLong = aboutText.length > 150;

  // Siblings text
  const siblingsText = (() => {
    const siblings = profile.family?.siblings;
    if (!siblings) return null;
    const parts: string[] = [];
    if (siblings.brothers > 0) parts.push(`${siblings.brothers} Brother${siblings.brothers > 1 ? 's' : ''}`);
    if (siblings.sisters > 0) parts.push(`${siblings.sisters} Sister${siblings.sisters > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'No Siblings';
  })();

  // Hobbies
  const hobbies = getProfileHobbies(profile);
  const HOBBIES_PREVIEW = 6;
  const visibleHobbies = hobbiesExpanded ? hobbies : hobbies.slice(0, HOBBIES_PREVIEW);

  // ═══════════════════════════════════════════════════════
  // STICKY CTA — Island (pre-connect) / Panel (post-connect)
  // ═══════════════════════════════════════════════════════

  const isProfileVip = !!profile.isVip;
  const pillBg = '#2d3135';

  const renderPreConnectIsland = () => (
    <div
      className="backdrop-blur-[4px] p-[8px] flex flex-col gap-[8px]"
      style={{
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderRadius: showNoteAwareness && savedMessage ? '24px' : '9999px',
      }}
    >
      {/* ── BUTTON ROW ── */}
      {isProfileVip ? (
        /* VIP: Call Consultant + (Heart if premium) + Connect (purple) */
        <div className="flex gap-[8px] h-[48px]">
          <button
            className="flex-1 min-w-0 h-full flex items-center justify-center transition-transform active:scale-[0.97]"
            style={{ backgroundColor: '#2d3135', borderRadius: '52px', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
          >
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white' }}>Call Consultant</span>
          </button>
          {isCurrentUserPremium && (
            <button
              className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
              style={{ backgroundColor: '#2d3135', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
            >
              <svg width="20" height="17" viewBox="0 0 19.7083 16.9584" fill="none">
                <path d={svgVipCtaIcons.p1622f880} fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.375" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onConnect(profile)}
            className="flex-1 min-w-0 h-full flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={{ backgroundImage: 'linear-gradient(180deg, rgb(118,76,165) 0%, rgb(73,43,108) 100%)', borderRadius: '52px', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
          >
            <svg width="15" height="11.8" viewBox="0 0 13.7334 10.6606" fill="none" className="shrink-0" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))', paddingBottom: '1px' }}>
              <path d={svgCtaIcons.p3d2cf500} fill="white" />
            </svg>
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white', textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}>Connect</span>
          </button>
        </div>

      ) : isCurrentUserPremium ? (
        /* Component 28 — Premium: View Contact + Heart + Connect (pink) */
        <div className="flex gap-[8px] h-[48px]">
          <button
            onClick={() => onViewContact?.(profile.id)}
            className="flex-1 min-w-0 h-full rounded-[9999px] flex items-center justify-center transition-transform active:scale-[0.97]"
            style={{ backgroundColor: '#2d3135', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
          >
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white' }}>View Contact</span>
          </button>
          <button
            className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
            style={{ backgroundColor: '#2d3135', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
          >
            <svg width="20" height="17" viewBox="0 0 19.7083 16.9584" fill="none">
              <path d={svgCtaIcons.p1622f880} fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.375" />
            </svg>
          </button>
          <button
            onClick={() => onConnect(profile)}
            className="flex-1 min-w-0 h-full rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.97]"
            style={{ backgroundImage: connectGradient, boxShadow: connectShadow }}
          >
            <svg width="15" height="11.8" viewBox="0 0 13.7334 10.6606" fill="none" className="shrink-0" style={{ paddingBottom: '1px' }}>
              <path d={svgCtaIcons.p3d2cf500} fill="white" stroke="white" strokeWidth="0.4" />
            </svg>
            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white' }}>Connect</span>
          </button>
        </div>

      ) : (
        /* Component 27 — Free: single full-width Connect Now (pink) */
        <button
          onClick={() => onConnect(profile)}
          className="h-[48px] w-full rounded-[9999px] flex items-center justify-center gap-[6px] transition-transform active:scale-[0.98]"
          style={{ backgroundImage: connectGradient, boxShadow: connectShadow }}
        >
          <svg width="14" height="11" viewBox="0 0 13.7334 10.6606" fill="none" className="shrink-0" style={{ paddingBottom: '1px' }}>
            <path d={svgCtaIcons.p3d2cf500} fill="white" stroke="white" strokeWidth="0.4" />
          </svg>
          <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: '20px', color: 'white' }}>Connect Now</span>
        </button>
      )}

      {/* ── MESSAGE PREVIEW (S3 mode) ── */}
      {showNoteAwareness && savedMessage && (
        <button
          type="button"
          onClick={() => onEditMessage(profile)}
          className="h-[30px] w-full flex items-center active:opacity-70 transition-opacity overflow-hidden"
          style={{ backgroundColor: pillBg, borderRadius: '30px', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)' }}
        >
          <div className="flex gap-[8px] items-center pl-[9px] pr-[11px] py-[5px] w-full">
            <div className="flex flex-1 gap-[6px] items-center min-w-0">
              <svg width="12" height="12" viewBox="0 0 11.9972 11.9909" fill="none" className="shrink-0">
                <path d={svgCtaIcons.p2c878d80} stroke="#B1B3B9" strokeLinejoin="round" strokeWidth="0.878739" />
              </svg>
              <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#cdced1', letterSpacing: '0.2px' }} className="truncate">
                {savedMessage}
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, lineHeight: '16px', color: 'white', letterSpacing: '0.2px' }} className="shrink-0">Edit</span>
          </div>
        </button>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className="relative w-full h-full bg-background flex flex-col">

      {/* ── STICKY TOP NAV BAR ── */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.div
            key="sticky-nav"
            initial={{ opacity: 0, y: -44 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -44 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center px-3 bg-background/92 backdrop-blur-md"
            style={{
              height: 'calc(env(safe-area-inset-top, 0px) + 48px)',
              paddingTop: 'env(safe-area-inset-top, 0px)',
              boxShadow: '0px 1px 10px rgba(0,0,0,0.10)',
            }}
          >
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              style={{ backgroundColor: 'var(--color-muted)' }}
            >
              <BackArrowIcon className="w-5 h-5 text-foreground" />
            </button>

            <AnimatePresence>
              {showNameInNav && (
                <motion.div
                  key="nav-name"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="ml-3 flex items-center gap-1.5 min-w-0"
                >
                  <span className="text-foreground truncate" style={{ fontSize: '16px', fontWeight: 600 }}>
                    {profile.name}, {profile.age}
                  </span>
                  {isVerified && <VerificationFilledIcon className="w-4 h-4 text-blue-500 shrink-0" />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STICKY PREV / NEXT ARROWS (outside scroll, always visible) ── */}
      {canGoPrev && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-0 z-40 flex items-center justify-center active:scale-90 transition-transform"
          style={{
            top: '38%',
            transform: 'translateY(-50%)',
            width: 30,
            height: 56,
            borderRadius: '0 12px 12px 0',
            backgroundColor: 'rgba(20,20,20,0.72)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}
      {canGoNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-0 z-40 flex items-center justify-center active:scale-90 transition-transform"
          style={{
            top: '38%',
            transform: 'translateY(-50%)',
            width: 30,
            height: 56,
            borderRadius: '12px 0 0 12px',
            backgroundColor: 'rgba(20,20,20,0.72)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
      >
        {/* ── HERO PHOTO SECTION ── */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '65vh' }}>
          {/* Image */}
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800">
            {fullImage ? (
              <img src={fullImage} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/90 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />
          </div>

          {/* Back Arrow (top-left) — only visible before sticky nav kicks in */}
          {!showStickyNav && (
            <button
              onClick={onBack}
              className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-95 transition-transform"
            >
              <BackArrowIcon className="w-5 h-5" />
            </button>
          )}

          {/* Top Right Actions (same as card) */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-20">
            {profile.isVip ? (
              <div
                className="h-8 px-3 rounded-full flex items-center justify-center gap-1.5 text-white"
                style={{ backgroundColor: '#5b318b' }}
              >
                <CrownFilledIcon className="w-3.5 h-3.5" />
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.2px' }}>VIP</span>
              </div>
            ) : profile.isPremium ? (
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

          {/* Profile Info Overlay (bottom of photo) */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white flex flex-col gap-1.5">

            {/* VIP Consultant tag — flush left edge, Figma NearMe style */}
            {profile.isVip && (
              <div
                className="self-start rounded-tr-[11px] rounded-br-[11px] -ml-4 mb-0.5"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  paddingLeft: '16px',
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

            {/* Name & Age */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium tracking-tight">
                {profile.name}, {profile.age}
              </h2>
              {isVerified && <VerificationFilledIcon className="w-5 h-5 text-blue-500" />}
            </div>

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

            {/* Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {profile.isOnline && (
                <div className="h-6 flex items-center gap-1 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>Online</span>
                </div>
              )}
              <div className="h-6 flex items-center gap-1 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal text-white">
                <MatchesFilledIcon className="w-3 h-3 text-[#FF5A60]" />
                <span>You & Her</span>
              </div>
              <div className="h-6 flex items-center gap-1 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal text-white">
                <AstroFilledIcon className="w-3 h-3 text-amber-400" />
                <span>Astro {profile.astroMatchScore ? `${profile.astroMatchScore}%` : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE DETAIL SECTIONS ── */}
        <div style={{ backgroundColor: '#FAFAFA' }}>

          <div style={{ height: 12 }} />

          {/* ── ABOUT CARD ── */}
          <InfoCard>
            <div className="px-4 pt-[14px]" style={{ paddingBottom: aboutIsLong ? 8 : 16 }}>
              <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>
                About {firstName}
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '22px',
                  fontWeight: 400,
                  color: '#51505D',
                  display: '-webkit-box',
                  WebkitLineClamp: aboutExpanded ? 999 : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {aboutText}
              </p>
              {aboutIsLong && (
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className="w-full flex items-center justify-center gap-1 py-3 mt-1"
                  style={{ fontSize: '13px', fontWeight: 600, color: '#41404D' }}
                >
                  {aboutExpanded ? 'View less' : 'View more'}
                  {aboutExpanded
                    ? <ChevronUp style={{ width: 14, height: 14 }} />
                    : <ChevronDown style={{ width: 14, height: 14 }} />}
                </button>
              )}
            </div>
          </InfoCard>

          {/* ── HOBBIES & INTERESTS CARD ── */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-3">
              <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>
                Hobbies & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {visibleHobbies.map((hobby, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-full"
                    style={{
                      border: '1px solid #DDDEE0',
                      paddingLeft: 12,
                      paddingRight: 12,
                      paddingTop: 7,
                      paddingBottom: 7,
                      backgroundColor: 'white',
                    }}
                  >
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>{hobby.emoji}</span>
                    <span style={{ fontSize: '13px', color: '#41404D', fontWeight: 400 }}>{hobby.label}</span>
                  </div>
                ))}
              </div>
              {hobbies.length > HOBBIES_PREVIEW && (
                <button
                  onClick={() => setHobbiesExpanded(!hobbiesExpanded)}
                  className="w-full flex items-center justify-center gap-1 py-3 mt-1"
                  style={{ fontSize: '13px', fontWeight: 600, color: '#41404D' }}
                >
                  {hobbiesExpanded ? 'View less' : `View all ${hobbies.length}`}
                  {hobbiesExpanded
                    ? <ChevronUp style={{ width: 14, height: 14 }} />
                    : <ChevronDown style={{ width: 14, height: 14 }} />}
                </button>
              )}
            </div>
          </InfoCard>

          {/* ── BASIC DETAILS CARD ── */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-4">
              <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>Basic Details</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.profileManagedBy && <OutlineChip label={`Created by ${profile.profileManagedBy}`} />}
                <OutlineChip label={`Profile ID - ${profile.displayId || profile.id}`} />
                <OutlineChip label={`${profile.age} yrs old`} />
                {profile.heightCm && <OutlineChip label={`Height - ${formatHeight(profile.heightCm)}`} />}
              </div>
              <div className="flex flex-col">
                <BasicDetailRow
                  icon={Calendar}
                  label="Birth Date"
                  value={isCurrentUserPremium
                    ? (profile.birthDate ? `Born on ${formatBirthDate(profile.birthDate)}` : undefined)
                    : 'Born on \u2605\u2605\u2605\u2605\u2605\u2605 \uD83D\uDD12'}
                />
                <BasicDetailRow icon={User} label="Marital Status" value={profile.maritalStatus} />
                {(city || state) && (
                  <BasicDetailRow
                    icon={MapPin}
                    label="Lives in"
                    value={[city, state, profile.location?.country || 'India'].filter(Boolean).join(', ')}
                  />
                )}
                {(profile.religion || profile.motherTongue) && (
                  <BasicDetailRow
                    icon={BookOpen}
                    label="Religion & Mother tongue"
                    value={[profile.religion, profile.motherTongue].filter(Boolean).join(', ')}
                  />
                )}
                {profile.community && <BasicDetailRow icon={Users} label="Community" value={profile.community} />}
                {profile.diet && <BasicDetailRow icon={Utensils} label="Diet Preference" value={profile.diet} />}
              </div>
              {!isCurrentUserPremium && (
                <div className="flex flex-col items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #F0F0F2' }}>
                  <p style={{ fontSize: '12px', color: '#888890', fontWeight: 400 }}>To unlock Birth date</p>
                  <button
                    className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    style={{ height: 44, borderRadius: 9999, border: '1.5px solid var(--color-brand-500)', backgroundColor: 'white' }}
                  >
                    <CrownFilledIcon className="shrink-0" style={{ width: 16, height: 16, color: 'var(--color-brand-500)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-brand-500)' }}>Go Premium Now</span>
                  </button>
                </div>
              )}
            </div>
          </InfoCard>

          {/* ── CONTACT DETAILS CARD ── */}
          <InfoCard>
            <div className="px-4 pt-3 pb-4">
              {/* Header: title left, crown icon right */}
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>Contact Details</h3>
                <CrownFilledIcon style={{ width: 22, height: 22, color: '#FF5A60' }} />
              </div>

              {/* Phone row */}
              <BasicDetailRow
                icon={Phone}
                label="Contact No."
                value={
                  isCurrentUserPremium && hasViewedContact
                    ? (profile.contact?.phone ?? '—')
                    : `${maskPhone(profile.contact?.phone)} 🔒`
                }
              />

              {/* Email row */}
              <BasicDetailRow
                icon={Mail}
                label="Email ID"
                value={
                  isCurrentUserPremium && hasViewedContact
                    ? (profile.contact?.email ?? '—')
                    : `${maskEmail(profile.contact?.email)} 🔒`
                }
              />

              {/* Non-premium: unlock CTA */}
              {!isCurrentUserPremium && (
                <div className="flex flex-col items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #F0F0F2' }}>
                  <p style={{ fontSize: '12px', color: '#888890', fontWeight: 400 }}>To unlock Contact No. & Email ID</p>
                  <button
                    className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    style={{ height: 44, borderRadius: 9999, border: '1.5px solid var(--color-brand-500)', backgroundColor: 'white' }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-brand-500)' }}>Go Premium Now</span>
                  </button>
                </div>
              )}

              {/* Premium but not yet viewed: View Contact */}
              {isCurrentUserPremium && !hasViewedContact && (
                <div className="mt-4">
                  <button
                    onClick={() => onViewContact?.(profile.id)}
                    className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    style={{ height: 44, borderRadius: 9999, backgroundColor: 'var(--color-brand-500)' }}
                  >
                    <Phone style={{ width: 16, height: 16, color: 'white' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>View Contact</span>
                  </button>
                </div>
              )}
            </div>
          </InfoCard>

          {/* ── CAREER & EDUCATION CARD ── */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-4">
              <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>Career & Education</h3>
              <div className="flex flex-col">
                <BasicDetailRow
                  icon={Briefcase}
                  label="Profession"
                  value={profile.profession}
                />
                <BasicDetailRow
                  icon={Building2}
                  label="Company Name"
                  value={
                    isCurrentUserPremium
                      ? (profile.companyName ?? undefined)
                      : (profile.companyName ? '\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605 \uD83D\uDD12' : undefined)
                  }
                />
                <BasicDetailRow
                  icon={Wallet}
                  label="Annual Income"
                  value={profile.annualIncome}
                />
                {profile.highestQualification && (
                  <BasicDetailRow
                    icon={GraduationCap}
                    label="Education Qualification"
                    value={profile.highestQualification}
                  />
                )}
                {profile.educationField && (
                  <BasicDetailRow
                    icon={FileText}
                    label="Education Field"
                    value={profile.educationField}
                  />
                )}
                <BasicDetailRow
                  icon={Landmark}
                  label="College Name"
                  value={
                    isCurrentUserPremium
                      ? (profile.collegeName ?? undefined)
                      : (profile.collegeName ? '\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605 \uD83D\uDD12' : undefined)
                  }
                />
              </div>

              {/* Non-premium: unlock CTA */}
              {!isCurrentUserPremium && (
                <div className="flex flex-col items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #F0F0F2' }}>
                  <p style={{ fontSize: '12px', color: '#888890', fontWeight: 400 }}>To unlock Company & College name</p>
                  <button
                    className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    style={{ height: 44, borderRadius: 9999, border: '1.5px solid var(--color-brand-500)', backgroundColor: 'white' }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-brand-500)' }}>Go Premium Now</span>
                  </button>
                </div>
              )}
            </div>
          </InfoCard>

          {/* ── FAMILY DETAILS CARD ── */}
          {profile.family && (
            <InfoCard>
              <div className="px-4 pt-[14px] pb-4">
                <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>Family Details</h3>
                <div className="flex flex-col">
                  {profile.family.fatherProfession && (
                    <BasicDetailRow icon={User} label="Father's Occupation" value={profile.family.fatherProfession} />
                  )}
                  {profile.family.motherProfession && (
                    <BasicDetailRow icon={User} label="Mother's Occupation" value={profile.family.motherProfession} />
                  )}
                  {siblingsText && (
                    <BasicDetailRow icon={Users} label="Siblings" value={siblingsText} />
                  )}
                  {profile.family.familyType && (
                    <BasicDetailRow icon={Home} label="Family Type" value={profile.family.familyType} />
                  )}
                  {profile.family.financialStatus && (
                    <BasicDetailRow icon={Wallet} label="Financial Status" value={profile.family.financialStatus} />
                  )}
                  {profile.family.nativePlace && (
                    <BasicDetailRow icon={MapPin} label="Native Place" value={profile.family.nativePlace} />
                  )}
                </div>
              </div>
            </InfoCard>
          )}

          {/* ── YOU & HER CARD ── */}
          <InfoCard>
            <div className="overflow-hidden rounded-[16px]">

              {/* Gradient header — no overflow-hidden so photos aren't clipped */}
              <div className="relative w-full" style={{ height: 230 }}>
                <img
                  src={imgYouHerBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                />
                <p
                  className="absolute w-full text-center text-white"
                  style={{ top: 20, fontSize: 18, fontWeight: 700, zIndex: 1 }}
                >
                  You &amp; her
                </p>
                {/* Two profile photos + exchange icon */}
                <div className="absolute" style={{ top: 56, left: 0, right: 0, zIndex: 1 }}>
                  <div className="relative mx-auto" style={{ width: 196, height: 98 }}>
                    {/* Her photo – left */}
                    <div
                      className="absolute overflow-hidden rounded-full"
                      style={{ left: 0, top: 0, width: 98, height: 98, border: '3px solid white' }}
                    >
                      <img
                        src={profile.photos?.full ?? profile.imageUrl ?? ''}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Exchange icon at join */}
                    <div
                      className="absolute flex items-center justify-center rounded-full"
                      style={{ left: 74, top: 25, width: 48, height: 48, backgroundColor: 'white', zIndex: 2, boxShadow: '0 1px 8px rgba(0,0,0,0.18)' }}
                    >
                      <svg width="22" height="11" viewBox="0 0 19.1012 9.6" fill="none">
                        <path clipRule="evenodd" d={svgYouHer.p175dc800} fill="#D684A7" fillRule="evenodd" />
                      </svg>
                    </div>
                    {/* His photo – right */}
                    <div
                      className="absolute overflow-hidden rounded-full"
                      style={{ left: 98, top: 0, width: 98, height: 98, border: '3px solid white' }}
                    >
                      <img
                        src={imgCurrentUserAvatar}
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 pt-5 pb-5">

                {/* Match headline */}
                <p style={{ fontSize: 16, fontWeight: 700, color: '#41404D', marginBottom: 16 }}>
                  You Match {matchCount}/{totalCount} of her Preferences
                </p>

                {/* Preference rows */}
                <div className="flex flex-col">
                  {prefs.map((pref, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3" style={{ paddingTop: 14, paddingBottom: 14 }}>
                        <div className="flex-1 flex flex-col" style={{ gap: 2 }}>
                          <span style={{ fontSize: 12, color: '#95959D', lineHeight: '16px', letterSpacing: '0.2px' }}>
                            {pref.label}
                          </span>
                          <span style={{ fontSize: 14, color: '#41404D', lineHeight: '20px' }}>
                            {pref.herPref}
                          </span>
                        </div>
                        {/* Matched / not-matched circle */}
                        <div
                          className="shrink-0 relative"
                          style={{
                            width: 32, height: 32, borderRadius: 9999,
                            background: pref.matched
                              ? 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #AF7AC0 0%, #DB83A5 100%) border-box'
                              : 'white',
                            border: pref.matched ? '2px solid transparent' : '2px solid #DFE0E3',
                          }}
                        >
                          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 32 32" fill="none">
                            {pref.matched
                              ? <path d={svgYouHer.p33759200} fill="url(#matchGrad)" />
                              : <path d={svgYouHer.p198fe600} fill="#B1B3B9" />}
                          </svg>
                          {pref.matched && (
                            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                              <defs>
                                <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#AF7AC0" />
                                  <stop offset="100%" stopColor="#DB83A5" />
                                </linearGradient>
                              </defs>
                            </svg>
                          )}
                        </div>
                      </div>
                      {i < prefs.length - 1 && (
                        <div style={{ height: 1, backgroundColor: '#DFE0E3' }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Common between you */}
                {commonalities.length > 0 && (
                  <div style={{ paddingTop: 36 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#41404D', marginBottom: 4 }}>
                      Common between the both of you
                    </p>
                    {commonalities.map((text, i) => {
                      const isLocation =
                        text.toLowerCase().includes('live') ||
                        text.toLowerCase().includes('from') ||
                        text.toLowerCase().includes('maharashtra');
                      return (
                        <div key={i} className="flex items-center gap-3" style={{ paddingTop: 14, paddingBottom: 14 }}>
                          <div
                            className="shrink-0 relative"
                            style={{
                              width: 32, height: 32, borderRadius: 9999,
                              background: 'linear-gradient(to right, #C26BAC, #CD6AA6)',
                            }}
                          >
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 32 32" fill="none">
                              <path d={isLocation ? svgYouHer.p4374900 : svgYouHer.p17686000} fill="white" />
                            </svg>
                          </div>
                          <span style={{ fontSize: 14, color: '#41404D', lineHeight: '20px' }}>{text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Profile ID footer */}
          <div className="py-4 flex items-center justify-center">
            <span style={{ fontSize: '11px', fontWeight: 400, color: '#888890' }}>
              Profile ID: {profile.displayId || profile.id}
            </span>
          </div>

          <div style={{ height: 180 }} />
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA ── */}
      {/* Pre-connect: floating island with 28px home-indicator gap */}
      {/* Post-connect: solid bg-background panel, full-width, no see-through */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="post-connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-background pb-[28px]"
              style={{ boxShadow: '0px -4px 24px rgba(0,0,0,0.13)' }}
            >
              <div className="px-3 pt-3 pb-4 flex flex-col items-center gap-2.5">
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
                    <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#0AA4B8', boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.08)' }}>
                      <ChatFilledIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-foreground" style={{ fontSize: '11px', fontWeight: 300 }}>Shaadi Chat</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                    <div className="w-[52px] h-[52px] relative overflow-visible"><WhatsAppButton /></div>
                    <span className="text-foreground" style={{ fontSize: '11px', fontWeight: 300 }}>WhatsApp</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                    <div className="w-[52px] h-[52px] relative overflow-visible"><CallButton /></div>
                    <span className="text-foreground" style={{ fontSize: '11px', fontWeight: 300 }}>Call</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pre-connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="px-3 pb-[28px]"
            >
              {renderPreConnectIsland()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};