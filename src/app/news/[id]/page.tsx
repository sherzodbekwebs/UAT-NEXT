import NewsListPage from '@/components/NewsListPage/NewsListPage';
import { Metadata } from 'next';
import API from '@/api/axios'; // API import qiling (bu sizning axios sozlangan faylingiz)

export const metadata: Metadata = {
  title: "Yangiliklar | UzAuto TRAILER",
  description: "UzAuto TRAILER kompaniyasining eng so'nggi yangiliklari va tadbirlari.",
};

// 1. BU QISMNI QO'SHING (Build xatosini yo'qotadi)
export async function generateStaticParams() {
  try {
    // Backend'dan barcha yangiliklarni olamiz
    const res = await API.get('/news');
    const news = res.data;

    // Har bir yangilik uchun [id] parametrini qaytaramiz
    return news.map((post: any) => ({
      id: post.id.toString(), // id albatta string bo'lishi kerak
    }));
  } catch (error) {
    console.error("Build vaqtida yangiliklarni olishda xato:", error);
    return []; // Xato bo'lsa build to'xtab qolmasligi uchun bo'sh qaytaramiz
  }
}

// 2. Sahifa komponenti
export default function Page() {
  return <NewsListPage />;
}