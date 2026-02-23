'use client';

import BountyForm from '@/components/BountyForm';
import Link from 'next/link';

export default function NewBountyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/bounties" className="text-white/80 hover:text-white text-sm mb-2 inline-block">
            ← 返回悬赏大厅
          </Link>
          <h1 className="text-2xl font-bold">📝 发布悬赏</h1>
          <p className="text-white/80 mt-1">发布你的需求，让专业的人帮你完成</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">💡 发布技巧</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 标题要简明扼要，突出核心需求</li>
            <li>• 描述越详细，越容易吸引合适的人</li>
            <li>• 合理设置悬赏金额和截止日期</li>
            <li>• 添加相关标签，让更多人看到</li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BountyForm />
        </div>

        {/* FAQ */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">❓ 常见问题</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700">悬赏金额怎么设置？</h4>
              <p className="text-gray-500">建议参考市场价格，太低可能没人接单，太高可能造成浪费。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">如何选择接单者？</h4>
              <p className="text-gray-500">发布后会收到申请，你可以查看申请者的资料和过往评价，选择最合适的人。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">交付不满意怎么办？</h4>
              <p className="text-gray-500">你可以要求修改，或者申请平台介入仲裁。</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">平台收取多少手续费？</h4>
              <p className="text-gray-500">平台收取悬赏金额的5%作为服务费，加急订单额外收取10%。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
