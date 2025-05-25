import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage'; // Import the new CadastroPage
import PortfolioPage from './pages/PortfolioPage';
import VagasPage from './pages/VagasPage';
import AprendizagemPage from './pages/AprendizagemPage';
import UserProfilePage from './pages/UserProfilePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import VagaDetailPage from './pages/VagaDetailPage';
import ConexaoPage from './pages/ConexaoPage';
import NovoProjetoPage from './pages/NovoProjetoPage';
// Import other pages as they are created
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'; // Configuração da URL base do backend

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} /> {/* Add route for CadastroPage */}
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:projectId" element={<ProjectDetailPage />} />
        <Route path="/portfolio/novo" element={<NovoProjetoPage />} />
        <Route path="/vagas" element={<VagasPage />} />
        <Route path="/vagas/:vagaId" element={<VagaDetailPage />} />
        <Route path="/aprendizagem" element={<AprendizagemPage />} />
        <Route path="/perfil/:userId" element={<UserProfilePage />} />
        <Route path="/conexao" element={<ConexaoPage />} />
        {/* Add other routes here */}
      </Routes>
    </Layout>
  );
}

export default App;