import mockSellers from '../data/mockSellers';
import { calculateFairValuation } from './valuation-algorithm';

describe('calculateFairValuation', () => {
  test('averages 0.6x revenue and 3x profit for Rahim\'s Rice Mill', () => {
    const result = calculateFairValuation(mockSellers[0]);
    expect(result.revenueBasedValue).toBe(5100000);
    expect(result.profitBasedValue).toBe(4500000);
    expect(result.fairValue).toBe(4800000);
    expect(result.range.min).toBeCloseTo(4320000);
    expect(result.range.max).toBeCloseTo(5280000);
    expect(result.recommendation).toBe('FAIR ✓');
  });

  test('marks an ask above fair value as overpriced', () => {
    const result = calculateFairValuation({
      annualRevenue: 100000,
      annualProfit: 10000,
      askingPrice: 500000,
    });
    expect(result.recommendation).toBe('OVERPRICED');
  });
});
