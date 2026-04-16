// ─────────────────────────────────────────────────────
// Shared Filter Definitions — typed per field
// ─────────────────────────────────────────────────────

import {
  getCommunityOptionsForReligions,
  RELIGION_OPTIONS,
  MOTHER_TONGUE_OPTIONS,
  COUNTRY_LIVING_OPTIONS,
  STATE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  FIELD_OF_STUDY_OPTIONS,
  PROFESSION_AREA_OPTIONS,
  WORKING_AS_OPTIONS,
  WORKING_WITH_OPTIONS,
  DIET_OPTIONS,
  HOBBIES_OPTIONS,
} from '../../../data/filterOptionCatalog';

const ALL_COMMUNITY_FILTER_OPTIONS = getCommunityOptionsForReligions([]).map((o) => ({
  value: o.value,
  label: o.label,
  aliases: o.aliases,
}));

export interface SharedFilterState {
  // ── Range filters ──
  ageRange: [number, number] | null;
  heightRange: [number, number] | null;
  incomeRangeInr: string[];
  incomeRangeUsd: string[];

  // ── Multi-select filters (string[]) ──
  maritalStatus: string[];
  /** Shown when marital includes any status other than "Never Married". Values: no | yes_living_together | yes_not_living_together */
  partnerHasChildren: string[];
  religion: string[];
  community: string[];
  motherTongue: string[];
  qualification: string[];
  educationField: string[];
  annualIncome: string[];
  country: string[];
  state: string[];
  city: string[];
  countryGrewUp: string[];
  residencyStatus: string[];
  workingWith: string[];
  profession: string[];
  professionArea: string[];
  diet: string[];
  profileManagedBy: string[];
  familyType: string[];
  financialStatus: string[];

  // ── Single-select filters (string | null) ──
  manglik: string[];

  // ── Toggle / boolean filters ──
  verified: boolean;
  withPhoto: boolean;
  onlineNow: boolean;
  premiumProfiles: boolean;
  recentlyJoined: boolean;
  nearBy: boolean;
  topColleges: boolean;
  topMatches: boolean;
  recentlyActive: boolean;

  // ── New option4 filter keys ──
  photoVisibility: string[];   // 'public' | 'protected' | 'none' (no profile photo)
  hobbies: string[];
  hasAstroDetails: boolean;
  astroFilter: string[];       // 'with_astro' | 'without_astro'
  familyCountry: string[];
  familyState: string[];
  familyCity: string[];
}

export type SharedFilterKey = keyof SharedFilterState;

export const EMPTY_SHARED_FILTERS: SharedFilterState = {
  ageRange: null,
  heightRange: null,
  incomeRangeInr: [],
  incomeRangeUsd: [],
  maritalStatus: [],
  partnerHasChildren: [],
  religion: [],
  community: [],
  motherTongue: [],
  qualification: [],
  educationField: [],
  annualIncome: [],
  country: [],
  state: [],
  city: [],
  countryGrewUp: [],
  residencyStatus: [],
  workingWith: [],
  profession: [],
  professionArea: [],
  diet: [],
  profileManagedBy: [],
  familyType: [],
  financialStatus: [],
  manglik: [],
  verified: false,
  withPhoto: false,
  onlineNow: false,
  premiumProfiles: false,
  recentlyJoined: false,
  nearBy: false,
  topColleges: false,
  topMatches: false,
  recentlyActive: false,
  photoVisibility: [],
  hobbies: [],
  hasAstroDetails: false,
  astroFilter: [],
  familyCountry: [],
  familyState: [],
  familyCity: [],
};

/**
 * Baseline defaults seeded from onboarding partner preferences.
 * These values should render as pre-selected in filters, but are not treated
 * as "actively applied" when comparing against this baseline.
 */
export const PARTNER_PREFERENCE_BASELINE_FILTERS: SharedFilterState = {
  ...EMPTY_SHARED_FILTERS,
};

/**
 * Baseline for “no filters applied” / Clear. All personas start empty — nothing pre-selected.
 * Persona-specific Option 4 catalog narrowing (countries, community, etc.) still uses `currentUserPersonaId` in `getIterationCategories`.
 */
export function getBaselineFiltersForPersona(_personaId: string): SharedFilterState {
  return { ...EMPTY_SHARED_FILTERS };
}

/** “Have children” only when user picked at least one marital status other than Never Married. */
export function shouldShowPartnerHasChildrenFilter(maritalStatus: string[]): boolean {
  return maritalStatus.length > 0 && maritalStatus.some((m) => m !== 'Never Married');
}

/** Marital status + Have children filters — only for the divorced remarriage persona (Zaid). */
export function shouldShowMaritalFiltersForPersona(personaId?: string): boolean {
  return personaId === 'zaid';
}

// ─────────────────────────────────────────────────────
// Filter definitions — drive the UI rendering
// ─────────────────────────────────────────────────────

export type FilterControlType = 'toggle' | 'multi-select' | 'single-select' | 'range';
export type FilterDataSource = 'profile' | 'derived' | 'onboarding';

export interface FilterOption {
  value: string;
  label: string;
  /** Secondary line under the primary label (e.g. income band for Financial Status). */
  description?: string;
  aliases?: string[];
}

export interface FilterOptionGroup {
  id: string;
  label: string;
  optionValues: string[];
}

export interface RangeConfig {
  min: number;
  max: number;
  step: number;
  formatLabel: (v: number) => string;
  /** Optional fixed values for discrete slider stops (non-granular). */
  allowedValues?: number[];
  /** Minimum number of slider stops between lower and upper handles. */
  minStepGap?: number;
}

export interface FilterFieldContract {
  dataSource: FilterDataSource;
  profilePath: string;
  onboardingPath?: string;
  matcherKind: 'toggle' | 'exact' | 'includes' | 'range' | 'derived';
  notes?: string;
}

export interface SharedFilterDefinition {
  key: SharedFilterKey;
  label: string;
  controlType: FilterControlType;
  premium?: boolean;
  options?: FilterOption[];
  optionGroups?: FilterOptionGroup[];
  searchable?: boolean;
  /** Overrides default `Search ${label}` for searchable multi-select inputs */
  searchPlaceholder?: string;
  /** Single-select: show “Open to all” row that clears selection */
  allowClear?: boolean;
  priority: number;
  rangeConfig?: RangeConfig;
  fieldContract: FilterFieldContract;
  /** When true, resolveFilterDefinition will return this filter unchanged (skip dynamic overrides). */
  skipResolve?: boolean;
}

export interface SharedFilterCategory {
  id: string;
  title: string;
  priority: number;
  filters: SharedFilterDefinition[];
}

// ─────────────────────────────────────────────────────
// Height conversion helper
// ─────────────────────────────────────────────────────

export function cmToFtIn(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}ft ${inch}in`;
}

// ─────────────────────────────────────────────────────
// Category and filter data (intentional ordering)
// ─────────────────────────────────────────────────────

export const SHARED_FILTER_CATEGORIES: SharedFilterCategory[] = [
  {
    id: 'activity',
    title: 'Activity & Intent',
    priority: 10,
    filters: [
      {
        key: 'verified',
        label: 'Verified profiles',
        controlType: 'toggle',
        priority: 10,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'verified.id | isVerified | badges',
          onboardingPath: 'selfie/otp verification',
          matcherKind: 'toggle',
        },
      },
      {
        key: 'withPhoto',
        label: 'Profile with photos',
        controlType: 'toggle',
        priority: 20,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'photos.full | imageUrl',
          matcherKind: 'toggle',
        },
      },
      {
        key: 'onlineNow',
        label: 'Online Now',
        controlType: 'toggle',
        priority: 30,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'isOnline',
          matcherKind: 'toggle',
        },
      },
      {
        key: 'recentlyJoined',
        label: 'Just joined',
        controlType: 'toggle',
        priority: 40,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'createdAt',
          matcherKind: 'derived',
          notes: 'Derived by recency window from createdAt.',
        },
      },
      {
        key: 'premiumProfiles',
        label: 'Premium Profiles',
        controlType: 'toggle',
        premium: true,
        priority: 50,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'isPremium | isVip',
          matcherKind: 'toggle',
        },
      },
      {
        key: 'topColleges',
        label: 'Top Colleges',
        controlType: 'toggle',
        premium: true,
        priority: 55,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'collegeName',
          matcherKind: 'derived',
        },
      },
      {
        key: 'topMatches',
        label: 'Top Matches',
        controlType: 'toggle',
        premium: true,
        priority: 56,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'astroMatchScore',
          matcherKind: 'derived',
        },
      },
      {
        key: 'recentlyActive',
        label: 'Recently Active',
        controlType: 'toggle',
        priority: 57,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'lastActive',
          matcherKind: 'derived',
        },
      },
    ],
  },
  {
    id: 'basic',
    title: 'Basic Details',
    priority: 20,
    filters: [
      {
        key: 'ageRange',
        label: 'Age',
        controlType: 'range',
        priority: 10,
        rangeConfig: { min: 21, max: 45, step: 1, formatLabel: (v) => `${v} yrs` },
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'age',
          onboardingPath: 'birthDate',
          matcherKind: 'range',
        },
      },
      {
        key: 'heightRange',
        label: 'Height',
        controlType: 'range',
        priority: 20,
        rangeConfig: { min: 140, max: 200, step: 1, formatLabel: cmToFtIn },
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'heightCm',
          onboardingPath: 'height',
          matcherKind: 'range',
        },
      },
      {
        key: 'maritalStatus',
        label: 'Marital Status',
        controlType: 'multi-select',
        priority: 30,
        options: [
          { value: 'Never Married', label: 'Never Married (2,341)' },
          { value: 'Divorced', label: 'Divorced (643)' },
          { value: 'Widowed', label: 'Widowed (187)' },
          { value: 'Awaiting Divorce', label: 'Awaiting Divorce (96)' },
          { value: 'Annulled', label: 'Annulled (42)' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'maritalStatus',
          onboardingPath: 'maritalStatus',
          matcherKind: 'exact',
        },
      },
      {
        key: 'partnerHasChildren',
        label: 'Have children',
        controlType: 'multi-select',
        priority: 35,
        options: [
          { value: 'no', label: 'No (2,847)' },
          { value: 'yes_living_together', label: 'Yes, Living Together (312)' },
          { value: 'yes_not_living_together', label: 'Yes, Not Living Together (287)' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'hasChildren',
          matcherKind: 'exact',
        },
      },
      {
        key: 'profileManagedBy',
        label: 'Profile Managed By',
        controlType: 'multi-select',
        premium: true,
        priority: 40,
        options: [
          { value: 'Self', label: 'Self (1,982)' },
          { value: 'Parent', label: 'Parents / Guardian (1,043)', aliases: ['Parent', 'Parent / Guardian'] },
          { value: 'Other', label: 'Other (121)', aliases: [] },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'profileManagedBy',
          onboardingPath: 'profileFor',
          matcherKind: 'includes',
        },
      },
    ],
  },
  {
    id: 'religion',
    title: 'Religion & Community',
    priority: 30,
    filters: [
      {
        key: 'religion',
        label: 'Religion',
        controlType: 'multi-select',
        searchable: true,
        priority: 10,
        options: RELIGION_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'religion',
          onboardingPath: 'religion',
          matcherKind: 'exact',
        },
      },
      {
        key: 'community',
        label: 'Community',
        controlType: 'multi-select',
        searchable: true,
        priority: 20,
        options: ALL_COMMUNITY_FILTER_OPTIONS,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'community',
          onboardingPath: 'community + subCommunity',
          matcherKind: 'includes',
        },
      },
      {
        key: 'motherTongue',
        label: 'Mother Tongue',
        controlType: 'multi-select',
        searchable: true,
        priority: 30,
        options: MOTHER_TONGUE_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'motherTongue',
          onboardingPath: 'partnerPreference.motherTongue',
          matcherKind: 'exact',
          notes: 'Onboarding does not collect this today; currently from profile dataset.',
        },
      },
      {
        key: 'manglik',
        label: 'Manglik status',
        controlType: 'multi-select',
        priority: 40,
        options: [
          { value: 'manglik', label: 'Manglik (28)' },
          { value: 'angshik_manglik', label: 'Angshik Manglik (14)' },
          { value: 'non_manglik', label: 'Non\u2011Manglik (67)' },
          { value: 'dont_know', label: "Don't know (9)" },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'manglik',
          matcherKind: 'exact',
        },
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    priority: 40,
    filters: [
      {
        key: 'qualification',
        label: 'Education level',
        controlType: 'multi-select',
        searchable: true,
        priority: 10,
        options: EDUCATION_LEVEL_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'highestQualification',
          onboardingPath: 'qualification',
          matcherKind: 'derived',
          notes: 'Mapped from degree text to education level buckets.',
        },
      },
      {
        key: 'educationField',
        label: 'Education area',
        controlType: 'multi-select',
        searchable: true,
        priority: 20,
        options: FIELD_OF_STUDY_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'educationField',
          onboardingPath: 'qualification',
          matcherKind: 'exact',
        },
      },
    ],
  },
  {
    id: 'work',
    title: 'Work & Lifestyle',
    priority: 50,
    filters: [
      {
        key: 'workingWith',
        label: 'Employed in',
        controlType: 'multi-select',
        searchable: true,
        priority: 5,
        searchPlaceholder: 'Search employment type',
        options: WORKING_WITH_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'derived',
          profilePath: 'companyName + profession',
          onboardingPath: 'companyType',
          matcherKind: 'derived',
          notes: 'Derived from company and profession keywords.',
        },
      },
      {
        key: 'professionArea',
        label: 'Occupation area',
        controlType: 'multi-select',
        searchable: true,
        priority: 8,
        searchPlaceholder: 'Search occupation area',
        options: PROFESSION_AREA_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'professionArea',
          onboardingPath: 'workAs',
          matcherKind: 'exact',
        },
      },
      {
        key: 'profession',
        label: 'Working as',
        controlType: 'multi-select',
        searchable: true,
        priority: 10,
        options: WORKING_AS_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'profession',
          onboardingPath: 'workAs',
          matcherKind: 'includes',
        },
      },
      {
        key: 'incomeRangeInr',
        label: 'Annual income (₹ Lakh)',
        controlType: 'multi-select',
        premium: true,
        priority: 25,
        options: [
          { value: 'upto_5', label: 'Up to ₹5L' },
          { value: '5_to_10', label: '₹5–10L' },
          { value: '10_to_15', label: '₹10–15L' },
          { value: '15_to_25', label: '₹15–25L' },
          { value: '25_to_50', label: '₹25–50L' },
          { value: '50_plus', label: '₹50L+' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'annualIncome',
          matcherKind: 'derived',
        },
      },
      {
        key: 'incomeRangeUsd',
        label: 'Annual income (USD)',
        controlType: 'multi-select',
        premium: true,
        priority: 26,
        options: [
          { value: 'upto_50k', label: 'Under $50k' },
          { value: '50_to_100k', label: '$50–100k' },
          { value: '100_to_150k', label: '$100–150k' },
          { value: '150_to_200k', label: '$150–200k' },
          { value: '200k_plus', label: '$200k+' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'incomeUsdK',
          matcherKind: 'derived',
        },
      },
      {
        key: 'annualIncome',
        label: 'Annual Income (buckets)',
        controlType: 'multi-select',
        priority: 30,
        options: [
          { value: 'upto_12', label: 'Up to 12 Lakh' },
          { value: '12_to_18', label: '12 – 18 Lakh' },
          { value: '18_to_25', label: '18 – 25 Lakh' },
          { value: '25_plus', label: '25+ Lakh' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'annualIncome',
          onboardingPath: 'income',
          matcherKind: 'derived',
          notes: 'Parses rupee range strings into normalized income buckets.',
        },
      },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    priority: 60,
    filters: [
      {
        key: 'country',
        label: 'Country living in',
        controlType: 'multi-select',
        searchable: false,
        priority: 10,
        options: COUNTRY_LIVING_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'location.country',
          onboardingPath: 'livingIn',
          matcherKind: 'exact',
        },
      },
      {
        key: 'state',
        label: 'State living in',
        controlType: 'multi-select',
        searchable: true,
        priority: 20,
        options: STATE_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'location.state | state',
          onboardingPath: 'state',
          matcherKind: 'exact',
        },
      },
      {
        key: 'city',
        label: 'City',
        controlType: 'multi-select',
        searchable: true,
        priority: 30,
        options: [
          { value: 'Mumbai', label: 'Mumbai' },
          { value: 'Pune', label: 'Pune' },
          { value: 'Thane', label: 'Thane' },
          { value: 'Nashik', label: 'Nashik' },
          { value: 'Nagpur', label: 'Nagpur' },
          { value: 'Navi Mumbai', label: 'Navi Mumbai' },
          { value: 'Bengaluru', label: 'Bengaluru' },
          { value: 'Chennai', label: 'Chennai' },
          { value: 'Hyderabad', label: 'Hyderabad' },
          { value: 'New Delhi', label: 'New Delhi' },
          { value: 'Ahmedabad', label: 'Ahmedabad' },
          { value: 'Kolkata', label: 'Kolkata' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'location.city | city',
          onboardingPath: 'city',
          matcherKind: 'exact',
        },
      },
      {
        key: 'countryGrewUp',
        label: 'Country grew up in',
        controlType: 'multi-select',
        searchable: true,
        priority: 35,
        options: COUNTRY_LIVING_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'countryGrewUp',
          onboardingPath: 'native',
          matcherKind: 'exact',
        },
      },
      {
        key: 'residencyStatus',
        label: 'Residency Status',
        controlType: 'multi-select',
        searchable: false,
        premium: true,
        priority: 36,
        options: [
          { value: 'Citizen', label: 'Citizen' },
          { value: 'Permanent Resident', label: 'Permanent Resident' },
          { value: 'Student Visa', label: 'Student Visa' },
          { value: 'Temporary Visa', label: 'Temporary Visa' },
          { value: 'Work Permit', label: 'Work Permit' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'residencyStatus',
          matcherKind: 'exact',
        },
      },
      {
        key: 'diet',
        label: 'Eating habits',
        controlType: 'multi-select',
        searchable: false,
        priority: 38,
        options: DIET_OPTIONS.map((o) => ({ value: o.value, label: o.label, aliases: o.aliases })),
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'diet',
          onboardingPath: 'diet',
          matcherKind: 'includes',
        },
      },
      {
        key: 'nearBy',
        label: 'Near me (within 30km)',
        controlType: 'toggle',
        premium: true,
        priority: 40,
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'distanceKm',
          matcherKind: 'derived',
        },
      },
    ],
  },
  {
    id: 'family',
    title: 'Family Details',
    priority: 70,
    filters: [
      {
        key: 'familyType',
        label: 'Family Type',
        controlType: 'multi-select',
        priority: 10,
        options: [
          { value: 'Nuclear', label: 'Nuclear' },
          { value: 'Joint', label: 'Joint' },
          { value: 'Other', label: 'Other' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'family.familyType',
          onboardingPath: 'familyType',
          matcherKind: 'exact',
        },
      },
      {
        key: 'financialStatus',
        label: 'Financial Status',
        controlType: 'multi-select',
        priority: 20,
        options: [
          { value: 'Elite', label: 'Elite', aliases: ['Affluent'], description: 'Annual family income above ₹70 lakhs' },
          { value: 'High', label: 'High', aliases: ['Upper Middle Class'], description: 'Annual family income ₹30–70 lakhs' },
          { value: 'Middle', label: 'Middle', aliases: ['Middle Class'], description: 'Annual family income ₹10–30 lakhs' },
          { value: 'Aspiring', label: 'Aspiring', aliases: ['Lower Middle Class'], description: 'Annual family income up to ₹10 lakhs' },
        ],
        fieldContract: {
          dataSource: 'profile',
          profilePath: 'family.financialStatus',
          onboardingPath: 'financialStatus',
          matcherKind: 'exact',
        },
      },
    ],
  },
];

// ─────────────────────────────────────────────────────
// Active filter counting
// ─────────────────────────────────────────────────────

function isFilterActive(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.length > 0;
  return true;
}

function isSameFilterValue(current: unknown, baseline: unknown): boolean {
  if (Array.isArray(current) && Array.isArray(baseline)) {
    if (current.length !== baseline.length) return false;
    const stringArray =
      current.every((v) => typeof v === 'string') &&
      baseline.every((v) => typeof v === 'string');
    if (stringArray) {
      const left = [...(current as string[])].sort();
      const right = [...(baseline as string[])].sort();
      return left.every((v, i) => v === right[i]);
    }
    return current.every((v, i) => v === baseline[i]);
  }
  return current === baseline;
}

export function countActiveSharedFilters(
  filters: SharedFilterState,
  baseline: SharedFilterState = EMPTY_SHARED_FILTERS
): number {
  let count = 0;
  (Object.keys(filters) as SharedFilterKey[]).forEach((key) => {
    if (!isSameFilterValue(filters[key], baseline[key]) && isFilterActive(filters[key])) {
      count += 1;
    }
  });
  return count;
}

export function countCategoryActiveFilters(
  filters: SharedFilterState,
  categoryId: string,
  baseline: SharedFilterState = EMPTY_SHARED_FILTERS
): number {
  const cat = SHARED_FILTER_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return 0;
  return cat.filters.filter((f) => !isSameFilterValue(filters[f.key], baseline[f.key]) && isFilterActive(filters[f.key])).length;
}

// ─────────────────────────────────────────────────────
// Filter experience versions — three layout strategies (same SharedFilterState)
// ─────────────────────────────────────────────────────

export type FilterExperienceVersion = 'option1' | 'option2' | 'option3' | 'option4' | 'option5';

/** How the premium upsell appears when a free user taps a locked premium filter control. */
export type PremiumLockPromptPresentation = 'floating-card' | 'nested-bottom-sheet';

export type RightPaneStyle = 'flat' | 'sub-sectioned' | 'progressive';

export interface FilterSubSection {
  title: string;
  filterKeys: SharedFilterKey[];
}

export interface IterationCategoryConfig {
  id: string;
  title: string;
  filters: SharedFilterDefinition[];
  subSections?: FilterSubSection[];
}

export function getRightPaneStyle(iteration: FilterExperienceVersion): RightPaneStyle {
  return 'flat';
}

const ALL_FILTERS: Record<SharedFilterKey, SharedFilterDefinition> = Object.fromEntries(
  SHARED_FILTER_CATEGORIES.flatMap((cat) => cat.filters.map((f) => [f.key, f]))
) as Record<SharedFilterKey, SharedFilterDefinition>;

function pick(...keys: SharedFilterKey[]): SharedFilterDefinition[] {
  return keys.map((k) => ALL_FILTERS[k]).filter(Boolean);
}

export function getIterationCategories(iteration: FilterExperienceVersion, personaId?: string): IterationCategoryConfig[] {
  const basicDetailsFilters = shouldShowMaritalFiltersForPersona(personaId)
    ? pick('ageRange', 'heightRange', 'profileManagedBy', 'maritalStatus', 'partnerHasChildren', 'motherTongue')
    : pick('ageRange', 'heightRange', 'profileManagedBy', 'motherTongue');
  const ageBasicsFilters = shouldShowMaritalFiltersForPersona(personaId)
    ? pick('ageRange', 'heightRange', 'profileManagedBy', 'maritalStatus', 'partnerHasChildren')
    : pick('ageRange', 'heightRange', 'profileManagedBy');

  switch (iteration) {
    case 'option1':
      return [
        {
          id: 'quick',
          title: 'Quick Filters',
          filters: pick(
            'verified',
            'withPhoto',
            'recentlyJoined',
            'topColleges',
            'topMatches',
            'recentlyActive',
            'premiumProfiles',
            'nearBy'
          ),
        },
        { id: 'basic', title: 'Basic Details', filters: basicDetailsFilters },
        { id: 'religion', title: 'Religion & Community', filters: pick('religion', 'community', 'manglik') },
        { id: 'education', title: 'Education', filters: pick('qualification', 'educationField') },
        { id: 'career', title: 'Career', filters: pick('workingWith', 'professionArea', 'profession') },
        { id: 'income', title: 'Income', filters: pick('incomeRangeInr', 'incomeRangeUsd') },
        { id: 'location', title: 'Location', filters: pick('country', 'state', 'city') },
        { id: 'lifestyle_family', title: 'Lifestyle & Family', filters: pick('diet', 'familyType', 'financialStatus') },
      ];

    case 'option2': // (renumbered) Low-cognitive IA with quick+discovery leading
      return [
        { id: 'quick_filters', title: 'Quick Filters', filters: pick('verified', 'withPhoto', 'recentlyJoined') },
        {
          id: 'smart_discovery',
          title: 'Smart Discovery',
          filters: pick('topColleges', 'topMatches', 'recentlyActive', 'nearBy', 'premiumProfiles'),
        },
        { id: 'age_basics', title: 'Age & Basics', filters: ageBasicsFilters },
        { id: 'religion_community', title: 'Religion & Community', filters: pick('religion', 'community', 'manglik') },
        { id: 'mother_tongue', title: 'Mother Tongue', filters: pick('motherTongue') },
        { id: 'education', title: 'Education', filters: pick('qualification', 'educationField') },
        { id: 'career', title: 'Career', filters: pick('workingWith', 'professionArea', 'profession') },
        { id: 'income', title: 'Income', filters: pick('incomeRangeInr', 'incomeRangeUsd') },
        { id: 'location', title: 'Location', filters: pick('country', 'state', 'city') },
        { id: 'lifestyle_family', title: 'Lifestyle & Family', filters: pick('diet', 'familyType', 'financialStatus') },
      ];

    case 'option3': // (renumbered) Sticky quick chips on list; sheet excludes quick filters
      return [
        {
          id: 'smart_discovery',
          title: 'Smart Discovery',
          filters: pick('topColleges', 'topMatches', 'recentlyActive', 'nearBy', 'premiumProfiles'),
        },
        { id: 'age_basics', title: 'Age & Basics', filters: ageBasicsFilters },
        { id: 'religion_community', title: 'Religion & Community', filters: pick('religion', 'community', 'manglik') },
        { id: 'mother_tongue', title: 'Mother Tongue', filters: pick('motherTongue') },
        { id: 'education', title: 'Education', filters: pick('qualification', 'educationField') },
        { id: 'career', title: 'Career', filters: pick('workingWith', 'professionArea', 'profession') },
        { id: 'income', title: 'Income', filters: pick('incomeRangeInr', 'incomeRangeUsd') },
        { id: 'location', title: 'Location', filters: pick('country', 'state', 'city') },
        { id: 'lifestyle_family', title: 'Lifestyle & Family', filters: pick('diet', 'familyType', 'financialStatus') },
      ];

    case 'option4':
      return buildOption4CategoriesForPersona(personaId);

    case 'option5':
      return buildOption5CategoriesForPersona(personaId);

    default:
      return getIterationCategories('option1', personaId);
  }
}

// ─────────────────────────────────────────────────────
// Option 4 — Redesigned discovery categories
// ─────────────────────────────────────────────────────

const ALL_HOBBIES_OPTIONS = HOBBIES_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

/** Option 4 — Country living in (partner location). */
const OPTION4_COUNTRY_LIVING_IN_OPTIONS: FilterOption[] = [
  { value: 'India', label: 'India (2,847)' },
  { value: 'United States', label: 'USA (1,123)' },
  { value: 'United Kingdom', label: 'UK (456)' },
];

/** Option 4 — Country grew up in (subset + Kuwait). */
const OPTION4_COUNTRY_GREW_UP_IN_OPTIONS: FilterOption[] = [
  { value: 'India', label: 'India (999)' },
  { value: 'United States', label: 'USA (999)' },
  { value: 'United Kingdom', label: 'UK (456)' },
  { value: 'Kuwait', label: 'Kuwait (98)' },
];

const OPTION4_FAMILY_COUNTRY_OPTIONS_ALL: FilterOption[] = [
  { value: 'Mumbai', label: 'Mumbai (543)' },
  { value: 'Delhi NCR', label: 'Delhi NCR (487)' },
  { value: 'Bengaluru', label: 'Bengaluru (456)' },
  { value: 'Pune', label: 'Pune (398)' },
  { value: 'Hyderabad', label: 'Hyderabad (376)' },
  { value: 'Chennai', label: 'Chennai (344)' },
  { value: 'Ahmedabad', label: 'Ahmedabad (299)' },
  { value: 'Kolkata', label: 'Kolkata (276)' },
  { value: 'Jaipur', label: 'Jaipur (231)' },
  { value: 'Lucknow', label: 'Lucknow (219)' },
  { value: 'Surat', label: 'Surat (204)' },
  { value: 'Indore', label: 'Indore (187)' },
];

/** Partner “Country Living In” — Zaid (India-only); Arjun (US, India, UK). */
function getOption4PartnerCountryOptionsForPersona(personaId?: string): FilterOption[] {
  switch (personaId) {
    case 'zaid':
      return OPTION4_COUNTRY_LIVING_IN_OPTIONS.filter((o) => o.value === 'India');
    case 'arjun': {
      const order = ['United States', 'India', 'United Kingdom'];
      return order
        .map((v) => OPTION4_COUNTRY_LIVING_IN_OPTIONS.find((o) => o.value === v))
        .filter((o): o is FilterOption => o != null);
    }
    default:
      return OPTION4_COUNTRY_LIVING_IN_OPTIONS;
  }
}

/** Option 4 Family Location options (city/location centric). */
function getOption4FamilyCountryOptionsForPersona(personaId?: string): FilterOption[] {
  switch (personaId) {
    default:
      return OPTION4_FAMILY_COUNTRY_OPTIONS_ALL;
  }
}

const OPTION4_CATEGORIES: IterationCategoryConfig[] = [
  {
    id: 'quick',
    title: 'Quick Filters',
    filters: [
      {
        key: 'withPhoto',
        label: 'Profiles with Photos (2,156)',
        controlType: 'toggle',
        priority: 10,
        fieldContract: { dataSource: 'profile', profilePath: 'photos.full | imageUrl', matcherKind: 'toggle' },
      },
      {
        key: 'recentlyActive',
        label: 'Recently Active (1,892)',
        controlType: 'toggle',
        priority: 20,
        fieldContract: { dataSource: 'profile', profilePath: 'lastActive', matcherKind: 'derived' },
      },
      {
        key: 'recentlyJoined',
        label: 'Just Joined (432)',
        controlType: 'toggle',
        priority: 30,
        fieldContract: { dataSource: 'profile', profilePath: 'createdAt', matcherKind: 'derived' },
      },
      {
        key: 'verified',
        label: 'Verified Profiles (987)',
        controlType: 'toggle',
        priority: 40,
        fieldContract: { dataSource: 'profile', profilePath: 'verified.id | isVerified | badges', matcherKind: 'toggle' },
      },
      {
        key: 'premiumProfiles',
        label: 'Premium Members (543)',
        controlType: 'toggle',
        premium: true,
        priority: 50,
        fieldContract: { dataSource: 'profile', profilePath: 'isPremium | isVip', matcherKind: 'toggle' },
      },
      {
        key: 'topColleges',
        label: 'Top Colleges (312)',
        controlType: 'toggle',
        premium: true,
        priority: 60,
        fieldContract: { dataSource: 'profile', profilePath: 'collegeName', matcherKind: 'derived' },
      },
      {
        key: 'nearBy',
        label: 'Near me (156)',
        controlType: 'toggle',
        premium: true,
        priority: 70,
        fieldContract: { dataSource: 'profile', profilePath: 'distanceKm', matcherKind: 'derived' },
      },
    ],
  },
  {
    id: 'basic',
    title: 'Basic Details',
    filters: pick('ageRange', 'heightRange', 'profileManagedBy', 'maritalStatus', 'partnerHasChildren', 'manglik'),
  },
  {
    id: 'location',
    title: 'Location',
    filters: [
      {
        key: 'country' as SharedFilterKey,
        label: 'Country Living In',
        controlType: 'multi-select',
        priority: 10,
        options: OPTION4_COUNTRY_LIVING_IN_OPTIONS,
        fieldContract: { dataSource: 'profile', profilePath: 'location.country', matcherKind: 'exact' },
      },
      {
        key: 'state' as SharedFilterKey,
        label: 'State Living In',
        controlType: 'multi-select',
        priority: 20,
        options: [
          { value: 'Karnataka', label: 'Karnataka (987)' },
          { value: 'Maharashtra', label: 'Maharashtra (1,234)' },
          { value: 'Tamil Nadu', label: 'Tamil Nadu (765)' },
          { value: 'Telangana', label: 'Telangana (543)' },
          { value: 'Delhi', label: 'Delhi (876)' },
          { value: 'Gujarat', label: 'Gujarat (432)' },
          { value: 'Kerala', label: 'Kerala (398)' },
          { value: 'West Bengal', label: 'West Bengal (287)' },
          { value: 'California', label: 'California (312)' },
          { value: 'New Jersey', label: 'New Jersey (187)' },
          { value: 'Texas', label: 'Texas (143)' },
          { value: 'New York', label: 'New York (198)' },
          { value: 'London', label: 'London (234)' },
          { value: 'Birmingham', label: 'Birmingham (98)' },
          { value: 'Ontario', label: 'Ontario (142)' },
          { value: 'British Columbia', label: 'British Columbia (87)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'location.state', matcherKind: 'exact' },
      },
      {
        key: 'city' as SharedFilterKey,
        label: 'City Living In',
        controlType: 'multi-select',
        priority: 30,
        // First 5 are "popular" — rendered with a "Popular Cities" header + divider in the custom location pane.
        // Remaining entries follow alphabetically.
        options: [
          { value: 'Bengaluru', label: 'Bengaluru (876)' },
          { value: 'Mumbai', label: 'Mumbai (1,043)' },
          { value: 'Hyderabad', label: 'Hyderabad (654)' },
          { value: 'Chennai', label: 'Chennai (543)' },
          { value: 'Pune', label: 'Pune (487)' },
          // ↑ top 5 popular — divider rendered below these in custom pane
          { value: 'Ahmedabad', label: 'Ahmedabad (312)' },
          { value: 'Delhi NCR', label: 'Delhi NCR (432)' },
          { value: 'Houston', label: 'Houston (98)' },
          { value: 'Kolkata', label: 'Kolkata (234)' },
          { value: 'London', label: 'London (198)' },
          { value: 'Mysuru', label: 'Mysuru (156)' },
          { value: 'Nashik', label: 'Nashik (123)' },
          { value: 'New Delhi', label: 'New Delhi (543)' },
          { value: 'New York City', label: 'New York City (143)' },
          { value: 'San Francisco Bay Area', label: 'San Francisco Bay Area (187)' },
          { value: 'Toronto', label: 'Toronto (112)' },
          { value: 'Vancouver', label: 'Vancouver (76)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'location.city', matcherKind: 'exact' },
      },
      {
        key: 'countryGrewUp',
        label: 'Country grew up in',
        controlType: 'multi-select',
        priority: 40,
        options: [...OPTION4_COUNTRY_GREW_UP_IN_OPTIONS],
        fieldContract: { dataSource: 'profile', profilePath: 'countryGrewUp', matcherKind: 'exact' },
      },
      {
        key: 'residencyStatus',
        label: 'Residency Status',
        controlType: 'multi-select',
        premium: true,
        priority: 50,
        options: [
          {
            value: 'citizen_or_permanent_resident',
            label: 'Citizen / Permanent Resident (710)',
          },
          {
            value: 'work_or_student_visa',
            label: 'Work / Student Visa (510)',
          },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'residencyStatus', matcherKind: 'exact' },
      },
    ],
  },
  {
    id: 'religion',
    title: 'Religion',
    filters: [
      {
        key: 'religion' as SharedFilterKey,
        label: 'Religion',
        controlType: 'multi-select',
        skipResolve: true,
        priority: 10,
        options: [
          { value: 'Hindu', label: 'Hindu (1,241)' },
          { value: 'Jain', label: 'Jain (143)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'religion', matcherKind: 'exact' },
      },
    ],
  },
  {
    id: 'mother_tongue',
    title: 'Mother Tongue',
    filters: [
      {
        key: 'motherTongue' as SharedFilterKey,
        label: 'Mother Tongue',
        controlType: 'multi-select',
        priority: 10,
        options: [
          { value: 'Hindi', label: 'Hindi (1,248)' },
          { value: 'English', label: 'English (934)' },
          { value: 'Bengali', label: 'Bengali (612)' },
          { value: 'Telugu', label: 'Telugu (1,234)' },
          { value: 'Marathi', label: 'Marathi (654)' },
          { value: 'Tamil', label: 'Tamil (987)' },
          { value: 'Gujarati', label: 'Gujarati (312)' },
          { value: 'Kannada', label: 'Kannada (743)' },
          { value: 'Malayalam', label: 'Malayalam (534)' },
          { value: 'Odia', label: 'Odia (221)' },
          { value: 'Punjabi', label: 'Punjabi (487)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'motherTongue', matcherKind: 'exact' },
      },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    filters: [
      {
        key: 'community' as SharedFilterKey,
        label: 'Community',
        controlType: 'multi-select',
        searchable: true,
        skipResolve: true,
        priority: 10,
        // South Indian communities listed first, sorted by profile count
        options: [
          { value: 'Reddy', label: 'Reddy (743)' },
          { value: 'Kamma', label: 'Kamma (612)' },
          { value: 'Brahmin', label: 'Brahmin (534)' },
          { value: 'Vokkaliga', label: 'Vokkaliga (489)' },
          { value: 'Nair', label: 'Nair (423)' },
          { value: 'Lingayat', label: 'Lingayat (387)' },
          { value: 'Iyer', label: 'Iyer (312)' },
          { value: 'Patel', label: 'Patel (287)' },
          { value: 'Maratha', label: 'Maratha (243)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'community', matcherKind: 'includes' },
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    filters: [
      {
        key: 'qualification' as SharedFilterKey,
        label: 'Education Level',
        controlType: 'multi-select',
        priority: 10,
        options: [
          { value: 'less_than_high_school', label: 'Less than high school (143)' },
          { value: 'high_school', label: 'High school (298)' },
          { value: 'diploma', label: 'Diploma (387)' },
          { value: 'associate', label: 'Associate (221)' },
          { value: 'honors_professional', label: 'Honors (312)' },
          { value: 'bachelors', label: "Bachelor's (999)" },
          { value: 'masters', label: "Master's (768)" },
          { value: 'doctorate', label: 'Doctorate (154)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'highestQualification', onboardingPath: 'qualification', matcherKind: 'derived' },
      },
      {
        key: 'educationField' as SharedFilterKey,
        label: 'Education Area',
        controlType: 'multi-select',
        priority: 20,
        options: [
          { value: 'Arts / Design', label: 'Arts / Design (198)' },
          { value: 'Computers / IT', label: 'Computers / IT (654)' },
          { value: 'Doctor', label: 'Doctor (176)' },
          { value: 'Engineering', label: 'Engineering (876)' },
          { value: 'Finance / Commerce', label: 'Finance / Commerce (432)' },
          { value: 'Law', label: 'Law (143)' },
          { value: 'Management', label: 'Management (543)' },
          { value: 'Medicine', label: 'Medicine (345)' },
          { value: 'Science', label: 'Science (234)' },
          { value: 'Others', label: 'Others (287)' },
          { value: 'Non-Graduate', label: 'Non-Graduate (156)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'educationField', onboardingPath: 'qualification', matcherKind: 'exact' },
      },
    ],
  },
  {
    id: 'career',
    title: 'Career',
    filters: [
      {
        key: 'workingWith' as SharedFilterKey,
        label: 'Employed in',
        controlType: 'multi-select',
        priority: 10,
        searchPlaceholder: 'Search employment type',
        options: [
          { value: 'Private Company', label: 'Private Company (999)' },
          { value: 'Business / Self Employed', label: 'Business / self-employed (543)' },
          { value: 'Government / Public Sector', label: 'Government / Public Sector (432)' },
          { value: 'Defense / Civil Services', label: 'Defense / Civil Services (198)' },
          { value: 'Not working', label: 'Not working (198)' },
          { value: 'Other', label: 'Other (156)' },
        ],
        fieldContract: { dataSource: 'derived', profilePath: 'companyName + profession', onboardingPath: 'companyType', matcherKind: 'derived' },
      },
      {
        key: 'professionArea' as SharedFilterKey,
        label: 'Occupation area',
        controlType: 'multi-select',
        searchable: true,
        priority: 20,
        searchPlaceholder: 'Search occupation area',
        options: [
          { value: 'Accounting, Banking & Finance', label: 'Accounting, Banking & Finance (432)' },
          { value: 'Administration & HR', label: 'Administration & HR (287)' },
          { value: 'Advertising, Media & Entertainment', label: 'Advertising, Media & Entertainment (198)' },
          { value: 'Agriculture', label: 'Agriculture (143)' },
          { value: 'Airline & Aviation', label: 'Airline & Aviation (112)' },
          { value: 'Architecture & Design', label: 'Architecture & Design (176)' },
          { value: 'Artists, Animators & Web Designers', label: 'Artists, Animators & Web Designers (156)' },
          { value: 'Beauty, Fashion & Jewellery Designers', label: 'Beauty, Fashion & Jewellery Designers (121)' },
          { value: 'BPO, KPO, & Customer Support', label: 'BPO, KPO, & Customer Support (243)' },
          { value: 'Civil Services / Law Enforcement', label: 'Civil Services / Law Enforcement (132)' },
          { value: 'Corporate Professionals', label: 'Corporate Professionals (654)' },
          { value: 'Defense', label: 'Defense (109)' },
          { value: 'Education & Training', label: 'Education & Training (312)' },
          { value: 'Engineering', label: 'Engineering (287)' },
          { value: 'Hotel & Hospitality', label: 'Hotel & Hospitality (166)' },
          { value: 'IT & Software Engineering', label: 'IT & Software Engineering (999)' },
          { value: 'Legal', label: 'Legal (143)' },
          { value: 'Medical & Healthcare', label: 'Medical & Healthcare (543)' },
          { value: 'Merchant Navy', label: 'Merchant Navy (87)' },
          { value: 'Non Working', label: 'Non Working (198)' },
          { value: 'Sales & Marketing', label: 'Sales & Marketing (321)' },
          { value: 'Science', label: 'Science (234)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'professionArea', onboardingPath: 'workAs', matcherKind: 'exact' },
      },
    ],
  },
  {
    id: 'income',
    title: 'Income',
    filters: [
      {
        key: 'incomeRangeInr' as SharedFilterKey,
        label: 'Annual Income (₹)',
        controlType: 'multi-select',
        premium: true,
        priority: 10,
        options: [
          { value: '0_to_5', label: '₹0 – 5 lakh (234)' },
          { value: '5_to_10', label: '₹5 – 10 lakh (567)' },
          { value: '10_to_15', label: '₹10 – 15 lakh (892)' },
          { value: '15_to_25', label: '₹15 – 25 lakh (743)' },
          { value: '25_to_50', label: '₹25 – 50 lakh (521)' },
          { value: '50l_to_1cr', label: '₹50 lakh – ₹1 crore (287)' },
          { value: '1cr_plus', label: '₹1 crore+ (143)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'annualIncome', matcherKind: 'derived' },
      },
      {
        key: 'incomeRangeUsd' as SharedFilterKey,
        label: 'Annual Income ($)',
        controlType: 'multi-select',
        premium: true,
        priority: 20,
        options: [
          { value: 'upto_50k', label: 'Under $50k (123)' },
          { value: '50_to_100k', label: '$50 – 100k (312)' },
          { value: '100_to_150k', label: '$100 – 150k (234)' },
          { value: '150_to_200k', label: '$150 – 200k (187)' },
          { value: '200k_plus', label: '$200k+ (98)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'incomeUsdK', matcherKind: 'derived' },
      },
    ],
  },
  {
    id: 'family',
    title: 'Family',
    filters: [
      {
        key: 'familyType' as SharedFilterKey,
        label: 'Family Type',
        controlType: 'multi-select',
        priority: 10,
        options: [
          { value: 'Nuclear', label: 'Nuclear (1,432)' },
          { value: 'Joint', label: 'Joint (876)' },
          { value: 'Not Disclosed', label: 'Not Disclosed (543)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'family.familyType', matcherKind: 'exact' },
      },
      {
        key: 'financialStatus' as SharedFilterKey,
        label: 'Financial Status',
        controlType: 'multi-select',
        priority: 20,
        options: [
          { value: 'Elite', label: 'Elite (234)', description: 'Annual family income above ₹70 lakh' },
          { value: 'High', label: 'High (543)', description: 'Annual family income ₹30–70 lakh' },
          { value: 'Middle', label: 'Middle (987)', description: 'Annual family income ₹10–30 lakh' },
          { value: 'Aspiring', label: 'Aspiring (312)', description: 'Annual family income up to ₹10 lakh' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'family.financialStatus', matcherKind: 'exact' },
      },
      {
        key: 'familyCountry' as SharedFilterKey,
        label: 'Family Location',
        controlType: 'multi-select',
        searchable: true,
        priority: 30,
        options: OPTION4_FAMILY_COUNTRY_OPTIONS_ALL,
        fieldContract: { dataSource: 'profile', profilePath: 'familyCountry', matcherKind: 'exact' },
      },
    ],
  },
  {
    id: 'diet',
    title: 'Diet',
    filters: [
      {
        key: 'diet' as SharedFilterKey,
        label: 'Diet',
        controlType: 'multi-select',
        priority: 10,
        options: [
          { value: 'Non-Vegetarian', label: 'Non-veg (999)' },
          { value: 'Vegetarian', label: 'Vegetarian (987)' },
          { value: 'Occasionally Non-Vegetarian', label: 'Occasionally non-veg (654)' },
          { value: 'Eggetarian', label: 'Eggetarian (423)' },
          { value: 'Vegan', label: 'Vegan (198)' },
          { value: 'Jain', label: 'Jain (87)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'diet', matcherKind: 'includes' },
      },
    ],
  },
  {
    id: 'hobbies',
    title: 'Hobbies & Interests',
    filters: [
      {
        key: 'hobbies' as SharedFilterKey,
        label: 'Hobbies & Interests',
        controlType: 'multi-select',
        searchable: true,
        priority: 10,
        options: [
          { value: 'Writing', label: 'Writing (284)' },
          { value: 'Cooking', label: 'Cooking (654)' },
          { value: 'Singing', label: 'Singing (521)' },
          { value: 'Photography', label: 'Photography (534)' },
          { value: 'Playing instruments', label: 'Playing instruments (263)' },
          { value: 'Painting', label: 'Painting (246)' },
          { value: 'DIY crafts', label: 'DIY crafts (178)' },
          { value: 'Dancing', label: 'Dancing (598)' },
          { value: 'Acting', label: 'Acting (156)' },
          { value: 'Poetry', label: 'Poetry (132)' },
          { value: 'Gardening', label: 'Gardening (211)' },
          { value: 'Blogging', label: 'Blogging (143)' },
          { value: 'Content creation', label: 'Content creation (334)' },
          { value: 'Designing', label: 'Designing (287)' },
          { value: 'Doodling', label: 'Doodling (167)' },
          { value: 'Movies', label: 'Movies (487)' },
          { value: 'Music', label: 'Music (876)' },
          { value: 'Travelling', label: 'Travelling (999)' },
          { value: 'Reading', label: 'Reading (743)' },
          { value: 'Sports', label: 'Sports (632)' },
          { value: 'Social media', label: 'Social media (598)' },
          { value: 'Gaming', label: 'Gaming (476)' },
          { value: 'Binge-watching', label: 'Binge-watching (454)' },
          { value: 'Biking', label: 'Biking (286)' },
          { value: 'Clubbing', label: 'Clubbing (198)' },
          { value: 'Shopping', label: 'Shopping (623)' },
          { value: 'Theater & Events', label: 'Theater & Events (244)' },
          { value: 'Anime', label: 'Anime (221)' },
          { value: 'Stand ups', label: 'Stand ups (154)' },
          { value: 'Running', label: 'Running (398)' },
          { value: 'Cycling', label: 'Cycling (367)' },
          { value: 'Yoga & Meditation', label: 'Yoga & Meditation (512)' },
          { value: 'Walking', label: 'Walking (289)' },
          { value: 'Working out', label: 'Working out (577)' },
          { value: 'Trekking', label: 'Trekking (341)' },
          { value: 'Aerobics/Zumba', label: 'Aerobics/Zumba (198)' },
          { value: 'Swimming', label: 'Swimming (287)' },
          { value: 'Pets', label: 'Pets (276)' },
          { value: 'Foodie', label: 'Foodie (667)' },
          { value: 'Vegan', label: 'Vegan (198)' },
          { value: 'News & Politics', label: 'News & Politics (233)' },
          { value: 'Social service', label: 'Social service (199)' },
          { value: 'Entrepreneurship', label: 'Entrepreneurship (312)' },
          { value: 'Home decor', label: 'Home decor (187)' },
          { value: 'Investments', label: 'Investments (298)' },
          { value: 'Fashion & beauty', label: 'Fashion & beauty (356)' },
        ],
        fieldContract: { dataSource: 'profile', profilePath: 'hobbies', matcherKind: 'includes' },
      },
    ],
  },
];

/** Option 5 — same as Option 4 except Photo is a separate sidebar category between Quick Filters and Basic Details. */
const OPTION5_QUICK_FILTERS = OPTION4_CATEGORIES.find((c) => c.id === 'quick')!.filters.filter(
  (f) => f.key !== 'withPhoto'
);

const OPTION5_CATEGORIES: IterationCategoryConfig[] = [
  {
    id: 'quick',
    title: 'Quick Filters',
    filters: OPTION5_QUICK_FILTERS,
  },
  {
    id: 'photo_visibility',
    title: 'Photo',
    filters: [],
  },
  ...OPTION4_CATEGORIES.filter((c) => c.id !== 'quick'),
];

// ─────────────────────────────────────────────────────
// Option4 — persona-specific community options
// ─────────────────────────────────────────────────────

function getCommunityOptionsForPersona(personaId?: string): FilterOption[] {
  switch (personaId) {
    case 'arjun': // Hindu · Punjabi / North Indian communities
      return [
        { value: 'Brahmin', label: 'Brahmin (534)' },
        { value: 'Rajput', label: 'Rajput (398)' },
        { value: 'Maratha', label: 'Maratha (472)' },
        { value: 'Jat', label: 'Jat (423)' },
        { value: 'Yadav', label: 'Yadav (367)' },
        { value: 'Bania / Vaishya', label: 'Bania / Vaishya (344)' },
        { value: 'Kayastha', label: 'Kayastha (298)' },
        { value: 'Reddy', label: 'Reddy (743)' },
        { value: 'Patidar / Patel', label: 'Patidar / Patel (321)' },
        { value: 'Nair', label: 'Nair (423)' },
        { value: 'Ezhava / Thiyya', label: 'Ezhava / Thiyya (244)' },
        { value: 'Vokkaliga', label: 'Vokkaliga (489)' },
        { value: 'Lingayat', label: 'Lingayat (387)' },
        { value: 'Kamma', label: 'Kamma (612)' },
        { value: 'Kapu', label: 'Kapu (256)' },
        { value: 'Nadar', label: 'Nadar (231)' },
        { value: 'Kurmi', label: 'Kurmi (219)' },
        { value: 'Bhumihar', label: 'Bhumihar (206)' },
        { value: 'SC (Scheduled Caste)', label: 'SC (Scheduled Caste) (342)' },
        { value: 'ST (Scheduled Tribe)', label: 'ST (Scheduled Tribe) (274)' },
      ];
    case 'zaid': // Muslim communities
      return [
        { value: 'Sunni', label: 'Sunni (543)' },
        { value: 'Syed', label: 'Syed (312)' },
        { value: 'Sheikh', label: 'Sheikh (287)' },
        { value: 'Pathan', label: 'Pathan (198)' },
        { value: 'Ansari', label: 'Ansari (176)' },
        { value: 'Mughal', label: 'Mughal (112)' },
        { value: 'Shia', label: 'Shia (143)' },
        { value: 'Bohra', label: 'Bohra (87)' },
      ];
    default: // priya — South Indian Hindu communities
      return [
        { value: 'Brahmin', label: 'Brahmin (534)' },
        { value: 'Rajput', label: 'Rajput (398)' },
        { value: 'Maratha', label: 'Maratha (472)' },
        { value: 'Jat', label: 'Jat (423)' },
        { value: 'Yadav', label: 'Yadav (367)' },
        { value: 'Bania / Vaishya', label: 'Bania / Vaishya (344)' },
        { value: 'Kayastha', label: 'Kayastha (298)' },
        { value: 'Reddy', label: 'Reddy (743)' },
        { value: 'Patidar / Patel', label: 'Patidar / Patel (321)' },
        { value: 'Vokkaliga', label: 'Vokkaliga (489)' },
        { value: 'Nair', label: 'Nair (423)' },
        { value: 'Ezhava / Thiyya', label: 'Ezhava / Thiyya (244)' },
        { value: 'Lingayat', label: 'Lingayat (387)' },
        { value: 'Kamma', label: 'Kamma (612)' },
        { value: 'Kapu', label: 'Kapu (256)' },
        { value: 'Nadar', label: 'Nadar (231)' },
        { value: 'Kurmi', label: 'Kurmi (219)' },
        { value: 'Bhumihar', label: 'Bhumihar (206)' },
        { value: 'SC (Scheduled Caste)', label: 'SC (Scheduled Caste) (342)' },
        { value: 'ST (Scheduled Tribe)', label: 'ST (Scheduled Tribe) (274)' },
      ];
  }
}

/** Shared persona overrides for Option 4 / Option 5 discovery layouts (community, location, family country, basic block). */
function mapOptionDiscoveryCategoriesForPersona(
  categories: IterationCategoryConfig[],
  personaId?: string,
  options?: { forceMaritalFilters?: boolean }
): IterationCategoryConfig[] {
  const communityOptions = getCommunityOptionsForPersona(personaId);
  const partnerCountryOptions = getOption4PartnerCountryOptionsForPersona(personaId);
  const familyCountryOptions = getOption4FamilyCountryOptionsForPersona(personaId);
  const forceMaritalFilters = options?.forceMaritalFilters ?? false;
  const basicFiltersRaw = forceMaritalFilters
    ? pick('ageRange', 'heightRange', 'profileManagedBy', 'maritalStatus', 'partnerHasChildren', 'manglik')
    : shouldShowMaritalFiltersForPersona(personaId)
      ? pick('ageRange', 'heightRange', 'profileManagedBy', 'maritalStatus', 'partnerHasChildren', 'manglik')
      : pick('ageRange', 'heightRange', 'profileManagedBy', 'manglik');
  const basicFilters = basicFiltersRaw.map((f) =>
    f.key === 'partnerHasChildren' ? { ...f, label: 'Has Children' } : f
  );

  return categories.map((cat) => {
    if (cat.id === 'basic') {
      return { ...cat, filters: basicFilters };
    }
    if (cat.id === 'community') {
      return {
        ...cat,
        filters: cat.filters.map((f) =>
          f.key === 'community' ? { ...f, options: communityOptions } : f
        ),
      };
    }
    if (cat.id === 'location') {
      return {
        ...cat,
        filters: cat.filters.map((f) =>
          f.key === 'country' ? { ...f, options: partnerCountryOptions } : f
        ),
      };
    }
    if (cat.id === 'family') {
      return {
        ...cat,
        filters: cat.filters.map((f) =>
          f.key === 'familyCountry' ? { ...f, options: familyCountryOptions } : f
        ),
      };
    }
    return cat;
  });
}

function buildOption4CategoriesForPersona(personaId?: string): IterationCategoryConfig[] {
  return mapOptionDiscoveryCategoriesForPersona(OPTION4_CATEGORIES, personaId, { forceMaritalFilters: true });
}

function buildOption5CategoriesForPersona(personaId?: string): IterationCategoryConfig[] {
  return mapOptionDiscoveryCategoriesForPersona(OPTION5_CATEGORIES, personaId);
}

// Inject option4 into getIterationCategories via re-export hook
export function getOption4Categories(): IterationCategoryConfig[] {
  return OPTION4_CATEGORIES;
}

export function getOption5Categories(): IterationCategoryConfig[] {
  return OPTION5_CATEGORIES;
}

export function countIterationCategoryActiveFilters(
  filters: SharedFilterState,
  category: IterationCategoryConfig,
  baseline: SharedFilterState = EMPTY_SHARED_FILTERS,
  iteration?: FilterExperienceVersion
): number {
  let n = category.filters.filter((f) => !isSameFilterValue(filters[f.key], baseline[f.key]) && isFilterActive(filters[f.key])).length;
  if (iteration === 'option5' && category.id === 'photo_visibility') {
    if (!isSameFilterValue(filters.photoVisibility, baseline.photoVisibility) && isFilterActive(filters.photoVisibility)) {
      n += 1;
    }
  }
  return n;
}
