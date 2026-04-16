import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Link2, FileImage, FileText, Building2, X } from 'lucide-react';
import { Page } from '../types';

export default function AddSheet({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate: (page: Page) => void }) {
  const handleComingSoon = () => {
    alert('敬请期待：该功能正在开发中，后续版本上线。');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-50 px-5 pt-4 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

            <div className="space-y-3">
              {/* 主操作：创建新行程 */}
              <button 
                onClick={() => { onClose(); onNavigate('chat'); }}
                className="w-full bg-gradient-to-r from-[#7C4DFF] via-[#B44DFF] to-[#E040FB] px-6 py-5 rounded-[1.25rem] flex items-center justify-between active:scale-[0.98] transition-transform text-white shadow-lg"
              >
                <div className="text-left">
                  <div className="font-extrabold text-xl">创建新行程</div>
                  <div className="text-[13px] text-white/80 mt-1">召唤智能行程规划师，为您定制规划</div>
                </div>
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                  <Sparkles size={20} />
                </div>
              </button>

              {/* 智能识别导入 */}
              <button 
                onClick={() => { onClose(); onNavigate('smart-import'); }}
                className="w-full bg-gray-50 px-6 py-4 rounded-[1.25rem] flex items-center justify-between relative overflow-hidden active:scale-[0.98] transition-transform shadow-sm hover:shadow-md"
              >
                <div className="text-left">
                  <div className="font-bold text-[15px] text-gray-800">智能识别导入</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-0.5"><Link2 size={11} />链接</span>
                    <span className="text-gray-300">|</span>
                    <span className="inline-flex items-center gap-0.5"><FileText size={11} />文本</span>
                    <span className="text-gray-300">|</span>
                    <span className="inline-flex items-center gap-0.5"><FileImage size={11} />图片</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-50">
                    <Link2 size={18} />
                  </div>
                </div>
              </button>

              {/* 旅行社导入 — 敬请期待 */}
              <button 
                onClick={handleComingSoon}
                className="w-full bg-gray-50 px-6 py-4 rounded-[1.25rem] flex items-center justify-between relative overflow-hidden"
              >
                <div className="text-left">
                  <div className="font-bold text-[15px] text-gray-800">旅行社导入</div>
                  <div className="text-xs text-gray-400 mt-1">扫码行程码或导游码进行行程绑定导入</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-200/70 px-2 py-0.5 rounded-full">敬请期待</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                    <Building2 size={18} />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
