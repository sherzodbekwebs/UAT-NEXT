"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const OPENAI_KEY = process.env.NEXT_PUBLIC_OPENAI_KEY;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput("");
        setLoading(true);
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

        try {
            // 1. API-lardan ma'lumot olish
            const [products, dealers, news] = await Promise.all([
                fetch("https://api.uzautotrailer.uz/products").then(res => res.json()).catch(() => []),
                fetch("https://api.uzautotrailer.uz/dealers").then(res => res.json()).catch(() => []),
                fetch("https://api.uzautotrailer.uz/news").then(res => res.json()).catch(() => []),
            ]);

            const companyInfo = `UzAuto Trailer MChJ 2012-yil 4-iyunda tashkil etilgan. Zavod Samarqand viloyati, Jomboy tumanida joylashgan. Kamaz shataki tortuvchilari, samosvallar va tirkamalar ishlab chiqaradi.`;

            const context = `
                Siz UzAuto Trailer kompaniyasining rasmiy yordamchisisiz. 
                TARIX: ${companyInfo}
                MAHSULOTLAR: ${JSON.stringify(products)}
                DILLERLAR: ${JSON.stringify(dealers)}
                YANGILIKLAR: ${JSON.stringify(news)}

                Qoidalaringiz:
                1. Faqat o'zbek tilida, qisqa va aniq javob bering (maksimal 2-3 gap).
                2. Jadvallar (table) ishlatmang.
                3. Ma'lumot yo'l bo'lsa, muloyimlik bilan bilmasligingizni ayting.
                4. Odamdek gapiring, "Ma'lumotlarga ko'ra" demang.
            `;

            // 2. OpenAI GPT-4o Mini API so'rovi
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini", // Siz tanlagan model
                    messages: [
                        { role: "system", content: context },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("OpenAI Error:", data.error);
                setMessages((prev) => [...prev, { role: "ai", text: "Xatolik: " + data.error.message }]);
                return;
            }

            const aiText = data.choices[0].message.content;
            setMessages((prev) => [...prev, { role: "ai", text: aiText }]);

        } catch (error) {
            setMessages((prev) => [...prev, { role: "ai", text: "Tizimga ulanishda xatolik." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 font-sans">
            <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center w-[60px] h-[60px]">
                {isOpen ? "✕" : "💬"}
            </button>

            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[350px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-blue-600 p-4 text-white font-bold flex flex-col shadow-md">
                        <span className="text-lg">UAT AI Assistant</span>
                        <span className="text-[10px] font-normal opacity-80 mt-1">GPT-4o Mini tomonidan quvvatlanadi</span>
                    </div>

                    <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 text-black">
                        {messages.length === 0 && (
                            <div className="text-center py-10 text-gray-500 text-sm">Assalomu alaykum! Savollaringizga javob berishga tayyorman.</div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                                    <p className="whitespace-pre-wrap">{m.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-xs text-gray-400 animate-pulse">AI yozmoqda...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t bg-white flex gap-2">
                        <input className="flex-1 border border-gray-200 p-2 rounded-xl text-sm text-black outline-none focus:border-blue-500" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Savol yozing..." />
                        <button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">Yuborish</button>
                    </div>
                </div>
            )}
        </div>
    );
}





// Ha, aynan shu! GPT-4o Mini — hozirda chat-botlar uchun dunyodagi eng zo'r va eng hamyonbop model hisoblanadi.
// Nega aynan shu modelni tanlashimiz kerak?
// Juda arzon: Rasmda ko'rib turganingizdek, 1 million "token" (taxminan 750,000 ta so'z) uchun bor-yo'g'i $0.15 so'raydi. Bu degani, sizning $5 pulingiz oylab yetishi mumkin.
// Juda tez: Javobni Groq kabi tez qaytaradi.
// Aqlli: U o'zining "katta akasi" (GPT-4o) kabi aqlli, ayniqsa kompaniya ma'lumotlari bilan ishlashda juda aniq javob beradi.
// Endi nima qilish kerak?
// Billingni sozlang:
// Tepada o'ng tomonda "Dashboard" tugmasini bosing.
// Menyudan "Settings" -> "Billing" bo'limiga o'ting.
// "Add to balance" orqali kartangizdan kamida $5 solib qo'ying (bu sizga "Credit" sifatida beriladi).
// API Key oling:
// "API Keys" bo'limiga o'ting.
// Yangi key yarating (sk-... bilan boshlanadi).
// Kodni yangilang:
// .env faylingizga shu yangi keyni qo'ying.
// ChatWidget.jsx ichidagi URLni https://api.openai.com/v1/chat/completions ga, modelni esa gpt-4o-mini ga o'zgartiring.
// Xulosa: Bu model bilan saytingizdagi chat huddi haqiqiy odamdek, tez va sifatli ishlaydi. Tekin modellardagi "tizimda xatolik" yoki "model topilmadi" degan muammolar OpenAI bilan deyarli bo'lmaydi.
// Hisobni to'ldirishda yoki koddagi o'zgarishda yordam kerak bo'lsa, yozing!