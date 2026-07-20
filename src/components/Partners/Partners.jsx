"use client"; // 1. BU SHART! (useEffect va Framer Motion uchun)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API, { API_URL } from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

const translations = {
    ru: { clients: "НАШИ КЛИЕНТЫ", partners: "НАШИ ПАРТНЕРЫ" },
    uz: { clients: "MIJOZLARIMIZ", partners: "HAMKORLARIMIZ" },
    en: { clients: "OUR CLIENTS", partners: "OUR PARTNERS" }
};

const Partners = () => {
    const { lang } = useLanguage();
    const t = translations[lang] || translations.ru;

    const [clients, setClients] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogos = async () => {
            try {
                setLoading(true);
                const [cRes, pRes] = await Promise.all([
                    API.get('/clients'),
                    API.get('/partners')
                ]);

                if (Array.isArray(cRes.data)) {
                    setClients(cRes.data.filter(i => i.isActive));
                }
                if (Array.isArray(pRes.data)) {
                    setPartners(pRes.data.filter(i => i.isActive));
                }
            } catch (err) {
                console.error("Logotiplarni yuklashda xato:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogos();
    }, []);

    // Rasm URL-ni tozalash funksiyasi
    const formatImgUrl = (path) => {
        if (!path) return "";
        // Ikki marta // tushib qolishini oldini oladi
        return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
    };

    const MarqueeRow = ({ title, items, reverse = false }) => {
        if (!items || items.length === 0) return null;

        // Marquee effekti uzilib qolmasligi uchun elementlarni ko'paytiramiz
        const doubledItems = [...items, ...items, ...items, ...items];

        return (
            <div className="py-2 overflow-hidden bg-white">
                <div className="max-w-[1440px] mx-auto px-6 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-[#0054A6]"></div>
                        <h3 className="text-sm font-black text-[#1a2e44] tracking-tight">
                            {title}
                        </h3>
                    </div>
                </div>

                <div className="relative flex items-center">
                    {/* Yon taraflardagi gradient effektlari */}
                    <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                    <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white via-white/80 to-transparent"></div>

                    <motion.div
                        className="flex gap-2 md:gap-3"
                        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
                        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                        style={{ width: "fit-content" }}
                    >
                        {doubledItems.map((item, i) => (
                            <div
                                key={i}
                                className="w-24 h-24 md:w-32 md:h-32 bg-white border border-gray-100 flex items-center justify-center p-2 overflow-hidden shadow-sm hover:border-[#0054A6] transition-colors rounded-xl"
                            >
                                <img
                                    src={formatImgUrl(item.logo)}
                                    alt="Partner logo"
                                    className="w-full h-full object-contain pointer-events-none  hover:grayscale-0 transition-all duration-500"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    };

    if (loading) return null;

    return (
        <section className="w-full bg-white py-8 select-none border-t border-gray-50">
            <div className="flex flex-col gap-4">
                <MarqueeRow title={t.clients} items={clients} reverse={false} />
                <MarqueeRow title={t.partners} items={partners} reverse={true} />
            </div>
        </section>
    );
};

export default Partners;