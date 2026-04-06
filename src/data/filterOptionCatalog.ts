/**
 * Large option lists and religion→community mapping for shared filters.
 * Matchers use value strings consistently with Profile mock data where possible.
 */

export interface CatalogOption {
  value: string;
  label: string;
  aliases?: string[];
}

export const RELIGION_OPTIONS: CatalogOption[] = [
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Muslim', label: 'Muslim' },
  { value: 'Christian', label: 'Christian' },
  { value: 'Sikh', label: 'Sikh' },
  { value: 'Buddhist', label: 'Buddhist' },
  { value: 'Jain', label: 'Jain' },
  { value: 'Parsi', label: 'Parsi' },
  { value: 'Jewish', label: 'Jewish' },
  { value: 'Spiritual', label: 'Spiritual (not religious)' },
  { value: 'Other', label: 'Other' },
];

const HINDU_COMMUNITIES: CatalogOption[] = [
  { value: 'Maratha', label: 'Maratha' },
  { value: '96 Kuli Maratha', label: '96 Kuli Maratha' },
  { value: 'Kunbi', label: 'Kunbi' },
  { value: 'Brahmin', label: 'Brahmin' },
  { value: 'Deshastha Brahmin', label: 'Deshastha Brahmin' },
  { value: 'Karhade Brahmin', label: 'Karhade Brahmin' },
  { value: 'Kokastha Brahmin', label: 'Kokastha Brahmin' },
  { value: 'Iyer', label: 'Iyer' },
  { value: 'Iyengar', label: 'Iyengar' },
  { value: 'Nair', label: 'Nair' },
  { value: 'Namboothiri', label: 'Namboothiri' },
  { value: 'Reddy', label: 'Reddy' },
  { value: 'Kamma', label: 'Kamma' },
  { value: 'Kapu', label: 'Kapu' },
  { value: 'Vokkaliga', label: 'Vokkaliga' },
  { value: 'Lingayat', label: 'Lingayat' },
  { value: 'Patel', label: 'Patel' },
  { value: 'Leva Patel', label: 'Leva Patel' },
  { value: 'Agarwal', label: 'Agarwal' },
  { value: 'Baniya', label: 'Baniya' },
  { value: 'Gupta', label: 'Gupta' },
  { value: 'Khatri', label: 'Khatri' },
  { value: 'Arora', label: 'Arora' },
  { value: 'Rajput', label: 'Rajput' },
  { value: 'Jat', label: 'Jat' },
  { value: 'Yadav', label: 'Yadav' },
  { value: 'Kshatriya', label: 'Kshatriya' },
  { value: 'Vaishya', label: 'Vaishya' },
  { value: 'Kayastha', label: 'Kayastha' },
  { value: 'Lohana', label: 'Lohana' },
  { value: 'Bhumihar', label: 'Bhumihar' },
  { value: 'Kurmi', label: 'Kurmi' },
  { value: 'Sonar', label: 'Sonar' },
  { value: 'Teli', label: 'Teli' },
  { value: 'Nai', label: 'Nai' },
  { value: 'Scheduled Caste', label: 'Scheduled Caste' },
  { value: 'Scheduled Tribe', label: 'Scheduled Tribe' },
  { value: 'CKP', label: 'CKP' },
  { value: 'Bhandari', label: 'Bhandari' },
  { value: 'Other Hindu', label: 'Other Hindu' },
];

const MUSLIM_COMMUNITIES: CatalogOption[] = [
  { value: 'Sunni', label: 'Sunni' },
  { value: 'Shia', label: 'Shia' },
  { value: 'Bohra', label: 'Bohra' },
  { value: 'Khoja', label: 'Khoja' },
  { value: 'Memon', label: 'Memon' },
  { value: 'Pathan', label: 'Pathan' },
  { value: 'Syed', label: 'Syed' },
  { value: 'Sheikh', label: 'Sheikh' },
  { value: 'Ansari', label: 'Ansari' },
  { value: 'Other Muslim', label: 'Other Muslim' },
];

const CHRISTIAN_COMMUNITIES: CatalogOption[] = [
  { value: 'Roman Catholic', label: 'Roman Catholic' },
  { value: 'Syrian Catholic', label: 'Syrian Catholic' },
  { value: 'Latin Catholic', label: 'Latin Catholic' },
  { value: 'Malankara Orthodox', label: 'Malankara Orthodox' },
  { value: 'CSI', label: 'CSI' },
  { value: 'Pentecostal', label: 'Pentecostal' },
  { value: 'Baptist', label: 'Baptist' },
  { value: 'Methodist', label: 'Methodist' },
  { value: 'Anglican', label: 'Anglican' },
  { value: 'Protestant (Other)', label: 'Protestant (Other)' },
  { value: 'Other Christian', label: 'Other Christian' },
];

const SIKH_COMMUNITIES: CatalogOption[] = [
  { value: 'Jat Sikh', label: 'Jat Sikh' },
  { value: 'Ramgarhia', label: 'Ramgarhia' },
  { value: 'Khatri Sikh', label: 'Khatri Sikh' },
  { value: 'Arora Sikh', label: 'Arora Sikh' },
  { value: 'Mazhabi', label: 'Mazhabi' },
  { value: 'Other Sikh', label: 'Other Sikh' },
];

const JAIN_COMMUNITIES: CatalogOption[] = [
  { value: 'Shwetambar', label: 'Shwetambar' },
  { value: 'Digambar', label: 'Digambar' },
  { value: 'Other Jain', label: 'Other Jain' },
];

const BUDDHIST_COMMUNITIES: CatalogOption[] = [
  { value: 'Theravada', label: 'Theravada' },
  { value: 'Mahayana', label: 'Mahayana' },
  { value: 'Navayana', label: 'Navayana' },
  { value: 'Other Buddhist', label: 'Other Buddhist' },
];

const PARSI_COMMUNITIES: CatalogOption[] = [{ value: 'Parsi', label: 'Parsi' }, { value: 'Irani', label: 'Irani' }];

const JEWISH_COMMUNITIES: CatalogOption[] = [
  { value: 'Ashkenazi', label: 'Ashkenazi' },
  { value: 'Sephardi', label: 'Sephardi' },
  { value: 'Other Jewish', label: 'Other Jewish' },
];

const GENERIC_COMMUNITIES: CatalogOption[] = [{ value: 'Prefer not to say', label: 'Prefer not to say' }];

const RELIGION_TO_COMMUNITIES: Record<string, CatalogOption[]> = {
  Hindu: HINDU_COMMUNITIES,
  Muslim: MUSLIM_COMMUNITIES,
  Christian: CHRISTIAN_COMMUNITIES,
  Sikh: SIKH_COMMUNITIES,
  Jain: JAIN_COMMUNITIES,
  Buddhist: BUDDHIST_COMMUNITIES,
  Parsi: PARSI_COMMUNITIES,
  Jewish: JEWISH_COMMUNITIES,
  Spiritual: GENERIC_COMMUNITIES,
  Other: GENERIC_COMMUNITIES,
};

function dedupeOptions(opts: CatalogOption[]): CatalogOption[] {
  const seen = new Set<string>();
  const out: CatalogOption[] = [];
  for (const o of opts) {
    if (seen.has(o.value)) continue;
    seen.add(o.value);
    out.push(o);
  }
  return out;
}

/** Returns communities grouped by religion — only when 2+ religions are selected. */
export function getCommunityGroupsForReligions(religions: string[]): { religion: string; communities: CatalogOption[] }[] {
  if (religions.length < 2) return [];
  return religions
    .filter((r) => RELIGION_TO_COMMUNITIES[r])
    .map((r) => ({ religion: r, communities: RELIGION_TO_COMMUNITIES[r] }));
}

/** When no religion selected: union of all communities (open to all). */
export function getCommunityOptionsForReligions(religions: string[]): CatalogOption[] {
  if (!religions.length) {
    const all = Object.values(RELIGION_TO_COMMUNITIES).flat();
    return dedupeOptions([...all, ...GENERIC_COMMUNITIES]);
  }
  const merged = religions.flatMap((r) => RELIGION_TO_COMMUNITIES[r] || []);
  return dedupeOptions(merged.length ? merged : [...GENERIC_COMMUNITIES]);
}

export const MOTHER_TONGUE_OPTIONS: CatalogOption[] = [
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Odia', label: 'Odia' },
  { value: 'Assamese', label: 'Assamese' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Konkani', label: 'Konkani' },
  { value: 'Kashmiri', label: 'Kashmiri' },
  { value: 'Sindhi', label: 'Sindhi' },
  { value: 'Sanskrit', label: 'Sanskrit' },
];

export const COUNTRY_LIVING_OPTIONS: CatalogOption[] = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'France', label: 'France' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Mauritius', label: 'Mauritius' },
  { value: 'Other', label: 'Other' },
];

export const STATE_OPTIONS: CatalogOption[] = [
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Goa', label: 'Goa' },
];

/** Cities by Indian state value (subset for prototype). */
export const CITIES_BY_STATE: Record<string, CatalogOption[]> = {
  Maharashtra: [
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Thane', label: 'Thane' },
    { value: 'Nagpur', label: 'Nagpur' },
    { value: 'Nashik', label: 'Nashik' },
    { value: 'Navi Mumbai', label: 'Navi Mumbai' },
    { value: 'Aurangabad', label: 'Aurangabad' },
  ],
  Karnataka: [
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Mysuru', label: 'Mysuru' },
    { value: 'Mangaluru', label: 'Mangaluru' },
    { value: 'Hubli', label: 'Hubli' },
  ],
  'Tamil Nadu': [
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Coimbatore', label: 'Coimbatore' },
    { value: 'Madurai', label: 'Madurai' },
  ],
  Delhi: [{ value: 'New Delhi', label: 'New Delhi' }, { value: 'Delhi NCR', label: 'Delhi NCR' }],
  Gujarat: [
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    { value: 'Surat', label: 'Surat' },
    { value: 'Vadodara', label: 'Vadodara' },
  ],
  Telangana: [{ value: 'Hyderabad', label: 'Hyderabad' }, { value: 'Warangal', label: 'Warangal' }],
};

export function getCityOptionsForStates(states: string[], countryFilters: string[]): CatalogOption[] {
  const indiaSelected = countryFilters.length === 0 || countryFilters.includes('India');
  if (!indiaSelected || states.length === 0) {
    return [
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Bengaluru', label: 'Bengaluru' },
      { value: 'Chennai', label: 'Chennai' },
      { value: 'Hyderabad', label: 'Hyderabad' },
      { value: 'New Delhi', label: 'New Delhi' },
      { value: 'Ahmedabad', label: 'Ahmedabad' },
      { value: 'Kolkata', label: 'Kolkata' },
    ];
  }
  const merged = states.flatMap((s) => CITIES_BY_STATE[s] || []);
  return dedupeOptions(merged);
}

export const EDUCATION_LEVEL_OPTIONS: CatalogOption[] = [
  { value: 'less_than_high_school', label: 'Less than high school' },
  { value: 'high_school', label: 'High school' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'associate', label: 'Associate' },
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'honors_professional', label: 'Honors / Professional cert' },
];

export const FIELD_OF_STUDY_OPTIONS: CatalogOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Finance / Commerce', label: 'Finance / Commerce' },
  { value: 'Management', label: 'Management' },
  { value: 'Science', label: 'Science' },
  { value: 'Arts / Design', label: 'Arts / Design' },
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Computers / IT', label: 'Computers / IT' },
  { value: 'Law', label: 'Law' },
];

export const PROFESSION_AREA_OPTIONS: CatalogOption[] = [
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Banking & Finance', label: 'Banking & Finance' },
  { value: 'IT & Software Engineering', label: 'IT & Software Engineering' },
  { value: 'Medical & Healthcare', label: 'Medical & Healthcare' },
  { value: 'Administration & HR', label: 'Administration & HR' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Sales & Marketing', label: 'Sales & Marketing' },
  { value: 'Education & Training', label: 'Education & Training' },
  { value: 'Corporate Professionals', label: 'Corporate Professionals' },
  { value: 'Beauty, Fashion & Jewellery', label: 'Beauty, Fashion & Jewellery' },
  { value: 'BPO, KPO & Customer Support', label: 'BPO, KPO & Customer Support' },
  { value: 'Others', label: 'Others' },
  { value: 'Architecture & Design', label: 'Architecture & Design' },
  { value: 'Advertising, Media & Entertainment', label: 'Advertising, Media & Entertainment' },
  { value: 'Artists, Animators & Web Designers', label: 'Artists, Animators & Web Designers' },
];

export const WORKING_AS_OPTIONS: CatalogOption[] = [
  { value: 'Banking Professional', label: 'Banking Professional' },
  { value: 'Software Consultant', label: 'Software Consultant' },
  { value: 'Doctor', label: 'Doctor' },
  { value: 'Nurse', label: 'Nurse' },
  { value: 'Civil Engineer', label: 'Civil Engineer' },
  { value: 'Marketing Professional', label: 'Marketing Professional' },
  { value: 'Sales Professional', label: 'Sales Professional' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Consultant / Supervisor / Team Lead', label: 'Consultant / Supervisor / Team Lead' },
  { value: 'Admin Professional', label: 'Admin Professional' },
  { value: 'Customer Support / KPO Professional', label: 'Customer Support / KPO Professional' },
  { value: 'Non-IT Engineer', label: 'Non-IT Engineer' },
  { value: 'Medical / Healthcare (Others)', label: 'Medical / Healthcare (Others)' },
  { value: 'Team Member / Staff', label: 'Team Member / Staff' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'CA', label: 'CA' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'HR Professional', label: 'HR Professional' },
  { value: 'Scientist', label: 'Scientist' },
  { value: 'Researcher', label: 'Researcher' },
  { value: 'UX Designer', label: 'UX Designer' },
  { value: 'Chartered Accountant', label: 'Chartered Accountant' },
  { value: 'Homemaker', label: 'Homemaker' },
  { value: 'Student', label: 'Student' },
  { value: 'Retired', label: 'Retired' },
  { value: 'Other', label: 'Other' },
];

export const WORKING_WITH_OPTIONS: CatalogOption[] = [
  { value: 'Private Company', label: 'Private Company' },
  { value: 'Business / Self Employed', label: 'Business / Self Employed' },
  { value: 'Government / Public Sector', label: 'Government / Public Sector' },
  { value: 'Not working', label: 'Not working' },
  { value: 'Defense / Civil Services', label: 'Defense / Civil Services' },
  { value: 'Other', label: 'Other' },
];

export const DIET_OPTIONS: CatalogOption[] = [
  { value: 'Non-Vegetarian', label: 'Non-veg' },
  { value: 'Occasionally Non-Vegetarian', label: 'Occasionally non-veg' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Eggetarian', label: 'Eggetarian' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Jain', label: 'Jain' },
];

/** Known “top” colleges for prototype “Top Colleges” filter (substring match on collegeName). */
export const TOP_COLLEGE_SUBSTRINGS = [
  'IIT',
  'IIM',
  'AIIMS',
  'BITS',
  'NIT',
  'XLRI',
  'ISB',
  'JNU',
  'St. Stephen',
];

export const HOBBIES_OPTIONS: CatalogOption[] = [
  { value: 'Travel', label: 'Travel' },
  { value: 'Music', label: 'Music' },
  { value: 'Reading', label: 'Reading' },
  { value: 'Cooking', label: 'Cooking' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Movies', label: 'Movies' },
  { value: 'Dancing', label: 'Dancing' },
  { value: 'Hiking', label: 'Hiking' },
  { value: 'Art & Craft', label: 'Art & Craft' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Yoga', label: 'Yoga' },
  { value: 'Cricket', label: 'Cricket' },
  { value: 'Cycling', label: 'Cycling' },
  { value: 'Writing', label: 'Writing' },
  { value: 'Gardening', label: 'Gardening' },
  { value: 'Volunteering', label: 'Volunteering' },
  { value: 'Meditation', label: 'Meditation' },
  { value: 'Podcasts', label: 'Podcasts' },
  { value: 'Theatre', label: 'Theatre' },
  { value: 'Swimming', label: 'Swimming' },
  { value: 'Badminton', label: 'Badminton' },
  { value: 'Chess', label: 'Chess' },
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Spirituality', label: 'Spirituality' },
];
