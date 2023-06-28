import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AllItemsProvider } from './AllItemsContext.tsx';
import { AuthProvider } from './AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <AllItemsProvider>
        <App />
      </AllItemsProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
