import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Users, 
  CheckCircle2, AlertCircle, Share2, Building2, 
  ShieldCheck, FileText, ChevronRight, ArrowRight
} from 'lucide-react';
import { getPlaceholder } from '../utils/imageUtils';

const TripConfirmPage = ({ onAdoptTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Get scanned data from navigation state
  const scannedData = location.state?.scannedData;
  const agency = scannedData?.agency || {
    name: "贵州青年旅行社",
    license: "L-GZ-CJ0001",
    level: "AAA",
    operator: "王小明",
    operatorId: "9527",
    createTime: "2026-05-01 09:30"
  };

  // If no data (e.g. direct access), redirect back
  if (!scannedData) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">无效的行程数据</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    setIsConfirming(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onAdoptTrip) {
        onAdoptTrip(scannedData);
      }
      setIsConfirming(false);
      
      // Show success feedback handled by parent or navigate to trip
      // Here we navigate to Trip page directly
      navigate('/trip');
    }, 1000);
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">行程确认</h1>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 pb-32">
        
        {/* Agency Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-[3rem] -mr-4 -mt-4" />
           
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                 <Building2 size={28} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-800 text-lg">{agency.name}</h3>
                    <ShieldCheck size={16} className="text-blue-500 fill-blue-50" />
                 </div>
                 <p className="text-xs text-slate-500">官方认证 · 信用评级 {agency.level} · 经营许可证 {agency.license}</p>
              </div>
           </div>
           
           <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-xs text-slate-500">
              <span>经办人：{agency.operator} (工号: {agency.operatorId})</span>
              <span>创建时间：{agency.createTime}</span>
           </div>
        </div>

        {/* Trip Overview */}
        <div className="mb-6">
           <h2 className="text-xl font-black text-slate-800 mb-4 px-1">行程概览</h2>
           <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
              <div className="p-5 border-b border-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[10px] font-bold">跟团游</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">纯玩无购物</span>
                  </div>
                  <h1 className="text-2xl font-bold leading-tight text-slate-800">{scannedData.title}</h1>
              </div>
              
              <div className="p-5 grid grid-cols-3 gap-4">
                 <div className="text-center">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-500">
                       <Calendar size={20} />
                    </div>
                    <p className="text-xs text-slate-400 mb-0.5">出发日期</p>
                    <p className="font-bold text-slate-800">{scannedData.date}</p>
                 </div>
                 <div className="text-center border-l border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-500">
                       <Clock size={20} />
                    </div>
                    <p className="text-xs text-slate-400 mb-0.5">行程天数</p>
                    <p className="font-bold text-slate-800">{scannedData.days}天</p>
                 </div>
                 <div className="text-center border-l border-slate-100">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-green-500">
                       <Users size={20} />
                    </div>
                    <p className="text-xs text-slate-400 mb-0.5">出行人数</p>
                    <p className="font-bold text-slate-800">2人</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Itinerary Preview */}
        <div>
           <h2 className="text-xl font-black text-slate-800 mb-4 px-1">详细安排</h2>
           <div className="space-y-4">
              {scannedData.itinerary.map((day, index) => (
                 <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-slate-800 italic">{day.dayLabel}</span>
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-md">{day.date}</span>
                       </div>
                       <span className="text-xs font-bold text-slate-400">{day.weather.desc} {day.weather.temp}</span>
                    </div>
                    
                    <div className="relative pl-4 space-y-6">
                       <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
                       {day.timeline.map((node, i) => (
                          <div key={i} className="relative z-10 flex gap-4">
                             <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-white shrink-0 shadow-sm mt-0.5" />
                             <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                   <div className="flex items-center gap-2">
                                       <span className="text-sm font-bold text-slate-800">{node.title}</span>
                                       {/* Transport Route moved here */}
                                       {(node.type === 'flight' || (node.type === 'transport' && node.details?.flightNo)) && (
                                           <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                               <span>{node.details.dep}</span>
                                               <ArrowRight size={8} />
                                               <span>{node.details.arr}</span>
                                           </div>
                                       )}
                                   </div>
                                   <span className="text-xs font-mono text-slate-400">{node.time}</span>
                                </div>
                                
                                {/* Dynamic Details */}
                                {(node.type === 'flight' || (node.type === 'transport' && node.details?.flightNo)) && (
                                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1 bg-slate-50 px-2 py-1 rounded w-fit">
                                        <span className="font-bold text-slate-800">{node.details.flightNo}</span>
                                        <span className="text-slate-400">|</span>
                                        <span>{node.details.desc}</span>
                                    </div>
                                )}

                                {node.type === 'group_meal' && (
                                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1 bg-orange-50 px-2 py-1 rounded w-fit text-orange-700">
                                        <span className="font-bold">{node.details.standard}</span>
                                        <span className="text-orange-300">|</span>
                                        <span>{node.details.menu}</span>
                                    </div>
                                )}

                                {node.type === 'hotel' && node.details?.roomType && (
                                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1 bg-indigo-50 px-2 py-1 rounded w-fit text-indigo-700">
                                        <span className="font-bold">{node.details.name}</span>
                                        <span className="text-indigo-300">|</span>
                                        <span>{node.details.roomType}</span>
                                    </div>
                                )}

                                {/* Address or Description */}
                                <div className="flex items-start gap-1 text-[10px] text-slate-500">
                                    {(node.type !== 'flight' && node.type !== 'transport') && (
                                        <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                    )}
                                    <span className="line-clamp-2">
                                        {(node.type !== 'flight' && node.type !== 'transport') 
                                            ? (node.details?.address || node.details?.desc || node.tips)
                                            : (node.details?.desc || node.tips)}
                                    </span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Terms */}
        <div className="mt-8 flex items-start gap-2 px-2">
           <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
           <p className="text-xs text-slate-400 leading-relaxed">
              我已阅读并同意 <span className="text-cyan-600 font-bold">《旅游服务合同》</span> 及 <span className="text-cyan-600 font-bold">《行程确认书》</span>，确认无误后将生成电子行程单。
           </p>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-50 safe-area-bottom">
         <div className="flex gap-3">
            <button 
               onClick={() => navigate(-1)}
               className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 active:scale-95 transition-transform"
            >
               取消
            </button>
            <button 
               onClick={handleConfirm}
               disabled={isConfirming}
               className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-slate-900 shadow-lg shadow-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
               {isConfirming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    处理中...
                  </>
               ) : (
                  <>
                    确认并生成行程
                    <ChevronRight size={16} />
                  </>
               )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default TripConfirmPage;
