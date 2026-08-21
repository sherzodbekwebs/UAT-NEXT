import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [roomId, setRoomId] = useState('');
    
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'); 
        audio.play().catch(() => {});
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        let savedRoomId = localStorage.getItem('chat_room_id');
        if (!savedRoomId) {
            savedRoomId = `room_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('chat_room_id', savedRoomId);
        }
        setRoomId(savedRoomId);

        socketRef.current = io('http://localhost:3000', {
            transports: ['websocket'],
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            socket.emit('joinRoom', { roomId: savedRoomId });
        });

        socket.on('chatHistory', (history) => {
            setChatHistory(history);
        });

        socket.on('newMessage', (newMessage) => {
            setChatHistory((prev) => [...prev, newMessage]);
            if (newMessage.sender === 'OPERATOR') {
                playNotificationSound();
            }
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [chatHistory, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!socketRef.current || !socketRef.current.connected || !message.trim()) return;

        const data = {
            roomId: roomId,
            text: message,
            sender: 'CLIENT'
        };

        socketRef.current.emit('sendMessage', data);
        setMessage('');
    };

    return (
        <div className="fixed bottom-6 right-24 z-[9999] font-sans">
            {/* --- Chat Ochish Tugmasi --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${
                    isOpen ? 'bg-white text-gray-800' : 'bg-blue-600 text-white'
                }`}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        <span className="absolute top-0 right-0 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
                        </span>
                    </>
                )}
            </button>

            {/* --- Chat Oynasi --- */}
            <div className={`absolute bottom-20 right-0 w-[360px] h-[520px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
                isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-10 pointer-events-none'
            }`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-700 rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-base leading-tight">UzAuto Yordam</h3>
                            <p className="text-xs text-blue-100">Onlayn muloqot</p>
                        </div>
                    </div>
                </div>

                {/* Xabarlar maydoni */}
                <div className="flex-1 p-4 overflow-y-auto bg-[#f8f9fa] space-y-3 custom-scrollbar">
                    {chatHistory.length === 0 && (
                        <div className="text-center py-10 px-6">
                            <div className="bg-blue-50 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <p className="text-gray-500 text-sm">Assalomu alaykum! Savollaringizga javob berishga tayyormiz.</p>
                        </div>
                    )}
                    
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'CLIENT' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1`}>
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed shadow-sm ${
                                msg.sender === 'CLIENT' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input qismi */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-[20px] px-4 py-2 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Xabarni shu yerga yozing..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-800 py-1"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!message.trim()}
                        className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .animate-in {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;