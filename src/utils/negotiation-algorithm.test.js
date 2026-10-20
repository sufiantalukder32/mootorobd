import { canAgree, suggestFairPrice } from './negotiation-algorithm';

describe('negotiation algorithm', () => {
  test('weights fair value, seller ask, and buyer offer', () => {
    expect(suggestFairPrice(550000, 480000, 520000)).toBe(517000);
    expect(suggestFairPrice(520000, 520000, 520000)).toBe(520000);
  });

  test('allows agreement only inside a 5 percent gap', () => {
    expect(canAgree(520000, 520000)).toBe(true);
    expect(canAgree(550000, 530000)).toBe(true);
    expect(canAgree(550000, 480000)).toBe(false);
    expect(canAgree(0, 100)).toBe(false);
  });
});
