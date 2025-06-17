import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ConnectionRequestModal from '../components/ConnectionRequestModal';

interface Usuario {
    usuario_id: number;
    nome: string;
    foto_perfil?: string;
    tipo?: 'designer' | 'programador';
    is_owner?: boolean;
}

interface Projeto {
    projeto_id: number;
    titulo: string;
    descricao: string;
    imagem_capa?: string;
    imagens?: string[];
    link_figma?: string;
    link_github?: string;
    link_drive?: string;
    categoria?: string;
    usuario_id?: number;
    usuario_nome?: string;
    usuario_foto?: string;
    tipo?: 'designer' | 'programador';
}

interface Comentario {
    comentario_id: number;
    projeto_id: number;
    usuario_id: number;
    texto: string;
    data_criacao: string;
    usuario_nome: string;
    usuario_foto: string;
}

const normalizeUserImage = (foto_perfil?: string) => {
    if (!foto_perfil) return '/default-profile.png';
    if (foto_perfil.startsWith('uploads/')) {
        return `http://localhost:5000/${foto_perfil}`;
    }
    if (foto_perfil.startsWith('http')) {
        return foto_perfil;
    }
    return `/default-profile.png`;
};

const PortfolioProjectPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [projeto, setProjeto] = useState<Projeto | null>(null);
    const [projetoOwner, setProjetoOwner] = useState<Usuario | null>(null);
    const [colaboradores, setColaboradores] = useState<Usuario[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [likes, setLikes] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
    const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
    // Adicionando estado para verificar se o usuário é colaborador ou dono
    const [isCollaborator, setIsCollaborator] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const scrollToComments = () => {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleUploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('imagens', file);
            });

            await axios.post(`/projetos/${projectId}/imagens`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Recarregar o projeto para mostrar as novas imagens
            const response = await axios.get('/projetos');
            const projetoAtualizado = response.data.find((p: any) => p.projeto_id.toString() === projectId);
            if (projetoAtualizado) {
                setProjeto(prevProjeto => ({
                    ...prevProjeto!,
                    imagens: projetoAtualizado.imagens
                }));
            }

            // Limpar o input de arquivo
            event.target.value = '';
        } catch (error) {
            console.error('Erro ao fazer upload das imagens:', error);
            alert('Erro ao fazer upload das imagens. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    }; useEffect(() => {
        const fetchProjeto = async () => {
            try {
                // Primeiro, busca os dados do projeto
                const response = await axios.get('/projetos');
                console.log('Resposta completa:', response.data);

                // Encontra o projeto específico pelo ID
                const projetoData = response.data.find((p: any) => p.projeto_id.toString() === projectId);
                console.log('Projeto encontrado:', projetoData);

                if (projetoData && projetoData.usuario_id) {
                    try {
                        // Busca o usuário pelo ID
                        console.log('Buscando usuário ID:', projetoData.usuario_id);
                        const usuarioRes = await axios.get(`/usuarios/${projetoData.usuario_id}`);
                        const usuario = usuarioRes.data;
                        console.log('Dados do usuário:', usuario);

                        setProjeto({
                            ...projetoData,
                            usuario_nome: usuario?.nome || 'Usuário',
                            usuario_foto: normalizeUserImage(usuario?.foto_perfil),
                        });

                        // Armazena os dados completos do dono do projeto
                        setProjetoOwner(usuario);
                    } catch (error) {
                        console.error('Erro ao buscar usuário:', error);
                        setProjeto({
                            ...projetoData,
                            usuario_nome: 'Usuário',
                            usuario_foto: '/default-profile.png',
                        });
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar projeto:', error);
            }
        };

        if (projectId) {
            fetchProjeto();
        }
    }, [projectId]);

    const userId = JSON.parse(localStorage.getItem('user') || '{}').usuario_id || 0;

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(`/curtidas/${projectId}`);
                console.log('Resposta das curtidas:', response.data);
                setLikes(response.data.length);
                // Verifica se o usuário atual já curtiu
                const userLiked = response.data.some((like: any) => like.usuario_id === Number(userId));
                console.log('Usuário curtiu?', userLiked, 'userId:', userId);
                setHasLiked(userLiked);
            } catch (error) {
                console.error('Erro ao buscar curtidas:', error);
            }
        };

        if (projectId) {
            fetchLikes();
        }
    }, [projectId, userId]);

    const handleLikeToggle = async () => {
        console.log('Botão de curtida clicado');
        console.log('Estado atual - hasLiked:', hasLiked, 'userId:', userId);

        if (!userId) {
            alert('Você precisa estar logado para curtir um projeto!');
            navigate('/login');
            return;
        }

        try {
            if (hasLiked) {
                console.log('Tentando remover curtida');
                // Remove like
                const response = await axios.get(`/curtidas/${projectId}`);
                const curtida = response.data.find((like: any) => like.usuario_id === Number(userId));
                if (curtida) {
                    await axios.delete(`/curtidas/${curtida.curtida_id}`);
                    setLikes(prev => prev - 1);
                    setHasLiked(false);
                }
            } else {
                console.log('Tentando adicionar curtida');
                // Add like
                await axios.post('/curtidas', {
                    usuario_id: Number(userId),
                    projeto_id: Number(projectId)
                });
                setLikes(prev => prev + 1);
                setHasLiked(true);
            }
        } catch (error: any) {
            console.error('Erro ao interagir com curtida:', error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Erro ao processar sua curtida. Tente novamente.');
            }
        }
    };

    // Função para carregar comentários
    const carregarComentarios = async () => {
        if (!projectId) return;

        try {
            const response = await axios.get(`/comentarios/${projectId}`);
            setComentarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
    };

    // Carregar comentários quando o componente montar
    useEffect(() => {
        if (projectId) {
            carregarComentarios();
        }
    }, [projectId]);

    useEffect(() => {
        if (location.state && location.state.comentarioId) {
            setTimeout(() => {
                const el = document.getElementById(`comentario-${location.state.comentarioId}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('bg-yellow-100');
                    setTimeout(() => el.classList.remove('bg-yellow-100'), 2000);
                }
            }, 300);
        } else if (location.state && location.state.scrollToComments) {
            const el = document.getElementById('comments-section');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location, comentarios]);

    // Fetch all users when the modal is opened
    useEffect(() => {
        if (isOwnerModalOpen) {
            // Fetch all users when the modal is opened
            axios.get('http://localhost:5000/usuarios')
                .then(response => {
                    console.log('Dados recebidos:', response.data);
                    if (Array.isArray(response.data)) {
                        // Removido: setUsers(response.data.map((user: any) => { ... }));
                    } else {
                        console.error('Formato de dados inesperado:', response.data);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar usuários:', error);
                    console.error('Detalhes do erro:', error.response?.data || 'Sem detalhes disponíveis');
                    alert('Erro ao carregar usuários. Por favor, tente novamente.');
                });
        }
    }, [isOwnerModalOpen]);

    // Adicionando lógica para verificar se o usuário é colaborador ou dono
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user') || '{}').usuario_id;
                const response = await axios.get(`/usuario-projeto/${projectId}`);
                const collaborators = response.data;

                console.log('Colaboradores recebidos:', collaborators); // Log para debug

                // Buscar informações detalhadas de cada colaborador, incluindo o dono
                const colaboradoresDetalhados = await Promise.all(
                    collaborators.map(async (collaborator: any) => {
                        try {
                            const userRes = await axios.get(`/usuarios/${collaborator.usuario_id}`);
                            const isOwner = collaborator.usuario_id === projeto?.usuario_id;
                            console.log(`Usuário ${collaborator.usuario_id} - isOwner: ${isOwner}`);
                            return {
                                ...userRes.data,
                                is_owner: isOwner
                            };
                        } catch (error) {
                            console.error(`Erro ao buscar dados do usuário ${collaborator.usuario_id}:`, error);
                            return null;
                        }
                    })
                );

                // Filtrar null e definir os colaboradores
                setColaboradores(colaboradoresDetalhados.filter(Boolean));

                const isUserCollaborator = collaborators.some((collaborator: any) => collaborator.usuario_id === userId);
                setIsCollaborator(isUserCollaborator);
                console.log('Usuário é colaborador?', isUserCollaborator);

                const isUserOwner = projeto?.usuario_id === userId;
                setIsOwner(isUserOwner);
                console.log('Usuário é dono?', isUserOwner);
            } catch (error) {
                console.error('Erro ao verificar papel do usuário:', error);
            }
        };

        if (projectId) {
            checkUserRole();
        }
    }, [projectId, projeto]);

    // Usando isCollaborator e isOwner para determinar permissões
    const canEdit = useMemo(() => {
        return isOwner || isCollaborator;
    }, [isOwner, isCollaborator]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const userId = JSON.parse(localStorage.getItem('user') || '{}').usuario_id;
        if (!userId) {
            alert('Você precisa estar logado para comentar!');
            navigate('/login');
            return;
        }

        setIsSubmittingComment(true);
        try {
            await axios.post('/comentarios', {
                usuario_id: userId,
                projeto_id: Number(projectId),
                texto: newComment.trim()
            });

            // Recarregar comentários
            carregarComentarios();
            // Limpar o campo de comentário
            setNewComment('');
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            alert('Erro ao enviar comentário. Tente novamente.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Efeito para buscar colaboradores
    useEffect(() => {
        const fetchCollaborators = async () => {
            if (!projectId || !projeto?.usuario_id) return;

            try {
                const userId = JSON.parse(localStorage.getItem('user') || '{}').usuario_id;
                const response = await axios.get(`/usuario-projeto/${projectId}`);
                const collaboratorsData = response.data;

                // Buscar informações detalhadas dos usuários
                const detailedUsers = await Promise.all(
                    collaboratorsData.map(async (collab: any) => {
                        try {
                            const userRes = await axios.get(`/usuarios/${collab.usuario_id}`);
                            return {
                                ...userRes.data,
                                is_owner: collab.usuario_id === projeto.usuario_id
                            };
                        } catch (error) {
                            console.error(`Erro ao buscar usuário ${collab.usuario_id}:`, error);
                            return null;
                        }
                    })
                );

                // Filtrar nulos e atualizar estado
                const validUsers = detailedUsers.filter(Boolean);
                setColaboradores(validUsers);

                // Verificar papéis do usuário atual
                const isUserCollab = collaboratorsData.some((c: any) => c.usuario_id === userId);
                const isUserOwner = projeto.usuario_id === userId;

                setIsCollaborator(isUserCollab);
                setIsOwner(isUserOwner);
            } catch (error) {
                console.error('Erro ao buscar colaboradores:', error);
            }
        };

        fetchCollaborators();
    }, [projectId, projeto?.usuario_id]);

    if (!projeto) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">            {/* Cabeçalho do Dono do Projeto */}
            <div className="flex items-center mb-8">
                <img
                    src={projeto.usuario_foto}
                    alt={projeto.usuario_nome}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-brand-purple object-cover cursor-pointer hover:border-brand-purple-dark transition-colors"
                    onClick={() => navigate(`/perfil/${projeto.usuario_id}`)}
                />
                <div>
                    <h1
                        className="text-2xl font-bold cursor-pointer hover:text-brand-purple transition-colors"
                        onClick={() => navigate(`/perfil/${projeto.usuario_id}`)}
                    >
                        {projeto.usuario_nome}
                    </h1>                    <div>
                        <span className="text-sm text-brand-purple">Criador do Projeto</span>
                        <span className="text-sm text-gray-600"> • {projetoOwner?.tipo === 'designer' ? 'Designer' : projetoOwner?.tipo === 'programador' ? 'Programador' : 'Área não especificada'}</span>
                    </div>
                </div>
            </div>            {/* Seção de Colaboradores */}
            {colaboradores.length > 0 && colaboradores.some(c => !c.is_owner) && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Colaboradores do Projeto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {colaboradores
                            .filter(colaborador => !colaborador.is_owner)
                            .map((colaborador) => (
                                <div
                                    key={colaborador.usuario_id}
                                    className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`/perfil/${colaborador.usuario_id}`)}
                                >
                                    <img
                                        src={normalizeUserImage(colaborador.foto_perfil)}
                                        alt={colaborador.nome}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover cursor-pointer hover:border-brand-purple transition-colors"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold cursor-pointer hover:text-brand-purple transition-colors">
                                                {colaborador.nome}
                                            </h3>
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                Colaborador
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {colaborador.tipo === 'designer' ? 'Designer' : colaborador.tipo === 'programador' ? 'Programador' : 'Área não especificada'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Título e Descrição */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{projeto.titulo}</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{projeto.descricao}</p>
            </div>

            {/* Galeria Principal */}
            <div className="flex flex-col gap-6 mb-8 relative">
                {(projeto.imagens || []).filter(Boolean).map((imagem, index) => (
                    imagem && (
                        <div key={index} className="relative aspect-auto group overflow-hidden rounded-lg shadow-md">
                            <img
                                src={`http://localhost:5000/${imagem}`}
                                alt={`${projeto.titulo} - Imagem ${index + 1}`}
                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )
                ))}
                {projeto.imagens && projeto.imagens.length > 0 && (
                    <div className="absolute top-0 left-full ml-4 flex flex-col gap-2">
                        {/* Botão de Curtida */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={handleLikeToggle}
                                className={`bg-white p-2 rounded-full shadow hover:bg-gray-200 flex items-center justify-center transform transition-all duration-200 ${hasLiked ? 'scale-110' : 'scale-100'}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={`w-6 h-6 transition-colors duration-200 ${hasLiked ? 'text-red-500' : 'text-gray-400'}`}
                                    fill={hasLiked ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth={hasLiked ? "0" : "2"}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                            <span className={`text-center text-sm font-medium ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}>
                                {likes || 0}
                            </span>
                        </div>

                        {/* Botão de Comentários */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={scrollToComments}
                                className="bg-white p-2 rounded-full shadow hover:bg-gray-200 flex items-center justify-center transform transition-all duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </button>
                            <span className="text-center text-sm font-medium text-blue-500">
                                {comentarios.length}
                            </span>
                        </div>
                        {/* Botão de Conectar - Mostrar apenas se não for dono nem colaborador */}
                        {projeto && projeto.usuario_id !== userId && !isCollaborator && !isOwner && (
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    className="bg-white p-2 rounded-full shadow hover:bg-gray-200 flex items-center justify-center transform transition-all duration-200"
                                    title="Conectar"
                                    onClick={() => setIsConnectionModalOpen(true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                    </svg>
                                </button>
                                <span className="text-center text-sm font-medium text-green-500">
                                    Conectar
                                </span>
                            </div>
                        )}

                        {/* Botão de Adicionar Dono - apenas para o dono */}
                        {isOwner && (
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    className="bg-white p-2 rounded-full shadow hover:bg-gray-200 flex items-center justify-center transform transition-all duration-200"
                                    title="Adicionar Colaborador"
                                    onClick={() => setIsOwnerModalOpen(true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6 text-purple-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M19 8v6" />
                                        <path d="M16 11h6" />
                                    </svg>
                                </button>
                                <span className="text-center text-sm font-medium text-purple-500">
                                    Adicionar Colaborador
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Barra de Ações */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Todas as Imagens</h2>
                    {/* Like Button with Heart Icon */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLikeToggle}
                            className={`bg-white p-2 rounded-full shadow hover:bg-gray-200 flex items-center justify-center transform transition-all duration-200 ${hasLiked ? 'scale-110' : 'scale-100'}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className={`w-6 h-6 transition-colors duration-200 ${hasLiked ? 'text-red-500' : 'text-gray-400'}`}
                                fill={hasLiked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth={hasLiked ? "0" : "2"}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                        <span className={`text-sm font-medium ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}>
                            {likes || 0}
                        </span>
                    </div>
                </div>

                {/* Botões de edição - para donos e colaboradores */}
                {canEdit && (
                    <div className="flex gap-2">
                        <label
                            htmlFor="adicionar-imagens"
                            className={`px-4 py-2 ${isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors cursor-pointer flex items-center gap-2`}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Adicionar Imagens
                                </>
                            )}
                        </label>
                        <input
                            id="adicionar-imagens"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadImages}
                            disabled={isUploading}
                        />
                        <button
                            onClick={() => navigate(`/editar-projeto/${projectId}`)}
                            className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark transition-colors"
                        >
                            Editar Projeto
                        </button>
                    </div>
                )}
            </div>

            {/* Grade de Imagens */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {(projeto.imagens || [projeto.imagem_capa]).filter(Boolean).map((imagem, index) => (
                    imagem && (
                        <div key={index} className="relative aspect-[4/3] group overflow-hidden rounded-lg shadow-md">
                            <img
                                src={`http://localhost:5000/${imagem}`}
                                alt={`${projeto.titulo} - Imagem ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )
                ))}
            </div>

            {/* Links do Projeto */}
            <div className="flex flex-wrap gap-4 mb-8">
                {projeto.link_figma && (
                    <a
                        href={projeto.link_figma}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE" />
                            <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83" />
                            <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262" />
                            <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#F24E1E" />
                            <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF" />
                        </svg>
                        Ver no Figma
                    </a>
                )}
                {projeto.link_github && (
                    <a
                        href={projeto.link_github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.970 46.970 0 0117.548 0c9.301-6.356 13.301-5.052 13.301-5.052 2.67 6.763.973 11.816.478 13.038 3.075 3.422 5.014 7.822 5.014 13.2 0 18.905-11.404 23.138-22.243 24.283z" fill="#181717" /><path d="M49.204 24.633c-1.568 0-3.034.057-4.493.173-1.459.115-2.883.307-4.267.573-1.384.266-2.748.617-4.086 1.051-1.337.434-2.617.956-3.866 1.573-1.25.617-2.469 1.309-3.634 2.086-.165.127-.327.258-.487.392-.16.134-.318.267-.482.398-.163.131-.327.261-.493.386-.165.126-.33.253-.497.373-.164.12-.328.239-.494.353-.165.115-.33.229-.497.337-.165.107-.33.213-.497.317-.165.104-.33.207-.497.308-.165.101-.33.2-.497.297-.165.097-.33.191-.497.283-.165.092-.33.182-.497.267-.165.085-.33.173-.497.253-.165.08-.33.162-.497.238-.165.075-.33.148-.497.218-.165.07-.33.139-.497.204-.165.065-.33.131-.497.192-.165.061-.33.122-.497.178-.165.057-.33.113-.497.165-.165.053-.33.107-.497.156-.165.048-.33.095-.497.139-.165.043-.33.086-.497.126-.165.04-.33.079-.497.115-.165.036-.33.072-.497.104-.165.032-.33.064-.497.092-.165.028-.33.057-.497.082-.165.025-.33.051-.497.073-.165.022-.33.045-.497.065-.165.019-.33.038-.497.055-.165.017-.33.034-.497.05-.165.015-.33.03-.497.043-.165.013-.33.027-.497.038-.165.011-.33.022-.497.032-.165.01-.33.019-.497.027-.165.008-.33.015-.497.021-.165.006-.33.012-.497.017-.165.005-.33.01-.497.014-.165.004-.33.008-.497.011-.165.003-.33.007-.497.01-.165.003-.33.006-.497.009-.165.002-.33.005-.497.007-.165.002-.33.004-.497.006-.165.002-.33.004-.497.005-.165.001-.33.003-.497.004-.165.001-.33.002-.497.003-.165.001-.33.002-.497.002-.165.001-.33.001-.497.001z" fill="#F24E1E" /></svg>
                        Ver no GitHub
                    </a>
                )}
            </div>

            {/* Seção de Comentários */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Comentários</h2>

                {/* Formulário de Comentário */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex gap-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva seu comentário..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent resize-none"
                            rows={3}
                        />
                        <button
                            type="submit"
                            disabled={isSubmittingComment || !newComment.trim()}
                            className={`px-6 py-2 h-fit rounded-lg text-white transition-colors ${isSubmittingComment || !newComment.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-brand-purple hover:bg-brand-purple-dark'
                                }`}
                        >
                            {isSubmittingComment ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </div>
                            ) : (
                                'Comentar'
                            )}
                        </button>
                    </div>
                </form>

                {/* Lista de Comentários */}
                <div id="comments-section" className="flex flex-col gap-4">                    {comentarios.length === 0 ? (
                    <p className="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                ) : (
                    comentarios.map(comentario => (
                        <div
                            key={comentario.comentario_id}
                            id={`comentario-${comentario.comentario_id}`}
                            className="p-4 bg-white rounded-lg shadow-md flex gap-4"
                        >
                            <img
                                src={normalizeUserImage(comentario.usuario_foto)}
                                alt={comentario.usuario_nome}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-md font-semibold">{comentario.usuario_nome}</h3>
                                    <span className="text-sm text-gray-500">{new Date(comentario.data_criacao).toLocaleString('pt-BR')}</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{comentario.texto}</p>
                            </div>
                        </div>
                    ))
                )}
                </div>
            </div>            {/* Modal para Solicitação de Conexão */}
            <ConnectionRequestModal
                isOpen={isConnectionModalOpen}
                onClose={() => setIsConnectionModalOpen(false)}
                recipientName={projeto?.usuario_nome || 'Usuário'}
                recipientId={projeto?.usuario_id || 0}
                onSend={async (data) => {
                    try {
                        await axios.post('/conexoes', data);
                        setIsConnectionModalOpen(false);
                        alert('Solicitação enviada com sucesso!');
                    } catch (error) {
                        console.error('Erro ao enviar solicitação:', error);
                        alert('Erro ao enviar solicitação. Tente novamente.');
                    }
                }}
            />
        </div>
    );
};

export default PortfolioProjectPage;
