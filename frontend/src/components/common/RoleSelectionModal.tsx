import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { usePlayerStore } from '@/store/usePlayerStore'
import { RoleSelection } from './RoleSelection'
import { MotionButton } from '@/components/ui/button'

export const RoleSelectionModal: React.FC = () => {
  const { session, isInitialized, isCloudLoading } = useAuthStore()
  const { role, setRole } = usePlayerStore()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  
  // Only show if user is fully logged in, initialized, cloud sync finished, and role is still null
  const shouldShow = isInitialized && session && !isCloudLoading && role === null
  
  if (!shouldShow) return null

  const handleConfirm = () => {
    if (selectedRole) {
      setRole(selectedRole)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border-2 border-primary shadow-glow-quest pixel-borders max-w-4xl w-full p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center">
            <h2 className="font-heading text-4xl text-secondary text-glow mb-2">PEMBENTUKAN KARAKTER</h2>
            <p className="font-sans text-muted-foreground">Petualang, pilih kelasmu sebelum memasuki dunia.</p>
          </div>

          <div className="bg-primary/10 border border-primary/30 p-4 font-pixel text-[10px] text-primary mb-2 text-center uppercase tracking-widest">
            Peran ini akan menentukan gaya bercerita AI dalam petualanganmu selanjutnya.
          </div>

          <RoleSelection selectedRole={selectedRole} onSelectRole={setSelectedRole} />

          <div className="flex justify-center mt-4">
            <MotionButton
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedRole}
              className="px-12 py-4 font-pixel text-lg shadow-glow-quest"
            >
              LANJUTKAN PETUALANGAN
            </MotionButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
