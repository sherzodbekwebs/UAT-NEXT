import ProductsPage from '@/components/ProductsPage/ProductsPage';
import { Metadata } from 'next';

// Professional SEO Metadata (Rus tilida)
export const metadata: Metadata = {
  title: 'Каталог прицепов, полуприцепов и спецтехники в Узбекистане | UzAuto TRAILER',
  description: 'Официальный каталог продукции UzAuto TRAILER: широкий выбор прицепов, полуприцепов, самосвалов и другой спецтехники высокого качества. Официальная гарантия, сервис и лучшие цены от производителя.',
  keywords: [
    'прицепы Узбекистан', 
    'купить полуприцеп в Ташкенте', 
    'продажа спецтехники', 
    'самосвалы Камаз', 
    'трал полуприцеп', 
    'UzAuto TRAILER каталог',
    'производство прицепов',
    'сельхозтехника Узбекистан'
  ],
  alternates: {
    canonical: 'https://uzautotrailer.uz/products',
  },
  openGraph: {
    title: 'Каталог спецтехники и прицепной техники | UzAuto TRAILER',
    description: 'Полный ассортимент грузовой и специальной техники от ведущего производителя в Узбекистане. Техника для любых задач бизнеса.',
    url: 'https://uzautotrailer.uz/products',
    siteName: 'UzAuto TRAILER',
    images: [
      {
        url: 'https://uzautotrailer.uz/uzbg1.png', // Katalog uchun umumiy rasm
        width: 1200,
        height: 630,
        alt: 'Каталог продукции UzAuto TRAILER',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Спецтехника и прицепы UzAuto TRAILER',
    description: 'Официальный каталог прицепной техники в Узбекистане.',
    images: ['https://uzautotrailer.uz/uzbg1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function ProductsRoutePage() {
  return <ProductsPage />;
}