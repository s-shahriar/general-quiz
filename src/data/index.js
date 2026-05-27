import {
  Volume2, Repeat, Shield, Link2, Tag, Layers, GitMerge, Target,
  BookOpen, Hash, Globe, CheckSquare,
  Type, Clock, PenTool, Users, Mic, MessageSquare, ArrowLeftRight,
  HelpCircle, MapPin, Layout, AlertCircle, Crosshair, Trophy,
  Award, Star, TrendingUp, DollarSign, Landmark, Cpu, Newspaper,
  Shuffle, BookMarked
} from 'lucide-react'

// ── Bangla Grammar topics ──────────────────────────────────────
import dhwoniOBorno    from './bangla/dhwoni_o_borno.json'
import dhwoniPori      from './bangla/dhwoni_poriborton.json'
import notwoBidhan     from './bangla/notwo_bidhan.json'
import sondhi          from './bangla/sondhi.json'
import uposhorgo       from './bangla/uposhorgo.json'
import prokitiProtoy   from './bangla/prokiti_protoy.json'
import somas           from './bangla/somas.json'
import karak           from './bangla/karak.json'
import pod             from './bangla/pod.json'
import shobdo          from './bangla/shobdo.json'
import poribhasha      from './bangla/poribhasha.json'
import bananBakko      from './bangla/banan_bakko.json'
import somarthokShobdo from './bangla/somarthok_shobdo.json'

// ── General Knowledge topics ───────────────────────────────────
import intlSummits      from './gk/international_summits.json'
import nobel2025        from './gk/nobel_2025.json'
import awardsHonors     from './gk/awards_honors.json'
import globalIndices    from './gk/global_indices.json'
import bdEconomy        from './gk/bangladesh_economy.json'
import bdBudget         from './gk/bangladesh_budget.json'
import sports           from './gk/sports.json'
import scienceTech      from './gk/science_tech.json'
import bdCurrent        from './gk/bangladesh_current.json'

// ── English Grammar topics ─────────────────────────────────────
import partsOfSpeech   from './english/parts_of_speech.json'
import tense           from './english/tense.json'
import rightFormVerbs  from './english/right_form_of_verbs.json'
import subjectVerb     from './english/subject_verb.json'
import voice           from './english/voice.json'
import narration       from './english/narration.json'
import transformation  from './english/transformation.json'
import tagQuestion     from './english/tag_question.json'
import preposition     from './english/preposition.json'
import determiner      from './english/determiner.json'
import errorCorrect    from './english/error_correct.json'
import pinPoint        from './english/pin_point.json'
import finalExam       from './english/final_exam.json'

export const BANGLA_TOPICS = [
  { id: 'dhwoni_o_borno',    name: 'ধ্বনি ও বর্ণ',           shortName: 'ধ্বনি ও বর্ণ',    icon: Volume2,       color: '#22d3ee', questions: dhwoniOBorno.questions   || [] },
  { id: 'dhwoni_poriborton', name: 'ধ্বনি পরিবর্তন',          shortName: 'ধ্বনি পরি.',       icon: Repeat,        color: '#38bdf8', questions: dhwoniPori.questions    || [] },
  { id: 'notwo_bidhan',      name: 'নত্ব বিধান',              shortName: 'নত্ব বিধান',       icon: Shield,        color: '#fb923c', questions: notwoBidhan.questions   || [] },
  { id: 'sondhi',            name: 'সন্ধি',                   shortName: 'সন্ধি',             icon: Link2,         color: '#a78bfa', questions: sondhi.questions        || [] },
  { id: 'uposhorgo',         name: 'উপসর্গ',                  shortName: 'উপসর্গ',            icon: Tag,           color: '#34d399', questions: uposhorgo.questions     || [] },
  { id: 'prokiti_protoy',    name: 'প্রকৃতি প্রত্যয়',         shortName: 'প্রকৃতি প্রত্যয়', icon: Layers,        color: '#fbbf24', questions: prokitiProtoy.questions || [] },
  { id: 'somas',             name: 'সমাস',                    shortName: 'সমাস',              icon: GitMerge,      color: '#f472b6', questions: somas.questions         || [] },
  { id: 'karak',             name: 'কারক',                    shortName: 'কারক',              icon: Target,        color: '#60a5fa', questions: karak.questions         || [] },
  { id: 'pod',               name: 'পদ',                      shortName: 'পদ',                icon: BookOpen,      color: '#86efac', questions: pod.questions           || [] },
  { id: 'shobdo',            name: 'শব্দ',                    shortName: 'শব্দ',              icon: Hash,          color: '#c084fc', questions: shobdo.questions        || [] },
  { id: 'poribhasha',        name: 'পরিভাষা',                 shortName: 'পরিভাষা',           icon: Globe,         color: '#4ade80', questions: poribhasha.questions    || [] },
  { id: 'banan_bakko',       name: 'বানান ও বাক্য শুদ্ধি',    shortName: 'বানান শুদ্ধি',     icon: CheckSquare,   color: '#fb7185', questions: bananBakko.questions    || [] },
  { id: 'somarthok_shobdo', name: 'সমার্থক শব্দ',             shortName: 'সমার্থক শব্দ',     icon: Shuffle,       color: '#e879f9', questions: somarthokShobdo.questions || [] },
]

export const ENGLISH_TOPICS = [
  { id: 'parts_of_speech',   name: 'Parts of Speech',          shortName: 'Parts of Speech', icon: Type,           color: '#22d3ee', questions: partsOfSpeech.questions || [] },
  { id: 'tense',             name: 'Tense',                    shortName: 'Tense',           icon: Clock,          color: '#38bdf8', questions: tense.questions          || [] },
  { id: 'right_form_of_verbs', name: 'Right Form of Verbs',   shortName: 'Right Form',      icon: PenTool,        color: '#fb923c', questions: rightFormVerbs.questions || [] },
  { id: 'subject_verb',      name: 'Subject Verb Agreement',   shortName: 'Subject Verb',    icon: Users,          color: '#a78bfa', questions: subjectVerb.questions    || [] },
  { id: 'voice',             name: 'Voice',                    shortName: 'Voice',           icon: Mic,            color: '#34d399', questions: voice.questions           || [] },
  { id: 'narration',         name: 'Narration',                shortName: 'Narration',       icon: MessageSquare,  color: '#fbbf24', questions: narration.questions       || [] },
  { id: 'transformation',    name: 'Transformation of Sentence', shortName: 'Transformation', icon: ArrowLeftRight, color: '#f472b6', questions: transformation.questions || [] },
  { id: 'tag_question',      name: 'Tag Question',             shortName: 'Tag Question',    icon: HelpCircle,     color: '#60a5fa', questions: tagQuestion.questions     || [] },
  { id: 'preposition',       name: 'Preposition',              shortName: 'Preposition',     icon: MapPin,         color: '#86efac', questions: preposition.questions     || [] },
  { id: 'determiner',        name: 'Determiner / Article',     shortName: 'Determiner',      icon: Layout,         color: '#c084fc', questions: determiner.questions      || [] },
  { id: 'error_correct',     name: 'Error Correction',         shortName: 'Error Correct',   icon: AlertCircle,    color: '#4ade80', questions: errorCorrect.questions    || [] },
  { id: 'pin_point',         name: 'Pin Point',                shortName: 'Pin Point',       icon: Crosshair,      color: '#fb7185', questions: pinPoint.questions        || [] },
  { id: 'final_exam',        name: 'Final Exam',               shortName: 'Final Exam',      icon: Trophy,         color: '#f59e0b', questions: finalExam.questions       || [] },
]

export const GK_TOPICS = [
  { id: 'international_summits', name: 'আন্তর্জাতিক সম্মেলন',       shortName: 'আন্তর্জাতিক',  icon: Globe,       color: '#38bdf8', questions: intlSummits.questions   || [] },
  { id: 'nobel_2025',            name: 'নোবেল পুরস্কার ২০২৫',        shortName: 'নোবেল',         icon: Award,       color: '#fbbf24', questions: nobel2025.questions     || [] },
  { id: 'awards_honors',         name: 'পুরস্কার ও সম্মাননা',        shortName: 'পুরস্কার',      icon: Star,        color: '#f472b6', questions: awardsHonors.questions  || [] },
  { id: 'global_indices',        name: 'বৈশ্বিক সূচক ও র‍্যাংকিং',   shortName: 'বৈশ্বিক সূচক', icon: TrendingUp,  color: '#34d399', questions: globalIndices.questions  || [] },
  { id: 'bangladesh_economy',    name: 'বাংলাদেশ অর্থনীতি',          shortName: 'অর্থনীতি',      icon: DollarSign,  color: '#60a5fa', questions: bdEconomy.questions     || [] },
  { id: 'bangladesh_budget',     name: 'বাজেট ২০২৫–২৬',             shortName: 'বাজেট',         icon: Landmark,    color: '#fb923c', questions: bdBudget.questions      || [] },
  { id: 'sports',                name: 'ক্রীড়া জগত',                 shortName: 'ক্রীড়া',        icon: Trophy,      color: '#f59e0b', questions: sports.questions        || [] },
  { id: 'science_tech',          name: 'বিজ্ঞান ও প্রযুক্তি',        shortName: 'বিজ্ঞান',       icon: Cpu,         color: '#a78bfa', questions: scienceTech.questions   || [] },
  { id: 'bangladesh_current',    name: 'বাংলাদেশ সাম্প্রতিক',        shortName: 'সাম্প্রতিক',    icon: Newspaper,   color: '#4ade80', questions: bdCurrent.questions     || [] },
]

// ── Bangla Sahitya topics ──────────────────────────────────────
import prachinJug        from './sahitya/prachin_jug.json'
import muktijudho        from './sahitya/muktijudho.json'
import potrika           from './sahitya/potrika.json'
import rabindranathNazrul from './sahitya/rabindranath_nazrul.json'
import moddhoJug         from './sahitya/moddho_jug.json'
import uktiChoritro      from './sahitya/ukti_choritro.json'
import others           from './sahitya/others.json'

export const BANGLA_SAHITYA_TOPICS = [
  { id: 'prachin_jug',        name: 'প্রাচীন যুগ',              shortName: 'প্রাচীন যুগ',    icon: BookOpen, color: '#f97316', questions: prachinJug.questions        || [] },
  { id: 'moddho_jug',         name: 'মধ্য যুগ',                 shortName: 'মধ্য যুগ',       icon: BookOpen, color: '#eab308', questions: moddhoJug.questions         || [] },
  { id: 'muktijudho',         name: 'মুক্তিযুদ্ধ ও ভাষা আন্দোলন', shortName: 'মুক্তিযুদ্ধ',    icon: BookOpen, color: '#ef4444', questions: muktijudho.questions        || [] },
  { id: 'potrika',            name: 'পত্রিকা ও সাময়িকী',          shortName: 'পত্রিকা',        icon: BookOpen, color: '#3b82f6', questions: potrika.questions           || [] },
  { id: 'rabindranath_nazrul', name: 'রবীন্দ্রনাথ ও নজরুল',      shortName: 'রবীন্দ্র-নজরুল', icon: BookOpen, color: '#8b5cf6', questions: rabindranathNazrul.questions || [] },
  { id: 'ukti_choritro',      name: 'উক্তি ও চরিত্র',           shortName: 'উক্তি-চরিত্র',   icon: BookOpen, color: '#ec4899', questions: uktiChoritro.questions      || [] },
  { id: 'others',             name: 'বিবিধ সাহিত্য',            shortName: 'বিবিধ',           icon: BookOpen, color: '#06b6d4', questions: others.questions            || [] },
]

export const ALL_TOPICS = [...BANGLA_TOPICS, ...ENGLISH_TOPICS, ...GK_TOPICS, ...BANGLA_SAHITYA_TOPICS]

// ── Vocabulary topics ──────────────────────────────────────────
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
