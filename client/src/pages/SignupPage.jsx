// client/src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // auto-login after signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Call the Signup API
      await api.post('/auth/signup', {
        username,
        email,
        password,
      });

      // 2. Auto-login for smooth experience
      const loginSuccess = await login(email, password);

      if (loginSuccess) {
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 -left-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign up to start publishing posts and saving your dev journey.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-7 backdrop-blur">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs sm:text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-200 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique handle"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Use a strong password you don&apos;t reuse elsewhere.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex justify-center items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-5 text-center text-xs sm:text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Tiny footer */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          One account. Infinite drafts, bugs, and breakthroughs.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
