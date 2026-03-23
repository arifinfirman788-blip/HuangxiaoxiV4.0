import React from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { Page } from '../types';

export default function TranslationPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="h-full bg-gradient-to-b from-indigo-50 to-white flex flex-col relative overflow-hidden">
      {/* Fake Home Background to match "首页的样式" */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img src="/首页.jpg" alt="首页背景" className="absolute top-0 left-0 w-full h-[151px] object-cover z-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
        <div className="absolute top-0 left-0 w-full h-[151px] bg-gradient-to-b from-[rgba(119,134,252,0.5)] via-[rgba(119,134,252,0.2)] to-[rgba(119,134,252,0)] z-10" />
        <div className="pt-20 px-6 relative z-10">
          <div className="flex items-end gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">黄小西</h1>
              <p className="text-sm text-gray-500">您的AI文旅助手</p>
            </div>
            <img src="/IP_1.png" alt="趴着的黄小西" className="w-24 h-18 object-contain scale-x-[-1]" />
          </div>
        </div>
        <div className="px-6 mt-8 flex gap-2 relative z-10">
          <div className="flex-1 bg-green-50 border border-green-100 rounded-full px-3 py-1.5 h-8"></div>
          <div className="w-12 h-8 bg-green-50 border border-green-100 rounded-xl"></div>
        </div>
        <div className="flex px-6 mt-6 gap-6">
          <div className="text-lg font-medium text-[#7786FC]">精选</div>
          <div className="text-lg font-medium text-gray-500">景区</div>
          <div className="text-lg font-medium text-gray-500">酒店</div>
        </div>
        <div className="mt-6 px-6">
          <div className="w-full h-64 bg-white rounded-[2rem] shadow-xl"></div>
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75 z-20 flex flex-col backdrop-blur-sm">
        {/* Mock WeChat Capsule */}
        <div className="absolute top-12 right-4 flex items-center gap-2">
          <div className="w-[84px] h-[32px] bg-white/20 rounded-full border border-white/30 flex items-center justify-between px-3 backdrop-blur-md">
            <span className="text-white text-lg leading-none tracking-widest">•••</span>
            <div className="w-[1px] h-4 bg-white/30"></div>
            <div className="w-4 h-4 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Arrow pointing to capsule */}
        <div className="absolute top-24 right-12 text-white animate-bounce">
          <ArrowUpRight size={36} strokeWidth={2.5} />
        </div>

        {/* Guide Content */}
        <div className="flex-1 mt-36 px-6 overflow-y-auto pb-28 scrollbar-hide">
          <div className="space-y-4">
            <GuideStep 
              num={1}
              zh="点击右上角“•••”按钮"
              en="Tap the '...' button in the top-right corner."
            />
            <GuideStep 
              num={2}
              zh="底部弹窗选择“翻译”功能"
              en='Select the "Translate" option from the bottom pop-up menu.'
            />
            <GuideStep 
              num={3}
              zh="弹窗选择“更换语言”"
              en='Choose "Change Language" in the subsequent pop-up window.'
            />
            <GuideStep 
              num={4}
              zh="选择您需要的语言"
              en="Pick your preferred language from the available options."
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="absolute bottom-8 left-6 right-6">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <X size={20} />
            我知道了 / Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideStep({ num, zh, en }: { num: number, zh: string, en: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-white relative pl-14">
      <div className="absolute top-5 left-4 w-7 h-7 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
        {num}
      </div>
      <p className="font-bold text-[15px] mb-1.5">{zh}</p>
      <p className="text-xs text-white/70 leading-relaxed">{en}</p>
    </div>
  );
}
