import { Zap, Activity, Cpu, RefreshCw, Radio } from 'lucide-react'
import electronicsData from './electronics_mcq.json'
import communicationData from './communication_mcq.json'
import dcCircuitData from './dc_circuit_mcq.json'
import acFundamentalsData from './ac_fundamentals_mcq.json'
import transformerData from './transformer_mcq.json'

export const TOPICS = [
  {
    id: 'dc_circuit',
    title: 'DC Circuit Theory',
    title_bn: 'ডিসি সার্কিট থিওরি',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    accent: '#3b82f6',
    Icon: Zap,
    data: dcCircuitData,
  },
  {
    id: 'ac_fundamentals',
    title: 'AC Fundamentals',
    title_bn: 'এসি ফান্ডামেন্টালস',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    accent: '#8b5cf6',
    Icon: Activity,
    data: acFundamentalsData,
  },
  {
    id: 'electronics',
    title: 'Electronics',
    title_bn: 'ইলেকট্রনিক্স',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    accent: '#10b981',
    Icon: Cpu,
    data: electronicsData,
  },
  {
    id: 'transformer',
    title: 'Transformer',
    title_bn: 'ট্রান্সফরমার',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    accent: '#f59e0b',
    Icon: RefreshCw,
    data: transformerData,
  },
  {
    id: 'communication',
    title: 'Analog Communication',
    title_bn: 'অ্যানালগ কমিউনিকেশন',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    accent: '#f43f5e',
    Icon: Radio,
    data: communicationData,
  },
]
