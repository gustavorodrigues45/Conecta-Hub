
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConexaoPage: React.FC = () => {
  const [connectWith, setConnectWith] = useState('');
  const [reason, setReason] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual connection request logic
    console.log('Connection request:', { connectWith, reason, projectLink, connectionType });
    alert('Solicitação de conexão enviada (simulado)!');
    navigate(-1); // Go back to previous page or to a confirmation page
  };

  const connectionTypes = [
    "Criar grupo novo com esta pessoa",
    "Trocar ideias / Mentoria",
    "Propor parceria pontual",
    "Outro (campo livre)"
  ];

  return (
    <div className="py-8">
      {/* Hero Section */}
      <section className="bg-brand-purple text-white p-8 md:p-12 rounded-2xl shadow-xl mb-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Toda grande <span className="text-brand-yellow">ideia</span> começa com uma boa <span className="text-brand-yellow">conexão</span>.
            </h1>
            <p className="text-purple-200 text-lg">
              Use o formulário abaixo para iniciar uma nova colaboração, buscar mentoria ou propor um projeto.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
             {/* Placeholder for a Conecta logo or relevant icon */}
            <img src="/src/assets/images/teamwork-hands-illustration.png" alt="Conexão" className="w-full max-w-xs rounded-lg" />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="bg-brand-purple-light p-8 sm:p-10 rounded-3xl shadow-card max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-brand-purple-dark mb-8 text-center">Enviar Solicitação de Conexão</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="connectWith" className="block text-sm font-medium text-brand-purple-dark mb-1">Com quem você deseja se conectar?</label>
            <input
              type="text"
              id="connectWith"
              placeholder="Nome do usuário, @username ou email"
              value={connectWith}
              onChange={(e) => setConnectWith(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-brand-purple-dark mb-1">Por que quer se conectar?</label>
            <textarea
              id="reason"
              placeholder="Descreva brevemente o motivo do seu contato..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="projectLink" className="block text-sm font-medium text-brand-purple-dark mb-1">Deseja convidar para um projeto específico? (Opcional)</label>
            <input
              type="url"
              id="projectLink"
              placeholder="Link do portfólio, Figma, GitHub..."
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-purple-dark mb-1">Selecionar um tipo de conexão:</label>
            <div className="space-y-2">
              {connectionTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConnectionType(type)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors duration-150
                    ${connectionType === type 
                      ? 'bg-brand-purple text-white border-brand-purple-dark ring-2 ring-brand-yellow' 
                      : 'bg-white text-brand-purple-dark border-brand-purple hover:bg-purple-50'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
            {connectionType === "Outro (campo livre)" && (
              <input 
                type="text" 
                placeholder="Especifique o tipo de conexão" 
                className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brand-purple bg-white text-brand-text focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm"
              />
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-brand-purple text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-purple-dark transition-colors duration-200 shadow-md"
            >
              Enviar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConexaoPage;
