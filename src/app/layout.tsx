import '../index.css';
import { Inter, Roboto } from 'next/font/google';
import AppShell from '../components/AppShell';
import type { ReactNode } from "react";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700', '900'], variable: '--font-roboto' });

export const metadata = {
  title: 'UzAuto TRAILER',
  description: "UzAuto TRAILER – O'zbekistondagi tirkamalar, yarim tirkamalar va maxsus texnikalar ishlab chiqarish bo'yicha yetakchi kompaniya.",
  metadataBase: new URL('https://uzautotrailer.uz'),
  openGraph: {
    title: 'UzAuto TRAILER',
    description: "O'zbekistondagi eng yirik tirkamalar va osma uskunalar ishlab chiqaruvchisi.",
    type: 'website',
    url: 'https://uzautotrailer.uz/',
    images: ['/uzbg1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UzAuto TRAILER',
    description: "Tirkamalar va maxsus texnikalar ishlab chiqarishda yuqori sifat va ishonchlilik.",
    images: ['/uzbg1.png'],
  },
  icons: {
    icon: '/Logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="uz" className={`${inter.variable} ${roboto.variable}`}>
      <body>
        <AppShell>{children}</AppShell>

        {/* Yandex Metrika - ID berilgan, xato chiqmasligi uchun */}
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