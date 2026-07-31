import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage/ProductDetailPage';
import API from '@/api/axios';

// --- Yordamchi funksiyalar ---
const SITE_URL = 'https://uzautotrailer.uz';
const API_BASE_URL = 'https://api.uzautotrailer.uz';

const cleanText = (text: string, length: number) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '') // HTML teglarni o'chirish
    .replace(/\s+/g, ' ')      // Ortiqcha bo'shliqlarni bittaga tushirish
    .trim()
    .substring(0, length);
};

// 1. generateStaticParams
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

// 2. generateMetadata (SEO Professional)
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const rawId = params?.id || '';
  const id = rawId.replace(/\/$/, '');

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isNumeric = /^\d+$/.test(id);
    const fetchUrl = (isUuid || isNumeric) ? `/products/${id}` : `/products/detail/${id}`;
    
    const res = await API.get(fetchUrl);
    const product = res.data?.data || res.data;

    if (!product) return { title: 'Mahsulot topilmadi | UzAuto TRAILER' };

    const title = `${product.titleRu || product.titleUz} | UzAuto TRAILER`;
    const description = cleanText(product.contentRu || product.contentUz, 160);
    
    // Rasm yo'li
    const imagePath = product.image ? product.image.replace(/^\//, '') : '';
    const imageUrl = imagePath 
      ? (imagePath.startsWith('uploads/') ? `${API_BASE_URL}/${imagePath}` : `${API_BASE_URL}/uploads/products/${imagePath}`)
      : `${SITE_URL}/Logo.png`;

    // Asosiy URL (SEO uchun juda muhim: Canonical)
    // Agar foydalanuvchi ID bilan kirsa ham, qidiruv tizimi Slug-ni asosiy deb biladi
    const canonicalUrl = `${SITE_URL}/product/${product.slug || product.id}/`;

    return {
      title: title,
      description: description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: title,
        description: description,
        url: canonicalUrl,
        siteName: 'UzAuto TRAILER',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.titleRu || product.titleUz,
          },
        ],
        locale: 'ru_RU',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    return { title: 'UzAuto TRAILER' };
  }
}

// 3. Page Komponenti + JSON-LD Structured Data
export default async function Page(props: any) {
  const params = await props.params;
  const id = params?.id;

  // Mahsulot ma'lumotlarini JSON-LD skripti uchun qayta olamiz
  let productData = null;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const fetchUrl = (isUuid || /^\d+$/.test(id)) ? `/products/${id}` : `/products/detail/${id}`;
    const res = await API.get(fetchUrl);
    productData = res.data?.data || res.data;
  } catch (e) {}

  // Google uchun Structured Data (Schema.org)
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
      url: `${SITE_URL}/product/${productData.slug || productData.id}/`,
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