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
  const { setSession, setInitialized, setIsCloudLoading } = useAuthStore()

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        setIsCloudLoading(true)
        const profile = await cloudSyncService.fetchCloudProfile()
        const adventures = await cloudSyncService.fetchCloudAdventures()
        
        if (profile) usePlayerStore.getState().loadFromCloud(profile)
        useAdventureStore.getState().loadFromCloud(adventures)
        setIsCloudLoading(false)
      }
      setInitialized(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      
      if (event === 'SIGNED_IN' && session) {
        setIsCloudLoading(true)
        const profile = await cloudSyncService.fetchCloudProfile()
        const adventures = await cloudSyncService.fetchCloudAdventures()
        
        if (profile) usePlayerStore.getState().loadFromCloud(profile)
        useAdventureStore.getState().loadFromCloud(adventures)
        setIsCloudLoading(false)
      } else if (event === 'SIGNED_OUT') {
        // Securely reset all runtime state from memory
        usePlayerStore.getState().resetPlayer()
        useAdventureStore.getState().resetAdventures()
        useBattleStore.getState().resetBattle()
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setInitialized, setIsCloudLoading])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <RouterProvider router={router} />
      <AchievementPopup />
      <RoleSelectionModal />
    </div>
  );
}

export default App;
