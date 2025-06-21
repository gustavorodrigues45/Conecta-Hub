# Conecta Hub

Conecta Hub é uma plataforma colaborativa para universitários, onde estudantes podem criar portfólios, compartilhar projetos, conectar-se com outros usuários e encontrar oportunidades de vagas.

## Funcionalidades

- Cadastro e login de usuários com upload de foto de perfil
- Criação de projetos com upload de imagem de capa
- Visualização de portfólios de outros usuários
- Associação de projetos a seus criadores
- Integração com links externos (Figma, GitHub, Google Drive)
- Listagem de vagas e oportunidades

## Tecnologias

- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL
- **Upload de Imagens:** Multer

## Como rodar o projeto

### Pré-requisitos

- Node.js (v18+ recomendado)
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd conecta-hub-react-vite
```

### 2. Instale as dependências

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ..
npm install
```

### 3. Rode o backend

```bash
cd backend
npm start
```

O backend estará disponível em `http://localhost:5000`.

### 4. Rode o frontend

Em outro terminal:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Observações

- As imagens de perfil e capa de projeto são salvas na pasta `backend/uploads`.
- Para desenvolvimento local, o frontend faz requisições para o backend em `http://localhost:5000`.
- Ajuste as URLs se necessário para produção.

