import { BANGLA_TOPICS, ENGLISH_TOPICS, GK_TOPICS, BANGLA_SAHITYA_TOPICS, LIVEMCQ_TOPICS } from './index.js'

// Maps a general home section (activeGroup / ?g=) to its topic list, so the
// Nailed/Important screens can scope to the section that opened them.
export const GROUP_TOPICS = {
  bangla: BANGLA_TOPICS,
  english: ENGLISH_TOPICS,
  sahitya: BANGLA_SAHITYA_TOPICS,
  gk: GK_TOPICS,
  livemcq: LIVEMCQ_TOPICS,
}

// The route each section lives at. Lives here rather than in HomeScreen so the
// topic-scoped screens (ModeSelect / Quiz / Study) can send "back" to the module
// a topic belongs to instead of dumping the user at the app root.
export const GROUP_PATHS = {
  bangla: '/bangla-grammer',
  english: '/english-grammer',
  sahitya: '/sahitto',
  gk: '/gk',
  livemcq: '/livemcq',
}

// A topic's `module` is the same key as its home section, so a topic alone is
// enough to find its way back. Unknown/missing module falls back to the root.
export function homePathForTopic(topic) {
  return GROUP_PATHS[topic?.module] ?? '/'
}
