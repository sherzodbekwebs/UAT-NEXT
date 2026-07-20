"use client"; // 1. BU JUDA MUHIM: Framer Motion ishlashi uchun shart.

import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Headset, ShoppingBag } from 'lucide-react';

const translations = {
    ru: {
        title: "Свяжитесь с нами",
        subtitle: "Мы всегда готовы помочь вам с выбором и ответить на вопросы",
        callCenter: "Единый call-центр",
        salesDept: "Отдел продаж",
        availability: "Пн-Пт / 9:00 - 18:00"
    },
    uz: {
        title: "Biz bilan bog'laning",
        subtitle: "Biz sizga tanlovda yordam berishga va savollaringizga javob berishga tayyormiz",
        callCenter: "Yagona aloqa markazi",
        salesDept: "Sotuv bo'limi",
        availability: "Du-Ju / 9:00 - 18:00"
    },
    en: {
        title: "Contact Us",
        subtitle: "We are always ready to help you with your choice and answer questions",
        callCenter: "Unified Call-Center",
        salesDept: "Sales Department",
        availability: "Mon-Fri / 9:00 - 18:00"
    }
};

const CallCenter = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    const contacts = [
        {
            label: t.callCenter,
            number: "+998 71 202 32 23",
            link: "tel:+998712023223",
            icon: <Headset className="w-6 h-6" />,
            color: "from-blue-600 to-blue-800"
        },
        {
            label: t.salesDept,
            number: "+998 71 202 88 66",
            link: "tel:+998712028866",
            icon: <ShoppingBag className="w-6 h-6" />,
            color: "from-slate-700 to-slate-900"
        }
    ];

    return (
        <section className="w-full bg-[#fdfdfd] py-16 px-4 md:px-10 lg:px-20 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    
                    {/* Chap tomon: Sarlavhalar */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                                {t.title}
                            </h2>
                            <p className="text-slate-500 text-lg max-w-md mx-auto lg:mx-0">
                                {t.subtitle}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t.availability}
                            </div>
                        </motion.div>
                    </div>

                    {/* O'ng tomon: Raqamlar kartochkalari */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contacts.map((item, idx) => (
                            <motion.a
                                key={idx}
                                href={item.link}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 overflow-hidden"
                            >
                                <div className={`inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                    <span className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {item.number}
                                    </span>
                                </div>

                                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <PhoneCall className="w-5 h-5 text-blue-600" />
                                </div>
                                
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </motion.a>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CallCenter;