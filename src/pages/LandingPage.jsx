import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SellerCard from '../components/SellerCard';
import mockSellers from '../data/mockSellers';

const priceBands = [
  { id: 'any', label: 'Any price' },
  { id: 'under5', label: 'Under ৳5 লাখ' },
  { id: 'mid', label: '৳5–15 লাখ' },
  { id: 'high', label: '৳15 লাখ+' },
];

function inBand(price, band) {
  if (band === 'under5') return price < 500000;
  if (band === 'mid') return price >= 500000 && price <= 1500000;
  if (band === 'high') return price > 1500000;
  return true;
}

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [band, setBand] = useState('any');

  const categories = useMemo(
    () => ['all', ...new Set(mockSellers.map((seller) => seller.category))],
    []
  );
  const locations = useMemo(
    () => ['all', ...new Set(mockSellers.map((seller) => seller.location))],
    []
  );

  const results = mockSellers.filter((seller) => {
    const haystack = `${seller.businessName} ${seller.ownerName} ${seller.category} ${seller.location}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesCategory = category === 'all' || seller.category === category;
    const matchesLocation = location === 'all' || seller.location === location;
    return matchesQuery && matchesCategory && matchesLocation && inBand(seller.askingPrice, band);
  });

  return (
    <div>
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm font-medium text-white/80">বাংলাদেশের ক্ষুদ্র ব্যবসার বাজার</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">
              Buy a running business in Bangladesh
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              Mootorobd lists SME shops, mills, and services with bank statements, bKash and Nagad
              totals, and an AI fair-price check before you talk numbers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#listings" className="btn-primary bg-white text-primary hover:bg-slate-100">
                Browse All
              </a>
              <Link to="/signup" className="btn-secondary border-white text-white hover:bg-white/10">
                Want to buy?
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
            {[
              ['8', 'Live SME listings'],
              ['6 mo', 'Bank history on every file'],
              ['3%', 'Success fee, shown before you agree'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="listings" className="mx-auto max-w-6xl px-4 py-10">
        <div className="card mb-6 grid gap-3 md:grid-cols-4">
          <label className="text-sm md:col-span-1">
            <span className="mb-1 block font-medium">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, city, category"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'All categories' : item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Location</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'All locations' : item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Price range</span>
            <select
              value={band}
              onChange={(event) => setBand(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {priceBands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Businesses for sale</h2>
          <p className="text-sm text-slate-600">
            {results.length} {results.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="card text-center">
            <p>No businesses match those filters.</p>
            <button
              type="button"
              className="btn-secondary mt-3"
              onClick={() => {
                setQuery('');
                setCategory('all');
                setLocation('all');
                setBand('any');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <SellerCard seller={seller} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
