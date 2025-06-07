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
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000); // Atualiza a cada 2s
        return () => clearInterval(interval);
    }, [chatId]);

    useEffect(() => {
        // Buscar info do chat (nomes dos usuários)
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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-brand-purple text-white px-6 py-4 flex items-center gap-4 shadow">
                <h2 className="text-xl font-bold">Chat</h2>
                {chatInfo && (
                    <span className="ml-4 text-base">
                        com {chatInfo.user1_id === userId ? chatInfo.user2_nome : chatInfo.user1_nome}
                    </span>
                )}
            </header>
            <main className="flex-1 overflow-y-auto p-4 flex flex-col">
                <div className="flex-1 flex flex-col gap-2">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`max-w-xl px-4 py-2 rounded-2xl shadow text-base ${msg.sender_id === userId ? 'bg-brand-purple text-white self-end' : 'bg-white text-gray-800 self-start'}`}
                        >
                            {msg.message}
                            <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-brand-purple outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-brand-purple text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-purple-dark transition-colors"
                    >
                        Enviar
                    </button>
                </form>
            </main>
        </div>
    );
};

export default ChatPage; 