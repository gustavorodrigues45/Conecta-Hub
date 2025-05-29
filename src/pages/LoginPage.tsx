import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      try {
        const response = await axios.post('/login', { email, senha: password });

        // Verifica se o caminho da foto já contém a URL completa
        const foto_perfil = response.data.usuario.foto_perfil;
        let fotoPerfilFinal = foto_perfil;
        if (foto_perfil && !foto_perfil.startsWith('http')) {
          fotoPerfilFinal = foto_perfil.replace(/\\/g, '/');
          fotoPerfilFinal = `http://localhost:5000/${fotoPerfilFinal}`;
        }
        const userData = { ...response.data.usuario, foto_perfil: fotoPerfilFinal };
        // Salvar no localStorage e atualizar o contexto
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        alert('Login bem-sucedido!');
        navigate('/');
      } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao realizar login. Verifique suas credenciais.');
      }
    } else {
      alert('Você precisa concordar com os termos de acesso.');
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-brand-yellow p-8 sm:p-12 rounded-3xl shadow-card w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-brand-purple-dark mb-8">Login</h1>

        {/* Placeholder for laptop illustration */}
        <img
          src="/src/assets/images/laptop-login-illustration.png"
          alt="Ilustração de login"
          className="w-48 h-auto mx-auto mb-8"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Acesso"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-3 rounded-xl border-2 border-brand-purple-dark bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none shadow-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-3 rounded-xl border-2 border-brand-purple-dark bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none shadow-sm"
            />
          </div>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 text-brand-purple rounded border-brand-purple-dark focus:ring-brand-purple mr-2 accent-brand-purple"
            />
            <label htmlFor="terms" className="text-sm text-brand-purple-dark">
              Eu concordo com todos os <Link to="/termos" className="underline hover:text-brand-purple">termos de acesso</Link>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-brand-purple text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-purple-dark transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-purple-light focus:ring-opacity-50"
            >
              Entrar
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-brand-purple-dark">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-semibold underline hover:text-brand-purple"> {/* Updated link */}
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;