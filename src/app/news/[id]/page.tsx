import NewsDetailPage from '@/components/NewsDetailPage/NewsDetailPage';
import { Metadata } from 'next';
import API from '@/api/axios';
import { cache } from 'react';

// 1. Ma'lumotlarni keshlaymiz (Metadata va Page bitta so'rovdan foydalanishi uchun)
const getNewsPost = cache(async (id: string) => {
  try {
    const res = await API.get(`/news/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
});

// 2. Build vaqtida barcha yangiliklar sahifalarini generatsiya qilish
export async function generateStaticParams() {
  try {
    const res = await API.get('/news');
    const news = Array.isArray(res.data) ? res.data : (res.data?.news || []);

    return news.map((post: any) => ({
      id: (post.slug || post.id).toString(),
    }));
  } catch (error) {
    console.error("Yangiliklarni build qilishda xato:", error);
    return [];
  }
}

// 3. SEO uchun Professional Ruscha Metadata
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const post = await getNewsPost(id);

  const fallbackMetadata: Metadata = {
    title: "Новости компании | UzAuto TRAILER — Официальный сайт",
    description: "Свежие новости, события и достижения завода UzAuto TRAILER. Будьте в курсе последних обновлений производства.",
    openGraph: {
      images: ['https://uzautotrailer.uz/news_seoimg.png'],
    }
  };

  if (!post) return fallbackMetadata;

  // Rasm yo'lini shakllantirish
  let imageUrl = 'https://uzautotrailer.uz/news_seoimg.png';
  if (post.image) {
    const cleanPath = post.image.replace(/^\//, '');
    imageUrl = cleanPath.startsWith('uploads/')
      ? `https://api.uzautotrailer.uz/${cleanPath}`
      : `https://api.uzautotrailer.uz/uploads/news/${cleanPath}`;
  }

  // Matnni tozalash (Ruscha matnga ustuvorlik beramiz)
  const title = post.titleRu || post.titleUz || "Новость";
  const content = post.contentRu || post.contentUz || "";
  const cleanDescription = content
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 160);

  const pageTitle = `${title} | Новости UzAuto TRAILER`;

  return {
    title: pageTitle,
    description: cleanDescription,
    alternates: {
      canonical: `https://uzautotrailer.uz/news/${id}`,
    },
    openGraph: {
      title: pageTitle,
      description: cleanDescription,
      url: `https://uzautotrailer.uz/news/${id}`,
      siteName: 'UzAuto TRAILER',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ru_RU',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: cleanDescription,
      images: [imageUrl],
    }
  };
}

// 4. Sahifa komponenti
export default function Page() {
  return <NewsDetailPage />;
}