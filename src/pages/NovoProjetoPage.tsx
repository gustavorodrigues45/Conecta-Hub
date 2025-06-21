import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const NovoProjetoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    link_figma: '',
    link_github: '',
    link_drive: '',
    briefing_id: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('descricao', formData.descricao);
    data.append('link_figma', formData.link_figma);
    data.append('link_github', formData.link_github);
    data.append('link_drive', formData.link_drive);
    data.append('briefing_id', formData.briefing_id);
    if (file) {
      data.append('imagem_capa', file);
    }
    if (user && user.usuario_id) {
      data.append('usuario_id', String(user.usuario_id));
    }

    try {
      const response = await axios.post('/projetos', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Projeto criado com sucesso!');
      console.log(response.data);
      navigate('/portfolio');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      alert('Erro ao criar projeto.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-brand-purple-dark mb-8 text-center">Adicionar Novo Projeto</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-card space-y-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-brand-purple-dark mb-1">Título do Projeto</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-brand-purple-dark mb-1">Descrição Detalhada</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="imagem_capa" className="block text-sm font-medium text-brand-purple-dark mb-1">Imagem de Capa</label>
          <input
            type="file"
            id="imagem_capa"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="link_figma" className="block text-sm font-medium text-brand-purple-dark mb-1">Link do Figma (Opcional)</label>
          <input
            type="text"
            id="link_figma"
            name="link_figma"
            value={formData.link_figma}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="link_github" className="block text-sm font-medium text-brand-purple-dark mb-1">Link do GitHub (Opcional)</label>
          <input
            type="text"
            id="link_github"
            name="link_github"
            value={formData.link_github}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="link_drive" className="block text-sm font-medium text-brand-purple-dark mb-1">Link do Google Drive (Opcional)</label>
          <input
            type="text"
            id="link_drive"
            name="link_drive"
            value={formData.link_drive}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="briefing_id" className="block text-sm font-medium text-brand-purple-dark mb-1">ID do Briefing (Opcional)</label>
          <input
            type="text"
            id="briefing_id"
            name="briefing_id"
            value={formData.briefing_id}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-brand-purple text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-purple-dark transition-colors duration-200 shadow-md"
          >
            Publicar Projeto
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovoProjetoPage;
