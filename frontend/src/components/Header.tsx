import React from 'react'
import { Activity, RefreshCw, Database } from 'lucide-react'

interface HeaderProps {
  source: string
  lastUpdated: string
  loading: boolean
  onRefresh: () => void
}

export const Header: React.FC<HeaderProps> = ({
  source,
  lastUpdated,
  loading,
  onRefresh,
}) => {
  const isLive = source.includes('live')

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              CoinGecko Screener
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
                v1.0
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
            <Database className="w-3 h-3 text-zinc-500" />
            <span className="text-zinc-500 text-[11px]">Source:</span>
            <span
              className={`font-semibold text-[11px] flex items-center gap-1.5 ${
                isLive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLive ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {source}
            </span>
            {lastUpdated && (
              <span className="text-zinc-500 text-[10px] border-l border-zinc-800 pl-2 font-mono">
                {lastUpdated}
              </span>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh latest data"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
