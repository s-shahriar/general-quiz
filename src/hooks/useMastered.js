import { useState } from 'react'

const STORAGE_KEY = 'gq-nailed'

function load() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')) }
  catch { return new Set() }
}

function save(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export default function useMastered() {
  const [value, setValue] = useState(load)

  const add = (id) => setValue(prev => {
    const next = new Set(prev)
    next.add(id)
    save(next)
    return next
  })

  const remove = (id) => setValue(prev => {
    const next = new Set(prev)
    next.delete(id)
    save(next)
    return next
  })

  const restore = (ids) => setValue(prev => {
    const next = new Set([...prev, ...ids])
    save(next)
    return next
  })

  return { value, add, remove, restore }
}
