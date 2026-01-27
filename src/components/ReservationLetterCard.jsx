import React from 'react';
import { Play, FileCheck } from 'lucide-react';

const ReservationLetterCard = ({ videoUrl, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 w-full max-w-sm cursor-pointer hover:shadow-lg transition-shadow group relative overflow-hidden"
      onClick={onClick}
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-bl-full -z-0" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <FileCheck size={16} />
          </div>
          <h3 className="font-bold text-slate-800">餐厅预订函</h3>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 group-hover:opacity-95 transition-opacity">
          {/* Video Thumbnail Placeholder (or use a real thumbnail if available) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play size={24} className="text-white fill-white ml-1" />
             </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
             <p className="text-white text-xs font-medium">您的专属用餐预订函已生成</p>
             <p className="text-white/80 text-[10px]">点击查看详情视频</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400">
           <span>由 AI 自动生成</span>
           <span>刚刚</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationLetterCard;
