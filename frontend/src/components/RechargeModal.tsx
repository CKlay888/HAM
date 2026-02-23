'use client';

import { useState } from 'react';

interface RechargeModalProps {
  isOpen: boolean;
  currentBalance: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const presetAmounts = [10, 50, 100, 200, 500, 1000];

export default function RechargeModal({ isOpen, currentBalance, onClose, onSuccess }: RechargeModalProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'pay' | 'success'>('select');

  if (!isOpen) return null;

  const selectedAmount = typeof amount === 'number' ? amount : parseInt(customAmount) || 0;

  const handleSelectAmount = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount('');
  };

  const handlePay = async () => {
    if (selectedAmount < 1) return;
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate payment
    setIsProcessing(false);
    setStep('success');
  };

  const handleComplete = () => {
    onSuccess(selectedAmount);
    setStep('select');
    setAmount('');
    setCustomAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">💰 账户充值</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-sm">当前余额</p>
            <p className="text-3xl font-bold">¥{currentBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <>
              {/* Preset Amounts */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">选择充值金额</label>
                <div className="grid grid-cols-3 gap-3">
                  {presetAmounts.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleSelectAmount(value)}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        amount === value
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ¥{value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">自定义金额</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="输入金额"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">最低充值 ¥1</p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">支付方式</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('alipay')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      paymentMethod === 'alipay'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      支
                    </div>
                    <span className="font-medium">支付宝</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wechat')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      paymentMethod === 'wechat'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      微
                    </div>
                    <span className="font-medium">微信支付</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => selectedAmount >= 1 && setStep('pay')}
                disabled={selectedAmount < 1}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedAmount >= 1 ? `确认充值 ¥${selectedAmount}` : '请选择充值金额'}
              </button>
            </>
          )}

          {step === 'pay' && (
            <div className="text-center py-8">
              <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-400">
                  {paymentMethod === 'alipay' ? '支付宝' : '微信'}二维码
                </p>
              </div>
              <p className="text-lg font-bold text-gray-800 mb-2">请扫码支付 ¥{selectedAmount}</p>
              <p className="text-gray-500 text-sm mb-6">支付完成后点击下方按钮</p>
              
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
              >
                {isProcessing ? '确认中...' : '我已支付完成'}
              </button>
              <button
                onClick={() => setStep('select')}
                className="w-full py-3 text-gray-500 hover:text-gray-700 mt-2"
              >
                返回修改
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">充值成功！</h3>
              <p className="text-gray-500 mb-2">已成功充值 ¥{selectedAmount}</p>
              <p className="text-orange-500 font-bold text-lg mb-6">
                当前余额: ¥{(currentBalance + selectedAmount).toFixed(2)}
              </p>
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90"
              >
                完成
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
