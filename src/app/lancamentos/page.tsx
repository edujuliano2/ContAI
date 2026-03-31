'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useLancamentos } from '@/hooks/useLancamentos'
import { FiltersBar } from '@/components/ui/Filters'
import { LancamentosTable } from '@/components/ui/LancamentosTable'
import { LancamentoModal } from '@/components/ui/LancamentoModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Lancamento } from '@/lib/supabase'

export default function LancamentosPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { 
    lancamentos, 
    loading, 
    createLancamento, 
    updateLancamento, 
    deleteLancamento,
    filters,
    updateFilters,
  } = useLancamentos()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const zapOptions = useMemo(() => {
    const zaps = new Set(lancamentos.map(l => l.zap).filter(Boolean))
    return Array.from(zaps) as string[]
  }, [lancamentos])

  const handleCreate = async (data: {
    valor: number
    despesa: string
    categoria: string
    zap?: string
  }) => {
    const { error } = await createLancamento(data)
    if (error) throw error
  }

  const handleUpdate = async (data: {
    valor: number
    despesa: string
    categoria: string
    zap?: string
  }) => {
    if (!editingLancamento) return
    const { error } = await updateLancamento(editingLancamento.id, data)
    if (error) throw error
    setEditingLancamento(null)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    const { error } = await deleteLancamento(deleteConfirm)
    if (error) {
      alert('Erro ao excluir lançamento')
    }
    setDeleteConfirm(null)
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl lg:text-2xl font-semibold text-white">Lançamentos</h1>
          <p className="text-sm text-zinc-400">{lancamentos.length} registro{lancamentos.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="mb-4 lg:mb-6">
        <FiltersBar
          filters={filters}
          onFilterChange={updateFilters}
          zapOptions={zapOptions}
        />
      </div>

      <LancamentosTable
        lancamentos={lancamentos}
        loading={loading}
        onEdit={(l) => {
          setEditingLancamento(l)
          setIsModalOpen(true)
        }}
        onDelete={(id) => setDeleteConfirm(id)}
      />

      <button
        onClick={() => {
          setEditingLancamento(null)
          setIsModalOpen(true)
        }}
        className="lg:hidden fixed bottom-20 right-4 z-30 p-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      <LancamentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLancamento(null)
        }}
        onSubmit={editingLancamento ? handleUpdate : handleCreate}
        lancamento={editingLancamento}
        zapOptions={zapOptions}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[#1A1A1A] rounded-t-2xl sm:rounded-xl border border-[#2D2D2D] p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            <h3 className="text-lg font-semibold text-white mb-3">Excluir lançamento?</h3>
            <p className="text-zinc-400 mb-6 text-sm">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-[#252525] text-zinc-300 rounded-xl font-medium hover:bg-[#2D2D2D] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
