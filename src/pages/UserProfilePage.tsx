// src/pages/UserProfilePage.tsx
import React, { useState }  from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock Data (replace with actual data fetching)
const mockUsers = {
  'helena-sato-miller': {
    id: 'helena-sato-miller',
    name: 'Helena Sato Miller',
    username: '@Helena.Miller',
    role: 'Estudante de Design Gráfico',
    avatar: '/src/assets/images/avatar-helena.png', // From mockup
    bio: 'Estudante de Design (3º semestre) com interesse em UX Design. Apaixonada por criar experiências intuitivas e funcionais que conectem pessoas e ideias.',
    connections: ['@julia.gomes', '@manuela.pires'],
    badges: [
        { id: 'b1', name: 'Designer Promissora', icon: '🎨' },
        { id: 'b2', name: 'Colaboradora Ativa', icon: '🤝' }
    ],
    portfolio: [
      { id: 'p1', title: 'Identidade Visual Corporativa', img: '/src/assets/images/project-id-corp.png', likes: 75 },
      { id: 'p2', title: 'Redesign de App Mobile', img: '/src/assets/images/project-app-redesign.png', likes: 120 },
    ],
    saved: [ // Projetos que Helena gostou
      { id: 's1', title: 'Desenvolvimento de Aplicativo', user: 'Maria Lima & João Gomes', userImg: '/src/assets/images/avatar-maria.png', img: '/src/assets/images/project-app-fitness.png', link: '/portfolio/1' },
      { id: 's2', title: 'COURTS - App de Tênis', user: 'Caio Junior', userImg: '/src/assets/images/avatar-caio.png', img: '/src/assets/images/project-courts-app.png', link: '/portfolio/8' },
      { id: 's3', title: 'Projeto de Identidade Visual - GUARA', user: 'Julia Silva', userImg: '/src/assets/images/avatar-julia.png', img: '/src/assets/images/project-id-visual-guara.png', link: '/portfolio/3'},
      { id: 's4', title: 'Campanha de Divulgação de Música Pop', user: 'Nathalia Vales Ficher', userImg: '/src/assets/images/avatar-nathalia-f.png', img: '/src/assets/images/project-fashion-camp.png', link: '/portfolio/4' },
    ],
    conquistas: [
        {id: 'c1', title: 'Portfólio de Prata', desc: 'Seus projetos no portfólio somam ao todo 50 curtidas', icon: 'medal'},
        {id: 'c2', title: 'Projeto de Ouro', desc: 'Um único projeto seu bateu 100 curtidas', icon: 'trophy'},
        {id: 'c3', title: 'Colecionando Programadores', desc: 'Você já possui parceria com três programadores diferentes', icon: 'code'},
        {id: 'c4', title: 'Profissional Excelente', desc: 'Concluiu o projeto de três ofertas de vagas pela plataforma', icon: 'star'},
    ],
     userConnections: [ // Conexões de Helena - aba Conexões
      { id: 'conn1', name: 'Luiza Batista - Programador', project: 'Nome do Projeto', status: 'ativo', avatar: '/src/assets/images/avatar-luiza.png' },
      { id: 'conn2', name: 'Carlos Andrade - UX Designer', project: 'Outro Projeto', status: 'pendente', avatar: '/src/assets/images/avatar-carlos.png' },
      { id: 'conn3', name: 'Mariana Silva - Redatora', project: 'Projeto Blog', status: 'arquivado', avatar: '/src/assets/images/avatar-mariana.png' },
    ],
    interessesEmVagas: [ // Vagas que Helena se interessou (para aba Salvos)
        { id: 'v1', title: 'Desenvolvimento de App – Vaga Freela em Equipe', companyLogo: '/src/assets/images/ecotask-logo.png', description: 'Procuramos programadores...', details: 'Projeto freela, 3 meses.', link: '/vagas/1'},
    ]
  },
  'rafael-sampaio': {
    id: 'rafael-sampaio',
    name: 'Rafael Sampaio',
    username: '@rafaelsampaio.eco',
    role: 'Empreendedor & Mentor em Startups Digitais',
    avatar: '/src/assets/images/avatar-rafael.png', // From mockup
    bio: 'Fundador da EcoTask. Acredito no poder da colaboração entre talentos para criar soluções reais.',
    connections: ['@julia.gomes', '@manuela.pires'],
     badges: [
        { id: 'b1', name: 'Mentor Experiente', icon: '🧑‍🏫' },
        { id: 'b2', name: 'Empreendedor Visionário', icon: '💡' },
        { id: 'b3', name: 'Conectado', icon: '🌐' },
        { id: 'b4', name: 'Eco-Friendly', icon: '🌿' },
    ],
    vagasPostadas: [
      { id: 'v1', title: 'Desenvolvimento de App – Vaga Freela em Equipe', companyLogo: '/src/assets/images/ecotask-logo.png', description: 'Estamos montando um time para desenvolver um app de produtividade colaborativa.', details: 'Projeto freela, com prazo de 3 meses. Trabalho remoto.' },
      { id: 'v2', title: 'Identidade Visual para Marca – Vaga Freela Individual', companyLogo: '/src/assets/images/avatar-rafael.png', description: 'Preciso de um(a) designer criativo(a) para desenvolver a identidade visual da minha nova startup.', details: 'Projeto freela, com prazo de 40 dias.' },
      { id: 'v3', title: 'Cibersegurança – Vaga Fixa (Ciência da Computação)', companyLogo: '/src/assets/images/ecotask-logo.png', description: 'Procuramos(a) especialista ou estudante avançado(a) com foco em cibersegurança.', details: 'Vaga fixa, com possibilidade de bolsa ou contrato.' },
      { id: 'v4', title: 'Design para Redes Sociais – Vaga Fixa', companyLogo: '/src/assets/images/avatar-rafael.png', description: 'Estamos contratando uma equipe de designers para assumir a criação recorrente de peças.', details: 'Trabalho remoto - Carga semanal fixa com entregas quinzenais.' },
    ],
    userConnections: [ // Conexões de Rafael - aba Conexões
      { id: 'conn1', name: 'Ana Frontend Dev', project: 'Projeto EcoTask', status: 'ativo', avatar: '/src/assets/images/avatar-ana.png' },
    ]
  }
};

type TabKey = 'portfolio' | 'salvos' | 'conexoes' | 'conquistas' | 'vagas';

// Define types for items to be used in casts, matching the structure in mockUsers
type PortfolioItemType = { id: string; img: string; title: string; likes: number; };
type SavedItemType = { id: string; link: string; img: string; title: string; userImg: string; user: string; };
type InteresseEmVagaItemType = { id: string; link: string; companyLogo: string; title: string; description: string; details: string; };
type ConquistaItemType = { id: string; title: string; desc: string; icon: string; };
type VagaPostadaItemType = { id: string; companyLogo: string; title: string; description: string; details: string; };


const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: keyof typeof mockUsers }>();
  const [activeTab, setActiveTab] = useState<TabKey>('portfolio');

  // Ensure userId is valid before trying to access mockUsers
  if (!userId || !mockUsers[userId]) {
    return <div className="text-center py-10">Usuário não encontrado.</div>;
  }
  const user = mockUsers[userId];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        // FIX: Cast user to a type where 'portfolio' is optional and default to an empty array.
        const userWithPortfolio = user as { portfolio?: PortfolioItemType[] };
        const portfolioItems = userWithPortfolio.portfolio || [];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* FIX: Access portfolioItems which is guaranteed to be an array. */}
            {portfolioItems.map(item => (
              <Link to={`/portfolio/${item.id}`} key={item.id} className="block bg-white rounded-xl shadow-card overflow-hidden group">
                <img src={item.img} alt={item.title} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h3 className="font-semibold text-brand-purple-dark group-hover:underline">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.likes} curtidas</p>
                </div>
              </Link>
            ))}
            {/* FIX: Check length on portfolioItems which is guaranteed to be an array. */}
            {(portfolioItems.length === 0) && <p>Nenhum projeto no portfólio ainda.</p>}
          </div>
        );
      case 'salvos': // For Helena: "Projetos que você gostou" e "Vagas que você se interessou"
        // FIX: Cast user to a type where 'saved' and 'interessesEmVagas' are optional.
        const userWithSavedAndInterests = user as { saved?: SavedItemType[], interessesEmVagas?: InteresseEmVagaItemType[] };
        const savedItems = userWithSavedAndInterests.saved || [];
        const interestedVagas = userWithSavedAndInterests.interessesEmVagas || [];
        return (
          <div className="space-y-8 mt-6">
            <div>
              <h3 className="text-xl font-semibold text-brand-purple-dark mb-4">Projetos que você gostou</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* FIX: Access savedItems which is guaranteed to be an array. */}
                {savedItems.map(item => (
                  <Link to={item.link} key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-card group">
                    <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-lg mr-4"/>
                    <div>
                      <h4 className="font-semibold text-brand-purple-dark group-hover:underline">{item.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <img src={item.userImg} alt={item.user} className="w-5 h-5 rounded-full mr-1"/>
                        {item.user}
                      </div>
                    </div>
                  </Link>
                ))}
                {/* FIX: Check length on savedItems. */}
                {(savedItems.length === 0) && <p>Nenhum projeto salvo ainda.</p>}
              </div>
            </div>
            {/* FIX: Check length on interestedVagas. */}
            {interestedVagas.length > 0 && (
                 <div>
                    <h3 className="text-xl font-semibold text-brand-purple-dark mb-4">Vagas que você se interessou</h3>
                     {/* FIX: Access interestedVagas which is guaranteed to be an array. */}
                     {interestedVagas.map(vaga => (
                        <Link to={vaga.link} key={vaga.id} className="block bg-white p-6 rounded-xl shadow-card mb-4 group">
                            <div className="flex items-start gap-4">
                                <img src={vaga.companyLogo} alt="Logo" className="w-12 h-12 rounded-full object-contain bg-gray-100 p-0.5" />
                                <div>
                                    <h4 className="text-lg font-semibold text-brand-purple-dark group-hover:underline">{vaga.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{vaga.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{vaga.details}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
          </div>
        );
      case 'conexoes': // Helena's "Conexões" tab
         return (
            <div className="mt-6 bg-brand-yellow p-6 rounded-2xl shadow-card">
                <div className="flex justify-between items-center mb-4 text-brand-purple-dark">
                    <h3 className="text-lg font-semibold">Todas | Ativas | Pendentes | Arquivadas</h3>
                    {/* Add filter buttons here */}
                </div>
                <div className="space-y-4">
                    {(user.userConnections || []).map(conn => (
                        <div key={conn.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={conn.avatar} alt={conn.name} className="w-12 h-12 rounded-full mr-3"/>
                                <div>
                                    <p className="font-semibold text-brand-purple-dark">{conn.name}</p>
                                    <p className="text-xs text-gray-600">Projeto: {conn.project}</p>
                                    <p className="text-xs text-gray-500">Status: <span className={`font-medium ${conn.status === 'ativo' ? 'text-green-600' : conn.status === 'pendente' ? 'text-orange-500' : 'text-gray-500'}`}>{conn.status}</span></p>
                                </div>
                            </div>
                            <div className="space-x-2">
                                <button className="text-xs bg-brand-purple text-white px-3 py-1 rounded-md hover:bg-brand-purple-dark">Conversar</button>
                                <button className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">Ver Arquivos</button>
                                {/* More actions can be added */}
                            </div>
                        </div>
                    ))}
                     {(user.userConnections || []).length === 0 && <p className="text-brand-purple-dark">Nenhuma conexão ainda.</p>}
                </div>
            </div>
        );
      case 'conquistas': // Helena's "Conquistas" tab
        // FIX: Cast user to a type where 'conquistas' is optional.
        const userWithConquistas = user as { conquistas?: ConquistaItemType[] };
        const conquistasItems = userWithConquistas.conquistas || [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* FIX: Access conquistasItems which is guaranteed to be an array. */}
            {conquistasItems.map(conquista => (
                <div key={conquista.id} className={`p-6 rounded-2xl shadow-card ${conquista.id === 'c1' || conquista.id === 'c2' ? 'bg-brand-yellow text-brand-purple-dark' : 'bg-white text-brand-purple-dark'}`}>
                    <div className="flex items-center mb-3">
                        {/* Placeholder for conquista icon */}
                        <span className="text-4xl mr-3">{conquista.icon === 'medal' ? '🌟' : conquista.icon === 'trophy' ? '🏆' : conquista.icon === 'code' ? '💻' : '🏅'}</span>
                        <div>
                            <h3 className="text-xl font-bold">{conquista.title}</h3>
                        </div>
                    </div>
                    <p className="text-sm opacity-80">{conquista.desc}</p>
                </div>
            ))}
            {conquistasItems.length === 0 && <p>Nenhuma conquista ainda.</p>}
          </div>
        );
      case 'vagas': // Rafael's "Vagas" tab
        // FIX: Cast user to a type where 'vagasPostadas' is optional.
        const userWithVagasPostadas = user as { vagasPostadas?: VagaPostadaItemType[] };
        const vagasList = userWithVagasPostadas.vagasPostadas || [];
        return (
          <div className="space-y-6 mt-6">
            {/* FIX: Access vagasList which is guaranteed to be an array. */}
            {vagasList.map(vaga => (
              <Link to={`/vagas/${vaga.id}`} key={vaga.id} className="block bg-slate-800 p-6 rounded-xl shadow-card text-white group">
                 <div className="flex items-start gap-4 mb-2">
                    <img src={vaga.companyLogo} alt="Logo" className="w-12 h-12 rounded-full object-contain bg-white p-0.5" />
                    <div>
                        <h3 className="text-xl font-semibold text-brand-yellow group-hover:underline">{vaga.title}</h3>
                    </div>
                </div>
                <p className="text-sm text-slate-300 mb-2 line-clamp-2">{vaga.description}</p>
                <p className="text-xs text-brand-yellow font-medium">{vaga.details}</p>
                 <div className="mt-4 text-right">
                    <span className="bg-brand-yellow text-brand-purple-dark font-semibold py-1 px-3 rounded-md text-xs">
                        Me Conectar!
                    </span>
                </div>
              </Link>
            ))}
            {/* FIX: Check length on vagasList. */}
            {(vagasList.length === 0) && <p>Nenhuma vaga postada por este usuário.</p>}
          </div>
        );
      default:
        return null;
    }
  };
  
  const TABS_CONFIG: Record<string, { label: string; availableFor: (keyof typeof mockUsers)[] }> = {
    portfolio: { label: "Portfólio", availableFor: ['helena-sato-miller', 'rafael-sampaio'] },
    salvos: { label: "Salvos", availableFor: ['helena-sato-miller'] }, // Helena
    conexoes: { label: "Conexões", availableFor: ['helena-sato-miller', 'rafael-sampaio'] },
    conquistas: { label: "Conquistas", availableFor: ['helena-sato-miller'] }, // Helena
    vagas: { label: "Vagas", availableFor: ['rafael-sampaio'] }, // Rafael
  };


  return (
    <div className="container mx-auto py-8">
      {/* Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img src={user.avatar} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-brand-purple-light" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-purple-dark">{user.name}</h1>
            <p className="text-brand-yellow font-semibold">{user.username}</p>
            <p className="text-brand-text-secondary mt-1">{user.role}</p>
            <div className="mt-2 flex justify-center md:justify-start space-x-2">
                {(user.badges || []).map(badge => (
                    <span key={badge.id} title={badge.name} className="text-2xl">{badge.icon}</span>
                ))}
            </div>
            <p className="mt-3 text-brand-text max-w-xl">{user.bio}</p>
            {user.connections && (
              <p className="text-xs text-gray-500 mt-2">
                Amigos conectados: {user.connections.join(', ')} ...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 sm:space-x-2 bg-brand-purple-light p-1 rounded-xl shadow-sm mb-6">
        {Object.entries(TABS_CONFIG)
          .filter(([key, config]) => config.availableFor.includes(userId as keyof typeof mockUsers))
          .map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as TabKey)}
            className={`w-full py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors duration-200
              ${activeTab === key ? 'bg-brand-purple text-white shadow-md' : 'text-brand-purple-dark hover:bg-purple-200'}
            `}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default UserProfilePage;