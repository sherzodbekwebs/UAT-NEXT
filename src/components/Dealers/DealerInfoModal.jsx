"use client"; // 1. BU SHART (Framer Motion va eventlar uchun)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Clock, Globe, PhoneCall, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const DealerInfoModal = ({ isOpen, onClose, dealer, lang, t }) => {
    // Modal yopiq bo'lsa yoki diler tanlanmagan bo'lsa hech narsa qaytarmaymiz
    if (!isOpen || !dealer) return null;

    const getLangField = (field) => {
        if (!lang) return dealer[`${field}Ru`] || "";
        const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
        return dealer[`${field}${suffix}`] || dealer[`${field}Ru`] || "";
    };

    const copyToClipboard = (text) => {
        if (!text || text === "—") return;
        
        // Next.js da navigator faqat brauzerda mavjudligini tekshiramiz
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(text);
            toast.success(lang === 'uz' ? 'Nusxalandi!' : 'Скопировано!');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6">
                
                <style>{`
                    .modal-scroll::-webkit-scrollbar { width: 4px; }
                    .modal-scroll::-webkit-scrollbar-track { background: transparent; }
                    .modal-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                    .modal-scroll { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
                `}</style>

                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#001C4D]/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
                >
                    {/* 1. Chap tomon: MAP */}
                    <div className="relative w-full md:w-[42%] h-48 md:h-auto bg-slate-100 border-r border-gray-100">
                        {dealer.link ? (
                            <iframe 
                                src={dealer.link.replace('https://yandex.uz/maps/', 'https://yandex.uz/map-widget/v1/')}
                                className="w-full h-full border-0 grayscale-[0.2] contrast-[1.05]"
                                allowFullScreen
                                title="Map"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                <Globe size={40} className="text-blue-200 animate-pulse" />
                            </div>
                        )}
                        <button onClick={onClose} className="md:hidden absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
                            <X size={20} className="text-black" />
                        </button>
                    </div>

                    {/* 2. O'ng tomon: INFO */}
                    <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto modal-scroll relative text-black">
                        {/* Desktop yopish tugmasi */}
                        <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all z-10">
                            <X size={24} />
                        </button>

                        <div className="mb-5">
                            <div className="flex gap-2 mb-2">
                                <span className="bg-green-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{t?.official || 'Official'}</span>
                                <span className="bg-orange-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{t?.service || 'Service'}</span>
                            </div>
                            <h2 className="text-xl md:text-2xl lg:text-2xl font-black text-[#1a2e44] leading-tight pr-6">
                                {getLangField('name')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={13} /> {lang === 'uz' ? 'Manzil' : 'Адрес'}
                                </label>
                                <p className="text-[13px] md:text-[14px] font-bold leading-relaxed">
                                    {getLangField('address')}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={13} /> {lang === 'uz' ? 'Ish tartibi' : 'График работы'}
                                </label>
                                <div className="text-[13px] font-bold text-gray-500 space-y-0.5 bg-gray-50 p-3 rounded-2xl">
                                    <p className="flex justify-between"><span>Пн-Пт:</span> <span className="text-[#1a2e44]">09:00 - 18:00</span></p>
                                    <p className="flex justify-between"><span>Сб:</span> <span className="text-[#1a2e44]">09:00 - 15:00</span></p>
                                </div>
                            </div>

                            <div className="sm:col-span-2 pt-4 border-t border-gray-50">
                                <div className="flex flex-wrap gap-3">
                                    <div onClick={() => copyToClipboard(dealer.phone)} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 cursor-pointer hover:border-blue-300 transition-all group">
                                        <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:scale-105 transition-transform"><Phone size={14} /></div>
                                        <span className="text-[14px] font-black tracking-tight">{dealer.phone || "—"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3 sticky bottom-0 bg-white pt-2">
                            <a 
                                href={`tel:${dealer.phone}`}
                                className="flex-1 h-12 bg-[#0054A6] hover:bg-[#004285] text-white rounded-xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-[0.98]"
                            >
                                <PhoneCall size={18} />
                                {lang === 'uz' ? 'Qo\'ng\'iroq' : 'Позвонить'}
                            </a>
                            {dealer.link && (
                                <button 
                                    onClick={() => typeof window !== 'undefined' && window.open(dealer.link, '_blank')}
                                    className="px-5 h-12 bg-gray-100 hover:bg-gray-200 text-[#1a2e44] rounded-xl flex items-center justify-center transition-all shadow-sm"
                                >
                                    <MapPin size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DealerInfoModal;