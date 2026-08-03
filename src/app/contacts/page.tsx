import { Metadata } from 'next';
import ContactsClient from './ContactsClient';

// Professional Ruscha SEO Metadata
export const metadata: Metadata = {
  title: 'Контакты и адреса заводов | UzAuto TRAILER — Официальный сайт',
  description: 'Свяжитесь с UzAuto TRAILER для заказа прицепов и спецтехники. Адреса головного офиса в Ташкенте и производства в Самарканде, номера телефонов call-центра и график работы.',
  keywords: [
    'UzAuto TRAILER контакты', 
    'адрес завода UzAuto TRAILER', 
    'купить прицепы в Ташкенте', 
    'спецтехника Узбекистан', 
    'телефон UzAuto TRAILER',
    'производство полуприцепов Самарканд'
  ],
  alternates: {
    canonical: 'https://uzautotrailer.uz/contacts',
  },
  openGraph: {
    title: 'Контакты UzAuto TRAILER — Наши офисы и производственные базы',
    description: 'Мы всегда на связи. Найдите наши адреса в Ташкенте и Самарканде или позвоните в единый call-центр.',
    url: 'https://uzautotrailer.uz/contacts',
    siteName: 'UzAuto TRAILER',
    images: [
      {
        url: 'https://uzautotrailer.uz/kontact_img.png', // Ijtimoiy tarmoqlar uchun rasm
        width: 1200,
        height: 630,
        alt: 'UzAuto TRAILER Контакты',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты UzAuto TRAILER',
    description: 'Адреса и телефоны официального производителя спецтехники в Узбекистане.',
    images: ['https://uzautotrailer.uz/kontact_img.png'],
  },
};

export default function ContactsPage() {
  return <ContactsClient />;
}