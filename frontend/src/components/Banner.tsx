'use client';

import { useState, useEffect } from 'react';

const banners = [
  {
    id: 1,
    title: '新用户专享',
    subtitle: '注册即送¥50体验金',
    bg: 'from-orange-500 to-red-500',
    link: '/register',
  },
  {
    id: 2,
    title: '爆款Agent 限时5折',
    subtitle: 'CodeMaster Pro 原价¥59 现价¥29',
    bg: 'from-red-500 to-pink-500',
    link: '/agents/1',
  },
  {
    id: 3,
    title: '开发者入驻计划',
    subtitle: '上架Agent 佣金低至5%',
    bg: 'from-purple-500 to-blue-500',
    link: '/developer',
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[200px] md:h-[280px] rounded-xl overflow-hidden">
      {banners.map((banner, index) => (
        <a
          key={banner.id}
          href={banner.link}
          className={`absolute inset-0 bg-gradient-to-r ${banner.bg} flex items-center justify-center transition-opacity duration-500 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-center text-white px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{banner.title}</h2>
            <p className="text-lg md:text-xl opacity-90">{banner.subtitle}</p>
            <button className="mt-4 px-6 py-2 bg-white text-orange-500 rounded-full font-semibold hover:bg-orange-50 transition-colors">
              立即查看
            </button>
          </div>
        </a>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
      >
        ›
      </button>
    </div>
  );
}
