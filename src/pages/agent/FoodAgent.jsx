import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, MoreHorizontal, User, MapPin, 
  Utensils, Clock, Wallet, MessageCircle, Mic, Send, 
  Menu, ScanLine, Phone, Star, Coffee
} from 'lucide-react';
import FoodAvatar from '../../image/叉腰_1.png'; 

const FoodAgent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState('');

  // Mock Data
  const staffList = [
    { name: '王大厨', role: '主厨', desc: '口味调整找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chef' },
    { name: '小张', role: '店长', desc: '投诉建议找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager' },
    { name: '小刘', role: '服务员', desc: '加菜催菜找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Waiter' },
    { name: '小赵', role: '收银', desc: '结账开票找我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cashier' },
  ];

  const quickActions = [
    { icon: Utensils, text: '查看电子菜单' },
    { icon: Clock, text: '排队取号/进度' },
    { icon: Wallet, text: '优惠券/团购核销' },
  ];

  return (
    <div className="h-full w-full bg-slate-50 relative flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-[180px]">
        {/* Header Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-orange-100 via-orange-50/50 to-transparent z-0 pointer-events-none" />

        {/* Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <Menu size={24} className="text-slate-800" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
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
                <img src={FoodAvatar} alt="Avatar" className="w-full h-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform" />
             </div>
             <div className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-[10px] text-slate-600 shadow-sm border border-white/50">
                <MapPin size={10} />
                <span>青云市集 20°C 舒适</span>
             </div>
          </div>
          
          <div className="mt-[-40px] ml-[110px] flex items-center gap-2">
             <h1 className="text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">欢迎光临，老凯里酸汤鱼</h1>
          </div>
        </div>

      {/* Main Service Card */}
      <div className="px-4 relative z-10">
        <div className="bg-white/40 rounded-[1.5rem] p-5 shadow-xl shadow-orange-100/50 border border-white/50 backdrop-blur-xl">
           <div className="flex items-start gap-2 mb-4">
              <div className="w-4 h-4 mt-1 text-orange-500">
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                我是您的餐饮管家，为您推荐地道美食，提供贴心用餐服务
              </p>
           </div>

           {/* Input */}
           <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2 flex-1">
                 <span className="text-sm font-bold text-slate-700 whitespace-nowrap">桌号：</span>
                 <input 
                   type="text" 
                   className="bg-transparent outline-none w-full text-sm font-medium text-slate-800 placeholder-slate-400"
                 />
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-500 font-medium cursor-pointer hover:opacity-80">
                 <span>扫描桌码点餐/服务</span>
                 <ScanLine size={14} />
              </div>
           </div>

           {/* Staff List */}
           <div className="mt-6 grid grid-cols-4 gap-3">
              {staffList.map((staff, index) => (
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

      {/* Bottom Fixed Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
         {/* Tags */}
         <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide pointer-events-auto">
            <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-600 shadow-sm border border-slate-100 whitespace-nowrap">
               招牌推荐
            </button>
            <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-600 shadow-sm border border-slate-100 whitespace-nowrap">
               忌口备注
            </button>
            <div className="ml-auto">
               <button className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-orange-500 shadow-sm border border-orange-100 flex items-center gap-1 whitespace-nowrap">
                  <MessageCircle size={12} />
                  评价反馈
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
              placeholder="请输入您需要的餐饮服务"
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
            />
            <button className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-orange-600 transition-colors">
               <Send size={16} className={inputMessage ? 'ml-0.5' : ''} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default FoodAgent;
