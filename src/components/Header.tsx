import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;

const Header: React.FC = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // Função para lidar com erro na carga da imagem
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/default-profile.png') {
      target.src = '/default-profile.png';
    }
  };

  const getProfileImgSrc = (foto_perfil?: string) => {
    if (!foto_perfil) return '/default-profile.png';
    if (foto_perfil.startsWith('http')) return foto_perfil;
    // Remove barras invertidas e monta o caminho igual ao PortfolioPage
    const cleanPath = foto_perfil.replace(/\\/g, '/');
    return `http://localhost:5000/${cleanPath}`;
  };

  return (
    <header className="bg-brand-purple text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold">
          <span className="text-brand-yellow">Conecta</span>
          <span className="text-white">Hub</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button aria-label="Buscar" className="p-2 rounded-full hover:bg-brand-purple-dark transition-colors">
            <SearchIcon />
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <Link to="/perfil" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
                  <img
                    src={getProfileImgSrc(user.foto_perfil)}
                    alt="Foto de perfil"
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <span className="text-sm font-medium">{user.nome}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-brand-yellow text-brand-purple-dark font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;