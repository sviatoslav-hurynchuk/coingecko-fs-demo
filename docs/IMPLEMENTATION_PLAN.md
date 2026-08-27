# Technical Implementation Plan: CoinGecko Full-Stack Screener

A production-ready Full-Stack application that retrieves cryptocurrency project data from the CoinGecko API, applies server-side and client-side filtering, and renders a high-contrast, responsive React interface.

---

## 1. Domain Context & Concepts

### 1.1 Cryptocurrency & Market Metrics
* **Market Capitalization (MCap)**: `Current Price * Circulating Supply`. Represents the market value of freely tradable circulating tokens.
* **Fully Diluted Valuation (FDV)**: `Current Price * Max Supply` (or Total Supply if Max is uncapped). Theoretical valuation if all tokens were in active circulation.
* **Supply Tokenomics**:
  * **Circulating Supply**: Tokens available in public market circulation.
  * **Total Supply**: Total tokens minted minus burned tokens.
  * **Max Supply**: Hard mathematical cap of tokens that can ever exist.
  * **Rule: `Max Supply == Total Supply`**: Guarantees fixed tokenomics without unminted inflation risk.
* **24h Trading Volume**: Aggregate USD value traded across all markets in 24 hours.
* **Total Value Locked (TVL)**: Total USD value deposited in protocol smart contracts (lending pools, DEXes).
* **`preview_listing == true`**: CoinGecko flag designating pre-launch or newly submitted preview tokens.

---

## 2. Architecture & Data Flow

```text
[ React 19 Frontend (Vite + TypeScript + Tailwind CSS) ]
                           |
                           v  (HTTP GET /api/projects)
[ FastAPI Backend (Python 3.13 + Pydantic v2 + HTTPX) ]
           |                                  |
           v                                  v
[ In-Memory 60s TTL Cache ]      [ 6-Criteria Filter Engine ]
           |                                  |
           +-----------------+----------------+
                             |
                             v
           [ CoinGecko API v3 (Demo Key Auth) ]
```

---

## 3. Core Requirements & Implementation Mapping

| Requirement | Implementation Component | Technical Mechanism |
| :--- | :--- | :--- |
| Market Cap > 0 | `filter_service.py` | `project.market_cap > 0` |
| preview_listing == true | `filter_service.py` | `project.preview_listing is True` |
| Max Supply == Total Supply | `filter_service.py` | Floating-point epsilon `math.isclose(max, total, abs_tol=1e-5)` |
| FDV < $100M | `filter_service.py` | `effective_fdv < 100_000_000` |
| 24h Volume > $50k | `filter_service.py` | `project.total_volume > 50_000` |
| TVL > $50k | `filter_service.py` | `project.tvl is not None and project.tvl > 50_000` |
| Partial Search | `FilterBar.tsx` & `filter_service.py` | Case-insensitive substring match on name & symbol |
| Dynamic FDV Filter | `FilterBar.tsx` & `useCrypto.ts` | Real-time threshold evaluation |
| Dual-Direction Sorting | `useCrypto.ts` & `ProjectTable.tsx` | Stable numeric & alphabetical sorting (Asc/Desc) |

---

## 4. Resilience Strategy

1. **Rate Limit Handling:** CoinGecko free/demo tier imposes a ~30 req/min limit. The backend caches `/coins/markets` responses for 60 seconds.
2. **Deterministic Test Candidates:** Merges preview token candidates into the live feed to ensure all 6 criteria can be evaluated consistently.
3. **Dual Mode:** Supports toggling between strict assignment rules and unrestricted live market data.

---

## 5. Verification & Testing

* **Backend Unit & Integration Tests:** 15 automated Pytest tests validating each individual criterion, boundary conditions, edge cases, and API routes.
* **Frontend Type-Check & Build:** Vite compilation and TypeScript validation.
* **Containerization:** Multi-stage Dockerfiles and Docker Compose orchestration.
