import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, MessageCircle, Star, Coffee, Building, Landmark, Mic, Plus, Home as HomeIcon, Compass, UserCircle, X, Check, Bell, Languages, Volume2, ArrowUpRight, Plane, Clock, Sparkles, Camera, Car, Play, Calendar as CalendarIcon, Ticket, Hotel, Utensils, RefreshCcw, ArrowRight, Heart, Send, BadgeCheck, MoreHorizontal, ShoppingBag, Tag } from 'lucide-react';
import { categories } from '../data/agents';
import TuoSaiImage from '../image/huangxiaoxi_new.png';
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
import SpicyChickenVideo from '../video/老奶奶制作辣子鸡视频.mp4';
import MiaoGirlVideo from '../video/苗寨美女打卡视频生成.mp4';

const iconMap = {
  Landmark: Landmark,
  Building: Building,
  Coffee: Coffee,
  User: User,
  Home: HomeIcon
};

const thoughts = [
  "今天去哪儿玩？",
  "附近有什么好吃的？",
  "这家店招牌菜是？",
  "有当地人带玩吗？",
  "找家性价比酒店？",
  "黄果树人多吗？",
  "推荐拍照景点？",
  "找个地方喝咖啡？"
];

const getAiReminder = (node) => {
  if (!node) return "今天天气不错，适合出去走走，记得带上好心情哦～";
  if (node.type === 'flight') return "航班出行请记得携带身份证，提前2小时到达机场安检～";
  if (node.type === 'hotel') return "抵达酒店后可以先休息一下，缓解旅途疲劳再出发～";
  if (node.type === 'food') return "当地美食虽好，也要注意饮食卫生，不要贪吃哦～";
  return "旅途中遇到美景记得拍照留念，记录下这美好的瞬间～";
};



const NewsMarquee = () => {
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
      className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2 shadow-sm border border-white/60 mb-12 active:scale-98 transition-transform"
    >
      <div className="bg-orange-100 p-1 rounded-md">
        <Volume2 size={14} className="text-orange-500" />
      </div>
      <div className="flex-1 h-4 relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-xs text-slate-700 truncate font-medium">
              {news[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
        更多
        <ChevronDown size={10} className="-rotate-90" />
      </div>
    </button>
  );
};

const TypewriterText = ({ text, className, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset immediately when text prop changes
    setDisplayedText('');
    
    // Create a local variable to track the current text content to avoid closure staleness issues
    // although with dependency array [text], the effect re-runs, so index reset is key.
    let currentIndex = 0;
    const currentText = text;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        // Use functional update to append next character safely
        setDisplayedText((prev) => {
           // If we've reached full length, clear interval and return current
           if (prev.length >= currentText.length) {
              clearInterval(interval);
              return prev;
           }
           // Otherwise add the character at the current length position
           // This is safer than relying on an external 'index' variable in some React versions/modes
           return currentText.substring(0, prev.length + 1);
        });
      }, 100);
      
      // Cleanup interval on unmount or dependency change
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span className={className}>{displayedText}</span>;
};

const CouponCountdown = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Set target to end of current day
    const now = new Date();
    const target = new Date(now);
    target.setHours(23, 59, 59, 999);

    const updateTimer = () => {
      const current = new Date();
      const diff = target - current;
      
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    updateTimer(); // Initial call
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono tabular-nums tracking-tight ml-1">{timeLeft}</span>
  );
};

const Home = ({ adoptedTrip, isAuthenticated, onUpdateTrip, toggleBottomNav, onServiceSubmit, onConnectAgent, agentFeedback, merchantMessage, onUserMessage, isHumanMode }) => {
  const [activeRole, setActiveRole] = useState('黄小西');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0); // Add forceUpdate state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialContext, setChatInitialContext] = useState(null);
  const [radarBatchIndex, setRadarBatchIndex] = useState(0);
  const [currentSocialCardIndex, setCurrentSocialCardIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation hook

  const [randomThought, setRandomThought] = useState('');

  useEffect(() => {
    // Pick a random thought on mount
    const randomIndex = Math.floor(Math.random() * thoughts.length);
    setRandomThought(thoughts[randomIndex]);
    
    // Optional: Change thought periodically
    const interval = setInterval(() => {
      // Use functional update to ensure we have access to current randomThought if needed,
      // but here we just pick a random one. To ensure it changes, we can retry if same.
      let nextIndex = Math.floor(Math.random() * thoughts.length);
      // Ensure we don't pick the same one twice in a row for better UX
      setRandomThought(prev => {
         const currentIndex = thoughts.indexOf(prev);
         while (nextIndex === currentIndex && thoughts.length > 1) {
            nextIndex = Math.floor(Math.random() * thoughts.length);
         }
         return thoughts[nextIndex];
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []); // thoughts is now a module-level constant, but including it wouldn't hurt if we want to support HMR updates better

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
      id: 3,
      name: "王阿姨辣子鸡",
      type: "personal",
      cardType: "agent",
      isEnterprise: false,
      desc: "地道贵阳味",
      intro: "专注贵阳老味道三十年，每一锅辣子鸡都坚持手工炒制。我是王阿姨的数字分身，除了帮您预留位置，还能教您地道的吃法，甚至偷偷告诉您这道菜的独家秘方。",
      likes: "2.3k",
      avatar: WangAyiAvatar,
      poster: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop"
    },
    {
      id: 4,
      name: "金牌地陪小张",
      type: "personal",
      cardType: "agent",
      isEnterprise: false,
      desc: "带你玩转贵州",
      intro: "土生土长的贵州通，不带您走马观花，只带您深入苗寨深处、探寻喀斯特秘境。根据您的体力和兴趣，实时调整行程，让每一次出发都成为独家记忆。",
      likes: "5.6k",
      avatar: GuideAvatar,
      poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop"
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
      avatar: PeasantAvatar, // Using existing avatar as placeholder
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
      avatar: MageAvatar, // Using existing avatar as placeholder
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
      avatar: KnightAvatar, // Using existing avatar as placeholder
      poster: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=1200&fit=crop"
    }
  ]);

  useEffect(() => {
    // Load pushed agents from localStorage
    const savedAgents = localStorage.getItem('my_created_agents');
    if (savedAgents) {
        const parsedAgents = JSON.parse(savedAgents);
        const pushedAgents = parsedAgents.filter(a => a.isPushed).map(a => ({
            id: a.id,
            name: a.name,
            type: 'personal', // Assume personal for created agents
            cardType: 'agent',
            isEnterprise: false,
            desc: a.selectedType + ' | ' + ((a.intro || '').substring(0, 10) + '...'),
            intro: a.intro || '',
            likes: '0',
            avatar: a.avatar,
            poster: a.bgImage || "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=1200&fit=crop" // Fallback poster
        }));
        
        if (pushedAgents.length > 0) {
            // Check if already added to avoid duplicates
            setSocialAgents(prev => {
                const existingIds = new Set(prev.map(a => a.id));
                const newAgents = pushedAgents.filter(a => !existingIds.has(a.id));
                return [...newAgents, ...prev];
            });
        }
    }
  }, []);

  const [direction, setDirection] = useState(1);

  // Stack agents for social card
  const stackAgents = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentSocialCardIndex + i) % socialAgents.length;
    stackAgents.push({ ...socialAgents[index], offset: i });
  }

  const handleNextSocialCard = (e) => {
    if (e) e.stopPropagation();
    setDirection(prev => prev * -1);
    setCurrentSocialCardIndex((prev) => (prev + 1) % socialAgents.length);
  };

  const handleSocialCardClick = (agent) => {
    let route = `/agent/personal/${agent.id}`;
    if (agent.type === 'hotel') route = `/agent/hotel/${agent.id}`;
    else if (agent.type === 'scenic') route = `/agent/scenic/${agent.id}`;
    else if (agent.type === 'food') route = `/agent/food/${agent.id}`;
    
    navigate(route);
  };

  // Check for openChatWith in location state on mount
  useEffect(() => {
    // Ensure we start at the top to prevent layout shifts
    window.scrollTo(0, 0);
    
    if (location.state?.openChatWith) {
        handleOpenChat(location.state.openChatWith);
        // Clear state to prevent reopening on refresh (optional but good practice)
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Radar Agent Batches for rotation
  const radarBatches = [
    [
      { img: ScenicAvatar, className: "top-8 right-12 w-8 h-8", delay: '0s' },
      { img: HotelAvatar, className: "bottom-20 left-10 w-6 h-6", delay: '1s' },
      { img: GuideAvatar, className: "top-16 left-1/2 w-7 h-7", delay: '2s' }
    ],
    [
      { img: WangAyiAvatar, className: "top-1/2 right-8 w-7 h-7", delay: '0.5s' },
      { img: CarAvatar, className: "bottom-12 right-1/3 w-6 h-6", delay: '1.5s' },
      { img: MuseumAvatar, className: "top-10 left-12 w-8 h-8", delay: '2.5s' }
    ],
    [
      { img: LiuDaGeAvatar, className: "bottom-8 right-12 w-7 h-7", delay: '0.8s' },
      { img: ScenicAvatar, className: "top-20 left-8 w-6 h-6", delay: '1.2s' },
      { img: HotelAvatar, className: "top-6 right-1/3 w-8 h-8", delay: '1.8s' }
    ]
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarBatchIndex(prev => (prev + 1) % radarBatches.length);
    }, 4000); // Rotate every 4 seconds to match radar scan
    return () => clearInterval(timer);
  }, []);

  // Navigation wrapper to check auth
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

  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full overflow-y-auto scrollbar-hide pb-[240px]">
        <div className="px-6 pt-12 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">你好, <br/>旅行者</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white rounded-blob-2 shadow-sm border border-white/60 flex items-center justify-center text-slate-500 hover:text-cyan-600 transition-colors">
                 <Languages size={20} />
              </button>
              <button 
                onClick={() => handleNav('/message')}
                className="w-10 h-10 bg-white rounded-blob-2 shadow-sm border border-white/60 flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
              >
                <MessageCircle size={20} className="text-slate-700" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
            </div>
          </header>

          {/* News Marquee */}
          <NewsMarquee />



          {/* Typewriter Effect */}
          <div className="mb-2">

          {/* Functional Agents & Chat Input - Moved to Bottom */}
          <section className="mb-0">
             {/* This section is intentionally left empty here as requested, 
                 but typically this content would be moved to the bottom of the page structure.
                 I will place it after the Agent Square Entry. */}
          </section>
          </div>

          {/* Smart Notification Area (Moved) - HIDDEN per user request */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-8 h-[220px]"
          >
            <div className="h-full">
               <AgentListWidget handleOpenChat={handleOpenChat} />
            </div>
          </motion.div> */}

          {/* Agent Square Entry - Replaced with Social Card Stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full mb-20 relative -top-10"
          >
            <div className="rounded-[2rem] p-5 relative overflow-visible h-[420px] flex flex-col">
              {/* Header with Visual Icons (No Text) */}
              <div className="flex justify-between items-center mb-4 relative z-20 shrink-0 px-2">
                  {/* Comic Cloud Bubble Container */}
                   <div className="relative z-30 -translate-x-12 -translate-y-6 scale-90 origin-right">
                     {/* SVG Cloud Shape */}
                     <div className="absolute inset-0 -top-6 -left-6 w-[240px] h-[180px] z-0 pointer-events-none">
                        <svg viewBox="0 0 220 160" className="w-full h-full drop-shadow-xl">
                          <path 
                            d="M45,85 C25,85 15,65 35,45 C35,25 65,5 95,25 C125,5 155,25 155,45 C185,45 195,75 175,95 C185,115 165,135 135,125 L165,155 L125,135 C95,145 65,135 55,115 C35,125 15,105 45,85 Z" 
                            fill="white" 
                            stroke="#334155" 
                            strokeWidth="3" 
                            strokeLinejoin="round" 
                            strokeLinecap="round"
                          />
                        </svg>
                     </div>
                     
                     {/* Bubble Content */}
                       <div className="relative z-10 px-8 py-6 flex items-center justify-center min-w-[160px] min-h-[80px]">
                          <h3 className="text-lg font-bold text-slate-800 text-center leading-snug max-w-[180px] -translate-x-4 translate-y-4 whitespace-pre-wrap break-words">
                            <TypewriterText key={randomThought} text={randomThought} />
                          </h3>
                       </div>
                    
                    {/* Thought Dots connecting to character */}
                    <div className="absolute -right-2 top-0 flex flex-col items-center gap-1 translate-x-full translate-y-2">
                       <div className="w-2 h-2 bg-white rounded-full shadow-sm border border-slate-100"></div>
                       <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm border border-slate-100 translate-x-1"></div>
                       <div className="w-1 h-1 bg-white rounded-full shadow-sm border border-slate-100 translate-x-2"></div>
                    </div>
                  </div>
                  
                  {/* Character Image - Anchored to the right */}
                   <div className="relative w-0 h-0">
                     <div className="absolute -top-28 -right-4 w-48 h-48 pointer-events-none z-[120] translate-x-6">
                        <img 
                          src={TuoSaiImage} 
                         alt="Character" 
                         className="w-full h-full object-contain drop-shadow-lg"
                         style={{ objectPosition: 'bottom' }}
                       />
                    </div>
                  </div>
              </div>

              {/* Stacked Cards Area */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                 <div className="relative w-full h-full max-w-[260px] max-h-[360px] mt-14">
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
                              x: isTop ? 0 : (agent.offset % 2 === 0 ? 25 : -25), // Horizontal offset
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
                            {/* Full Card Content */}
                            <div className="h-full w-full relative cursor-pointer overflow-hidden rounded-[2rem]">
                              {/* Base Background Image (Always rendered as fallback) */}
                              <img 
                                src={agent.poster || agent.avatar} 
                                alt={agent.name} 
                                className="w-full h-full object-cover absolute inset-0" 
                              />

                              {/* Video Overlay (Only if applicable) */}
                              {agent.cardType === 'video' && agent.videoUrl && isTop && (
                                 <video
                                    src={agent.videoUrl}
                                    className="w-full h-full object-cover absolute inset-0 z-10"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                 />
                              )}
                              
                              {/* Gradient Overlay for better text visibility */}
                              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-10" />

                              {/* Right Side Actions (Visual Only) */}
                              <div className="absolute right-3 top-[35%] -translate-y-1/2 flex flex-col gap-3 z-20">
                                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                    <ArrowRight size={18} className="-rotate-45" />
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                    <MessageCircle size={18} />
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                    <MoreHorizontal size={18} />
                                 </div>
                              </div>

                              {/* Bottom Glass Overlay Info - Dynamic Version */}
                              <div className="absolute bottom-2 left-2 right-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white shadow-sm z-20">
                                 
                                 {/* Product Card Layout */}
                                 {agent.cardType === 'product' ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                           <div className="bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                             <ShoppingBag size={10} />
                                             <span className="tracking-wide">人气推荐</span>
                                           </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-0.5">
                                            <h3 className="text-lg font-bold leading-tight text-white shadow-sm line-clamp-1 tracking-tight">{agent.productName}</h3>
                                            <p className="text-[10px] text-white/70 line-clamp-1">{agent.desc}</p>
                                        </div>

                                        <div className="flex items-end justify-between mt-1">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-xs text-orange-200 font-bold">¥</span>
                                                    <span className="text-2xl font-extrabold text-white leading-none tracking-tight">{agent.price}</span>
                                                    <span className="text-[10px] text-white/50 line-through decoration-white/50 ml-0.5">¥{agent.originalPrice}</span>
                                                </div>
                                            </div>
                                            <motion.button 
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg border border-white/20 flex items-center gap-1"
                                            >
                                                立即抢购
                                                <ArrowRight size={10} />
                                            </motion.button>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 pt-2 border-t border-white/10 mt-1">
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shrink-0">
                                                <img src={agent.avatar} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] text-white/80 font-medium truncate">{agent.name}</span>
                                            <div className="ml-auto flex items-center gap-1 text-[10px] text-orange-200">
                                                <Star size={8} fill="currentColor" />
                                                <span>4.9</span>
                                            </div>
                                        </div>
                                    </div>
                                 ) : agent.cardType === 'coupon' ? (
                                    /* Coupon Card Layout */
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                           <div className="bg-red-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                             <Clock size={10} />
                                             <span className="tracking-wide">距结束</span>
                                             <CouponCountdown />
                                           </div>
                                        </div>

                                        <div className="relative bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-200/30 overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50"></div>
                                            <div className="flex items-center justify-between p-3 relative">
                                                {/* Left Punch Hole */}
                                                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rounded-full"></div>
                                                {/* Right Punch Hole */}
                                                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rounded-full"></div>
                                                
                                                <div className="flex flex-col gap-0.5 pl-2">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-extrabold text-white tracking-tight">{agent.discount}</span>
                                                        <span className="text-[10px] text-white/80 font-medium">折扣券</span>
                                                    </div>
                                                    <span className="text-[10px] text-white/60">{agent.condition}</span>
                                                </div>
                                                
                                                <motion.button 
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 py-1 bg-white text-red-600 text-[10px] font-bold rounded-full shadow-sm"
                                                >
                                                    一键领取
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 pt-1">
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shrink-0">
                                                <img src={agent.avatar} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[10px] text-white/90 font-bold truncate">{agent.name}</span>
                                                <span className="text-[9px] text-white/50 truncate">{agent.validity}</span>
                                            </div>
                                        </div>
                                    </div>
                                 ) : agent.cardType === 'video' ? (
                                    /* Video Card Layout */
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 mb-1">
                                           <div className="bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-white/20">
                                             <Play size={8} fill="currentColor" />
                                             {agent.duration}
                                           </div>
                                           <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                                        </div>
                                        <h3 className="text-sm font-bold leading-tight text-white shadow-sm line-clamp-2 mb-1">{agent.videoTitle}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/50">
                                                    <img src={agent.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs font-medium text-white/90">{agent.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-white/80">
                                                <Heart size={10} fill="currentColor" /> {agent.likes}
                                            </div>
                                        </div>
                                    </div>
                                 ) : (
                                    /* Default Agent Layout */
                                    <>
                                        {/* Name & Status Row */}
                                        <div className="flex items-center justify-between">
                                           <div className="flex items-center gap-2">
                                              <h3 className="text-sm font-bold leading-none text-white shadow-sm">{agent.name}</h3>
                                              {agent.isEnterprise && <BadgeCheck size={12} className="text-blue-400" fill="currentColor" stroke="white" />}
                                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></div>
                                           </div>
                                           <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                              <ChevronDown size={12} className="-rotate-90 text-white" />
                                           </div>
                                        </div>
                                        
                                        {/* Description Line */}
                                        <p className="text-[10px] text-white/80 font-medium line-clamp-1 mt-1">{agent.desc}</p>
                                    </>
                                 )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                 </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-center gap-6 absolute -bottom-24 left-0 right-0 z-20">
                 <button 
                   className="w-12 h-12 bg-white rounded-full shadow-[0_8px_20px_rgba(200,200,200,0.2)] text-slate-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-50"
                   onClick={(e) => {
                      e.stopPropagation();
                      // Dislike logic - same effect as next card
                      handleNextSocialCard();
                   }}
                 >
                    <X size={24} />
                 </button>
                 <button 
                   className="w-12 h-12 bg-white rounded-full shadow-[0_8px_20px_rgba(255,100,100,0.15)] text-red-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-50"
                   onClick={(e) => {
                      e.stopPropagation();
                      // Like animation or logic here
                      handleNextSocialCard();
                   }}
                 >
                    <Heart size={24} fill="currentColor" className="text-red-500" />
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Input & Functional Agents - Fixed to Bottom */}
      <div className="absolute bottom-24 left-0 right-0 z-30 px-6 pointer-events-none">
         {/* Functional Agents as Capsule Buttons (Scrollable Row) */}
         <div className="w-full overflow-x-auto scrollbar-hide mb-3 -mx-2 px-2 pointer-events-auto">
           <div className="flex gap-2 min-w-max justify-center">
             {[
               { name: '行程规划', icon: MapPin },
               { name: '帮我写游记', icon: HomeIcon },
               { name: 'AI伴游', icon: User },
             ].map((agent, index) => (
               <motion.button 
                 key={index}
                 whileTap={{ scale: 0.95 }}
                 onClick={handleOpenChat}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-slate-100 text-slate-600 whitespace-nowrap"
               >
                 <agent.icon size={12} className="text-cyan-500" />
                 <span className="text-[10px] font-bold">{agent.name}</span>
               </motion.button>
             ))}
           </div>
         </div>

         {/* Integrated Chat Input Area */}
         <div className="w-full relative flex justify-center pointer-events-auto">
           <motion.div 
                layoutId="input-container"
                className="bg-white/95 backdrop-blur-md rounded-full py-2.5 px-4 shadow-xl shadow-slate-200/40 flex items-center gap-3 border border-slate-50 cursor-pointer hover:shadow-2xl transition-shadow w-full max-w-[320px]"
                onClick={handleOpenChat}
           >
             <input 
               type="text" 
               placeholder="请输入您感兴趣的主题..." 
               className="bg-transparent outline-none w-full text-slate-700 placeholder-slate-400 text-sm pl-1 cursor-pointer"
               readOnly
             />
             
             <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
               <ArrowUpRight size={16} />
             </div>
           </motion.div>
         </div>
      </div>

      {/* Role Selector Action Sheet - Fixed to Viewport */}
      <AnimatePresence>
        {showRoleSelector && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowRoleSelector(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 z-50 pb-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">切换对话智能体</h3>
                <button onClick={() => setShowRoleSelector(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div 
                    key={role}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${activeRole === role ? 'bg-cyan-50 border border-cyan-100' : 'bg-slate-50 border border-slate-100'}`}
                    onClick={() => {
                      setActiveRole(role);
                      setShowRoleSelector(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${activeRole === role ? 'bg-cyan-500' : 'bg-slate-300'}`}>
                        {role[0]}
                      </div>
                      <span className={`font-medium ${activeRole === role ? 'text-cyan-700' : 'text-slate-700'}`}>{role}</span>
                    </div>
                    {activeRole === role && <Check size={20} className="text-cyan-500" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Start Trip Modal */}
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

const AgentListWidget = ({ handleOpenChat }) => {
  const [displayedAgents, setDisplayedAgents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allAgents = [
    { 
      name: "景区向导", 
      role: "景区", 
      services: ["导览", "购票"],
      color: "green", 
      avatar: ScenicAvatar,
      desc: "黄果树瀑布",
      type: "enterprise",
      intro: "作为黄果树景区的官方数字大使，我承载着传播喀斯特自然美学的使命。致力于为您提供最权威的景观解读与最贴心的游览指引，让世界看见贵州山水的波澜壮阔。"
    },
    { 
      name: "酒店管家", 
      role: "酒店", 
      services: ["订房", "导航"],
      color: "indigo", 
      avatar: HotelAvatar,
      desc: "亚朵酒店",
      type: "enterprise",
      intro: "传承亚朵“温暖、人文、邻里”的企业文化，我们不仅仅提供住宿，更致力于打造旅途中的精神休憩空间。以标准化的极致服务，为您呈现触手可及的温暖与关怀。"
    },
    { 
      name: "交通调度", 
      role: "交通", 
      services: ["接机", "包车"],
      color: "blue", 
      avatar: CarAvatar,
      desc: "小车小团",
      type: "enterprise",
      intro: "严格遵循企业级安全运营标准，我们的车队代表着行业标杆。以准时、专业、规范的服务流程，为您每一次的出行保驾护航，传递安全至上的企业价值观。"
    },
    {
      name: "金牌地陪",
      role: "地陪",
      services: ["包车", "定制"],
      color: "teal", 
      avatar: GuideAvatar,
      desc: "地陪小张",
      type: "personal",
      intro: "我是主理人小张，一个不爱走寻常路的贵州土著。拒绝千篇一律的打卡，我将用我的私人视角，带您深入那些只有本地人才知道的隐秘角落，体验最纯粹的在地生活。"
    },
    {
      name: "美食店长",
      role: "餐饮",
      services: ["排队", "点餐"],
      color: "orange", 
      avatar: WangAyiAvatar,
      desc: "王阿姨辣子鸡",
      type: "personal",
      intro: "我是王阿姨，这家店就是我的名片。三十年来，我坚持亲自选材、亲自掌勺，只为了守住记忆中的老味道。在这里，您吃到的每一口辣子鸡，都是我个人品牌的信誉保证。"
    },
    {
      name: "美食店长",
      role: "餐饮",
      services: ["排队", "点餐"],
      color: "orange", 
      avatar: LiuDaGeAvatar,
      desc: "刘大哥烤鱼",
      type: "personal",
      intro: "我是老刘，烤鱼不仅是我的生意，更是我的作品。从选鱼到炭火的把控，我都亲力亲为。欢迎来到我的美食江湖，感受我对烧烤艺术的独特理解与执着追求。"
    },
    {
      name: "展馆讲解",
      role: "展馆",
      services: ["预约", "讲解"],
      color: "purple", 
      avatar: MuseumAvatar,
      desc: "贵州省博物馆",
      type: "enterprise",
      intro: "肩负着守护与传承贵州历史文化的重任，作为官方智能讲解员，我将带您穿越时光长河，感受每一件文物背后的文明脉动，弘扬中华优秀传统文化。"
    }
  ];

  useEffect(() => {
    // Show current agent
    setDisplayedAgents([allAgents[currentIndex]]);
  }, [currentIndex]);

  const handleRefresh = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % allAgents.length);
    setRefreshKey(prev => prev + 1);
  };


  return (
  <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 h-full flex flex-col overflow-hidden">
    <div className="flex items-center justify-between mb-2 px-1 shrink-0">
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
          <MapPin size={10} className="text-cyan-600" />
        </div>
        <h3 className="text-xs font-bold text-slate-800">为您推荐</h3>
      </div>
      <button onClick={handleRefresh} className="flex items-center gap-0.5 text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full hover:bg-slate-100 transition-colors whitespace-nowrap">
        <RefreshCcw size={8} />
        换
      </button>
    </div>
    
    <div className="flex-1 flex items-center justify-center px-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={refreshKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {displayedAgents.map((agent, i) => (
            <div 
              key={i} 
              className="flex items-center h-full cursor-pointer group relative overflow-visible gap-3"
              onClick={() => handleOpenChat(agent)}
            >
              {/* Large Avatar - Left Side */}
              <div className="w-[120px] h-full relative flex items-center justify-center rounded-xl overflow-hidden shrink-0 py-1">
                 <img 
                    src={agent.avatar} 
                    alt={agent.name} 
                    className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-105 duration-500" 
                    style={{ 
                      objectPosition: agent.objectPosition || 'center top',
                      transform: agent.scale ? `scale(${agent.scale})` : undefined
                    }}
                 />
                 {/* Decorative Overlay Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 opacity-80 rounded-xl pointer-events-none" />
              </div>

              {/* Info Section - Right Side */}
              <div className="flex-1 flex flex-col items-start justify-center gap-1.5 relative z-20 h-full py-1">
                 <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-0.5">
                       <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{agent.desc}</h4>
                       <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border whitespace-nowrap ${
                         agent.type === 'enterprise' 
                           ? 'bg-blue-50 text-blue-600 border-blue-100' 
                           : 'bg-orange-50 text-orange-600 border-orange-100'
                       }`}>
                         {agent.type === 'enterprise' ? '企业' : '个人'}
                       </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                      {agent.name}
                      <span className={`w-1.5 h-1.5 rounded-full bg-${agent.color}-500 inline-block`} />
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap justify-start gap-1.5 w-full">
                    {agent.services.map((tag, idx) => (
                       <span key={idx} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg leading-tight border border-slate-100 shadow-sm whitespace-nowrap">
                          {tag}
                       </span>
                    ))}
                 </div>
                 
                 <div className="mt-auto w-full pt-1">
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {agent.intro || `我是您的专属${agent.role}助手，随时为您提供专业的服务与建议。`}
                    </p>
                  </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Footer Link */}
    <div className="mt-2 pt-2 border-t border-slate-50 shrink-0">
      <button className="w-full py-1.5 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-cyan-100 hover:from-cyan-50 hover:to-white flex items-center justify-center gap-1 group transition-all duration-300 shadow-sm active:scale-95">
        <span className="text-[10px] font-bold text-slate-500 group-hover:text-cyan-600 transition-colors">前往智能体广场</span>
        <ArrowRight size={10} className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
  );
};

const PromoCarouselWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const promos = [
    { 
      title: "亚朵酒店·早餐券", 
      desc: "住客专享 ¥38", 
      image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop",
      tag: "限时抢"
    },
    { 
      title: "老凯里·酸汤鱼", 
      desc: "100元代金券", 
      image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800&auto=format&fit=crop",
      tag: "8.5折"
    },
    { 
      title: "黄果树·VIP通道", 
      desc: "免排队入园", 
      image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=800&auto=format&fit=crop",
      tag: "热门"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-[2rem] p-3 shadow-lg border border-slate-100 h-full flex flex-col relative overflow-hidden">
       <div className="flex items-center justify-between mb-1.5 px-1 relative z-10 shrink-0">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
             <Sparkles size={10} className="text-yellow-500" />
             特惠服务
          </h3>
       </div>
       
       <div className="flex-1 relative rounded-xl overflow-hidden min-h-0 group cursor-pointer">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="absolute inset-0"
             >
                <img 
                  src={promos[currentIndex].image} 
                  alt={promos[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                   <div className="flex items-start justify-between mb-0.5">
                      <h4 className="font-bold text-xs leading-tight shadow-sm">{promos[currentIndex].title}</h4>
                      <span className="text-[8px] font-bold bg-yellow-500 text-yellow-950 px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
                        {promos[currentIndex].tag}
                      </span>
                   </div>
                   <p className="text-[9px] opacity-90 font-medium text-slate-200">{promos[currentIndex].desc}</p>
                </div>
             </motion.div>
          </AnimatePresence>
          
          {/* Indicators */}
          <div className="absolute top-2 right-2 flex gap-0.5 z-10">
             {promos.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full transition-all shadow-sm ${i === currentIndex ? 'bg-white w-2.5' : 'bg-white/40'}`} 
                />
             ))}
          </div>
       </div>
    </div>
  );
};

const AgentCategoryCard = ({ title, subtitle, icon: Icon, image, index, onClick }) => {
  // Different shapes for masonry feel
  const shapes = [
    'rounded-tr-[3rem] rounded-bl-[2rem] rounded-tl-2xl rounded-br-xl', 
    'rounded-tl-[3rem] rounded-br-[2rem] rounded-tr-2xl rounded-bl-xl',
    'rounded-br-[3rem] rounded-tl-[2rem] rounded-tr-xl rounded-bl-2xl',
    'rounded-bl-[3rem] rounded-tr-[2rem] rounded-tl-xl rounded-br-2xl'
  ];
  
  const heightClass = index % 2 === 0 ? 'h-56' : 'h-48';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative overflow-hidden break-inside-avoid mb-4 flex flex-col justify-end group cursor-pointer shadow-sm transition-shadow ${shapes[index % 4]} ${heightClass}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      
      <div className="relative z-10 p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
            {index + 12} Agents
          </span>
        </div>
        <h4 className="text-lg font-bold leading-tight mb-0.5">{title}</h4>
        <p className="text-[10px] text-white/80 line-clamp-1">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default Home;
