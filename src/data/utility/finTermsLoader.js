import { useEffect, useState } from 'react'
import {
  Star, Building2, Banknote, BarChart2, Landmark, Leaf, Globe, RefreshCw,
  Scale, FileText, Eye, Waves, ArrowLeftRight, DollarSign, Ruler, Home,
  ClipboardList, CheckSquare, Files, PenLine, TrendingUp, TrendingDown,
  Package, Bitcoin, AlertTriangle, Hash, Search, CreditCard, Zap, Folder,
  AlertCircle, Receipt, Users, Target, Award, Layers, ShieldAlert,
  BookMarked, Activity,
} from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

// Financial Terms live in Supabase (`content_blobs`, kind 'utility', key
// 'finance'): { categories:[{name,color}], cards:[{id,cat,title,subtitle,icon,body}] }.
// The icon is a lucide name, resolved against this fixed map (only these ship).
const ICON_MAP = {
  Star, Building2, Banknote, BarChart2, Landmark, Leaf, Globe, RefreshCw,
  Scale, FileText, Eye, Waves, ArrowLeftRight, DollarSign, Ruler, Home,
  ClipboardList, CheckSquare, Files, PenLine, TrendingUp, TrendingDown,
  Package, Bitcoin, AlertTriangle, Hash, Search, CreditCard, Zap, Folder,
  AlertCircle, Receipt, Users, Target, Award, Layers, ShieldAlert,
  BookMarked, Activity,
}

let data = null   // { categories: { [name]: color }, cards: [...] }
let inflight = null

async function load() {
  if (data) return
  if (!inflight) {
    inflight = (async () => {
      const { data: row, error } = await supabase
        .from('content_blobs').select('payload').eq('kind', 'utility').eq('key', 'finance').single()
      if (error) throw error
      const p = row.payload
      data = {
        categories: Object.fromEntries(p.categories.map(c => [c.name, c.color])),
        cards: p.cards.map(c => ({ ...c, icon: ICON_MAP[c.icon] || Folder })),
      }
    })().finally(() => { inflight = null })
  }
  return inflight
}

export const getFinCategories = () => data?.categories || {}
export const getFinCards = () => data?.cards || []

// Ensure the data is loaded; returns { ready, error } and re-renders when done.
export function useFinTermsReady() {
  const [state, setState] = useState({ ready: !!data, error: null })
  useEffect(() => {
    if (data) return
    let cancelled = false
    load()
      .then(() => { if (!cancelled) setState({ ready: true, error: null }) })
      .catch(error => { if (!cancelled) setState({ ready: false, error }) })
    return () => { cancelled = true }
  }, [])
  return state
}
