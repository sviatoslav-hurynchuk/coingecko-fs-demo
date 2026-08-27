import React from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, Table, X, RotateCcw, CheckCircle, Globe } from 'lucide-react'
import type { SortField, SortOrder, ViewMode } from '../types/crypto'
import { formatCurrency } from '../utils/formatters'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  userMaxFdv: number
  onMaxFdvChange: (val: number) => void
  sortBy: SortField
  onSortByChange: (field: SortField) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  strictMode: boolean
  onToggleStrictMode: (val: boolean) => void
  onReset: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  userMaxFdv,
  onMaxFdvChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  strictMode,
  onToggleStrictMode,
  onReset,
}) => {
  const isFiltered = searchQuery.trim() !== '' || userMaxFdv < 100_000_000 || !strictMode

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 mb-6 shadow-sm">
      {/* Top Segment: Feed Mode Selector */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-800/80">
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => onToggleStrictMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              strictMode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Strict 6 Rules (Assignment Mode)</span>
          </button>

          <button
            onClick={() => onToggleStrictMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              !strictMode
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Live Market Coins</span>
          </button>
        </div>

        <div className="text-[11px] text-zinc-500 font-mono hidden sm:block">
          {strictMode ? 'Filtered to preview listings' : 'Live CoinGecko market feed'}
        </div>
      </div>

      {/* Bottom Segment: Strict Grid preventing any flex item compression when Reset appears */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Column 1 (Cols 1-5): Search Input with stable fixed grid width */}
        <div className="md:col-span-5 relative w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by project name or symbol (e.g. eth, aero)..."
            className="w-full bg-zinc-950 border border-zinc-700/80 focus:border-zinc-500 rounded-lg pl-9 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Column 2 (Cols 6-9): FDV Slider Container */}
        <div className="md:col-span-4 bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5 text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
              Max FDV:
            </span>
            <span className="w-20 text-right font-bold text-zinc-200 font-mono text-xs tabular-nums">
              {formatCurrency(userMaxFdv, userMaxFdv >= 1_000_000)}
            </span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={1_000_000}
            value={userMaxFdv}
            onChange={(e) => onMaxFdvChange(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5 font-mono tabular-nums">
            <span>$1M</span>
            <span>$50M</span>
            <span>$100M</span>
          </div>
        </div>

        {/* Column 3 (Cols 10-12): Sorting, View Switcher & Fixed Reset Slot */}
        <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5">
          {/* Sorting dropdown */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs">
            <ArrowUpDown className="w-3 h-3 text-zinc-500 mr-1" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortField)}
              className="bg-transparent text-zinc-200 font-medium outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="market_cap" className="bg-zinc-900 text-zinc-200">
                MCap
              </option>
              <option value="total_volume" className="bg-zinc-900 text-zinc-200">
                Volume
              </option>
              <option value="fully_diluted_valuation" className="bg-zinc-900 text-zinc-200">
                FDV
              </option>
              <option value="name" className="bg-zinc-900 text-zinc-200">
                Name
              </option>
            </select>

            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-1 px-1 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[10px] cursor-pointer"
            >
              {sortOrder === 'desc' ? 'DESC' : 'ASC'}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Table View"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset button inside fixed layout flow */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              title="Reset search and filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="text-[11px]">Reset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
