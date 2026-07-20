"use client"; // 1. BU SHART! (useEffect, useState va Motion uchun)

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    ZoomIn,
    X,
    ChevronRight,
    ChevronLeft,
    FileText,
} from 'lucide-react';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki yo'li yoziladi
const cert1 = '/reg_cert1.jpg';
const cert2 = '/reg_cert2.jpg';
const cert3 = '/reg_cert3.jpg';
const cert4 = '/reg_cert4.jpg';
const heroImg = '/regs_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "Сведения о регистрации и товарном знаке",
        introText: "Официальные документы, подтверждающие государственную регистрацию предприятия и исключительные права на товарный знак ООО «UzAuto Trailer».",
        docsTitle: "Официальные документы",
        zoomHint: "Нажмите на документ для детального просмотра",
        docTypes: [
            { id: 1, title: "Свидетельство о регистрации", year: "2012", img: cert1 },
            { id: 2, title: "Лицензия на производство", year: "2015", img: cert2 },
            { id: 3, title: "Свидетельство на товарный знак", year: "2021", img: cert3 },
            { id: 4, title: "Приложение к свидетельству", year: "2021", img: cert4 }
        ],
        protectionTitle: "Правовая защита",
        protectionDesc: "Товарный знак «UzAuto Trailer» является интеллектуальной собственностью предприятия и охраняется законом Республики Узбекистан. Любое несанкционированное использование бренда влечет за собой ответственность в соответствии с законодательством."
    },
    uz: {
        heroTitle: "Ro'yxatdan o'tganlik va tovar belgisi",
        introText: "Korxonaning davlat ro'yxatidan o'tganligini va «UzAuto Trailer» MCHJ tovar belgisiga bo'lgan mutlaq huquqlarini tasdiqlovchi rasmiy hujjatlar.",
        docsTitle: "Rasmiy hujjatlar",
        zoomHint: "Batafsil ko'rish uchun hujjat ustiga bosing",
        docTypes: [
            { id: 1, title: "Ro'yxatdan o'tganlik guvohnomasi", year: "2012", img: cert1 },
            { id: 2, title: "Ishlab chiqarish litsenziyasi", year: "2015", img: cert2 },
            { id: 3, title: "Tovar belgisi guvohnomasi", year: "2021", img: cert3 },
            { id: 4, title: "Guvohnomaga ilova", year: "2021", img: cert4 }
        ],
        protectionTitle: "Huquqiy himoya",
        protectionDesc: "«UzAuto Trailer» tovar belgisi korxonaning intellektual mulki hisoblanadi va O'zbekiston Respublikasi qonuni bilan himoya qilinadi. Brenddan ruxsatsiz foydalanish qonunchilikka muvofiq javobgarlikka sabab bo'ladi."
    },
    en: {
        heroTitle: "Registration & Trademark",
        introText: "Official documents confirming the state registration of the enterprise and exclusive rights to the 'UzAuto Trailer' trademark.",
        docsTitle: "Official Documents",
        zoomHint: "Click on the document for a detailed view",
        docTypes: [
            { id: 1, title: "Registration Certificate", year: "2012", img: cert1 },
            { id: 2, title: "Production License", year: "2015", img: cert2 },
            { id: 3, title: "Trademark Certificate", year: "2021", img: cert3 },
            { id: 4, title: "Appendix to Certificate", year: "2021", img: cert4 }
        ],
        protectionTitle: "Legal Protection",
        protectionDesc: "The 'UzAuto Trailer' trademark is the intellectual property of the enterprise and is protected by the laws of the Republic of Uzbekistan."
    }
};

const RegistrationInfo = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [selectedImgIndex, setSelectedImgIndex] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [lastDistance, setLastDistance] = useState(0);
    const imgRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    const handleNextImage = () => {
        setSelectedImgIndex((prev) => (prev + 1) % t.docTypes.length);
        setZoomLevel(1);
        setPanX(0);
        setPanY(0);
    };

    const handlePrevImage = () => {
        setSelectedImgIndex((prev) => (prev - 1 + t.docTypes.length) % t.docTypes.length);
        setZoomLevel(1);
        setPanX(0);
        setPanY(0);
    };

    const handleCloseModal = () => {
        setSelectedImgIndex(null);
        setZoomLevel(1);
        setPanX(0);
        setPanY(0);
    };

    // Mouse handlers for dragging zoomed image
    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoomLevel > 1) {
            const newPanX = e.clientX - dragStart.x;
            const newPanY = e.clientY - dragStart.y;
            setPanX(newPanX);
            setPanY(newPanY);
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    // Touch events for mobile pinch & zoom
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            setLastDistance(distance);
        } else if (e.touches.length === 1 && zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (lastDistance > 0) {
                const scale = distance / lastDistance;
                setZoomLevel((prev) => Math.max(1, Math.min(3, prev * scale)));
            }
            setLastDistance(distance);
        } else if (isDragging && e.touches.length === 1) {
            setPanX(e.touches[0].clientX - dragStart.x);
            setPanY(e.touches[0].clientY - dragStart.y);
        }
    };

    const selectedImage = selectedImgIndex !== null ? t.docTypes[selectedImgIndex] : null;

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter min-h-screen">
            {/* 1. HERO SECTION */}
            <section className="relative h-[250px] md:h-[450px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 z-10"></div>
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5 }}
                    src={heroImg}
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                    alt="Background"
                />
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-7xl font-semibold text-white tracking-tighter uppercase">
                        {t.heroTitle}
                    </motion.h1>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 lg:px-12 -mt-12 relative z-30">
                {/* 2. INTRODUCTION */}
                <div className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-16 shadow-xl border border-gray-100 mb-12 md:mb-20">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-[#0054A6] w-8 h-8" />
                        </div>
                        <p className="text-lg md:text-2xl font-medium text-gray-600 leading-relaxed">
                            {t.introText}
                        </p>
                    </div>
                </div>

                {/* 3. DOCUMENTS GRID */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b pb-8">
                        <div className="flex items-center gap-4">
                            <FileText className="text-[#0054A6] w-7 h-7" />
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#1a2e44]">{t.docsTitle}</h2>
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mt-2 md:mt-0">{t.zoomHint}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {t.docTypes.map((doc, i) => (
                            <motion.div
                                key={doc.id}
                                whileHover={{ y: -10 }}
                                className="group cursor-zoom-in"
                                onClick={() => setSelectedImgIndex(i)}
                            >
                                <div className="relative aspect-[1/1.4] bg-white rounded-[32px] overflow-hidden shadow-lg border-8 border-white">
                                    <img src={doc.img} className="w-full h-full object-cover" alt={doc.title} />
                                    <div className="absolute inset-0 bg-[#0054A6]/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <div className="bg-white/90 p-4 rounded-full text-[#0054A6] shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                                            <ZoomIn className="w-8 h-8" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <span className="text-[10px] font-black text-[#0054A6] uppercase tracking-widest mb-2 block">{doc.year} Year</span>
                                    <h4 className="text-[15px] font-bold text-[#1a2e44] leading-tight">{doc.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#0a1425]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                    >
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[10001]">
                            <div className="text-white text-sm font-semibold">{selectedImgIndex + 1} / {t.docTypes.length}</div>
                            <button onClick={handleCloseModal} className="text-white hover:text-red-500 p-2 cursor-pointer"><X size={32} /></button>
                        </div>

                        <motion.div 
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={() => setIsDragging(false)}
                        >
                            <motion.img
                                src={selectedImage.img}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg select-none"
                                animate={{ scale: zoomLevel, x: panX, y: panY }}
                                transition={{ type: 'spring', damping: 25 }}
                                onMouseDown={handleMouseDown}
                                draggable={false}
                            />
                        </motion.div>

                        {/* Navigation */}
                        <button onClick={handlePrevImage} className="absolute left-4 p-4 text-white/40 hover:text-white transition-colors cursor-pointer"><ChevronLeft size={48} /></button>
                        <button onClick={handleNextImage} className="absolute right-4 p-4 text-white/40 hover:text-white transition-colors cursor-pointer"><ChevronRight size={48} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RegistrationInfo;