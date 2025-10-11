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
    };
  } catch {
    return {
      heroTitle: 'Himpunan Mahasiswa Informatika',
      heroSubtitle: 'Tempat berkarya, berkolaborasi, dan berkembang di dunia teknologi.',
      campusName: 'TMU (Tegal Muhammadiyah University)',
    };
  }
}

export async function saveSiteSettings(payload) {
  const cfg = {
    heroTitle: (payload?.heroTitle || '').trim() || 'Himpunan Mahasiswa Informatika',
    heroSubtitle: (payload?.heroSubtitle || '').trim() || 'Tempat berkarya, berkolaborasi, dan berkembang di dunia teknologi.',
    campusName: (payload?.campusName || '').trim() || 'TMU (Tegal Muhammadiyah University)',
  };
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(siteFile, JSON.stringify(cfg, null, 2), 'utf-8');
    return cfg;
  } catch (e) {
    throw e;
  }
}