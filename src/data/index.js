import {
  Volume2, Repeat, Shield, Link2, Tag, Layers, GitMerge, Target,
  BookOpen, Hash, Globe, CheckSquare, FileText,
  Type, Clock, PenTool, Users, Mic, MessageSquare, ArrowLeftRight,
  HelpCircle, MapPin, Layout, AlertCircle, Crosshair, Trophy
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
import practiceExam    from './bangla/practice_exam.json'

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
  { id: 'practice_exam',     name: 'প্র্যাকটিস পরীক্ষা',      shortName: 'প্র্যাকটিস',       icon: FileText,      color: '#f59e0b', questions: practiceExam.questions  || [] },
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

export const ALL_TOPICS = [...BANGLA_TOPICS, ...ENGLISH_TOPICS]
