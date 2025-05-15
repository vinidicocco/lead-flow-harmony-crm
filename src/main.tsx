
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Adicionar variáveis CSS para as cores da Neoin
document.documentElement.style.setProperty('--neoin', '#FFD200');
document.documentElement.style.setProperty('--neoin-dark', '#E5BD00');
document.documentElement.style.setProperty('--neoin-light', '#FFDD4D');

createRoot(document.getElementById("root")!).render(<App />);
