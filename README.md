# himatmutegal

![CI](https://github.com/Fadliabdul779/himatmutegal/actions/workflows/ci.yml/badge.svg)

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
