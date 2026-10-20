import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import AIAssessment from '../components/AIAssessment';
import BankStatementPreview from '../components/BankStatementPreview';
import VerificationBadge from '../components/VerificationBadge';
import mockMatches from '../data/mockMatches';
import mockSellers from '../data/mockSellers';
import { getCurrentUser, isLoggedIn } from '../utils/auth';
import { formatLakh, formatPrice, getStoredMatches, percent, saveStoredMatch, starString } from '../utils/helpers';
import { calculateMatchScore } from '../utils/matching-algorithm';
import { suggestFairPrice } from '../utils/negotiation-algorithm';
import { calculateFairValuation } from '../utils/valuation-algorithm';

function PieChart({ slices }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  let cursor = 0;
  const gradient = slices
    .map((slice) => {
      const start = (cursor / total) * 100;
      cursor += slice.value;
      const end = (cursor / total) * 100;
      return `${slice.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div
      className="relative h-40 w-40 shrink-0 rounded-full"
      style={{ background: `conic-gradient(${gradient})` }}
      aria-hidden="true"
    >
      <div className="absolute inset-6 rounded-full bg-white" />
    </div>
  );
}

export default function FullSellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);
  const seller = mockSellers.find((item) => item.id === Number(id));

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (!seller) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Link to="/" className="btn-primary mt-4 inline-block">
          Browse listings
        </Link>
      </section>
    );
  }

  const buyer = getCurrentUser();
  const valuation = calculateFairValuation(seller);
  const match = calculateMatchScore(buyer, seller);
  const monthlyAverage = Math.round(seller.annualRevenue / 12);
  const photos = seller.photos || [];
  const bankingSlices = [
    { label: 'bKash', value: seller.onlineBanking.bkash, color: '#E2136E' },
    { label: 'Nagad', value: seller.onlineBanking.nagad, color: '#F39C12' },
    { label: 'Bank', value: seller.onlineBanking.bankAccount, color: '#0066CC' },
  ];

  const expressInterest = () => {
    const existing = [...mockMatches, ...getStoredMatches()].find(
      (item) => item.buyerId === buyer.id && item.sellerId === seller.id
    );
    if (existing) {
      navigate(`/match/${buyer.id}/${seller.id}`);
      return;
    }

    const buyerOffer = Math.min(
      buyer.budget?.max || seller.askingPrice,
      Math.round(seller.askingPrice * 0.9)
    );
    const created = {
      id: Date.now(),
      buyerId: buyer.id,
      sellerId: seller.id,
      matchScore: match.score,
      reasons: match.reasons,
      suggestedPrice: suggestFairPrice(seller.askingPrice, buyerOffer, seller.askingPrice),
      negotiationHistory: [
        {
          step: 1,
          sellerAsk: seller.askingPrice,
          buyerOffer,
          aiSuggestion: suggestFairPrice(seller.askingPrice, buyerOffer, seller.askingPrice),
          message: 'Interest recorded. These opening numbers are ready to negotiate.',
          timestamp: new Date().toISOString(),
        },
      ],
      finalAgreedPrice: 0,
      status: 'matching',
      createdAt: new Date().toISOString(),
    };
    saveStoredMatch(created);
    navigate(`/match/${buyer.id}/${seller.id}`);
  };

  return (
    <article className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <img
            src={photos[photoIndex]}
            alt={`${seller.businessName}, view ${photoIndex + 1} of ${photos.length}`}
            className="h-72 w-full rounded-xl object-cover"
          />
          <div className="mt-3 flex gap-2">
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setPhotoIndex(index)}
                className={`h-16 w-20 overflow-hidden rounded-md border-2 ${
                  index === photoIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-500">
            {seller.category} · {seller.location}
          </p>
          <h1 className="text-3xl font-bold">{seller.businessName}</h1>
          <p className="mt-1 text-slate-600">Owner: {seller.ownerName}</p>
          <p className="mt-2 text-amber-500">
            {starString(seller.rating)} <span className="text-slate-500">({seller.reviews} reviews)</span>
          </p>
          <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(seller.askingPrice)}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <dt className="text-slate-500">Business age</dt>
              <dd className="font-semibold">{seller.businessAge} years</dd>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <dt className="text-slate-500">Employees</dt>
              <dd className="font-semibold">{seller.employees}</dd>
            </div>
          </dl>
          <p className="mt-4 text-slate-700">{seller.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <VerificationBadge type="bank" status="verified" />
            <VerificationBadge type="online-banking" status="verified" />
            <VerificationBadge type="supplier" status="verified" />
          </div>
          <button type="button" className="btn-primary mt-6" onClick={expressInterest}>
            EXPRESS INTEREST
          </button>
        </div>
      </div>

      <section className="card">
        <h2 className="text-lg font-semibold">Verified financials</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Annual revenue', formatPrice(seller.annualRevenue)],
            ['Annual profit', formatPrice(seller.annualProfit)],
            ['Profit margin', percent(seller.profitMargin)],
            ['Monthly average', formatPrice(monthlyAverage)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-lightBg p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <BankStatementPreview bankStatement={seller.bankStatement} />

      <section className="card">
        <h2 className="text-lg font-semibold">Online banking</h2>
        <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <PieChart slices={bankingSlices} />
          <ul className="space-y-2 text-sm">
            {bankingSlices.map((slice) => (
              <li key={slice.label} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: slice.color }} />
                <span>
                  {slice.label}: {formatPrice(slice.value)}
                </span>
              </li>
            ))}
            <li className="font-semibold">Total: {formatPrice(seller.onlineBanking.total)}</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Estimated value</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[
            ['Inventory', seller.estimatedValue.inventory],
            ['Equipment', seller.estimatedValue.equipment],
            ['Customer list', seller.estimatedValue.customerList],
            ['Total', seller.estimatedValue.total],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-lightBg p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
              <p className="font-semibold">{formatPrice(value)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Location</h2>
        <p className="mt-2">{seller.address}</p>
        <p className="text-sm text-slate-600">
          {seller.coordinates.lat}, {seller.coordinates.lng}
        </p>
        <iframe
          title={`Map of ${seller.businessName}`}
          className="mt-4 h-64 w-full rounded-lg border-0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${seller.coordinates.lng - 0.03}%2C${
            seller.coordinates.lat - 0.03
          }%2C${seller.coordinates.lng + 0.03}%2C${seller.coordinates.lat + 0.03}&layer=mapnik&marker=${
            seller.coordinates.lat
          }%2C${seller.coordinates.lng}`}
        />
      </section>

      <AIAssessment seller={seller} buyer={buyer} valuation={valuation} matchScore={match} />

      <p className="text-sm text-slate-500">
        Fair-value midpoint on this file is {formatLakh(valuation.fairValue)} using 0.6× revenue and 3× profit.
        The listed asking price is {formatLakh(seller.askingPrice)}.
      </p>
    </article>
  );
}
