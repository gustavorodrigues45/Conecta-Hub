
import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for Layers icon used in the banner
const LayersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-yellow">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const mockAprendizagemCategorias = {
  banner: {
    titleLine1: "Aprender. Criar. Evoluir.",
    titleLine2: "Conecte-se com o seu futuro",
  },
  mainCategories: [
    { id: 'computacao', name: 'Computação', link: '/aprendizagem/computacao' },
    { id: 'design', name: 'Design', link: '/aprendizagem/design' },
  ],
  subCategories: [
    { id: 'ux', name: 'UX', link: '/aprendizagem/design/ux' },
    { id: 'web', name: 'Web', link: '/aprendizagem/design/web' },
    { id: 'identid', name: 'Identid.', link: '/aprendizagem/design/identidade' },
    { id: 'produt', name: 'Produt.', link: '/aprendizagem/design/produto' },
    { id: 'edit', name: 'Edit.', link: '/aprendizagem/design/editorial' },
    { id: 'mkt', name: 'Mkt.', link: '/aprendizagem/design/marketing' },
    { id: 'emblg', name: 'Emblg.', link: '/aprendizagem/design/embalagem' },
    { id: 'educ', name: 'Educ.', link: '/aprendizagem/design/educacional' },
  ],
};

const AprendizagemPage: React.FC = () => {
  const { banner, mainCategories, subCategories } = mockAprendizagemCategorias;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero/Banner Section - Updated Style */}
      <section
        className="bg-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-xl flex items-center justify-between min-h-[180px] md:min-h-[200px]"
      >
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
            {banner.titleLine1}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300">{banner.titleLine2}</p>
        </div>
        <div className="relative z-10">
          <LayersIcon />
        </div>
      </section>

      {/* Main Categories - Updated Style */}
      <section className="flex justify-center items-center gap-3 sm:gap-4 -mt-12 md:-mt-14 relative z-20">
        {mainCategories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="text-center bg-brand-purple text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg hover:bg-brand-purple-dark transition-colors duration-200 shadow-md text-sm sm:text-base"
          >
            {category.name}
          </Link>
        ))}
      </section>

      {/* Sub Categories Grid - Updated Style (Larger Buttons with Patrick Hand font) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
        {subCategories.map((subCategory) => (
          <Link
            key={subCategory.id}
            to={subCategory.link}
            className="bg-brand-yellow text-brand-purple-dark font-patrick-hand py-6 px-3 sm:py-8 rounded-2xl shadow-card hover:bg-brand-yellow-dark transition-all duration-200 flex items-center justify-center text-2xl sm:text-3xl hover:scale-105 transform min-h-[100px] sm:min-h-[120px] text-center leading-tight"
          >
            {subCategory.name}
          </Link>
        ))}
      </section>
    </div>
  );
};

export default AprendizagemPage;