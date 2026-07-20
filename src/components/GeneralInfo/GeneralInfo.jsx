"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Factory, ShieldCheck, Settings, Users, Truck,
    CheckCircle2, MapPin, Building2, Cpu, Wrench, X, ChevronRight, ChevronLeft
} from 'lucide-react';

// Next.js da public ichidagi rasmlar import qilinmaydi, shunchaki string yo'li yoziladi
const uzautobg = '/uzbg1.png';
const uzautobg1 = '/bglast.jpg';
const serive1 = '/serive1.JPG';
const serive2 = '/serive2.JPG';
const serive3 = '/serive3.JPG';
const serive4 = '/serive4.JPG';
const serive5 = '/serive5.jpg';

const translations = {
    ru: {
        heroTitle: "Общая информация",
        mainTitle: "ООО “UzAuto TRAILER”",
        description: "4 июня 2012 году Акционерной компанией «Узавтосаноат» учреждено предприятие в форме общества с ограниченной ответственностью «UzAuto TRAILER» по выпуску прицепной техники и различных видов надстроек на грузовые шасси. Проектная мощность завода рассчитана на 3000 единиц: 2000 единиц – полуприцепов и 1000 единиц – надстроек на грузовые шасси, также освоен выпуск широкого спектра автомобильной техники для обеспечения различных отраслей хозяйства республики. ООО “UzAuto TRAILER” нацелено на реализацию своей продукции не только на внутреннем рынке Узбекистана, но и в соседних странах Центральной Азии: Казахстан, Азербайджан, Афганистан, Туркменистан и Кыргызстан. Приобрести технику и осуществить ее обслуживание потребители могут в дилерских центрах расположенных в Ташкенте и других региональных центрах нашей республики.",
        plant: {
            title: "Завод:",
            details: [
                "Общая площадь – 14,75 гектаров",
                "Производственная площадь – 2,7 гектаров",
                "Местонахождение: Республика Узбекистан, 140400, Самаркандская область, Жамбайский район, ул. Ташкентская, 2",
                "Головной офис: Республика Узбекистан, Ташкент, ул. Мирзо-Улугбек, д. 30"
            ]
        },
        products: {
            title: "Продукция:",
            desc: "С 2012 года компанией освоено широкий спектр моделей техники:",
            list: [
                "кузова: самосвальные, изотермические, тентовые и цельнометаллические;",
                "полуприцепы и прицепы; самосвальные, изотермические, тентовые;",
                "контейнеровозы и другая специализированная техника;",
                "сельскохозяйственная техника (тракторные прицепы, пресс подборщики, заправочные передвижные станции)."
            ]
        },
        personnel: {
            title: "Персонал:",
            text: "Численность персонала ООО «UzAuto TRAILER» составляет 470 человек.",
            qualityText: "Высокое качество техники ООО «UzAuto TRAILER» обеспечивается следующими факторами при ее производстве:"
        },
        factors: [
            {
                title: "1. Менеджмент качества:",
                items: [
                    "ISO 9001:2015;",
                    "входной контроль качества металла, материалов и комплектующих;",
                    "контроль качества сварных швов и качество окраски;"
                ]
            },
            {
                title: "2. Использование качественных материалов и комплектующих ведущих мировых производителей:",
                items: [
                    "оси и подвески SAF-Holland, Koc;",
                    "пневмопривод тормозной системы Knore-Bremse, Wabco;",
                    "входной контроль качества металла, материалов и комплектующих;",
                    "опорные устройства, шкворни, поворотные круги компании JOST;",
                    "шины Michelin, Continental и др.;",
                    "специальные конструкционные марки сталей Hardox, Domax, St-52;",
                    "лакокрасочные материалы."
                ]
            },
            {
                title: "3. Современное оборудование и производство:",
                items: [
                    "резка металла на плазменном оборудовании немецкой компании Messer;",
                    "резка металла на лазерном оборудовании турецкой компании Ermaksan;",
                    "штамповка деталей на прессах турецкой компании Ermaksan;",
                    "сварка в среде защитного газа с оборудованием австрийской фирмы Fronius;",
                    "высококачественная подготовка к окраске;",
                    "высококачественная окраска и сушка в окрасочно-сушильной камере."
                ]
            },
            {
                title: "4. Квалифицированный персонал.",
                desc: "Предприятие имеет собственное конструкторско-технологическое бюро, состоящее из высоко квалифицированных местных и зарубежных конструкторов и технологов, занимающиеся разработкой и модернизацией конструкции навесной и полуприцепной техники, с последующим их внедрением в производство. Кроме того, конструкторско-технологическое бюро занимается проектированием нестандартной технологической оснастки в машиностроительной области."
            }
        ]
    },
    uz: {
        heroTitle: "Umumiy ma'lumot",
        mainTitle: "“UzAuto TRAILER” MCHJ",
        description: "2012-yil 4-iyun kuni “O‘zavtosanoat” aksiyadorlik kompaniyasi tomonidan tirkama texnikasi va yuk shassilariga turli xil ustqurmalar ishlab chiqarish bo‘yicha “UzAuto TRAILER” mas’uliyati cheklangan jamiyati tashkil etilgan. Zavodning loyihaviy quvvati 3000 dona texnikaga mo‘ljallangan: 2000 dona yarim tirkama va 1000 dona yuk shassilari uchun ustqurmalar. Shuningdek, respublika xo'jaligining turli tarmoqlarini ta'minlash uchun keng turdagi avtomobil texnikasi ishlab chiqarilmoqda. “UzAuto TRAILER” MCHJ o'z mahsulotlarini nafaqat O‘zbekiston ichki bozorida, balki Markaziy Osiyoning qo‘shni davlatlari: Qozog‘iston, Ozarbayjon, Afg‘oniston, Turkmaniston va Qirg‘izistonda ham sotishni maqsad qilgan. Texnikani sotib olish va unga xizmat ko'rsatish Toshkent va respublikamizning boshqa mintaqaviy markazlarida joylagan dilerlik markazlarida amalga oshirilishi mumkin.",
        plant: {
            title: "Zavod:",
            details: [
                "Umumiy maydon – 14,75 gektar",
                "Ishlab chiqarish maydoni – 2,7 gektar",
                "Manzil: O'zbekiston Respublikasi, 140400, Samarqand viloyati, Jomboy tumani, Toshkent ko'chasi, 1-uy",
                "Bosh ofis: O'zbekiston Respublikasi, Toshkent sh., Mirzo Ulug'bek ko'chasi, 30-uy"
            ]
        },
        products: {
            title: "Mahsulotlar:",
            desc: "2012-yildan buyon kompaniya keng turdagi texnika modellarini o'zlashtirdi:",
            list: [
                "kuzovlar: agdariluvchi, izotermik, tentli va butun metalli;",
                "yarim tirkamalar va tirkamalar: agdariluvchi, izotermik, tentli;",
                "konteyner tashuvchilar va boshqa maxsus texnikalar;",
                "qishloq xo'jaligi texnikasi (traktor tirkamalari, press-podborshiklar, mobil yoqilg'i quyish stansiyalari)."
            ]
        },
        personnel: {
            title: "Xodimlar:",
            text: "“UzAuto TRAILER” MCHJ xodimlari soni 470 kishini tashkil etadi.",
            qualityText: "“UzAuto TRAILER” MCHJ texnikasining yuqori sifati uni ishlab chiqarishdagi quyidagi omillar bilan ta'minlanadi:"
        },
        factors: [
            {
                title: "1. Sifat menejmenti:",
                items: [
                    "ISO 9001:2015;",
                    "metall, materiallar va butlovchi qismlarning kirish sifat nazorati;",
                    "payvand choklari va bo'yash sifatini nazorat qilish;"
                ]
            },
            {
                title: "2. Dunyoning yetakchi ishlab chiqaruvchilarining sifatli materiallari va butlovchi qismlaridan foydalanish:",
                items: [
                    "SAF-Holland, Koc o'qlari va osmalar;",
                    "Knorr-Bremse, Wabco tormoz tizimining pnevmatik uzatmasi;",
                    "metall, materiallar va butlovchi qismlarning kirish sifat nazorati;",
                    "JOST kompaniyasining tayanch qurilmalari, shkvorenlar va burilish doiralari;",
                    "Michelin, Continental va boshqa shinalar;",
                    "Hardox, Domax, St-52 rusumli maxsus konstruksion po'latlar;",
                    "bo'yoq materiallari."
                ]
            },
            {
                title: "3. Zamonaviy uskunalar va ishlab chiqarish:",
                items: [
                    "Germaniyaning Messer kompaniyasi plazmali uskunalarida metallni kesish;",
                    "Turkiyaning Ermaksan kompaniyasi lazer uskunalarida metallni kesish;",
                    "Turkiyaning Ermaksan kompaniyasi presslarida detallarni shtamplash;",
                    "Avstriyaning Fronius firma uskunalari bilan himoya gazi muhitida payvandlash;",
                    "bo'yashga yuqori sifatli tayyorgarlik;",
                    "bo'yash-quritish kamerasida yuqori sifatli bo'yash va quritish."
                ]
            },
            {
                title: "4. Malakali xodimlar.",
                desc: "Korxona o'zining konstruktorlik-texnologik byuroiga ega bo'lib, u yuqori malakali mahalliy va xorijiy konstruktor hamda texnologlardan iborat. Ular osma va yarim tirkama texnika konstruksiyasini ishlab chiqish va modernizatsiya qilish, keyinchalik ularni ishlab chiqarishga joriy etish bilan shug'ullanadilar. Bundan tashqari, konstruktorlik-texnologik byuro mashinasozlik sohasida nostandart texnologik jihozlarni loyihalash bilan ham shug'ullanadi."
            }
        ]
    },
    en: {
        heroTitle: "General Information",
        mainTitle: "“UzAuto TRAILER” LLC",
        description: "On June 4, 2012, the Joint-Stock Company 'Uzavtosanoat' established the enterprise in the form of a limited liability company 'UzAuto TRAILER' for the production of trailer equipment and various types of superstructures on truck chassis. The design capacity of the plant is designed for 3,000 units: 2,000 units of semi-trailers and 1,000 units of superstructures on truck chassis. UzAuto TRAILER LLC aims to sell its products not only on the domestic market of Uzbekistan but also in neighboring countries of Central Asia: Kazakhstan, Azerbaijan, Afghanistan, Turkmenistan, and Kyrgyzstan. Consumers can purchase equipment and carry out its maintenance at dealer centers located in Tashkent and other regional centers of our republic.",
        plant: {
            title: "Factory:",
            details: [
                "Total area – 14.75 hectares",
                "Production area – 2.7 hectares",
                "Location: Republic of Uzbekistan, 140400, Samarkand region, Jomboy district, Tashkent str., 1",
                "Head office: Republic of Uzbekistan, Tashkent, Mirzo-Ulugbek str., 30"
            ]
        },
        products: {
            title: "Products:",
            desc: "Since 2012, the company has mastered a wide range of equipment models:",
            list: [
                "bodies: tipper, isothermal, tilt and all-metal;",
                "semi-trailers and trailers: tipper, isothermal, tilt;",
                "container ships and specialized equipment;",
                "agricultural machinery (tractor trailers, balers, mobile refueling stations)."
            ]
        },
        personnel: {
            title: "Personnel:",
            text: "The number of personnel of UzAuto TRAILER LLC is 470 people.",
            qualityText: "The high quality of equipment is ensured by the following factors during its production:"
        },
        factors: [
            {
                title: "1. Quality Management:",
                items: [
                    "ISO 9001:2015;",
                    "incoming quality control of metal, materials and components;",
                    "quality control of welds and painting quality;"
                ]
            },
            {
                title: "2. Quality materials and components:",
                items: [
                    "SAF-Holland, Koc axles and suspensions;",
                    "Knorr-Bremse, Wabco pneumatic brake systems;",
                    "JOST landing gears, kingpins, turntables;",
                    "Michelin, Continental tires and others;",
                    "special structural steel grades Hardox, Domax, St-52;"
                ]
            },
            {
                title: "3. Modern equipment and production:",
                items: [
                    "Messer plasma cutting equipment (Germany);",
                    "Ermaksan laser equipment (Turkey);",
                    "Ermaksan stamping presses (Turkey);",
                    "Fronius welding equipment (Austria);",
                    "high-quality painting and drying chambers."
                ]
            },
            {
                title: "4. Qualified personnel.",
                desc: "The enterprise has its own design and technology bureau, consisting of highly qualified local and foreign designers and technologists involved in the development and modernization of the design of mounted and semi-trailer equipment."
            }
        ]
    }
};

const GeneralInfo = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    const [selectedImg, setSelectedImg] = useState(null);
    const [currentServiceIdx, setCurrentServiceIdx] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const serviceImages = [serive1, serive2, serive3, serive4, serive5];
    const autoSlideRef = useRef(null);
    const resumeTimeoutRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (isLightboxOpen || !isAutoPlaying) {
            if (autoSlideRef.current) clearInterval(autoSlideRef.current);
            return;
        }

        autoSlideRef.current = setInterval(() => {
            setCurrentServiceIdx((prev) => (prev + 1) % serviceImages.length);
        }, 5000);

        return () => clearInterval(autoSlideRef.current);
    }, [isLightboxOpen, isAutoPlaying, serviceImages.length]);

    const handleNav = (direction, e) => {
        if (e) e.stopPropagation();

        setIsAutoPlaying(false);
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

        let nextIdx;
        if (direction === 'next') {
            nextIdx = (currentServiceIdx + 1) % serviceImages.length;
        } else {
            nextIdx = (currentServiceIdx - 1 + serviceImages.length) % serviceImages.length;
        }

        setCurrentServiceIdx(nextIdx);

        if (isLightboxOpen && serviceImages.includes(selectedImg)) {
            setSelectedImg(serviceImages[nextIdx]);
        }

        resumeTimeoutRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 4000);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setSelectedImg(null);
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 3000);
    };

    const isGalleryImg = serviceImages.includes(selectedImg);

    return (
        <div className="pt-0 bg-white font-inter">
            {/* 1. HERO */}
            <section className="relative h-[300px] md:h-[450px] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${uzautobg})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-white uppercase">{t.heroTitle}</h1>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-12 md:py-20 pb-0">

                {/* 2. SECTION: INTRO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-32 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1a2e44] mb-4 md:mb-8">{t.mainTitle}</h2>
                        <div className="text-gray-600 text-base md:text-lg leading-relaxed text-justify space-y-6"><p>{t.description}</p></div>
                    </motion.div>
                    <div className="rounded-[20px] md:rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[500px] border-4 md:border-8 border-gray-50 cursor-pointer" onClick={() => { setSelectedImg(uzautobg); setIsLightboxOpen(true); }}>
                        <img src={uzautobg} className="w-full h-full object-cover" alt="Production" />
                    </div>
                </div>

                {/* 3. SECTION: PLANT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-32 items-center">
                    <div className="order-2 lg:order-1 rounded-[20px] md:rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[450px] border-4 md:border-8 border-gray-50 cursor-pointer" onClick={() => { setSelectedImg(uzautobg1); setIsLightboxOpen(true); }}>
                        <img src={uzautobg1} className="w-full h-full object-cover" alt="Plant" />
                    </div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2 bg-[#F8FAFC] p-6 md:p-12 rounded-[24px] md:rounded-[40px] border border-gray-100 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                            <Building2 className="text-[#0054A6] w-6 h-6 md:w-8 md:h-8" />
                            <h3 className="text-xl md:text-2xl font-semibold text-[#1a2e44]">{t.plant.title}</h3>
                        </div>
                        <ul className="space-y-4 text-gray-700 font-medium">
                            {t.plant.details.map((item, i) => (
                                <li key={i} className="flex gap-3 md:gap-4 text-[13px] md:text-[15px]"><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#0054A6] shrink-0 mt-0.5" /> {item}</li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* 4. SECTION: PRODUCTS */}
                <div className="mb-16 md:mb-32">
                    <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
                        <Truck className="text-[#0054A6] w-6 h-6 md:w-8 md:h-8" />
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#1a2e44]">{t.products.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {t.products.list.map((item, i) => (
                            <motion.div whileHover={{ y: -5 }} key={i} className="bg-white p-6 md:p-8 rounded-[20px] md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#0054A6]">
                                    {i === 0 ? <Truck className="w-5 h-5 md:w-6 md:h-6" /> : i === 1 ? <Cpu className="w-5 h-5 md:w-6 md:h-6" /> : i === 2 ? <Wrench className="w-5 h-5 md:w-6 md:h-6" /> : <Factory className="w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                                <p className="text-[14px] md:text-[15px] font-semibold text-[#1a2e44] leading-relaxed">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 5. SECTION: PERSONNEL & FACTORS */}
                <div className="mb-16 md:mb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center mb-10 md:mb-16">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <h3 className="text-2xl md:text-3xl font-semibold text-[#1a2e44] mb-4 md:mb-6">{t.personnel.title}</h3>
                            <p className="text-lg md:text-xl text-[#0054A6] font-bold mb-4 md:mb-6  leading-snug">
                                {t.personnel.text}
                            </p>
                            <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                                {t.personnel.qualityText}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="rounded-[20px] md:rounded-[32px] overflow-hidden shadow-2xl h-[300px] md:h-[450px] cursor-pointer relative group border-4 md:border-8 border-gray-50"
                            onClick={() => { setSelectedImg(serviceImages[currentServiceIdx]); setIsLightboxOpen(true); }}
                        >
                            <AnimatePresence mode='wait'>
                                <motion.img
                                    key={currentServiceIdx}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={serviceImages[currentServiceIdx]}
                                    className="w-full h-full object-cover"
                                    alt="Personnel slider"
                                />
                            </AnimatePresence>

                            <div className="absolute inset-x-0 bottom-4 md:bottom-8 flex justify-center items-center gap-3 md:gap-4 z-10 px-4 md:px-10">
                                <button onClick={(e) => handleNav('prev', e)} className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-[#0054A6] transition-all cursor-pointer"><ChevronLeft size={20} className="w-4 h-4 md:w-5 md:h-5" /></button>
                                <div className="flex gap-1.5 md:gap-2 flex-1 justify-center">
                                    {serviceImages.map((_, i) => (
                                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentServiceIdx ? 'w-6 md:w-10 bg-[#0054A6]' : 'w-1.5 md:w-2 bg-white/40'}`} />
                                    ))}
                                </div>
                                <button onClick={(e) => handleNav('next', e)} className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-[#0054A6] transition-all cursor-pointer"><ChevronRight size={20} className="w-4 h-4 md:w-5 md:h-5" /></button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {t.factors.map((factor, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-5 md:p-8 rounded-[20px] md:rounded-[32px] border ${i === 3 ? 'bg-[#f0f4f8]' : 'bg-white border-gray-100'} shadow-sm hover:shadow-md transition-all h-full`}
                            >
                                <h4 className="text-[14px] md:text-[15px] font-bold text-[#1a2e44] mb-4 md:mb-6 leading-tight border-b border-gray-100 pb-3 md:pb-4">{factor.title}</h4>
                                {factor.items ? (
                                    <ul className="space-y-2 md:space-y-3">
                                        {factor.items.map((li, idx) => (
                                            <li key={idx} className="text-[11px] md:text-[12px] text-gray-500 font-semibold flex gap-2 leading-relaxed">
                                                <div className="w-1 h-1 bg-[#0054A6] rounded-full mt-1.5 shrink-0" /> {li}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-[11px] md:text-[12px] text-gray-500 font-semibold leading-relaxed">{factor.desc}</p>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <button onClick={closeLightbox} className="absolute top-4 md:top-8 right-4 md:right-8 text-white/50 hover:text-white transition-colors p-2 cursor-pointer z-[10000]"><X size={40} className="w-8 h-8 md:w-10 md:h-10" /></button>

                        {isGalleryImg && (
                            <>
                                <button onClick={(e) => handleNav('prev', e)} className="absolute left-4 lg:left-8 p-4 text-white/30 hover:text-white transition-colors cursor-pointer hidden md:block z-[10000]"><ChevronLeft size={60} strokeWidth={1} /></button>
                                <button onClick={(e) => handleNav('next', e)} className="absolute right-4 lg:right-8 p-4 text-white/30 hover:text-white transition-colors cursor-pointer hidden md:block z-[10000]"><ChevronRight size={60} strokeWidth={1} /></button>
                            </>
                        )}

                        <motion.img
                            key={selectedImg}
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={selectedImg}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl mt-8 md:mt-0"
                            alt="Full View"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GeneralInfo;