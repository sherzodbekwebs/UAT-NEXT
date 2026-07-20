"use client"; // 1. BU SHART! (React Query va Framer Motion uchun)

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Building2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; 

// O'zimizning API va URL ni import qilamiz
import API, { API_URL } from '../../api/axios';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki string yo'li yoziladi
const heroImg = '/history_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "История предприятия",
        introTitle: "ООО “UzAuto TRAILER”",
        introText: [
            "4 июня 2012 году Акционерной компанией «Узавтосаноат» учреждено предприятие в форме общества с ограниченной ответственностью «UzAuto TRAILER» по выпуску прицепной техники и различных видов надстроек на грузовые шасси.",
            "Проектная мощность завода рассчитана на 3000 единиц: 2000 единиц – полуприцепов и 1000 единиц – надстроек на грузовые шасси, также освоен выпуск широкого спектра автомобильной техники для обеспечения различных отраслей хозяйства республики.",
            "ООО “UzAuto TRAILER” нацелено на реализацию своей продукции не только на внутреннем рынке Узбекистана, но и в соседних странах Центральной Азии: Казахстан, Азербайджан, Афганистан, Туркменистан, Таджикистан и Кыргызстан."
        ],
        marketTitle: "Рынки сбыта",
        marketDesc: "Казахстан, Азербайджан, Афганистан, Туркменистан, Таджикистан и Кыргызстан.",
        serviceTitle: "Обслуживание",
        serviceDesc: "Приобрести технику и осуществить ее обслуживание потребители могут в дилерских центрах расположенных в Ташкенте и других региональных центрах нашей республики.",
        timelineHint: "ВЫБЕРИТЕ ВАЖНУЮ ВЕХУ РАЗВИТИЯ",
    },
    uz: {
        heroTitle: "Korxona tarixi",
        introTitle: "“UzAuto TRAILER” MCHJ",
        introText: [
            "2012-yil 4-iyun kuni «O'zavtosanoat» aksiyadorlik kompaniyasi tomonidan tirkama texnikasi va yuk shassilariga turli xil ustqurmalar ishlab chiqarish bo'yicha «UzAuto TRAILER» mas'uliyati cheklangan jamiyati shaklidagi korxona tashkil etildi.",
            "Zavodning loyiha quvvati 3000 birlikka mo'ljallangan: 2000 dona yarim tirkama va 1000 dona yuk shassilari uchun ustqurmalar, shuningdek respublika iqtisodiyotining turli tarmoqlarini ta'minlash uchun keng turdagi avtomobil texnikalari ishlab chiqarish o'zlashtirildi.",
            "“UzAuto TRAILER” MCHJ o'z mahsulotlarini nafaqat O'zbekiston ichki bozorida, balki Markaziy Osiyoning qo'shni davlatlari: Qozog'iston, Ozarbayjon, Afg'oniston, Turkmaniston, Tojikiston va Qirg'izistonda ham sotishni maqsad qilgan."
        ],
        marketTitle: "Sotuv bozorlari",
        marketDesc: "Qozog'iston, Ozarbayjon, Afg'oniston, Turkmaniston, Tojikiston va Qirg'iziston.",
        serviceTitle: "Xizmat ko'rsatish",
        serviceDesc: "Texnikani sotib olish va unga xizmat ko'rsatish Toshkent hamda respublikamizning boshqa mintaqaviy markazlarida joylashgan dilerlik markazlarida amalga oshirilishi mumkin.",
        timelineHint: "RIVOJLANISHNING MUHIM BOSQICHINI TANLANG",
    },
    en: {
        heroTitle: "Company History",
        introTitle: "“UzAuto TRAILER” LLC",
        introText: [
            "On June 4, 2012, the Joint-Stock Company 'Uzavtosanoat' established an enterprise in the form of a limited liability company 'UzAuto TRAILER' for the production of trailer equipment and various types of superstructures for truck chassis.",
            "The design capacity of the plant is designed for 3000 units: 2000 units - semi-trailers and 1000 units - superstructures on truck chassis, and the production of a wide range of automotive equipment to provide various sectors of the republic's economy was also mastered.",
            "FE LLC 'UzAuto TRAILER' aims to sell its products not only in the domestic market of Uzbekistan, but also in neighboring countries of Central Asia: Kazakhstan, Azerbaijan, Afghanistan, Turkmenistan, Tajikistan and Kyrgyzstan."
        ],
        marketTitle: "Sales Markets",
        marketDesc: "Kazakhstan, Azerbaijan, Afghanistan, Turkmenistan, Tajikistan and Kyrgyzstan.",
        serviceTitle: "Service",
        serviceDesc: "Consumers can purchase equipment and carry out its maintenance at dealer centers located in Tashkent and other regional centers of our republic.",
        timelineHint: "SELECT A SIGNIFICANT DEVELOPMENT MILESTONE",
    }
};

const CompanyHistory = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const timelineRef = useRef(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedImg, setSelectedImg] = useState(null);

    // 🟢 REACT QUERY: Axios instance ishlatildi
    const { data: historyList = [], isLoading } = useQuery({
        queryKey: ['history'],
        queryFn: async () => {
            const res = await API.get('/history'); // fetch o'rniga API.get
            const data = res.data;
            return data
                .filter(item => item.isActive)
                .map(item => ({
                    id: item.id,
                    year: item.year || (item.sortOrder ? item.sortOrder.toString() : "2012"),
                    ru: { title: item.titleRu, desc: item.descRu },
                    uz: { title: item.titleUz, desc: item.descUz },
                    en: { title: item.titleEn, desc: item.descEn },
                    images: item.image ? [`${API_URL}${item.image}`] : []
                }));
        },
        staleTime: 1000 * 60 * 30,
    });

    useEffect(() => {
        if (historyList.length > 0 && !selectedEvent) {
            setSelectedEvent(historyList[0]);
        }
    }, [historyList, selectedEvent]);

    useEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }, []);

    const scrollTimeline = (direction) => {
        if (timelineRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-0 bg-white font-inter overflow-hidden min-h-screen">
            
            <style>{`
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                .skeleton { background: linear-gradient(90deg, #f0f2f5 25%, #e6e8eb 50%, #f0f2f5 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
                .no-scrollbar::-webkit-scrollbar { display: none; } 
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* 1. HERO */}
            <section className="relative h-[250px] lg:h-[300px] flex items-center justify-center bg-[#0a1425]">
                <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" alt="Background" />
                <div className="relative z-20 text-center px-4">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl lg:text-6xl font-semibold text-white tracking-tighter uppercase ">
                        {t.heroTitle}
                    </motion.h1>
                    <div className="w-16 lg:w-20 h-1 bg-[#0054A6] mx-auto mt-4 lg:mt-6 rounded-full"></div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-20">
                {/* 2. INTRODUCTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 lg:mb-32 items-start scroll-mt-28">
                    <div className="lg:col-span-7 space-y-6 lg:space-y-8">
                        <h2 className="text-2xl lg:text-4xl font-semibold text-[#1a2e44]">{t.introTitle}</h2>
                        <div className="text-gray-600 text-base lg:text-lg leading-relaxed space-y-4 lg:space-y-6 font-medium">
                            {t.introText.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </div>
                    <div className="lg:col-span-5 bg-[#F8FAFC] p-6 lg:p-10 rounded-[30px] lg:rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-center">
                        <div className="space-y-6 lg:space-y-8">
                            <div className="flex gap-4 lg:gap-5">
                                <div className="shrink-0"><Globe className="text-[#0054A6]" size={24} /></div>
                                <div><h4 className="font-bold text-[#1a2e44] mb-1 lg:mb-2 uppercase text-[10px] lg:text-xs tracking-widest">{t.marketTitle}</h4><p className="text-xs lg:text-sm text-gray-500 font-semibold leading-relaxed">{t.marketDesc}</p></div>
                            </div>
                            <div className="flex gap-4 lg:gap-5">
                                <div className="shrink-0"><Building2 className="text-[#0054A6]" size={24} /></div>
                                <div><h4 className="font-bold text-[#1a2e44] mb-1 lg:mb-2 uppercase text-[10px] lg:text-xs tracking-widest">{t.serviceTitle}</h4><p className="text-xs lg:text-sm text-gray-500 font-semibold leading-relaxed">{t.serviceDesc}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. TIMELINE */}
                <section id="timeline" className="scroll-mt-28">
                    <div className="flex flex-col items-center mb-10 lg:mb-16 text-center relative group">
                        <span className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-4">{t.timelineHint}</span>

                        <div className="relative w-full flex items-center">
                            <button onClick={() => scrollTimeline('left')} className="absolute left-0 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-all border border-gray-100 hidden lg:flex">
                                <ChevronLeft size={20} />
                            </button>

                            <div ref={timelineRef} className="w-full overflow-x-auto pb-4 no-scrollbar flex flex-nowrap gap-2 lg:gap-4 px-10 border-t border-gray-100 pt-8">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => <div key={i} className="shrink-0 w-20 h-16 skeleton rounded-2xl" />)
                                ) : (
                                    historyList.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedEvent(item)}
                                            className={`shrink-0 flex flex-col items-center py-3 lg:py-4 px-6 rounded-2xl transition-all duration-300 ${selectedEvent?.id === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className={`w-2.5 h-2.5 rounded-full mb-3 border-2 ${selectedEvent?.id === item.id ? 'bg-[#0054A6] border-[#0054A6]' : 'bg-white border-gray-300'}`} />
                                            <span className={`text-xs lg:text-base font-bold ${selectedEvent?.id === item.id ? 'text-[#0054A6]' : 'text-gray-400'}`}>{item.year}</span>
                                        </button>
                                    ))
                                )}
                            </div>

                            <button onClick={() => scrollTimeline('right')} className="absolute right-0 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-all border border-gray-100 hidden lg:flex">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[300px]">
                                <div className="lg:col-span-5 space-y-4">
                                    <div className="h-10 w-3/4 skeleton rounded-lg" />
                                    <div className="h-32 w-full skeleton rounded-lg" />
                                </div>
                                <div className="lg:col-span-7"><div className="h-[350px] w-full skeleton rounded-3xl" /></div>
                            </div>
                        ) : selectedEvent && (
                            <motion.div key={selectedEvent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[300px]">
                                <div className="lg:col-span-5 space-y-4 lg:space-y-6 order-2 lg:order-1">
                                    <div className="hidden lg:block select-none text-7xl lg:text-9xl font-black text-[#0054A6]/5 leading-none">{selectedEvent.year}</div>
                                    <div className="relative z-10 space-y-4">
                                        <h3 className="text-2xl lg:text-4xl font-semibold text-[#1a2e44] leading-tight tracking-tighter">{selectedEvent[lang]?.title}</h3>
                                        <p className="text-gray-500 text-base lg:text-lg leading-relaxed font-medium">{selectedEvent[lang]?.desc}</p>
                                    </div>
                                </div>
                                <div className="lg:col-span-7 order-1 lg:order-2">
                                    {selectedEvent.images.map((img, idx) => (
                                        <div key={idx} onClick={() => setSelectedImg(img)} className="cursor-zoom-in relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border-2 lg:border-4 border-white bg-white w-full h-auto">
                                            <img src={img} className="w-full h-auto block" alt="History" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImg(null)} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out">
                        <button className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white hover:text-red-500 transition-colors"><X size={32} /></button>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} src={selectedImg} className="max-w-full max-h-[85vh] lg:max-h-[90vh] object-contain shadow-2xl rounded-lg" alt="Full view" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CompanyHistory;