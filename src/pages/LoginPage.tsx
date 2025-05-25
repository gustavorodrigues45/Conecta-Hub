import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados enviados para login:', { email, password }); // Log para verificar os dados enviados
    if (agreed) {
      try {
        console.log('Password value before Axios call:', password); // Debugging log
        const response = await axios.post('/login', { email, senha: password }); // Ensure correct mapping
        alert('Login bem-sucedido!');
        console.log(response.data);
        // Simulate successful login and redirect
        // In a real app, you'd set some auth state here
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