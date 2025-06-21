
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

// Mock Data (replace with actual data fetching)
const mockProjectsData = {
  'projJulia': {
    id: 'projJulia',
    title: 'Design de Posts para Mídias Sociais',
    author: { name: 'Julia Silva', avatar: '/src/assets/images/avatar-julia.png', role: 'Estudante de Design Gráfico', profileLink: '/perfil/julia-silva' },
    description: 'Para desenvolver a nova Identidade Visual para a Paula seguimos um caminho de estética minimalista, com toques leves e elegantes, trabalhando os conceitos da marca e divulgando seu trabalho de terapias holísticas e yoga de forma libre.',
    images: [
      '/src/assets/images/project-julia-main.png', // Main image from mockup
      '/src/assets/images/project-julia-thumb1.png',
      '/src/assets/images/project-julia-thumb2.png',
      '/src/assets/images/project-julia-thumb3.png',
      '/src/assets/images/project-julia-mobile1.png',
      '/src/assets/images/project-julia-mobile2.png',
      '/src/assets/images/project-julia-mobile3.png',
      '/src/assets/images/project-julia-detail1.png',
      '/src/assets/images/project-julia-detail2.png',
    ],
    tags: ['Identidade Visual', 'Social Media', 'Minimalista', 'Yoga'],
    relatedProjects: [
        { id: '1', title: 'Desenvolvimento de Aplicativo', user: 'Maria Lima & João Gomes', userImg: '/src/assets/images/avatar-maria.png', img: '/src/assets/images/project-app-fitness.png' },
        { id: '8', title: 'Redesign de App', user: 'Caio Junior', userImg: '/src/assets/images/avatar-caio.png', img: '/src/assets/images/project-courts-app.png' },
    ]
  },
  // Add more projects as needed
};

// Placeholder icons
const HeartIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 18.75l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const CommentIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ShareIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.008l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>;


const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: keyof typeof mockProjectsData }>();
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({ loop: true });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: { perView: 4, spacing: 10 },
    },
    [
      (slider) => {
        slider.on('slideChanged', () => {
          // Sync with main slider if needed, or just for thumbnail navigation
        });
      },
    ]
  );


  if (!projectId || !mockProjectsData[projectId]) {
    return <div className="text-center py-10">Projeto não encontrado.</div>;
  }
  const project = mockProjectsData[projectId];

  return (
    <div className="bg-white rounded-3xl shadow-card p-4 sm:p-6 md:p-8">
      {/* Author Info */}
      <div className="flex items-center mb-6">
        <img src={project.author.avatar} alt={project.author.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-purple-dark">{project.title}</h1>
          <Link to={project.author.profileLink} className="text-brand-purple hover:underline">
            por {project.author.name} <span className="text-sm text-gray-500">({project.author.role})</span>
          </Link>
        </div>
        {/* Action Buttons - Like, Comment, Share */}
        <div className="ml-auto flex space-x-3 text-gray-500">
          <button className="p-2 rounded-full hover:bg-red-100 hover:text-red-500"><HeartIcon /></button>
          <button className="p-2 rounded-full hover:bg-blue-100 hover:text-blue-500"><CommentIcon /></button>
          <button className="p-2 rounded-full hover:bg-green-100 hover:text-green-500"><ShareIcon /></button>
        </div>
      </div>
      
      {/* Main Image Slider */}
      <div ref={sliderRef} className="keen-slider mb-4 rounded-xl overflow-hidden bg-gray-200" style={{ height: '500px' }}>
        {project.images.slice(0,1).map((img, idx) => ( // Display only the main image in the main slider for this layout
          <div key={idx} className="keen-slider__slide">
            <img src={img} alt={`${project.title} - Imagem ${idx + 1}`} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    
      {/* Description */}
      <div className="my-8">
        <h2 className="text-xl font-semibold text-brand-purple-dark mb-2">Design de Posts</h2> {/* From mockup image */}
        <p className="text-brand-text leading-relaxed whitespace-pre-line">{project.description}</p>
      </div>

      {/* Image Gallery (Thumbnails / Smaller Images) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {project.images.slice(1).map((img, idx) => ( // Display rest of the images as a gallery
            <div key={idx} className="rounded-lg overflow-hidden shadow-sm aspect-square bg-gray-100">
                 <img 
                    src={img} 
                    alt={`${project.title} - Detalhe ${idx + 1}`} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => instanceRef.current?.moveToIdx(project.images.findIndex(i => i === img))} // Basic click to change main image
                />
            </div>
        ))}
      </div>
      
      {/* Tags */}
      <div className="mb-8">
        {project.tags.map(tag => (
          <span key={tag} className="inline-block bg-brand-purple-light text-brand-purple-dark text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Related Projects */}
      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-brand-purple-dark mb-4">Acesse também outros projetos:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.relatedProjects.map(related => (
              <Link to={`/portfolio/${related.id}`} key={related.id} className="flex items-center bg-slate-800 p-4 rounded-xl shadow-md group">
                <img src={related.img} alt={related.title} className="w-24 h-20 object-cover rounded-lg mr-4"/>
                <div className="text-white">
                  <h4 className="font-semibold group-hover:underline text-brand-yellow">{related.title}</h4>
                  <div className="flex items-center text-xs text-slate-300 mt-1">
                    <img src={related.userImg} alt={related.user} className="w-5 h-5 rounded-full mr-1"/>
                    {related.user}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
