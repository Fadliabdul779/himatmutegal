import Link from "next/link";
import { sanityClient, queries } from "../../lib/sanity";

export const metadata = { title: "Proyek & Portfolio — Hima Informatika" };

export default async function ProjectsPage() {
  let projects = [];
  if (sanityClient) {
    try {
      projects = await sanityClient.fetch(queries.projects);
    } catch (e) {
      projects = [];
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-heading text-2xl font-bold">Proyek & Portfolio</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((p) => (
            <div key={p._id} className="border rounded-lg p-4">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-slate-600">Status: {p.status || "-"}</div>
              <div className="mt-2 flex gap-3 text-sm">
                {p.demoUrl && <Link href={p.demoUrl} target="_blank" className="text-[var(--primary)]">Demo</Link>}
                {p.repoUrl && <Link href={p.repoUrl} target="_blank" className="text-[var(--primary)]">Repo</Link>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-600">Belum ada konten. Konfigurasi Sanity terlebih dahulu.</div>
        )}
      </div>
    </div>
  );
}