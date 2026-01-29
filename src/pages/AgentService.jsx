import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, MoreHorizontal, User, MapPin, 
  Share2, MessageCircle, Star, Edit2, Plus, 
  CheckCircle2, CreditCard, ListTodo, UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import GuizhouLandscapeImg from '../image/guizhou_landscape.jpg';

const AgentService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Load agent data from localStorage
    const savedAgents = localStorage.getItem('my_created_agents');
    if (savedAgents) {
      const agents = JSON.parse(savedAgents);
      const agent = agents.find(a => a.id === id);
      if (agent) {
        setAgentData(agent);
      }
    }
  }, [id]);

  if (!agentData) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <p className="text-slate-400">正在加载...</p>
      </div>
    );
  }

  const defaultServices = agentData.services && agentData.services.length > 0 ? agentData.services : [
    { name: '基础服务', price: '100', unit: '元/次' }
  ];

  return (
    <div className="h-full w-full bg-slate-50 relative flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 relative z-10 pt-12">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors -ml-2">
          <MessageCircle size={24} className="text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">名片</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <MoreHorizontal size={24} className="text-slate-800" />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <div className="w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Service Type Tag */}
        <div className="px-4 py-4 flex justify-between items-center">
          <span className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-bold shadow-md shadow-blue-200">
            {agentData.selectedType || '能工巧匠'}
          </span>
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
            <Plus size={18} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-800">{agentData.name}</h2>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-400 font-medium">
                    <CheckCircle2 size={10} />
                    未实名
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                  <MapPin size={12} />
                  <span>贵州 · 贵阳</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                <img 
                  src={agentData.bgImage || agentData.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className={`text-sm text-slate-600 leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-4'}`}>
              {agentData.intro || "暂无简介"}
            </div>
            
            <div className="flex justify-end mb-4">
               <button 
                 onClick={() => setIsExpanded(!isExpanded)}
                 className="text-xs text-blue-500 font-medium"
               >
                 {isExpanded ? '收起' : '展开'}
               </button>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-1">
                编辑
              </button>
              <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-1">
                分享
              </button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 border-l-4 border-purple-500 pl-2">
              <h3 className="text-base font-bold text-slate-800">服务</h3>
            </div>
            <button className="text-xs text-blue-500 font-medium flex items-center gap-1">
              <Edit2 size={12} />
              编辑服务
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 space-y-3">
            {defaultServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex flex-col items-center justify-center shadow-sm border border-slate-100 text-[10px] font-bold text-slate-700 leading-none gap-0.5">
                       <span>{service.name.slice(0, 2)}</span>
                       <span>{service.name.slice(2, 4)}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{service.name}</span>
                 </div>
                 <div className="text-red-500 font-bold text-sm">
                    ¥{service.price}<span className="text-xs font-normal text-slate-400">/{service.unit.split('/')[1] || '次'}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-slate-100 px-6 py-2 pb-8 flex justify-between items-center absolute bottom-0 left-0 right-0 z-20">
         <button className="flex flex-col items-center gap-1 text-blue-500">
            <CreditCard size={24} />
            <span className="text-[10px] font-medium">名片</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
            <ListTodo size={24} />
            <span className="text-[10px] font-medium">任务</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
            <UserCircle size={24} />
            <span className="text-[10px] font-medium">我的</span>
         </button>
      </div>
    </div>
  );
};

export default AgentService;