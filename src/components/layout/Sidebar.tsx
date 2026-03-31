'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X,
  Wallet,
  Home,
  PlusCircle,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lancamentos', label: 'Lançamentos', icon: Receipt },
  { href: '/relatorios', label: 'Relatórios', icon: TrendingUp },
]

interface SidebarProps {
  onMemberChange?: (member: string) => void
  zapOptions?: string[]
  selectedMember?: string
}

export function Sidebar({ onMemberChange, zapOptions = [], selectedMember = '' }: SidebarProps) {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl text-white shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-[280px] bg-[#1A1A1A] border-r border-[#2D2D2D] flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2D2D2D]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-lg font-semibold text-white">ContAI</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "text-zinc-400 hover:text-white hover:bg-[#252525]"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {zapOptions.length > 0 && (
          <div className="px-4 pb-3">
            <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
              Filtrar membro
            </label>
            <select
              value={selectedMember}
              onChange={(e) => onMemberChange?.(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos</option>
              {zapOptions.map((zap) => (
                <option key={zap} value={zap}>{zap}</option>
              ))}
            </select>
          </div>
        )}

        <div className="p-4 border-t border-[#2D2D2D]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-medium text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0] || 'Usuário'}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A1A] border-t border-[#2D2D2D] px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {[
            { href: '/dashboard', label: 'Home', icon: Home },
            { href: '/lancamentos', label: 'Gastos', icon: PlusCircle },
            { href: '/relatorios', label: 'Dados', icon: BarChart3 },
          ].map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[70px]",
                  isActive
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-zinc-500"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
