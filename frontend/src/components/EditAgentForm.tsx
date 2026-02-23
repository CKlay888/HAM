'use client';

import { useState } from 'react';

interface AgentFormData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  priceType: string;
  price: string;
  capabilities: string[];
}

interface EditAgentFormProps {
  initialData?: Partial<AgentFormData>;
  onSubmit: (data: AgentFormData) => void;
  onCancel: () => void;
}

const categories = ['开发工具', '内容创作', '数据分析', '设计工具', '语言翻译', '专业服务'];
const capabilityOptions = ['代码生成', '文本生成', '数据处理', '图片生成', '翻译', '对话', '搜索', '分析'];

export default function EditAgentForm({ initialData = {}, onSubmit, onCancel }: EditAgentFormProps) {
  const [formData, setFormData] = useState<AgentFormData>({
    name: initialData.name || '',
    tagline: initialData.tagline || '',
    description: initialData.description || '',
    category: initialData.category || '',
    priceType: initialData.priceType || 'per_use',
    price: initialData.price || '',
    capabilities: initialData.capabilities || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入Agent名称';
    if (!formData.tagline.trim()) newErrors.tagline = '请输入简介';
    if (!formData.category) newErrors.category = '请选择分类';
    if (formData.priceType !== 'free' && !formData.price) newErrors.price = '请输入价格';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const toggleCapability = (cap: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.includes(cap)
        ? formData.capabilities.filter(c => c !== cap)
        : [...formData.capabilities, cap],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.name ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="给你的Agent起个名字"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          一句话介绍 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.tagline}
          onChange={e => setFormData({ ...formData, tagline: e.target.value })}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.tagline ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="简短描述Agent的核心功能"
        />
        {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="详细介绍Agent的功能和使用场景..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          分类 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat })}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                formData.category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Capabilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">核心能力</label>
        <div className="flex flex-wrap gap-2">
          {capabilityOptions.map(cap => (
            <button
              key={cap}
              type="button"
              onClick={() => toggleCapability(cap)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
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

      {/* Pricing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">定价模式</label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { id: 'free', label: '免费' },
            { id: 'per_use', label: '按次计费' },
            { id: 'subscription', label: '订阅制' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFormData({ ...formData, priceType: opt.id })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                formData.priceType === opt.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        {formData.priceType !== 'free' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              价格 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">¥</span>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className={`w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0.00"
              />
              <span className="text-gray-500">/{formData.priceType === 'per_use' ? '次' : '月'}</span>
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90"
        >
          保存
        </button>
      </div>
    </form>
  );
}
