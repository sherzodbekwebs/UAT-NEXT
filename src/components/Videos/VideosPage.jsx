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

const ACCENT = '#0061A4';

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
        <div className="pt-20 px-4 md:px-10 pb-24 bg-[#F7F9FB] min-h-screen font-inter">
            <div className="max-w-[1320px] mx-auto">

                {/* Sarlavha qismi */}
                <div className="mb-14 max-w-2xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-[52px] font-semibold tracking-tight leading-[1.05] text-[#101828]"
                    >
                        {t.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="text-gray-500 text-[17px] leading-relaxed mt-4"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                {/* Videolar Grid'i */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STATIC_VIDEOS.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.06 }}
                            className="bg-white rounded-[26px] overflow-hidden border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_20px_45px_-20px_rgba(16,24,40,0.16)] transition-shadow duration-300 group flex flex-col"
                        >
                            {/* Video Iframe qismi */}
                            <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                                    title={getLangField(video, 'title')}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Video kontenti */}
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-[16px] font-semibold text-[#101828] mb-5 leading-[1.45] flex-grow">
                                    {getLangField(video, 'title')}
                                </h3>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-gray-400 text-[13px] font-medium">
                                        <Calendar size={15} style={{ color: ACCENT }} />
                                        <span>{video.date}</span>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleOpenYoutube(video.youtubeId)}
                                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#0061A4] hover:bg-[#0061A4]/8 rounded-lg transition-colors cursor-pointer"
                                            title="YouTube'da ochish"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                        <button
                                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#0061A4] hover:bg-[#0061A4]/8 rounded-lg transition-colors cursor-pointer"
                                            title="Ulashish"
                                        >
                                            <Share2 size={18} />
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