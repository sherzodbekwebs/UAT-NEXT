import NewsListPage from '@/components/NewsListPage/NewsListPage';
import { Metadata } from 'next';

// Professional SEO Metadata (Rus tilida)
export const metadata: Metadata = {
  title: 'Новости и события компании | UzAuto TRAILER — Официальный сайт',
  description: 'Все последние новости, события, достижения и важные обновления завода UzAuto TRAILER. Будьте в курсе жизни крупнейшего производителя спецтехники в Узбекистане.',
  keywords: [
    'новости UzAuto TRAILER', 
    'события UAT', 
    'завод спецтехники новости', 
    'производство прицепов Узбекистан', 
    'новости автопрома Узбекистана'
  ],
  alternates: {
    canonical: 'https://uzautotrailer.uz/news',
  },
  openGraph: {
    title: 'Новости UzAuto TRAILER — Последние события и обновления',
    description: 'Узнайте первыми о новых проектах, запусках производства и официальных событиях завода UzAuto TRAILER.',
    url: 'https://uzautotrailer.uz/news',
    siteName: 'UzAuto TRAILER',
    images: [
      {
        url: 'https://uzautotrailer.uz/uzbg1.png',
        width: 1200,
        height: 630,
        alt: 'Новости UzAuto TRAILER',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Новости и события UzAuto TRAILER',
    description: 'Официальные новости завода-производителя спецтехники в Узбекистане.',
    images: ['https://uzautotrailer.uz/uzbg1.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function NewsPage() {
  return <NewsListPage />;
}