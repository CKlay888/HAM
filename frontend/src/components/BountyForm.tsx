'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BountyFormData {
  title: string;
  description: string;
  amount: number | '';
  category: string;
  deadline: string;
  requirements: string;
  tags: string[];
  urgent: boolean;
}

interface BountyFormProps {
  initialData?: Partial<BountyFormData>;
  onSubmit?: (data: BountyFormData) => Promise<void>;
  mode?: 'create' | 'edit';
}

const categories = ['开发', '设计', '文案', '数据', '翻译', '其他'];
const suggestedTags = ['React', 'Python', 'UI设计', '数据分析', '英文翻译', 'SEO', 'API开发', '爬虫'];

export default function BountyForm({ initialData = {}, onSubmit, mode = 'create' }: BountyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [tagInput, setTagInput] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入悬赏标题';
    if (formData.title.length > 50) newErrors.title = '标题不能超过50字';
    if (!formData.description.trim()) newErrors.description = '请输入悬赏描述';
    if (!formData.amount || formData.amount < 10) newErrors.amount = '悬赏金额至少10元';
    if (formData.amount && formData.amount > 100000) newErrors.amount = '悬赏金额不能超过10万';
    if (!formData.category) newErrors.category = '请选择分类';
    if (!formData.deadline) newErrors.deadline = '请选择截止日期';
    if (new Date(formData.deadline) <= new Date()) newErrors.deadline = '截止日期必须晚于今天';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await new Promise(r => setTimeout(r, 1500));
        alert('悬赏发布成功！');
        router.push('/bounties');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Calculate service fee
  const serviceFee = typeof formData.amount === 'number' ? Math.round(formData.amount * 0.05) : 0;
  const totalAmount = typeof formData.amount === 'number' ? formData.amount + serviceFee : 0;

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
          placeholder="简明描述你的需求，如：开发一个React组件库"
          maxLength={50}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.title ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          <p className="text-gray-400 text-sm ml-auto">{formData.title.length}/50</p>
        </div>
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          悬赏金额 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xl">¥</span>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : '' })}
            placeholder="输入悬赏金额"
            min={10}
            max={100000}
            className={`w-full pl-10 pr-4 py-4 border rounded-xl text-2xl font-bold text-red-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-200'
            }`}
          />
        </div>
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        
        {typeof formData.amount === 'number' && formData.amount >= 10 && (
          <div className="mt-3 p-4 bg-orange-50 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">悬赏金额</span>
              <span className="font-medium">¥{formData.amount}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">平台服务费 (5%)</span>
              <span className="font-medium">¥{serviceFee}</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-orange-200">
              <span className="font-medium text-gray-800">需支付总额</span>
              <span className="font-bold text-red-500">¥{totalAmount}</span>
            </div>
          </div>
        )}
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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          悬赏描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="详细描述你的需求，包括功能要求、技术栈、交付标准等..."
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.description ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">详细需求（选填）</label>
        <textarea
          value={formData.requirements}
          onChange={e => setFormData({ ...formData, requirements: e.target.value })}
          placeholder="补充说明、参考资料、特殊要求等..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标签（最多5个）</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-800">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
            placeholder="输入标签后回车"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="text-gray-400 text-sm mr-2">推荐：</span>
          {suggestedTags.filter(t => !formData.tags.includes(t)).slice(0, 6).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-sm hover:bg-gray-200"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Urgent */}
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <input
          type="checkbox"
          id="urgent"
          checked={formData.urgent}
          onChange={e => setFormData({ ...formData, urgent: e.target.checked })}
          className="w-5 h-5 text-orange-500 rounded"
        />
        <label htmlFor="urgent" className="flex-1">
          <span className="font-medium text-gray-800">⚡ 加急处理</span>
          <p className="text-sm text-gray-500">加急订单会优先展示，吸引更多接单者（+10%服务费）</p>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-4 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? '发布中...' : mode === 'edit' ? '保存修改' : '发布悬赏'}
        </button>
      </div>
    </form>
  );
}
