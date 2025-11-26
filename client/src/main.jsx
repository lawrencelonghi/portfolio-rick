import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./i18n.js"; // load translations

// Aplicar o polyfill ANTES de qualquer coisa
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

// Forçar o polyfill mesmo que o navegador diga que suporta
window.__forceSmoothScrollPolyfill__ = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
