const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados');

        // Verificar se a tabela existe
        client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'usuario'
            );
        `)
            .then(result => {
                console.log('A tabela usuario existe?', result.rows[0].exists);
            })
            .catch(error => {
                console.error('Erro ao verificar tabela:', error);
            })
            .finally(() => {
                release(); // Importante liberar o cliente
            });
    }
});

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Diretório onde os arquivos serão salvos
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Nome único para o arquivo
        },
    }),
});

// Servir a pasta uploads como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Rotas para a tabela usuario
// Update the user registration route to handle image uploads
app.post('/usuarios', upload.single('foto_perfil'), async (req, res) => {
    const { nome, email, senha, tipo, github, google_drive } = req.body;
    // Salva apenas o caminho relativo, igual ao PortfolioPage
    const fotoPerfilPath = req.file ? `uploads/${req.file.filename.replace(/\\/g, '/')}` : null;
    try {
        const result = await pool.query(
            'INSERT INTO usuario (nome, email, senha, tipo, github, google_drive, foto_perfil) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome, email, senha, tipo, github, google_drive, fotoPerfilPath]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        console.log('Tentando buscar usuários...');
        const result = await pool.query('SELECT usuario_id, nome, foto_perfil, tipo FROM public.usuario ORDER BY usuario_id ASC');
        console.log('Usuários encontrados:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro detalhado ao buscar usuários:', error);
        res.status(500).json({
            error: 'Erro ao buscar usuários',
            details: error.message
        });
    }
});

// Adicione a rota GET /usuarios/:id para buscar um usuário específico por ID
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM usuario WHERE usuario_id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Adicione logs detalhados na rota POST /login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log('Tentativa de login com:', { email, senha });
    try {
        const result = await pool.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2', [email, senha]);
        if (result.rows.length > 0) {
            console.log('Login bem-sucedido para o usuário:', result.rows[0]);
            res.status(200).json({ message: 'Login bem-sucedido', usuario: result.rows[0] });
        } else {
            console.log('Credenciais inválidas para o email:', email);
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// Rotas para a tabela briefing
app.post('/briefings', async (req, res) => {
    const { titulo, descricao, criado_por } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO briefing (titulo, descricao, criado_por) VALUES ($1, $2, $3) RETURNING *',
            [titulo, descricao, criado_por]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar briefing' });
    }
});

app.get('/briefings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM briefing');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar briefings' });
    }
});

// Rotas para a tabela projeto
app.post('/projetos', upload.single('imagem_capa'), async (req, res) => {
    console.log('Dados recebidos no body:', req.body); // Log para verificar o body
    console.log('Arquivo recebido:', req.file); // Log para verificar o arquivo

    const { titulo, descricao, link_figma, link_github, link_drive, briefing_id, usuario_id } = req.body;
    // Salva apenas o caminho relativo, igual ao PortfolioPage
    const imagemCapaPath = req.file ? `uploads/${req.file.filename.replace(/\\/g, '/')}` : null;

    // Converta briefing_id vazio para NULL
    const briefingIdValue = briefing_id === '' ? null : briefing_id;
    const usuarioIdValue = usuario_id === '' ? null : usuario_id;

    try {
        const result = await pool.query(
            'INSERT INTO projeto (titulo, descricao, imagem_capa, link_figma, link_github, link_drive, briefing_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [titulo, descricao, imagemCapaPath, link_figma, link_github, link_drive, briefingIdValue, usuarioIdValue]
        );
        console.log('Projeto criado com sucesso:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar projeto:', err);
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
});

app.get('/projetos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projeto');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

// Rota de busca para projetos/portfólios
app.get('/projetos/busca', async (req, res) => {
    try {
        const { q } = req.query; // q = query de busca

        if (!q || q.trim() === '') {
            // Se não há termo de busca, retorna todos os projetos
            const result = await pool.query('SELECT * FROM projeto ORDER BY created_at DESC');
            return res.status(200).json(result.rows);
        }

        const searchTerm = `%${q}%`;
        const result = await pool.query(`
            SELECT p.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto
            FROM projeto p
            LEFT JOIN usuario u ON p.usuario_id = u.usuario_id
            WHERE p.titulo ILIKE $1 
               OR p.descricao ILIKE $1 
               OR p.categoria ILIKE $1
               OR u.nome ILIKE $1
            ORDER BY p.created_at DESC
        `, [searchTerm]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar projetos:', err);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

// Rota para adicionar imagens a um projeto existente
app.post('/projetos/:id/imagens', upload.array('imagens'), async (req, res) => {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    try {
        // Busca as imagens existentes do projeto
        const projetoResult = await pool.query('SELECT imagens FROM projeto WHERE projeto_id = $1', [id]);

        if (projetoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        // Prepara o array de novas imagens
        const novasImagens = req.files.map(file => `uploads/${file.filename.replace(/\\/g, '/')}`);

        // Combina as imagens existentes com as novas
        const imagensExistentes = projetoResult.rows[0].imagens || [];
        const todasImagens = [...imagensExistentes, ...novasImagens];

        // Atualiza o projeto com todas as imagens
        const updateResult = await pool.query(
            'UPDATE projeto SET imagens = $1 WHERE projeto_id = $2 RETURNING *',
            [todasImagens, id]
        );

        res.status(200).json(updateResult.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar imagens ao projeto:', err);
        res.status(500).json({ error: 'Erro ao adicionar imagens ao projeto' });
    }
});

// Rotas para a tabela usuario_projeto
app.post('/usuario-projeto', async (req, res) => {
    const { usuario_id, projeto_id, papel, solicitante_id } = req.body;

    console.log('Dados recebidos:', { usuario_id, projeto_id, papel, solicitante_id });

    // Validação dos dados
    if (!usuario_id || !projeto_id || !papel || !solicitante_id) {
        return res.status(400).json({
            error: 'Dados incompletos',
            message: 'usuario_id, projeto_id, papel e solicitante_id são obrigatórios'
        });
    }

    try {
        // Primeiro, verifica se o projeto existe
        const projectCheck = await pool.query(
            'SELECT * FROM projeto WHERE projeto_id = $1',
            [projeto_id]
        );

        if (projectCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'Projeto não encontrado'
            });
        }

        // Verifica se o usuário existe
        const userCheck = await pool.query(
            'SELECT * FROM usuario WHERE usuario_id = $1',
            [usuario_id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        // Verifica se já existe essa relação
        const existingCheck = await pool.query(
            'SELECT * FROM usuario_projeto WHERE usuario_id = $1 AND projeto_id = $2',
            [usuario_id, projeto_id]
        );

        if (existingCheck.rows.length > 0) {
            return res.status(400).json({
                error: 'Este usuário já está associado a este projeto'
            });
        }

        // Em vez de adicionar direto, cria notificação de convite
        await pool.query(
            'INSERT INTO notificacoes (tipo, usuario_origem_id, usuario_destino_id, projeto_id, status) VALUES ($1, $2, $3, $4, $5)',
            ['convite_colaborador', solicitante_id, usuario_id, projeto_id, 'pendente']
        );

        console.log('Convite de colaborador enviado com sucesso');
        res.status(201).json({
            message: 'Convite de colaborador enviado com sucesso'
        });
    } catch (error) {
        console.error('Erro detalhado ao convidar colaborador:', error);
        res.status(500).json({
            error: 'Erro ao convidar colaborador',
            details: error.message,
            sqlError: error.code
        });
    }
});

app.get('/usuario-projeto', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario_projeto');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar associações de usuários e projetos' });
    }
});

// Rota para buscar todos os donos de um projeto
app.get('/usuario-projeto/:projetoId', async (req, res) => {
    const { projetoId } = req.params;

    try {
        console.log('Buscando donos para o projeto:', projetoId);

        const result = await pool.query(
            'SELECT * FROM public.usuario_projeto WHERE projeto_id = $1',
            [Number(projetoId)]  // Converte para número
        );

        console.log('Donos encontrados:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar donos do projeto:', error);
        res.status(500).json({
            error: 'Erro ao buscar donos do projeto',
            details: error.message
        });
    }
});

// Rotas para a tabela curtida
app.post('/curtidas', async (req, res) => {
    const { usuario_id, projeto_id } = req.body;
    console.log('Tentando adicionar curtida:', { usuario_id, projeto_id });

    try {
        // Verifica se já existe uma curtida deste usuário neste projeto
        const existingLike = await pool.query(
            'SELECT * FROM curtida WHERE usuario_id = $1 AND projeto_id = $2',
            [usuario_id, projeto_id]
        );

        if (existingLike.rows.length > 0) {
            console.log('Usuário já curtiu este projeto');
            return res.status(400).json({ error: 'Usuário já curtiu este projeto' });
        }

        const result = await pool.query(
            'INSERT INTO curtida (usuario_id, projeto_id) VALUES ($1, $2) RETURNING *',
            [usuario_id, projeto_id]
        );
        // NOVO: Criar notificação para o dono do projeto
        const projeto = await pool.query('SELECT usuario_id FROM projeto WHERE projeto_id = $1', [projeto_id]);
        if (projeto.rows.length > 0 && projeto.rows[0].usuario_id !== usuario_id) {
            await pool.query(
                'INSERT INTO notificacoes (tipo, usuario_origem_id, usuario_destino_id, projeto_id) VALUES ($1, $2, $3, $4)',
                ['curtida', usuario_id, projeto.rows[0].usuario_id, projeto_id]
            );
        }
        console.log('Curtida adicionada com sucesso:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar curtida:', err);
        res.status(500).json({ error: 'Erro ao adicionar curtida' });
    }
});

app.delete('/curtidas/:curtidaId', async (req, res) => {
    const { curtidaId } = req.params;
    console.log('Tentando remover curtida:', curtidaId);

    try {
        const result = await pool.query('DELETE FROM curtida WHERE curtida_id = $1 RETURNING *', [curtidaId]);
        if (result.rows.length === 0) {
            console.log('Curtida não encontrada');
            return res.status(404).json({ error: 'Curtida não encontrada' });
        }
        console.log('Curtida removida com sucesso');
        res.status(200).json({ message: 'Curtida removida com sucesso' });
    } catch (err) {
        console.error('Erro ao remover curtida:', err);
        res.status(500).json({ error: 'Erro ao remover curtida' });
    }
});

app.get('/curtidas/:projetoId', async (req, res) => {
    const { projetoId } = req.params;
    console.log('Buscando curtidas do projeto:', projetoId);

    try {
        const result = await pool.query(
            'SELECT c.*, u.nome as usuario_nome FROM curtida c JOIN usuario u ON c.usuario_id = u.usuario_id WHERE c.projeto_id = $1',
            [projetoId]
        );
        console.log('Curtidas encontradas:', result.rows);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar curtidas:', err);
        res.status(500).json({ error: 'Erro ao buscar curtidas' });
    }
});

// Rotas para comentários
app.post('/comentarios', async (req, res) => {
    const { projeto_id, usuario_id, texto } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO comentario (projeto_id, usuario_id, texto) VALUES ($1, $2, $3) RETURNING *',
            [projeto_id, usuario_id, texto]
        );
        // Buscar informações do usuário para retornar junto com o comentário
        const userInfo = await pool.query(
            'SELECT nome, foto_perfil FROM usuario WHERE usuario_id = $1',
            [usuario_id]
        );

        // Verificar se é uma conexão pelo tipo da requisição
        const isConnection = req.headers['x-request-type'] === 'connection';

        // Só criar notificação se NÃO for uma conexão
        if (!isConnection) {
            const projeto = await pool.query('SELECT usuario_id FROM projeto WHERE projeto_id = $1', [projeto_id]);
            if (projeto.rows.length > 0 && projeto.rows[0].usuario_id !== usuario_id) {
                await pool.query(
                    'INSERT INTO notificacoes (tipo, usuario_origem_id, usuario_destino_id, projeto_id, comentario_texto, comentario_id) VALUES ($1, $2, $3, $4, $5, $6)',
                    ['comentario', usuario_id, projeto.rows[0].usuario_id, projeto_id, texto, result.rows[0].comentario_id]
                );
            }
        }

        const comentario = {
            ...result.rows[0],
            usuario_nome: userInfo.rows[0].nome,
            usuario_foto: userInfo.rows[0].foto_perfil || null
        };
        res.status(201).json(comentario);
    } catch (err) {
        console.error('Erro ao criar comentário:', err);
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
});

app.get('/comentarios/:projeto_id', async (req, res) => {
    const { projeto_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT c.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto 
             FROM comentario c 
             JOIN usuario u ON c.usuario_id = u.usuario_id 
             WHERE c.projeto_id = $1 
             ORDER BY c.data_criacao DESC`,
            [projeto_id]
        );

        // Garantir que foto_perfil seja null quando não existir
        const comentarios = result.rows.map(comentario => ({
            ...comentario,
            usuario_foto: comentario.usuario_foto || null
        }));

        res.json(comentarios);
    } catch (err) {
        console.error('Erro ao buscar comentários:', err);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

app.delete('/comentarios/:comentario_id', async (req, res) => {
    const { comentario_id } = req.params;
    try {
        await pool.query('DELETE FROM comentario WHERE comentario_id = $1', [comentario_id]);
        res.json({ message: 'Comentário excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir comentário:', err);
        res.status(500).json({ error: 'Erro ao excluir comentário' });
    }
});

// Rotas para a tabela mensagem
app.post('/mensagens', async (req, res) => {
    const { remetente_id, destinatario_id, texto } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO mensagem (remetente_id, destinatario_id, texto) VALUES ($1, $2, $3) RETURNING *',
            [remetente_id, destinatario_id, texto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

app.get('/mensagens', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mensagem');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

// Adicionar coluna descricao na tabela usuario se não existir
pool.query(`
    ALTER TABLE usuario 
    ADD COLUMN IF NOT EXISTS descricao TEXT;
`).then(() => {
    console.log('Coluna descricao adicionada ou já existe');
}).catch(err => {
    console.error('Erro ao adicionar coluna descricao:', err);
});

// Rota para atualizar a descrição do usuário
app.put('/usuarios/:id/descricao', async (req, res) => {
    const { id } = req.params;
    const { descricao } = req.body;

    try {
        const result = await pool.query(
            'UPDATE usuario SET descricao = $1 WHERE usuario_id = $2 RETURNING *',
            [descricao, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar descrição do usuário:', err);
        res.status(500).json({ error: 'Erro ao atualizar descrição do usuário' });
    }
});

// Rotas para a tabela vagas
app.post('/vagas', upload.single('logo_empresa'), async (req, res) => {
    console.log('=== Início do processamento da rota POST /vagas ===');
    console.log('Headers:', req.headers);
    console.log('Body completo:', req.body);
    console.log('Arquivo:', req.file);

    try {
        const {
            titulo,
            empresa,
            descricao,
            tipo_trabalho,
            prazo,
            requisitos,
            formato_trabalho,
            duracao_projeto,
            remuneracao,
            diferenciais,
            usuario_id
        } = req.body;

        console.log('Dados extraídos do body:', {
            titulo,
            empresa,
            descricao,
            tipo_trabalho,
            prazo,
            requisitos,
            formato_trabalho,
            duracao_projeto,
            remuneracao,
            diferenciais,
            usuario_id
        });

        // Validações básicas
        if (!titulo || !empresa || !descricao || !tipo_trabalho || !prazo || !usuario_id) {
            console.log('Validação falhou: campos obrigatórios faltando');
            return res.status(400).json({
                error: 'Campos obrigatórios não preenchidos',
                missing: {
                    titulo: !titulo,
                    empresa: !empresa,
                    descricao: !descricao,
                    tipo_trabalho: !tipo_trabalho,
                    prazo: !prazo,
                    usuario_id: !usuario_id
                }
            });
        }

        const logoEmpresaPath = req.file ? `uploads/${req.file.filename.replace(/\\/g, '/')}` : null;
        console.log('Logo empresa path:', logoEmpresaPath);

        // Tratamento dos arrays como JSONB
        let requisitosArray = [];
        let diferenciaisArray = [];

        try {
            if (requisitos && requisitos.trim()) {
                console.log('Processando requisitos:', requisitos);
                const parsedRequisitos = JSON.parse(requisitos);
                requisitosArray = Array.isArray(parsedRequisitos)
                    ? parsedRequisitos.filter(req => req && req.trim())
                    : [requisitos].filter(Boolean);
            }
        } catch (error) {
            console.error('Erro ao processar requisitos:', error);
            requisitosArray = requisitos ? [requisitos].filter(Boolean) : [];
        }

        try {
            if (diferenciais && diferenciais.trim()) {
                console.log('Processando diferenciais:', diferenciais);
                const parsedDiferenciais = JSON.parse(diferenciais);
                diferenciaisArray = Array.isArray(parsedDiferenciais)
                    ? parsedDiferenciais.filter(dif => dif && dif.trim())
                    : [diferenciais].filter(Boolean);
            }
        } catch (error) {
            console.error('Erro ao processar diferenciais:', error);
            diferenciaisArray = diferenciais ? [diferenciais].filter(Boolean) : [];
        }

        console.log('Arrays processados:', {
            requisitosArray,
            diferenciaisArray
        });

        const result = await pool.query(
            `INSERT INTO vagas (
                titulo, empresa, logo_empresa, descricao, 
                tipo_trabalho, prazo, requisitos, usuario_id,
                formato_trabalho, duracao_projeto, remuneracao, diferenciais
            ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12::jsonb) RETURNING *`,
            [
                titulo.trim(),
                empresa.trim(),
                logoEmpresaPath,
                descricao.trim(),
                tipo_trabalho.trim(),
                prazo.trim(),
                JSON.stringify(requisitosArray),
                usuario_id,
                formato_trabalho ? formato_trabalho.trim() : null,
                duracao_projeto ? duracao_projeto.trim() : null,
                remuneracao ? remuneracao.trim() : null,
                JSON.stringify(diferenciaisArray)
            ]
        );

        console.log('Vaga criada com sucesso:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro detalhado ao criar vaga:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            detail: err.detail,
            table: err.table,
            constraint: err.constraint
        });

        // Tenta identificar o tipo de erro
        let errorMessage = 'Erro ao criar vaga';
        if (err.code === '23505') {
            errorMessage = 'Já existe uma vaga com essas informações';
        } else if (err.code === '23503') {
            errorMessage = 'Usuário não encontrado';
        } else if (err.code === '22P02') {
            errorMessage = 'Erro ao processar os dados. Por favor, tente novamente.';
        }

        res.status(500).json({
            error: errorMessage,
            details: err.message,
            code: err.code
        });
    }
});

app.get('/vagas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto
            FROM vagas v
            LEFT JOIN usuario u ON v.usuario_id = u.usuario_id
            ORDER BY v.created_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar vagas:', err);
        res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
});

// Rota de busca para vagas
app.get('/vagas/busca', async (req, res) => {
    try {
        const { q } = req.query; // q = query de busca

        if (!q || q.trim() === '') {
            // Se não há termo de busca, retorna todas as vagas
            const result = await pool.query(`
                SELECT v.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto
                FROM vagas v
                LEFT JOIN usuario u ON v.usuario_id = u.usuario_id
                ORDER BY v.created_at DESC
            `);
            return res.status(200).json(result.rows);
        }

        const searchTerm = `%${q}%`;
        const result = await pool.query(`
            SELECT v.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto
            FROM vagas v
            LEFT JOIN usuario u ON v.usuario_id = u.usuario_id
            WHERE v.titulo ILIKE $1 
               OR v.empresa ILIKE $1 
               OR v.descricao ILIKE $1 
               OR v.tipo_trabalho ILIKE $1
               OR v.formato_trabalho ILIKE $1
            ORDER BY v.created_at DESC
        `, [searchTerm]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar vagas:', err);
        res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
});

app.get('/vagas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validação do ID
        const vagaId = parseInt(id);
        if (isNaN(vagaId)) {
            return res.status(400).json({ error: 'ID da vaga inválido' });
        }

        const result = await pool.query(`
            SELECT v.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto
            FROM vagas v
            LEFT JOIN usuario u ON v.usuario_id = u.usuario_id
            WHERE v.vaga_id = $1
        `, [vagaId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vaga não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar vaga:', error);
        res.status(500).json({ error: 'Erro ao buscar vaga' });
    }
});

// Rotas para a tabela conexoes
app.post('/conexoes/vagas/:vagaId', async (req, res) => {
    try {
        const { vagaId } = req.params;
        const { usuario_id, mensagem, link_portfolio, tipo_conexao } = req.body;

        // Verificar se a vaga existe
        const vagaResult = await pool.query('SELECT * FROM vagas WHERE vaga_id = $1', [vagaId]);
        if (vagaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vaga não encontrada' });
        }

        // Verificar se o usuário já tem uma conexão pendente para esta vaga
        const conexaoExistente = await pool.query(
            'SELECT * FROM conexoes WHERE vaga_id = $1 AND usuario_id = $2 AND status = $3',
            [vagaId, usuario_id, 'pendente']
        );

        if (conexaoExistente.rows.length > 0) {
            return res.status(400).json({ error: 'Você já tem uma solicitação pendente para esta vaga' });
        }

        // Criar a conexão
        const result = await pool.query(
            'INSERT INTO conexoes (vaga_id, usuario_id, mensagem, link_portfolio, tipo_conexao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [vagaId, usuario_id, mensagem, link_portfolio, tipo_conexao]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar conexão:', error);
        res.status(500).json({ error: 'Erro ao criar conexão' });
    }
});

app.get('/conexoes/vagas/:vagaId', async (req, res) => {
    try {
        const { vagaId } = req.params;
        const result = await pool.query(`
            SELECT c.*, u.nome as usuario_nome, u.foto_perfil as usuario_foto
            FROM conexoes c
            LEFT JOIN usuario u ON c.usuario_id = u.usuario_id
            WHERE c.vaga_id = $1
            ORDER BY c.created_at DESC
        `, [vagaId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar conexões:', error);
        res.status(500).json({ error: 'Erro ao buscar conexões' });
    }
});

app.get('/minhas-conexoes', async (req, res) => {
    try {
        const { usuario_id } = req.query;
        const result = await pool.query(`
            SELECT c.*, v.titulo as vaga_titulo, v.empresa as vaga_empresa, v.logo_empresa
            FROM conexoes c
            JOIN vagas v ON c.vaga_id = v.vaga_id
            WHERE c.usuario_id = $1
            ORDER BY c.created_at DESC
        `, [usuario_id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar minhas conexões:', error);
        res.status(500).json({ error: 'Erro ao buscar minhas conexões' });
    }
});

app.put('/conexoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            'UPDATE conexoes SET status = $1 WHERE conexao_id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Conexão não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar conexão:', error);
        res.status(500).json({ error: 'Erro ao atualizar conexão' });
    }
});

// ROTA: Buscar notificações do usuário (curtidas e comentários)
app.get('/usuarios/:id/notificacoes', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`            SELECT n.*, 
                   u.nome as usuario_nome, 
                   u.foto_perfil as usuario_foto,
                   p.titulo as projeto_titulo
            FROM notificacoes n
            JOIN usuario u ON n.usuario_origem_id = u.usuario_id
            JOIN projeto p ON n.projeto_id = p.projeto_id
            WHERE n.usuario_destino_id = $1
            ORDER BY n.data_criacao DESC
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        res.status(500).json({ error: 'Erro ao buscar notificações' });
    }
});

app.delete('/notificacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notificacoes WHERE notificacao_id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover notificação' });
    }
});

// --- CONEXÃO ENTRE USUÁRIOS ---
app.post('/conexoes', async (req, res) => {
    const { senderId, recipientId, projetoId, reason, link, connectionType } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO user_connections 
                (sender_id, recipient_id, projeto_id, reason, link, connection_type) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [senderId, recipientId, projetoId, reason, link, connectionType]
        );
        // Criar notificação apenas de conexão
        await pool.query(
            `INSERT INTO notificacoes 
                (tipo, usuario_origem_id, usuario_destino_id, projeto_id, mensagem) 
             VALUES ($1, $2, $3, $4, $5)`,
            ['conexao', senderId, recipientId, projetoId, reason]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar conexão:', err);
        res.status(500).json({ error: 'Erro ao criar conexão' });
    }
});

app.get('/usuarios/:id/conexoes-recebidas', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT uc.*, 
                    u.nome as sender_nome, 
                    u.foto_perfil as sender_foto,
                    p.titulo as projeto_titulo
             FROM user_connections uc
             JOIN usuario u ON uc.sender_id = u.usuario_id
             LEFT JOIN projeto p ON uc.projeto_id = p.projeto_id
             WHERE uc.recipient_id = $1
             ORDER BY uc.created_at DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar conexões recebidas' });
    }
});

app.put('/conexoes/:id/aceitar', async (req, res) => {
    const { id } = req.params;
    try {
        // Atualiza status
        const result = await pool.query(
            `UPDATE user_connections SET status = 'aceita' WHERE id = $1 RETURNING *`,
            [id]
        );
        const conexao = result.rows[0];
        // Cria chat se não existir
        const chatExist = await pool.query(
            `SELECT * FROM user_chats WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
            [conexao.sender_id, conexao.recipient_id]
        );
        let chat;
        if (chatExist.rows.length > 0) {
            chat = chatExist.rows[0];
        } else {
            const chatRes = await pool.query(
                `INSERT INTO user_chats (user1_id, user2_id) VALUES ($1, $2) RETURNING *`,
                [conexao.sender_id, conexao.recipient_id]
            );
            chat = chatRes.rows[0];
        }
        res.json({ conexao, chat });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar conexão' });
    }
});

app.put('/conexoes/:id/recusar', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE user_connections SET status = 'recusada' WHERE id = $1 RETURNING *`,
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao recusar conexão' });
    }
});

// --- CHAT ENTRE USUÁRIOS ---
app.get('/chats/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(`            SELECT c.*, 
                u1.nome as user1_nome, u1.foto_perfil as user1_foto,
                u2.nome as user2_nome, u2.foto_perfil as user2_foto
            FROM user_chats c
            JOIN usuario u1 ON c.user1_id = u1.usuario_id
            JOIN usuario u2 ON c.user2_id = u2.usuario_id
            WHERE c.user1_id = $1 OR c.user2_id = $1
            ORDER BY c.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar chats do usuário' });
    }
});

app.post('/chats', async (req, res) => {
    const { user1_id, user2_id } = req.body;
    try {
        const existing = await pool.query(
            `SELECT * FROM user_chats WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
            [user1_id, user2_id]
        );
        if (existing.rows.length > 0) {
            return res.json(existing.rows[0]);
        }
        const result = await pool.query(
            `INSERT INTO user_chats (user1_id, user2_id) VALUES ($1, $2) RETURNING *`,
            [user1_id, user2_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar chat' });
    }
});

app.post('/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    const { sender_id, message } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO user_messages (chat_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *`,
            [chatId, sender_id, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

app.get('/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    try {
        // Buscar mensagens com informações dos usuários diretamente
        const result = await pool.query(
            `SELECT m.*, 
                u.nome as sender_nome,
                u.foto_perfil as sender_foto
            FROM user_messages m
            JOIN usuario u ON m.sender_id = u.usuario_id
            WHERE m.chat_id = $1 
            ORDER BY m.created_at ASC`,
            [chatId]
        );

        console.log('Mensagens encontradas:', result.rows); // Debug
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

app.get('/chats/:chatId', async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await pool.query(`
            SELECT c.*, 
                u1.nome as user1_nome, u1.foto_perfil as user1_foto,
                u2.nome as user2_nome, u2.foto_perfil as user2_foto
            FROM user_chats c
            JOIN usuario u1 ON c.user1_id = u1.usuario_id
            JOIN usuario u2 ON c.user2_id = u2.usuario_id
            WHERE c.id = $1
        `, [chatId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Chat não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar chat:', err);
        res.status(500).json({ error: 'Erro ao buscar chat' });
    }
});

// Aceitar convite de colaborador
app.post('/notificacoes/:id/aceitar-convite', async (req, res) => {
    const { id } = req.params;
    try {
        console.log('[ACEITAR CONVITE] Iniciando processo para notificação', id);
        // Busca a notificação
        const notifRes = await pool.query('SELECT * FROM notificacoes WHERE notificacao_id = $1', [id]);
        if (notifRes.rows.length === 0) {
            console.log('[ACEITAR CONVITE] Notificação não encontrada:', id);
            return res.status(404).json({ error: 'Notificação não encontrada' });
        }
        const notif = notifRes.rows[0];
        console.log('[ACEITAR CONVITE] Notificação encontrada:', notif);
        // Verifica se já é colaborador
        const existing = await pool.query(
            'SELECT * FROM usuario_projeto WHERE usuario_id = $1 AND projeto_id = $2',
            [notif.usuario_destino_id, notif.projeto_id]
        );
        console.log('[ACEITAR CONVITE] Já é colaborador?', existing.rows.length > 0);
        if (existing.rows.length === 0) {
            // Buscar o tipo do usuário convidado para usar como papel
            const userTipoRes = await pool.query(
                'SELECT tipo FROM usuario WHERE usuario_id = $1',
                [notif.usuario_destino_id]
            );
            let papel = 'programador';
            if (userTipoRes.rows.length > 0 && (userTipoRes.rows[0].tipo === 'designer' || userTipoRes.rows[0].tipo === 'programador')) {
                papel = userTipoRes.rows[0].tipo;
            }
            console.log('[ACEITAR CONVITE] Valor final de papel antes do insert:', papel);
            await pool.query(
                'INSERT INTO usuario_projeto (usuario_id, projeto_id, papel) VALUES ($1, $2, $3)',
                [notif.usuario_destino_id, notif.projeto_id, papel]
            );
            console.log('[ACEITAR CONVITE] Usuário adicionado como colaborador:', notif.usuario_destino_id, notif.projeto_id, papel);
        }
        // Remove a notificação
        await pool.query('DELETE FROM notificacoes WHERE notificacao_id = $1', [id]);
        console.log('[ACEITAR CONVITE] Notificação removida:', id);
        res.json({ success: true });
    } catch (error) {
        console.error('[ACEITAR CONVITE] Erro ao aceitar convite:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            table: error.table,
            constraint: error.constraint,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Erro ao aceitar convite',
            details: error.message,
            code: error.code,
            detail: error.detail,
            table: error.table,
            constraint: error.constraint
        });
    }
});

// Recusar convite de colaborador
app.post('/notificacoes/:id/recusar-convite', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notificacoes WHERE notificacao_id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao recusar convite', details: error.message });
    }
});

// Rota para buscar todos os participantes (donos e colaboradores) de um projeto
app.get('/projetos/:id/participantes', async (req, res) => {
    const { id } = req.params;
    try {
        // Dono do projeto
        const donoRes = await pool.query(
            `SELECT u.usuario_id, u.nome, u.foto_perfil, 'dono' as papel
             FROM projeto p
             JOIN usuario u ON p.usuario_id = u.usuario_id
             WHERE p.projeto_id = $1`, [id]
        );
        // Colaboradores
        const colabRes = await pool.query(
            `SELECT u.usuario_id, u.nome, u.foto_perfil, up.papel
             FROM usuario_projeto up
             JOIN usuario u ON up.usuario_id = u.usuario_id
             WHERE up.projeto_id = $1`, [id]
        );
        // Junta e remove duplicados (caso o dono também seja colaborador)
        const participantes = [
            ...donoRes.rows,
            ...colabRes.rows.filter(c => !donoRes.rows.some(d => d.usuario_id === c.usuario_id))
        ];
        res.json(participantes);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar participantes' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


