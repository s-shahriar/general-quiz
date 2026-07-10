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
