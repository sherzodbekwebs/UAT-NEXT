import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

// Professional SEO Metadata (Rus tilida maksimal optimallashgan)
export const metadata: Metadata = {
  title: 'UzAuto TRAILER — Официальный сайт производителя прицепов и спецтехники',
  description: 'Ведущий завод UzAuto TRAILER (UAT) в Узбекистане по производству грузовых прицепов, полуприцепов, самосвалов и спецтехники. Высокое качество, современное производство и официальный сервис.',
  keywords: [
    'UzAuto TRAILER', 
    'производство прицепов Узбекистан', 
    'купить полуприцеп в Ташкенте', 
    'спецтехника Камаз', 
    'самосвалы производство', 
    'завод UAT', 
    'грузовая техника Узбекистан'
  ],
  alternates: {
    canonical: 'https://uzautotrailer.uz',
  },
  openGraph: {
    title: 'UzAuto TRAILER — Лидер в производстве прицепной техники',
    description: 'Официальный сайт завода UzAuto TRAILER. Полный каталог спецтехники, прицепов и полуприцепов в Узбекистане.',
    url: 'https://uzautotrailer.uz',
    siteName: 'UzAuto TRAILER',
    images: [
      {
        url: 'https://uzautotrailer.uz/uzbg1.png',
        width: 1200,
        height: 630,
        alt: 'Завод UzAuto TRAILER',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UzAuto TRAILER — Спецтехника для вашего бизнеса',
    description: 'Производство качественных прицепов и полуприцепов в Узбекистане.',
    images: ['https://uzautotrailer.uz/uzbg1.png'],
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

export default function Page() {
  return <HomeClient />;
}