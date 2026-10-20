import { Link } from 'react-router-dom';

const links = [
  { to: '/about', label: 'About' },
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-darkText text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">Mootorobd</p>
          <p className="text-sm text-white/70">SME businesses for sale across Bangladesh.</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-white/80 hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Mootorobd. Demo marketplace — sample figures only.
      </div>
    </footer>
  );
}
