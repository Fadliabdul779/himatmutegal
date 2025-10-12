# himatmutegal

![CI](https://github.com/Fadliabdul779/himatmutegal/actions/workflows/ci.yml/badge.svg)

## Changelog

Lihat catatan rilis lengkap di [`CHANGELOG.md`](./CHANGELOG.md) dan halaman [Releases](https://github.com/Fadliabdul779/himatmutegal/releases).

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Fadliabdul779/himatmutegal)

- Framework: Next.js, Output: `.next`, Build: `npm run build`
- Node.js: gunakan versi `20` (Project Settings → General → Node.js Version)
- Contoh konfigurasi ENV: lihat `.env.example`

### Production URL

 - Production: https://himatikatmu-9671.vercel.app
 - Jika sudah ada custom domain, ganti dengan `https://himinformatika.id` (contoh)

### Deploy on Render (Alternatif selain GitHub Releases)

- Tombol deploy: https://render.com/deploy?repo=https://github.com/Fadliabdul779/himatmutegal
- File konfigurasi: `render.yaml` (otomatis terbaca oleh Render)
- Build: `npm ci && npm run build`, Start: `npm run start`, Node: `20`
- Tambahkan Environment Variables (Project → Environment):
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
  - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_GA_ID`
  - `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`
  - `SENDGRID_API_KEY`, `EMAIL_FROM`, `EMAIL_ADMIN`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_SHEETS_WEBHOOK_URL`
  - `NEXT_TELEMETRY_DISABLED=1`
- OAuth redirect (Google): `https://<domain-render>/api/auth/callback/google`

## Environment Variables (Production)

Tambahkan variabel berikut di Vercel (Project Settings → Environment Variables):

```
NEXTAUTH_URL=https://<project>.vercel.app
NEXTAUTH_SECRET=<random-long-secret>

NEXT_PUBLIC_SITE_URL=https://<project>.vercel.app
NEXT_PUBLIC_SITE_NAME=Himpunan Mahasiswa Informatika
NEXT_PUBLIC_GA_ID=G-XXXXXXX

SANITY_PROJECT_ID=<id>
SANITY_DATASET=production
SANITY_API_TOKEN=<token>

SENDGRID_API_KEY=<key>
EMAIL_FROM=no-reply@himinformatika.id
EMAIL_ADMIN=admin@himinformatika.id

GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec

GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>

NEXT_TELEMETRY_DISABLED=1
```

Authorized redirect URIs (Google OAuth):
- `https://<project>.vercel.app/api/auth/callback/google`
- (opsional) tambahkan domain Preview jika diperlukan

Situs resmi Himpunan Mahasiswa Informatika — Next.js + TailwindCSS

## Getting Started

Pertama, jalankan development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasil.

Kamu bisa mulai mengedit halaman di `src/app/page.js`. Perubahan akan ter-update otomatis.

Konfigurasi Environment (`.env.local`):

```
NEXT_PUBLIC_SITE_NAME=Himpunan Mahasiswa Informatika
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXX
SENDGRID_API_KEY=SG.xxxxxx
EMAIL_FROM=no-reply@himinformatika.id
EMAIL_ADMIN=admin@himinformatika.id
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
```

Fitur awal:
- Beranda dengan hero, CTA bergabung, dan highlight acara.
- Daftar event dengan filter dan detail event + form pendaftaran.
- Halaman Membership dan Kontak dengan form.
- Stub halaman Berita, Proyek, Resource, Galeri, Sponsor.
- API routes untuk pendaftaran event, membership, dan kontak.
- Notifikasi email ke Admin saat ada pendaftar baru (via SendGrid).

## Learn More

Langkah berikutnya:
- Integrasi CMS (Sanity/WordPress headless) untuk berita & proyek.
- Tambah autentikasi (NextAuth) untuk area admin/member.
- Generate sitemap: `npx next-sitemap` saat build.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
