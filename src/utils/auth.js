import { mockBuyers } from '../data/mockBuyers';
import { readStorage, writeStorage } from './helpers';

const USER_KEY = 'user';
const EXTRA_KEY = 'mootorobd_extra_buyers';

function withoutPassword(user) {
  if (!user) return null;
  const session = { ...user };
  delete session.password;
  return session;
}

export function getAllBuyers() {
  const extra = readStorage(EXTRA_KEY, []);
  const byEmail = new Map();
  [...mockBuyers, ...extra].forEach((buyer) => {
    byEmail.set(String(buyer.email || '').toLowerCase(), buyer);
  });
  return Array.from(byEmail.values());
}

export function mockLogin(email, password) {
  const user = getAllBuyers().find(
    (buyer) =>
      buyer.email.toLowerCase() === String(email || '').trim().toLowerCase() &&
      buyer.password === password
  );

  if (!user) {
    return { ok: false, error: 'Invalid email or password' };
  }

  const session = withoutPassword(user);
  writeStorage(USER_KEY, session);
  return { ok: true, user: session };
}

export function mockSignup(data) {
  const email = String(data.email || '').trim().toLowerCase();
  const existing = getAllBuyers().some((buyer) => buyer.email.toLowerCase() === email);
  if (existing) {
    return { ok: false, error: 'An account with this email already exists' };
  }

  const [minRaw, maxRaw] = String(data.budget || '0-0').split('-');
  const user = {
    id: Date.now(),
    name: data.fullName.trim(),
    email,
    password: data.password,
    phone: data.phone.trim(),
    budget: { min: Number(minRaw) || 0, max: Number(maxRaw) || 0 },
    sector: data.sector,
    experience: data.experience,
    financialProfile: {
      savings: Number(minRaw) || 0,
      loanApproved: 0,
      monthlyCapacity: Math.round((Number(maxRaw) || 0) / 24),
    },
    kycStatus: 'approved',
    nid: `DEMO${String(Date.now()).slice(-8)}`,
    createdAt: new Date().toISOString(),
    dealsCompleted: 0,
    rating: 0,
    profileNote: 'New buyer account created in the demo.',
  };

  mockBuyers.push(user);
  const extra = readStorage(EXTRA_KEY, []);
  extra.push(user);
  writeStorage(EXTRA_KEY, extra);
  const session = withoutPassword(user);
  writeStorage(USER_KEY, session);
  return { ok: true, user: session };
}

export function isLoggedIn() {
  try {
    return !!localStorage.getItem(USER_KEY);
  } catch {
    return false;
  }
}

export function getCurrentUser() {
  return readStorage(USER_KEY, {});
}

export function logout() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore private-mode storage errors.
  }
}
