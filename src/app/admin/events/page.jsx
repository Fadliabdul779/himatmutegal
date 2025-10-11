"use client";
import { useEffect, useState } from "react";
import AdminModal from "../../../components/AdminModal";

export default function AdminEventsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", location: "", status: "draft", summary: "" });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/events", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal memuat data event");
        setItems([]);
      } else {
        setItems(data.items || []);
      }
    } catch (e) {
      setError(e.message || "Gagal memuat data event");
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", date: "", location: "", status: "draft", summary: "" });
    setOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setForm({ title: item.title || "", date: item.date || "", location: item.location || "", status: item.status || "draft", summary: item.summary || "" });
    setOpen(true);
  }

  async function save() {
    setError("");
    try {
      if (editing?._id) {
        const res = await fetch(`/api/admin/events?id=${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal update");
      } else {
        const res = await fetch("/api/admin/events", {
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
      const res = await fetch(`/api/admin/events?id=${item._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      await load();
    } catch (e) {
      alert(e.message || "Error menghapus");
    }
  }

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Kelola Event</h1>
        <button onClick={openCreate} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2">Tambah Event</button>
      </div>
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="text-slate-600">Memuat...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Judul</th>
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id || it.slug} className="border-b">
                  <td className="py-2 pr-4">{it.title}</td>
                  <td className="py-2 pr-4">{it.date || '-'}</td>
                  <td className="py-2 pr-4">{it.status || '-'}</td>
                  <td className="py-2 flex gap-2">
                    <button onClick={() => openEdit(it)} className="text-[var(--primary)]">Edit</button>
                    <button onClick={() => remove(it)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={open} title={editing ? 'Edit Event' : 'Tambah Event'} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Judul" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Tanggal (YYYY-MM-DD)" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Lokasi" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded-lg px-3 py-2">
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Ringkasan" />
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