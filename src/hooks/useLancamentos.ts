'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Lancamento } from '@/lib/supabase'

export type FilterOptions = {
  startDate?: string
  endDate?: string
  categoria?: string
  search?: string
  zap?: string
  sortBy?: 'created_at' | 'valor'
  sortOrder?: 'asc' | 'desc'
}

export function useLancamentos() {
  const { user } = useAuth()
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'created_at',
    sortOrder: 'desc',
  })

  const fetchLancamentos = useCallback(async () => {
    if (!user) return

    const supabase = createClient()
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user.id)

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate + 'T23:59:59')
      }
      if (filters.categoria) {
        query = query.eq('categoria', filters.categoria)
      }
      if (filters.search) {
        query = query.ilike('despesa', `%${filters.search}%`)
      }
      if (filters.zap) {
        query = query.eq('zap', filters.zap)
      }

      query = query.order(filters.sortBy || 'created_at', {
        ascending: filters.sortOrder === 'asc',
      })

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setLancamentos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar lançamentos')
    } finally {
      setLoading(false)
    }
  }, [user, filters])

  useEffect(() => {
    fetchLancamentos()
  }, [fetchLancamentos])

  const createLancamento = async (data: {
    valor: number
    despesa: string
    categoria: string
    zap?: string
  }) => {
    if (!user) return { error: 'Usuário não autenticado' }

    const supabase = createClient()
    const { error } = await supabase.from('lancamentos').insert({
      ...data,
      user_id: user.id,
    })

    if (error) return { error }
    await fetchLancamentos()
    return { error: null }
  }

  const updateLancamento = async (id: number, data: {
    valor?: number
    despesa?: string
    categoria?: string
    zap?: string
  }) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('lancamentos')
      .update(data)
      .eq('id', id)

    if (error) return { error }
    await fetchLancamentos()
    return { error: null }
  }

  const deleteLancamento = async (id: number) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('lancamentos')
      .delete()
      .eq('id', id)

    if (error) return { error }
    await fetchLancamentos()
    return { error: null }
  }

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return {
    lancamentos,
    loading,
    error,
    filters,
    updateFilters,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    refetch: fetchLancamentos,
  }
}

export function useDashboardStats(lancamentos: Lancamento[]) {
  const [stats, setStats] = useState({
    totalGasto: 0,
    mediaDiaria: 0,
    totalPorCategoria: [] as { categoria: string; total: number }[],
    ultimosLancamentos: [] as Lancamento[],
    mesAnterior: 0,
    evolucaoMensal: 0,
  })

  useEffect(() => {
    if (!lancamentos.length) {
      setStats({
        totalGasto: 0,
        mediaDiaria: 0,
        totalPorCategoria: [],
        ultimosLancamentos: [],
        mesAnterior: 0,
        evolucaoMensal: 0,
      })
      return
    }

    const totalGasto = lancamentos.reduce((sum, l) => sum + Number(l.valor), 0)

    const uniqueDates = new Set(
      lancamentos.map(l => new Date(l.created_at).toDateString())
    )
    const daysInPeriod = Math.max(uniqueDates.size, 1)
    const mediaDiaria = totalGasto / daysInPeriod

    const categoriaMap = new Map<string, number>()
    lancamentos.forEach(l => {
      const current = categoriaMap.get(l.categoria) || 0
      categoriaMap.set(l.categoria, current + Number(l.valor))
    })
    const totalPorCategoria = Array.from(categoriaMap.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)

    const ultimosLancamentos = [...lancamentos]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const lancamentosThisMonth = lancamentos.filter(l => {
      const d = new Date(l.created_at)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    
    const lancamentosLastMonth = lancamentos.filter(l => {
      const d = new Date(l.created_at)
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })

    const thisMonthTotal = lancamentosThisMonth.reduce((sum, l) => sum + Number(l.valor), 0)
    const lastMonthTotal = lancamentosLastMonth.reduce((sum, l) => sum + Number(l.valor), 0)
    
    const evolucaoMensal = lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0

    setStats({
      totalGasto,
      mediaDiaria,
      totalPorCategoria,
      ultimosLancamentos,
      mesAnterior: lastMonthTotal,
      evolucaoMensal,
    })
  }, [lancamentos])

  return stats
}

export function useChartData(lancamentos: Lancamento[]) {
  const [chartData, setChartData] = useState({
    pieData: [] as { name: string; value: number; color: string }[],
    lineData: [] as { date: string; value: number }[],
    barData: [] as { category: string; value: number }[],
  })

  useEffect(() => {
    if (!lancamentos.length) {
      setChartData({ pieData: [], lineData: [], barData: [] })
      return
    }

    const pieDataMap = new Map<string, number>()
    lancamentos.forEach(l => {
      const current = pieDataMap.get(l.categoria) || 0
      pieDataMap.set(l.categoria, current + Number(l.valor))
    })

    const pieData = Array.from(pieDataMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.value - a.value)

    const last30Days = new Map<string, number>()
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      last30Days.set(key, 0)
    }

    lancamentos.forEach(l => {
      const dateKey = new Date(l.created_at).toISOString().split('T')[0]
      if (last30Days.has(dateKey)) {
        last30Days.set(dateKey, (last30Days.get(dateKey) || 0) + Number(l.valor))
      }
    })

    const lineData = Array.from(last30Days.entries()).map(([date, value]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value,
    }))

    const barData = pieData.slice(0, 5).map(item => ({
      category: item.name,
      value: item.value,
    }))

    setChartData({ pieData, lineData, barData })
  }, [lancamentos])

  return chartData
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Alimentação: '#10B981',
    Transporte: '#3B82F6',
    Moradia: '#8B5CF6',
    Saúde: '#EF4444',
    Lazer: '#F59E0B',
    Educação: '#EC4899',
    Vestuário: '#06B6D4',
    Utilities: '#6366F1',
    Outro: '#6B7280',
  }
  return colors[category] || colors['Outro']
}
