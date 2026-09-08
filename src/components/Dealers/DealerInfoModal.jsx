"use client"; // 1. BU SHART (Framer Motion va eventlar uchun)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Clock, Globe, PhoneCall, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCENT = '#0061A4';

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
                    className="absolute inset-0 bg-[#0B1B2B]/50 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 12 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="relative w-full max-w-4xl bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
                >
                    {/* 1. Chap tomon: MAP */}
                    <div className="relative w-full md:w-[42%] h-48 md:h-auto bg-gray-100 border-r border-gray-100">
                        {dealer.link ? (
                            <iframe
                                src={dealer.link.replace('https://yandex.uz/maps/', 'https://yandex.uz/map-widget/v1/')}
                                className="w-full h-full border-0"
                                allowFullScreen
                                title="Map"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${ACCENT}0D` }}>
                                <Globe size={36} style={{ color: `${ACCENT}55` }} className="animate-pulse" />
                            </div>
                        )}
                        <button onClick={onClose} className="md:hidden absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/85 backdrop-blur-md rounded-full shadow-sm">
                            <X size={18} className="text-[#101828]" />
                        </button>
                    </div>

                    {/* 2. O'ng tomon: INFO */}
                    <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto modal-scroll relative text-[#101828]">
                        {/* Desktop yopish tugmasi */}
                        <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 w-9 h-9 items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10">
                            <X size={20} />
                        </button>

                        <div className="mb-6 pr-8">
                            <div className="flex gap-1.5 mb-3">
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-medium">{t?.official || 'Official'}</span>
                                <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-[10px] font-medium">{t?.service || 'Service'}</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-semibold leading-tight">
                                {getLangField('name')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <label className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: ACCENT }}>
                                    <MapPin size={14} /> {lang === 'uz' ? 'Manzil' : 'Адрес'}
                                </label>
                                <p className="text-[14px] leading-relaxed text-gray-600">
                                    {getLangField('address')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: ACCENT }}>
                                    <Clock size={14} /> {lang === 'uz' ? 'Ish tartibi' : 'График работы'}
                                </label>
                                <div className="text-[13px] text-gray-500 space-y-1 bg-gray-50 p-3 rounded-xl">
                                    <p className="flex justify-between"><span>Пн-Пт:</span> <span className="font-medium text-[#101828]">09:00 - 18:00</span></p>
                                    <p className="flex justify-between"><span>Сб:</span> <span className="font-medium text-[#101828]">09:00 - 15:00</span></p>
                                </div>
                            </div>

                            <div className="sm:col-span-2 pt-5 border-t border-gray-50">
                                <div className="flex flex-wrap gap-3">
                                    <div onClick={() => copyToClipboard(dealer.phone)} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: ACCENT }}>
                                            <Phone size={14} />
                                        </div>
                                        <span className="text-[14px] font-semibold">{dealer.phone || "—"}</span>
                                        <Copy size={13} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3 sticky bottom-0 bg-white pt-2">
                            <a
                                href={`tel:${dealer.phone}`}
                                className="flex-1 h-12 text-white rounded-xl flex items-center justify-center gap-2.5 font-semibold text-[13px] transition-opacity hover:opacity-90 active:scale-[0.98]"
                                style={{ backgroundColor: ACCENT }}
                            >
                                <PhoneCall size={17} />
                                {lang === 'uz' ? 'Qo\'ng\'iroq' : 'Позвонить'}
                            </a>
                            {dealer.link && (
                                <button
                                    onClick={() => typeof window !== 'undefined' && window.open(dealer.link, '_blank')}
                                    className="px-5 h-12 bg-gray-50 hover:bg-gray-100 text-[#101828] rounded-xl flex items-center justify-center transition-colors"
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