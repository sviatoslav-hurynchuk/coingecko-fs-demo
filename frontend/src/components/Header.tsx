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
    <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-gray-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              CoinGecko Screener
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Full-Stack
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Filtered cryptocurrency market &amp; tokenomics explorer
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700 text-xs">
            <Database className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Source:</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                isLive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {source}
            </span>
            {lastUpdated && (
              <span className="text-gray-500 text-[11px] border-l border-gray-700 pl-2">
                {lastUpdated}
              </span>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-xs font-medium text-gray-200 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh latest data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
