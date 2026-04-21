import React, { useState } from 'react';
import { ChevronLeft, Camera, Sparkles, Save, UserCircle, Share2, QrCode } from 'lucide-react';
import { Page } from '../types';

export default function DigitalAvatar({ onNavigate, onAvatarGenerated, hasDigitalAvatar = false }: { onNavigate: (page: Page) => void, onAvatarGenerated?: () => void, hasDigitalAvatar?: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsSaved(true);
      if (onAvatarGenerated) onAvatarGenerated();
      setTimeout(() => setIsSaved(false), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={() => onNavigate('profile')} className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">我的数字分身</h1>
        <div className="w-10 flex justify-end">
          <button className="text-gray-700">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Avatar Display Section */}
        <div className="bg-gradient-to-b from-indigo-50 to-white pt-8 pb-6 px-6 flex flex-col items-center relative">
          <div className="relative w-32 h-32 mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 p-1 shadow-lg">
              <div className="w-full h-full bg-white rounded-full overflow-hidden border-4 border-white flex items-center justify-center">
                {isGenerating ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <Sparkles className="text-indigo-400 mb-1" size={24} />
                    <span className="text-[10px] text-indigo-500 font-medium">生成中...</span>
                  </div>
                ) : (
                  <img src={`${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`} alt="Digital Avatar" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Camera size={18} />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900">yee</h2>
          <p className="text-sm text-gray-500 mt-1">旅行达人 / 摄影爱好者</p>
          
          <div className="flex gap-2 mt-4">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium border border-indigo-100">自然风光</span>
            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium border border-purple-100">人文探索</span>
            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium border border-orange-100">美食打卡</span>
          </div>
        </div>

        {/* Digital Business Card Form */}
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UserCircle size={18} className="text-indigo-500" />
              数字名片资料
            </h3>
            <button className="text-xs text-indigo-600 font-medium flex items-center gap-1">
              <QrCode size={14} />
              我的名片码
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4 border border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">昵称</label>
              <input 
                type="text" 
                defaultValue="yee"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">个性签名</label>
              <textarea 
                defaultValue="热爱生活，热爱旅行。用脚步丈量世界，用镜头记录美好。"
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">常驻地</label>
              <input 
                type="text" 
                defaultValue="江西省 九江市"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">联系方式 (选填)</label>
              <input 
                type="text" 
                placeholder="微信号或邮箱，方便旅友联系"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe z-30">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-3.5 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${
            isSaved 
              ? 'bg-green-500 text-white shadow-green-200' 
              : 'bg-indigo-600 text-white shadow-indigo-200 active:scale-[0.98]'
          }`}
        >
          {isSaved ? (
            <>
              <Save size={20} /> 已保存
            </>
          ) : isGenerating ? (
            <>
              <Sparkles size={20} className="animate-spin" /> {hasDigitalAvatar ? '更新中...' : '生成中...'}
            </>
          ) : (
            <>
              <Sparkles size={20} /> {hasDigitalAvatar ? '更新数字分身' : '生成数字分身'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
