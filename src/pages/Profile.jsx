import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  ChevronRight, 
  User, 
  Map, 
  Mountain, 
  Bed, 
  Ticket, 
  Car, 
  ShoppingBag, 
  CreditCard, 
  FileText, 
  Phone,
  Edit2,
  LogOut,
  Contact,
  Plus,
  LayoutDashboard,
  ShieldCheck,
  X
} from 'lucide-react';
import avatarImage from '../image/托腮_1.png';
import BusinessCardModal from '../components/BusinessCardModal';
import CreateAgentModal from '../components/CreateAgentModal';
import BusinessCardCertification from '../components/BusinessCardCertification';

const Profile = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [showCardModal, setShowCardModal] = React.useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = React.useState(false);
  const [showCertModal, setShowCertModal] = React.useState(false);
  const [cardData, setCardData] = React.useState(null);
  const [myAgents, setMyAgents] = React.useState([]);
  const [isCertified, setIsCertified] = React.useState(false);

  // Load card data and agents from local storage on mount
  React.useEffect(() => {
    const savedCard = localStorage.getItem('user_business_card');
    if (savedCard) {
      setCardData(JSON.parse(savedCard));
    }
    
    const savedAgents = localStorage.getItem('my_created_agents');
    if (savedAgents) {
      setMyAgents(JSON.parse(savedAgents));
    }

    const savedCert = localStorage.getItem('user_is_certified');
    if (savedCert) {
      setIsCertified(JSON.parse(savedCert));
    }
  }, []);

  const handleSaveCard = (data) => {
    setCardData(data);
    localStorage.setItem('user_business_card', JSON.stringify(data));
  };

  const handleCertComplete = () => {
    setIsCertified(true);
    localStorage.setItem('user_is_certified', 'true');
    setShowCertModal(false);
  };

  const handleSaveAgent = (agentData) => {
    const newAgent = {
      ...agentData,
      id: Date.now().toString(),
      isPushed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedAgents = [newAgent, ...myAgents];
    setMyAgents(updatedAgents);
    localStorage.setItem('my_created_agents', JSON.stringify(updatedAgents));
    setShowCreateAgentModal(false);
  };

  const handlePushToHome = (agentId) => {
    const updatedAgents = myAgents.map(agent => 
      agent.id === agentId ? { ...agent, isPushed: !agent.isPushed } : agent
    );
    setMyAgents(updatedAgents);
    localStorage.setItem('my_created_agents', JSON.stringify(updatedAgents));
  };

  const handleDeleteAgent = (agentId) => {
    const updatedAgents = myAgents.filter(agent => agent.id !== agentId);
    setMyAgents(updatedAgents);
    localStorage.setItem('my_created_agents', JSON.stringify(updatedAgents));
  };

  // Mock user data
  const userData = {
    nickname: "旅行者_9527",
    tags: ["摄影爱好者", "美食达人", "自驾游"],
    avatar: avatarImage
  };

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-hide pb-32 bg-slate-50">
      {/* Top Section - User Smart Card */}
      <div className="px-6 pt-12 pb-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
           {/* Background decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-100/50 to-transparent rounded-bl-[4rem] -z-0" />
           
           <div className="relative z-10">
            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden">
                    <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-cyan-500 text-white p-1.5 rounded-full shadow-sm">
                    <Edit2 size={12} />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">{userData.nickname}</h2>
                    <button className="text-slate-400">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-medium rounded-full border border-cyan-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setShowCardModal(true)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 rounded-full shadow-md shadow-cyan-200 active:scale-95 transition-all hover:shadow-lg"
                  >
                    <Contact size={14} />
                    {cardData ? '我的名片' : '新增个人名片'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-inner">
                  <User size={32} className="text-slate-300" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">欢迎来到智游黔境</h2>
                  <p className="text-xs text-slate-400 mb-3">登录开启您的专属智能旅程</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-full shadow-md active:scale-95 transition-transform"
                  >
                    立即登录
                  </button>
                </div>
              </div>
            )}
           </div>
        </div>
      </div>

      {/* My Agents Section */}
      <div className="px-6 mb-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 px-1">我的智能体</h3>
        <div className="space-y-3">
          {myAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
                <img src={agent.bgImage || agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{agent.name}</h4>
                  {agent.isPushed && (
                    <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-600 text-[10px] rounded-md font-bold whitespace-nowrap border border-cyan-200">
                      已推送
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md font-medium whitespace-nowrap">
                    {agent.selectedType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{agent.intro}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePushToHome(agent.id)}
                  title={agent.isPushed ? "取消推送" : "推送到广场"}
                  className={`p-2 rounded-full transition-colors ${
                    agent.isPushed 
                      ? 'bg-cyan-50 text-cyan-500' 
                      : 'bg-slate-50 text-slate-400 hover:text-cyan-500'
                  }`}
                >
                  <Map size={16} className={agent.isPushed ? "fill-cyan-500" : ""} />
                </button>
                <button 
                  onClick={() => navigate(`/agent-service/${agent.id}`)}
                  title="管理智能体"
                  className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                >
                  <LayoutDashboard size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteAgent(agent.id)}
                  title="删除智能体"
                  className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setShowCreateAgentModal(true)}
            className="w-full h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-cyan-400 hover:text-cyan-500 transition-colors bg-slate-50/50"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold">创建个人智能体</span>
          </button>
        </div>
      </div>

      {/* My Orders Section */}
      <div className="px-6 mb-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 px-1">我的订单</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="grid grid-cols-3 gap-y-6">
            <OrderItem icon={Map} label="线路" color="text-emerald-500" bg="bg-emerald-50" />
            <OrderItem icon={Mountain} label="景区" color="text-cyan-500" bg="bg-cyan-50" />
            <OrderItem icon={Bed} label="酒店" color="text-orange-500" bg="bg-orange-50" />
            <OrderItem icon={Ticket} label="活动" color="text-purple-500" bg="bg-purple-50" />
            <OrderItem icon={Car} label="出行" color="text-blue-500" bg="bg-blue-50" />
            <OrderItem icon={ShoppingBag} label="零售" color="text-pink-500" bg="bg-pink-50" />
          </div>
        </div>
      </div>

      {/* General Content Section */}
      <div className="px-6 mb-8 space-y-3">
        <MenuItem 
          icon={ShieldCheck} 
          label={isCertified ? "本地人认证 (已认证)" : "本地人认证"} 
          onClick={() => setShowCertModal(true)}
          rightElement={isCertified ? <span className="text-green-500 text-xs font-bold flex items-center gap-1"><ShieldCheck size={12} /> 已认证</span> : null}
        />
        <MenuItem icon={CreditCard} label="常用证件信息" />
        <MenuItem icon={FileText} label="协议规则" />
        <MenuItem icon={Phone} label="客服电话" />
        <MenuItem icon={Settings} label="设置" isLast />
        
        {isAuthenticated && (
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 shadow-sm mt-6 font-bold text-sm"
          >
            <LogOut size={18} />
            退出登录
          </motion.button>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 text-center pb-8 space-y-1.5 opacity-60">
        <p className="text-[10px] text-slate-400 font-medium">模型名称：多彩黄小西AI</p>
        <p className="text-[10px] text-slate-400">备案编号：Guizhou-DuoCaiHuangXiaoXiAI-20250724S0002</p>
        <p className="text-[10px] text-slate-400">ICP号：黔ICP备2025044274号-1X</p>
      </div>

      <BusinessCardModal 
        isOpen={showCardModal} 
        onClose={() => setShowCardModal(false)} 
        initialData={cardData}
        onSave={handleSaveCard}
      />
      
      <CreateAgentModal
        isOpen={showCreateAgentModal}
        onClose={() => setShowCreateAgentModal(false)}
        onSave={handleSaveAgent}
      />

      {/* Certification Modal */}
      {showCertModal && ReactDOM.createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col h-[85vh] max-h-[800px]"
              onClick={(e) => e.stopPropagation()}
            >
              <BusinessCardCertification 
                onComplete={handleCertComplete}
                onBack={() => setShowCertModal(false)}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const OrderItem = ({ icon: Icon, label, color, bg }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center gap-2"
  >
    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <span className="text-xs text-slate-600 font-medium">{label}</span>
  </motion.button>
);

const MenuItem = ({ icon: Icon, label, isLast, onClick, rightElement }) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-slate-700" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    {rightElement ? rightElement : <ChevronRight size={16} className="text-slate-300" />}
  </motion.button>
);

export default Profile;
