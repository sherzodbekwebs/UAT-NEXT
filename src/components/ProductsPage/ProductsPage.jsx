'use client';

import React, { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronLeft, ChevronRight, ArrowUpRight, Box,
    Signal, LayoutGrid, X, ChevronDown, Layers
} from 'lucide-react';
import API, { API_URL } from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../SEO';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// 🟢 Rasm URL manzillarini tozalash funksiyasi (Double slash fix)
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
        "inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-md text-[9px] font-bold border transition-all",
        active ? "bg-white text-[#0061A4] border-white" : "bg-blue-500/10 text-[#0061A4] border-blue-500/20"
    )}>
        {String(count).padStart(2, '0')}
    </span>
);

const ProductsPageContent = () => {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});

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
    const itemsPerPage = 4;

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

    const handleFilterChange = (newParams, sidebarClose = true) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === 'all') params.delete(key);
            else params.set(key, value);
        });
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
        if (sidebarClose) setSidebarOpen(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', String(newPage));
            router.push(`${pathname}?${params.toString()}`);
            if (typeof window !== 'undefined') window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const getField = (item, field) => {
        if (!item) return '---';
        const k = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : 'Uz';
        return item[`${field}${k}`] || item[`${field}Ru`] || '---';
    };
    ///////////////////////
    const CategoryList = () => (
        <div className="flex flex-col gap-2">
            <button onClick={() => handleFilterChange({ category: 'all' }, true)} className={cn("w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border", activeCategory === 'all' ? "bg-blue-50 border-blue-100 text-[#0061A4]" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100", "text-black")}> {/* text-black qo'shildi */}
                <span className="text-[16px] font-black ">{t('all_models') || 'Все модели'}</span>
                <CountBadge count={products.length} active={activeCategory === 'all'} />
            </button>

            {groupedCategories.map((group) => {
                const isGroupActive = activeCategory === group.id;
                const isExpanded = expandedGroups[group.id] || group.items.some(cat => String(cat.id) === activeCategory);
                return (
                    <div key={group.id} className="space-y-1">
                        <div className={cn("flex items-center rounded-xl transition-all border", isGroupActive ? "bg-[#0061A4] text-white border-[#0061A4]" : "bg-white border-gray-100 hover:border-gray-200", "text-black")}> {/* text-black qo'shildi */}
                            <button onClick={() => { handleFilterChange({ category: group.id }, false); if (!isExpanded) toggleGroup(group.id); }} className="flex-1 text-left px-5 py-4 text-[15px] font-black  leading-tight">
                                {lang === 'ru' ? group.ru : lang === 'en' ? group.en : group.uz}
                            </button>
                            {group.items.length > 0 && (
                                <button onClick={(e) => { e.stopPropagation(); toggleGroup(group.id); }} className={cn("p-4 border-l transition-transform duration-300", isGroupActive ? "border-white/20" : "border-gray-100", isExpanded && "rotate-180", "text-black")}> {/* text-black qo'shildi */}
                                    <ChevronDown size={14} />
                                </button>
                            )}
                        </div>
                        <AnimatePresence initial={false}>
                            {isExpanded && group.items.length > 0 && (
                                <motion.div
                                    key={`group-content-${group.id}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden pl-4 flex flex-col gap-1 pt-1"
                                >
                                    {group.items.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
                                                handleFilterChange({ category: String(cat.id) }, true);
                                            }}
                                            className={cn("flex items-center gap-3 px-5 py-3 rounded-xl text-[14px] font-bold  transition-all", String(activeCategory) === String(cat.id) ? "bg-blue-50 text-[#0061A4]" : "text-gray-400 hover:text-gray-700", "text-black")} /* text-black qo'shildi */
                                        >
                                            <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                                            {getField(cat, 'title')}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );

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

            {/* Next.js-da scriptni dangerouslySetInnerHTML bilan yozish xavfsizroq */}
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
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            `}</style>

            <ScanlineOverlay />

            <section ref={heroRef} className="relative overflow-hidden border-b border-gray-100 bg-[#fcfdfe] pt-24 lg:pt-32 pb-14 font-roboto">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 grid-bg opacity-30 z-[1]" />
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div className="max-w-2xl">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
                                <div className="w-8 h-px bg-[#0061A4]" />
                                <span className="text-[#0061A4] text-[10px] font-bold tracking-[0.25em] whitespace-nowrap">UzAuto TRAILER — Catalog</span>
                                <Signal size={12} className="text-blue-500 animate-pulse" />
                            </div>
                            <h1 className="text-[38px] sm:text-[54px] lg:text-[82px] font-bold leading-[1] tracking-tight ">
                                <GlitchText><span>{t('products')}</span></GlitchText>
                            </h1>
                        </div>
                        <div className="flex flex-col gap-5 lg:gap-3">
                            <div className="space-y-3">
                                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                                    <button
                                        onClick={() => handleFilterChange({ brand: 'all' }, true)}
                                        className={cn("relative px-6 py-2.5 text-[11px] font-bold transition-all rounded-xl border tracking-widest cursor-pointer", activeBrand === 'all' ? "bg-[#0061A4] text-white border-[#0061A4] shadow-lg shadow-blue-200" : "bg-white text-slate-700 border-gray-100 hover:border-[#0061A4]")}
                                    >
                                        {t('all')}
                                    </button>
                                    {brands.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => handleFilterChange({ brand: String(b.id) }, true)}
                                            className={cn("relative px-6 py-2.5 text-[11px] font-bold transition-all rounded-xl border tracking-widest cursor-pointer", String(activeBrand) === String(b.id) ? "bg-[#0061A4] text-white border-[#0061A4] shadow-lg shadow-blue-200" : "bg-white text-slate-700 border-gray-100 hover:border-[#0061A4]")}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {!loading && (
                                <div className="flex justify-center sm:justify-start lg:hidden">
                                    <button onClick={() => setSidebarOpen(true)} className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-[#0061A4] text-white rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/20 active:scale-95 border-2 border-[#0061A4] cursor-pointer">
                                        <LayoutGrid size={16} /> {t('categories_label')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>



            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 bottom-0 z-[101] w-[80%] max-w-[320px] bg-white p-6 overflow-y-auto lg:hidden">
                            <div className="flex items-center justify-between mb-8 border-b pb-4">
                                <span className="text-xs font-black tracking-widest text-[#0061A4]">{t('categories_label')}</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 bg-gray-50 rounded-full text-black"><X size={20} /></button>
                            </div>
                            <CategoryList />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 lg:py-14 font-roboto">
                <div className="flex gap-10 items-start">
                    <aside className="hidden lg:block w-[320px] shrink-0 sticky top-32">
                        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 px-2 border-b border-gray-50 pb-4">
                                <Layers size={18} className="text-[#0061A4]" />
                                <span className="text-xs font-black tracking-widest text-black">{t('categories_label')}</span>
                            </div>
                            <CategoryList />
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0 w-full font-roboto">
                        {loading ? (
                            <div className="flex flex-col gap-8">{[1, 2, 3].map(n => <div key={n} className="w-full h-[320px] skeleton rounded-2xl" />)}</div>
                        ) : (
                            <>
                                <AnimatePresence mode="popLayout">
                                    <div className="flex flex-col gap-8">
                                        {paginatedProducts.map((p, idx) => (
                                            <motion.article key={p.id} layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.5, delay: idx * 0.04 }} className="relative">
                                                <Link
                                                    href={`/product/${p.slug || p.id}`}
                                                    className="product-card group block overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all"
                                                >
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="relative w-full md:w-[220px] lg:w-[280px] shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center p-6 sm:p-8 md:border-r border-gray-100 rounded-l-2xl">
                                                            <img
                                                                src={`${API_URL}/${p.image}`.replace(/([^:]\/)\/+/g, "$1")}
                                                                alt={`${p.brand?.name} - ${getField(p, 'title')}`}
                                                                className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
                                                            />
                                                            {!p.inStock && <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-red-500 text-white text-[9px] font-bold rounded-lg">{t('out_of_stock_label')}</div>}
                                                        </div>

                                                        <div className="flex-1 flex flex-col p-8 lg:p-10 min-w-0">
                                                            <div className="mb-6">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className="text-[#0061A4] text-[10px] font-bold uppercase">{p.brand?.name}</span>
                                                                    <div className="h-px w-4 bg-blue-200" />
                                                                    <span className="text-gray-500 text-[10px] font-bold">ID_{p.id.substring(0, 6)}</span>
                                                                </div>
                                                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0061A4] group-hover:text-blue-700 transition-colors leading-tight">
                                                                    {getField(p, 'title')}
                                                                </h2>
                                                            </div>

                                                            {p.techSpecs?.length > 0 && (
                                                                <div className="grid grid-cols-2 min-[1440px]:grid-cols-4 gap-3 sm:gap-4 mb-8">
                                                                    {p.techSpecs.slice(0, 4).map((spec, i) => (
                                                                        <div key={i} className="p-3 sm:p-4 bg-white border border-gray-100 rounded-lg min-h-[70px] flex flex-col shadow-sm hover:border-blue-100 transition-colors">
                                                                            <p className="text-slate-900 font-bold text-[9px] sm:text-[10px] mb-1.5 leading-tight uppercase">{getField(spec, 'key')}</p>
                                                                            <p className="text-black font-black text-[12px] sm:text-[14px] leading-tight">{getField(spec, 'val')}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-auto pt-6 border-t border-gray-100">
                                                                <div className="flex flex-wrap gap-8">
                                                                    <div>
                                                                        <p className="text-slate-500 text-[10px] font-bold mb-1 uppercase">{t('price')}</p>
                                                                        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                                                                            {p.price ? `${p.price} ${lang === 'ru' ? 'сум' : "so'm"}` : t('call_price')}
                                                                        </p>
                                                                    </div>
                                                                    {p.price && exchangeRate && (
                                                                        <div className="border-l border-gray-200 pl-8">
                                                                            <p className="text-blue-500 text-[10px] font-bold mb-1 uppercase tracking-widest">USD</p>
                                                                            <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tighter tabular-nums leading-none">
                                                                                {Math.round(parseFloat(p.price.replace(/\s/g, '')) / exchangeRate)
                                                                                    .toString()
                                                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} $
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="relative flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#0061A4] text-white rounded-xl font-bold text-[10px] transition-all group-hover:bg-blue-600 shadow-xl uppercase">
                                                                    {t('details')} <ArrowUpRight size={14} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.article>
                                        ))}
                                    </div>
                                </AnimatePresence>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12 py-6 border-t border-gray-100 w-full overflow-hidden px-2">
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="shrink-0 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"><ChevronLeft size={20} /></button>
                                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 max-w-full">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={cn("shrink-0 w-10 h-12 sm:w-12 sm:h-12 rounded-lg font-bold text-[13px] transition-all border cursor-pointer", currentPage === i + 1 ? "bg-[#0061A4] text-white border-[#0061A4] shadow-lg shadow-blue-200" : "bg-white text-slate-600 border-gray-200 hover:border-blue-400")}>{i + 1}</button>
                                            ))}
                                        </div>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="shrink-0 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"><ChevronRight size={20} /></button>
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