'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// axios importi kerak emas, chunki API o'zi axios dan tashkil topgan
import API from '@/api/axios'; 

const DynamicPage = ({ lang = 'ru', slug: propSlug }) => {
    const params = useParams();
    
    // params.slug ba'zan array bo'lib kelishi mumkin, shuning uchun xavfsizroq olamiz
    const paramSlug = params?.slug;
    const slug = propSlug || (Array.isArray(paramSlug) ? paramSlug[0] : paramSlug);

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Agar slug bo'lmasa so'rov yubormaymiz
        if (!slug) return;

        const fetchContent = async () => {
            try {
                setLoading(true);
                // Backend endpointingizga mosligini tekshiring: /pages/slug/${slug} yoki /pages/${slug}
                const res = await API.get(`/pages/slug/${slug}`);
                setContent(res.data);
            } catch (err) {
                console.error("Dinamik sahifani yuklashda xato:", err);
                setContent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [slug]);

    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium italic">Yuklanmoqda...</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="p-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl text-red-500 font-bold mb-2">Sahifa topilmadi!</h2>
                <p className="text-gray-400">Slug: {slug}</p>
            </div>
        );
    }

    // Tilga mos maydonlarni tanlash (Xavfsiz usulda)
    const currentLang = lang || 'ru';
    const langSuffix = currentLang.charAt(0).toUpperCase() + currentLang.slice(1); // 'ru' -> 'Ru'
    
    const title = content[`title${langSuffix}`] || content.titleRu || content.title;
    const body = content[`content${langSuffix}`] || content.contentRu || content.content;

    return (
        <article className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24 min-h-[60vh] font-inter">
            {/* Sarlavha */}
            <h1 className="text-3xl lg:text-5xl font-black text-[#1a2e44] mb-8 border-b-2 border-blue-600 pb-6 uppercase tracking-tighter">
                {title}
            </h1>

            {/* HTML Kontent */}
            <div
                className="dynamic-content prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed 
                           prose-headings:text-[#1a2e44] prose-a:text-blue-600 prose-img:rounded-3xl"
                dangerouslySetInnerHTML={{ __html: body }}
            />
        </article>
    );
};

export default DynamicPage;