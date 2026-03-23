import React, { useState, useEffect } from 'react';
import { MapPin, Volume2, Send, Heart, ChevronRight, Languages, X, AlertTriangle, Sun, Calendar, Camera, Hotel, Wifi, Utensils, Navigation, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Trip } from '../types';

type NotificationType = 'welcome' | 'morning' | 'tomorrow' | 'park_entry' | 'park_companion' | 'hotel_before' | 'hotel_during' | 'food' | 'warning';

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  actionText?: string;
  actions?: string[];
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'warning', title: '紧急预警', text: '【黄小西紧急预警】贵阳发布大风预警，建议暂缓游览，小西已查好避雨点。', actionText: '查询近三天天气 >' },
  { id: 'n2', type: 'welcome', title: '欢迎语', text: '我是黄小西！带你玩转贵州。行程大纲：Day1:贵阳；Day2:安顺(黄果树)；Day3:返程。准备出发吗？', actionText: '查看行程详情预览 >' },
  { id: 'n3', type: 'morning', title: '早间唤醒', text: '早安！今天贵阳阳光明媚，出门带好充电宝，行程满满别累着。', actionText: '查询今天天气 >' },
  { id: 'n4', type: 'tomorrow', title: '明日预告', text: '明天去黄果树瀑布，路陡记得换防滑鞋！走侧门人少，快很多喔。', actionText: '查询明天天气 >' },
  { id: 'n5', type: 'park_entry', title: '入园必看', text: '离青岩古镇还有半小时。提前拿出身份证刷卡入园，别排长队咯。', actionText: '唤起微信地图导航至景区门口 >' },
  { id: 'n6', type: 'park_companion', title: '游中锦囊', text: '嘘！左边是拍瀑布的最佳角度，光线刚好！走旁边小路更快哦。', actionText: '查询景区游玩攻略 >' },
  { id: 'n7', type: 'hotel_before', title: '入住指南', text: '快到酒店啦，身份证拿手上。前台可寄存行李，办好入住洗个澡。', actionText: '唤起地图导航至酒店门口/停车场 >' },
  { id: 'n8', type: 'hotel_during', title: '住中服务', text: 'WiFi密码是88888888，有事直接拨前台电话。', actions: ['查询酒店基础设施', '拨打前台电话'] },
  { id: 'n9', type: 'food', title: '美食推荐', text: '中午这顿得吃好！附近有不错的酸汤鱼。想知道哪家不踩雷？', actionText: '推荐附近特色餐厅 >' },
];

const MOCK_TRIPS: Trip[] = [
  { id: '1', title: '贵阳三日游', status: '进行中', startTime: '2026-03-10', days: 3, imageUrl: 'https://picsum.photos/seed/trip1/800/1000' },
  { id: '2', title: '梵净山徒步', status: '计划中', startTime: '2026-04-01', days: 2, imageUrl: 'https://picsum.photos/seed/trip2/800/1000' },
];

const TABS = ['精选', '景区', '酒店', '餐厅', '数字分身', '特产'];

const ALL_CARDS = [
  { id: 1, title: '旅行规划小助手', shortName: '规划助手', suggestedQuestion: '帮我规划一个贵州3日游行程', desc: '无论你想制定行程🗺️、挖掘小众景点🌴、订购门票，还是了解当地美食🍲，我都能帮你轻松搞定！', tag: '精选', likes: '9.9k', likeCount: 9900, img: '/图片/旅行规划 .jpg' },
  { id: 3, title: '旅居设计专家', shortName: '旅居专家', suggestedQuestion: '推荐一个贵州适合旅居的小镇', desc: '为您量身定制1个月及以上的沉浸式旅居行程，发现不一样的生活方式。', tag: '精选', likes: '8.5k', likeCount: 8500, img: '/图片/旅居规划.jpg' },
  { id: 16, title: '旅行记录小助手', shortName: '记录助手', suggestedQuestion: '帮我写一条贵州旅行的朋友圈文案', desc: '帮助您一键生成朋友圈、小红书、微博等社交媒体的精美文案。', tag: '精选', likes: '9.2k', likeCount: 9200, img: '/图片/旅行记录2.jpg' },
  { id: 2, title: '小七孔景区智能体', shortName: '小七孔', suggestedQuestion: '小七孔景区怎么玩最合理？', desc: '为您提供荔波小七孔景区的深度导览、路线规划与避坑指南。', tag: '精选', likes: '8.8k', likeCount: 8800, img: '/图片/小七孔.jpg' },

  { id: 4, title: '黄果树瀑布智能体', shortName: '黄果树', suggestedQuestion: '黄果树瀑布最佳观赏路线是什么？', desc: '感受亚洲第一大瀑布的磅礴气势，体验水帘洞的神秘。', tag: '景区', likes: '5.2k', likeCount: 5200, img: '/图片/黄果树瀑布.jpg' },
  { id: 5, title: '梵净山导览智能体', shortName: '梵净山', suggestedQuestion: '梵净山登山需要准备什么？', desc: '天空之城，佛教名山。为您提供最全的登山攻略。', tag: '景区', likes: '4.5k', likeCount: 4500, img: '/图片/梵净山.jpg' },
  { id: 6, title: '西江千户苗寨智能体', shortName: '苗寨', suggestedQuestion: '苗寨夜景什么时候最美？', desc: '观赏震撼的苗寨夜景，体验长桌宴，了解苗族文化。', tag: '景区', likes: '4.8k', likeCount: 4800, img: '/图片/miao.png' },

  { id: 7, title: '贵州饭店酒店智能体', shortName: '贵州饭店', suggestedQuestion: '贵州饭店有什么特色包房？', desc: '承载着贵州的历史与荣耀。为您提供私密尊贵的包房服务。', tag: '酒店', likes: '3.8k', likeCount: 3800, img: '/图片/贵州饭店.jpg' },
  { id: 8, title: '桔子水晶酒店智能体', shortName: '桔子酒店', suggestedQuestion: '桔子水晶酒店周边有什么好玩的？', desc: '贵阳中心店，尽享城市繁华与宁静。', tag: '酒店', likes: '1.2k', likeCount: 1200, img: '/图片/桔子酒店.jpg' },
  { id: 9, title: '柏联温泉酒店智能体', shortName: '柏联温泉', suggestedQuestion: '柏联温泉酒店有哪些温泉项目？', desc: '隐匿于山水间的奢华温泉度假体验。', tag: '酒店', likes: '4.1k', likeCount: 4100, img: '/图片/柏曼温泉酒店.jpg' },

  { id: 10, title: '老凯俚酸汤鱼餐厅智能体', shortName: '酸汤鱼', suggestedQuestion: '老凯俚酸汤鱼有什么推荐菜品？', desc: '三十年传承，地道凯里风味，非遗美食。', tag: '餐厅', likes: '6.1k', likeCount: 6100, img: '/图片/凯里酸汤鱼.jpg' },
  { id: 11, title: '丝恋红汤丝娃娃餐厅智能体', shortName: '丝娃娃', suggestedQuestion: '丝娃娃怎么吃最地道？', desc: '贵阳必吃榜，传统小吃新体验。', tag: '餐厅', likes: '5.5k', likeCount: 5500, img: '/图片/丝恋.jpg' },

  { id: 12, title: '苗族文化数字导游', shortName: '苗族导游', suggestedQuestion: '给我讲讲苗族银饰文化', desc: '您的专属非遗文化讲解员。', tag: '数字分身', likes: '9.9k', likeCount: 9900, img: '/图片/导游.jpg' },
  { id: 13, title: '非遗传承人王阿婆', shortName: '王阿婆', suggestedQuestion: '王阿婆的辣子鸡怎么做？', desc: '三十年秘制辣子鸡手艺，带你品尝最地道的贵州味道。', tag: '数字分身', likes: '8.2k', likeCount: 8200, img: '/图片/非遗传承人.png' },
  { id: 14, title: '地陪小刘', shortName: '小刘', suggestedQuestion: '贵阳有什么隐藏的宝藏街巷？', desc: '土生土长的贵州小伙，带你走街串巷，发现隐藏的宝藏风光。', tag: '数字分身', likes: '7.5k', likeCount: 7500, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800&h=1000' },
  { id: 15, title: '旅拍张摄影', shortName: '张摄影', suggestedQuestion: '贵州哪里拍照最出片？', desc: '专业旅拍十年，为你记录在贵州的每一个绝美瞬间。', tag: '数字分身', likes: '6.8k', likeCount: 6800, img: '/图片/旅拍张摄影.png' },
];

const SUGGESTED_TASKS = [
  { title: '做规划', desc: '规划助手计算您的最优旅游路线', query: '帮我规划一个贵州旅行行程', icon: '🗺️', bg: 'bg-blue-50' },
  { title: '找服务', desc: '订购助手提供便捷的酒店景区预订服务', query: '帮我找附近的酒店和门票', icon: '📍', bg: 'bg-green-50' },
  { title: '写游记', desc: '旅行记录官生成专属游记与回忆', query: '帮我写一篇贵州旅行游记', icon: '✏️', bg: 'bg-yellow-50' },
  { title: '来旅居', desc: '旅居管家寻找舒适的旅居地点', query: '推荐一个贵州适合旅居的地方', icon: '🏠', bg: 'bg-purple-50' },
];

export default function Home({ onNavigate }: { onNavigate: (page: Page, data?: any) => void }) {
  const [activeTab, setActiveTab] = useState('精选');
  const [cards, setCards] = useState<typeof ALL_CARDS>([]);
  const [isTripExpanded, setIsTripExpanded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    return !sessionStorage.getItem('hasVisitedHome');
  });
  const activeTrip = MOCK_TRIPS.find(t => t.status === '进行中');
  const [isTaskSquareOpen, setIsTaskSquareOpen] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  // Notification state
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);

  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setInterval(() => {
      setCurrentNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(timer);
  }, [notifications.length]);

  useEffect(() => {
    if (isInitialLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
        sessionStorage.setItem('hasVisitedHome', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoading]);

  useEffect(() => {
    if (activeTab === '精选') {
      const baseCards = ALL_CARDS.filter(c => c.tag === '精选');
      
      // Get top 1 from each category (景区, 酒店, 餐厅)
      const topAttraction = ALL_CARDS.filter(c => c.tag === '景区').sort((a, b) => b.likeCount - a.likeCount)[0];
      const topHotel = ALL_CARDS.filter(c => c.tag === '酒店').sort((a, b) => b.likeCount - a.likeCount)[0];
      const topRestaurant = ALL_CARDS.filter(c => c.tag === '餐厅').sort((a, b) => b.likeCount - a.likeCount)[0];
      
      const topCards = [topAttraction, topHotel, topRestaurant].filter(Boolean);
      
      setCards([...baseCards, ...topCards]);
    } else {
      setCards(ALL_CARDS.filter(c => c.tag === activeTab));
    }
  }, [activeTab]);

  const handleSwipe = () => {
    setCards(prev => {
      const newCards = [...prev];
      const first = newCards.shift();
      if (first) newCards.push(first);
      return newCards;
    });
  };

  return (
    <div className="h-full bg-gradient-to-b from-indigo-50 to-white flex flex-col relative overflow-hidden">
      {/* 渐变背景层 */}
      <img src="/首页.jpg" alt="首页背景" className="absolute top-0 left-0 w-full h-[151px] object-cover z-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
      <div className="absolute top-0 left-0 w-full h-[151px] bg-gradient-to-b from-[rgba(119,134,252,0.5)] via-[rgba(119,134,252,0.2)] to-[rgba(119,134,252,0)] pointer-events-none z-10" />
      
      {/* Header & Unified Notification */}
      <div className="pt-20 px-6 min-h-[100px] flex items-center relative z-50">
        <AnimatePresence mode="wait">
          {!isTripExpanded ? (
            <motion.div 
              key="collapsed" 
              className="flex items-center justify-between w-full"
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div data-guide="header" className="flex items-end gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">黄小西</h1>
                  <p className="text-sm text-gray-500">您的AI文旅助手</p>
                </div>
                <img src="/IP_1.png" alt="趴着的黄小西" className="w-24 h-18 object-contain scale-x-[-1]" />
              </div>
              
              <button
                data-guide="notification"
                onClick={() => setIsTripExpanded(true)}
                className="bg-white p-2 rounded-full shadow-sm flex items-center gap-2 relative"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                  <MapPin size={16} />
                </div>
                {/* Red dot indicator for notifications */}
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="expanded" 
              className="flex items-start w-full gap-4"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <img src="/张手跑.png" alt="站着的黄小西" className="w-16 h-24 object-contain flex-shrink-0" />
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-lg border border-indigo-50 relative overflow-hidden min-h-[100px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={notifications[currentNotifIndex].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col justify-center"
                  >
                    {(() => {
                      const notif = notifications[currentNotifIndex];
                      
                      let icon = <Sparkles size={16} />;
                      let colorClass = "text-indigo-500";
                      let bgClass = "bg-indigo-50";
                      
                      switch (notif.type) {
                        case 'warning':
                          icon = <AlertTriangle size={16} />;
                          colorClass = "text-red-500";
                          bgClass = "bg-red-50";
                          break;
                        case 'welcome':
                          icon = <Sparkles size={16} />;
                          colorClass = "text-indigo-500";
                          bgClass = "bg-indigo-50";
                          break;
                        case 'morning':
                          icon = <Sun size={16} />;
                          colorClass = "text-orange-500";
                          bgClass = "bg-orange-50";
                          break;
                        case 'tomorrow':
                          icon = <Calendar size={16} />;
                          colorClass = "text-blue-500";
                          bgClass = "bg-blue-50";
                          break;
                        case 'park_entry':
                          icon = <Navigation size={16} />;
                          colorClass = "text-emerald-500";
                          bgClass = "bg-emerald-50";
                          break;
                        case 'park_companion':
                          icon = <Camera size={16} />;
                          colorClass = "text-teal-500";
                          bgClass = "bg-teal-50";
                          break;
                        case 'hotel_before':
                        case 'hotel_during':
                          icon = <Hotel size={16} />;
                          colorClass = "text-purple-500";
                          bgClass = "bg-purple-50";
                          break;
                        case 'food':
                          icon = <Utensils size={16} />;
                          colorClass = "text-amber-500";
                          bgClass = "bg-amber-50";
                          break;
                      }

                      const handleNotifAction = (notif: AppNotification, action?: string) => {
                        switch (notif.type) {
                          case 'warning':
                            onNavigate('chat', { query: '查询近三天天气' });
                            break;
                          case 'welcome':
                            onNavigate('trip-detail-preview');
                            break;
                          case 'morning':
                            onNavigate('chat', { query: '查询今天天气' });
                            break;
                          case 'tomorrow':
                            onNavigate('chat', { query: '查询明天天气' });
                            break;
                          case 'park_entry':
                            // 按照表格要求：点击卡片唤起微信地图，导航到景区门口
                            alert('正在为您唤起微信地图导航至景区门口...');
                            break;
                          case 'park_companion':
                            onNavigate('chat', { query: '查询景区游玩攻略' });
                            break;
                          case 'hotel_before':
                            // 按照表格要求：点击卡片唤起地图导航，导航到酒店门口/停车场
                            alert('正在为您唤起地图导航至酒店门口/停车场...');
                            break;
                          case 'hotel_during':
                            if (action === '拨打前台电话') alert('正在拨打前台电话...');
                            else onNavigate('chat', { query: '查询酒店基础设施' });
                            break;
                          case 'food':
                            onNavigate('chat', { query: '推荐附近特色餐厅' });
                            break;
                        }
                      };

                      return (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`${colorClass}`}>
                              {icon}
                            </div>
                            <span className={`font-bold ${colorClass} text-sm`}>{notif.title}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-3">{notif.text}</h3>
                          
                          {notif.actions ? (
                            <div className="flex gap-2 mt-1">
                              {notif.actions.map((act, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); handleNotifAction(notif, act); }} className={`text-xs border px-2 py-1 rounded-full ${colorClass} ${bgClass} border-current opacity-80 hover:opacity-100`}>
                                  {act}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div onClick={(e) => { e.stopPropagation(); handleNotifAction(notif); }} className={`mt-1 text-xs font-medium cursor-pointer ${colorClass} hover:underline`}>
                              {notif.actionText}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsTripExpanded(false); }} 
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Original Announcement & Translation */}
      <div data-guide="announcement" className="px-6 mt-8 flex gap-2 relative z-10">
        <div 
          onClick={() => onNavigate('announcement')}
          className="flex-1 bg-green-50 border border-green-100 rounded-full px-3 py-1.5 flex items-center justify-between overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-2 text-green-700 text-xs w-full overflow-hidden">
            <Volume2 size={14} className="flex-shrink-0" />
            <div className="relative w-full overflow-hidden h-4">
              <motion.div 
                className="absolute whitespace-nowrap"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              >
                黄果树瀑布迎来最佳观赏期，水量充沛
              </motion.div>
            </div>
          </div>
          <ChevronRight size={14} className="text-green-600 flex-shrink-0" />
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('translation');
          }}
          className="bg-green-50 border border-green-100 text-green-600 px-3 py-1.5 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <img src="/icno/首页icon/中英.svg" alt="翻译" className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs + Cards Zone */}
      <div data-guide="agent-zone" className="flex flex-col flex-1">
      <div data-guide="tabs" className="flex px-6 mt-6 gap-6 overflow-x-auto scrollbar-hide pb-2 relative z-20 w-full">
        {TABS.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap flex-shrink-0 text-lg font-medium transition-colors ${
              activeTab === tab 
                ? 'text-[#7786FC]' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Card Stack */}
      <div data-guide="cards" className="flex-1 relative w-full px-6 flex justify-center items-center perspective-1000 z-10 my-0">
        <div className="relative w-full max-w-[320px] h-[360px]">
          <AnimatePresence mode="wait">
            {isInitialLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm z-50"
              >
                <img src="/IP_1.png" alt="黄小西招手" className="w-28 h-28 object-contain animate-bounce mb-4 drop-shadow-lg" />
                <div className="flex items-center gap-2 text-[#7786FC] font-bold text-lg tracking-wide">
                  <div className="w-5 h-5 rounded-full border-[3px] border-[#7786FC] border-t-transparent animate-spin" />
                  黄小西正在赶来...
                </div>
                <p className="text-xs text-[#7786FC]/70 mt-2 font-medium">为您打包贵州的美景与智能体 (´･ω･`)</p>
              </motion.div>
            ) : cards.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm z-50"
              >
                <motion.img 
                  src="/张手跑.png" 
                  alt="敬请期待" 
                  className="w-28 h-28 object-contain opacity-90 mb-4 drop-shadow-md"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <div className="text-[#7786FC] font-bold text-xl tracking-widest mb-2">
                  敬请期待
                </div>
                <p className="text-xs text-[#7786FC]/80 font-medium text-center px-6 leading-relaxed">
                  黄小西正在努力打包更多智能体<br/>马上就来哦 (๑•̀ㅂ•́)و✧
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {cards.map((card, index) => {
                  const isTop = index === 0;
                  return (
                    <motion.div
                      key={card.id}
                      className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-xl bg-white cursor-grab active:cursor-grabbing"
                    style={{
                      zIndex: cards.length - index,
                    }}
                    initial={{ scale: 0.8, opacity: 0, y: 50, x: 0 }}
                    animate={{
                      scale: 1 - index * 0.06,
                      y: index * 16,
                      x: 0,
                      opacity: index === 0 ? 1 : Math.max(0, 1 - index * 0.4),
                    }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={(e, info) => {
                      if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
                        handleSwipe();
                      }
                    }}
                    onClick={() => {
                      if (isTop) {
                        onNavigate('chat', { agentTitle: card.title });
                      }
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                      <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                      <p className="text-xs text-white/80 line-clamp-2 mb-4">{card.desc}</p>
                      <div className="flex">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <MapPin size={12} /> {card.tag}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>

      {/* Suggested Question */}
      {cards.length > 0 && !isInitialLoading && (
        <div className="px-6 mb-2 relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={cards[0].id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => onNavigate('chat', { query: cards[0].suggestedQuestion, agentTitle: cards[0].title })}
                className="w-full text-left bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 text-sm text-gray-700 hover:bg-indigo-100 transition-colors"
              >
                <span className="text-indigo-600 font-bold">{cards[0].shortName}</span>：{cards[0].suggestedQuestion}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom Input */}
      <div className="px-6 pb-8 mt-auto relative z-20">
        <div
          data-guide="input"
          onClick={() => setIsTaskSquareOpen(true)}
          className="bg-white shadow-lg rounded-full p-2 pl-6 flex items-center justify-between border border-gray-100 cursor-text"
        >
          <span className="text-gray-400 text-sm">给黄小西布置一个任务</span>
          <button className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Task Square Bottom Sheet */}
      <AnimatePresence>
        {isTaskSquareOpen && (
          <motion.div
            className="absolute inset-0 z-[60] flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsTaskSquareOpen(false)} />
            <motion.div
              className="relative bg-white rounded-t-[2rem] px-6 pt-5 pb-8 max-h-[70%] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-5">黄小西负责分派任务</h3>
              <div className="space-y-3 mb-5">
                {SUGGESTED_TASKS.map((task, i) => (
                  <motion.div
                    key={i}
                    onClick={() => { setIsTaskSquareOpen(false); onNavigate('chat', { query: task.query }); }}
                    className="bg-white border border-gray-100 rounded-2xl px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${task.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {task.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{task.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1 pl-4">
                <input
                  type="text"
                  value={taskInput}
                  onChange={e => setTaskInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && taskInput.trim()) {
                      setIsTaskSquareOpen(false);
                      onNavigate('chat', { query: taskInput.trim() });
                      setTaskInput('');
                    }
                  }}
                  placeholder="给黄小西布置一个任务"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <button
                  onClick={() => {
                    if (taskInput.trim()) {
                      setIsTaskSquareOpen(false);
                      onNavigate('chat', { query: taskInput.trim() });
                      setTaskInput('');
                    }
                  }}
                  className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
