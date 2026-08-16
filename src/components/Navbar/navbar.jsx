'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/Logo.png';
import {
    ArrowRight, ChevronRight, Globe as GlobeIcon,
    Search, Menu as MenuIcon, X as XIcon,
    Info, Settings, Package, Phone, MapPin,
    Facebook,
    Instagram,
    Send,
    Youtube,
    PlayCircle,
    Check
} from 'lucide-react';

import API, { API_URL } from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

// Brend rangi Hero komponenti bilan bir xil — sayt bo'ylab yagona vizual til.
const BRAND = '#0061A4';
const BRAND_LIGHT = '#5CC2FF';

const socialLinks = [
    { icon: Send, url: "https://t.me/uatproductsbot", color: "#0088cc" },
    { icon: Instagram, url: "https://www.instagram.com/uzautotrailer_official", color: "#E1306C" },
    { icon: Facebook, url: "https://www.facebook.com/UzAutoTrailerofficial", color: "#1877F2" },
    { icon: Youtube, url: "https://www.youtube.com/@UzAutoTrailer/videos", color: "#FF0000" }
];

const languageOptions = [
    { code: 'uz', label: "O'zbekcha" },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
];

const translations = {
    ru: {
        about: "О компании", production: "Производство", news: "Новости", products: "Продукция",
        dealers: "Дилеры", contacts: "Контакты", videorolik: "Видеоролики",
        searchPlaceholder: "Поиск...", noResults: "Ничего не найдено",
        callUsQuery: "Есть вопросы? Звоните нам",
        staticAbout: [
            { title: "Общая информация", link: "/page/general_information" },
            { title: "История", link: "/page/history" },
            { title: "Миссия, видение", link: "/page/mission_vision" },
            { title: "Дочерние компании", link: "/page/affiliated_companies" },
            { title: "Сведения о регистрации", link: "/page/registration_and_trademark_information" },
            { title: "Комплаенс политика", link: "/page/compliance_policy" },
            { title: "Достижения и награды", link: "/page/achievements_and_awards" },
            { title: "Карьера", link: "/page/careers" },
        ],
        prodItems: [
            {
                label: "Контроль качества",
                sub: [
                    { title: "Система менеджмента качества", link: "/page/quality_management" },
                    { title: "Политика в области качества", link: "/page/quality_policy" },
                    { title: "Награды в области качества", link: "/page/quality_awards" }
                ]
            },
            { label: "Технологии и оборудование", link: "/page/technologies" },
            { label: "Конструкторское бюро", link: "/page/design_bureau" }
        ]
    },
    uz: {
        about: "Kompaniya", production: "Ishlab chiqarish", news: "Yangiliklar", products: "Mahsulotlar",
        dealers: "Dilerlar", contacts: "Aloqa", videorolik: "Videoroliklar",
        searchPlaceholder: "Qidirish...", noResults: "Hech narsa topilmadi",
        callUsQuery: "Savollaringiz bormi? Qo'ng'iroq qiling",
        staticAbout: [
            { title: "Umumiy ma'lumot", link: "/page/general_information" },
            { title: "Tarix", link: "/page/history" },
            { title: "Missiya va maqsadlar", link: "/page/mission_vision" },
            { title: "Sho'ba korxonalar", link: "/page/affiliated_companies" },
            { title: "Ro'yxatdan o'tganlik", link: "/page/registration_and_trademark_information" },
            { title: "Komplaens siyosati", link: "/page/compliance_policy" },
            { title: "Yutuq va mukofotlar", link: "/page/achievements_and_awards" },
            { title: "Karyera", link: "/page/careers" },
        ],
        prodItems: [
            {
                label: "Sifat nazorati",
                sub: [
                    { title: "Sifat menejmenti tizimi", link: "/page/quality_management" },
                    { title: "Sifat siyosati", link: "/page/quality_policy" },
                    { title: "Sifat sohasidagi mukofotlar", link: "/page/quality_awards" }
                ]
            },
            { label: "Texnologiyalar va uskunalar", link: "/page/technologies" },
            { label: "Konstruktorlik byurosi", link: "/page/design_bureau" }
        ]
    },
    en: {
        about: "Company", production: "Production", news: "News", products: "Products",
        dealers: "Dealers", contacts: "Contacts", videorolik: "Videos",
        searchPlaceholder: "Search...", noResults: "Nothing found",
        callUsQuery: "Have any query? Call us",
        staticAbout: [
            { title: "General Information", link: "/page/general_information" },
            { title: "History", link: "/page/history" },
            { title: "Mission & Vision", link: "/page/mission_vision" },
            { title: "Subsidiaries", link: "/page/affiliated_companies" },
            { title: "Registration details", link: "/page/registration_and_trademark_information" },
            { title: "Compliance policy", link: "/page/compliance_policy" },
            { title: "Awards", link: "/page/achievements_and_awards" },
            { title: "Careers", link: "/page/careers" },
        ],
        prodItems: [
            {
                label: "Quality Control",
                sub: [
                    { title: "Quality Management System", link: "/page/quality_management" },
                    { title: "Quality Policy", link: "/page/quality_policy" },
                    { title: "Quality Awards", link: "/page/quality_awards" }
                ]
            },
            { label: "Technologies and equipment", link: "/page/technologies" },
            { label: "Design Bureau", link: "/page/design_bureau" }
        ]
    }
};

const toCyrillic = (text) => {
    const map = {
        'sh': 'ш', 'ch': 'ч', 'yo': 'ё', 'yu': 'ю', 'ya': 'я', 'ye': 'е', 'o\'': 'ў', 'g\'': 'ғ',
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'z': 'з', 'i': 'и', 'j': 'ж',
        'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т',
        'u': 'у', 'f': 'ф', 'h': 'х', 'ts': 'ц', 'y': 'ы'
    };
    let result = text.toLowerCase();
    Object.keys(map).forEach(key => {
        result = result.split(key).join(map[key]);
    });
    return result;
};

// --- YORDAMCHI KOMPONENTLAR ---

/**
 * Dropdown-li nav item. `isCurrent` — shu bo'limga tegishli sahifada turilganini bildiradi
 * va pastida doimiy ko'k chiziqcha (indicator) chiqadi. `open` — sichqoncha ustida
 * turilganda dropdown ochiq holatini bildiradi.
 */
const NavItem = ({ label, open, isCurrent, onEnter, onLeave, children }) => (
    <li className="relative h-full flex items-center font-bold" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <div
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={open}
            className={`relative py-2 flex items-center gap-1 group cursor-pointer h-full transition-colors duration-200 outline-none ${isCurrent ? 'text-[#0061A4]' : 'text-[#1a2e44] hover:text-[#0061A4]'}`}
        >
            <span>{label}</span>
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-90 text-[#0061A4]' : 'text-gray-400'}`} />
            {isCurrent && (
                <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-[2px] left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[#0061A4] to-[#5CC2FF]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
            )}
        </div>
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.18, ease: 'easeOut' }} className="absolute top-full left-0 mt-3 min-w-64 bg-white shadow-[0_18px_45px_-12px_rgba(15,35,65,0.28)] rounded-3xl border border-gray-100 z-[100] overflow-hidden">
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </li>
);

/** Oddiy (dropdownsiz) nav link — joriy sahifa bo'lsa ko'k rangda va tagida chiziqcha bilan. */
const SimpleNavLink = ({ href, label, isCurrent }) => (
    <Link href={href}>
        <li className={`relative py-2 transition-colors duration-200 ${isCurrent ? 'text-[#0061A4]' : 'hover:text-[#0061A4]'}`}>
            {label}
            {isCurrent && (
                <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-[2px] left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[#0061A4] to-[#5CC2FF]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
            )}
        </li>
    </Link>
);

const SearchResults = ({ suggestions, t, getLangField, handleResultClick }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.18 }} className="absolute top-full right-0 mt-3 w-[380px] bg-white shadow-[0_20px_50px_-15px_rgba(15,35,65,0.3)] rounded-3xl border border-gray-100 overflow-hidden z-[2000] p-2">
        {suggestions.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {suggestions.map(p => (
                    <div key={p.id} onClick={() => handleResultClick(p.id)} className="flex items-center gap-4 p-3 hover:bg-blue-50/60 rounded-2xl cursor-pointer transition-all group">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={`${API_URL}${p.image}`} className="w-full h-full object-contain p-1" alt="" />
                        </div>
                        <div className="flex flex-col gap-0.5 text-black min-w-0">
                            <span className="text-[14px] font-bold text-gray-700 group-hover:text-[#0061A4] line-clamp-1">{getLangField(p, 'title')}</span>
                            <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1">
                                Batafsil ko'rish <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-8 text-center text-gray-400 text-sm font-medium flex flex-col items-center gap-2">
                <Search size={22} className="text-gray-200" />
                {t.noResults}
            </div>
        )}
    </motion.div>
);

const MobileNavItem = ({ icon: Icon, label, isOpen, isCurrent, onClick, children }) => (
    <div className="rounded-2xl overflow-hidden transition-all duration-300">
        <button onClick={onClick} aria-expanded={isOpen} className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all ${isOpen ? 'bg-blue-50 text-[#0061A4]' : isCurrent ? 'bg-blue-50/60 text-[#0061A4]' : 'text-[#1a2e44] hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${isOpen || isCurrent ? 'bg-[#0061A4] text-white' : 'bg-gray-100 text-[#0061A4]'}`}><Icon size={18} /></div>
                <span className="text-[16px] font-bold">{label}</span>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4]" />}
            </div>
            <ChevronRight size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#0061A4]' : 'text-gray-300'}`} />
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden bg-gray-50/50 mx-2 rounded-b-2xl border-x border-b border-blue-50 px-4 py-2 ml-8 border-l-2 border-blue-100 my-2">
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const SimpleMobileLink = ({ href, icon: Icon, label, isCurrent, onClick }) => (
    <Link href={href} onClick={onClick} className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isCurrent ? 'bg-blue-50/70 text-[#0061A4]' : 'hover:bg-gray-50 text-[#1a2e44]'}`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-all ${isCurrent ? 'bg-[#0061A4] text-white' : 'bg-gray-100 text-[#0061A4] group-hover:bg-[#0061A4] group-hover:text-white'}`}><Icon size={18} /></div>
            <span className="text-[16px] font-bold">{label}</span>
            {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4]" />}
        </div>
        <ArrowRight size={18} className={`transition-transform ${isCurrent ? 'text-[#0061A4]' : 'text-gray-300 group-hover:translate-x-1'}`} />
    </Link>
);

// --- ASOSIY NAVBAR ---

const Navbar = () => {
    const { lang, setLang } = useLanguage();
    const [dynamicMenus, setDynamicMenus] = useState([]);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef(null);
    const searchWrapperRef = useRef(null);
    const t = translations[lang] || translations.ru;

    useEffect(() => {
        API.get('/menus').then(res => setDynamicMenus(res.data)).catch(() => { });
        API.get('/products').then(res => setAllProducts(res.data)).catch(() => { });
    }, []);

    // Scroll qilinganda kapsulaning soyasi va shaffofligini kuchaytirish — "elevate on scroll" effekti
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const getLangField = (obj, field) => {
        if (!obj) return "";
        const currentSuffix = lang.charAt(0).toUpperCase() + lang.slice(1);
        return obj[`${field}${currentSuffix}`] || obj[`${field}Ru`] || obj[`${field}Uz`] || obj[`${field}En`] || "";
    };

    useEffect(() => {
        const query = searchTerm.trim().toLowerCase();
        if (query.length > 1) {
            const cyrillicQuery = toCyrillic(query);
            const filtered = allProducts.filter(p => {
                const ru = (p.titleRu || "").toLowerCase();
                const uz = (p.titleUz || "").toLowerCase();
                const en = (p.titleEn || "").toLowerCase();
                return ru.includes(query) || ru.includes(cyrillicQuery) || uz.includes(query) || en.includes(query);
            });
            setSuggestions(filtered.slice(0, 6));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [searchTerm, allProducts]);

    const handleResultClick = (productId) => {
        router.push(`/product/${productId}`);
        setSearchTerm("");
        setShowSuggestions(false);
        setIsMobileMenuOpen(false);
    };

    const getDynamicItems = (key) => {
        return dynamicMenus
            .filter(item => item.parentKey === key && item.isActive)
            .map(item => ({
                title: getLangField(item, 'title'),
                link: item.link
            }));
    };

    const fullAboutItems = [...t.staticAbout, ...getDynamicItems('about')];

    // --- Joriy sahifani aniqlash mantig'i ---
    const isPathActive = (href) => pathname === href || pathname?.startsWith(href + '/');

    const prodLinks = t.prodItems.flatMap(item => item.sub ? item.sub.map(s => s.link) : [item.link]);
    const isAboutActive = fullAboutItems.some(item => isPathActive(item.link));
    const isProdActive = prodLinks.some(link => isPathActive(link));

    const simpleLinks = [
        { href: '/news', label: t.news, icon: Info },
        { href: '/products', label: t.products, icon: Package },
        { href: '/dealers', label: t.dealers, icon: MapPin },
        { href: '/videos', label: t.videorolik, icon: PlayCircle },
        { href: '/contacts', label: t.contacts, icon: Phone },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsLangOpen(false);
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setActiveMenu(null); setIsLangOpen(false); setIsMobileMenuOpen(false);
    }, [pathname]);

    const currentLangLabel = languageOptions.find(l => l.code === lang)?.label || lang;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                .navbar-roboto-container * { font-family: 'Roboto', sans-serif !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

                /* Silliq o'tish uchun kapsula animatsiyasi: max-width, radius, soya va fon alohida-alohida
                   o'z tezligida animatsiya qilinadi — natija tabiiyroq ko'rinadi. */
                .nav-transition {
                    transition: max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                                border-radius 0.5s ease,
                                box-shadow 0.4s ease,
                                background-color 0.4s ease,
                                border-color 0.4s ease;
                }

                /* Klaviatura bilan navigatsiya qilayotganlar uchun aniq va brendga mos fokus holati. */
                .navbar-roboto-container a:focus-visible,
                .navbar-roboto-container button:focus-visible,
                .navbar-roboto-container [role="button"]:focus-visible {
                    outline: 2px solid ${BRAND};
                    outline-offset: 2px;
                    border-radius: 6px;
                }
            `}</style>

            {/*
                HEADER: har doim tepada va butun kenglikda (w-full). Default holatda hech qanday
                padding yo'q — navbar chekka-chekkaga yopishgan. Skrol bo'lganda atrofdan bo'shliq
                (pt-4 / px-4) qo'shiladi — shu bo'shliq ichida nav "suzuvchi kapsula"ga aylanadi.
            */}
            <header className={`navbar-roboto-container fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'pt-3 px-4' : 'pt-0 px-0'}`}>
                <nav
                    className={`nav-transition mx-auto border flex items-center h-16 min-[1201px]:h-20 ${isScrolled
                            ? 'max-w-[1500px] rounded-full bg-white/95 backdrop-blur-xl border-gray-100 shadow-2xl'
                            : 'max-w-[1500px] rounded-full bg-white border-transparent border-b-gray-100 shadow-none border-none'
                        }`}
                >
                    {/*
                        KONTENT: logo, menyu, qidiruv va til tanlash HAR DOIM bir xil max-width va padding
                        bilan markazlashgan konteyner ichida turadi. Shu tufayli tashqi <nav> kichrayib/
                        kattalashib turishidan qat'i nazar, ichidagi elementlar chap-o'ngga siljimaydi.
                    */}
                    <div className="w-full h-full max-w-[1490px] mx-auto flex items-center justify-between px-5 sm:px-5 min-[1201px]:px-5">

                        {/* LOGO */}
                        <div className="flex items-center shrink-0">
                            <Link href="/">
                                <img src={logo.src || logo} alt="UzAuto Trailer" className="w-auto h-9 min-[1201px]:h-12 object-contain cursor-pointer transition-transform duration-300 hover:scale-105" />
                            </Link>
                        </div>

                        {/* DESKTOP MENU */}
                        <div className="hidden min-[1201px]:flex flex-1 justify-center h-full">
                            <ul className="flex items-center gap-x-6 xl:gap-x-8 text-[#1a2e44] font-semibold text-[15px] xl:text-[16px] h-full whitespace-nowrap">
                                <NavItem label={t.about} open={activeMenu === 'about'} isCurrent={isAboutActive} onEnter={() => setActiveMenu('about')} onLeave={() => setActiveMenu(null)}>
                                    <div className="p-8 bg-white w-[600px] grid grid-cols-2 gap-x-8 gap-y-2">
                                        {fullAboutItems.map((item, i) => {
                                            const active = isPathActive(item.link);
                                            return (
                                                <Link key={i} href={item.link}>
                                                    <div className={`px-4 py-3 font-bold text-[14px] rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 ${active ? 'bg-blue-50 text-[#0061A4]' : 'hover:bg-gray-50 text-[#004A99]'}`}>
                                                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4] shrink-0" />}
                                                        {item.title}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </NavItem>

                                <NavItem label={t.production} open={activeMenu === 'prod'} isCurrent={isProdActive} onEnter={() => setActiveMenu('prod')} onLeave={() => { setActiveMenu(null); setActiveSubMenu(null); }}>
                                    <ul className="py-4 w-72">
                                        {t.prodItems.map((item, i) => (
                                            item.sub ? (
                                                <li key={i} className="relative px-6 py-3.5 hover:bg-gray-50 text-[#004A99] font-bold transition-all duration-200 cursor-pointer text-sm flex items-center justify-between" onMouseEnter={() => setActiveSubMenu(item.label)} onMouseLeave={() => setActiveSubMenu(null)}>
                                                    <span className="flex items-center gap-2">
                                                        {item.sub.some(s => isPathActive(s.link)) && <span className="w-1.5 h-1.5 rounded-full bg-[#0061A4]" />}
                                                        {item.label}
                                                    </span>
                                                    <ChevronRight size={14} className={`transition-transform duration-300 ${activeSubMenu === item.label ? 'rotate-90' : ''}`} />
                                                    <AnimatePresence>
                                                        {activeSubMenu === item.label && (
                                                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.16 }} className="absolute top-0 left-full ml-2 w-80 bg-white shadow-[0_18px_45px_-12px_rgba(15,35,65,0.28)] border border-gray-100 py-3 z-[110] rounded-3xl overflow-hidden">
                                                                {item.sub.map((subItem, j) => {
                                                                    const active = isPathActive(subItem.link || "#");
                                                                    return (
                                                                        <Link key={j} href={subItem.link || "#"}>
                                                                            <div className={`px-6 py-3 font-bold text-sm border-b border-gray-50 last:border-0 transition-all duration-200 ${active ? 'bg-blue-50 text-[#0061A4]' : 'hover:bg-gray-50 text-[#004A99]'}`}>{subItem.title}</div>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </li>
                                            ) : (
                                                <Link key={i} href={item.link}>
                                                    <div className={`px-6 py-3.5 font-bold text-sm transition-all duration-200 ${isPathActive(item.link) ? 'bg-blue-50 text-[#0061A4]' : 'hover:bg-gray-50 text-[#004A99]'}`}>{item.label}</div>
                                                </Link>
                                            )
                                        ))}
                                    </ul>
                                </NavItem>

                                {simpleLinks.map((l) => (
                                    <SimpleNavLink key={l.href} href={l.href} label={l.label} isCurrent={isPathActive(l.href)} />
                                ))}
                            </ul>
                        </div>

                        {/* RIGHT SECTION: Search, Language, Burger */}
                        <div className="flex items-center gap-3 min-[1201px]:gap-5 justify-end">
                            <div className="relative hidden min-[1201px]:block w-44 xl:w-52 h-9" ref={searchWrapperRef}>
                                <div className={`absolute right-0 top-0 flex items-center rounded-full px-4 py-2 transition-all duration-300 border ${showSuggestions ? 'w-[380px] bg-white border-[#0061A4]/40 shadow-xl' : 'w-full bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                                        placeholder={t.searchPlaceholder}
                                        aria-label={t.searchPlaceholder}
                                        className="bg-transparent border-none outline-none w-full text-[13px] ml-3 font-medium text-gray-800 placeholder:text-gray-400"
                                    />
                                </div>
                                <AnimatePresence>
                                    {showSuggestions && <SearchResults suggestions={suggestions} t={t} getLangField={getLangField} handleResultClick={handleResultClick} />}
                                </AnimatePresence>
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    aria-haspopup="true"
                                    aria-expanded={isLangOpen}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide transition-all duration-200 bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 text-black"
                                >
                                    <GlobeIcon size={14} className="text-[#0061A4]" />
                                    <span>{lang}</span>
                                </button>
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.16 }} className="absolute right-0 mt-3 w-44 bg-white shadow-[0_18px_45px_-12px_rgba(15,35,65,0.28)] rounded-3xl p-1.5 z-[120] border border-gray-100">
                                            {languageOptions.map(({ code, label }) => (
                                                <button
                                                    key={code}
                                                    onClick={() => { setLang(code); setIsLangOpen(false); }}
                                                    className={`w-full flex items-center justify-between gap-2 text-left px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-200 ${lang === code ? 'bg-blue-50 text-[#0061A4]' : 'hover:bg-gray-50 text-black'}`}
                                                >
                                                    {label}
                                                    {lang === code && <Check size={14} className="text-[#0061A4]" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Menu" className="min-[1201px]:hidden p-2 text-black rounded-full hover:bg-gray-50 transition-colors duration-200">
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/*
                SPACER: header `fixed` bo'lgani uchun sahifa oqimidan chiqadi — shuning uchun undan keyingi
                content navbar ostiga yashirinib qolmasligi uchun aynan shuncha joy band qilinadi.
                Qiymatlar navbar balandligi (h-16/h-20) + skrolda qo'shiladigan pt-4 (16px) bilan ANIQ mos:
                h-16 (64px) + 16px = h-20 (80px); h-20 (80px) + 16px = h-24 (96px).
                Shu sababli scroll paytida ortiqcha oq bo'shliq yoki content sakrashi bo'lmaydi.
                ESLATMA: agar sahifangizda Navbar tagida qo'lda qo'yilgan pt-20 / mt-20 kabi bo'shliq bo'lsa,
                uni olib tashlang — endi shu spacer o'zi kifoya.
            */}
            {/* <div
                aria-hidden="true"
                className={`w-full transition-all duration-300 ${isScrolled ? 'h-20 min-[1201px]:h-24' : 'h-16 min-[1201px]:h-20'}`}
            /> */}

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25 }} className="navbar-roboto-container fixed inset-0 bg-white z-[9999] min-[1201px]:hidden flex flex-col">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                            <img src={logo.src || logo} alt="UzAuto Trailer" className="h-10 w-auto" />
                            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="text-black p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"><XIcon size={22} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            <div className="space-y-1">
                                <MobileNavItem icon={Info} label={t.about} isOpen={mobileAccordion === 'about'} isCurrent={isAboutActive} onClick={() => setMobileAccordion(mobileAccordion === 'about' ? null : 'about')}>
                                    {fullAboutItems.map((item, i) => (
                                        <Link key={i} href={item.link} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-2 font-semibold transition-colors duration-200 ${isPathActive(item.link) ? 'text-[#0061A4]' : 'text-gray-500'}`}>
                                            {isPathActive(item.link) && <span className="w-1 h-1 rounded-full bg-[#0061A4]" />}
                                            {item.title}
                                        </Link>
                                    ))}
                                </MobileNavItem>
                                <MobileNavItem icon={Settings} label={t.production} isOpen={mobileAccordion === 'production'} isCurrent={isProdActive} onClick={() => setMobileAccordion(mobileAccordion === 'production' ? null : 'production')}>
                                    {t.prodItems.map((item, i) => (
                                        <div key={i} className="mb-4">
                                            {item.sub ? (
                                                <>
                                                    <div className="text-xs font-black text-blue-400 uppercase tracking-wide mb-2">{item.label}</div>
                                                    {item.sub.map((sub, j) => (
                                                        <Link key={j} href={sub.link} onClick={() => setIsMobileMenuOpen(false)} className={`block py-1 transition-colors duration-200 ${isPathActive(sub.link) ? 'text-[#0061A4] font-bold' : 'text-gray-500'}`}>{sub.title}</Link>
                                                    ))}
                                                </>
                                            ) : (
                                                <Link href={item.link} onClick={() => setIsMobileMenuOpen(false)} className={`block font-bold ${isPathActive(item.link) ? 'text-[#0061A4]' : 'text-black'}`}>{item.label}</Link>
                                            )}
                                        </div>
                                    ))}
                                </MobileNavItem>
                                {simpleLinks.map((l) => (
                                    <SimpleMobileLink key={l.href} href={l.href} icon={l.icon} label={l.label} isCurrent={isPathActive(l.href)} onClick={() => setIsMobileMenuOpen(false)} />
                                ))}
                            </div>
                        </div>
                        <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-center gap-5">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.url} className="text-gray-400 transition-all duration-300 hover:scale-110" onMouseEnter={(e) => e.currentTarget.style.color = social.color} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                                    <social.icon size={20} strokeWidth={2.2} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;