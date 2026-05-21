/**
 * Iridescent border / wash for conversation starter chips (Figma Chat 💬).
 * Keep in sync with `ConversationStarterChip` and `AiWritingHeaderIcon`.
 */
export const CONVERSATION_STARTER_GRADIENT_CSS =
  'linear-gradient(136deg, hsl(358, 65%, 72%) 0%, hsl(277, 52%, 74%) 32%, hsl(205, 100%, 62%) 66%, hsl(187, 72%, 52%) 100%)';

/** SVG `<stop>` list — same stops & positions as `CONVERSATION_STARTER_GRADIENT_CSS`. */
export const CONVERSATION_STARTER_GRADIENT_STOPS: readonly { offset: string; color: string }[] = [
  { offset: '0%', color: 'hsl(358, 65%, 72%)' },
  { offset: '32%', color: 'hsl(277, 52%, 74%)' },
  { offset: '66%', color: 'hsl(205, 100%, 62%)' },
  { offset: '100%', color: 'hsl(187, 72%, 52%)' },
];
