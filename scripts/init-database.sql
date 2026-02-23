-- HAM Database Initialization Script
-- Author: 拉普兰德 (CB-Architect)
-- Date: 2026-02-23

-- ============================================
-- 1. CREATE DATABASE AND USER
-- ============================================

-- Run as postgres superuser first:
-- CREATE DATABASE ham;
-- CREATE USER ham_admin WITH ENCRYPTED PASSWORD 'ham_secure_2026';
-- GRANT ALL PRIVILEGES ON DATABASE ham TO ham_admin;
-- \c ham
-- GRANT ALL ON SCHEMA public TO ham_admin;

-- ============================================
-- 2. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- 3. ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(64) NOT NULL UNIQUE,
    display_name    VARCHAR(128),
    avatar_url      TEXT,
    password_hash   VARCHAR(255),
    email_verified  BOOLEAN DEFAULT FALSE,
    account_type    VARCHAR(32) DEFAULT 'personal',
    status          VARCHAR(32) DEFAULT 'active',
    is_developer    BOOLEAN DEFAULT FALSE,
    developer_name  VARCHAR(128),
    developer_bio   TEXT,
    website_url     TEXT,
    stripe_customer_id  VARCHAR(64) UNIQUE,
    balance_cents       BIGINT DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_accounts_username ON accounts(username) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_accounts_developers ON accounts(id) WHERE is_developer = TRUE AND deleted_at IS NULL;

-- ============================================
-- 4. AGENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    slug            VARCHAR(64) NOT NULL UNIQUE,
    name            VARCHAR(128) NOT NULL,
    tagline         VARCHAR(256),
    description     TEXT,
    icon_url        TEXT,
    banner_url      TEXT,
    screenshots     JSONB DEFAULT '[]',
    category        VARCHAR(64),
    tags            TEXT[] DEFAULT '{}',
    version         VARCHAR(32) DEFAULT '1.0.0',
    min_openclaw_version VARCHAR(32),
    manifest        JSONB NOT NULL DEFAULT '{}',
    capabilities    TEXT[] DEFAULT '{}',
    required_tools  TEXT[] DEFAULT '{}',
    status          VARCHAR(32) DEFAULT 'draft',
    visibility      VARCHAR(32) DEFAULT 'public',
    published_at    TIMESTAMPTZ,
    stats           JSONB DEFAULT '{"downloads": 0, "active_users": 0, "avg_rating": null, "review_count": 0}',
    is_free         BOOLEAN DEFAULT TRUE,
    default_plan_id UUID,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agents_account ON agents(account_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agents_tags ON agents USING GIN(tags) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agents_published ON agents(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;

-- ============================================
-- 5. PRICING_PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_plans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id        UUID NOT NULL REFERENCES agents(id),
    name            VARCHAR(64) NOT NULL,
    description     TEXT,
    pricing_type    VARCHAR(32) NOT NULL,
    price_cents     BIGINT DEFAULT 0,
    currency        VARCHAR(3) DEFAULT 'USD',
    billing_interval    VARCHAR(16),
    billing_interval_count INT DEFAULT 1,
    trial_days          INT DEFAULT 0,
    limits          JSONB DEFAULT '{"requests_per_day": null, "requests_per_month": null}',
    features        JSONB DEFAULT '[]',
    stripe_price_id     VARCHAR(64) UNIQUE,
    stripe_product_id   VARCHAR(64),
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_plans_agent ON pricing_plans(agent_id) WHERE is_active = TRUE AND deleted_at IS NULL;

-- ============================================
-- 6. PURCHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    agent_id        UUID NOT NULL REFERENCES agents(id),
    plan_id         UUID NOT NULL REFERENCES pricing_plans(id),
    purchase_type   VARCHAR(32) NOT NULL,
    amount_cents    BIGINT NOT NULL,
    currency        VARCHAR(3) NOT NULL,
    subscription_status VARCHAR(32),
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    cancel_at           TIMESTAMPTZ,
    canceled_at         TIMESTAMPTZ,
    stripe_subscription_id  VARCHAR(64) UNIQUE,
    stripe_payment_intent_id VARCHAR(64),
    stripe_invoice_id       VARCHAR(64),
    status          VARCHAR(32) DEFAULT 'active',
    usage_stats     JSONB DEFAULT '{"requests_used": 0, "tokens_used": 0}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_purchases_account ON purchases(account_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_agent ON purchases(agent_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_active ON purchases(account_id, agent_id) WHERE status = 'active' AND deleted_at IS NULL;

-- ============================================
-- 7. TRIGGER FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE!
-- ============================================
SELECT 'HAM Database Schema Created Successfully!' AS status;
