# Changelog

All notable changes to this project will be documented in this file.

## v0.1.0 — 2025-10-11

### Added
- Site Settings: `campusName`, `heroTitle`, `heroSubtitle` kini dinamis dari pengaturan.
- Admin Settings page: field pengelolaan nama kampus, judul, dan subjudul hero.
- Public pages: `/news`, `/events`, dan `/resources` untuk mengatasi 404.
- Login enhancements: kotak info peran di halaman `member/login` dan `struct/login`.
- UI: teks “Selamat datang” dipusatkan di halaman login.
- CI: Workflow GitHub Actions untuk build (`checkout`, `setup-node`, `npm ci`, lint non-blocking, build).
- README: badge status CI.

### Fixed
- 404 pada halaman News/Events/Resources dengan penambahan halaman publik.
- Build produksi berhasil (`npm run build`).

### Notes
- `.gitignore` diperbarui untuk mengabaikan `.data/` agar `users.json` tidak ter-push.
- Tag rilis `v0.1.0` telah diterbitkan.