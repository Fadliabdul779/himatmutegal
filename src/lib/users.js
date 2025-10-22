import fs from 'fs';
import path from 'path';
import { get as ecGet } from '@vercel/edge-config';

const dataDir = path.join(process.cwd(), '.data');
const usersFile = path.join(dataDir, 'users.json');
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG;
const EDGE_CONFIG_TOKEN = process.env.EDGE_CONFIG_TOKEN;
const USE_EDGE = !!EDGE_CONFIG_ID && !!EDGE_CONFIG_TOKEN;

function ensureStore() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
  } catch {}
}

// ---------- FS helpers ----------
function fsGetUsers() {
  ensureStore();
  try {
    const raw = fs.readFileSync(usersFile, 'utf8');
    const data = JSON.parse(raw || '{}');
    return Array.isArray(data.users) ? data.users : [];
  } catch {
    return [];
  }
}

function fsSaveUsers(users) {
  ensureStore();
  try {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
    return true;
  } catch {
    return false;
  }
}

// ---------- Edge Config helpers ----------
async function edgeGetUsers() {
  try {
    const arr = await ecGet('users');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function edgeSaveUsers(users) {
  try {
    const res = await fetch(`https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${EDGE_CONFIG_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operations: [{ op: 'upsert', key: 'users', value: users }] }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ---------- Public API (async for Edge, sync for FS) ----------
export async function getUsers() {
  if (USE_EDGE) return await edgeGetUsers();
  return fsGetUsers();
}

export async function saveUsers(users) {
  if (USE_EDGE) return await edgeSaveUsers(users);
  return fsSaveUsers(users);
}

export async function findUserByEmail(email) {
  const users = await getUsers();
  const key = String(email || '').toLowerCase().trim();
  return users.find(u => String(u.email || '').toLowerCase().trim() === key) || null;
}

export async function findUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function createUser({ name, email, role = 'member', status = 'pending', passwordHash = null, meta = {} }) {
  const users = await getUsers();
  const exists = await findUserByEmail(email);
  if (exists) return { error: 'Email sudah terdaftar', user: null };
  const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user = { id, name, email, role, status, passwordHash, meta, createdAt: Date.now() };
  users.push(user);
  await saveUsers(users);
  return { user };
}

export async function updateUser(id, patch = {}) {
  const users = await getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { error: 'User tidak ditemukan' };
  users[idx] = { ...users[idx], ...patch, updatedAt: Date.now() };
  await saveUsers(users);
  return { user: users[idx] };
}

export async function listUsers(filters = {}) {
  const users = await getUsers();
  const { role, status, q } = filters;
  let result = users;
  if (role) result = result.filter(u => u.role === role);
  if (status) result = result.filter(u => u.status === status);
  if (q) {
    const qq = String(q).toLowerCase();
    result = result.filter(u => String(u.name || '').toLowerCase().includes(qq) || String(u.email || '').toLowerCase().includes(qq));
  }
  return result;
}

export async function deleteUser(id) {
  const users = await getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { error: 'User tidak ditemukan' };
  const [removed] = users.splice(idx, 1);
  await saveUsers(users);
  return { user: removed };
}