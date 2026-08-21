// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
// import { Helmet } from 'react-helmet-async';
// import { useQuery } from '@tanstack/react-query';
// import API, { API_URL } from '../../api/axios';
// import staticslayd from '../../../public/staticslayder.webp';

// const translations = {
//     uz: {
//         seoTitle: "UzAuto TRAILER — Yarim tirkamalar va maxsus texnikalar ishlab chiqaruvchisi",
//         metaDesc: "UzAuto TRAILER — O‘zbekistondagi og‘ir yuk tashish sanoatida ishonchli hamkor.",
//         catalogBtn: "Katalog",
//         contactBtn: "Aloqa",
//         description: "UzAuto TRAILER — og'ir yuk tashish sanoatida ishonchli hamkoringiz.\nBiz kuch va innovatsiyani birlashtiramiz.",
//         titles: [
//             "UzAuto TRAILER\nYo'llardan bir qadam oldinda",
//             "Katta vazifalar uchun muhandislik quvvati",
//             "Yo'llar ishonadigan yuk texnikasi",
//             "Logistikangizning ishonchli poydevori",
//             "Biznesni oldinga boshlaymiz",
//             "Sizning yo'lingiz — bizning texnologiyalar",
//             "Biznesingiz imkoniyatlarini kengaytiramiz",
//             "Harakatdagi kuch",
//             "UzAuto TRAILER\nSifat va ishonch",
//             "Logistika energiyasi. Texnologiyalar quvvati",
//             "Barcha yo'llar uchun texnika"
//         ]
//     },
//     ru: {
//         seoTitle: "UzAuto TRAILER — Производитель полуприцепов и спецтехники в Узбекистане",
//         metaDesc: "UzAuto TRAILER — ваш надежный партнер в индустрии большегрузных перевозок.",
//         catalogBtn: "Каталог",
//         contactBtn: "Контакты",
//         description: "UzAuto TRAILER — ваш надежный партнер в индустрии большегрузных перевозок.\nМы объединяем силу и инновации.",
//         titles: [
//             "UzAuto TRAILER\nНа шаг впереди дорог",
//             "Инженерная мощь для больших задач",
//             "Грузовая техника, которой доверяют дороги",
//             "Надежный фундамент вашей логистики",
//             "Двигаем бизнес вперед",
//             "Ваш путь — наши технологии",
//             "Масштабируем возможности вашего бизнеса",
//             "Сила в движении",
//             "UzAuto TRAILER\nКачество и надежность",
//             "Энергия логистики. Мощь технологий",
//             "Техника для любых дорог"
//         ]
//     },
//     en: {
//         seoTitle: "UzAuto TRAILER — Semi-trailers Manufacturer",
//         metaDesc: "UzAuto TRAILER is a leading manufacturer of high-quality equipment.",
//         catalogBtn: "Catalog",
//         contactBtn: "Contact",
//         description: "UzAuto TRAILER is your reliable partner in the heavy haulage industry.\nWe combine strength and innovation.",
//         titles: [
//             "UzAuto TRAILER\nOne step ahead of the roads",
//             "Engineering power for big tasks",
//             "Heavy equipment that roads trust",
//             "A reliable foundation for your logistics",
//             "Moving business forward",
//             "Your way — our technologies",
//             "Scaling your business opportunities",
//             "Power in motion",
//             "UzAuto TRAILER\nQuality and Reliability",
//             "Logistics energy. Power of technology",
//             "Equipment for all roads"
//         ]
//     }
// };

// const Hero = ({ lang = 'ru' }) => {
//     const t = translations[lang] || translations.ru;

//     const { data: bgImages = [], isLoading: queryLoading } = useQuery({
//         queryKey: ['sliders'],
//         queryFn: async () => {
//             if (!API_URL) return [];
//             try {
//                 const res = await API.get('/sliders');
//                 return res?.data?.filter(item => item?.isActive !== false) || [];
//             } catch (error) { return []; }
//         },
//         staleTime: 1000 * 60 * 10,
//     });

//     const [current, setCurrent] = useState(0);
//     const [isDragging, setIsDragging] = useState(false);
//     const [transitionEnabled, setTransitionEnabled] = useState(false);
//     const [firstLoad, setFirstLoad] = useState(true);
//     const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);

//     const slides = useMemo(() => {
//         if (bgImages.length === 0) return [];
//         return [...bgImages, ...bgImages, ...bgImages];
//     }, [bgImages]);

//     useEffect(() => {
//         if (bgImages.length > 0 && current === 0) setCurrent(bgImages.length);
//     }, [bgImages, current]);

//     const getFullImagePath = (img) => {
//         const rawValue = typeof img === 'string' ? img : img?.image || img?.url || '';
//         if (!rawValue) return staticslayd.src;
//         return `${API_URL.replace(/\/$/, '')}/${rawValue.replace(/^\//, '')}`;
//     };

//     useEffect(() => {
//         if (!queryLoading) {
//             setTimeout(() => { setTransitionEnabled(true); setFirstLoad(false); }, 50);
//         }
//     }, [queryLoading]);

//     useEffect(() => {
//         if (bgImages.length <= 1 || isDragging || queryLoading || !transitionEnabled) return;
//         const timer = setInterval(() => setCurrent(prev => prev + 1), 7000);
//         return () => clearInterval(timer);
//     }, [current, isDragging, bgImages, queryLoading, transitionEnabled]);

//     const nextSlide = () => { if (transitionEnabled) setCurrent(prev => prev + 1); };
//     const prevSlide = () => { if (transitionEnabled) setCurrent(prev => prev - 1); };

//     const handleUpdate = () => {
//         if (current >= bgImages.length * 2) {
//             setTransitionEnabled(false);
//             setCurrent(current - bgImages.length);
//         } else if (current < bgImages.length) {
//             setTransitionEnabled(false);
//             setCurrent(current + bgImages.length);
//         }
//     };

//     useEffect(() => {
//         if (!transitionEnabled && !queryLoading) setTimeout(() => setTransitionEnabled(true), 20);
//     }, [transitionEnabled, queryLoading]);

//     const currentTitle = useMemo(() => {
//         if (bgImages.length === 0) return t.titles[0];
//         return t.titles[(current % bgImages.length) % t.titles.length];
//     }, [current, bgImages.length, t]);

//     return (
//         // 1. Endi barcha ekranlarda (mobil, planshet, desktop) to'liq ekran balandligi.
//         // h-[100svh] mobil brauzerlarning manzil panelidan kelib chiqadigan
//         // sakrashlarni oldini oladi, h-screen esa fallback sifatida qoldirilgan.
//         <section className="relative w-full h-screen h-[100svh] overflow-hidden bg-[#050505] font-roboto">
//             <Helmet>
//                 <title>{t.seoTitle}</title>
//                 <meta name="description" content={t.metaDesc} />
//             </Helmet>

//             {/* BACKGROUND SLIDER — har doim to'liq orqa fonda */}
//             <div className="absolute inset-0 z-10 overflow-hidden cursor-grab active:cursor-grabbing">
//                 <AnimatePresence>
//                     {(!isFirstImageLoaded || queryLoading) && (
//                         <motion.div exit={{ opacity: 0 }} className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a]">
//                             <img src={staticslayd.src} alt="" className="w-full h-full object-cover object-[80%_center]" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent z-10" />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {bgImages.length > 0 && (
//                     <motion.div
//                         drag="x"
//                         dragMomentum={false}
//                         onDragStart={() => setIsDragging(true)}
//                         onDragEnd={(e, info) => {
//                             setIsDragging(false);
//                             if (info.offset.x < -40) nextSlide();
//                             else if (info.offset.x > 40) prevSlide();
//                         }}
//                         animate={{ x: `-${current * 100}%` }}
//                         onAnimationComplete={handleUpdate}
//                         transition={transitionEnabled ? { type: "spring", bounce: 0, duration: 0.7 } : { duration: 0 }}
//                         className="flex h-full w-full"
//                     >
//                         {slides.map((img, idx) => (
//                             <div key={idx} className="relative h-full w-full shrink-0">
//                                 {/* Matn yaxshi o'qilishi uchun gradient kuchaytirilgan */}
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent z-10" />
//                                 <img
//                                     src={getFullImagePath(img)}
//                                     alt="UzAuto Trailer"
//                                     onLoad={() => { if (idx === current) setIsFirstImageLoaded(true); }}
//                                     className="w-full h-full object-cover object-[80%_center] lg:object-[75%_center] pointer-events-none select-none"
//                                 />
//                             </div>
//                         ))}
//                     </motion.div>
//                 )}
//             </div>

//             {/* 2. CONTENT — negative margin "hack" olib tashlandi.
//                 Endi flex + justify-center orqali haqiqiy vertikal markazga joylashadi. */}
//             <div className="relative z-20 h-full w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left pointer-events-none">
//                 <div className="max-w-4xl pointer-events-auto w-full px-4 sm:px-14 lg:px-0">
//                     <div className="min-h-[90px] lg:min-h-0 flex items-center lg:items-start justify-center lg:justify-start">
//                         <AnimatePresence mode="wait">
//                             <motion.h1
//                                 key={currentTitle}
//                                 initial={{ opacity: 0, y: 15 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -15 }}
//                                 transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
//                                 className="text-[26px] sm:text-4xl lg:text-[56px] font-black text-white leading-[1.1] mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,1)] whitespace-pre-line"
//                             >
//                                 {currentTitle}
//                             </motion.h1>
//                         </AnimatePresence>
//                     </div>

//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="text-[13px] lg:text-xl text-white/90 font-medium leading-relaxed mt-2 mb-8 lg:mb-12 drop-shadow-lg mx-auto lg:mx-0 whitespace-pre-line"
//                     >
//                         {t.description}
//                     </motion.p>

//                     <div className="flex flex-row items-center justify-center lg:justify-start gap-4">
//                         <Link
//                             href="/products"
//                             className="group flex-1 sm:flex-none min-w-[140px] sm:min-w-[190px] bg-[#0061A4] hover:bg-blue-600 text-white px-4 sm:px-12 py-3.5 sm:py-4 rounded-sm font-bold transition-all text-[12px] tracking-widest shadow-2xl uppercase flex items-center justify-center gap-2"
//                         >
//                             {t.catalogBtn}
//                             <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//                         </Link>
//                         <Link href="/contacts" className="flex-1 sm:flex-none min-w-[140px] sm:min-w-[190px] bg-white hover:bg-gray-100 text-[#0061A4] px-4 sm:px-12 py-3.5 sm:py-4 rounded-sm font-bold transition-all text-[12px] tracking-widest shadow-2xl uppercase flex items-center justify-center">
//                             {t.contactBtn}
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             {/* NAV TUGMALARI (PASTKI O'NGDA) */}
//             {bgImages.length > 1 && (
//                 <div className="absolute bottom-6 lg:bottom-12 right-6 lg:right-12 z-40 flex gap-4 pointer-events-none">
//                     <button onClick={prevSlide} aria-label="Oldingi slayd" className="w-10 h-10 lg:w-14 lg:h-14 border border-white/20 rounded-full flex items-center justify-center text-white bg-black/40 hover:bg-[#0061A4] backdrop-blur-md transition-all active:scale-90 shadow-2xl pointer-events-auto group">
//                         <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
//                     </button>
//                     <button onClick={nextSlide} aria-label="Keyingi slayd" className="w-10 h-10 lg:w-14 lg:h-14 border border-white/20 rounded-full flex items-center justify-center text-white bg-black/40 hover:bg-[#0061A4] backdrop-blur-md transition-all active:scale-90 shadow-2xl pointer-events-auto group">
//                         <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
//                     </button>
//                 </div>
//             )}

//             {/* DOTS (PASTKI CHAPDA) */}
//             {bgImages.length > 1 && (
//                 <div className="absolute bottom-10 lg:bottom-16 left-6 lg:left-12 z-40 flex justify-start pointer-events-none">
//                     <div className="flex gap-2 pointer-events-auto">
//                         {bgImages.map((_, idx) => (
//                             <div
//                                 key={idx}
//                                 onClick={() => { if (transitionEnabled) setCurrent(idx + bgImages.length); }}
//                                 className={`cursor-pointer transition-all duration-500 rounded-full ${idx === current % bgImages.length
//                                         ? 'w-10 lg:w-20 h-[4px] bg-[#0061A4]'
//                                         : 'w-4 lg:w-8 h-[2px] bg-white/20'
//                                     }`}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };

// export default Hero;










'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import API, { API_URL } from '../../api/axios';
import staticslayd from '../../../public/staticslayder.webp';

const AUTOPLAY_MS = 7000;

const translations = {
    uz: {
        seoTitle: "UzAuto TRAILER — Yarim tirkamalar va maxsus texnikalar ishlab chiqaruvchisi",
        metaDesc: "UzAuto TRAILER — O‘zbekistondagi og‘ir yuk tashish sanoatida ishonchli hamkor.",
        eyebrow: "OG'IR YUK TASHISH SANOATI",
        catalogBtn: "Katalog",
        contactBtn: "Aloqa",
        description: "UzAuto TRAILER — og'ir yuk tashish sanoatida ishonchli hamkoringiz.\nBiz kuch va innovatsiyani birlashtiramiz.",
        titles: [
            "UzAuto TRAILER\nYo'llardan bir qadam oldinda",
            "Katta vazifalar uchun muhandislik quvvati",
            "Yo'llar ishonadigan yuk texnikasi",
            "Logistikangizning ishonchli poydevori",
            "Biznesni oldinga boshlaymiz",
            "Sizning yo'lingiz — bizning texnologiyalar",
            "Biznesingiz imkoniyatlarini kengaytiramiz",
            "Harakatdagi kuch",
            "UzAuto TRAILER\nSifat va ishonch",
            "Logistika energiyasi. Texnologiyalar quvvati",
            "Barcha yo'llar uchun texnika"
        ]
    },
    ru: {
        seoTitle: "UzAuto TRAILER — Производитель полуприцепов и спецтехники в Узбекистане",
        metaDesc: "UzAuto TRAILER — ваш надежный партнер в индустрии большегрузных перевозок.",
        eyebrow: "ИНДУСТРИЯ ТЯЖЁЛЫХ ГРУЗОПЕРЕВОЗОК",
        catalogBtn: "Каталог",
        contactBtn: "Контакты",
        description: "UzAuto TRAILER — ваш надежный партнер в индустрии большегрузных перевозок.\nМы объединяем силу и инновации.",
        titles: [
            "UzAuto TRAILER\nНа шаг впереди дорог",
            "Инженерная мощь для больших задач",
            "Грузовая техника, которой доверяют дороги",
            "Надежный фундамент вашей логистики",
            "Двигаем бизнес вперед",
            "Ваш путь — наши технологии",
            "Масштабируем возможности вашего бизнеса",
            "Сила в движении",
            "UzAuto TRAILER\nКачество и надежность",
            "Энергия логистики. Мощь технологий",
            "Техника для любых дорог"
        ]
    },
    en: {
        seoTitle: "UzAuto TRAILER — Semi-trailers Manufacturer",
        metaDesc: "UzAuto TRAILER is a leading manufacturer of high-quality equipment.",
        eyebrow: "HEAVY HAULAGE INDUSTRY",
        catalogBtn: "Catalog",
        contactBtn: "Contact",
        description: "UzAuto TRAILER is your reliable partner in the heavy haulage industry.\nWe combine strength and innovation.",
        titles: [
            "UzAuto TRAILER\nOne step ahead of the roads",
            "Engineering power for big tasks",
            "Heavy equipment that roads trust",
            "A reliable foundation for your logistics",
            "Moving business forward",
            "Your way — our technologies",
            "Scaling your business opportunities",
            "Power in motion",
            "UzAuto TRAILER\nQuality and Reliability",
            "Logistics energy. Power of technology",
            "Equipment for all roads"
        ]
    }
};

const Hero = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    const { data: bgImages = [], isLoading: queryLoading } = useQuery({
        queryKey: ['sliders'],
        queryFn: async () => {
            if (!API_URL) return [];
            try {
                const res = await API.get('/sliders');
                return res?.data?.filter(item => item?.isActive !== false) || [];
            } catch (error) { return []; }
        },
        staleTime: 1000 * 60 * 10,
    });

    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [transitionEnabled, setTransitionEnabled] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);

    const slides = useMemo(() => {
        if (bgImages.length === 0) return [];
        return [...bgImages, ...bgImages, ...bgImages];
    }, [bgImages]);

    useEffect(() => {
        if (bgImages.length > 0 && current === 0) setCurrent(bgImages.length);
    }, [bgImages, current]);

    const getFullImagePath = (img) => {
        const rawValue = typeof img === 'string' ? img : img?.image || img?.url || '';
        if (!rawValue) return staticslayd.src;
        return `${API_URL.replace(/\/$/, '')}/${rawValue.replace(/^\//, '')}`;
    };

    useEffect(() => {
        if (!queryLoading) {
            setTimeout(() => { setTransitionEnabled(true); setFirstLoad(false); }, 50);
        }
    }, [queryLoading]);

    useEffect(() => {
        if (bgImages.length <= 1 || isDragging || queryLoading || !transitionEnabled) return;
        const timer = setInterval(() => setCurrent(prev => prev + 1), AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [current, isDragging, bgImages, queryLoading, transitionEnabled]);

    const nextSlide = () => { if (transitionEnabled) setCurrent(prev => prev + 1); };
    const prevSlide = () => { if (transitionEnabled) setCurrent(prev => prev - 1); };

    const handleUpdate = () => {
        if (current >= bgImages.length * 2) {
            setTransitionEnabled(false);
            setCurrent(current - bgImages.length);
        } else if (current < bgImages.length) {
            setTransitionEnabled(false);
            setCurrent(current + bgImages.length);
        }
    };

    useEffect(() => {
        if (!transitionEnabled && !queryLoading) setTimeout(() => setTransitionEnabled(true), 20);
    }, [transitionEnabled, queryLoading]);

    const activeIndex = bgImages.length > 0 ? current % bgImages.length : 0;

    const currentTitle = useMemo(() => {
        if (bgImages.length === 0) return t.titles[0];
        return t.titles[activeIndex % t.titles.length];
    }, [activeIndex, bgImages.length, t]);

    const slideNumber = String(activeIndex + 1).padStart(2, '0');
    const slideTotal = String(Math.max(bgImages.length, 1)).padStart(2, '0');

    return (
        <section className="relative w-full flex flex-col lg:h-screen lg:block overflow-hidden bg-[#050505] font-roboto">
            <Helmet>
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.metaDesc} />
            </Helmet>

            {/* BACKGROUND SLIDER */}
            <div className="relative w-full aspect-video sm:aspect-[16/8] lg:aspect-auto lg:h-full lg:absolute lg:inset-0 z-10 overflow-hidden cursor-grab active:cursor-grabbing">
                <AnimatePresence>
                    {(!isFirstImageLoaded || queryLoading) && (
                        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a]">
                            <img src={staticslayd.src} alt="" className="w-full h-full object-cover object-[80%_center]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-black/75 lg:via-black/35 lg:to-black/10 z-10" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {bgImages.length > 0 && (
                    <motion.div
                        drag="x"
                        dragMomentum={false}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={(e, info) => {
                            setIsDragging(false);
                            if (info.offset.x < -40) nextSlide();
                            else if (info.offset.x > 40) prevSlide();
                        }}
                        animate={{ x: `-${current * 100}%` }}
                        onAnimationComplete={handleUpdate}
                        transition={transitionEnabled ? { type: "spring", bounce: 0, duration: 0.7 } : { duration: 0 }}
                        className="flex h-full w-full"
                    >
                        {slides.map((img, idx) => (
                            <div key={idx} className="relative h-full w-full shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-black/75 lg:via-black/35 lg:to-black/10 z-10" />
                                <img
                                    src={getFullImagePath(img)}
                                    alt="UzAuto Trailer"
                                    onLoad={() => { if (idx === current) setIsFirstImageLoaded(true); }}
                                    className="w-full h-full object-cover object-[80%_center] lg:object-[75%_center] pointer-events-none select-none"
                                />
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* fine vignette for depth + legibility */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.35),transparent_60%)]" />
            </div>

            {/* CONTENT */}
            <div className="relative z-20 -mt-12 sm:-mt-36 lg:mt-0 lg:h-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col justify-start lg:justify-center items-center lg:items-start text-center lg:text-left bg-transparent pt-4 lg:pt-0 pb-24 lg:pb-0 pointer-events-none">
                <div className="max-w-4xl pointer-events-auto w-full px-4 sm:px-14 lg:px-0">

                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden sm:flex items-center gap-3 mb-5 justify-center lg:justify-start"
                    >
                        {/* <span className="h-px w-8 bg-gradient-to-r from-[#0061A4] to-[#5CC2FF]" /> */}
                        {/* <span className="text-[11px] lg:text-xs font-bold tracking-[0.28em] text-white/70 uppercase">
                            {t.eyebrow}
                        </span> */}
                    </motion.div>

                    <div className="min-h-[90px] lg:min-h-0 flex items-center lg:items-start justify-center lg:justify-start">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentTitle}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[22px] sm:text-4xl lg:text-[52px] font-black text-white leading-[1.12] tracking-[-0.01em] mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] whitespace-pre-line"
                            >
                                {currentTitle}
                            </motion.h1>
                        </AnimatePresence>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[13px] lg:text-lg text-white/80 font-normal leading-relaxed mt-2 mb-8 lg:mb-12 mx-auto lg:mx-0 whitespace-pre-line max-w-xl"
                    >
                        {t.description}
                    </motion.p>

                    <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                        <Link
                            href="/products"
                            className="group flex-1 sm:flex-none min-w-[140px] sm:min-w-[200px] bg-[#0061A4] hover:bg-[#0072BF] text-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-sm font-bold transition-all duration-300 text-[12px] tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,97,164,0.35)]"
                        >
                            {t.catalogBtn}
                            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                        <Link
                            href="/contacts"
                            className="flex-1 sm:flex-none min-w-[140px] sm:min-w-[200px] border border-white/30 hover:border-white hover:bg-white text-white hover:text-[#0061A4] px-5 sm:px-8 py-3.5 sm:py-4 rounded-sm font-bold transition-all duration-300 text-[12px] tracking-[0.18em] uppercase flex items-center justify-center backdrop-blur-sm"
                        >
                            {t.contactBtn}
                        </Link>
                    </div>
                </div>
            </div>

            {/* SLIDE COUNTER + NAV (bottom right) */}
            {bgImages.length > 1 && (
                <div className="absolute bottom-8 lg:bottom-14 right-6 lg:right-12 z-40 flex items-center gap-4 pointer-events-none">
                    {/* <span className="hidden sm:flex items-baseline gap-1 text-white/70 text-xs font-semibold tracking-widest tabular-nums pointer-events-auto">
                        <span className="text-white">{slideNumber}</span>
                        <span className="text-white/30">/</span>
                        <span>{slideTotal}</span>
                    </span> */}
                    {/* SLIDE COUNTER + NAV (bottom right) */}
                    {bgImages.length > 1 && (
                        <div className="absolute bottom-8 lg:bottom-14 right-6 lg:right-12 z-40 flex items-center gap-4 pointer-events-none">
                            <span className="hidden sm:flex items-baseline gap-1 text-white/70 text-xs font-semibold tracking-widest tabular-nums pointer-events-auto">
                                <span className="text-white">{slideNumber}</span>
                                <span className="text-white/30">/</span>
                                <span>{slideTotal}</span>
                            </span>
                            <div className="hidden lg:flex gap-2 pointer-events-auto">
                                <button
                                    onClick={prevSlide}
                                    aria-label="Previous slide"
                                    className="w-10 h-10 lg:w-12 lg:h-12 border border-white/25 rounded-sm flex items-center justify-center text-white bg-black/30 hover:bg-[#0061A4] hover:border-[#0061A4] backdrop-blur-md transition-all active:scale-90 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                                >
                                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    aria-label="Next slide"
                                    className="w-10 h-10 lg:w-12 lg:h-12 border border-white/25 rounded-sm flex items-center justify-center text-white bg-black/30 hover:bg-[#0061A4] hover:border-[#0061A4] backdrop-blur-md transition-all active:scale-90 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                                >
                                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* GAUGE-STYLE PROGRESS BAR (bottom edge, full width) */}
            {bgImages.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 z-40 h-[3px] flex bg-white/10">
                    {bgImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { if (transitionEnabled) setCurrent(idx + bgImages.length); }}
                            aria-label={`Go to slide ${idx + 1}`}
                            className="relative flex-1 h-full overflow-hidden focus-visible:outline-none"
                        >
                            {idx < activeIndex && (
                                <span className="absolute inset-0 bg-[#0061A4]" />
                            )}
                            {idx === activeIndex && (
                                <motion.span
                                    key={`fill-${current}`}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: isDragging || !transitionEnabled ? 0 : 1 }}
                                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                                    style={{ originX: 0 }}
                                    className="absolute inset-0 bg-gradient-to-r from-[#0061A4] to-[#5CC2FF]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Hero;