import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, FolderInput, X } from 'lucide-react'
import RichText from './RichText'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { LIVEMCQ_TOPICS } from '../../data/index.js'
import { isOwner } from '../../lib/livemcqAdmin.js'
import { useSubtopicLists } from '../../lib/subtopics.js'
import { canEditLivemcq, changeSubtopic, findLivemcq, moveQuestion } from '../../lib/questionEdits.js'

// "Topic" control beside Delete on LiveMCQ questions (owner only): fix a wrongly
// placed question on the spot — move it to another topic and/or change its
// sub-topic. Applies on screen immediately and syncs through the offline queue,
// so the change shows in the sync drawer with Undo. Mirrors DeleteButton: takes
// the row's button class for shape, `qedit-btn` for the accent.
export default function QuestionEditButton({ question: q, categorySlug, className = '', size = 14, iconOnly = false }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  // A question moved earlier this session lives in its new topic's list.
  const current = findLivemcq(q?._id)?.topic.id || categorySlug
  if (!isOwner(user) || !canEditLivemcq(q, current)) return null
  return (
    <>
      <button
        type="button"
        className={`${className} qedit-btn`.trim()}
        onClick={() => setOpen(true)}
        title="Change topic / sub-topic"
      >
        <FolderInput size={size} strokeWidth={1.8} />
        {!iconOnly && <span className="qmark-label">Topic</span>}
      </button>
      {open && <EditSheet q={q} categorySlug={current} onClose={() => setOpen(false)} />}
    </>
  )
}

// Portalled: study cards animate with transforms, which would otherwise trap a
// position:fixed backdrop inside the card. Centred card on desktop, bottom
// sheet on phones (CSS).
function EditSheet({ q, categorySlug, onClose }) {
  const lists = useSubtopicLists()
  const curSub = q.subtopic || ''
  const [cat, setCat] = useState(categorySlug)
  const [sub, setSub] = useState(curSub)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const subList = lists[cat] || []
  const catChanged = cat !== categorySlug
  const subChanged = catChanged ? Boolean(sub) : sub !== curSub
  const changed = catChanged || subChanged

  const save = () => {
    // Move first: a sub-topic is validated against the question's new topic.
    if (catChanged) moveQuestion(q, categorySlug, cat)
    if (subChanged) changeSubtopic(q, cat, catChanged ? '' : curSub, sub)
    onClose()
  }

  return createPortal(
    <div className="trash-modal-backdrop qedit-backdrop" onClick={onClose}>
      <div className="trash-modal qedit-modal" role="dialog" aria-modal="true" aria-labelledby="qedit-title" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-pool-head">
          <h3 id="qedit-title" className="trash-modal-title">Topic / Sub-topic</h3>
          <button className="cat-sidebar-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="trash-modal-preview"><RichText html={q.question} /></div>

        <label className="qedit-field">
          <span className="qedit-label">Topic</span>
          <span className="qedit-select-wrap">
            <select className="qedit-select" value={cat} onChange={(e) => { setCat(e.target.value); setSub('') }}>
              {LIVEMCQ_TOPICS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown size={15} className="qedit-chevron" />
          </span>
        </label>

        {subList.length > 0 && (
          <label className="qedit-field">
            <span className="qedit-label">Sub-topic <em>(ঐচ্ছিক)</em></span>
            <span className="qedit-select-wrap">
              <select className="qedit-select" value={sub} onChange={(e) => setSub(e.target.value)}>
                <option value="">— কোনোটিই না —</option>
                {subList.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
              <ChevronDown size={15} className="qedit-chevron" />
            </span>
          </label>
        )}

        <div className="trash-modal-actions">
          <button className="trash-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="trash-btn-confirm qedit-save" disabled={!changed} onClick={save}>
            <Check size={14} /> Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
