import React from 'react'
import { Header } from './components/Header'
import { StatsSummary } from './components/StatsSummary'
import { FilterBar } from './components/FilterBar'
import { ProjectCard } from './components/ProjectCard'
import { ProjectTable } from './components/ProjectTable'
import { LoadingState } from './components/LoadingState'
import { useCrypto } from './hooks/useCrypto'
import { AlertCircle, CheckCircle, Sliders, Layers } from 'lucide-react'

export const App: React.FC = () => {
  const {
    projects,
    totalRaw,
    loading,
    error,
    source,
    lastUpdated,
    strictMode,
    setStrictMode,
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
    setStrictMode(true)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-700 selection:text-white antialiased">
      <Header
        source={source}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refetch}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Rules Info Bar */}
        <div className="mb-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-200">
              {strictMode ? 'Backend Filter Rules (Active):' : 'Market Feed Mode:'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {strictMode ? (
              <>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> MCap &gt; 0
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> preview_listing == true
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Max == Total Supply
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> FDV &lt; $100M
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Volume &gt; $50k
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> TVL &gt; $50k
                </span>
              </>
            ) : (
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono">
                Displaying Live CoinGecko Market Assets (Relaxed Constraints)
              </span>
            )}
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
          strictMode={strictMode}
          onToggleStrictMode={setStrictMode}
          onReset={handleResetFilters}
        />

        {/* Content State: Error, Loading, Empty, or Projects */}
        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-8 text-center my-6">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Failed to Load Projects</h3>
            <p className="text-xs text-rose-300 mb-3 max-w-md mx-auto">{error}</p>
            <button
              onClick={refetch}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <LoadingState viewMode={viewMode} />
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center my-6">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-2.5 text-zinc-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200 mb-1">No Matching Projects</h3>
            <p className="text-xs text-zinc-400 mb-3 max-w-md mx-auto">
              No projects matched your active search query or FDV cutoff.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-[11px] text-zinc-500 font-mono">
        CoinGecko Full-Stack Screener &bull; FastAPI + React + TypeScript
      </footer>
    </div>
  )
}
export default App
