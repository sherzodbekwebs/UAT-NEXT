'use client'; // 1. BU SHART! (hooks va motion ishlatilgan)

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ZoomIn, X, Loader2
} from 'lucide-react';

// Markaziy API importi
import API, { API_URL } from '../../api/axios';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, string yo'li yoziladi
const heroImg = '/technologies_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "Технологии и оборудование",
        breadcrumb: "Главная > Производство > Технологии",
        intro: "Производственный комплекс ООО «UzAuto Trailer» оснащен самым современным оборудованием от ведущих мировых производителей.",
        loading: "Загрузка оборудования...",
        noData: "Оборудование не найдено",
        zoomHint: "Нажмите для увеличения. В режиме зума можно перетаскивать rasm."
    },
    uz: {
        heroTitle: "Texnologiyalar va uskunalar",
        breadcrumb: "Bosh sahifa > Ishlab chiqarish > Texnologiyalar",
        intro: "«UzAuto Trailer» MCHJ ishlab chiqarish majmuasi jahonning yetakchi ishlab chiqaruvchilarining eng zamonaviy uskunalari bilan jihozlangan.",
        loading: "Uskunalar yuklanmoqda...",
        noData: "Uskunalar topilmadi",
        zoomHint: "Kattalashtirish uchun bosing. Kattalashtirilganda rasmni surish mumkin."
    },
    en: {
        heroTitle: "Technologies & Equipment",
        breadcrumb: "Home > Production > Technologies",
        intro: "UzAuto Trailer's production complex is equipped with state-of-the-art machinery from world leaders.",
        loading: "Loading equipment...",
        noData: "No equipment found",
        zoomHint: "Click to zoom. When zoomed, you can drag the image."
    }
};

const Technologies = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedImg, setSelectedImg] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const containerRef = useRef(null);

    const getVal = (item, field) => {
        if (!item) return "";
        const currentLang = lang || 'ru';
        const langSuffix = currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
        return item[`${field}${langSuffix}`] || item[`${field}Ru`] || "";
    };

    // Rasm URL-ni tozalash (double slash xatosini oldini oladi)
    const formatImgUrl = (path) => {
        if (!path) return "";
        return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
    };

    useEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo(0, 0);

        const fetchTech = async () => {
            try {
                setLoading(true);
                // Axios orqali ma'lumot olish
                const res = await API.get('/tech-equipment');
                if (Array.isArray(res.data)) {
                    setEquipment(res.data.filter(item => item.isActive));
                }
            } catch (error) {
                console.error("Uskunalarni yuklashda xato:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTech();
    }, []);

    const groupedEquipment = equipment.reduce((acc, item) => {
        const sectionName = getVal(item, 'section') || "Other";
        if (!acc[sectionName]) acc[sectionName] = [];
        acc[sectionName].push(item);
        return acc;
    }, {});

    const toggleZoom = (e) => {
        e.stopPropagation();
        setIsZoomed(!isZoomed);
    };

    const closeLightbox = () => {
        setSelectedImg(null);
        setIsZoomed(false);
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-gray-400 gap-4 bg-white">
                <Loader2 className="animate-spin text-[#0054A6]" size={40} />
                <p className="font-bold uppercase tracking-widest text-[10px]">{t.loading}</p>
            </div>
        );
    }

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter min-h-screen pb-20 overflow-x-hidden">
            {/* HERO */}
            <section className="relative h-[250px] lg:h-[400px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-transparent to-[#0a1425] z-10"></div>
                <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" alt="Tech Background" />
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-center lg:text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{t.breadcrumb}</span>
                        <h1 className="text-3xl lg:text-6xl font-semibold text-white uppercase">{t.heroTitle}</h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 lg:px-12 -mt-12 relative z-30 space-y-16 lg:space-y-24">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 lg:p-12 rounded-[30px] lg:rounded-[40px] shadow-xl border border-gray-100 mx-auto max-w-5xl">
                    <p className="text-base lg:text-xl font-medium text-[#1a2e44] leading-relaxed text-center lg:text-justify">{t.intro}</p>
                </motion.div>

                {Object.keys(groupedEquipment).map((sectionTitle, sIdx) => (
                    <div key={sIdx} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <h2 className="text-xl lg:text-3xl font-black text-[#1a2e44] uppercase tracking-tighter text-center px-4">{sectionTitle}</h2>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedEquipment[sectionTitle].map((item) => (
                                <motion.div 
                                    key={item.id} 
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group transition-all hover:shadow-2xl"
                                >
                                    <div className="relative h-48 lg:h-56 overflow-hidden cursor-zoom-in" onClick={() => setSelectedImg(formatImgUrl(item.image))}>
                                        <img src={formatImgUrl(item.image)} alt={getVal(item, 'title')} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 p-3 rounded-full text-[#0054A6] shadow-xl"><ZoomIn size={24} /></div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-center text-center">
                                        <h3 className="text-sm lg:text-base font-bold text-[#1a2e44] leading-snug group-hover:text-[#0054A6] transition-colors">{getVal(item, 'title')}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#0a1425]/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-[10001] bg-gradient-to-b from-black/50 to-transparent">
                            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] ml-4">
                                {isZoomed ? "DRAG TO MOVE • CLICK TO RESET" : t.zoomHint}
                            </span>
                            <button onClick={closeLightbox} className="text-white hover:text-red-500 transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full mr-4 cursor-pointer">
                                <X size={28} />
                            </button>
                        </div>

                        <div 
                            ref={containerRef}
                            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                            onClick={closeLightbox}
                        >
                            <motion.img
                                key={selectedImg}
                                src={selectedImg}
                                alt="Full View"
                                drag={isZoomed}
                                dragConstraints={containerRef}
                                dragElastic={0.1}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ 
                                    scale: isZoomed ? 2.5 : 1,
                                    opacity: 1,
                                    x: isZoomed ? undefined : 0,
                                    y: isZoomed ? undefined : 0
                                }}
                                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                                onClick={toggleZoom}
                                className="max-w-[90%] max-h-[85vh] object-contain shadow-2xl rounded-lg select-none"
                                style={{ touchAction: 'none' }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Technologies;