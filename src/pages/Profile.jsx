import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Contact
} from 'lucide-react';
import avatarImage from '../image/托腮_1.png';
import BusinessCardModal from '../components/BusinessCardModal';

const Profile = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [showCardModal, setShowCardModal] = React.useState(false);
  const [cardData, setCardData] = React.useState(null);

  // Load card data from local storage on mount
  React.useEffect(() => {
    const savedCard = localStorage.getItem('user_business_card');
    if (savedCard) {
      setCardData(JSON.parse(savedCard));
    }
  }, []);

  const handleSaveCard = (data) => {
    setCardData(data);
    localStorage.setItem('user_business_card', JSON.stringify(data));
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

const MenuItem = ({ icon: Icon, label, isLast }) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-slate-700" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <ChevronRight size={16} className="text-slate-300" />
  </motion.button>
);

export default Profile;
