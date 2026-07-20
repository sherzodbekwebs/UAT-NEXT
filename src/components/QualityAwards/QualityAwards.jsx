'use client'; // 1. BU SHART! (hooks va motion ishlatilgan)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    Calendar, ZoomIn, X
} from 'lucide-react';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki string yo'li yoziladi
const hardoxCert = '/SSABsert.jpg';
const hardoxLogo = '/logoharddox.png';
const quality_page_heroo = '/quality_page_heroo.jpg';

const translations = {
    ru: {
        heroTitle: "Награды в области качества",
        breadcrumb: "Главная > Производство > Качество",
        hardoxTitle: "Первый участник программы Hardox® In My Body в Узбекистане",
        hardoxAwardInfo: "Сертификат Hardox® In My Body 26 ноября 2019 года вручил Джонни Сьёрстрем, Вице-президент компании SSAB.",
        hardoxDesc: "ООО «UzAuto Trailer» имеет в продуктовой линейке кузова коробчатого и полуовального типа нескольких типоразмеров, изготовленные из стали Hardox® 450.",
        sourceLink: "Ссылка на официальный источник SSAB",
    },
    uz: {
        heroTitle: "Sifat sohasidagi mukofotlar",
        breadcrumb: "Bosh sahifa > Ishlab chiqarish > Sifat",
        hardoxTitle: "O'zbekistonda Hardox® In My Body dasturining birinchi ishtirokchisi",
        hardoxAwardInfo: "Hardox® In My Body sertifikati 2019-yil 26-noyabrda SSAB kompaniyasi vitse-prezidenti Jonni Syostrem tomonidan topshirilgan.",
        hardoxDesc: "«UzAuto Trailer» MCHJ mahsulot yo'nalishida Hardox® 450 po'latidan tayyorlangan bir necha o'lchamdagi quti va yarim ovalsimon turdagi kuzovlarga ega.",
        sourceLink: "SSAB rasmiy manbasiga havola",
    },
    en: {
        heroTitle: "Quality Awards",
        breadcrumb: "Home > Production > Quality",
        hardoxTitle: "First member of the Hardox® In My Body program in Uzbekistan",
        hardoxAwardInfo: "The Hardox® In My Body certificate was presented on November 26, 2019, by Johnny Sjöström, Vice President of SSAB.",
        hardoxDesc: "UzAuto Trailer LLC has box-type and semi-oval type bodies of several sizes in its product line, made of Hardox® 450 steel.",
        sourceLink: "Link to official SSAB source",
    }
};

const QualityAwards = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter pb-20">
            {/* 1. HERO SECTION */}
            <section className="relative h-[250px] lg:h-[350px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
                <img
                    src={quality_page_heroo}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" alt="Background"
                />
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.3em] uppercase text-[10px] mb-3 block opacity-80">{t.breadcrumb}</span>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white uppercase leading-tight">{t.heroTitle}</h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-4 lg:px-8 -mt-10 lg:-mt-14 relative z-30">
                {/* 2. MAIN HIGHLIGHT: HARDOX AWARD */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                        {/* Certificate Image Side */}
                        <div className="lg:col-span-4 bg-[#F1F5F9] p-6 lg:p-10 flex items-center justify-center border-r border-gray-50">
                            <div className="relative cursor-zoom-in group" onClick={() => setSelectedImg(hardoxCert)}>
                                <img
                                    src={hardoxCert}
                                    className="w-full h-auto max-h-[450px] object-contain shadow-xl rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                                    alt="Hardox Certificate"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg">
                                    <ZoomIn className="text-white" size={40} />
                                </div>
                            </div>
                        </div>

                        {/* Text Content Side */}
                        <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col justify-center space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <img src={hardoxLogo} alt="Hardox Logo" className="h-10 lg:h-12 object-contain" />
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#0054A6] rounded-full text-[11px] font-black uppercase tracking-widest">
                                    <Calendar size={14} /> 26.11.2019
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2e44] leading-tight text-black">
                                    {t.hardoxTitle}
                                </h2>
                                <p className="text-gray-600 text-base lg:text-lg leading-relaxed font-medium">
                                    {t.hardoxAwardInfo}
                                </p>
                            </div>

                            <div className="p-6 bg-[#F8FAFC] rounded-2xl border-l-4 border-[#0054A6] shadow-sm">
                                <p className="text-[#1a2e44] text-[15px] lg:text-[17px] font-semibold leading-relaxed">
                                    {t.hardoxDesc}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <a
                                    href="https://www.ssab.com/en/ru-ru/%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8/2019/12/ru-uzavto"
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#0054A6] font-bold text-sm hover:underline group"
                                >
                                    {t.sourceLink} <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-10 cursor-zoom-out"
                    >
                        <button className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/70 hover:text-white transition-all z-[10000] cursor-pointer">
                            <X size={40} className="w-10 h-10" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImg} className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg" alt="Award Full"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QualityAwards;