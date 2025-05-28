import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Projeto {
  projeto_id: number;
  titulo: string;
  descricao: string;
  imagem_capa?: string;
  link_figma?: string;
  link_github?: string;
  link_drive?: string;
  userImg?: string;
  user?: string;
  categoria?: string;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;


const PortfolioPage: React.FC = () => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await axios.get('/projetos');
        setProjetos(response.data);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projetos.map((projeto) => (
          <Link to={`/portfolio/${projeto.projeto_id}`} key={projeto.projeto_id} className="block bg-white rounded-2xl shadow-card overflow-hidden group transform transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
              <img src={`http://localhost:5000/${projeto.imagem_capa}`} alt={projeto.titulo} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <div className="flex items-center mb-1">
                  <img src={projeto.userImg} alt={projeto.user} className="w-6 h-6 rounded-full mr-2 border-2 border-white object-cover" />
                  <span className="text-xs text-white font-medium">{projeto.user}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-brand-purple-dark text-lg truncate group-hover:text-brand-purple">{projeto.titulo}</h3>
              <p className="text-sm text-brand-text-secondary">{projeto.categoria}</p>
            </div>
          </Link>
        ))}
      </div>
      {/* Pagination can be added here */}
    </div>
  );
};

export default PortfolioPage;
