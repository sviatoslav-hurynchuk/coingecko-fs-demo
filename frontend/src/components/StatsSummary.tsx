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
      title: 'Matching Projects',
      value: `${projects.length} / ${totalRaw}`,
      sub: 'Passed 6 Core Criteria',
      icon: Coins,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Average FDV',
      value: formatCurrency(avgFdv, true),
      sub: 'Under $100M Ceiling',
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      title: 'Total 24h Volume',
      value: formatCurrency(totalVolume, true),
      sub: 'Aggregate Trading Volume',
      icon: BarChart3,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      title: 'Total Value Locked (TVL)',
      value: formatCurrency(totalTvl, true),
      sub: 'DeFi Smart Contracts',
      icon: Lock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-gray-900/50 border ${stat.border} backdrop-blur-sm flex items-center space-x-4`}
          >
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">{stat.title}</p>
              <p className="text-lg font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-gray-500">{stat.sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
