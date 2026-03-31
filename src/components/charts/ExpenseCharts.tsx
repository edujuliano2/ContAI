'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer } from 'recharts'
import { LineChart, Line, XAxis as LineXAxis, YAxis as LineYAxis, CartesianGrid as LineCartesianGrid, Tooltip as LineTooltip, ResponsiveContainer as LineResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface PieChartProps {
  data: { name: string; value: number; color: string }[]
}

export function ExpensePieChart({ data }: PieChartProps) {
  if (!data.length) {
    return (
      <Card className="h-[350px] flex items-center justify-center">
        <p className="text-zinc-500">Sem dados para exibir</p>
      </Card>
    )
  }

  return (
    <Card className="h-[350px]">
      <h3 className="text-lg font-semibold text-white mb-4">Gastos por Categoria</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2D2D2D',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

interface BarChartProps {
  data: { category: string; value: number }[]
}

export function CategoryBarChart({ data }: BarChartProps) {
  if (!data.length) {
    return (
      <Card className="h-[350px] flex items-center justify-center">
        <p className="text-zinc-500">Sem dados para exibir</p>
      </Card>
    )
  }

  return (
    <Card className="h-[350px]">
      <h3 className="text-lg font-semibold text-white mb-4">Top Categorias</h3>
      <BarResponsiveContainer width="100%" height="85%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} stroke="#71717A" fontSize={12} />
          <YAxis type="category" dataKey="category" stroke="#71717A" fontSize={12} width={80} />
          <BarTooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2D2D2D',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </BarResponsiveContainer>
    </Card>
  )
}

interface LineChartProps {
  data: { date: string; value: number }[]
}

export function ExpenseLineChart({ data }: LineChartProps) {
  if (!data.length) {
    return (
      <Card className="h-[350px] flex items-center justify-center">
        <p className="text-zinc-500">Sem dados para exibir</p>
      </Card>
    )
  }

  return (
    <Card className="h-[350px]">
      <h3 className="text-lg font-semibold text-white mb-4">Gastos nos Últimos 30 Dias</h3>
      <LineResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <LineCartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
          <LineXAxis dataKey="date" stroke="#71717A" fontSize={11} interval="preserveStartEnd" />
          <LineYAxis stroke="#71717A" fontSize={11} tickFormatter={(v) => formatCurrency(v)} />
          <LineTooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2D2D2D',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </LineResponsiveContainer>
    </Card>
  )
}
