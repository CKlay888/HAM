'use client';

import { useState } from 'react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
}

const mockKeys: ApiKey[] = [
  { id: '1', name: '生产环境', key: 'ham_prod_xxxxxxxxxxxxxxxxxxxx', createdAt: '2026-02-01', lastUsed: '2026-02-23', status: 'active' },
  { id: '2', name: '测试环境', key: 'ham_test_yyyyyyyyyyyyyyyyyyyy', createdAt: '2026-02-10', lastUsed: '2026-02-20', status: 'active' },
  { id: '3', name: '旧密钥', key: 'ham_old_zzzzzzzzzzzzzzzzzzzz', createdAt: '2026-01-15', lastUsed: null, status: 'revoked' },
];

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `ham_new_${Math.random().toString(36).substring(2, 22)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      status: 'active',
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowCreate(false);
  };

  const handleRevoke = (id: string) => {
    if (confirm('确定要撤销此密钥吗？撤销后无法恢复！')) {
      setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    }
  };

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••' + key.substring(key.length - 4);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">🔑 API 密钥管理</h3>
          <p className="text-gray-500 text-sm">管理您的 API 访问密钥</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
        >
          + 创建密钥
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="px-6 py-4 bg-orange-50 border-b">
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              placeholder="密钥名称（如：生产环境）"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
            >
              创建
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Key List */}
      <div className="divide-y divide-gray-100">
        {keys.map((apiKey) => (
          <div key={apiKey.id} className="px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-800">{apiKey.name}</h4>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  apiKey.status === 'active' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {apiKey.status === 'active' ? '活跃' : '已撤销'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {apiKey.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleCopy(apiKey.key, apiKey.id)}
                      className="px-3 py-1 text-sm text-orange-500 hover:bg-orange-50 rounded-lg"
                    >
                      {copiedId === apiKey.id ? '✓ 已复制' : '复制'}
                    </button>
                    <button
                      onClick={() => handleRevoke(apiKey.id)}
                      className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      撤销
                    </button>
                  </>
                )}
              </div>
            </div>
            <code className={`text-sm font-mono ${apiKey.status === 'revoked' ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
              {maskKey(apiKey.key)}
            </code>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span>创建于 {apiKey.createdAt}</span>
              {apiKey.lastUsed && <span>最后使用 {apiKey.lastUsed}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="px-6 py-4 bg-yellow-50 border-t">
        <p className="text-yellow-700 text-sm">
          ⚠️ 密钥只在创建时显示一次，请妥善保管。不要在公开场合分享您的密钥。
        </p>
      </div>
    </div>
  );
}
