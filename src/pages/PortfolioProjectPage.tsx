import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
    const [isUploading, setIsUploading] = useState(false);
    const [outrosProjetos, setOutrosProjetos] = useState<Projeto[]>([]);
    const [likes, setLikes] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [novoComentario, setNovoComentario] = useState('');
    const [isLoadingComentarios, setIsLoadingComentarios] = useState(false);

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
    };

    useEffect(() => {
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

    useEffect(() => {
        const fetchOutrosProjetos = async () => {
            try {
                const response = await axios.get('/projetos');
                const projetosAleatorios = response.data
                    .filter((p: Projeto) => p.projeto_id !== projeto?.projeto_id) // Exclude the current project
                    .sort(() => 0.5 - Math.random()) // Shuffle the array
                    .slice(0, 2); // Take the first 2 projects
                setOutrosProjetos(projetosAleatorios);
            } catch (error) {
                console.error('Erro ao buscar outros projetos:', error);
            }
        };

        if (projeto) {
            fetchOutrosProjetos();
        }
    }, [projeto]);

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

        setIsLoadingComentarios(true);
        try {
            const response = await axios.get(`/comentarios/${projectId}`);
            setComentarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        } finally {
            setIsLoadingComentarios(false);
        }
    };

    // Carregar comentários quando o componente montar
    useEffect(() => {
        if (projectId) {
            carregarComentarios();
        }
    }, [projectId]);

    // Função para adicionar novo comentário
    const handleAddComentario = async () => {
        if (!novoComentario.trim() || !userId) {
            if (!userId) {
                alert('Você precisa estar logado para comentar!');
                navigate('/login');
            }
            return;
        }

        try {
            const response = await axios.post('/comentarios', {
                projeto_id: Number(projectId),
                usuario_id: Number(userId),
                texto: novoComentario.trim()
            });

            setComentarios(prev => [response.data, ...prev]);
            setNovoComentario('');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            alert('Erro ao adicionar comentário. Tente novamente.');
        }
    };

    // Função para excluir comentário
    const handleDeleteComentario = async (comentarioId: number) => {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

        try {
            await axios.delete(`/comentarios/${comentarioId}`);
            setComentarios(prev => prev.filter(c => c.comentario_id !== comentarioId));
        } catch (error) {
            console.error('Erro ao excluir comentário:', error);
            alert('Erro ao excluir comentário. Tente novamente.');
        }
    };

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

    if (!projeto) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Cabeçalho do usuário */}
            <div className="flex items-center mb-8">
                <img
                    src={projeto.usuario_foto}
                    alt={projeto.usuario_nome}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300 object-cover cursor-pointer hover:border-brand-purple transition-colors"
                    onClick={() => navigate(`/perfil/${projeto.usuario_id}`)}
                />
                <div>
                    <h1
                        className="text-2xl font-bold cursor-pointer hover:text-brand-purple transition-colors"
                        onClick={() => navigate(`/perfil/${projeto.usuario_id}`)}
                    >
                        {projeto.usuario_nome}
                    </h1>
                    <p className="text-sm text-gray-600">Estudante de Design Gráfico</p>
                </div>
            </div>

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

                {/* Só mostrar os botões se o usuário for o dono do projeto */}
                {projeto.usuario_id === userId && (
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
                            onClick={() => navigate(`/portfolio/${projectId}/edit`)}
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
                        <svg className="w-5 h-5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f" /></svg>
                        Ver no GitHub
                    </a>
                )}
            </div>

            {/* Outros projetos */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Acesse também outros projetos:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {outrosProjetos.map((projeto) => (
                        <a
                            key={projeto.projeto_id}
                            href={`/portfolio/${projeto.projeto_id}`}
                            className="block bg-purple-600 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
                        >
                            {/* Horizontal Image */}
                            <div className="w-full">
                                <img
                                    src={`http://localhost:5000/${projeto.imagem_capa || projeto.imagens?.[0]}`}
                                    alt={projeto.titulo}
                                    className="w-full h-32 object-cover"
                                />
                            </div>
                            {/* Content Below Image */}
                            <div className="flex">
                                {/* Left Section: User Details */}
                                <div className="w-1/3 flex flex-col items-center justify-center p-2">
                                    <img
                                        src={projeto.usuario_foto || '/default-profile.png'}
                                        alt={projeto.usuario_nome}
                                        className="w-8 h-8 rounded-full mb-2 object-cover border border-gray-300"
                                    />
                                    <p className="text-xs font-medium text-white text-center">{projeto.usuario_nome || 'Usuário'}</p>
                                </div>
                                {/* Divider */}
                                <div className="w-px bg-white"></div>
                                {/* Right Section: Project Details */}
                                <div className="w-2/3 p-2 text-white">
                                    <h3 className="text-sm font-semibold mb-1">{projeto.titulo}</h3>
                                    <p className="text-xs">{projeto.categoria || 'Sem categoria'}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Seção de Comentários */}
            <div id="comments-section" className="mt-16">
                <h2 className="text-2xl font-semibold mb-8">Comentários ({comentarios.length})</h2>

                {/* Área para adicionar comentário */}
                <div className="mb-8">
                    <div className="flex items-start gap-4">
                        <img
                            src={JSON.parse(localStorage.getItem('user') || '{}').foto_perfil || '/default-profile.png'}
                            alt="Seu perfil"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <textarea
                                placeholder="Adicione um comentário..."
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleAddComentario}
                                    disabled={!novoComentario.trim()}
                                    className={`px-4 py-2 bg-brand-purple text-white rounded-lg transition-colors ${!novoComentario.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-purple-dark'
                                        }`}
                                >
                                    Comentar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de comentários */}
                <div className="space-y-6">
                    {isLoadingComentarios ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
                        </div>
                    ) : comentarios.length > 0 ? (
                        comentarios.map(comentario => (
                            <div key={comentario.comentario_id} id={`comentario-${comentario.comentario_id}`} className="flex gap-4">
                                <img
                                    src={normalizeUserImage(comentario.usuario_foto)}
                                    alt={comentario.usuario_nome}
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer hover:border-2 hover:border-brand-purple transition-all"
                                    onClick={() => navigate(`/perfil/${comentario.usuario_id}`)}
                                />
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3
                                                    className="font-semibold cursor-pointer hover:text-brand-purple transition-colors"
                                                    onClick={() => navigate(`/perfil/${comentario.usuario_id}`)}
                                                >
                                                    {comentario.usuario_nome}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(comentario.data_criacao).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            {Number(userId) === comentario.usuario_id && (
                                                <button
                                                    onClick={() => handleDeleteComentario(comentario.comentario_id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{comentario.texto}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioProjectPage;
