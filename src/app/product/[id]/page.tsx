import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage/ProductDetailPage';
import API from '@/api/axios';

export async function generateStaticParams() {
  try {
    const res = await API.get('/products');
    const products = res.data;

    return products.map((product: any) => ({
      id: (product.slug || product.id).toString(),
    }));
  } catch (error) {
    console.error("Mahsulotlarni build qilishda xato:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // 1. Zaxira metadata (Agar API ishlamay qolsa yoki xato bo'lsa shu chiqadi)
  const fallbackMetadata: Metadata = {
    title: 'Mahsulotlar | UzAuto TRAILER',
    description: 'UzAuto TRAILER kompaniyasining yuqori sifatli mahsulotlari va maxsus texnikalari.',
    openGraph: {
      images: ['https://uzautotrailer.uz/Logo.png'],
    }
  };

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const fetchUrl = isUuid ? `/products/${id}` : `/products/detail/${id}`;
    const res = await API.get(fetchUrl);
    const product = res.data;

    if (!product) return fallbackMetadata;

    // 2. 🚀 RASM YO'LINI TO'G'RI SHAKLLANTIRISH (Siz aytgan formatga mos):
    let imageUrl = 'https://uzautotrailer.uz/Logo.png'; // Agar rasm bo'lmasa logotip chiqadi

    if (product.image) {
      const cleanPath = product.image.replace(/^\//, ''); // Boshidagi slashni olib tashlaymiz
      
      // Agar backend rasm yo'lini to'liq bermasa (faqat nomini bersa):
      if (!cleanPath.startsWith('uploads/')) {
        imageUrl = `https://api.uzautotrailer.uz/uploads/products/${cleanPath}`;
      } else {
        imageUrl = `https://api.uzautotrailer.uz/${cleanPath}`;
      }
    }

    // 3. Tavsifni HTML teglardan tozalash va qisqartirish
    const cleanDescription = (product.contentRu || product.contentUz || "")
      .replace(/<[^>]*>?/gm, '') // HTML teglarni o'chiradi
      .substring(0, 160);

    return {
      title: `${product.titleRu || product.titleUz} | UzAuto TRAILER`,
      description: cleanDescription,
      openGraph: {
        title: `${product.titleRu || product.titleUz} | UzAuto TRAILER`,
        description: cleanDescription,
        url: `https://uzautotrailer.uz/product/${id}/`,
        siteName: 'UzAuto TRAILER',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.titleRu || 'UzAuto TRAILER product',
          },
        ],
        locale: 'ru_RU',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.titleRu || product.titleUz} | UzAuto TRAILER`,
        description: cleanDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Metadata xatosi:", error);
    return fallbackMetadata;
  }
}

export default function Page() {
  return <ProductDetailPage />;
}