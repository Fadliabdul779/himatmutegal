// Seed Edge Config key `users` to an empty array via Vercel Management API
// Usage (PowerShell):
//   $env:EDGECONFIG_ID="ecfg_..."; $env:EDGECONFIG_TOKEN="<WRITE_TOKEN>"; node scripts/edge-config-seed-users.mjs

const id = process.env.EDGECONFIG_ID;
const token = process.env.EDGECONFIG_TOKEN;

if (!id || !token) {
  console.error('Missing EDGECONFIG_ID or EDGECONFIG_TOKEN env.');
  process.exit(1);
}

const url = `https://api.vercel.com/v1/edge-config/${id}/items`;

async function main() {
  const body = {
    items: [
      { operation: 'upsert', key: 'users', value: [] },
    ],
  };
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ ok: res.ok }));
  const ok = res.ok;
  if (ok) {
    console.log('Seeded `users` key successfully.');
  } else {
    console.error('Failed seeding `users` key.', res.status, data);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('Unhandled error:', e);
  process.exit(3);
});