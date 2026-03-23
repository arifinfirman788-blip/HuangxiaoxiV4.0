import React from 'react';
import { ChevronLeft, LogOut, ChevronRight } from 'lucide-react';
import { Page } from '../types';

export default function Settings({ onNavigate, onLogout, phoneNumber, onResetGuide }: { onNavigate: (page: Page) => void, onLogout: () => void, phoneNumber: string, onResetGuide?: () => void }) {
  return (
    <div className="min-h-full bg-[#F7F8FA] font-sans flex flex-col">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">设置</h1>
        <div className="w-8"></div>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-white rounded-2xl px-5 py-2 shadow-sm mb-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-[15px] text-gray-800">手机号</span>
            <span className="text-[15px] text-gray-500">{phoneNumber || '未绑定'}</span>
          </div>
          <div className="flex items-center justify-between py-4 cursor-pointer">
            <span className="text-[15px] text-gray-800">账号与安全</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl px-5 py-2 shadow-sm mb-4">
          <div
            className="flex items-center justify-between py-4 cursor-pointer"
            onClick={onResetGuide}
          >
            <span className="text-[15px] text-gray-800">重新查看新手引导</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-medium shadow-sm active:bg-gray-50 transition-colors"
        >
          <LogOut size={20} />
          退出登录
        </button>
      </div>
    </div>
  );
}
