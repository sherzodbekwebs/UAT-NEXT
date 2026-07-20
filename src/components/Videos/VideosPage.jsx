'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Share2, Youtube, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
    ru: {
        title: "Видеоролики",
        subtitle: "Посмотрите наши последние видео и официальные обзоры производства",
    },
    uz: {
        title: "Videoroliklar",
        subtitle: "Bizning so'nggi videolarimiz va rasmiy ishlab chiqarish sharhlarimizni tomosha qiling",
    },
    en: {
        title: "Videos",
        subtitle: "Watch our latest videos and official production reviews",
    }
};

const STATIC_VIDEOS = [
    {
        id: 1,
        youtubeId: "1KxUZNPeUu4",
        titleRu: "UzAuto TRAILER - Полный обзор производства",
        titleUz: "UzAuto TRAILER - Ishlab chiqarish jarayonlari haqida",
        titleEn: "UzAuto TRAILER - Full production overview",
        date: "2025-12-23"
    },
    {
        id: 2,
        youtubeId: "jykg-OL1wvY",
        titleRu: "Седельный тягач KAMAZ в действии — салон, управление, дорога",
        titleUz: "KAMAZ tyagachi ish jarayonida — saloni, boshqaruvi va yo‘l sinovi",
        titleEn: "KAMAZ Tractor Unit in Action — Cabin, Handling, and the Road",
        date: "2025-11-24"
    },
    {
        id: 3,
        youtubeId: "IpHIZouGHlQ",
        titleRu: "UzAuto TRAILER: Сила, надёжность и техника для работы",
        titleUz: "UzAuto TRAILER: Kuch, ishonchlilik va mehnat uchun yaratilgan texnika",
        titleEn: "UzAuto TRAILER: Strength, Reliability, and Equipment Built for Work",
        date: "2025-11-24"
    },
    {
        id: 4,
        youtubeId: "ZbZGI3PzUPY",
        titleRu: "Comvex 2026",
        titleUz: "Comvex 2026",
        titleEn: "Comvex 2026",
        date: "2026-03-10"
    }
];

const VideosPage = () => {
    const { lang } = useLanguage();
    const t = translations[lang] || translations.ru;

    const getLangField = (obj, field) => {
        if (!obj) return "";
        const currentSuffix = (lang || 'ru').charAt(0).toUpperCase() + (lang || 'ru').slice(1);
        return obj[`${field}${currentSuffix}`] || obj[`${field}Ru`] || "";
    };

    const handleOpenYoutube = (id) => {
        if (typeof window !== 'undefined') {
            window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
        }
    };

    return (
        <div className="pt-20 px-4 md:px-10 pb-24 bg-[#f8fafc] min-h-screen font-inter">
            <div className="max-w-[1440px] mx-auto">

                {/* Sarlavha qismi */}
                <div className="mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-black text-[#1a2e44] mb-6 tracking-tight uppercase"
                    >
                        {t.title}
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80px" }}
                        className="h-1.5 bg-[#0054A6] mx-auto mb-8 rounded-full"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                {/* Videolar Grid'i */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {STATIC_VIDEOS.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200 group flex flex-col"
                        >
                            {/* Video Iframe qismi */}
                            <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                <iframe
                                    className="w-full h-full grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                                    title={getLangField(video, 'title')}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Video kontenti */}
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-xl font-semibold text-[#1a2e44] mb-6 group-hover:text-[#0054A6] transition-colors leading-[1.4] flex-grow">
                                    {getLangField(video, 'title')}
                                </h3>

                                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                                        <Calendar size={16} className="text-[#0054A6]" />
                                        <span>{video.date}</span>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleOpenYoutube(video.youtubeId)}
                                            className="p-2 text-slate-400 hover:text-[#0054A6] hover:bg-blue-50 rounded-md transition-all cursor-pointer"
                                            title="YouTube'da ochish"
                                        >
                                            <ExternalLink size={20} />
                                        </button>
                                        <button
                                            className="p-2 text-slate-400 hover:text-[#0054A6] hover:bg-blue-50 rounded-md transition-all cursor-pointer"
                                            title="Ulashish"
                                        >
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideosPage;