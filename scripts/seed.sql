-- HAM Test Data Seed Script
-- Author: 拉普兰德 (CB-Architect)
-- Date: 2026-02-23

-- ============================================
-- TEST ACCOUNTS (Developers)
-- ============================================
INSERT INTO accounts (id, email, username, display_name, is_developer, developer_name, developer_bio, account_type, status) VALUES
('11111111-1111-1111-1111-111111111111', 'dev1@hamkt.ai', 'codemaster', 'Code Master', TRUE, 'Code Master Labs', '专注于代码生成和审查的AI工具开发者', 'personal', 'active'),
('22222222-2222-2222-2222-222222222222', 'dev2@hamkt.ai', 'datawise', 'DataWise AI', TRUE, 'DataWise Technologies', '数据分析和可视化AI解决方案提供商', 'team', 'active'),
('33333333-3333-3333-3333-333333333333', 'dev3@hamkt.ai', 'writebot', 'WriteBot Inc', TRUE, 'WriteBot', '智能写作和内容创作工具', 'enterprise', 'active'),
('44444444-4444-4444-4444-444444444444', 'user1@example.com', 'testuser1', 'Test User 1', FALSE, NULL, NULL, 'personal', 'active'),
('55555555-5555-5555-5555-555555555555', 'user2@example.com', 'testuser2', 'Test User 2', FALSE, NULL, NULL, 'personal', 'active');

-- ============================================
-- TEST AGENTS (10 Sample Agents)
-- ============================================
INSERT INTO agents (id, account_id, slug, name, tagline, description, category, tags, status, visibility, is_free, published_at, stats) VALUES
-- Agent 1: Code Review
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
 'code-reviewer-pro', 'Code Reviewer Pro', '智能代码审查，提升代码质量',
 '基于GPT-4的智能代码审查工具，支持多种编程语言，能够识别bug、安全漏洞和性能问题。',
 'coding', ARRAY['code-review', 'security', 'best-practices'], 'published', 'public', FALSE, NOW(), 
 '{"downloads": 1234, "active_users": 567, "avg_rating": 4.8, "review_count": 89}'),

-- Agent 2: SQL Generator
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111',
 'sql-wizard', 'SQL Wizard', '自然语言转SQL，数据库操作更简单',
 '将自然语言描述转换为优化的SQL查询，支持MySQL、PostgreSQL、SQLite等主流数据库。',
 'coding', ARRAY['sql', 'database', 'query'], 'published', 'public', TRUE, NOW(),
 '{"downloads": 2567, "active_users": 890, "avg_rating": 4.6, "review_count": 156}'),

-- Agent 3: Data Analyst
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222',
 'data-insight', 'Data Insight', 'AI驱动的数据分析助手',
 '上传数据文件，自动生成分析报告、可视化图表和关键洞察。支持CSV、Excel、JSON格式。',
 'research', ARRAY['data-analysis', 'visualization', 'reporting'], 'published', 'public', FALSE, NOW(),
 '{"downloads": 890, "active_users": 234, "avg_rating": 4.5, "review_count": 45}'),

-- Agent 4: Chart Generator  
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222',
 'chart-maker', 'Chart Maker', '一句话生成专业图表',
 '描述你想要的图表，自动生成ECharts/Chart.js代码。支持柱状图、折线图、饼图等20+图表类型。',
 'research', ARRAY['charts', 'visualization', 'echarts'], 'published', 'public', TRUE, NOW(),
 '{"downloads": 3456, "active_users": 1200, "avg_rating": 4.7, "review_count": 234}'),

-- Agent 5: Blog Writer
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333',
 'blog-writer', 'Blog Writer', 'SEO优化的博客文章生成器',
 '输入主题，生成SEO优化的长文章。支持中英文，自动添加标题、小标题、关键词。',
 'writing', ARRAY['blog', 'seo', 'content'], 'published', 'public', FALSE, NOW(),
 '{"downloads": 5678, "active_users": 2345, "avg_rating": 4.4, "review_count": 567}'),

-- Agent 6: Email Assistant
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333',
 'email-pro', 'Email Pro', '专业邮件撰写助手',
 '根据场景生成专业邮件，支持商务、客服、营销等多种场景。自动调整语气和格式。',
 'writing', ARRAY['email', 'business', 'communication'], 'published', 'public', TRUE, NOW(),
 '{"downloads": 4567, "active_users": 1890, "avg_rating": 4.6, "review_count": 345}'),

-- Agent 7: API Doc Generator
('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111',
 'api-documenter', 'API Documenter', '自动生成API文档',
 '分析代码自动生成OpenAPI规范文档，支持多种框架。包含示例请求和响应。',
 'coding', ARRAY['api', 'documentation', 'openapi'], 'published', 'public', FALSE, NOW(),
 '{"downloads": 1890, "active_users": 567, "avg_rating": 4.3, "review_count": 78}'),

-- Agent 8: Translation Pro
('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333',
 'translate-pro', 'Translation Pro', '专业级多语言翻译',
 '支持100+语言互译，保持专业术语准确性。特别优化技术文档、法律文件翻译。',
 'writing', ARRAY['translation', 'multilingual', 'localization'], 'published', 'public', FALSE, NOW(),
 '{"downloads": 7890, "active_users": 3456, "avg_rating": 4.7, "review_count": 890}'),

-- Agent 9: Test Generator (Draft)
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111',
 'test-generator', 'Test Generator', '自动生成单元测试',
 '分析代码逻辑，自动生成覆盖率高的单元测试。支持Jest、Pytest、JUnit等框架。',
 'coding', ARRAY['testing', 'unit-test', 'automation'], 'draft', 'public', FALSE, NULL,
 '{"downloads": 0, "active_users": 0, "avg_rating": null, "review_count": 0}'),

-- Agent 10: Meeting Summary (Pending Review)
('10101010-1010-1010-1010-101010101010', '22222222-2222-2222-2222-222222222222',
 'meeting-summary', 'Meeting Summary', '会议记录自动总结',
 '上传会议录音或文字记录，自动生成结构化会议纪要，包含行动项和决策点。',
 'research', ARRAY['meeting', 'summary', 'productivity'], 'pending_review', 'public', TRUE, NULL,
 '{"downloads": 0, "active_users": 0, "avg_rating": null, "review_count": 0}');

-- ============================================
-- TEST PRICING PLANS
-- ============================================
INSERT INTO pricing_plans (id, agent_id, name, pricing_type, price_cents, currency, billing_interval, features, is_active, sort_order) VALUES
-- Code Reviewer Pro Plans
('p1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Free', 'free', 0, 'USD', NULL, '["5次/天代码审查", "基础问题检测"]', TRUE, 0),
('p2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pro', 'subscription', 1999, 'USD', 'month', '["无限代码审查", "安全漏洞检测", "性能优化建议", "优先支持"]', TRUE, 1),
('p3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Enterprise', 'subscription', 9999, 'USD', 'month', '["团队协作", "自定义规则", "CI/CD集成", "专属客服"]', TRUE, 2),

-- Data Insight Plans
('p4444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Starter', 'subscription', 999, 'USD', 'month', '["10次/月分析", "基础图表"]', TRUE, 0),
('p5555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Business', 'subscription', 4999, 'USD', 'month', '["无限分析", "高级可视化", "数据导出"]', TRUE, 1),

-- Blog Writer Plans
('p6666666-6666-6666-6666-666666666666', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Basic', 'usage_based', 100, 'USD', NULL, '["按文章付费", "$1/篇"]', TRUE, 0),
('p7777777-7777-7777-7777-777777777777', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Unlimited', 'subscription', 2999, 'USD', 'month', '["无限文章", "SEO优化", "多语言"]', TRUE, 1),

-- Translation Pro Plans
('p8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Pay As You Go', 'usage_based', 1, 'USD', NULL, '["按字符付费", "$0.01/100字符"]', TRUE, 0),
('p9999999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888888', 'Pro Monthly', 'subscription', 1999, 'USD', 'month', '["100万字符/月", "术语表", "批量翻译"]', TRUE, 1);

-- ============================================
-- TEST PURCHASES
-- ============================================
INSERT INTO purchases (id, account_id, agent_id, plan_id, purchase_type, amount_cents, currency, status, subscription_status, current_period_start, current_period_end) VALUES
('buy11111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p2222222-2222-2222-2222-222222222222', 'subscription', 1999, 'USD', 'active', 'active', NOW(), NOW() + INTERVAL '1 month'),
('buy22222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'p4444444-4444-4444-4444-444444444444', 'subscription', 999, 'USD', 'active', 'active', NOW(), NOW() + INTERVAL '1 month'),
('buy33333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 'p9999999-9999-9999-9999-999999999999', 'subscription', 1999, 'USD', 'active', 'active', NOW(), NOW() + INTERVAL '1 month');

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Accounts: ' || COUNT(*) FROM accounts;
SELECT 'Agents: ' || COUNT(*) FROM agents;
SELECT 'Pricing Plans: ' || COUNT(*) FROM pricing_plans;
SELECT 'Purchases: ' || COUNT(*) FROM purchases;
SELECT 'Test Data Seeded Successfully!' AS status;
