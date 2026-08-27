import math
from typing import List, Optional, Tuple
from ..models import CryptoProject, FilterCriteria


class CryptoFilterService:

    @staticmethod
    def matches_project(project: CryptoProject, criteria: FilterCriteria) -> Tuple[bool, Optional[str]]:
        # Assets without active valuation are dead or unindexed, violating market presence requirement.
        if project.market_cap <= criteria.min_market_cap:
            return False, f"Market cap ({project.market_cap}) must be > {criteria.min_market_cap}"

        # Explicit check ensures only unlaunched or provisional tokens pass when preview_listing is strictly required.
        if criteria.preview_listing is not None:
            if project.preview_listing != criteria.preview_listing:
                return False, f"preview_listing must be {criteria.preview_listing}"

        # A tokenomics equality constraint requires both supply caps to exist; None cannot be assumed equal.
        if criteria.require_max_equals_total_supply:
            if project.max_supply is None or project.total_supply is None:
                return False, "Both max_supply and total_supply must be defined"
            # Floating-point epsilon handles micro-token fractional discrepancies from blockchain decimals.
            if not math.isclose(project.max_supply, project.total_supply, rel_tol=1e-5, abs_tol=1e-5):
                return False, f"max_supply ({project.max_supply}) != total_supply ({project.total_supply})"

        # Fallback to computing FDV from price * max_supply prevents exclusion of assets where CoinGecko omits the precomputed field.
        fdv = project.fully_diluted_valuation
        if fdv is None and project.max_supply is not None:
            fdv = project.current_price * project.max_supply
        elif fdv is None and project.total_supply is not None:
            fdv = project.current_price * project.total_supply

        if fdv is None or fdv >= criteria.max_fdv:
            return False, f"FDV ({fdv}) must be < {criteria.max_fdv}"

        # Low-volume tokens exhibit extreme slippage and unreliable spot pricing.
        if project.total_volume <= criteria.min_volume:
            return False, f"Volume ({project.total_volume}) must be > {criteria.min_volume}"

        # DeFi protocol verification requires on-chain locked assets.
        if project.tvl is None or project.tvl <= criteria.min_tvl:
            return False, f"TVL ({project.tvl}) must be > {criteria.min_tvl}"

        return True, None

    @classmethod
    def apply_filters(
        cls,
        projects: List[CryptoProject],
        criteria: FilterCriteria,
        search_query: Optional[str] = None
    ) -> List[CryptoProject]:
        filtered: List[CryptoProject] = []

        query = search_query.strip().lower() if search_query else None

        for project in projects:
            is_match, _ = cls.matches_project(project, criteria)
            if not is_match:
                continue

            # Case-insensitive substring matching on name or symbol enables intuitive search (e.g. 'eth' -> 'Ethereum' or 'ETH').
            if query:
                name_match = query in project.name.lower()
                symbol_match = query in project.symbol.lower()
                if not (name_match or symbol_match):
                    continue

            filtered.append(project)

        return filtered
