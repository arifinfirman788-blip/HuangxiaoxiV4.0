import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, MoreHorizontal, User, MapPin, 
  Bus, Car, Calendar, MessageCircle, Mic, Send, 
  Menu, ScanLine, Phone, Star, Coffee, Utensils
} from 'lucide-react';
import HotelAvatar from '../../image/摊手望天_1.png'; // Updated asset
import TuoSaiImage from '../../image/huangxiaoxi_new.png'; // Fallback or specific char

const HotelAgent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [agentData, setAgentData] = useState(null);

  // Mock Data Configuration
  const hotelsConfig = {
    '9': {
      name: '贵州饭店迎宾楼',
      location: '贵阳市云岩区 15°C 多云',
      avatar: HotelAvatar,
      intro: '贵州饭店迎宾楼，承载着贵州的历史与荣耀。为您提供私密尊贵的包房服务，地道的黔菜佳肴。',
      staffList: [
        { name: '小李', role: '客房服务员', desc: '客房服务找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { name: '小丽', role: '前台', desc: '信息咨询找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
        { name: '小宇', role: '销售', desc: '订房找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark' },
        { name: '大嘴', role: '餐饮经理', desc: '点餐找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude' },
      ]
    },
    '2': {
      name: '亚朵酒店管家',
      location: '贵阳市南明区 16°C 晴',
      avatar: HotelAvatar,
      intro: '您的全天候私人管家，不仅可以一键调节客房环境，还能为您预约深夜食堂的暖心夜宵。',
      staffList: [
        { name: 'Anna', role: '管家', desc: '全能管家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
        { name: 'David', role: '前台', desc: '入住办理', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
        { name: 'Lily', role: '餐厅', desc: '早餐服务', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily' },
        { name: 'Tom', role: '安保', desc: '安全保障', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' },
      ]
    }
  };

  useEffect(() => {
    if (id && hotelsConfig[id]) {
      setAgentData(hotelsConfig[id]);
    } else {
      // Default fallback
      setAgentData({
        name: '品舍民宿',
        location: '观山湖区 14°C 多云',
        avatar: HotelAvatar,
        intro: '我是您的酒店管家，可以为您查询酒店信息，提供专属服务',
        staffList: [
            { name: '小李', role: '客房服务员', desc: '客房服务找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
            { name: '小丽', role: '前台', desc: '信息咨询找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
            { name: '小宇', role: '销售', desc: '订房找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark' },
            { name: '大嘴', role: '餐饮经理', desc: '点餐找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude' },
        ]
      });
    }
  }, [id]);

  if (!agentData) return null;

  // Shared Quick Actions
  const quickActions = [
    { icon: MapPin, text: '到店交通指引' },
    { icon: Bus, text: '酒店周边公共交通' },
    { icon: Calendar, text: '预约入住' },
  ];

  return (
    <div className="h-full w-full bg-slate-50 relative flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-[180px]">
        {/* Header Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-100 via-blue-50/50 to-transparent z-0 pointer-events-none" />

        {/* Top Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Menu size={24} className="text-slate-800" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
               <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
               <span className="text-xs font-bold text-slate-700">服务团队</span>
            </div>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <MoreHorizontal size={24} className="text-slate-800" />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <div className="w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center">
                 <div className="w-2 h-2 bg-slate-800 rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 px-6 mb-6">
          <div className="flex justify-between items-start">
             <div className="w-28 h-28 relative -ml-2">
                <img src={agentData.avatar} alt="Avatar" className="w-full h-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform" />
             </div>
             <div className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-[10px] text-slate-600 shadow-sm border border-white/50">
                <MapPin size={10} />
                <span>{agentData.location}</span>
             </div>
          </div>
          
          <div className="mt-[-40px] ml-[110px] flex items-center gap-2">
             <h1 className="text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">欢迎入住，{agentData.name}</h1>
             <RotateIcon />
          </div>
        </div>

        {/* Main Service Card */}
        <div className="px-4 relative z-10">
          <div className="bg-white/40 rounded-[1.5rem] p-5 shadow-xl shadow-blue-100/50 border border-white/50 backdrop-blur-xl">
             <div className="flex items-start gap-2 mb-4">
                <div className="w-4 h-4 mt-1 text-blue-500">
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {agentData.intro}
                </p>
             </div>

             {/* Room Number Input */}
             <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2 flex-1">
                   <span className="text-sm font-bold text-slate-700 whitespace-nowrap">房间号：</span>
                   <input 
                     type="text" 
                     className="bg-transparent outline-none w-full text-sm font-medium text-slate-800 placeholder-slate-400"
                   />
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-500 font-medium cursor-pointer hover:opacity-80">
                   <span>扫描房间码获取客房服务</span>
                   <ScanLine size={14} />
                </div>
             </div>

             {/* Staff List */}
             <div className="mt-6 grid grid-cols-4 gap-3">
                {agentData.staffList.map((staff, index) => (
                  <div key={index} className="flex flex-col items-center">
                     <div className="w-14 h-14 rounded-full p-0.5 border-2 border-white shadow-md mb-2 overflow-hidden bg-slate-100">
                        <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                     </div>
                     <span className="text-sm font-bold text-slate-800 mb-0.5">{staff.name}</span>
                     <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full mb-1">{staff.role}</span>
                     <span className="text-[10px] text-slate-400 text-center scale-90 leading-tight">{staff.desc}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="px-4 mt-4 flex flex-col items-start gap-2 relative z-10">
           {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm border border-slate-100 text-slate-700 font-medium text-sm"
              >
                 <div className="w-5 h-5 flex items-center justify-center text-slate-500">
                    <MessageCircle size={18} />
                 </div>
                 {action.text}
              </motion.button>
           ))}
        </div>
      </div>

      {/* Bottom Fixed Area - Adjusted Position */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
         {/* Tags */}
         <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide pointer-events-auto">
            <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-600 shadow-sm border border-slate-100 whitespace-nowrap">
               设施询问
            </button>
            <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-600 shadow-sm border border-slate-100 whitespace-nowrap">
               儿童服务
            </button>
            <div className="ml-auto">
               <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-blue-500 shadow-sm border border-blue-100 flex items-center gap-1 whitespace-nowrap">
                  <MessageCircle size={12} />
                  留言评价
               </button>
            </div>
         </div>

         {/* Input Bar */}
         <div className="bg-white rounded-full p-2 pl-4 flex items-center gap-3 shadow-lg border border-slate-100 pointer-events-auto">
            <button className="text-slate-400 hover:text-slate-600">
               <Mic size={20} />
            </button>
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="请输入您需要的酒店服务"
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
            />
            <button className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-600 transition-colors">
               <Send size={16} className={inputMessage ? 'ml-0.5' : ''} />
            </button>
         </div>
      </div>
    </div>
  );
};

const RotateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export default HotelAgent;
