import VideosPage from '@/components/Videos/VideosPage';
import { Metadata } from 'next';

// Professional SEO Metadata (Rus tilida)
export const metadata: Metadata = {
  title: 'Видеообзоры спецтехники и прицепов | UzAuto TRAILER — Официальный сайт',
  description: 'Смотрите официальные видеообзоры продукции UzAuto TRAILER: испытания прицепов, полуприцепов, самосвалов и репортажи с производства. Узнайте всё о качестве нашей техники.',
  keywords: [
    'видеообзоры спецтехники', 
    'UzAuto TRAILER видео', 
    'испытания прицепов', 
    'производство полуприцепов видео', 
    'обзор самосвалов Камаз',
    'завод UzAuto TRAILER репортаж'
  ],
  alternates: {
    canonical: 'https://uzautotrailer.uz/videos',
  },
  openGraph: {
    title: 'Видеогалерея UzAuto TRAILER — Техника в движении',
    description: 'Официальный видеоканал завода UzAuto TRAILER. Обзоры моделей, технические тесты и производственные процессы.',
    url: 'https://uzautotrailer.uz/videos',
    siteName: 'UzAuto TRAILER',
    images: [
      {
        url: 'https://uzautotrailer.uz/uzbg1.png', // Video bo'limi uchun rasm
        width: 1200,
        height: 630,
        alt: 'Видеообзоры UzAuto TRAILER',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Видеообзоры и тесты техники UzAuto TRAILER',
    description: 'Смотрите как производится и работает лучшая спецтехника в Узбекистане.',
    images: ['https://uzautotrailer.uz/uzbg1.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <VideosPage />;
}