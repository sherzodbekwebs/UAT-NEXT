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
    
    const [containerWidth, setContainerWidth] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);

    // 1. Ma'lumotlarni yuklash
    useEffect(() => {
        API.get('/news?active=true')
            .then(res => {
                if (Array.isArray(res.data)) {
                    const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setNews(sorted.slice(0, 10));
                }
            })
            .catch(err => console.error("Yangiliklarni yuklashda xato:", err));
    }, []);

    // 2. Kengliklarni aniq hisoblash (Bo'sh joy qolmasligi uchun)
    const calculateSizes = () => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setContainerWidth(width);
            
            let cWidth = 0;
            if (window.innerWidth < 640) {
                // Mobil: 100% kenglik (yoni ochiq qolmasligi uchun)
                cWidth = width; 
            } else if (window.innerWidth < 1024) {
                // Planshet: 2ta karta orasidagi gap bilan
                cWidth = (width - 24) / 2;
            } else {
                // Desktop: 3ta karta
                cWidth = (width - 48) / 3;
            }
            setCardWidth(cWidth);
        }
    };

    useEffect(() => {
        calculateSizes();
        window.addEventListener('resize', calculateSizes);
        return () => window.removeEventListener('resize', calculateSizes);
    }, [news]);

    // 3. Avtomatik aylanish
    useEffect(() => {
        if (isPaused || news.length <= 1) return;
        
        intervalRef.current = setInterval(() => {
            const visibleCount = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
            setCurrentIndex(prev => (prev >= news.length - visibleCount ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [isPaused, news.length, currentIndex]);

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const visibleCount = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;

        if (offset < -50 || velocity < -500) {
            setCurrentIndex(prev => Math.min(news.length - visibleCount, prev + 1));
        } else if (offset > 50 || velocity > 500) {
            setCurrentIndex(prev => Math.max(0, prev - 1));
        }
    };

    const getField = (item, field) => {
        if (!item) return "";
        const k = lang.charAt(0).toUpperCase() + lang.slice(1);
        return item[`${field}${k}`] || item[`${field}Ru`] || "";
    };

    if (news.length === 0) return null;

    // Sliderning umumiy va sudraladigan kengligi
    const gap = typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 24;
    const totalSliderWidth = news.length * cardWidth + (news.length - 1) * gap;
    const dragLimit = Math.max(0, totalSliderWidth - containerWidth);

    return (
        <section 
            id="news-section" 
            className="py-10 md:py-20 bg-[#F8FAFC] font-roboto select-none overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                
                <div className="flex items-center justify-between mb-6 md:mb-10">
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
                                const visibleCount = window.innerWidth < 1024 ? 2 : 3;
                                setCurrentIndex(prev => Math.min(news.length - visibleCount, prev + 1));
                            }} 
                            className="p-2.5 rounded-full border border-gray-200 bg-white hover:bg-[#0054A6] hover:text-white transition-all cursor-pointer"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="relative touch-pan-y" ref={containerRef}>
                    <motion.div
                        className="flex gap-4 md:gap-6 cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ right: 0, left: -dragLimit }}
                        dragElastic={0.05}
                        onDragEnd={handleDragEnd}
                        animate={{ x: -(currentIndex * (cardWidth + gap)) }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {news.map((item) => (
                            <div 
                                key={item.id} 
                                style={{ width: cardWidth, minWidth: cardWidth }}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col shrink-0"
                            >
                                <Link href={`/news/${item.id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-50" draggable="false">
                                    <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                        <Calendar size={11} className="text-[#0054A6]" />
                                        <span className="text-[9px] font-bold text-[#1a2e44]">{item.date}</span>
                                    </div>
                                    {item.image ? (
                                        <img 
                                            src={`${API_URL}/${item.image}`.replace(/([^:]\/)\/+/g, "$1")} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            alt="news" 
                                            draggable="false"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <ImageIcon size={24} className="text-gray-200" />
                                        </div>
                                    )}
                                </Link>
                                
                                <div className="p-4 md:p-5 flex flex-col flex-1">
                                    <h3 className="text-sm md:text-base font-bold text-[#1a2e44] group-hover:text-[#0054A6] transition-colors line-clamp-2 leading-tight mb-3 min-h-[2.5rem]">
                                        {getField(item, 'title')}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 opacity-80">
                                        {getField(item, 'content').replace(/<[^>]*>/g, '')} 
                                    </p>
                                    <Link href={`/news/${item.id}`} className="mt-auto inline-flex items-center gap-2 text-[10px] font-black text-[#0054A6] uppercase tracking-widest group/link" draggable="false">
                                        {lang === 'ru' ? 'Подробнее' : 'Batafsil'}
                                        <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
                
                <div className="mt-10 flex flex-col items-center gap-6">
                    <div className="flex gap-1.5">
                        {news.map((_, i) => {
                            const visibleCount = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3) : 3;
                            if (i > news.length - visibleCount) return null;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === i ? 'w-8 bg-[#0054A6]' : 'w-2 bg-gray-200'}`}
                                />
                            );
                        })}
                    </div>

                    <Link href="/news" className="bg-[#1a2e44] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#0054A6] transition-all shadow-lg active:scale-95">
                        {lang === 'ru' ? 'Архив новостей' : 'Barcha yangiliklar'}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;