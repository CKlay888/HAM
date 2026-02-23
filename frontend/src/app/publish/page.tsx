'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublishPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    category: '',
    priceType: 'per_use',
    price: '',
    capabilities: [] as string[],
  });

  const categories = ['开发工具', '内容创作', '数据分析', '设计工具', '语言翻译', '专业服务'];
  const capabilityOptions = ['代码生成', '文本生成', '数据处理', '图片生成', '翻译', '对话', '搜索', '分析'];

  const handleSubmit = () => {
    alert('Agent发布成功！等待审核...');
    router.push('/developer');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">🚀 发布新Agent</h1>
          <p className="text-gray-500 text-sm">填写信息，发布你的AI Agent</p>
          
          {/* Steps */}
          <div className="flex items-center gap-4 mt-6">
            {['基本信息', '定价设置', '发布确认'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i + 1 ? 'bg-green-500 text-white' :
                  step === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={step === i + 1 ? 'text-orange-500 font-medium' : 'text-gray-500'}>{s}</span>
                {i < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="给你的Agent起个名字"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">一句话介绍 *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({...formData, tagline: e.target.value})}
                  placeholder="简短描述Agent的核心功能"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="详细介绍Agent的功能和使用场景..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类 *</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`px-4 py-2 rounded-full text-sm ${
                        formData.category === cat
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">核心能力</label>
                <div className="flex flex-wrap gap-2">
                  {capabilityOptions.map(cap => (
                    <button
                      key={cap}
                      onClick={() => {
                        const caps = formData.capabilities.includes(cap)
                          ? formData.capabilities.filter(c => c !== cap)
                          : [...formData.capabilities, cap];
                        setFormData({...formData, capabilities: caps});
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        formData.capabilities.includes(cap)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">定价模式 *</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'free', label: '免费', desc: '不收费' },
                    { id: 'per_use', label: '按次计费', desc: '每次调用收费' },
                    { id: 'subscription', label: '订阅制', desc: '按月收费' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setFormData({...formData, priceType: opt.id})}
                      className={`p-4 rounded-xl border-2 text-left ${
                        formData.priceType === opt.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-800">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {formData.priceType !== 'free' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    价格 (¥/{formData.priceType === 'per_use' ? '次' : '月'}) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    className="w-48 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">📋 发布确认</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">名称:</span> {formData.name || '未填写'}</p>
                  <p><span className="text-gray-500">简介:</span> {formData.tagline || '未填写'}</p>
                  <p><span className="text-gray-500">分类:</span> {formData.category || '未选择'}</p>
                  <p><span className="text-gray-500">定价:</span> {
                    formData.priceType === 'free' ? '免费' : `¥${formData.price}/${formData.priceType === 'per_use' ? '次' : '月'}`
                  }</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">提交后将进入审核流程，审核通过后自动上架。</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50">
                上一步
              </button>
            )}
            <div className="ml-auto">
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:opacity-90">
                  下一步
                </button>
              ) : (
                <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:opacity-90">
                  提交审核
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
