import React from 'react';
import { ChevronLeft, Sparkles, UserCircle, QrCode, PencilLine } from 'lucide-react';
import { Page } from '../types';

export default function DigitalCard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-full bg-gray-50 flex flex-col font-sans">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={() => onNavigate('profile')} className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">我的数字分身与名片</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-50">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/seed/avatar3d/200/200" alt="Digital Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100" />
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-1">
                yee 的数字分身
                <Sparkles size={14} className="text-indigo-500" />
              </h2>
              <p className="text-xs text-gray-500 mt-1">当前状态：已创建，可用于智能社交展示</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <UserCircle size={16} className="text-indigo-500" />
              个人名片
            </h3>
            <span className="text-[11px] px-2 py-1 rounded-full bg-green-50 text-green-600">已创建</span>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">yee</p>
            <p className="text-xs text-gray-500 mt-1">旅行达人 / 摄影爱好者</p>
            <p className="text-xs text-gray-500 mt-2">常驻地：江西省 九江市</p>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium flex items-center justify-center gap-1">
              <QrCode size={16} />
              查看名片码
            </button>
            <button
              onClick={() => onNavigate('digital-avatar')}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium flex items-center justify-center gap-1"
            >
              <PencilLine size={16} />
              编辑分身与名片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
