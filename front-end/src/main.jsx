import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'



import './index.css'
import './css/Global/Variables.css';
import App from './App.jsx'
import { ContextProvider } from './services/Context.jsx';
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContextProvider>

        <App />
      </ContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
