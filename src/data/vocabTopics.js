import { BookMarked } from 'lucide-react'

// Metadata only — `questions` load from the DB on demand (see contentLoader.js).
const VOCAB_COLORS = [
  '#22d3ee','#38bdf8','#60a5fa','#818cf8','#a78bfa','#c084fc',
  '#e879f9','#f472b6','#fb7185','#fb923c','#fbbf24','#facc15',
  '#a3e635','#4ade80','#34d399','#2dd4bf','#22d3ee','#38bdf8',
  '#60a5fa','#818cf8','#a78bfa','#c084fc',
]

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
