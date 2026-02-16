import AppRoutes from './routes/Routes'
import {BrowserRouter as Router} from 'react-router-dom' 
import './index.css'
import { AuthProvider } from './pages/authPage/context/AuthContext'

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
        <main>
          <AppRoutes/>
        </main>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
