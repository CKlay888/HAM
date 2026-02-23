'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BountyFormData {
  title: string;
  description: string;
  amount: string;
  category: string;
  deadline: string;
  requirements: string;
  tags: string[];
  urgent: boolean;
}

interface BountyFormProps {
  initialData?: Partial<BountyFormData>;
  mode?: 'create' | 'edit';
  onSubmit?: (data: BountyFormData) => void;
}

const categories = [
  { id: 'dev', label: '开发', icon: '💻' },
  { id: 'design', label: '设计', icon: '🎨' },
  { id: 'content', label: '文案', icon: '✍️' },
  { id: 'data', label: '数据', icon: '📊' },
  { id: 'translation', label: '翻译', icon: '🌍' },
  { id: 'other', label: '其他', icon: '📦' },
];

const suggestedAmounts = [100, 500, 1000, 2000, 5000, 10000];

export default function BountyForm({ initialData = {}, mode = 'create', onSubmit }: BountyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BountyFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    amount: initialData.amount || '',
    category: initialData.category || '',
    deadline: initialData.deadline || '',
    requirements: initialData.requirements || '',
    tags: initialData.tags || [],
    urgent: initialData.urgent || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入悬赏标题';
    } else if (formData.title.length < 5) {
      newErrors.title = '标题至少5个字';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '请输入悬赏描述';
    } else if (formData.description.length < 20) {
      newErrors.description = '描述至少20个字';
    }
    
    if (!formData.amount) {
      newErrors.amount = '请输入悬赏金额';
    } else if (parseFloat(formData.amount) < 10) {
      newErrors.amount = '最低悬赏金额10元';
    }
    
    if (!formData.category) {
      newErrors.category = '请选择分类';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = '请选择截止日期';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = '截止日期必须是未来时间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    if (onSubmit) {
      onSubmit(formData);
    } else {
      alert('悬赏发布成功！');
      router.push('/bounties');
    }
    setIsSubmitting(false);
  };

  const addTag = () => {
    if (tagInput.trim() && formData.tags.length < 5 && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Calculate service fee
  const amount = parseFloat(formData.amount) || 0;
  const serviceFee = amount * 0.05;
  const totalAmount = amount + serviceFee;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          悬赏标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="简明扼要地描述你的需求"
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.title ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          分类 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat.id })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                formData.category === cat.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">{cat.icon}</span>
              <span className="text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          悬赏描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          placeholder="详细描述你的需求，帮助接单者更好地理解..."
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.description ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          详细需求
        </label>
        <textarea
          value={formData.requirements}
          onChange={e => setFormData({ ...formData, requirements: e.target.value })}
          rows={6}
          placeholder="列出具体的技术要求、交付标准、验收条件等..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          悬赏金额 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-500 text-2xl font-bold">¥</span>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0"
            className={`w-40 px-4 py-3 border rounded-xl text-2xl font-bold text-red-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-200'
            }`}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedAmounts.map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => setFormData({ ...formData, amount: amt.toString() })}
              className={`px-4 py-2 rounded-full text-sm ${
                formData.amount === amt.toString()
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ¥{amt}
            </button>
          ))}
        </div>
        {amount > 0 && (
          <div className="bg-orange-50 rounded-lg p-4 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">悬赏金额</span>
              <span className="text-gray-800">¥{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">服务费 (5%)</span>
              <span className="text-gray-800">¥{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-orange-200 font-bold">
              <span className="text-gray-800">合计</span>
              <span className="text-red-500">¥{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          截止日期 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={e => setFormData({ ...formData, deadline: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.deadline ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签 (最多5个)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="输入标签后回车"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            添加
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Urgent */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
        <input
          type="checkbox"
          id="urgent"
          checked={formData.urgent}
          onChange={e => setFormData({ ...formData, urgent: e.target.checked })}
          className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
        />
        <label htmlFor="urgent" className="flex-1">
          <span className="font-medium text-gray-800">⚡ 加急悬赏</span>
          <p className="text-sm text-gray-500">优先展示，更快找到接单者（额外收取10%服务费）</p>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? '提交中...' : mode === 'create' ? '发布悬赏' : '保存修改'}
        </button>
      </div>
    </form>
  );
}
