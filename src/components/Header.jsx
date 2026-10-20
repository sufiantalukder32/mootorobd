import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, isLoggedIn, logout } from '../utils/auth';

const linkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
  }`;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const loggedIn = isLoggedIn();
  const user = loggedIn ? getCurrentUser() : null;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary">
            M
          </span>
          <span className="text-lg">Mootorobd</span>
        </Link>

        <button
          type="button"
          className="rounded-md border border-white/30 px-3 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <Link to={{ pathname: '/', hash: 'listings' }} className="block rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Browse
          </Link>
          <NavLink to="/seller-signup" className={linkClass}>
            Sell Your Business
          </NavLink>
          {loggedIn ? (
            <>
              <NavLink to="/buyer/dashboard" className={linkClass}>
                {user?.name ? user.name.split(' ')[0] : 'Dashboard'}
              </NavLink>
              <button type="button" onClick={handleLogout} className="btn-secondary ml-2 bg-white">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-secondary ml-2 bg-white text-center">
              Login
            </NavLink>
          )}
        </nav>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-white/20 px-4 py-3 md:hidden">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <Link to={{ pathname: '/', hash: 'listings' }} className="block rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Browse
          </Link>
          <NavLink to="/seller-signup" className={linkClass}>
            Sell Your Business
          </NavLink>
          {loggedIn ? (
            <>
              <NavLink to="/buyer/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <button type="button" onClick={handleLogout} className="btn-secondary mt-2 w-full bg-white">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-secondary mt-2 block bg-white text-center">
              Login
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
