import '../index.css';
import { Inter, Roboto } from 'next/font/google';
import AppShell from '../components/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700', '900'], variable: '--font-roboto' });

export const metadata = {
  title: 'UzAuto TRAILER',
  description: 'UzAuto TRAILER — leading manufacturer of trailers and mounted equipment.',
  metadataBase: new URL('https://uzautotrailer.uz'),
  openGraph: {
    title: 'UzAuto TRAILER',
    description: 'UzAuto TRAILER — leading manufacturer of trailers and mounted equipment.',
    type: 'website',
    url: 'https://uzautotrailer.uz/',
    images: ['/uzbg1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UzAuto TRAILER',
    description: 'UzAuto TRAILER — leading manufacturer of trailers and mounted equipment.',
    images: ['/uzbg1.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${roboto.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
