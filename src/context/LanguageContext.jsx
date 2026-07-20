'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

// 1. Tarjimalar obyekti (Xotira samaradorligi uchun Providerdan tashqarida)
const translations = {
  ru: {
    products: "Продукция",
    categories: "Категории",
    details: "Подробнее",
    all: "Все",
    price: "Цена",
    units_found: "Найдеno единиц",
    categories_label: "Категории",
    all_models: "Все модели",
    filters: "Фильтры",
    custom_solution_title: "Нужно индивидуальное решение?",
    custom_solution_desc: "Мы проектируем технику большой грузоподъемности по вашим спецификациям.",
    contact_us: "Связаться с нами",
    loading_data: "ЗАГРУЗКА ДАННЫХ ФЛОТА",
    no_units: "ТЕХНИКА НЕ НАЙДЕНА",
    in_stock_label: "В НАЛИЧИИ",
    out_of_stock_label: "НЕТ В НАЛИЧИИ",
    tech_specs_label: "ТЕХ_ХАРАКТЕРИСТИКИ",
    call_price: "ПО ЗАПРОСУ",
    back_to_catalog: "Назад в каталог",
    about_product: "О продукte",
    interest_title: "Вас интересует этот продукт?",
    interest_desc: "Наши специалисты ответят на все ваши вопросы.",
    order_call: "Заказать звонок"
  },
  uz: {
    products: "Mahsulotlar",
    categories: "Kategoriyalar",
    details: "Batafsil",
    all: "Barchasi",
    price: "Narxi",
    units_found: "Texnikalar soni",
    categories_label: "Kategoriyalar",
    all_models: "Barcha modellar",
    filters: "Filtrlar",
    custom_solution_title: "Individual yechim kerakmi?",
    custom_solution_desc: "Biz sizning biznesingiz uchun maxsus texnikalarni loyihalashtiramiz.",
    contact_us: "Bog‘lanish",
    loading_data: "FLOT MA’LUMOTLARI YUKLANMOQDA",
    no_units: "TEXNIKA TOPILMADI",
    in_stock_label: "MAVJUD",
    out_of_stock_label: "MAVJUD EMAS",
    tech_specs_label: "TEXNIK XUSUSIYATLAR",
    call_price: "KELISHILADI",
    back_to_catalog: "Katalogga qaytish",
    about_product: "Mahsulot haqida",
    interest_title: "Ushbu mahsulot qiziqtirdimi?",
    interest_desc: "Mutaxassislarimiz barcha savollaringizga javob berishadi.",
    order_call: "Qo‘ng‘iroq so‘rash"
  },
  en: {
    products: "Products",
    categories: "Categories",
    details: "Details",
    all: "All",
    price: "Price",
    units_found: "Units found",
    categories_label: "Categories",
    all_models: "All Models",
    filters: "Filters",
    custom_solution_title: "Need a Custom Solution?",
    custom_solution_desc: "We engineer heavy-duty trailers tailored to your fleet specs.",
    contact_us: "Contact Us",
    loading_data: "LOADING FLEET DATA",
    no_units: "NO UNITS FOUND",
    in_stock_label: "IN STOCK",
    out_of_stock_label: "OUT OF STOCK",
    tech_specs_label: "TECH_SPECS",
    call_price: "ON REQUEST",
    back_to_catalog: "Back to catalog",
    about_product: "About product",
    interest_title: "Interested in this product?",
    interest_desc: "Our specialists will answer all your questions.",
    order_call: "Request a call"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState('ru');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLang = localStorage.getItem('lang');
    if (['ru', 'uz', 'en'].includes(savedLang)) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang) => {
    if (['ru', 'uz', 'en'].includes(newLang)) {
      setLangState(newLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', newLang);
      }
    }
  };

  // t funksiyasi: kalit bo'yicha tarjimani topadi
  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook - Contextdan foydalanishni osonlashtirish uchun
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};