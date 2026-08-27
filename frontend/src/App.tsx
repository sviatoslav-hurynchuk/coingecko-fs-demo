import React from 'react'
import { Header } from './components/Header'
import { StatsSummary } from './components/StatsSummary'
import { FilterBar } from './components/FilterBar'
import { ProjectCard } from './components/ProjectCard'
import { ProjectTable } from './components/ProjectTable'
import { LoadingState } from './components/LoadingState'
import { useCrypto } from './hooks/useCrypto'
import { AlertCircle, CheckCircle, Sliders, Sparkles } from 'lucide-react'

export const App: React.FC = () => {
  const {
    projects,
    totalRaw,
    loading,
    error,
    source,
    lastUpdated,
    searchQuery,
    setSearchQuery,
    userMaxFdv,
    setUserMaxFdv,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    refetch,
  } = useCrypto()

  const handleResetFilters = () => {
    setSearchQuery('')
    setUserMaxFdv(100_000_000)
    setSortBy('market_cap')
    setSortOrder('desc')
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-gray-950">
      <Header
        source={source}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refetch}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner & Backend Filter Criteria Badges */}
        <div className="mb-6 bg-gradient-to-r from-emerald-950/40 via-gray-900/60 to-blue-950/40 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                Active Backend Filtering Rules
              </h2>
            </div>
            <span className="text-xs text-gray-400">
              Evaluated strictly on server-side CoinGecko feed
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> MCap &gt; $0
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> preview_listing == true
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Max Supply == Total Supply
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> FDV &lt; $100M
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> 24h Volume &gt; $50k
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> TVL &gt; $50k
            </span>
          </div>
        </div>

        {/* High-level Statistics */}
        <StatsSummary projects={projects} totalRaw={totalRaw} />

        {/* Search, Custom FDV & Sort Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userMaxFdv={userMaxFdv}
          onMaxFdvChange={setUserMaxFdv}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onReset={handleResetFilters}
        />

        {/* Content State: Error, Loading, Empty, or Projects */}
        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center my-8">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Failed to Load Projects</h3>
            <p className="text-xs text-rose-300 mb-4 max-w-md mx-auto">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <LoadingState viewMode={viewMode} />
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-gray-400 mb-4 max-w-md mx-auto">
              No cryptocurrency projects matched your current filters. Try relaxing the FDV ceiling or clearing your search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-medium text-gray-200 transition-colors cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(field) => {
              if (sortBy === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy(field)
                setSortOrder('desc')
              }
            }}
          />
        )}
      </main>

      <footer className="border-t border-gray-800/80 bg-gray-950/60 py-6 text-center text-xs text-gray-500">
        <p>
          CoinGecko Full-Stack Crypto Screener &bull; Powered by FastAPI &amp; React &bull; Live Market Data
        </p>
      </footer>
    </div>
  )
}
export default App
