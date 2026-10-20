import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">This page is not on the map</h1>
      <p className="mt-3 text-slate-600">
        The listing or screen you asked for is not part of this demo.
      </p>
      <Link to="/" className="btn-primary mt-6 inline-block">
        Back to listings
      </Link>
    </section>
  );
}
