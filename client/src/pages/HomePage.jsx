// client/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts'); // public endpoint
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch posts. Server might be down.');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-200 text-lg animate-pulse">
          Loading posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top section */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-2">
              DraftNest
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
              DraftNest Feed
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Explore posts from other developers, or share your own stories about bugs,
              fixes, and late-night coding sessions.
            </p>
          </div>

          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-400/70 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-300 transition"
          >
            ＋ New Post
          </Link>
        </div>

        {/* If no posts */}
        {posts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
              🪶
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              No posts yet
            </h2>
            <p className="text-sm text-slate-400 text-center max-w-sm">
              Be the first to publish a blog about your debugging adventures or learning journey.
            </p>
            <Link
              to="/create"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
            >
              Start writing
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const authorName =
                post.author?.username || post.author?.name || 'Unknown author';
              const createdAt = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : '';

              return (
                <article
                  key={post._id}
                  className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-400/80 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Title */}
                  <Link to={`/post/${post._id}`}>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-50 group-hover:text-emerald-300 transition">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Meta */}
                  <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm text-slate-400">
                    <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-200 font-semibold">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-200">
                        {authorName}
                      </span>
                      {createdAt && (
                        <span className="text-xs text-slate-500">
                          Posted on {createdAt}
                        </span>
                      )}
                    </div>
                    <span className="ml-auto inline-flex items-center rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                      Blog Post
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className="mt-4 text-sm sm:text-base text-slate-300 line-clamp-3">
                    {post.content?.substring(0, 220)}...
                  </p>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      to={`/post/${post._id}`}
                      className="text-sm font-medium text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1"
                    >
                      Read full post
                      <span aria-hidden="true">→</span>
                    </Link>

                    <div className="flex gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Public
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
