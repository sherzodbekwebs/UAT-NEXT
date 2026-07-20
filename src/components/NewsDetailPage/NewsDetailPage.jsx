'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Eye, ChevronLeft, Share2, Check, Loader2 } from 'lucide-react';
import API, { API_URL } from '../../api/axios';

const NewsDetailPage = ({ lang = 'ru' }) => { // lang uchun default qiymat
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Next.js da window borligini tekshirish xavfsizroq
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }

        const fetchNews = async () => {
            try {
                if (!id) return;
                const res = await API.get(`/news/${id}`);
                setPost(res.data);
                
                // Ko'rishlar sonini oshirish (Xatolik bo'lsa ham asosiy post ko'rinishi kerak)
                try {
                    await API.patch(`/news/${id}/views`);
                } catch (vErr) {
                    console.error("Views update error:", vErr);
                }
            } catch (err) {
                console.error("News fetch error:", err);
            }
        };

        fetchNews();
    }, [id]);

    if (!post) {
        return (
            <div className="py-40 text-center flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-400 font-medium italic">Yuklanmoqda...</p>
            </div>
        );
    }

    const getField = (field) => {
        const currentLang = lang || 'ru';
        const k = currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
        return post[`${field}${k}`] || post[`${field}Ru`] || "---";
    };

    const handleShare = async () => {
        if (typeof window === 'undefined') return;

        const shareData = { 
            title: getField('title'), 
            url: window.location.href 
        };

        if (navigator.share) {
            try { 
                await navigator.share(shareData); 
            } catch (err) { 
                console.log("Sharing error:", err); 
            }
        } else {
            // Navigator share bo'lmasa nusxalash
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (cErr) {
                console.error("Clipboard error:", cErr);
            }
        }
    };

    // Rasm URL-ni xavfsiz shakllantirish
    const imageUrl = `${API_URL}/${post.image}`.replace(/([^:]\/)\/+/g, "$1");

    return (
        <div className="pt-14 pb-20 bg-white font-inter">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-8 text-[#1a2e44]">
                {/* Orqaga qaytish linki */}
                <Link href="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0054A6] mb-12 transition-all font-semibold uppercase text-[11px] tracking-[2px] group">
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    {lang === 'ru' ? 'Назад к списку' : 'Ro‘yxatga qaytish'}
                </Link>

                {/* Asosiy rasm */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-12 border-4 border-gray-50">
                    <img 
                        src={imageUrl} 
                        className="w-full h-[300px] md:h-[600px] object-cover" 
                        alt={getField('title')} 
                    />
                </div>

                {/* Info bar */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-6 text-gray-400 font-medium uppercase text-[11px] tracking-wider">
                        <span className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#0054A6]" /> 
                            {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Eye size={16} className="text-[#0054A6]" /> 
                            {post.views}
                        </span>
                    </div>
                    <button 
                        onClick={handleShare} 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#0054A6] hover:text-white rounded-full text-gray-500 transition-all duration-300 text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                        {copied ? <Check size={16} /> : <Share2 size={16} />}
                        <span>
                            {copied 
                                ? (lang === 'ru' ? 'Копировано' : 'Nusxalandi') 
                                : (lang === 'ru' ? 'Поделиться' : 'Ulashish')}
                        </span>
                    </button>
                </div>

                {/* Sarlavha */}
                <h1 className="text-3xl lg:text-5xl font-semibold mb-10 leading-tight tracking-tight">
                    {getField('title')}
                </h1>

                {/* Kontent: Agar backenddan HTML kelsa dangerouslySetInnerHTML ishlatish kerak */}
                <div 
                    className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-8 font-normal whitespace-pre-wrap prose prose-lg max-w-none"
                    // dangerouslySetInnerHTML={{ __html: getField('content') }} // Agar HTML bo'lsa buni oching
                >
                    {getField('content')}
                </div>
            </div>
        </div>
    );
};

export default NewsDetailPage;