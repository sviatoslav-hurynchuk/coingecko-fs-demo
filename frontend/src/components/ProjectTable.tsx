import React from 'react'
import type { CryptoProject, SortField, SortOrder } from '../types/crypto'
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters'
import { ArrowUpDown, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'

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
      return <ArrowUpDown className="w-3 h-3 text-zinc-600 inline ml-1" />
    }
    return (
      <span className="text-zinc-200 font-bold inline ml-1 text-xs">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-950 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            <th className="py-3 px-3.5">#</th>
            <th
              className="py-3 px-3.5 cursor-pointer hover:text-zinc-200"
              onClick={() => onSort('name')}
            >
              Asset {renderSortIndicator('name')}
            </th>
            <th className="py-3 px-3.5">Price</th>
            <th className="py-3 px-3.5">24h Change</th>
            <th
              className="py-3 px-3.5 cursor-pointer hover:text-zinc-200"
              onClick={() => onSort('market_cap')}
            >
              Market Cap {renderSortIndicator('market_cap')}
            </th>
            <th
              className="py-3 px-3.5 cursor-pointer hover:text-zinc-200"
              onClick={() => onSort('fully_diluted_valuation')}
            >
              FDV {renderSortIndicator('fully_diluted_valuation')}
            </th>
            <th
              className="py-3 px-3.5 cursor-pointer hover:text-zinc-200"
              onClick={() => onSort('total_volume')}
            >
              24h Volume {renderSortIndicator('total_volume')}
            </th>
            <th className="py-3 px-3.5">TVL</th>
            <th className="py-3 px-3.5">Supply</th>
            <th className="py-3 px-3.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80 text-xs">
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
                className="hover:bg-zinc-800/50 transition-colors"
              >
                <td className="py-3 px-3.5 text-zinc-500 font-mono">
                  {project.market_cap_rank ? `#${project.market_cap_rank}` : '-'}
                </td>

                <td className="py-3 px-3.5">
                  <div className="flex items-center space-x-2.5">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-6 h-6 rounded-full bg-zinc-800 p-0.5 object-cover shrink-0"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-[10px] shrink-0 font-mono">
                        {project.symbol.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-zinc-100 block">
                        {project.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {project.symbol}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3.5 font-mono font-bold text-zinc-100 tabular-nums">
                  {formatCurrency(project.current_price)}
                </td>

                <td className="py-3 px-3.5">
                  {project.price_change_percentage_24h !== null ? (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold font-mono tabular-nums ${
                        isPricePositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPricePositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {formatPercent(project.price_change_percentage_24h)}
                    </span>
                  ) : (
                    <span className="text-zinc-500 font-mono">0.00%</span>
                  )}
                </td>

                <td className="py-3 px-3.5 font-mono text-zinc-200 tabular-nums">
                  {formatCurrency(project.market_cap, true)}
                </td>

                <td className="py-3 px-3.5 font-mono text-zinc-200 tabular-nums">
                  {formatCurrency(effectiveFdv, true)}
                </td>

                <td className="py-3 px-3.5 font-mono text-zinc-200 tabular-nums">
                  {formatCurrency(project.total_volume, true)}
                </td>

                <td className="py-3 px-3.5 font-mono text-zinc-300 tabular-nums">
                  {project.tvl ? formatCurrency(project.tvl, true) : <span className="text-zinc-500">N/A</span>}
                </td>

                <td className="py-3 px-3.5 font-mono">
                  {supplyEqual ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {formatNumber(project.max_supply)}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[11px]">
                      {project.max_supply ? formatNumber(project.max_supply) : 'Uncapped'}
                    </span>
                  )}
                </td>

                <td className="py-3 px-3.5">
                  {project.preview_listing ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Preview
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400">Active</span>
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
