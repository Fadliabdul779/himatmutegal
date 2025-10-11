"use client";
import { useEffect, useState } from "react";
import AdminModal from "../../../components/AdminModal";

export default function AdminNewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", publishedAt: "", status: "draft" });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/news", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal memuat data berita");
        setItems([]);
      } else {
        setItems(data.items || []);
      }
    } catch (e) {
      setError(e.message || "Gagal memuat data berita");
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", excerpt: "", publishedAt: "", status: "draft" });
    setOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setForm({ title: item.title || "", excerpt: item.excerpt || "", publishedAt: item.publishedAt || "", status: item.status || "draft" });
    setOpen(true);
  }

  async function save() {
    setError("");
    try {
      if (editing?._id) {
        const res = await fetch(`/api/admin/news?id=${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal update");
      } else {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal membuat");
      }
      setOpen(false);
      await load();
    } catch (e) {
      setError(e.message || "Error menyimpan");
    }
  }

  async function remove(item) {
    if (!confirm(`Hapus "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/news?id=${item._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      await load();
    } catch (e) {
      alert(e.message || "Error menghapus");
    }
  }

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Kelola Berita</h1>
        <button onClick={openCreate} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2">Tulis Baru</button>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-slate-600">Memuat...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          items.map((it) => (
            <div key={it._id || it.slug} className="border rounded-lg p-4">
              <div className="text-sm text-slate-600">{it.publishedAt ? new Date(it.publishedAt).toLocaleDateString('id-ID') : '-'}</div>
              <div className="font-medium">{it.title}</div>
              {it.excerpt && <p className="mt-1 text-sm text-slate-600">{it.excerpt}</p>}
              <div className="mt-2 flex gap-2">
                <button onClick={() => openEdit(it)} className="text-[var(--primary)]">Edit</button>
                <button onClick={() => remove(it)} className="text-red-600">Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminModal open={open} title={editing ? 'Edit Berita' : 'Tulis Berita'} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Judul" />
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Ringkasan" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Tanggal terbit (YYYY-MM-DD)" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded-lg px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2">Batal</button>
            <button onClick={save} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2">Simpan</button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}