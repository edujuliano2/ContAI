'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { useLancamentos } from '@/hooks/useLancamentos'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { filters, updateFilters } = useLancamentos()
  const [zapOptions, setZapOptions] = useState<string[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    )
  }

  const handleMemberChange = (member: string) => {
    updateFilters({ zap: member })
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar 
        onMemberChange={handleMemberChange}
        selectedMember={filters.zap || ''}
        zapOptions={zapOptions}
      />
      <main className="lg:ml-[280px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
