import React from 'react'
import type { CryptoProject } from '../types/crypto'
import { formatCurrency } from '../utils/formatters'
import { Coins, DollarSign, BarChart3, Lock } from 'lucide-react'

interface StatsSummaryProps {
  projects: CryptoProject[]
  totalRaw: number
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ projects, totalRaw }) => {
  const totalVolume = projects.reduce((acc, p) => acc + p.total_volume, 0)
  const totalTvl = projects.reduce((acc, p) => acc + (p.tvl ?? 0), 0)
  const avgFdv =
    projects.length > 0
      ? projects.reduce((acc, p) => acc + (p.fully_diluted_valuation ?? 0), 0) / projects.length
      : 0

  const stats = [
    {
      title: 'Matching Assets',
      value: `${projects.length} / ${totalRaw}`,
      sub: 'Passed Active Filters',
      icon: Coins,
      color: 'text-zinc-200',
    },
    {
      title: 'Average FDV',
      value: formatCurrency(avgFdv, true),
      sub: 'Valuation Average',
      icon: DollarSign,
      color: 'text-zinc-200',
    },
    {
      title: '24h Total Volume',
      value: formatCurrency(totalVolume, true),
      sub: 'Aggregate Liquidity',
      icon: BarChart3,
      color: 'text-zinc-200',
    },
    {
      title: 'Total Value Locked',
      value: totalTvl > 0 ? formatCurrency(totalTvl, true) : 'N/A',
      sub: 'Smart Contract TVL',
      icon: Lock,
      color: 'text-zinc-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center space-x-3"
          >
            <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400">{stat.title}</p>
              <p className={`text-base font-bold tracking-tight font-mono tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[10px] text-zinc-500">{stat.sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
