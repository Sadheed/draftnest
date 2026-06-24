// client/src/pages/CreatePostPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      await api.post('/posts', { title, content, tags: tagsArray });
      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to create post. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / top bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-1">
              New draft
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50">
              Create a new post
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Share something you learned, a bug you fixed, or a story from your dev journey.
            </p>
          </div>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center text-xs font-medium text-slate-400 hover:text-emerald-300 transition"
          >
            ← Back to feed
          </Link>
        </div>

        {/* Form card */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                className="block text-sm font-semibold text-slate-200 mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="E.g. How I fixed a weird JWT error in my MERN app"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label
                className="block text-sm font-semibold text-slate-200 mb-2"
                htmlFor="content"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                placeholder="Write your post here. Markdown-style paragraphs, explanations, code snippets, or a story..."
                required
              ></textarea>
              <p className="mt-1 text-[11px] text-slate-500">
                Tip: Start with the problem, how you approached it, and what you learned.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label
                className="block text-sm font-semibold text-slate-200 mb-2"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="react, mern, debugging, auth"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Separate tags with commas. These help group similar posts together.
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center items-center w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-3 text-sm sm:text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing…' : 'Publish post'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex justify-center items-center w-full sm:w-auto rounded-xl border border-slate-700 px-6 py-3 text-sm sm:text-base font-medium text-slate-300 hover:bg-slate-800/70 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreatePostPage;
