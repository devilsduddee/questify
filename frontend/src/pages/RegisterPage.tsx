import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'
import { MotionButton } from '@/components/ui/button'
import { RoleSelection } from '@/components/common/RoleSelection'
import { AvatarSelection } from '@/components/common/AvatarSelection'
import { SlideUp } from '@/components/common/AnimationWrapper'
import { ArrowLeft } from 'lucide-react'
import authBg from '@/assets/auth-bg.png'

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !selectedAvatar) {
      setError("Silakan lengkapi pilihan avatar dan kelas petualangmu terlebih dahulu.")
      return
    }
    setLoading(true)
    setError(null)
    
    logger.info('Auth', '📝 Registration started')
    logger.info('Auth', `🎭 Selected role: ${selectedRole}`)
    logger.info('Auth', '⏳ Creating account...')

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || 'Hero',
          role: selectedRole,
          avatar_id: selectedAvatar
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      // Force update the profile record to ensure trigger didn't miss it
      const sessionData = await supabase.auth.getSession()
      const user = sessionData.data.session?.user
      
      if (user) {
        await supabase.from('profiles').update({
          display_name: displayName || 'Hero',
          role: selectedRole
        }).eq('id', user.id)
      }
      
      logger.success('Auth', '✅ Registration successful')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-y-auto py-12 bg-slate-950" style={{ backgroundImage: `url(${authBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-0" />

      {/* Back Button */}
      <Link to="/" className="fixed top-6 left-6 z-50 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-400 transition-all shadow-lg group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none fixed z-0" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-secondary rounded-full animate-float opacity-50 fixed" style={{ animationDelay: "0s" }} />
      <div className="absolute top-[60%] right-[20%] w-3 h-3 bg-primary rounded-full animate-float opacity-50 fixed" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[20%] left-[30%] w-2 h-2 bg-success rounded-full animate-float opacity-50 fixed" style={{ animationDelay: "2s" }} />
      
      <div className="z-10 w-full max-w-2xl bg-card border-[3px] border-primary shadow-glow-quest pixel-borders p-6 md:p-8 flex flex-col gap-6 relative mt-16">
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
                className="bg-slate-900/90 border-2 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl px-4 py-3 placeholder:text-slate-500 shadow-inner w-full transition-all"
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
                placeholder="e.g. arthur@hero.com"
                className="bg-slate-900/90 border-2 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl px-4 py-3 placeholder:text-slate-500 shadow-inner w-full transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Avatar Selection */}
            <div className="flex flex-col gap-2 pt-2 md:col-span-2">
              <SlideUp>
                <AvatarSelection 
                  selectedAvatar={selectedAvatar} 
                  onSelectAvatar={setSelectedAvatar} 
                />
              </SlideUp>
            </div>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50 md:col-span-2">
              <label className="font-pixel text-xs text-muted-foreground uppercase">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                className="bg-slate-900/90 border-2 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl px-4 py-3 placeholder:text-slate-500 shadow-inner w-full transition-all"
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
