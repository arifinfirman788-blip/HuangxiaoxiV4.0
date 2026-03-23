import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ScanLine, X } from 'lucide-react';
import { Page } from '../types';

export default function AddSheet({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate: (page: Page) => void }) {
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
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-50 p-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">新建行程</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { onClose(); onNavigate('chat'); }}
                className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-3xl flex flex-col items-center gap-4 active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-500">
                  <Sparkles size={32} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">AI 智能规划</div>
                  <div className="text-xs text-gray-500 mt-1">对话生成专属行程</div>
                </div>
              </button>

              <button 
                onClick={() => { onClose(); }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 p-6 rounded-3xl flex flex-col items-center gap-4 active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-orange-500">
                  <ScanLine size={32} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">扫码导入</div>
                  <div className="text-xs text-gray-500 mt-1">扫描行程二维码</div>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
