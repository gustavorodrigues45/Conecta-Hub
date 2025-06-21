import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Participante {
  usuario_id: number;
  nome: string;
  foto_perfil: string | null;
  papel: string;
}

interface Projeto {
  projeto_id: number;
  titulo: string;
  descricao: string;
  imagem_capa?: string;
  imagens?: string[];  // Array para múltiplas imagens do projeto
  link_figma?: string;
  link_github?: string;
  link_drive?: string;
  categoria?: string;
  usuario_id?: number;
  usuario_nome?: string;
  usuario_foto?: string;
  participantes?: Participante[];
}

// Componente de ícone de busca
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Componente de ícone de adicionar
const PlusIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

// Função para normalizar imagem do usuário
const normalizeUserImage = (fotoPerfil: string | null): string => {
  if (!fotoPerfil) return '/default-profile.png';
  return fotoPerfil.startsWith('http') ? fotoPerfil : `http://localhost:5000/${fotoPerfil}`;
};

const PortfolioPage: React.FC = () => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjetos, setFilteredProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/projetos');
        const projetosComParticipantes = await Promise.all(
          response.data.map(async (projeto: any) => {
            let participantes: Participante[] = [];
            try {
              const partRes = await axios.get(`/projetos/${projeto.projeto_id}/participantes`);
              participantes = partRes.data.map((p: any) => ({
                usuario_id: p.usuario_id,
                nome: p.nome,
                foto_perfil: p.foto_perfil ? (p.foto_perfil.startsWith('http') ? p.foto_perfil : `http://localhost:5000/${p.foto_perfil}`) : '/default-profile.png',
                papel: p.papel,
              }));
            } catch {
              // fallback: show only owner if endpoint fails
              if (projeto.usuario_id && projeto.usuario_nome) {
                participantes = [{
                  usuario_id: projeto.usuario_id,
                  nome: projeto.usuario_nome,
                  foto_perfil: projeto.usuario_foto || '/default-profile.png',
                  papel: 'dono',
                }];
              }
            }
            return {
              ...projeto,
              participantes,
            };
          })
        );
        setProjetos(projetosComParticipantes);
        setFilteredProjetos(projetosComParticipantes);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjetos();
  }, []);

  // Função para buscar projetos no backend
  const handleSearch = async (term: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/projetos/busca?q=${encodeURIComponent(term)}`);

      // Processar os projetos retornados para incluir informações do usuário
      const projetosComUsuario = await Promise.all(
        response.data.map(async (projeto: any) => {
          if (projeto.usuario_id) {
            try {
              const usuarioRes = await axios.get(`/usuarios/${projeto.usuario_id}`);
              const usuario = usuarioRes.data;
              return {
                ...projeto,
                usuario_nome: usuario?.nome || 'Usuário',
                usuario_foto: normalizeUserImage(usuario?.foto_perfil),
              };
            } catch {
              return {
                ...projeto,
                usuario_nome: 'Usuário',
                usuario_foto: '/default-profile.png',
              };
            }
          } else {
            return {
              ...projeto,
              usuario_nome: 'Usuário',
              usuario_foto: '/default-profile.png',
            };
          }
        })
      );

      setFilteredProjetos(projetosComUsuario);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      // Em caso de erro, usa filtro local
      const filtered = projetos.filter(projeto =>
        projeto.titulo.toLowerCase().includes(term.toLowerCase()) ||
        projeto.descricao.toLowerCase().includes(term.toLowerCase()) ||
        (projeto.categoria && projeto.categoria.toLowerCase().includes(term.toLowerCase())) ||
        (projeto.usuario_nome && projeto.usuario_nome.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredProjetos(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com mudanças no input de busca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredProjetos(projetos);
    } else {
      handleSearch(term);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <input
            type="search"
            placeholder="O que você quer espiar? Busque por título, descrição, categoria ou autor..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-purple"></div>
            </div>
          )}
        </div>
        <Link
          to="/portfolio/novo"
          className="flex items-center justify-center bg-brand-purple text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-purple-dark transition-colors duration-200 shadow-md w-full sm:w-auto"
        >
          <PlusIcon /> Novo Projeto
        </Link>
      </div>

      {/* Resultados da busca */}
      {searchTerm && (
        <div className="text-sm text-gray-600">
          {filteredProjetos.length > 0 ? (
            <span>Encontrados {filteredProjetos.length} projeto{filteredProjetos.length !== 1 ? 's' : ''} para "{searchTerm}"</span>
          ) : (
            <span>Nenhum projeto encontrado para "{searchTerm}"</span>
          )}
        </div>
      )}

      {/* Projetos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {searchTerm ? 'Resultados da busca:' : 'Meus Projetos:'}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProjetos.map((projeto) => (
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
                {/* Content Below Image - layout igual ao design */}
                <div className="flex flex-row bg-purple-700 items-center">
                  {/* Esquerda: Participantes (fotos lado a lado, nomes embaixo) */}
                  <div className="flex flex-col items-center justify-center py-3 px-4 w-1/3">
                    <div className="flex flex-row items-center justify-center gap-2 mb-1">
                      {projeto.participantes && projeto.participantes.length > 0 ? (
                        projeto.participantes.map((p) => (
                          <div key={p.usuario_id} className="flex flex-col items-center">
                            <img
                              src={p.foto_perfil || '/default-profile.png'}
                              alt={p.nome}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
                            />
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-white">Sem participantes</span>
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                      {projeto.participantes && projeto.participantes.length > 0 && (
                        projeto.participantes.map((p) => (
                          <span key={p.usuario_id} className="text-xs text-white font-semibold text-center leading-tight max-w-[70px] truncate">
                            {p.nome}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  {/* Linha vertical divisória */}
                  <div className="h-16 w-px bg-white opacity-40 mx-2"></div>
                  {/* Direita: Título e descrição */}
                  <div className="flex flex-col justify-center w-2/3 px-4 py-3">
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{projeto.titulo}</h3>
                    <p className="text-xs text-white font-normal truncate mb-1">{projeto.descricao}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!isLoading && filteredProjetos.length === 0 && !searchTerm && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Nenhum projeto disponível no momento</p>
            <p>Seja o primeiro a publicar um projeto!</p>
          </div>
        )}
      </div>
      {/* Pagination can be added here */}
    </div>
  );
};

export default PortfolioPage;
