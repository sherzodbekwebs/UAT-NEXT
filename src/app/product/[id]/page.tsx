import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage/ProductDetailPage';
import API from '@/api/axios';
import { cache } from 'react';

const SITE_URL = 'https://uzautotrailer.uz';
const API_BASE_URL = 'https://api.uzautotrailer.uz';

// 1. Ma'lumotlarni keshlaymiz (API so'rovni optimallashtirish uchun)
const getProductData = cache(async (id: string) => {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isNumeric = /^\d+$/.test(id);
    const fetchUrl = (isUuid || isNumeric) ? `/products/${id}` : `/products/detail/${id}`;
    
    const res = await API.get(fetchUrl);
    return res.data?.data || res.data;
  } catch (e) {
    return null;
  }
});

const cleanText = (text: string, length: number) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, length);
};

// 2. generateStaticParams - Build vaqtida barcha sahifalarni yaratish
export async function generateStaticParams() {
  try {
    const res = await API.get('/products');
    const products = Array.isArray(res.data) ? res.data : (res.data?.products || []);

    const paths: { id: string }[] = [];
    products.forEach((product: any) => {
      if (product.id) paths.push({ id: product.id.toString() });
      if (product.slug) paths.push({ id: product.slug.toString() });
    });
    return paths;
  } catch (error) {
    return [];
  }
}

// 3. generateMetadata (Professional Ruscha SEO)
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id?.replace(/\/$/, '') || '';

  const product = await getProductData(id);

  if (!product) return { title: 'Продукт не найден | UzAuto TRAILER' };

  // Ruscha sarlavhani birinchi navbatga qo'yamiz va tijoriy qo'shimchalar qo'shamiz
  const productName = product.titleRu || product.titleUz || 'Спецтехника';
  const pageTitle = `${productName} — Купить в Узбекистане, цена и характеристики | UzAuto TRAILER`;
  
  const cleanDescription = cleanText(product.contentRu || product.contentUz, 160);
  
  const imagePath = product.image ? product.image.replace(/^\//, '') : '';
  const imageUrl = imagePath 
    ? (imagePath.startsWith('uploads/') ? `${API_BASE_URL}/${imagePath}` : `${API_BASE_URL}/uploads/products/${imagePath}`)
    : `${SITE_URL}/Logo.png`;

  // Asosiy SEO linki (Slug bilan va slashsiz)
  const canonicalUrl = `${SITE_URL}/product/${product.slug || product.id}`;

  return {
    title: pageTitle,
    description: cleanDescription,
    keywords: [
      productName, 
      'купить спецтехнику', 
      'цена в Ташкенте', 
      'технические характеристики', 
      'UzAuto TRAILER', 
      'продажа грузовиков'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'UzAuto TRAILER',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: productName }],
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: cleanDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 4. Page Komponenti + JSON-LD (Google Rich Snippets)
export default async function Page(props: any) {
  const params = await props.params;
  const productData = await getProductData(params?.id);

  const jsonLd = productData ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.titleRu || productData.titleUz,
    image: productData.image ? `${API_BASE_URL}/${productData.image.replace(/^\//, '')}` : `${SITE_URL}/Logo.png`,
    description: cleanText(productData.contentRu || productData.contentUz, 200),
    brand: {
      '@type': 'Brand',
      name: 'UzAuto TRAILER'
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${productData.slug || productData.id}`,
      priceCurrency: 'UZS',
      availability: 'https://schema.org/InStock',
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailPage />
    </>
  );
}