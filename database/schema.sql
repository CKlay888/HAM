-- ============================================
-- HAM (Human Agent Market) Database Schema v2.0
-- Author: 拉普兰德 (CB-Architect)
-- Date: 2026-02-26
-- Currency: CNY (人民币单币种)
-- ============================================

-- 1. 用户账户表
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url TEXT,
    oauth_provider VARCHAR(50),      -- wechat/alipay/github
    oauth_id VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user', -- user/creator/admin
    status VARCHAR(20) DEFAULT 'active', -- active/suspended/deleted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP              -- 软删除
);

-- 2. AI代理表
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES accounts(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL友好标识
    description TEXT,
    long_description TEXT,
    avatar_url TEXT,
    category VARCHAR(50),             -- assistant/creative/business/dev
    tags TEXT[],                       -- PostgreSQL数组
    status VARCHAR(20) DEFAULT 'draft', -- draft/pending_review/published/suspended
    version VARCHAR(20) DEFAULT '1.0.0',
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 3. 定价方案表
CREATE TABLE pricing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,        -- "免费试用"/"基础版"/"专业版"
    type VARCHAR(20) NOT NULL,         -- free/one_time/subscription/usage
    price DECIMAL(10,2) NOT NULL,      -- 单位: 人民币元
    billing_cycle VARCHAR(20),         -- monthly/yearly (订阅制用)
    usage_quota INTEGER,               -- 按量计费的配额
    features JSONB,                    -- 功能列表 {"features": ["xxx", "yyy"]}
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 团队表 (B端)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    owner_id UUID REFERENCES accounts(id),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. 团队成员表
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- owner/admin/member
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 6. 购买记录表
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES accounts(id),
    agent_id UUID REFERENCES agents(id),
    plan_id UUID REFERENCES pricing_plans(id),
    team_id UUID REFERENCES teams(id), -- 团队购买时关联
    type VARCHAR(20) NOT NULL,         -- one_time/subscription
    amount DECIMAL(10,2) NOT NULL,     -- 实付金额
    status VARCHAR(20) DEFAULT 'active', -- active/expired/cancelled/refunded
    payment_method VARCHAR(50),        -- wechat/alipay
    payment_id VARCHAR(255),           -- 第三方支付单号
    starts_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,              -- 订阅到期时间
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. 团队订阅表 (Seat机制)
CREATE TABLE team_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id),
    plan_id UUID REFERENCES pricing_plans(id),
    total_seats INTEGER NOT NULL,      -- 购买的座位数
    used_seats INTEGER DEFAULT 0,      -- 已分配座位数
    status VARCHAR(20) DEFAULT 'active',
    starts_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. 座位分配表
CREATE TABLE seat_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES team_subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES accounts(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(subscription_id, user_id)
);

-- 9. 退款表
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID REFERENCES purchases(id),
    requester_id UUID REFERENCES accounts(id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending/approved/rejected/completed
    reviewed_by UUID REFERENCES accounts(id),
    reviewed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. 审计日志表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES accounts(id),
    action VARCHAR(100) NOT NULL,      -- 'agent.update_price', 'refund.approve'
    target_type VARCHAR(50),           -- 'agent', 'purchase', 'refund'
    target_id UUID,
    old_value JSONB,                   -- 修改前的值
    new_value JSONB,                   -- 修改后的值
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_phone ON accounts(phone);
CREATE INDEX idx_accounts_oauth ON accounts(oauth_provider, oauth_id);

CREATE INDEX idx_agents_creator ON agents(creator_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_slug ON agents(slug);

CREATE INDEX idx_pricing_plans_agent ON pricing_plans(agent_id);

CREATE INDEX idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX idx_purchases_agent ON purchases(agent_id);
CREATE INDEX idx_purchases_team ON purchases(team_id);
CREATE INDEX idx_purchases_status ON purchases(status);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

CREATE INDEX idx_team_subscriptions_team ON team_subscriptions(team_id);
CREATE INDEX idx_team_subscriptions_agent ON team_subscriptions(agent_id);

CREATE INDEX idx_seat_assignments_subscription ON seat_assignments(subscription_id);
CREATE INDEX idx_seat_assignments_user ON seat_assignments(user_id);

CREATE INDEX idx_refunds_purchase ON refunds(purchase_id);
CREATE INDEX idx_refunds_status ON refunds(status);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
