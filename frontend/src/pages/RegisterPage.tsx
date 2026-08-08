import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { MotionButton } from '@/components/ui/button'
import { RoleSelection } from '@/components/common/RoleSelection'
import { SlideUp } from '@/components/common/AnimationWrapper'

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) {
      setError("Silakan pilih kelas petualangmu terlebih dahulu.")
      return
    }
    setLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || 'Hero',
          role: selectedRole
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0 pointer-events-none fixed" />
      
      <div className="z-10 w-full max-w-2xl bg-card border-[3px] border-primary shadow-glow-quest pixel-borders p-6 md:p-8 flex flex-col gap-6 relative">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-primary text-glow mb-2">CREATE HERO</h1>
          <p className="font-pixel text-xs text-muted-foreground uppercase tracking-widest">Begin Your Journey</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive font-pixel text-xs p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-pixel text-xs text-muted-foreground uppercase">Hero Name</label>
              <input 
                type="text" 
                required
                className="bg-background-deep border-2 border-border p-3 font-sans text-foreground focus:outline-none focus:border-primary transition-colors"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Arthur"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-pixel text-xs text-muted-foreground uppercase">Email</label>
              <input 
                type="email" 
                required
                className="bg-background-deep border-2 border-border p-3 font-sans text-foreground focus:outline-none focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-pixel text-xs text-muted-foreground uppercase">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                className="bg-background-deep border-2 border-border p-3 font-sans text-foreground focus:outline-none focus:border-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 mt-2">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl text-secondary text-glow mb-1">PILIH KELASMU</h2>
              <p className="font-sans text-xs text-muted-foreground">Kekuatanmu menentukan takdir perjalananmu ke depan.</p>
            </div>
            <RoleSelection selectedRole={selectedRole} onSelectRole={setSelectedRole} />
          </div>

          <SlideUp>
            <MotionButton 
              type="submit" 
              className="w-full mt-4 font-pixel py-5 text-lg tracking-widest shadow-glow-quest" 
              disabled={loading}
            >
              {loading ? 'FORGING...' : 'CREATE ACCOUNT'}
            </MotionButton>
          </SlideUp>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="font-pixel text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase">
            Already have a character? Login
          </Link>
        </div>
      </div>
    </div>
  )
}
