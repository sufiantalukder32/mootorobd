import { Link, Navigate, useNavigate } from 'react-router-dom';
import mockMatches from '../data/mockMatches';
import mockSellers from '../data/mockSellers';
import { getCurrentUser, isLoggedIn, logout } from '../utils/auth';
import { formatPrice, getStoredMatches } from '../utils/helpers';
import { calculateMatchScore } from '../utils/matching-algorithm';

const experienceLabel = {
  'first-time': 'First-time',
  some: 'Some experience',
  experienced: 'Experienced',
};

function statusLabel(status) {
  if (status === 'negotiated') return 'Agreed';
  if (status === 'completed') return 'Completed';
  if (status === 'negotiating') return 'Negotiating';
  return 'Matching';
}

export default function BuyerDashboard() {
  const navigate = useNavigate();
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const user = getCurrentUser();
  const recommendations = mockSellers
    .filter((seller) => seller.status === 'active')
    .map((seller) => ({ seller, ...calculateMatchScore(user, seller) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const matches = [...mockMatches, ...getStoredMatches()].filter((item) => item.buyerId === user.id);
  const uniqueMatches = Array.from(new Map(matches.map((item) => [`${item.buyerId}-${item.sellerId}`, item])).values());
  const pending = uniqueMatches.filter((item) => item.status === 'matching' || item.status === 'negotiated').length;
  const profileFields = [user.name, user.email, user.phone, user.sector, user.experience, user.budget?.max];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          LOG OUT
        </button>
      </div>

      <section className="card">
        <h2 className="text-lg font-semibold">Your profile</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Name', user.name],
            ['Email', user.email],
            ['Budget', user.budget ? `${formatPrice(user.budget.min)} – ${formatPrice(user.budget.max)}` : '—'],
            ['Sector', user.sector],
            ['Experience', experienceLabel[user.experience] || user.experience],
            ['Profile completion', `${completion}%`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Personalized recommendations</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map(({ seller, score }) => (
            <Link key={seller.id} to={`/seller/${seller.id}`} className="card block">
              <img src={seller.photos[0]} alt="" className="h-28 w-full rounded-md object-cover" />
              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="font-semibold">{seller.businessName}</h3>
                <span className="badge-success">{score}/100</span>
              </div>
              <p className="text-sm text-slate-600">
                {seller.category} · {seller.location}
              </p>
              <p className="mt-2 font-bold text-primary">{formatPrice(seller.askingPrice)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Your matches</h2>
        {uniqueMatches.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No matches yet. Express interest on a listing to start one.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {uniqueMatches.map((item) => {
              const seller = mockSellers.find((entry) => entry.id === item.sellerId);
              return (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-lightBg p-3">
                  <div>
                    <p className="font-medium">{seller?.businessName || 'Listing'}</p>
                    <p className="text-sm text-slate-600">
                      {statusLabel(item.status)} · Score {item.matchScore}/100
                    </p>
                  </div>
                  <Link to={`/match/${item.buyerId}/${item.sellerId}`} className="btn-primary">
                    VIEW MATCH
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Activity</h2>
        <p className="mt-2 text-slate-700">
          You&apos;ve completed {user.dealsCompleted || 0} {user.dealsCompleted === 1 ? 'deal' : 'deals'}. You have {pending} pending {pending === 1 ? 'inquiry' : 'inquiries'}.
        </p>
        <Link to="/" className="btn-primary mt-4 inline-block">
          BROWSE ALL SELLERS
        </Link>
      </section>
    </section>
  );
}
