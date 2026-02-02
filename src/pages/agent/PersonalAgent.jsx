import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, MoreHorizontal, User, MapPin, 
  Camera, Heart, Share2, MessageCircle, Mic, Send, 
  Menu, ScanLine, Phone, Star, UserCheck, ChefHat, 
  Utensils, Video, Sparkles
} from 'lucide-react';
import GuideAvatar from '../../image/daoyou.png'; 
import WangAyiAvatar from '../../image/wangayi.png';

const AgentRecommendationCard = ({ title, agents, onConnect }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 w-full">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-500" />
                {title}
            </h4>
            
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
                {agents.map(agent => (
                    <div 
                        key={agent.id}
                        className="shrink-0 w-32 h-40 rounded-xl overflow-hidden relative border-[2px] border-white shadow-md cursor-pointer group bg-slate-900"
                        onClick={() => onConnect && onConnect(agent)}
                    >
                        {/* Full Background Image */}
                        <img 
                            src={agent.avatar} 
                            alt={agent.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                            <div className="text-[10px] font-bold text-white leading-tight mb-0.5">{agent.name}</div>
                            <div className="text-[8px] text-white/80 truncate">{agent.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PersonalAgent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [agentData, setAgentData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
        // Use scrollTo to prevent whole page shift
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({
            top: scrollHeight - clientHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isTyping]);

  // Mock Data Configurations
  const agentsConfig = {
    // Xiao Zhang (Guide) - ID: 103 or 4
    '103': {
        name: '金牌地陪小张',
        role: '私人旅行管家',
        avatar: GuideAvatar,
        location: '全省可达 随时出发',
        intro: '我是您的私人旅行管家，为您定制专属行程，带您体验地道贵州',
        staffTitle: '服务技能',
        staffList: [
            { name: '摄影', role: '技能', desc: '大片拍摄', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Photo' },
            { name: '驾驶', role: '技能', desc: '老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Driver' },
            { name: '急救', role: '技能', desc: '安全保障', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Medic' },
            { name: '方言', role: '技能', desc: '本地通', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Local' },
        ],
        quickActions: [
            { icon: UserCheck, text: '查看个人履历/评价' },
            { icon: Camera, text: '查看旅拍作品集' },
            { icon: Share2, text: '分享给朋友' },
        ],
        tags: ['咨询行程', '费用说明'],
        inputPlaceholder: '请输入您需要的向导服务'
    },
    '4': { // Alias for Xiao Zhang
        name: '金牌地陪小张',
        role: '私人旅行管家',
        avatar: GuideAvatar,
        location: '全省可达 随时出发',
        intro: '我是您的私人旅行管家，为您定制专属行程，带您体验地道贵州',
        staffTitle: '服务技能',
        staffList: [
            { name: '摄影', role: '技能', desc: '大片拍摄', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Photo' },
            { name: '驾驶', role: '技能', desc: '老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Driver' },
            { name: '急救', role: '技能', desc: '安全保障', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Medic' },
            { name: '方言', role: '技能', desc: '本地通', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Local' },
        ],
        quickActions: [
            { icon: UserCheck, text: '查看个人履历/评价' },
            { icon: Camera, text: '查看旅拍作品集' },
            { icon: Share2, text: '分享给朋友' },
        ],
        tags: ['咨询行程', '费用说明'],
        inputPlaceholder: '请输入您需要的向导服务'
    },
    // Wang Ayi (Chef/Creator) - ID: 104 or 3
    '104': {
        name: '王阿姨辣子鸡',
        role: '地道美食传承人',
        avatar: WangAyiAvatar,
        location: '贵阳 · 老味道',
        intro: '专注贵阳老味道三十年，每一锅辣子鸡都坚持手工炒制，带您找回儿时的记忆',
        staffTitle: '独家秘籍',
        staffList: [
            { name: '选材', role: '秘籍', desc: '跑山鸡', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chicken' },
            { name: '炒制', role: '秘籍', desc: '大火爆炒', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fire' },
            { name: '配料', role: '秘籍', desc: '独家糍粑', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chili' },
            { name: '教学', role: '秘籍', desc: '手把手教', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teach' },
        ],
        quickActions: [
            { icon: Video, text: '观看制作教程' },
            { icon: Utensils, text: '贵州优选' },
            { icon: Share2, text: '分享给馋嘴朋友' },
        ],
        tags: ['购买辣子鸡', '咨询做法'],
        inputPlaceholder: '请输入您想问的美食问题'
    },
    '3': { // Alias for Wang Ayi
        name: '王阿姨辣子鸡',
        role: '地道美食传承人',
        avatar: WangAyiAvatar,
        location: '贵阳 · 老味道',
        intro: '专注贵阳老味道三十年，每一锅辣子鸡都坚持手工炒制，带您找回儿时的记忆',
        staffTitle: '独家秘籍',
        staffList: [
            { name: '选材', role: '秘籍', desc: '跑山鸡', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chicken' },
            { name: '炒制', role: '秘籍', desc: '大火爆炒', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fire' },
            { name: '配料', role: '秘籍', desc: '独家糍粑', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chili' },
            { name: '教学', role: '秘籍', desc: '手把手教', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teach' },
        ],
        quickActions: [
            { icon: Video, text: '观看制作教程' },
            { icon: Utensils, text: '贵州优选' },
            { icon: Share2, text: '分享给馋嘴朋友' },
        ],
        tags: ['购买辣子鸡', '咨询做法'],
        inputPlaceholder: '请输入您想问的美食问题'
    }
  };

  useEffect(() => {
    if (id && agentsConfig[id]) {
        setAgentData(agentsConfig[id]);
    } else {
        // Fallback to Xiao Zhang if ID not found
        setAgentData(agentsConfig['103']); 
    }
  }, [id]);

  const handleInteraction = (text) => {
      // Add user message
      const userMsg = {
          id: Date.now(),
          sender: 'user',
          text: text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      // Simulate Agent Response
      setTimeout(() => {
          setIsTyping(false);
          
          if (text.includes('贵州优选')) {
               // Add intro message
               const introMsg = {
                  id: Date.now() + 1,
                  sender: 'agent',
                  text: '为您精选了以下贵州特色好物，都是地道正宗的伴手礼哦～',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
               };
               setMessages(prev => [...prev, introMsg]);

               // Add Product Card
               setTimeout(() => {
                   const products = [
                        {
                            id: 'prod-1',
                            name: '贵州茅台酒',
                            desc: '酱香型白酒典范',
                            avatar: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?w=300&h=300&fit=crop',
                            type: 'product',
                            role: 'food',
                            rating: 5.0,
                            details: { name: '贵州茅台酒', desc: '53度飞天茅台' },
                            color: 'red'
                        },
                        {
                            id: 'prod-2',
                            name: '都匀毛尖',
                            desc: '中国十大名茶之一',
                            avatar: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=300&h=300&fit=crop',
                            type: 'product',
                            role: 'food',
                            rating: 4.9,
                            details: { name: '都匀毛尖', desc: '明前特级' },
                            color: 'green'
                        },
                        {
                            id: 'prod-3',
                            name: '老干妈风味豆豉',
                            desc: '国民女神，下饭神器',
                            avatar: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=300&h=300&fit=crop',
                            type: 'product',
                            role: 'food',
                            rating: 4.8,
                            details: { name: '老干妈', desc: '风味豆豉油辣椒' },
                            color: 'orange'
                        }
                   ];
                   const prodCard = {
                      id: Date.now() + 2,
                      sender: 'agent',
                      type: 'agent_recommendation',
                      title: '贵州优选好物',
                      agents: products,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                   };
                   setMessages(prev => [...prev, prodCard]);
               }, 800);
          } else {
               // Generic response
               const replyMsg = {
                  id: Date.now() + 1,
                  sender: 'agent',
                  text: `收到您的需求"${text}"，我是${agentData.name}，正在为您处理...`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
               };
               setMessages(prev => [...prev, replyMsg]);
          }
      }, 1000);
  };

  if (!agentData) return null;

  return (
    <div className="h-full w-full bg-slate-50 relative flex flex-col overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-[200px]"
      >
        {/* Header Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-purple-100 via-purple-50/50 to-transparent z-0 pointer-events-none" />

        {/* Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <Menu size={24} className="text-slate-800" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
             <span className="text-xs font-bold text-slate-700">{agentData.staffTitle || '服务团队'}</span>
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
             <h1 className="text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">你好，我是{agentData.name}</h1>
          </div>
        </div>

      {/* Main Service Card */}
      <div className="px-4 relative z-10">
        <div className="bg-white/40 rounded-[1.5rem] p-5 shadow-xl shadow-purple-100/50 border border-white/50 backdrop-blur-xl">
           <div className="flex items-start gap-2 mb-4">
              <div className="w-4 h-4 mt-1 text-purple-500">
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {agentData.intro}
              </p>
           </div>

           {/* Input */}
           <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2 flex-1">
                 <span className="text-sm font-bold text-slate-700 whitespace-nowrap">预约码：</span>
                 <input 
                   type="text" 
                   className="bg-transparent outline-none w-full text-sm font-medium text-slate-800 placeholder-slate-400"
                 />
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-500 font-medium cursor-pointer hover:opacity-80">
                 <span>输入预约码确认行程</span>
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
         {agentData.quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInteraction(action.text)}
              className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm border border-slate-100 text-slate-700 font-medium text-sm"
            >
               <div className="w-5 h-5 flex items-center justify-center text-slate-500">
                  <action.icon size={18} />
               </div>
               {action.text}
            </motion.button>
         ))}
      </div>

        {/* Chat Messages Area */}
        <div className="px-4 mt-6 pb-4 space-y-4 relative z-10">
            {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {/* Message Bubble Logic */}
                   {msg.type === 'agent_recommendation' ? (
                       <div className="w-full max-w-[90%]">
                           <AgentRecommendationCard 
                               title={msg.title} 
                               agents={msg.agents} 
                               onConnect={(agent) => console.log('Connect', agent)} 
                           />
                       </div>
                   ) : (
                       <div className={`p-3 rounded-xl max-w-[80%] text-sm shadow-sm ${msg.sender === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'}`}>
                           {msg.text}
                       </div>
                   )}
                </div>
            ))}
            
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>
      </div>

      {/* Bottom Fixed Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none pb-8">
         {/* Tags */}
         <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide pointer-events-auto">
            {agentData.tags.map((tag, index) => (
                <button 
                  key={index} 
                  onClick={() => handleInteraction(tag)}
                  className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-600 shadow-sm border border-slate-100 whitespace-nowrap active:bg-slate-100 transition-colors"
                >
                   {tag}
                </button>
            ))}
            <div className="ml-auto">
               <button 
                 onClick={() => handleInteraction('私信留言')}
                 className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-purple-500 shadow-sm border border-purple-100 flex items-center gap-1 whitespace-nowrap active:bg-purple-50 transition-colors"
               >
                  <MessageCircle size={12} />
                  私信留言
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
              onKeyDown={(e) => e.key === 'Enter' && inputMessage.trim() && handleInteraction(inputMessage)}
              placeholder={agentData.inputPlaceholder}
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
            />
            <button 
              onClick={() => inputMessage.trim() && handleInteraction(inputMessage)}
              className="w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-purple-600 transition-colors active:scale-95"
            >
               <Send size={16} className={inputMessage ? 'ml-0.5' : ''} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default PersonalAgent;
