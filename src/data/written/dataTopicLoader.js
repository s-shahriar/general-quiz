import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import {
  TrendingUp, TrendingDown, Users, Percent, HandCoins,
  Globe, ShoppingBag, PiggyBank, Wallet, ShieldAlert, Receipt, GraduationCap, Database,
} from 'lucide-react'

// Written » Data content lives in Supabase (written_categories + written_cards,
// topic='data') — not bundled, so the card bodies/issues/benefits don't add to
// the app's JS payload. Fetched once per session and cached in module scope,
// same shape as src/data/contentLoader.js's module-content pattern.

// Only the icons the seeded cards actually use ship in the bundle — the DB
// stores an icon name string, resolved against this small fixed map.
const ICON_MAP = {
  TrendingUp, TrendingDown, Users, Percent, HandCoins,
  Globe, ShoppingBag, PiggyBank, Wallet, ShieldAlert, Receipt, GraduationCap, Database,
}

let categories = null   // { [name]: color }
let cards = null        // [{ id, cat, title, subtitle, icon, body, tip, issues?, benefits? }]
let inflight = null

async function load() {
  if (categories && cards) return
  if (inflight) return inflight
  inflight = (async () => {
    const { data: catRows, error: catErr } = await supabase
      .from('written_categories')
      .select('id,name,color,sort_order')
      .eq('topic', 'data')
      .order('sort_order')
    if (catErr) throw catErr

    const { data: cardRows, error: cardErr } = await supabase
      .from('written_cards')
      .select('category_id,serial,icon,title,subtitle,body,tip,issues,benefits,sort_order')
      .eq('topic', 'data')
      .order('sort_order')
    if (cardErr) throw cardErr

    const catById = new Map(catRows.map((c) => [c.id, c]))
    categories = {}
    for (const c of catRows) categories[c.name] = c.color
    cards = cardRows.map((r) => ({
      id: r.serial,
      cat: catById.get(r.category_id)?.name,
      title: r.title,
      subtitle: r.subtitle,
      icon: ICON_MAP[r.icon] || Database,
      body: r.body,
      tip: r.tip,
      issues: r.issues || undefined,
      benefits: r.benefits || undefined,
    }))
  })()
  try {
    await inflight
  } finally {
    inflight = null
  }
}

export function isWrittenDataLoaded() {
  return !!(categories && cards)
}

export function getWrittenDataCategories() {
  return categories || {}
}

export function getWrittenDataCards() {
  return cards || []
}

// React hook: ensure Written » Data is loaded; re-renders once ready.
export function useWrittenDataReady() {
  const [ready, setReady] = useState(isWrittenDataLoaded())
  useEffect(() => {
    if (ready) return
    let cancelled = false
    load().then(() => { if (!cancelled) setReady(true) }).catch(() => {})
    return () => { cancelled = true }
  }, [ready])
  return ready
}
