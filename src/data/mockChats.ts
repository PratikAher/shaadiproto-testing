import { MOCK_PROFILES, ONLINE_NOW_PROFILE_INDICES, RECENT_CHAT_PROFILE_INDICES } from './mockProfiles';
import type { Profile } from '../app/components/matches/ProfileCard';

// ============================================================================
// CHAT DATA TYPES
// ============================================================================

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or profile id
  text: string;
  timestamp: string; // display string
  read: boolean;
}

export interface ChatConversation {
  id: string;
  profile: Profile;
  lastMessage: string;
  lastMessageTime: string;
  lastActivityTs: number; // numeric epoch for sorting (most recent = highest)
  unreadCount: number;
  isAccepted: boolean;
  messages: ChatMessage[];
}

export interface OnlineUser {
  id: string;
  profile: Profile;
}

// ============================================================================
// MOCK ONLINE USERS — 6 profiles from Inbox + Matches pools (overlap allowed)
// Uses centralized ONLINE_NOW_PROFILE_INDICES: [2, 5, 9, 0, 8, 14]
// First 3 are from Inbox pool, last 3 from Matches pool
// These are NOT accepted connections — tapping opens chat & auto-sends connect
// ============================================================================

export const MOCK_ONLINE_USERS: OnlineUser[] = ONLINE_NOW_PROFILE_INDICES.map((idx, i) => ({
  id: `online_${i + 1}`,
  profile: { ...MOCK_PROFILES[idx], isOnline: true },
}));

// ============================================================================
// AUTO-ACCEPT MESSAGES — randomly picked when user accepts a connect request
// ============================================================================

const AUTO_ACCEPT_MESSAGES = [
  "I liked your profile too! Happy to connect 😊",
  "Thanks for reaching out! Looking forward to chatting.",
  "Hey! Great to connect with you 🙂",
];

export function getRandomAcceptMessage(): string {
  return AUTO_ACCEPT_MESSAGES[Math.floor(Math.random() * AUTO_ACCEPT_MESSAGES.length)];
}

// ============================================================================
// MOCK CONVERSATIONS V1 — legacy baseline (2 profiles)
// ============================================================================

export const MOCK_CONVERSATIONS_V1: ChatConversation[] = [
  {
    id: 'chat_v1_1',
    profile: { ...MOCK_PROFILES[1], isOnline: true },
    lastMessage: 'I liked your profile too! Happy to connect 😊',
    lastMessageTime: '12:30 pm',
    lastActivityTs: Date.now() - 30 * 60 * 1000,
    unreadCount: 0,
    isAccepted: true,
    messages: [
      { id: 'm_v1_1', senderId: MOCK_PROFILES[1].id, text: 'Hi! I found your profile very interesting. I think we could be a great match!', timestamp: '12:15 pm', read: true },
      { id: 'm_v1_2', senderId: 'me', text: 'I liked your profile too! Happy to connect 😊', timestamp: '12:30 pm', read: true },
    ],
  },
  {
    id: 'chat_v1_2',
    profile: { ...MOCK_PROFILES[4], isOnline: false },
    lastMessage: "I'm a product designer. I love my work!",
    lastMessageTime: 'Yesterday',
    lastActivityTs: Date.now() - 24 * 60 * 60 * 1000,
    unreadCount: 0,
    isAccepted: true,
    messages: [
      { id: 'm_v1_3', senderId: MOCK_PROFILES[4].id, text: 'Hello! Your profile really caught my attention. I believe we share similar values and would love to connect.', timestamp: '2:00 pm', read: true },
      { id: 'm_v1_4', senderId: 'me', text: 'Thanks for reaching out! Looking forward to chatting.', timestamp: '2:20 pm', read: true },
      { id: 'm_v1_5', senderId: MOCK_PROFILES[4].id, text: 'I work in IT. What about you?', timestamp: '2:45 pm', read: true },
      { id: 'm_v1_6', senderId: 'me', text: "I'm a product designer. I love my work!", timestamp: '3:00 pm', read: true },
    ],
  },
];

// ============================================================================
// MOCK CONVERSATIONS — 11 pre-accepted profiles for Chat V2 default state
// Reuses centralized RECENT_CHAT_PROFILE_INDICES from mockProfiles
// ============================================================================

const CONVERSATION_SEEDS = [
  { incoming: 'Hi! I found your profile very interesting. I think we could be a great match!', reply: 'I liked your profile too! Happy to connect 😊', time: '12:30 pm', unreadCount: 0, minutesAgo: 30 },
  { incoming: 'Hello! Your profile really caught my attention. I believe we share similar values and would love to connect.', reply: "I'm a product designer. I love my work!", time: 'Yesterday', unreadCount: 0, minutesAgo: 24 * 60 },
  { incoming: 'Namaste! Your profile stood out to me. Would love to chat when you are free.', reply: 'Sure, we can connect this evening.', time: '11:40 am', unreadCount: 2, minutesAgo: 80 },
  { incoming: 'I saw we both enjoy travelling and reading. Happy to connect!', reply: 'That sounds great. Where do you usually travel?', time: '10:15 am', unreadCount: 1, minutesAgo: 165 },
  { incoming: 'Hey! I think our family values match really well.', reply: 'Thanks for the thoughtful message.', time: '9:05 am', unreadCount: 0, minutesAgo: 235 },
  { incoming: 'Good morning! Would love to know more about your interests.', reply: 'Good morning! I enjoy design, films, and fitness.', time: 'Yesterday', unreadCount: 3, minutesAgo: 32 * 60 },
  { incoming: 'Hi, are you based in Mumbai as well?', reply: 'Yes, I am in Mumbai currently.', time: 'Mon', unreadCount: 0, minutesAgo: 3 * 24 * 60 },
  { incoming: 'Your profile has a very positive vibe. Shall we connect?', reply: 'Thank you, happy to connect.', time: 'Sun', unreadCount: 0, minutesAgo: 4 * 24 * 60 },
  { incoming: 'I liked your profile. Looking forward to a meaningful conversation.', reply: 'Likewise. Nice to e-meet you.', time: 'Sat', unreadCount: 0, minutesAgo: 5 * 24 * 60 },
  { incoming: 'Hello! Let us get to know each other better.', reply: 'Absolutely, tell me about your work.', time: 'Fri', unreadCount: 0, minutesAgo: 6 * 24 * 60 },
  { incoming: 'We seem to have similar preferences. Happy to connect!', reply: 'Great, this sounds promising.', time: 'Thu', unreadCount: 1, minutesAgo: 7 * 24 * 60 },
];

export const MOCK_CONVERSATIONS: ChatConversation[] = RECENT_CHAT_PROFILE_INDICES
  .map((profileIndex, i) => {
    const profile = MOCK_PROFILES[profileIndex];
    const seed = CONVERSATION_SEEDS[i % CONVERSATION_SEEDS.length];
    if (!profile) return null;

    return {
      id: `chat_${i + 1}`,
      profile: { ...profile, isOnline: i < 3 },
      lastMessage: seed.reply,
      lastMessageTime: seed.time,
      lastActivityTs: Date.now() - seed.minutesAgo * 60 * 1000,
      unreadCount: seed.unreadCount,
      isAccepted: true,
      messages: [
        {
          id: `m_in_${i + 1}`,
          senderId: profile.id,
          text: seed.incoming,
          timestamp: seed.time,
          read: seed.unreadCount === 0,
        },
        {
          id: `m_out_${i + 1}`,
          senderId: 'me',
          text: seed.reply,
          timestamp: seed.time,
          read: true,
        },
      ],
    };
  })
  .filter((conversation): conversation is ChatConversation => conversation !== null);

// ============================================================================
// Helper: Create a new ChatConversation from an accepted inbox profile
// Now includes both their connect message AND Pratik's auto-accept reply
// ============================================================================

export function createConversationFromAccept(profile: Profile, connectMessage?: string, skipAutoReply?: boolean): ChatConversation {
  const initialMessage = connectMessage || `Hi! I'd love to connect with you.`;
  const acceptReply = getRandomAcceptMessage();
  const now = Date.now();

  const messages: ChatMessage[] = [
    {
      id: `m_connect_${now}`,
      senderId: profile.id,
      text: initialMessage,
      timestamp: 'Just now',
      read: true,
    },
  ];

  // Only add auto-reply when accepting from inbox list, not from chat view
  if (!skipAutoReply) {
    messages.push({
      id: `m_accept_${now}`,
      senderId: 'me',
      text: acceptReply,
      timestamp: 'Just now',
      read: true,
    });
  }

  return {
    id: `chat_accepted_${profile.id}_${now}`,
    profile: { ...profile, isOnline: profile.isOnline ?? false },
    lastMessage: skipAutoReply ? initialMessage : acceptReply,
    lastMessageTime: 'Just now',
    lastActivityTs: now,
    unreadCount: 0,
    isAccepted: true,
    messages,
  };
}

// ============================================================================
// Helper: Create a new ChatConversation when user initiates chat with an
// online user from the match pool (auto-sends connect request)
// ============================================================================

export function createConversationFromOnlineUser(profile: Profile): ChatConversation {
  return {
    id: `chat_online_${profile.id}_${Date.now()}`,
    profile: { ...profile, isOnline: true },
    lastMessage: 'Connect request sent',
    lastMessageTime: 'Just now',
    lastActivityTs: Date.now(),
    unreadCount: 0,
    isAccepted: false, // not yet accepted by the other person
    messages: [],
  };
}