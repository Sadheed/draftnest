// client/src/components/Header.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-emerald-300'
      : 'text-slate-300 hover:text-emerald-200';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/50">
            <span className="text-xl">🪶</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-300">
              DraftNest
            </span>
            <span className="text-xs text-slate-400 hidden sm:block">
              Blog your bugs & breakthroughs
            </span>
          </div>
        </Link>

        {/* Right: Nav / Auth */}
        <nav className="flex items-center gap-3 sm:gap-4 text-sm">
          {/* Main links (only when logged in, optional) */}
          {isLoggedIn && (
            <Link
              to="/"
              className={`${isActive(
                '/'
              )} hidden sm:inline-flex transition text-xs sm:text-sm`}
            >
              Feed
            </Link>
          )}

          {isLoggedIn ? (
            <>
              {/* User pill */}
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/40 text-xs font-semibold text-emerald-200">
                  {user?.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="text-xs text-slate-300">
                  {user?.username || 'User'}
                </span>
              </div>

              {/* New Post button */}
              <Link
                to="/create"
                className="inline-flex items-center rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition"
              >
                ＋ New Post
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="text-xs sm:text-sm font-medium text-slate-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-emerald-200 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
