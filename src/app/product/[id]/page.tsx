import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage/ProductDetailPage';
import API from '@/api/axios';

// 1. BU FUNKSIYANI QO'SHING (Xatoni yo'qotadi)
export async function generateStaticParams() {
  try {
    // Backenddan hamma mahsulotlar ro'yxatini olamiz
    const res = await API.get('/products'); 
    const products = res.data;

    // Har bir mahsulot uchun ID qaytaramiz (albatta string bo'lishi kerak)
    return products.map((product: any) => ({
      id: product.id.toString(), 
    }));
  } catch (error) {
    console.error("Mahsulotlarni build qilishda xato:", error);
    return []; // Xato bo'lsa build to'xtab qolmasligi uchun
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const fetchUrl = isUuid ? `/products/${id}` : `/products/detail/${id}`;
    const res = await API.get(fetchUrl);
    const product = res.data;

    return {
      title: `${product.titleRu || product.titleUz} | UzAuto TRAILER`,
      description: product.contentRu || product.contentUz,
      openGraph: {
        images: [product.image ? `https://api.uzautotrailer.uz/${product.image}` : ''],
      },
    };
  } catch {
    return { title: 'Mahsulot | UzAuto TRAILER' };
  }
}

export default function Page() {
  return <ProductDetailPage />;
}