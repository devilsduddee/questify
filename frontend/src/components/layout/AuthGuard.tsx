import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export const AuthGuard: React.FC = () => {
  const { session, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow-quest mb-4"></div>
        <p className="font-pixel text-sm text-primary animate-pulse">Loading Cloud Save...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
