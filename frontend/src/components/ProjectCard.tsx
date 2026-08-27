import React from 'react'
import type { CryptoProject } from '../types/crypto'
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters'
import { TrendingUp, TrendingDown, CheckCircle2, ShieldAlert, Lock, BarChart2 } from 'lucide-react'

interface ProjectCardProps {
  project: CryptoProject
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const isPricePositive = (project.price_change_percentage_24h ?? 0) >= 0
  const supplyEqual =
    project.max_supply !== null &&
    project.total_supply !== null &&
    Math.abs(project.max_supply - project.total_supply) < 1e-5

  const effectiveFdv =
    project.fully_diluted_valuation ??
    (project.max_supply ? project.current_price * project.max_supply : (project.total_supply ? project.current_price * project.total_supply : 0))

  const fdvPercentageOfMax = Math.min(100, Math.round((effectiveFdv / 100_000_000) * 100))

  return (
    <div className="group bg-gray-900/60 hover:bg-gray-900/90 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
      <div>
        {/* Header: Icon, Name, Symbol, and Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {project.image ? (
              <img
                src={project.image}
                alt={project.name}
                className="w-11 h-11 rounded-full bg-gray-800 p-0.5 object-cover border border-gray-700"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center font-bold text-gray-200 text-base">
                {project.symbol.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  {project.name}
                </h3>
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 uppercase">
                  {project.symbol}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {project.market_cap_rank ? `Rank #${project.market_cap_rank}` : 'Unranked'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {project.preview_listing && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Preview Listing
              </span>
            )}
          </div>
        </div>

        {/* Price & 24h Change */}
        <div className="flex items-baseline justify-between py-2 border-y border-gray-800/80 mb-4">
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Current Price</span>
            <span className="text-xl font-extrabold text-white font-mono">
              {formatCurrency(project.current_price)}
            </span>
          </div>

          {project.price_change_percentage_24h !== null && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                isPricePositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isPricePositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{formatPercent(project.price_change_percentage_24h)}</span>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-gray-950/40 p-2.5 rounded-xl border border-gray-800/60">
            <span className="text-gray-400 block text-[11px]">Market Cap (MCap)</span>
            <span className="font-semibold text-gray-100 font-mono">
              {formatCurrency(project.market_cap, true)}
            </span>
          </div>

          <div className="bg-gray-950/40 p-2.5 rounded-xl border border-gray-800/60">
            <span className="text-gray-400 block text-[11px]">24h Volume</span>
            <span className="font-semibold text-purple-400 font-mono flex items-center gap-1">
              <BarChart2 className="w-3 h-3" />
              {formatCurrency(project.total_volume, true)}
            </span>
          </div>

          <div className="bg-gray-950/40 p-2.5 rounded-xl border border-gray-800/60">
            <span className="text-gray-400 block text-[11px]">FDV (&lt; $100M)</span>
            <span className="font-semibold text-blue-400 font-mono">
              {formatCurrency(effectiveFdv, true)}
            </span>
          </div>

          <div className="bg-gray-950/40 p-2.5 rounded-xl border border-gray-800/60">
            <span className="text-gray-400 block text-[11px]">Total Value Locked (TVL)</span>
            <span className="font-semibold text-amber-400 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {project.tvl ? formatCurrency(project.tvl, true) : 'N/A'}
            </span>
          </div>
        </div>

        {/* FDV Bar vs $100M limit */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>FDV Cap Utilization</span>
            <span className="font-mono">{fdvPercentageOfMax}% of $100M</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${fdvPercentageOfMax}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Tokenomics & Supply Validation Badge */}
      <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {supplyEqual ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Max == Total Supply ({formatNumber(project.max_supply)})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-medium text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              Supply Uncapped/Mismatch
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
