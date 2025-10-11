import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), '.data', 'role-emails.json');

function parseList(envValue) {
  if (!envValue) return [];
  return envValue
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

export function getRoleEmails() {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf-8');
      const j = JSON.parse(raw);
      return {
        admin: (j.admin || []).map((s) => String(s).toLowerCase()),
        struct: (j.struct || []).map((s) => String(s).toLowerCase()),
      };
    }
  } catch {}
  return {
    admin: parseList(process.env.ADMIN_GOOGLE_EMAILS || process.env.ADMIN_GOOGLE_EMAIL || process.env.ADMIN_EMAIL),
    struct: parseList(process.env.STRUCT_GOOGLE_EMAILS || process.env.STRUCT_GOOGLE_EMAIL || process.env.STRUCT_EMAIL),
  };
}

export function saveRoleEmails(payload) {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const admin = Array.isArray(payload?.admin) ? payload.admin : parseList(payload?.admin);
  const struct = Array.isArray(payload?.struct) ? payload.struct : parseList(payload?.struct);
  const data = { admin, struct };
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  return data;
}