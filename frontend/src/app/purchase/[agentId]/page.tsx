'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { mockAgents, mockPricingPlans, mockUser } from '@/lib/mock-data';

type PaymentMethod = 'balance' | 'alipay' | 'wechat';

export default function PurchasePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const agent = mockAgents.find((a) => a.id === params.agentId) || mockAgents[0];
  const planId = searchParams.get('plan') || 'pro';
  const plan = mockPricingPlans.find((p) => p.id === planId) || mockPricingPlans[1];
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('balance');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const handlePurchase = async () => {
    if (!agreedTerms) {
      alert('请先同意服务条款');
      return;
    }
    
    setIsProcessing(true);
    
    // 模拟支付过程
    await new Promise((r) => setTimeout(r, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
  };

  // 购买成功页面
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">购买成功！</h1>
          <p className="text-gray-600 mb-6">
            你已成功订阅 <span className="font-semibold">{agent.name}</span> 的 {plan.name}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl" />
              <div>
                <p className="font-semibold text-gray-900">{agent.name}</p>
                <p className="text-sm text-gray-500">{plan.name} · ¥{plan.price}/{plan.unit}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📅 有效期：30天</p>
              <p>🔢 可用次数：{plan.quota || '无限'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link
              href={`/agents/${agent.id}`}
              className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              开始使用
            </Link>
            <Link
              href="/user"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              查看我的订阅
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">市场</Link>
          <span>/</span>
          <Link href={`/agents/${agent.id}`} className="hover:text-blue-600">{agent.name}</Link>
          <span>/</span>
          <span className="text-gray-900">确认购买</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">确认购买</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">商品信息</h2>
              <div className="flex items-start gap-4">
                <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-xl bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{agent.tagline}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{plan.name}</span>
                    <span className="text-sm text-gray-500">
                      {plan.quota ? `${plan.quota}次/月` : '无限次'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">¥{plan.price}</p>
                  <p className="text-sm text-gray-500">/{plan.unit}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">支付方式</h2>
              <div className="space-y-3">
                {/* Balance */}
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'balance' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'balance'}
                    onChange={() => setPaymentMethod('balance')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">账户余额</p>
                    <p className="text-sm text-gray-500">当前余额: ¥{mockUser.balance.toFixed(2)}</p>
                  </div>
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" />
                  </svg>
                </label>

                {/* Alipay */}
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'alipay'}
                    onChange={() => setPaymentMethod('alipay')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">支付宝</p>
                    <p className="text-sm text-gray-500">推荐使用</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    支
                  </div>
                </label>

                {/* WeChat */}
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'wechat' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wechat'}
                    onChange={() => setPaymentMethod('wechat')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">微信支付</p>
                    <p className="text-sm text-gray-500">扫码支付</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    微
                  </div>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                我已阅读并同意{' '}
                <a href="/terms" className="text-blue-600 hover:underline">服务条款</a>
                {' '}和{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">自动续费协议</a>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">订单摘要</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{plan.name}</span>
                  <span className="text-gray-900">¥{plan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">优惠</span>
                  <span className="text-green-600">-¥0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">应付金额</span>
                  <span className="text-xl font-bold text-blue-600">¥{plan.price}</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing || !agreedTerms}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    支付中...
                  </span>
                ) : (
                  `确认支付 ¥${plan.price}`
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                支付即表示同意相关条款
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
