'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Medal, Crown, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLancamentos } from '@/hooks/useLancamentos'
import { Card } from '@/components/ui/Card'
import { FiltersBar } from '@/components/ui/Filters'
import { formatCurrency, cn } from '@/lib/utils'
import { useEffect } from 'react'

export default function RelatoriosPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { lancamentos, loading, filters, updateFilters } = useLancamentos()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const zapOptions = useMemo(() => {
    const zaps = new Set(lancamentos.map(l => l.zap).filter(Boolean))
    return Array.from(zaps) as string[]
  }, [lancamentos])

  const rankings = useMemo(() => {
    const categoryTotals = new Map<string, number>()
    const expenseTotals = new Map<string, { despesa: string; valor: number; categoria: string }>()
    const zapTotals = new Map<string, number>()

    lancamentos.forEach(l => {
      const valor = Number(l.valor)
      
      categoryTotals.set(l.categoria, (categoryTotals.get(l.categoria) || 0) + valor)
      
      if (!expenseTotals.has(l.despesa) || expenseTotals.get(l.despesa)!.valor < valor) {
        expenseTotals.set(l.despesa, { despesa: l.despesa, valor, categoria: l.categoria })
      }
      
      if (l.zap) {
        zapTotals.set(l.zap, (zapTotals.get(l.zap) || 0) + valor)
      }
    })

    const topCategories = Array.from(categoryTotals.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    const topExpenses = Array.from(expenseTotals.values())
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10)

    const topZaps = Array.from(zapTotals.entries())
      .map(([zap, total]) => ({ zap, total }))
      .sort((a, b) => b.total - a.total)

    return { topCategories, topExpenses, topZaps }
  }, [lancamentos])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    )
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-4 h-4 text-yellow-500" />
      case 1: return <Medal className="w-4 h-4 text-gray-400" />
      case 2: return <Medal className="w-4 h-4 text-amber-700" />
      default: return <span className="w-4 h-4 text-zinc-600 text-xs font-bold">{index + 1}</span>
    }
  }

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-4 lg:mb-6 pl-12 lg:pl-0">
        <h1 className="text-xl lg:text-2xl font-semibold text-white">Relatórios</h1>
        <p className="text-sm text-zinc-400">Rankings e análises</p>
      </div>

      <div className="mb-4 lg:mb-6">
        <FiltersBar
          filters={filters}
          onFilterChange={updateFilters}
          zapOptions={zapOptions}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500" />
            Top Categorias
          </h3>
          {loading ? (
            <div className="animate-pulse text-zinc-500">Carregando...</div>
          ) : rankings.topCategories.length === 0 ? (
            <p className="text-zinc-500 text-sm">Sem dados disponíveis</p>
          ) : (
            <div className="space-y-2">
              {rankings.topCategories.map((item, index) => (
                <div
                  key={item.categoria}
                  className={cn(
                    "flex items-center justify-between p-2.5 lg:p-3 rounded-xl",
                    index < 3 ? "bg-[#252525]" : "bg-[#1A1A1A]"
                  )}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    {getRankIcon(index)}
                    <span className="text-sm font-medium text-white">{item.categoria}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-500">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
            Maiores Despesas
          </h3>
          {loading ? (
            <div className="animate-pulse text-zinc-500">Carregando...</div>
          ) : rankings.topExpenses.length === 0 ? (
            <p className="text-zinc-500 text-sm">Sem dados disponíveis</p>
          ) : (
            <div className="space-y-2">
              {rankings.topExpenses.map((item, index) => (
                <div
                  key={item.despesa}
                  className={cn(
                    "flex items-center justify-between p-2.5 lg:p-3 rounded-xl",
                    index < 3 ? "bg-[#252525]" : "bg-[#1A1A1A]"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <span className="text-sm font-medium text-white truncate">{item.despesa}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{item.categoria}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500 ml-2">
                    {formatCurrency(item.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {rankings.topZaps.length > 0 && (
          <Card className="lg:col-span-2">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
              Gastos por Membro
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {rankings.topZaps.map((item, index) => (
                <div
                  key={item.zap}
                  className={cn(
                    "p-3 lg:p-4 rounded-xl",
                    index === 0 ? "bg-blue-500/10 border border-blue-500/20" : "bg-[#252525]"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {index === 0 && <Crown className="w-3 h-3 text-yellow-500" />}
                    <span className="text-sm font-medium text-white">{item.zap}</span>
                  </div>
                  <span className="text-lg lg:text-xl font-semibold text-blue-500">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
