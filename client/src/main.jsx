import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './pages/App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';

// Admin carregado apenas quando a rota /admin for acessada
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const ProtectedRoute = lazy(() => import('./components/admin-components/ProtectedRoute.jsx'));

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
          <Route path="/admin" element={
            <Suspense fallback={null}>
              <AdminLogin />
            </Suspense>
          } />
          <Route path="/admin/dashboard" element={
            <Suspense fallback={null}>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)