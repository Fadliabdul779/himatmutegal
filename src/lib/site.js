import path from 'path';
import fs from 'fs/promises';

const dataDir = path.join(process.cwd(), '.data');
const siteFile = path.join(dataDir, 'site.json');

export async function getSiteSettings() {
  try {
    const raw = await fs.readFile(siteFile, 'utf-8');
    const json = JSON.parse(raw || '{}');
    return {
      heroTitle: json.heroTitle || 'Himpunan Mahasiswa Informatika',
      heroSubtitle: json.heroSubtitle || 'Tempat berkarya, berkolaborasi, dan berkembang di dunia teknologi.',
      campusName: json.campusName || 'TMU (Tegal Muhammadiyah University)',
      // kontak
      contactEmail: json.contactEmail || 'himitikatmu@gmail.com',
      contactPhone: json.contactPhone || '085869230249',
      contactAddress: json.contactAddress || 'Jl. melati No. 27, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah',
      instagram: json.instagram || '@hmpi_tmu',
      // tentang kami
      aboutIntro: json.aboutIntro || 'Himpunan Mahasiswa Informatika adalah wadah berkolaborasi, berkarya, dan berkembang bagi mahasiswa Informatika.',
      visi: json.visi || 'Mewujudkan mahasiswa Informatika yang kreatif, berintegritas, dan berkontribusi pada masyarakat.',
      misi: Array.isArray(json.misi) && json.misi.length > 0 ? json.misi : [
        'Menyelenggarakan kegiatan edukatif dan aplikatif (workshop, seminar, hackathon).',
        'Mendorong proyek nyata, riset terapan, dan kolaborasi lintas disiplin.',
        'Memfasilitasi jejaring dengan alumni, industri, dan komunitas.',
        'Menjaga budaya inklusif, profesional, dan beretika.',
      ],
      history: Array.isArray(json.history) && json.history.length > 0 ? json.history : [
        'Hima Informatika resmi dibentuk.',
        'Menyelenggarakan hackathon perdana tingkat kampus.',
        'Kolaborasi dengan industri untuk program magang.',
        'Transformasi digital dan portal anggota.',
      ],
      pengurus: Array.isArray(json.pengurus) && json.pengurus.length > 0 ? json.pengurus : [
        { nama: 'Ketua Hima', jabatan: 'Ketua', foto: '/vercel.svg' },
        { nama: 'Wakil Ketua', jabatan: 'Wakil Ketua', foto: '/vercel.svg' },
        { nama: 'Sekretaris', jabatan: 'Sekretaris', foto: '/vercel.svg' },
        { nama: 'Bendahara', jabatan: 'Bendahara', foto: '/vercel.svg' },
        { nama: 'Koordinator Acara', jabatan: 'Divisi Acara', foto: '/vercel.svg' },
        { nama: 'Koordinator Media', jabatan: 'Divisi Media', foto: '/vercel.svg' },
      ],
      instagramPosts: Array.isArray(json.instagramPosts) ? json.instagramPosts : [],
      documents: Array.isArray(json.documents) && json.documents.length > 0 ? json.documents : [
        { title: 'Anggaran Dasar & ART', url: 'https://example.com/AD-ART.pdf' },
        { title: 'Panduan Keanggotaan', url: 'https://example.com/panduan.pdf' },
      ],
    };
  } catch {
    return {
      heroTitle: 'Himpunan Mahasiswa Informatika',
      heroSubtitle: 'Tempat berkarya, berkolaborasi, dan berkembang di dunia teknologi.',
      campusName: 'TMU (Tegal Muhammadiyah University)',
      // kontak (default)
      contactEmail: 'himitikatmu@gmail.com',
      contactPhone: '085869230249',
      contactAddress: 'Jl. melati No. 27, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah',
      instagram: '@hmpi_tmu',
      // tentang kami (default)
      aboutIntro: 'Himpunan Mahasiswa Informatika adalah wadah berkolaborasi, berkarya, dan berkembang bagi mahasiswa Informatika.',
      visi: 'Mewujudkan mahasiswa Informatika yang kreatif, berintegritas, dan berkontribusi pada masyarakat.',
      misi: [
        'Menyelenggarakan kegiatan edukatif dan aplikatif (workshop, seminar, hackathon).',
        'Mendorong proyek nyata, riset terapan, dan kolaborasi lintas disiplin.',
        'Memfasilitasi jejaring dengan alumni, industri, dan komunitas.',
        'Menjaga budaya inklusif, profesional, dan beretika.',
      ],
      history: [
        'Hima Informatika resmi dibentuk.',
        'Menyelenggarakan hackathon perdana tingkat kampus.',
        'Kolaborasi dengan industri untuk program magang.',
        'Transformasi digital dan portal anggota.',
      ],
      pengurus: [
        { nama: 'Ketua Hima', jabatan: 'Ketua', foto: '/vercel.svg' },
        { nama: 'Wakil Ketua', jabatan: 'Wakil Ketua', foto: '/vercel.svg' },
        { nama: 'Sekretaris', jabatan: 'Sekretaris', foto: '/vercel.svg' },
        { nama: 'Bendahara', jabatan: 'Bendahara', foto: '/vercel.svg' },
        { nama: 'Koordinator Acara', jabatan: 'Divisi Acara', foto: '/vercel.svg' },
        { nama: 'Koordinator Media', jabatan: 'Divisi Media', foto: '/vercel.svg' },
      ],
      instagramPosts: [],
      documents: [
        { title: 'Anggaran Dasar & ART', url: 'https://example.com/AD-ART.pdf' },
        { title: 'Panduan Keanggotaan', url: 'https://example.com/panduan.pdf' },
      ],
    };
  }
}

export async function saveSiteSettings(payload) {
  function toLines(v) {
    if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
    return String(v || '')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function normPengurus(arr) {
    if (!Array.isArray(arr)) return [
      { nama: 'Ketua Hima', jabatan: 'Ketua', foto: '/vercel.svg' },
      { nama: 'Wakil Ketua', jabatan: 'Wakil Ketua', foto: '/vercel.svg' },
      { nama: 'Sekretaris', jabatan: 'Sekretaris', foto: '/vercel.svg' },
      { nama: 'Bendahara', jabatan: 'Bendahara', foto: '/vercel.svg' },
      { nama: 'Koordinator Acara', jabatan: 'Divisi Acara', foto: '/vercel.svg' },
      { nama: 'Koordinator Media', jabatan: 'Divisi Media', foto: '/vercel.svg' },
    ];
    return arr
      .map((p) => ({
        nama: String(p?.nama || '').trim(),
        jabatan: String(p?.jabatan || '').trim(),
        foto: String(p?.foto || '').trim() || '/vercel.svg',
      }))
      .filter((p) => p.nama && p.jabatan);
  }

  function normDocs(arr) {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((d) => ({
        title: String(d?.title || '').trim(),
        url: String(d?.url || '').trim(),
      }))
      .filter((d) => d.title && d.url);
  }

  const cfg = {
    heroTitle: (payload?.heroTitle || '').trim() || 'Himpunan Mahasiswa Informatika',
    heroSubtitle: (payload?.heroSubtitle || '').trim() || 'Tempat berkarya, berkolaborasi, dan berkembang di dunia teknologi.',
    campusName: (payload?.campusName || '').trim() || 'TMU (Tegal Muhammadiyah University)',
    // kontak
    contactEmail: (payload?.contactEmail || '').trim() || 'himitikatmu@gmail.com',
    contactPhone: (payload?.contactPhone || '').trim() || '085869230249',
    contactAddress: (payload?.contactAddress || '').trim() || 'Jl. melati No. 27, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah',
    instagram: (payload?.instagram || '').trim() || '@hmpi_tmu',
    // tentang kami
    aboutIntro: (payload?.aboutIntro || '').trim() || 'Himpunan Mahasiswa Informatika adalah wadah berkolaborasi, berkarya, dan berkembang bagi mahasiswa Informatika.',
    visi: (payload?.visi || '').trim() || 'Mewujudkan mahasiswa Informatika yang kreatif, berintegritas, dan berkontribusi pada masyarakat.',
    misi: toLines(payload?.misi || [
      'Menyelenggarakan kegiatan edukatif dan aplikatif (workshop, seminar, hackathon).',
      'Mendorong proyek nyata, riset terapan, dan kolaborasi lintas disiplin.',
      'Memfasilitasi jejaring dengan alumni, industri, dan komunitas.',
      'Menjaga budaya inklusif, profesional, dan beretika.',
    ]),
    history: toLines(payload?.history || [
      'Hima Informatika resmi dibentuk.',
      'Menyelenggarakan hackathon perdana tingkat kampus.',
      'Kolaborasi dengan industri untuk program magang.',
      'Transformasi digital dan portal anggota.',
    ]),
    pengurus: normPengurus(payload?.pengurus),
    instagramPosts: toLines(payload?.instagramPosts || []),
    documents: normDocs(payload?.documents),
  };
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(siteFile, JSON.stringify(cfg, null, 2), 'utf-8');
    return cfg;
  } catch (e) {
    throw e;
  }
}