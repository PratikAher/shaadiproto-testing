import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_USER } from '../../data/currentUser';
import svgPaths from '../../imports/svg-qrxl3wupqq';
import imgPratikAvatar from '../../assets/pratik_avatar.png';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isCurrentUserPremium: boolean;
  onEditProfile?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Figma-accurate icon components — paths from svg-qrxl3wupqq
// ─────────────────────────────────────────────────────────────────────────────

/** Chevron-right — 20 × 20, grey */
const NavChevron = () => (
  <div className="overflow-clip relative shrink-0 size-[20px]">
    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path d={svgPaths.p3a069900} fill="#B1B3B9" />
    </svg>
  </div>
);

/** Blue verified tick — 24 × 24 */
const BlueTick = () => (
  <div className="relative shrink-0 size-[24px]">
    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <path d={svgPaths.p35f5c800} fill="#0094FF" />
      <path d={svgPaths.p1517f200} fill="white" />
      <path d={svgPaths.p1517f200} stroke="white" />
    </svg>
  </div>
);

/** Pencil-edit icon — 16 × 16 */
const PencilIcon = () => (
  <div className="relative shrink-0 size-[16px]">
    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <path d={svgPaths.p1dc3a380} stroke="#41404D" strokeLinejoin="round" />
      <path d={svgPaths.p22035ef0} stroke="#41404D" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/**
 * Red-gradient crown pill — 24 × 24 container.
 * Exact copy of the "Premium Tag New" from Figma.
 */
const CrownPill = () => (
  <div
    className="bg-gradient-to-r from-[#ff5a60] to-[#f93961] flex items-center justify-center p-[5.6px] relative rounded-[14.769px] shrink-0 size-[24px]"
  >
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path clipRule="evenodd" d={svgPaths.p32c63000} fill="white" fillRule="evenodd" />
        <path d={svgPaths.p1b90ad00} fill="white" />
      </svg>
    </div>
  </div>
);

/**
 * Settings / Gear icon — single SVG, transforms computed from Figma inset maths:
 *   Outer gear  (p235183f0, vb 0 0 21.5 20.12)  → translate(1.25, 1.94)
 *   Inner knob  (p2fc71100, vb 0 0 8.5 8.5)     → translate(7.75, 7.75)
 */
const SettingsIcon = () => (
  <svg className="block shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
    <g transform="translate(1.25, 1.94)">
      <path d={svgPaths.p235183f0} stroke="#41404D" strokeLinecap="round" strokeWidth="1.5" />
    </g>
    <g transform="translate(7.75, 7.75)">
      <path d={svgPaths.p2fc71100} stroke="#41404D" strokeWidth="1.5" />
    </g>
  </svg>
);

/**
 * Partner-Preferences icon — single SVG, transforms from Figma inset maths:
 *   Main shape  (p8ddc000,   vb 0 0 19.5 21.86)  → translate(2.25,  0.815)
 *   Circle      (p2583d500,  vb 0 0 5.94 5.94)   → translate(8.917, 4.25)
 *   Bar         (p2370800,   vb 0 0 9.28 5.39)   → translate(7.25,  10.70)
 */
const PreferencesIcon = () => (
  <svg className="block shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
    <g transform="translate(2.25, 0.815)">
      <path
        d={svgPaths.p8ddc000}
        stroke="#41404D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
      />
    </g>
    <g transform="translate(8.917, 4.25)">
      <path d={svgPaths.p2583d500} stroke="#41404D" strokeWidth="1.5" />
    </g>
    <g transform="translate(7.25, 10.70)">
      <path d={svgPaths.p2370800} stroke="#41404D" strokeLinejoin="round" strokeWidth="1.5" />
    </g>
  </svg>
);

/**
 * VIPSHAADI diamond icon — single SVG:
 *   Both diamond paths share the same vb 0 0 17.55 17.92 → translate(3, 2.375)
 */
const VipDiamondIcon = () => (
  <svg className="block shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
    <g transform="translate(3, 2.375)">
      <path d={svgPaths.p3eee6a80} stroke="#41404D" strokeWidth="1.25" />
      <path d={svgPaths.pdfb7380}  stroke="#41404D" strokeWidth="1.36364" />
    </g>
  </svg>
);

/** VIPSHAADI wordmark SVG — exact Figma dimensions */
const VipShaadiWordmark = () => (
  <div className="relative shrink-0" style={{ height: '11.728px', width: '90.679px' }}>
    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90.6788 11.7275">
      <path d={svgPaths.p245a0aa0}  fill="#41404D" />
      <path d={svgPaths.p1d034700}  fill="#41404D" />
      <path d={svgPaths.pdc98600}   fill="#41404D" />
      <path d={svgPaths.pe3c000}    fill="#41404D" />
      <path d={svgPaths.p3785ee80}  fill="#41404D" />
      <path d={svgPaths.p1fd48200}  fill="#41404D" />
      <path d={svgPaths.p29687db0}  fill="#41404D" />
      <path d={svgPaths.p2884780}   fill="#41404D" />
      <path d={svgPaths.p10105b00}  fill="#41404D" />
      <path d={svgPaths.p199f700}   fill="#41404D" />
      <path d={svgPaths.p267b2e00}  fill="#41404D" />
    </svg>
  </div>
);

/** AstroChat icon — 24 × 24 */
const AstroChatIcon = () => (
  <svg className="block shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
    <path d={svgPaths.p2cbf6d00} stroke="#41404D" strokeLinejoin="round" strokeWidth="1.5" />
    <path clipRule="evenodd" d={svgPaths.p39e34900} fill="#41404D" fillRule="evenodd" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Avatar — Pratik's real photo for BOTH states (user request)
// Crop values from figma:asset Frame2147223500 Pratik_avatar export
// ─────────────────────────────────────────────────────────────────────────────

const PratikAvatar = () => (
  <div
    className="relative shrink-0 size-[72px] rounded-full overflow-hidden bg-[#f6f6f6]"
    style={{ boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.08)' }}
  >
    <img
      src={imgPratikAvatar}
      alt="Pratik"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Edit Profile pill — exact Figma spec
// bg-[#f9f9fb], border-[#dfe0e3], h-[28px], px-[16px] py-[6px], rounded-[15px]
// ─────────────────────────────────────────────────────────────────────────────

const EditProfilePill = ({ onPress }: { onPress?: () => void }) => (
  <button
    onClick={onPress}
    className="bg-[#f9f9fb] flex gap-[6px] items-center justify-center px-[14px] relative rounded-[18px] shrink-0 active:scale-95 transition-transform"
    style={{ height: '34px' }}
  >
    {/* border overlay */}
    <div
      aria-hidden="true"
      className="absolute border border-[#dfe0e3] border-solid inset-0 pointer-events-none rounded-[18px]"
    />
    <PencilIcon />
    <p
      className="relative shrink-0"
      style={{
        fontFamily: "'Roboto:Regular', sans-serif",
        fontVariationSettings: "'wdth' 100",
        fontSize: '13px',
        lineHeight: '18px',
        letterSpacing: '0.1px',
        color: '#41404D',
      }}
    >
      Edit Profile
    </p>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// 55% OFF badge
// ─────────────────────────────────────────────────────────────────────────────

const OffBadge = () => (
  <div className="bg-[#cff6e4] flex items-center px-[6px] py-[4px] relative rounded-[24px] shrink-0">
    <p
      className="relative shrink-0"
      style={{
        fontFamily: "'Roboto:Medium', sans-serif",
        fontVariationSettings: "'wdth' 100",
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: '#009f46',
      }}
    >
      55% OFF
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Gold Plus Member card — premium only
// ─────────────────────────────────────────────────────────────────────────────

const PremiumMemberCard = () => (
  <div className="px-[8px]">
    <div
      className="relative rounded-[12px] shrink-0 w-full"
      style={{ backgroundImage: 'linear-gradient(104.684deg, rgb(255, 255, 255) 2.8292%, rgb(255, 246, 246) 97.171%)' }}
    >
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="flex gap-[4px] items-center pl-[10px] pr-[8px] py-[8px] relative w-full">
          {/* Text */}
          <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
            <p
              style={{
                fontFamily: "'Roboto:Medium', sans-serif",
                fontVariationSettings: "'wdth' 100",
                fontSize: '16px',
                lineHeight: '24px',
                color: '#41404D',
                width: '140px',
              }}
            >
              Gold Plus Member
            </p>
            <div className="flex gap-[4px] items-center relative shrink-0">
              <p
                style={{
                  fontFamily: "'Roboto:Regular', sans-serif",
                  fontVariationSettings: "'wdth' 100",
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0.2px',
                  color: '#51505D',
                }}
              >
                Expiring in 20 days
              </p>
              {/* Active chip */}
              <div className="bg-[#cff6e4] relative rounded-[20px] shrink-0">
                <div aria-hidden="true" className="absolute border border-[#cff6e4] border-solid inset-0 pointer-events-none rounded-[20px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="flex gap-[4px] items-center pb-[3px] pt-[2px] px-[8px] relative">
                    <p
                      style={{
                        fontFamily: "'Roboto:Medium', sans-serif",
                        fontVariationSettings: "'wdth' 100",
                        fontSize: '12px',
                        lineHeight: '16px',
                        letterSpacing: '0.2px',
                        color: '#009F46',
                      }}
                    >
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NavChevron />

          {/* Crown watermark */}
          <div
            className="absolute flex items-center justify-center"
            style={{ left: '182.26px', top: '2.16px', width: '72.561px', height: '72.561px' }}
          >
            <div className="flex-none rotate-[-17.92deg]">
              <div className="relative size-[57.625px]">
                <div className="absolute inset-[0_0_-1.8%_0]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.6255 58.6609">
                    <g opacity="0.05">
                      <path clipRule="evenodd" d={svgPaths.p967ff00} fill="#FF5A60" fillRule="evenodd" />
                      <path d={svgPaths.p27713000} fill="#FF5A60" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card border + shadow */}
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Row primitives — match Figma row structure exactly
// ─────────────────────────────────────────────────────────────────────────────

interface MenuRowProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  /** Optional right-side badge (e.g. 55% OFF) */
  trailing?: React.ReactNode;
  /** compact = pr-[4px] to make room for trailing badge */
  compact?: boolean;
}

const MenuRow = ({ icon, label, trailing, compact }: MenuRowProps) => (
  <div className="flex items-center relative shrink-0 w-full">
    <div className="flex-1 min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div
          className="flex gap-[12px] items-center w-full"
          style={{
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingRight: compact ? '4px' : '8px',
          }}
        >
          {icon}
          {typeof label === 'string' ? (
            <div
              className="flex flex-1 flex-col justify-end leading-none min-w-0"
              style={{
                fontFamily: "'Roboto:Regular', sans-serif",
                fontVariationSettings: "'wdth' 100",
                fontSize: '16px',
                color: '#41404D',
              }}
            >
              <p style={{ lineHeight: '24px' }}>{label}</p>
            </div>
          ) : (
            <div className="flex flex-1 items-center min-w-0">{label}</div>
          )}
          {trailing}
        </div>
      </div>
    </div>
    <NavChevron />
  </div>
);

const BottomLink = ({ label }: { label: string }) => (
  <div className="bg-white flex items-center relative shrink-0 w-full">
    <div className="flex-1 min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="flex gap-[12px] items-center pr-[12px] py-[12px] w-full">
          <div
            className="flex flex-1 flex-col justify-end leading-none min-w-0"
            style={{
              fontFamily: "'Roboto:Regular', sans-serif",
              fontVariationSettings: "'wdth' 100",
              fontSize: '14px',
              color: '#41404D',
            }}
          >
            <p style={{ lineHeight: '20px' }}>{label}</p>
          </div>
        </div>
      </div>
    </div>
    <NavChevron />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main SideDrawer
// ─────────────────────────────────────────────────────────────────────────────

export function SideDrawer({ isOpen, onClose, isCurrentUserPremium, onEditProfile }: SideDrawerProps) {
  /** Close drawer and fire edit-profile simultaneously — no delay needed since
   *  EditProfileView now renders as an overlay on top of everything */
  const handleEditProfile = React.useCallback(() => {
    onClose();
    onEditProfile?.();
  }, [onClose, onEditProfile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            className="absolute left-0 top-0 h-full z-[61] bg-white flex flex-col overflow-hidden"
            style={{
              width: '80%',
              maxWidth: '300px',
              boxShadow: '4px 0 28px rgba(0,0,0,0.15)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
              mass: 0.7,
            }}
          >
            <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide">

              {/* ── Profile header ─────────────────────────────────────── */}
              <div className="flex flex-col gap-[16px] pb-[12px]" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
                <div className="flex gap-[14px] items-center px-[16px]">
                  {/* Avatar — real photo in both states */}
                  <PratikAvatar />

                  {/* Name + tick + edit pill */}
                  <div className="flex flex-1 flex-col gap-[10px] items-start min-w-0">
                    <div className="flex gap-[5px] items-center relative shrink-0 w-full">
                      <p
                        className="shrink-0 whitespace-nowrap"
                        style={{
                          fontFamily: "'Roboto:Bold', sans-serif",
                          fontVariationSettings: "'wdth' 100",
                          fontSize: '20px',
                          fontWeight: 700,
                          lineHeight: 1,
                          color: '#41404D',
                        }}
                      >
                        {CURRENT_USER.name}
                      </p>
                      <BlueTick />
                    </div>
                    <EditProfilePill onPress={handleEditProfile} />
                  </div>
                </div>

                {/* Premium membership card */}
                {isCurrentUserPremium && <PremiumMemberCard />}
              </div>

              {/* ── Menu rows ──────────────────────────────────────────── */}
              <div className="flex flex-col px-[16px] mt-[4px]">
                {/* Get / Renew Premium */}
                <MenuRow
                  icon={<CrownPill />}
                  label={isCurrentUserPremium ? 'Renew Premium' : 'Get Premium'}
                  trailing={<OffBadge />}
                  compact
                />

                {/* Partner Preferences */}
                <MenuRow icon={<PreferencesIcon />} label="Partner Preferences" />

                {/* Privacy & Settings */}
                <MenuRow icon={<SettingsIcon />} label="Privacy & Settings" />

                {/* VIPSHAADI */}
                <MenuRow
                  icon={<VipDiamondIcon />}
                  label={<VipShaadiWordmark />}
                  compact
                />

                {/* AstroChat */}
                <MenuRow icon={<AstroChatIcon />} label="AstroChat" compact />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* ── Divider ────────────────────────────────────────────── */}
              <div className="mx-[16px]">
                <div className="h-0 relative shrink-0">
                  <div className="absolute inset-[-0.5px_-0.19%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 269 1">
                      <path d="M0.5 0.5H268.5" stroke="#F1F1F2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Bottom hygiene links ────────────────────────────────── */}
              <div className="flex flex-col px-[16px] pb-[32px] pt-[12px]">
                <BottomLink label="Be Safe Online" />
                <BottomLink label="Help & Support" />
                <BottomLink label={isCurrentUserPremium ? 'Rate the App' : 'Privacy Policy'} />
                <BottomLink label="Terms & Conditions" />
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}