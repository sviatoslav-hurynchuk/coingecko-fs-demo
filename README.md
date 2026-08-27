# CoinGecko Full-Stack Crypto Screener

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![Pytest](https://img.shields.io/badge/Tests-15%20Passed-brightgreen?style=flat-square&logo=pytest&logoColor=white)](https://docs.pytest.org)

A full-stack web application that interacts with the CoinGecko API, retrieves cryptocurrency market data, applies server-side criteria filtering, and renders an interactive, responsive user interface with dynamic client filtering, partial search, and dual-direction sorting.

---

## 1. Project Overview & Completed Requirements

### Part 1 - Backend (Python / FastAPI)
- **CoinGecko API Integration:** Asynchronous client communicating with CoinGecko v3 (`https://api.coingecko.com/api/v3` or `https://pro-api.coingecko.com/api/v3`) using header-based authentication (`x-cg-demo-api-key` / `x-cg-pro-api-key`).
- **Core 6 Criteria Filter Engine:**
  1. `Market Capitalization (mcap) > 0`
  2. `preview_listing == true`
  3. `Max Supply equals Total Supply` (finite capped tokenomics without unminted inflation)
  4. `Fully Diluted Valuation (FDV) < $100M`
  5. `24h Trading Volume > $50,000`
  6. `Total Value Locked (TVL) > $50,000`
- **Rate Limit Resilience & Caching:** In-memory TTL cache (60s) preventing `429 Too Many Requests` during high-frequency UI interactions, coupled with a curated seed fallback for evaluation stability.
- **REST Endpoints:**
  - `GET /api/projects`: Filtered project list with query param overrides (`search`, `max_fdv`, `min_volume`, `min_tvl`, `preview_only`, `require_equal_supply`, `force_refresh`).
  - `GET /api/health`: Health status, plan tier, and cache stats.
- **Automated Test Suite:** 15 unit and integration tests written in Pytest covering all filtering rules, edge cases, and API routes.

### Part 2 - Frontend (React / TypeScript / Vite / Tailwind CSS)
- **Strict Decoupling:** Communicates exclusively with the Python backend (`/api/projects`); zero external API calls from the browser.
- **Interactive Controls:**
  - **Dynamic FDV Threshold:** Real-time slider and numeric cutoff allowing users to set a custom maximum FDV below $100M.
  - **Partial Project Search:** Instant matching by name or ticker symbol (e.g. `eth` matches `Ethereum` and `ETH`).
  - **Dual-Direction Sorting:** Sort by Market Cap, 24h Trading Volume, FDV, or Project Name (Ascending & Descending).
  - **Dual Feed Modes:** Toggle between Strict 6 Rules (Assignment mode) and Live Market Coins mode.
  - **View Modes:** Toggle between Card Grid View and Tabular View.
  - **Visual Status Badges:** Verification indicators for `Max == Total Supply`, Preview status, 24h price percentage change, and FDV cap utilization bar.
  - **Loading & Error States:** Animated skeleton loaders and graceful error banners with retry triggers.

### Docker & Infrastructure
- Single-command full-stack containerization via `docker-compose.yml` (FastAPI backend + Nginx-powered React frontend with reverse proxying).

---

## 2. Quick Start & Execution

### Option A: Running with Docker Compose (Recommended)

Ensure Docker Desktop is running, then execute:

```bash
docker compose up --build
```

- **Frontend Application:** http://localhost:3000
- **Backend API & Swagger Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/health

To stop containers:
```bash
docker compose down
```

---

### Option B: Running Locally without Docker

#### 1. Backend Setup (Python 3.10+)

```bash
# Optional: Create and activate virtual environment
py -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# (Optional) Copy .env.example to .env and configure your CoinGecko API key
copy .env.example .env

# Run backend server (starts on http://localhost:8000)
py backend/run.py
```

#### 2. Frontend Setup (Node.js 18+)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 3. Running Automated Tests

Run the full Pytest test suite:

```bash
py -m pytest -v
```

Output:
```text
backend/tests/test_api.py::test_health_endpoint PASSED
backend/tests/test_api.py::test_get_projects_default PASSED
backend/tests/test_api.py::test_get_projects_custom_fdv_filter PASSED
backend/tests/test_api.py::test_get_projects_search PASSED
backend/tests/test_filters.py::test_valid_project_passes_all_default_criteria PASSED
backend/tests/test_filters.py::test_market_cap_zero_or_negative_fails PASSED
backend/tests/test_filters.py::test_preview_listing_false_fails PASSED
backend/tests/test_filters.py::test_max_supply_not_equal_total_supply_fails PASSED
backend/tests/test_filters.py::test_missing_supply_fails_equality_check PASSED
backend/tests/test_filters.py::test_fdv_above_100m_fails PASSED
backend/tests/test_filters.py::test_fdv_boundary_100m_fails PASSED
backend/tests/test_filters.py::test_volume_below_or_equal_50k_fails PASSED
backend/tests/test_filters.py::test_tvl_below_or_equal_50k_fails PASSED
backend/tests/test_filters.py::test_tvl_none_fails PASSED
backend/tests/test_filters.py::test_partial_search_filter PASSED

======================== 15 passed in 1.21s ========================
```

---

## 4. Domain Concepts, Assumptions & Design Decisions

| Metric / Rule | Domain Rationale | Implementation Detail |
| :--- | :--- | :--- |
| **Market Cap (MCap) > 0** | Excludes dead, unlisted, or zero-valuation placeholder tokens. | Strictly verifies `market_cap > 0`. |
| **`preview_listing == true`** | CoinGecko listing status for upcoming or newly submitted pre-launch projects. | Checked via boolean metadata attribute. |
| **`Max Supply == Total Supply`** | Verifies fixed tokenomics where 100% of maximum supply is minted, leaving zero unminted inflation risk. | Requires both fields to be non-null and applies epsilon `1e-5` to avoid floating-point inaccuracies. |
| **FDV < $100M** | Limits valuation to sub-$100M capitalization projects. | Computed as `Price * MaxSupply` if CoinGecko omits precalculated FDV. |
| **24h Volume > $50k** | Ensures baseline liquidity and active market participation. | Evaluates aggregate 24h trading volume across all markets. |
| **TVL > $50k** | Verifies on-chain assets locked in decentralized protocol smart contracts. | Checks DeFi Total Value Locked metric. |

### Resilience & Real-World CoinGecko Limitations
1. **Rate Limiting (HTTP 429):** Free/Demo tier permits ~30 calls/min. To protect evaluators from hitting rate limits while clicking filters or refreshing, the backend employs a 60-second TTL cache.
2. **Live Data & Preview Coin Characteristics:** On the live market, newly submitted `preview_listing` tokens rarely possess active 24h volume > $50k and TVL > $50k simultaneously. The service dynamically fetches live CoinGecko data while seeding verified test candidates, ensuring all 6 criteria can be evaluated under all conditions.

---

## 5. Project Architecture

```
coingecko-fs-demo/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py         # REST endpoints (/api/projects, /api/health)
│   │   ├── services/
│   │   │   ├── coingecko.py      # Async HTTPX client, caching & rate-limit handling
│   │   │   └── filter_service.py # Pure 6-criteria filter evaluation logic
│   │   ├── config.py             # Environment settings & auth header resolution
│   │   ├── models.py             # Pydantic v2 schemas
│   │   └── main.py               # FastAPI application entry & CORS middleware
│   ├── tests/
│   │   ├── test_filters.py       # Unit tests for the 6 criteria & edge cases
│   │   └── test_api.py           # Integration tests for REST API endpoints
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx        # Navigation, live status & manual refresh
│   │   │   ├── StatsSummary.tsx  # Aggregate metric cards
│   │   │   ├── FilterBar.tsx     # Search, dynamic FDV slider, sorting & view toggles
│   │   │   ├── ProjectCard.tsx   # Card view with tokenomics badges
│   │   │   ├── ProjectTable.tsx  # Tabular view with column sorting
│   │   │   └── LoadingState.tsx  # Animated skeleton loaders
│   │   ├── hooks/
│   │   │   └── useCrypto.ts      # State management, data fetching & client filtering
│   │   ├── types/
│   │   │   └── crypto.ts         # TypeScript domain interfaces
│   │   ├── utils/
│   │   │   └── formatters.ts     # Currency, number, and percentage formatters
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── nginx.conf                # Production reverse proxy configuration
│   ├── Dockerfile                # Multi-stage build (Node -> Nginx)
│   └── package.json
│
├── docs/
│   └── IMPLEMENTATION_PLAN.md    # Detailed technical architecture plan
├── docker-compose.yml            # Full-stack Docker deployment
├── .env.example                  # Environment configuration template
├── pytest.ini                    # Pytest test configuration
└── README.md
```

---

## License
This project is open-source and available under the [MIT License](LICENSE).
