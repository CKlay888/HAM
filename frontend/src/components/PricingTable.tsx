'use client';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'once';
  description: string;
  features: string[];
  popular?: boolean;
  buttonText?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '免费版',
    price: 0,
    period: 'month',
    description: '适合个人用户体验',
    features: ['每日50次调用', '基础功能', '社区支持', '标准响应速度'],
    buttonText: '免费使用',
  },
  {
    id: 'pro',
    name: '专业版',
    price: 29,
    period: 'month',
    description: '适合专业用户',
    features: ['每日5000次调用', '全部功能', '优先支持', '快速响应', 'API访问', '使用分析'],
    popular: true,
    buttonText: '立即订阅',
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 99,
    period: 'month',
    description: '适合团队和企业',
    features: ['无限调用', '全部功能', '专属客服', '最快响应', 'API访问', '高级分析', '自定义集成', 'SLA保障'],
    buttonText: '联系销售',
  },
];

interface PricingTableProps {
  plans?: PricingPlan[];
  onSelect?: (planId: string) => void;
  currentPlan?: string;
}

export default function PricingTable({ plans = defaultPlans, onSelect, currentPlan }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-lg ${
            plan.popular ? 'ring-2 ring-orange-500' : 'border border-gray-200'
          }`}
        >
          {/* Popular Badge */}
          {plan.popular && (
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 transform rotate-45 translate-x-6 translate-y-3">
                热门
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Plan Name */}
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{plan.description}</p>

            {/* Price */}
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price === 0 ? '免费' : `¥${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-gray-500 text-sm">
                  /{plan.period === 'month' ? '月' : plan.period === 'year' ? '年' : '次'}
                </span>
              )}
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              onClick={() => onSelect?.(plan.id)}
              disabled={currentPlan === plan.id}
              className={`w-full mt-6 py-3 rounded-xl font-medium transition-all ${
                currentPlan === plan.id
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                  : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
              }`}
            >
              {currentPlan === plan.id ? '当前套餐' : plan.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
