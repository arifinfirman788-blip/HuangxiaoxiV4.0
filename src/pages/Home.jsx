import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, MessageCircle, Star, Coffee, Building, Landmark, Mic, Plus, Home as HomeIcon, Compass, UserCircle, X, Check, Bell, Languages, Volume2, ArrowUpRight, Plane, Clock, Sparkles, Camera, Car, Play, Calendar as CalendarIcon, Ticket, Hotel, Utensils, RefreshCcw, ArrowRight, Heart, Send, BadgeCheck, MoreHorizontal, ShoppingBag, Tag, Map, AlertCircle, CloudRain, Sun, Wind, ChevronRight } from 'lucide-react';
import { categories } from '../data/agents';
import TuoSaiImage from '../image/huangxiaoxi_new.png';
import RunningImage from '../image/张手跑_1.png';
import FlipCountdown from '../components/FlipCountdown';
import ChatInterface from '../components/ChatInterface';
import { getPlaceholder } from '../utils/imageUtils';

// Import cropped avatars
import PeasantAvatar from '../image/avatars/peasant.png';
import KnightAvatar from '../image/avatars/knight.png';
import MageAvatar from '../image/avatars/mage.png';
import ThreeAgentsImage from '../image/fJOIb6mhE.jpeg';
import MiaoImage from '../image/2637eb7d29330ff3adc0baaa3799f915.png';
import MuseumAvatar from '../image/bowuguan.png';
import WangAyiAvatar from '../image/wangayi.png';
import LiuDaGeAvatar from '../image/liudage.png';
import HotelAvatar from '../image/jiudian.png';
import GuideAvatar from '../image/daoyou.png';
import CarAvatar from '../image/zhuanche.png';
import ScenicAvatar from '../image/huangguoshu.png';
import SpicyChickenVideo from '../video/spicy_chicken.mp4';
import MiaoGirlVideo from '../video/miao_girl.mp4';

const filters = [
    { id: 'all', label: '精选', icon: Sparkles },
    { id: 'scenic', label: '景点', icon: Camera },
    { id: 'food', label: '美食', icon: Utensils },
    { id: 'hotel', label: '酒店', icon: Hotel },
    { id: 'transport', label: '交通', icon: Car },
    { id: 'guide', label: '向导', icon: User },
];

const NewsMarquee = ({ className }) => {
  const navigate = useNavigate();
  const news = [
    "贵州文旅优惠季开启，百家景区半价游",
    "黄果树瀑布迎来最佳观赏期，水量充沛",
    "遵义市发布低温凝冻黄色预警，请注意防范"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <button 
      onClick={() => navigate('/news')}
      className={`bg-white/80 backdrop-blur-md rounded-full py-1.5 px-3 flex items-center gap-2 shadow-sm border border-slate-100 active:scale-98 transition-transform w-full max-w-[280px] mx-auto ${className}`}
    >
      <div className="bg-indigo-100 p-1 rounded-full shrink-0">
        <Volume2 size={12} className="text-indigo-600" />
      </div>
      <div className="flex-1 h-4 relative overflow-hidden text-left">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-[10px] text-slate-600 truncate font-medium block w-full">
              {news[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <ChevronRight size={12} className="text-slate-400 shrink-0" />
    </button>
  );
};

// ... (keep TypewriterText and CouponCountdown as is)

const Home = ({ adoptedTrip, isAuthenticated, onUpdateTrip, toggleBottomNav, onServiceSubmit, onConnectAgent, agentFeedback, merchantMessage, onUserMessage, isHumanMode }) => {
  const [activeRole, setActiveRole] = useState('黄小西');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialContext, setChatInitialContext] = useState(null);
  const [currentSocialCardIndex, setCurrentSocialCardIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isTripExpanded, setIsTripExpanded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Mock Agents for Social Card
  const [socialAgents, setSocialAgents] = useState([
    {
      id: 9,
      name: "贵州饭店迎宾楼",
      type: "hotel",
      cardType: "agent",
      isEnterprise: true,
      desc: "高端商务宴请",
      intro: "贵州饭店迎宾楼，承载着贵州的历史与荣耀。为您提供私密尊贵的包房服务，地道的黔菜佳肴，是您商务宴请、家庭聚会的首选之地。",
      likes: "3.8k",
      avatar: HotelAvatar,
      poster: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=1200&fit=crop",
      customServices: ['订包房', '看环境']
    },
    {
      id: 101,
      name: "老凯里酸汤鱼",
      type: "food",
      cardType: "product",
      isEnterprise: true,
      productName: "招牌酸汤鱼双人餐",
      price: "168",
      originalPrice: "288",
      desc: "酸辣鲜香 地道风味",
      intro: "精选野生江团，搭配秘制红酸汤，酸爽开胃，鱼肉鲜嫩滑爽。套餐包含：酸汤鱼1份、时蔬拼盘1份、主要特色小吃2份。",
      likes: "500+",
      avatar: HotelAvatar,
      poster: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=1200&fit=crop"
    },
    {
      id: 102,
      name: "黄果树瀑布智能体",
      type: "scenic",
      cardType: "coupon",
      isEnterprise: true,
      discount: "8.5折",
      condition: "门票+观光车套票",
      validity: "有效期至2024-12-31",
      desc: "限时特惠 畅游景区",
      intro: "领取优惠券，一站式搞定门票和观光车，省心又省钱。适用范围：黄果树大瀑布景区、陡坡塘景区、天星桥景区。",
      likes: "2.1k",
      avatar: ScenicAvatar,
      poster: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=1200&fit=crop"
    },
    {
      id: 104,
      name: "王阿姨辣子鸡",
      type: "personal",
      cardType: "video",
      videoTitle: "正宗贵阳辣子鸡制作过程",
      duration: "0:30",
      videoUrl: SpicyChickenVideo,
      desc: "看王阿姨如何炒制地道辣子鸡",
      intro: "选用跑山鸡，搭配独家秘制糍粑辣椒，大火爆炒，香辣入味。每一口都是老贵阳的记忆。",
      likes: "3.2k",
      avatar: WangAyiAvatar,
      poster: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop"
    },
    {
      id: 103,
      name: "金牌地陪小张",
      type: "personal",
      cardType: "video",
      videoTitle: "沉浸式苗寨一日游",
      duration: "0:45",
      videoUrl: MiaoGirlVideo,
      desc: "带你走进苗寨深处",
      intro: "跟随镜头，一起走进西江千户苗寨，感受吊脚楼的建筑智慧，体验长桌宴的热情，聆听芦笙场的悠扬旋律。",
      likes: "1.5w",
      avatar: GuideAvatar,
      poster: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=1200&fit=crop"
    },
    {
      id: 1,
      name: "黄果树瀑布智能体",
      type: "scenic",
      cardType: "agent",
      isEnterprise: true,
      desc: "全天候景区导览",
      intro: "作为黄果树景区官方智能体，我接入了景区实时监控系统，能为您提供精准的瀑布水量预报、最佳观赏点推荐及客流避峰指南，助您捕捉最壮观的自然瞬间。",
      likes: "1.2w",
      avatar: ScenicAvatar,
      poster: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=1200&fit=crop"
    },
    {
      id: 2,
      name: "亚朵酒店管家",
      type: "hotel",
      cardType: "agent",
      isEnterprise: true,
      desc: "24h贴心服务",
      intro: "您的全天候私人管家，不仅可以一键调节客房环境，还能为您预约深夜食堂的暖心夜宵。连接社区文化，为您推荐周边最地道的城市漫步路线。",
      likes: "8.5k",
      avatar: HotelAvatar,
      poster: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop"
    },
    {
      id: 6,
      name: "苗族蜡染传承人",
      type: "culture",
      cardType: "agent",
      isEnterprise: false,
      desc: "非遗文化体验",
      intro: "我是阿朵，生在苗寨长在苗寨。我想带您体验亲手画蜡、浸染的乐趣，听我讲讲那些藏在蓝白花纹里的古老传说，感受指尖上的非遗魅力。",
      likes: "9.8k",
      avatar: PeasantAvatar, 
      poster: MiaoImage
    },
    {
      id: 7,
      name: "风光摄影师阿杰",
      type: "photo",
      cardType: "agent",
      isEnterprise: false,
      desc: "旅拍/无人机跟拍",
      intro: "专注贵州山水摄影十年，我知道哪里有最美的日出云海，哪里能拍出绝美的梯田光影。带上我，您的朋友圈将被大片刷屏。",
      likes: "4.5k",
      avatar: MageAvatar,
      poster: "https://images.unsplash.com/photo-1500322969630-a26ab6eb64cc?w=800&h=1200&fit=crop"
    },
    {
      id: 8,
      name: "侗族大歌传唱人",
      type: "culture",
      cardType: "agent",
      isEnterprise: false,
      desc: "聆听天籁之音",
      intro: "侗族大歌是世界非物质文化遗产，无需指挥，自然和声。来我的家乡，坐在鼓楼下，闭上眼，让我带您聆听这来自灵魂深处的天籁之音。",
      likes: "7.2k",
      avatar: KnightAvatar,
      poster: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=1200&fit=crop"
    }
  ]);

  // Filter agents based on activeFilter
  const filteredAgents = activeFilter === 'all' 
    ? socialAgents 
    : socialAgents.filter(agent => agent.type === activeFilter || (activeFilter === 'guide' && agent.type === 'personal'));

  useEffect(() => {
    // Reset index when filter changes to avoid out of bounds
    setCurrentSocialCardIndex(0);
  }, [activeFilter]);

  useEffect(() => {
    // Load pushed agents from localStorage
    const savedAgents = localStorage.getItem('my_created_agents');
    if (savedAgents) {
        const parsedAgents = JSON.parse(savedAgents);
        const pushedAgents = parsedAgents.filter(a => a.isPushed).map(a => ({
            id: a.id,
            name: a.name,
            type: 'personal',
            cardType: 'agent',
            isEnterprise: false,
            desc: a.selectedType + ' | ' + ((a.intro || '').substring(0, 10) + '...'),
            intro: a.intro || '',
            likes: '0',
            avatar: a.avatar,
            poster: a.bgImage || "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=1200&fit=crop"
        }));
        
        if (pushedAgents.length > 0) {
            setSocialAgents(prev => {
                const existingIds = new Set(prev.map(a => a.id));
                const newAgents = pushedAgents.filter(a => !existingIds.has(a.id));
                return [...newAgents, ...prev];
            });
        }
    }
  }, []);

  const [direction, setDirection] = useState(1);

  // Stack agents for social card - using filtered list
  const stackAgents = [];
  const displayList = filteredAgents.length > 0 ? filteredAgents : socialAgents;
  
  for (let i = 0; i < 3; i++) {
    const index = (currentSocialCardIndex + i) % displayList.length;
    if (displayList[index]) {
        stackAgents.push({ ...displayList[index], offset: i });
    }
  }

  const handleNextSocialCard = (e) => {
    if (e) e.stopPropagation();
    setDirection(prev => prev * -1);
    setCurrentSocialCardIndex((prev) => (prev + 1) % displayList.length);
  };

  const handleSocialCardClick = (agent) => {
    let route = `/agent/personal/${agent.id}`;
    if (agent.type === 'hotel') route = `/agent/hotel/${agent.id}`;
    else if (agent.type === 'scenic') route = `/agent/scenic/${agent.id}`;
    else if (agent.type === 'food') route = `/agent/food/${agent.id}`;
    navigate(route);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.openChatWith) {
        handleOpenChat(location.state.openChatWith);
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleNav = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };

  const handleOpenChat = (context = null) => {
    setChatInitialContext(context);
    setIsChatOpen(true);
    if (toggleBottomNav) toggleBottomNav(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    if (toggleBottomNav) toggleBottomNav(true);
  };

  const handleStartTrip = () => {
    if (!tempStartDate) return;
    const date = new Date(tempStartDate);
    if (date <= new Date()) {
        alert("请选择当前时间之后的时间");
        return;
    }
    onUpdateTrip({ startTime: date.toISOString() });
    setIsStartModalOpen(false);
  };

  const roles = ['黄小西', '酒店助手', '景区向导', '美食专家', '政务助手'];

  // --- NEW: Trip Reminder Logic ---
  const activeTripNode = adoptedTrip?.itinerary?.flatMap(day => day.timeline)?.[0]; // Just getting first for demo, usually calculate based on time
  const hasTrip = !!adoptedTrip;

  return (
    <div className="h-full w-full relative bg-slate-50">
      <div className="h-full w-full overflow-hidden pb-[240px]">
        <div className="px-6 pt-12 relative z-10">
          {/* Header Area */}
          <header className="relative z-50 mb-2 h-[150px]">
            {/* Independent IP Character Layer */}
            <motion.div
                layout
                className="absolute z-30 top-0 left-1/2 transform -translate-x-1/2"
                initial={false}
                animate={{
                    left: isTripExpanded ? '0%' : '50%',
                    x: isTripExpanded ? '5px' : '-50%',
                    y: isTripExpanded ? '25px' : '20px',
                    width: isTripExpanded ? 130 : 120,
                    height: isTripExpanded ? 130 : 120,
                }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
                <AnimatePresence mode="wait">
                    <motion.img 
                        key={isTripExpanded ? 'running' : 'normal'}
                        src={isTripExpanded ? RunningImage : TuoSaiImage}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        alt="IP" 
                        className="w-full h-full object-contain filter drop-shadow-xl" 
                    />
                </AnimatePresence>
            </motion.div>

            {/* Content Layer */}
            <AnimatePresence mode="wait">
              {!isTripExpanded ? (
                <motion.div 
                    key="default-text"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="absolute top-0 right-1/2 h-[150px] flex flex-col justify-center items-end pr-[70px]"
                >
                    <div className="text-right relative z-20">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">黄小西</h1>
                        <p className="text-xs text-slate-400 font-medium">您的AI文旅助手</p>
                    </div>
                </motion.div>
              ) : (
                <motion.div
                    key="trip-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-0 top-3 left-[60px] bottom-6 py-2"
                >
                    <div className="bg-white/95 backdrop-blur-xl rounded-[1.5rem] p-3 pl-8 shadow-2xl border border-slate-100 h-full flex flex-col relative overflow-hidden">
                        {/* Header: Title + Status */}
                        <div className="flex items-center justify-between mb-2 relative z-10 pr-6">
                             <div className="flex items-center gap-2 min-w-0">
                                 <h3 className="font-black text-sm text-slate-800 truncate">
                                    {activeTripNode?.title || '入住·贵阳大十字亚朵酒店'}
                                 </h3>
                                 <span className="bg-indigo-100 text-indigo-600 text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0">
                                    进行中
                                 </span>
                             </div>
                        </div>

                        {/* Middle: Icon + Details */}
                        <div className="flex items-start gap-2 mb-2 relative z-10">
                             {/* Icon Box */}
                             <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 text-indigo-500">
                                <Hotel size={20} />
                             </div>
                             
                             {/* Details */}
                             <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-700">
                                        14:00后入住
                                    </span>
                                    <span className="text-[10px] text-slate-500 truncate">
                                        几木大床房
                                    </span>
                                </div>
                                <div className="flex gap-1 flex-wrap">
                                    {['健身房', '洗衣房', '深夜粥到'].map(tag => (
                                        <span key={tag} className="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {/* Bottom: Assistant Message REMOVED for compact view */}
                        
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        {/* Close Button */}
                        <button 
                            onClick={() => setIsTripExpanded(false)}
                            className="absolute top-2 right-2 w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 z-20 active:scale-90"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Side Trip Button (Collapsed State) */}
            <AnimatePresence>
                {!isTripExpanded && (
                    <motion.button 
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        exit={{ x: 100 }}
                        onClick={() => setIsTripExpanded(true)}
                        className="absolute right-[-24px] top-10 bg-white/90 backdrop-blur-md shadow-lg border-y border-l border-slate-100 rounded-l-full py-2 pl-3 pr-4 flex items-center gap-2 active:scale-95 transition-transform group z-40"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">TRIP</span>
                            <span className="text-xs font-black text-slate-800 leading-none mt-0.5">行程</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center relative shadow-inner">
                            <MapPin size={14} />
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
          </header>

          {/* News Marquee */}
          <div className={`mb-6 flex justify-center relative z-40 transition-all duration-300 ${isTripExpanded ? 'mt-4' : '-mt-8'}`}>
            <NewsMarquee />
          </div>

          {/* Filter Tabs */}
          <div className="w-full overflow-x-auto scrollbar-hide mb-6 -mx-6 px-6 relative z-30">
            <div className="flex gap-4 min-w-max">
                {filters.map(filter => {
                    const isActive = activeFilter === filter.id;
                    const Icon = filter.icon;
                    return (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`flex flex-col items-center gap-1.5 min-w-[50px] transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-80'}`}
                        >
                            <span className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                                {filter.label}
                            </span>
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTabIndicator"
                                    className="w-4 h-1 bg-slate-800 rounded-full"
                                />
                            )}
                        </button>
                    )
                })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full relative min-h-[420px]">
             {/* TRIP REMINDER CARD REMOVED */}

             {/* AGENT/SOCIAL CARD STACK */}
             <motion.div
                className={`w-full relative z-20 transition-all duration-300 ${isTripExpanded ? '-mt-12' : 'mt-0'}`}
                animate={{ 
                    scale: 1,
                    opacity: 1,
                    y: 0
                }}
             >
                {/* Agent Card Stack Implementation */}
                <div className="relative w-full h-[340px] flex items-center justify-center mt-4">
                    <AnimatePresence mode="popLayout">
                      {stackAgents.reverse().map((agent) => {
                        const isTop = agent.offset === 0;
                        return (
                          <motion.div
                            key={`${agent.id}-${agent.offset}`}
                            className="absolute inset-0 bg-slate-900 rounded-[2rem] overflow-hidden origin-bottom border-[3px] border-white shadow-2xl"
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ 
                              scale: 1 - agent.offset * 0.05, 
                              y: agent.offset * 20,
                              x: isTop ? 0 : (agent.offset % 2 === 0 ? 25 : -25),
                              opacity: 1 - agent.offset * 0.1,
                              zIndex: 100 - agent.offset,
                              rotate: isTop ? 0 : (agent.offset % 2 === 0 ? 2 : -2)
                            }}
                            exit={{ x: direction * 300, opacity: 0, rotate: direction * 20 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            drag={isTop ? "x" : false} 
                            dragConstraints={{ left: -100, right: 100 }}
                            onDragEnd={(e, { offset }) => {
                              if (Math.abs(offset.x) > 100) {
                                handleNextSocialCard();
                              }
                            }}
                            onClick={() => isTop && handleSocialCardClick(agent)}
                          >
                            {/* Card Content (Same as before) */}
                            <div className="h-full w-full relative cursor-pointer overflow-hidden rounded-[2rem]">
                              <img 
                                src={agent.poster || agent.avatar} 
                                alt={agent.name} 
                                className="w-full h-full object-cover absolute inset-0" 
                              />
                              {/* ... (Rest of card content) ... */}
                              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-10" />
                              
                              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
                                 <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
                                 <p className="text-sm opacity-80 line-clamp-2">{agent.intro}</p>
                                 <div className="flex items-center gap-2 mt-3">
                                     <div className="px-2 py-1 bg-white/20 rounded-lg text-xs backdrop-blur-md">
                                        {agent.type === 'food' ? '美食' : agent.type === 'hotel' ? '酒店' : '景点'}
                                     </div>
                                     <div className="flex items-center gap-1 text-xs opacity-80">
                                         <Heart size={12} fill="currentColor" /> {agent.likes}
                                     </div>
                                 </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                </div>
             </motion.div>
          </div>

        </div>
      </div>

      {/* Chat Input Area (Fixed Bottom) */}
      <div className="absolute bottom-24 left-0 right-0 z-30 px-6 pointer-events-none">


         <div className="w-full relative flex justify-center pointer-events-auto">
           <motion.div 
                layoutId="input-container"
                className="bg-white/95 backdrop-blur-md rounded-full py-2.5 px-4 shadow-xl shadow-slate-200/40 flex items-center gap-3 border border-slate-50 cursor-pointer hover:shadow-2xl transition-shadow w-full max-w-[320px]"
                onClick={handleOpenChat}
           >
             <input 
               type="text" 
               placeholder="给黄小西布置一个任务..." 
               className="bg-transparent outline-none w-full text-slate-700 placeholder-slate-400 text-sm pl-1 cursor-pointer"
               readOnly
             />
             
             <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
               <Plus size={16} />
             </div>
           </motion.div>
         </div>
      </div>

      {/* ... (Keep Role Selector, Start Modal, Chat Interface) ... */}
      <AnimatePresence>
        {isStartModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsStartModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative z-10 shadow-2xl"
            >
              <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                    <CalendarIcon size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">设置行程开始时间</h2>
                 <p className="text-sm text-slate-500 mt-2">请选择您的出发时间，我们将为您开启行程倒计时</p>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">选择日期与时间</label>
                    <input 
                      type="datetime-local" 
                      className="w-full bg-transparent text-lg font-bold text-slate-800 outline-none"
                      onChange={(e) => setTempStartDate(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsStartModalOpen(false)}
                   className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 active:scale-95 transition-transform"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleStartTrip}
                   disabled={!tempStartDate}
                   className="flex-1 py-3.5 rounded-xl font-bold text-white bg-cyan-500 shadow-lg shadow-cyan-200 active:scale-95 transition-transform disabled:opacity-50 disabled:shadow-none"
                 >
                   确认开启
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
           <ChatInterface 
              onClose={handleCloseChat}
              initialContext={chatInitialContext}
              onAdoptTrip={(trip) => {
                 onUpdateTrip(trip);
                 handleCloseChat();
              }}
              onServiceSubmit={onServiceSubmit}
              onConnectAgent={onConnectAgent}
              agentFeedback={agentFeedback}
              merchantMessage={merchantMessage}
              onUserMessage={onUserMessage}
              isHumanMode={isHumanMode}
           />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
