'use client';
import React, { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';

// 🔵 Bot uchun ma'lumotlar bazasi (Shu yerga hamma ma'lumotni batafsil yozasiz)
const KNOWLEDGE_BASE = [
    {
        topic: "Samosvallar",
        content: "UzAuto Trailer Kamaz va MAN shassilari asosida 15 dan 25 tonnagacha yuk ko'taradigan samosvallar ishlab chiqaradi. Ular qurilish va og'ir sanoat uchun mo'ljallangan.",
        tags: ["samosval", "yuk mashina", "kamaz", "man", "texnika", "samosval narxi"]
    },
    {
        topic: "Dillerlar",
        content: "Bizning rasmiy dillerlarimiz: Toshkent shahrida (Sergeli tumani, KHAY 1-uy), Samarqandda (Jomboy tumani), shuningdek Andijon va Farg'ona filiallari mavjud.",
        tags: ["diller", "manzil", "filial", "qayerda", "joylashuv", "shahar", "ofis"]
    },
    {
        topic: "Kontaktlar",
        content: "Biz bilan bog'lanish uchun: +998 71 202 00 00 raqamiga qo'ng'iroq qiling yoki info@uzautotrailer.uz pochtasiga yozing. Ish vaqti: 09:00 - 18:00.",
        tags: ["telefon", "nomer", "aloqa", "kontakt", "email", "pochta", "bog'lanish", "raqam"]
    },
    {
        topic: "Pritseplar",
        content: "Bizda har xil turdagi yarim tirkamalar mavjud: bortli, tentli, izotermik (refrijerator) va konteyner tashuvchilar. Sifati xalqaro standartlarga javob beradi.",
        tags: ["tirkama", "pritsep", "tent", "refrijerator", "muzlatkich", "yarim tirkama"]
    }
];

const fuseOptions = {
    keys: ['tags', 'content', 'topic'],
    threshold: 0.4, // Qidiruv aniqligi
};
const fuse = new Fuse(KNOWLEDGE_BASE, fuseOptions);

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([{ role: 'bot', text: 'UzAuto Trailer yordamchisiman. Sizga qanday yordam bera olaman?' }]);
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const result = fuse.search(input.toLowerCase());
        let botReply = "";

        if (result.length > 0) {
            botReply = result[0].item.content;
        } else {
            botReply = "Kechirasiz, men faqat UzAuto Trailer mahsulotlari, dillerlari va kontakt ma'lumotlari haqida ma'lumot bera olaman.";
        }

        setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'bot', text: botReply }]);
        setInput('');
    };

    return (
        <div style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 10000 }}>
            {!isOpen ? (
                <button onClick={() => setIsOpen(true)} style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer', fontSize: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>💬</button>
            ) : (
                <div style={{ width: '320px', height: '450px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '15px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                    <div style={{ padding: '15px', backgroundColor: '#0056b3', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{fontSize: '14px'}}>UAT Yordamchi</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', backgroundColor: m.role === 'user' ? '#0056b3' : '#e9e9eb', color: m.role === 'user' ? 'white' : 'black', padding: '10px', borderRadius: '15px', maxWidth: '85%', fontSize: '13px' }}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee' }}>
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Savol..." style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '8px 15px', outline: 'none', color: 'black', fontSize: '14px' }} />
                        <button onClick={handleSend} style={{ marginLeft: '5px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer' }}>➔</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatBot;