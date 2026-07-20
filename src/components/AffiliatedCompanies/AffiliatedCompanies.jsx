"use client"; // 1. Klient komponent ekanini bildiramiz

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Building2, 
    MapPin, 
    Phone, 
    Mail, 
    Globe, 
    ArrowUpRight, 
    Briefcase,
    Link as LinkIcon
} from 'lucide-react';

// 2. Public papkasidagi rasmni import qilmasdan, shunchaki yo'lini yozamiz
const heroImg = '/afif_hero_page.jpg';

const translations = {
    ru: {
        heroTitle: "Дочерние компании",
        foundersTitle: "Учредители предприятия:",
        contactLabels: {
            email: "Почта:",
            phone: "Контакты:",
            location: "Локация:",
            map: "Посмотреть на карте",
            website: "Веб-сайт:"
        },
        loading: "Загрузка компаний...",
        noData: "Компании не найдены"
    },
    uz: {
        heroTitle: "Sho'ba korxonalar",
        foundersTitle: "Korxona muassislari:",
        contactLabels: {
            email: "Pochta:",
            phone: "Kontaktlar:",
            location: "Manzil:",
            map: "Xaritada ko'rish",
            website: "Veb-sayt:"
        },
        loading: "Yuklanmoqda...",
        noData: "Kompaniyalar topilmadi"
    },
    en: {
        heroTitle: "Affiliated Companies",
        foundersTitle: "Founders of the enterprise:",
        contactLabels: {
            email: "E-mail:",
            phone: "Contacts:",
            location: "Location:",
            map: "View on map",
            website: "Website:"
        },
        loading: "Loading...",
        noData: "No companies found"
    }
};

const AffiliatedCompanies = ({ lang = 'ru' }) => {
    // 3. Environment variables Next.js da NEXT_PUBLIC_ bilan boshlanishi kerak
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const t = translations[lang] || translations.ru;

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/affiliated`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCompanies(data.filter(item => item.isActive));
                }
            } catch (error) {
                console.error("Kompaniyalarni yuklashda xatolik:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [API_BASE_URL]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    const getField = (item, fieldBase) => {
        if (!item) return "";
        const currentLang = lang || 'ru';
        const fieldName = `${fieldBase}${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
        return item[fieldName] || item[`${fieldBase}Ru`] || "";
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse font-bold text-[#0054A6] uppercase tracking-widest">{t.loading}</div>
        </div>
    );

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter min-h-screen pb-16 lg:pb-32">
            
            {/* 1. HERO SECTION */}
            <section className="relative h-[250px] lg:h-[400px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-transparent to-[#0a1425] z-10"></div>
                <motion.img 
                    initial={{ scale: 1.2, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 0.3 }} 
                    transition={{ duration: 1.5 }}
                    src={heroImg}
                    className="absolute inset-0 w-full h-full object-cover grayscale" 
                    alt="Industrial Background" 
                />
                <div className="relative z-20 max-w-[1440px] mx-auto px-4 lg:px-12 w-full">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Our Partners</span>
                        <h1 className="text-3xl lg:text-6xl font-semibold text-white tracking-tighter uppercase">
                            {t.heroTitle}
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 lg:px-12 -mt-10 lg:-mt-12 relative z-30 space-y-12 lg:space-y-20">
                
                {companies.length > 0 ? companies.map((company) => (
                    <div key={company.id} id={company.slug || company.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch scroll-mt-28">
                        
                        {/* LEFT: LOGO & INFO */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="lg:col-span-8 bg-white rounded-[30px] lg:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                        >
                            <div className="md:w-1/3 bg-[#F8FAFC] flex items-center justify-center p-8 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100">
                                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 lg:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 w-full max-w-[200px] md:max-w-none">
                                    {company.logo && (
                                        <img 
                                            src={`${API_BASE_URL}/${company.logo}`.replace(/([^:]\/)\/+/g, "$1")} 
                                            alt={getField(company, 'title')} 
                                            className="w-full h-auto object-contain" 
                                        />
                                    )}
                                </motion.div>
                            </div>
                            
                            <div className="md:w-2/3 p-6 lg:p-12 space-y-6 lg:space-y-8">
                                <div>
                                    <h2 className="text-xl lg:text-3xl font-bold text-[#1a2e44] mb-3 tracking-tight uppercase">
                                        {getField(company, 'title')}
                                    </h2>
                                    <p className="text-[#0054A6] font-bold text-xs lg:text-base leading-relaxed">
                                        {getField(company, 'status')}
                                    </p>
                                </div>

                                <p className="text-gray-500 text-sm lg:text-lg leading-relaxed font-medium text-justify">
                                    {getField(company, 'desc')}
                                </p>

                                <div className="pt-6 lg:pt-8 border-t border-gray-50">
                                    <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 mb-4 uppercase">{t.foundersTitle}</h4>
                                    <div className="flex items-start lg:items-center gap-4 p-4 lg:p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <Briefcase className="text-[#0054A6] shrink-0" size={20} />
                                        <p className="text-[#1a2e44] font-bold text-sm lg:text-[15px]">{getField(company, 'founders')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT: CONTACT SIDEBAR */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="lg:col-span-4 bg-[#1a2e44] rounded-[30px] lg:rounded-[40px] p-6 lg:p-10 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden"
                        >
                            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#0054A6]/30 rounded-full blur-[100px]"></div>
                            
                            <div className="relative z-10 space-y-8 lg:space-y-10">
                                {company.email && (
                                    <div className="space-y-2 lg:space-y-3">
                                        <div className="flex items-center gap-2 text-blue-300 font-bold text-[9px] lg:text-[10px] tracking-[0.3em] uppercase opacity-90">
                                            <Mail size={14} className="text-[#0054A6] brightness-150" /> {t.contactLabels.email}
                                        </div>
                                        <a href={`mailto:${company.email}`} className="text-lg lg:text-xl font-bold hover:text-blue-300 transition-colors block border-b border-white/5 pb-2 break-all">
                                            {company.email}
                                        </a>
                                    </div>
                                )}

                                {company.phone && (
                                    <div className="space-y-2 lg:space-y-3">
                                        <div className="flex items-center gap-2 text-blue-300 font-bold text-[9px] lg:text-[10px] tracking-[0.3em] uppercase opacity-90">
                                            <Phone size={14} className="text-[#0054A6] brightness-150" /> {t.contactLabels.phone}
                                        </div>
                                        <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="text-xl lg:text-2xl font-black tracking-tighter hover:text-blue-300 transition-colors block">
                                            {company.phone}
                                        </a>
                                    </div>
                                )}

                                {getField(company, 'address') && (
                                    <div className="space-y-3 lg:space-y-4">
                                        <div className="flex items-center gap-2 text-blue-300 font-bold text-[9px] lg:text-[10px] tracking-[0.3em] uppercase opacity-90">
                                            <MapPin size={14} className="text-[#0054A6] brightness-150" /> {t.contactLabels.location}
                                        </div>
                                        <p className="text-xs lg:text-[15px] font-medium leading-relaxed text-gray-300">
                                            {getField(company, 'address')}
                                        </p>
                                        {company.mapLink && (
                                            <a 
                                                href={company.mapLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-[10px] font-black text-white bg-[#0054A6] px-5 py-2.5 rounded-full uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                                            >
                                                {t.contactLabels.map} <ArrowUpRight size={14} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {company.website && (
                                <div className="relative z-10 mt-10 lg:mt-12 pt-6 lg:pt-8 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[9px] lg:text-[10px] tracking-[0.3em] uppercase mb-4 lg:mb-5">
                                        <Globe size={14} /> {t.contactLabels.website}
                                    </div>
                                    <motion.a 
                                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -4 }}
                                        className="flex items-center justify-between p-4 lg:p-5 bg-white rounded-2xl text-[#1a2e44] font-black text-xs lg:text-sm uppercase tracking-widest shadow-xl"
                                    >
                                        {company.website.replace(/^https?:\/\//, '')}
                                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                            <LinkIcon size={16} className="text-[#0054A6]" />
                                        </div>
                                    </motion.a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )) : (
                    <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-3xl border border-dashed">
                        {t.noData}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AffiliatedCompanies;