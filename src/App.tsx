import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonaProvider } from './context/PersonaContext';
import { ChatProvider } from './context/ChatContext';
import HomePage from './pages/HomePage';
import PersonaSetupPage from './pages/PersonaSetupPage';
import ChatRoomPage from './pages/ChatRoomPage';
import AdminPage from './pages/AdminPage';
import AdminCharacterFormPage from './pages/AdminCharacterFormPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';

export default function App() {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/persona" element={<PersonaSetupPage />} />
            <Route path="/chat/:id" element={<ChatRoomPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/new" element={<AdminCharacterFormPage />} />
            <Route path="/admin/:id" element={<AdminCharacterFormPage />} />
            <Route path="/image-generator" element={<ImageGeneratorPage />} />
          </Routes>
        </ChatProvider>
      </PersonaProvider>
    </BrowserRouter>
  );
}
