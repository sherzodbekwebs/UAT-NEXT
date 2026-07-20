// src/app/page.tsx
import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient'; // Boyagi yaratgan faylimiz

// MANA SHU YERDA SEO MA'LUMOTLARI BO'LADI
export const metadata: Metadata = {
  title: "UzAuto TRAILER - Yuk mashinalari va Pritseplar | Юк машиналари ва Прицеплар",
  description: "UzAuto TRAILER (UAT) – O'zbekistonda yuk mashinalari, pritseplar va yarim tirkamalar ishlab chiqaruvchi yetakchi zavod. Sifatli texnika va zamonaviy yechimlar.",
  keywords: "UzAuto TRAILER, yuk mashinalari, pritseplar, tirkamalar, samosval, юк машиналари, прицеплар, uat, uzauto",
  openGraph: {
    images: ['/uzbg1.png'],
  },
};

export default function Page() {
  // Bu yerda metadata serverda tayyorlanadi, 
  // HomeClient esa brauzerda interaktiv bo'limlarni ko'rsatadi
  return <HomeClient />;
}