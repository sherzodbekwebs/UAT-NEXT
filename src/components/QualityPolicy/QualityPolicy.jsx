'use client'; // 1. BU SHART! (useEffect va Framer Motion uchun)

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Target,
    Award,
    Users,
    Briefcase,
    CheckCircle2,
    TrendingUp,
    Settings
} from 'lucide-react';

// 2. Next.js da public ichidagi rasmlar import qilinmaydi, string yo'li yoziladi
const heroImg = '/misson_page_hero.jpg';

const translations = {
    ru: {
        heroTitle: "Политика в области качества",
        breadcrumb: "Главная > Производство > Качество",
        introPara1: "Политика в области качества ООО “UzAutoTrailer” (далее - Предприятие) направлена на постоянное повышение степени удовлетворенности потребителей качеством поставляемой прицепной и навесной техники для большегрузных автотранспортных средств (далее – продукция), которая обеспечивается применением передовых технологий производства, современных методов управления с использованием совершенной инфраструктуры и квалифицированного персонала.",
        introPara2: "Предприятие, являясь передовым по производству прицепной и навесной техники для большегрузных автотранспортных средств, ставит своей целью обеспечить потребности внутреннего и внешнего рынка, таким образом, чтобы соотношение цены и качества удовлетворяло как можно большее число потребителей.",
        introPara3: "Система управления качеством разработана и внедрена в целях повышения конкурентоспособности Предприятия, для удовлетворения постоянно растущих запросов потребителей посредством достижения высокой результативности и эффективности всех процессов ее деятельности, обеспечивающих высокое качество продукции на основе непрерывного целевого планирования, их выполнения, оценки результативности и дальнейших действий по улучшению.",
        directionsTitle: "Направления деятельности",
        directions: [
            "проектирование и освоение производства новых видов продукции;",
            "применение передового технологического оборудования в целях улучшения качества продукции, экономного использования сырьевых и энергетических ресурсов, а также для повышения производительности труда;",
            "расширение рынков сбыта и увеличение объемов реализации и производства продукции;",
            "постоянное совершенствование системы менеджмента качества;",
            "постоянное повышение квалификации персонала и обеспечение соответствующими условиями для их плодотворного труда;",
            "совершенствование инфраструктуры;",
            "поэтапное снижение себестоимости продукции без ущерба качеству производимой продукции."
        ],
        commitmentsTitle: "Обязательства руководства",
        commitments: [
            "обеспечить выполнение требований нормативно-правовых актов, нормативно-технической документации Республики Узбекистан, международных стандартов устанавливающие требования к деятельности Предприятия;",
            "постоянно повышать результативность и эффективность системы менеджмента качества;",
            "довести до сведения всего персонала основные положения данной политики и требования потребителей;",
            "проводить регулярный анализ функционирования системы менеджмента качества в целях ее улучшения;",
            "анализировать политику и цели в области качества на предмет их постоянной пригодности;",
            "обеспечить ресурсами, необходимые для производства качественной продукции и постоянного развития Предприятия."
        ],
        obligationsTitle: "Политика предприятия обязывает",
        mgmtLabel: "Руководителей всех структурных подразделений:",
        mgmtList: [
            "руководствоваться в своей деятельности требованиями настоящей Политики, обеспечить ее понимание и практическую реализацию всеми работниками подразделений;",
            "создавать необходимые условия для качественного выполнения работ и повышения эффективности труда."
        ],
        staffLabel: "Каждого работника Предприятия:",
        staffList: [
            "понимать требования настоящей политики;",
            "выполнять все требования, предъявляемые законодательством, потребителями, стандартом ISO 9001:2015 и руководителями подразделений;",
            "проявлять творческую инициативу, давать предложения по развитию и добиваться устранения любых причин и обстоятельств, препятствующих качественному осуществлению работ."
        ]
    },
    uz: {
        heroTitle: "Sifat sohasidagi siyosat",
        breadcrumb: "Bosh sahifa > Ishlab chiqarish > Sifat",
        introPara1: "“UzAutoTrailer” MCHJning (keyingi o‘rinlarda – Korxona) sifat sohasidagi siyosati og‘ir yuk avtotransport vositalari uchun yetkazib berilayotgan tirkama va osma texnikalar (keyingi o‘rinlarda – mahsulot) sifati bo‘yicha iste’molchilarning mamnunlik darajasini doimiy ravishda oshirishga qaratilgan bo‘lib, bu ilg‘or ishlab chiqarish texnologiyalarini, zamonaviy boshqaruv usullarini, mukammal infratuzilmani va malakali xodimlarni qo‘llash orqali ta’minlanadi.",
        introPara2: "Korxona og‘ir yuk avtotransport vositalari uchun tirkama va osma texnikalar ishlab chiqarish bo‘yicha yetakchi sifatida ichki va tashqi bozor ehtiyojlarini narx va sifat mutanosibligi imkon qadar ko‘proq iste’molchilarni qoniqtiradigan darajada ta’minlashni o‘z oldiga maqsad qilib qo‘ygan.",
        introPara3: "Sifatni boshqarish tizimi Korxonaning raqobatbardoshligini oshirish, iste’molchilarning doimiy ravishda o‘sib borayotgan so‘rovlarini qondirish maqsadida barcha faoliyat jarayonlarining yuqori natijadorligi va samaradorligiga erishish orqali ishlab chiqilgan va joriy etilgan.",
        directionsTitle: "Faoliyat yo'nalishlari",
        directions: [
            "mahsulotlarning yangi turlarini loyihalash va ishlab chiqarishni o'zlashtirish;",
            "mahsulot sifati va resurslardan tejamkor foydalanish uchun ilg'or texnologik uskunalar qo'llash;",
            "sotuv bozorlarini kengaytirish va ishlab chiqarish hajmini oshirish;",
            "sifat menejmenti tizimini doimiy ravishda takomillashtirish;",
            "xodimlarning malakasini doimiy oshirish;",
            "infratuzilmani takomillashtirish;",
            "mahsulot tannarxini bosqichma-bosqich pasaytirish."
        ],
        commitmentsTitle: "Rahbariyat majburiyatlari",
        commitments: [
            "O'zbekiston Respublikasi qonunchiligi va xalqaro standartlar bajarilishini ta'minlash;",
            "sifat menejmenti tizimi samaradorligini doimiy oshirish;",
            "ushbu siyosatni barcha xodimlarga yetkazish;",
            "sifat menejmenti tizimini muntazam tahlil qilish;",
            "sifat sohasidagi maqsadlarning doimiy muvofiqligini tahlil qilish;",
            "sifatli mahsulot ishlab chiqarish uchun zarur resurslar bilan ta'minlash."
        ],
        obligationsTitle: "Korxona siyosati quyidagilarni majbur qiladi",
        mgmtLabel: "Barcha tarkibiy bo'linmalar rahbarlarini:",
        mgmtList: [
            "o'z faoliyatida ushbu Siyosat talablariga amal qilish va uni joriy etishni ta'minlash;",
            "ishlarni sifatli bajarish uchun zarur sharoitlarni yaratish."
        ],
        staffLabel: "Korxonaning har bir xodimini:",
        staffList: [
            "ushbu siyosat talablarini tushunish;",
            "qonunchilik va rahbarlar tomonidan qo'yilgan talablarni bajarish;",
            "sifatga to'sqinlik qiluvchi har qanday sabablarni bartaraf etish."
        ]
    },
    en: {
        heroTitle: "Quality Policy",
        breadcrumb: "Home > Production > Quality",
        introPara1: "The quality policy of UzAutoTrailer LLC is aimed at constantly increasing customer satisfaction with the quality of supplied trailer and mounted equipment for heavy-duty vehicles, ensured by advanced production technologies and modern management methods.",
        introPara2: "The Enterprise aims to meet the needs of the domestic and foreign markets so that the price-quality ratio satisfies the widest range of consumers.",
        introPara3: "The quality management system is designed to increase competitiveness and meet growing customer demands through the high efficiency of all operational processes.",
        directionsTitle: "Strategic Directions",
        directions: [
            "design and development of new product types;",
            "application of advanced equipment to improve quality and save resources;",
            "expansion of sales markets and increasing production volumes;",
            "continuous improvement of the quality management system;",
            "constant training of personnel;",
            "infrastructure improvement;",
            "phased reduction of production costs."
        ],
        commitmentsTitle: "Management Commitments",
        commitments: [
            "ensure compliance with laws and international standards;",
            "constantly improve the quality management system;",
            "inform all personnel about policy provisions;",
            "regularly analyze system functioning;",
            "analyze quality goals for continued suitability;",
            "provide resources necessary for quality production."
        ],
        obligationsTitle: "Policy Obligations",
        mgmtLabel: "All Unit Managers:",
        mgmtList: [
            "be guided by this Policy and ensure its implementation;",
            "create necessary conditions for quality work."
        ],
        staffLabel: "Every Employee:",
        staffList: [
            "understand the requirements of this policy;",
            "comply with legislation and customer requirements;",
            "strive to eliminate any obstacles to quality work."
        ]
    }
};

const QualityPolicy = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter min-h-screen pb-16 lg:pb-24 overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative h-[280px] sm:h-[350px] lg:h-[450px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1425] via-[#0a1425]/50 to-transparent z-10"></div>
                <img
                    src={heroImg}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-30"
                    alt="Quality Assurance"
                />
                <div className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-[#0054A6] font-bold tracking-[0.2em] uppercase text-[9px] sm:text-[10px] mb-3 sm:mb-4 block">
                            {t.breadcrumb}
                        </span>
                        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-semibold text-white tracking-tighter uppercase leading-tight max-w-4xl">
                            {t.heroTitle}
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 -mt-8 sm:-mt-12 relative z-30 space-y-12 sm:space-y-20">

                {/* 2. INTRODUCTION CARDS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="lg:col-span-8 bg-white rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-xl border border-gray-100"
                    >
                        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start mb-6 sm:mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                <ShieldCheck className="text-[#0054A6]" size={28} />
                            </div>
                            <p className="text-base sm:text-xl lg:text-2xl font-medium text-[#1a2e44] leading-relaxed">
                                {t.introPara1}
                            </p>
                        </div>
                        <div className="space-y-4 sm:space-y-6 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed text-justify border-t pt-6 sm:pt-8">
                            <p>{t.introPara2}</p>
                            <p>{t.introPara3}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="lg:col-span-4 bg-[#0054A6] rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl"
                    >
                        <Target className="absolute -right-10 -bottom-10 opacity-10" size={200} />
                        <h3 className="text-lg sm:text-2xl font-bold mb-5 sm:mb-6 uppercase">{t.commitmentsTitle}</h3>
                        <ul className="space-y-4 relative z-10">
                            {t.commitments.map((item, i) => (
                                <li key={i} className="flex gap-3 text-xs sm:text-sm font-medium opacity-90 leading-snug">
                                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* 3. DIRECTIONS */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <TrendingUp className="text-[#0054A6]" size={28} />
                        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-[#1a2e44] uppercase tracking-tight">{t.directionsTitle}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {t.directions.map((dir, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 sm:p-8 rounded-[20px] sm:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                <span className="text-2xl sm:text-4xl font-black text-blue-100 mb-3 sm:mb-4 block">0{i + 1}</span>
                                <p className="text-[#1a2e44] text-sm sm:text-base font-bold leading-snug">{dir}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. OBLIGATIONS */}
                <section className="bg-[#1a2e44] rounded-[30px] sm:rounded-[50px] p-6 sm:p-12 lg:p-20 text-white overflow-hidden relative shadow-2xl">
                    <Settings className="absolute -left-20 -bottom-20 opacity-5 text-white" size={350} />
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-10 sm:mb-16 text-center uppercase tracking-tighter leading-tight">
                            {t.obligationsTitle}
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-2xl w-fit">
                                    <Briefcase className="text-[#0054A6]" size={24} />
                                    <h4 className="text-sm sm:text-lg font-bold uppercase tracking-widest">{t.mgmtLabel}</h4>
                                </div>
                                <ul className="space-y-5">
                                    {t.mgmtList.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-gray-300 text-xs sm:text-sm lg:text-base font-medium leading-relaxed border-l border-white/10 pl-4 sm:pl-6">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-2xl w-fit">
                                    <Users className="text-[#0054A6]" size={24} />
                                    <h4 className="text-sm sm:text-lg font-bold uppercase tracking-widest">{t.staffLabel}</h4>
                                </div>
                                <ul className="space-y-5">
                                    {t.staffList.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-gray-300 text-xs sm:text-sm lg:text-base font-medium leading-relaxed border-l border-white/10 pl-4 sm:pl-6">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 sm:mt-20 flex justify-center">
                            <div className="flex items-center gap-3 sm:gap-4 bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl">
                                <Award className="text-[#0054A6]" size={24} />
                                <span className="text-[#1a2e44] font-black text-sm sm:text-xl tracking-tighter uppercase">ISO 9001:2015</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default QualityPolicy;