"use client"; // 1. BU SHART!

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert, Handshake, Scale, FileWarning, Mail, PhoneCall,
    MessageSquare, FileText, UserCheck, UserX, Send, ArrowRight,
    AlertTriangle, ShieldCheck, Briefcase, Settings, Activity, CheckCircle2, XCircle, X
} from 'lucide-react';

// 2. Next.js da public papkasidagi rasmni import qilmang, shunchaki string yo'lini yozing
const heroImg = '/complince_hero_page.jpg';

const translations = {
    ru: {
        heroTitle: "Комплаенс политика",
        introText: "OOO «UZAUTO TRAILER» укрепляет позиций на рынках соседних стран не только путём продвижения доступных, надёжных и качественных большегрузных автотранспортных средств, а также навесной и прицепной техники к ним, но и активным развитием комплаенс норм.",
        ethicsText: "Действуя как социально, ответственная компания, уважая права человека и придерживаясь высочайших стандартов этики поведения и профессиональной деятельности, OOO «UZAUTO TRAILER» улучшает показатели бизнеса в долгосрочной перспективе Мы признаем безусловную ценность честности в поведении как деловых партнёров, так и персонала Компании. Честность и деловая этика имеют значение. Если вы поступаете правильно в любых обстоятельствах, это всегда ценится.",
        commitmentText: "OOO «UZAUTO TRAILER» в полной мере привержены этим принципам и требуем от наших Деловых партнёров, чтобы они разделяли эту приверженность и выполняли обязательства, изложенные в Кодексе Поведения Деловых Партнеров.",
        informPolicy: "OOO «UZAUTO TRAILER» придерживается Утвержденной Политики Информирования, и считает, что, каждый должен иметь возможность сообщать о случаях неэтичного и неправомерного поведения персонала компании, ее поставщиков и подрядчиков.",
        reportReason: "В связи с чем, если у Вас имеются беспокойства, доказательства нарушения, или имеются сведения о фактах:",
        violationList: [
            "не соблюдения деловой этики персонала компании;",
            "не соблюдения деловой этики бизнес партнера;",
            "мошенничества, взятничества;",
            "домогательства;",
            "конфликта интересов;",
            "нарушения персоналом компании внутренних утверждённых норм."
        ],
        examplesHeader: "Список примеров нарушений, связанных с Предприятием:",
        examples: [
            "Нарушение нормативно-правовых актов Республики Узбекистан",
            "Проявление непорядочного, коррумпированного поведения",
            "Воспрепятствование проведению проверок",
            "Нарушение ведения финансовой отчетности",
            "Конфликт интересов",
            "Незаконное распространение конфиденциальной информации",
            "Иную деятельность, носящую неприемлемый характер"
        ],
        channelsTitle: "КАНАЛЫ СВЯЗИ",
        channelsDesc: "Заявители вправе беспрепятственно, в том числе анонимно, сообщить Отделу комплаенс о фактах незаконных действий:",
        docLinks: [
            { title: "Комплаенс Политика ИП ООО \"UzAuto Trailer\"", url: "https://uzautotrailer.uz/storage/compiance/20230425%20%D0%9F%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D1%80%D1%83%D1%81%D1%81%20%D1%83%D0%B7%D0%B1.pdf" },
            { title: "Комплаенс Программа ИП ООО \"UzAuto Trailer\"", url: "https://uzautotrailer.uz/storage/compiance/%D0%98%D0%A2%D0%9E%D0%93%20%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0.pdf" },
            { title: "Кодекс поведения сотрудников", url: "https://uzautotrailer.uz/storage/compiance/%D0%BA%D0%BE%D0%B4%D0%B5%D0%BA%D1%81%20%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%81%D0%BE%D1%82%D1%80%D1%83%D0%B4%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.pdf" },
            { title: "Кодекс поведения деловых партнеров", url: "https://uzautotrailer.uz/storage/compiance/%D0%9F%D1%80%D0%B8%D0%BA%D0%B0%D0%B7%20%E2%84%9633-%D0%9F%D0%9E%D0%94%20%D0%BE%D1%82%2011.06.2019%20%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%201.pdf" }
        ],
        formTitle: "Отправить сообщение с сайта",
        formTypeOpen: "Открыто",
        formTypeAnon: "Анонимно",
        fields: { fio: "Ф.И.О.", email: "Э-почта", subject: "Предмет сообщения", phone: "Телефон", message: "Сообщение", submit: "Отправить" },
        privacy: "Официальный документ UzAuto Trailer",
        successMsg: "Сообщение успешно отправлено.",
        errorMsg: "Ошибка при отправке сообщения.",
        modalClose: "Закрыть"
    },
    uz: {
        heroTitle: "Komplaens siyosati",
        introText: "«UZAUTO TRAILER» MCHJ qo'shni davlatlar bozorlaridagi o'rnini nafaqat hamyonbop va sifatli og'ir yuk texnikalarini ilgari surish, balki komplaens normalarini faol rivojlantirish orqali ham mustahkamlamoqda.",
        ethicsText: "Ijtimoiy mas'uliyatli kompaniya sifatida harakat qilib, inson huquqlarini hurmat qilgan holda va xulq-atvor hamda professional faoliyatning eng yuqori etika standartlariga rioya qilib, «UZAUTO TRAILER» MCHJ biznes ko'rsatkichlarini yaxshilaydi.",
        commitmentText: "«UZAUTO TRAILER» MCHJ ushbu tamoyillarga to'liq sodiqdir va biznes hamkorlarimizdan ham ushbu sodiqlikni baham ko'rishni talab qiladi.",
        informPolicy: "«UZAUTO TRAILER» MCHJ Tasdiqlangan xabardor qilish siyosatiga amal qiladi va har bir kishi g'ayriqonuniy xatti-harakatlar to'g'risida xabar berish imkoniyatiga ega deb hisoblaydi.",
        reportReason: "Shu munosabat bilan, agar sizda xavotirlar yoki qonunbuzarlik dalillari bo'lsa:",
        violationList: [
            "xodimlarning ishbilarmonlik etikasiga rioya qilmasligi;",
            "biznes hamkorning ishbilarmonlik etikasiga rioya qilmasligi;",
            "firibgarlik, poraxo'rlik;",
            "shaxshiy daxlsizlikka tajovuz;",
            "manfaatlar to'qnashuvi;",
            "ichki tasdiqlangan normalarning buzilishi."
        ],
        examplesHeader: "Korxona bilan bog'liq qonunbuzarliklar ro'yxati:",
        examples: [
            "O'zbekiston Respublikasi normativ-huquqiy hujjatlarini buzish",
            "Insofsiz yoki korrupsion xatti-harakatlar ko'rinishi",
            "Ichki va tashqi tekshiruvlarga to'sqinlik qilish",
            "Moliyaviy hisobotni yuritish bilan bog'liq qonunbuzarliklar",
            "Manfaatlar to'qnashuvi",
            "Konfidentsial ma'lumotlarning noqonuniy tarqalishi",
            "Nomaqbul xarakterdagi boshqa faoliyatlar"
        ],
        channelsTitle: "ALOQA KANALLARI",
        channelsDesc: "Arizachilar Korxona xodimlarining noqonuniy harakatlari haqida quyidagi kanallar orqali xabar berishlari mumkin:",
        docLinks: [
            { title: "«UzAuto Trailer» Komplaens Siyosati", url: "#" },
            { title: "«UzAuto Trailer» Komplaens Dasturi", url: "#" },
            { title: "Xodimlarning odob-axloq kodeksi", url: "#" },
            { title: "Hamkorlarning odob-axloq kodeksi", url: "#" }
        ],
        formTitle: "Sayt orqali xabar yuborish",
        formTypeOpen: "Ochiq",
        formTypeAnon: "Anonim",
        fields: { fio: "F.I.SH.", email: "E-pochta", subject: "Xabar mavzusi", phone: "Telefon", message: "Xabar matni", submit: "Yuborish" },
        privacy: "UzAuto Trailer rasmiy hujjati",
        successMsg: "Xabar muvaffaqiyatli yuborildi.",
        errorMsg: "Xabar yuborishda xatolik yuz berdi.",
        modalClose: "Yopish"
    }
};

const Compliance = ({ lang = 'ru' }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const t = translations[lang] || translations.ru;
    
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
    const [modal, setModal] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            isAnonymous,
            subject: formData.subject,
            message: formData.message,
            pageUrl: typeof window !== 'undefined' ? window.location.href : '',
            name: isAnonymous ? null : formData.name,
            email: isAnonymous ? null : formData.email,
            phone: isAnonymous ? null : formData.phone
        };
        try {
            const response = await fetch(`${API_BASE_URL}/compliance/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                setModal({ show: true, type: 'success', message: t.successMsg });
                setFormData({ name: '', email: '', subject: '', phone: '', message: '' });
            } else { 
                setModal({ show: true, type: 'error', message: t.errorMsg }); 
            }
        } catch (error) { 
            setModal({ show: true, type: 'error', message: t.errorMsg }); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="pt-0 bg-[#F8FAFC] font-inter min-h-screen pb-12 lg:pb-20">

            {/* MODAL */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({ ...modal, show: false })} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${modal.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                {modal.type === 'success' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-[#1a2e44] mb-2">{modal.type === 'success' ? (lang === 'ru' ? 'Успешно!' : 'Muvaffaqiyatli!') : (lang === 'ru' ? 'Ошибка!' : 'Xatolik!')}</h3>
                            <p className="text-gray-500 text-sm mb-6">{modal.message}</p>
                            <button onClick={() => setModal({ ...modal, show: false })} className="w-full py-3 bg-[#0054A6] text-white rounded-xl font-bold text-xs uppercase tracking-widest">{t.modalClose}</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 1. HERO */}
            <section className="relative h-[220px] lg:h-[350px] flex items-center bg-[#0a1425] overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 z-10"></div>
                <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" alt="Compliance" />
                <div className="relative z-20 max-w-[1440px] mx-auto px-4 lg:px-12 w-full text-center lg:text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-[#0054A6] font-bold tracking-widest uppercase text-[10px] mb-3 block">UzAuto Trailer Integrity</span>
                        <h1 className="text-2xl lg:text-5xl font-bold text-white uppercase">{t.heroTitle}</h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-4 lg:px-8 -mt-8 lg:-mt-12 relative z-30">
                {/* 2. INTRO */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
                        <p className="text-base lg:text-lg font-semibold text-[#1a2e44] leading-relaxed mb-6 border-l-4 border-[#0054A6] pl-5">{t.introText}</p>
                        <div className="space-y-4 text-gray-500 text-sm lg:text-base leading-relaxed text-justify">
                            <p>{t.ethicsText}</p>
                            <div className="p-5 lg:p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4 items-start">
                                <Handshake className="text-[#0054A6] shrink-0" size={24} />
                                <p className="text-[#1a2e44] font-semibold text-xs lg:text-sm">{t.commitmentText}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 bg-[#0054A6] rounded-3xl p-8 text-white flex flex-col justify-center">
                        <p className="text-base lg:text-xl font-medium leading-relaxed opacity-90">{t.informPolicy}</p>
                    </div>
                </div>

                {/* 3. VIOLATIONS */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-5">
                        <div className="w-12 h-1 bg-[#0054A6] mb-4"></div>
                        <h2 className="text-xl lg:text-3xl font-bold text-[#1a2e44] leading-tight">{t.reportReason}</h2>
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {t.violationList.map((item, i) => (
                            <div key={i} className="flex gap-3 items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <FileWarning size={16} className="text-red-500 mt-1 shrink-0" />
                                <span className="text-xs lg:text-sm text-gray-600 font-semibold">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. CHANNELS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 lg:mb-20">
                    <div className="lg:col-span-8 bg-[#1a2e44] rounded-3xl p-8 lg:p-12 text-white shadow-lg">
                        <h2 className="text-xl lg:text-2xl font-bold mb-6 uppercase tracking-tight">{t.channelsTitle}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <div className="text-[#0054A6] font-bold text-[10px] uppercase tracking-widest">Email</div>
                                <a href="mailto:compliance@trailer.uz" className="text-lg font-bold hover:text-blue-300 transition-colors">compliance@trailer.uz</a>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[#0054A6] font-bold text-[10px] uppercase tracking-widest">Hot Line</div>
                                <a href="tel:+998712023883" className="text-lg font-bold hover:text-blue-300 transition-colors">+998 71 202 38 83</a>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-3">
                        {t.docLinks && t.docLinks.map((doc, i) => (
                            <a key={i} href={doc.url} target="_blank" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">
                                <span className="text-[11px] lg:text-[12px] font-bold leading-tight max-w-[85%]">{doc.title}</span>
                                <FileText size={18} className="text-[#0054A6]" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* 6. FORM */}
                <section id="compliance-form" className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-[32px] p-6 lg:p-10 shadow-xl border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-xl lg:text-2xl font-bold text-[#1a2e44] mb-5">{t.formTitle}</h2>
                            <div className="inline-flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
                                <button type="button" onClick={() => setIsAnonymous(false)} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${!isAnonymous ? 'bg-white text-[#1a2e44] shadow-sm' : 'text-gray-400'}`}> {t.formTypeOpen}</button>
                                <button type="button" onClick={() => setIsAnonymous(true)} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isAnonymous ? 'bg-[#0054A6] text-white shadow-sm' : 'text-gray-400'}`}> {t.formTypeAnon}</button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
                            {!isAnonymous && (
                                <>
                                    <input required value={formData.name} type="text" placeholder={t.fields.fio} className="w-full bg-gray-50 border border-transparent focus:border-blue-200 rounded-xl px-4 py-3 text-sm outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    <input required value={formData.email} type="email" placeholder={t.fields.email} className="w-full bg-gray-50 border border-transparent focus:border-blue-200 rounded-xl px-4 py-3 text-sm outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    <input value={formData.phone} type="tel" placeholder={t.fields.phone} className="w-full bg-gray-50 border border-transparent focus:border-blue-200 rounded-xl px-4 py-3 text-sm outline-none sm:col-span-2" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </>
                            )}
                            <input required value={formData.subject} type="text" placeholder={t.fields.subject} className={`w-full bg-gray-50 border border-transparent focus:border-blue-200 rounded-xl px-4 py-3 text-sm outline-none ${isAnonymous ? 'sm:col-span-2' : ''}`} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                            <textarea required value={formData.message} rows="4" placeholder={t.fields.message} className="sm:col-span-2 w-full bg-gray-50 border border-transparent focus:border-blue-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none" onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                            
                            <div className="sm:col-span-2 flex flex-col items-center pt-4">
                                <button disabled={loading} type="submit" className="w-full sm:w-auto bg-[#0054A6] hover:bg-[#004488] text-white px-12 py-3.5 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50">
                                    {loading ? "..." : t.fields.submit}
                                </button>
                                <p className="mt-4 flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-green-500" /> {t.privacy}
                                </p>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Compliance;