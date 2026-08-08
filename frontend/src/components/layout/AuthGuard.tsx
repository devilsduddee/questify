import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export const AuthGuard: React.FC = () => {
  const { session, appStatus } = useAuthStore()

  if (appStatus === 'BOOTING') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow-quest mb-4"></div>
        <p className="font-pixel text-sm text-primary animate-pulse">Memeriksa Koneksi...</p>
      </div>
    )
  }

  if (appStatus === 'HYDRATING') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin shadow-glow-quest mb-4"></div>
        <p className="font-pixel text-sm text-secondary animate-pulse">Memulihkan Perjalananmu...</p>
      </div>
    )
  }

  if (appStatus === 'ERROR') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-destructive mb-4">
          <span className="material-symbols-outlined text-6xl">error</span>
        </div>
        <h2 className="font-heading text-2xl text-destructive mb-2">GERBANG DUNIA GAGAL DIBUKA</h2>
        <p className="font-sans text-muted-foreground mb-6">Terjadi kesalahan saat memuat data dari Supabase.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-secondary/20 border border-secondary text-secondary rounded hover:bg-secondary/40 font-pixel text-sm"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  if (appStatus === 'UNAUTHENTICATED' || !session) {
    return <Navigate to="/login" replace />
  }

  // Only render children if READY
  if (appStatus === 'READY') {
    return <Outlet />
  }

  return null
}
