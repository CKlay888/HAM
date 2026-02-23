'use client';

import BountyForm from '@/components/BountyForm';

export default function NewBountyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">💰 发布悬赏</h1>
          <p className="text-white/80">发布你的需求，让优秀的人才来帮你完成</p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">💡 发布技巧</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 标题要简洁明了，突出核心需求</li>
            <li>• 描述越详细，越容易找到合适的人</li>
            <li>• 合理定价可以吸引更多优质申请</li>
            <li>• 设置合理的截止日期，给接单者足够时间</li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <BountyForm mode="create" />
        </div>

        {/* FAQ */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">❓ 常见问题</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">资金如何保障？</p>
              <p className="text-gray-500">悬赏金额会暂时托管在平台，验收通过后才会支付给接单者。</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">如果没人接单怎么办？</p>
              <p className="text-gray-500">截止日期后如果无人接单，资金会全额退回到你的账户。</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">服务费怎么收取？</p>
              <p className="text-gray-500">平台收取5%的服务费，加急悬赏额外收取10%。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
