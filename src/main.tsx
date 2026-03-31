import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RoadmapProvider } from './context/RoadmapContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoadmapProvider>
      <App />
    </RoadmapProvider>
  </StrictMode>
);
