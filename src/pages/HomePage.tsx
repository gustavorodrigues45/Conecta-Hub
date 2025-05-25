
import React from 'react';
import { Link } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

// Placeholder Icons (replace with actual SVGs or library)
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>;
const PartnershipIcon = () => <svg className="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
const ShowcaseIcon = () => <svg className="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h10l-1-1-0.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const LearningIcon = () => <svg className="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 16v-2m7.071-7.071l-1.414-1.414M4.929 4.929L6.343 6.343m0 11.314l-1.414 1.414M19.071 4.929l-1.414 1.414M4.929 19.071l1.414-1.414M12 12l3.536 3.536M12 12l-3.536 3.536"></path></svg>;


const mockNovidades = [
  { id: 1, title: "Download de Códigos", desc: "Baixe códigos e protótipos.", img: "/src/assets/images/placeholder-code.png", bgColor: "bg-slate-700" },
  { id: 2, title: "Tema Escuro Disponível", desc: "Navegue com conforto visual.", img: "/src/assets/images/placeholder-darkmode.png", bgColor: "bg-gray-800" },
  { id: 3, title: "Recomendações Personalizadas", desc: "Projetos baseados no seu interesse.", img: "/src/assets/images/placeholder-recommend.png", bgColor: "bg-purple-700" },
  { id: 4, title: "Novo Sistema de Agendamento", desc: "Agende conversas em tempo real.", img: "/src/assets/images/placeholder-calendar.png", bgColor: "bg-sky-700" },
];

const mockAmigosPostando = [
  { id: 1, user: "Maria Lima", userImg: "/src/assets/images/avatar-maria.png", projectTitle: "Desenvolvimento de Aplicativo", projectDesc: "Aplicativo para academia.", projectImg: "/src/assets/images/project-app-fitness.png" },
  { id: 2, user: "João Gomes", userImg: "/src/assets/images/avatar-joao.png", projectTitle: "FeedUp com treinos e registros", projectDesc: "Interface para app de treinos.", projectImg: "/src/assets/images/project-feedup.png" },
  { id: 3, user: "Caio Junior", userImg: "/src/assets/images/avatar-caio.png", projectTitle: "Desenvolvimento de Aplicativo", projectDesc: "Aplicativo para aulas de tênis.", projectImg: "/src/assets/images/project-tennis.png" },
  { id: 4, user: "Prof. Anderson", userImg: "/src/assets/images/avatar-prof.png", projectTitle: "Redesign de Aplicativo", projectDesc: "Novo visual para app educacional.", projectImg: "/src/assets/images/project-redesign.png" },
  { id: 5, user: "Julia Silva", userImg: "/src/assets/images/avatar-julia.png", projectTitle: "Projeto de Fotodesign", projectDesc: "Ensaio fotográfico conceitual.", projectImg: "/src/assets/images/project-photodesign.png" },
  { id: 6, user: "Nathalia Montenegro", userImg: "/src/assets/images/avatar-nathalia-m.png", projectTitle: "Identidade Visual", projectDesc: "Marca para startup de IA.", projectImg: "/src/assets/images/project-id-visual.png" },
  { id: 7, user: "Nathalia Vales Ficher", userImg: "/src/assets/images/avatar-nathalia-f.png", projectTitle: "Campanha de divulgação", projectDesc: "Campanha para marca de moda.", projectImg: "/src/assets/images/project-fashion-camp.png" },
];

const mockConexoesRecentes = [
    { id: 1, name: "Ana", img: "/src/assets/images/avatar-ana.png" },
    { id: 2, name: "Bruno", img: "/src/assets/images/avatar-bruno.png" },
    { id: 3, name: "Carla", img: "/src/assets/images/avatar-carla.png" },
    { id: 4, name: "Daniel", img: "/src/assets/images/avatar-daniel.png" },
    { id: 5, name: "Elisa", img: "/src/assets/images/avatar-elisa.png" },
    { id: 6, name: "Fernando", img: "/src/assets/images/avatar-fernando.png" },
    { id: 7, name: "Sofia", img: "/src/assets/images/avatar-sofia.png" },
    { id: 8, name: "Mariana", img: "/src/assets/images/avatar-mariana.png" },
];


const HomePage: React.FC = () => {
  const [sliderRefNovidades] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1.2, spacing: 15 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2.5, spacing: 20 } },
      '(min-width: 1024px)': { slides: { perView: 3.5, spacing: 25 } },
    },
  });

  const [sliderRefAmigos] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 1.3, spacing: 15 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2.5, spacing: 20 } },
      '(min-width: 1024px)': { slides: { perView: 3.5, spacing: 25 } },
    },
  });


  return (
    <div className="space-y-12">
      {/* Hero Section - based on home_landing.png or first part of home_completa.png */}
      <section className="relative text-center py-16 md:py-24 bg-gradient-to-br from-brand-purple-light via-brand-purple to-brand-purple-dark rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Background pattern if any - e.g., geometric shapes from header */}
          {/* <img src="/src/assets/images/header-bg-pattern.svg" className="w-full h-full object-cover" /> */}
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
            Toda grande <span className="text-brand-yellow">ideia</span> começa
            <br /> com uma boa <span className="text-brand-yellow">conexão</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Junte-se à nossa comunidade de designers e desenvolvedores para criar, colaborar e construir o futuro.
          </p>
          <div className="mt-10">
            <Link
              to="/portfolio"
              className="bg-brand-yellow text-brand-purple-dark font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 shadow-lg"
            >
              Explorar Projetos
            </Link>
          </div>
        </div>
      </section>

      {/* Novidades da Plataforma */}
      <section>
        <h2 className="text-3xl font-bold text-brand-purple-dark mb-6">Novidades da Plataforma</h2>
        <div ref={sliderRefNovidades} className="keen-slider">
          {mockNovidades.map((novidade) => (
            <div key={novidade.id} className={`keen-slider__slide ${novidade.bgColor} text-white p-6 rounded-xl shadow-card`}>
              <img src={novidade.img} alt={novidade.title} className="w-16 h-16 mb-4 object-contain" />
              <h3 className="text-xl font-semibold mb-2">{novidade.title}</h3>
              <p className="text-sm opacity-80">{novidade.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Desafio de Design da Semana */}
      <section className="flex flex-col md:flex-row gap-8 items-center bg-slate-800 text-white p-8 md:p-12 rounded-2xl shadow-xl">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-brand-yellow mb-4">Desafio de <span className="text-white">Design</span> da Semana</h2>
          <p className="mb-4 text-slate-300">
            Crie um cartaz de divulgação de um festival de música com estética dos anos 1920, período Art Déco. O projeto deve ser inovador e ter uma pegada de revolução cultural.
          </p>
          <button className="bg-brand-yellow text-brand-purple-dark font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
            Participar do Desafio
          </button>
        </div>
        <div className="md:w-1/2">
          <img src="/src/assets/images/desafio-design-artdeco.png" alt="Desafio Art Deco" className="rounded-lg shadow-lg w-full h-auto object-cover max-h-80" />
        </div>
      </section>

      {/* Suas Conquistas Recentes */}
      <section>
        <h2 className="text-3xl font-bold text-brand-purple-dark mb-6">Suas Conquistas Recentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Placeholder conquista cards */}
          {[
            { title: "Portfólio de Prata", desc: "50 curtidas em projetos", icon: "medal" },
            { title: "Colaborador Top", desc: "3 parcerias de sucesso", icon: "users" },
            { title: "Mestre do Código", desc: "1000 linhas de código", icon: "code" },
            { title: "Visionário Criativo", desc: "5 projetos inovadores", icon: "lightbulb" },
          ].map(conquista => (
            <div key={conquista.title} className="bg-brand-yellow p-6 rounded-xl shadow-card text-center">
              {/* Placeholder for icon */}
              <div className="text-4xl text-brand-purple-dark mb-2">🏆</div>
              <h3 className="text-xl font-semibold text-brand-purple-dark mb-1">{conquista.title}</h3>
              <p className="text-sm text-purple-800">{conquista.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que seus amigos estão postando */}
      <section>
        <h2 className="text-3xl font-bold text-brand-purple-dark mb-6">O que seus amigos estão postando</h2>
         <div ref={sliderRefAmigos} className="keen-slider">
          {mockAmigosPostando.map(post => (
            <div key={post.id} className="keen-slider__slide bg-white rounded-xl shadow-card overflow-hidden">
              <img src={post.projectImg} alt={post.projectTitle} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <img src={post.userImg} alt={post.user} className="w-8 h-8 rounded-full mr-2 object-cover" />
                  <span className="text-sm font-semibold text-brand-purple-dark">{post.user}</span>
                </div>
                <h3 className="font-semibold text-brand-text mb-1 truncate">{post.projectTitle}</h3>
                <p className="text-xs text-brand-text-secondary truncate">{post.projectDesc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Rede de Conexões Recentes */}
      <section>
        <h2 className="text-3xl font-bold text-brand-purple-dark mb-6">Rede de Conexões Recentes</h2>
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl relative">
           {/* Network visualization placeholder - this would require a more complex component or library */}
           <div className="flex flex-wrap justify-center items-center gap-4">
            {mockConexoesRecentes.map(conexao => (
                <img 
                    key={conexao.id} 
                    src={conexao.img} 
                    alt={conexao.name} 
                    title={conexao.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-brand-purple-light shadow-md"
                />
            ))}
           </div>
           <p className="text-center text-slate-300 mt-6">Conecte-se com outros talentos e expanda sua rede!</p>
        </div>
      </section>

       {/* "Sobre a plataforma" "Encontre o time ideal" "Por que usar Conecta?" - from home_landing.png */}
      <section className="py-12 space-y-16">
        {/* Sobre a plataforma */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-brand-purple-light p-8 md:p-12 rounded-2xl shadow-card">
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold text-brand-purple-dark mb-4">Sobre a Plataforma</h3>
            <p className="text-brand-text leading-relaxed">
              Conecta é o seu hub de tecnologia para colaboração e crescimento. Unimos estudantes de Design Gráfico e Ciência da Computação para transformar ideias em projetos de portfólio incríveis.
            </p>
            <Link to="/sobre" className="mt-6 inline-flex items-center text-brand-purple-dark font-semibold hover:text-brand-purple">
              Saiba Mais <ArrowRightIcon />
            </Link>
          </div>
          <div className="md:w-1/2">
            {/* Placeholder for laptop image or illustration */}
            <img src="/src/assets/images/laptop-illustration.png" alt="Plataforma Conecta" className="rounded-lg w-full" />
          </div>
        </div>

        {/* Encontre o time ideal */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 p-8 md:p-12 rounded-2xl shadow-card">
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold text-brand-purple-dark mb-4">Encontre o Time Ideal para seu Projeto</h3>
            <p className="text-brand-text leading-relaxed">
              Publique seus briefings, explore projetos de outros talentos e forme parcerias para desenvolver soluções inovadoras. Acreditamos no poder da colaboração para impulsionar a criatividade.
            </p>
             <Link to="/portfolio" className="mt-6 inline-flex items-center text-brand-purple-dark font-semibold hover:text-brand-purple">
              Buscar Projetos <ArrowRightIcon />
            </Link>
          </div>
          <div className="md:w-1/2">
             {/* Placeholder for teamwork image or illustration */}
            <img src="/src/assets/images/teamwork-illustration.png" alt="Time ideal" className="rounded-lg w-full" />
          </div>
        </div>
        
        {/* Por que usar Conecta? */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 rounded-2xl shadow-card overflow-hidden">
            <div className="md:w-1/2 bg-slate-800 text-white p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Por que usar o <span className="text-brand-yellow">Conecta</span>?</h3>
            </div>
            <div className="md:w-1/2 bg-brand-purple-light p-8 md:p-12">
                <ul className="space-y-6">
                    <li className="flex items-start">
                        <PartnershipIcon />
                        <div className="ml-4">
                            <h4 className="font-semibold text-xl text-brand-purple-dark">Parcerias de Sucesso</h4>
                            <p className="text-brand-text-secondary">Conecte-se com talentos complementares.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <ShowcaseIcon />
                        <div className="ml-4">
                            <h4 className="font-semibold text-xl text-brand-purple-dark">Divulgação do seu Trabalho</h4>
                            <p className="text-brand-text-secondary">Construa um portfólio impactante.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <LearningIcon />
                        <div className="ml-4">
                            <h4 className="font-semibold text-xl text-brand-purple-dark">Aprendizagem Prática e Rápida</h4>
                            <p className="text-brand-text-secondary">Desenvolva habilidades em projetos reais.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
