export function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')) }
  catch { return new Set() }
}

export function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]))
}
