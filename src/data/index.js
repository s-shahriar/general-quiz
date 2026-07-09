import {
  Volume2, Repeat, Shield, Link2, Tag, Layers, GitMerge, Target,
  BookOpen, Hash, Globe, CheckSquare,
  Type, Clock, PenTool, Users, Mic, MessageSquare, ArrowLeftRight,
  HelpCircle, MapPin, Layout, AlertCircle, Crosshair, Trophy,
  Shuffle,
  Languages, Flag, Brain, FlaskConical, Cpu, Mountain, Scale, Calculator, Landmark, BookText
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
// Fresh GK approach (MCQ + Study notes, grouped by category, Bangla-first).
// See GK_PATTERN.md for the data model. Categories added one at a time.
import intlEconomicOrgs from './gk/intl_economic_orgs.json'

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

// Fresh start — GK categories added one at a time. Each GK category carries
// MCQ questions (mcqs → questions, for QuizMode/exam) AND study notes
// (study.groups → rendered by GkStudyMode). See GK_PATTERN.md.
export const GK_TOPICS = [
  {
    id: intlEconomicOrgs.id,
    name: intlEconomicOrgs.name,
    shortName: intlEconomicOrgs.shortName,
    icon: Globe,
    color: '#38bdf8',
    questions: intlEconomicOrgs.mcqs || [],
    study: intlEconomicOrgs.study || { groups: [] },
  },
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

// ── LiveMCQ module ─────────────────────────────────────────────
// 2000+ questions imported from the user's LiveMCQ favourites, categorized into
// 13 subjects. Same MCQ shape as Bangla/English topics (question, options a–e,
// correct_answer, explanation) — content may carry HTML (sup/sub, <img>, tables)
// rendered via RichText. To keep the initial JS bundle small, each topic's
// `questions` are lazy-loaded from /lmdata/<file>.json on demand (see
// data/livemcqLoader.js + hooks/useLiveMcq.js). Metadata (name/icon/color) is
// available immediately so the module lists and routes work before data loads.
export const LIVEMCQ_TOPICS = [
  { id: 'lm_bangla_sahitya',   name: 'বাংলা সাহিত্য',                shortName: 'বাংলা সাহিত্য',   icon: BookText,     color: '#f472b6', file: 'bangla_sahitya',    questions: [] },
  { id: 'lm_bangla_byakoron',  name: 'বাংলা ব্যাকরণ',                shortName: 'বাংলা ব্যাকরণ',   icon: Languages,    color: '#22d3ee', file: 'bangla_byakoron',   questions: [] },
  { id: 'lm_english_lit',      name: 'English Literature',            shortName: 'Eng. Literature', icon: BookOpen,     color: '#a78bfa', file: 'english_literature', questions: [] },
  { id: 'lm_english_grammar',  name: 'English Grammar',               shortName: 'Eng. Grammar',    icon: Type,         color: '#38bdf8', file: 'english_grammar',   questions: [] },
  { id: 'lm_bd_affairs',       name: 'বাংলাদেশ বিষয়াবলি',            shortName: 'বাংলাদেশ',         icon: Flag,         color: '#22c55e', file: 'bd_affairs',        questions: [] },
  { id: 'lm_intl_affairs',     name: 'আন্তর্জাতিক বিষয়াবলি',         shortName: 'আন্তর্জাতিক',      icon: Globe,        color: '#f59e0b', file: 'intl_affairs',      questions: [] },
  { id: 'lm_mental_ability',   name: 'মানসিক দক্ষতা',                shortName: 'মানসিক দক্ষতা',    icon: Brain,        color: '#e879f9', file: 'mental_ability',    questions: [] },
  { id: 'lm_science',          name: 'সাধারণ বিজ্ঞান',               shortName: 'বিজ্ঞান',          icon: FlaskConical, color: '#34d399', file: 'general_science',   questions: [] },
  { id: 'lm_ict',              name: 'কম্পিউটার ও তথ্য প্রযুক্তি',   shortName: 'কম্পিউটার',        icon: Cpu,          color: '#60a5fa', file: 'ict',               questions: [] },
  { id: 'lm_geography',        name: 'ভূগোল',                        shortName: 'ভূগোল',            icon: Mountain,     color: '#fb923c', file: 'geography',         questions: [] },
  { id: 'lm_ethics',           name: 'নৈতিকতা, মূল্যবোধ ও সু-শাসন',   shortName: 'নৈতিকতা',          icon: Scale,        color: '#fbbf24', file: 'ethics',            questions: [] },
  { id: 'lm_math',             name: 'গণিত',                         shortName: 'গণিত',             icon: Calculator,   color: '#f87171', file: 'math',              questions: [] },
  { id: 'lm_banking',          name: 'ব্যাংকিং',                      shortName: 'ব্যাংকিং',        icon: Landmark,     color: '#2dd4bf', file: 'banking',           questions: [] },
]

export const ALL_TOPICS = [...BANGLA_TOPICS, ...ENGLISH_TOPICS, ...GK_TOPICS, ...BANGLA_SAHITYA_TOPICS, ...LIVEMCQ_TOPICS]
