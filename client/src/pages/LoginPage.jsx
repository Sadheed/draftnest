// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);

    if (success) {
      navigate('/'); // Redirect to home on success
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* Background accent blur */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Title */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/50 bg-slate-900/80 px-4 py-1.5 mb-3">
            <span className="text-lg">🪶</span>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-300">
              DraftNest
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to continue writing and exploring posts.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-7 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
              >
                Sign in
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                <p className="text-slate-400">
                  New to DraftNest?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Tiny footer */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          Built for devs who like turning bugs into blog posts.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
