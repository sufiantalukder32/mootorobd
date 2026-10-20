import mockBuyers from '../data/mockBuyers';
import mockSellers from '../data/mockSellers';
import { calculateMatchScore } from './matching-algorithm';

describe('calculateMatchScore', () => {
  const arjun = mockBuyers[0];
  const rahim = mockSellers[0];

  test('scores Arjun and Rahim\'s Rice Mill at 85', () => {
    const result = calculateMatchScore(arjun, rahim);
    expect(result.score).toBe(85);
    expect(result.reasons.some((reason) => reason.includes('Sector fit: Agriculture'))).toBe(true);
    expect(result.reasons.some((reason) => reason.includes('Timeline fit'))).toBe(true);
  });

  test('withholds budget points when the ask is above the buyer max', () => {
    const result = calculateMatchScore(arjun, mockSellers[4]);
    expect(result.score).toBeLessThan(85);
    expect(result.reasons.some((reason) => reason.startsWith('Budget gap'))).toBe(true);
  });

  test('returns zero when a side is missing', () => {
    expect(calculateMatchScore(null, rahim).score).toBe(0);
  });
});
