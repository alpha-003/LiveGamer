import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './components/AuthGuard'
import { AdminGuard } from './components/AdminGuard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Matches } from './pages/Matches'
import { Profile } from './pages/Profile'
import { Wallet } from './pages/Wallet'
import { AdminPanel } from './pages/AdminPanel'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        
        <Route path="/matches" element={
          <AuthGuard>
            <Matches />
          </AuthGuard>
        } />
        
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
        
        <Route path="/wallet" element={
          <AuthGuard>
            <Wallet />
          </AuthGuard>
        } />

        <Route path="/admin" element={
          <AuthGuard>
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          </AuthGuard>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App