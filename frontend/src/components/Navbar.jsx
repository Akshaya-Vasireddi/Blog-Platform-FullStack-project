import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-cream-warm bg-cream sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl font-display font-bold text-ink group-hover:text-amber-ink transition-colors">
              Inkwell
            </span>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-ink mt-1"></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `btn-ghost text-sm ${isActive ? 'text-ink font-medium' : ''}`
              }
            >
              Stories
            </NavLink>

            {isAuthenticated ? (
              <>
                <Link to="/create-post" className="btn-ghost text-sm">
                  Write
                </Link>
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-cream-warm">
                  <span className="font-sans text-sm text-ink-muted">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button onClick={handleLogout} className="btn-ghost text-sm">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">Get started</Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-ink-muted hover:text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cream-warm py-3 space-y-1">
            <Link to="/" className="block btn-ghost text-sm" onClick={() => setMenuOpen(false)}>Stories</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create-post" className="block btn-ghost text-sm" onClick={() => setMenuOpen(false)}>Write</Link>
                <div className="pt-2 border-t border-cream-warm mt-2">
                  <p className="px-4 text-sm text-ink-muted font-sans">{user?.name}</p>
                  <button onClick={handleLogout} className="block w-full text-left btn-ghost text-sm">Sign out</button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-cream-warm mt-2 flex gap-2 px-4">
                <Link to="/login" className="btn-secondary text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Get started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
