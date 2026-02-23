'use client';

import { useState } from 'react';
import { Urgency, PosterType } from '@/types';

interface Props {
  onClose: () => void;
}

const URGENCY_CONFIG: Record<Urgency, { label: string; color: string }> = {
  high: { label: '紧急', color: '#FE2C55' },
  medium: { label: '一般', color: '#FF9500' },
  low: { label: '不急', color: '#00D4AA' },
};

export default function PublishBountyModal({ onClose }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [reward, setReward] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [posterType, setPosterType] = useState<PosterType>('individual');
  const [tags, setTags] = useState('');
  const [deadline, setDeadline] = useState('');

  const isValid = title && desc && reward;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">📝 发布悬赏</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Poster Type */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">发布身份</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'individual' as PosterType, label: '👤 个人' },
                { key: 'company' as PosterType, label: '🏢 企业' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setPosterType(item.key)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    posterType === item.key
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${posterType === item.key ? 'text-orange-600' : 'text-gray-700'}`}>
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">悬赏标题 *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="描述你需要的AI Agent"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">详细需求 *</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={`描述Agent功能：\n1. 输入格式\n2. 处理任务\n3. 输出结果\n4. 性能要求`}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Reward & Deadline */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">赏金 (¥) *</label>
              <input
                value={reward}
                onChange={e => setReward(e.target.value)}
                type="number"
                placeholder="10000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">截止日期</label>
              <input
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                type="date"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Urgency */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-2">紧急程度</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(URGENCY_CONFIG) as [Urgency, { label: string; color: string }][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setUrgency(key)}
                  className={`py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    urgency === key
                      ? 'text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                  style={urgency === key ? { 
                    backgroundColor: config.color, 
                    borderColor: config.color 
                  } : {}}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 block mb-1">
              标签 <span className="text-gray-400">(逗号分隔)</span>
            </label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="数据分析, 可视化"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
            />
          </div>

          {/* Preview */}
          {(title || reward) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="text-xs text-gray-500 mb-2">预览</div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{title || '标题'}</span>
                <span className="text-xl font-bold text-orange-500">
                  ¥{reward ? Number(reward).toLocaleString() : '0'}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={!isValid}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              isValid
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            发布悬赏{reward ? ` · ¥${Number(reward).toLocaleString()}` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
