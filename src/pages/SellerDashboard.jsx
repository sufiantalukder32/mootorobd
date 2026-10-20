import { useState } from 'react';
import { Link } from 'react-router-dom';
import mockSellers from '../data/mockSellers';
import { formatPrice, formatSmart } from '../utils/helpers';

const inquiries = [
  { id: 1, buyer: 'Arjun Patel', date: '12 Oct 2026', offer: 480000 },
  { id: 2, buyer: 'Imran Hossain', date: '15 Oct 2026', offer: 500000 },
  { id: 3, buyer: 'Lamia Sultana', date: '18 Oct 2026', offer: 510000 },
];

export default function SellerDashboard() {
  const seller = mockSellers[0];
  const [editing, setEditing] = useState(false);
  const [askingPrice, setAskingPrice] = useState(seller.askingPrice);
  const [removed, setRemoved] = useState(false);
  const [notice, setNotice] = useState('');
  const salePrice = 520000;
  const commission = Math.round(salePrice * 0.03);
  const net = salePrice - commission;

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <p className="text-sm text-slate-500">Seller preview</p>
        <h1 className="text-3xl font-bold">{seller.ownerName}</h1>
      </div>

      <section className="card">
        <h2 className="text-lg font-semibold">Your listing</h2>
        {removed ? (
          <p className="mt-3 text-sm">Listing removed from this demo view. Refresh the page to restore it.</p>
        ) : (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Business name</dt>
              <dd className="font-medium">{seller.businessName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium">{seller.category}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Asking price</dt>
              <dd className="font-medium">{formatPrice(askingPrice)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="badge-success inline-block">Active</dd>
            </div>
          </dl>
        )}
        {editing && !removed && (
          <label className="mt-4 block text-sm">
            Update asking price (demo only)
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={askingPrice}
              onChange={(event) => setAskingPrice(Number(event.target.value))}
            />
          </label>
        )}
        {notice && <p className="mt-3 text-sm text-slate-600">{notice}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditing((value) => !value);
              setNotice('Price changes stay in this browser session only.');
            }}
          >
            EDIT LISTING
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setRemoved(true);
              setNotice('The listing was hidden in this demo. Nothing was deleted on a server.');
            }}
          >
            REMOVE LISTING
          </button>
          <Link to="/match/1/1" className="btn-primary">
            VIEW MATCHES
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Inquiries</h2>
        <ul className="mt-4 divide-y">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span className="font-medium">{inquiry.buyer}</span>
              <span className="text-slate-500">{inquiry.date}</span>
              <span>{formatPrice(inquiry.offer)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Commission breakdown</h2>
        <p className="mt-2 text-sm text-slate-700">
          If sold at {formatSmart(salePrice)}, commission 3% = {formatSmart(commission)}, net ={' '}
          {formatSmart(net)} ({formatPrice(net)}).
        </p>
      </section>
    </section>
  );
}
