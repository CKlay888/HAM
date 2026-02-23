'use client';

import { useState } from 'react';
import RechargeModal from './RechargeModal';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'recharge' | 'withdraw';
  amount: number;
  description: string;
  time: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 29, description: 'Agent订阅收入 - CodeMaster Pro', time: '今天 14:30' },
  { id: '2', type: 'expense', amount: -5, description: '购买Agent服务', time: '今天 10:15' },
  { id: '3', type: 'recharge', amount: 100, description: '账户充值', time: '昨天 18:00' },
  { id: '4', type: 'income', amount: 99, description: 'Agent订阅收入 - DataInsight', time: '昨天 12:30' },
  { id: '5', type: 'withdraw', amount: -500, description: '提现到支付宝', time: '2026-02-20' },
];

interface WalletCardProps {
  balance?: number;
  pendingIncome?: number;
  transactions?: Transaction[];
}

export default function WalletCard({ 
  balance = 1256.50, 
  pendingIncome = 234.00,
  transactions = mockTransactions 
}: WalletCardProps) {
  const [showRecharge, setShowRecharge] = useState(false);

  const typeConfig = {
    income: { icon: '📈', color: 'text-green-500', prefix: '+' },
    expense: { icon: '📉', color: 'text-red-500', prefix: '' },
    recharge: { icon: '💳', color: 'text-blue-500', prefix: '+' },
    withdraw: { icon: '🏦', color: 'text-orange-500', prefix: '' },
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Balance Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm">账户余额</p>
              <p className="text-3xl font-bold mt-1">¥{balance.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">待入账</p>
              <p className="text-xl font-medium">¥{pendingIncome.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setShowRecharge(true)}
              className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
            >
              💰 充值
            </button>
            <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors">
              🏦 提现
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b">
          {[
            { label: '本月收入', value: '¥3,456' },
            { label: '本月支出', value: '¥234' },
            { label: '累计收入', value: '¥12,890' },
          ].map(stat => (
            <div key={stat.label} className="p-4 text-center">
              <p className="text-gray-500 text-xs">{stat.label}</p>
              <p className="text-gray-800 font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Transaction List */}
        <div className="px-6 py-4 border-b">
          <h4 className="font-medium text-gray-800">最近交易</h4>
        </div>
        <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
          {transactions.map(tx => (
            <div key={tx.id} className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{typeConfig[tx.type].icon}</span>
                <div>
                  <p className="text-gray-800 text-sm">{tx.description}</p>
                  <p className="text-gray-400 text-xs">{tx.time}</p>
                </div>
              </div>
              <span className={`font-medium ${typeConfig[tx.type].color}`}>
                {typeConfig[tx.type].prefix}¥{Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="px-6 py-3 bg-gray-50 text-center">
          <button className="text-orange-500 text-sm hover:underline">
            查看全部交易 →
          </button>
        </div>
      </div>

      <RechargeModal
        isOpen={showRecharge}
        currentBalance={balance}
        onClose={() => setShowRecharge(false)}
        onSuccess={(amount) => alert(`充值成功！+¥${amount}`)}
      />
    </>
  );
}
