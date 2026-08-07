'use client';

import React, { Suspense, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronLeft, ChevronRight, ArrowUpRight, Box,
    Signal, LayoutGrid, List, X, ChevronDown, Layers,
    Heart, Gauge, Fuel, SlidersHorizontal, Check
} from 'lucide-react';
import API, { API_URL } from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../SEO';
import { ShieldCheck, Factory, Truck, Award } from "lucide-react";

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
        total: "ta"
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
        total: "ед."
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
        total: "units"
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

const formatImgUrl = (path) => {
    if (!path) return "";
    return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
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

    const activeCategory = searchParams.get('category') || 'all';
    const activeBrand = searchParams.get('brand') || 'all';
    const currentPage = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 6;

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

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
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === 'all') params.delete(key);
            else params.set(key, value);
        });
        params.set('page', '1');

        // { scroll: false } Next.js avtomatik sakrashini to'xtatadi
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        if (sidebarClose) setSidebarOpen(false);

        // Filtrlashda ham tepaga chiqaramiz
        setTimeout(scrollToProducts, 100);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', String(newPage));

            // Next.js tepaga sakrashini o'chiramiz
            router.push(`${pathname}?${params.toString()}`, { scroll: false });

            // Biz xohlagan joygacha smoth scroll qilamiz
            setTimeout(scrollToProducts, 100);
        }
    };

    const toggleGroup = (groupId) => {
    setExpandedGroups(prev => {
        // Agar bir vaqtda faqat bitta guruh ochiq turishini xohlasangiz:
        // return { [groupId]: !prev[groupId] }; 
        
        // Agar bir nechta guruh ochiq turishi mumkin bo'lsa:
        return { ...prev, [groupId]: !prev[groupId] };
    });
};

    const clearFilters = () => {
        router.push(pathname);
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
                "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all border shadow-sm",
                activeCategory === 'all'
                    ? "bg-[#0061A4] border-[#0061A4] text-white shadow-blue-100"
                    : "bg-white border-gray-100 text-slate-700 hover:border-[#0061A4]/30"
            )}
        >
            <div className="flex items-center gap-3">
                <LayoutGrid size={18} className={activeCategory === 'all' ? "text-white" : "text-[#0061A4]"} />
                <span className="text-[14px] font-black tracking-tight">{curT.allModels}</span>
            </div>
            <span className={cn("px-2.5 py-0.5 rounded-lg text-[11px] font-black", activeCategory === 'all' ? "bg-white/20 text-white" : "bg-blue-50 text-[#0061A4]")}>
                {products.length}
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
                            className="flex-1 flex items-center gap-3 text-left px-5 py-4 text-[14px] font-bold"
                        >
                            <Box size={18} className={isGroupActive ? "text-white" : "text-[#0061A4]"} />
                            {lang === 'ru' ? group.ru : lang === 'en' ? group.en : group.uz}
                        </button>

                        {group.items.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleGroup(group.id);
                                }}
                                className={cn(
                                    "p-4 border-l transition-transform duration-300",
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
                                                "w-1.5 h-1.5 rounded-full transition-all",
                                                String(activeCategory) === String(cat.id) ? "bg-[#0054A6] scale-125" : "bg-slate-300"
                                            )} />
                                            {getField(cat, 'title', lang)}
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
                <span className="text-[13px] font-bold text-gray-700">{t('all') || 'Barchasi'}</span>
                <span className="ml-auto text-[12px] font-bold text-gray-400">{products.length}</span>
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
                        <span className="text-[13px] font-bold text-gray-700">{b.name}</span>
                        <span className="ml-auto text-[12px] font-bold text-gray-400">{count}</span>
                    </button>
                );
            })}
        </div>
    );

    ///////////////////////  PRODUCT CARD (grid)  ///////////////////////
    const ProductCard = ({ p, idx, t, lang }) => {
        const getTargetSpecs = () => {
            if (!p.techSpecs) return [];
            const targets = [
                "грузоподъемность",
                "грузоподъёмность",
                "снаряженная масса",
                "снаряжённая масса",
                "нагрузка на ссу",
                "масса снаряженного полуприцепа",
                "масса снаряжённого полуприцепа",
                "нагрузка на седло",
                "нагрузка на седельно-сцепное устройство",
                "масса перевозимого груза",
                "нагрузка на ось",
                "объём кузова",
                "количество пассажиров",
                "масса снаряженного прицепа",
                "номинальная вместимость цистерны",
            ];
            return p.techSpecs.filter(spec =>
                targets.some(target => spec.keyRu?.toLowerCase().includes(target))
            ).slice(0, 2);
        };

        const displaySpecs = getTargetSpecs();

        return (
            <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full overflow-hidden hover:border-blue-100 transition-all">
                {/* Rasm qismi */}
                <div className="relative h-[180px] bg-[#F9FAFB] flex items-center justify-center p-4 shrink-0 border-b border-gray-50">
                    <Link href={`/product/${p.slug || p.id}`} className="w-full h-full flex items-center justify-center">
                        <img
                            src={`${API_URL}/${p.image}`.replace(/([^:]\/)\/+/g, "$1")}
                            alt={getField(p, 'title', lang)}
                            className="max-w-[85%] max-h-full object-contain"
                        />
                    </Link>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <span className="text-[#0061A4] text-[10px] font-bold tracking-widest mb-1.5 opacity-60">
                        {p.brand?.name || 'UzAuto TRAILER'}
                    </span>

                    <Link href={`/product/${p.slug || p.id}`} className="group/title">
                        <h3 className="text-[17px] font-black text-slate-800 leading-tight mb-5 group-hover/title:text-[#0061A4] transition-colors line-clamp-2 min-h-[42px] flex items-center">
                            {getField(p, 'title', lang)}
                        </h3>
                    </Link>

                    {/* --- TEXNIK KO'RSATKICHLAR (Kattalashtirildi) --- */}
                    <div className="flex flex-col gap-4 mb-6 min-h-[90px]">
                        {displaySpecs.map((spec, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1.5 tracking-wide">
                                        {getField(spec, 'key', lang)}
                                    </span>
                                    <p className="text-[14px] font-black text-slate-700 leading-tight">
                                        {getField(spec, 'val', lang)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- NARX (Ko'k rang berildi) --- */}
                    <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[18px] font-black text-[#0061A4] tabular-nums tracking-tight">
                            {p.price ? `${p.price} ${curT.currency}` : curT.agreed}
                        </span>

                        <Link
                            href={`/product/${p.slug || p.id}`}
                            className="text-[#0061A4] hover:text-blue-800 transition-colors flex items-center gap-1.5 text-[12px] font-black uppercase tracking-tighter"
                        >
                            {curT.more} <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };
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
                canonical={typeof window !== 'undefined' ? `${window.location.origin}${pathname}?page=${currentPage}` : ''}
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
                            "url": typeof window !== 'undefined' ? `${window.location.origin}/product/${p.slug || p.id}` : ''
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
            `}</style>

            <ScanlineOverlay />

            <section
                ref={heroRef}
                className="relative overflow-hidden border-b border-[#E7EEF5] bg-gradient-to-br from-white via-[#F8FBFE] to-[#F2F8FD] pt-20 lg:pt-20 pb-12 lg:pb-16 font-roboto"
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

                <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-12">

                        {/* LEFT SIDE */}
                        <div className="w-full lg:max-w-3xl text-left">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <div className="w-8 lg:w-10 h-px bg-[#0061A4]" />
                                <span className="text-[#0061A4] text-[10px] lg:text-[12px] font-bold tracking-[0.28em] uppercase">
                                    UzAuto TRAILER — Catalog
                                </span>
                                <Signal size={12} className="text-[#0061A4] animate-pulse" />
                            </div>

                            <h1 className="text-[36px] sm:text-[48px] lg:text-[70px] font-black leading-[1.1] lg:leading-none tracking-tight">
                                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0061A4] bg-clip-text text-transparent">
                                    <GlitchText>
                                        <span>{t("products")}</span>
                                    </GlitchText>
                                </span>
                            </h1>

                            <p className="mt-4 lg:mt-6 max-w-2xl text-[15px] lg:text-[17px] leading-relaxed lg:leading-8 text-slate-800">
                                {curT.heroDesc}
                            </p>

                            {/* Feature stats (Icon based) */}
                            <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-6">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={22} className="text-[#0061A4] shrink-0" />
                                    <div className="text-[13px] lg:text-sm text-slate-800 font-medium leading-tight">
                                        {curT.guarantee}
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-8 bg-slate-200" />

                                <div className="flex items-center gap-3">
                                    <Factory size={22} className="text-[#0061A4] shrink-0" />
                                    <div className="text-[13px] lg:text-sm text-slate-800 font-medium leading-tight">
                                        {curT.production}
                                    </div>
                                </div>


                                {/* <div className="flex items-center gap-3">
                        <Truck size={22} className="text-[#0061A4] shrink-0" />
                        <div className="text-[13px] lg:text-sm text-slate-800 font-medium leading-tight">
                            Доставка по<br className="hidden sm:block" />Узбекистану
                        </div>
                    </div> */}

                                <div className="hidden md:block w-px h-8 bg-slate-200" />

                                <div className="flex items-center gap-3">
                                    <Award size={22} className="text-[#0061A4] shrink-0" />
                                    <div className="text-[13px] lg:text-sm text-slate-800 font-medium leading-tight">
                                        {curT.modelsCount}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="w-full lg:w-auto flex flex-col gap-6 items-start lg:items-end">
                            <div className="w-full lg:w-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-2 lg:p-3 shadow-xl shadow-blue-100/40">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleFilterChange({ brand: "all" }, true)}
                                        className={cn(
                                            "flex-1 lg:flex-none px-4 lg:px-6 py-2.5 rounded-xl text-[10px] lg:text-[11px] font-bold tracking-widest border transition-all cursor-pointer whitespace-nowrap",
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
                                                "flex-1 lg:flex-none px-4 lg:px-6 py-2.5 rounded-xl text-[10px] lg:text-[11px] font-bold tracking-widest border transition-all cursor-pointer whitespace-nowrap",
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
                                        className="flex items-center justify-center gap-3 w-full px-10 py-4 bg-[#0061A4] text-white rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
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
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 bottom-0 z-[101] w-[85%] max-w-[340px] bg-white p-6 overflow-y-auto lg:hidden">
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
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 lg:py-14 font-roboto">
                <div className="flex gap-8 items-start">

                    {/* ---- DESKTOP SIDEBAR ---- */}
                    <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32">
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
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[18px] font-black text-slate-900">
                                    {currentTitle}
                                </h2>
                                <span className="bg-blue-50 text-[#0061A4] px-3 py-0.5 rounded-full text-[11px] font-black">
                                    {filteredProducts.length} {curT.total}
                                </span>
                            </div>

                            {/* Sort o'chirildi, faqat View toggle qoldi */}
                            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100">
                                <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded transition-all", viewMode === 'grid' ? "bg-white text-[#0061A4] shadow-sm" : "text-gray-400")}>
                                    <LayoutGrid size={16} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded transition-all", viewMode === 'list' ? "bg-white text-[#0061A4] shadow-sm" : "text-gray-400")}>
                                    <List size={16} />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="w-full h-[340px] skeleton rounded-2xl" />)}
                            </div>
                        ) : (
                            <>
                                <AnimatePresence mode="popLayout">
                                    <div className={cn(
                                        "grid gap-8", // Masofani biroz ochdik (gap-8)
                                        viewMode === 'grid'
                                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" // Bir qatorda 3 ta
                                            : "grid-cols-1"
                                    )}>
                                        {paginatedProducts.map((p, idx) => (
                                            <ProductCard key={p.id} p={p} idx={idx} t={t} lang={lang} />
                                        ))}
                                    </div>
                                </AnimatePresence>

                                {paginatedProducts.length === 0 && (
                                    <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3">
                                        <Box size={40} className="text-gray-300" />
                                        <p className="text-gray-400 font-bold text-sm">{t('no_products_found') || 'Mahsulotlar topilmadi'}</p>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12 py-6 border-t border-gray-100">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-3 rounded-xl border hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            {[...Array(totalPages)].map((_, i) => {
                                                const pageNum = i + 1;
                                                // Faqat joriy sahifa atrofidagi tugmalarni ko'rsatish (ixtiyoriy, agar sahifalar ko'p bo'lsa)
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={cn(
                                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-[13px] transition-all border cursor-pointer",
                                                            currentPage === pageNum
                                                                ? "bg-[#0061A4] text-white border-[#0061A4] shadow-lg shadow-blue-100"
                                                                : "bg-white text-slate-600 border-gray-100 hover:border-blue-400"
                                                        )}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-3 rounded-xl border hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
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