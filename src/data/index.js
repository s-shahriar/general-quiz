import {
  Volume2, Repeat, Shield, Link2, Tag, Layers, GitMerge, Target,
  BookOpen, Hash, Globe, CheckSquare,
  Type, Clock, PenTool, Users, Mic, MessageSquare, ArrowLeftRight,
  HelpCircle, MapPin, Layout, AlertCircle, Crosshair, Trophy,
  Shuffle,
  Languages, Flag, Brain, FlaskConical, Cpu, Mountain, Scale, Calculator, Landmark, BookText
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
//  Topic METADATA only. Each topic's `questions` array starts empty and is
//  filled on demand from Supabase by data/contentLoader.js (keyed by `id`,
//  which equals the DB category slug). `module` tags which module to load.
//  This keeps the JS bundle tiny and reads all quiz content from the database.
// ─────────────────────────────────────────────────────────────

export const BANGLA_TOPICS = [
  { id: 'dhwoni_o_borno',    module: 'bangla', name: 'ধ্বনি ও বর্ণ',           shortName: 'ধ্বনি ও বর্ণ',    icon: Volume2,     color: 'var(--topic-7)', questions: [] },
  { id: 'dhwoni_poriborton', module: 'bangla', name: 'ধ্বনি পরিবর্তন',          shortName: 'ধ্বনি পরি.',       icon: Repeat,      color: 'var(--topic-8)', questions: [] },
  { id: 'notwo_bidhan',      module: 'bangla', name: 'নত্ব বিধান',              shortName: 'নত্ব বিধান',       icon: Shield,      color: 'var(--topic-2)', questions: [] },
  { id: 'sondhi',            module: 'bangla', name: 'সন্ধি',                   shortName: 'সন্ধি',             icon: Link2,       color: 'var(--topic-10)', questions: [] },
  { id: 'uposhorgo',         module: 'bangla', name: 'উপসর্গ',                  shortName: 'উপসর্গ',            icon: Tag,         color: 'var(--topic-6)', questions: [] },
  { id: 'prokiti_protoy',    module: 'bangla', name: 'প্রকৃতি প্রত্যয়',         shortName: 'প্রকৃতি প্রত্যয়', icon: Layers,      color: 'var(--topic-3)', questions: [] },
  { id: 'somas',             module: 'bangla', name: 'সমাস',                    shortName: 'সমাস',              icon: GitMerge,    color: 'var(--topic-12)', questions: [] },
  { id: 'karak',             module: 'bangla', name: 'কারক',                    shortName: 'কারক',              icon: Target,      color: 'var(--topic-9)', questions: [] },
  { id: 'pod',               module: 'bangla', name: 'পদ',                      shortName: 'পদ',                icon: BookOpen,    color: 'var(--topic-5)', questions: [] },
  { id: 'shobdo',            module: 'bangla', name: 'শব্দ',                    shortName: 'শব্দ',              icon: Hash,        color: 'var(--topic-11)', questions: [] },
  { id: 'poribhasha',        module: 'bangla', name: 'পরিভাষা',                 shortName: 'পরিভাষা',           icon: Globe,       color: 'var(--topic-5)', questions: [] },
  { id: 'banan_bakko',       module: 'bangla', name: 'বানান ও বাক্য শুদ্ধি',    shortName: 'বানান শুদ্ধি',     icon: CheckSquare, color: 'var(--topic-1)', questions: [] },
  { id: 'somarthok_shobdo',  module: 'bangla', name: 'সমার্থক শব্দ',            shortName: 'সমার্থক শব্দ',     icon: Shuffle,     color: 'var(--topic-11)', questions: [] },
]

export const ENGLISH_TOPICS = [
  { id: 'parts_of_speech',     module: 'english', name: 'Parts of Speech',            shortName: 'Parts of Speech', icon: Type,           color: 'var(--topic-7)', questions: [] },
  { id: 'tense',               module: 'english', name: 'Tense',                      shortName: 'Tense',           icon: Clock,          color: 'var(--topic-8)', questions: [] },
  { id: 'right_form_of_verbs', module: 'english', name: 'Right Form of Verbs',        shortName: 'Right Form',      icon: PenTool,        color: 'var(--topic-2)', questions: [] },
  { id: 'subject_verb',        module: 'english', name: 'Subject Verb Agreement',     shortName: 'Subject Verb',    icon: Users,          color: 'var(--topic-10)', questions: [] },
  { id: 'voice',               module: 'english', name: 'Voice',                      shortName: 'Voice',           icon: Mic,            color: 'var(--topic-6)', questions: [] },
  { id: 'narration',           module: 'english', name: 'Narration',                  shortName: 'Narration',       icon: MessageSquare,  color: 'var(--topic-3)', questions: [] },
  { id: 'transformation',      module: 'english', name: 'Transformation of Sentence', shortName: 'Transformation',  icon: ArrowLeftRight, color: 'var(--topic-12)', questions: [] },
  { id: 'tag_question',        module: 'english', name: 'Tag Question',               shortName: 'Tag Question',    icon: HelpCircle,     color: 'var(--topic-9)', questions: [] },
  { id: 'preposition',         module: 'english', name: 'Preposition',                shortName: 'Preposition',     icon: MapPin,         color: 'var(--topic-5)', questions: [] },
  { id: 'determiner',          module: 'english', name: 'Determiner / Article',       shortName: 'Determiner',      icon: Layout,         color: 'var(--topic-11)', questions: [] },
  { id: 'error_correct',       module: 'english', name: 'Error Correction',           shortName: 'Error Correct',   icon: AlertCircle,    color: 'var(--topic-5)', questions: [] },
  { id: 'pin_point',           module: 'english', name: 'Pin Point',                  shortName: 'Pin Point',       icon: Crosshair,      color: 'var(--topic-1)', questions: [] },
  { id: 'final_exam',          module: 'english', name: 'Final Exam',                 shortName: 'Final Exam',      icon: Trophy,         color: 'var(--topic-3)', questions: [] },
]

// GK: MCQs load from the DB; study notes come from the bundled JSON.
// The five bcs600_* topics are the "গুরুত্বপূর্ণ সাধারণ জ্ঞান" question bank,
// split by subject.
export const GK_TOPICS = [
  { id: 'gk_bd_affairs',   module: 'gk', name: 'বাংলাদেশ বিষয়াবলি',         shortName: 'বাংলাদেশ',      icon: Flag,         color: 'var(--topic-5)', questions: [] },
  { id: 'gk_intl_affairs', module: 'gk', name: 'আন্তর্জাতিক বিষয়াবলি',      shortName: 'আন্তর্জাতিক',   icon: Globe,        color: 'var(--topic-3)', questions: [] },
  { id: 'gk_science',      module: 'gk', name: 'সাধারণ বিজ্ঞান ও স্বাস্থ্য', shortName: 'বিজ্ঞান',        icon: FlaskConical, color: 'var(--topic-6)', questions: [] },
  { id: 'gk_ict',          module: 'gk', name: 'কম্পিউটার ও তথ্যপ্রযুক্তি',  shortName: 'কম্পিউটার',      icon: Cpu,          color: 'var(--topic-9)', questions: [] },
  { id: 'gk_lang_misc',    module: 'gk', name: 'ভাষা, সাহিত্য ও বিবিধ',      shortName: 'ভাষা ও বিবিধ',  icon: BookText,     color: 'var(--topic-12)', questions: [] },
]

export const BANGLA_SAHITYA_TOPICS = [
  { id: 'prachin_jug',         module: 'sahitya', name: 'প্রাচীন যুগ',              shortName: 'প্রাচীন যুগ',    icon: BookOpen, color: 'var(--topic-2)', questions: [] },
  { id: 'moddho_jug',          module: 'sahitya', name: 'মধ্য যুগ',                 shortName: 'মধ্য যুগ',       icon: BookOpen, color: 'var(--topic-3)', questions: [] },
  { id: 'muktijudho',          module: 'sahitya', name: 'মুক্তিযুদ্ধ ও ভাষা আন্দোলন', shortName: 'মুক্তিযুদ্ধ',    icon: BookOpen, color: 'var(--topic-1)', questions: [] },
  { id: 'potrika',             module: 'sahitya', name: 'পত্রিকা ও সাময়িকী',          shortName: 'পত্রিকা',        icon: BookOpen, color: 'var(--topic-9)', questions: [] },
  { id: 'rabindranath_nazrul', module: 'sahitya', name: 'রবীন্দ্রনাথ ও নজরুল',      shortName: 'রবীন্দ্র-নজরুল', icon: BookOpen, color: 'var(--topic-10)', questions: [] },
  { id: 'ukti_choritro',       module: 'sahitya', name: 'উক্তি ও চরিত্র',           shortName: 'উক্তি-চরিত্র',   icon: BookOpen, color: 'var(--topic-12)', questions: [] },
  { id: 'others',              module: 'sahitya', name: 'বিবিধ সাহিত্য',            shortName: 'বিবিধ',           icon: BookOpen, color: 'var(--topic-8)', questions: [] },
]

// LiveMCQ — 2000+ questions across 13 subjects, loaded from the DB on demand.
export const LIVEMCQ_TOPICS = [
  { id: 'lm_bangla_sahitya',  module: 'livemcq', name: 'বাংলা সাহিত্য',              shortName: 'বাংলা সাহিত্য',   icon: BookText,     color: 'var(--topic-12)', questions: [] },
  { id: 'lm_bangla_byakoron', module: 'livemcq', name: 'বাংলা ব্যাকরণ',              shortName: 'বাংলা ব্যাকরণ',   icon: Languages,    color: 'var(--topic-7)', questions: [] },
  { id: 'lm_english_lit',     module: 'livemcq', name: 'English Literature',          shortName: 'Eng. Literature', icon: BookOpen,     color: 'var(--topic-10)', questions: [] },
  { id: 'lm_english_grammar', module: 'livemcq', name: 'English Grammar',             shortName: 'Eng. Grammar',    icon: Type,         color: 'var(--topic-8)', questions: [] },
  { id: 'lm_bd_affairs',      module: 'livemcq', name: 'বাংলাদেশ বিষয়াবলি',          shortName: 'বাংলাদেশ',         icon: Flag,         color: 'var(--topic-5)', questions: [] },
  { id: 'lm_intl_affairs',    module: 'livemcq', name: 'আন্তর্জাতিক বিষয়াবলি',       shortName: 'আন্তর্জাতিক',      icon: Globe,        color: 'var(--topic-3)', questions: [] },
  { id: 'lm_mental_ability',  module: 'livemcq', name: 'মানসিক দক্ষতা',              shortName: 'মানসিক দক্ষতা',    icon: Brain,        color: 'var(--topic-11)', questions: [] },
  { id: 'lm_science',         module: 'livemcq', name: 'সাধারণ বিজ্ঞান',             shortName: 'বিজ্ঞান',          icon: FlaskConical, color: 'var(--topic-6)', questions: [] },
  { id: 'lm_ict',             module: 'livemcq', name: 'কম্পিউটার ও তথ্য প্রযুক্তি', shortName: 'কম্পিউটার',        icon: Cpu,          color: 'var(--topic-9)', questions: [] },
  { id: 'lm_geography',       module: 'livemcq', name: 'ভূগোল',                      shortName: 'ভূগোল',            icon: Mountain,     color: 'var(--topic-2)', questions: [] },
  { id: 'lm_ethics',          module: 'livemcq', name: 'নৈতিকতা, মূল্যবোধ ও সু-শাসন', shortName: 'নৈতিকতা',          icon: Scale,        color: 'var(--topic-3)', questions: [] },
  { id: 'lm_math',            module: 'livemcq', name: 'গণিত',                       shortName: 'গণিত',             icon: Calculator,   color: 'var(--topic-1)', questions: [] },
  { id: 'lm_banking',         module: 'livemcq', name: 'ব্যাংকিং',                    shortName: 'ব্যাংকিং',        icon: Landmark,     color: 'var(--topic-6)', questions: [] },
]

export const ALL_TOPICS = [...BANGLA_TOPICS, ...ENGLISH_TOPICS, ...GK_TOPICS, ...BANGLA_SAHITYA_TOPICS, ...LIVEMCQ_TOPICS]
