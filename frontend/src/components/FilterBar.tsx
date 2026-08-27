import React from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, Table, X, RotateCcw } from 'lucide-react'
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
  onReset,
}) => {
  const isFiltered = searchQuery.trim() !== '' || userMaxFdv < 100_000_000

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 mb-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Search by partial name or symbol */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by project name or symbol (e.g. eth, aero)..."
            className="w-full bg-gray-950/70 border border-gray-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User-defined dynamic FDV threshold slider */}
        <div className="flex-1 min-w-[280px] bg-gray-950/50 border border-gray-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400 font-medium flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              Max FDV Ceiling:
            </span>
            <span className="font-bold text-blue-400 font-mono">
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
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>$1M</span>
            <span>$50M</span>
            <span>$100M</span>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-950/70 border border-gray-700/80 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortField)}
              className="bg-transparent text-gray-200 font-medium outline-none cursor-pointer pr-2"
            >
              <option value="market_cap" className="bg-gray-900 text-gray-200">
                Market Cap
              </option>
              <option value="total_volume" className="bg-gray-900 text-gray-200">
                24h Volume
              </option>
              <option value="fully_diluted_valuation" className="bg-gray-900 text-gray-200">
                FDV
              </option>
              <option value="name" className="bg-gray-900 text-gray-200">
                Project Name
              </option>
            </select>

            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-2 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-[11px] transition-colors cursor-pointer"
              title={`Toggle sort order (current: ${sortOrder.toUpperCase()})`}
            >
              {sortOrder === 'desc' ? 'DESC ↓' : 'ASC ↑'}
            </button>
          </div>

          {/* View mode toggle (Cards vs Table) */}
          <div className="flex items-center bg-gray-950/70 border border-gray-700/80 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Tabular View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-xs font-medium text-gray-300 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
