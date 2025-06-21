CREATE TABLE IF NOT EXISTS conexoes (
    conexao_id SERIAL PRIMARY KEY,
    vaga_id INTEGER REFERENCES vagas(vaga_id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    link_portfolio VARCHAR(255) NOT NULL,
    tipo_conexao VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 