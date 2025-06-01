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
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to the database');
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
        const result = await pool.query('SELECT * FROM usuario');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
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
    const { usuario_id, projeto_id, papel } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuario_projeto (usuario_id, projeto_id, papel) VALUES ($1, $2, $3) RETURNING *',
            [usuario_id, projeto_id, papel]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao associar usuário ao projeto' });
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
