import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
    usuario_id: number;
    nome: string;
    foto_perfil?: string;
    tipo?: string;
}

interface AddCollaboratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    projetoId: number;
    onInvite: (user: Usuario) => void;
}

const normalizeUserImage = (foto_perfil?: string) => {
    if (!foto_perfil) return '/default-profile.png';
    if (foto_perfil.startsWith('uploads/')) return `http://localhost:5000/${foto_perfil}`;
    if (foto_perfil.startsWith('http')) return foto_perfil;
    return '/default-profile.png';
};

const AddCollaboratorModal: React.FC<AddCollaboratorModalProps> = ({ isOpen, onClose, projetoId, onInvite }) => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            axios.get('/usuarios').then(res => {
                setUsuarios(res.data);
                setLoading(false);
            });
        }
    }, [isOpen]);

    const filtered = usuarios.filter(u => u.nome.toLowerCase().includes(search.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold">×</button>
                <h2 className="text-2xl font-bold mb-6 text-center">Adicionar Colaborador</h2>
                <input
                    type="text"
                    placeholder="Buscar usuário..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                />
                {loading ? (
                    <div className="text-center">Carregando...</div>
                ) : (
                    <div className="max-h-80 overflow-y-auto flex flex-col gap-3">
                        {filtered.map(user => (
                            <div key={user.usuario_id} className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded cursor-pointer" onClick={() => onInvite(user)}>
                                <img src={normalizeUserImage(user.foto_perfil)} alt={user.nome} className="w-10 h-10 rounded-full border-2 border-brand-purple object-cover" />
                                <span className="font-medium">{user.nome}</span>
                                <span className="text-xs text-gray-500">{user.tipo}</span>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="text-center text-gray-500">Nenhum usuário encontrado.</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCollaboratorModal;
