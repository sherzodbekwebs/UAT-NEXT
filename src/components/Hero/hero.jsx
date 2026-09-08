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

// 🔧 Navbar balandligi shu yerda belgilanadi (headeringiz balandligiga moslang)
const NAVBAR_HEIGHT_LG = 96; // px, katta ekranlar uchun
const NAVBAR_HEIGHT_SM = 72; // px, kichik ekranlar uchun (agar kerak bo'lsa)

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

// 🔧 Overlay quvvati shu yerdan boshqariladi — kerak bo'lsa shu qiymatlarni o'zgartiring
// Matn o'qilishi uchun juda yengil overlay (rasm deyarli ochiq qoladi)
const OVERLAY_MOBILE = "bg-gradient-to-t from-black/25 via-transparent to-transparent";
const OVERLAY_DESKTOP = "lg:bg-gradient-to-r lg:from-black/45 lg:via-black/10 lg:to-transparent";
// Section foni bilan bir xil rang — rasm pastki chetini shu rangga "eritib" yuboradi,
// shunda rasm va pastdagi qora blok orasida qattiq chegara ko'rinmaydi
const SECTION_BG = "#050505";

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
        <section
            className="relative w-full flex flex-col lg:block overflow-hidden bg-[#050505] font-roboto"
        >
            <Helmet>
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.metaDesc} />
            </Helmet>

            {/* Katta ekranlar uchun balandlikni CSS orqali beramiz (calc bilan) */}
            <style jsx>{`
                section {
                    min-height: 480px;
                }
                @media (min-width: 1024px) {
                    section {
                        height: calc(100vh - ${NAVBAR_HEIGHT_LG}px);
                    }
                }
            `}</style>

            {/* BACKGROUND SLIDER */}
            <div className="relative w-full aspect-video sm:aspect-[16/8] lg:aspect-auto lg:h-full lg:absolute lg:inset-0 z-10 overflow-hidden cursor-grab active:cursor-grabbing">
                <AnimatePresence>
                    {(!isFirstImageLoaded || queryLoading) && (
                        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a]">
                            {/* ✅ vertikal object-position — tepadagi muhim qism kesilmasin uchun */}
                            <img src={staticslayd.src} alt="" className="w-full h-full object-cover object-[80%_25%] lg:object-[75%_20%]" />
                            <div className={`absolute inset-0 ${OVERLAY_MOBILE} ${OVERLAY_DESKTOP} z-10`} />
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
                                <div className={`absolute inset-0 ${OVERLAY_MOBILE} ${OVERLAY_DESKTOP} z-10`} />
                                {/* ✅ vertikal object-position (25% / 20%) — tepasi kesilmaydi */}
                                <img
                                    src={getFullImagePath(img)}
                                    alt="UzAuto Trailer"
                                    onLoad={() => { if (idx === current) setIsFirstImageLoaded(true); }}
                                    className="w-full h-full object-cover object-[80%_25%] lg:object-[75%_20%] pointer-events-none select-none"
                                />
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* fine vignette for depth — faqat desktopda, mobilda o'chirilgan */}
                <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.2),transparent_60%)]" />

                {/* ✅ Rasm pastki chetini section foniga "eritish" — faqat mobil/tablet uchun, desktopda o'chirilgan */}
                <div
                    className="lg:hidden absolute inset-x-0 bottom-0 h-20 sm:h-28 z-20 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${SECTION_BG} 0%, transparent 100%)` }}
                />
            </div>

            {/* CONTENT */}
            <div className="relative z-20 -mt-12 sm:-mt-36 lg:mt-0 lg:h-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col justify-start lg:justify-center items-center lg:items-start text-center lg:text-left bg-transparent pt-4 lg:pt-0 pb-8 lg:pb-0 pointer-events-none">
                <div className="max-w-4xl pointer-events-auto w-full px-4 sm:px-14 lg:px-0">

                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden sm:flex items-center gap-3 mb-5 justify-center lg:justify-start"
                    />

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
                        className="text-[13px] lg:text-lg text-white/80 font-normal leading-relaxed mt-2 mb-6 lg:mb-8 mx-auto lg:mx-0 whitespace-pre-line max-w-xl"
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
                <div className="absolute bottom-8 lg:bottom-10 right-6 lg:right-12 z-40 flex items-center gap-4 pointer-events-none">
                    <span className="hidden sm:flex items-baseline gap-1 text-white/70 text-xs font-semibold tracking-widest tabular-nums pointer-events-auto">
                        <span className="text-white">{slideNumber}</span>
                        <span className="text-white/30">/</span>
                        <span>{slideTotal}</span>
                    </span>
                    <div className="hidden lg:flex gap-2 pointer-events-auto">
                        <button
                            onClick={prevSlide}
                            aria-label="Previous slide"
                            className="w-10 h-10 lg:w-11 lg:h-11 border border-white/25 rounded-sm flex items-center justify-center text-white bg-black/30 hover:bg-[#0061A4] hover:border-[#0061A4] backdrop-blur-md transition-all active:scale-90 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="Next slide"
                            className="w-10 h-10 lg:w-11 lg:h-11 border border-white/25 rounded-sm flex items-center justify-center text-white bg-black/30 hover:bg-[#0061A4] hover:border-[#0061A4] backdrop-blur-md transition-all active:scale-90 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
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