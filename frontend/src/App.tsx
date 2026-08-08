import { RouterProvider, createBrowserRouter, Route, createRoutesFromElements } from "react-router-dom";
import { AdventureListPage } from "./pages/AdventureListPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { AuthGuard } from "./components/layout/AuthGuard"
import { AchievementPopup } from "./components/common/AchievementPopup"
import { RoleSelectionModal } from "./components/common/RoleSelectionModal"
import { useAuthStore } from "./store/useAuthStore"
import { usePlayerStore } from "./store/usePlayerStore"
import { useAdventureStore } from "./store/useAdventureStore"
import { useBattleStore } from "./store/useBattleStore"
import { cloudSyncService } from "./services/cloudSync.service"
import { supabase } from "./lib/supabase"
import { useEffect } from "react"
import { LandingPage } from "./pages/LandingPage"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { SyllabusUpload } from "./features/upload/SyllabusUpload"
import { AdventureMap } from "./features/quest/AdventureMap"
import { QuestPage } from "./pages/QuestPage"
import { BattlePage } from "./pages/BattlePage"
import { logger } from "./utils/logger"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<SyllabusUpload />} />
          <Route path="/adventures" element={<AdventureListPage />} />
          <Route path="/map" element={<AdventureMap />} />
        </Route>
        
        <Route path="/quest/:nodeId" element={<QuestPage />} />
        <Route path="/battle/:nodeId" element={<BattlePage />} />
      </Route>
    </>
  )
)

function App() {
  const { setSession, setAppStatus } = useAuthStore()
  useEffect(() => {
    console.log('[APP] App mounted')
    return () => {
      console.log('[APP] App unmounted')
    }
  }, [])

  useEffect(() => {
    console.log('[APP] status', useAuthStore.getState().appStatus)
  }, [useAuthStore.getState().appStatus])

  useEffect(() => {
    logger.info('Questify', '🚀 Application started')
    logger.info('Auth', '🔍 Checking Supabase session...')
    
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        logger.success('Auth', '✅ Session found')
        logger.info('HYDRATION', '☁️ Hydration START')
        setAppStatus('HYDRATING')
        const startTime = performance.now()
        
        try {
          logger.info('HYDRATION', '👤 Loading profile...')
          const profile = await cloudSyncService.fetchCloudProfile()
          if (profile) {
            usePlayerStore.getState().loadFromCloud(profile)
            logger.info('HYDRATION', '✅ Profile loaded')
            logger.info('HYDRATION', `👤 Role loaded: ${profile.role}`)
          }
          
          const adventures = await cloudSyncService.fetchCloudAdventures()
          useAdventureStore.getState().loadFromCloud(adventures)
          
          const totalNodes = adventures.reduce((acc, curr) => acc + (curr.nodes?.length || 0), 0)
          logger.info('HYDRATION', `📍 Total nodes: ${totalNodes}`)
          
          const duration = ((performance.now() - startTime) / 1000).toFixed(2)
          logger.success('HYDRATION', `✅ Hydration SUCCESS (${duration}s)`)
          setAppStatus('READY')
        } catch (error) {
          logger.error('HYDRATION', '❌ Hydration FAILED')
          setAppStatus('ERROR')
        }
      } else {
        logger.info('Auth', '👤 No active session')
        setAppStatus('UNAUTHENTICATED')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AUTH] auth event = ${event}`)
      const currentStatus = useAuthStore.getState().appStatus
      const currentUser = useAuthStore.getState().user

      setSession(session)
      
      if (event === 'SIGNED_IN' && session) {
        // GUARD: Prevent duplicate hydration on tab switch / visibility change
        if (currentStatus === 'READY' && currentUser?.id === session.user.id) {
          logger.info('Auth', 'ℹ️ Session refresh / Tab focus detected. Skipping hydration.')
          return
        }

        logger.success('Auth', '✅ Login successful')
        logger.info('HYDRATION', '☁️ Hydration START')
        setAppStatus('HYDRATING')
        const startTime = performance.now()
        
        try {
          logger.info('HYDRATION', '👤 Loading profile...')
          const profile = await cloudSyncService.fetchCloudProfile()
          if (profile) {
            usePlayerStore.getState().loadFromCloud(profile)
            logger.info('HYDRATION', '✅ Profile loaded')
            logger.info('HYDRATION', `👤 Role loaded: ${profile.role}`)
          }
          
          const adventures = await cloudSyncService.fetchCloudAdventures()
          useAdventureStore.getState().loadFromCloud(adventures)
          
          const totalNodes = adventures.reduce((acc, curr) => acc + (curr.nodes?.length || 0), 0)
          logger.info('HYDRATION', `📍 Total nodes: ${totalNodes}`)
          
          const duration = ((performance.now() - startTime) / 1000).toFixed(2)
          logger.success('HYDRATION', `✅ Hydration SUCCESS (${duration}s)`)
          setAppStatus('READY')
        } catch (error) {
          logger.error('HYDRATION', '❌ Hydration FAILED')
          setAppStatus('ERROR')
        }
      } else if (event === 'SIGNED_OUT') {
        logger.info('Auth', '🚪 Logout started')
        logger.info('Auth', '🧹 Clearing runtime state...')
        // Securely reset all runtime state from memory
        usePlayerStore.getState().resetPlayer()
        useAdventureStore.getState().resetAdventures()
        useBattleStore.getState().resetBattle()
        setAppStatus('UNAUTHENTICATED')
        logger.success('Auth', '✅ Logout complete')
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setAppStatus])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <RouterProvider router={router} />
      <AchievementPopup />
      <RoleSelectionModal />
    </div>
  );
}

export default App;
