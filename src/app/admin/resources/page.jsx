"use client";
import { useEffect, useState } from "react";
import AdminModal from "../../../components/AdminModal";

export default function AdminResourcesPage() {
  // Documents management via site settings
  const [site, setSite] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docMsg, setDocMsg] = useState("");
  const [docSaving, setDocSaving] = useState(false);

  // Resource posts from Sanity
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", excerpt: "", publishedAt: "", status: "member", resourceTag: true });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/site');
        const data = await res.json();
        setSite(data);
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
      } catch {}
      loadPosts();
    })();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      const posts = Array.isArray(data.items) ? data.items : [];
      setItems(posts);
    } catch (e) {
      setError("Gagal memuat resource");
    }
    setLoading(false);
  }

  async function saveDocuments() {
    if (!site) return;
    setDocSaving(true);
    setDocMsg("");
    try {
      const payload = { ...site, documents };
      const res = await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan');
      setSite(data);
      setDocMsg('Tersimpan');
    } catch (e) {
      setDocMsg(e.message || 'Gagal menyimpan');
    }
    setDocSaving(false);
  }

  async function toggleResourceTag(it) {
    const tags = Array.isArray(it.tags) ? it.tags.slice() : [];
    const has = tags.includes('resource');
    const next = has ? tags.filter((t) => t !== 'resource') : [...tags, 'resource'];
    try {
      const res = await fetch(`/api/admin/news?id=${it._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tags: next }) });
      if (!res.ok) throw new Error('Gagal mengubah tag');
      setItems((prev) => prev.map((p) => (p._id === it._id ? { ...p, tags: next } : p)));
    } catch (e) {
      alert(e.message);
    }
  }

  async function updateStatus(it, status) {
    try {
      const res = await fetch(`/api/admin/news?id=${it._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error('Gagal mengubah status');
      setItems((prev) => prev.map((p) => (p._id === it._id ? { ...p, status } : p)));
    } catch (e) {
      alert(e.message);
    }
  }

  async function remove(it) {
    if (!confirm(`Hapus \"${it.title}\"?`)) return;
    try {
      const res = await fetch(`/api/admin/news?id=${it._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      await loadPosts();
    } catch (e) {
      alert(e.message || 'Error menghapus');
    }
  }

  function openCreate() {
    setCreateForm({ title: "", excerpt: "", publishedAt: "", status: "member", resourceTag: true });
    setCreateOpen(true);
  }

  async function submitCreate() {
    setCreateLoading(true);
    try {
      const { title, excerpt, publishedAt, status, resourceTag } = createForm;
      const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, excerpt, publishedAt, status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat');
      const created = data.item;
      if (resourceTag) {
        await fetch(`/api/admin/news?id=${created._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tags: ['resource'] }) });
      }
      setCreateOpen(false);
      await loadPosts();
    } catch (e) {
      alert(e.message || 'Error membuat resource');
    }
    setCreateLoading(false);
  }

  const resourcePosts = items.filter((p) => p.status === 'member' || (Array.isArray(p.tags) && (p.tags.includes('resource') || p.tags.includes('member'))));

  return (
    <div className="h-full overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Kelola Dokumen & Resource</h1>
        <div className="flex items-center gap-2">
          <button onClick={openCreate} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2">Tambah Resource</button>
          <button onClick={loadPosts} className="rounded-lg border px-4 py-2">Muat Ulang</button>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Dokumen</h2>
        <p className="text-sm text-slate-600">Tambah tautan dokumen (judul dan URL).</p>
        <div className="mt-3 space-y-3">
          {documents.map((d, idx) => (
            <div key={idx} className="border rounded-lg p-3 space-y-2">
              <div>
                <label className="block text-sm font-medium">Judul</label>
                <input className="mt-1 w-full border rounded-lg px-3 py-2" value={d.title || ''} onChange={(e)=>setDocuments((prev)=>{const next=[...prev]; next[idx]={...next[idx], title: e.target.value}; return next;})} />
              </div>
              <div>
                <label className="block text-sm font-medium">URL</label>
                <input className="mt-1 w-full border rounded-lg px-3 py-2" value={d.url || ''} onChange={(e)=>setDocuments((prev)=>{const next=[...prev]; next[idx]={...next[idx], url: e.target.value}; return next;})} placeholder="https://..." />
              </div>
              <div className="flex gap-3">
                <button type="button" className="text-red-600 text-sm" onClick={()=>setDocuments((prev)=>prev.filter((_,i)=>i!==idx))}>Hapus</button>
              </div>
            </div>
          ))}
          <div>
            <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={()=>setDocuments((prev)=>[...prev,{ title:'', url:'' }])}>Tambah Dokumen</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={saveDocuments} disabled={docSaving} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2 disabled:opacity-50">{docSaving ? 'Menyimpan...' : 'Simpan Dokumen'}</button>
            {docMsg && <div className="text-sm text-slate-700">{docMsg}</div>}
          </div>
        </div>
      </div>

      {/* Resource posts */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold">Resource (Post)</h2>
        <p className="text-sm text-slate-600">Tandai post sebagai resource (tag "resource") atau ubah status ke "member" untuk akses anggota.</p>
        <div className="mt-3">
          {loading ? (
            <div>Memuat...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : resourcePosts.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 border-b">Judul</th>
                    <th className="p-2 border-b">Tanggal</th>
                    <th className="p-2 border-b">Status</th>
                    <th className="p-2 border-b">Tag Resource</th>
                    <th className="p-2 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {resourcePosts.map((it) => {
                    const hasResource = Array.isArray(it.tags) && it.tags.includes('resource');
                    return (
                      <tr key={it._id} className="border-b">
                        <td className="p-2">
                          <div className="font-medium">{it.title}</div>
                          {it.excerpt && <div className="text-slate-600">{it.excerpt}</div>}
                        </td>
                        <td className="p-2">{it.publishedAt ? new Date(it.publishedAt).toLocaleDateString('id-ID') : ''}</td>
                        <td className="p-2">
                          <select value={it.status || ''} onChange={(e)=>updateStatus(it, e.target.value)} className="border rounded-lg px-2 py-1">
                            <option value="draft">draft</option>
                            <option value="public">public</option>
                            <option value="member">member</option>
                            <option value="internal">internal</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <button onClick={() => toggleResourceTag(it)} className={`rounded-lg px-3 py-1 border ${hasResource ? 'bg-[var(--secondary)] text-white border-[var(--secondary)]' : ''}`}>{hasResource ? 'Resource' : 'Bukan'}</button>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-3">
                            <a href={`/news/${it.slug || ''}`} className="text-[var(--primary)]" target="_blank" rel="noreferrer">Buka</a>
                            <button onClick={() => remove(it)} className="text-red-600">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-slate-600">Belum ada resource.</div>
          )}
        </div>
      </div>

      <AdminModal open={createOpen} title="Tambah Resource" onClose={() => setCreateOpen(false)}>
        <div className="space-y-3">
          <input value={createForm.title} onChange={(e)=>setCreateForm({ ...createForm, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Judul" />
          <input value={createForm.excerpt} onChange={(e)=>setCreateForm({ ...createForm, excerpt: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Ringkasan (opsional)" />
          <div className="grid grid-cols-2 gap-3">
            <input value={createForm.publishedAt} onChange={(e)=>setCreateForm({ ...createForm, publishedAt: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Tanggal (YYYY-MM-DD)" />
            <select value={createForm.status} onChange={(e)=>setCreateForm({ ...createForm, status: e.target.value })} className="border rounded-lg px-3 py-2">
              <option value="member">member</option>
              <option value="draft">draft</option>
              <option value="public">public</option>
              <option value="internal">internal</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={createForm.resourceTag} onChange={(e)=>setCreateForm({ ...createForm, resourceTag: e.target.checked })} />
            Tandai sebagai resource (tag "resource")
          </label>
          <div className="flex justify-end gap-2">
            <button onClick={() => setCreateOpen(false)} className="rounded-lg border px-4 py-2">Batal</button>
            <button onClick={submitCreate} disabled={createLoading} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2 disabled:opacity-50">{createLoading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}