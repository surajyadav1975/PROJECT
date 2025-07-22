import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/Authcontext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
   <AuthProvider> 
        <App />
        <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="light"
        />
      </AuthProvider>
  </BrowserRouter>
  </StrictMode>,
)
