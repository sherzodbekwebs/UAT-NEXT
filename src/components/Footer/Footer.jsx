'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image komponenti
import { motion } from 'framer-motion';
import {
    Send, Instagram, Facebook, Youtube,
    MapPin, Phone, Mail, ArrowRight
} from 'lucide-react';
import logo_footer from '../../assets/logo_footer.png';

const translations = {
    ru: {
        desc: "Завод-изготовитель прицепной и навесной техники полного цикла в составе автомобильной промышленности Узбекистана.",
        columns: [
            {
                title: "НАВИГАЦИЯ",
                links: [
                    { name: "О компании", href: "/page/general_information" },
                    { name: "Производство", href: "/page/technologies" },
                    { name: "Продукция", href: "/products" },
                    { name: "Контакты", href: "/contacts" }
                ]
            },
            {
                title: "КОНТАКТЫ",
                items: [
                    { icon: MapPin, text: "г. Ташкент, ул. Мирзо-Улугбека, 30" },
                    { icon: Phone, text: "+998 71 202 32 23" },
                    { icon: Phone, text: "+998 71 202 88 66" }
                ]
            },
            {
                title: "ПРОИЗВОДСТВО",
                items: [
                    { icon: MapPin, text: "Самаркандская область, Джамбайский район, улица Ташкентская 2." },
                    { icon: Mail, text: "info@uzautotrailer.uz" }
                ]
            }
        ],
        copyright: "© 2026 UzAuto TRAILER. Все права защищены."
    },
    uz: {
        desc: "O'zbekiston avtomobil sanoatining to'liq siklli tirkama va osma texnikalar ishlab chiqaruvchi zavodi.",
        columns: [
            {
                title: "NAVIGATSIYA",
                links: [
                    { name: "Kompaniya", href: "/page/general_information" },
                    { name: "Ishlab chiqarish", href: "/page/technologies" },
                    { name: "Mahsulotlar", href: "/products" },
                    { name: "Aloqa", href: "/contacts" }
                ]
            },
            {
                title: "KONTAKTLAR",
                items: [
                    { icon: MapPin, text: "Toshkent shahar, Mirzo-Ulug'bek ko'chasi, 30" },
                    { icon: Phone, text: "+998 71 202 32 23" },
                    { icon: Phone, text: "+998 71 202 88 66" }
                ]
            },
            {
                title: "ISHLAB CHIQARISH",
                items: [
                    { icon: MapPin, text: "Samarqand viloyati, Jomboy tumani, Toshkent ko‘chasi 2" },
                    { icon: Mail, text: "info@uzautotrailer.uz" }
                ]
            }
        ],
        copyright: "© 2026 UzAuto TRAILER. Barcha huquqlar himoyalangan."
    },
    en: {
        desc: "Full-cycle manufacturer of trailers and mounted equipment within the automotive industry of Uzbekistan.",
        columns: [
            {
                title: "NAVIGATION",
                links: [
                    { name: "About Company", href: "/page/general_information" },
                    { name: "Production", href: "/page/technologies" },
                    { name: "Products", href: "/products" },
                    { name: "Contacts", href: "/contacts" }
                ]
            },
            {
                title: "CONTACTS",
                items: [
                    { icon: MapPin, text: "30 Mirzo-Ulugbek str., Tashkent" },
                    { icon: Phone, text: "+998 71 202 32 23" },
                    { icon: Phone, text: "+998 71 202 88 66" }
                ]
            },
            {
                title: "PRODUCTION",
                items: [
                    { icon: MapPin, text: "Tashkentskaya Street 2, Dzhambay District, Samarkand Region, Uzbekistan" },
                    { icon: Mail, text: "info@uzautotrailer.uz" }
                ]
            }
        ],
        copyright: "© 2026 UzAuto TRAILER. All rights reserved."
    },
};

const socialLinks = [
    { icon: Send, url: "https://t.me/uatproductsbot", color: "#0088cc" },
    { icon: Instagram, url: "https://www.instagram.com/uzautotrailer_official", color: "#E1306C" },
    { icon: Facebook, url: "https://www.facebook.com/UzAutoTrailerofficial", color: "#1877F2" },
    { icon: Youtube, url: "https://www.youtube.com/@UzAutoTrailer/videos", color: "#FF0000" }
];

const Footer = ({ lang = 'ru' }) => {
    const t = translations[lang] || translations.ru;

    return (
        <footer className="w-full bg-[#F8FAFC] text-[#1a2e44] pt-32 pb-16 px-6 lg:px-16 font-inter border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-24">

                    {/* Brend va Ijtimoiy tarmoqlar */}
                    <div className="flex flex-col gap-8">
                        <Link href="/">
                            <img
                                src={logo_footer.src || logo_footer}
                                alt="Logo"
                                className="h-7 w-auto object-contain cursor-pointer"
                            />
                        </Link>
                        <p className="text-gray-500 text-[15px] leading-relaxed max-w-[300px]">
                            {t.desc}
                        </p>
                        <div className="flex gap-4 mt-2">
                            {socialLinks.map((social, i) => (
                                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all hover:scale-110"
                                    style={{ color: social.color }}>
                                    <social.icon size={24} strokeWidth={2.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Ustunlar */}
                    {t.columns.map((col, idx) => (
                        <div key={idx}>
                            <h4 className="text-[13px] font-bold tracking-[0.2em] text-[#1D5CA3] mb-10 uppercase">
                                {col.title}
                            </h4>
                            <ul className="flex flex-col gap-6">
                                {col.links ? col.links.map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-[16px] font-semibold text-[#1a2e44] hover:text-[#0054A6] transition-colors flex items-center group">
                                            {link.name}
                                            <ArrowRight size={16} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                )) : col.items.map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start group/item">
                                        <item.icon size={22} className="text-[#0054A6] shrink-0 mt-0.5 opacity-80" />
                                        <span className="text-[16px] font-medium leading-snug">
                                            {item.text.includes('+') ? (
                                                <a href={`tel:${item.text.replace(/\s+/g, '')}`} className="hover:text-[#0054A6] font-bold">
                                                    {item.text}
                                                </a>
                                            ) : item.text.includes('@') ? (
                                                <a href={`mailto:${item.text}`} className="hover:text-[#0054A6] underline underline-offset-4">
                                                    {item.text}
                                                </a>
                                            ) : (
                                                <span className="text-gray-600">{item.text}</span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[14px] font-medium text-gray-400">{t.copyright}</p>
                    <div className="flex gap-10 text-[13px] font-bold text-gray-400 tracking-widest">
                        <Link href="/privacy-policy" className="hover:text-[#0054A6]">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#0054A6]">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;