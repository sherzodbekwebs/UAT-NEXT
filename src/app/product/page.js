import ProductsPage from "@/components/ProductsPage/ProductsPage";

// Buni page.js (Server Component) ichida yozasiz
export const metadata = {
  title: 'Mahsulotlar',
  description: 'UzAuto TRAILER mahsulotlari katalogi',
  keywords: 'trucks, trailers, Uzbekistan',
  openGraph: {
    title: 'Mahsulotlar | UzAuto TRAILER',
    description: 'Barcha turdagi tirkamalar',
    images: ['/uzbg1.png'],
  },
};

export default function Page() {
  return <ProductsPage />;
}