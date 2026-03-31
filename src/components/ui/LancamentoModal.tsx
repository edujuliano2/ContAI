'use client'

import { useState, useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'
import { Lancamento } from '@/lib/supabase'

interface LancamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { valor: number; despesa: string; categoria: string; zap?: string }) => Promise<void>
  lancamento?: Lancamento | null
  zapOptions?: string[]
}

export function LancamentoModal({ isOpen, onClose, onSubmit, lancamento, zapOptions = [] }: LancamentoModalProps) {
  const [valor, setValor] = useState('')
  const [despesa, setDespesa] = useState('')
  const [categoria, setCategoria] = useState('')
  const [zap, setZap] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (lancamento) {
      setValor(lancamento.valor.toString())
      setDespesa(lancamento.despesa)
      setCategoria(lancamento.categoria)
      setZap(lancamento.zap || '')
    } else {
      setValor('')
      setDespesa('')
      setCategoria('')
      setZap('')
    }
    setError('')
  }, [lancamento, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const numValor = parseFloat(valor.replace(',', '.'))
    if (isNaN(numValor) || numValor <= 0) {
      setError('Valor deve ser um número positivo')
      return
    }

    if (!despesa.trim()) {
      setError('Descrição é obrigatória')
      return
    }

    if (!categoria) {
      setError('Categoria é obrigatória')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        valor: numValor,
        despesa: despesa.trim(),
        categoria,
        zap: zap.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1A1A1A] rounded-xl border border-[#2D2D2D] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D2D]">
          <h2 className="text-lg font-semibold text-white">
            {lancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Valor *
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              value={despesa}
              onChange={(e) => setDespesa(e.target.value)}
              placeholder="Ex: Supermercado, Uber, Netflix..."
              className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Categoria *
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Membro (opcional)
            </label>
            <input
              type="text"
              value={zap}
              onChange={(e) => setZap(e.target.value)}
              placeholder="Ex: João, Maria, Família..."
              list="zap-options"
              className="w-full px-4 py-3 bg-[#252525] border border-[#2D2D2D] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {zapOptions.length > 0 && (
              <datalist id="zap-options">
                {zapOptions.map((z) => (
                  <option key={z} value={z} />
                ))}
              </datalist>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#252525] text-zinc-300 rounded-lg font-medium hover:bg-[#2D2D2D] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Salvando...' : lancamento ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
