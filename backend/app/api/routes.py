from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Query
from ..models import FilterCriteria, ProjectListResponse
from ..services import coingecko_service, CryptoFilterService
from ..config import settings

router = APIRouter(prefix="/api", tags=["Crypto Projects"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "plan": settings.COINGECKO_PLAN,
        "base_url": settings.coingecko_base_url,
        "has_api_key": bool(settings.COINGECKO_API_KEY),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.get("/projects", response_model=ProjectListResponse)
async def get_filtered_projects(
    search: Optional[str] = Query(None, description="Partial project name or symbol match (e.g. eth)"),
    max_fdv: Optional[float] = Query(100_000_000.0, description="Maximum Fully Diluted Valuation in USD"),
    min_volume: Optional[float] = Query(50_000.0, description="Minimum 24h trading volume in USD"),
    min_tvl: Optional[float] = Query(50_000.0, description="Minimum Total Value Locked in USD"),
    preview_only: bool = Query(True, description="Filter by preview_listing == True"),
    require_equal_supply: bool = Query(True, description="Require max_supply == total_supply"),
    force_refresh: bool = Query(False, description="Bypass server-side TTL cache")
):
    projects, source = await coingecko_service.fetch_projects(force_refresh=force_refresh)

    criteria = FilterCriteria(
        min_market_cap=0.0,
        preview_listing=True if preview_only else None,
        require_max_equals_total_supply=require_equal_supply,
        max_fdv=max_fdv if max_fdv is not None else 100_000_000.0,
        min_volume=min_volume if min_volume is not None else 50_000.0,
        min_tvl=min_tvl if min_tvl is not None else 50_000.0
    )

    filtered = CryptoFilterService.apply_filters(
        projects=projects,
        criteria=criteria,
        search_query=search
    )

    return ProjectListResponse(
        items=filtered,
        total=len(filtered),
        applied_filters={
            "min_market_cap": "> 0",
            "preview_listing": preview_only,
            "max_equals_total_supply": require_equal_supply,
            "max_fdv": f"< ${criteria.max_fdv:,.2f}",
            "min_volume": f"> ${criteria.min_volume:,.2f}",
            "min_tvl": f"> ${criteria.min_tvl:,.2f}",
            "search_query": search
        },
        source=source,
        timestamp=datetime.now(timezone.utc)
    )
