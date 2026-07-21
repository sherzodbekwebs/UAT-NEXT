"use client";

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

                // Diqqat: Agar backendda 404 bersa, '/api/clients' deb tekshirib ko'ring
                // Hozirgi holatda standart '/clients' va '/partners' ishlatildi
                const [cRes, pRes] = await Promise.all([
                    API.get('/clients').catch(err => ({ data: [], error: err })),
                    API.get('/partners').catch(err => ({ data: [], error: err }))
                ]);

                // Mijozlar ma'lumotini tekshirish va filtrlash
                if (cRes && Array.isArray(cRes.data)) {
                    setClients(cRes.data.filter(i => i && i.isActive));
                } else if (cRes.error) {
                    console.error("Clients API 404 yoki boshqa xato:", cRes.error);
                }

                // Hamkorlar ma'lumotini tekshirish va filtrlash
                if (pRes && Array.isArray(pRes.data)) {
                    setPartners(pRes.data.filter(i => i && i.isActive));
                } else if (pRes.error) {
                    console.error("Partners API 404 yoki boshqa xato:", pRes.error);
                }

            } catch (err) {
                console.error("Logotiplarni yuklashda umumiy xato:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogos();
    }, []);

    // Rasm URL-ni tozalash funksiyasi
    const formatImgUrl = (path) => {
        if (!path) return "/placeholder-logo.png"; // Rasm bo'lmasa default rasm

        // Agar path to'liq URL bo'lsa (http...), uni o'zini qaytaramiz
        if (path.startsWith('http')) return path;

        // API_URL va path orasidagi ortiqcha slashlarni olib tashlaydi
        const cleanBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;

        return `${cleanBase}${cleanPath}`;
    };

    const MarqueeRow = ({ title, items, reverse = false }) => {
        // Agar elementlar bo'lmasa, qatorni umuman ko'rsatmaslik
        if (!items || items.length === 0) return null;

        // Cheksiz aylanish effekti uchun massivni yetarli darajada ko'paytirish
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
                    <div className="absolute inset-y-0 left-0 w-24 z-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-24 z-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>

                    <motion.div
                        className="flex gap-2 md:gap-3"
                        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
                        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                        style={{ width: "fit-content" }}
                    >
                        {doubledItems.map((item, i) => (
                            <div
                                key={`${item._id || i}-${i}`}
                                className="w-24 h-24 md:w-33 md:h-33 bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm hover:border-[#0054A6] transition-all rounded-xl"
                            >
                                <img
                                    src={formatImgUrl(item.logo)}
                                    alt={item.name || "Partner logo"}
                                    className="w-full h-full object-contain pointer-events-none transition-all duration-500"
                                    onError={(e) => { e.target.src = "/placeholder-logo.png"; }} // Rasm yuklanmasa o'rniga rasm qo'yish
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    };

    // Yuklanayotgan vaqtda bo'sh joy qolmasligi uchun balandlik berib turamiz
    if (loading) return <div className="w-full h-64 bg-white animate-pulse"></div>;

    // Agar ikkala ro'yxat ham bo'sh bo'lsa, seksiyani ko'rsatmaymiz
    if (clients.length === 0 && partners.length === 0) return null;

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