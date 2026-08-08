import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { MotionButton } from '@/components/ui/button'

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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0 pointer-events-none" />
      
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
              className="bg-background-deep border-2 border-border p-3 font-sans text-foreground focus:outline-none focus:border-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-pixel text-xs text-muted-foreground uppercase">Password</label>
            <input 
              type="password" 
              required
              className="bg-background-deep border-2 border-border p-3 font-sans text-foreground focus:outline-none focus:border-primary transition-colors"
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
