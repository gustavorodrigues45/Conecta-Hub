import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

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

const PortfolioPage: React.FC = () => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await axios.get('/projetos');
        const projetosComUsuario = await Promise.all(
          response.data.map(async (projeto: any) => {
            if (projeto.usuario_id) {
              try {
                // Busca o usuário pelo ID diretamente
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
        setProjetos(projetosComUsuario);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };
    fetchProjetos();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <input
            type="search"
            placeholder="O que você quer espiar?"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
        </div>
        <Link
          to="/portfolio/novo"
          className="flex items-center justify-center bg-brand-purple text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-purple-dark transition-colors duration-200 shadow-md w-full sm:w-auto"
        >
          <PlusIcon /> Novo Projeto
        </Link>
      </div>

      {/* Projetos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Meus Projetos:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projetos.map((projeto) => (
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
      {/* Pagination can be added here */}
    </div>
  );
};

export default PortfolioPage;
