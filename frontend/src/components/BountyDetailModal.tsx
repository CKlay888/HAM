'use client';

import { useState } from 'react';
import { Bounty, BountySubmission, BountyStatus, Urgency } from '@/types';
import { bountyUsers } from '@/lib/mock-data';

interface Props {
  bounty: Bounty;
  onClose: () => void;
}

const STATUS_CONFIG: Record<BountyStatus, { label: string; color: string }> = {
  open: { label: '招募中', color: '#00D4AA' },
  in_progress: { label: '开发中', color: '#4facfe' },
  review: { label: '评审中', color: '#fbbf24' },
  escrow: { label: '交易中', color: '#a78bfa' },
  completed: { label: '已完成', color: '#71717a' },
};

const URGENCY_CONFIG: Record<Urgency, { label: string; color: string }> = {
  high: { label: '紧急', color: '#FE2C55' },
  medium: { label: '一般', color: '#FF9500' },
  low: { label: '不急', color: '#00D4AA' },
};

const SUB_STATUS: Record<string, string> = {
  submitted: '已提交',
  under_review: '评审中',
  revision: '修改中',
  working: '开发中',
  accepted: '已接受',
  completed: '已完成',
};

const FEEDBACK_CONFIG: Record<string, { label: string; color: string }> = {
  revision: { label: '修改意见', color: '#FF9500' },
  reply: { label: '回复', color: '#4facfe' },
  approve: { label: '✅ 通过', color: '#00D4AA' },
  complete: { label: '🎉 完成', color: '#a78bfa' },
};

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
};

const daysLeft = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const days = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days}天后截止` : '已截止';
};

export default function BountyDetailModal({ bounty, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'detail' | 'subs' | 'flow'>('detail');
  const [selectedSub, setSelectedSub] = useState<BountySubmission | null>(bounty.submissions[0] || null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState('');

  const status = STATUS_CONFIG[bounty.status];
  const urgency = URGENCY_CONFIG[bounty.urgency];
  const poster = bountyUsers[bounty.uid];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex justify-between items-start mb-4 pr-8">
            <div>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-semibold"
                  style={{ backgroundColor: status.color + '20', color: status.color }}
                >
                  {status.label}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: urgency.color + '15', color: urgency.color }}
                >
                  {urgency.label}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                  {bounty.posterType === 'company' ? '🏢 企业' : '👤 个人'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{bounty.title}</h2>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-orange-500">
                ¥{bounty.reward.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{daysLeft(bounty.deadline)}</div>
            </div>
          </div>

          {/* Poster Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
              {poster?.avatar}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {poster?.name}
                {poster?.verified && (
                  <span className="ml-1 text-[10px] px-1 py-0.5 bg-green-100 text-green-600 rounded font-semibold">✓</span>
                )}
                <span className="font-normal text-gray-500 ml-1">· 发布者</span>
              </div>
              <div className="text-xs text-gray-500">
                {formatNumber(poster?.followers || 0)}粉丝 · {poster?.type === 'company' ? '企业认证' : '个人'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            {[
              { key: 'detail', label: '需求详情' },
              { key: 'subs', label: `方案投递 (${bounty.submissions.length})` },
              { key: 'flow', label: '交易流程' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-orange-600 border-orange-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'detail' && (
            <div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                {bounty.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {bounty.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              {bounty.status === 'open' && (
                <button
                  onClick={() => { setActiveTab('subs'); setShowSubmitForm(true); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  🚀 我要接单
                </button>
              )}
            </div>
          )}

          {activeTab === 'subs' && (
            <div>
              {/* Submit Form */}
              {showSubmitForm && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">📤 提交方案</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">报价 (¥)</label>
                      <input type="number" placeholder="45000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">预计天数</label>
                      <input type="number" placeholder="14" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">方案说明 *</label>
                    <textarea placeholder="描述方案、技术栈、经验..." rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
                  </div>
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Demo链接 (可选)</label>
                    <input type="url" placeholder="https://demo.com/agent" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 block mb-1">技术栈</label>
                    <input type="text" placeholder="Python + LangChain + GPT-4" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium">
                      提交方案
                    </button>
                    <button onClick={() => setShowSubmitForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {!showSubmitForm && bounty.status === 'open' && (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium mb-4"
                >
                  📤 提交方案
                </button>
              )}

              {/* Submissions List */}
              {bounty.submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  暂无方案，成为第一个！
                </div>
              ) : (
                <div className="space-y-3">
                  {bounty.submissions.map(sub => {
                    const dev = bountyUsers[sub.uid];
                    const isSelected = selectedSub?.id === sub.id;

                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSub(sub)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gray-50 border-gray-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Sub Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                              {dev?.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {dev?.name}
                                {dev?.verified && (
                                  <span className="ml-1 text-[8px] px-1 py-0.5 bg-green-100 text-green-600 rounded font-semibold">✓</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{sub.time} · {SUB_STATUS[sub.status]}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-500">
                              ¥{sub.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">{sub.days}天</div>
                          </div>
                        </div>

                        {/* Pitch */}
                        <p className="text-sm text-gray-700 mb-3">{sub.pitch}</p>

                        {/* Demo */}
                        {sub.demoUrl && (
                          <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
                            <div className="text-xs font-semibold text-green-600 mb-1">🔗 Demo</div>
                            <a
                              href={sub.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:underline break-all"
                              onClick={e => e.stopPropagation()}
                            >
                              {sub.demoUrl}
                            </a>
                            {sub.demoDesc && (
                              <div className="text-xs text-gray-600 mt-1">{sub.demoDesc}</div>
                            )}
                            <button
                              className="mt-2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-md"
                              onClick={e => e.stopPropagation()}
                            >
                              🖥 打开试用
                            </button>
                          </div>
                        )}

                        {/* Working Status */}
                        {!sub.demoUrl && sub.status === 'working' && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 text-sm text-blue-600">
                            ⏳ {sub.demoDesc || '开发中...'}
                          </div>
                        )}

                        {/* Tech Stack */}
                        {sub.tech && (
                          <div className="text-xs text-gray-500 mb-2">🛠 {sub.tech}</div>
                        )}

                        {/* Files */}
                        {sub.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {sub.files.map(f => (
                              <span key={f.name} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                📎 {f.name} <span className="text-gray-400">({f.size})</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Feedback Thread */}
                        {isSelected && sub.feedbacks.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="text-sm font-medium text-gray-900 mb-3">💬 沟通记录</div>
                            {sub.feedbacks.map((fb, i) => {
                              const fbUser = bountyUsers[fb.from];
                              const fbConfig = FEEDBACK_CONFIG[fb.type];
                              return (
                                <div key={i} className={`flex gap-2 mb-3 ${fb.type === 'reply' ? 'pl-5' : ''}`}>
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs flex-shrink-0">
                                    {fbUser?.avatar}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-gray-700">{fbUser?.name}</span>
                                      <span
                                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                        style={{ backgroundColor: fbConfig.color + '15', color: fbConfig.color }}
                                      >
                                        {fbConfig.label}
                                      </span>
                                      <span className="text-[10px] text-gray-400">{fb.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{fb.text}</p>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Reply Input */}
                            <div className="flex gap-2 mt-2">
                              <input
                                value={newFeedback}
                                onChange={e => setNewFeedback(e.target.value)}
                                placeholder="输入反馈..."
                                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                                onClick={e => e.stopPropagation()}
                              />
                              <button className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium">
                                发送
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {isSelected && sub.status === 'under_review' && (
                          <div className="flex gap-2 mt-3">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                              ✅ 满意，进入交易
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                              💬 反馈修改
                            </button>
                          </div>
                        )}

                        {isSelected && sub.status === 'accepted' && (
                          <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">
                            🔒 托管 ¥{sub.price.toLocaleString()}
                          </button>
                        )}

                        {/* Escrow Status */}
                        {isSelected && sub.escrow && (
                          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mt-3">
                            <div className="text-sm font-bold text-purple-600 mb-3">🔒 担保交易状态</div>
                            {[
                              { done: sub.escrow.buyerPaid, label: `悬赏人托管 ¥${sub.price.toLocaleString()}`, sub: sub.escrow.paidTime, icon: '💰' },
                              { done: sub.escrow.sellerUploaded, label: '开发者提交代码/文档', sub: sub.escrow.uploadTime, icon: '📦' },
                              { done: sub.escrow.review === 'passed', pending: sub.escrow.review === 'in_progress', label: '平台自动审核', sub: sub.escrow.review === 'in_progress' ? '审核中...' : sub.escrow.review === 'passed' ? '✅ 通过' : '等待', icon: '🤖' },
                              { done: sub.escrow.review === 'passed', label: sub.escrow.review === 'passed' ? '交易完成！' : '审核后自动交换', sub: sub.escrow.doneTime, icon: '✅' },
                            ].map((step, i) => (
                              <div key={i} className="flex items-start gap-3 mb-2">
                                <div className="flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step.done ? 'bg-green-500 text-white' : step.pending ? 'bg-yellow-400 text-white animate-pulse' : 'bg-gray-200 text-gray-500'
                                  }`}>
                                    {step.done ? '✓' : step.pending ? '⟳' : i + 1}
                                  </div>
                                  {i < 3 && <div className={`w-0.5 h-3 mt-1 ${step.done ? 'bg-green-200' : 'bg-gray-200'}`} />}
                                </div>
                                <div>
                                  <div className={`text-sm font-medium ${step.done ? 'text-green-600' : step.pending ? 'text-yellow-600' : 'text-gray-500'}`}>
                                    {step.icon} {step.label}
                                  </div>
                                  {step.sub && <div className="text-xs text-gray-500">{step.sub}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'flow' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                HAM 使用担保交易机制，确保双方利益：
              </p>
              {[
                { step: '1', title: '发布悬赏', desc: '个人/企业发布需求和赏金', icon: '📝', color: '#FF6B35' },
                { step: '2', title: '开发者/AI接单', desc: '提交方案、报价和交付时间', icon: '👨‍💻', color: '#4facfe' },
                { step: '3', title: '提交Demo', desc: '提交可试用的Demo链接或演示', icon: '🔗', color: '#00D4AA' },
                { step: '4', title: '试用与反馈', desc: '悬赏人试用并反馈，多轮迭代', icon: '💬', color: '#fbbf24' },
                { step: '5', title: '资金托管', desc: '满意后将金额托管到平台', icon: '🔒', color: '#a78bfa' },
                { step: '6', title: '代码提交', desc: '源码+文档+部署指南提交平台', icon: '📦', color: '#f093fb' },
                { step: '7', title: '平台审核', desc: 'AI审核完整性、安全性、匹配度', icon: '🤖', color: '#818cf8' },
                { step: '8', title: '自动交换', desc: '资金→开发者，代码→悬赏人（5%服务费）', icon: '✅', color: '#00D4AA' },
              ].map(item => (
                <div key={item.step} className="flex gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: item.color + '12', border: `1px solid ${item.color}20` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      <span className="font-bold mr-1" style={{ color: item.color }}>{item.step}</span>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-4 text-xs text-gray-600 leading-relaxed">
                <span className="text-yellow-600 font-semibold">⚠️ 安全保障</span><br />
                • 资金平台托管，交易前可退款<br />
                • 代码加密存储，审核前双方无法接触<br />
                • 争议由平台仲裁
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
