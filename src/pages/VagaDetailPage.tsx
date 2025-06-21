import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { LeafIcon } from '../components/icons/LeafIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { CornerAccentIcon } from '../components/icons/CornerAccentIcon';

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

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <section className={`mb-6 ${className || ''}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>{title}</h2>
    <div className="text-gray-700 space-y-2 leading-relaxed">
      {children}
    </div>
  </section>
);

const VagaDetailPage: React.FC = () => {
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { vagaId } = useParams<{ vagaId: string }>();

  useEffect(() => {
    const fetchVaga = async () => {
      try {
        if (!vagaId) {
          setError('ID da vaga não fornecido');
          setLoading(false);
          return;
        }

        const response = await axios.get(`/vagas/${vagaId}`);
        setVaga(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar vaga:', error);
        setError('Erro ao carregar a vaga. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchVaga();
  }, [vagaId]);

  useEffect(() => {
    // Adiciona a fonte Roboto do Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Limpa o link quando o componente for desmontado
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  if (error || !vaga) {
    return <div className="text-center py-10 text-red-600">{error || 'Vaga não encontrada'}</div>;
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Card Superior */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-black rounded-xl overflow-hidden relative">
          {/* Borda roxa superior */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-brand-purple"></div>

          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden p-2">
                {vaga.logo_empresa ? (
                  <img
                    src={`http://localhost:5000/${vaga.logo_empresa}`}
                    alt={`Logo da ${vaga.empresa}`}
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-full">
                    <LeafIcon className="w-8 h-8 text-brand-purple" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>{vaga.titulo}</h1>
                <p className="text-gray-400 mb-2" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{vaga.descricao}</p>
                <p className="text-yellow-400" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                  Projeto freela, com prazo de {vaga.duracao_projeto}. {vaga.formato_trabalho}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Botão Me Conectar */}
        <div className="flex justify-center mt-4">
          <button className="bg-yellow-400 text-brand-purple font-bold py-3 px-12 rounded-2xl hover:bg-yellow-500 transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>
            Me Conectar!
          </button>
        </div>
      </div>

      {/* Card Principal com Detalhes */}
      <div className="relative max-w-3xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-black" style={{ backgroundColor: '#FFFAF0' }}>
        <CornerAccentIcon className="absolute top-0 right-0 w-24 h-24 text-brand-purple" />

        <div className="p-8 md:p-12">
          <header className="mb-10 flex flex-col items-start">
            <div className="flex items-center mb-6">
              <div className="bg-white border-2 border-gray-200 rounded-full p-1 mr-4 shadow-md">
                {vaga.logo_empresa ? (
                  <img
                    src={`http://localhost:5000/${vaga.logo_empresa}`}
                    alt={`Logo da ${vaga.empresa}`}
                    className="w-20 h-20 rounded-full object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                    <LeafIcon className="w-8 h-8 text-brand-purple" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>{vaga.titulo}</h1>
                <p className="text-lg text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>Vaga {vaga.tipo_trabalho} em Equipe</p>
                <p className="text-md text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>Prazo de {vaga.duracao_projeto}</p>
                <p className="text-md text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{vaga.formato_trabalho}</p>
              </div>
            </div>
          </header>

          <Section title="Descrição Geral">
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{vaga.descricao}</p>
          </Section>

          {vaga.formato_trabalho && (
            <Section title="Formato de Trabalho">
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{vaga.formato_trabalho}</p>
            </Section>
          )}

          {vaga.duracao_projeto && (
            <Section title="Duração do Projeto">
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{vaga.duracao_projeto}</p>
            </Section>
          )}

          {vaga.remuneracao && (
            <Section title="Remuneração">
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>R$ {vaga.remuneracao}</p>
            </Section>
          )}

          {vaga.diferenciais && vaga.diferenciais.length > 0 && (
            <Section title="Diferenciais">
              <ul className="space-y-2">
                {vaga.diferenciais.map((diferencial, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-brand-purple mr-2 flex-shrink-0" />
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{diferencial}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Como se Candidatar" className="pb-0">
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
              Cadastre-se pela plataforma e envie seu portfólio ou GitHub + uma breve
              apresentação pessoal.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default VagaDetailPage;
