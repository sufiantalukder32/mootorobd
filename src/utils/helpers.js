export function formatPrice(num) {
  return '৳' + Number(num || 0).toLocaleString('en-IN');
}

export function formatLakh(amount) {
  const lakh = Number(amount || 0) / 100000;
  const rounded = Math.round(lakh * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `৳${text} লাখ`;
}

export function formatSmart(amount) {
  const value = Number(amount || 0);
  if (Math.abs(value) >= 100000) return formatLakh(value);
  if (Math.abs(value) >= 1000) {
    const hazar = Math.round((value / 1000) * 10) / 10;
    return `৳${hazar} হাজার`;
  }
  return formatPrice(value);
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getInitials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function starString(rating) {
  const full = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota and private-mode failures in the demo.
  }
}

const MATCHES_KEY = 'mootorobd_matches';

export function getStoredMatches() {
  return readStorage(MATCHES_KEY, []);
}

export function saveStoredMatch(match) {
  const all = getStoredMatches().filter((item) => item.id !== match.id);
  all.push(match);
  writeStorage(MATCHES_KEY, all);
  return match;
}

export function percent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}
