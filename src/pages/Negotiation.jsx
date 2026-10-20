import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import mockMatches from '../data/mockMatches';
import mockSellers from '../data/mockSellers';
import { getAllBuyers } from '../utils/auth';
import { formatLakh, formatPrice, getInitials, getStoredMatches, readStorage, writeStorage } from '../utils/helpers';
import { canAgree, suggestFairPrice } from '../utils/negotiation-algorithm';

export default function Negotiation() {
  const { dealId } = useParams();
  const match = useMemo(() => {
    const all = [...mockMatches, ...getStoredMatches()];
    return all.find((item) => String(item.id) === String(dealId));
  }, [dealId]);

  const history = useMemo(() => {
    if (match?.negotiationHistory?.length) return match.negotiationHistory;
    return [
      {
        step: 1,
        sellerAsk: 0,
        buyerOffer: 0,
        aiSuggestion: 0,
        message: '',
        timestamp: '',
      },
    ];
  }, [match]);

  const storageKey = `negotiation_${dealId}`;
  const saved = readStorage(storageKey, null);
  const [step, setStep] = useState(saved?.step || 0);
  const [sellerAsk, setSellerAsk] = useState(history[saved?.step || 0]?.sellerAsk || 0);
  const [buyerOffer, setBuyerOffer] = useState(history[saved?.step || 0]?.buyerOffer || 0);
  const [dirty, setDirty] = useState(false);
  const [confirmed, setConfirmed] = useState(Boolean(saved?.confirmed));
  const [meeting, setMeeting] = useState(Boolean(saved?.meeting));
  const [playing, setPlaying] = useState(false);

  const safeStep = Math.min(step, history.length - 1);
  const current = history[safeStep];
  const seller = mockSellers.find((item) => item.id === match?.sellerId);
  const buyer = getAllBuyers().find((item) => item.id === match?.buyerId);
  const shownAi = dirty
    ? suggestFairPrice(Number(sellerAsk) || 0, Number(buyerOffer) || 0, match?.suggestedPrice || 0)
    : current.aiSuggestion;
  const pricesMatch = canAgree(Number(sellerAsk) || 0, Number(buyerOffer) || 0);
  const agreedPrice =
    Number(sellerAsk) === Number(buyerOffer) ? Number(sellerAsk) : shownAi;

  useEffect(() => {
    writeStorage(storageKey, { step: safeStep, confirmed, meeting });
  }, [storageKey, safeStep, confirmed, meeting]);

  useEffect(() => {
    if (!playing) return undefined;
    if (safeStep >= history.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => {
      const next = safeStep + 1;
      setDirty(false);
      setStep(next);
      setSellerAsk(history[next].sellerAsk);
      setBuyerOffer(history[next].buyerOffer);
    }, 1200);
    return () => clearTimeout(timer);
  }, [playing, safeStep, history]);

  if (!match || !seller || !buyer) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Negotiation not found</h1>
        <Link to="/buyer/dashboard" className="btn-primary mt-4 inline-block">
          Back to dashboard
        </Link>
      </section>
    );
  }

  const goToStep = (index) => {
    setPlaying(false);
    setDirty(false);
    setConfirmed(false);
    setMeeting(false);
    setStep(index);
    setSellerAsk(history[index].sellerAsk);
    setBuyerOffer(history[index].buyerOffer);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Deal #{match.id}</p>
          <h1 className="text-3xl font-bold">Negotiation</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setPlaying(true)}>
            Play steps
          </button>
          <button type="button" className="btn-secondary" onClick={() => goToStep(0)}>
            Replay
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-red-200 bg-red-50">
          <header className="bg-[#E74C3C] px-4 py-3 font-semibold text-white">Seller&apos;s Ask</header>
          <div className="space-y-4 p-4">
            <p className="text-4xl font-bold text-[#E74C3C]">{formatLakh(sellerAsk)}</p>
            <label className="block text-sm">
              Counter-offer
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-red-200 px-3 py-2"
                value={sellerAsk}
                onChange={(event) => {
                  setDirty(true);
                  setConfirmed(false);
                  setSellerAsk(Number(event.target.value));
                }}
              />
            </label>
            <div className="flex items-center gap-3">
              <img src={seller.photos[0]} alt="" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{seller.ownerName}</p>
                <p className="text-sm text-slate-600">{seller.businessName}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
          <header className="bg-accent px-4 py-3 font-semibold text-white">AI Suggested Fair Price</header>
          <div className="space-y-4 p-4 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={shownAi}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-4xl font-bold text-accent md:text-5xl"
              >
                {formatLakh(shownAi)}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-slate-700">
              Based on revenue multiple (0.6x), profit multiple (3x), and market conditions
            </p>
            <p className="text-sm text-slate-700">
              Seller: This is fair market value. Buyer will likely accept. Buyer: This balances
              seller&apos;s sustainability with your investment.
            </p>
            {pricesMatch && (
              <button type="button" className="btn-primary bg-secondary hover:bg-green-700" onClick={() => setConfirmed(true)}>
                THEY AGREE!
              </button>
            )}
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-blue-200 bg-blue-50">
          <header className="bg-primary px-4 py-3 font-semibold text-white">Buyer&apos;s Offer</header>
          <div className="space-y-4 p-4">
            <p className="text-4xl font-bold text-primary">{formatLakh(buyerOffer)}</p>
            <label className="block text-sm">
              Counter-offer
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2"
                value={buyerOffer}
                onChange={(event) => {
                  setDirty(true);
                  setConfirmed(false);
                  setBuyerOffer(Number(event.target.value));
                }}
              />
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {getInitials(buyer.name)}
              </div>
              <div>
                <p className="font-semibold">{buyer.name}</p>
                <p className="text-sm text-slate-600">{buyer.sector}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      {(confirmed || (pricesMatch && !dirty && current.sellerAsk === current.buyerOffer)) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-xl bg-secondary px-4 py-4 text-white"
        >
          <p className="text-lg font-semibold">
            ✓ Deal Confirmed! Both parties agree on {formatLakh(agreedPrice || current.aiSuggestion)}
          </p>
          {!meeting && (
            <button
              type="button"
              className="mt-3 rounded-lg bg-white px-4 py-2 font-semibold text-secondary"
              onClick={() => setMeeting(true)}
            >
              PROCEED TO MEETING
            </button>
          )}
        </motion.div>
      )}

      {meeting && (
        <div className="card mt-4">
          <h2 className="text-lg font-semibold">Shop visit requested</h2>
          <p className="mt-2 text-sm text-slate-700">
            A Mootorobd advisor will introduce {buyer.name} and {seller.ownerName} to confirm{' '}
            {formatLakh(agreedPrice || shownAi)} and walk the premises at {seller.address}. This demo
            stops before any payment.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Negotiation steps</h2>
          {safeStep < history.length - 1 && (
            <button type="button" className="btn-secondary" onClick={() => goToStep(safeStep + 1)}>
              Next step
            </button>
          )}
        </div>
        {history.map((item, index) => {
          const agreed = item.sellerAsk === item.buyerOffer;
          return (
            <motion.button
              type="button"
              key={item.step}
              layout
              onClick={() => goToStep(index)}
              className={`w-full rounded-xl border bg-white p-4 text-left ${
                index === safeStep ? 'border-accent ring-2 ring-accent' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">Step {item.step}</p>
                <span className={agreed ? 'badge-success' : 'rounded bg-slate-100 px-2 py-1 text-sm'}>
                  {agreed ? '✓ AGREEMENT!' : 'In progress'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Seller asks {formatPrice(item.sellerAsk)}, Buyer offers {formatPrice(item.buyerOffer)}, AI
                suggests {formatPrice(item.aiSuggestion)}
              </p>
              {item.message && <p className="mt-1 text-sm text-slate-500">{item.message}</p>}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
