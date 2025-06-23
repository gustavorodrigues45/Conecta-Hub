import React, { useState, useEffect } from 'react';

interface Projeto {
    projeto_id: number;
    titulo: string;
}

interface VagaConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    recipientId: number;
    projetos: Projeto[];
    onSend: (data: { recipientId: number; reason: string; projetoId: number }) => void;
}

const VagaConnectionModal: React.FC<VagaConnectionModalProps> = ({
    isOpen,
    onClose,
    recipientName,
    recipientId,
    projetos,
    onSend
}) => {
    const [reason, setReason] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReason('');
            setSelectedProjectId('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectId) {
            setError('Selecione um projeto do seu portfólio.');
            return;
        }
        if (!reason.trim()) {
            setError('Escreva uma mensagem para o dono da vaga.');
            return;
        }
        setError('');
        onSend({
            recipientId,
            reason,
            projetoId: Number(selectedProjectId)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#b48bb2] rounded-3xl p-8 w-full max-w-md shadow-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold text-white">×</button>
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Conectar-se à Vaga</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-white">Com quem você deseja se conectar?</label>
                        <input
                            type="text"
                            value={recipientName}
                            disabled
                            className="w-full rounded-xl px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-white">Selecione um projeto do seu portfólio</label>
                        <select
                            value={selectedProjectId}
                            onChange={e => setSelectedProjectId(e.target.value ? Number(e.target.value) : '')}
                            required
                            className="w-full rounded-xl px-4 py-2 border border-gray-300 text-gray-700"
                        >
                            <option value="">Selecione...</option>
                            {projetos.map(proj => (
                                <option key={proj.projeto_id} value={proj.projeto_id}>{proj.titulo}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-white">Mensagem para o dono da vaga</label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            required
                            className="w-full rounded-xl px-4 py-2 border border-gray-300 text-gray-700"
                            rows={4}
                            placeholder="Escreva uma mensagem personalizada..."
                        />
                    </div>
                    {error && <div className="text-red-200 text-sm mb-2">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-brand-purple text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-purple-dark transition-colors duration-200 mt-4"
                    >
                        Enviar Solicitação
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VagaConnectionModal;
