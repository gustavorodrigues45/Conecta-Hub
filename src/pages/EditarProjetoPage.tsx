import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Projeto {
    projeto_id: number;
    titulo: string;
    descricao: string;
    imagem_capa?: string;
    imagens?: string[];
    link_figma?: string;
    link_github?: string;
    link_drive?: string;
    categoria?: string;
    usuario_id?: number;
}

const EditarProjetoPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [projeto, setProjeto] = useState<Projeto | null>(null);
    const [novasImagens, setNovasImagens] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProjeto = async () => {
            try {
                const response = await axios.get(`/projetos/${projectId}`);
                setProjeto(response.data);
            } catch (error) {
                console.error('Erro ao buscar projeto:', error);
            }
        };
        fetchProjeto();
    }, [projectId]);

    const handleImagensChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setNovasImagens(Array.from(event.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            // Upload das novas imagens
            if (novasImagens.length > 0) {
                const formData = new FormData();
                novasImagens.forEach((imagem) => {
                    formData.append('imagens', imagem);
                });

                await axios.post(`/projetos/${projectId}/imagens`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            // Redireciona de volta para a página do projeto
            navigate(`/portfolio/${projectId}`);
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
        } finally {
            setUploading(false);
        }
    };

    if (!projeto) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Editar Projeto</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Imagens */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adicionar Novas Imagens
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImagensChange}
                        className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-brand-purple file:text-white
                     hover:file:bg-brand-purple-dark"
                    />
                </div>

                {/* Imagens Existentes */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Imagens Atuais</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {projeto.imagens?.map((imagem, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={`http://localhost:5000/${imagem}`}
                                    alt={`Imagem ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {/* Adicionar lógica para remover imagem */ }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/portfolio/${projectId}`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50"
                    >
                        {uploading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarProjetoPage;
