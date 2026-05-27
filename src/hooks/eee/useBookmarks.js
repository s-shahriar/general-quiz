import { useState, useCallback } from 'react'

const STORAGE_KEY = 'eee_quiz_bookmarks'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load)

  const toggle = useCallback((id) => {
    setBookmarks(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isBookmarked = useCallback((id) => !!bookmarks[id], [bookmarks])

  return { bookmarks, toggle, isBookmarked }
}
