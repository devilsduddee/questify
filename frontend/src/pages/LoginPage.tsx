import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'
import { MotionButton } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import authBg from '@/assets/auth-bg.png'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    logger.info('Auth', '🔐 Login started')
    logger.info('Auth', '⏳ Authenticating...')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      logger.success('Auth', '✅ Login successful')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950" style={{ backgroundImage: `url(${authBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-0" />

      {/* Back Button */}
      <Link to="/" className="fixed top-6 left-6 z-50 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-400 transition-all shadow-lg group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-secondary rounded-full animate-float opacity-50" style={{ animationDelay: "0s" }} />
      <div className="absolute top-[60%] right-[20%] w-3 h-3 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[20%] left-[30%] w-2 h-2 bg-success rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      
      <div className="z-10 w-full max-w-md bg-card border-[3px] border-secondary shadow-panel pixel-borders p-8 flex flex-col gap-6 relative">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-secondary text-glow mb-2">LOGIN</h1>
          <p className="font-pixel text-xs text-muted-foreground uppercase tracking-widest">Enter the Realm</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive font-pixel text-xs p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          
          <div className="flex flex-col gap-2">
            <label className="font-pixel text-xs text-muted-foreground uppercase">Password</label>
            <input 
              type="password" 
              required
              className="bg-slate-900/90 border-2 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white rounded-xl px-4 py-3 placeholder:text-slate-500 shadow-inner w-full transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <MotionButton 
            type="submit" 
            className="w-full mt-4 font-pixel py-4" 
            disabled={loading}
          >
            {loading ? 'LOADING...' : 'ENTER'}
          </MotionButton>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="font-pixel text-[10px] text-muted-foreground hover:text-secondary transition-colors uppercase">
            New here? Create Character
          </Link>
        </div>
      </div>
    </div>
  )
}
