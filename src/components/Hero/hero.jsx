'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import API, { API_URL } from '../../api/axios';
import staticslayd from '../../../public/staticslayder.jpg';

const translations = {
    uz: {
        seoTitle: "UzAuto TRAILER — Yarim tirkamalar va maxsus texnikalar ishlab chiqaruvchisi",
        metaDesc: "UzAuto Trailer — O‘zbekistondagi og‘ir yuk tashish sanoatida ishonchli hamkor. Sifatli yarim tirkamalar, konteynerlar va maxsus transport vositalari ishlab chiqarish.",
        catalogBtn: "Katalog",
        contactBtn: "Aloqa",
        description: "UzAuto Trailer — og'ir yuk tashish sanoatida ishonchli hamkoringiz. Biz kuch va innovatsiyani birlashtiramiz.",
        titles: [
            "UzAuto TRAILER\nYo'llardan bir qadam oldinda",
            "Katta vazifalar uchun muhandislik quvvati",
            "Yo'llar ishonadigan yuk texnikasi",
            "Logistikangizning ishonchli poydevori",
            "Biznesni oldinga boshlaymiz yangi avlod texnikasi",
            "Sizning yo'lingiz — bizning texnologiyalar",
            "Biznesingiz imkoniyatlarini kengaytiramiz",
            "Harakatdagi kuch",
            "UzAuto TRAILER\nYo'llardan bir qadam oldinda",
            "Logistika energiyasi. Texnologiyalar quvvati",
            "Kichik yuklardan katta g'alabalargacha: barcha yo'llar uchun texnika"
        ]
    },
    ru: {
        seoTitle: "UzAuto TRAILER — Производитель полуприцепов и спецтехники в Узбекистане",
        metaDesc: "UzAuto Trailer — ваш надежный партнер в индустрии большегрузных перевозок. Производство высококачественных полуприцепов и контейнеров.",
        catalogBtn: "Каталог",
        contactBtn: "Контакты",
        description: "UzAuto Trailer — ваш надежный партнер в индустрии большегрузных перевозок. Мы объединяем силу и инновации.",
        titles: [
            "UzAuto TRAILER\nНа шаг впереди дорог",
            "Инженерная мощь для больших задач",
            "Грузовая техника, которой доверяют дороги",
            "Надежный фундамент вашей логистики",
            "Двигаем бизнес вперед техника нового поколения",
            "Ваш путь — наши технологии",
            "Масштабируем возможности вашего бизнеса",
            "Сила в движении",
            "UzAuto TRAILER\nНа шаг впереди дорог",
            "Энергия логистики. Мощь технологий",
            "От малых грузов до больших побед: техника для любых дорог"
        ]
    },
    en: {
        seoTitle: "UzAuto TRAILER — Leading Semi-trailer & Special Equipment Manufacturer",
        metaDesc: "UzAuto Trailer is a leading manufacturer of high-quality semi-trailers, containers, and specialized transport equipment in Uzbekistan.",
        catalogBtn: "Catalog",
        contactBtn: "Contact",
        description: "UzAuto Trailer is your reliable partner in the heavy haulage industry. We combine strength and innovation.",
        titles: [
            "UzAuto TRAILER\nOne step ahead of the roads",
            "Engineering power for big tasks",
            "Heavy equipment that roads trust",
            "A reliable foundation for your logistics",
            "Moving business forward next-generation equipment",
            "Your way — our technologies",
            "Scaling your business opportunities",
            "Power in motion",
            "UzAuto TRAILER\nOne step ahead of the roads",
            "Logistics energy. Power of technology",
            "From small loads to big wins: equipment for all roads"
        ]
    }
};

const Hero = ({ lang = 'ru' }) => {
    const router = useRouter();
    const t = translations[lang] || translations.ru;

    const { data: bgImages = [], isLoading: queryLoading } = useQuery({
        queryKey: ['sliders'],
        queryFn: async () => {
            if (!API_URL) return [];

            try {
                const res = await API.get('/sliders');
                const payload = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
                return payload.filter(item => item?.isActive !== false);
            } catch (error) {
                console.error('Sliderlarni yuklashda xatolik:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 10,
        retry: false,
    });

    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [transitionEnabled, setTransitionEnabled] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);

    const slides = useMemo(() => {
        if (bgImages.length === 0) return [{ image: staticslayd, id: 'static' }];
        return [...bgImages, ...bgImages, ...bgImages];
    }, [bgImages]);

    useEffect(() => {
        if (bgImages.length > 0 && current === 0) {
            setCurrent(bgImages.length);
        }
    }, [bgImages, current]);

    const loading = queryLoading;

    const getFullImagePath = (img) => {
        const rawValue = typeof img === 'string'
            ? img
            : img?.image || img?.url || img?.src || img?.path || '';

        if (!rawValue || typeof rawValue !== 'string') return staticslayd;

        const value = rawValue.trim();
        if (!value) return staticslayd;
        if (value.startsWith('http') || value.startsWith('data:')) return value;

        const cleanBaseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        if (!cleanBaseUrl) return value.startsWith('/') ? value : `/${value}`;

        return `${cleanBaseUrl}${value.startsWith('/') ? value : `/${value}`}`;
    };

    useEffect(() => {
        if (!loading) {
            const timeout = setTimeout(() => {
                setTransitionEnabled(true);
                setFirstLoad(false);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [loading]);

    useEffect(() => {
        if (bgImages.length <= 1 || isDragging || loading || !transitionEnabled) return;
        const timer = setInterval(() => setCurrent(prev => prev + 1), 7000);
        return () => clearInterval(timer);
    }, [current, isDragging, bgImages, loading, transitionEnabled]);

    const nextSlide = () => { if (transitionEnabled) setCurrent(prev => prev + 1); };
    const prevSlide = () => { if (transitionEnabled) setCurrent(prev => prev - 1); };

    const handleUpdate = () => {
        if (loading || !bgImages.length) return;
        if (current >= bgImages.length * 2) {
            setTransitionEnabled(false);
            setCurrent(current - bgImages.length);
        } else if (current < bgImages.length) {
            setTransitionEnabled(false);
            setCurrent(current + bgImages.length);
        }
    };

    useEffect(() => {
        if (!transitionEnabled && !loading) {
            const timeout = setTimeout(() => setTransitionEnabled(true), 20);
            return () => clearTimeout(timeout);
        }
    }, [transitionEnabled, loading]);

    const onDragEnd = (e, info) => {
        if (loading) return;
        setIsDragging(false);
        const { offset, velocity } = info;
        if (offset.x < -40 || velocity.x < -400) nextSlide();
        else if (offset.x > 40 || velocity.x > 400) prevSlide();
    };

    const currentTitle = useMemo(() => {
        if (bgImages.length === 0) return t.titles[0];
        const index = current % bgImages.length;
        return t.titles[index % t.titles.length];
    }, [current, bgImages.length, t]);

    return (
        <section className="relative w-full flex flex-col lg:h-screen lg:block overflow-hidden bg-[#0a0a0a] font-roboto">
            {/* SEO OPTIMIZATSIYASI */}
            <Helmet>
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.metaDesc} />
                <link rel="canonical" href="https://uzautotrailer.uz/" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "UzAuto TRAILER",
                        "url": "https://uzautotrailer.uz/",
                        "logo": "https://uzautotrailer.uz/logo.png",
                        "description": t.metaDesc,
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "UZ"
                        }
                    })}
                </script>
            </Helmet>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                * { font-family: 'Roboto', sans-serif !important; }
            `}</style>

            {/* Rasm qismi */}
            <div className="relative w-full aspect-video sm:aspect-[16/8] lg:aspect-auto lg:h-full lg:absolute lg:inset-0 z-10 overflow-hidden cursor-grab active:cursor-grabbing">
                {loading ? (
                    <div className="absolute inset-0 w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent z-10" />
                        <img src={staticslayd} alt="UzAuto Trailer mahsulotlari" className="w-full h-full object-cover object-center lg:object-[75%_center]" />
                    </div>
                ) : (
                    <motion.div
                        drag="x"
                        dragMomentum={false}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={onDragEnd}
                        animate={{ x: `-${current * 100}%` }}
                        onAnimationComplete={handleUpdate}
                        transition={(transitionEnabled && !firstLoad) ? { type: "spring", bounce: 0, duration: 0.7 } : { duration: 0 }}
                        className="flex h-full w-full"
                    >
                        {slides.map((img, idx) => (
                            <div key={idx} className="relative h-full w-full shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent z-10" />
                                <img
                                    src={getFullImagePath(img.image)}
                                    alt={`UzAuto Trailer - ${currentTitle.replace('\n', ' ')}`}
                                    className="w-full h-full object-cover object-center lg:object-[75%_center] pointer-events-none select-none"
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Matn qismi */}
            <div className="relative z-20 -mt-14 sm:-mt-16 lg:mt-0 lg:h-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col justify-start lg:justify-center items-center lg:items-start text-center lg:text-left bg-transparent pt-0 pb-16 lg:pb-0 pointer-events-none font-roboto">
                <div className="max-w-4xl pointer-events-auto w-full">

                    <div className="min-h-[90px] sm:min-h-[120px] lg:min-h-0 flex items-center lg:items-start justify-center lg:justify-start">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentTitle}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.5 }}
                                className="text-[24px] sm:text-5xl lg:text-[58px] font-black text-white leading-[1.1] mb-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-pre-line"
                            >
                                {currentTitle}
                            </motion.h1>
                        </AnimatePresence>
                    </div>

                    <div className="min-h-[50px] sm:min-h-[60px] lg:min-h-0 mt-3 lg:mt-6 mb-6 lg:mb-10 flex items-center justify-center lg:justify-start">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[14px] lg:text-lg text-white/90 font-medium leading-relaxed px-4 lg:px-0 drop-shadow-lg mx-auto lg:mx-0"
                        >
                            {t.description}
                        </motion.p>
                    </div>

                    {/* SEO OPTIMIZATSIYASI: Tugmalar Link ga o'zgartirildi */}
                    <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto px-2 lg:px-0">
                        <Link
                            href="/products"
                            className="flex-1 sm:flex-none min-w-[130px] sm:min-w-[180px] bg-[#0061A4] hover:bg-blue-600 text-white px-4 sm:px-12 py-3.5 rounded-sm font-bold transition-all text-[12px] tracking-widest shadow-xl uppercase text-center flex items-center justify-center"
                        >
                            {t.catalogBtn}
                        </Link>
                        <Link
                            href="/contacts"
                            className="flex-1 sm:flex-none min-w-[130px] sm:min-w-[180px] bg-[#E88B3A] hover:bg-[#d47a2e] text-white px-4 sm:px-12 py-3.5 rounded-sm font-bold transition-all text-[12px] tracking-widest shadow-xl uppercase text-center flex items-center justify-center"
                        >
                            {t.contactBtn}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigatsiya */}
            {!loading && bgImages.length > 1 && (
                <div className="absolute bottom-6 lg:bottom-12 left-0 right-0 z-40 px-6 lg:px-12 flex flex-row justify-between items-end pointer-events-none w-full">
                    <div className="flex gap-2 pointer-events-auto items-center">
                        {bgImages.map((_, idx) => (
                            <div key={idx} onClick={() => { if (transitionEnabled) setCurrent(idx + bgImages.length); }}
                                className={`cursor-pointer transition-all duration-500 rounded-full ${idx === current % bgImages.length ? 'w-8 lg:w-16 h-[3px] bg-[#0061A4]' : 'w-4 lg:w-8 h-[2px] bg-white/20'}`} />
                        ))}
                    </div>

                    <div className="hidden lg:flex gap-3 pointer-events-auto">
                        <button onClick={prevSlide} className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#0061A4] backdrop-blur-md transition-all active:scale-90 shadow-2xl">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextSlide} className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#0061A4] backdrop-blur-md transition-all active:scale-90 shadow-2xl">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Hero;