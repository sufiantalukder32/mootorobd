import { calculateFairValuation } from '../utils/valuation-algorithm';
import { calculateMatchScore } from '../utils/matching-algorithm';
import { formatPrice } from '../utils/helpers';

export default function AIAssessment({ seller, buyer, valuation, matchScore }) {
  const result = valuation || calculateFairValuation(seller);
  const computed = buyer ? calculateMatchScore(buyer, seller) : { score: 0, reasons: [] };
  const score = typeof matchScore === 'object' ? matchScore.score : matchScore ?? computed.score;
  const reasons = typeof matchScore === 'object' ? matchScore.reasons : computed.reasons;
  const fair = result.recommendation.startsWith('FAIR');
  const canAfford = buyer?.budget?.max >= seller.askingPrice;

  return (
    <section className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">AI assessment</h3>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            fair ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }`}
        >
          {fair ? '✓ Fair asking price' : '⚠ Overpriced versus the model'}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-lightBg p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Fair range</p>
          <p className="font-semibold">
            {formatPrice(result.range.min)} – {formatPrice(result.range.max)}
          </p>
        </div>
        <div className="rounded-lg bg-lightBg p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Seller asking</p>
          <p className="font-semibold">{formatPrice(seller.askingPrice)}</p>
        </div>
        <div className="rounded-lg bg-lightBg p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Buyer affordability</p>
          <p className={`font-semibold ${canAfford ? 'text-secondary' : 'text-accent'}`}>
            {buyer
              ? canAfford
                ? `Within budget (max ${formatPrice(buyer.budget.max)})`
                : `Above budget (max ${formatPrice(buyer.budget.max)})`
              : 'Log in to compare'}
          </p>
        </div>
      </div>

      <div>
        <p className="match-score">
          {score}
          <span className="text-lg font-medium text-slate-500">/100</span>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-slate-700">
        {fair
          ? 'The asking price sits at or below the model fair value built from a 0.6× revenue multiple and a 3× profit multiple. It is a reasonable place to start a conversation.'
          : 'The asking price is above the model fair value. Use the suggested range as the opening point for negotiation.'}{' '}
        Model midpoint: {formatPrice(result.fairValue)}.
      </p>
    </section>
  );
}
