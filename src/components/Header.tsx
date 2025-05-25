import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder icons - replace with actual SVGs or an icon library
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;

const Header: React.FC = () => {
  // Mock user logged in state
  const isLoggedIn = false; // Change this to true to see logged in state

  return (
    <header className="bg-brand-purple text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold">
          {/* Replace with your actual SVG logo if available */}
          {/* <img src="/src/assets/images/logo-conecta-header.svg" alt="Conecta Hub" className="h-10" /> */}
          <span className="text-brand-yellow">Conecta</span>
          <span className="text-white">Hub</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button aria-label="Buscar" className="p-2 rounded-full hover:bg-brand-purple-dark transition-colors">
            <SearchIcon />
          </button>
          {isLoggedIn ? (
            <Link to="/perfil/meuId" aria-label="Meu Perfil" className="p-2 rounded-full hover:bg-brand-purple-dark transition-colors">
              <UserIcon />
            </Link>
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