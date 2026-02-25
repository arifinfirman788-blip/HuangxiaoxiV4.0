import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Circle, Languages, Check } from 'lucide-react';

const LanguageGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEF2FF] pb-8">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#EEF2FF] px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">语言选择流程</h1>
        <div className="flex items-center gap-2 bg-white/50 rounded-full px-2 py-1 border border-slate-200">
          <MoreHorizontal size={20} className="text-slate-800" />
          <div className="w-[1px] h-4 bg-slate-300"></div>
          <div className="w-4 h-4 rounded-full border-2 border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Step1: <span className="font-normal">点击右上角 “...” 按钮</span>
            </h2>
            <p className="text-xs text-slate-500">Tap the '...' button in the top-right corner.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-100">
            {/* Mock Screen Header */}
            <div className="bg-slate-800/5 h-12 flex items-center justify-between px-4">
                <div className="w-16 h-4 bg-slate-200 rounded"></div>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-8 bg-white rounded-full border border-slate-200 flex items-center justify-center gap-2 relative">
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full border-2 border-blue-500 animate-pulse"></div>
                        <MoreHorizontal size={16} className="text-slate-800" />
                        <div className="w-[1px] h-3 bg-slate-300"></div>
                        <div className="w-3 h-3 rounded-full border border-slate-800 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mock Screen Content */}
            <div className="p-4 space-y-4 bg-gradient-to-b from-blue-50 to-white h-48">
                <div className="w-32 h-6 bg-blue-100 rounded-lg mx-auto mb-4"></div>
                <div className="bg-white p-3 rounded-xl shadow-sm space-y-2">
                    <div className="w-full h-8 bg-slate-50 rounded"></div>
                    <div className="flex gap-2">
                        <div className="w-1/2 h-8 bg-blue-500/10 rounded"></div>
                        <div className="w-1/2 h-8 bg-blue-500/10 rounded"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Step2: <span className="font-normal">底部弹窗选择 “翻译” 功能</span>
            </h2>
            <p className="text-xs text-slate-500">Select the "Translate" option from the bottom pop-up menu.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-100">
             <div className="bg-gradient-to-b from-blue-50 to-white h-56 p-4 flex flex-col justify-end">
                {/* Bottom Sheet */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm">
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div key={i} className="aspect-square bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-1">
                                <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                                <div className="w-8 h-2 bg-slate-100 rounded"></div>
                            </div>
                        ))}
                        <div className="aspect-square bg-blue-50 rounded-lg flex flex-col items-center justify-center gap-1 border-2 border-blue-500 relative">
                             <Languages size={20} className="text-blue-500" />
                             <span className="text-[9px] text-blue-600 font-bold">翻译</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Step3: <span className="font-normal">弹窗选择 “更换语言”</span>
            </h2>
            <p className="text-xs text-slate-500">Choose "Change Language" in the subsequent pop-up window.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-800/40 h-56 flex items-center justify-center p-6">
             {/* Modal */}
             <div className="bg-white rounded-xl p-6 w-full shadow-2xl space-y-4">
                <div className="space-y-2">
                    <div className="w-full h-4 bg-slate-100 rounded"></div>
                    <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                    <div className="w-full h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center px-3 text-xs text-slate-500">
                        原文语言与微信当前语言一致，是否需要更改翻译语言？
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 py-2 bg-slate-100 rounded-lg text-center text-xs font-bold text-slate-500">取消</div>
                    <div className="flex-1 py-2 bg-blue-500 rounded-lg text-center text-xs font-bold text-white border-2 border-blue-200">更换语言</div>
                </div>
             </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Step4: <span className="font-normal">选择您需要的语言</span>
            </h2>
            <p className="text-xs text-slate-500">Pick your preferred language from the available options.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white h-64 flex flex-col">
             <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <ChevronLeft size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-800">将文字翻译为</span>
                <span className="text-xs text-green-600 font-bold">完成</span>
             </div>
             <div className="p-4 space-y-4 overflow-hidden">
                <div>
                    <div className="text-[10px] text-slate-400 mb-2">当前微信使用的语言</div>
                    <div className="text-sm text-slate-800">简体中文</div>
                </div>
                <div className="space-y-3">
                    <div className="text-sm text-slate-800">简体中文</div>
                    <div className="text-sm text-slate-800">繁體中文 (台湾)</div>
                    <div className="text-sm text-slate-800">繁體中文 (香港)</div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-800 font-bold">English</span>
                        <Check size={16} className="text-green-500" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageGuide;