import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Plus, Smile, MoreHorizontal, ChevronLeft } from 'lucide-react';

const WeChatSharePreview = ({ isOpen, onClose, cardData }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#f5f5f5] w-full max-w-[375px] h-[667px] rounded-[30px] overflow-hidden shadow-2xl relative flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Status Bar */}
          <div className="h-12 bg-[#ededed] flex items-end px-6 pb-2 justify-between text-black text-xs font-medium z-10">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2.5 bg-black rounded-[1px]" />
              <div className="w-3 h-2.5 bg-black rounded-[1px]" />
              <div className="w-5 h-2.5 border border-black rounded-[2px] relative">
                <div className="absolute inset-0.5 bg-black" />
              </div>
            </div>
          </div>

          {/* WeChat Header */}
          <div className="h-12 bg-[#ededed] flex items-center justify-between px-4 border-b border-gray-300 z-10">
            <div className="flex items-center gap-1">
              <ChevronLeft size={24} className="text-black" />
              <span className="text-black text-lg font-medium">文件传输助手</span>
            </div>
            <MoreHorizontal size={20} className="text-black" />
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[#ededed] p-4 overflow-y-auto">
            {/* Time Stamp */}
            <div className="flex justify-center mb-6">
              <span className="bg-[#dcdcdc] text-white text-xs px-2 py-1 rounded-sm">下午 2:30</span>
            </div>

            {/* User Message (Right Side) */}
            <div className="flex justify-end gap-3 mb-6">
              <div className="bg-[#95ec69] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[70%]">
                <p className="text-black text-sm">这是我的电子名片，请惠存。</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                <img src={cardData?.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Mini Program Card (Right Side) */}
            <div className="flex justify-end gap-3">
              <div className="bg-white w-60 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                {/* Card Header */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-100 bg-white">
                    <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">黔</span>
                    </div>
                    <span className="text-xs text-gray-500">黄小西个人名片</span>
                </div>
                
                {/* Card Content */}
                <div className="relative h-48 bg-slate-100">
                    <img src={cardData?.bgImage} alt="Card Cover" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <h3 className="font-bold text-base truncate">{cardData?.name}</h3>
                        <p className="text-xs opacity-90 truncate">{cardData?.title} | {cardData?.organization}</p>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="p-2 bg-white flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-[10px] text-gray-400">贵州省文化和旅游厅</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                <img src={cardData?.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-[#f7f7f7] border-t border-gray-300 px-3 py-2 pb-6 flex items-center gap-3">
            <Mic size={28} className="text-gray-600" />
            <div className="flex-1 bg-white h-9 rounded-md border border-gray-200" />
            <Smile size={28} className="text-gray-600" />
            <Plus size={28} className="text-gray-600" />
          </div>

          {/* Close Button Overlay */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeChatSharePreview;
