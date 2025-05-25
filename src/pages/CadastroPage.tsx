import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CadastroPage: React.FC = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState<'designer' | 'programador' | ''>('');
    const [github, setGithub] = useState('');
    const [googleDrive, setGoogleDrive] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }
        if (!tipoUsuario) {
            setError('Por favor, selecione o tipo de usuário.');
            return;
        }
        setError('');
        try {
            const response = await axios.post('/usuarios', {
                nome,
                email,
                senha,
                tipo: tipoUsuario,
                github,
                google_drive: googleDrive,
            });
            setSuccess('Usuário cadastrado com sucesso!');
            console.log(response.data);
            alert('Cadastro realizado com sucesso! Redirecionando para o login.');
            navigate('/login');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            setError('Erro ao cadastrar usuário.');
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="bg-brand-purple-light p-8 sm:p-12 rounded-3xl shadow-card w-full max-w-lg">
                <h1 className="text-3xl sm:text-4xl font-bold text-brand-purple-dark mb-8 text-center">Criar Conta</h1>

                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                {success && <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-lg">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-brand-purple-dark mb-1">Nome Completo</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-purple-dark mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-brand-purple-dark mb-1">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmarSenha" className="block text-sm font-medium text-brand-purple-dark mb-1">Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-purple-dark mb-1">Tipo de Usuário</label>
                        <select
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value as 'designer' | 'programador')}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        >
                            <option value="" disabled>Selecione seu perfil...</option>
                            <option value="designer">Designer</option>
                            <option value="programador">Programador(a)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="github" className="block text-sm font-medium text-brand-purple-dark mb-1">Link do GitHub (Opcional)</label>
                        <input
                            type="url"
                            id="github"
                            placeholder="https://github.com/seu-usuario"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="googleDrive" className="block text-sm font-medium text-brand-purple-dark mb-1">Link do Google Drive / Portfólio (Opcional)</label>
                        <input
                            type="url"
                            id="googleDrive"
                            placeholder="Link para seu portfólio online"
                            value={googleDrive}
                            onChange={(e) => setGoogleDrive(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-brand-purple text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-purple-dark transition-colors duration-200 shadow-md"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-sm text-center text-brand-purple-dark">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-semibold underline hover:text-brand-purple">
                        Faça Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CadastroPage;