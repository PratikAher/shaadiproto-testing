import { MOCK_PROFILES, INBOX_PROFILE_INDICES } from './mockProfiles';
import type { InboxRequest } from '../app/components/inbox/InboxReceivedView';

// Pick a subset of profiles as "received" connect requests
// These simulate requests that other users have sent to the current user
// Uses centralized INBOX_PROFILE_INDICES: [2, 5, 7, 9, 11, 13, 20] — 7 profiles

const CONNECT_MESSAGES = [
  "Hi, I liked your profile and would like to get to know you better. Let's connect on Instagram or Whatsapp for better communication?",
  "Hello! Your profile really caught my attention. I think we share similar values and would love to connect.",
  "Namaste! I found your profile very interesting. I believe we could be a great match. Would love to know more about you.",
  "Hi there! I was impressed by your profile. Our families share similar backgrounds and I'd love to explore this connection.",
  "Hello, your profile resonated with me. I appreciate your honesty and would love to have a conversation.",
  "Hi! I think we have a lot in common. Would love to chat and get to know each other better.",
  "Namaste! Your profile stood out to me. I feel we could have a wonderful connection. Let's talk!",
];

const TIMESTAMPS = [
  'few hours ago',
  '2 hours ago',
  '5 hours ago',
  'yesterday',
  '1 day ago',
  '2 days ago',
  '3 days ago',
];

export const MOCK_INBOX_REQUESTS: InboxRequest[] = INBOX_PROFILE_INDICES.map((idx, i) => ({
  profile: MOCK_PROFILES[idx],
  message: CONNECT_MESSAGES[i % CONNECT_MESSAGES.length],
  timestamp: TIMESTAMPS[i % TIMESTAMPS.length],
}));

// ─────────────────────────────────────────────────────────────────────────────
// "More" tier — secondary interest pool surfaced after the user clears the
// top requests stack. Used by the Top/More Inbox prototype.
// Picks 7 profiles outside the primary INBOX_PROFILE_INDICES set.
// ─────────────────────────────────────────────────────────────────────────────
const MORE_INBOX_PROFILE_INDICES = [4, 6, 8, 14, 15, 16, 17];

const MORE_TIMESTAMPS = [
  '4 days ago',
  '5 days ago',
  '6 days ago',
  '1 week ago',
  '1 week ago',
  '2 weeks ago',
  '3 weeks ago',
];

export const MOCK_INBOX_MORE_REQUESTS: InboxRequest[] = MORE_INBOX_PROFILE_INDICES
  .map((idx, i) => {
    const profile = MOCK_PROFILES[idx];
    if (!profile) return null;
    return {
      profile,
      message: CONNECT_MESSAGES[i % CONNECT_MESSAGES.length],
      timestamp: MORE_TIMESTAMPS[i % MORE_TIMESTAMPS.length],
    } as InboxRequest;
  })
  .filter((r): r is InboxRequest => r !== null);
