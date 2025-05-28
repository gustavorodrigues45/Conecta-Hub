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
    const fotoPerfilPath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename.replace(/\\/g, '/')}` : null; // Ensure forward slashes
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

    const { titulo, descricao, link_figma, link_github, link_drive, briefing_id } = req.body;
    const imagemCapaPath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename.replace(/\\/g, '/')}` : null; // Replace backslashes with forward slashes

    // Converta briefing_id vazio para NULL
    const briefingIdValue = briefing_id === '' ? null : briefing_id;

    try {
        const result = await pool.query(
            'INSERT INTO projeto (titulo, descricao, imagem_capa, link_figma, link_github, link_drive, briefing_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [titulo, descricao, imagemCapaPath, link_figma, link_github, link_drive, briefingIdValue]
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
    try {
        const result = await pool.query(
            'INSERT INTO curtida (usuario_id, projeto_id) VALUES ($1, $2) RETURNING *',
            [usuario_id, projeto_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao curtir o projeto' });
    }
});

app.get('/curtidas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM curtida');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar curtidas' });
    }
});

// Rotas para a tabela comentario
app.post('/comentarios', async (req, res) => {
    const { usuario_id, projeto_id, texto } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO comentario (usuario_id, projeto_id, texto) VALUES ($1, $2, $3) RETURNING *',
            [usuario_id, projeto_id, texto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao adicionar comentário' });
    }
});

app.get('/comentarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comentario');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
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
