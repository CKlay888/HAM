'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface AgentPreviewProps {
  agentName: string;
  agentAvatar: string;
  placeholder?: string;
}

export default function AgentPreview({ agentName, agentAvatar, placeholder = '试试问我任何问题...' }: AgentPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', content: `你好！我是${agentName}，有什么可以帮你的吗？` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const responses = [
      '这是一个很好的问题！让我帮你分析一下...',
      '好的，我来帮你处理这个请求。',
      '根据你的需求，我建议...',
      '没问题！这个我很擅长，请稍等...',
    ];
    
    setMessages(prev => [...prev, { 
      role: 'agent', 
      content: responses[Math.floor(Math.random() * responses.length)] 
    }]);
    setIsTyping(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
        <div className="flex items-center gap-3">
          <img src={agentAvatar} alt={agentName} className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <h3 className="text-white font-bold">{agentName}</h3>
            <span className="text-white/80 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              在线
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-br-sm' 
                : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:opacity-90"
          >
            发送
          </button>
        </div>
        <p className="text-center text-gray-400 text-xs mt-2">这是体验版，功能有限</p>
      </div>
    </div>
  );
}
