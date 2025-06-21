ALTER TABLE vagas
ADD COLUMN IF NOT EXISTS formato_trabalho TEXT,
ADD COLUMN IF NOT EXISTS duracao_projeto TEXT,
ADD COLUMN IF NOT EXISTS remuneracao TEXT,
ADD COLUMN IF NOT EXISTS diferenciais TEXT,
ALTER COLUMN requisitos TYPE JSONB USING CASE 
    WHEN requisitos IS NULL THEN '[]'::JSONB
    WHEN requisitos ~ '^\\[.*\\]$' THEN requisitos::JSONB
    ELSE ('["' || requisitos || '"]')::JSONB
END,
ALTER COLUMN diferenciais TYPE JSONB USING CASE 
    WHEN diferenciais IS NULL THEN '[]'::JSONB
    WHEN diferenciais ~ '^\\[.*\\]$' THEN diferenciais::JSONB
    ELSE ('["' || diferenciais || '"]')::JSONB
END; 