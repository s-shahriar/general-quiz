import { BookMarked } from 'lucide-react'

// Metadata only — `questions` load from the DB on demand (see contentLoader.js).
// Letters cycle through the 12 shared topic hue slots (see index.css).
const VOCAB_COLORS = Array.from({ length: 22 }, (_, i) => `var(--topic-${(i % 12) + 1})`)

const LETTERS = ['a','b','c','d','e','f','gh','i','jk','l','m','n','o','p','q','r','s','t','u','v','w','xyz']
const NAMES = { a:'A',b:'B',c:'C',d:'D',e:'E',f:'F',gh:'G–H',i:'I',jk:'J–K',l:'L',m:'M',n:'N',
                o:'O',p:'P',q:'Q',r:'R',s:'S',t:'T',u:'U',v:'V',w:'W',xyz:'X–Y–Z' }

export const VOCAB_TOPICS = LETTERS.map((L, i) => ({
  id: `vocab_${L}`,
  module: 'vocab',
  name: NAMES[L],
  shortName: NAMES[L],
  icon: BookMarked,
  color: VOCAB_COLORS[i],
  questions: [],
}))
