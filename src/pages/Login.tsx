import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Page } from '../types';

export default function Login({ onNavigate, onLogin }: { onNavigate: (page: Page) => void, onLogin: (phone: string) => void }) {
  const [phone, setPhone] = useState('');

  return (
    <div className="min-h-full bg-white font-sans flex flex-col px-6">
      <div className="pt-12 pb-4 flex items-center">
        <button onClick={() => onNavigate('home')} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
      </div>

      <div className="mt-12 mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎来到黄小西</h1>
        <p className="text-gray-500">登录以体验完整的智能文旅服务</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center border-b border-gray-200 py-3">
          <span className="text-gray-800 font-medium mr-4">+86</span>
          <input 
            type="tel" 
            placeholder="请输入手机号" 
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex items-center border-b border-gray-200 py-3">
          <input type="text" placeholder="请输入验证码" className="flex-1 outline-none text-gray-900 placeholder-gray-400" />
          <button className="text-[#7786FC] text-sm font-medium whitespace-nowrap pl-4 border-l border-gray-200">获取验证码</button>
        </div>
      </div>

      <button 
        onClick={() => onLogin(phone || '138****8888')}
        className="w-full bg-[#7786FC] text-white rounded-full py-3.5 mt-10 font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all"
      >
        登录
      </button>

      <div className="mt-auto pb-12 text-center text-xs text-gray-400">
        登录即代表同意 <span className="text-[#7786FC]">《用户协议》</span> 和 <span className="text-[#7786FC]">《隐私政策》</span>
      </div>
    </div>
  );
}
