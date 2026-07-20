'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import API, { API_URL } from '../../api/axios'; 
import { useLanguage } from '../../context/LanguageContext';

const NewsSection = () => {
    const { lang } = useLanguage();
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const [cardWidth, setCardWidth] = useState(0);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);

    // 1. Ma'lumotlarni yuklash
    useEffect(() => {
        API.get('/news?active=true')
            .then(res => {
                if (Array.isArray(res.data)) {
                    // Eng yangisi birinchi chiqishi uchun sort
                    const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setNews(sorted.slice(0, 10)); // Faqat oxirgi 10 tasini ko'rsatamiz
                }
            })
            .catch(err => console.error("Yangiliklarni yuklashda xato:", err));
    }, []);

    // 2. Karta kengligini hisoblash (SSR safe)
    useEffect(() => {
        const calculateWidth = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                if (window.innerWidth < 640) setCardWidth(containerWidth * 0.85 + 16); // 16 gap uchun
                else if (window.innerWidth < 1024) setCardWidth(containerWidth / 2);
                else setCardWidth(containerWidth / 3);
            }
        };

        calculateWidth();
        window.addEventListener('resize', calculateWidth);
        return () => window.removeEventListener('resize', calculateWidth);
    }, [news]);

    // 3. Avtomatik aylanish
    useEffect(() => {
        if (isPaused || news.length <= 1) return;
        
        intervalRef.current = setInterval(() => {
            const visibleCards = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
            setCurrentIndex((prev) => (prev >= news.length - visibleCards ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [isPaused, news.length]);

    const getField = (item, field) => {
        if (!item) return "";
        const k = lang.charAt(0).toUpperCase() + lang.slice(1);
        return item[`${field}${k}`] || item[`${field}Ru`] || "";
    };

    if (news.length === 0) return null;

    // Rasm URL manzilini tozalash (double slash xatosini oldini oladi)
    const formatImgUrl = (path) => {
        if (!path) return null;
        return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
    };

    return (
        <section 
            id="news-section" 
            className="py-12 md:py-20 bg-[#F8FAFC] font-roboto select-none overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-[#0054A6]"></span>
                            <span className="text-[#0054A6] text-[10px] font-bold uppercase tracking-widest">
                                {lang === 'ru' ? 'События' : 'Voqealar'}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#1a2e44] tracking-tight">
                            {lang === 'ru' ? 'Новости' : 'Yangiliklar'}
                        </h2>
                    </div>

                    <div className="hidden md:flex gap-2">
                        <button 
                            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} 
                            className="p-2.5 rounded-full border border-gray-200 bg-white hover:bg-[#0054A6] hover:text-white transition-all cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            onClick={() => {
                                const visibleCards = window.innerWidth < 1024 ? 2 : 3;
                                setCurrentIndex(prev => Math.min(news.length - visibleCards, prev + 1));
                            }} 
                            className="p-2.5 rounded-full border border-gray-200 bg-white hover:bg-[#0054A6] hover:text-white transition-all cursor-pointer"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="relative" ref={containerRef}>
                    <motion.div
                        className="flex gap-4 md:gap-6"
                        animate={{ x: -(currentIndex * cardWidth) }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {news.map((item) => (
                            <div 
                                key={item.id} 
                                style={{ 
                                    width: cardWidth - (typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 24), 
                                    minWidth: cardWidth - (typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 24) 
                                }}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                <Link href={`/news/${item.id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-50">
                                    <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                        <Calendar size={11} className="text-[#0054A6]" />
                                        <span className="text-[9px] font-bold text-[#1a2e44]">{item.date}</span>
                                    </div>
                                    {item.image ? (
                                        <img 
                                            src={formatImgUrl(item.image)} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            alt="news" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <ImageIcon size={24} className="text-gray-200" />
                                        </div>
                                    )}
                                </Link>
                                
                                <div className="p-4 md:p-5 flex flex-col flex-1">
                                    <Link href={`/news/${item.id}`}>
                                        <h3 className="text-sm md:text-base font-bold text-[#1a2e44] group-hover:text-[#0054A6] transition-colors line-clamp-2 leading-tight mb-3 min-h-[2.5rem]">
                                            {getField(item, 'title')}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 opacity-80">
                                        {getField(item, 'content').replace(/<[^>]*>/g, '')} 
                                    </p>
                                    <Link href={`/news/${item.id}`} className="mt-auto inline-flex items-center gap-2 text-[10px] font-black text-[#0054A6] uppercase tracking-widest group/link">
                                        {lang === 'ru' ? 'Подробнее' : 'Batafsil'}
                                        <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
                
                <div className="mt-10 flex flex-col items-center gap-4">
                    <Link href="/news" className="bg-[#1a2e44] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#0054A6] transition-all shadow-lg active:scale-95">
                        {lang === 'ru' ? 'Архив новостей' : 'Barcha yangiliklar'}
                    </Link>
                    <div className="flex gap-1.5">
                        {news.slice(0, news.length - (typeof window !== 'undefined' && window.innerWidth < 1024 ? 1 : 2)).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === i ? 'w-8 bg-[#0054A6]' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;