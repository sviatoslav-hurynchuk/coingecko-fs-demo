from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class CryptoProject(BaseModel):
    id: str = Field(..., description="Unique identifier of the project (e.g. bitcoin)")
    symbol: str = Field(..., description="Ticker symbol (e.g. btc)")
    name: str = Field(..., description="Display name of the cryptocurrency")
    image: Optional[str] = Field(None, description="URL of project icon")
    current_price: float = Field(..., description="Current price in USD")
    market_cap: float = Field(..., description="Circulating market capitalization in USD")
    market_cap_rank: Optional[int] = Field(None, description="Market cap rank on CoinGecko")
    fully_diluted_valuation: Optional[float] = Field(None, description="Fully diluted valuation (FDV) in USD")
    total_volume: float = Field(..., description="24-hour trading volume in USD")
    circulating_supply: Optional[float] = Field(None, description="Number of circulating tokens")
    total_supply: Optional[float] = Field(None, description="Total number of minted tokens minus burned")
    max_supply: Optional[float] = Field(None, description="Maximum potential supply ceiling")
    preview_listing: bool = Field(False, description="CoinGecko preview status flag")
    tvl: Optional[float] = Field(None, description="Total value locked in smart contracts in USD")
    price_change_percentage_24h: Optional[float] = Field(None, description="24h price percentage change")


class FilterCriteria(BaseModel):
    min_market_cap: float = 0.0
    preview_listing: Optional[bool] = True
    require_max_equals_total_supply: bool = True
    max_fdv: Optional[float] = 100_000_000.0
    min_volume: float = 50_000.0
    min_tvl: float = 50_000.0


class ProjectListResponse(BaseModel):
    items: List[CryptoProject]
    total: int
    applied_filters: Dict[str, Any]
    source: str
    timestamp: datetime
