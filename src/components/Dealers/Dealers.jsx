'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Search, Globe, PhoneCall, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // React Query qo'shildi
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import DealerInfoModal from '../../components/Dealers/DealerInfoModal';

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
        <div className="navbar-roboto-container min-h-screen bg-[#F8FAFC] pt-10 lg:pt-20 pb-20 overflow-x-hidden">
            <style>{`
                .custom-scrollbar-x::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar-x::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar-x::-webkit-scrollbar-thumb { background: #0054A6; border-radius: 10px; }
                .custom-scrollbar-x { scrollbar-width: thin; scrollbar-color: #0054A6 #f1f5f9; }
                .fade-right::after {
                    content: ''; position: absolute; right: 0; top: 0; height: 100%; width: 40px;
                    background: linear-gradient(to right, transparent, white); pointer-events: none;
                }
                @media (min-width: 1024px) { .fade-right::after { display: none; } }
            `}</style>

            <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

                {/* HERO SECTION */}
                <div className="text-center mb-10 lg:mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[30px] lg:text-[60px] font-black text-[#1a2e44] mb-3 leading-tight"
                    >
                        {t.title} <br className="hidden lg:block" /> <span className="text-[#0054A6]">UzAuto TRAILER</span>
                    </motion.h1>
                    <p className="text-gray-500 text-sm lg:text-lg font-medium max-w-2xl mx-auto">{t.subtitle}</p>
                </div>

                {/* FILTERS & SEARCH CONTAINER */}
                <div className="bg-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] shadow-sm border border-gray-100 mb-8 space-y-6 lg:space-y-8">
                    <div className="relative fade-right">
                        <div className="flex overflow-x-auto lg:flex-wrap lg:justify-center gap-2 lg:gap-3 pb-4 custom-scrollbar-x">
                            {!isLoading && regions.map((reg) => (
                                <button
                                    key={reg}
                                    onClick={() => setSelectedRegion(reg)}
                                    className={`whitespace-nowrap shrink-0 px-4 py-2 lg:px-6 lg:py-3.5 rounded-xl lg:rounded-2xl text-[12px] lg:text-sm font-bold transition-all duration-300 border ${selectedRegion === reg
                                        ? 'bg-[#0054A6] text-white border-[#0054A6] shadow-lg shadow-blue-100'
                                        : 'bg-gray-50 text-gray-500 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    {reg === 'all' ? t.all : reg}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative max-w-3xl mx-auto w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 lg:pl-14 pr-6 py-4 lg:py-5 bg-gray-50 border border-gray-100 rounded-2xl lg:rounded-[22px] outline-none focus:border-[#0054A6] focus:bg-white transition-all font-bold text-sm lg:text-base text-[#1a2e44] shadow-inner"
                        />
                    </div>
                </div>

                {/* RESULTS COUNT */}
                <div className="mb-6 lg:mb-8 flex items-center justify-center lg:justify-start gap-3">
                    <span className="text-gray-400 font-black text-[10px] lg:text-[11px] uppercase tracking-[2px]">{t.found}:</span>
                    {!isLoading ? (
                        <span className="bg-[#1a2e44] text-white px-3 py-1 rounded-lg text-xs lg:text-sm font-black">{filteredDealers.length}</span>
                    ) : (
                        <div className="w-8 h-6 bg-gray-200 animate-pulse rounded-lg"></div>
                    )}
                </div>

                {/* GRID SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {!isLoading ? (
                        <AnimatePresence mode='popLayout'>
                            {filteredDealers.map((dealer) => (
                                <motion.div
                                    layout
                                    key={dealer.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => handleDealerClick(dealer)}
                                    className="flex flex-col bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 group cursor-pointer"
                                >
                                    <div className="h-1.5 w-full bg-[#0054A6]"></div>

                                    <div className="p-6 lg:p-7 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="bg-blue-50 text-[#0054A6] px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit">
                                                    {getLangField(dealer, 'category')}
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-[#22C55E] text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center justify-center whitespace-nowrap">
                                                        {t.official}
                                                    </span>
                                                    <span className="bg-[#F97316] text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center justify-center whitespace-nowrap">
                                                        {t.service}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-[#0054A6] transition-colors border border-gray-100"><Globe size={18} /></div>
                                        </div>

                                        <h3 className="text-[17px] lg:text-[19px] font-black text-[#1a2e44] mb-3 leading-tight group-hover:text-[#0054A6] transition-colors line-clamp-1">
                                            {getLangField(dealer, 'name')}
                                        </h3>

                                        <div className="space-y-2.5 mb-5 text-gray-500 flex-1">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={15} className="shrink-0 text-[#0054A6] mt-0.5" />
                                                <span className="text-[13px] font-bold leading-relaxed line-clamp-2">{getLangField(dealer, 'address')}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={15} className="shrink-0 text-[#0054A6]" />
                                                <span className="text-[14px] font-black text-[#1a2e44]">{dealer.phone || "—"}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-auto">
                                            <a href={`tel:${dealer.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95"><PhoneCall size={14} /> {t.call}</a>
                                            <button onClick={(e) => { e.stopPropagation(); dealer.link && window.open(dealer.link, '_blank'); }} className="flex items-center justify-center gap-2 bg-[#F1F5F9] hover:bg-[#1a2e44] text-[#1a2e44] hover:text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95"><MapPin size={14} /> {t.loc}</button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        [...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-[32px] h-64 animate-pulse border border-gray-100"></div>)
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