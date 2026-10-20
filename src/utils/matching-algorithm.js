import { formatLakh } from './helpers';

function experiencePoints(experience) {
  if (experience === 'experienced') {
    return { points: 20, label: 'Experience fit: Experienced operator ✓' };
  }
  if (experience === 'some') {
    return { points: 15, label: 'Experience fit: Some operating experience ✓' };
  }
  return { points: 5, label: 'Experience fit: Can transition with support ✓' };
}

export function calculateMatchScore(buyer, seller) {
  if (!buyer || !seller) {
    return { score: 0, reasons: ['Add a buyer and a seller to score this pair.'] };
  }

  let score = 0;
  const reasons = [];
  const budgetMax = buyer.budget?.max || 0;
  const budgetMin = buyer.budget?.min || 0;

  if (budgetMax >= seller.askingPrice) {
    score += 25;
    reasons.push(
      `Budget overlap: Buyer ${formatLakh(budgetMin)}–${formatLakh(budgetMax)}, Seller asking ${formatLakh(seller.askingPrice)} ✓`
    );
  } else {
    reasons.push(
      `Budget gap: Seller asking ${formatLakh(seller.askingPrice)} is above buyer max ${formatLakh(budgetMax)}`
    );
  }

  if (buyer.sector && buyer.sector === seller.category) {
    score += 25;
    reasons.push(`Sector fit: ${buyer.sector} ✓`);
  } else {
    reasons.push(
      `Sector mismatch: Buyer wants ${buyer.sector || 'any'}, seller is ${seller.category}`
    );
  }

  score += 20;
  reasons.push('Timeline fit: Both ready ✓');

  const experience = experiencePoints(buyer.experience);
  score += experience.points;
  reasons.push(experience.label);

  if (seller.profitMargin > 0.15) {
    score += 10;
    reasons.push('Stability fit: Profit margin above 15% ✓');
  } else {
    reasons.push('Stability: Profit margin is 15% or below');
  }

  return { score: Math.min(100, score), reasons };
}

export default calculateMatchScore;
