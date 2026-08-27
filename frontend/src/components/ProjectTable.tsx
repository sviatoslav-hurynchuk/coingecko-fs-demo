import React from 'react'
import type { CryptoProject, SortField, SortOrder } from '../types/crypto'
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters'
import { ArrowUpDown, CheckCircle2, TrendingUp, TrendingDown, Lock } from 'lucide-react'

interface ProjectTableProps {
  projects: CryptoProject[]
  sortBy: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-600 group-hover:text-gray-400 inline ml-1" />
    }
    return (
      <span className="text-emerald-400 font-bold inline ml-1 text-xs">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-950/60 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <th className="py-3.5 px-4"># Rank</th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-gray-200 group"
              onClick={() => onSort('name')}
            >
              Project {renderSortIndicator('name')}
            </th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4">24h %</th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-gray-200 group"
              onClick={() => onSort('market_cap')}
            >
              Market Cap {renderSortIndicator('market_cap')}
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-gray-200 group"
              onClick={() => onSort('fully_diluted_valuation')}
            >
              FDV (&lt; $100M) {renderSortIndicator('fully_diluted_valuation')}
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-gray-200 group"
              onClick={() => onSort('total_volume')}
            >
              24h Volume {renderSortIndicator('total_volume')}
            </th>
            <th className="py-3.5 px-4">TVL (&gt; $50k)</th>
            <th className="py-3.5 px-4">Supply Match</th>
            <th className="py-3.5 px-4">Listing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60 text-xs">
          {projects.map((project) => {
            const isPricePositive = (project.price_change_percentage_24h ?? 0) >= 0
            const supplyEqual =
              project.max_supply !== null &&
              project.total_supply !== null &&
              Math.abs(project.max_supply - project.total_supply) < 1e-5

            const effectiveFdv =
              project.fully_diluted_valuation ??
              (project.max_supply ? project.current_price * project.max_supply : 0)

            return (
              <tr
                key={project.id}
                className="hover:bg-gray-800/40 transition-colors duration-150"
              >
                <td className="py-3.5 px-4 text-gray-500 font-mono">
                  {project.market_cap_rank ? `#${project.market_cap_rank}` : '-'}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-7 h-7 rounded-full bg-gray-800 p-0.5 object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-300 text-[10px]">
                        {project.symbol.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-white block hover:text-emerald-400 transition-colors">
                        {project.name}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 uppercase">
                        {project.symbol}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-gray-100">
                  {formatCurrency(project.current_price)}
                </td>

                <td className="py-3.5 px-4">
                  {project.price_change_percentage_24h !== null ? (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isPricePositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPricePositive ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {formatPercent(project.price_change_percentage_24h)}
                    </span>
                  ) : (
                    <span className="text-gray-500">0.00%</span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-mono text-gray-200">
                  {formatCurrency(project.market_cap, true)}
                </td>

                <td className="py-3.5 px-4 font-mono text-blue-400 font-medium">
                  {formatCurrency(effectiveFdv, true)}
                </td>

                <td className="py-3.5 px-4 font-mono text-purple-400">
                  {formatCurrency(project.total_volume, true)}
                </td>

                <td className="py-3.5 px-4 font-mono text-amber-400">
                  {project.tvl ? (
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                      {formatCurrency(project.tvl, true)}
                    </span>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  {supplyEqual ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {formatNumber(project.max_supply)}
                    </span>
                  ) : (
                    <span className="text-rose-400 text-[11px]">Mismatch</span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  {project.preview_listing ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Preview
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500">Active</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
