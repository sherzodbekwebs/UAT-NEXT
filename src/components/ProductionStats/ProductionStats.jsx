'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Container, Box, Lightbulb, Settings2 } from 'lucide-react';
import API from '../../api/axios';

// Next.js da public ichidagi rasmlar import qilinmaydi, string yo'li yoziladi
const buildingImg = '/bgcompany.png';

const translations = {
    ru: {
        title: "Производственные показатели",
        subtitle: "Статистика достижений UzAuto Trailer",
        labels: {
            trucks: "Большегрузные автомобили",
            semiTrailers: "Полуприцепы",
            trailers: "Прицепы",
            superstructures: "Надстройки для шасси",
            projects: "Собственные разработки"
        }
    },
    uz: {
        title: "Ishlab chiqarish ko'rsatkichlari",
        subtitle: "UzAuto Trailer yutuqlari statistikasi",
        labels: {
            trucks: "Og'ir yuk avtomobillari",
            semiTrailers: "Yarim tirkamalar",
            trailers: "Tirkamalar",
            superstructures: "Shassi ustqurmalari",
            projects: "O'zimizning loyihalar"
        }
    },
    en: {
        title: "Production performance",
        subtitle: "Statistics of UzAuto Trailer achievements",
        labels: {
            trucks: "Heavy duty trucks",
            semiTrailers: "Semi-trailers",
            trailers: "Trailers",
            superstructures: "Chassis superstructures",
            projects: "In-house developments"
        }
    }
};

const Counter = ({ value }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const stringValue = String(value).replace(/\s/g, '');
        const end = parseInt(stringValue) || 0;
        if (end === 0) { setCount(0); return; }
        
        let start = 0;
        let duration = 2000;
        let steps = 40;
        let increment = Math.ceil(end / steps);
        
        let counter = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(counter);
            } else {
                setCount(start);
            }
        }, duration / steps);
        
        return () => clearInterval(counter);
    }, [value]);

    return <span>{count.toLocaleString('fr-FR').replace(',', ' ')}</span>;
};

const ProductionStats = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get('/settings');
                const data = response.data;
                const mapping = [
                    { label: t.labels.trucks, key: "Og'ir yuk avtomobillari", icon: <Truck size={24} /> },
                    { label: t.labels.semiTrailers, key: "Yarim tirkamalar", icon: <Container size={24} /> },
                    { label: t.labels.trailers, key: "Tirkamalar", icon: <Box size={24} /> },
                    { label: t.labels.superstructures, key: "Shassi ustqurmalari", icon: <Settings2 size={24} /> },
                    { label: t.labels.projects, key: "O'zimizning loyihalar", icon: <Lightbulb size={24} /> },
                ];
                const formattedStats = mapping.map(m => {
                    const found = data.find(item => item.key === m.key);
                    return { label: m.label, value: found ? found.value : "0", icon: m.icon };
                });
                setStats(formattedStats);
            } catch (err) { console.error("Statistikani yuklashda xato:", err); }
        };
        fetchStats();
    }, [lang, t]);

    return (
        <section className="relative w-full py-24 lg:py-36 overflow-hidden bg-[#0a192f]">
            <div className="absolute inset-0 z-0">
                {/* Rasm yo'li to'g'irlandi */}
                <img src={buildingImg} className="w-full h-full object-cover brightness-[0.4]" alt="background" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/80 via-[#0a192f]/60 to-[#0a192f]/90" />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16">
                <div className="mb-16 lg:mb-20 text-left">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-[2px] bg-blue-500" />
                        <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">UzAuto Trailer</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        {t.title}
                    </motion.h2>
                    <p className="text-gray-300 mt-6 text-lg max-w-xl font-medium opacity-80">{t.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-500 flex flex-col justify-between h-full min-h-[220px]"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {stat.icon}
                                </div>
                                <div className="text-white text-4xl lg:text-5xl font-bold mb-4 flex items-baseline gap-1">
                                    <Counter value={stat.value} />
                                    <span className="text-blue-500 text-2xl">+</span>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm font-semibold leading-snug opacity-90 group-hover:text-white transition-colors">
                                {stat.label}
                            </p>
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-blue-500 transition-all duration-500 group-hover:w-full rounded-b-2xl" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default ProductionStats;