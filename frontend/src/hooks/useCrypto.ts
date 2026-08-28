import { useState, useEffect, useMemo, useCallback } from 'react'
import type { CryptoProject, ProjectListResponse, SortField, SortOrder, ViewMode } from '../types/crypto'

export function useCrypto() {
  const [rawProjects, setRawProjects] = useState<CryptoProject[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<string>('unknown')
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({})

  // Strict Assignment Mode filters by preview_listing & equal supply; relaxing shows all 100+ live CoinGecko market coins.
  const [strictMode, setStrictMode] = useState<boolean>(true)

  // Client-side control states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userMaxFdv, setUserMaxFdv] = useState<number>(100_000_000)
  const [sortBy, setSortBy] = useState<SortField>('market_cap')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  const fetchProjects = useCallback(async (forceRefresh: boolean = false, isStrict: boolean = strictMode) => {
    setLoading(true)
    setError(null)
    try {
      // Query parameters instruct backend whether to apply strict assignment constraints or return live market data.
      const url = isStrict
        ? `/api/projects?force_refresh=${forceRefresh}&preview_only=true&require_equal_supply=true&min_tvl=50000&max_fdv=100000000`
        : `/api/projects?force_refresh=${forceRefresh}&preview_only=false&require_equal_supply=false&min_tvl=0&min_volume=0`

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}: ${res.statusText}`)
      }
      const data: ProjectListResponse = await res.json()
      setRawProjects(data.items)
      setSource(data.source)
      setAppliedFilters(data.applied_filters)
      setLastUpdated(new Date(data.timestamp).toLocaleTimeString())
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [strictMode])

  useEffect(() => {
    fetchProjects(false, strictMode)
  }, [fetchProjects, strictMode])

  // Instant client-side filtering avoids extra roundtrips while manipulating sliders or typing queries.
  const filteredAndSortedProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = rawProjects.filter((project) => {
      // Partial match satisfies assignment requirement for query resolution (e.g. 'eth' -> 'Ethereum' or 'ETH').
      if (query) {
        const matchesName = project.name.toLowerCase().includes(query)
        const matchesSymbol = project.symbol.toLowerCase().includes(query)
        if (!matchesName && !matchesSymbol) {
          return false
        }
      }

      // User-defined FDV cutoff evaluates effective FDV computed or supplied by backend.
      const effectiveFdv =
        project.fully_diluted_valuation ??
        (project.max_supply ? project.current_price * project.max_supply : (project.total_supply ? project.current_price * project.total_supply : 0))

      // In relaxed Live mode, allow large cap assets like Bitcoin/Ethereum unless the user explicitly lowers the slider below 100M.
      if (strictMode || userMaxFdv < 100_000_000) {
        if (effectiveFdv > userMaxFdv) {
          return false
        }
      }

      return true
    })

    // Stable dual-direction sorting on specified financial metrics.
    return filtered.sort((a, b) => {
      let valA: number | string = 0
      let valB: number | string = 0

      switch (sortBy) {
        case 'market_cap':
          valA = a.market_cap
          valB = b.market_cap
          break
        case 'total_volume':
          valA = a.total_volume
          valB = b.total_volume
          break
        case 'fully_diluted_valuation':
          valA = a.fully_diluted_valuation ?? (a.current_price * (a.max_supply ?? 0))
          valB = b.fully_diluted_valuation ?? (b.current_price * (b.max_supply ?? 0))
          break
        case 'name':
          valA = a.name.toLowerCase()
          valB = b.name.toLowerCase()
          break
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      const numA = Number(valA) || 0
      const numB = Number(valB) || 0
      return sortOrder === 'asc' ? numA - numB : numB - numA
    })
  }, [rawProjects, searchQuery, userMaxFdv, sortBy, sortOrder, strictMode])

  return {
    projects: filteredAndSortedProjects,
    totalRaw: rawProjects.length,
    loading,
    error,
    source,
    lastUpdated,
    appliedFilters,
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
    refetch: () => fetchProjects(true, strictMode),
  }
}
