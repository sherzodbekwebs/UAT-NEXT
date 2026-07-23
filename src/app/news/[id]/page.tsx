import NewsDetailPage from '@/components/NewsDetailPage/NewsDetailPage'; 
import { Metadata } from 'next';
import API from '@/api/axios';

// 1. Build vaqtida barcha yangiliklar sahifalarini generatsiya qilish
export async function generateStaticParams() {
  try {
    const res = await API.get('/news'); 
    const news = res.data;
    return news.map((post: any) => ({
      // Agar URL'da yangilik nomi (slug) bo'lsa, post.slug deb o'zgartiring
      id: (post.slug || post.id).toString(), 
    }));
  } catch (error) {
    console.error("Yangiliklarni build qilishda xato:", error);
    return [];
  }
}

// 2. SEO uchun Dinamik Metadata (Telegramda rasm chiqishi uchun)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const fallbackMetadata: Metadata = {
    title: "Yangiliklar | UzAuto TRAILER",
    description: "UzAuto TRAILER kompaniyasining eng so'nggi yangiliklari va tadbirlari.",
    openGraph: {
        images: ['https://uzautotrailer.uz/Logo.png'],
    }
  };

  try {
    // Yangilik ma'lumotlarini olish
    const res = await API.get(`/news/${id}`); 
    const post = res.data;

    if (!post) return fallbackMetadata;

    // 🚀 RASM YO'LINI TO'G'RI SHAKLLANTIRISH:
    let imageUrl = 'https://uzautotrailer.uz/Logo.png';
    if (post.image) {
      const cleanPath = post.image.replace(/^\//, '');
      // Yangiliklar rasmi odatda 'uploads/news/' papkasida bo'ladi
      if (!cleanPath.startsWith('uploads/')) {
        imageUrl = `https://api.uzautotrailer.uz/uploads/news/${cleanPath}`;
      } else {
        imageUrl = `https://api.uzautotrailer.uz/${cleanPath}`;
      }
    }

    // HTML teglarni tozalash va qisqartirish
    const cleanDescription = (post.contentRu || post.contentUz || "")
      .replace(/<[^>]*>?/gm, '') 
      .substring(0, 160);

    return {
      title: `${post.titleRu || post.titleUz} | UzAuto TRAILER`,
      description: cleanDescription,
      openGraph: {
        title: `${post.titleRu || post.titleUz} | UzAuto TRAILER`,
        description: cleanDescription,
        url: `https://uzautotrailer.uz/news/${id}/`,
        siteName: 'UzAuto TRAILER',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.titleRu,
          },
        ],
        locale: 'ru_RU',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        images: [imageUrl],
      }
    };
  } catch (error) {
    return fallbackMetadata;
  }
}

// 3. Sahifa komponenti
export default function Page() {
    return <NewsDetailPage />;
}