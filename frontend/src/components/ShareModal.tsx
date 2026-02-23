'use client';

import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
}

export default function ShareModal({ isOpen, onClose, title, url, description }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLinks = [
    { 
      name: '微信', 
      icon: '💬', 
      color: 'bg-green-500',
      action: () => alert('请截图分享到微信') 
    },
    { 
      name: '微博', 
      icon: '📢', 
      color: 'bg-red-500',
      action: () => window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`) 
    },
    { 
      name: 'QQ', 
      icon: '🐧', 
      color: 'bg-blue-500',
      action: () => window.open(`https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`) 
    },
    { 
      name: '复制链接', 
      icon: '🔗', 
      color: 'bg-gray-500',
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">分享给好友</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
            {description && <p className="text-gray-500 text-sm">{description}</p>}
            <p className="text-orange-500 text-xs mt-2 truncate">{url}</p>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-4 gap-4">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 ${link.color} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <span className="text-gray-600 text-xs">
                  {link.name === '复制链接' && copied ? '已复制!' : link.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center border">
              <span className="text-gray-400 text-xs">二维码</span>
            </div>
            <div>
              <p className="text-gray-800 font-medium">扫码分享</p>
              <p className="text-gray-500 text-sm">打开微信扫一扫</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
