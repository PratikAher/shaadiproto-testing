import type { InboxRequest } from '../app/components/inbox/InboxReceivedView';
import type { Profile } from '../app/components/matches/ProfileCard';
import { CURRENT_USER } from './currentUser';
import { getCommunityOptionsForReligions, MOTHER_TONGUE_OPTIONS } from './filterOptionCatalog';

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function intBetween(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function chance(rng: Rng, p: number): boolean {
  return rng() < p;
}

function sampleNormalLike(rng: Rng): number {
  // Triangular distribution in [-1, 1], decent for “natural-ish” variation.
  return (rng() + rng() - 1);
}

function formatIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatIsoDateTime(d: Date): string {
  // Keep it simple; existing mock data uses ISO with offset.
  return d.toISOString();
}

const FEMALE_FIRST_NAMES = [
  'Aarohi', 'Ananya', 'Riya', 'Ishita', 'Kavya', 'Mrunal', 'Prajakta', 'Shreya', 'Sneha', 'Tanvi',
  'Aisha', 'Rhea', 'Sanjana', 'Ankita', 'Rashmi', 'Vedika', 'Pooja', 'Neha', 'Gargi', 'Prachi',
  'Sakshi', 'Nandini', 'Meera', 'Ira', 'Aditi', 'Diya', 'Simran', 'Tanya', 'Shruti', 'Payal',
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Gupta', 'Joshi', 'Kulkarni', 'Deshmukh', 'Jadhav', 'Pawar', 'Bhosale', 'Chavan',
  'Mehta', 'Iyer', 'Reddy', 'Nair', 'Singh', 'Khan', 'Verma', 'Bansal', 'Saxena', 'Malhotra',
];

// NOTE: These must align with `SharedFilterState` option values used by filters UI.
// The app’s baseline partner-preference uses full state names (e.g. Maharashtra),
// not abbreviations (e.g. MH), so the simulator uses full names too.
const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Thane', state: 'Maharashtra', country: 'India' },
  { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India' },
  { city: 'Nashik', state: 'Maharashtra', country: 'India' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
];

const PREFERRED_CITIES = ['Mumbai', 'Bengaluru', 'Pune', 'Nashik'] as const;
const PREFERRED_COMMUNITIES = ['Maratha', '96 Kuli Maratha', 'Kunbi'] as const;

const PROFESSIONS = [
  { profession: 'Software Engineer', area: 'IT & Software Engineering', edu: 'B.E / B.Tech', field: 'Computer Science', company: 'Infosys' },
  { profession: 'Product Manager', area: 'Management', edu: 'MBA', field: 'Management', company: 'Amazon' },
  { profession: 'Data Scientist', area: 'IT & Software Engineering', edu: 'MS', field: 'Analytics', company: 'Microsoft' },
  { profession: 'Chartered Accountant', area: 'Banking & Finance', edu: 'CA', field: 'Finance', company: 'KPMG' },
  { profession: 'Doctor', area: 'Medical & Healthcare', edu: 'MBBS', field: 'Medicine', company: 'Fortis' },
  { profession: 'Consultant', area: 'Management', edu: 'MBA', field: 'Management', company: 'Deloitte' },
  { profession: 'Founder', area: 'Business / Self Employed', edu: 'B.E / B.Tech', field: 'Engineering', company: 'Self' },
];

const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Occasionally Non-Vegetarian'] as const;
const MARITAL_STATUS = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'] as const;
const PROFILE_MANAGED_BY = ['Self', 'Parent'] as const;

const CONNECT_MESSAGES = [
  'Hi, I came across your profile and would love to connect and know you better.',
  'Hello! Your profile resonated with me. Would you be open to a chat?',
  'Hi! I liked your profile and thought we could be a good match. Let’s connect?',
  'Namaste! Would love to know more about you and your family.',
  'Hey, I noticed we share similar values. Would you like to take this forward?',
  'Hi! I’m interested in connecting. If you’re comfortable, we can chat here first.',
];

const TIMESTAMPS = [
  'few hours ago',
  '2 hours ago',
  '5 hours ago',
  'yesterday',
  '1 day ago',
  '2 days ago',
  '3 days ago',
  'last week',
];

function makeDisplayId(rng: Rng): string {
  const n = intBetween(rng, 10000000, 99999999);
  return `SH${n}`;
}

function makeEmail(first: string, last: string, i: number): string {
  return `${first.toLowerCase()}.${last.toLowerCase()}${String(i).padStart(3, '0')}@example.com`;
}

function makePhone(rng: Rng): string {
  const tail = intBetween(rng, 100000000, 999999999);
  return `+91-${tail}`;
}

function makeIncome(rng: Rng): string {
  // Skew toward mid/high incomes for “high-appeal”, but keep variety.
  const bucket = rng();
  if (bucket < 0.12) return '₹6–10 Lakh';
  if (bucket < 0.35) return '₹10–18 Lakh';
  if (bucket < 0.62) return '₹18–25 Lakh';
  if (bucket < 0.82) return '₹25–50 Lakh';
  return '₹50+ Lakh';
}

function makeLastActive(rng: Rng, now: Date): { isOnline: boolean; lastActive: string } {
  const online = chance(rng, 0.22);
  if (online) {
    const mins = intBetween(rng, 1, 12);
    const d = new Date(now.getTime() - mins * 60_000);
    return { isOnline: true, lastActive: formatIsoDateTime(d) };
  }
  const hours = intBetween(rng, 2, 72);
  const d = new Date(now.getTime() - hours * 60_60_000);
  return { isOnline: false, lastActive: formatIsoDateTime(d) };
}

function makeCreatedAt(rng: Rng, now: Date): string {
  // Joined within last 180 days, skew to recent.
  const days = clamp(Math.round(Math.abs(sampleNormalLike(rng)) * 45 + rng() * 60), 1, 180);
  const d = new Date(now.getTime() - days * 24 * 60_60_000);
  return formatIsoDate(d);
}

function makeDistanceKm(rng: Rng): number {
  // Mostly within 30km, with some outliers.
  const u = rng();
  if (u < 0.78) return intBetween(rng, 1, 30);
  if (u < 0.93) return intBetween(rng, 31, 75);
  return intBetween(rng, 76, 250);
}

function makeBadges(rng: Rng, isPremium: boolean): string[] {
  const badges: string[] = [];
  if (chance(rng, 0.35)) badges.push('Blue Tick');
  if (chance(rng, isPremium ? 0.30 : 0.12)) badges.push('Top Picks');
  return badges;
}

function makeFamily(rng: Rng) {
  const financialStatus = pickOne(rng, ['Aspiring', 'Middle', 'High', 'Elite'] as const);
  const familyType = pickOne(rng, ['Nuclear', 'Joint'] as const);
  return {
    fatherProfession: pickOne(rng, ['Business', 'Engineer', 'Government', 'Professor', 'Doctor'] as const),
    motherProfession: pickOne(rng, ['Homemaker', 'Teacher', 'Doctor', 'Professor'] as const),
    siblings: { brothers: intBetween(rng, 0, 2), sisters: intBetween(rng, 0, 2) },
    financialStatus,
    familyType,
    nativePlace: pickOne(rng, ['Mumbai, Maharashtra', 'Pune, Maharashtra', 'Nashik, Maharashtra', 'Kolhapur, Maharashtra'] as const),
    parentsContact: '**********',
  };
}

function makeAboutMe(rng: Rng, first: string, profession: string, city: string): string {
  const templates = [
    `I’m ${first}, working as a ${profession} in ${city}. I value clarity, kindness, and strong family bonds. I enjoy travelling, fitness, and good conversations.`,
    `Hi, I’m ${first}. I’m a ${profession} based in ${city}. I’m career-driven but grounded, and I’m looking for a genuine connection with mutual respect.`,
    `Hello! I’m ${first}, a ${profession} in ${city}. I enjoy books, food explorations, and weekend trips. Hoping to meet someone kind and emotionally mature.`,
  ];
  return pickOne(rng, templates);
}

export function generateInboxRequests(count: number, seed: number): InboxRequest[] {
  const rng = mulberry32(seed);
  const now = new Date();

  // Constraint: senders are same religion as current user (per requirement).
  const religion = CURRENT_USER.religion;
  const communities = getCommunityOptionsForReligions([religion]).map((o) => o.value);
  const motherTongues = MOTHER_TONGUE_OPTIONS.map((o) => o.value);

  const out: InboxRequest[] = [];
  for (let i = 0; i < count; i += 1) {
    const first = pickOne(rng, FEMALE_FIRST_NAMES);
    const last = pickOne(rng, LAST_NAMES);
    const name = `${first} ${last}`;
    const age = clamp(Math.round(27 + sampleNormalLike(rng) * 5), 22, 40);
    const heightCm = clamp(Math.round(170 + sampleNormalLike(rng) * 7), 160, 196);

    const distanceKm = makeDistanceKm(rng);
    const locBase = distanceKm <= 40 ? CITIES : CITIES;
    const location = chance(rng, 0.85)
      ? locBase.find((c) => c.city === pickOne(rng, PREFERRED_CITIES)) ?? pickOne(rng, locBase)
      : pickOne(rng, locBase);

    const prof = pickOne(rng, PROFESSIONS);
    const isPremium = chance(rng, 0.38);
    const isVip = isPremium && chance(rng, 0.12);

    const { isOnline, lastActive } = makeLastActive(rng, now);
    const createdAt = makeCreatedAt(rng, now);

    const profile: Profile = {
      id: `sim_f_${seed}_${String(i).padStart(4, '0')}`,
      displayId: makeDisplayId(rng),
      name,
      gender: 'female',
      birthDate: `${now.getFullYear() - age}-${String(intBetween(rng, 1, 12)).padStart(2, '0')}-${String(intBetween(rng, 1, 28)).padStart(2, '0')}`,
      age,
      maritalStatus: pickOne(rng, MARITAL_STATUS),
      profileManagedBy: pickOne(rng, PROFILE_MANAGED_BY),
      aboutMe: makeAboutMe(rng, first, prof.profession, location.city),
      // No photos/images (gray placeholders handled in UI)
      photos: { full: '', avatar: '' },
      imageUrl: '',
      isOnline,
      lastActive,
      badges: makeBadges(rng, isPremium),
      location: { city: location.city, state: location.state, country: location.country },
      religion,
      community: chance(rng, 0.75)
        ? pickOne(rng, PREFERRED_COMMUNITIES)
        : (communities.length ? pickOne(rng, communities) : CURRENT_USER.community),
      motherTongue: pickOne(rng, motherTongues),
      diet: pickOne(rng, DIETS),
      horoscopeSign: pickOne(rng, ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'] as const),
      profession: prof.profession,
      companyName: prof.company,
      annualIncome: makeIncome(rng),
      highestQualification: prof.edu,
      educationField: prof.field,
      collegeName: chance(rng, 0.22) ? pickOne(rng, ['IIT', 'NIT', 'BITS', 'COEP', 'NMIMS', 'SPJIMR'] as const) : 'Mumbai University',
      family: makeFamily(rng),
      contact: { email: makeEmail(first, last, i), phone: makePhone(rng) },
      astroMatchScore: clamp(Math.round(76 + rng() * 24), 60, 99),
      verified: { id: chance(rng, 0.46), selfie: chance(rng, 0.52) },
      heightCm,
      distanceKm,
      createdAt,
      updatedAt: formatIsoDate(now),
      isPremium,
      isVip,
      professionArea: (prof as any).area,
      countryGrewUp: chance(rng, 0.88) ? 'India' : pickOne(rng, ['United States', 'United Kingdom', 'United Arab Emirates'] as const),
      incomeUsdK: chance(rng, 0.12) ? intBetween(rng, 80, 300) : undefined,
      manglik: pickOne(rng, ['no', 'yes', 'unknown'] as const),
    };

    out.push({
      profile,
      message: pickOne(rng, CONNECT_MESSAGES),
      timestamp: pickOne(rng, TIMESTAMPS),
    });
  }
  return out;
}

