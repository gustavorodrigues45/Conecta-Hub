import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const CriarVagaPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [formData, setFormData] = useState({
        titulo: '',
        empresa: '',
        logo_empresa: null as File | null,
        descricao: '',
        tipo_trabalho: '',
        prazo: '',
        requisitos: [''],
        formato_trabalho: '',
        duracao_projeto: '',
        remuneracao: '',
        diferenciais: ['']
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!user || !user.usuario_id) {
                alert('Você precisa estar logado para criar uma vaga!');
                return;
            }

            // Validar campos obrigatórios
            const camposObrigatorios = {
                titulo: formData.titulo.trim(),
                empresa: formData.empresa.trim(),
                descricao: formData.descricao.trim(),
                tipo_trabalho: formData.tipo_trabalho.trim(),
                prazo: formData.prazo.trim()
            };

            const camposFaltando = Object.entries(camposObrigatorios)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            if (camposFaltando.length > 0) {
                alert(`Por favor, preencha os seguintes campos obrigatórios:\n${camposFaltando.join('\n')}`);
                return;
            }

            // Filtrar arrays vazios e garantir que são strings válidas
            const requisitosLimpos = formData.requisitos
                .filter(req => req.trim() !== '')
                .map(req => req.trim());

            const diferenciaisLimpos = formData.diferenciais
                .filter(dif => dif.trim() !== '')
                .map(dif => dif.trim());

            // Criar FormData com os dados validados
            const formDataToSend = new FormData();
            formDataToSend.append('titulo', camposObrigatorios.titulo);
            formDataToSend.append('empresa', camposObrigatorios.empresa);
            formDataToSend.append('descricao', camposObrigatorios.descricao);
            formDataToSend.append('tipo_trabalho', camposObrigatorios.tipo_trabalho);
            formDataToSend.append('prazo', camposObrigatorios.prazo);
            formDataToSend.append('requisitos', JSON.stringify(requisitosLimpos));
            formDataToSend.append('usuario_id', user.usuario_id.toString());

            // Campos opcionais
            if (formData.formato_trabalho) {
                formDataToSend.append('formato_trabalho', formData.formato_trabalho.trim());
            }
            if (formData.duracao_projeto) {
                formDataToSend.append('duracao_projeto', formData.duracao_projeto.trim());
            }
            if (formData.remuneracao) {
                formDataToSend.append('remuneracao', formData.remuneracao.trim());
            }
            if (diferenciaisLimpos.length > 0) {
                formDataToSend.append('diferenciais', JSON.stringify(diferenciaisLimpos));
            }
            if (formData.logo_empresa) {
                formDataToSend.append('logo_empresa', formData.logo_empresa);
            }

            console.log('Enviando dados:', Object.fromEntries(formDataToSend));

            const response = await axios.post('/vagas', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Resposta do servidor:', response.data);
            alert('Vaga criada com sucesso!');
            navigate('/vagas');
        } catch (error: any) {
            console.error('Erro ao criar vaga:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.details ||
                'Erro ao criar vaga. Por favor, tente novamente.';
            alert(`Erro: ${errorMessage}`);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                logo_empresa: e.target.files![0]
            }));
        }
    };

    const handleRequisitosChange = (index: number, value: string) => {
        const newRequisitos = [...formData.requisitos];
        newRequisitos[index] = value;
        if (index === formData.requisitos.length - 1 && value !== '') {
            newRequisitos.push('');
        }
        setFormData(prev => ({ ...prev, requisitos: newRequisitos }));
    };

    const handleDiferenciaisChange = (index: number, value: string) => {
        const newDiferenciais = [...formData.diferenciais];
        newDiferenciais[index] = value;
        if (index === formData.diferenciais.length - 1 && value !== '') {
            newDiferenciais.push('');
        }
        setFormData(prev => ({ ...prev, diferenciais: newDiferenciais }));
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Criar Nova Vaga</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título da Vaga
                            </label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Empresa
                            </label>
                            <input
                                type="text"
                                value={formData.empresa}
                                onChange={e => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logo da Empresa
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Detalhes da Vaga */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Detalhes da Vaga</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição Detalhada
                        </label>
                        <textarea
                            value={formData.descricao}
                            onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                            rows={6}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Trabalho
                            </label>
                            <select
                                value={formData.tipo_trabalho}
                                onChange={e => setFormData(prev => ({ ...prev, tipo_trabalho: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="Freelancer">Freelancer</option>
                                <option value="Meio Período">Meio Período</option>
                                <option value="Período Integral">Período Integral</option>
                                <option value="Estágio">Estágio</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prazo do Projeto
                            </label>
                            <input
                                type="text"
                                value={formData.prazo}
                                onChange={e => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                placeholder="Ex: 3 meses"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Formato de Trabalho
                        </label>
                        <select
                            value={formData.formato_trabalho}
                            onChange={e => setFormData(prev => ({ ...prev, formato_trabalho: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="Remoto">Remoto</option>
                            <option value="Híbrido">Híbrido</option>
                            <option value="Presencial">Presencial</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duração do Projeto
                        </label>
                        <input
                            type="text"
                            value={formData.duracao_projeto}
                            onChange={e => setFormData(prev => ({ ...prev, duracao_projeto: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                            placeholder="Ex: 6 meses com possibilidade de extensão"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remuneração
                        </label>
                        <input
                            type="text"
                            value={formData.remuneracao}
                            onChange={e => setFormData(prev => ({ ...prev, remuneracao: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                            placeholder="Ex: R$ 3.000 - R$ 5.000 por mês"
                            required
                        />
                    </div>
                </div>

                {/* Requisitos e Diferenciais */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Requisitos e Diferenciais</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Requisitos
                        </label>
                        {formData.requisitos.map((requisito, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    value={requisito}
                                    onChange={e => handleRequisitosChange(index, e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                    placeholder="Adicione um requisito"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diferenciais
                        </label>
                        {formData.diferenciais.map((diferencial, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    value={diferencial}
                                    onChange={e => handleDiferenciaisChange(index, e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                                    placeholder="Adicione um diferencial"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-brand-purple text-white font-semibold rounded-xl hover:bg-brand-purple-dark transition-colors"
                    >
                        Publicar Vaga
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CriarVagaPage; 