# HAM Database Schema v1.0

**设计者**: 拉普兰德 (CB-Architect)  
**日期**: 2026-02-23  
**状态**: 初版设计，待评审

---

## 概述

HAM (Human Agent Market) 核心数据模型，支持：
- Agent 发布与管理
- 灵活定价方案
- 购买与订阅追踪
- 用户账户体系

## 设计原则

1. **可扩展性** - 使用JSONB存储可变属性
2. **审计友好** - 全表软删除 + 时间戳
3. **多租户就绪** - account_id 贯穿全局
4. **国际化支持** - 金额使用最小货币单位(分)

---

## 表结构

### 1. accounts (用户账户)

```sql
CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 基础信息
    email           VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(64) NOT NULL UNIQUE,
    display_name    VARCHAR(128),
    avatar_url      TEXT,
    
    -- 认证
    password_hash   VARCHAR(255),           -- 可空，支持OAuth-only用户
    email_verified  BOOLEAN DEFAULT FALSE,
    
    -- 账户类型与状态
    account_type    VARCHAR(32) DEFAULT 'personal',  -- personal, team, enterprise
    status          VARCHAR(32) DEFAULT 'active',    -- active, suspended, deleted
    
    -- 开发者信息 (当用户发布Agent时填写)
    is_developer    BOOLEAN DEFAULT FALSE,
    developer_name  VARCHAR(128),
    developer_bio   TEXT,
    website_url     TEXT,
    
    -- 支付信息
    stripe_customer_id  VARCHAR(64) UNIQUE,
    balance_cents       BIGINT DEFAULT 0,   -- 账户余额(分)
    
    -- 扩展字段
    metadata        JSONB DEFAULT '{}',
    settings        JSONB DEFAULT '{}',     -- 用户偏好设置
    
    -- 审计
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- 索引
CREATE INDEX idx_accounts_email ON accounts(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_username ON accounts(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_stripe ON accounts(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_accounts_developers ON accounts(id) WHERE is_developer = TRUE AND deleted_at IS NULL;
```

### 2. agents (AI代理)

```sql
CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 归属
    account_id      UUID NOT NULL REFERENCES accounts(id),
    
    -- 基础信息
    slug            VARCHAR(64) NOT NULL UNIQUE,     -- URL友好标识
    name            VARCHAR(128) NOT NULL,
    tagline         VARCHAR(256),                    -- 一句话描述
    description     TEXT,                            -- Markdown格式详细描述
    
    -- 媒体
    icon_url        TEXT,
    banner_url      TEXT,
    screenshots     JSONB DEFAULT '[]',              -- [{url, caption}]
    
    -- 分类与发现
    category        VARCHAR(64),                     -- coding, writing, research, etc.
    tags            TEXT[] DEFAULT '{}',
    
    -- 版本与兼容性
    version         VARCHAR(32) DEFAULT '1.0.0',
    min_openclaw_version VARCHAR(32),
    
    -- 技术配置
    manifest        JSONB NOT NULL,                  -- Agent配置清单
    capabilities    TEXT[] DEFAULT '{}',             -- 声明的能力标签
    required_tools  TEXT[] DEFAULT '{}',             -- 依赖的工具
    
    -- 发布状态
    status          VARCHAR(32) DEFAULT 'draft',     -- draft, pending_review, published, rejected, archived
    visibility      VARCHAR(32) DEFAULT 'public',    -- public, unlisted, private
    published_at    TIMESTAMPTZ,
    
    -- 统计 (定期聚合更新)
    stats           JSONB DEFAULT '{
        "downloads": 0,
        "active_users": 0,
        "avg_rating": null,
        "review_count": 0
    }',
    
    -- 定价 (关联pricing_plans)
    is_free         BOOLEAN DEFAULT TRUE,
    default_plan_id UUID,                            -- 默认推荐方案
    
    -- 扩展
    metadata        JSONB DEFAULT '{}',
    
    -- 审计
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- 索引
CREATE UNIQUE INDEX idx_agents_slug ON agents(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_agents_account ON agents(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_agents_category ON agents(category) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_agents_tags ON agents USING GIN(tags) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_agents_published ON agents(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_agents_search ON agents USING GIN(to_tsvector('english', name || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(description, '')));
```

### 3. pricing_plans (定价方案)

```sql
CREATE TABLE pricing_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 归属
    agent_id        UUID NOT NULL REFERENCES agents(id),
    
    -- 方案信息
    name            VARCHAR(64) NOT NULL,            -- Free, Pro, Enterprise
    description     TEXT,
    
    -- 定价类型
    pricing_type    VARCHAR(32) NOT NULL,            -- free, one_time, subscription, usage_based
    
    -- 金额 (分为单位)
    price_cents     BIGINT DEFAULT 0,
    currency        VARCHAR(3) DEFAULT 'USD',
    
    -- 订阅周期 (subscription类型)
    billing_interval    VARCHAR(16),                 -- month, year
    billing_interval_count INT DEFAULT 1,
    trial_days          INT DEFAULT 0,
    
    -- 使用量限制
    limits          JSONB DEFAULT '{
        "requests_per_day": null,
        "requests_per_month": null,
        "tokens_per_month": null,
        "storage_mb": null
    }',
    
    -- 功能清单
    features        JSONB DEFAULT '[]',              -- ["Feature 1", "Feature 2"]
    
    -- Stripe集成
    stripe_price_id     VARCHAR(64) UNIQUE,
    stripe_product_id   VARCHAR(64),
    
    -- 状态
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,                   -- 展示排序
    
    -- 扩展
    metadata        JSONB DEFAULT '{}',
    
    -- 审计
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- 索引
CREATE INDEX idx_plans_agent ON pricing_plans(agent_id) WHERE is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_plans_stripe ON pricing_plans(stripe_price_id) WHERE stripe_price_id IS NOT NULL;
```

### 4. purchases (购买记录)

```sql
CREATE TABLE purchases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 关联
    account_id      UUID NOT NULL REFERENCES accounts(id),
    agent_id        UUID NOT NULL REFERENCES agents(id),
    plan_id         UUID NOT NULL REFERENCES pricing_plans(id),
    
    -- 购买类型
    purchase_type   VARCHAR(32) NOT NULL,            -- one_time, subscription
    
    -- 金额记录 (快照)
    amount_cents    BIGINT NOT NULL,
    currency        VARCHAR(3) NOT NULL,
    
    -- 订阅信息
    subscription_status VARCHAR(32),                 -- active, past_due, canceled, expired
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    cancel_at           TIMESTAMPTZ,
    canceled_at         TIMESTAMPTZ,
    
    -- Stripe集成
    stripe_subscription_id  VARCHAR(64) UNIQUE,
    stripe_payment_intent_id VARCHAR(64),
    stripe_invoice_id       VARCHAR(64),
    
    -- 状态
    status          VARCHAR(32) DEFAULT 'active',    -- active, refunded, disputed, canceled
    
    -- 使用量追踪 (usage_based方案)
    usage_stats     JSONB DEFAULT '{
        "requests_used": 0,
        "tokens_used": 0,
        "last_reset_at": null
    }',
    
    -- 扩展
    metadata        JSONB DEFAULT '{}',
    
    -- 审计
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,                     -- 一次性购买的过期时间
    deleted_at      TIMESTAMPTZ,
    
    -- 防重复购买约束
    CONSTRAINT unique_active_subscription UNIQUE (account_id, agent_id, plan_id, subscription_status)
);

-- 索引
CREATE INDEX idx_purchases_account ON purchases(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_purchases_agent ON purchases(agent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_purchases_active ON purchases(account_id, agent_id) 
    WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_purchases_stripe_sub ON purchases(stripe_subscription_id) 
    WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX idx_purchases_expiring ON purchases(current_period_end) 
    WHERE subscription_status = 'active';
```

---

## ER关系图

```
┌─────────────┐       ┌─────────────┐
│  accounts   │       │   agents    │
│─────────────│       │─────────────│
│ id (PK)     │◄──────│ account_id  │
│ email       │       │ id (PK)     │
│ username    │       │ slug        │
│ ...         │       │ ...         │
└─────────────┘       └──────┬──────┘
      │                      │
      │                      │ 1:N
      │                      ▼
      │               ┌─────────────────┐
      │               │ pricing_plans   │
      │               │─────────────────│
      │               │ id (PK)         │
      │               │ agent_id (FK)   │
      │               │ pricing_type    │
      │               │ ...             │
      │               └────────┬────────┘
      │                        │
      │    ┌───────────────────┘
      │    │
      ▼    ▼
┌──────────────────┐
│    purchases     │
│──────────────────│
│ id (PK)          │
│ account_id (FK)  │
│ agent_id (FK)    │
│ plan_id (FK)     │
│ ...              │
└──────────────────┘
```

---

## 查询示例

### 获取用户已购买的所有Agent

```sql
SELECT DISTINCT a.* 
FROM agents a
JOIN purchases p ON p.agent_id = a.id
WHERE p.account_id = $1 
  AND p.status = 'active'
  AND (p.expires_at IS NULL OR p.expires_at > NOW())
  AND a.deleted_at IS NULL;
```

### 获取Agent的所有定价方案

```sql
SELECT * FROM pricing_plans
WHERE agent_id = $1
  AND is_active = TRUE
  AND deleted_at IS NULL
ORDER BY sort_order, price_cents;
```

### 检查用户是否有权限使用某Agent

```sql
SELECT EXISTS (
    SELECT 1 FROM purchases
    WHERE account_id = $1
      AND agent_id = $2
      AND status = 'active'
      AND (subscription_status IS NULL OR subscription_status = 'active')
      AND (expires_at IS NULL OR expires_at > NOW())
      AND deleted_at IS NULL
) OR EXISTS (
    SELECT 1 FROM agents
    WHERE id = $2
      AND is_free = TRUE
      AND status = 'published'
      AND deleted_at IS NULL
);
```

---

## 待讨论事项

1. **多币种支持** - 当前每个方案单一货币，是否需要多币种价格表？
2. **团队共享** - 企业购买后如何分配给团队成员？
3. **退款策略** - 需要单独的refunds表吗？
4. **审计日志** - 是否需要单独的audit_logs表追踪关键操作？
5. **API配额** - usage_based的配额重置逻辑放在哪里实现？

---

**🐺 架构就像狩猎，这只是第一口。等待各位的反馈！**
