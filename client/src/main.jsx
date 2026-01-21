import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './pages/App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/admin-components/ProtectedRoute.jsx'

import "./components/home-components/translations/i18n.js"; 
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();
window.__forceSmoothScrollPolyfill__ = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
