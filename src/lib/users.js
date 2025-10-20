import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), '.data');
const usersFile = path.join(dataDir, 'users.json');

function ensureStore() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
  } catch (e) {
    // noop
  }
}

export function getUsers() {
  ensureStore();
  try {
    const raw = fs.readFileSync(usersFile, 'utf8');
    const data = JSON.parse(raw || '{}');
    return Array.isArray(data.users) ? data.users : [];
  } catch (e) {
    return [];
  }
}

export function saveUsers(users) {
  ensureStore();
  try {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

export function findUserByEmail(email) {
  const users = getUsers();
  const key = String(email || '').toLowerCase().trim();
  return users.find(u => String(u.email || '').toLowerCase().trim() === key) || null;
}

export function findUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function createUser({ name, email, role = 'member', status = 'pending', passwordHash = null, meta = {} }) {
  const users = getUsers();
  const exists = findUserByEmail(email);
  if (exists) return { error: 'Email sudah terdaftar', user: null };
  const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user = { id, name, email, role, status, passwordHash, meta, createdAt: Date.now() };
  users.push(user);
  saveUsers(users);
  return { user };
}

export function updateUser(id, patch = {}) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { error: 'User tidak ditemukan' };
  users[idx] = { ...users[idx], ...patch, updatedAt: Date.now() };
  saveUsers(users);
  return { user: users[idx] };
}

export function listUsers(filters = {}) {
  const users = getUsers();
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

export function deleteUser(id) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { error: 'User tidak ditemukan' };
  const [removed] = users.splice(idx, 1);
  saveUsers(users);
  return { user: removed };
}