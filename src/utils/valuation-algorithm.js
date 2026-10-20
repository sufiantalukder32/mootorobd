export function calculateFairValuation(seller) {
  const revenueMultiple = 0.6;
  const profitMultiple = 3;
  const annualRevenue = Number(seller?.annualRevenue) || 0;
  const annualProfit = Number(seller?.annualProfit) || 0;
  const askingPrice = Number(seller?.askingPrice) || 0;
  const revenueBasedValue = annualRevenue * revenueMultiple;
  const profitBasedValue = annualProfit * profitMultiple;
  const fairValue = (revenueBasedValue + profitBasedValue) / 2;
  const range = { min: fairValue * 0.9, max: fairValue * 1.1 };
  const recommendation = askingPrice <= fairValue ? 'FAIR ✓' : 'OVERPRICED';

  return {
    revenueMultiple,
    profitMultiple,
    revenueBasedValue,
    profitBasedValue,
    fairValue,
    range,
    recommendation,
  };
}

export default calculateFairValuation;
