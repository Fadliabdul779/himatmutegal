"use client";
import { useEffect, useState } from "react";
import AdminModal from "../../../components/AdminModal";

export default function AdminMembersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ role: "", status: "pending", q: "" });
  const [resetOpen, setResetOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", role: "member", password: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.role) params.set("role", filters.role);
      if (filters.status) params.set("status", filters.status);
      if (filters.q) params.set("q", filters.q);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat");
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || "Gagal memuat data");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.status]);

  async function approve(id) {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal approve");
      setItems((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'approved' } : u)));
    } catch (e) {
      alert(e.message);
    }
  }

  async function reject(id) {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal reject");
      setItems((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'rejected' } : u)));
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeUser(id, email) {
    const ok = typeof window !== 'undefined' ? window.confirm(`Hapus akun ${email}?`) : true;
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus user');
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  function openReset(u) {
    setResetTarget(u);
    setNewPassword("");
    setResetOpen(true);
  }

  async function doReset() {
    if (!resetTarget?.id || !newPassword) return;
    try {
      const res = await fetch('/api/admin/users/reset-password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: resetTarget.id, newPassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal reset password");
      setResetOpen(false);
      alert('Password direset untuk: ' + (data.item?.email || 'user'));
    } catch (e) {
      alert(e.message);
    }
  }

  function openCreate() {
    setCreateError("");
    setCreateForm({ name: "", email: "", role: "member", password: "" });
    setCreateOpen(true);
  }

  async function submitCreate() {
    if (!createForm.name || !createForm.email) {
      setCreateError("Nama dan email wajib");
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name,
          email: createForm.email,
          role: createForm.role,
          password: createForm.password || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat user');
      setCreateOpen(false);
      setItems((prev) => [data.item, ...prev]);
    } catch (e) {
      setCreateError(e.message || 'Gagal membuat user');
    }
    setCreateLoading(false);
  }

  return (
    <div className="h-full overflow-auto">
      <div className="flex items-center justify-between px-6">
        <h1 className="font-heading text-2xl font-bold">Verifikasi Anggota</h1>
      </div>

      <div className="px-6 mt-4 grid sm:grid-cols-4 gap-3">
        <input value={filters.q} onChange={(e)=>setFilters({ ...filters, q: e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Cari nama/email" />
        <select value={filters.role} onChange={(e)=>setFilters({ ...filters, role: e.target.value })} className="border rounded-lg px-3 py-2">
          <option value="">Semua Role</option>
          <option value="member">Anggota</option>
          <option value="struct">Struktural</option>
          <option value="admin">Admin</option>
        </select>
        <select value={filters.status} onChange={(e)=>setFilters({ ...filters, status: e.target.value })} className="border rounded-lg px-3 py-2">
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex items-center gap-2">
          <button onClick={load} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2">Muat</button>
          <button onClick={openCreate} className="rounded-lg border px-4 py-2">Tambah User</button>
        </div>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <div className="text-slate-600">Memuat...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-slate-600">Tidak ada data.</div>
        ) : (
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-3 py-2">Nama</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Role</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-3 py-2">{u.name || '-'}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 capitalize">{u.role}</td>
                    <td className="px-3 py-2 capitalize">{u.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {u.status !== 'approved' && (
                          <button onClick={() => approve(u.id)} className="text-[var(--primary)]">Approve</button>
                        )}
                        {u.status !== 'rejected' && (
                          <button onClick={() => reject(u.id)} className="text-red-600">Reject</button>
                        )}
                        <button onClick={() => openReset(u)} className="text-slate-700">Reset Password</button>
+                       <button onClick={() => removeUser(u.id, u.email)} className="text-red-600">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminModal open={createOpen} title="Tambah User" onClose={() => setCreateOpen(false)}>
        <div className="space-y-3">
          <input value={createForm.name} onChange={(e)=>setCreateForm({ ...createForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Nama" />
          <input value={createForm.email} onChange={(e)=>setCreateForm({ ...createForm, email: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Email" type="email" />
          <select value={createForm.role} onChange={(e)=>setCreateForm({ ...createForm, role: e.target.value })} className="w-full border rounded-lg px-3 py-2">
            <option value="member">Anggota</option>
            <option value="struct">Struktural</option>
            <option value="admin">Admin</option>
          </select>
          <input value={createForm.password} onChange={(e)=>setCreateForm({ ...createForm, password: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Kata sandi (opsional)" type="password" />
          {createError && <div className="text-sm text-red-600">{createError}</div>}
          <div className="flex justify-end gap-2">
            <button onClick={() => setCreateOpen(false)} className="rounded-lg border px-4 py-2">Batal</button>
            <button onClick={submitCreate} disabled={createLoading} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2 disabled:opacity-50">{createLoading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      </AdminModal>

      <AdminModal open={resetOpen} title={`Reset Password ${resetTarget?.email || ''}`} onClose={() => setResetOpen(false)}>
        <div className="space-y-3">
          <input value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Password baru" type="password" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setResetOpen(false)} className="rounded-lg border px-4 py-2">Batal</button>
            <button onClick={doReset} className="rounded-lg bg-[var(--primary)] text-white px-4 py-2">Simpan</button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}