import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage/ProductDetailPage';
import API from '@/api/axios';

export async function generateStaticParams() {
  try {
    const res = await API.get('/products'); 
    const products = res.data;

    return products.map((product: any) => ({
      // JUDA MUHIM: Bu yerda 'id' o'rniga mahsulotning slug'ini (nomini) qaytarish kerak
      // Chunki sizning saytingizda URL'lar mahsulot nomi bilan ochilyapti
      id: (product.slug || product.id).toString(), 
    }));
  } catch (error) {
    console.error("Mahsulotlarni build qilishda xato:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    // Agar id UUID (raqamli) bo'lsa bitta API, agar nom (slug) bo'lsa boshqa API'ga murojaat qiladi
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