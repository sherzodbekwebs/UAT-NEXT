// 1. NewsListPage o'rniga NewsDetailPage import qiling
import NewsDetailPage from '@/components/NewsDetailPage/NewsDetailPage'; 
import { Metadata } from 'next';
import API from '@/api/axios';

export const metadata: Metadata = {
    title: "Yangiliklar | UzAuto TRAILER",
    description: "UzAuto TRAILER kompaniyasining eng so'nggi yangiliklari va tadbirlari.",
};

export async function generateStaticParams() {
  try {
    const res = await API.get('/news'); 
    const news = res.data;
    return news.map((post: any) => ({
      id: post.id.toString(), 
    }));
  } catch (error) {
    return [];
  }
}

// 2. Sahifa komponenti
export default function Page() {
    // BU YERDA NewsDetailPage qaytarilishi kerak
    return <NewsDetailPage />;
}