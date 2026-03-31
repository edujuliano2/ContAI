'use client'

import { Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { Lancamento } from '@/lib/supabase'
import { formatCurrency, formatDateTime, getCategoryColor, cn } from '@/lib/utils'
import { useState } from 'react'

interface LancamentosTableProps {
  lancamentos: Lancamento[]
  onEdit: (lancamento: Lancamento) => void
  onDelete: (id: number) => void
  loading?: boolean
}

export function LancamentosTable({ lancamentos, onEdit, onDelete, loading }: LancamentosTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(lancamentos.length / itemsPerPage)

  const paginatedLancamentos = lancamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] p-8 text-center">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    )
  }

  if (!lancamentos.length) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] p-8 text-center">
        <p className="text-zinc-500">Nenhum lançamento encontrado</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D2D2D]">
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">Data</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">Descrição</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">Categoria</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">Membro</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-6 py-4">Valor</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLancamentos.map((lancamento) => (
              <tr
                key={lancamento.id}
                className="border-b border-[#2D2D2D] hover:bg-[#252525] transition-colors"
              >
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {formatDateTime(lancamento.created_at)}
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {lancamento.despesa}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getCategoryColor(lancamento.categoria)}20`,
                      color: getCategoryColor(lancamento.categoria),
                    }}
                  >
                    {lancamento.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {lancamento.zap || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-white font-semibold text-right">
                  {formatCurrency(Number(lancamento.valor))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(lancamento)}
                      className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-[#252525] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lancamento.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-[#252525] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D2D2D]">
          <span className="text-sm text-zinc-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, lancamentos.length)} of {lancamentos.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentPage === 1
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-zinc-400 hover:text-white hover:bg-[#252525]"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                  page === currentPage
                    ? "bg-emerald-500 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-[#252525]"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentPage === totalPages
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-zinc-400 hover:text-white hover:bg-[#252525]"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
