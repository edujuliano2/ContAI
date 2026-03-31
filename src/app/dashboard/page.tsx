'use client'

import { useEffect, useState, useMemo } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Clock, Plus } from 'lucide-react'
import { useLancamentos, useDashboardStats, useChartData } from '@/hooks/useLancamentos'
import { StatCard, Card } from '@/components/ui/Card'
import { ExpensePieChart, CategoryBarChart, ExpenseLineChart } from '@/components/charts/ExpenseCharts'
import { formatCurrency } from '@/lib/utils'
import { Lancamento } from '@/lib/supabase'
import { LancamentoModal } from '@/components/ui/LancamentoModal'

export default function DashboardPage() {
  const { lancamentos, loading, createLancamento, filters, updateFilters } = useLancamentos()
  const stats = useDashboardStats(lancamentos)
  const chartData = useChartData(lancamentos)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const zapOptions = useMemo(() => {
    const zaps = new Set(lancamentos.map(l => l.zap).filter(Boolean))
    return Array.from(zaps) as string[]
  }, [lancamentos])

  const handleCreateLancamento = async (data: {
    valor: number
    despesa: string
    categoria: string
    zap?: string
  }) => {
    const { error } = await createLancamento(data)
    if (error) throw error
  }

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl lg:text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400">Suas finanças em resumo</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />}
          label="Total período"
          value={formatCurrency(stats.totalGasto)}
          className={loading ? 'opacity-50' : ''}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" />}
          label="Média dia"
          value={formatCurrency(stats.mediaDiaria)}
          className={loading ? 'opacity-50' : ''}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 lg:w-6 lg:h-6" />}
          label="Mês ant."
          value={formatCurrency(stats.mesAnterior)}
          className={loading ? 'opacity-50' : ''}
        />
        <StatCard
          icon={stats.evolucaoMensal >= 0 ? <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" /> : <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6" />}
          label="Evolução"
          value={`${stats.evolucaoMensal >= 0 ? '+' : ''}${stats.evolucaoMensal.toFixed(0)}%`}
          trend={{
            value: Math.abs(stats.evolucaoMensal),
            isPositive: stats.evolucaoMensal <= 0,
          }}
          className={loading ? 'opacity-50' : ''}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <ExpenseLineChart data={chartData.lineData} />
        <ExpensePieChart data={chartData.pieData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <CategoryBarChart data={chartData.barData} />
        
        <Card className="lg:col-span-1">
          <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Últimos</h3>
          {loading ? (
            <div className="animate-pulse text-zinc-500">Carregando...</div>
          ) : stats.ultimosLancamentos.length === 0 ? (
            <p className="text-zinc-500 text-sm">Nenhum lançamento</p>
          ) : (
            <div className="space-y-2 lg:space-y-3 max-h-[280px] overflow-y-auto">
              {stats.ultimosLancamentos.map((l: Lancamento) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between p-2.5 lg:p-3 bg-[#252525] rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{l.despesa}</p>
                    <p className="text-xs text-zinc-500">{l.categoria}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-500 ml-2">
                    {formatCurrency(Number(l.valor))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Categorias</h3>
        {loading ? (
          <div className="animate-pulse text-zinc-500">Carregando...</div>
        ) : stats.totalPorCategoria.length === 0 ? (
          <p className="text-zinc-500 text-sm">Nenhum dado disponível</p>
        ) : (
          <div className="space-y-3">
            {stats.totalPorCategoria.slice(0, 6).map((item, index) => {
              const percentage = stats.totalGasto > 0 
                ? (item.total / stats.totalGasto) * 100 
                : 0
              return (
                <div key={item.categoria}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">
                      {index + 1}. {item.categoria}
                    </span>
                    <span className="text-sm font-medium text-zinc-300">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <button
        onClick={() => setIsModalOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 p-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      <LancamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLancamento}
        zapOptions={zapOptions}
      />
    </div>
  )
}
