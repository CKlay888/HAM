'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-8">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* 买家服务 */}
          <div>
            <h3 className="text-white font-bold mb-4">买家服务</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400">购物指南</a></li>
              <li><a href="#" className="hover:text-orange-400">支付方式</a></li>
              <li><a href="#" className="hover:text-orange-400">售后服务</a></li>
              <li><a href="#" className="hover:text-orange-400">订单查询</a></li>
            </ul>
          </div>

          {/* 开发者 */}
          <div>
            <h3 className="text-white font-bold mb-4">开发者</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400">入驻指南</a></li>
              <li><a href="#" className="hover:text-orange-400">API文档</a></li>
              <li><a href="#" className="hover:text-orange-400">佣金说明</a></li>
              <li><a href="#" className="hover:text-orange-400">技术支持</a></li>
            </ul>
          </div>

          {/* 关于我们 */}
          <div>
            <h3 className="text-white font-bold mb-4">关于我们</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400">公司介绍</a></li>
              <li><a href="#" className="hover:text-orange-400">联系我们</a></li>
              <li><a href="#" className="hover:text-orange-400">加入我们</a></li>
              <li><a href="#" className="hover:text-orange-400">新闻中心</a></li>
            </ul>
          </div>

          {/* 帮助中心 */}
          <div>
            <h3 className="text-white font-bold mb-4">帮助中心</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400">常见问题</a></li>
              <li><a href="#" className="hover:text-orange-400">在线客服</a></li>
              <li><a href="#" className="hover:text-orange-400">投诉建议</a></li>
              <li><Link href="/terms" className="hover:text-orange-400">服务条款</Link></li>
            </ul>
          </div>

          {/* 关注我们 */}
          <div>
            <h3 className="text-white font-bold mb-4">关注我们</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-lg">微</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-lg">博</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-lg">抖</span>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm">客服热线</p>
              <p className="text-orange-400 text-xl font-bold">400-888-8888</p>
              <p className="text-xs text-gray-400">周一至周日 9:00-21:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">H</span>
                </div>
                <span className="text-white font-bold">HAM</span>
              </Link>
              <span>© 2026 HAM. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-orange-400">隐私政策</Link>
              <Link href="/terms" className="hover:text-orange-400">服务条款</Link>
              <span>ICP备案号: 京ICP备xxxxxxxx号</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
