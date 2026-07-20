import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage/ProductDetailPage';
import API from '@/api/axios';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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