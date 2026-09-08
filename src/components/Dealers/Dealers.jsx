'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Search, Globe, PhoneCall, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // React Query qo'shildi
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import DealerInfoModal from '../../components/Dealers/DealerInfoModal';

const ACCENT = '#0061A4';

const Dealers = () => {
    const { lang } = useLanguage();

    // Modal uchun statelar
    const [selectedDealer, setSelectedDealer] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const [selectedRegion, setSelectedRegion] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const cleanName = (name) => {
        if (!name) return "";
        return name.replace(/ООО|MCHJ|«|»|"|'|“|”/g, '').trim().toLowerCase();
    };

    // --- 1. MA'LUMOTLARNI KESH BILAN OLISH (React Query) ---
    const { data: dealers = [], isLoading } = useQuery({
        queryKey: ['dealers'],
        queryFn: async () => {
            const res = await api.get('/dealers');
            // Faqat aktiv dilerlarni saralab olamiz
            return res.data.filter(d => d.isActive);
        },
        staleTime: 1000 * 60 * 10, // 10 daqiqa davomida backendga qayta so'rov yubormaydi
        gcTime: 1000 * 60 * 30,    // 30 daqiqa keshda saqlaydi
    });

    // --- 2. FILTRLASH VA SARALASH (useMemo orqali tezlashtirildi) ---
    const filteredDealers = useMemo(() => {
        let result = [...dealers];

        // Region bo'yicha filtr
        if (selectedRegion !== 'all') {
            result = result.filter(d => d.categoryRu === selectedRegion || d.categoryUz === selectedRegion);
        }

        // Qidiruv bo'yicha filtr
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(d =>
                (d.nameRu || "").toLowerCase().includes(query) ||
                (d.nameUz || "").toLowerCase().includes(query) ||
                (d.addressRu || "").toLowerCase().includes(query)
            );
        }

        // Alifbo tartibida saralash
        return result.sort((a, b) => cleanName(a.nameRu).localeCompare(cleanName(b.nameRu)));
    }, [selectedRegion, searchTerm, dealers]);

    // Regionlar ro'yxatini shakllantirish
    const regions = useMemo(() => {
        return ['all', ...new Set(dealers.map(d => d.categoryRu).filter(Boolean))];
    }, [dealers]);

    // Modalni ochish funksiyasi
    const handleDealerClick = (dealer) => {
        setSelectedDealer(dealer);
        setIsInfoOpen(true);
    };

    const getLangField = (obj, field) => {
        const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
        return obj[`${field}${suffix}`] || obj[`${field}Ru`] || "";
    };

    const t = {
        uz: { title: "Dilerlik tarmog'i", subtitle: "Yaqin atrofdagi dilerlik markazini toping", official: "Rasmiy diler", service: "Servis markazi", search: "Diler qidirish...", found: "Topilgan dilerlar", all: "Barcha", call: "Qo'ng'iroq", loc: "Lokatsiya" },
        ru: { title: "Дилерская сеть", subtitle: "Найдите ближайший дилерский центр", official: "Официальный дилер", service: "Сервисный центр", search: "Поиск дилера...", found: "Найдено дилеров", all: "Все", call: "Звонок", loc: "Локация" },
        en: { title: "Dealer Network", subtitle: "Find the nearest dealership", official: "Official Dealer", service: "Service Center", search: "Search dealer...", found: "Dealers found", all: "All", call: "Call", loc: "Location" }
    }[lang] || { title: "Дилерская сеть", subtitle: "Найдите ближайший дилерский центр", official: "Официальный дилер", service: "Сервисный центр", all: "Все", search: "Поиск...", found: "Найдено", call: "Звонок", loc: "Локация" };

    return (
        <div className="navbar-roboto-container min-h-screen bg-[#F7F9FB] pt-12 lg:pt-20 pb-24 overflow-x-hidden">
            <style>{`
                .custom-scrollbar-x::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar-x::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar-x::-webkit-scrollbar-thumb { background: ${ACCENT}; border-radius: 10px; }
                .custom-scrollbar-x { scrollbar-width: thin; scrollbar-color: ${ACCENT} #f1f5f9; }
                .fade-right::after {
                    content: ''; position: absolute; right: 0; top: 0; height: 100%; width: 40px;
                    background: linear-gradient(to right, transparent, white); pointer-events: none;
                }
                @media (min-width: 1024px) { .fade-right::after { display: none; } }
            `}</style>

            <div className="max-w-[1320px] mx-auto px-4 lg:px-10">

                {/* HERO SECTION */}
                <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[28px] lg:text-[52px] font-semibold text-[#101828] mb-3 leading-[1.1] tracking-tight"
                    >
                        {t.title} <span style={{ color: ACCENT }}>UzAuto TRAILER</span>
                    </motion.h1>
                    <p className="text-gray-500 text-[15px] lg:text-[17px] leading-relaxed">{t.subtitle}</p>
                </div>

                {/* FILTERS & SEARCH CONTAINER */}
                <div className="bg-white p-4 lg:p-7 rounded-[26px] shadow-[0_1px_2px_rgba(16,24,40,0.04)] border border-gray-100 mb-7 space-y-5 lg:space-y-6">
                    <div className="relative fade-right">
                        <div className="flex overflow-x-auto lg:flex-wrap lg:justify-center gap-2 pb-2 custom-scrollbar-x">
                            {!isLoading && regions.map((reg) => (
                                <button
                                    key={reg}
                                    onClick={() => setSelectedRegion(reg)}
                                    className={`whitespace-nowrap shrink-0 px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${selectedRegion === reg
                                        ? 'text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                    style={selectedRegion === reg ? { backgroundColor: ACCENT } : undefined}
                                >
                                    {reg === 'all' ? t.all : reg}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative max-w-3xl mx-auto w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-5 py-3.5 lg:py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#0061A4]/30 focus:ring-4 focus:ring-[#0061A4]/10 focus:bg-white transition-all text-[15px] text-[#101828]"
                        />
                    </div>
                </div>

                {/* RESULTS COUNT */}
                <div className="mb-6 flex items-center justify-center lg:justify-start gap-2.5">
                    <span className="text-gray-400 font-medium text-[13px]">{t.found}:</span>
                    {!isLoading ? (
                        <span className="bg-[#101828] text-white px-2.5 py-0.5 rounded-md text-[13px] font-semibold">{filteredDealers.length}</span>
                    ) : (
                        <div className="w-8 h-5 bg-gray-200 animate-pulse rounded-md"></div>
                    )}
                </div>

                {/* GRID SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {!isLoading ? (
                        <AnimatePresence mode='popLayout'>
                            {filteredDealers.map((dealer) => (
                                <motion.div
                                    layout
                                    key={dealer.id}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    onClick={() => handleDealerClick(dealer)}
                                    className="flex flex-col bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_20px_45px_-20px_rgba(16,24,40,0.16)] transition-shadow duration-300 group cursor-pointer"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] font-medium w-fit" style={{ color: ACCENT }}>
                                                    {getLangField(dealer, 'category')}
                                                </span>
                                                <div className="flex flex-wrap gap-1.5 mt-0.5">
                                                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap">
                                                        {t.official}
                                                    </span>
                                                    <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap">
                                                        {t.service}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-[#0061A4] transition-colors">
                                                <Globe size={16} />
                                            </div>
                                        </div>

                                        <h3 className="text-[17px] font-semibold text-[#101828] mb-3 leading-snug group-hover:opacity-80 transition-opacity line-clamp-1">
                                            {getLangField(dealer, 'name')}
                                        </h3>

                                        <div className="space-y-2.5 mb-5 flex-1">
                                            <div className="flex items-start gap-2.5">
                                                <MapPin size={15} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                                                <span className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{getLangField(dealer, 'address')}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <Phone size={15} className="shrink-0" style={{ color: ACCENT }} />
                                                <span className="text-[14px] font-semibold text-[#101828]">{dealer.phone || "—"}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5 mt-auto">
                                            <a
                                                href={`tel:${dealer.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium text-[12px] transition-colors active:scale-95"
                                            >
                                                <PhoneCall size={13} /> {t.call}
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); dealer.link && window.open(dealer.link, '_blank'); }}
                                                className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-[#101828] text-[#101828] hover:text-white py-2.5 rounded-xl font-medium text-[12px] transition-colors active:scale-95"
                                            >
                                                <MapPin size={13} /> {t.loc}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        [...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-[24px] h-64 animate-pulse border border-gray-100"></div>)
                    )}
                </div>

                {/* MODAL KOMPONENTI */}
                <DealerInfoModal
                    isOpen={isInfoOpen}
                    onClose={() => setIsInfoOpen(false)}
                    dealer={selectedDealer}
                    lang={lang}
                    t={t}
                />
            </div>
        </div>
    );
};

export default Dealers;