'use client';

import React, { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SEO from './components/SEO'; 

// 🟢 DIQQAT: Papka va fayl nomlari sidebar'da qanday bo'lsa, aynan shunday yozing
// Masalan: Hero/Hero yoki Hero/hero. 
import Hero from './components/Hero/Hero'; 
import HomeMission from './components/HomeMission/HomeMission';
import ProductionStats from './components/ProductionStats/ProductionStats';
import CallCenter from './components/CallCenter/CallCenter';
import NewsSection from './components/NewsSection/NewsSection';
import Partners from './components/Partners/Partners';

const HomeScrollHandler = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Hash'ni useEffect ichida olish xavfsizroq
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        
        if (hash) {
            const id = hash.replace('#', '');
            const scrollToElement = () => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    return true;
                }
                return false;
            };

            // Agar element hali DOM'da yuklanmagan bo'lsa, bir necha bor urinib ko'radi
            if (!scrollToElement()) {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    if (scrollToElement() || attempts > 10) {
                        clearInterval(interval);
                    }
                }, 100);
            }
        } else {
            if (typeof window !== 'undefined') {
                window.scrollTo(0, 0);
            }
        }
    }, [pathname, searchParams]); // Hash o'zgarganda yoki sahifa almashganda ishlaydi

    return null;
};

const Home = ({ lang = 'ru' }) => {
    return (
        <>
            <Suspense fallback={null}>
                <HomeScrollHandler />
            </Suspense>

            {/* SEO mantiqi saqlab qolindi */}
            <SEO
                title="UzAuto TRAILER - Yuk mashinalari va Pritseplar | Юк машиналари ва Прицеплар"
                description="UzAuto TRAILER (UAT) – O'zbekistonda yuk mashinalari, pritseplar va yarim tirkamalar ishlab chiqaruvchi yetakchi zavod. Sifatli texnika va zamonaviy yechimlar."
                keywords="UzAuto TRAILER, yuk mashinalari, pritseplar, tirkamalar, samosval, uat, uzauto"
                image="/uzbg1.png"
            />

            <Hero lang={lang} />
            <HomeMission lang={lang} />
            <ProductionStats lang={lang} />
            <CallCenter lang={lang} />
            <NewsSection lang={lang} />
            <Partners lang={lang} />
        </>
    );
};

export default Home;