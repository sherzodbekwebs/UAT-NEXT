'use client';

import React, { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronLeft, ChevronRight, ArrowUpRight, BedDouble, Box,
    Signal, LayoutGrid, List, X, ChevronDown, Layers, Gauge, Fuel, SlidersHorizontal, Check, Weight, Lock,
} from 'lucide-react';
import API, { API_URL } from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../SEO';
import { ShieldCheck, Factory, Award } from "lucide-react";

const SITE_URL = 'https://uzautotrailer.uz'; // <-- domeningizga moslang

// === TELEGRAMGA ZAYAVKA YUBORISH UCHUN ===
// DIQQAT: bu token/ID client (brauzer) kodida ochiq turadi, ya'ni har kim
// sahifa manba kodidan uni ko'rishi mumkin. Xohlasangiz buni keyinchalik
// backend orqali (masalan /api/lead route'i) yashiringan holda yuborish
// mumkin. Hozircha talab qilingandek to'g'ridan-to'g'ri Bot API'ga yuboriladi.
const BOT_TOKEN = '8607165005:AAH98FISY0M_ubhPYqF3klRQbuy34K5rHGU';
const CHANNEL_ID = '-1003693722283';

const localTranslations = {
    uz: {
        heroDesc: "Sizning biznesingiz uchun yuk tashuvchi, tirkama va maxsus texnikalarning keng assortimenti.",
        guarantee: "Rasmiy\nkafolat",
        production: "O'zimizning\nishlab chiqarish",
        modelsCount: "56 dan ortiq\ntexnika modellari",
        allModels: "Barcha modellar",
        categories: "Kategoriyalar",
        brands: "Brendlar",
        allBrands: "Barchasi",
        agreed: "Kelishilgan",
        currency: "so'm",
        more: "BATAFSIL",
        notFound: "Mahsulotlar topilmadi",
        clearFilter: "Filtrni tozalash",
        total: "ta",
        getPrice: "Narxini bilish uchun so'rov qoldiring",
        tapToView: "Narxni ko'rish",
        modalTitle: "Narxni ko'rish uchun ma'lumot qoldiring",
        modalDesc: "So'rovni yuborishingiz bilanoq barcha texnika narxlari saytda darhol ko'rinadi.",
        namePlaceholder: "Ismingiz",
        phonePlaceholder: "Telefon raqamingiz",
        submitBtn: "Narxlarni ko'rish",
        submitting: "Yuborilmoqda...",
        successMsg: "Rahmat! Endi barcha narxlar saytda ko'rinadi.",
        errorMsg: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
        leadFillError: "Iltimos, ism va telefon raqamingizni kiriting",
        nameInvalid: "Ismingizni to'g'ri kiriting (kamida 2 ta harf)",
        phoneInvalid: "Telefon raqamini to'liq kiriting (9 ta raqam)",
    },
    ru: {
        heroDesc: "Широкий ассортимент грузовой, прицепной и специальной техники для вашего бизнеса.",
        guarantee: "Официальная\nгарантия",
        production: "Собственное\nпроизводство",
        modelsCount: "Более 56\nмоделей техники",
        allModels: "Все модели",
        categories: "Категории",
        brands: "Бренды",
        allBrands: "Все",
        agreed: "Договорная",
        currency: "сум",
        more: "ПОДРОБНЕЕ",
        notFound: "Ничего не найдено",
        clearFilter: "Очистить фильтр",
        total: "ед.",
        getPrice: "Оставьте заявку, чтобы узнать цену",
        tapToView: "Показать цену",
        modalTitle: "Оставьте данные, чтобы увидеть цену",
        modalDesc: "Как только вы отправите заявку, все цены на технику сразу появятся на сайте.",
        namePlaceholder: "Ваше имя",
        phonePlaceholder: "Номер телефона",
        submitBtn: "Показать цены",
        submitting: "Отправка...",
        successMsg: "Спасибо! Теперь все цены отображаются на сайте.",
        errorMsg: "Произошла ошибка. Попробуйте ещё раз.",
        leadFillError: "Пожалуйста, введите имя и номер телефона",
        nameInvalid: "Введите имя корректно (минимум 2 буквы)",
        phoneInvalid: "Введите номер полностью (9 цифр)",
    },
    en: {
        heroDesc: "A wide range of cargo, trailer and special equipment for your business.",
        guarantee: "Official\nwarranty",
        production: "Own\nproduction",
        modelsCount: "More than 56\nequipment models",
        allModels: "All models",
        categories: "Categories",
        brands: "Brands",
        allBrands: "All",
        agreed: "Price on request",
        currency: "sum",
        more: "DETAILS",
        notFound: "No products found",
        clearFilter: "Clear filters",
        total: "units",
        getPrice: "Fill the form to see the price",
        tapToView: "Show price",
        modalTitle: "Enter your details to see the price",
        modalDesc: "As soon as you submit the request, all equipment prices appear on the site immediately.",
        namePlaceholder: "Your name",
        phonePlaceholder: "Phone number",
        submitBtn: "Show prices",
        submitting: "Sending...",
        successMsg: "Thank you! All prices are now shown on the site.",
        errorMsg: "Something went wrong. Please try again.",
        leadFillError: "Please enter your name and phone number",
        nameInvalid: "Please enter a valid name (at least 2 letters)",
        phoneInvalid: "Please enter the full phone number (9 digits)",
    }
};


const menuVariants = {
    open: {
        height: "auto",
        opacity: 1,
        transition: {
            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.2, delay: 0.1 }
        }
    },
    collapsed: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.1 }
        }
    }
};



const getField = (item, field, lang) => {
    if (!item) return '---';
    const k = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : 'Uz';
    return item[`${field}${k}`] || item[`${field}Ru`] || '---';
};

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Sahifalarni aqlli qisqartirish: 1 ... 4 5 6 ... 10 ko'rinishida
function getPaginationRange(current, total) {
    const siblingCount = 1;
    const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2*siblings, 2*dots

    if (total <= totalNumbers) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, total);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    if (!showLeftDots && showRightDots) {
        const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
        return [...leftRange, 'dots', total];
    }

    if (showLeftDots && !showRightDots) {
        const rightRange = Array.from(
            { length: 3 + siblingCount * 2 },
            (_, i) => total - (3 + siblingCount * 2) + i + 1
        );
        return [1, 'dots', ...rightRange];
    }

    const middleRange = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
    );
    return [1, 'dots', ...middleRange, 'dots', total];
}

const formatImgUrl = (path) => {
    if (!path) return "";
    return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};

const hasPrice = (value) => {
    if (value === null || value === undefined || value === '') return false;
    const normalized = String(value).replace(/\s+/g, '').replace(/,/g, '.');
    const numeric = Number(normalized.replace(/[^\d.]/g, ''));
    return Number.isFinite(numeric) && numeric > 0;
};

// Barmoq (tap) animatsiyasi: narx ustiga bosayotgandek qimirlab turadi
const TapHand = ({ size = 22, target = 32 }) => {
    const paths = (
        <>
            <path d="M22 14a8 8 0 0 1-8 8" />
            <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
            <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
            <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
            <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </>
    );
    return (
        <span
            aria-hidden
            className="tap-finger pointer-events-none absolute z-10"
            style={{ left: target / 2 - size / 3, top: target / 2 - size / 12, width: size, height: size }}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g stroke="#fff" strokeWidth="4.4">{paths}</g>
                <g stroke="#0f172a" strokeWidth="2">{paths}</g>
            </svg>
        </span>
    );
};

const ScanlineOverlay = () => (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)', backgroundSize: '100% 4px' }}
    />
);

const GlitchText = ({ children, className }) => (
    <span className={cn("relative inline-block", className)}>
        {children}
        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-75"
            style={{ color: '#0061A4', clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-2px)' }} aria-hidden >
            {children}
        </span>
    </span>
);

const CountBadge = ({ count, active }) => (
    <span className={cn(
        "inline-flex items-center justify-center min-w-[24px] h-[22px] px-1.5 rounded-md text-[10px] font-black border transition-all",
        active ? "bg-white text-[#0061A4] border-white" : "bg-blue-50 text-[#0061A4] border-blue-100"
    )}>
        {count}
    </span>
);

// Telefon: faqat 9 ta raqam (+998 dan keyingi qism), "90 810 10 09" ko'rinishida
const formatPhone = (raw) => {
    let digits = String(raw).replace(/\D/g, '');
    // Paste qilinganda +998 yoki 998 bilan kelsa, kodni olib tashlaymiz
    if (digits.startsWith('998') && digits.length > 9) digits = digits.slice(3);
    digits = digits.slice(0, 9);
    const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
    return parts.filter(Boolean).join(' ');
};

// Ism: faqat harflar, bo'sh joy va ' - belgilari
const cleanName = (raw) => String(raw).replace(/[^\p{L}\s'’`-]/gu, '').slice(0, 40);

const ProductsPageContent = () => {
    const productsTopRef = useRef(null);
    const { t, lang } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const curT = localTranslations[lang] || localTranslations.ru;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [viewMode, setViewMode] = useState('grid');

    // === NARXLARNI OCHISH (LEAD-FORM) UCHUN STATE ===
    // Foydalanuvchi hali forma to'ldirmagan bo'lsa narxlar o'rniga
    // "Narxini bilish uchun so'rov qoldiring" havolasi ko'rsatiladi.
    // Forma bir marta muvaffaqiyatli yuborilgach, `pricesUnlocked` true
    // bo'ladi va BARCHA mahsulotlarning narxi saytda darhol ko'rinadi
    // (mijozga "qo'ng'iroq qilib aytishadi" degan taassurot bermaslik uchun).
    // sessionStorage orqali bu holat faqat shu tab ochiq turguncha saqlanadi (sayt yopilsa, narxlar yana yopiladi).
    const [pricesUnlocked, setPricesUnlocked] = useState(false);
    const [priceModalProduct, setPriceModalProduct] = useState(null);
    const [leadName, setLeadName] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [leadSubmitting, setLeadSubmitting] = useState(false);
    const [leadError, setLeadError] = useState('');
    const [leadSuccess, setLeadSuccess] = useState(false);

    useEffect(() => {
        try {
            // Eski versiyada localStorage ishlatilgan edi: doimiy ochiq qolib ketmasligi uchun tozalaymiz
            window.localStorage.removeItem('uat_prices_unlocked');
            // sessionStorage: faqat shu tab ochiq turguncha saqlanadi.
            // Sayt/tab yopilib qayta kirilsa, narxlar yana yopiq bo'ladi.
            if (window.sessionStorage.getItem('uat_prices_unlocked') === '1') {
                setPricesUnlocked(true);
            }
        } catch (e) { /* storage mavjud emas */ }
    }, []);

    const openPriceModal = (product) => {
        setPriceModalProduct(product);
        setLeadError('');
        setLeadSuccess(false);
    };

    const closePriceModal = () => {
        setPriceModalProduct(null);
        setLeadName('');
        setLeadPhone('');
        setLeadError('');
        setLeadSuccess(false);
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        const nameLetters = leadName.replace(/[^\p{L}]/gu, '');
        const phoneDigits = leadPhone.replace(/\D/g, '');
        if (!leadName.trim() && !phoneDigits) {
            setLeadError(curT.leadFillError);
            return;
        }
        if (nameLetters.length < 2) {
            setLeadError(curT.nameInvalid);
            return;
        }
        if (phoneDigits.length !== 9) {
            setLeadError(curT.phoneInvalid);
            return;
        }
        setLeadSubmitting(true);
        setLeadError('');
        try {
            const productTitle = priceModalProduct ? getField(priceModalProduct, 'title', lang) : '---';
            const productPrice = priceModalProduct
                ? (hasPrice(priceModalProduct.price) ? `${priceModalProduct.price} ${curT.currency}` : curT.agreed)
                : '---';

            const message =
                `🆕 Yangi so'rov (Narx uchun)\n\n` +
                `👤 Ism: ${leadName.trim()}\n` +
                `📞 Telefon: +998 ${leadPhone.trim()}\n` +
                `🚛 Texnika: ${productTitle}\n` +
                `💰 Narx: ${productPrice}\n` 
                // `🌐 Sahifa: ${typeof window !== 'undefined' ? window.location.href : ''
                // }`;

            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message,
                }),
            });

            if (!res.ok) throw new Error('Telegram request failed');

            setLeadSuccess(true);
            setPricesUnlocked(true);
            try { window.sessionStorage.setItem('uat_prices_unlocked', '1'); } catch (err) { /* ignore */ }
            setTimeout(() => {
                closePriceModal();
            }, 1200);
        } catch (err) {
            setLeadError(curT.errorMsg);
        } finally {
            setLeadSubmitting(false);
        }
    };

    // === CPANEL/LITESPEED KESH MUAMMOSI UCHUN TUZATISH ===
    // Ilgari activeCategory/activeBrand/currentPage to'g'ridan-to'g'ri
    // `searchParams`dan olinardi va har bir filtr/pagination bosilganda
    // `router.push(...)` chaqirilardi. router.push Next.js'da server bilan
    // ichki RSC so'rovi orqali ishlaydi — cPanel (LiteSpeed) kesh shu ichki
    // so'rovlarni ham keshlab qo'yib, refreshdan keyin javob noto'g'ri/kech
    // kelishiga sabab bo'lardi. Natijada tugma bosiladi, lekin URL va
    // sahifa hech qachon yangilanmasdi.
    // Endi activeCategory/activeBrand/currentPage local state sifatida
    // saqlanadi va URL faqat window.history.pushState orqali (Next.js
    // serveriga umuman murojaat qilmasdan) yangilanadi. Bu keshdan
    // butunlay mustaqil ishlaydi.
    const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || 'all');
    const [activeBrand, setActiveBrand] = useState(() => searchParams.get('brand') || 'all');
    const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);

    // Brauzerning orqaga/oldinga tugmalari bosilganda ham state URL bilan
    // sinxron bo'lishi uchun.
    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            setActiveCategory(params.get('category') || 'all');
            setActiveBrand(params.get('brand') || 'all');
            setCurrentPage(Number(params.get('page')) || 1);
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const scrollToProducts = () => {
        if (productsTopRef.current) {
            const navbarHeight = 130; // Navbaringiz balandligi + zapas
            const elementPosition = productsTopRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const { data: exchangeRate } = useQuery({
        queryKey: ['usdRate'],
        queryFn: async () => {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await response.json();
                return data.rates.UZS || 12850;
            } catch (err) {
                return 12850;
            }
        },
        staleTime: 1000 * 60 * 60 * 12,
    });

    const { data: products = [], isLoading: pLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => API.get('/products').then(res => res.data)
    });

    const { data: categories = [], isLoading: cLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => API.get('/categories').then(res => res.data)
    });

    const { data: brands = [], isLoading: bLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: () => API.get('/brands').then(res => res.data)
    });

    const loading = pLoading || cLoading || bLoading;

    const groupedCategories = useMemo(() => {
        const groups = [
            { id: 'tractors', ru: 'Седельные тягачи', uz: 'Egarli tortuvchilar', en: 'Truck Tractors', match: ['Седельный тягач'] },
            { id: 'dumpers', ru: 'Автосамосвал', uz: 'Avtosamosvallar', en: 'Dump Trucks', match: ['Автосамосвал'] },
            { id: 'vans', ru: 'Фургоны и бортовые', uz: 'Furgon va bortli avtomobillar', en: 'Vans and Flatbed Trucks', match: ['Автофургон', 'Вахтовый автобус', 'Бортовая платформа'] },
            { id: 'special', ru: 'Специальная техника', uz: 'Maxsus texnikalar', en: 'Special Purpose Vehicles', match: ['Автогидроподъёмник', 'Кran-Manipulyator', 'Кран-Манипулятор', 'Автокран', 'Автоцистерна', 'Коммунальная техника'] },
            { id: 'chassis', ru: 'Шасси', uz: 'Shassi', en: 'Chassis', match: ['Шасси'] },
            { id: 'trailers', ru: 'Прицепная техника', uz: 'Tirkama texnikalari', en: 'Towed Equipment', match: ['Полуприцепы', 'Прицепы'] },
            { id: 'mini-trucks', ru: 'Мини-грузовики', uz: 'Mini yuk mashinalari', en: 'Mini Trucks', match: ['Мини-грузовик'] },
        ];
        return groups.map(group => ({
            ...group,
            items: categories.filter(cat => group.match.some(m => cat.titleRu?.toLowerCase().includes(m.toLowerCase())))
        }));
    }, [categories]);

    const itemsPerPage = 6;

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

    const activeProducts = useMemo(
        () => products.filter(p => p.isActive === true),
        [products]
    );

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const isActiveMatch = p.isActive === true;
            const brandMatch = activeBrand === 'all' || String(p.brandId) === String(activeBrand);
            const group = groupedCategories.find(g => g.id === activeCategory);
            if (group) {
                const catIds = group.items.map(i => String(i.id));
                return isActiveMatch && brandMatch && catIds.includes(String(p.categoryId));
            }
            const catMatch = activeCategory === 'all' || String(p.categoryId) === String(activeCategory);
            return isActiveMatch && brandMatch && catMatch;
        });
    }, [products, activeCategory, activeBrand, groupedCategories]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const currentTitle = useMemo(() => {
        if (activeCategory === 'all') return curT.allModels;

        // 1. Maxsus guruhlar (special, dumpers, etc.)
        const group = groupedCategories.find(g => g.id === activeCategory);
        if (group) {
            return lang === 'ru' ? group.ru : lang === 'en' ? group.en : group.uz;
        }

        // 2. Real ID bo'yicha kategoriyalar
        const cat = categories.find(c => String(c.id) === String(activeCategory));
        if (cat) {
            return getField(cat, 'title', lang);
        }

        return '---';
    }, [activeCategory, groupedCategories, categories, lang, curT.allModels]);

    const handleFilterChange = (newParams, sidebarClose = true) => {
        const url = new URL(window.location.href);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === 'all') url.searchParams.delete(key);
            else url.searchParams.set(key, value);
        });
        url.searchParams.set('page', '1');

        // Next.js serveriga murojaat qilmasdan, faqat brauzer URL'ini yangilaymiz
        window.history.pushState({}, '', url.toString());

        if (newParams.category !== undefined) setActiveCategory(newParams.category);
        if (newParams.brand !== undefined) setActiveBrand(newParams.brand);
        setCurrentPage(1);

        if (sidebarClose) setSidebarOpen(false);

        // Filtrlashda ham tepaga chiqaramiz
        setTimeout(scrollToProducts, 100);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const url = new URL(window.location.href);
            url.searchParams.set('page', String(newPage));

            window.history.pushState({}, '', url.toString());
            setCurrentPage(newPage);

            // Biz xohlagan joygacha smoth scroll qilamiz
            setTimeout(scrollToProducts, 100);
        }
    };

    // === MUAMMO 2 UCHUN TUZATISH ===
    // Refresh yoki filtr o'zgarishidan keyin URL'dagi `page` qiymati
    // yangi `totalPages` chegarasidan katta bo'lib qolishi mumkin edi
    // (masalan page=3 turibdi-yu, filtr natijasida totalPages=1 bo'lib qoladi).
    // Bu holatda pagination tugmalari "ishlamayotgandek" ko'rinardi,
    // chunki handlePageChange ichidagi shart (newPage <= totalPages) bajarilmasdi.
    // Quyidagi effekt bunday holatlarni avtomatik tuzatadi (endi router
    // o'rniga window.history.replaceState ishlatiladi — keshga bog'liq emas).
    useEffect(() => {
        if (loading) return;
        if (totalPages === 0) return;
        if (currentPage > totalPages) {
            const url = new URL(window.location.href);
            url.searchParams.set('page', String(totalPages));
            window.history.replaceState({}, '', url.toString());
            setCurrentPage(totalPages);
        }
    }, [loading, totalPages, currentPage]);

    useEffect(() => {
        const categoryParam = searchParams.get('category') || 'all';
        const brandParam = searchParams.get('brand') || 'all';
        const pageParam = Number(searchParams.get('page')) || 1;

        setActiveCategory(prev => (prev !== categoryParam ? categoryParam : prev));
        setActiveBrand(prev => (prev !== brandParam ? brandParam : prev));
        setCurrentPage(prev => (prev !== pageParam ? pageParam : prev));
    }, [searchParams]);

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => {
            // Agar bir vaqtda faqat bitta guruh ochiq turishini xohlasangiz:
            // return { [groupId]: !prev[groupId] }; 

            // Agar bir nechta guruh ochiq turishi mumkin bo'lsa:
            return { ...prev, [groupId]: !prev[groupId] };
        });
    };

    const clearFilters = () => {
        window.history.pushState({}, '', pathname);
        setActiveCategory('all');
        setActiveBrand('all');
        setCurrentPage(1);
        setSidebarOpen(false);
    };

    const hasActiveFilters = activeCategory !== 'all' || activeBrand !== 'all';


    ///////////////////////  SIDEBAR: CATEGORIES  ///////////////////////
    const CategoryList = () => (
        // motion.div va layout prop'i ichidagi elementlar surilganda ularni silliq qiladi
        <motion.div layout className="flex flex-col gap-3">
            {/* 1. Barcha mahsulotlar tugmasi */}
            <motion.button
                layout
                onClick={() => handleFilterChange({ category: 'all' }, true)}
                className={cn(
                    "w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl transition-all border shadow-sm",
                    activeCategory === 'all'
                        ? "bg-[#0061A4] border-[#0061A4] text-white shadow-blue-100"
                        : "bg-white border-gray-100 text-slate-700 hover:border-[#0061A4]/30"
                )}
            >
                <div className="flex items-center gap-3">
                    <LayoutGrid size={18} className={activeCategory === 'all' ? "text-white" : "text-[#0061A4]"} />
                    <span className="text-[13px] sm:text-[14px] font-black tracking-tight">{curT.allModels}</span>
                </div>
                <span className={cn("px-2.5 py-0.5 rounded-lg text-[11px] font-black", activeCategory === 'all' ? "bg-white/20 text-white" : "bg-blue-50 text-[#0061A4]")}>
                    {activeProducts.length}
                </span>
            </motion.button>

            {/* 2. Kategoriyalar */}
            {groupedCategories.map((group) => {
                const isGroupActive = activeCategory === group.id;

                // Faqat lokal state orqali ochilishini nazorat qilamiz
                const isExpanded = expandedGroups[group.id];

                return (
                    <motion.div layout key={group.id} className="flex flex-col gap-1">
                        <div className={cn(
                            "flex items-center rounded-2xl transition-all border shadow-sm overflow-hidden",
                            isGroupActive ? "bg-[#0061A4] border-[#0061A4] text-white" : "bg-white border-gray-100"
                        )}>
                            <button
                                onClick={() => {
                                    // 1. Filtrlash (URL o'zgaradi)
                                    handleFilterChange({ category: group.id }, false);
                                    // 2. Lokal ochish/yopish (Animatsiya uchun)
                                    toggleGroup(group.id);
                                }}
                                className="flex-1 flex items-center gap-3 text-left px-4 sm:px-5 py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-bold min-w-0"
                            >
                                <Box size={18} className={cn("shrink-0", isGroupActive ? "text-white" : "text-[#0061A4]")} />
                                <span className="truncate">{lang === 'ru' ? group.ru : lang === 'en' ? group.en : group.uz}</span>
                            </button>

                            {group.items.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleGroup(group.id);
                                    }}
                                    className={cn(
                                        "p-4 border-l transition-transform duration-300 shrink-0",
                                        isExpanded ? "rotate-180" : "rotate-0",
                                        isGroupActive ? "border-white/10" : "border-gray-50"
                                    )}
                                >
                                    <ChevronDown size={14} />
                                </button>
                            )}
                        </div>

                        <AnimatePresence initial={false}>
                            {isExpanded && group.items.length > 0 && (
                                <motion.div
                                    key={`content-${group.id}`}
                                    initial="collapsed"
                                    animate="open"
                                    exit="collapsed"
                                    variants={menuVariants}
                                    className="overflow-hidden bg-gray-50/50 mx-2 rounded-b-2xl border-x border-b border-blue-50"
                                >
                                    <div className="flex flex-col gap-1 px-2 pt-2 pb-3">
                                        {group.items.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleFilterChange({ category: String(cat.id) }, true)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all text-left",
                                                    String(activeCategory) === String(cat.id)
                                                        ? "bg-blue-100/50 text-[#0054A6]"
                                                        : "text-slate-500 hover:bg-gray-100"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full transition-all shrink-0",
                                                    String(activeCategory) === String(cat.id) ? "bg-[#0054A6] scale-125" : "bg-slate-300"
                                                )} />
                                                <span className="truncate">{getField(cat, 'title', lang)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </motion.div>
    );

    ///////////////////////  SIDEBAR: BRANDS (checkbox style)  ///////////////////////
    const BrandList = () => (
        <div className="flex flex-col gap-1">
            <button
                onClick={() => handleFilterChange({ brand: 'all' }, true)}
                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-left"
            >
                <div className={cn("w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all", activeBrand === 'all' ? "bg-[#0061A4] border-[#0061A4]" : "border-gray-300")}>
                    {activeBrand === 'all' && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-[13px] font-bold text-gray-700 truncate">{t('all') || 'Barchasi'}</span>
                <span className="ml-auto text-[12px] font-bold text-gray-400 shrink-0">{products.length}</span>
            </button>

            {brands.map((b) => {
                const isActive = String(activeBrand) === String(b.id);
                const count = products.filter(p => String(p.brandId) === String(b.id)).length;
                return (
                    <button
                        key={b.id}
                        onClick={() => handleFilterChange({ brand: String(b.id) }, true)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-left"
                    >
                        <div className={cn("w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all", isActive ? "bg-[#0061A4] border-[#0061A4]" : "border-gray-300")}>
                            {isActive && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[13px] font-bold text-gray-700 truncate">{b.name}</span>
                        <span className="ml-auto text-[12px] font-bold text-gray-400 shrink-0">{count}</span>
                    </button>
                );
            })}
        </div>
    );

    const specTargets = [
        { key: "стандарт евро", icon: ShieldCheck },
        { key: "колесная формула", icon: Layers },
        { key: "мощность", icon: Gauge },
        {
            key: ["полная масса автомобиля", "полная масса автосамосвала"],
            icon: Weight,
            label: { uz: "To'liq massa", ru: "Полная масса", en: "Gross weight" }
        },
        {
            key: ["исполнение", "исполненение", "комфорт"],
            icon: BedDouble,
            label: { uz: "Kabina turi", ru: "Тип кабины", en: "Cab type" }
        },
        {
            key: ["вместимость топливных баков", "вместимость топливного бака", "объём топливного бака", "объем топливного бака", "топливный бак", "ёмкость топливного бака"],
            icon: Fuel,
            label: { uz: "Bak hajmi", ru: "Объем бака", en: "Fuel tank" }
        },
    ];

    const trailerSpecTargets = [
        {
            key: ["объем кузова", "объём кузова", "площадь кузова", "тип контейнеров"],
            icon: Box,
            label: { uz: "Kuzov hajmi", ru: "Объем кузова", en: "Body volume" }
        },
        {
            key: ["грузоподъемность", "грузоподъёмность", "масса перевозимого груза (техн.)", "масса перевозимого груза (техническая)"],
            icon: Weight,
            label: { uz: "Yuk ko'tarish qobiliyati", ru: "Грузоподъемность", en: "Payload capacity" }
        },
        {
            key: ["материал кузова"],
            icon: ShieldCheck,
            label: { uz: "Kuzov materiali", ru: "Материал кузова", en: "Body material" }
        },
        {
            key: ["количество осей"],
            icon: Layers,
            label: { uz: "O'qlar soni", ru: "Количество осей", en: "Number of axles" }
        },
        {
            key: ["полная масса", "технически допустимая максимальная масса", "полная масса полуприцепа (техн.)"],
            icon: Gauge,
            label: { uz: "To'liq massa", ru: "Полная масса", en: "Gross weight" }
        },
        {
            key: ["тормозная система"],
            icon: SlidersHorizontal,
            label: { uz: "Tormoz tizimi", ru: "Тормозная система", en: "Brake system" }
        },
    ];

    ///////////////////////  PRODUCT CARD (grid)  ///////////////////////
    const ProductCard = ({ p, idx, t, lang }) => {
        const productCategory = categories.find(c => String(c.id) === String(p.categoryId));
        const isTrailer = /прицеп/i.test(productCategory?.titleRu || '');
        const activeSpecTargets = isTrailer ? trailerSpecTargets : specTargets;

        const getTargetSpecs = () => {
            if (!p.techSpecs) return [];
            const result = [];
            for (const { key, icon, label } of activeSpecTargets) {
                const keywords = Array.isArray(key) ? key : [key];
                const found = p.techSpecs.find(spec =>
                    keywords.some(k => spec.keyRu?.toLowerCase().includes(k))
                );
                if (found) result.push({ spec: found, icon, label });
            }
            return result;
        };

        const displaySpecs = getTargetSpecs();

        return (
            <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full overflow-hidden hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
                {/* Rasm qismi */}
                <div className="relative h-[150px] sm:h-[170px] lg:h-[180px] bg-[#F9FAFB] flex items-center justify-center p-4 shrink-0 border-b border-gray-50">
                    <Link href={`/product/${p.slug || p.id}`} className="w-full h-full flex items-center justify-center">
                        <img
                            src={`${API_URL}/${p.image}`.replace(/([^:]\/)\/+/g, "$1")}
                            alt={getField(p, 'title', lang)}
                            loading="lazy"
                            className="max-w-[88%] max-h-full object-contain"
                        />
                    </Link>
                </div>

                <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
                    <Link href={`/product/${p.slug || p.id}`} className="group/title">
                        <h3 className="text-[15px] sm:text-[16px] lg:text-[17px] font-black text-slate-800 leading-tight group-hover/title:text-[#0061A4] transition-colors line-clamp-2 min-h-[38px] sm:min-h-[42px] flex items-center">
                            {getField(p, 'title', lang)}
                        </h3>
                    </Link>

                    {/* --- TEXNIK KO'RSATKICHLAR (icon grid, 2 ustun, jadval chizig'i bilan) --- */}
                    {displaySpecs.length > 0 && (
                        <div className="grid grid-cols-2 mb-4 sm:mb-6">
                            {displaySpecs.map(({ spec, icon: Icon, label }, i) => {
                                const isLeftCol = i % 2 === 0;
                                const isLastRow = i >= displaySpecs.length - 2;
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex items-center gap-2 sm:gap-2.5 min-w-0 min-h-[56px] sm:min-h-[64px] py-2.5 sm:py-3",
                                            isLeftCol ? "pr-2.5 sm:pr-4" : "pl-2.5 sm:pl-4",
                                            isLeftCol && "border-r border-gray-100",
                                            !isLastRow && "border-b border-gray-100"
                                        )}
                                    >
                                        <div className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] flex items-center justify-center shrink-0">
                                            <Icon size={16} className="text-[#0061A4] sm:hidden" />
                                            <Icon size={18} className="text-[#0061A4] hidden sm:block" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-none mb-1 sm:mb-1.5 truncate">
                                                {(typeof label === 'object' ? label?.[lang] || label?.ru : label) || getField(spec, 'key', lang)}
                                            </span>
                                            <p className="text-[12px] sm:text-[13px] font-black text-slate-700 leading-tight line-clamp-2">
                                                {getField(spec, 'val', lang)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* --- NARX / NARXNI SO'RASH --- */}
                    <div className="mt-auto flex items-center justify-between gap-2 rounded-2xl border border-[#0061A4]/20 bg-blue-50/40 p-1.5 pl-3.5">
                        {pricesUnlocked ? (
                            <span className="flex-1 min-w-0 text-[15px] sm:text-[16px] lg:text-[18px] font-black text-[#0061A4] tabular-nums tracking-tight truncate">
                                {hasPrice(p.price) ? `${p.price} ${curT.currency}` : curT.agreed}
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => openPriceModal(p)}
                                title={curT.getPrice}
                                aria-label={curT.getPrice}
                                className="group/price flex-1 flex items-center gap-2.5 min-w-0 cursor-pointer text-left"
                            >
                                <span className="flex flex-col min-w-0">
                                    {/* Haqiqiy narx DOM'ga chiqmaydi: faqat yopilgan ko'rinish */}
                                    <span
                                        aria-hidden
                                        className="text-[14px] sm:text-[15px] font-black text-slate-400 tabular-nums tracking-[0.18em] leading-none truncate select-none group-hover/price:text-[#0061A4] transition-colors"
                                    >
                                        •••• ••• {curT.currency}
                                    </span>
                                    <span className="mt-1.5 text-[10px] font-bold text-[#0061A4] leading-none truncate">
                                        {curT.tapToView}
                                    </span>
                                </span>
                                <span className="relative shrink-0 w-8 h-8 flex items-center justify-center">
                                    <span className="tap-ripple absolute inset-0 rounded-full bg-[#0061A4]/40" />
                                    <TapHand size={22} target={32} />
                                    <span className="relative w-8 h-8 rounded-full bg-[#0061A4] text-white flex items-center justify-center shadow-md shadow-blue-100 group-hover/price:scale-110 transition-transform">
                                        <Lock size={14} />
                                    </span>
                                </span>
                            </button>
                        )}

                        <Link
                            href={`/product/${p.slug || p.id}`}
                            className="group/more shrink-0 flex items-center gap-2.5 pl-3.5 pr-1.5 py-1.5 rounded-xl bg-white text-[#0061A4] text-[11px] sm:text-[12px] font-black uppercase tracking-wide shadow-sm hover:bg-[#0061A4] hover:text-white hover:shadow-lg hover:shadow-blue-200/60 active:scale-95 transition-all duration-300"
                        >
                            {curT.more}
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0061A4] flex items-center justify-center">
                                <ArrowUpRight
                                    size={16}
                                    className="transition-transform duration-300 group-hover/more:translate-x-0.5 group-hover/more:-translate-y-0.5"
                                />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );

    };

    // === MUAMMO 1 UCHUN TUZATISH ===
    // Ilgari bu yerda `typeof window !== 'undefined' ? ... : ''` ishlatilgan edi.
    // Bu server va client HTML'ini bir-biriga mos kelmasligiga (hydration mismatch)
    // olib kelardi: server har doim '' render qiladi, client esa haqiqiy URL'ni.
    // Refresh qilinganda shu nomuvofiqlik tufayli pastdagi komponentlar
    // to'liq hydrate bo'lmay qolishi (ya'ni onClick tugmalar ishlamay qolishi) mumkin edi.
    // Endi faqat server/client'da bir xil bo'ladigan pathname/searchParams ishlatilmoqda.
    const currentQueryString = searchParams.toString();
    const canonicalUrl = `${SITE_URL}${pathname}${currentQueryString ? `?${currentQueryString}` : ''}`;

    return (
        <div className="min-h-screen text-[#1A1C1E] font-roboto overflow-x-hidden"
            style={{
                backgroundColor: '#ffffff',
                backgroundImage: `radial-gradient(ellipse 100% 60% at 50% -10%, rgba(0,97,164,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(0,97,164,0.05) 0%, transparent 60%)`
            }}
        >

            <SEO
                title={t('products') + " - UzAuto TRAILER"}
                description="UzAuto Trailer mahsulotlari katalogi..."
                keywords="uat, uzauto, trailer"
                image="/uzbg1.png"
                canonical={canonicalUrl}
            />

            <script
                id="products-page-script"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": paginatedProducts.map((p, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "url": `${SITE_URL}/product/${p.slug || p.id}`
                        }))
                    })
                }}
            />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                * { box-sizing: border-box; font-family: 'Roboto', sans-serif !important; }
                .font-roboto { font-family: 'Roboto', sans-serif !important; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .product-card { transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
                .grid-bg { background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 60px 60px; }
                .skeleton { background: linear-gradient(90deg, #f6f7f8 25%, #edeef1 50%, #f6f7f8 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                @keyframes tapFinger {
                    0%   { transform: translate(14px, 16px) scale(1); opacity: 0; }
                    12%  { opacity: 1; }
                    40%  { transform: translate(0, 0) scale(1); opacity: 1; }
                    50%  { transform: translate(0, 0) scale(0.82); opacity: 1; }
                    62%  { transform: translate(0, 0) scale(1); opacity: 1; }
                    88%  { transform: translate(14px, 16px) scale(1); opacity: 1; }
                    100% { transform: translate(14px, 16px) scale(1); opacity: 0; }
                }
                @keyframes tapRipple {
                    0%, 44% { transform: scale(0.6); opacity: 0; }
                    50%     { opacity: 0.55; }
                    100%    { transform: scale(1.9); opacity: 0; }
                }
                .tap-finger { animation: tapFinger 2s ease-in-out infinite; transform-origin: 30% 10%; }
                .tap-ripple { animation: tapRipple 2s ease-out infinite; }
                @media (prefers-reduced-motion: reduce) { .tap-finger, .tap-ripple { animation: none; } }
                @media (max-width: 380px) {
                    .grid-cols-1.sm\\:grid-cols-2 { grid-template-columns: 1fr; }
                }
            `}</style>

            <ScanlineOverlay />

            <section
                ref={heroRef}
                className="relative overflow-hidden border-b border-[#E7EEF5] bg-gradient-to-br from-white via-[#F8FBFE] to-[#F2F8FD] pt-16 sm:pt-20 pb-10 sm:pb-12 lg:pb-16 font-roboto"
            >
                {/* Background */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 grid-bg opacity-[0.12] lg:opacity-[0.18]" />

                    {/* Glow */}
                    <div className="absolute -top-20 -right-20 lg:-top-40 lg:-right-40 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] rounded-full bg-[#0061A4]/10 blur-[80px] lg:blur-[120px]" />

                    {/* Hexagon pattern (Responsive SVG) */}
                    <svg
                        className="absolute right-[-100px] lg:right-0 top-0 h-full w-[600px] lg:w-[900px] opacity-40 lg:opacity-90 transition-opacity"
                        viewBox="0 0 900 500"
                        fill="none"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            <linearGradient id="hexFill" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#EAF3FB" />
                                <stop offset="60%" stopColor="#BFDCF3" />
                                <stop offset="100%" stopColor="#0061A4" />
                            </linearGradient>
                        </defs>

                        {/* small dotted hex outlines */}
                        {Array.from({ length: 14 }).map((_, i) => {
                            const cx = 60 + (i % 5) * 80;
                            const cy = 40 + Math.floor(i / 5) * 90;
                            const r = 26;
                            const pts = Array.from({ length: 6 })
                                .map((_, k) => {
                                    const a = (Math.PI / 3) * k - Math.PI / 6;
                                    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
                                })
                                .join(" ");
                            return (
                                <polygon
                                    key={i}
                                    points={pts}
                                    fill="none"
                                    stroke="#0061A4"
                                    strokeOpacity="0.15"
                                    strokeWidth="1"
                                    strokeDasharray="2 3"
                                />
                            );
                        })}

                        {/* large filled hexagon cluster */}
                        <polygon
                            points="620,60 760,140 760,300 620,380 480,300 480,140"
                            fill="url(#hexFill)"
                            opacity="0.9"
                        />
                        <polygon
                            points="760,20 860,80 860,220 760,280 660,220 660,80"
                            fill="url(#hexFill)"
                            opacity="0.55"
                        />
                        <polygon
                            points="500,280 600,340 600,460 500,520 400,460 400,340"
                            fill="url(#hexFill)"
                            opacity="0.35"
                        />
                    </svg>
                </motion.div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 sm:gap-10 lg:gap-12">

                        {/* LEFT SIDE */}
                        <div className="w-full lg:max-w-3xl text-left">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <div className="w-8 lg:w-10 h-px bg-[#0061A4]" />
                                <span className="text-[#0061A4] text-[10px] lg:text-[12px] font-bold tracking-[0.28em] uppercase">
                                    UzAuto TRAILER — Catalog
                                </span>
                                <Signal size={12} className="text-[#0061A4] animate-pulse" />
                            </div>

                            <h1 className="text-[32px] sm:text-[48px] lg:text-[70px] font-black leading-[1.1] lg:leading-none tracking-tight">
                                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0061A4] bg-clip-text text-transparent">
                                    <GlitchText>
                                        <span>{t("products")}</span>
                                    </GlitchText>
                                </span>
                            </h1>

                            <p className="mt-4 lg:mt-6 max-w-2xl text-[14px] sm:text-[15px] lg:text-[17px] leading-relaxed lg:leading-8 text-slate-800">
                                {curT.heroDesc}
                            </p>

                            {/* Feature stats (Icon based) */}
                            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center gap-x-5 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={20} className="text-[#0061A4] shrink-0 sm:hidden" />
                                    <ShieldCheck size={22} className="text-[#0061A4] shrink-0 hidden sm:block" />
                                    <div className="text-[12px] sm:text-[13px] lg:text-sm text-slate-800 font-medium leading-tight whitespace-pre-line">
                                        {curT.guarantee}
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-slate-200" />

                                <div className="flex items-center gap-3">
                                    <Factory size={20} className="text-[#0061A4] shrink-0 sm:hidden" />
                                    <Factory size={22} className="text-[#0061A4] shrink-0 hidden sm:block" />
                                    <div className="text-[12px] sm:text-[13px] lg:text-sm text-slate-800 font-medium leading-tight whitespace-pre-line">
                                        {curT.production}
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-slate-200" />

                                <div className="flex items-center gap-3">
                                    <Award size={20} className="text-[#0061A4] shrink-0 sm:hidden" />
                                    <Award size={22} className="text-[#0061A4] shrink-0 hidden sm:block" />
                                    <div className="text-[12px] sm:text-[13px] lg:text-sm text-slate-800 font-medium leading-tight whitespace-pre-line">
                                        {curT.modelsCount}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="w-full lg:w-auto flex flex-col gap-5 sm:gap-6 items-start lg:items-end">
                            <div className="w-full lg:w-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-2 lg:p-3 shadow-xl shadow-blue-100/40">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleFilterChange({ brand: "all" }, true)}
                                        className={cn(
                                            "flex-1 lg:flex-none px-3.5 sm:px-4 lg:px-6 py-2.5 rounded-xl text-[10px] lg:text-[11px] font-bold tracking-widest border transition-all cursor-pointer whitespace-nowrap",
                                            activeBrand === "all"
                                                ? "bg-[#0061A4] text-white border-[#0061A4]"
                                                : "bg-white border-gray-200 hover:border-[#0061A4] text-slate-700"
                                        )}
                                    >
                                        {t("all")}
                                    </button>

                                    {brands.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => handleFilterChange({ brand: String(b.id) }, true)}
                                            className={cn(
                                                "flex-1 lg:flex-none px-3.5 sm:px-4 lg:px-6 py-2.5 rounded-xl text-[10px] lg:text-[11px] font-bold tracking-widest border transition-all cursor-pointer whitespace-nowrap",
                                                String(activeBrand) === String(b.id)
                                                    ? "bg-[#0061A4] text-white border-[#0061A4]"
                                                    : "bg-white border-gray-200 hover:border-[#0061A4] text-slate-700"
                                            )}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!loading && (
                                <div className="lg:hidden w-full">
                                    <button
                                        onClick={() => setSidebarOpen(true)}
                                        className="flex items-center justify-center gap-3 w-full px-6 sm:px-10 py-3.5 sm:py-4 bg-[#0061A4] text-white rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
                                    >
                                        <LayoutGrid size={16} />
                                        {t("categories_label")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>


            {/* ============ MOBILE SIDEBAR ============ */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 bottom-0 z-[101] w-[88%] max-w-[340px] bg-white p-5 sm:p-6 overflow-y-auto lg:hidden">
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                <span className="text-xs font-black tracking-widest text-[#0061A4]">{t('categories_label')}</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 bg-gray-50 rounded-full text-black"><X size={20} /></button>
                            </div>
                            <CategoryList />
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <span className="text-xs font-black tracking-widest text-[#0061A4] mb-3 block">BRAND</span>
                                <BrandList />
                            </div>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-[13px]">
                                    <X size={14} /> {t('clear_filters') || 'Filtrni tozalash'}
                                </button>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ============ MAIN CONTENT ============ */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-14 font-roboto">
                <div className="flex gap-6 lg:gap-8 items-start">

                    {/* ---- DESKTOP SIDEBAR ---- */}
                    <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-32">
                        {/* 1. Sarlavha qismi - Endi u tugmalardan alohida tepada turadi */}
                        <div className="flex items-center gap-3 mb-8 px-1">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Layers size={18} className="text-[#0061A4]" />
                            </div>
                            <h2 className="text-[18px] font-black text-slate-900  tracking-tight">
                                {curT.categories}
                            </h2>
                        </div>

                        {/* 2. Tugmalar to'plami (CategoryList) */}
                        <div className="flex flex-col gap-3">
                            <CategoryList />
                        </div>

                        {/* Ixtiyoriy: Brandlar uchun ham sarlavha */}
                        <div className="mt-12">
                            <div className="flex items-center gap-3 mb-6 px-1">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <SlidersHorizontal size={18} className="text-[#0061A4]" />
                                </div>
                                <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">
                                    {curT.brands}
                                </h2>
                            </div>
                            <BrandList />
                        </div>
                    </aside>

                    {/* ---- PRODUCTS ---- */}
                    <main
                        ref={productsTopRef} className="flex-1 min-w-0 w-full font-roboto scroll-mt-32"
                    >

                        {/* Top bar: count + sort + view toggle */}
                        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6 flex-wrap">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <h2 className="text-[16px] sm:text-[18px] font-black text-slate-900 truncate">
                                    {currentTitle}
                                </h2>
                                <span className="bg-blue-50 text-[#0061A4] px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black shrink-0">
                                    {filteredProducts.length} {curT.total}
                                </span>
                            </div>

                            {/* Sort o'chirildi, faqat View toggle qoldi */}
                            <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
                                <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded transition-all", viewMode === 'grid' ? "bg-white text-[#0061A4] shadow-sm" : "text-gray-400")}>
                                    <LayoutGrid size={16} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded transition-all", viewMode === 'list' ? "bg-white text-[#0061A4] shadow-sm" : "text-gray-400")}>
                                    <List size={16} />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="w-full h-[320px] sm:h-[340px] skeleton rounded-2xl" />)}
                            </div>
                        ) : (
                            <>
                                <AnimatePresence mode="popLayout">
                                    <div className={cn(
                                        "grid gap-4 sm:gap-6 lg:gap-8",
                                        viewMode === 'grid'
                                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                            : "grid-cols-1"
                                    )}>
                                        {paginatedProducts.map((p, idx) => (
                                            <ProductCard key={p.id} p={p} idx={idx} t={t} lang={lang} />
                                        ))}
                                    </div>
                                </AnimatePresence>

                                {paginatedProducts.length === 0 && (
                                    <div className="w-full py-16 sm:py-24 flex flex-col items-center justify-center text-center gap-3">
                                        <Box size={40} className="text-gray-300" />
                                        <p className="text-gray-400 font-bold text-sm">{t('no_products_found') || 'Mahsulotlar topilmadi'}</p>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 sm:mt-12 py-6 border-t border-gray-100">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl border border-gray-100 text-slate-500 hover:bg-gray-50 hover:border-blue-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-100 transition-all cursor-pointer"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide max-w-full px-0.5">
                                            {getPaginationRange(currentPage, totalPages).map((item, i) =>
                                                item === 'dots' ? (
                                                    <span key={`dots-${i}`} className="w-8 sm:w-9 flex items-center justify-center text-slate-300 font-bold text-[13px] select-none">
                                                        •••
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={item}
                                                        onClick={() => handlePageChange(item)}
                                                        className={cn(
                                                            "shrink-0 w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl font-bold text-[12px] sm:text-[13px] transition-all border cursor-pointer",
                                                            currentPage === item
                                                                ? "bg-[#0061A4] text-white border-[#0061A4] shadow-lg shadow-blue-100/60"
                                                                : "bg-white text-slate-600 border-gray-100 hover:border-blue-300 hover:text-[#0061A4]"
                                                        )}
                                                    >
                                                        {item}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl border border-gray-100 text-slate-500 hover:bg-gray-50 hover:border-blue-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-100 transition-all cursor-pointer"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* ============ NARX SO'ROVI MODALI ============ */}
            <AnimatePresence>
                {priceModalProduct && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closePriceModal}
                            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 12 }}
                            className="fixed z-[201] inset-0 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-7 relative shadow-2xl pointer-events-auto">
                                <button
                                    onClick={closePriceModal}
                                    className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>

                                <h3 className="text-[16px] sm:text-[18px] font-black text-slate-900 text-center leading-snug px-6">
                                    {curT.modalDesc}
                                </h3>

                                {priceModalProduct && (
                                    <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                        <img
                                            src={`${API_URL}/${priceModalProduct.image}`.replace(/([^:]\/)\/+/g, "$1")}
                                            alt=""
                                            className="w-12 h-12 object-contain shrink-0"
                                        />
                                        <span className="text-[13px] font-bold text-slate-700 line-clamp-2">
                                            {getField(priceModalProduct, 'title', lang)}
                                        </span>
                                    </div>
                                )}

                                {leadSuccess ? (
                                    <div className="mt-6 flex flex-col items-center text-center gap-2 py-4">
                                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                            <Check size={22} className="text-green-600" strokeWidth={3} />
                                        </div>
                                        <p className="text-[13px] font-bold text-slate-700">{curT.successMsg}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleLeadSubmit} className="mt-5 flex flex-col gap-4" noValidate>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
                                                {curT.namePlaceholder}
                                            </label>
                                            <input
                                                type="text"
                                                autoComplete="name"
                                                value={leadName}
                                                onChange={(e) => { setLeadName(cleanName(e.target.value)); setLeadError(''); }}
                                                placeholder={curT.namePlaceholder}
                                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[14px] font-bold text-slate-800 placeholder:text-gray-300 placeholder:font-medium focus:outline-none focus:bg-white focus:border-[#0061A4] focus:ring-4 focus:ring-blue-50 transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
                                                {curT.phonePlaceholder}
                                            </label>
                                            <div className="flex items-stretch rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden focus-within:bg-white focus-within:border-[#0061A4] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                                                <span className="flex items-center px-4 text-[14px] font-black text-slate-700 bg-gray-100/70 border-r border-gray-200 select-none">
                                                    +998
                                                </span>
                                                <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    autoComplete="tel-national"
                                                    value={leadPhone}
                                                    onChange={(e) => { setLeadPhone(formatPhone(e.target.value)); setLeadError(''); }}
                                                    placeholder="90 810 10 09"
                                                    maxLength={12}
                                                    className="flex-1 min-w-0 px-4 py-3.5 bg-transparent text-[14px] font-bold text-slate-800 tabular-nums tracking-wide placeholder:text-gray-300 placeholder:font-medium focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {leadError && (
                                            <p className="text-[12px] font-bold text-red-500 px-1">{leadError}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={leadSubmitting}
                                            className="mt-1 w-full px-5 py-3.5 rounded-xl bg-[#0061A4] text-white font-black text-[13px] tracking-wide hover:bg-blue-800 active:scale-[0.98] disabled:opacity-60 transition-all shadow-lg shadow-blue-100"
                                        >
                                            {leadSubmitting ? curT.submitting : curT.submitBtn}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductsPageContent />
        </Suspense>
    );
}