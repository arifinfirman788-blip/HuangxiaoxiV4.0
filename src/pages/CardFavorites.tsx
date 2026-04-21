import React from 'react';
import { ChevronLeft, MapPin, Heart } from 'lucide-react';
import { Page } from '../types';

const FAVORITE_CARDS = [
  { id: 'c1', name: '阿黔导游', title: '本地地陪名片', tags: ['路线规划', '方言讲解'], cover: `${import.meta.env.BASE_URL}图片/旅行记录2.jpg` },
  { id: 'c2', name: '小苗旅拍', title: '旅拍摄影师名片', tags: ['旅拍打卡', '出片指导'], cover: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg` },
  { id: 'c3', name: '老凯里味道', title: '美食达人名片', tags: ['本地餐馆', '避坑推荐'], cover: `${import.meta.env.BASE_URL}图片/miao.png` },
];

export default function CardFavorites({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-full bg-[#F7F8FA] pb-24 font-sans">
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => onNavigate('profile')} className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">名片收藏夹</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-4 space-y-3">
        {FAVORITE_CARDS.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img src={card.cover} alt={card.name} className="w-full h-28 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{card.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.title}</p>
                </div>
                <Heart size={16} className="text-pink-500 fill-pink-500" />
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {card.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="mt-3 w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-medium flex items-center justify-center gap-1">
                <MapPin size={13} />
                查看名片详情
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
