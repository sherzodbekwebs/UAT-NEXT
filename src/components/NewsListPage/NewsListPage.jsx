'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import API, { API_URL } from '../../api/axios';
import { useLanguage } from '@/context/LanguageContext';

const NewsListPage = () => {
    const { lang } = useLanguage();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Next.js da window.scrollTo(0,0) useEffect ichida bo'lishi to'g'ri
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }

        const fetchNews = async () => {
            try {
                setLoading(true);
                const res = await API.get('/news?active=true');
                setNews(res.data);
            } catch (err) {
                console.error("Yangiliklarni yuklashda xato:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const getField = (item, field) => {
        if (!item) return "---";
        // Tilni xavfsiz aniqlash
        const currentLang = lang || 'ru';
        const k = currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
        return item[`${field}${k}`] || item[`${field}Ru`] || "---";
    };

    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col animate-pulse">
            <div className="h-60 bg-gray-200" />
            <div className="p-8 flex flex-col flex-1">
                <div className="flex gap-4 mb-4">
                    <div className="w-20 h-3 bg-gray-200 rounded" />
                    <div className="w-16 h-3 bg-gray-200 rounded" />
                </div>
                <div className="w-full h-6 bg-gray-200 rounded mb-2" />
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-4" />
                <div className="mt-auto w-24 h-4 bg-gray-200 rounded" />
            </div>
        </div>
    );

    return (
        <div className="pt-12 pb-20 bg-[#F8FAFC] min-h-screen font-inter">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-5xl font-bold text-[#1a2e44] tracking-tight">
                        {lang === 'ru' ? 'Новости' : lang === 'uz' ? 'Yangiliklar' : 'News'}
                    </h1>
                    <div className="w-16 h-1 bg-[#0054A6] mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {loading ? (
                        [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
                    ) : (
                        news.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group"
                            >
                                <Link href={`/news/${item.id}`} className="relative h-60 overflow-hidden block">
                                    <img
                                        src={`${API_URL}/${item.image}`.replace(/([^:]\/)\/+/g, "$1")} // Ikki marta // tushib qolishini oldini oladi
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt=""
                                    />
                                </Link>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-gray-400 text-[11px] font-medium mb-4 uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#0054A6]" /> {item.date}</span>
                                        <span className="flex items-center gap-1.5"><Eye size={14} className="text-[#0054A6]" /> {item.views}</span>
                                    </div>
                                    <Link href={`/news/${item.id}`}>
                                        <h3 className="text-xl font-semibold text-[#1a2e44] mb-4 hover:text-[#0054A6] transition-colors line-clamp-2 leading-snug">
                                            {getField(item, 'title')}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-[14px] mb-8 line-clamp-3 leading-relaxed font-normal">
                                        {/* HTML teglarni tozalash */}
                                        {getField(item, 'content').replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </p>
                                    <Link href={`/news/${item.id}`} className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold text-[#0054A6] uppercase tracking-[2px] group/link">
                                        {lang === 'ru' ? 'ПОДРОБНЕЕ' : 'BATAFSIL'}
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsListPage;