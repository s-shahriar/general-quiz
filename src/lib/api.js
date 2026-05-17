const KEY     = import.meta.env.VITE_API_KEY
const API_URL = import.meta.env.VITE_API_URL ?? '/api/sync'
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` }

export async function fetchRemote() {
  try {
    const res = await fetch(API_URL, { headers })
    return res.ok ? res.json() : null
  } catch {
    return null
  }
}

export function pushRemote(mastered, theme, important) {
  fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ mastered: [...mastered], theme, important: [...(important ?? [])] }),
  }).catch(() => {})
}
