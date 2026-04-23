import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RedirectPage from './components/RedirectPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota do Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Rota Raiz (simples placeholder ou redirect para admin) */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Dynamic Catch-all for Slugs */}
        <Route path="/:slug" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}
