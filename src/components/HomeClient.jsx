// src/components/HomeClient.jsx
"use client"; // Bu faylda interaktiv mantiq bo'ladi

import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Komponentlarni import qilamiz
import Hero from '@/components/Hero/hero';
import HomeMission from '@/components/HomeMission/HomeMission';
import ProductionStats from '@/components/ProductionStats/ProductionStats';
import CallCenter from '@/components/CallCenter/CallCenter';
import NewsSection from '@/components/NewsSection/NewsSection';
import Partners from '@/components/Partners/Partners';

export default function HomeClient() {
    const { lang } = useLanguage();

    useEffect(() => {
        // Eski kodingizdagi scroll mantiqi
        if (typeof window !== 'undefined' && window.location.hash) {
            const id = window.location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <>
            <Hero lang={lang} />
            <HomeMission lang={lang} />
            <ProductionStats lang={lang} />
            <CallCenter lang={lang} />
            <NewsSection lang={lang} />
            <Partners lang={lang} />
        </>
    );
}