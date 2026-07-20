"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, SearchX, MapPin, Clock,
    Search, X, FilePlus, CheckCircle2, ListChecks, Target, Loader2
} from 'lucide-react';

// Markaziy API importi
import API from '../../api/axios';

// Environment variables
const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN;
const CHANNEL_ID = process.env.NEXT_PUBLIC_CHANNEL_ID;

// Rasm yo'li (Public papkasidan)
const heroImg = '/carrers_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "Карьера в компании",
        noVacancies: "Открытых вакансий пока нет",
        noVacanciesDesc: "Следите за обновлениями, мы постоянно растем и ищем талантливых специалистов.",
        applyBtn: "Откликнуться",
        details: "Подробнее",
        searchPlaceholder: "Поиск по вакансиям...",
        loadingVacancies: "Загрузка вакансий...",
        categories: { all: "Все", production: "Производство", office: "Офис", tech: "Тех. отдел" },
        modal: {
            requirements: "Требования",
            duties: "Обязанности",
            formTitle: "Анкета кандидата",
            fio: "Ф.И.О.",
            phone: "Номер телефона",
            upload: "Загрузить резюме (PDF, DOCX)",
            submit: "Отправить анкету",
            success: "Ваше резюме успешно отправлено!"
        }
    },
    uz: {
        heroTitle: "Kompaniyadagi karyera",
        noVacancies: "Hozircha bo'sh ish o'rinlari mavjud emas",
        noVacanciesDesc: "Yangiliklarni kuzatib boring, biz doimiy ravishda o'sib bormoqdamiz.",
        applyBtn: "Ariza topshirish",
        details: "Batafsil",
        searchPlaceholder: "Vakansiyalar bo'yicha qidiruv...",
        loadingVacancies: "Vakansiyalar yuklanmoqda...",
        categories: { all: "Barchasi", production: "Ishlab chiqarish", office: "Ofis", tech: "Texnik bo'lim" },
        modal: {
            requirements: "Talablar",
            duties: "Vazifalar",
            formTitle: "Nomzod anketasi",
            fio: "F.I.SH.",
            phone: "Telefon raqami",
            upload: "Rezyume yuklash (PDF, DOCX)",
            submit: "Anketani yuborish",
            success: "Rezyumeingiz muvaffaqiyatli yuborildi!"
        }
    },
    en: {
        heroTitle: "Careers",
        noVacancies: "No open vacancies",
        noVacanciesDesc: "Stay tuned for updates, we are constantly growing.",
        applyBtn: "Apply Now",
        details: "Details",
        searchPlaceholder: "Search vacancies...",
        loadingVacancies: "Loading vacancies...",
        categories: { all: "All", production: "Production", office: "Office", tech: "Technical" },
        modal: {
            requirements: "Requirements",
            duties: "Responsibilities",
            formTitle: "Candidate Form",
            fio: "Full Name",
            phone: "Phone Number",
            upload: "Upload CV (PDF, DOCX)",
            submit: "Submit Application",
            success: "Your application sent!"
        }
    }
};

const Careers = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [vacancies, setVacancies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState('all');
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [applyVacancy, setApplyVacancy] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', file: null });

    useEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo(0, 0);

        const fetchVacancies = async () => {
            try {
                setPageLoading(true);
                // Axios orqali ma'lumot olish
                const res = await API.get('/vacancies');
                setVacancies(res.data);
            } catch (error) {
                console.error("Vakansiyalarni yuklashda xato:", error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchVacancies();
    }, []);

    const getVal = (v, key) => {
        if (!v) return "";
        const currentLang = lang || 'ru';
        const fieldName = `${key}${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
        return v[fieldName] || v[`${key}Ru`] || "";
    };

    const filteredVacancies = Array.isArray(vacancies) ? vacancies.filter(v => {
        const title = getVal(v, 'title')?.toLowerCase() || "";
        const matchesSearch = title.includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || v.category === activeTab;
        return matchesSearch && matchesTab;
    }) : [];

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!form.file) return alert("Please upload CV");
        setIsLoading(true);

        const caption = `📄 *НОВОЕ РЕЗЮМЕ*\n\n` +
            `💼 *Вакансия:* ${getVal(applyVacancy, 'title')}\n` +
            `👤 *Ф.И.О:* ${form.name}\n` +
            `📞 *Телефон:* ${form.phone}\n` +
            `🌐 *Язык:* ${lang.toUpperCase()}`;

        const formData = new FormData();
        formData.append('chat_id', CHANNEL_ID);
        formData.append('document', form.file);
        formData.append('caption', caption);
        formData.append('parse_mode', 'Markdown');

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsSent(true);
                setTimeout(() => {
                    setIsSent(false);
                    setApplyVacancy(null);
                    setForm({ name: '', phone: '', file: null });
                }, 3000);
            }
        } catch (error) {
            console.error("Telegram error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-0 bg-[#F8FAFC] min-h-screen font-inter pb-10">

            {/* HERO */}
            <section className="relative h-[250px] lg:h-[400px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80 z-10"></div>
                <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" alt="Careers" />
                <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-5xl lg:text-7xl font-semibold text-white tracking-tighter uppercase text-center lg:text-left leading-tight">
                        {t.heroTitle}
                    </motion.h1>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-10 lg:-mt-12 relative z-30">

                {/* SEARCH & FILTERS */}
                <div className="bg-white rounded-2xl lg:rounded-[32px] p-4 lg:p-6 shadow-xl border border-gray-100 mb-8 lg:mb-12 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {Object.entries(t.categories).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all ${activeTab === key ? 'bg-[#0054A6] text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTENT */}
                {pageLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-bold uppercase tracking-widest text-xs">{t.loadingVacancies}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredVacancies.length > 0 ? (
                            filteredVacancies.map((v) => (
                                <motion.div
                                    key={v.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl lg:rounded-[32px] p-5 lg:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                                >
                                    <div className="flex items-center gap-4 lg:gap-6">
                                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-50 rounded-xl lg:rounded-2xl flex items-center justify-center text-[#0054A6] group-hover:bg-[#0054A6] group-hover:text-white transition-all duration-500 shrink-0">
                                            <Briefcase size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg lg:text-xl font-bold text-[#1a2e44] leading-tight">{getVal(v, 'title')}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><MapPin size={12} /> {getVal(v, 'loc')}</span>
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-[#0054A6] uppercase tracking-widest"><Clock size={12} /> {v.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full md:w-auto gap-2 lg:gap-3">
                                        <button onClick={() => setSelectedVacancy(v)} className="flex-1 md:flex-none px-5 lg:px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-[10px] lg:text-xs uppercase hover:bg-gray-100 transition-all">
                                            {t.details}
                                        </button>
                                        <button onClick={() => setApplyVacancy(v)} className="flex-1 md:flex-none px-5 lg:px-6 py-3 bg-[#0054A6] text-white rounded-xl font-bold text-[10px] lg:text-xs uppercase hover:bg-blue-700 shadow-lg shadow-blue-900/10 transition-all">
                                            {t.applyBtn}
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[40px] p-12 lg:p-20 border border-dashed border-gray-200 flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200"><SearchX size={40} /></div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2e44] ">{t.noVacancies}</h2>
                                <p className="text-gray-400 max-w-md text-sm lg:text-base font-medium">{t.noVacanciesDesc}</p>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {selectedVacancy && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVacancy(null)} className="absolute inset-0 bg-[#0a1425]/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setSelectedVacancy(null)} className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-10"><X size={18} /></button>
                            <div className="p-8 lg:p-12">
                                <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2e44] mb-2">{getVal(selectedVacancy, 'title')}</h2>
                                <p className="text-[#0054A6] font-bold text-xs lg:text-sm uppercase tracking-widest mb-8">{getVal(selectedVacancy, 'dept')}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-left">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-gray-400"><ListChecks size={16} /> {t.modal.requirements}</h4>
                                        <ul className="space-y-2.5">
                                            {(getVal(selectedVacancy, 'req') || []).map((r, i) => (
                                                <li key={i} className="text-sm font-semibold text-gray-600 flex gap-2"><div className="w-1.5 h-1.5 bg-[#0054A6] rounded-full mt-1.5 shrink-0" /> {r}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-gray-400"><Target size={16} /> {t.modal.duties}</h4>
                                        <ul className="space-y-2.5">
                                            {(getVal(selectedVacancy, 'duty') || []).map((d, i) => (
                                                <li key={i} className="text-sm font-semibold text-gray-600 flex gap-2"><div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 shrink-0" /> {d}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedVacancy(null); setApplyVacancy(selectedVacancy); }} className="w-full mt-10 bg-[#0054A6] py-4 lg:py-5 rounded-2xl text-white font-bold uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl">
                                    {t.applyBtn}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* APPLY FORM MODAL */}
            <AnimatePresence>
                {applyVacancy && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isLoading && setApplyVacancy(null)} className="absolute inset-0 bg-[#0a1425]/90 backdrop-blur-xl" />
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-3xl lg:rounded-[40px] p-8 lg:p-10 shadow-2xl">
                            <button onClick={() => setApplyVacancy(null)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black"><X size={20} className="w-5 h-5" /></button>

                            {!isSent ? (
                                <form onSubmit={handleApplySubmit} className="space-y-5 lg:space-y-6">
                                    <div className="text-center mb-6 lg:mb-8">
                                        <h2 className="text-xl lg:text-2xl font-bold text-[#1a2e44] mb-1">{t.modal.formTitle}</h2>
                                        <p className="text-xs font-bold text-[#0054A6] uppercase tracking-widest">{getVal(applyVacancy, 'title')}</p>
                                    </div>
                                    <input required type="text" placeholder={t.modal.fio} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 transition-all text-black" />
                                    <input required type="tel" placeholder={t.modal.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 transition-all text-black" />

                                    <label className={`flex flex-col items-center justify-center w-full h-28 lg:h-32 border-2 border-dashed rounded-2xl lg:rounded-[32px] cursor-pointer transition-all ${form.file ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <div className="flex flex-col items-center justify-center text-center px-4">
                                            {form.file ? (
                                                <><CheckCircle2 size={24} className="text-green-500 mb-1" /><p className="text-[10px] font-bold text-green-700 truncate max-w-[200px]">{form.file.name}</p></>
                                            ) : (
                                                <><FilePlus size={24} className="text-gray-400 mb-1" /><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t.modal.upload}</p></>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" required onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
                                    </label>

                                    <button type="submit" disabled={isLoading} className="w-full bg-[#0054A6] py-4 lg:py-5 rounded-2xl text-white font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3">
                                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : t.modal.submit}
                                    </button>
                                </form>
                            ) : (
                                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center py-10">
                                    <CheckCircle2 size={64} className="text-green-500 mx-auto mb-5" />
                                    <h3 className="text-xl lg:text-2xl font-bold text-[#1a2e44] mb-2">{t.modal.success}</h3>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>
                {`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>
        </div>
    );
};

export default Careers;