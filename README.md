# ALICE-Settlement-SaaS

Trade settlement SaaS with multilateral netting, clearing, and T+2 lifecycle management.

## Architecture

```
Frontend (Next.js 15)          API Gateway (8081)
  /dashboard/console    →      POST /api/v1/settlement/settle
  /                            POST /api/v1/settlement/netting
                               POST /api/v1/settlement/clearing
                               GET  /api/v1/stats
                                        |
                          +-------------+-------------+
                          |             |             |
                   Netting Engine  Clearing CCP   Lifecycle Manager
                          |             |             |
                          +-------------+-------------+
                                        |
                               Settlement Ledger (DB)
```

## Features

| Feature | Description |
|---------|-------------|
| Multilateral Netting | Offset opposing positions across participants to minimize gross obligations |
| CCP Clearing | Central counterparty clearing with margin calls and collateral management |
| T+2 Lifecycle | Full trade lifecycle from execution through settlement with DVP enforcement |
| Fail Management | Automated detection, reporting, and resolution of settlement fails |
| Regulatory Compliance | CSDR, Dodd-Frank, EMIR compliance with full audit trails |
| Real-Time Analytics | Settlement efficiency metrics, fail rates, and liquidity forecasting |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /api/v1/settlement/settle | Submit a trade for settlement |
| POST | /api/v1/settlement/netting | Calculate multilateral net positions |
| POST | /api/v1/settlement/clearing | Submit clearing instruction to CCP |
| GET | /api/v1/stats | Settlement statistics and metrics |

### POST /api/v1/settlement/settle

```json
{
  "trade_id": "TRD-20260226-001",
  "buyer_id": "PARTY-A",
  "seller_id": "PARTY-B",
  "instrument": "AAPL",
  "quantity": 1000,
  "price": 182.50,
  "currency": "USD",
  "settlement_date": "2026-02-28"
}
```

### POST /api/v1/settlement/netting

```json
{
  "participant_id": "PARTY-A",
  "trades": [
    { "trade_id": "TRD-001", "direction": "buy", "quantity": 500, "price": 182.50 },
    { "trade_id": "TRD-002", "direction": "sell", "quantity": 300, "price": 183.00 }
  ],
  "instrument": "AAPL",
  "currency": "USD"
}
```

### POST /api/v1/settlement/clearing

```json
{
  "settlement_id": "STLM-20260226-001",
  "clearing_member": "CLEAR-MEMBER-01",
  "collateral_posted": 500000.00,
  "currency": "USD",
  "margin_call": false
}
```

## Quick Start

```bash
docker compose up -d
# API:      http://localhost:8081
# Frontend: http://localhost:3000
```

## License

AGPL-3.0-or-later
