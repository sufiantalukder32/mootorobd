import mockBuyers from '../data/mockBuyers';
import { getCurrentUser, isLoggedIn, logout, mockLogin, mockSignup } from './auth';

describe('auth', () => {
  afterEach(() => {
    localStorage.clear();
    const extraIndex = mockBuyers.findIndex((buyer) => buyer.email === 'new.buyer@example.com');
    if (extraIndex >= 0) mockBuyers.splice(extraIndex, 1);
  });

  test('logs in a demo buyer and stores the session without the password', () => {
    const result = mockLogin('arjun@example.com', 'demo123');
    expect(result.ok).toBe(true);
    expect(isLoggedIn()).toBe(true);
    expect(getCurrentUser().name).toBe('Arjun Patel');
    expect(getCurrentUser().password).toBeUndefined();
  });

  test('rejects a wrong password', () => {
    const result = mockLogin('arjun@example.com', 'wrong-password');
    expect(result.ok).toBe(false);
    expect(isLoggedIn()).toBe(false);
  });

  test('signs up a new buyer and then logs them out', () => {
    const result = mockSignup({
      fullName: 'New Buyer',
      email: 'new.buyer@example.com',
      password: 'demo123',
      phone: '01711000099',
      budget: '500000-2000000',
      sector: 'Retail',
      experience: 'first-time',
    });
    expect(result.ok).toBe(true);
    expect(getCurrentUser().budget).toEqual({ min: 500000, max: 2000000 });
    logout();
    expect(isLoggedIn()).toBe(false);
    expect(mockLogin('new.buyer@example.com', 'demo123').ok).toBe(true);
  });
});
