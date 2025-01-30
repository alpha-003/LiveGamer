import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { profile, loading } = useAuthStore()
  
  useEffect(() => {
    if (!loading && (!profile || !profile.is_admin)) {
      navigate('/')
    }
  }, [loading, profile, navigate])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  return profile?.is_admin ? <>{children}</> : null
}