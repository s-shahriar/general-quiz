// Recycle-bin (soft-delete) data layer. Questions are curated content, so delete
// is global: it sets `deleted_at` via an owner-gated RPC (SECURITY DEFINER), and
// the content loader hides anything with a non-null deleted_at. Restore clears it;
// purge removes the row for good.
import { supabase } from './supabase.js'

export async function trashQuestion(id) {
  const { error } = await supabase.rpc('trash_question', { p_id: id })
  if (error) throw new Error(error.message)
}
export async function restoreQuestion(id) {
  const { error } = await supabase.rpc('restore_question', { p_id: id })
  if (error) throw new Error(error.message)
}
export async function purgeQuestion(id) {
  const { error } = await supabase.rpc('purge_question', { p_id: id })
  if (error) throw new Error(error.message)
}

// Everything currently in the recycle bin, newest-deleted first, with the fields
// the bin needs to preview + restore each item.
export async function fetchDeletedQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('id,uid,question,options,correct_answer,correct_answer_text,explanation,extra,deleted_at,categories!inner(slug,module,name)')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []).map(r => ({
    _id: r.id, uid: r.uid, question: r.question, options: r.options,
    correct_answer: r.correct_answer, correct_answer_text: r.correct_answer_text,
    explanation: r.explanation, deleted_at: r.deleted_at,
    _module: r.categories.module, _slug: r.categories.slug, _catName: r.categories.name,
    ...(r.extra || {}),
  }))
}
