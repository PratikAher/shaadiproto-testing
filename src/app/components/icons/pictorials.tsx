import React from 'react';
import svgPaths from '../../../imports/svg-gc4b28hb5s';
import { cn } from '../../../utils/cn';

interface PictorialIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// Color constants used across pictorials — reference CSS custom properties
// so dark mode can supply brighter variants automatically.
const COLORS = {
  orange: 'var(--color-pictorial-orange)',
  purple: 'var(--color-pictorial-purple)',
  green: 'var(--color-pictorial-green)',
  gold: 'var(--color-pictorial-gold)',
  pink: 'var(--color-pictorial-pink)',
  blue: 'var(--color-pictorial-blue)',
} as const;

// Light-mode hex values for display / documentation purposes only.
const COLORS_HEX = {
  orange: '#FBAC62',
  purple: '#9472FA',
  green: '#0ED279',
  gold: '#E8C33B',
  pink: '#FF8888',
  blue: '#7EADF8',
} as const;

// --- User (Orange) ---
export const PictoUser = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path d={svgPaths.p54a8f80} fill={COLORS.orange} />
    <path d={svgPaths.p184a2500} fill={COLORS.orange} />
  </svg>
);

// --- Profile (Purple) ---
export const PictoProfile = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path d={svgPaths.p35568900} fill={COLORS.purple} />
    <path d={svgPaths.p256dd000} fill={COLORS.purple} />
    <path d={svgPaths.p117b3270} fill={COLORS.purple} />
    <path d={svgPaths.p1d76ae00} fill={COLORS.purple} />
    <path d={svgPaths.p19d45900} fill={COLORS.purple} />
  </svg>
);

// --- Users / Group (Green) ---
export const PictoUsersGreen = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p1f3fb00} fill={COLORS.green} fillRule="evenodd" />
  </svg>
);

// --- Users / Group (Pink) ---
export const PictoUsersPink = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p1f3fb00} fill={COLORS.pink} fillRule="evenodd" />
  </svg>
);

// --- Safety / Shield (Gold) ---
export const PictoSafety = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.pec04500} fill={COLORS.gold} fillRule="evenodd" />
  </svg>
);

// --- Lives In / Location (Pink) ---
export const PictoLocation = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p35715200} fill={COLORS.pink} fillRule="evenodd" />
    <path d={svgPaths.p3e695e80} fill={COLORS.pink} />
  </svg>
);

// --- Qualification / Graduation (Blue) ---
export const PictoQualification = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p3429da00} fill={COLORS.blue} fillRule="evenodd" />
    <path clipRule="evenodd" d={svgPaths.p1d44d80} fill={COLORS.blue} fillRule="evenodd" />
    <path d={svgPaths.p1372a80} fill={COLORS.blue} />
  </svg>
);

// --- Profession / Briefcase (Green) ---
export const PictoProfession = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p1acdb300} fill={COLORS.green} fillRule="evenodd" />
  </svg>
);

// --- Profile Edit / Document (Orange) ---
export const PictoProfileEdit = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path d={svgPaths.p1c4c1af0} fill={COLORS.orange} />
    <path clipRule="evenodd" d={svgPaths.p1edb680} fill={COLORS.orange} fillRule="evenodd" />
  </svg>
);

// --- Bin / Delete (Orange) ---
export const PictoBin = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p11758100} fill={COLORS.orange} fillRule="evenodd" />
    <path clipRule="evenodd" d={svgPaths.p346351f0} fill={COLORS.orange} fillRule="evenodd" />
  </svg>
);

// --- View Off / Eye Hidden (Blue) ---
export const PictoViewOff = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p3f5c300} fill={COLORS.blue} fillRule="evenodd" />
    <path clipRule="evenodd" d={svgPaths.p2dd85400} fill={COLORS.blue} fillRule="evenodd" />
  </svg>
);

// --- Emoji Sad (Gold) ---
export const PictoEmojiSad = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p14a7a800} fill={COLORS.gold} fillRule="evenodd" />
  </svg>
);

// --- Lock (Orange) ---
export const PictoLock = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p37550880} fill={COLORS.orange} fillRule="evenodd" />
  </svg>
);

// --- Hearts (Pink) ---
export const PictoHearts = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path d={svgPaths.p34e77340} fill={COLORS.pink} />
    <path d={svgPaths.p336dd100} fill={COLORS.pink} />
    <path d={svgPaths.p17e924b2} fill={COLORS.pink} />
    <path d={svgPaths.p2176600} fill={COLORS.pink} />
    <path d={svgPaths.p39883720} fill={COLORS.pink} />
    <path d={svgPaths.p12cda800} fill={COLORS.pink} />
  </svg>
);

// --- Help / Question (Purple) ---
export const PictoHelp = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 36 36" fill="none" {...props}>
    <path clipRule="evenodd" d={svgPaths.p341d2400} fill={COLORS.purple} fillRule="evenodd" />
  </svg>
);

// --- Notification Bell (Pink) ---
export const PictoNotification = ({ className, size = 36, ...props }: PictorialIconProps) => (
  <svg className={cn('block', className)} width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
    <path d={svgPaths.pe5e2b00} fill={COLORS.pink} />
  </svg>
);

// Master list for showcase iteration
export const PICTORIAL_ICONS = [
  { name: 'User', component: PictoUser, color: COLORS.orange, colorHex: COLORS_HEX.orange, colorName: 'Orange' },
  { name: 'Profile', component: PictoProfile, color: COLORS.purple, colorHex: COLORS_HEX.purple, colorName: 'Purple' },
  { name: 'Users', component: PictoUsersGreen, color: COLORS.green, colorHex: COLORS_HEX.green, colorName: 'Green' },
  { name: 'Safety', component: PictoSafety, color: COLORS.gold, colorHex: COLORS_HEX.gold, colorName: 'Gold' },
  { name: 'Location', component: PictoLocation, color: COLORS.pink, colorHex: COLORS_HEX.pink, colorName: 'Pink' },
  { name: 'Qualification', component: PictoQualification, color: COLORS.blue, colorHex: COLORS_HEX.blue, colorName: 'Blue' },
  { name: 'Profession', component: PictoProfession, color: COLORS.green, colorHex: COLORS_HEX.green, colorName: 'Green' },
  { name: 'Profile Edit', component: PictoProfileEdit, color: COLORS.orange, colorHex: COLORS_HEX.orange, colorName: 'Orange' },
  { name: 'Bin', component: PictoBin, color: COLORS.orange, colorHex: COLORS_HEX.orange, colorName: 'Orange' },
  { name: 'View Off', component: PictoViewOff, color: COLORS.blue, colorHex: COLORS_HEX.blue, colorName: 'Blue' },
  { name: 'Emoji Sad', component: PictoEmojiSad, color: COLORS.gold, colorHex: COLORS_HEX.gold, colorName: 'Gold' },
  { name: 'Lock', component: PictoLock, color: COLORS.orange, colorHex: COLORS_HEX.orange, colorName: 'Orange' },
  { name: 'Hearts', component: PictoHearts, color: COLORS.pink, colorHex: COLORS_HEX.pink, colorName: 'Pink' },
  { name: 'Help', component: PictoHelp, color: COLORS.purple, colorHex: COLORS_HEX.purple, colorName: 'Purple' },
  { name: 'Notification', component: PictoNotification, color: COLORS.pink, colorHex: COLORS_HEX.pink, colorName: 'Pink' },
  { name: 'Users Alt', component: PictoUsersPink, color: COLORS.pink, colorHex: COLORS_HEX.pink, colorName: 'Pink' },
] as const;

export { COLORS as PICTORIAL_COLORS, COLORS_HEX as PICTORIAL_COLORS_HEX };