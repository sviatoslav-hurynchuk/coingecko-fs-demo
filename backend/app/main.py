from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router
from .services import coingecko_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # Explicitly draining the HTTP connection pool prevents unclosed socket warnings during process shutdown.
    await coingecko_service.close()


app = FastAPI(
    title="CoinGecko Full-Stack Screener API",
    version="1.0.0",
    description="REST API for querying and filtering cryptocurrency projects with CoinGecko data.",
    lifespan=lifespan
)

# Open CORS policy in development accommodates varied dev-server ports and Docker bridge networking.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
