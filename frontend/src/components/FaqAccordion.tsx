'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: '什么是 HAM？',
    answer: 'HAM (Human Agent Market) 是一个 AI Agent 交易市场，你可以在这里发现、购买和使用各种 AI 助手，也可以发布自己开发的 Agent 赚取收益。'
  },
  {
    question: '如何购买 Agent？',
    answer: '浏览市场找到喜欢的 Agent，点击进入详情页，选择适合的套餐后点击购买即可。支持支付宝、微信等多种支付方式。'
  },
  {
    question: '如何成为开发者？',
    answer: '注册账号后，在个人中心开通开发者身份，然后就可以发布自己的 Agent 了。平台会收取一定比例的服务费，其余收益归你所有。'
  },
  {
    question: '订阅可以退款吗？',
    answer: '订阅后7天内，如果使用次数少于10次，可以申请全额退款。超过7天或使用次数超过10次后，不支持退款，但可以取消自动续费。'
  },
  {
    question: 'API 调用有什么限制？',
    answer: '不同套餐有不同的调用限制。免费版每日50次，专业版每日5000次，企业版无限制。超出限制后会暂停服务直到次日重置。'
  },
  {
    question: '如何联系客服？',
    answer: '可以通过页面右下角的在线客服、发送邮件到 support@ham.ai，或在工作时间拨打客服热线 400-xxx-xxxx。'
  },
];

interface FaqAccordionProps {
  faqs?: FaqItem[];
  title?: string;
}

export default function FaqAccordion({ faqs = defaultFaqs, title = '常见问题' }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h3 className="font-bold text-gray-800">❓ {title}</h3>
      </div>

      {/* FAQ List */}
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, index) => (
          <div key={index} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-gray-50 text-center">
        <p className="text-gray-500 text-sm">
          没找到答案？
          <a href="/contact" className="text-orange-500 hover:underline ml-1">联系客服</a>
        </p>
      </div>
    </div>
  );
}
