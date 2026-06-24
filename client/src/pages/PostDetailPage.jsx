// client/src/pages/PostDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Post not found or network error.');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-200 text-lg animate-pulse">Loading post…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md w-full bg-slate-950/80 border border-red-500/40 rounded-2xl p-6 text-center shadow-xl">
          <p className="text-red-400 text-sm sm:text-base mb-3">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-1 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
          >
            Back to feed
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400 text-sm">Post data is missing.</p>
      </div>
    );
  }

  const authorName =
    post.author?.username || post.author?.name || 'Unknown author';
  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : '';

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top bar / breadcrumb */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-emerald-300 transition"
          >
            ← Back
          </button>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-emerald-300 transition"
          >
            Back to feed
          </Link>
        </div>

        {/* Article card */}
        <article className="bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-50 mb-3">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-200 font-semibold">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-slate-200">
                  {authorName}
                </span>
                {createdAt && (
                  <span className="text-xs text-slate-500">
                    Published on {createdAt}
                  </span>
                )}
              </div>
            </div>

            <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
              Blog Post
            </span>
          </div>

          {/* Content */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-200">
            {/* For now just raw content. Later you can plug a markdown renderer. */}
            {post.content
              ?.split('\n')
              .filter((line) => line.trim().length > 0)
              .map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/40 px-3 py-1 text-xs font-medium text-emerald-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default PostDetailPage;
