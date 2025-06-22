import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import smoothscroll from 'smoothscroll-polyfill';

// Initialize the polyfill for buttery smooth scrolling
smoothscroll.polyfill();

createRoot(document.getElementById("root")!).render(<App />);
