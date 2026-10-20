import { useNavigate } from 'react-router-dom';
import { formatPrice, starString } from '../utils/helpers';

export default function SellerCard({ seller, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(seller);
    navigate(`/seller/${seller.id}`);
  };

  return (
    <article
      className="card flex h-full cursor-pointer flex-col overflow-hidden p-0 hover:shadow-card"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') handleClick();
      }}
      role="link"
      tabIndex={0}
    >
      <img
        src={seller.photos?.[0]}
        alt={seller.businessName}
        className="h-40 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-darkText">{seller.businessName}</h3>
          {seller.status === 'active' ? (
            <span className="badge-success shrink-0">✓ Verified</span>
          ) : (
            <span className="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700">Sold</span>
          )}
        </div>
        <p className="text-sm text-slate-600">
          {seller.category} · {seller.location}
        </p>
        <p className="text-sm text-amber-500" aria-label={`${seller.rating} stars`}>
          {starString(seller.rating)} <span className="text-slate-500">({seller.reviews})</span>
        </p>
        <p className="mt-auto text-xl font-bold text-primary">{formatPrice(seller.askingPrice)}</p>
      </div>
    </article>
  );
}
