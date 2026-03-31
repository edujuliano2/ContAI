import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2D2D2D]', className)}>
      {children}
    </div>
  )
}

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={cn('flex items-center gap-4', className)}>
      <div className="p-3 bg-[#252525] rounded-lg text-emerald-500">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-zinc-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-white">{value}</span>
          {trend && (
            <span className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-emerald-500' : 'text-red-500'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
