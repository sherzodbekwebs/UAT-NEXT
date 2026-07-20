"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    ShieldCheck,
    Cpu,
    Users,
    BarChart3,
    Clock,
    X 
} from 'lucide-react';

// Markaziy API va URL ni import qilamiz
import API, { API_URL } from '../../api/axios';

const translations = {
    ru: {
        name: "ИП ООО «UzAuto Trailer»",
        mission: "Неиссякаемое желание быть сопричастным в успехе своих клиентов через инновации и совершенствование.",
        features: [
            { title: "Производство", text: "Современные методы производства и проектирования коммерческой техники;", icon: Settings },
            { title: "Качество", text: "Контроль качества на всех этапах производства и реализации продукции;", icon: ShieldCheck },
            { title: "Ресурсы", text: "Использование материалов и комплектующих деталей мировых лидеров отрасли;", icon: Cpu },
            { title: "Персонал", text: "Высоко мотивированный, квалифицированный и преданный своему делу персонал;", icon: Users },
            { title: "Ценность", text: "Идеология, настроенная на создание ценности и максимального дохода для своих клиентов;", icon: BarChart3 },
            { title: "Традиции", text: "Забота о будущем, приверженность традициям качества и сохранения всех достоинств, приобретенных за прошедшие года.", icon: Clock }
        ],
        badgeYear: "11",
        badgeMarket: "ЛЕТ НА РЫНКЕ"
    },
    uz: {
        name: "«UzAuto Trailer» MCHJ XK",
        mission: "Innovatsiyalar va tizimli takomillashtirish orqali mijozlar muvaffaqiyatiga hissa qo'shish.",
        features: [
            { title: "Ishlab chiqarish", text: "Tijorat texnikasini ishlab chiqarish va loyihalashning zamonaviy usullari;", icon: Settings },
            { title: "Sifat", text: "Ishlab chiqarish va sotishning barcha bosqichlarida sifat nazorati;", icon: ShieldCheck },
            { title: "Resurslar", text: "Sohadagi jahon yetakchilari materiallari va butlovchi qismlaridan foydalanish;", icon: Cpu },
            { title: "Xodimlar", text: "Yuqori motivatsiyali, malakali va o'z ishiga sadoqatli professionallar jamoasi;", icon: Users },
            { title: "Qiymat", text: "Mijozlar uchun yuqori qiymat va maksimal daromad yaratishga yo'naltirilgan mafkura;", icon: BarChart3 },
            { title: "An'analar", text: "Kelajak haqida qayg'urish, sifat an'analariga sodiqlik va o'tgan yillar davomida to'plangan barcha afzalliklarni saqlab qolish.", icon: Clock }
        ],
        badgeYear: "11",
        badgeMarket: "YIL BOZORDA"
    },
    en: {
        name: "«UzAuto Trailer» FE LLC",
        mission: "An inexhaustible desire to contribute to our clients' success through innovation and continuous improvement.",
        features: [
            { title: "Production", text: "Modern methods of production and design of commercial vehicles;", icon: Settings },
            { title: "Quality", text: "Quality control at all stages of production and sales;", icon: ShieldCheck },
            { title: "Resources", text: "Use of materials and components from world industry leaders;", icon: Cpu },
            { title: "Personnel", text: "Highly motivated, qualified, and dedicated staff;", icon: Users },
            { title: "Value", text: "Ideology focused on creating value and maximum income for clients;", icon: BarChart3 },
            { title: "Traditions", text: "Caring for the future, commitment to quality traditions and preservation of all advantages acquired over the past years.", icon: Clock }
        ],
        badgeYear: "11",
        badgeMarket: "YEARS ON THE MARKET"
    }
};

const HomeMission = ({ lang = 'ru' }) => {
    const [missionImages, setMissionImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const t = translations[lang] || translations.ru;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // native fetch o'rniga sozlangan Axios (API) ishlatamiz
                const res = await API.get('/anniversary-sliders');
                const data = res.data;
                
                if (data && data.length > 0) {
                    const fetchedImages = data.map(item => {
                        const imgPath = item.image || item.url || item.photo || item;
                        if (!imgPath) return null;
                        
                        // URL xavfsizligini ta'minlaymiz (ikki marta // tushib qolmasligi uchun)
                        return imgPath.startsWith('http') 
                            ? imgPath 
                            : `${API_URL}/${imgPath}`.replace(/([^:]\/)\/+/g, "$1");
                    }).filter(Boolean);
                    setMissionImages(fetchedImages);
                }
            } catch (error) {
                console.error("Rasmlarni yuklashda xatolik:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (missionImages.length === 0 || isViewerOpen) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % missionImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [index, missionImages.length, isViewerOpen]);

    const next = () => setIndex((index + 1) % missionImages.length);
    const prev = () => setIndex((index - 1 + missionImages.length) % missionImages.length);

    return (
        <section id="mission-section" className="w-full bg-[#F8FAFC] py-12 md:py-20 px-4 md:px-6 lg:px-16 font-inter overflow-hidden">
            <div className="max-w-[1440px] mx-auto">

                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2e44] mb-4 md:mb-6 tracking-tighter"
                    >
                        {t.name}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg lg:text-xl font-medium text-gray-500 leading-relaxed"
                    >
                        {t.mission}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">

                    {/* IMAGE SECTION */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] md:rounded-[30px] shadow-xl bg-gray-200 border-2 md:border-4 border-white cursor-pointer group">
                            <AnimatePresence initial={false} mode="wait">
                                {missionImages.length > 0 && (
                                    <motion.img
                                        key={index}
                                        src={missionImages[index]}
                                        onClick={() => setIsViewerOpen(true)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Mission"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Badge */}
                            <div className="absolute top-3 left-3 md:top-5 md:left-5 bg-black/30 backdrop-blur-md border border-white/30 px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-white shadow-lg z-10 flex flex-col justify-center items-center pointer-events-none">
                                <div className="text-xl md:text-3xl font-black leading-none">
                                    {t.badgeYear}
                                </div>
                                <div className="text-[6px] md:text-[8px] font-bold tracking-widest opacity-90 uppercase mt-0.5 md:mt-1">
                                    {t.badgeMarket}
                                </div>
                            </div>

                            {/* Arrows */}
                            <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 flex gap-1.5 md:gap-2 z-10">
                                <button
                                    onClick={(e) => { e.stopPropagation(); prev(); }}
                                    className="p-1.5 md:p-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-full transition-all cursor-pointer shadow-lg active:scale-90"
                                >
                                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); next(); }}
                                    className="p-1.5 md:p-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-full transition-all cursor-pointer shadow-lg active:scale-90"
                                >
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FEATURES SECTION */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                        {t.features.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] border border-transparent hover:border-blue-100 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center"
                            >
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-[#0054A6] transition-colors">
                                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-[#0054A6] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xs md:text-sm font-bold text-[#1a2e44] mb-1 group-hover:text-[#0054A6]">
                                    {item.title}
                                </h3>
                                <p className="text-[10px] md:text-[11px] text-gray-400 leading-tight">
                                    {item.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FULLSCREEN IMAGE VIEWER */}
            <AnimatePresence>
                {isViewerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
                    >
                        <button 
                            onClick={() => setIsViewerOpen(false)}
                            className="absolute top-5 right-5 text-white/50 hover:text-white p-2 transition-colors cursor-pointer z-[10000]"
                        >
                            <X size={36} className="w-8 h-8 md:w-10 md:h-10" />
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-2 md:left-5 text-white/50 hover:text-white p-3 transition-colors cursor-pointer z-[10000]"
                        >
                            <ChevronLeft size={48} className="w-10 h-10 md:w-14 md:h-14" />
                        </button>

                        {missionImages[index] && (
                            <motion.img
                                key={`viewer-${index}`}
                                src={missionImages[index]}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                                alt="Full view"
                            />
                        )}

                        <button 
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-2 md:right-5 text-white/50 hover:text-white p-3 transition-colors cursor-pointer z-[10000]"
                        >
                            <ChevronRight size={48} className="w-10 h-10 md:w-14 md:h-14" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HomeMission;