import { BookMarked } from 'lucide-react'

import vocabA   from './vocab/a.json'
import vocabB   from './vocab/b.json'
import vocabC   from './vocab/c.json'
import vocabD   from './vocab/d.json'
import vocabE   from './vocab/e.json'
import vocabF   from './vocab/f.json'
import vocabGH  from './vocab/gh.json'
import vocabI   from './vocab/i.json'
import vocabJK  from './vocab/jk.json'
import vocabL   from './vocab/l.json'
import vocabM   from './vocab/m.json'
import vocabN   from './vocab/n.json'
import vocabO   from './vocab/o.json'
import vocabP   from './vocab/p.json'
import vocabQ   from './vocab/q.json'
import vocabR   from './vocab/r.json'
import vocabS   from './vocab/s.json'
import vocabT   from './vocab/t.json'
import vocabU   from './vocab/u.json'
import vocabV   from './vocab/v.json'
import vocabW   from './vocab/w.json'
import vocabXYZ from './vocab/xyz.json'

const VOCAB_COLORS = [
  '#22d3ee','#38bdf8','#60a5fa','#818cf8','#a78bfa','#c084fc',
  '#e879f9','#f472b6','#fb7185','#fb923c','#fbbf24','#facc15',
  '#a3e635','#4ade80','#34d399','#2dd4bf','#22d3ee','#38bdf8',
  '#60a5fa','#818cf8','#a78bfa','#c084fc',
]

export const VOCAB_TOPICS = [
  { id: 'vocab_a',   name: 'A',     shortName: 'A',     icon: BookMarked, color: VOCAB_COLORS[0],  questions: vocabA.questions   || [] },
  { id: 'vocab_b',   name: 'B',     shortName: 'B',     icon: BookMarked, color: VOCAB_COLORS[1],  questions: vocabB.questions   || [] },
  { id: 'vocab_c',   name: 'C',     shortName: 'C',     icon: BookMarked, color: VOCAB_COLORS[2],  questions: vocabC.questions   || [] },
  { id: 'vocab_d',   name: 'D',     shortName: 'D',     icon: BookMarked, color: VOCAB_COLORS[3],  questions: vocabD.questions   || [] },
  { id: 'vocab_e',   name: 'E',     shortName: 'E',     icon: BookMarked, color: VOCAB_COLORS[4],  questions: vocabE.questions   || [] },
  { id: 'vocab_f',   name: 'F',     shortName: 'F',     icon: BookMarked, color: VOCAB_COLORS[5],  questions: vocabF.questions   || [] },
  { id: 'vocab_gh',  name: 'G–H',   shortName: 'G–H',   icon: BookMarked, color: VOCAB_COLORS[6],  questions: vocabGH.questions  || [] },
  { id: 'vocab_i',   name: 'I',     shortName: 'I',     icon: BookMarked, color: VOCAB_COLORS[7],  questions: vocabI.questions   || [] },
  { id: 'vocab_jk',  name: 'J–K',   shortName: 'J–K',   icon: BookMarked, color: VOCAB_COLORS[8],  questions: vocabJK.questions  || [] },
  { id: 'vocab_l',   name: 'L',     shortName: 'L',     icon: BookMarked, color: VOCAB_COLORS[9],  questions: vocabL.questions   || [] },
  { id: 'vocab_m',   name: 'M',     shortName: 'M',     icon: BookMarked, color: VOCAB_COLORS[10], questions: vocabM.questions   || [] },
  { id: 'vocab_n',   name: 'N',     shortName: 'N',     icon: BookMarked, color: VOCAB_COLORS[11], questions: vocabN.questions   || [] },
  { id: 'vocab_o',   name: 'O',     shortName: 'O',     icon: BookMarked, color: VOCAB_COLORS[12], questions: vocabO.questions   || [] },
  { id: 'vocab_p',   name: 'P',     shortName: 'P',     icon: BookMarked, color: VOCAB_COLORS[13], questions: vocabP.questions   || [] },
  { id: 'vocab_q',   name: 'Q',     shortName: 'Q',     icon: BookMarked, color: VOCAB_COLORS[14], questions: vocabQ.questions   || [] },
  { id: 'vocab_r',   name: 'R',     shortName: 'R',     icon: BookMarked, color: VOCAB_COLORS[15], questions: vocabR.questions   || [] },
  { id: 'vocab_s',   name: 'S',     shortName: 'S',     icon: BookMarked, color: VOCAB_COLORS[16], questions: vocabS.questions   || [] },
  { id: 'vocab_t',   name: 'T',     shortName: 'T',     icon: BookMarked, color: VOCAB_COLORS[17], questions: vocabT.questions   || [] },
  { id: 'vocab_u',   name: 'U',     shortName: 'U',     icon: BookMarked, color: VOCAB_COLORS[18], questions: vocabU.questions   || [] },
  { id: 'vocab_v',   name: 'V',     shortName: 'V',     icon: BookMarked, color: VOCAB_COLORS[19], questions: vocabV.questions   || [] },
  { id: 'vocab_w',   name: 'W',     shortName: 'W',     icon: BookMarked, color: VOCAB_COLORS[20], questions: vocabW.questions   || [] },
  { id: 'vocab_xyz', name: 'X–Y–Z', shortName: 'X–Y–Z', icon: BookMarked, color: VOCAB_COLORS[21], questions: vocabXYZ.questions || [] },
]
