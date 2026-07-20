"use client"; // 1. BU SHART! (Framer Motion va useEffect ishlatilgani uchun)

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DraftingCompass, Ruler } from 'lucide-react';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki yo'li yoziladi
const buyro = '/buyro.jpg';
const misson_page_hero = '/misson_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "Конструкторское бюро",
        breadcrumb: "Главная > Производство > Конструкторское бюро",
        mainText: "ООО «UzAuto TRAILER» имеет собственное конструкторско-технологическое бюро, состоящее из высококвалифицированных местных и зарубежных конструкторов и технологов, занимающихся разработкой и модернизацией конструкции навесной и полуприцепной техники, с последующим их внедрением в производство. Кроме того, конструкторско-технологическое бюро занимается проектированием нестандартной технологической оснастки в машиностроительной области."
    },
    uz: {
        heroTitle: "Konstruktorlik byurosi",
        breadcrumb: "Bosh sahifa > Ishlab chiqarish > Konstruktorlik byurosi",
        mainText: "«UzAuto TRAILER» MCHJ o'zining konstruktorlik-texnologik byuroiga ega bo'lib, u mahsulotlarni ishlab chiqish va modernizatsiya qilish, so'ngra ularni ishlab chiqarishga joriy etish bilan shug'ullanadigan yuqori malakali mahalliy va xorijiy konstruktor hamda texnologlardan iborat. Bundan tashqari, konstruktorlik-texnologik byuro mashinasozlik sohasida nostandart texnologik jihozlarni loyihalash bilan ham shug'ullanadi."
    },
    en: {
        heroTitle: "Design Bureau",
        breadcrumb: "Home > Production > Design Bureau",
        mainText: "UzAuto TRAILER LLC has its own design and technology bureau, consisting of highly qualified local and foreign designers and technologists involved in the development and modernization of the design of mounted and semi-trailer equipment, with their subsequent implementation into production. In addition, the design and technology bureau is engaged in the design of non-standard technological tools in the engineering field."
    }
};

const DesignBureau = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    useEffect(() => {
        // Next.js da window borligini tekshirish xavfsizroq
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter min-h-screen pb-20 overflow-x-hidden">
            
            {/* 1. HERO SECTION */}
            <section className="relative h-[300px] lg:h-[450px] flex items-center bg-[#0a1425] overflow-hidden">
                <img 
                    src={misson_page_hero}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" 
                    alt="Engineering Background" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-[#0a1425]/60 to-transparent z-10"></div>
                
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
                            {t.breadcrumb}
                        </span>
                        <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase">
                            {t.heroTitle}
                        </h1>
                        <div className="w-20 h-1.5 bg-[#0054A6] mt-6 rounded-full"></div>
                    </motion.div>
                </div>
            </section>

            {/* 2. MAIN CONTENT SECTION */}
            <div className="max-w-[1440px] mx-auto px-4 lg:px-12 -mt-10 lg:-mt-16 relative z-30">
                <div className="bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] rounded-[32px] lg:rounded-[48px] overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                        
                        <div className="lg:col-span-7 bg-[#f1f5f9] p-4 lg:p-10 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative w-full shadow-2xl rounded-2xl overflow-hidden bg-white"
                            >
                                <img 
                                    src={buyro}
                                    className="w-full h-auto object-contain block" 
                                    alt="Engineering Center" 
                                />
                            </motion.div>
                        </div>

                        <div className="lg:col-span-5 p-8 lg:p-16 flex flex-col justify-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl text-[#0054A6]">
                                    <DraftingCompass size={24} />
                                </div>
                                
                                <p className="text-[#1a2e44] text-lg lg:text-xl font-semibold leading-relaxed text-left">
                                    {t.mainText}
                                </p>

                                <div className="pt-8 border-t border-gray-50 flex items-center gap-4 opacity-40">
                                    <Ruler size={20} />
                                    <div className="h-[1px] flex-1 bg-gray-300"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default DesignBureau;