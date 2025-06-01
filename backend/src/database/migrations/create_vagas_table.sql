CREATE TABLE IF NOT EXISTS vagas (
    vaga_id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    logo_empresa VARCHAR(255),
    descricao TEXT NOT NULL,
    tipo_trabalho VARCHAR(50) NOT NULL,
    prazo VARCHAR(50) NOT NULL,
    requisitos JSON,
    usuario_id INTEGER REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 