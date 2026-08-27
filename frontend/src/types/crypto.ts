export interface CryptoProject {
  id: string
  symbol: string
  name: string
  image: string | null
  current_price: number
  market_cap: number
  market_cap_rank: number | null
  fully_diluted_valuation: number | null
  total_volume: number
  circulating_supply: number | null
  total_supply: number | null
  max_supply: number | null
  preview_listing: boolean
  tvl: number | null
  price_change_percentage_24h: number | null
}

export interface ProjectListResponse {
  items: CryptoProject[]
  total: number
  applied_filters: Record<string, unknown>
  source: string
  timestamp: string
}

export type SortField = 'market_cap' | 'total_volume' | 'fully_diluted_valuation' | 'name'
export type SortOrder = 'asc' | 'desc'
export type ViewMode = 'cards' | 'table'
