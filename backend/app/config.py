from typing import Optional, Dict
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    COINGECKO_API_KEY: Optional[str] = None
    COINGECKO_PLAN: str = "demo"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    CACHE_TTL_SECONDS: int = 60

    @property
    def coingecko_base_url(self) -> str:
        # CoinGecko requires distinct base URLs for Pro vs Demo tiers to route through proper rate-limit gateways.
        if self.COINGECKO_PLAN.lower() == "pro":
            return "https://pro-api.coingecko.com/api/v3"
        return "https://api.coingecko.com/api/v3"

    @property
    def coingecko_headers(self) -> Dict[str, str]:
        # Using headers instead of query parameters prevents sensitive API tokens from leaking in server access logs and proxy traces.
        headers = {
            "Accept": "application/json",
            "User-Agent": "CoinGecko-FS-Demo/1.0"
        }
        if self.COINGECKO_API_KEY and self.COINGECKO_API_KEY.strip():
            key = self.COINGECKO_API_KEY.strip()
            if self.COINGECKO_PLAN.lower() == "pro":
                headers["x-cg-pro-api-key"] = key
            else:
                headers["x-cg-demo-api-key"] = key
        return headers


settings = Settings()
