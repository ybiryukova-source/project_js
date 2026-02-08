const STORAGE_KEY = 'favorites';

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export function getFavorites() {
  return readIds();
}

export function isFavorite(exerciseId) {
  return readIds().includes(exerciseId);
}

export function addToFavorites(exerciseId) {
  const ids = readIds();
  if (ids.includes(exerciseId)) return false;

  ids.push(exerciseId);
  return writeIds(ids);
}

export function removeFromFavorites(exerciseId) {
  const ids = readIds();
  const next = ids.filter(id => id !== exerciseId);
  return writeIds(next);
}

export function toggleFavorite(exerciseId) {
  const ids = readIds();

  if (ids.includes(exerciseId)) {
    const next = ids.filter(id => id !== exerciseId);
    writeIds(next);
    return false; 
  }

  ids.push(exerciseId);
  writeIds(ids);
  return true; 
}
