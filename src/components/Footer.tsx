
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-purple text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <Link to="/" className="text-2xl font-bold mb-2 inline-block">
           {/* You might want to use an actual SVG logo here */}
           {/* <img src="/src/assets/images/logo-conecta-white.svg" alt="Conecta Hub" className="h-8" /> */}
           <span className="text-brand-yellow">Conecta</span><span className="text-white">Hub</span>
        </Link>
        <p className="text-sm text-purple-200">
          &copy; {new Date().getFullYear()} Conecta. Todos os direitos reservados.
        </p>
        <p className="text-xs text-purple-300 mt-1">
          Hub de Tecnologia para Designers e Desenvolvedores.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
