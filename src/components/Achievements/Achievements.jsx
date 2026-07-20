'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Loader2,
    Inbox 
} from 'lucide-react';

const translations = {
    ru: {
        heroTitle: "Достижения и награды",
        heroSub: "ПРИЗНАНИЕ НАШЕГО КАЧЕСТВА И ПРОФЕССИОНАЛИЗМА",
        placeholderTitle: "Раздел находится в стадии обновления",
        placeholderDesc: "На данный момент список достижений и наград дополняется актуальной информацией. Мы скоро опубликуем все наши значимые победы и сертификаты.",
        loading: "Загрузка данных..."
    },
    uz: {
        heroTitle: "Yutuq va mukofotlar",
        heroSub: "SIFAT VA PROFESSIONALIZMNING TAN OLINISHI",
        placeholderTitle: "Bo'lim yangilanish bosqichida",
        placeholderDesc: "Hozirgi vaqtda yutuq va mukofotlar ro'yxati yangi ma'lumotlar bilan to'ldirilmoqda. Tez orada barcha muhim g'alabalarimiz va sertifikatlarimizni e'lon qilamiz.",
        loading: "Ma'lumot yuklanmoqda..."
    },
    en: {
        heroTitle: "Achievements & Awards",
        heroSub: "RECOGNITION OF OUR QUALITY AND PROFESSIONALISM",
        placeholderTitle: "Section is being updated",
        placeholderDesc: "Currently, the list of achievements and awards is being updated with the latest information. We will soon publish all our significant victories and certificates.",
        loading: "Loading data..."
    }
};

const Achievements = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    const [awards, setAwards] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);

    // Rasmni public yo'li orqali beramiz
    const heroImage = '/achivments_page_hero.jpg';

    useEffect(() => {
        // Sahifa ochilganda tepaga qaytarish
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }

        const fetchAchievements = async () => {
            try {
                setLoading(true);
                // API so'rovi (Hozircha simulyatsiya)
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("API Error:", error);
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [lang]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white font-inter">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#0054A6] animate-spin" />
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">{t.loading}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-0 bg-white font-inter overflow-hidden min-h-screen">

            {/* 1. HERO SECTION */}
            <section className="relative h-[400px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-transparent to-[#0a1425] z-10"></div>
                <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5 }}
                    src={heroImage} // O'zingizning rasmingiz
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                    alt="Success background"
                    onError={(e) => {
                        // Agar rasm topilmasa Unsplash rasmini ko'rsatadi
                        e.target.src = "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2000";
                    }}
                />
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block uppercase">UzAuto Trailer Success</span>
                        <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                            {t.heroTitle.split(' ')[0]} <br />
                            <span className="text-transparent border-text">{t.heroTitle.split(' ').slice(1).join(' ')}</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 relative z-30">
                <AnimatePresence mode="wait">
                    {awards.length === 0 ? (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center text-center max-w-2xl mx-auto py-20"
                        >
                            <div className="w-24 h-24 bg-[#F8FAFC] rounded-full flex items-center justify-center text-gray-200 mb-8 border border-gray-100">
                                <Inbox size={48} strokeWidth={1} />
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2e44] mb-6 tracking-tight">
                                {t.placeholderTitle}
                            </h2>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                {t.placeholderDesc}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div key="data-list" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kelajakda bu yerda mapping bo'ladi */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[500] bg-[#0a1425]/95 backdrop-blur-xl flex items-center justify-center p-6 cursor-zoom-out"
                    >
                        {/* Ikona xatosini bu yerda to'g'irladik: size=48 className bilan */}
                        <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                            <X size={48} className="w-10 h-10 md:w-12 md:h-12" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            src={selectedImg} className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-2xl"
                            alt="Award Full"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .border-text {
                    -webkit-text-stroke: 1.5px rgba(255,255,255,0.4);
                    color: transparent;
                }
            `}} />
        </div>
    );
};

export default Achievements;