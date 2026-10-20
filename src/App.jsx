import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { isLoggedIn } from './utils/auth';
import BuyerDashboard from './pages/BuyerDashboard';
import FullSellerProfile from './pages/FullSellerProfile';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MatchingDetail from './pages/MatchingDetail';
import Negotiation from './pages/Negotiation';
import NotFound from './pages/NotFound';
import PublicSellerCard from './pages/PublicSellerCard';
import SellerDashboard from './pages/SellerDashboard';
import SellerVerification from './pages/SellerVerification';
import SignupPage from './pages/SignupPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Protected({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}

function SellerGate() {
  return isLoggedIn() ? <FullSellerProfile /> : <PublicSellerCard />;
}

function InfoPage({ title, children }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-4 space-y-3 leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-lightBg text-darkText">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/seller/:id" element={<SellerGate />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/seller-signup" element={<SellerVerification />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route
              path="/buyer/dashboard"
              element={
                <Protected>
                  <BuyerDashboard />
                </Protected>
              }
            />
            <Route
              path="/match/:buyerId/:sellerId"
              element={
                <Protected>
                  <MatchingDetail />
                </Protected>
              }
            />
            <Route
              path="/negotiate/:dealId"
              element={
                <Protected>
                  <Negotiation />
                </Protected>
              }
            />
            <Route
              path="/about"
              element={
                <InfoPage title="About">
                  <p>
                    Mootorobd is a demo marketplace where Bangladesh SME owners can show a business
                    for sale and buyers can compare verified numbers before they negotiate.
                  </p>
                  <p>
                    Every shop, bank row, and buyer in this build is sample data stored in the
                    browser. Nothing here moves money or files a real transfer.
                  </p>
                </InfoPage>
              }
            />
            <Route
              path="/terms"
              element={
                <InfoPage title="Terms">
                  <p>
                    This demo is for product walkthroughs. Listings, match scores, and AI price
                    suggestions are illustrations, not an offer, valuation opinion, or brokerage.
                  </p>
                  <p>Do not upload real NID scans, bank statements, or customer lists.</p>
                </InfoPage>
              }
            />
            <Route
              path="/privacy"
              element={
                <InfoPage title="Privacy">
                  <p>
                    Login state and any buyer you create stay in localStorage on this device. There
                    is no account server behind the demo.
                  </p>
                  <p>Clear the site data in your browser to remove the session and extra buyers.</p>
                </InfoPage>
              }
            />
            <Route
              path="/contact"
              element={
                <InfoPage title="Contact">
                  <p>Email hello@mootorobd.com for a walkthrough of this demo.</p>
                  <p>Dhaka, Bangladesh.</p>
                </InfoPage>
              }
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
