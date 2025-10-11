import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins" });

export const metadata = {
  title: "Himpunan Mahasiswa Informatika — Kegiatan • Berita • Proyek",
  description:
    "Situs resmi Himpunan Mahasiswa Informatika. Info event, proyek, materi, dan cara bergabung.",
  openGraph: {
    title: "Himpunan Mahasiswa Informatika",
    description:
      "Portal kegiatan, berita, proyek, dan resource untuk mahasiswa Informatika.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
  keywords: [
    "himpunan mahasiswa informatika",
    "organisasi mahasiswa informatika",
    "workshop pemrograman",
    "hackathon",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${poppins.variable} bg-white text-slate-900 min-h-screen flex flex-col`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
