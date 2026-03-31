'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else {
          setError('Conta criada! Verifique seu email para confirmar.')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('Erro ao processar requisição')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F0F0F]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
      
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-2xl mb-4">
            <Wallet className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">ContAI</h1>
          <p className="text-sm text-zinc-400">Suas finanças em dia</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl border border-[#2D2D2D] p-6">
          <h2 className="text-lg font-semibold text-white mb-5 text-center">
            {isSignUp ? 'Criar conta' : 'Entrar'}
          </h2>

          {error && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${
              error.includes('criada') 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 pr-14 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
            >
              {loading ? 'Processando...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isSignUp 
                ? 'Já tem conta? Entre' 
                : 'Não tem conta? Crie'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
