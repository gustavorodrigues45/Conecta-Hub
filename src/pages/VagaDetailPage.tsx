import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

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
  formato_trabalho: string;
  duracao_projeto: string;
  remuneracao: string;
  diferenciais: string[];
}

const VagaDetailPage: React.FC = () => {
  const { vagaId } = useParams<{ vagaId: string }>();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [showConexaoForm, setShowConexaoForm] = useState(false);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    mensagem: '',
    link_portfolio: '',
    tipo_conexao: 'freelancer'
  });

  useEffect(() => {
    const fetchVaga = async () => {
      try {
        const response = await axios.get(`/vagas/${vagaId}`);
        setVaga(response.data);
      } catch (error) {
        console.error('Erro ao buscar vaga:', error);
      }
    };

    if (vagaId) {
      fetchVaga();
    }
  }, [vagaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.usuario_id) {
      alert('Você precisa estar logado para se conectar a uma vaga!');
      return;
    }

    try {
      await axios.post(`/conexoes/vagas/${vagaId}`, {
        ...formData,
        usuario_id: user.usuario_id
      });
      alert('Conexão enviada com sucesso!');
      setShowConexaoForm(false);
    } catch (error: any) {
      console.error('Erro ao enviar conexão:', error);
      alert(error.response?.data?.error || 'Erro ao enviar conexão');
    }
  };

  if (!vaga) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Card da Vaga */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-black rounded-xl overflow-hidden relative">
          {/* Borda roxa superior */}
          <div className="h-2 w-full bg-brand-purple absolute top-0"></div>

          <div className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden p-2">
              {vaga.logo_empresa ? (
                <img
                  src={`http://localhost:5000/${vaga.logo_empresa}`}
                  alt={vaga.empresa}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-xl text-gray-600">
                    {vaga.empresa.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{vaga.titulo}</h1>
              <p className="text-gray-300">{vaga.descricao}</p>
              <p className="text-yellow-400 mt-2">Projeto freela, com prazo de {vaga.prazo}. {vaga.formato_trabalho}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowConexaoForm(true)}
            className="bg-yellow-400 text-brand-purple font-bold py-3 px-12 rounded-2xl mt-4 hover:bg-yellow-500 transition-colors"
          >
            Me Conectar!
          </button>
        </div>
      </div>

      {/* Detalhes da Vaga - Estilo Papel/PDF */}
      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200 relative my-8">
        {/* Língua roxa no canto */}
        <div className="absolute top-0 right-0">
          <div className="w-16 h-16">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-purple" style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
              transform: 'rotate(0deg)'
            }}></div>
            <div className="absolute top-0 right-0 w-16 h-16" style={{
              background: 'linear-gradient(-45deg, white 50%, transparent 50%)'
            }}></div>
          </div>
        </div>

        <div className="p-8">
          {/* Cabeçalho */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-black flex items-center justify-center overflow-hidden p-2">
              {vaga.logo_empresa ? (
                <img
                  src={`http://localhost:5000/${vaga.logo_empresa}`}
                  alt={vaga.empresa}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-2xl text-gray-600">
                    {vaga.empresa.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">{vaga.titulo}</h1>
              <p className="text-gray-600">Vaga Freela em Equipe</p>
              <p className="text-gray-600">Prazo de {vaga.prazo}</p>
              <p className="text-gray-600">{vaga.formato_trabalho}</p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-4">
            {vaga.descricao && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Descrição Geral</h2>
                <p className="text-gray-600">{vaga.descricao}</p>
              </section>
            )}

            {vaga.formato_trabalho && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Formato de Trabalho</h2>
                <p className="text-gray-600">{vaga.formato_trabalho}</p>
              </section>
            )}

            {vaga.duracao_projeto && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Duração do Projeto</h2>
                <p className="text-gray-600">{vaga.duracao_projeto}</p>
              </section>
            )}

            {vaga.remuneracao && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Remuneração</h2>
                <p className="text-gray-600">{vaga.remuneracao}</p>
              </section>
            )}

            {vaga.diferenciais && (vaga.diferenciais.length > 0 || (typeof vaga.diferenciais === 'string' && JSON.parse(vaga.diferenciais).length > 0)) && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Diferenciais</h2>
                <ul className="space-y-1">
                  {typeof vaga.diferenciais === 'string' ? (
                    JSON.parse(vaga.diferenciais).map((diferencial: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-brand-purple" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {diferencial}
                      </li>
                    ))
                  ) : Array.isArray(vaga.diferenciais) ? (
                    vaga.diferenciais.map((diferencial: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-brand-purple" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {diferencial}
                      </li>
                    ))
                  ) : null}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Conexão */}
      {showConexaoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Conectar-se à Vaga</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Link do Portfólio
                </label>
                <input
                  type="url"
                  value={formData.link_portfolio}
                  onChange={(e) => setFormData({ ...formData, link_portfolio: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Tipo de Conexão
                </label>
                <select
                  value={formData.tipo_conexao}
                  onChange={(e) => setFormData({ ...formData, tipo_conexao: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="parceria">Parceria</option>
                  <option value="voluntario">Voluntário</option>
                </select>
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowConexaoForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VagaDetailPage;
