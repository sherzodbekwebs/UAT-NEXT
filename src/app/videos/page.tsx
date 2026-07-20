import VideosPage from '@/components/Videos/VideosPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Videoroliklar | UzAuto TRAILER",
  description: "UzAuto TRAILER zavodi, mahsulotlar va ishlab chiqarish jarayonlari haqidagi so'nggi videolarni tomosha qiling.",
};

export default function Page() {
  return <VideosPage />;
}