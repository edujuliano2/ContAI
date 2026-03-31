'use client'

import { useState } from 'react'
import { Search, Calendar, Filter, ChevronDown, ChevronUp, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'
import { FilterOptions } from '@/hooks/useLancamentos'
import { cn } from '@/lib/utils'

interface FiltersBarProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
  zapOptions?: string[]
}

export function FiltersBar({ filters, onFilterChange, zapOptions = [] }: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = filters.categoria || filters.zap || filters.startDate || filters.endDate

  const clearFilters = () => {
    onFilterChange({
      categoria: '',
      zap: '',
      startDate: '',
      endDate: '',
      search: ''
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar despesa..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-base"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl text-white text-sm font-medium transition-colors",
            (showFilters || hasActiveFilters) ? "border-emerald-500 text-emerald-500" : ""
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {showFilters ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="p-4 bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Data inicial
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => onFilterChange({ startDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Data final
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => onFilterChange({ endDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Categoria
              </label>
              <select
                value={filters.categoria || ''}
                onChange={(e) => onFilterChange({ categoria: e.target.value })}
                className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white text-base focus:outline-none focus:border-emerald-500"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {zapOptions.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                  Membro
                </label>
                <select
                  value={filters.zap || ''}
                  onChange={(e) => onFilterChange({ zap: e.target.value })}
                  className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white text-base focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Todos</option>
                  {zapOptions.map((zap) => (
                    <option key={zap} value={zap}>{zap}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
              Ordenar por
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [FilterOptions['sortBy'], FilterOptions['sortOrder']]
                onFilterChange({ sortBy, sortOrder })
              }}
              className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-xl text-white text-base focus:outline-none focus:border-emerald-500"
            >
              <option value="created_at-desc">Mais recentes</option>
              <option value="created_at-asc">Mais antigos</option>
              <option value="valor-desc">Maior valor</option>
              <option value="valor-asc">Menor valor</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium hover:bg-red-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
