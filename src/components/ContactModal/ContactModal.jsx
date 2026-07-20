'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, CheckCircle2, User, Loader2, ShieldCheck, Send, MessageCircle, Bot, Minus } from 'lucide-react';
import API from '../../api/axios';

// Environment variablesdan foydalanamiz (Xavfsizlik uchun)
const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN || '8607165005:AAH98FISY0M_ubhPYqF3klRQbuy34K5rHGU';
const CHANNEL_ID = process.env.NEXT_PUBLIC_CHANNEL_ID || '-1003693722283';

const translations = {
    ru: {
        chatTitle: "Оператор",
        online: "Онлайн",
        greeting: "Здравствуйте! Как я могу вам помочь сегодня?",
        requestTitle: "Заказать звонок",
        requestSubtitle: "Мы перезвоним вам в течение 15 минут.",
        nameLabel: "Ваше имя",
        phoneLabel: "Номер телефона",
        msgPlaceholder: "Напишите сообщение...",
        btnSend: "Отправить",
        success: "Принято!",
        privacy: "Ваши данные защищены",
        error: "Ошибка при отправке. Попробуйте еще раз.",
        phoneError: "Введите только цифры"
    },
    uz: {
        chatTitle: "Operator",
        online: "Onlayn",
        greeting: "Assalomu alaykum! Sizga qanday yordam bera olaman?",
        requestTitle: "Qo'ng'iroq buyurtma qilish",
        requestSubtitle: "Biz sizga 15 daqiqa ichida qo'ng'iroq qilamiz.",
        nameLabel: "Ismingiz",
        phoneLabel: "Telefon raqamingiz",
        msgPlaceholder: "Xabaringizni yozing...",
        btnSend: "Yuborish",
        success: "Qabul qilindi!",
        privacy: "Ma'lumotlar himoyalangan",
        error: "Yuborishda xatolik. Qaytadan urinib ko'ring.",
        phoneError: "Faqat raqam yozing"
    },
    en: {
        chatTitle: "Operator",
        online: "Online",
        greeting: "Hello! How can we help you today?",
        requestTitle: "Request a call",
        requestSubtitle: "We will call you back within 15 minutes.",
        nameLabel: "Your name",
        phoneLabel: "Phone number",
        msgPlaceholder: "Type a message...",
        btnSend: "Send",
        success: "Success!",
        privacy: "Your data is protected",
        error: "Error sending. Please try again.",
        phoneError: "Enter only numbers"
    }
};

const ContactModal = ({ lang = 'ru' }) => {
    const [isOpenCall, setIsOpenCall] = useState(false);
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [formData, setFormData] = useState({ name: '', phone: '+998 ' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const t = translations[lang] || translations.ru;
    const scrollRef = useRef(null);

    const handlePhoneChange = (e) => {
        let input = e.target.value;
        if (/[a-zA-Zа-яА-Я]/.test(input)) {
            setPhoneError(true);
            setTimeout(() => setPhoneError(false), 2000);
            return;
        }
        let cleaned = input.replace(/[^0-9+ ]/g, '');
        let numbersOnly = cleaned.replace(/\D/g, '');

        if (numbersOnly.startsWith('998')) {
            let formatted = '+998';
            if (numbersOnly.length > 3) formatted += ' ' + numbersOnly.substring(3, 5);
            if (numbersOnly.length > 5) formatted += ' ' + numbersOnly.substring(5, 8);
            if (numbersOnly.length > 8) formatted += ' ' + numbersOnly.substring(8, 10);
            if (numbersOnly.length > 10) formatted += ' ' + numbersOnly.substring(10, 12);
            setFormData({ ...formData, phone: formatted.trim() });
        } else {
            setFormData({ ...formData, phone: cleaned });
        }
    };

    const handlePhoneFocus = () => {
        if (!formData.phone || formData.phone.trim() === '') {
            setFormData({ ...formData, phone: '+998 ' });
        }
    };

    useEffect(() => {
        if (isOpenChat && messages.length === 0) {
            setMessages([{ id: 1, text: t.greeting, sender: 'bot' }]);
        }
    }, [isOpenChat, t.greeting]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const newMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages([...messages, newMsg]);
        setInputValue("");
    };

    const handleCallSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const telegramMsg = `📞 *ЗАКАЗ ЗВОНКА*\n\n👤 *Имя:* ${formData.name}\n📞 *Телефон:* ${formData.phone}`;

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHANNEL_ID, text: telegramMsg, parse_mode: "Markdown" }),
            });

            // CRM-ga yuborish
            API.post('/crm', { name: formData.name, phone: formData.phone }).catch(() => { });

            setIsSent(true);
            setTimeout(() => {
                setIsOpenCall(false);
                setIsSent(false);
                setFormData({ name: '', phone: '+998 ' });
                setIsLoading(false);
            }, 3000);
        } catch (error) {
            console.error("Xatolik:", error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake-input { animation: shake 0.2s ease-in-out 0s 2; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>

            <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 items-end">
                <motion.button
                    onClick={() => setIsOpenCall(true)}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0054A6] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative"
                >
                    <span className="absolute inset-0 rounded-full bg-[#0054A6] animate-ping opacity-20"></span>
                    <Phone size={24} className="relative z-10" />
                </motion.button>
            </div>

            {/* CALL MODAL */}
            <AnimatePresence>
                {isOpenCall && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isLoading && setIsOpenCall(false)} className="absolute inset-0 bg-[#0a1425]/80 backdrop-blur-lg" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-[400px] rounded-[32px] overflow-hidden shadow-2xl p-8 sm:p-10" >
                            <button onClick={() => setIsOpenCall(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 p-1"><X size={22} /></button>

                            {!isSent ? (
                                <form onSubmit={handleCallSubmit} className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-semibold text-[#1a2e44] mb-2">{t.requestTitle}</h2>
                                        <p className="text-gray-400 text-sm font-normal">{t.requestSubtitle}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input required placeholder={t.nameLabel} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#f8f9fb] border border-gray-100 rounded-2xl px-12 py-4 text-sm outline-none focus:bg-white focus:border-[#0054A6]/30 transition-all text-black" />
                                        </div>

                                        <div className="relative">
                                            <AnimatePresence>
                                                {phoneError && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute -top-7 left-4 bg-red-500 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase shadow-sm z-20">
                                                        {t.phoneError}
                                                        <div className="absolute -bottom-1 left-3 w-2 h-2 bg-red-500 rotate-45"></div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${phoneError ? 'text-red-500' : 'text-gray-300'}`} size={18} />
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onFocus={handlePhoneFocus}
                                                onChange={handlePhoneChange}
                                                className={`w-full bg-[#f8f9fb] border rounded-2xl px-12 py-4 text-sm outline-none transition-all text-black ${phoneError ? 'border-red-400 shake-input' : 'border-gray-100 focus:bg-white focus:border-[#0054A6]/30'}`}
                                            />
                                        </div>
                                    </div>
                                    <button disabled={isLoading} className="w-full bg-[#0054A6] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-[#004488] transition-all flex items-center justify-center gap-2">
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : t.btnSend}
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-gray-400 opacity-60">
                                        <ShieldCheck size={14} /><span className="text-[10px] uppercase tracking-widest font-medium">{t.privacy}</span>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={48} className="text-green-500" /></div>
                                    <h3 className="text-2xl font-semibold text-[#1a2e44] mb-2">{t.success}</h3>
                                    <p className="text-gray-400 font-normal">{lang === 'uz' ? 'Tez orada bog\'lanamiz.' : 'Мы скоро свяжемся с вами.'}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ContactModal;