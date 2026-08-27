import React from 'react'
import type { CryptoProject } from '../types/crypto'
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters'
import { TrendingUp, TrendingDown, CheckCircle2, ShieldAlert } from 'lucide-react'

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
    <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-all duration-150 flex flex-col justify-between shadow-sm">
      <div>
        {/* Header: Icon, Name, Symbol, and Badges */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center space-x-2.5">
            {project.image ? (
              <img
                src={project.image}
                alt={project.name}
                className="w-9 h-9 rounded-full bg-zinc-800 p-0.5 object-cover border border-zinc-700 shrink-0"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-xs shrink-0 font-mono">
                {project.symbol.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-zinc-100 text-sm leading-tight">
                  {project.name}
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">
                  {project.symbol}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {project.market_cap_rank ? `Rank #${project.market_cap_rank}` : 'Unranked'}
              </p>
            </div>
          </div>

          <div>
            {project.preview_listing ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Preview
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Price & 24h Change */}
        <div className="flex items-baseline justify-between py-2 border-y border-zinc-800/80 mb-3.5">
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-medium">Price</span>
            <span className="text-lg font-bold text-zinc-100 font-mono tabular-nums">
              {formatCurrency(project.current_price)}
            </span>
          </div>

          {project.price_change_percentage_24h !== null && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded font-mono tabular-nums ${
                isPricePositive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-rose-400 bg-rose-500/10'
              }`}
            >
              {isPricePositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{formatPercent(project.price_change_percentage_24h)}</span>
            </div>
          )}
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3.5 text-xs">
          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-500 block text-[10px] uppercase font-medium">Market Cap</span>
            <span className="font-semibold text-zinc-200 font-mono tabular-nums">
              {formatCurrency(project.market_cap, true)}
            </span>
          </div>

          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-500 block text-[10px] uppercase font-medium">24h Volume</span>
            <span className="font-semibold text-zinc-200 font-mono tabular-nums">
              {formatCurrency(project.total_volume, true)}
            </span>
          </div>

          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-500 block text-[10px] uppercase font-medium">FDV</span>
            <span className="font-semibold text-zinc-200 font-mono tabular-nums">
              {formatCurrency(effectiveFdv, true)}
            </span>
          </div>

          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-500 block text-[10px] uppercase font-medium">TVL</span>
            <span className="font-semibold text-zinc-200 font-mono tabular-nums">
              {project.tvl ? formatCurrency(project.tvl, true) : 'N/A'}
            </span>
          </div>
        </div>

        {/* FDV Bar vs $100M limit */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-mono tabular-nums">
            <span>FDV Ceiling ({fdvPercentageOfMax}%)</span>
            <span>{formatCurrency(effectiveFdv, true)} / $100M</span>
          </div>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-zinc-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${fdvPercentageOfMax}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Tokenomics & Supply Validation Badge */}
      <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          {supplyEqual ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              Supply Fixed ({formatNumber(project.max_supply)})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-zinc-400 text-[11px]">
              <ShieldAlert className="w-3 h-3 text-zinc-500 shrink-0" />
              Supply: {project.max_supply ? formatNumber(project.max_supply) : 'Uncapped'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
