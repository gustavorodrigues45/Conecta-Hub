import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatInfo, setChatInfo] = useState<any>(null);
    const userId = JSON.parse(localStorage.getItem('user') || '{}').usuario_id;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!chatId) return;
            const res = await axios.get(`/chats/${chatId}/messages`);
            setMessages(res.data);
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [chatId]);

    useEffect(() => {
        const fetchChatInfo = async () => {
            if (!chatId) return;
            const res = await axios.get(`/chats/${chatId}`);
            setChatInfo(res.data);
        };
        fetchChatInfo();
    }, [chatId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await axios.post(`/chats/${chatId}/messages`, {
            sender_id: userId,
            message: newMessage.trim(),
        });
        setNewMessage('');
    };

    return (
        <div className="container mx-auto max-w-4xl h-[600px] my-8 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <header className="bg-brand-purple text-white px-6 py-3 flex items-center gap-4 shadow">
                {chatInfo && (
                    <div className="flex items-center gap-3">
                        <img
                            src={chatInfo.user1_id === userId
                                ? (chatInfo.user2_foto ? `http://localhost:5000/${chatInfo.user2_foto}` : '/default-profile.png')
                                : (chatInfo.user1_foto ? `http://localhost:5000/${chatInfo.user1_foto}` : '/default-profile.png')
                            }
                            alt="Foto do perfil"
                            className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        />
                        <span className="text-base font-semibold">
                            {chatInfo.user1_id === userId ? chatInfo.user2_nome : chatInfo.user1_nome}
                        </span>
                    </div>
                )}
            </header>
            <main className="h-[500px] p-4 flex flex-col">
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto mb-4">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-2 ${msg.sender_id === userId ? 'flex-row-reverse' : ''}`}
                        >
                            <img
                                src={msg.sender_foto ? `http://localhost:5000/${msg.sender_foto}` : '/default-profile.png'}
                                alt={msg.sender_nome || 'Foto do perfil'}
                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                            <div className={`flex flex-col ${msg.sender_id === userId ? 'items-end' : 'items-start'}`}>
                                <span className="text-xs text-gray-500 mb-1 px-1">
                                    {msg.sender_nome}
                                </span>
                                <div
                                    className={`px-3 py-2 rounded-xl shadow-sm ${msg.sender_id === userId
                                            ? 'bg-brand-purple text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    <div className={`text-[10px] mt-1 ${msg.sender_id === userId ? 'text-purple-200' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="flex gap-2 bg-gray-100">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-brand-purple outline-none text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-brand-purple text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-purple-dark transition-colors"
                    >
                        Enviar
                    </button>
                </form>
            </main>
        </div>
    );
};

export default ChatPage;