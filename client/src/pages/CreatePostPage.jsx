import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

export default function CreatePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', tags: '', isPublished: false });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    api.get(`/posts/mine/${id}`).then(({ data }) => {
      if (active) setForm({ title: data.title, content: data.content, tags: data.tags.join(', '), isPublished: data.isPublished });
    }).catch((err) => {
      if (active) { setError(err.response?.data?.message || 'Unable to load this post.'); setLoadFailed(true); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const body = { ...form, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) };
    try {
      if (id) await api.put(`/posts/${id}`, body);
      else await api.post('/posts', body);
      navigate('/dashboard', { state: { message: body.isPublished ? 'Post published.' : 'Draft saved privately.' } });
    } catch (err) {
      setError(err.response?.data?.errors?.join(' ') || err.response?.data?.message || 'Unable to save. Please try again.');
    } finally { setSaving(false); }
  };

  const change = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-100';
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/dashboard" className="text-emerald-300">Back to my posts</Link>
        <h1 className="mt-5 text-3xl font-bold">{id ? 'Edit post' : 'Write a post'}</h1>
        <p className="mt-2 text-slate-400">Drafts are private. Publishing makes your post visible in the public feed.</p>
        {error && <p role="alert" className="mt-4 text-red-300">{error}</p>}
        {loading ? <p className="mt-6" role="status">Loading your post...</p> : !loadFailed && (
          <form onSubmit={save} className="mt-6 space-y-5">
            <fieldset disabled={saving} className="space-y-5">
              <div><label htmlFor="title" className="mb-2 block">Title</label><input id="title" name="title" value={form.title} onChange={change} required maxLength={200} className={inputClass} /></div>
              <div><label htmlFor="content" className="mb-2 block">Content</label><textarea id="content" name="content" value={form.content} onChange={change} required maxLength={90000} rows={14} className={inputClass} /></div>
              <div><label htmlFor="tags" className="mb-2 block">Tags, separated by commas</label><input id="tags" name="tags" value={form.tags} onChange={change} className={inputClass} /><p className="mt-1 text-sm text-slate-400">Up to 10 tags, each up to 30 characters.</p></div>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((previous) => ({ ...previous, isPublished: event.target.checked }))} />Publish to the public feed</label>
              <div className="flex gap-4"><button className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950" type="submit">{saving ? 'Saving...' : form.isPublished ? 'Save and publish' : 'Save private draft'}</button><Link to="/dashboard" className="px-3 py-3">Cancel</Link></div>
            </fieldset>
          </form>
        )}
      </main>
    </div>
  );
}
