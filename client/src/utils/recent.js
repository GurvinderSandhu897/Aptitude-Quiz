const KEY = "recentBankIds";
const MAX = 40;

export function getRecentIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveRecentIds(newIds = []) {
  try {
    const old = getRecentIds().filter((id) => !newIds.includes(id));
    localStorage.setItem(KEY, JSON.stringify([...newIds, ...old].slice(0, MAX)));
  } catch {
    /* storage unavailable: ignore */
  }
}