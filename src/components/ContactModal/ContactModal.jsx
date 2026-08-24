'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Portaldan foydalanamiz
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, CheckCircle2, User, Loader2, MessageSquare } from 'lucide-react';

const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN || '8607165005:AAH98FISY0M_ubhPYqF3klRQbuy34K5rHGU';
const CHANNEL_ID = process.env.NEXT_PUBLIC_CHANNEL_ID || '-1003693722283';

const translations = {
    ru: {
        requestTitle: "Заказать звонок",
        requestSubtitle: "Оставьте заявку, и мы свяжемся с вами.",
        nameLabel: "Ваше имя",
        phoneLabel: "Номер телефона",
        messageLabel: "Ваше сообщение",
        btnSend: "Отправить",
        success: "Принято!",
        successDesc: "Мы скоро свяжемся с вами."
    },
    uz: {
        requestTitle: "Bog'lanish",
        requestSubtitle: "Ma'lumotlaringizni qoldiring, biz bog'lanamiz.",
        nameLabel: "Ismingiz",
        phoneLabel: "Telefon raqamingiz",
        messageLabel: "Xabaringiz",
        btnSend: "Yuborish",
        success: "Qabul qilindi!",
        successDesc: "Tez orada bog'lanamiz."
    }
};

const ContactModal = ({ lang = 'ru' }) => {
    const [isOpenCall, setIsOpenCall] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '+998 ', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Dom tayyor bo'lganini tekshirish (Portal uchun kerak)
    useEffect(() => {
        setMounted(true);
    }, []);

    const t = translations[lang] || translations.ru;

    const handleCallSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const telegramMsg = `🔔 *НОВАЯ ЗАЯВКА*\n👤 *Имя:* ${formData.name}\n📞 *Телефон:* ${formData.phone}${formData.message ? `\n💬 *Сообщение:* ${formData.message}` : ''}`;
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHANNEL_ID, text: telegramMsg, parse_mode: "Markdown" }),
            });
            setIsSent(true);
            setTimeout(() => {
                setIsOpenCall(false);
                setIsSent(false);
                setFormData({ name: '', phone: '+998 ', message: '' });
                setIsLoading(false);
            }, 3000);
        } catch (error) {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <>
            <style>{`
                @keyframes phone-shake {
                    0% { transform: rotate(0deg); }
                    10% { transform: rotate(-10deg); }
                    20% { transform: rotate(12deg); }
                    30% { transform: rotate(-10deg); }
                    40% { transform: rotate(9deg); }
                    50% { transform: rotate(0deg); }
                }
                .animate-phone-shake { animation: phone-shake 2s infinite ease-in-out; }
            `}</style>

            {/* 1. DESKTOP TUGMA - Navbar ichida qoladi */}
            <div className="hidden min-[1201px]:block ml-4 shrink-0">
                <motion.button
                    onClick={() => setIsOpenCall(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg relative cursor-pointer"
                >
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></span>
                    <div className="animate-phone-shake relative z-10">
                        <Phone size={20} fill="currentColor" />
                    </div>
                </motion.button>
            </div>

            {/* 2. MOBILE TUGMA - Portal orqali body-ga ko'chiriladi */}
            {mounted && createPortal(
                <div className="min-[1201px]:hidden">
                    <motion.button
                        onClick={() => setIsOpenCall(true)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0061A4] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,97,164,0.5)] z-[10000] cursor-pointer"
                    >
                        <span className="absolute inset-0 rounded-full bg-[#0061A4] animate-ping opacity-30"></span>
                        <div className="animate-phone-shake relative z-10">
                            <Phone size={24} fill="currentColor" />
                        </div>
                    </motion.button>
                </div>,
                document.body
            )}

            {/* 3. MODAL - Portal orqali body-ga ko'chiriladi */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpenCall && (
                        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                                onClick={() => !isLoading && setIsOpenCall(false)} 
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                            />
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                                className="relative bg-white w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-10"
                            >
                                <button onClick={() => setIsOpenCall(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                                {!isSent ? (
                                    <form onSubmit={handleCallSubmit} className="space-y-4">
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-bold text-[#1a2e44]">{t.requestTitle}</h2>
                                            <p className="text-gray-500 text-sm mt-1">{t.requestSubtitle}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input required placeholder={t.nameLabel} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-12 py-3.5 text-black outline-none focus:ring-2 focus:ring-[#0061A4]/20 transition-all" />
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-12 py-3.5 text-black outline-none focus:ring-2 focus:ring-[#0061A4]/20 transition-all" />
                                            </div>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
                                                <textarea placeholder={t.messageLabel} rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-12 py-3.5 text-black outline-none focus:ring-2 focus:ring-[#0061A4]/20 transition-all resize-none" />
                                            </div>
                                        </div>
                                        <button disabled={isLoading} className="w-full bg-[#0061A4] text-white py-4 rounded-xl font-bold uppercase text-sm hover:bg-[#004e82] transition-all flex items-center justify-center gap-2 mt-2">
                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : t.btnSend}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-10">
                                        <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold">{t.success}</h3>
                                        <p className="text-gray-500 mt-2">{t.successDesc}</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default ContactModal;