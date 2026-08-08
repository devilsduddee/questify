import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  isInitialized: boolean
  isCloudLoading: boolean
  
  setSession: (session: Session | null) => void
  setInitialized: (val: boolean) => void
  setIsCloudLoading: (val: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isInitialized: false,
  isCloudLoading: false,

  setSession: (session) => set({ 
    session, 
    user: session?.user || null,
    isInitialized: true
  }),
  
  setInitialized: (val) => set({ isInitialized: val }),
  setIsCloudLoading: (val) => set({ isCloudLoading: val })
}))
