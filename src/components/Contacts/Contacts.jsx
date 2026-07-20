'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Clock, Phone, Mail,
    Copy, ExternalLink, Send,
    Globe, Instagram, Facebook, Youtube, Send as TelegramIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const BOT_TOKEN = '8607165005:AAH98FISY0M_ubhPYqF3klRQbuy34K5rHGU'
const CHANNEL_ID = '-1003693722283'

const translations = {
    ru: {
        title: "Контакты",
        subtitle: "Свяжитесь с нами любым удобным способом или посетите наш офис",
        our_address: "Наш адрес",
        headOffice: "Головной офис",
        production: "Производство",
        callCenter: "Единый call-центр",
        email_label: "Для связи",
        workHours: "График работы",
        weekdays_title: "Понедельник - Пятница",
        weekdays_time: "09:00 - 18:00",
        weekend: "Суббота - Воскресенье",
        closed: "Выходной",
        tashkent: "г. Ташкент, ул. Мирзо-Улугбека, 30",
        samarkand: "Самаркандская обл., Жамбайский р-н, г. Жамбай, ул. Ташкентская, 2",
        form_title: "Напишите нам",
        name_label: "Ваше имя",
        phone_label: "Телефон",
        msg_placeholder: "Введите ваше сообщение...",
        send_btn: "Отправить сообщение",
        sending_btn: "Отправка...",
        copy: "Копировать",
        view_map: "Открыть в картах",
        map_title: "Мы на карте",
        social_title: "Мы в соцсетях",
        phoneError: "Введите только цифры"
    },
    uz: {
        title: "Aloqa",
        subtitle: "Biz bilan o'zingizga qulay usulda bog'laning yoki ofisimizga tashrif buyuring",
        our_address: "Bizning manzil",
        headOffice: "Bosh ofis",
        production: "Ishlab chiqarish",
        callCenter: "Yagona call-markaz",
        email_label: "Aloqa uchun",
        workHours: "Ish tartibi",
        weekdays_title: "Dushanba - Juma",
        weekdays_time: "09:00 - 18:00",
        weekend: "Shanba - Yakshanba",
        closed: "Dam olish kuni",
        tashkent: "Toshkent sh., Mirzo-Ulug'bek ko'chasi, 30",
        samarkand: "Samarqand vil., Jomboy tumani, Jomboy sh., Toshkent ko'chasi, 2",
        form_title: "Bizga yozing",
        name_label: "Ismingiz",
        phone_label: "Telefon raqamingiz",
        msg_placeholder: "Xabaringizni yozing...",
        send_btn: "Xabarni yuborish",
        sending_btn: "Yuborilmoqda...",
        copy: "Nusxalash",
        view_map: "Xaritada ochish",
        map_title: "Xaritadagi joylashuvimiz",
        social_title: "Ijtimoiy tarmoqlarimiz",
        phoneError: "Faqat raqam yozing"
    },
    en: {
        title: "Contacts",
        subtitle: "Contact us in any convenient way or visit our office",
        our_address: "Our address",
        headOffice: "Head Office",
        production: "Production",
        callCenter: "Unified call center",
        email_label: "For inquiries",
        workHours: "Working hours",
        weekdays_title: "Monday - Friday",
        weekdays_time: "09:00 - 18:00",
        weekend: "Saturday - Sunday",
        closed: "Closed",
        tashkent: "Tashkent city, Mirzo-Ulugbek street, 30",
        samarkand: "Samarkand region, Jambay district, Jambay city, Tashkent street, 2",
        form_title: "Write to us",
        name_label: "Your name",
        phone_label: "Phone number",
        msg_placeholder: "Enter your message...",
        send_btn: "Send message",
        sending_btn: "Sending...",
        copy: "Copy",
        view_map: "Open in maps",
        map_title: "Our location on the map",
        social_title: "Our social networks",
        phoneError: "Enter only numbers"
    }
};

const Contacts = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [activeLocation, setActiveLocation] = useState('tashkent');

    // --- Boshlang'ich holatga +998 ni qo'shdik ---
    const [formData, setFormData] = useState({ name: '', phone: '+998 ', message: '' });
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePhoneChange = (e) => {
        let input = e.target.value;

        // Harflarni tekshirish
        if (/[a-zA-Zа-яА-Я]/.test(input)) {
            setPhoneError(true);
            setTimeout(() => setPhoneError(false), 2000);
            return;
        }

        let cleaned = input.replace(/[^0-9+ ]/g, '');
        let numbersOnly = cleaned.replace(/\D/g, '');

        // Agar O'zbekiston raqami bo'lsa, formatlash
        if (numbersOnly.startsWith('998')) {
            let formatted = '+998';
            if (numbersOnly.length > 3) formatted += ' ' + numbersOnly.substring(3, 5);
            if (numbersOnly.length > 5) formatted += ' ' + numbersOnly.substring(5, 8);
            if (numbersOnly.length > 8) formatted += ' ' + numbersOnly.substring(8, 10);
            if (numbersOnly.length > 10) formatted += ' ' + numbersOnly.substring(10, 12);
            // Limit yo'q - 12 tadan oshsa ham cleaned qismini qo'shish mumkin, 
            // lekin uzb formati uchun shunchasi yetarli.
            setFormData({ ...formData, phone: formatted.trim() });
        } else {
            // Xalqaro raqamlar uchun cheklovsiz yozish
            setFormData({ ...formData, phone: cleaned });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success(lang === 'ru' ? 'Скопировано!' : 'Nusxalandi!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Markdown o'rniga HTML ishlatish xavfsizroq
        const telegramMsg = `<b>📩 YANGI MUROJAAT</b>\n\n` +
            `<b>👤 Ismi:</b> ${formData.name}\n` +
            `<b>📞 Telefoni:</b> ${formData.phone}\n` +
            `<b>💬 Xabari:</b> ${formData.message}`;

        try {
            // 1. Telegramga yuborish
            const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: telegramMsg,
                    parse_mode: "HTML" // Markdown o'rniga HTML
                }),
            });

            const tgResult = await tgResponse.json();

            if (!tgResult.ok) {
                console.error("Telegram API xatosi:", tgResult.description);
                // Agar bot xatosi bo'lsa, bu yerda bilib olasiz
            }

            // 2. Bazaga yozish
            const dbResponse = await API.post('/crm', {
                name: formData.name,
                phone: formData.phone
            });

            // Agar har ikkalasi yoki hech bo'lmasa DB muvaffaqiyatli bo'lsa
            toast.success(lang === 'ru' ? 'Сообщение отправлено!' : 'Xabaringiz yuborildi!');
            setFormData({ name: '', phone: '+998 ', message: '' });

        } catch (error) {
            console.error("Umumiy xatolik:", error);
            toast.error(lang === 'ru' ? 'Ошибка при отправке' : 'Yuborishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const socialLinks = [
        { name: "Telegram", url: "https://t.me/uatproductsbot", icon: <TelegramIcon size={24} />, brandColor: "#229ED9" },
        { name: "Instagram", url: "https://www.instagram.com/uzautotrailer_official", icon: <Instagram size={24} />, brandColor: "#E1306C" },
        { name: "Facebook", url: "https://www.facebook.com/UzAutoTrailerofficial", icon: <Facebook size={24} />, brandColor: "#1877F2" },
        { name: "YouTube", url: "https://www.youtube.com/@UzAutoTrailer/videos", icon: <Youtube size={24} />, brandColor: "#FF0000" }
    ];

    const mapUrls = {
        tashkent: "https://yandex.uz/map-widget/v1/?ll=69.31980%2C41.31940&z=19&pt=69.31980,41.31940,pm2rdm",
        samarkand: "https://yandex.uz/map-widget/v1/?ll=67.076356%2C39.690112&z=19&pt=67.076356,39.690112,pm2rdm"
    };

    return (
        <div className="pt-15 pb-20 bg-[#F8FAFC] font-inter text-[#1a2e44]">
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake-input { animation: shake 0.2s ease-in-out 0s 2; }
            `}</style>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="text-center mb-16 space-y-4">
                    <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-5xl lg:text-6xl font-bold tracking-tight ">
                        {t.title}
                    </motion.h1>
                    <p className="text-gray-500 text-lg font-normal max-w-2xl mx-auto">{t.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* LEFT COLUMN: Addresses & Socials */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-[#0061A4] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                    <MapPin size={22} />
                                </div>
                                <h3 className="text-lg font-bold tracking-wider">{t.our_address}</h3>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <button onClick={() => setActiveLocation('tashkent')} className={`px-6 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all ${activeLocation === 'tashkent' ? 'bg-[#0061A4] text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{t.headOffice}</button>
                                <button onClick={() => setActiveLocation('samarkand')} className={`px-6 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all ${activeLocation === 'samarkand' ? 'bg-[#0061A4] text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{t.production}</button>
                            </div>
                            <p className="text-gray-600 font-normal leading-relaxed text-base">{activeLocation === 'tashkent' ? t.tashkent : t.samarkand}</p>
                            <div className="flex items-center gap-3">
                                <a href={activeLocation === 'tashkent' ? "https://yandex.uz/maps/org/234745806070/" : "https://yandex.uz/maps/org/242429445745/"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold tracking-widest hover:bg-red-700 transition-all shadow-md"><ExternalLink size={14} /> {t.view_map}</a>
                                <button onClick={() => copyToClipboard(activeLocation === 'tashkent' ? t.tashkent : t.samarkand)} className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold tracking-widest hover:bg-gray-100 transition-all border border-gray-100"><Copy size={14} /> {t.copy}</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 font-semibold text-[10px] tracking-widest"><Phone size={14} className="text-[#0061A4]" /> {t.callCenter}</div>
                                    <a href="tel:+998712023223" className="text-2xl font-bold hover:text-[#0061A4] transition-colors block">+998 71 202 32 23</a>
                                    <a href="tel:+998712028866" className="text-2xl font-bold hover:text-[#0061A4] transition-colors block">+998 71 202 88 66</a>

                                </div>
                                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 font-semibold text-[10px] tracking-widest"><Mail size={14} className="text-[#0061A4]" /> Email</div>
                                    <a href="mailto:info@trailer.uz" className="text-2xl font-bold hover:text-[#0061A4] transition-colors block ">info@trailer.uz</a>
                                    <a href="mailto:marketing@trailer.uz" className="text-2xl font-bold hover:text-[#0061A4] transition-colors block ">marketing@trailer.uz</a>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center gap-3 text-gray-400 font-semibold text-[10px] tracking-widest"><Globe size={14} className="text-[#0061A4]" /> {t.social_title}</div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {socialLinks.map((social, i) => (
                                        <a key={i} href={social.url} target="_blank" rel="noreferrer" className="group relative flex items-center justify-center p-4 bg-gray-50 rounded-2xl transition-all duration-300 shadow-sm hover:bg-gray-100">
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-top-12 transition-all duration-200 whitespace-nowrap z-10 pointer-events-none shadow-xl">{social.name}<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div></div>
                                            {React.cloneElement(social.icon, { color: social.brandColor, className: "transition-transform duration-300 group-hover:scale-110" })}
                                        </a>
                                    ))}
                                </div>
                                <p className="text-[9px] text-gray-300 font-bold tracking-widest text-center mt-6 ">Follow us online</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 text-gray-400 font-semibold text-[10px] tracking-widest"><Clock size={14} className="text-[#0061A4]" /> {t.workHours}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50"><span className="font-medium text-gray-500 text-sm">{t.weekdays_title}</span><span className="font-bold text-gray-800">{t.weekdays_time}</span></div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50"><span className="font-medium text-gray-500 text-sm">{t.weekend}</span><span className="font-bold text-red-500 text-[11px]">{t.closed}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.04)] sticky top-32">
                            <h3 className="text-2xl font-bold mb-8 ">{t.form_title}</h3>
                            <form className="space-y-6 text-[#1a2e44]" onSubmit={handleSubmit}>
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 tracking-widest ml-1">{t.name_label}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-1 focus:ring-[#0061A4] outline-none font-medium text-sm mt-1"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="text-[10px] font-semibold text-gray-400 tracking-widest ml-1">{t.phone_label}</label>

                                    <AnimatePresence>
                                        {phoneError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                                className="absolute -top-6 left-1 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-md font-bold uppercase shadow-sm z-20"
                                            >
                                                {t.phoneError}
                                                <div className="absolute -bottom-1 left-3 w-1.5 h-1.5 bg-red-500 rotate-45"></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        className={`w-full p-4 bg-gray-50 border transition-all rounded-2xl outline-none font-medium text-sm mt-1 ${phoneError ? 'border-red-400 shake-input bg-red-50/10' : 'border-transparent focus:ring-1 focus:ring-[#0061A4]'}`}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 tracking-widest ml-1">Сообщение</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-1 focus:ring-[#0061A4] outline-none font-medium text-sm mt-1 resize-none"
                                        placeholder={t.msg_placeholder}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-[#0061A4] text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] shadow-lg shadow-blue-900/10 hover:bg-[#004A7D] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {loading ? t.sending_btn : <><Send size={16} /> {t.send_btn}</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* MAP SECTION */}
                <div className="mt-20 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold tracking-[0.2em] text-gray-400 ">{t.map_title}</h2>
                        <div className="w-12 h-1 bg-gray-200 mx-auto rounded-full"></div>
                    </div>
                    <div className="bg-white p-3 rounded-[40px] border border-gray-100 shadow-sm h-[500px] overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.iframe key={activeLocation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} src={mapUrls[activeLocation]} className="w-full h-full rounded-[32px] contrast-[1.02] grayscale-[0.1]" style={{ border: 0 }} allowFullScreen="" loading="lazy"></motion.iframe>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacts;