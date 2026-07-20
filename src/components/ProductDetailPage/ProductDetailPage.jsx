'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, PhoneCall, ShieldCheck, Info, Signal, Truck, ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import API, { API_URL } from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

// ── Utilities ──
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// ── 1. SKELETON ANIMATION CSS ──
const skeletonStyles = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f6f7f8 25%, #edeef1 50%, #f6f7f8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
`;

// ── Shared design system components ──
const ScanlineOverlay = () => (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            backgroundSize: '100% 4px'
        }}
    />
);

const HudCorner = ({ position = 'tl', size = 16, color = '#0061A4', radius = '12px' }) => {
    const styles = {
        tl: { top: 0, left: 0, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderTopLeftRadius: radius },
        tr: { top: 0, right: 0, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderTopRightRadius: radius },
        bl: { bottom: 0, left: 0, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderBottomLeftRadius: radius },
        br: { bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottomRightRadius: radius },
    };
    return <span style={{ position: 'absolute', width: size, height: size, ...styles[position], transition: 'all 0.3s ease' }} />;
};

const GlitchText = ({ children, className }) => (
    <span className={cn("relative inline-block", className)}>
        {children}
        <span
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-75"
            style={{ color: '#0061A4', clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-2px)' }}
            aria-hidden
        >
            {children}
        </span>
    </span>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { t, lang } = useLanguage();

    const [activeImg, setActiveImg] = useState(null);

    // 🟢 Rasm URL tozalash (Double slash fix)
    const formatImgUrl = (path) => {
        if (!path) return null;
        return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const { data: product, isLoading: loading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => {
            const fetchUrl = isUuid ? `/products/${id}` : `/products/detail/${id}`;
            return API.get(fetchUrl).then(res => res.data);
        },
        enabled: !!id
    });

    const { data: recommendations } = useQuery({
        queryKey: ['recommendations', product?.categoryId, id],
        queryFn: () => {
            return API.get(`/products?categoryId=${product?.categoryId}`)
                .then(res => res.data.filter(p => p.id !== product.id && p.isActive === true).slice(0, 4));
        },
        enabled: !!product?.categoryId
    });

    useEffect(() => {
        if (product?.image) setActiveImg(product.image);
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }, [product, id]);

    const getField = (obj, field) => {
        if (!obj) return '---';
        const k = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : 'Uz';
        return obj[`${field}${k}`] || obj[`${field}Ru`] || obj[`${field}Uz`] || '---';
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">MAHSULOT TOPILMADI</div>;

    const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);

    const groupedSpecs = product.techSpecs?.reduce((acc, spec) => {
        const sid = spec.sectionId;
        const stitle = getField(spec.section, 'title');
        if (!acc[sid]) acc[sid] = { title: stitle, specs: [] };
        acc[sid].specs.push(spec);
        return acc;
    }, {});
    const specSections = groupedSpecs ? Object.values(groupedSpecs) : [];

    // ── JSON-LD (Schema.org) for Next.js ──
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": getField(product, 'title'),
        "image": formatImgUrl(product.image),
        "description": getField(product, 'content'),
        "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "UzAuto Trailer"
        },
        "offers": {
            "@type": "Offer",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "priceCurrency": "UZS",
            "price": product.price ? product.price.replace(/\s/g, '') : "0",
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    };
    return (
        <div
            className="min-h-screen text-[#1A1C1E] font-roboto overflow-x-hidden"
            style={{
                backgroundColor: '#ffffff',
                backgroundImage: `radial-gradient(ellipse 100% 60% at 50% -10%, rgba(0,97,164,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(0,97,164,0.05) 0%, transparent 60%)`,
            }}
        >

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Share+Tech+&display=swap');
                * { box-sizing: border-box; font-family: 'Roboto', sans-serif !important; }
                .font-roboto { font-family: 'Roboto', sans-serif !important; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .grid-bg { background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 60px 60px; }
                .thumb-btn { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
                .thumb-btn:hover { transform: translateY(-2px); }
                .spec-row:hover .spec-key { color: #1A1C1E; }
                .spec-row:hover .spec-val { color: #0061A4; }
                ${skeletonStyles}
            `}</style>

            <ScanlineOverlay />
            <div className="pointer-events-none fixed inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

            {/* ── STICKY SUBNAV ── */}
            <nav className="fixed top-16 left-0 w-full z-40 h-14 flex items-center justify-between px-4 sm:px-6 lg:px-16 border-b border-gray-100 backdrop-blur-md bg-white/90">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#0061A4] uppercase tracking-widest transition-all group cursor-pointer"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{lang === 'ru' ? 'КАТАЛОГ' : 'KATALOG'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-2">
                    <Signal size={10} className="text-blue-500 animate-pulse" />
                    <span className=" text-[9px] text-gray-300 uppercase tracking-[0.2em]">
                        {getField(product.category, 'title')}
                    </span>
                    <ChevronRight size={10} className="text-gray-200" />
                    <span className=" text-[9px] text-[#0061A4] uppercase tracking-[0.2em]">
                        {product.brand?.name}
                    </span>
                </div>

                <span className=" text-[9px] text-gray-300 uppercase tracking-widest hidden lg:block">
                    ID_{product.id?.substring(0, 8)}
                </span>
            </nav>

            {/* ── HERO STRIP ── */}
            <section className="relative overflow-hidden border-b border-gray-100 pt-32 lg:pt-40 pb-10 px-6 lg:px-16"
                style={{ backgroundColor: '#fcfdfe' }}>
                <div className="absolute inset-0 grid-bg opacity-100" />
                <div className="relative z-10 max-w-[1600px] mx-auto font-roboto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px bg-[#0061A4]" />
                        <span className=" text-[#0061A4] text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.25em]">
                            {product.brand?.name} — {getField(product.category, 'title')}
                        </span>
                    </div>
                    <h1 className="text-[20px] sm:text-[32px] lg:text-[45px] font-bold uppercase leading-[1.1] lg:leading-none tracking-tight">
                        <GlitchText>
                            <span className="text-[#1A1C1E]">{getField(product, 'title')}</span>
                        </GlitchText>
                    </h1>

                    <div className="flex items-center gap-8 mt-8 pt-6 border-t border-gray-100">
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border",
                            product.inStock
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-red-200 text-red-600 bg-red-50"
                        )}>
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                product.inStock ? "bg-green-500 animate-pulse" : "bg-red-400"
                            )} />
                            {product.inStock
                                ? (lang === 'uz' ? 'Mavjud' : 'В наличии')
                                : (lang === 'uz' ? 'Tugagan' : 'Нет в наличии')}
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/10 to-transparent" />
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-10 lg:py-14 font-roboto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                    <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                        <div className="relative overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                            <HudCorner position="tl" size={14} />
                            <HudCorner position="tr" size={14} />
                            <HudCorner position="bl" size={14} />
                            <HudCorner position="br" size={14} />

                            <div className="relative aspect-video sm:aspect-[4/3] flex items-center justify-center p-6 sm:p-14">
                                <AnimatePresence mode="wait">
                                    {/* Double slash fix qo'shildi */}
                                    {activeImg && (
                                        <motion.img
                                            key={activeImg}
                                            src={formatImgUrl(activeImg)}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                            transition={{ duration: 0.4 }}
                                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                                            alt={getField(product, 'title')}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 shadow-sm">
                                <span className=" text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                                    {String(allImages.indexOf(activeImg) + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(img)}
                                        className={cn(
                                            "thumb-btn relative w-20 sm:w-24 h-16 sm:h-20 shrink-0 overflow-hidden border-2 transition-all cursor-pointer",
                                            activeImg === img
                                                ? "border-[#0061A4]"
                                                : "border-gray-100 opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        {activeImg === img && (
                                            <>
                                                <HudCorner position="tl" size={5} color="#0061A4" />
                                                <HudCorner position="br" size={5} color="#0061A4" />
                                            </>
                                        )}
                                        <img
                                            src={formatImgUrl(img)}
                                            className="w-full h-full object-cover"
                                            alt="product thumb"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative overflow-hidden border border-gray-100 p-6 sm:p-10 bg-white text-black">
                            <HudCorner position="tl" size={10} />
                            <HudCorner position="br" size={10} />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-4 h-px bg-[#0061A4]" />
                                <span className=" text-gray-400 text-[10px] tracking-[0.3em] uppercase">
                                    {lang === 'uz' ? 'Mahsulot haqida' : lang === 'ru' ? 'Описание' : 'Description'}
                                </span>
                            </div>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                {getField(product, 'content')}
                            </p>
                        </div>

                        {product.bannerImage && (
                            <div className="relative overflow-hidden border border-gray-100">
                                <HudCorner position="tl" size={12} />
                                <HudCorner position="br" size={12} />
                                <img
                                    src={formatImgUrl(product.bannerImage)}
                                    className="w-full aspect-[21/9] object-cover"
                                    alt="banner"
                                />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        {product.techSpecs?.length > 0 && (
                            <div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {product.techSpecs.slice(0, 4).map((spec, i) => (
                                        <div key={i} className="relative p-4 sm:p-5 bg-gray-50/50 border border-gray-100 group hover:border-blue-500/30 hover:bg-blue-50/30 transition-all duration-300">
                                            <p className="text-gray-600 text-[8px] sm:text-[9px] tracking-widest uppercase mb-2 leading-tight font-bold opacity-70">
                                                {getField(spec, 'key')}
                                            </p>
                                            <p className="text-[#1A1C1E] font-bold text-[13px] sm:text-[15px] capitalize tracking-tight leading-tight">
                                                {getField(spec, 'val')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="relative overflow-hidden border border-gray-100 bg-white p-6 sm:p-10 shadow-lg shadow-blue-50"
                            style={{ background: 'linear-gradient(135deg, rgba(0,97,164,0.04) 0%, rgba(255,255,255,1) 60%)' }}>
                            <HudCorner position="tl" size={12} />
                            <HudCorner position="br" size={12} />
                            <div className="relative z-10 space-y-8">
                                <div>
                                    <p className=" text-gray-400 text-[10px] tracking-widest uppercase font-bold mb-2">{lang === 'uz' ? 'Narxi' : 'Цена'}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tighter tabular-nums">
                                        {product.price ? `${product.price} ${lang === 'ru' ? 'сум' : "so'm"}` : (lang === 'uz' ? 'Kelishilgan holda' : 'Цена по запросу')}
                                    </p>
                                </div>
                                <button onClick={() => router.push('/contacts')} className="relative w-full flex items-center justify-center gap-3 py-5 sm:py-6 bg-[#0061A4] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] rounded-sm cursor-pointer">
                                    <PhoneCall size={16} /> {lang === 'uz' ? 'Bog\'lanish' : 'Связаться'} <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>

                        {product.advantages?.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.advantages.map((adv) => (
                                    <div key={adv.id} className="relative flex items-center gap-3 px-4 py-4 bg-white border border-gray-100 hover:border-blue-500/30 hover:bg-blue-50/20 transition-all duration-300 group">
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#0061A4] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {adv.icon ? <img src={formatImgUrl(adv.icon)} className="w-6 h-6 object-contain shrink-0" alt="icon" /> : <ShieldCheck size={18} className="text-gray-300 group-hover:text-[#0061A4]" />}
                                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 group-hover:text-[#1A1C1E] capitalize leading-tight transition-colors">
                                            {getField(adv, 'title')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, rgba(0,97,164,0.1) 0%, rgba(255,255,255,1) 100%)', border: '1px solid #E5E7EB' }}>
                            <HudCorner position="tl" size={10} />
                            <HudCorner position="br" size={10} />
                            <div className="relative z-10">
                                <Truck size={22} className="mb-5 text-[#0061A4]" />
                                <h4 className="text-lg font-black uppercase leading-tight text-[#1A1C1E] mb-3">{lang === 'uz' ? 'Maxsus yechimlar' : 'Индивидуальное решение'}</h4>
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium">{lang === 'uz' ? 'Sizning vazifalaringiz uchun maxsus texnika kerakmi? Biz uni loyihalashtiramiz.' : 'Нужна спецтехника под ваши задачи? Мы спроектируем её для вас.'}</p>
                                <button onClick={() => router.push('/contacts')} className="w-full py-4 bg-[#0061A4] text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 cursor-pointer">
                                    {lang === 'uz' ? 'Bog\'lanish' : 'Связаться'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TEXNIK XARAKTERISTIKALAR */}
                {specSections.length > 0 && (
                    <div className="mt-20 lg:mt-32 pt-16 border-t border-gray-100 font-roboto">
                        <h2 className="text-[36px] sm:text-[38px] font-bold uppercase mb-12 text-black">
                            {lang === 'uz' ? 'Texnik' : lang === 'ru' ? 'Технические' : 'Technical'} <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px #E5E7EB' }}>
                                {lang === 'uz' ? 'TAVSIF' : lang === 'ru' ? 'ХАРАКТЕРИСТИКИ' : 'SPECS'}
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {specSections.map((section, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500">
                                    <HudCorner position="tl" size={10} />
                                    <div className="px-6 sm:px-8 py-5 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
                                        <div className="w-1.5 h-1.5 bg-[#0061A4] rounded-full" />
                                        <h3 className="text-[#0061A4] text-[13px] font-bold uppercase">{section.title}</h3>
                                    </div>
                                    <div className="px-6 sm:px-8 py-4">
                                        {section.specs.map((spec, si) => (
                                            <div key={spec.id} className={cn("spec-row flex justify-between items-end gap-4 py-3.5", si < section.specs.length - 1 ? "border-b border-gray-50" : "")}>
                                                <span className="spec-key text-gray-800 text-[10px] sm:text-[14px] opacity-70">{getField(spec, 'key')}</span>
                                                <span className="spec-val text-[#1A1C1E] font-bold text-[11px] sm:text-[14px] text-right">{getField(spec, 'val')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* O'XSHASH MODELLAR */}
                {recommendations?.length > 0 && (
                    <div className="mt-32 pt-20 border-t border-gray-100">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold uppercase tracking-tight text-black">
                                    {lang === 'ru' ? 'Похожие модели' : 'O\'xshash modellar'}
                                </h2>
                            </div>
                            <Link href="/products" className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-[#0061A4] uppercase tracking-widest hover:underline">
                                {lang === 'ru' ? 'Весь каталог' : 'Barcha mahsulotlar'} <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendations.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    className="group bg-white border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-50 transition-all duration-500 flex flex-col"
                                >
                                    <Link href={`/product/${item.slug || item.id}`} className="block relative aspect-[4/3] bg-gray-50 overflow-hidden p-6">
                                        <img
                                            src={formatImgUrl(item.image)}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                            alt="truck"
                                        />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-[8px] font-black uppercase tracking-widest border border-gray-100 text-black">
                                            {item.brand?.name}
                                        </div>
                                    </Link>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-sm font-bold text-[#1A1C1E] mb-2 line-clamp-2 min-h-[40px] group-hover:text-[#0061A4] transition-colors leading-snug">
                                            {getField(item, 'title')}
                                        </h3>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <span className="text-[10px] font-black text-[#0061A4] tracking-widest uppercase">
                                                {item.price ? `${item.price} UZS` : (lang === 'ru' ? 'По запросу' : 'Kelishilgan')}
                                            </span>
                                            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#0061A4] group-hover:text-white transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* BOG'LANISH BLOCK */}
            <section className="mt-20 lg:mt-32 relative overflow-hidden font-roboto" style={{ backgroundColor: '#0061A4' }}>
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-16 py-20 lg:py-24 flex flex-col lg:flex-row lg:items-center justify-between gap-12 text-white">
                    <div>
                        <h2 className="text-[32px] sm:text-[42px] lg:text-[60px] font-bold uppercase mb-6 leading-tight">
                            {lang === 'ru' ? 'ЗАИНТЕРЕСОВАНЫ?' : "SIZNI QIZIQTIRDIMI?"}
                        </h2>
                        <p className="text-blue-100/60 text-lg max-w-md">
                            {lang === 'ru' ? 'Наши менеджеры ответят на все ваши вопросы в кратчайшие сроки.' : "Menejerlarimiz barcha savollaringizga qisqa vaqt ichida javob berishadi."}
                        </p>
                    </div>
                    <button onClick={() => router.push('/contacts')} className="relative px-12 py-7 bg-white text-[#0061A4] font-bold text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all rounded-sm cursor-pointer">
                        <PhoneCall size={18} className="inline mr-2" /> {lang === 'ru' ? 'ЗАКАЗАТЬ ЗВОНОК' : "BOG'LANISH"} <ArrowUpRight size={18} className="inline ml-2" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;