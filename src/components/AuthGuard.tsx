import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { user, loading, initialized, initialize, loadUser, signOut } = useAuthStore()
  
  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  useEffect(() => {
    const handleAuthError = async (error: any) => {
      if (
        error?.message?.includes('refresh_token') || 
        error?.code === 'refresh_token_not_found' ||
        error?.name === 'AuthSessionMissingError'
      ) {
        await signOut()
        navigate('/login', { replace: true })
      }
    }

    if (initialized && !user) {
      const loadUserData = async () => {
        try {
          await loadUser()
        } catch (error) {
          await handleAuthError(error)
        }
      }

      loadUserData()
    }
  }, [initialized, user, loadUser, navigate, signOut])
  
  useEffect(() => {
    if (!loading && !user && initialized) {
      navigate('/login', { replace: true })
    }
  }, [loading, user, initialized, navigate])
  
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  return user ? <>{children}</> : null
}