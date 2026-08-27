export function formatCurrency(amount: number | null | undefined, compact: boolean = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00'
  }

  // Micro-penny crypto assets require higher fractional precision to avoid displaying misleading '$0.00'.
  if (amount > 0 && amount < 1) {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
  }

  if (compact && amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`
  }
  if (compact && amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`
  }

  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A'
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%'
  }
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(2)}%`
}
