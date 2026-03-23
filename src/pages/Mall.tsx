import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Page } from '../types';

export default function Mall({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <div className="pt-12 px-6 pb-4 bg-white sticky top-0 z-10 flex items-center gap-4">
        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-2 gap-2">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="搜索贵州特产、门票..." className="bg-transparent outline-none text-sm w-full" />
        </div>
        <button className="relative p-2">
          <ShoppingCart size={24} className="text-gray-800" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">2</span>
        </button>
      </div>

      <div className="px-6 mt-4">
        <div className="w-full h-32 bg-indigo-500 rounded-2xl overflow-hidden relative mb-6 shadow-sm">
          <img src="https://picsum.photos/seed/tea/800/400" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 p-4 flex flex-col justify-center">
            <h2 className="text-white font-bold text-xl">都匀毛尖 春茶上新</h2>
            <p className="text-white/80 text-sm">限时 8 折优惠</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {['特产伴手礼', '景区门票', '酒店套餐', '文创周边'].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl">
                {['🍵', '🎫', '🏨', '🎁'][i]}
              </div>
              <span className="text-[10px] font-medium text-gray-600">{item}</span>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-lg mb-4 text-gray-900">猜你喜欢</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm pb-3">
              <img src={`https://picsum.photos/seed/product${i}/400/400`} className="w-full aspect-square object-cover" />
              <div className="px-3 mt-2">
                <div className="text-sm font-medium line-clamp-2 mb-1 text-gray-800">贵州老干妈风味豆豉辣椒酱礼盒装</div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">¥ 39.9</span>
                  <button className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg leading-none">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
