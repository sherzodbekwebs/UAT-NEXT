'use client';

import dynamic from 'next/dynamic';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { LanguageProvider } from '../context/LanguageContext';

// Komponentlarni dinamik yuklash (Hydration xatolarini oldini oladi)
const Navbar = dynamic(() => import('./Navbar/navbar'), { ssr: false });
const Footer = dynamic(() => import('./Footer/Footer'), { ssr: false });
const ContactModal = dynamic(() => import('./ContactModal/ContactModal'), { ssr: false });
const ScrollToTop = dynamic(() => import('./ScrollToTop/ScrollToTop'), { ssr: false });

export default function AppShell({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30, // 🟢 cacheTime nomi gcTime ga o'zgargan (v5+)
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <div className="flex min-h-screen flex-col font-inter">
            <Navbar />
            {/* 🟢 Main ichida kontent Navbar ostida qolib ketmasligi uchun paddinglar to'g'ri qo'yilgan */}
            <main className="flex-grow pt-16 lg:pt-20">
              {children}
            </main>
            <Footer />
            <ContactModal />
            <ScrollToTop />
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}