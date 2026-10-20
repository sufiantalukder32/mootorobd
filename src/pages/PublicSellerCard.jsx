import { Link, useParams } from 'react-router-dom';
import VerificationBadge from '../components/VerificationBadge';
import mockSellers from '../data/mockSellers';
import { isLoggedIn } from '../utils/auth';
import { formatLakh, formatPrice, starString } from '../utils/helpers';
import FullSellerProfile from './FullSellerProfile';

export default function PublicSellerCard() {
  const { id } = useParams();
  const seller = mockSellers.find((item) => item.id === Number(id));

  if (isLoggedIn()) {
    return <FullSellerProfile />;
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <img
        src={seller.photos[0]}
        alt={seller.businessName}
        className="h-64 w-full rounded-xl object-cover"
      />
      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {seller.category} · {seller.location}
          </p>
          <h1 className="text-3xl font-bold">{seller.businessName}</h1>
          <p className="mt-1 text-amber-500">
            {starString(seller.rating)} <span className="text-slate-500">({seller.reviews} reviews)</span>
          </p>
        </div>
        <p className="text-3xl font-bold text-primary">{formatPrice(seller.askingPrice)}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <VerificationBadge type="bank" status="verified" />
        <VerificationBadge type="online-banking" status="verified" />
      </div>

      <p className="card mt-6 text-slate-700">
        Net profit: {formatLakh(seller.annualProfit)} (Unlock to see full details)
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link to="/signup" className="btn-primary">
          SIGN UP TO UNLOCK DETAILS
        </Link>
        <Link to="/login" className="text-sm font-semibold text-primary">
          or LOG IN
        </Link>
      </div>
    </article>
  );
}
