import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, RotateCcw, ChevronLeft, AlertTriangle } from 'lucide-react'
import RichText from './shared/RichText'
import TopbarActions from './shared/TopbarActions.jsx'
import { fetchDeletedQuestions } from '../lib/trashSync.js'
import { useTrash } from '../contexts/TrashContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

// Recycle Bin: everything soft-deleted, newest first. Restore puts a question
// back into its module; Delete forever removes the row permanently (two-tap
// confirm so it's deliberate). Owner-only — gated by the same auth as delete.
export default function RecycleBinScreen() {
  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()
  const { restore, purge } = useTrash()
  const [items, setItems] = useState(null)   // null = loading
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    if (!user) { setItems([]); return }
    let live = true
    fetchDeletedQuestions()
      .then(d => { if (live) setItems(d) })
      .catch(e => { if (live) { setError(e.message); setItems([]) } })
    return () => { live = false }
  }, [user])

  const onRestore = async (q) => {
    setBusyId(q._id)
    try { await restore(q); setItems(list => list.filter(x => x._id !== q._id)) }
    catch (e) { setError(e.message) }
    finally { setBusyId(null) }
  }
  const onPurge = async (q) => {
    setBusyId(q._id)
    try { await purge(q); setItems(list => list.filter(x => x._id !== q._id)); setConfirmId(null) }
    catch (e) { setError(e.message) }
    finally { setBusyId(null) }
  }

  return (
    <div className="recycle-screen anim-fade">
      <div className="nailed-screen-topbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={15} /> Back
        </button>
        <div className="nailed-screen-title">
          <Trash2 size={16} /> <span>Recycle Bin</span>
        </div>
        <TopbarActions />
      </div>

      {!user ? (
        <div className="recycle-empty">
          <Trash2 size={34} />
          <p>Sign in to see your deleted questions.</p>
          <button className="recycle-restore-btn" onClick={() => signInWithGoogle()}>Continue with Google</button>
        </div>
      ) : items === null ? (
        <div className="recycle-empty"><p>Loading…</p></div>
      ) : items.length === 0 ? (
        <div className="recycle-empty">
          <Trash2 size={34} />
          <p>Recycle Bin is empty.</p>
          <span>Deleted questions land here — you can restore them anytime.</span>
        </div>
      ) : (
        <>
          <div className="recycle-count">{items.length} deleted question{items.length > 1 ? 's' : ''}</div>
          {error && <div className="recycle-error"><AlertTriangle size={13} /> {error}</div>}
          <div className="recycle-list">
            {items.map((q) => (
              <div key={q._id} className="recycle-row">
                <div className="recycle-row-body">
                  {q._catName && <span className="recycle-tag">{q._catName}</span>}
                  <RichText className="recycle-row-text" html={q.question} />
                  {q.correct_answer && q.options?.[q.correct_answer] && (
                    <div className="recycle-answer">
                      <span className="recycle-ans-key">{q.correct_answer.toUpperCase()}</span>
                      <RichText className="recycle-ans-text" html={q.options[q.correct_answer]} />
                    </div>
                  )}
                </div>
                <div className="recycle-row-actions">
                  <button className="recycle-restore-btn" disabled={busyId === q._id} onClick={() => onRestore(q)}>
                    <RotateCcw size={13} /> Restore
                  </button>
                  {confirmId === q._id ? (
                    <button className="recycle-purge-btn confirming" disabled={busyId === q._id} onClick={() => onPurge(q)}>
                      <Trash2 size={13} /> {busyId === q._id ? 'Deleting…' : 'Confirm delete'}
                    </button>
                  ) : (
                    <button className="recycle-purge-btn" onClick={() => setConfirmId(q._id)}>
                      <Trash2 size={13} /> Delete forever
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
