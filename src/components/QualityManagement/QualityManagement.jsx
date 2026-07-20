'use client'; // 1. BU SHART!

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Target, Award, Users, Heart,
    ArrowRight, X, ZoomIn, Briefcase,
    Activity, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki string yo'li yoziladi
const sertificat1 = '/sertificat1.jpg';
const sertificat2 = '/sertificat2.jpg';
const sertificat3 = '/sertificat3.jpg';
const quality_page_hero = '/quality_page_hero.jpg';

const certificateImages = [sertificat1, sertificat2, sertificat3];

const translations = {
    ru: {
        heroTitle: "Система менеджмента качества",
        visionTitle: "ВИДЕНИЕ",
        visionText: "Наша продукция - самая узнаваемая в Центральной Азии и СНГ.",
        missionTitle: "МИССИЯ",
        missionText: "Укрепление позиций на рынках соседних стран путём продвижения доступной, надёжной и качественной прицепной и навесной техники для большегрузных автотранспортных средств.",
        valuesTitle: "ЦЕННОСТИ, КОТОРЫЕ НАС ОБЪЕДИНЯЮТ",
        value1: { t: "Потребители", d: "удовлетворенность потребителя на первом месте." },
        value2: { t: "Заинтересованные стороны", d: "уважение личных прав и интересов наших сотрудников, требований клиентов, условий взаимодействия, выдвигаемых деловыми партнерами и обществом." },
        value3: { t: "Мотивация персонала", d: "справедливость, предполагающая оплату труда в соответствии с достигнутыми результатами и равные условия для профессионального роста." },
        introText1: "ООО “UzAutoTrailer” является динамично развивающимся предприятием в области производства прицепной и навесной техники для большегрузных автотранспортных средств, коммерческих автотранспортных средств.",
        introText2: "Политика в области качества ООО “UzAutoTrailer” направлена на постоянное повышение степени удовлетворенности потребителей качеством поставляемой продукции.",
        introText3: "Предприятие ставит своей целью обеспечить потребности внутреннего и внешнего рынка, таким образом, чтобы соотношение цены и качества удовлетворяло потребителей.",
        scopeText: "Областью применения системы менеджмента качества является: проектирование, производство и реализация прицепной и навесной техники.",
        goalsIntro: "В целях повышения конкурентоспособности Предприятия руководство определило следующие направления:",
        goals: [
            "проектирование и освоение производства новых видов продукции;",
            "применение передового технологического оборудования;",
            "расширение рынков сбыта и объема производства;",
            "постоянное совершенствование системы менеджмента качества;",
            "постоянное повышение квалификации персонала;",
            "совершенствование инфраструктуры;",
            "поэтапное снижение себестоимости продукции."
        ],
        obligationsHeader: "ПОЛИТИКА ПРЕДПРИЯТИЯ В ОБЛАСТИ КАЧЕСТВА ОБЯЗЫВАЕТ:",
        mgmtTitle: "Руководителей всех структурных подразделений:",
        mgmtList: [
            "руководствоваться в своей деятельности требованиями настоящей Политики",
            "обеспечить ее понимание и реализацию всеми работниками;",
            "создавать необходимые условия для качественного выполнения работ."
        ],
        staffTitle: "Каждого работника Предприятия:",
        staffList: [
            "понимать требования настоящей политики;",
            "выполнять все требования стандартов ISO 9001:2015;",
            "проявлять творческую инициативу для обеспечения качества."
        ],
        certsTitle: "Сертификация и стандарты"
    },
    uz: {
        heroTitle: "Sifat menejmenti tizimi",
        visionTitle: "ISTIQBOL (VISION)",
        visionText: "Mahsulotlarimiz Markaziy Osiyo va MDHda eng taniqli bo'lishi.",
        missionTitle: "MISSIYA",
        missionText: "Og'ir yuk avtotransport vositalari uchun hamyonbop, ishonchli va yuqori sifatli tirkama hamda osma texnikalarni ilgari surish orqali qo'shni davlatlar bozorida o'rnimizni mustahkamlash.",
        valuesTitle: "BIZNI BIRLASHTIRUVCHI QADRIYATLAR",
        value1: { t: "Iste'molchilar", d: "iste'molchi mamnuniyati biz uchun birinchi o'rinda." },
        value2: { t: "Manfaatdor tomonlar", d: "xodimlarimizning shaxsiy huquqlari va manfaatlarini, mijozlar talablari va hamkorlar manfaatlarini hurmat qilish." },
        value3: { t: "Xodimlarni rag'batlantirish", d: "erishilgan natijalarga muvofiq mehnatga haq to'lash va professional o'sish uchun teng sharoitlar." },
        introText1: "“UzAutoTrailer” MCHJ og'ir yuk avtotransport vositalari va tijorat texnikalari uchun tirkamalar ishlab chiqarish sohasida jadal rivojlanayotgan korxonadir.",
        introText2: "“UzAutoTrailer” MCHJning sifat sohasidagi siyosati ilg'or texnologiyalar va zamonaviy boshqaruv usullarini qo'llash orqali mamnunlik darajasini oshirishga qaratilgan.",
        introText3: "Korxona narx va sifat mutanosibligi iste'molchilarni qoniqtiradigan darajada bozor ehtiyojlarini ta'minlashni maqsad qilgan.",
        scopeText: "Sifat menejmenti tizimi sohasi: og'ir yuk avtotransport vositalari uchun tirkama va osma texnikalarni loyihalash va ishlab chiqarish.",
        goalsIntro: "Korxonaning raqobatbardoshligini oshirish maqsadida rahbariyat quyidagi yo'nalishlarni belgiladi:",
        goals: [
            "yangi turdagi mahsulotlarni loyihalash va o'zlashtirish;",
            "sifatni yaxshilash uchun ilg'or texnologik uskunalarni qo'llash;",
            "sotuv bozorlarini kengaytirish va hajmlarni oshirish;",
            "sifat menejmenti tizimini doimiy takomillashtirish;",
            "xodimlarning malakasini doimiy oshirish;",
            "infratuzilmani takomillashtirish;",
            "tannarxni bosqichma-bosqich pasaytirish."
        ],
        obligationsHeader: "KORXONANING SIFAT SOHASIDAGI SIYOSATI QUYIDAGILARNI MAJBURLAYDI:",
        mgmtTitle: "Barcha tarkibiy bo'linmalar rahbarlarini:",
        mgmtList: [
            "Ushbu Siyosat talablariga amal qilish;",
            "Barcha xodimlar tomonidan tushunilishini ta'minlash;",
            "Sifatli ish uchun zarur sharoitlarni yaratish."
        ],
        staffTitle: "Korxonaning har bir xodimini:",
        staffList: [
            "Siyosat talablarini tushunish;",
            "ISO 9001:2015 standarti talablarini bajarish;",
            "Sifatni yaxshilashda ijodiy tashabbus ko'rsatish."
        ],
        certsTitle: "Sertifikatlash va standartlar"
    }
};

const QualityManagement = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;
    const [selectedCert, setSelectedCert] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState("center");
    const imgRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }, []);

    const handleImageClick = (e) => {
        e.stopPropagation();
        if (isZoomed) {
            setIsZoomed(false);
        } else {
            const rect = imgRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin(`${x}% ${y}%`);
            setIsZoomed(true);
        }
    };

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter overflow-hidden min-h-screen">
            {/* 1. HERO */}
            <section className="relative h-[300px] lg:h-[400px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-transparent to-[#0a1425] z-10"></div>
                <img
                    src={quality_page_hero}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
                    alt="Quality Background"
                />
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">UzAuto Trailer Standards</span>
                        <h1 className="text-3xl lg:text-6xl font-semibold text-white tracking-tighter uppercase">{t.heroTitle}</h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 -mt-10 lg:-mt-16 relative z-30 pb-16 lg:pb-32">
                {/* 2. VISION & MISSION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5 bg-[#0054A6] rounded-[32px] p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
                        <Target className="absolute -right-10 -bottom-10 opacity-10" size={200} />
                        <h4 className="text-[10px] font-black tracking-[0.4em] opacity-70 mb-8 uppercase">{t.visionTitle}</h4>
                        <p className="text-xl lg:text-3xl font-semibold leading-tight">{t.visionText}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-7 bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                        <Globe className="absolute -right-10 -bottom-10 text-gray-50 opacity-50" size={200} />
                        <h4 className="text-[10px] font-black tracking-[0.3em] text-[#0054A6] mb-8 uppercase">{t.missionTitle}</h4>
                        <p className="text-base lg:text-2xl font-semibold text-[#1a2e44] leading-relaxed relative z-10">{t.missionText}</p>
                    </motion.div>
                </div>

                {/* 3. VALUES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {[
                        { ...t.value1, icon: Users, color: "bg-blue-50" },
                        { ...t.value2, icon: Heart, color: "bg-red-50" },
                        { ...t.value3, icon: Award, color: "bg-green-50" }
                    ].map((val, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all text-center">
                            <div className={`w-14 h-14 ${val.color} rounded-2xl flex items-center justify-center mb-8 mx-auto`}>
                                <val.icon className="text-[#0054A6]" size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-[#1a2e44] mb-4">{val.t}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{val.d}</p>
                        </div>
                    ))}
                </div>

                {/* 4. INTRO & GOALS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
                    <div className="lg:col-span-7 space-y-10 text-black">
                        <div className="border-l-4 border-[#0054A6] pl-6">
                            <p className="text-xl lg:text-2xl font-semibold text-[#1a2e44] leading-relaxed">{t.introText1}</p>
                        </div>
                        <div className="space-y-6 text-gray-600 text-base lg:text-lg leading-relaxed text-justify">
                            <p>{t.introText2}</p>
                            <p>{t.introText3}</p>
                            <div className="flex items-center gap-4 p-6 bg-[#0054A6]/5 rounded-2xl border border-[#0054A6]/10 mt-6">
                                <ShieldCheck className="text-[#0054A6] shrink-0" size={24} />
                                <span className="font-bold text-[#1a2e44] text-sm uppercase">{t.scopeText}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-white p-8 lg:p-10 rounded-[40px] shadow-sm border border-gray-100">
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 mb-8 uppercase leading-snug">{t.goalsIntro}</h4>
                        <div className="space-y-3">
                            {t.goals.map((goal, i) => (
                                <div key={i} className="flex gap-4 items-start py-2 border-b border-gray-50 last:border-0">
                                    <ArrowRight size={14} className="text-[#0054A6] mt-1 shrink-0" />
                                    <span className="text-sm lg:text-base text-gray-600 font-semibold">{goal}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. OBLIGATIONS */}
                <div className="bg-[#1a2e44] rounded-[50px] p-8 lg:p-20 text-white shadow-2xl relative overflow-hidden mb-24">
                    <Activity className="absolute -right-20 -top-20 opacity-5" size={400} />
                    <h2 className="text-2xl lg:text-4xl font-semibold mb-16 uppercase tracking-tight relative z-10">{t.obligationsHeader}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl w-fit">
                                <Briefcase className="text-[#0054A6]" size={24} />
                                <h4 className="text-lg font-bold uppercase tracking-wider">{t.mgmtTitle}</h4>
                            </div>
                            <ul className="space-y-5">
                                {t.mgmtList.map((item, i) => (
                                    <li key={i} className="text-gray-300 font-medium text-base leading-relaxed border-l-2 border-white/10 pl-6 hover:border-[#0054A6] transition-all">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl w-fit">
                                <Users className="text-[#0054A6]" size={24} />
                                <h4 className="text-lg font-bold uppercase tracking-wider">{t.staffTitle}</h4>
                            </div>
                            <ul className="space-y-5">
                                {t.staffList.map((item, i) => (
                                    <li key={i} className="text-gray-300 font-medium text-base leading-relaxed border-l-2 border-white/10 pl-6 hover:border-[#0054A6] transition-all">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 6. CERTIFICATES */}
                <div className="text-center mb-16">
                    <h3 className="text-3xl lg:text-4xl font-semibold text-[#1a2e44] uppercase">{t.certsTitle}</h3>
                    <div className="w-20 h-1.5 bg-[#0054A6] mx-auto mt-6 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {certificateImages.map((img, i) => (
                        <div key={i} onClick={() => setSelectedCert(img)} className="relative group cursor-pointer rounded-[32px] overflow-hidden shadow-lg border-8 border-white aspect-[1/1.4]">
                            <img src={img} className="w-full h-full object-cover" alt="Certificate" />
                            <div className="absolute inset-0 bg-[#0054A6]/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <div className="bg-white/90 p-4 rounded-full text-[#0054A6] shadow-xl"><ZoomIn size={28} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 cursor-zoom-out" onClick={() => setSelectedCert(null)}>
                        <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-all"><X size={48} /></button>
                        <motion.img
                            ref={imgRef}
                            src={selectedCert}
                            onClick={handleImageClick}
                            animate={{ scale: isZoomed ? 2 : 1, transformOrigin: zoomOrigin }}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                            alt="Zoomable Certificate"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QualityManagement;