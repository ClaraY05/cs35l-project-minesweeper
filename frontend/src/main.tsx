import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
