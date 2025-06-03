import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Vaga {
  vaga_id: number;
  titulo: string;
  empresa: string;
  logo_empresa?: string;
  descricao: string;
  tipo_trabalho: string;
  prazo: string;
  requisitos: string[];
  usuario_id: number;
  usuario_nome?: string;
  usuario_foto?: string;
  formato_trabalho?: string;
}

const VagasPage: React.FC = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await axios.get('/vagas');
        setVagas(response.data);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };

    fetchVagas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="bg-brand-purple p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Vagas & Briefings</h1>
          <p className="text-white opacity-90">
            Encontre oportunidades para trabalhar em projetos incríveis ou publique suas próprias vagas.
          </p>
        </div>
      </div>

      {/* Barra de Busca e Botão */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="search"
              placeholder="Buscar vagas..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <Link
            to="/vagas/criar"
            className="flex items-center gap-2 bg-brand-purple text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Publicar Vaga
          </Link>
        </div>
      </div>

      {/* Grid de Vagas */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vagas.map((vaga) => (
            <Link key={vaga.vaga_id} to={`/vagas/${vaga.vaga_id}`}>
              <div className="group relative">
                {/* Borda roxa superior arredondada */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-brand-purple rounded-t-xl z-10"></div>

                {/* Corpo da pasta */}
                <div className="bg-black pt-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {vaga.logo_empresa ? (
                        <img
                          src={`http://localhost:5000/${vaga.logo_empresa}`}
                          alt={vaga.empresa}
                          className="w-12 h-12 rounded-full object-contain bg-white p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-600">
                            {vaga.empresa.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-bold line-clamp-2">{vaga.titulo}</h3>
                        <p className="text-gray-400 text-sm">{vaga.empresa}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-brand-purple text-white text-xs px-3 py-1 rounded-full">
                        {vaga.tipo_trabalho}
                      </span>
                      <span className="bg-brand-purple text-white text-xs px-3 py-1 rounded-full">
                        {vaga.prazo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VagasPage;
