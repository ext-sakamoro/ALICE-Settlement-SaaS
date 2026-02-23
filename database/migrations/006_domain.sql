-- ALICE Settlement: Domain-specific tables
CREATE TABLE IF NOT EXISTS settlement_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    trade_count INTEGER NOT NULL DEFAULT 0,
    gross_value DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    net_value DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    currency TEXT NOT NULL DEFAULT 'USD',
    settlement_type TEXT NOT NULL DEFAULT 't0' CHECK (settlement_type IN ('t0', 't1', 't2')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'clearing', 'settled', 'failed')),
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS netting_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES settlement_batches(id) ON DELETE CASCADE,
    counterparty TEXT NOT NULL,
    gross_payable DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    gross_receivable DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    net_amount DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    netting_ratio DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clearing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES settlement_batches(id) ON DELETE CASCADE,
    trade_id TEXT NOT NULL,
    asset TEXT NOT NULL,
    quantity DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    price DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    margin_required DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'cleared' CHECK (status IN ('pending', 'cleared', 'rejected', 'defaulted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_settlement_batches_user ON settlement_batches(user_id, created_at);
CREATE INDEX idx_netting_results_batch ON netting_results(batch_id);
CREATE INDEX idx_clearing_records_batch ON clearing_records(batch_id);
CREATE INDEX idx_clearing_records_trade ON clearing_records(trade_id);
