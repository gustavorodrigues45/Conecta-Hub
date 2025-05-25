
import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock Data (replace with actual data fetching)
const mockVagasData = {
  'vaga-ecotask-app': {
    id: 'vaga-ecotask-app',
    title: 'Desenvolvimento de App – Vaga Freela em Equipe',
    company: { name: 'EcoTask', logo: '/src/assets/images/ecotask-logo.png', profileLink: '/perfil/ecotask-org' },
    prazo: '3 meses',
    trabalhoRemoto: true,
    descricaoGeral: 'Estamos formando um time multidisciplinar para criar um aplicativo de produtividade colaborativa voltado para pequenos grupos e equipes. O app permitirá organização de tarefas, comunicação em tempo real e integração com outras ferramentas.',
    perfisBuscados: [
      'Programadores Front-End: experiência com frameworks como React Native ou Flutter.',
      'Programadores Back-End: domínio em Node.js, Firebase ou tecnologias similares.',
      'UI/UX Designers: com domínio de ferramentas como Figma, e interesse em soluções Mobile.',
      'Gerentes de Projeto: com boa comunicação, visão estratégica e organização de times ágeis.',
    ],
    formatoTrabalho: 'Freelance remoto, com reuniões semanais e comunicação por plataformas online.',
    duracaoProjeto: '3 meses (com possibilidade de extensão para manutenção ou novas features).',
    remuneracao: 'Compatível com a entrega de cada função e fase do projeto. Pagamento por etapas ou mensal (a definir com o time).',
    diferenciais: [
      'Experiência anterior em apps colaborativos',
      'Boa comunicação e trabalho em equipe',
      'Interesse em participar de um produto do zero',
    ],
    comoCandidatar: 'Cadastre-se pela plataforma e envie seu portfólio ou GitHub + uma breve apresentação pessoal.',
  },
  // Add more vagas as needed
};


const VagaDetailPage: React.FC = () => {
  const { vagaId } = useParams<{ vagaId: keyof typeof mockVagasData }>();

  if (!vagaId || !mockVagasData[vagaId]) {
    return <div className="text-center py-10">Vaga não encontrada.</div>;
  }
  const vaga = mockVagasData[vagaId];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-card max-w-4xl mx-auto relative">
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden">
        <div className="w-full h-full bg-brand-purple transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <img src={vaga.company.logo} alt={vaga.company.name} className="w-24 h-24 rounded-full object-contain bg-gray-100 p-2" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-purple-dark">{vaga.title}</h1>
            <Link to={vaga.company.profileLink} className="text-brand-purple hover:underline">{vaga.company.name}</Link>
            <div className="mt-1 text-sm text-gray-600">
              <span>Prazo: {vaga.prazo}</span>
              {vaga.trabalhoRemoto && <span className="ml-3"> Trabalho Remoto</span>}
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-brand-text">
          <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Descrição Geral:</h2>
            <p className="leading-relaxed">{vaga.descricaoGeral}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Perfil dos Profissionais Buscados:</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {vaga.perfisBuscados.map((perfil, idx) => <li key={idx}>{perfil}</li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Formato de Trabalho:</h2>
            <p>{vaga.formatoTrabalho}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Duração do Projeto:</h2>
            <p>{vaga.duracaoProjeto}</p>
          </div>

           <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Remuneração:</h2>
            <p>{vaga.remuneracao}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Diferenciais:</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {vaga.diferenciais.map((dif, idx) => <li key={idx}>{dif}</li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Como se candidatar:</h2>
            <p>{vaga.comoCandidatar}</p>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-10 text-center">
          <button className="bg-brand-yellow text-brand-purple-dark font-bold py-3 px-10 rounded-lg text-lg hover:bg-yellow-400 transition-colors shadow-md">
            Me Conectar!
          </button>
        </div>
      </div>
    </div>
  );
};

export default VagaDetailPage;
