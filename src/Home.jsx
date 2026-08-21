'use client';

import React, { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script'; // 🟢 Script komponentini import qildik
import SEO from './components/SEO';

// 🟢 Komponentlar importi
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
    }, [pathname, searchParams]);

    return null;
};

const Home = ({ lang = 'ru' }) => {
    const chatbotId = "jW72KvBd2BQJgDQe98Jcv";

    return (
        <>
            <Suspense fallback={null}>
                <HomeScrollHandler />
            </Suspense>

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

            {/* 🔵 CHAT AI BOT - ENG TO'G'RI VARIANT */}
            <Script id="chatbase-init" strategy="afterInteractive">
                {`
                (function(){
                    if(!window.chatbase || window.chatbase("getState") !== "initialized"){
                        window.chatbase = (...arguments) => {
                            if(!window.chatbase.q){window.chatbase.q=[]}
                            window.chatbase.q.push(arguments)
                        };
                        window.chatbase = new Proxy(window.chatbase, {
                            get(target, prop){
                                if(prop === "q"){return target.q}
                                return (...args) => target(prop, ...args)
                            }
                        })
                    }
                    window.embeddedChatbotConfig = {
                        chatbotId: "${chatbotId}",
                        domain: "www.chatbase.co"
                    }
                })()
                `}
            </Script>
            <Script
                src="https://www.chatbase.co/embed.min.js"
                id={chatbotId}
                domain="www.chatbase.co"
                strategy="afterInteractive"
                defer
            />
        </>
    );
};

export default Home;