import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MobileWrapper } from './components/MobileWrapper';
import { Button } from './components/Button';
import { Chip } from './components/Chip';
import { SelectChip } from './components/SelectChip';
import { SelectChipShowcase } from './components/SelectChipShowcase';
import { Input } from './components/Input';
import { FloatingLabelInput } from './components/FloatingLabelInput';
import { FilterBar } from './components/FilterBar';
import { ExperimentSettingsPanel, USER_PERSONAS, type CurrentUserPersona } from './components/ExperimentSettingsPanel';
import { 
  Moon, 
  Sun, 
  Cat, 
  Search,
  Plus,
  Save,
  ArrowRight,
  Palette,
  Type,
  LayoutGrid,
  BoxSelect,
  TextCursorInput,
  ChevronLeft,
  Tag,
  Shapes,
  Sparkles,
  Play,
  MessageSquare,
  Phone,
  User
} from 'lucide-react';
import { cn } from '../utils/cn';
import { 
  CrownIcon, CrownFilledIcon,
  ChatIcon, ChatFilledIcon,
  HomeIcon, HomeFilledIcon,
  InboxIcon, InboxFilledIcon,
  MatchesIcon, MatchesFilledIcon,
  HamburgerIcon, HamburgerFilledIcon,
  NotificationIcon, NotificationFilledIcon,
  SearchIcon as CustomSearchIcon, SearchFilledIcon,
  FilterIcon, FilterFilledIcon,
  TickIcon, TickFilledIcon,
  MoreIcon, MoreFilledIcon,
  CameraIcon, CameraFilledIcon,
  PhotoIcon, PhotoFilledIcon,
  VerificationIcon, VerificationFilledIcon,
  BackArrowIcon, BackArrowFilledIcon,
  CallIcon, CallFilledIcon,
  WhatsAppIcon, WhatsAppFilledIcon,
  AstroIcon, AstroFilledIcon,
  NavigationIcon, NavigationFilledIcon
} from './components/icons';
import { MatchesView } from './components/matches/MatchesView';
import { ProfileCard } from './components/matches/ProfileCard';
import type { Profile } from './components/matches/ProfileCard';
import { MOCK_PROFILES, SIA_MOCK_PROFILES, NEW_PROFILES, DAILY_PROFILES, MY_MATCHES_PROFILES, MORE_MATCHES_PROFILES } from '../data/mockProfiles';
import { TOP_COLLEGE_SUBSTRINGS } from '../data/filterOptionCatalog';
import { ProfileCardScreen } from './components/screens/ProfileCardScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { ProfileForScreen } from './components/screens/ProfileForScreen';
import { PictorialsShowcase } from './components/PictorialsShowcase';
import { ProfileImagesShowcase } from './components/ProfileImagesShowcase';
import { RegistrationFlow } from './components/screens/RegistrationFlow';
import { ConnectMessageSheet, replaceNameInMessage, type SolutionVariant, SiaIcon, SiaLogo, SiaLogoV2, SiaLogoV3, SiaLogoV4, AiRetryIcon, SiaGeneratingState, TypingCursor } from './components/matches/ConnectMessageSheet';
import { ConnectMessageScreen } from './components/screens/ConnectMessageScreen';
import { SiaOnboardingScreen } from './components/screens/SiaOnboardingScreen';
import { PremiumUpgradeScreen } from './components/screens/PremiumUpgradeScreen';

import WhatsAppButton from '../imports/CircularButtons-8002-144';
import CallButton from '../imports/CircularButtons-8002-323';
import { motion, AnimatePresence } from 'motion/react';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { FullProfileView } from './components/matches/FullProfileView';
import { EditProfileView } from './components/matches/EditProfileView';
import { CURRENT_USER } from '../data/currentUser';
import { SideDrawer } from './components/SideDrawer';
import { InboxReceivedView } from './components/inbox/InboxReceivedView';
import { MOCK_INBOX_REQUESTS } from '../data/mockInboxRequests';
import { generateInboxRequests } from '../data/inboxSimulation';
import { InboxSubHeader } from './components/inbox/InboxSubHeader';
import type { SortOption, ViewMode } from './components/inbox/InboxSubHeader';
import { SharedFilterBottomSheet } from './components/filters/SharedFilterBottomSheet';
import {
  PARTNER_PREFERENCE_BASELINE_FILTERS,
  getBaselineFiltersForPersona,
  countActiveSharedFilters,
  type FilterExperienceVersion,
  type SharedFilterState,
} from './components/filters/sharedFilters';
import { InboxListView } from './components/inbox/InboxListView';
import { InboxTabs } from './components/inbox/InboxTabs';
import { ChatListView } from './components/chat/ChatListView';
import { ChatConversationScreen } from './components/chat/ChatConversationScreen';
import type { ConnectionStatus } from './components/chat/ChatConversationScreen';
import { PromisingMatchesControllerModal, PromisingMatchesPanel, type PromisingMatchesVariant, type Option3SubVariant } from './components/chat/PromisingMatches';
import { MOCK_CONVERSATIONS, MOCK_CONVERSATIONS_V1, MOCK_ONLINE_USERS, createConversationFromAccept, createConversationFromOnlineUser } from '../data/mockChats';
import type { ChatConversation, OnlineUser, ChatMessage } from '../data/mockChats';

// MeowUI App
export default function App() {
  /** Figma HTML capture: full reload clears React state; use `?figmaCaptureInboxSortOpen=1` (before `#`) to re-open Inbox sort menu for snapshots. */
  const figmaCaptureInboxSortOpen = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('figmaCaptureInboxSortOpen');
  }, []);

  /* Theme + navigation state - MeowUI */
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCurrentUserPremium, setIsCurrentUserPremium] = useState(CURRENT_USER.isPremium);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [useGreenGradient, setUseGreenGradient] = useState(true);
  
  // Navigation State — when figmaCaptureInboxSortOpen, start on Inbox for capture-after-reload
  const [activeMainTab, setActiveMainTab] = useState<'home' | 'matches' | 'inbox' | 'chat' | 'premium'>(() =>
    figmaCaptureInboxSortOpen ? 'inbox' : 'matches'
  );
  const [activeDesignSection, setActiveDesignSection] = useState<'menu' | 'foundations' | 'components' | 'inputs' | 'icons' | 'pictorials' | 'animations' | 'profile_images'>('menu');
  const [activeScreen, setActiveScreen] = useState<'profile_card' | 'onboarding' | 'profile_for' | 'registration' | 'connect_message' | 'edit_profile' | 'sia_onboarding' | 'sia_onboarding_2' | 'premium_upgrade' | 'chat_version_one' | null>(null);
  const previousTabRef = useRef<'home' | 'matches' | 'inbox' | 'chat'>('matches');
  const connectingFromChatRef = useRef(false);
  
  // Premium overlay state (for smooth slide-in from SIA onboarding)
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

  // Matches Filter State
  const [currentUserPersona, setCurrentUserPersona] = useState<CurrentUserPersona>(USER_PERSONAS[0]);
  const defaultBaseline = useMemo(() => getBaselineFiltersForPersona(USER_PERSONAS[0].id), []);

  const [matchesFilter, setMatchesFilter] = useState('daily');
  const [matchesFilters, setMatchesFilters] = useState<SharedFilterState>(defaultBaseline);
  const [showMatchesFilterSheet, setShowMatchesFilterSheet] = useState(false);
  const [isMatchesSearchOpen, setIsMatchesSearchOpen] = useState(false);
  const [matchesSearchQuery, setMatchesSearchQuery] = useState('');
  
  // Inbox State
  const [inboxFilter, setInboxFilter] = useState('received');
  const [inboxDismissedIds, setInboxDismissedIds] = useState<Set<string>>(new Set());
  const [useInboxSimulation, setUseInboxSimulation] = useState(false);
  
  // Inbox Filter, Sort & View State
  const [inboxSortOption, setInboxSortOption] = useState<SortOption>(() =>
    figmaCaptureInboxSortOpen ? 'oldest' : 'recommended'
  );
  const [inboxViewMode, setInboxViewMode] = useState<ViewMode>('card');
  const [inboxFilters, setInboxFilters] = useState<SharedFilterState>(defaultBaseline);
  const [showInboxFilterSheet, setShowInboxFilterSheet] = useState(false);
  const [showPremiumFromFilters, setShowPremiumFromFilters] = useState(false);
  const [inboxSubHeaderScrolled, setInboxSubHeaderScrolled] = useState(false);

  // Full Profile View State
  const [fullViewProfileIndex, setFullViewProfileIndex] = useState<number | null>(null);
  const [fullViewSource, setFullViewSource] = useState<'matches' | 'inbox'>('matches');

  // Chat State
  const [activeChatConversation, setActiveChatConversation] = useState<ChatConversation | null>(null);
  const [chatFilter, setChatFilter] = useState('all');
  const [chatV1Filter, setChatV1Filter] = useState('all');
  const [promisingMatchesVariant, setPromisingMatchesVariant] = useState<PromisingMatchesVariant>('option1');
  const [option3SubVariant, setOption3SubVariant] = useState<Option3SubVariant>('3a');
  const [showPromisingMatchesController, setShowPromisingMatchesController] = useState(false);
  const [option3Expanded, setOption3Expanded] = useState(false);
  const [option3ActiveIndex, setOption3ActiveIndex] = useState(0);
  const [acceptedConversations, setAcceptedConversations] = useState<ChatConversation[]>([]);
  // Persisted messages map: profileId → ChatMessage[]
  const [persistedMessages, setPersistedMessages] = useState<Record<string, ChatMessage[]>>({});
  // Track last activity timestamp per profile for sorting recent chats
  const [chatActivityTs, setChatActivityTs] = useState<Record<string, number>>({});

  // All conversations = pre-seeded + dynamically accepted from inbox/online
  // Merge persisted messages, then sort by most recent activity (last messaged = top)
  const allConversations = [...acceptedConversations, ...MOCK_CONVERSATIONS].map(c => {
    const saved = persistedMessages[c.profile.id];
    const activityTs = chatActivityTs[c.profile.id] ?? c.lastActivityTs;
    if (saved && saved.length > 0) {
      return { ...c, messages: saved, lastMessage: saved[saved.length - 1].text, lastMessageTime: saved[saved.length - 1].timestamp, lastActivityTs: activityTs };
    }
    return { ...c, lastActivityTs: activityTs };
  }).sort((a, b) => b.lastActivityTs - a.lastActivityTs);

  // Filter online users: remove profiles that already appear in Recent Chats
  const conversationProfileIds = new Set(allConversations.map(c => c.profile.id));
  const filteredOnlineUsers = MOCK_ONLINE_USERS.filter(u => !conversationProfileIds.has(u.profile.id));
  const chatV1ConversationProfileIds = new Set(MOCK_CONVERSATIONS_V1.map(c => c.profile.id));
  const filteredOnlineUsersV1 = MOCK_ONLINE_USERS.filter(u => !chatV1ConversationProfileIds.has(u.profile.id));
  const chatV1Conversations = chatV1Filter === 'unread'
    ? MOCK_CONVERSATIONS_V1.filter(c => c.unreadCount > 0)
    : MOCK_CONVERSATIONS_V1;
  const chatV2Conversations = chatFilter === 'unread'
    ? allConversations.filter(c => c.unreadCount > 0)
    : allConversations;

  // Profiles in active chats (accepted from inbox / messaged from online) should be
  // excluded from Matches tab AND Inbox so they only appear in Recent Chats
  const chattingProfileIds = new Set(acceptedConversations.map(c => c.profile.id));
  const simulatedInboxRequests = useMemo(
    () => generateInboxRequests(500, 1337),
    []
  );
  const inboxDataSource = useInboxSimulation ? simulatedInboxRequests : MOCK_INBOX_REQUESTS;
  const inboxPendingRequestsRaw = inboxDataSource.filter(
    r => !inboxDismissedIds.has(r.profile.id) && !chattingProfileIds.has(r.profile.id)
  );
  const promisingMatches = inboxPendingRequestsRaw.slice(0, 4);
  const shouldShowPromisingMatches = activeMainTab === 'chat' && chatFilter === 'all' && !activeChatConversation && promisingMatches.length > 0;

  // ═══ Shared Filtering (Matches + Inbox) ═══
  const normalizeText = (value?: string | null) => (value || '').trim().toLowerCase();
  const normalizeState = (value?: string | null) => {
    const val = normalizeText(value);
    const stateAliases: Record<string, string> = {
      maharashtra: 'mh',
      karnataka: 'ka',
      'tamil nadu': 'tn',
      delhi: 'dl',
      gujarat: 'gj',
      telangana: 'ts',
      andhra: 'ap',
      'andhra pradesh': 'ap',
      kerala: 'kl',
    };
    return stateAliases[val] || val;
  };
  const normalizeCountry = (value?: string | null) => {
    const t = normalizeText(value);
    const map: Record<string, string> = {
      usa: 'united states',
      us: 'united states',
      uk: 'united kingdom',
      uae: 'united arab emirates',
    };
    return map[t] || t;
  };
  const normalizeDiet = (value?: string | null) => {
    const val = normalizeText(value).replace(/\./g, '');
    if (val.includes('occasionally non') || val.includes('non-vegetarian') || val.includes('non vegetarian')) {
      return 'non-vegetarian';
    }
    return val;
  };
  const normalizeFinancialStatus = (value?: string | null) => {
    const val = normalizeText(value);
    if (val === 'affluent' || val === 'elite') return 'elite';
    if (val === 'upper middle class' || val === 'high') return 'high';
    if (val === 'middle class' || val === 'middle') return 'middle';
    if (val === 'lower middle class' || val === 'aspiring') return 'aspiring';
    return val;
  };
  const inferWorkingWith = (profile: Profile) => {
    const hay = `${profile.companyName || ''} ${profile.profession || ''}`.toLowerCase();
    if (/(not working|home ?maker|student|unemployed)/.test(hay)) return 'Not working';
    if (/(army|navy|air force|defence|defense|civil service)/.test(hay)) return 'Defense / Civil Services';
    if (/(government|public sector|railway|ias|ips|police)/.test(hay)) return 'Government / Public Sector';
    if (/(self|freelance|entrepreneur|founder|business|owner)/.test(hay)) return 'Business / Self Employed';
    return 'Private Company';
  };
  const profileEducationLevelBucket = (profile: Profile): string => {
    const q = normalizeText(profile.highestQualification || '');
    if (!q) return '';
    if (/\b(ph\.?d|doctorate|doctor\s+of)\b/.test(q)) return 'doctorate';
    if (/\b(m\.|mba|master|m\.tech|ms\b|md\b|mtech)\b/.test(q)) return 'masters';
    if (/\b(b\.|be\b|btech|bachelor|b\.e|b\.tech|graduate)\b/.test(q)) return 'bachelors';
    if (/\b(diploma|polytechnic)\b/.test(q)) return 'diploma';
    if (/\b(associate|assoc\.)\b/.test(q)) return 'associate';
    if (/\b(high school|hsc|ssc|12th|10th)\b/.test(q)) return 'high_school';
    if (/\b(less than|below|dropout)\b/.test(q)) return 'less_than_high_school';
    if (/\b(ca\b|cs\b|cma|honors|honours)\b/.test(q)) return 'honors_professional';
    return 'bachelors';
  };
  const mapEducationFieldToFilter = (raw?: string | null): string => {
    const t = normalizeText(raw);
    if (!t) return '';
    if (/it|software|computer|developer|programming|tech/.test(t)) return 'computers / it';
    if (/medic|health|mbbs|nurse|clinical/.test(t)) return 'medicine';
    if (/law|legal|llb|llm/.test(t)) return 'law';
    if (/finance|commerce|account|ca\b|banking/.test(t)) return 'finance / commerce';
    if (/manag|business admin|mba/.test(t)) return 'management';
    if (/design|art|creative|fashion/.test(t)) return 'arts / design';
    if (/scienc|physics|chemistry|bio/.test(t)) return 'science';
    if (/engineer|mechanical|civil|electrical/.test(t)) return 'engineering';
    return t;
  };
  const parseIncomeLakhs = (raw?: string | null): [number, number] | null => {
    const text = normalizeText(raw);
    if (!text) return null;
    const numbers = text.match(/\d+(\.\d+)?/g)?.map(Number) || [];
    if (numbers.length === 0) return null;
    const isCrore = text.includes('crore');
    const min = numbers[0] * (isCrore ? 100 : 1);
    const max = (numbers[1] ?? numbers[0]) * (isCrore ? 100 : 1);
    return [Math.min(min, max), Math.max(min, max)];
  };
  const matchesIncomeBucket = (income: [number, number], bucket: string) => {
    const [min, max] = income;
    // Legacy buckets (options 1-3)
    if (bucket === 'upto_12') return min <= 12;
    if (bucket === '12_to_18') return max >= 12 && min < 18;
    if (bucket === '18_to_25') return max >= 18 && min < 25;
    if (bucket === '25_plus') return max >= 25;
    // Option4 INR buckets
    if (bucket === 'upto_5' || bucket === '0_to_5') return min <= 5;
    if (bucket === '5_to_10') return max >= 5 && min < 10;
    if (bucket === '10_to_15') return max >= 10 && min < 15;
    if (bucket === '15_to_25') return max >= 15 && min < 25;
    if (bucket === '25_to_50') return max >= 25 && min < 50;
    if (bucket === '50l_to_1cr') return max >= 50 && min < 100;
    if (bucket === '1cr_plus') return max >= 100;
    // Legacy 50+ bucket
    if (bucket === '50_plus') return max >= 50;
    return false;
  };
  const mostRecentProfileCreatedAtMs = useMemo(() => {
    const allTimestamps = MOCK_PROFILES.map((profile) => {
      const ms = Date.parse(profile.createdAt || '');
      return Number.isFinite(ms) ? ms : 0;
    }).filter(Boolean);
    return allTimestamps.length > 0 ? Math.max(...allTimestamps) : Date.now();
  }, []);
  const recentlyJoinedThresholdMs = useMemo(
    () => mostRecentProfileCreatedAtMs - 1000 * 60 * 60 * 24 * 120,
    [mostRecentProfileCreatedAtMs]
  );

  const profileMatchesSharedFilters = useCallback((profile: Profile, filters: SharedFilterState): boolean => {
    if (filters.verified && !(profile.verified?.id || profile.isVerified || profile.badges?.includes('Blue Tick'))) return false;
    if (filters.withPhoto && !(profile.photoCount! > 0 || !!profile.photos?.full || !!profile.imageUrl)) return false;
    if (filters.onlineNow && !profile.isOnline) return false;
    if (filters.premiumProfiles && !(profile.isPremium || profile.isVip)) return false;
    if (filters.recentlyJoined) {
      const createdAtMs = Date.parse(profile.createdAt || '');
      if (!Number.isFinite(createdAtMs) || createdAtMs < recentlyJoinedThresholdMs) return false;
    }
    if (filters.nearBy && !(typeof profile.distanceKm === 'number' && profile.distanceKm <= 30)) return false;
    if (filters.topColleges) {
      const cn = (profile.collegeName || '').toUpperCase();
      if (!TOP_COLLEGE_SUBSTRINGS.some((s) => cn.includes(s.toUpperCase()))) return false;
    }
    if (filters.topMatches) {
      if ((profile.astroMatchScore ?? 0) < 72) return false;
    }
    if (filters.recentlyActive) {
      if (!profile.isOnline) {
        const la = normalizeText(profile.lastActive || '');
        if (!/\b(mins?|min |hours?|hour |just|now|today|1 day|2 days?|3 days?)\b/.test(la)) return false;
      }
    }

    if (filters.ageRange) {
      const age = profile.age;
      if (!age || age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
    }
    if (filters.heightRange) {
      const h = profile.heightCm;
      if (!h || h < filters.heightRange[0] || h > filters.heightRange[1]) return false;
    }
    // income chip filters are premium-only; matching logic omitted for prototype

    if (
      filters.maritalStatus.length > 0 &&
      !filters.maritalStatus.some((selected) => normalizeText(profile.maritalStatus) === normalizeText(selected))
    ) return false;
    if (filters.partnerHasChildren.length > 0) {
      const explicit = profile.hasChildren;
      const inferredNo =
        explicit == null &&
        /\bnever\s*married\b/i.test(normalizeText(profile.maritalStatus || ''));
      const bucket = explicit ?? (inferredNo ? 'no' : null);
      if (bucket == null || !filters.partnerHasChildren.includes(bucket)) return false;
    }
    if (
      filters.religion.length > 0 &&
      !filters.religion.some((selected) => normalizeText(profile.religion) === normalizeText(selected))
    ) return false;
    if (
      filters.community.length > 0 &&
      !filters.community.some((selected) => normalizeText(profile.community).includes(normalizeText(selected)))
    ) return false;
    if (
      filters.motherTongue.length > 0 &&
      !filters.motherTongue.some((selected) => normalizeText(profile.motherTongue) === normalizeText(selected))
    ) return false;
    if (
      filters.diet.length > 0 &&
      !filters.diet.some((selected) => normalizeDiet(profile.diet).includes(normalizeDiet(selected)))
    ) return false;
    if (filters.profileManagedBy.length > 0) {
      const p = normalizeText(profile.profileManagedBy);
      const ok = filters.profileManagedBy.some((selected) => {
        const s = normalizeText(selected);
        if (s === 'self') return p.includes('self');
        if (s === 'parent') return p.includes('parent') || p.includes('guardian');
        if (s === 'sibling') return p.includes('sibling');
        if (s === 'relative' || s === 'other') return p.includes('relative') || p.includes('other') || p.includes('friend');
        return p.includes(s);
      });
      if (!ok) return false;
    }
    if (filters.country.length > 0) {
      const pc = normalizeCountry(profile.location?.country);
      if (!filters.country.some((sel) => normalizeCountry(sel) === pc)) return false;
    }
    if (filters.countryGrewUp.length > 0) {
      const g = normalizeCountry(profile.countryGrewUp || profile.family?.nativePlace);
      if (!g || !filters.countryGrewUp.some((sel) => normalizeCountry(sel) === g)) return false;
    }
    if (filters.state.length > 0) {
      const st = profile.location?.state || profile.state;
      if (!st || !filters.state.some((selected) => normalizeState(st) === normalizeState(selected))) return false;
    }
    if (filters.city.length > 0) {
      const ct = profile.location?.city || profile.city;
      if (!ct || !filters.city.some((selected) => normalizeText(ct) === normalizeText(selected))) return false;
    }
    if (filters.qualification.length > 0) {
      const bucket = profileEducationLevelBucket(profile);
      if (!bucket || !filters.qualification.includes(bucket)) return false;
    }
    if (filters.educationField.length > 0) {
      const mapped = mapEducationFieldToFilter(profile.educationField);
      const direct = normalizeText(profile.educationField || '');
      if (
        !filters.educationField.some((selected) => {
          const s = normalizeText(selected);
          return s === normalizeText(mapped) || s === direct || (direct && direct.includes(s));
        })
      ) return false;
    }
    if (filters.professionArea.length > 0) {
      const pa = normalizeText(profile.professionArea || '');
      if (!pa || !filters.professionArea.some((x) => pa === normalizeText(x))) return false;
    }
    if (
      filters.profession.length > 0 &&
      !filters.profession.some((selected) => normalizeText(profile.profession).includes(normalizeText(selected)))
    ) return false;
    if (
      filters.workingWith.length > 0 &&
      !filters.workingWith.some((selected) => inferWorkingWith(profile) === selected)
    ) return false;
    if (filters.annualIncome.length > 0) {
      const incomeLakhs = parseIncomeLakhs(profile.annualIncome);
      if (!incomeLakhs || !filters.annualIncome.some((bucket) => matchesIncomeBucket(incomeLakhs, bucket))) return false;
    }
    if (filters.incomeRangeInr.length > 0) {
      const incomeLakhs = parseIncomeLakhs(profile.annualIncome);
      if (!incomeLakhs || !filters.incomeRangeInr.some((bucket) => matchesIncomeBucket(incomeLakhs, bucket))) return false;
    }

    if (filters.manglik.length > 0) {
      const raw = normalizeText(profile.manglik || '');
      const profileManglik =
        raw === 'yes'
          ? 'manglik'
          : raw === 'no'
            ? 'non_manglik'
            : raw === 'unknown'
              ? 'dont_know'
              : raw;
      const manglikMatch = filters.manglik.some((sel) => normalizeText(sel) === profileManglik);
      if (!manglikMatch) return false;
    }

    if (filters.familyType.length > 0) {
      const profileFamilyType = normalizeText(profile.family?.familyType || '');
      if (!profileFamilyType || !filters.familyType.some((selected) => normalizeText(selected) === profileFamilyType)) return false;
    }
    if (filters.financialStatus.length > 0) {
      const profileFinancialStatus = normalizeFinancialStatus(profile.family?.financialStatus);
      if (!profileFinancialStatus) return false;
      if (!filters.financialStatus.some((selected) => normalizeFinancialStatus(selected) === profileFinancialStatus)) return false;
    }

    // ── Option4 filter keys ──
    // photoVisibility: 'public' | 'protected' | 'none' (no profile photo)
    if (filters.photoVisibility.length > 0) {
      const hasPhoto = profile.photoCount! > 0 || !!profile.photos?.full || !!profile.imageUrl;
      const isProtected = !!profile.photoProtected;
      const bucket = !hasPhoto ? 'none' : isProtected ? 'protected' : 'public';
      if (!filters.photoVisibility.includes(bucket)) return false;
    }
    // hobbies: match if profile shares at least one selected hobby
    if (filters.hobbies.length > 0) {
      const profileHobbies = (profile.hobbies || []).map((h) => normalizeText(h));
      const hasMatch = filters.hobbies.some((h) => profileHobbies.includes(normalizeText(h)));
      if (!hasMatch) return false;
    }
    // hasAstroDetails: profile must have astro data (legacy boolean for options 1-3)
    if (filters.hasAstroDetails) {
      if (!profile.hasAstroDetails && profile.astroMatchScore == null) return false;
    }
    // astroFilter: option4 two-checkbox approach
    if (filters.astroFilter && filters.astroFilter.length > 0 && filters.astroFilter.length < 2) {
      const profileHasAstro = !!profile.hasAstroDetails || profile.astroMatchScore != null;
      if (filters.astroFilter.includes('with_astro') && !profileHasAstro) return false;
      if (filters.astroFilter.includes('without_astro') && profileHasAstro) return false;
    }
    // Family location
    if (filters.familyCountry.length > 0) {
      const fc = normalizeCountry(profile.familyCountry || profile.family?.nativePlace);
      if (!fc || !filters.familyCountry.some((sel) => normalizeCountry(sel) === fc)) return false;
    }
    if (filters.familyState.length > 0) {
      const fs = normalizeText(profile.familyState || '');
      if (!fs || !filters.familyState.some((sel) => normalizeState(sel) === normalizeState(fs))) return false;
    }
    if (filters.familyCity.length > 0) {
      const fct = normalizeText(profile.familyCity || '');
      if (!fct || !filters.familyCity.some((sel) => normalizeText(sel) === fct)) return false;
    }

    return true;
  }, [recentlyJoinedThresholdMs]);

  const personaBaseline = useMemo(() => getBaselineFiltersForPersona(currentUserPersona.id), [currentUserPersona.id]);
  const inboxActiveFilterCount = countActiveSharedFilters(inboxFilters, personaBaseline);
  const matchesActiveFilterCount = countActiveSharedFilters(matchesFilters, personaBaseline);

  const normalizeSearchText = useCallback((value?: string | null) => (value || '').trim().toLowerCase(), []);
  const matchesSearchPredicate = useMemo(() => {
    const q = normalizeSearchText(matchesSearchQuery);
    if (!q) return null;
    return (profile: Profile) => {
      const hay = [
        profile.name,
        profile.profession,
        profile.community,
        profile.location?.city ?? profile.city,
        profile.location?.state ?? profile.state,
        profile.companyName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    };
  }, [matchesSearchQuery, normalizeSearchText]);

  const matchesCombinedPredicate = useMemo(() => {
    const hasSharedFilters = matchesActiveFilterCount > 0;
    const hasSearch = !!matchesSearchPredicate;
    if (!hasSharedFilters && !hasSearch) return undefined;
    return (profile: Profile) => {
      const passesShared = !hasSharedFilters || profileMatchesSharedFilters(profile, matchesFilters);
      const passesSearch = !hasSearch || matchesSearchPredicate?.(profile);
      return passesShared && passesSearch;
    };
  }, [matchesActiveFilterCount, matchesFilters, matchesSearchPredicate, profileMatchesSharedFilters]);

  // Soft filtering: matching first, then others
  const inboxMatchingRequests = useMemo(() => {
    if (inboxActiveFilterCount === 0) return inboxPendingRequestsRaw;
    return inboxPendingRequestsRaw.filter(r => profileMatchesSharedFilters(r.profile, inboxFilters));
  }, [inboxPendingRequestsRaw, inboxFilters, inboxActiveFilterCount, profileMatchesSharedFilters]);

  const inboxOtherRequests = useMemo(() => {
    if (inboxActiveFilterCount === 0) return [];
    return inboxPendingRequestsRaw.filter(r => !profileMatchesSharedFilters(r.profile, inboxFilters));
  }, [inboxPendingRequestsRaw, inboxFilters, inboxActiveFilterCount, profileMatchesSharedFilters]);

  // Sorting
  const sortInboxRequests = useCallback((reqs: typeof inboxPendingRequestsRaw, sort: SortOption) => {
    if (sort === 'recommended') return reqs; // default order
    const sorted = [...reqs];
    if (sort === 'newest') {
      sorted.reverse(); // newest = reverse of original mock order
    }
    if (sort === 'recentlyActive') {
      const minutesSinceLastActive = (lastActiveRaw: string | undefined, isOnline?: boolean) => {
        if (isOnline) return 0;
        const la = normalizeText(lastActiveRaw || '');
        if (!la) return 10_000;
        if (/\bjust\s*now\b/.test(la)) return 1;
        if (/\bnow\b/.test(la)) return 2;
        if (/\btoday\b/.test(la)) return 60 * 6;
        const m = la.match(/(\d+)\s*(min|mins|minute|minutes)\b/);
        if (m) return Number(m[1]);
        const h = la.match(/(\d+)\s*(hr|hrs|hour|hours)\b/);
        if (h) return Number(h[1]) * 60;
        const d = la.match(/(\d+)\s*(day|days)\b/);
        if (d) return Number(d[1]) * 60 * 24;
        if (/\bfew\s*hours?\b/.test(la)) return 60 * 3;
        if (/\bfew\s*mins?\b/.test(la)) return 8;
        return 9_999;
      };
      sorted.sort((a, b) => {
        const am = minutesSinceLastActive(a.profile.lastActive, a.profile.isOnline);
        const bm = minutesSinceLastActive(b.profile.lastActive, b.profile.isOnline);
        return am - bm;
      });
    }
    // 'oldest' = original mock order (already chronological from oldest)
    return sorted;
  }, []);

  const inboxPendingRequests = useMemo(() =>
    sortInboxRequests(inboxMatchingRequests, inboxSortOption),
    [inboxMatchingRequests, inboxSortOption, sortInboxRequests]
  );

  const inboxSortedOtherRequests = useMemo(() =>
    sortInboxRequests(inboxOtherRequests, inboxSortOption),
    [inboxOtherRequests, inboxSortOption, sortInboxRequests]
  );

  const inboxPendingCount = inboxPendingRequestsRaw.length;

  // ═══ Connect Message Feature State ═══
  const [connectVariant, setConnectVariant] = useState<SolutionVariant>('3'); // Default to pre-awareness variant
  const [showStats, setShowStats] = useState(false); // Credits + char count toggle
  const [showSubtitle, setShowSubtitle] = useState(true); // Subtitle toggle
  const [showExperimentSettingsPanel, setShowExperimentSettingsPanel] = useState(false);
  const [filterExperienceVersion, setFilterExperienceVersion] = useState<FilterExperienceVersion>('option4');
  const [showFilterTabs, setShowFilterTabs] = useState(false);
  const [premiumRowStyle, setPremiumRowStyle] = useState<'chevron' | 'badge'>('badge');
  const [premiumIndicatorGlyph, setPremiumIndicatorGlyph] = useState<'crown' | 'lock'>('lock');
  const [premiumLockPromptPresentation, setPremiumLockPromptPresentation] = useState<
    'floating-card' | 'nested-bottom-sheet'
  >('nested-bottom-sheet');
  const handlePersonaChange = useCallback((p: CurrentUserPersona) => {
    setCurrentUserPersona(p);
    setIsCurrentUserPremium(p.isPremium);
    const newBaseline = getBaselineFiltersForPersona(p.id);
    setMatchesFilters(newBaseline);
    setInboxFilters(newBaseline);
  }, []);
  const [showConnectSheet, setShowConnectSheet] = useState(false);
  const [connectingProfile, setConnectingProfile] = useState<Profile | null>(null);
  const [savedConnectMessage, setSavedConnectMessage] = useState('');
  const [savedMessageFirstName, setSavedMessageFirstName] = useState('');
  const [isFirstConnect, setIsFirstConnect] = useState(true);
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [connectedProfileIds, setConnectedProfileIds] = useState<Set<string>>(new Set());
  const [viewedContactIds, setViewedContactIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!shouldShowPromisingMatches) {
      setShowPromisingMatchesController(false);
      setOption3Expanded(false);
      setOption3ActiveIndex(0);
    }
  }, [shouldShowPromisingMatches]);

  useEffect(() => {
    if (!shouldShowPromisingMatches || promisingMatchesVariant !== 'option3' || option3Expanded || promisingMatches.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setOption3ActiveIndex((prev) => (prev + 1) % promisingMatches.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [shouldShowPromisingMatches, promisingMatchesVariant, option3Expanded, promisingMatches.length]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const togglePremium = () => setIsCurrentUserPremium(prev => !prev);
  const toggleGradient = () => setUseGreenGradient(prev => !prev);
  const handleInboxContentScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setInboxSubHeaderScrolled(e.currentTarget.scrollTop > 0);
  }, []);
  const toggleInboxQuickChip = useCallback((chip: 'verified' | 'withPhoto' | 'recentlyJoined' | 'nearBy') => {
    const isPremiumChip = chip === 'nearBy';
    if (isPremiumChip && !isCurrentUserPremium) {
      setShowPremiumFromFilters(true);
      return;
    }
    setInboxFilters((prev) => ({ ...prev, [chip]: !prev[chip] }));
  }, [isCurrentUserPremium]);

  useEffect(() => {
    if (inboxFilter !== 'received') {
      setInboxSubHeaderScrolled(false);
      return;
    }
    setInboxSubHeaderScrolled(false);
  }, [inboxFilter, inboxViewMode]);
  const handleOpenPromisingInbox = () => {
    setActiveMainTab('inbox');
    setInboxFilter('received');
    setOption3Expanded(false);
    setShowPromisingMatchesController(false);
  };

  // ═══ Helper: Persist a sent connect message into the active chat conversation ═══
  const persistConnectMessageToChat = useCallback((profileId: string, messageText: string) => {
    const now = Date.now();
    const sentMessage: ChatMessage = {
      id: `m_connect_sent_${now}`,
      senderId: 'me',
      text: messageText,
      timestamp: 'Just now',
      read: false,
    };

    // Use functional state updates to avoid stale closure issues
    setAcceptedConversations(prev => {
      const existingIdx = prev.findIndex(c => c.profile.id === profileId);
      if (existingIdx >= 0) {
        // Update existing conversation with the sent message
        const existing = prev[existingIdx];
        const updatedMessages = [...existing.messages, sentMessage];
        const updated = {
          ...existing,
          lastMessage: messageText,
          lastMessageTime: 'Just now',
          lastActivityTs: now,
          isAccepted: false,
          messages: updatedMessages,
        };
        setPersistedMessages(p => ({ ...p, [profileId]: updatedMessages }));
        setChatActivityTs(p => ({ ...p, [profileId]: now }));
        setActiveChatConversation(updated);
        return [...prev.slice(0, existingIdx), updated, ...prev.slice(existingIdx + 1)];
      } else {
        // Check pre-seeded conversations
        const preSeeded = MOCK_CONVERSATIONS.find(c => c.profile.id === profileId);
        if (preSeeded) {
          const updatedMessages = [...preSeeded.messages, sentMessage];
          setPersistedMessages(p => ({ ...p, [profileId]: updatedMessages }));
          setChatActivityTs(p => ({ ...p, [profileId]: now }));
          return prev;
        }
        // Create new conversation — need the profile
        const profile = MOCK_PROFILES.find(p => p.id === profileId);
        if (profile) {
          const newConvo: ChatConversation = {
            id: `chat_connect_${profileId}_${now}`,
            profile: { ...profile, isOnline: profile.isOnline ?? false },
            lastMessage: messageText,
            lastMessageTime: 'Just now',
            lastActivityTs: now,
            unreadCount: 0,
            isAccepted: false,
            messages: [sentMessage],
          };
          setPersistedMessages(p => ({ ...p, [profileId]: newConvo.messages }));
          setChatActivityTs(p => ({ ...p, [profileId]: now }));
          setActiveChatConversation(newConvo);
          return [newConvo, ...prev];
        }
        return prev;
      }
    });
  }, []);

  // ═══ Connect Message Handlers ═══
  const handleConnect = useCallback((profile: Profile) => {
    if (connectedProfileIds.has(profile.id)) return;

    if (isFirstConnect || !autoSendEnabled) {
      // Show the full bottom sheet (shared across all solutions)
      setConnectingProfile(profile);
      setShowConnectSheet(true);
    } else {
      // Subsequent connect with auto-send
      const profileFirstName = profile.name.split(' ')[0];
      const messageForProfile = replaceNameInMessage(savedConnectMessage, savedMessageFirstName, profileFirstName);

      // Instant-send — card handles inline confirmation
      setConnectedProfileIds(prev => new Set(prev).add(profile.id));

      // If connecting from chat, persist the auto-sent message to the conversation
      if (connectingFromChatRef.current) {
        persistConnectMessageToChat(profile.id, messageForProfile);
        connectingFromChatRef.current = false;
      }
    }
  }, [isFirstConnect, autoSendEnabled, connectedProfileIds, savedConnectMessage, savedMessageFirstName, persistConnectMessageToChat]);

  const handleSendConnect = useCallback((message: string, autoSend: boolean) => {
    if (connectingProfile) {
      setSavedConnectMessage(message);
      setSavedMessageFirstName(connectingProfile.name.split(' ')[0]);
      setAutoSendEnabled(autoSend);
      setConnectedProfileIds(prev => new Set(prev).add(connectingProfile.id));
      setIsFirstConnect(false);
      setShowConnectSheet(false);

      // If connecting from chat, persist the sent message to the conversation
      if (connectingFromChatRef.current) {
        persistConnectMessageToChat(connectingProfile.id, message);
        connectingFromChatRef.current = false;
      }

      // Delay clearing the profile so AnimatePresence can run the exit animation
      setTimeout(() => setConnectingProfile(null), 500);
    }
  }, [connectingProfile, persistConnectMessageToChat]);

  // Edit message from inline card preview
  const handleEditMessage = useCallback((profile: Profile) => {
    setConnectingProfile(profile);
    setShowConnectSheet(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setShowConnectSheet(false);
    // Reset chat connect flag if user closes without sending
    connectingFromChatRef.current = false;
    // Delay clearing the profile so AnimatePresence can run the exit animation
    setTimeout(() => setConnectingProfile(null), 500);
  }, []);

  // ═══ Full Profile View Helpers ═══
  const getFilteredProfiles = useCallback(() => {
    const base = (() => {
      switch (matchesFilter) {
        case 'new': return NEW_PROFILES;
        case 'daily': return DAILY_PROFILES;
        case 'matches': return MY_MATCHES_PROFILES;
        case 'more': return MORE_MATCHES_PROFILES;
        default: return DAILY_PROFILES;
      }
    })();
    return base
      .filter(p => !chattingProfileIds.has(p.id))
      .filter(p => (matchesCombinedPredicate ? matchesCombinedPredicate(p) : true));
  }, [matchesFilter, chattingProfileIds, matchesCombinedPredicate]);

  const handleViewProfile = useCallback((profile: Profile) => {
    const profiles = getFilteredProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    setFullViewSource('matches');
    setFullViewProfileIndex(index >= 0 ? index : 0);
  }, [getFilteredProfiles]);

  const handleViewInboxProfile = useCallback((profile: Profile) => {
    // Inbox profiles come from all MOCK_PROFILES, so find by id
    const index = MOCK_PROFILES.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      setFullViewSource('inbox');
      setFullViewProfileIndex(index);
    }
  }, []);

  const handleNavigateProfile = useCallback((newIndex: number) => {
    setFullViewProfileIndex(newIndex);
  }, []);

  const handleBackFromFullView = useCallback(() => {
    setFullViewProfileIndex(null);
  }, []);

  const handleViewContact = useCallback((profileId: string) => {
    setViewedContactIds(prev => new Set(prev).add(profileId));
  }, []);

  // ═══ Inbox Accept → Create Chat Conversation ═══
  const handleInboxAccept = useCallback((profile: Profile) => {
    setInboxDismissedIds(prev => new Set(prev).add(profile.id));
    // Find the connect message from the inbox request
    const inboxReq = MOCK_INBOX_REQUESTS.find(r => r.profile.id === profile.id);
    const connectMsg = inboxReq?.message;
    const newConvo = createConversationFromAccept(profile, connectMsg);
    setAcceptedConversations(prev => [newConvo, ...prev]);
  }, []);

  const handleInboxDecline = useCallback((profile: Profile) => {
    setInboxDismissedIds(prev => new Set(prev).add(profile.id));
  }, []);

  // ═══ Online User Tap → Open chat screen (no connect sent yet) ═══
  const handleOpenOnlineChat = useCallback((user: OnlineUser) => {
    // Check if we already have a conversation with this profile
    const existing = allConversations.find(
      c => c.profile.id === user.profile.id
    );
    if (existing) {
      setActiveChatConversation(existing);
      return;
    }

    // Check if this profile has a pending inbox connect request
    // If so, include their connect message as a received message in the chat
    const inboxReq = MOCK_INBOX_REQUESTS.find(
      r => r.profile.id === user.profile.id && !inboxDismissedIds.has(user.profile.id)
    );

    const tempConvo = createConversationFromOnlineUser(user.profile);

    if (inboxReq) {
      // Pre-populate with their connect message so it appears as a received bubble
      tempConvo.messages = [{
        id: `m_inbox_connect_${Date.now()}`,
        senderId: user.profile.id,
        text: inboxReq.message,
        timestamp: inboxReq.timestamp || 'Earlier',
        read: true,
      }];
      tempConvo.lastMessage = inboxReq.message;
    }

    setActiveChatConversation(tempConvo);
  }, [allConversations, inboxDismissedIds]);

  // ═══ First message sent in an online-user chat → persist to recent chats ═══
  const handleFirstMessageSent = useCallback((conversation: ChatConversation, messageText: string) => {
    // Check if already in recent chats
    const alreadyExists = acceptedConversations.some(c => c.profile.id === conversation.profile.id)
      || MOCK_CONVERSATIONS.some(c => c.profile.id === conversation.profile.id);
    if (alreadyExists) return;

    const now = Date.now();
    const persistedConvo: ChatConversation = {
      ...conversation,
      lastMessage: messageText,
      lastMessageTime: 'Just now',
      lastActivityTs: now,
      isAccepted: false, // connect request sent, not yet accepted by other person
      messages: [{
        id: `m_${now}`,
        senderId: 'me',
        text: messageText,
        timestamp: 'Just now',
        read: false,
      }],
    };
    setAcceptedConversations(prev => [persistedConvo, ...prev]);
    // Update the active conversation reference so it stays in sync
    setActiveChatConversation(persistedConvo);
    // Also persist messages + activity timestamp for sort order
    setPersistedMessages(prev => ({ ...prev, [conversation.profile.id]: persistedConvo.messages }));
    setChatActivityTs(prev => ({ ...prev, [conversation.profile.id]: now }));
  }, [acceptedConversations]);

  // ═══ Persist messages when user sends a message in any chat ═══
  // Also updates last activity timestamp so the conversation bubbles to top
  const handleMessageUpdate = useCallback((profileId: string, messages: ChatMessage[]) => {
    setPersistedMessages(prev => ({ ...prev, [profileId]: messages }));
    setChatActivityTs(prev => ({ ...prev, [profileId]: Date.now() }));
  }, []);

  // ═══ Dynamically compute connection status for the active chat ═══
  // This is NOT hardcoded — it derives status from the actual data sets
  const getConnectionStatus = useCallback((profileId: string): ConnectionStatus => {
    // 1. Check if this is an accepted conversation (pre-seeded or accepted from inbox)
    const existingConvo = allConversations.find(c => c.profile.id === profileId);
    if (existingConvo?.isAccepted) return 'accepted';

    // 2. Check if they sent us a connect request (they're in the inbox, not yet dismissed)
    const isInInbox = MOCK_INBOX_REQUESTS.some(
      r => r.profile.id === profileId && !inboxDismissedIds.has(profileId)
    );
    if (isInInbox) return 'inbox_pending';

    // 3. Check if we've already sent them a connect request
    if (connectedProfileIds.has(profileId)) return 'connect_sent';

    // 4. No connection at all
    return 'not_connected';
  }, [allConversations, inboxDismissedIds, connectedProfileIds]);

  // ═══ Chat Card Actions: Connect / Accept / Decline from within Chat Screen ═══
  const handleConnectFromChat = useCallback((profileId: string) => {
    // Open the SIA connect message sheet instead of directly connecting
    const profile = MOCK_PROFILES.find(p => p.id === profileId);
    if (!profile) return;
    connectingFromChatRef.current = true;
    handleConnect(profile);
  }, [handleConnect]);

  // ═══ Direct message connect — user types a message and sends from the input bar ═══
  const handleSendConnectMessage = useCallback((profileId: string, message: string) => {
    // Mark as connected
    setConnectedProfileIds(prev => new Set(prev).add(profileId));
    // Persist the sent connect message to the chat conversation
    persistConnectMessageToChat(profileId, message);
  }, [persistConnectMessageToChat]);

  const handleAcceptFromChat = useCallback((profileId: string, replyMessage?: string) => {
    // Inline the inbox accept logic + update active conversation reference
    const profile = MOCK_PROFILES.find(p => p.id === profileId);
    if (profile) {
      // Dismiss from inbox
      setInboxDismissedIds(prev => new Set(prev).add(profileId));
      // Create accepted conversation WITHOUT auto-reply — in chat view,
      // the user can type their own reply; only inbox-list accept sends auto-reply
      const inboxReq = MOCK_INBOX_REQUESTS.find(r => r.profile.id === profileId);
      const connectMsg = inboxReq?.message;
      const newConvo = createConversationFromAccept(profile, connectMsg, true);
      
      // If user typed a reply message while accepting, add it to the conversation
      if (replyMessage) {
        const replyMsg: ChatMessage = {
          id: `m_reply_${Date.now()}`,
          senderId: 'me',
          text: replyMessage,
          timestamp: 'Just now',
          read: false,
        };
        newConvo.messages.push(replyMsg);
        newConvo.lastMessage = replyMessage;
      }
      
      setAcceptedConversations(prev => [newConvo, ...prev]);
      // Update the active conversation so the chat screen shows the new messages
      setActiveChatConversation(newConvo);
    }
  }, []);

  const handleDeclineFromChat = useCallback((profileId: string) => {
    // Reuse the existing inbox decline flow
    const profile = MOCK_PROFILES.find(p => p.id === profileId);
    if (profile) {
      handleInboxDecline(profile);
    }
  }, [handleInboxDecline]);

  // Defined steps to match theme.css exactly
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const ColorScale = ({ name, variablePrefix, baseHex }: { name: string, variablePrefix: string, baseHex?: string }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
         <h3 className="text-sm font-semibold text-foreground">{name}</h3>
         {baseHex && <span className="text-[10px] font-mono text-muted-foreground">{baseHex}</span>}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {steps.map((step) => (
          <div key={`${variablePrefix}-${step}`} className="flex flex-col items-center gap-1">
            <div 
              className="h-10 w-full rounded-lg shadow-sm ring-1 ring-black/5 dark:ring-white/10" 
              style={{ backgroundColor: `var(--${variablePrefix}-${step})` }}
            ></div>
            <span className="text-[10px] text-muted-foreground font-mono">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const NavItem = ({ id, label, icon: Icon, activeIcon: ActiveIcon, badge }: { id: typeof activeMainTab, label: string, icon: any, activeIcon: any, badge?: number }) => {
    const isActive = activeMainTab === id;
    return (
      <button
        onClick={() => {
          if (id === 'premium' && activeMainTab !== 'premium') {
            previousTabRef.current = activeMainTab as 'home' | 'matches' | 'inbox' | 'chat';
          }
          setActiveChatConversation(null);
          setActiveMainTab(id);
        }}
        className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full text-xs font-medium relative group select-none",
          isActive 
            ? "text-[var(--color-accent-palette-500)] dark:text-[var(--color-accent-palette-400)]" 
            : "text-muted-foreground hover:bg-muted/50"
        )}
      >
        <div className={cn("relative transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-105")}>
          {isActive ? (
            <ActiveIcon className="w-6 h-6" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-[#ff5a60] text-white px-1" style={{ fontSize: '9px', fontWeight: 700, lineHeight: '16px' }}>
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        <span>{label}</span>
      </button>
    );
  };

  const MenuCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick,
    colorClass,
    action
  }: { 
    title: string, 
    description: string, 
    icon: any, 
    onClick: () => void,
    colorClass: string,
    action?: React.ReactNode
  }) => (
    <button 
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl border shadow-sm bg-card hover:bg-accent/5 transition-all duration-200 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className={cn("absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity", colorClass)}>
        <Icon size={80} />
      </div>
      <div className="relative z-10 flex flex-col gap-3 w-full">
        <div className="flex justify-between items-start w-full">
           <div className={cn("p-2.5 w-fit rounded-xl", colorClass, "bg-opacity-15 text-current")}>
            <Icon size={20} />
          </div>
          {action}
        </div>
        <div>
          <h3 className="text-base font-bold mb-0.5 leading-tight">{title}</h3>
          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );

  const getPageTitle = () => {
    switch (activeMainTab) {
      case 'home': return 'Home';
      case 'matches': return 'Matches';
      case 'inbox': return 'Inbox';
      case 'chat': return 'Chat';
      case 'premium': return 'Premium';
      default: return 'Home';
    }
  };

  if (activeScreen === 'profile_card') {
    return (
      <MobileWrapper>
        <ProfileCardScreen onBack={() => setActiveScreen(null)} />
      </MobileWrapper>
    );
  }

  if (activeScreen === 'onboarding') {
    return (
      <MobileWrapper>
        <OnboardingScreen
          onBack={() => setActiveScreen(null)}
          onSignUp={() => setActiveScreen('profile_for')}
        />
      </MobileWrapper>
    );
  }

  if (activeScreen === 'profile_for') {
    return (
      <MobileWrapper>
        <ProfileForScreen
          onBack={() => setActiveScreen('onboarding')}
          onNext={(selection, gender) => {
            console.log('Profile selection:', selection, gender);
            setActiveScreen('registration');
          }}
        />
      </MobileWrapper>
    );
  }

  if (activeScreen === 'registration') {
    return (
      <MobileWrapper>
        <RegistrationFlow
          onBack={() => setActiveScreen('profile_for')}
          onComplete={() => setActiveScreen(null)}
        />
      </MobileWrapper>
    );
  }

  if (activeScreen === 'connect_message') {
    return (
      <MobileWrapper>
        <ConnectMessageScreen onBack={() => setActiveScreen(null)} />
      </MobileWrapper>
    );
  }

  if (activeScreen === 'sia_onboarding') {
    return (
      <MobileWrapper>
        <div className="w-full h-full relative">
          <SiaOnboardingScreen
            onBack={() => setActiveScreen(null)}
            onComplete={() => setShowPremiumOverlay(true)}
            profiles={SIA_MOCK_PROFILES}
            isCurrentUserPremium={isCurrentUserPremium}
            solutionVariant={connectVariant}
            useGreenGradient={useGreenGradient}
          />
          {/* Premium slide-in overlay */}
          <AnimatePresence>
            {showPremiumOverlay && (
              <motion.div
                className="absolute inset-0 z-[70] bg-background"
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.32,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <PremiumUpgradeScreen
                  onSkip={() => {
                    setShowPremiumOverlay(false);
                    setActiveScreen(null);
                    setActiveMainTab('matches');
                  }}
                  onContinue={() => {
                    setShowPremiumOverlay(false);
                    setActiveScreen(null);
                    setActiveMainTab('matches');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MobileWrapper>
    );
  }

  if (activeScreen === 'sia_onboarding_2') {
    return (
      <MobileWrapper>
        <div className="w-full h-full relative">
          <SiaOnboardingScreen
            onBack={() => setActiveScreen(null)}
            onComplete={() => setShowPremiumOverlay(true)}
            profiles={SIA_MOCK_PROFILES}
            isCurrentUserPremium={isCurrentUserPremium}
            solutionVariant={connectVariant}
            useGreenGradient={useGreenGradient}
            initialVisibleCount={5}
          />
          {/* Premium slide-in overlay */}
          <AnimatePresence>
            {showPremiumOverlay && (
              <motion.div
                className="absolute inset-0 z-[70] bg-background"
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.32,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <PremiumUpgradeScreen
                  onSkip={() => {
                    setShowPremiumOverlay(false);
                    setActiveScreen(null);
                    setActiveMainTab('matches');
                  }}
                  onContinue={() => {
                    setShowPremiumOverlay(false);
                    setActiveScreen(null);
                    setActiveMainTab('matches');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MobileWrapper>
    );
  }

  if (activeScreen === 'premium_upgrade') {
    return (
      <MobileWrapper>
        <PremiumUpgradeScreen
          onSkip={() => {
            setActiveScreen(null);
          }}
          onContinue={() => {
            setActiveScreen(null);
            setIsCurrentUserPremium(true);
          }}
        />
      </MobileWrapper>
    );
  }

  if (activeScreen === 'chat_version_one') {
    return (
      <MobileWrapper>
        <div className="relative w-full h-full bg-background overflow-hidden flex flex-col">
          <header className="relative z-50 shrink-0 bg-background px-2 flex items-center" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 64px)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <Button variant="ghost" size="icon" onClick={() => setActiveScreen(null)}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="font-medium text-xl tracking-tight">Chat Version One</h1>
          </header>
          <main className="flex-1 w-full bg-background overflow-y-auto overflow-x-hidden scrollbar-hide pb-[24px]">
            <FilterBar
              showIcon={false}
              filters={[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'shaddi_live', label: 'Shaadi Live' },
                { id: 'calls', label: 'Calls' }
              ]}
              selectedId={chatV1Filter}
              onSelect={setChatV1Filter}
            />
            <ChatListView
              conversations={chatV1Conversations}
              onlineUsers={filteredOnlineUsersV1}
              onOpenChat={() => undefined}
              onOpenOnlineChat={() => undefined}
              showOnlineUsers
            />
          </main>
        </div>
      </MobileWrapper>
    );
  }

  // edit_profile is now rendered as an overlay at the bottom of the main return

  // ═══ Full Profile View ═══
  if (fullViewProfileIndex !== null) {
    const filteredProfiles = getFilteredProfiles();
    // Use the correct profile set based on where the user navigated from
    const profileSet = fullViewSource === 'inbox' ? MOCK_PROFILES : filteredProfiles;
    const currentFullProfile = profileSet[fullViewProfileIndex];
    const profileFirstName = currentFullProfile?.name.split(' ')[0] || '';
    const messageForFullProfile = savedConnectMessage && savedMessageFirstName
      ? replaceNameInMessage(savedConnectMessage, savedMessageFirstName, profileFirstName)
      : savedConnectMessage;

    return (
      <MobileWrapper>
        <FullProfileView
          key={`profile-${fullViewProfileIndex}`}
          profiles={profileSet}
          currentIndex={fullViewProfileIndex}
          onBack={handleBackFromFullView}
          onNavigate={handleNavigateProfile}
          onConnect={handleConnect}
          isConnected={connectedProfileIds.has(currentFullProfile?.id || '')}
          solutionVariant={connectVariant}
          savedMessage={messageForFullProfile}
          savedMessageFirstName={savedMessageFirstName}
          isFirstConnect={isFirstConnect}
          onEditMessage={handleEditMessage}
          isCurrentUserPremium={isCurrentUserPremium}
          viewedContactIds={viewedContactIds}
          onViewContact={handleViewContact}
          useGreenGradient={useGreenGradient}
        />

        {/* Connect Message Bottom Sheet overlay */}
        {connectingProfile && (
          <ConnectMessageSheet
            isOpen={showConnectSheet}
            onClose={handleCloseSheet}
            onSend={handleSendConnect}
            profile={connectingProfile}
            savedMessage={savedMessageFirstName ? replaceNameInMessage(savedConnectMessage, savedMessageFirstName, connectingProfile.name.split(' ')[0]) : savedConnectMessage}
            isFirstConnect={isFirstConnect}
            variant={connectVariant}
            showStats={showStats}
            showSubtitle={showSubtitle}
            useGreenGradient={useGreenGradient}
          />
        )}
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      <div className="relative w-full h-full bg-background overflow-hidden flex flex-col">
        
        {/* PWA Install Prompt — overlays content at top when installable */}
        <PWAInstallPrompt />

        {/* Experiment Settings Panel — opened from notification bell */}
        <ExperimentSettingsPanel
          isOpen={showExperimentSettingsPanel}
          onClose={() => setShowExperimentSettingsPanel(false)}
          filterExperienceVersion={filterExperienceVersion}
          onFilterExperienceVersionChange={setFilterExperienceVersion}
          useInboxSimulation={useInboxSimulation}
          onUseInboxSimulationChange={setUseInboxSimulation}
          currentPersona={currentUserPersona}
          onPersonaChange={handlePersonaChange}
          showFilterTabs={showFilterTabs}
          onShowFilterTabsChange={setShowFilterTabs}
          premiumRowStyle={premiumRowStyle}
          onPremiumRowStyleChange={setPremiumRowStyle}
          premiumIndicatorGlyph={premiumIndicatorGlyph}
          onPremiumIndicatorGlyphChange={setPremiumIndicatorGlyph}
          premiumLockPromptPresentation={premiumLockPromptPresentation}
          onPremiumLockPromptPresentationChange={setPremiumLockPromptPresentation}
        />

        <PromisingMatchesControllerModal
          isOpen={showPromisingMatchesController}
          selectedVariant={promisingMatchesVariant}
          selectedOption3Sub={option3SubVariant}
          onSelectVariant={(variant) => {
            setPromisingMatchesVariant(variant);
            setOption3Expanded(false);
            setOption3ActiveIndex(0);
          }}
          onSelectOption3Sub={(sub) => {
            setOption3SubVariant(sub);
            setOption3Expanded(false);
            setOption3ActiveIndex(0);
          }}
          onClose={() => setShowPromisingMatchesController(false)}
        />

        {/* Header - Relative to avoid layout gaps, allowing Main to sit flush below */}
        <header className="relative z-50 shrink-0 bg-background px-4 flex items-center justify-between" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 64px)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex items-center gap-0.5">
             <Button variant="ghost" size="icon" className="-ml-2 hover:bg-secondary/50" onClick={() => setIsDrawerOpen(true)}>
                <HamburgerIcon className="w-6 h-6" />
             </Button>
            <h1 className="font-medium text-xl tracking-tight ml-1">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="invisible hover:bg-secondary/50">
                <CustomSearchIcon className="w-6 h-6" />
             </Button>
             <Button
               variant="ghost"
               size="icon"
               className="-mr-2 hover:bg-secondary/50"
               onClick={() => {
                 if (activeMainTab === 'chat') {
                   setShowPromisingMatchesController(true);
                   return;
                 }
                 setShowExperimentSettingsPanel(true);
               }}
             >
                <NotificationIcon className="w-6 h-6" />
             </Button>
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        {/* Removed pt-[64px] since Header is now relative */}
        <main 
          className={cn(
            "flex-1 w-full bg-background",
            (activeMainTab === 'matches' || activeMainTab === 'inbox')
              ? "overflow-hidden flex flex-col" 
              : "overflow-y-auto overflow-x-hidden scrollbar-hide"
          )}
          style={{
            paddingBottom:
              activeMainTab !== 'premium' && !activeChatConversation
                ? 'calc(env(safe-area-inset-bottom, 0px) + 96px)'
                : 0,
          }}
        >
          <div className={cn("min-h-full", (activeMainTab === 'matches' || activeMainTab === 'inbox') ? "h-full flex flex-col" : "")}>
            
            {/* TAB: MATCHES */}
            {activeMainTab === 'matches' && (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FilterBar 
                  selectedId={matchesFilter}
                  onSelect={setMatchesFilter}
                  onFilterClick={() => setShowMatchesFilterSheet(true)}
                  activeFilterCount={matchesActiveFilterCount}
                  filterButtonDisabled={matchesFilter === 'daily'}
                  filters={[
                    {
                      id: 'search',
                      label: 'Search',
                      iconLeft: <Search className="w-4 h-4" />,
                      onClick: () => setIsMatchesSearchOpen(true),
                    },
                    { id: 'new', label: `New (${NEW_PROFILES.filter(p => !chattingProfileIds.has(p.id)).length})` },
                    { id: 'daily', label: `Daily (${DAILY_PROFILES.filter(p => !chattingProfileIds.has(p.id)).length})` },
                    { id: 'matches', label: `My Matches (${MY_MATCHES_PROFILES.filter(p => !chattingProfileIds.has(p.id)).length})` },
                    { id: 'more', label: `More Matches (${MORE_MATCHES_PROFILES.filter(p => !chattingProfileIds.has(p.id)).length})` },
                  ]}
                />
                {isMatchesSearchOpen && (
                  <div className="px-4 pb-2">
                    <div className="h-10 rounded-xl border border-border bg-background flex items-center gap-2 px-3">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input
                        value={matchesSearchQuery}
                        onChange={(e) => setMatchesSearchQuery(e.target.value)}
                        placeholder="Search matches"
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMatchesSearchQuery('');
                          setIsMatchesSearchOpen(false);
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex-1 overflow-hidden relative">
                   <MatchesView
                     currentFilter={matchesFilter}
                     onConnect={handleConnect}
                     connectedIds={connectedProfileIds}
                     solutionVariant={connectVariant}
                     savedMessage={savedConnectMessage}
                     savedMessageFirstName={savedMessageFirstName}
                     isFirstConnect={isFirstConnect}
                     onEditMessage={handleEditMessage}
                     onViewProfile={handleViewProfile}
                     isCurrentUserPremium={isCurrentUserPremium}
                     useGreenGradient={useGreenGradient}
                     excludeProfileIds={chattingProfileIds}
                     profilePredicate={matchesCombinedPredicate}
                   />
                </div>
              </div>
            )}

            {/* TAB: HOME (Design System Container) */}
            {activeMainTab === 'home' && (
              <div className="p-4 space-y-8">
                {/* LEVEL 1: MENU */}
                {activeDesignSection === 'menu' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2 pt-2">
                      <h2 className="text-3xl font-bold tracking-tight">Design System</h2>
                      <p className="text-muted-foreground">Welcome to the MeowUI component library.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <MenuCard 
                        title="Foundations" 
                        description="Typography, Colors, & Spacing" 
                        icon={LayoutGrid} 
                        onClick={() => setActiveDesignSection('foundations')}
                        colorClass="text-blue-500 bg-blue-500/20"
                      />
                      <MenuCard 
                        title="UI Kit" 
                        description="Buttons, Cards, & Layouts" 
                        icon={BoxSelect} 
                        onClick={() => setActiveDesignSection('components')}
                        colorClass="text-purple-500 bg-purple-500/20"
                      />
                      <MenuCard 
                        title="Inputs" 
                        description="Forms & Controls" 
                        icon={TextCursorInput} 
                        onClick={() => setActiveDesignSection('inputs')}
                        colorClass="text-emerald-500 bg-emerald-500/20"
                      />
                      <MenuCard 
                        title="Pictorials" 
                        description="Colored Icon Pictograms" 
                        icon={Shapes} 
                        onClick={() => setActiveDesignSection('pictorials')}
                        colorClass="text-pink-500 bg-pink-500/20"
                      />
                      <MenuCard 
                        title="Icons" 
                        description="SVG Assets" 
                        icon={Cat} 
                        onClick={() => setActiveDesignSection('icons')}
                        colorClass="text-orange-500 bg-orange-500/20"
                      />
                      <MenuCard 
                        title="Profile Images" 
                        description="Full & Avatar Audit" 
                        icon={User} 
                        onClick={() => setActiveDesignSection('profile_images')}
                        colorClass="text-rose-500 bg-rose-500/20"
                      />
                      <MenuCard 
                        title="Animations" 
                        description="Micro-interactions & Motion" 
                        icon={Play} 
                        onClick={() => setActiveDesignSection('animations')}
                        colorClass="text-cyan-500 bg-cyan-500/20"
                      />
                      <MenuCard 
                        title={isDarkMode ? "Dark Mode" : "Light Mode"}
                        description="Toggle application theme" 
                        icon={isDarkMode ? Moon : Sun} 
                        onClick={toggleTheme}
                        colorClass="text-slate-500 bg-slate-500/20"
                        action={
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-background border shadow-sm">
                            {isDarkMode ? "On" : "Off"}
                          </div>
                        }
                      />
                      <MenuCard 
                        title={isCurrentUserPremium ? "Premium" : "Free"}
                        description="Toggle your account tier"
                        icon={isCurrentUserPremium ? CrownFilledIcon : CrownIcon}
                        onClick={togglePremium}
                        colorClass={isCurrentUserPremium ? "text-amber-500 bg-amber-500/20" : "text-slate-400 bg-slate-400/20"}
                        action={
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-background border shadow-sm">
                            {isCurrentUserPremium ? "On" : "Off"}
                          </div>
                        }
                      />
                      <MenuCard 
                        title={useGreenGradient ? "Green CTA" : "Pink CTA"}
                        description="Toggle Connect Now gradient"
                        icon={Palette}
                        onClick={toggleGradient}
                        colorClass={useGreenGradient ? "text-teal-500 bg-teal-500/20" : "text-pink-500 bg-pink-500/20"}
                        action={
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-background border shadow-sm">
                            {useGreenGradient ? "Green" : "Pink"}
                          </div>
                        }
                      />
                    </div>

                    {/* Screens Section */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Screens</h2>
                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">WIP</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         {/* Profile Card Screen Entry */}
                         <button 
                            onClick={() => setActiveScreen('profile_card')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <BoxSelect className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">Profile Card</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">Main match interaction card</p>
                                  </div>
                               </div>
                            </div>
                         </button>

                         {/* Reg & Onboarding Screen Entry */}
                         <button 
                            onClick={() => setActiveScreen('onboarding')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <LayoutGrid className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">Reg & Onboarding</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">Registration & sign-up flow</p>
                                  </div>
                               </div>
                            </div>
                         </button>

                         {/* Connect Message Screen Entry */}
                         <button 
                            onClick={() => setActiveScreen('connect_message')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <MessageSquare className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">Connect Message</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">SIA compose sheet flow</p>
                                  </div>
                               </div>
                            </div>
                         </button>

                         {/* SIA Onboarding Screen Entry */}
                         <button 
                            onClick={() => setActiveScreen('sia_onboarding')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <Sparkles className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">SIA Onboarding</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">AI chat-based match intro</p>
                                  </div>
                               </div>
                            </div>
                         </button>

                         {/* SIA Onboarding 2 Screen Entry (5+5 progressive reveal) */}
                         <button 
                            onClick={() => setActiveScreen('sia_onboarding_2')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <Sparkles className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">SIA Onboarding 2</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">5+5 progressive reveal</p>
                                  </div>
                               </div>
                            </div>
                         </button>

                         {/* Premium Upgrade Screen Entry */}
                         <button 
                            onClick={() => setActiveScreen('premium_upgrade')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <CrownFilledIcon className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">Premium Upgrade</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">Pricing plans & upgrade flow</p>
                                  </div>
                               </div>
                            </div>
                         </button>

                         {/* Chat Version One Screen Entry */}
                         <button
                            onClick={() => setActiveScreen('chat_version_one')}
                            className="aspect-[3/4] bg-card rounded-2xl border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all text-left"
                         >
                            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center p-4">
                               <div className="flex flex-col items-center gap-3 text-center">
                                  <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                                    <ChatIcon className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-semibold mb-1">Chat Version One</h3>
                                    <p className="text-[10px] text-muted-foreground leading-tight">Frozen baseline chat tab</p>
                                  </div>
                               </div>
                            </div>
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* LEVEL 2: CONTENT SECTIONS */}
                
                {/* Foundations */}
                {activeDesignSection === 'foundations' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
                       <Button variant="ghost" size="icon" onClick={() => setActiveDesignSection('menu')} className="-ml-2">
                          <ChevronLeft size={24} />
                       </Button>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Foundations</h2>
                      </div>
                    </section>

                    {/* Typography */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-2 mb-2 border-b pb-2">
                        <Type className="text-primary" size={24} />
                        <h2 className="text-lg font-bold uppercase tracking-wider">Typography</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Scale */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Type Scale</h3>
                          <div className="grid gap-6 overflow-hidden">
                            <div className="flex flex-col gap-1 border-b pb-4">
                              <span className="text-3xl font-bold truncate">3xl Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-3xl (32px)</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b pb-4">
                              <span className="text-2xl font-bold truncate">2xl Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-2xl (24px)</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b pb-4">
                              <span className="text-xl font-bold truncate">xl Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-xl (20px)</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b pb-4">
                              <span className="text-lg font-bold truncate">lg Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-lg (18px)</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b pb-4">
                              <span className="text-base font-bold truncate">Base Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-base (16px)</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b pb-4">
                              <span className="text-sm font-bold truncate">Small Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-sm (14px)</span>
                            </div>
                            <div className="flex flex-col gap-1 pb-4">
                              <span className="text-xs font-bold truncate">Extra Small Text</span>
                              <span className="text-xs text-muted-foreground font-mono">text-xs (12px)</span>
                            </div>
                          </div>
                        </div>

                        {/* Weights */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weights (Roboto)</h3>
                          <div className="grid gap-4">
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-bold">Bold (700)</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-medium">Medium (500)</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-normal">Normal (400)</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-light">Light (300)</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-thin">Thin (100)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Color System */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-2 mb-2 border-b pb-2">
                        <Palette className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold uppercase tracking-wider">Color System</h2>
                      </div>
                      
                      <div className="space-y-8 bg-card p-6 rounded-3xl border shadow-sm">
                        <ColorScale name="Brand (Primary)" variablePrefix="color-brand" baseHex="#0AA4B8" />
                        <ColorScale name="Accent (Coral Red)" variablePrefix="color-accent-palette" baseHex="#FF5A60" />
                        <ColorScale name="Neutral (Secondary)" variablePrefix="color-neutral" baseHex="Slate" />
                        <ColorScale name="Success (Emerald)" variablePrefix="color-success" baseHex="#10B981" />
                        <ColorScale name="Warning (Amber)" variablePrefix="color-warning" baseHex="#F59E0B" />
                      </div>

                      {/* Gradients */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Gradients</h3>
                        <div className="space-y-4">
                          {/* Connect Gradient */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <h4 className="text-sm font-semibold text-foreground">Connect (CTA)</h4>
                              <span className="text-[10px] font-mono text-muted-foreground">#0AA4B8 → #09BF6C</span>
                            </div>
                            <div
                              className="h-14 w-full rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                              style={{ backgroundImage: 'linear-gradient(-6.59deg, rgb(10, 164, 184) 13.336%, rgb(9, 191, 108) 85.792%)' }}
                            />
                            <p className="text-[10px] text-muted-foreground font-mono">linear-gradient(-6.59deg, #0AA4B8 13%, #09BF6C 86%)</p>
                          </div>

                          {/* SIA Gradient */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <h4 className="text-sm font-semibold text-foreground">SIA (AI Brand)</h4>
                              <span className="text-[10px] font-mono text-muted-foreground">4-stop</span>
                            </div>
                            <div
                              className="h-14 w-full rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                              style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                            />
                            <p className="text-[10px] text-muted-foreground font-mono">#FF5A60 → #CC7AFF → #0094FF → #00BCD5</p>
                          </div>

                          {/* SIA Logo V1 Gradient */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <h4 className="text-sm font-semibold text-foreground">SIA Logo V1</h4>
                              <span className="text-[10px] font-mono text-muted-foreground">3-stop</span>
                            </div>
                            <div
                              className="h-14 w-full rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                              style={{ backgroundImage: 'linear-gradient(135deg, #FF4596 0%, #9472FA 50%, #0DD2F5 100%)' }}
                            />
                            <p className="text-[10px] text-muted-foreground font-mono">#FF4596 → #9472FA → #0DD2F5</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* UI Components */}
                {activeDesignSection === 'components' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
                      <Button variant="ghost" size="icon" onClick={() => setActiveDesignSection('menu')} className="-ml-2">
                        <ChevronLeft size={24} />
                      </Button>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">UI Components</h2>
                      </div>
                    </section>

                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Buttons</h3>
                        <p className="text-sm text-muted-foreground">Pill-shaped, varied states and sizes.</p>
                      </div>

                      {/* Variants Grid */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Variants</h4>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="default">Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link</Button>
                        </div>
                      </div>

                      {/* Sizes Grid */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Sizes</h4>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon"><Plus size={20} /></Button>
                        </div>
                      </div>

                      {/* States Grid */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">States</h4>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button disabled>Disabled</Button>
                            <Button disabled variant="secondary">Disabled Secondary</Button>
                            <Button loading>Loading</Button>
                            <Button className="gap-2">
                              <Save size={16} /> With Icon
                            </Button>
                            <Button className="gap-2" variant="outline">
                              Next Step <ArrowRight size={16} />
                            </Button>
                        </div>
                      </div>
                    </div>

                    {/* Chip Playground */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Tag className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">Chips</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Compact elements that represent an input, attribute, or action.</p>
                        </div>

                        {/* Medium (Default) */}
                        <div className="space-y-3">
                           <span className="text-xs font-bold uppercase text-muted-foreground">Medium (32px)</span>
                           <div className="flex flex-wrap gap-3">
                             <Chip label="Unselected" />
                             <Chip label="Selected" selected />
                             <Chip label="With Icon" iconLeft={<CrownFilledIcon className="w-4 h-4" />} />
                             <Chip label="Selected Icon" selected iconLeft={<CrownFilledIcon className="w-4 h-4" />} />
                           </div>
                        </div>

                        {/* Small */}
                        <div className="space-y-3">
                           <span className="text-xs font-bold uppercase text-muted-foreground">Small (28px)</span>
                           <div className="flex flex-wrap gap-3">
                             <Chip size="sm" label="Unselected" />
                             <Chip size="sm" label="Selected" selected />
                             <Chip size="sm" label="With Icon" iconLeft={<CrownFilledIcon className="w-3.5 h-3.5" />} />
                           </div>
                        </div>

                         {/* XS */}
                        <div className="space-y-3">
                           <span className="text-xs font-bold uppercase text-muted-foreground">Extra Small (20px)</span>
                           <div className="flex flex-wrap gap-3">
                             <Chip size="xs" label="Unselected" />
                             <Chip size="xs" label="Selected" selected />
                             <Chip size="xs" label="With Icon" iconLeft={<CrownFilledIcon className="w-3 h-3" />} />
                           </div>
                        </div>
                      </div>

                    {/* Select Chips (Type 2) */}
                    <SelectChipShowcase />

                  </div>
                )}

                {/* Pictorials */}
                {activeDesignSection === 'pictorials' && (
                  <PictorialsShowcase onBack={() => setActiveDesignSection('menu')} />
                )}

                {/* Icons */}
                {activeDesignSection === 'icons' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
                      <Button variant="ghost" size="icon" onClick={() => setActiveDesignSection('menu')} className="-ml-2">
                        <ChevronLeft size={24} />
                      </Button>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Icons</h2>
                      </div>
                    </section>

                    <div className="bg-card p-6 rounded-3xl border shadow-sm">
                      {/* Changed to flex-wrap for better flow, removing rigid grid to avoid overlaps */}
                      <div className="flex flex-wrap gap-x-4 gap-y-12 justify-between">
                        {/* Home */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Home</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <HomeIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <HomeFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Matches */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Matches</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <MatchesIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <MatchesFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Inbox */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Inbox</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <InboxIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <InboxFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Chat */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Chat</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <ChatIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <ChatFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Premium */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Premium</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CrownIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CrownFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Camera */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Camera</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CameraIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CameraFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Photo */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Photo</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <PhotoIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <PhotoFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Tick */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Tick</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <TickIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <TickFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* More */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">More</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <MoreIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <MoreFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Verification */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Verification</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <VerificationIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <VerificationFilledIcon className="text-blue-500" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Menu (Hamburger) */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Menu</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <HamburgerIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <HamburgerFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Search */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Search</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CustomSearchIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <SearchFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Notification */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Notification</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <NotificationIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <NotificationFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Filter */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Filter</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <FilterIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <FilterFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Back Arrow */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Back</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <BackArrowIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <BackArrowFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Call */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Call</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CallIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <CallFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">WhatsApp</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <WhatsAppIcon className="text-[#25D366]" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Brand</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <WhatsAppFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Mono</span>
                            </div>
                          </div>
                        </div>

                        {/* Astro */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Astro</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <AstroIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <AstroFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col items-center gap-4 min-w-[120px]">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Navigation</span>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <NavigationIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Outline</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-4 bg-secondary/30 rounded-xl">
                                <NavigationFilledIcon className="text-foreground" />
                              </div>
                              <span className="text-[10px] text-muted-foreground">Filled</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* ═══ SIA / AI Icons ═══ */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold">SIA / AI Icons</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">AI-specific icons used across the SIA compose interface.</p>
                      </div>

                      {/* Static Icons */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Static Icons</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-8">
                          {/* SIA Sparkle */}
                          <div className="flex flex-col items-center gap-3 min-w-[80px]">
                            <div className="p-4 bg-secondary/30 rounded-xl flex items-center justify-center">
                              <SiaIcon className="text-foreground" size={20} />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-muted-foreground block">SIA Sparkle</span>
                              <span className="text-[9px] text-muted-foreground/60 font-mono block">13px default</span>
                            </div>
                          </div>

                          {/* AI Retry */}
                          <div className="flex flex-col items-center gap-3 min-w-[80px]">
                            <div className="p-4 bg-secondary/30 rounded-xl flex items-center justify-center">
                              <AiRetryIcon className="text-foreground" size={20} />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-muted-foreground block">AI Retry</span>
                              <span className="text-[9px] text-muted-foreground/60 font-mono block">13px default</span>
                            </div>
                          </div>

                          {/* SIA Logo V1 */}
                          <div className="flex flex-col items-center gap-3 min-w-[80px]">
                            <div className="p-4 bg-secondary/30 rounded-xl flex items-center justify-center">
                              <SiaLogo size={36} />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-muted-foreground block">Logo V1</span>
                              <span className="text-[9px] text-muted-foreground/60 font-mono block">36px default</span>
                            </div>
                          </div>

                          {/* SIA Logo V2 (static snapshot) */}
                          <div className="flex flex-col items-center gap-3 min-w-[80px]">
                            <div className="p-4 bg-secondary/30 rounded-xl flex items-center justify-center">
                              <SiaLogoV2 size={36} />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-muted-foreground block">Logo V2</span>
                              <span className="text-[9px] text-muted-foreground/60 font-mono block">36px default</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Animated Variants */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Animated Variants</h4>
                        <div className="flex flex-wrap gap-6">
                          {/* Animation A: Full Rotate */}
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-5 bg-secondary/30 rounded-xl flex items-center justify-center">
                              <motion.div
                                className="shrink-0"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                              >
                                <SiaLogo size={36} />
                              </motion.div>
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-foreground font-medium block">Full Rotate</span>
                              <span className="text-[9px] text-muted-foreground/60 font-mono block">1.6s linear</span>
                            </div>
                          </div>

                          {/* Animation B: Star Rotate */}
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-5 bg-secondary/30 rounded-xl flex items-center justify-center">
                              <SiaLogoV2 size={36} />
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-foreground font-medium block">Star Rotate</span>
                              <span className="text-[9px] text-muted-foreground/60 font-mono block">2.4s linear</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Button Playground */}
                    <section className="space-y-6 pt-6 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <BoxSelect className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold uppercase tracking-wider">Button Integration Playground</h2>
                      </div>
                      
                      <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                        <p className="text-sm text-muted-foreground">Demonstrating icon alignment and sizing within different button tiers (using filled icons as default).</p>

                        {/* Large */}
                        <div className="flex flex-col items-start gap-4 pb-4 border-b">
                          <span className="text-xs font-bold uppercase text-muted-foreground">Large</span>
                          <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="gap-2">
                              <CrownFilledIcon className="w-5 h-5" />
                              <span>Left Icon</span>
                            </Button>
                            <Button size="lg" variant="secondary" className="gap-2">
                              <span>Right Icon</span>
                              <CrownFilledIcon className="w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2">
                              <CrownFilledIcon className="w-5 h-5" />
                              <span>Outline</span>
                            </Button>
                          </div>
                        </div>

                        {/* Default */}
                        <div className="flex flex-col items-start gap-4 pb-4 border-b">
                          <span className="text-xs font-bold uppercase text-muted-foreground">Default</span>
                          <div className="flex flex-wrap gap-4">
                            <Button size="default" className="gap-1.5">
                              <CrownFilledIcon className="w-5 h-5" />
                              <span>Left Icon</span>
                            </Button>
                            <Button size="default" variant="secondary" className="gap-1.5">
                              <span>Right Icon</span>
                              <CrownFilledIcon className="w-5 h-5" />
                            </Button>
                            <Button size="default" variant="outline" className="gap-1.5">
                              <CrownFilledIcon className="w-5 h-5" />
                              <span>Outline</span>
                            </Button>
                          </div>
                        </div>

                        {/* Medium */}
                        <div className="flex flex-col items-start gap-4 pb-4 border-b">
                          <span className="text-xs font-bold uppercase text-muted-foreground">Medium</span>
                          <div className="flex flex-wrap gap-4">
                            <Button size="md" className="gap-1.5">
                              <CrownFilledIcon className="w-4 h-4" />
                              <span>Left Icon</span>
                            </Button>
                            <Button size="md" variant="secondary" className="gap-1.5">
                              <span>Right Icon</span>
                              <CrownFilledIcon className="w-4 h-4" />
                            </Button>
                            <Button size="md" variant="outline" className="gap-1.5">
                              <CrownFilledIcon className="w-4 h-4" />
                              <span>Outline</span>
                            </Button>
                          </div>
                        </div>

                        {/* Small */}
                        <div className="flex flex-col items-start gap-4">
                          <span className="text-xs font-bold uppercase text-muted-foreground">Small</span>
                          <div className="flex flex-wrap gap-4">
                            <Button size="sm" className="gap-1">
                              <CrownFilledIcon className="w-4 h-4" />
                              <span>Left Icon</span>
                            </Button>
                            <Button size="sm" variant="secondary" className="gap-1">
                              <span>Right Icon</span>
                              <CrownFilledIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <CrownFilledIcon className="w-4 h-4" />
                              <span>Outline</span>
                            </Button>
                          </div>
                        </div>

                      </div>
                    </section>

                    {/* ═══ SIA / AI Chips ═══ */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold">AI Chips</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">SIA gradient-bordered chips for AI actions. Used in compose card bottom row.</p>
                      </div>

                      {/* 32px (Default) */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Default (32px)</span>
                        <div className="flex flex-wrap gap-3">
                          {/* Write with SIA */}
                          <button
                            className="h-8 rounded-full flex items-center p-[1.5px]"
                            style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                          >
                            <div className="bg-background h-full rounded-full px-2.5 flex items-center gap-1">
                              <SiaIcon className="text-foreground" size={13} />
                              <span className="text-foreground" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Write with SIA
                              </span>
                            </div>
                          </button>
                          {/* Try another */}
                          <button
                            className="h-8 rounded-full flex items-center p-[1.5px]"
                            style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                          >
                            <div className="bg-background h-full rounded-full px-2.5 flex items-center gap-1">
                              <AiRetryIcon className="text-foreground" size={13} />
                              <span className="text-foreground" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Try another
                              </span>
                            </div>
                          </button>
                          {/* Disabled state */}
                          <button
                            className="h-8 rounded-full flex items-center p-[1.5px] opacity-40 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                          >
                            <div className="bg-background h-full rounded-full px-2.5 flex items-center gap-1">
                              <SiaIcon className="text-foreground" size={13} />
                              <span className="text-foreground" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Disabled
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* 36px */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase text-muted-foreground">Large (36px)</span>
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="h-9 rounded-full flex items-center p-[1.5px]"
                            style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                          >
                            <div className="bg-background h-full rounded-full px-3 flex items-center gap-1.5">
                              <SiaIcon className="text-foreground" size={14} />
                              <span className="text-foreground" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Write with SIA
                              </span>
                            </div>
                          </button>
                          <button
                            className="h-9 rounded-full flex items-center p-[1.5px]"
                            style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                          >
                            <div className="bg-background h-full rounded-full px-3 flex items-center gap-1.5">
                              <AiRetryIcon className="text-foreground" size={14} />
                              <span className="text-foreground" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                Try another
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ═══ Circular & Special Buttons ═══ */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold">Circular & Special Buttons</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Branded circular action buttons and SIA floating action button from Figma.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Circular Action Buttons</h4>
                        <div className="flex flex-wrap items-end gap-6">
                          {/* WhatsApp Button */}
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12">
                              <WhatsAppButton />
                            </div>
                            <span className="text-[10px] text-muted-foreground">WhatsApp</span>
                          </div>

                          {/* Call Button */}
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12">
                              <CallButton />
                            </div>
                            <span className="text-[10px] text-muted-foreground">Call</span>
                          </div>
                        </div>
                      </div>


                    </div>

                  </div>
                )}

                {/* Inputs */}
                {activeDesignSection === 'inputs' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
                      <Button variant="ghost" size="icon" onClick={() => setActiveDesignSection('menu')} className="-ml-2">
                        <ChevronLeft size={24} />
                      </Button>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Inputs</h2>
                      </div>
                    </section>

                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Text Fields</h3>
                        <p className="text-sm text-muted-foreground">Rounded 16px, Floating Labels.</p>
                      </div>

                      <div className="grid gap-6">
                        {/* Standard Types */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Floating Labels</h4>
                          <FloatingLabelInput label="Email Address" type="email" />
                          <FloatingLabelInput label="Password" type="password" />
                          <FloatingLabelInput label="Full Name" defaultValue="John Doe" />
                        </div>

                        {/* Exceptions */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Search / Icon Input</h4>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <Search size={18} />
                            </div>
                            <Input placeholder="Search..." className="pl-10" />
                          </div>
                        </div>

                        {/* States */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">States</h4>
                          <div className="space-y-1">
                              <FloatingLabelInput label="Disabled Input" disabled />
                          </div>
                          
                          <div className="space-y-1">
                              <FloatingLabelInput 
                                label="Error State" 
                                defaultValue="Invalid Value" 
                                className="border-destructive focus-visible:ring-destructive" 
                              />
                              <p className="text-xs text-destructive font-medium ml-4">This field is required.</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* ═══ Compose Textarea ═══ */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-8">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Compose Textarea</h3>
                        <p className="text-sm text-muted-foreground">Multi-line message compose card used in Connect Message bottom sheet. Fixed height with overflow hidden and SIA action row.</p>
                      </div>

                      <div className="grid gap-6">
                        {/* Default compose card */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Default (140px height)</h4>
                          <div
                            className="rounded-2xl border overflow-hidden"
                            style={{
                              backgroundColor: 'color-mix(in srgb, var(--color-muted) 50%, var(--color-background))',
                              borderColor: 'var(--color-input)',
                            }}
                          >
                            <div className="px-3.5 pt-3.5 pb-2 overflow-hidden" style={{ height: 140 }}>
                              <textarea
                                defaultValue="Hi Priya, I came across your profile and really liked what you shared about yourself. I'm Pratik, and I think we could have some great conversations."
                                className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none"
                                style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400 }}
                              />
                            </div>
                            <div className="flex items-center justify-between pl-1.5 pr-3 pb-3 pt-1">
                              <div />
                              <button
                                className="h-8 rounded-full flex items-center p-[1.5px]"
                                style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                              >
                                <div className="bg-background h-full rounded-full px-2.5 flex items-center gap-1">
                                  <AiRetryIcon className="text-foreground" size={13} />
                                  <span className="text-foreground" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                    Try another
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Empty state */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Empty State</h4>
                          <div
                            className="rounded-2xl border overflow-hidden"
                            style={{
                              backgroundColor: 'color-mix(in srgb, var(--color-muted) 50%, var(--color-background))',
                              borderColor: 'var(--color-input)',
                            }}
                          >
                            <div className="px-3.5 pt-3.5 pb-2 overflow-hidden" style={{ height: 140 }}>
                              <textarea
                                placeholder="Say something nice..."
                                className="w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none"
                                style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400 }}
                              />
                            </div>
                            <div className="flex items-center justify-between pl-1.5 pr-3 pb-3 pt-1">
                              <div />
                              <button
                                className="h-8 rounded-full flex items-center p-[1.5px]"
                                style={{ backgroundImage: 'linear-gradient(157.913deg, rgb(255, 90, 96) 5%, rgb(204, 122, 255) 36.25%, rgb(0, 148, 255) 77.5%, rgb(0, 188, 213) 120%)' }}
                              >
                                <div className="bg-background h-full rounded-full px-2.5 flex items-center gap-1">
                                  <SiaIcon className="text-foreground" size={13} />
                                  <span className="text-foreground" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.2px' }}>
                                    Write with SIA
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Profile Images Audit */}
                {activeDesignSection === 'profile_images' && (
                  <ProfileImagesShowcase onBack={() => setActiveDesignSection('menu')} />
                )}

                {/* Animations / Micro-interactions */}
                {activeDesignSection === 'animations' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <section className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur z-40 py-2 -mx-4 px-4 border-b md:static md:bg-transparent md:border-none md:p-0 md:m-0">
                      <Button variant="ghost" size="icon" onClick={() => setActiveDesignSection('menu')} className="-ml-2">
                        <ChevronLeft size={24} />
                      </Button>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Animations</h2>
                      </div>
                    </section>

                    {/* Typing Cursor */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-6">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Typing Cursor</h3>
                        <p className="text-sm text-muted-foreground">Blinking inline cursor shown during SIA message typing phase. 1.4px wide, brand-colored, 0.6s pulse.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Live Preview</h4>
                        <div className="bg-secondary/20 rounded-xl p-4">
                          <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '24px' }}>
                            Hi Priya, your profile caught my eye<TypingCursor />
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Width:</span>
                            <span className="text-[10px] text-foreground font-mono">1.4px</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Height:</span>
                            <span className="text-[10px] text-foreground font-mono">16px</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Duration:</span>
                            <span className="text-[10px] text-foreground font-mono">0.6s</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Color:</span>
                            <span className="text-[10px] text-foreground font-mono">brand-500</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SIA Generating State */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-6">
                      <div>
                        <h3 className="text-lg font-bold mb-1">SIA Generating State</h3>
                        <p className="text-sm text-muted-foreground">Loading indicator shown while SIA generates a message. Top-left aligned rotating logo + descriptive text. No skeleton bars.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Animation A — Full Rotate</h4>
                        <div className="bg-secondary/20 rounded-xl p-4">
                          <SiaGeneratingState animationType="full-rotate" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Logo:</span>
                            <span className="text-[10px] text-foreground font-mono">V1 (20px)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Rotation:</span>
                            <span className="text-[10px] text-foreground font-mono">360° / 1.6s</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Animation B — Star Rotate</h4>
                        <div className="bg-secondary/20 rounded-xl p-4">
                          <SiaGeneratingState animationType="star-rotate" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Logo:</span>
                            <span className="text-[10px] text-foreground font-mono">V2 (20px)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Star rotation:</span>
                            <span className="text-[10px] text-foreground font-mono">360° / 2.4s</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Background:</span>
                            <span className="text-[10px] text-foreground font-mono">Static</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SIA Logo Animations */}
                    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-6">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Logo Animations</h3>
                        <p className="text-sm text-muted-foreground">Standalone SIA logo animation variants at multiple sizes.</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Full Rotate (V1)</h4>
                        <div className="flex items-end gap-6">
                          {[20, 28, 36, 48].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                              <div className="bg-secondary/20 rounded-xl p-3 flex items-center justify-center">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}>
                                  <SiaLogo size={s} />
                                </motion.div>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">{s}px</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Star Rotate (V2)</h4>
                        <div className="flex items-end gap-6">
                          {[20, 28, 36, 48].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                              <div className="bg-secondary/20 rounded-xl p-3 flex items-center justify-center">
                                <SiaLogoV2 size={s} />
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">{s}px</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Gradient Window (V3)</h4>
                        <p className="text-[11px] text-muted-foreground">Shape + sparkle rotate while the gradient stays fixed — creates a shifting color-through-silhouette effect.</p>
                        <div className="flex items-end gap-6">
                          {[20, 28, 36, 48].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                              <div className="bg-secondary/20 rounded-xl p-3 flex items-center justify-center">
                                <SiaLogoV3 size={s} duration={1.6} />
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">{s}px</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Shape:</span>
                            <span className="text-[10px] text-foreground font-mono">Rotating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Gradient:</span>
                            <span className="text-[10px] text-foreground font-mono">Static</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Duration:</span>
                            <span className="text-[10px] text-foreground font-mono">1.6s</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Static Sparkle (V4)</h4>
                        <p className="text-[11px] text-muted-foreground">Only the flower shape rotates — both gradient and sparkle stay perfectly still.</p>
                        <div className="flex items-end gap-6">
                          {[20, 28, 36, 48].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                              <div className="bg-secondary/20 rounded-xl p-3 flex items-center justify-center">
                                <SiaLogoV4 size={s} duration={1.6} />
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">{s}px</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Shape:</span>
                            <span className="text-[10px] text-foreground font-mono">Rotating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Gradient:</span>
                            <span className="text-[10px] text-foreground font-mono">Static</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Sparkle:</span>
                            <span className="text-[10px] text-foreground font-mono">Static</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">Duration:</span>
                            <span className="text-[10px] text-foreground font-mono">1.6s</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB: INBOX */}
            {activeMainTab === 'inbox' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full relative">
                {/* Fixed Tabs — underlined text style */}
                <InboxTabs
                  selectedId={inboxFilter}
                  onSelect={setInboxFilter}
                  tabs={[
                    { id: 'received', label: `Received (${inboxPendingCount})` },
                    { id: 'accepted', label: 'Accepted (19)' },
                    { id: 'contacts', label: 'Contacts' },
                    { id: 'sent', label: 'Sent' },
                    { id: 'more', label: 'More' },
                  ]}
                />

                {inboxFilter === 'received' ? (
                  <>
                    {/* Sub-header: Filter pill + Sort dropdown + Card/List toggle */}
                    <InboxSubHeader
                      sortOption={inboxSortOption}
                      onSortChange={(opt) => {
                        if (opt === 'recentlyActive' && !isCurrentUserPremium) {
                          setShowPremiumFromFilters(true);
                          return;
                        }
                        setInboxSortOption(opt);
                      }}
                      viewMode={inboxViewMode}
                      onViewModeChange={setInboxViewMode}
                      onOpenFilterSheet={() => setShowInboxFilterSheet(true)}
                      activeFilterCount={inboxActiveFilterCount}
                      isCurrentUserPremium={isCurrentUserPremium}
                      filterExperienceVersion={filterExperienceVersion}
                      isScrolled={inboxSubHeaderScrolled}
                      openSortMenuForFigmaCapture={figmaCaptureInboxSortOpen}
                      quickChipState={{
                        verified: inboxFilters.verified,
                        withPhoto: inboxFilters.withPhoto,
                        recentlyJoined: inboxFilters.recentlyJoined,
                        nearBy: inboxFilters.nearBy,
                      }}
                      onToggleQuickChip={toggleInboxQuickChip}
                    />

                    {/* Content: Card view (swipe) or List view */}
                    {inboxViewMode === 'card' ? (
                      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide pb-[16px]" onScroll={handleInboxContentScroll}>
                        <InboxReceivedView
                          requests={inboxPendingRequests}
                          isCurrentUserPremium={isCurrentUserPremium}
                          onAccept={handleInboxAccept}
                          onDecline={handleInboxDecline}
                          onViewProfile={handleViewInboxProfile}
                          hasActiveFilters={inboxActiveFilterCount > 0}
                          onClearFilters={() => setInboxFilters(PARTNER_PREFERENCE_BASELINE_FILTERS)}
                          fallbackRequests={
                            inboxActiveFilterCount > 0 && inboxPendingRequests.length === 0
                              ? inboxSortedOtherRequests
                              : undefined
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-[16px]" onScroll={handleInboxContentScroll}>
                        <InboxListView
                          requests={inboxPendingRequests}
                          isCurrentUserPremium={isCurrentUserPremium}
                          onAccept={handleInboxAccept}
                          onDecline={handleInboxDecline}
                          onViewProfile={handleViewInboxProfile}
                          otherRequests={
                            inboxActiveFilterCount > 0 && inboxPendingRequests.length === 0
                              ? inboxSortedOtherRequests
                              : undefined
                          }
                          hasActiveFilters={inboxActiveFilterCount > 0}
                          onClearFilters={() => setInboxFilters(PARTNER_PREFERENCE_BASELINE_FILTERS)}
                        />
                      </div>
                    )}

                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 text-muted-foreground">
                    <div className="p-6 bg-muted/30 rounded-full">
                      <InboxIcon className="w-12 h-12 opacity-50" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{inboxFilter.charAt(0).toUpperCase() + inboxFilter.slice(1)}</h2>
                      <p>Coming Soon</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CHAT */}
            {activeMainTab === 'chat' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
                <FilterBar 
                  showIcon={false}
                  filters={[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'matched', label: 'Matched' }
                  ]}
                  selectedId={chatFilter}
                  onSelect={setChatFilter}
                />

                <ChatListView
                  conversations={chatV2Conversations}
                  onlineUsers={filteredOnlineUsers}
                  onOpenChat={(convo) => setActiveChatConversation(convo)}
                  onOpenOnlineChat={handleOpenOnlineChat}
                  showOnlineUsers={false}
                  listBottomSpacerClassName={
                    chatFilter !== 'all'
                      ? 'h-[16px]'
                      : promisingMatchesVariant === 'option2'
                        ? 'h-[220px]'
                        : promisingMatchesVariant === 'option3'
                          ? (option3Expanded ? 'h-[340px]' : 'h-[144px]')
                          : 'h-[128px]'
                  }
                />
              </div>
            )}

            {shouldShowPromisingMatches && (
              <PromisingMatchesPanel
                variant={promisingMatchesVariant}
                option3Sub={option3SubVariant}
                requests={promisingMatches}
                isCurrentUserPremium={isCurrentUserPremium}
                option3ActiveIndex={option3ActiveIndex}
                option3Expanded={option3Expanded}
                onToggleOption3Expanded={() => setOption3Expanded((prev) => !prev)}
                onOpenInbox={handleOpenPromisingInbox}
              />
            )}

            {/* CHAT CONVERSATION — full-screen slide-in overlay */}
            <AnimatePresence>
              {activeChatConversation && (
                <motion.div
                  className="absolute inset-0 z-50 bg-background"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.9 }}
                >
                  <ChatConversationScreen
                    conversation={activeChatConversation}
                    onBack={() => setActiveChatConversation(null)}
                    onFirstMessageSent={handleFirstMessageSent}
                    onMessageUpdate={handleMessageUpdate}
                    connectionStatus={getConnectionStatus(activeChatConversation.profile.id)}
                    onConnectFromChat={handleConnectFromChat}
                    onSendConnectMessage={handleSendConnectMessage}
                    onAcceptFromChat={handleAcceptFromChat}
                    onDeclineFromChat={handleDeclineFromChat}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB: PREMIUM — full-screen slide-in from right, hides bottom nav */}
            <AnimatePresence>
              {activeMainTab === 'premium' && (
                <motion.div
                  className="absolute inset-0 z-50 bg-background"
                  initial={{ x: '100%' }}
                  animate={{ x: '0%' }}
                  exit={{ x: '100%' }}
                  transition={{
                    type: 'tween',
                    duration: 0.32,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <PremiumUpgradeScreen
                    mode="tab"
                    onBack={() => setActiveMainTab(previousTabRef.current)}
                    onSkip={() => setActiveMainTab(previousTabRef.current)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </main>

        {/* Bottom Navigation - Fixed to Bottom via Absolute (hidden when premium tab or chat conversation is active) */}
        {activeMainTab !== 'premium' && !activeChatConversation && (
        <nav className="absolute bottom-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-t border-border/40 p-2 px-2 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
          <div className="flex justify-between items-center max-w-md mx-auto">
             <NavItem id="home" label="Home" icon={HomeIcon} activeIcon={HomeFilledIcon} />
             <NavItem id="matches" label="Matches" icon={MatchesIcon} activeIcon={MatchesFilledIcon} />
             <NavItem id="inbox" label="Inbox" icon={InboxIcon} activeIcon={InboxFilledIcon} badge={inboxPendingCount} />
             <NavItem id="chat" label="Chat" icon={ChatIcon} activeIcon={ChatFilledIcon} />
             <NavItem id="premium" label="Premium" icon={CrownIcon} activeIcon={CrownFilledIcon} />
          </div>
        </nav>
        )}

        {/* ═══ Side Drawer ═══ */}
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          isCurrentUserPremium={isCurrentUserPremium}
          onEditProfile={() => setActiveScreen('edit_profile')}
        />

        {/* ═══ Connect Message Overlays ═══ */}

        {/* Connect Message Bottom Sheet (shared first-connect experience) */}
        {connectingProfile && (
          <ConnectMessageSheet
            isOpen={showConnectSheet}
            onClose={handleCloseSheet}
            onSend={handleSendConnect}
            profile={connectingProfile}
            savedMessage={savedMessageFirstName ? replaceNameInMessage(savedConnectMessage, savedMessageFirstName, connectingProfile.name.split(' ')[0]) : savedConnectMessage}
            isFirstConnect={isFirstConnect}
            variant={connectVariant}
            showStats={showStats}
            showSubtitle={showSubtitle}
            useGreenGradient={useGreenGradient}
          />
        )}

        {/* ═══ Filter Overlays (top-level so they span the full phone frame) ═══ */}
        <SharedFilterBottomSheet
          isOpen={showMatchesFilterSheet}
          onClose={() => setShowMatchesFilterSheet(false)}
          value={matchesFilters}
          onApply={setMatchesFilters}
          estimateResultCount={(draftFilters) =>
            getFilteredProfiles().filter((profile) => profileMatchesSharedFilters(profile, draftFilters)).length
          }
          resultLabel="match"
          isCurrentUserPremium={isCurrentUserPremium}
          onPremiumUpgrade={() => setShowPremiumFromFilters(true)}
          iteration={filterExperienceVersion}
          currentUserIncomeCurrency={currentUserPersona.incomeCurrency}
          currentUserIsOutsideIndia={currentUserPersona.isOutsideIndia}
          currentUserReligion={currentUserPersona.religion}
          currentUserPersonaId={currentUserPersona.id}
          showFilterTabs={matchesFilter === 'matches'}
          premiumRowStyle={premiumRowStyle}
          premiumIndicatorGlyph={premiumIndicatorGlyph}
          premiumLockPromptPresentation={premiumLockPromptPresentation}
        />
        <SharedFilterBottomSheet
          isOpen={showInboxFilterSheet}
          onClose={() => setShowInboxFilterSheet(false)}
          value={inboxFilters}
          onApply={setInboxFilters}
          estimateResultCount={(draftFilters) =>
            inboxPendingRequestsRaw.filter((request) => profileMatchesSharedFilters(request.profile, draftFilters)).length
          }
          resultLabel="match"
          isCurrentUserPremium={isCurrentUserPremium}
          onPremiumUpgrade={() => setShowPremiumFromFilters(true)}
          iteration={filterExperienceVersion}
          currentUserIncomeCurrency={currentUserPersona.incomeCurrency}
          currentUserIsOutsideIndia={currentUserPersona.isOutsideIndia}
          currentUserReligion={currentUserPersona.religion}
          currentUserPersonaId={currentUserPersona.id}
          showFilterTabs={showFilterTabs}
          premiumRowStyle={premiumRowStyle}
          premiumIndicatorGlyph={premiumIndicatorGlyph}
          premiumLockPromptPresentation={premiumLockPromptPresentation}
        />

        {/* ═══ Premium Overlay from Filters (preserve filter sheet state) ═══ */}
        <AnimatePresence>
          {showPremiumFromFilters && (
            <motion.div
              className="absolute inset-0 z-[80] bg-background"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.32,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <PremiumUpgradeScreen
                mode="tab"
                onBack={() => setShowPremiumFromFilters(false)}
                onSkip={() => setShowPremiumFromFilters(false)}
                onContinue={() => {
                  setIsCurrentUserPremium(true);
                  setShowPremiumFromFilters(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Edit Profile Overlay ═══ */}
        <AnimatePresence>
          {activeScreen === 'edit_profile' && (
            <motion.div
              className="absolute inset-0 z-[70]"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.32,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <EditProfileView onBack={() => setActiveScreen(null)} isCurrentUserPremium={isCurrentUserPremium} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </MobileWrapper>
  );
}
