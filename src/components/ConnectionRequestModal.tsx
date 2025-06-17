import React, { useState, useEffect } from 'react';

interface ConnectionRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    recipientId: number;
    connectedProjectId?: number;
    connectedProjectTitle?: string;
    onSend: (data: { recipientId: number; reason: string; link: string; connectionType: string; projetoId?: number; projetoTitle?: string }) => void;
}

const connectionTypes = [
    'Criar grupo novo com esta pessoa',
    'Trocar ideias / Mentoria',
    'Propor parceria pontual',
    'Outro (campo livre)'
];

const ConnectionRequestModal: React.FC<ConnectionRequestModalProps> = ({
    isOpen,
    onClose,
    recipientName,
    recipientId,
    connectedProjectId,
    connectedProjectTitle,
    onSend
}) => {
    const [reason, setReason] = useState('');
    const [portfolioLink, setPortfolioLink] = useState('');
    const [connectionType, setConnectionType] = useState(connectionTypes[0]);
    const [otherType, setOtherType] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPortfolioLink('');
            setReason('');
            setConnectionType(connectionTypes[0]);
            setOtherType('');
        }
    }, [isOpen, connectedProjectId]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend({
            recipientId,
            reason,
            link: portfolioLink,
            connectionType: connectionType === 'Outro (campo livre)' ? otherType : connectionType,
            projetoId: connectedProjectId,
            projetoTitle: connectedProjectTitle
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#b48bb2] rounded-3xl p-8 w-full max-w-md shadow-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold">×</button>
                <h2 className="text-2xl font-bold mb-6 text-center">Enviar Solicitação de conexão</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Com quem você deseja se conectar?</label>
                        <input
                            type="text"
                            value={recipientName}
                            disabled
                            className="w-full rounded-xl px-4 py-2 border border-gray-300 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Por que você quer se conectar?</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            required
                            className="w-full rounded-xl px-4 py-2 border border-gray-300"
                        />
                    </div>

                    {connectedProjectId ? (
                        <div>
                            <label className="block mb-1">Convidando para o projeto:</label>
                            <input
                                type="text"
                                value={connectedProjectTitle || ''}
                                disabled
                                className="w-full rounded-xl px-4 py-2 border border-gray-300 bg-gray-100"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block mb-1">Link do seu Portfólio (Opcional):</label>
                            <input
                                type="text"
                                value={portfolioLink}
                                onChange={e => setPortfolioLink(e.target.value)}
                                placeholder="Link para seu portfólio ou projeto"
                                className="w-full rounded-xl px-4 py-2 border border-gray-300"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block mb-1">Selecionar um tipo de conexão:</label>
                        <select
                            value={connectionType}
                            onChange={e => setConnectionType(e.target.value)}
                            className="w-full rounded-xl px-4 py-2 border border-gray-300"
                        >
                            {connectionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {connectionType === 'Outro (campo livre)' && (
                            <input
                                type="text"
                                value={otherType}
                                onChange={e => setOtherType(e.target.value)}
                                placeholder="Especifique o tipo de conexão"
                                className="w-full rounded-xl px-4 py-2 border border-gray-300 mt-2"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#6d3c6b] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#4e2a4e] transition-colors duration-200 mt-4"
                    >
                        Enviar Solicitação
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConnectionRequestModal; 