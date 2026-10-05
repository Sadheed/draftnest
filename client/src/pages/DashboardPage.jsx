import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

export default function DashboardPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let active = true;
    api.get('/posts/mine').then(({ data }) => { if (active) setPosts(data); })
      .catch((err) => { if (active) setError(err.response?.data?.message || 'Unable to load your posts.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const update = async (post, remove = false) => {
    if (remove && !window.confirm(`Delete "${post.title}" permanently?`)) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (remove) {
        await api.delete(`/posts/${post._id}`);
        setPosts((previous) => previous.filter((item) => item._id !== post._id));
        setMessage('Post deleted.');
      } else {
        const { data } = await api.put(`/posts/${post._id}`, { isPublished: !post.isPublished });
        setPosts((previous) => previous.map((item) => item._id === post._id ? data : item));
        setMessage(data.isPublished ? 'Post published.' : 'Post returned to a private draft.');
      }
    } catch (err) { setError(err.response?.data?.message || 'Unable to update this post.'); }
    finally { setBusy(false); }
  };

  const visible = posts.filter((post) => filter === 'all' || (filter === 'published' ? post.isPublished : !post.isPublished));
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">My posts</h1><p className="mt-2 text-slate-400">Your private drafts and published learning notes.</p></div><Link to="/create" className="rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">Write a post</Link></div>
        <div className="my-6 flex gap-3" aria-label="Filter posts">{['all', 'drafts', 'published'].map((value) => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-full border px-4 py-2 capitalize ${filter === value ? 'border-emerald-400 text-emerald-300' : 'border-slate-700 text-slate-400'}`}>{value}</button>)}</div>
        {error && <p role="alert" className="mb-4 text-red-300">{error}</p>}
        {message && <p role="status" className="mb-4 text-emerald-300">{message}</p>}
        {loading ? <p role="status">Loading your posts...</p> : !error && visible.length === 0 ? <p className="rounded-xl border border-slate-800 p-8 text-slate-400">No posts in this view yet. Start writing your next learning note.</p> : null}
        <div className="space-y-4">{visible.map((post) => (
          <article key={post._id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="break-words text-xl font-semibold">{post.title}</h2><span className="rounded-full bg-slate-800 px-3 py-1 text-sm">{post.isPublished ? 'Published' : 'Private draft'}</span></div>
            <p className="mt-2 text-sm text-slate-400">Updated {new Date(post.updatedAt).toLocaleString()}</p>
            <p className="mt-3 break-words text-slate-300">{post.content.slice(0, 160)}{post.content.length > 160 ? '...' : ''}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4"><Link to={`/edit/${post._id}`} className="text-emerald-300">Edit</Link>{post.isPublished && <Link to={`/post/${post._id}`} className="text-slate-300">View public post</Link>}<button disabled={busy} onClick={() => update(post)} className="text-emerald-300 disabled:opacity-50">{post.isPublished ? 'Return to draft' : 'Publish'}</button><button disabled={busy} onClick={() => update(post, true)} className="text-red-300 disabled:opacity-50">Delete</button></div>
          </article>
        ))}</div>
      </main>
    </div>
  );
}
