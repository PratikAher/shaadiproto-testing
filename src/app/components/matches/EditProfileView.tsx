import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Briefcase,
  Users,
  User,
  Phone,
  Mail,
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
  VerificationFilledIcon,
  AstroFilledIcon,
  NavigationIcon,
  CrownFilledIcon,
  PhotoFilledIcon,
} from '../icons';
import IconMenuEdit from '../../../imports/IconMenuEdit';
import imgPratik from '../../../assets/pratik_profile.png';
import { CURRENT_USER } from '../../../data/currentUser';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const formatHeight = (cm?: number) => {
  if (!cm) return "5' 5\"";
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const rem = Math.round(inches % 12);
  return `${feet}' ${rem}"`;
};

const formatBirthDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ─────────────────────────────────────────────────────────────
// HOBBIES FOR PRATIK (from aboutMe context)
// ─────────────────────────────────────────────────────────────

const PRATIK_HOBBIES = [
  { emoji: '🍳', label: 'Cooking' },
  { emoji: '🏍️', label: 'Bike Rides' },
  { emoji: '🏸', label: 'Badminton' },
  { emoji: '✈️', label: 'Travelling' },
  { emoji: '📸', label: 'Photography' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🏋️', label: 'Fitness' },
  { emoji: '📚', label: 'Reading' },
  { emoji: '🏔️', label: 'Trekking' },
  { emoji: '🎨', label: 'Designing' },
];

const HOBBIES_PREVIEW = 6;

// ─────────────────────────────────────────────────────────────
// SHARED PRIMITIVES — exact mirror of FullProfileView
// ─────────────────────────────────────────────────────────────

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className="mx-3 mb-3 bg-white rounded-[16px] overflow-hidden"
    style={{ boxShadow: '0px 1px 12px rgba(0,0,0,0.07)' }}
  >
    {children}
  </div>
);

/**
 * Section header row: bold title left, IconMenuEdit right.
 * --stroke-0 is overridden to #1A1A2E so the icon matches the heading colour.
 */
const EditSectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-2">
    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A2E' }}>{title}</h3>
    {/* override --stroke-0 so the pencil icon is the same dark colour as the heading */}
    <div
      className="relative shrink-0"
      style={{ width: 24, height: 24, '--stroke-0': '#1A1A2E' } as React.CSSProperties}
    >
      <IconMenuEdit />
    </div>
  </div>
);

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
      <div
        className="rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ width: 40, height: 40, backgroundColor: iconBg }}
      >
        <Icon style={{ width: 18, height: 18, color: iconColor }} />
      </div>
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span style={{ fontSize: '11px', color: '#888890', fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#41404D', fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
};

const OutlineChip = ({ label }: { label: string }) => (
  <div
    className="rounded-full shrink-0"
    style={{
      border: '1px solid #DDDEE0',
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 5,
      paddingBottom: 5,
    }}
  >
    <span style={{ fontSize: '12px', color: '#51505D', fontWeight: 400 }}>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

interface EditProfileViewProps {
  onBack: () => void;
  isCurrentUserPremium?: boolean;
}

export const EditProfileView = ({ onBack, isCurrentUserPremium = false }: EditProfileViewProps) => {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [hobbiesExpanded, setHobbiesExpanded] = useState(false);

  const user = CURRENT_USER;
  const firstName = user.name.split(' ')[0];
  const city = user.location?.city;
  const state = user.location?.state;
  const heightLabel = formatHeight(user.heightCm);
  const photoCount = 3; // Pratik's uploaded photo count

  const aboutText = user.aboutMe ?? '';
  const aboutIsLong = aboutText.length > 150;

  const visibleHobbies = hobbiesExpanded
    ? PRATIK_HOBBIES
    : PRATIK_HOBBIES.slice(0, HOBBIES_PREVIEW);

  // Siblings text
  const siblingsText = (() => {
    const s = user.family?.siblings;
    if (!s) return null;
    const parts: string[] = [];
    if (s.brothers > 0) parts.push(`${s.brothers} Brother${s.brothers > 1 ? 's' : ''}`);
    if (s.sisters > 0) parts.push(`${s.sisters} Sister${s.sisters > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'No Siblings';
  })();

  return (
    <div className="relative w-full h-full bg-[#FAFAFA] flex flex-col overflow-hidden">

      {/* ── TOP NAVIGATION BAR ── */}
      <div className="shrink-0 flex items-center px-4 bg-background border-b border-[#EBEBEB]" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 64px)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg active:scale-95 transition-transform"
          >
            <BackArrowIcon className="w-6 h-6" style={{ color: '#41404D' }} />
          </button>
          <h1 className="font-medium text-xl tracking-tight ml-1" style={{ color: '#1A1A2E' }}>
            Edit Profile
          </h1>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ══ HERO PHOTO SECTION ══ */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '3/4', maxHeight: '65vh' }}
        >
          {/* Photo */}
          <div className="absolute inset-0 bg-neutral-200">
            <img
              src={imgPratik}
              alt={user.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />
          </div>

          {/* Top Right Actions — photo count + premium badge */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-20">
            {isCurrentUserPremium && (
              <button className="w-[30px] h-[30px] rounded-full bg-[#FF5A60] flex items-center justify-center text-white shadow-lg">
                <CrownFilledIcon className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="h-8 px-3 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center gap-1.5 text-white border border-white/10">
              <PhotoFilledIcon className="w-4 h-4" />
              <span className="text-sm font-medium leading-none">{photoCount}</span>
            </div>
          </div>

          {/* Profile info overlay — bottom of photo */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white flex flex-col gap-1.5">

            {/* Name & Age */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium tracking-tight">
                {user.name}, {user.age}
              </h2>
              <VerificationFilledIcon className="w-5 h-5 text-blue-500" />
            </div>

            {/* Demographics: height | community */}
            <div className="flex items-center gap-2 text-sm text-white font-normal truncate">
              <span>{heightLabel}</span>
              <span className="w-[1px] h-3 bg-white/24 rounded-full" />
              <span>{user.community}</span>
            </div>

            {/* Profession & Location */}
            <div className="flex items-center gap-2 text-sm text-white font-normal truncate">
              <span className="truncate">{user.profession}</span>
              <span className="w-[1px] h-3 bg-white/24 rounded-full" />
              <span>{city}, {state}</span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <div className="h-6 flex items-center gap-1 px-2 rounded-full bg-black/40 backdrop-blur-md text-xs font-normal text-white">
                <AstroFilledIcon className="w-3 h-3 text-amber-400" />
                <span>Edit Astro</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ DETAIL SECTIONS ══ */}
        <div style={{ backgroundColor: '#FAFAFA' }}>
          <div style={{ height: 12 }} />

          {/* ABOUT */}
          <InfoCard>
            <div className="px-4 pt-[14px]" style={{ paddingBottom: aboutIsLong ? 8 : 16 }}>
              <EditSectionHeader title={`About ${firstName}`} />
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

          {/* HOBBIES & INTERESTS */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-3">
              <EditSectionHeader title="Hobbies & Interests" />
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
              {PRATIK_HOBBIES.length > HOBBIES_PREVIEW && (
                <button
                  onClick={() => setHobbiesExpanded(!hobbiesExpanded)}
                  className="w-full flex items-center justify-center gap-1 py-3 mt-1"
                  style={{ fontSize: '13px', fontWeight: 600, color: '#41404D' }}
                >
                  {hobbiesExpanded ? 'View less' : `View all ${PRATIK_HOBBIES.length}`}
                  {hobbiesExpanded
                    ? <ChevronUp style={{ width: 14, height: 14 }} />
                    : <ChevronDown style={{ width: 14, height: 14 }} />}
                </button>
              )}
            </div>
          </InfoCard>

          {/* BASIC DETAILS */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-4">
              <EditSectionHeader title="Basic Details" />
              <div className="flex flex-wrap gap-2 mb-3">
                <OutlineChip label={`Profile ID - ${user.displayId || user.id}`} />
                <OutlineChip label={`${user.age} yrs old`} />
                {user.heightCm && <OutlineChip label={`Height - ${heightLabel}`} />}
                {user.profileManagedBy && <OutlineChip label={`Created by ${user.profileManagedBy}`} />}
              </div>
              <div className="flex flex-col">
                <BasicDetailRow
                  icon={Calendar}
                  label="Birth Date"
                  value={user.birthDate ? `Born on ${formatBirthDate(user.birthDate)}` : undefined}
                />
                <BasicDetailRow icon={User} label="Marital Status" value={user.maritalStatus} />
                {(city || state) && (
                  <BasicDetailRow
                    icon={MapPin}
                    label="Lives in"
                    value={[city, state, user.location?.country || 'India'].filter(Boolean).join(', ')}
                  />
                )}
                {(user.religion || user.motherTongue) && (
                  <BasicDetailRow
                    icon={BookOpen}
                    label="Religion & Mother tongue"
                    value={[user.religion, user.motherTongue].filter(Boolean).join(', ')}
                  />
                )}
                {user.community && (
                  <BasicDetailRow icon={Users} label="Community" value={user.community} />
                )}
                {user.diet && (
                  <BasicDetailRow icon={Utensils} label="Diet Preference" value={user.diet} />
                )}
              </div>
            </div>
          </InfoCard>

          {/* CONTACT DETAILS */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-4">
              <EditSectionHeader title="Contact Details" />
              <div className="flex flex-col">
                <BasicDetailRow
                  icon={Phone}
                  label="Contact No."
                  value={user.contact?.phone ?? undefined}
                />
                <BasicDetailRow
                  icon={Mail}
                  label="Email ID"
                  value={user.contact?.email ?? undefined}
                />
              </div>
            </div>
          </InfoCard>

          {/* FAMILY DETAILS */}
          {user.family && (
            <InfoCard>
              <div className="px-4 pt-[14px] pb-4">
                <EditSectionHeader title="Family Details" />
                <div className="flex flex-col">
                  {user.family.fatherProfession && (
                    <BasicDetailRow icon={User} label="Father's Occupation" value={user.family.fatherProfession} />
                  )}
                  {user.family.motherProfession && (
                    <BasicDetailRow icon={User} label="Mother's Occupation" value={user.family.motherProfession} />
                  )}
                  {siblingsText && (
                    <BasicDetailRow icon={Users} label="Siblings" value={siblingsText} />
                  )}
                  {user.family.familyType && (
                    <BasicDetailRow icon={Home} label="Family Type" value={user.family.familyType} />
                  )}
                  {user.family.financialStatus && (
                    <BasicDetailRow icon={Wallet} label="Financial Status" value={user.family.financialStatus} />
                  )}
                  {user.family.nativePlace && (
                    <BasicDetailRow icon={MapPin} label="Native Place" value={user.family.nativePlace} />
                  )}
                </div>
              </div>
            </InfoCard>
          )}

          {/* CAREER & EDUCATION */}
          <InfoCard>
            <div className="px-4 pt-[14px] pb-4">
              <EditSectionHeader title="Career & Education" />
              <div className="flex flex-col">
                <BasicDetailRow icon={Briefcase} label="Profession" value={user.profession} />
                <BasicDetailRow icon={Building2} label="Company Name" value={user.companyName ?? undefined} />
                <BasicDetailRow icon={Wallet} label="Annual Income" value={user.annualIncome} />
                {user.highestQualification && (
                  <BasicDetailRow icon={GraduationCap} label="Education Qualification" value={user.highestQualification} />
                )}
                {user.educationField && (
                  <BasicDetailRow icon={FileText} label="Education Field" value={user.educationField} />
                )}
                {user.collegeName && user.collegeName !== 'Hidden' && (
                  <BasicDetailRow icon={Landmark} label="College Name" value={user.collegeName} />
                )}
              </div>
            </div>
          </InfoCard>

          {/* Profile ID footer */}
          <div className="py-4 flex items-center justify-center">
            <span style={{ fontSize: '11px', fontWeight: 400, color: '#888890' }}>
              Profile ID: {user.displayId || user.id}
            </span>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
};