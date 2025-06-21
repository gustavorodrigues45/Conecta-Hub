import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage'; // Import the new CadastroPage
import PortfolioPage from './pages/PortfolioPage';
import VagasPage from './pages/VagasPage';
import AprendizagemPage from './pages/AprendizagemPage';
import UserProfilePage from './pages/UserProfilePage';
import VagaDetailPage from './pages/VagaDetailPage';
import CriarVagaPage from './pages/CriarVagaPage';
import ConexaoPage from './pages/ConexaoPage';
import NovoProjetoPage from './pages/NovoProjetoPage';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import axios from 'axios';
import PortfolioProjectPage from './pages/PortfolioProjectPage';
import EditarProjetoPage from './pages/EditarProjetoPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

// Import other pages as they are created
axios.defaults.baseURL = 'http://localhost:5000'; // Configuração da URL base do backend

function App() {
  return (
    <UserProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} /> {/* Add route for CadastroPage */}
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:projectId" element={<PortfolioProjectPage />} />
          <Route path="/portfolio/novo" element={<NovoProjetoPage />} />
          <Route path="/portfolio/:projectId/editar" element={<EditarProjetoPage />} />
          <Route path="/vagas" element={<VagasPage />} />
          <Route path="/vagas/criar" element={<CriarVagaPage />} />
          <Route path="/vagas/:vagaId" element={<VagaDetailPage />} />
          <Route path="/aprendizagem" element={<AprendizagemPage />} />
          <Route path="/perfil/:userId" element={<UserProfilePage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/conexao" element={<ConexaoPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </UserProvider>
  );
}

export default App;