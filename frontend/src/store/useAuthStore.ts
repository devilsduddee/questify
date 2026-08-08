import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

export type AppStatus = 'BOOTING' | 'HYDRATING' | 'READY' | 'UNAUTHENTICATED' | 'ERROR'

interface AuthState {
  session: Session | null
  user: User | null
  appStatus: AppStatus
  
  setSession: (session: Session | null) => void
  setAppStatus: (status: AppStatus) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  appStatus: 'BOOTING',

  setSession: (session) => set({ 
    session, 
    user: session?.user || null
  }),
  
  setAppStatus: (status) => set({ appStatus: status })
}))
