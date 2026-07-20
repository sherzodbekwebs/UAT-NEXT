import NewsListPage from '@/components/NewsListPage/NewsListPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Yangiliklar | UzAuto TRAILER",
  description: "UzAuto TRAILER kompaniyasining eng so'nggi yangiliklari va tadbirlari.",
};

export default function Page() {
  return <NewsListPage />;
}