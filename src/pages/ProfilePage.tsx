import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

interface Projeto {
    projeto_id: number;
    titulo: string;
    descricao: string;
    imagem_capa: string;
    usuario_id: number;
    usuario_nome?: string;
    usuario_foto?: string;
    colaboradores?: number[]; // IDs dos colaboradores
}

interface Usuario {
    usuario_id: number;
    nome: string;
    email: string;
    tipo: string;
    foto_perfil: string | null;
    descricao: string | null;
    github?: string;
    google_drive?: string;
}

interface Notificacao {
    notificacao_id: number;
    tipo: 'curtida' | 'comentario' | 'convite_colaborador' | 'conexao';
    usuario_nome: string;
    usuario_foto: string;
    usuario_origem_id: number;
    projeto_titulo: string;
    projeto_id: number;
    comentario_texto?: string;
    comentario_id?: number;
    vaga_titulo?: string; // Título da vaga de onde veio a notificação
    mensagem?: string; // Mensagem enviada na conexão
    reason?: string; // fallback para mensagem
}

interface SolicitacaoConexao {
    id: number;
    sender_foto: string;
    sender_nome: string;
    connection_type: string;
    reason: string;
    link?: string; // Agora para um link de portfólio geral
    sender_id: number;
    projeto_id?: number; // ID do projeto se a conexão for para um projeto específico
    projeto_titulo?: string; // Título do projeto se a conexão for para um projeto específico
    vaga_titulo?: string; // Título da vaga de onde veio a notificação
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('portfolio');
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [newDesc, setNewDesc] = useState('');
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [solicitacoesConexao, setSolicitacoesConexao] = useState<SolicitacaoConexao[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const userId = JSON.parse(localStorage.getItem('user') || '{}').usuario_id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/usuarios/${userId}`);
                setUsuario(response.data);
                setNewDesc(response.data.descricao || '');
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        const fetchProjetos = async () => {
            try {
                const response = await axios.get('/projetos');
                // Inclui projetos que o usuário é dono OU colaborador
                const projetosDoUsuario = response.data.filter(
                    (projeto: Projeto) => projeto.usuario_id === userId || (projeto.colaboradores && projeto.colaboradores.includes(userId))
                );
                setProjetos(projetosDoUsuario);
            } catch (error) {
                console.error('Erro ao buscar projetos:', error);
            }
        };

        if (userId) {
            fetchUserData();
            fetchProjetos();
        } else {
            navigate('/login');
        }
    }, [userId, navigate]);

    useEffect(() => {
        if (userId && activeTab === 'conexoes') {
            axios.get(`/usuarios/${userId}/notificacoes`).then(res => {
                setNotificacoes(res.data);
            });
            axios.get(`/usuarios/${userId}/conexoes-recebidas`).then(res => {
                setSolicitacoesConexao(res.data.filter((c: any) => c.status === 'pendente'));
            });
            axios.get(`/chats/user/${userId}`).then(res => {
                setChats(res.data);
            });
        }
    }, [userId, activeTab]);

    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('foto_perfil', file);

        try {
            await axios.put(`/usuarios/${userId}/foto`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Recarregar os dados do usuário
            const response = await axios.get(`/usuarios/${userId}`);
            setUsuario(response.data);
            setIsEditingPhoto(false);
        } catch (error) {
            console.error('Erro ao atualizar foto:', error);
            alert('Erro ao atualizar foto. Tente novamente.');
        }
    };

    const handleDescriptionUpdate = async () => {
        try {
            await axios.put(`/usuarios/${userId}/descricao`, { descricao: newDesc });
            setUsuario(prev => prev ? { ...prev, descricao: newDesc } : null);
            setIsEditingDesc(false);
        } catch (error) {
            console.error('Erro ao atualizar descrição:', error);
            alert('Erro ao atualizar descrição. Tente novamente.');
        }
    };

    const handleVisto = async (id: number) => {
        try {
            await axios.delete(`/notificacoes/${id}`);
            setNotificacoes(prev => prev.filter(n => n.notificacao_id !== id));
        } catch (e) {
            alert('Erro ao remover notificação');
        }
    };

    const handleVistoSolicitacao = async (id: number) => {
        try {
            await axios.delete(`/conexoes/${id}`);
            setSolicitacoesConexao(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            alert('Erro ao remover solicitação');
        }
    };

    const handleVerComentario = (projetoId: number, comentarioId?: number) => {
        navigate(`/portfolio/${projetoId}`, { state: { scrollToComments: true, comentarioId } });
    };

    const handleAceitarConexao = async (id: number, senderId: number) => {
        try {
            const res = await axios.put(`/conexoes/${id}/aceitar`);
            // Atualizar lista de chats imediatamente
            const chatsRes = await axios.get(`/chats/user/${userId}`);
            setChats(chatsRes.data);
            // Redireciona para o chat criado
            navigate(`/chat/${res.data.chat.id}`);
        } catch (err) {
            alert('Erro ao aceitar conexão');
        }
    };

    const handleRecusarConexao = async (id: number) => {
        try {
            await axios.put(`/conexoes/${id}/recusar`);
            setSolicitacoesConexao(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert('Erro ao recusar conexão');
        }
    };

    // Handlers para aceitar/recusar convite
    const handleAceitarConvite = async (notificacaoId: number) => {
        try {
            await axios.post(`/notificacoes/${notificacaoId}/aceitar-convite`);
            setNotificacoes(prev => prev.filter(n => n.notificacao_id !== notificacaoId));
            alert('Convite aceito! Agora você é colaborador do projeto.');
        } catch (err) {
            alert('Erro ao aceitar convite.');
        }
    };
    const handleRecusarConvite = async (notificacaoId: number) => {
        try {
            await axios.post(`/notificacoes/${notificacaoId}/recusar-convite`);
            setNotificacoes(prev => prev.filter(n => n.notificacao_id !== notificacaoId));
            alert('Convite recusado.');
        } catch (err) {
            alert('Erro ao recusar convite.');
        }
    };

    const renderNotificacoesRoxas = () => (
        <div className="space-y-3">
            {notificacoes.length > 0 ? (
                notificacoes.map((notif) => (
                    <div key={notif.notificacao_id} className="bg-purple-300 rounded-2xl p-3 flex items-center gap-3">
                        <Link to={`/perfil/${notif.usuario_origem_id}`} className="flex items-center gap-3">
                            <img
                                src={notif.usuario_foto ? `http://localhost:5000/${notif.usuario_foto}` : '/default-profile.png'}
                                alt={notif.usuario_nome}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-semibold mr-2">@{notif.usuario_nome}</span>
                        </Link>
                        <div className="flex-1">
                            {/* Notificação de conexão para vaga: formato especial */}
                            {notif.tipo === 'conexao' && notif.vaga_titulo ? (
                                <>
                                    <span>
                                        quer se conectar à vaga: <span className="font-semibold">{notif.vaga_titulo}</span>
                                    </span>
                                    <div className="text-xs text-gray-700 mt-1 italic">{notif.mensagem || notif.reason}</div>
                                    {notif.projeto_titulo && notif.projeto_id && (
                                        <div className="text-xs text-blue-700 mt-1">
                                            Portfólio escolhido: <Link to={`/portfolio/${notif.projeto_id}`} className="font-medium underline hover:text-blue-900">{notif.projeto_titulo}</Link>
                                        </div>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleVisto(notif.notificacao_id)}
                                            className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-xs hover:bg-green-300"
                                        >
                                            Visto
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {notif.vaga_titulo && (
                                        <div className="text-sm text-purple-900 font-bold mb-1">Vaga: {notif.vaga_titulo}</div>
                                    )}
                                    {notif.tipo === 'curtida' && (
                                        <span>curtiu seu projeto - <span className="font-semibold">{notif.projeto_titulo}</span></span>
                                    )}
                                    {notif.tipo === 'comentario' && (
                                        <>
                                            <span>comentou seu projeto - <span className="font-semibold">{notif.projeto_titulo}</span></span>
                                            <div className="text-xs text-gray-700 mt-1 italic">"{notif.comentario_texto}"</div>
                                        </>
                                    )}
                                    {notif.tipo === 'convite_colaborador' && (
                                        <>
                                            <span>convidou você para ser colaborador no projeto <span className="font-semibold">{notif.projeto_titulo}</span></span>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAceitarConvite(notif.notificacao_id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600"
                                                >
                                                    Aceitar
                                                </button>
                                                <button
                                                    onClick={() => handleRecusarConvite(notif.notificacao_id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                                                >
                                                    Recusar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {(notif.tipo === 'curtida' || notif.tipo === 'comentario') && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleVisto(notif.notificacao_id)}
                                                className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-xs hover:bg-green-300"
                                            >
                                                Visto
                                            </button>
                                            {notif.tipo === 'comentario' && (
                                                <button
                                                    onClick={() => handleVerComentario(notif.projeto_id, notif.comentario_id)}
                                                    className="px-3 py-1 bg-white text-purple-900 rounded-full text-xs hover:bg-gray-100 border border-purple-400"
                                                >
                                                    Ver comentário
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">
                    Nenhuma notificação encontrada
                </div>
            )}
        </div>
    );

    const renderMiniChatList = () => (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="text-lg font-bold mb-3 text-brand-purple">Suas Conversas</h3>
            {chats.length > 0 ? (
                <ul className="space-y-2">
                    {chats.map(chat => {
                        const otherUserId = chat.user1_id === userId ? chat.user2_id : chat.user1_id;
                        const otherUserName = chat.user1_id === userId ? chat.user2_nome : chat.user1_nome;
                        const otherUserFoto = chat.user1_id === userId ? chat.user2_foto : chat.user1_foto;
                        return (
                            <li key={chat.id} className="flex items-center gap-3 cursor-pointer hover:bg-purple-50 rounded-lg p-2" onClick={() => navigate(`/chat/${chat.id}`)}>
                                <img src={otherUserFoto ? `http://localhost:5000/${otherUserFoto}` : '/default-profile.png'} alt={otherUserName} className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-medium text-brand-purple-dark">{otherUserName || `Usuário ${otherUserId}`}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-gray-500 text-sm">Nenhuma conversa ainda.</div>
            )}
        </div>
    );

    if (!usuario) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Cabeçalho do Perfil */}
            <div className="flex items-start gap-8 mb-8">
                {/* Foto de Perfil */}
                <div className="relative">
                    <img
                        src={usuario.foto_perfil ? `http://localhost:5000/${usuario.foto_perfil}` : '/default-profile.png'}
                        alt={usuario.nome}
                        className="w-48 h-48 rounded-full object-cover border-4 border-brand-purple"
                    />
                    <button
                        onClick={() => setIsEditingPhoto(true)}
                        className="absolute bottom-2 right-2 bg-brand-purple text-white p-2 rounded-full hover:bg-brand-purple-dark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    {isEditingPhoto && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            id="foto-perfil"
                        />
                    )}
                </div>

                {/* Informações do Usuário */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{usuario.nome}</h1>
                    <p className="text-gray-600 mb-4">
                        {usuario.tipo === 'designer' ? 'Designer' :
                            usuario.tipo === 'programador' ? 'Programador(a)' :
                                'Empresário(a)'}
                    </p>

                    {isEditingDesc ? (
                        <div className="mb-4">
                            <textarea
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                rows={3}
                                placeholder="Escreva uma descrição sobre você..."
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleDescriptionUpdate}
                                    className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingDesc(false);
                                        setNewDesc(usuario.descricao || '');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative mb-4">
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {usuario.descricao || 'Nenhuma descrição adicionada.'}
                            </p>
                            <button
                                onClick={() => setIsEditingDesc(true)}
                                className="absolute top-0 right-0 text-brand-purple hover:text-brand-purple-dark"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4">
                        {usuario.github && (
                            <a
                                href={usuario.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0117.548 0c9.301-6.356 13.301-6.356 13.301-6.356 2.67 6.763.973 11.816.486 13.038 3.075 3.422 5.014 7.822 5.014 13.2 0 18.905-11.404 23.142-22.243 24.283a8.992 8.992 0 013.074 6.6c2.831 1.304 9.868 3.422 14.235-4.074 0 0 2.589-4.726 7.523-5.052z" />
                                </svg>
                            </a>
                        )}
                        {/* ...outros links... */}
                    </div>
                </div>
            </div>

            {/* Abas do perfil */}
            <div className="mt-8">
                <div className="flex gap-4 mb-6">
                    <button
                        className={`px-6 py-2 rounded-2xl font-semibold text-base transition-colors duration-200 ${activeTab === 'portfolio' ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('portfolio')}
                    >
                        Portfólio
                    </button>
                    <button
                        className={`px-6 py-2 rounded-2xl font-semibold text-base transition-colors duration-200 ${activeTab === 'salvos' ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('salvos')}
                    >
                        Salvos
                    </button>
                    <button
                        className={`px-6 py-2 rounded-2xl font-semibold text-base transition-colors duration-200 ${activeTab === 'conexoes' ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('conexoes')}
                    >
                        Conexões
                    </button>
                    <button
                        className={`px-6 py-2 rounded-2xl font-semibold text-base transition-colors duration-200 ${activeTab === 'conquistas' ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('conquistas')}
                    >
                        Conquistas
                    </button>
                </div>
                {activeTab === 'portfolio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Renderização dos projetos do usuário */}
                        {projetos.map(projeto => (
                            <div key={projeto.projeto_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/portfolio/${projeto.projeto_id}`)}>
                                <img src={projeto.imagem_capa ? `http://localhost:5000/${projeto.imagem_capa}` : '/default-profile.png'} alt={projeto.titulo} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{projeto.titulo}</h3>
                                    <p className="text-gray-600 line-clamp-2">{projeto.descricao}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'salvos' && (
                    <div className="text-center text-gray-500 py-8">
                        Funcionalidade em desenvolvimento
                    </div>
                )}
                {activeTab === 'conexoes' && (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">{renderMiniChatList()}</div>
                        <div className="flex-1">
                            {/* Removida a div de solicitações de conexão */}
                            {renderNotificacoesRoxas()}
                        </div>
                    </div>
                )}
                {activeTab === 'conquistas' && (
                    <div className="text-center text-gray-500 py-8">
                        Funcionalidade em desenvolvimento
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;