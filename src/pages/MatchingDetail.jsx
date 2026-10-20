import { Link, useNavigate, useParams } from 'react-router-dom';
import mockMatches from '../data/mockMatches';
import mockSellers from '../data/mockSellers';
import { getAllBuyers } from '../utils/auth';
import { formatPrice, getStoredMatches, saveStoredMatch } from '../utils/helpers';
import { calculateMatchScore } from '../utils/matching-algorithm';
import { calculateFairValuation } from '../utils/valuation-algorithm';

const experienceLabel = {
  'first-time': 'First-time',
  some: 'Some experience',
  experienced: 'Experienced',
};

export default function MatchingDetail() {
  const { buyerId, sellerId } = useParams();
  const navigate = useNavigate();
  const buyer = getAllBuyers().find((item) => item.id === Number(buyerId));
  const seller = mockSellers.find((item) => item.id === Number(sellerId));

  if (!buyer || !seller) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Match not found</h1>
        <Link to="/buyer/dashboard" className="btn-primary mt-4 inline-block">
          Back to dashboard
        </Link>
      </section>
    );
  }

  const stored = [...mockMatches, ...getStoredMatches()].find(
    (item) => item.buyerId === buyer.id && item.sellerId === seller.id
  );
  const live = calculateMatchScore(buyer, seller);
  const match = stored || {
    id: `draft-${buyer.id}-${seller.id}`,
    buyerId: buyer.id,
    sellerId: seller.id,
    matchScore: live.score,
    reasons: live.reasons,
    suggestedPrice: seller.askingPrice,
    status: 'matching',
  };
  const valuation = calculateFairValuation(seller);
  const fair = valuation.recommendation.startsWith('FAIR');

  const proceed = () => {
    const dealId = stored?.id || Date.now();
    if (!stored) {
      saveStoredMatch({
        ...match,
        id: dealId,
        negotiationHistory: [
          {
            step: 1,
            sellerAsk: seller.askingPrice,
            buyerOffer: Math.min(buyer.budget.max, seller.askingPrice),
            aiSuggestion: match.suggestedPrice,
            message: 'Ready to negotiate.',
            timestamp: new Date().toISOString(),
          },
        ],
        finalAgreedPrice: 0,
        createdAt: new Date().toISOString(),
      });
    }
    navigate(`/negotiate/${stored?.id || dealId}`);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Match detail</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <article className="card">
          <p className="text-xs uppercase tracking-wide text-slate-500">Buyer</p>
          <h2 className="text-xl font-semibold">{buyer.name}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Budget</dt>
              <dd>
                {formatPrice(buyer.budget.min)} – {formatPrice(buyer.budget.max)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Sector</dt>
              <dd>{buyer.sector}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Experience</dt>
              <dd>{experienceLabel[buyer.experience] || buyer.experience}</dd>
            </div>
          </dl>
        </article>

        <article className="card flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">Match score</p>
          <p className="match-score">
            {match.matchScore}
            <span className="text-lg text-slate-500">/100</span>
          </p>
          <ul className="mt-4 space-y-2 text-left text-sm">
            {match.reasons.map((reason) => (
              <li key={reason}>✓ {reason.replace(/^✓\s*/, '')}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <p className="text-xs uppercase tracking-wide text-slate-500">Seller</p>
          <h2 className="text-xl font-semibold">{seller.businessName}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Revenue</dt>
              <dd>{formatPrice(seller.annualRevenue)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Profit</dt>
              <dd>{formatPrice(seller.annualProfit)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Location</dt>
              <dd>{seller.location}</dd>
            </div>
          </dl>
        </article>
      </div>

      <section className="card mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Valuation</h2>
          <span className={fair ? 'badge-success' : 'rounded bg-orange-100 px-2 py-1 text-sm text-orange-800'}>
            {fair ? '✓ Fair versus the model' : '⚠ Overpriced versus the model'}
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Revenue multiple', `${valuation.revenueMultiple}×`],
            ['Profit multiple', `${valuation.profitMultiple}×`],
            ['Fair price range', `${formatPrice(valuation.range.min)} – ${formatPrice(valuation.range.max)}`],
            ['Seller asking', formatPrice(seller.askingPrice)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-lightBg p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <button type="button" className="btn-primary mt-6" onClick={proceed}>
          PROCEED TO NEGOTIATION
        </button>
      </section>
    </section>
  );
}
