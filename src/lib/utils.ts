import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getCategoryColor(category: string): string {
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

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Educação',
  'Vestuário',
  'Utilities',
  'Outro',
]
