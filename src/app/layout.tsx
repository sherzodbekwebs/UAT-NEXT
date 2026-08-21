import '../index.css';
import { Inter, Roboto } from 'next/font/google';
import AppShell from '../components/AppShell';
import type { ReactNode } from "react";
import Script from 'next/script';
import { Metadata } from 'next';
import AIChatBot from '../components/AIChatBot';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700', '900'], variable: '--font-roboto' });

// Professional SEO Metadata (Rus tiliga fokuslangan)
export const metadata: Metadata = {
  metadataBase: new URL('https://uzautotrailer.uz'),
  title: {
    default: 'UzAuto TRAILER — Официальный сайт завода прицепной техники',
    template: '%s | UzAuto TRAILER', // Ichki sahifalar "Название | UzAuto TRAILER" bo'lib chiqadi
  },
  description: "Официальный сайт UzAuto TRAILER – ведущего производителя прицепов, полуприцепов и спецтехники в Узбекистане. Гарантия качества, современное производство и сервис.",
  keywords: "UzAuto TRAILER, производство прицепов, спецтехника Узбекистан, полуприцепы Ташкент, купить грузовик, самосвалы Камаз, завод прицепов",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'UzAuto TRAILER — Завод по производству спецтехники',
    description: "Крупнейший производитель прицепной и навесной техники в Узбекистане. Официальный сайт.",
    type: 'website',
    url: 'https://uzautotrailer.uz/',
    siteName: 'UzAuto TRAILER',
    images: [
      {
        url: '/uzbg1.png',
        width: 1200,
        height: 630,
        alt: 'UzAuto TRAILER Завод',
      },
    ],
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UzAuto TRAILER — Лидер производства спецтехники',
    description: "Качественные прицепы и спецтехника от производителя в Узбекистане.",
    images: ['/uzbg1.png'],
  },
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png', // Apple qurilmalari uchun
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // Ruscha SEO uchun lang="ru" qildik
    <html lang="ru" className={`${inter.variable} ${roboto.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
        {/* <AIChatBot /> */}

        {/* Yandex Metrika */}
        <Script id="yandex-metrika-main" strategy="afterInteractive">
          {`
            (function (m, e, t, r, i, k, a) {
              m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
              m[i].l = 1 * new Date();
              for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
              k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(110732408, 'init', { 
              ssr: true, 
              webvisor: true, 
              clickmap: true, 
              ecommerce: "dataLayer", 
              accurateTrackBounce: true, 
              trackLinks: true 
            });
          `}
        </Script>

        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/110732408"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}