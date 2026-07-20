"use client"; // 1. BU SHART! (useEffect va Framer Motion ishlatilgani uchun)

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    Eye,
    Heart,
    ShieldCheck,
    Zap,
    CheckCircle2,
    Users,
    Briefcase,
    ArrowRight
} from 'lucide-react';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki yo'li yoziladi
const heroImg = '/misson_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "Миссия, видение",
        visionTitle: "ВИДЕНИЕ",
        visionText: "Наша продукция – самая узнаваемая в Центральной Азии и СНГ.",
        missionTitle: "МИССИЯ",
        missionText: "Укрепление позиций на рынках соседних стран путём продвижения доступной, надёжной и качественной прицепной и навесной техники для большегрузных автотранспортных средств.",
        valuesTitle: "ЦЕННОСТИ, КОТОРЫЕ НАС ОБЪЕДИНЯЮТ",
        value1: { t: "Потребители", d: "удовлетворенность потребителя на первом месте." },
        value2: { t: "Заинтересованные стороны", d: "уважение личных прав и интересов наших сотрудников, требований клиентов, условий взаимодействия, выдвигаемых деловыми партнерами и обществом." },
        value3: { t: "Мотивация персонала", d: "справедливость, предполагающая оплату труда в соответствии с достигнутыми результатами и равные условия для профессионального роста." },
        introText1: "OОО “UzAutoTrailer” является динамично развивающимся предприятием в области производства прицепной и навесной техники для большегрузных автотранспортных средств, коммерческих автотранспортных средств.",
        introText2: "Политика в области качества ООО “UzAutoTrailer” (далее – Предприятие) направлена на постоянное повышение степени удовлетворенности потребителей качеством поставляемой продукции, которая обеспечивается применением передовых технологий производства, современных методов управления с использованием совершенной инфраструктуры и квалифицированного персонала.",
        introText3: "Предприятие, являясь передовым по производству техники, ставит своей целью обеспечить потребности внутреннего и внешнего рынка так, чтобы соотношение цены и качества удовлетворяло как можно большее число потребителей.",
        scopeText: "Областью применения системы менеджмента качества является: проектирование, производство и реализация прицепной и навесной техники для большегрузных автотранспортных средств.",
        directionsIntro: "В целях повышения конкурентоспособности Предприятия, для удовлетворения постоянно растущих запросов потребителей посредством достижения высокой результативности и эффективности всех процессов ее деятельности, обеспечивающих высокое качество продукции на основе непрерывного целевого планирования, их выполнения, оценки результативности и дальнейших действий по улучшению, руководство Предприятия определило необходимость развития следующих направлений деятельности:",
        directions: [
            "проектирование и освоение производства новых видов продукции;",
            "применение передового технологического оборудования в целях улучшения качества продукции, экономного использования сырьевых и энергетических ресурсов, а также для повышения производительности труда;",
            "расширение рынков сбыта и увеличение объемов реализации и производства продукции;",
            "постоянное совершенствование системы менеджмента качества;",
            "постоянное повышение квалификации персонала и обеспечение соответствующими условиями для их плодотворного труда;",
            "совершенствование инфраструктуры;",
            "поэтапное снижение себестоимости продукции без ущерба качеству производимой продукции."
        ],
        obligationsIntro: "В целях реализации основных направлений развития, высшее руководство Предприятия берет на себя следующие обязательства:",
        obligations: [
            "обеспечить выполнение требований нормативно-правовых актов Республики Узбекистан и международных стандартов;",
            "постоянно повышать результативность и эффективность системы менеджмента качества;",
            "довести до сведения всего персонала основные положения данной политики и требования потребителей;",
            "проводить регулярный анализ функционирования системы менеджмента качества в целях ее улучшения;",
            "анализировать политику и цели в области качества на предмет их постоянной пригодности;",
            "обеспечить ресурсами, необходимые для производства качественной продукции и постоянного развития Предприятия."
        ],
        policyObligationsHeader: "Политика Предприятия в области качества обязывает:",
        mgmtTitle: "Руководителей всех структурных подразделений:",
        mgmtList: [
            "руководствоваться в своей деятельности требованиями настоящей Политики, обеспечить ее понимание и практическую реализацию всеми работниками подразделений;",
            "создавать необходимые условия для качественного выполнения работ и повышения эффективности труда."
        ],
        staffTitle: "Каждого работника Предприятия:",
        staffList: [
            "понимать требования настоящей политики;",
            "выполнять все требования, предъявляемые законодательством, потребителями, стандартом ISO 9001:2015 и руководителями подразделений;",
            "проявлять творческую инициативу, давать предложения по развитию и добиваться устранения обстоятельств, препятствующих качеству."
        ]
    },
    uz: {
        heroTitle: "Missiya va strategiya",
        visionTitle: "ISTIQBOL (VISION)",
        visionText: "Mahsulotlarimiz Markaziy Osiyo va MDHda eng taniqli bo'lishi.",
        missionTitle: "MISSIYA",
        missionText: "Og'ir yuk avtotransport vositalari uchun hamyonbop, ishonchli va yuqori sifatli tirkama hamda osma texnikalarni ilgari surish orqali qo'shni davlatlar bozorida o'rnimizni mustahkamlash.",
        valuesTitle: "BIZNI BIRLASHTIRUVCHI QADRIYATLAR",
        value1: { t: "Iste'molchilar", d: "iste'molchi mamnuniyati biz uchun birinchi o'rinda." },
        value2: { t: "Manfaatdor tomonlar", d: "xodimlarimizning shaxsiy huquqlari va manfaatlarini, mijozlar talablarini, hamkorlar va jamiyat tomonidan qo'yiladigan hamkorlik shartlarini hurmat qilish." },
        value3: { t: "Xodimlarni rag'batlantirish", d: "erishilgan natijalarga muvofiq mehnatga haq to'lash va professional o'sish uchun teng sharoitlar." },
        introText1: "OОО “UzAutoTrailer” og'ir yuk avtotransport vositalari va tijorat avtotransport vositalari uchun tirkama va osma texnikalar ishlab chiqarish sohasida jadal rivojlanayotgan korxonadir.",
        introText2: "“UzAutoTrailer” MCHJning sifat sohasidagi siyosati ilg'or ishlab chiqarish texnologiyalarini va zamonaviy boshqaruv usullarini qo'llash orqali mahsulotlar sifati bo'yicha iste'molchilarning mamnunlik darajasini doimiy ravishda oshirishga qaratilgan.",
        introText3: "Korxona yetakchi ishlab chiqaruvchi sifatida narx va sifat mutanosibligi imkon qadar ko'proq iste'molchilarni qoniqtiradigan darajada ichki va tashqi bozor ehtiyojlarini ta'minlashni maqsad qilgan.",
        scopeText: "Sifat menejmenti tizimining qo'llanilish sohasi: og'ir yuk avtotransport vositalari uchun tirkama va osma texnikalarni loyihalash, ishlab chiqarish va realizatsiya qilish.",
        directionsIntro: "Korxonaning raqobatbardoshligini oshirish, iste'molchilarning doimiy o'sib borayotgan so'rovlarini qondirish maqsadida, uzluksiz maqsadli rejalashtirish va takomillashtirish orqali mahsulotning yuqori sifatini ta'minlash uchun Korxona rahbariyati quyidagi faoliyat yo'nalishlarini belgiladi:",
        directions: [
            "mahsulotlarning yangi turlarini loyihalash va ishlab chiqarishni o'zlashtirish;",
            "mahsulot sifatini yaxshilash va resurslardan tejamkor foydalanish uchun ilg'or texnologik uskunalarni qo'llash;",
            "sotish bozorlarini kengaytirish va ishlab chiqarish hamda sotish hajmini oshirish;",
            "sifat menejmenti tizimini doimiy ravishda takomillashtirish;",
            "xodimlarning malakasini doimiy ravishda oshirish va samarali mehnat uchun tegishli sharoitlarni ta'minlash;",
            "infratuzilmani takomillashtirish;",
            "ishlab chiqarilayotgan mahsulot sifatiga zarar yetkazmagan holda mahsulot tannarxini bosqichma-bosqich pasaytirish."
        ],
        obligationsIntro: "Rivojlanishের asosiy yo'nalishlarini amalga oshirish maqsadida, Korxonaning yuqori rahbariyati quyidagi majburiyatlarni o'z zimmasiga oladi:",
        obligations: [
            "O'zbekiston Respublikasi qonunchiligi va xalqaro standartlar talablariga rioya etishni ta'minlash;",
            "sifat menejmenti tizimining natijadorligi va samaradorligini doimiy ravishda oshirish;",
            "barcha xodimlarga ushbu siyosat va iste'molchilar talablarini yetkazish;",
            "sifat menejmenti tizimi faoliyatini muntazam tahlil qilib borish;",
            "sifat sohasidagi siyosat va maqsadlarning doimiy yaroqliligini tahlil qilish;",
            "sifatli mahsulot ishlab chiqarish va Korxonaning rivojlanishi uchun zarur resurslar bilan ta'minlash."
        ],
        policyObligationsHeader: "Korxonaning sifat sohasidagi siyosati quyidagilarni majbur qiladi:",
        mgmtTitle: "Barcha tarkibiy bo'linmalar rahbarlarini:",
        mgmtList: [
            "o'z faoliyatida ushbu Siyosat talablariga amal qilish va uni amaliyotga joriy etishni ta'minlash;",
            "ishlarni sifatli bajarish va mehnat samaradorligini oshirish uchun zarur sharoitlarni yaratish."
        ],
        staffTitle: "Korxonaning har bir xodimini:",
        staffList: [
            "ushbu siyosat talablarini tushunish;",
            "qonunchilik, iste'molchilar, ISO 9001:2015 standarti va rahbarlar tomonidan qo'yiladigan talablarni bajarish;",
            "ijodiy tashabbus ko'rsatish va sifatga to'sqinlik qiluvchi har qanday sabablarni bartaraf etish."
        ]
    },
    en: {
        heroTitle: "Mission & Vision",
        visionTitle: "VISION",
        visionText: "Our products are the most recognizable in Central Asia and the CIS.",
        missionTitle: "MISSION",
        missionText: "Strengthening positions in the markets of neighboring countries by promoting affordable, reliable, and high-quality trailer and mounted equipment for heavy-duty vehicles.",
        valuesTitle: "VALUES THAT UNITE US",
        value1: { t: "Consumers", d: "customer satisfaction is our top priority." },
        value2: { t: "Stakeholders", d: "respect for the personal rights and interests of our employees, customer requirements, and interaction conditions set by partners." },
        value3: { t: "Staff Motivation", d: "fairness, implying remuneration in accordance with the results achieved and equal conditions for professional growth." },
        introText1: "UzAutoTrailer LLC is a dynamically developing enterprise in the field of production of trailer and mounted equipment for heavy-duty and commercial vehicles.",
        introText2: "The quality policy of UzAutoTrailer LLC (hereinafter - the Enterprise) is aimed at constantly increasing the level of consumer satisfaction with the quality of supplied products, ensured by advanced technologies and modern management methods.",
        introText3: "The Enterprise, as a leading manufacturer, aims to meet the needs of the domestic and foreign markets in such a way that the price-quality ratio satisfies the widest range of consumers.",
        scopeText: "The scope of the quality management system includes: design, production, and sale of trailer and mounted equipment for heavy-duty vehicles.",
        directionsIntro: "In order to increase the competitiveness of the Enterprise, to satisfy the growing demands of consumers by achieving high performance of all its processes based on continuous planning and improvement, the management has determined the following development areas:",
        directions: [
            "design and development of new product types;",
            "application of advanced technological equipment to improve quality and save resources;",
            "expansion of sales markets and increase in production and sales volumes;",
            "continuous improvement of the quality management system;",
            "enhancing staff qualifications and providing conditions for fruitful labor;",
            "infrastructure improvement;",
            "phased reduction of production costs without compromising product quality."
        ],
        obligationsIntro: "To implement the main development goals, the senior management of the Enterprise takes the following obligations:",
        obligations: [
            "ensure compliance with laws and international standards defining requirements for activities;",
            "constantly improve the effectiveness and efficiency of the QMS;",
            "inform all personnel about the main provisions of this policy and requirements;",
            "conduct regular analysis of the QMS functioning to improve it;",
            "analyze the suitability of quality policies and goals;",
            "provide resources necessary for quality production and constant development."
        ],
        policyObligationsHeader: "The Company's Quality Policy obligates:",
        mgmtTitle: "Heads of all structural units:",
        mgmtList: [
            "to be guided by the requirements of this Policy and ensure its implementation by all employees;",
            "to create necessary conditions for high-quality work and increased labor efficiency."
        ],
        staffTitle: "Every employee of the Enterprise:",
        staffList: [
            "to understand the requirements of this policy;",
            "to comply with legislation, ISO 9001:2015 standards, and heads of units;",
            "to show creative initiative and strive to eliminate factors preventing quality work."
        ]
    }
};

const MissionVision = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter overflow-hidden min-h-screen">

            {/* 1. HERO SECTION */}
            <section className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-[#0a1425]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 z-10"></div>
                <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Corporate" />
                <div className="relative z-20 text-center px-6">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-6xl font-semibold text-white tracking-tighter uppercase ">
                        {t.heroTitle}
                    </motion.h1>
                    <div className="w-16 md:w-20 h-1 bg-[#0054A6] mx-auto mt-4 md:mt-6 rounded-full shadow-lg"></div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-12 md:py-24 relative z-30">

                {/* 2. VISION & MISSION */}
                <div id="mission-vision" className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-16 md:mb-32 scroll-mt-28">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#0054A6] text-white p-8 md:p-12 rounded-[24px] md:rounded-[40px] shadow-2xl relative overflow-hidden group">
                        <Eye className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700 w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />
                        <h3 className="text-[10px] font-black tracking-[0.4em] mb-6 md:mb-10 opacity-70 uppercase">{t.visionTitle}</h3>
                        <p className="text-xl md:text-2xl lg:text-4xl font-semibold leading-tight relative z-10 tracking-tight">{t.visionText}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white border border-gray-100 p-8 md:p-12 rounded-[24px] md:rounded-[40px] shadow-sm relative overflow-hidden group">
                        <Target className="absolute -right-6 -bottom-6 text-gray-50 opacity-50 group-hover:scale-110 transition-transform duration-700 w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-[#0054A6] mb-6 md:mb-10 uppercase">{t.missionTitle}</h3>
                        <p className="text-lg md:text-xl lg:text-3xl font-semibold text-[#1a2e44] leading-relaxed relative z-10 tracking-tight">{t.missionText}</p>
                    </motion.div>
                </div>

                {/* 3. VALUES */}
                <div className="mb-16 md:mb-32">
                    <h3 className="text-center text-[10px] md:text-[11px] font-black tracking-[0.5em] text-gray-400 mb-10 md:mb-20 uppercase">{t.valuesTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            { ...t.value1, icon: Users, color: "bg-blue-50" },
                            { ...t.value2, icon: Heart, color: "bg-red-50" },
                            { ...t.value3, icon: ShieldCheck, color: "bg-green-50" }
                        ].map((val, i) => (
                            <div key={i} className="text-center px-4">
                                <div className={`w-14 h-14 md:w-16 md:h-16 ${val.color} text-[#0054A6] rounded-[14px] md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-8 transition-all hover:shadow-lg duration-300`}>
                                    <val.icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg md:text-xl font-bold text-[#1a2e44] mb-3 md:mb-4 uppercase tracking-tighter">{val.t}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed text-xs sm:text-sm lg:text-base">{val.d}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. VERBATIM MAIN PROSE */}
                <div id="quality-policy" className="max-w-5xl mx-auto mb-16 md:mb-32 scroll-mt-28 space-y-8 md:space-y-12">
                    <div className="bg-white p-6 md:p-10 lg:p-16 rounded-[24px] md:rounded-[48px] shadow-sm border border-gray-100">
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-lg md:text-xl lg:text-2xl font-semibold text-[#1a2e44] leading-relaxed border-l-4 border-[#0054A6] pl-4 md:pl-8 mb-8 md:mb-12 ">
                            {t.introText1}
                        </motion.p>
                        <div className="space-y-6 md:space-y-8 text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed text-justify font-medium">
                            <p>{t.introText2}</p>
                            <p>{t.introText3}</p>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 p-5 md:p-8 bg-[#0a1425] text-white rounded-[20px] md:rounded-[32px] shadow-xl">
                                <Zap className="text-[#0054A6] shrink-0 w-8 h-8 md:w-8 md:h-8" />
                                <span className="font-bold text-xs md:text-sm lg:text-base tracking-wide uppercase">{t.scopeText}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. STRATEGIC DIRECTIONS */}
                <div id="strategic-directions" className="max-w-6xl mx-auto mb-16 md:mb-32 scroll-mt-28">
                    <div className="bg-blue-50/50 p-6 md:p-10 lg:p-14 rounded-[24px] md:rounded-[40px] border border-blue-100/50 mb-8 md:mb-12">
                        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="text-base md:text-lg lg:text-xl text-[#1a2e44] font-bold leading-relaxed text-justify ">
                            {t.directionsIntro}
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
                        <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-gray-100 shadow-sm">
                            <h4 className="text-[10px] md:text-[11px] font-black tracking-[0.3em] text-[#0054A6] mb-6 md:mb-10 uppercase">{lang === 'ru' ? 'Направления' : 'Yo\'nalishlar'}</h4>
                            <ul className="space-y-3 md:space-y-4">
                                {(t.directions || []).map((goal, i) => (
                                    <li key={i} className="flex gap-3 md:gap-4 items-start p-3 md:p-4 bg-[#F8FAFC] rounded-[16px] md:rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                                        <CheckCircle2 className="w-5 h-5 text-[#0054A6] shrink-0 mt-0.5" />
                                        <span className="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 font-semibold leading-snug">{goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-gray-100 shadow-sm">
                            <h4 className="text-[10px] md:text-[11px] font-black tracking-[0.3em] text-[#0054A6] mb-6 md:mb-10 uppercase">{lang === 'ru' ? 'Обязательства' : 'Majburiyatlar'}</h4>
                            <p className="text-gray-400 font-bold text-[12px] md:text-[13px] mb-4 md:mb-6 uppercase tracking-tighter">{t.obligationsIntro}</p>
                            <ul className="space-y-3 md:space-y-4">
                                {(t.obligations || []).map((obl, i) => (
                                    <li key={i} className="flex gap-3 md:gap-4 items-start p-3 md:p-4 bg-blue-50/30 rounded-[16px] md:rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                                        <ArrowRight className="w-5 h-5 text-[#0054A6] shrink-0 mt-0.5" />
                                        <span className="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 font-semibold leading-snug">{obl}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 6. POLICY RULES */}
                <div id="personal-responsibilities" className="scroll-mt-28">
                    <div className="flex flex-col items-center mb-10 md:mb-16">
                        <h3 className="text-xl md:text-2xl lg:text-4xl font-semibold text-[#1a2e44] tracking-tight text-center">{t.policyObligationsHeader}</h3>
                        <div className="w-12 md:w-16 h-1 bg-[#0054A6] mt-4 md:mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-[#F8FAFC] p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-[#0054A6] shadow-sm"><Briefcase className="w-6 h-6 md:w-7 md:h-7" /></div>
                                <h4 className="text-base md:text-lg lg:text-xl font-bold text-[#1a2e44] tracking-tight">{t.mgmtTitle}</h4>
                            </div>
                            <ul className="space-y-4 md:space-y-6">
                                {(t.mgmtList || []).map((item, i) => (
                                    <li key={i} className="flex gap-3 md:gap-4 text-gray-500 font-semibold text-xs md:text-sm lg:text-base leading-relaxed border-l-2 border-[#0054A6] pl-4 md:pl-6 transition-all hover:bg-blue-50/50 py-2 rounded-r-xl">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#1a2e44] p-6 md:p-10 rounded-[24px] md:rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                            <Users className="absolute -right-10 -bottom-10 opacity-5 w-[200px] h-[200px] md:w-[300px] md:h-[300px]" />
                            <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10 relative z-10">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0054A6] rounded-2xl flex items-center justify-center text-white"><Users className="w-6 h-6 md:w-7 md:h-7" /></div>
                                <h4 className="text-base md:text-lg lg:text-xl font-bold tracking-tight">{t.staffTitle}</h4>
                            </div>
                            <ul className="space-y-4 md:space-y-6 relative z-10">
                                {(t.staffList || []).map((item, i) => (
                                    <li key={i} className="flex gap-3 md:gap-4 text-gray-300 font-semibold text-xs md:text-sm lg:text-base leading-relaxed border-l-2 border-white/20 pl-4 md:pl-6 transition-all hover:bg-white/5 py-2 rounded-r-xl">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionVision;