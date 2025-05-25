
import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data - replace with actual data source
const mockVagas = [
  { id: '1', title: 'Desenvolvimento de App – Vaga Freela em Equipe', companyLogo: '/src/assets/images/ecotask-logo.png', companyName: 'EcoTask', description: 'Estamos montando um time para desenvolver um app de produtividade colaborativa. Procuramos programadores (front e back), UI/UX designers e gerentes de projeto.', details: 'Projeto freela, com prazo de 3 meses. Trabalho remoto.', type: 'Freela', location: 'Remoto' },
  { id: '2', title: 'Identidade Visual para Marca – Vaga Freela Individual', companyLogo: '/src/assets/images/avatar-rafael.png', companyName: 'Startup X', description: 'Preciso de um(a) designer criativo(a) para desenvolver a identidade visual da minha nova startup. Branding completo, com manual, logo e paleta de cores.', details: 'Projeto freela, com prazo de 40 dias.', type: 'Freela', location: 'Remoto' },
  { id: '3', title: 'Cibersegurança – Vaga Fixa (Ciência da Computação)', companyLogo: '/src/assets/images/ecotask-logo.png', companyName: 'CyberCorp', description: 'Procuramos(a) especialista ou estudante avançado(a) com foco em cibersegurança para atuar no monitoramento de redes de vulnerabilidade em projetos internos.', details: 'Vaga fixa, com possibilidade de bolsa ou contrato.', type: 'Fixa', location: 'Híbrido' },
  { id: '4', title: 'Design para Redes Sociais – Vaga Fixa', companyLogo: '/src/assets/images/avatar-julia.png', companyName: 'Agência Criativa', description: 'Estamos contratando uma equipe de designers para assumir a criação recorrente de peças para redes sociais da minha startup e projetos pessoais.', details: 'Trabalho remoto - Carga semanal fixa com entregas quinzenais.', type: 'Fixa', location: 'Remoto' },
];

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-brand-purple"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25V6.326a2.25 2.25 0 0 1 2.25-2.25H18M21 7.5l-3.75-3.75M17.25 3v4.5h4.5" /></svg>;


const VagasPage: React.FC = () => {
  // Highlight the first vaga or a specific one
  const vagaDestaque = mockVagas[0];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-purple-dark">Oportunidades Abertas</h1>

      {/* Vaga em Destaque - using the style from the first image provided by user */}
      {vagaDestaque && (
        <section className="bg-slate-800 p-8 rounded-2xl shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img src={vagaDestaque.companyLogo} alt={vagaDestaque.companyName} className="w-20 h-20 rounded-full object-cover bg-white p-1" />
            <div>
              <h2 className="text-2xl font-semibold text-brand-yellow mb-2">{vagaDestaque.title}</h2>
              <p className="text-slate-300 mb-3">{vagaDestaque.description}</p>
              <p className="text-sm text-brand-yellow font-medium">{vagaDestaque.details}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Link
              to={`/vagas/${vagaDestaque.id}`}
              className="bg-brand-yellow text-brand-purple-dark font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Me Conectar!
            </Link>
          </div>
        </section>
      )}
      
      {/* Lista de Outras Vagas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockVagas.slice(1).map((vaga) => ( // Slice to exclude the featured one
          <div key={vaga.id} className="bg-white p-6 rounded-xl shadow-card hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-3">
                <img src={vaga.companyLogo} alt={vaga.companyName} className="w-12 h-12 rounded-full object-contain bg-gray-100 p-0.5" />
                <div>
                    <h3 className="text-xl font-semibold text-brand-purple-dark">{vaga.title}</h3>
                    <p className="text-sm text-brand-text-secondary">{vaga.companyName}</p>
                </div>
            </div>
            <p className="text-sm text-brand-text mb-3 line-clamp-3">{vaga.description}</p>
            <div className="flex justify-between items-center text-xs text-brand-text-secondary">
                <span><BriefcaseIcon /> {vaga.type}</span>
                <span>📍 {vaga.location}</span>
            </div>
            <div className="mt-4">
              <Link
                to={`/vagas/${vaga.id}`}
                className="text-brand-purple font-semibold hover:text-brand-purple-dark transition-colors"
              >
                Ver Detalhes &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
       {/* TODO: Add filters for vagas */}
    </div>
  );
};

export default VagasPage;
