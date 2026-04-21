import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Menu, MoreHorizontal, Minus, CircleDot, Sparkles, Send, Radio, Calendar, MapPin, Trophy, Shield, Star, HeartHandshake, Map, Coffee, Activity, Bed, Bus, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

interface CardData {
  category: string;
  title: string;
  desc: string;
  img: string;
  tag: string;
}

interface ChatMessage {
  id: number;
  type: 'ai' | 'user';
  text: string;
  isWelcome?: boolean;
  options?: string[];
  cards?: CardData[];
  cardGroups?: { title: string; cards: CardData[] }[];
  useTypewriter?: boolean;
}

const MessageBubble = ({ 
  msg, 
  onOptionClick, 
  scrollToBottom 
}: { 
  msg: ChatMessage, 
  onOptionClick: (opt: string) => void, 
  scrollToBottom: () => void 
}) => {
  const [displayedText, setDisplayedText] = useState(msg.useTypewriter ? '' : msg.text);
  const [showExtras, setShowExtras] = useState(!msg.useTypewriter);
  const [hasTyped, setHasTyped] = useState(false); // 标记是否已经打字完成，防止重新渲染触发

  useEffect(() => {
    if (msg.useTypewriter && !hasTyped) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < msg.text.length) {
          setDisplayedText(msg.text.slice(0, i + 1));
          i++;
          scrollToBottom();
        } else {
          clearInterval(timer);
          setShowExtras(true);
          setHasTyped(true); // 标记完成
          scrollToBottom();
        }
      }, 40);
      return () => clearInterval(timer);
    }
  }, [msg.text, msg.useTypewriter, hasTyped, scrollToBottom]);

  return (
    <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm max-w-[88%] ${
      msg.type === 'user' 
        ? 'bg-blue-500 text-white rounded-tr-sm ml-auto' 
        : 'bg-white/90 backdrop-blur-md text-[#2C3E50] rounded-tl-sm border border-white/60 mr-auto'
    }`}>
      <div className="whitespace-pre-wrap">{displayedText}</div>
      
      {showExtras && msg.options && (
        <div className="mt-3 flex flex-wrap gap-2">
          {msg.options.map(opt => (
            <button 
              key={opt} 
              onClick={() => onOptionClick(opt)} 
              className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full text-[13px] font-medium active:scale-95 transition-transform"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {showExtras && msg.cards && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full" style={{ maxWidth: '260px' }}>
          {msg.cards.map((card, i) => (
            <div key={i} className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
              <div className="relative h-20">
                <img src={card.img} className="w-full h-full object-cover" alt={card.title} />
                <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                  {card.category}
                </div>
              </div>
              <div className="p-2">
                <h5 className="font-bold text-[12px] text-gray-800 truncate">{card.title}</h5>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{card.desc}</p>
                <span className="inline-block mt-1 bg-blue-50 text-blue-600 text-[9px] px-1 py-0.5 rounded">{card.tag}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showExtras && msg.cardGroups && (
        <div className="mt-4 space-y-4 w-full" style={{ maxWidth: '260px' }}>
          {msg.cardGroups.map((group, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-[13px] text-gray-700 mb-2 flex items-center gap-1">
                {group.title}
              </h4>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {group.cards.map((card, i) => (
                  <div key={i} className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100">
                    <div className="relative h-20">
                      <img src={card.img} className="w-full h-full object-cover" alt={card.title} />
                      <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {card.category}
                      </div>
                    </div>
                    <div className="p-2">
                      <h5 className="font-bold text-[12px] text-gray-800 truncate">{card.title}</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{card.desc}</p>
                      <span className="inline-block mt-1 bg-blue-50 text-blue-600 text-[9px] px-1 py-0.5 rounded">{card.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function SportsAssistant({ onNavigate }: { onNavigate: (page: Page, data?: any) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      type: 'ai', 
      text: '嗨，我是您的活动赛事管家！✨可以解答你各类赛事与活动相关问题，为你定制专属参赛规划与详细的观演指南🏃，让体验更舒适省心～😊各类赛事活动问题可以随时问我！', 
      isWelcome: true 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState<{title: string, type: 'event' | 'category', data?: any} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleAsk = (text: string, isSpecial: boolean = false) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      if (text.includes('热门推荐') && isSpecial) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'ai',
          text: '近期这几项赛事/活动热度极高🔥！您想了解哪一个的周边吃住玩推荐？直接点击下方按钮即可：',
          options: ['贵阳马拉松周边', '黄小西音乐节周边', '榕江“村超”周边'],
          useTypewriter: true
        }]);
      } else if (text === '贵阳马拉松周边') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'ai',
          text: '为您定制了【贵阳马拉松】的周边推荐！\n\n🏨 住宿建议选在观山湖区起终点附近；\n🍜 赛前去吃肠旺面，赛后安排老凯俚酸汤鱼；\n🏞️ 凭号码布还能免费游览黄果树瀑布等景区哦！',
          useTypewriter: true,
          cardGroups: [
            {
              title: '🏨 住宿推荐',
              cards: [
                { category: '住', title: '中天凯悦酒店', desc: '距起点800m', img: `${import.meta.env.BASE_URL}图片/贵州饭店.jpg`, tag: '五星优选' },
                { category: '住', title: '观山湖万达美华', desc: '距起点1.2km', img: `${import.meta.env.BASE_URL}图片/桔子酒店.jpg`, tag: '高性价比' },
                { category: '住', title: '贵阳雅迪尔酒店', desc: '地铁1号线直达', img: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`, tag: '交通便利' }
              ]
            },
            {
              title: '🍜 美食推荐',
              cards: [
                { category: '吃', title: '老凯俚酸汤鱼', desc: '赛后庆功必吃', img: `${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`, tag: '非遗美食' },
                { category: '吃', title: '南明肠旺面', desc: '赛前碳水充碳', img: `${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`, tag: '排队王' },
                { category: '吃', title: '丝恋红汤丝娃娃', desc: '贵阳特色小吃', img: `${import.meta.env.BASE_URL}图片/丝恋.jpg`, tag: '必吃榜' }
              ]
            },
            {
              title: '🏞️ 游玩推荐',
              cards: [
                { category: '玩', title: '黄果树瀑布', desc: '凭号码布免门票', img: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`, tag: 'AAAAA景区' },
                { category: '玩', title: '黔灵山公园', desc: '看网红猕猴', img: `${import.meta.env.BASE_URL}图片/西江2.jpg`, tag: '5元良心价' },
                { category: '玩', title: '青岩古镇', desc: '吃状元猪蹄', img: `${import.meta.env.BASE_URL}图片/miao.png`, tag: '历史名镇' }
              ]
            }
          ]
        }]);
      } else if (text === '黄小西音乐节周边') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'ai',
          text: '为您定制了【黄小西音乐节】的周边推荐！\n\n🏨 住宿建议选在地铁沿线，散场接驳方便；\n🍜 听完音乐节去吃顿留一手烤鱼或者烙锅当夜宵；\n🏞️ 白天推荐去西江千户苗寨等地方体验民族风情！',
          useTypewriter: true,
          cardGroups: [
            {
              title: '🏨 住宿推荐',
              cards: [
                { category: '住', title: '观山湖万达美华', desc: '距场地1.5km', img: `${import.meta.env.BASE_URL}图片/桔子酒店.jpg`, tag: '步行可达' },
                { category: '住', title: '贵阳世纪金源', desc: '配套齐全', img: `${import.meta.env.BASE_URL}图片/贵州饭店.jpg`, tag: '豪华五星' },
                { category: '住', title: '林城东路全季', desc: '紧邻地铁口', img: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`, tag: '散场便捷' }
              ]
            },
            {
              title: '🍜 美食推荐',
              cards: [
                { category: '吃', title: '留一手烤鱼', desc: '散场后的夜宵江湖', img: `${import.meta.env.BASE_URL}图片/丝恋.jpg`, tag: '深夜食堂' },
                { category: '吃', title: '贵阳水城烙锅', desc: '万物皆可烙', img: `${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`, tag: '夜市必点' },
                { category: '吃', title: '夺肉粉', desc: '本地扎实早餐', img: `${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`, tag: '唤醒清晨' }
              ]
            },
            {
              title: '🏞️ 游玩推荐',
              cards: [
                { category: '玩', title: '西江千户苗寨', desc: '体验苗族风情', img: `${import.meta.env.BASE_URL}图片/miao.png`, tag: '民俗体验' },
                { category: '玩', title: '荔波小七孔', desc: '地球腰带上的绿宝石', img: `${import.meta.env.BASE_URL}图片/西江2.jpg`, tag: '自然奇观' },
                { category: '玩', title: '甲秀楼', desc: '贵阳城市地标', img: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`, tag: '夜景绝佳' }
              ]
            }
          ]
        }]);
      } else if (text === '榕江“村超”周边') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'ai',
          text: '为您定制了【榕江“村超”】的周边推荐！\n\n🏨 县城住宿火爆，记得提前抢订尚品大酒店等；\n🍜 一定要挑战一下特色的牛瘪火锅，早上吃榕江卷粉；\n🏞️ 看完球顺便去肇兴侗寨逛逛，高铁一站直达！',
          useTypewriter: true,
          cardGroups: [
            {
              title: '🏨 住宿推荐',
              cards: [
                { category: '住', title: '榕江尚品大酒店', desc: '距赛场1km', img: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`, tag: '步行看球' },
                { category: '住', title: '榕江国际大酒店', desc: '老牌星级', img: `${import.meta.env.BASE_URL}图片/贵州饭店.jpg`, tag: '服务保障' },
                { category: '住', title: '从江高铁站周边', desc: '高铁15分钟可达', img: `${import.meta.env.BASE_URL}图片/桔子酒店.jpg`, tag: '溢出备选' }
              ]
            },
            {
              title: '🍜 美食推荐',
              cards: [
                { category: '吃', title: '牛瘪火锅', desc: '榕江地道暗黑美食', img: `${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`, tag: '特色挑战' },
                { category: '吃', title: '榕江卷粉', desc: '皮薄馅大的早餐', img: `${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`, tag: '过早必吃' },
                { category: '吃', title: '侗家腌鱼', desc: '酸辣可口开胃', img: `${import.meta.env.BASE_URL}图片/丝恋.jpg`, tag: '非遗小吃' }
              ]
            },
            {
              title: '🏞️ 游玩推荐',
              cards: [
                { category: '玩', title: '肇兴侗寨', desc: '高铁一站直达', img: `${import.meta.env.BASE_URL}图片/西江2.jpg`, tag: '侗族风情' },
                { category: '玩', title: '岜沙苗寨', desc: '最后一个枪手部落', img: `${import.meta.env.BASE_URL}图片/miao.png`, tag: '神秘古老' },
                { category: '玩', title: '榕江古榕风景名胜区', desc: '看百年古树群', img: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`, tag: '自然风光' }
              ]
            }
          ]
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          type: 'ai', 
          text: `关于“${text}”，已为您找到最新信息：\n目前赛事/活动筹备顺利，预计会有详细的官方指引。需要我为您规划更具体的行程或周边住宿安排吗？`
        }]);
      }
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const SUGGESTED_QUESTIONS = [
    "规划贵阳马拉松两个月的赛前训练",
    "草莓音乐节·贵阳站的详细演出阵容",
    "推荐贵州近期适合新手的越野赛"
  ];

  const BOTTOM_CATEGORIES = [
    "活动日历", "热门推荐"
  ];

  const ONGOING_EVENTS = [
    {
      id: 1,
      title: "2026贵阳马拉松",
      date: "2026.05.16",
      location: "贵阳市观山湖区",
      img: `${import.meta.env.BASE_URL}图片/旅行记录.jpg`,
      tag: "火热报名中",
      type: "marathon",
      status: "报名中",
      organizer: "贵阳市体育局",
      route: "观山湖公园(起点) - 林城东路 - 黔灵山路 - 观山湖公园(终点)",
      level: "中国田协 A1 赛事",
      startDay: 15,
      endDay: 16
    },
    {
      id: 2,
      title: "2026黄小西吃晚饭音乐节",
      date: "2026.05.01 - 05.03",
      location: "贵阳市观山湖公园",
      img: `${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`,
      tag: "火热售票中",
      type: "music",
      status: "即将开始",
      organizer: "贵州省文旅厅",
      route: "观山湖公园大草坪 (黄果树舞台/小七孔舞台)",
      level: "大型户外文旅音乐节",
      startDay: 1,
      endDay: 3
    },
    {
      id: 3,
      title: "2026贵州榕江“村超”联赛",
      date: "2026.05 - 07 (每周末)",
      location: "黔东南州榕江县",
      img: `${import.meta.env.BASE_URL}图片/西江2.jpg`,
      tag: "超级周末",
      type: "series",
      status: "进行中",
      organizer: "榕江县人民政府",
      route: "榕江县城北新区体育馆",
      level: "现象级乡村体育赛事",
      startDay: 1,
      endDay: 31,
      schedule: [
        {
          date: "5月16日 (超级星期六)",
          items: [
            { id: 1, time: "14:00", teamA: "车江一村", teamB: "忠诚村队", type: "match" },
            { id: 2, time: "16:00", teamA: "平地村队", teamB: "丰乐村队", type: "match" },
            { id: 3, time: "18:00", title: "万人齐跳多耶舞 & 侗族大歌", type: "show" },
            { id: 4, time: "20:00", teamA: "新中村队", teamB: "六佰塘村", type: "match" }
          ]
        },
        {
          date: "5月17日 (超级星期日)",
          items: [
            { id: 5, time: "15:00", teamA: "月寨村队", teamB: "党相村队", type: "match" },
            { id: 6, time: "17:00", title: "苗族芦笙舞展演", type: "show" },
            { id: 7, time: "19:00", teamA: "小腮村队", teamB: "口寨村队", type: "match" }
          ]
        }
      ]
    }
  ];

  const [selectedDate, setSelectedDate] = useState(16);
  const [eventTab, setEventTab] = useState<string>('pre');

  useEffect(() => {
    if (activeSubPage?.type === 'event') {
      setEventTab(activeSubPage.data.type === 'series' ? 'schedule' : 'pre');
    }
  }, [activeSubPage]);

  const handleBottomCategoryClick = (cat: string) => {
    if (cat === '热门推荐') {
      handleAsk('我想看热门推荐', true);
    } else {
      setActiveSubPage({ title: cat, type: 'category' });
    }
  };

  return (
    <div className="h-full bg-[#EAF0F6] flex flex-col relative font-sans overflow-hidden">
      
      {/* Top Header Actions (Absolute positioned over image) */}
      <div className="absolute top-0 left-0 w-full pt-12 px-4 pb-2 z-50 flex justify-between items-center pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => onNavigate('home')} className="w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-800 active:scale-95 transition-transform">
            <ChevronLeft size={22} className="-ml-0.5" />
          </button>
          <button className="w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-800 active:scale-95 transition-transform">
            <Menu size={18} />
          </button>
        </div>
        <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 gap-2.5 shadow-sm text-gray-800 pointer-events-auto">
          <MoreHorizontal size={18} />
          <div className="w-[1px] h-3.5 bg-gray-300"></div>
          <Minus size={18} />
          <div className="w-[1px] h-3.5 bg-gray-300"></div>
          <CircleDot size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-36 relative z-10 scrollbar-hide">
        
        {/* Top Scenic Image */}
        <div className="absolute top-0 left-0 w-full h-[25vh] z-0">
          <img src={`${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`} className="w-full h-full object-cover object-top" alt="scenic background" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#EAF0F6]"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 pt-[15vh] px-4">
          
          {/* Agent Info Card */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-2xl p-5 pt-12 relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4">
            {/* Avatar overlapping the card */}
            <div className="absolute -top-12 left-5 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md">
              <img src={`${import.meta.env.BASE_URL}IP_1.png`} className="w-full h-full object-cover" alt="Agent Avatar" />
            </div>
            
            <h2 className="text-[17px] font-extrabold text-[#2C3E50] flex items-center gap-1.5">
              <Sparkles size={16} className="text-blue-500" />
              赛事管家
            </h2>
            <p className="text-[13px] text-[#5C6B7A] mt-1 font-medium">活动赛事智能体，定制您的参赛与观演体验</p>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <MessageBubble 
                  msg={msg} 
                  onOptionClick={(opt) => handleAsk(opt)} 
                  scrollToBottom={scrollToBottom} 
                />

                {/* Render Suggested Questions ONLY after the first welcome message */}
                {msg.isWelcome && (
                  <>
                    {/* Ongoing Events Carousel */}
                    <div className="mt-4 w-full">
                      <h3 className="text-[13px] font-bold text-[#5C6B7A] mb-2 px-1">🔥 进行中的活动赛事</h3>
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                        {ONGOING_EVENTS.map((event) => (
                          <div 
                            key={event.id} 
                            onClick={() => setActiveSubPage({ title: event.title, type: 'event', data: event })}
                            className="flex-shrink-0 w-[200px] bg-white/90 backdrop-blur-md rounded-xl overflow-hidden shadow-sm border border-white/60 cursor-pointer active:scale-95 transition-transform"
                          >
                            <div className="h-24 w-full relative">
                              <img src={event.img} className="w-full h-full object-cover" alt={event.title} />
                              <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium">
                                {event.tag}
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-bold text-[#2C3E50] text-[14px] truncate">{event.title}</h4>
                              <p className="text-[#5C6B7A] text-[12px] mt-1">{event.date} · {event.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2.5 items-start">
                      {SUGGESTED_QUESTIONS.map((q, idx) => (
                        <motion.button 
                          key={idx}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAsk(q)}
                          className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-full text-[14px] text-[#2C3E50] shadow-sm border border-white/60 text-left font-medium"
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-white/60 flex gap-1.5 items-center">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

        </div>
      </div>

      {/* Bottom Sticky Area */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#EAF0F6] via-[#EAF0F6] to-transparent pt-12 pb-safe px-4 z-40">
        
        {/* Horizontal Category Chips */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide mb-3 pb-1 -mx-4 px-4">
          {BOTTOM_CATEGORIES.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => handleBottomCategoryClick(cat)}
              className="flex-shrink-0 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[13px] text-[#2C3E50] font-bold shadow-sm border border-white/60 active:scale-95 transition-transform"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-white rounded-full p-1.5 flex items-center gap-2 shadow-sm border border-white mb-2">
          <div className="p-2 pl-3">
            <Radio size={20} className="text-gray-700" />
          </div>
          <input 
            type="text" 
            placeholder="请输入您想了解的赛事或活动" 
            className="flex-1 bg-transparent outline-none text-[15px] text-gray-800 placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
          />
          <button 
            onClick={() => handleAsk(input)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              input.trim() ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-50 text-blue-300'
            }`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Sub-page Overlay */}
      <AnimatePresence>
        {activeSubPage && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[100] bg-white flex flex-col"
          >
            {/* Header */}
            <div className="pt-12 px-4 pb-4 flex items-center border-b border-gray-100 bg-white">
              <button onClick={() => setActiveSubPage(null)} className="w-8 h-8 flex items-center justify-center -ml-2 active:scale-95 transition-transform">
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
              <h2 className="flex-1 text-center font-bold text-[17px] pr-6 text-gray-800">{activeSubPage.title}</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#F5F7FA] p-4">
              {activeSubPage.type === 'category' && activeSubPage.title === '活动日历' ? (
                <div className="pb-8">
                  {/* Calendar Header */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 text-[16px]">2026年 5月</h3>
                      <div className="flex gap-2">
                        <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-600"><ChevronLeft size={16} /></button>
                        <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-600"><ChevronLeft size={16} className="rotate-180" /></button>
                      </div>
                    </div>
                    {/* Days Row */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                        <div key={d} className="text-center text-[12px] text-gray-400 font-medium">{d}</div>
                      ))}
                    </div>
                    {/* Dates Grid (Mock for May 2026) */}
                    <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                      {Array.from({length: 31}).map((_, i) => {
                        const date = i + 1;
                        const eventsOnDay = ONGOING_EVENTS.filter(e => date >= e.startDay && date <= e.endDay);
                        const isEventDay = eventsOnDay.length > 0;
                        const isSelected = date === selectedDate;
                        
                        const isStart = eventsOnDay.some(e => e.startDay === date);
                        const isEnd = eventsOnDay.some(e => e.endDay === date);
                        const isMid = eventsOnDay.some(e => date > e.startDay && date < e.endDay);

                        return (
                          <div key={i} className="relative flex items-center justify-center h-10">
                            {isEventDay && (
                              <div className={`absolute inset-y-1 ${isStart ? 'left-1/2 right-0 rounded-l-full' : ''} ${isEnd ? 'right-1/2 left-0 rounded-r-full' : ''} ${isMid ? 'inset-x-0' : ''} ${(isStart && isEnd) ? 'inset-x-1 rounded-full' : ''} bg-blue-50 z-0`}></div>
                            )}
                            <button 
                              onClick={() => setSelectedDate(date)}
                              className={`w-9 h-9 rounded-full flex flex-col items-center justify-center relative z-10 transition-colors ${
                                isSelected ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span className="text-[14px] font-medium">{date}</span>
                              {isEventDay && !isSelected && <div className="w-1 h-1 bg-blue-400 rounded-full absolute bottom-1"></div>}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Daily Events List */}
                  <h4 className="font-bold text-gray-800 mb-3 px-1">5月{selectedDate}日 赛事活动</h4>
                  <div className="space-y-3">
                    {(() => {
                      const selectedEvents = ONGOING_EVENTS.filter(e => selectedDate >= e.startDay && selectedDate <= e.endDay);
                      if (selectedEvents.length === 0) {
                        return <div className="text-center text-gray-400 py-8 text-[13px]">当日暂无大型赛事活动</div>;
                      }
                      return selectedEvents.map(event => (
                        <div key={event.id} onClick={() => setActiveSubPage({ title: event.title, type: 'event', data: event })} className="bg-white rounded-xl p-3 shadow-sm flex gap-3 cursor-pointer active:scale-95 transition-transform">
                          <img src={event.img} className="w-20 h-20 rounded-lg object-cover" alt={event.title} />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-[#2C3E50] text-[15px]">{event.title}</h5>
                                <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-medium">{event.status}</span>
                              </div>
                              <p className="text-gray-500 text-[12px] mt-1 flex items-center gap-1"><MapPin size={12} /> {event.location}</p>
                            </div>
                            <p className="text-gray-400 text-[11px]">{event.level}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ) : activeSubPage.type === 'event' ? (
                <div className="pb-24">
                  {/* Hero Header */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <img src={activeSubPage.data.img} className="w-full h-48 object-cover rounded-xl mb-4" alt={activeSubPage.title} />
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-[20px] font-extrabold text-gray-800 leading-tight pr-2">{activeSubPage.data.title}</h3>
                      <span className="bg-blue-500 text-white text-[12px] px-2.5 py-1 rounded-md font-bold whitespace-nowrap shadow-sm">
                        {activeSubPage.data.tag}
                      </span>
                    </div>
                    
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[11px] mb-0.5">举办时间</span>
                        <span className="text-gray-800 text-[13px] font-medium flex items-center gap-1"><Calendar size={13} className="text-blue-500"/> {activeSubPage.data.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[11px] mb-0.5">举办地点</span>
                        <span className="text-gray-800 text-[13px] font-medium flex items-center gap-1 truncate"><MapPin size={13} className="text-blue-500"/> {activeSubPage.data.location}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[11px] mb-0.5">主办方</span>
                        <span className="text-gray-800 text-[13px] font-medium truncate">{activeSubPage.data.organizer}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[11px] mb-0.5">赛事规格</span>
                        <span className="text-gray-800 text-[13px] font-medium truncate">{activeSubPage.data.level}</span>
                      </div>
                    </div>
                  </div>

                  {activeSubPage.data?.type === 'marathon' ? (
                    <div className="space-y-4">
                      {/* Tabs */}
                      <div className="flex bg-gray-100/80 p-1 rounded-xl mb-4 overflow-x-auto scrollbar-hide">
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'pre' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('pre')}
                        >赛前报名</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'mid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('mid')}
                        >赛中保障</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'post' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('post')}
                        >赛后口碑</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'service' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('service')}
                        >周边服务</button>
                      </div>

                      {/* Tab Content: Pre-Race */}
                      {eventTab === 'pre' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span> 赛前：报名与赛事基础信息
                          </h4>
                          
                          {/* Route Map (Graphic) */}
                          <div className="relative w-full h-36 bg-blue-50/50 rounded-xl mb-4 overflow-hidden border border-blue-100 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <path d="M 20 100 Q 80 20 180 60 T 320 40" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="6 6" />
                              <circle cx="20" cy="100" r="6" fill="#3B82F6" />
                              <circle cx="320" cy="40" r="6" fill="#EF4444" />
                            </svg>
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] px-2 py-1 rounded text-blue-700 font-bold shadow-sm">🗺️ 官方路线图</div>
                            <div className="absolute bottom-2 left-2 text-[10px] text-blue-600 font-medium">起点: 观山湖公园</div>
                            <div className="absolute top-2 right-2 text-[10px] text-red-600 font-medium">终点: 观山湖公园</div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🏅 赛事规格与认证</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">中国田协 A1 赛事认证，官方认证成绩，证书全网可查。全马成绩达标可申请中国马拉松大满贯直通。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🗺️ 赛道信息与路线</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg"><strong>路线：</strong>{activeSubPage.data.route}<br/>全程里程准确，城市主干道全封闭。整体爬升较小（约150m），途经观山湖风景区，沿途风景优美，折返点较少，是一条非常适合PB的“平缓赛道”。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎟️ 参赛名额与抽签</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">总规模 30,000 人（全马10k，半马15k，欢乐跑5k）。往届全马中签率约 35%。设有慈善名额与家庭亲子跑组别。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🛍️ 参赛包物资</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">特步速干参赛服（尺码较全，建议按平码选）、能量胶×2、盐丸×1排、一次性雨衣、大容量束口存包袋。</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Mid-Race */}
                      {eventTab === 'mid' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-orange-500 rounded-full"></span> 赛中：现场保障（跑者重点）
                          </h4>

                          {/* Supply Points Map (Graphic) */}
                          <div className="relative w-full h-28 bg-orange-50/50 rounded-xl mb-4 overflow-hidden border border-orange-100 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <line x1="20" y1="60" x2="320" y2="60" stroke="#F97316" strokeWidth="4" />
                              <circle cx="80" cy="60" r="8" fill="white" stroke="#F97316" strokeWidth="2" />
                              <circle cx="170" cy="60" r="8" fill="white" stroke="#F97316" strokeWidth="2" />
                              <circle cx="260" cy="60" r="8" fill="white" stroke="#F97316" strokeWidth="2" />
                            </svg>
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] px-2 py-1 rounded text-orange-700 font-bold shadow-sm">🥤 补给/医疗点位分布</div>
                            <div className="absolute top-[44px] left-[70px] text-[16px]">💧</div>
                            <div className="absolute top-[44px] left-[160px] text-[16px]">🍌</div>
                            <div className="absolute top-[44px] left-[250px] text-[16px]">🚑</div>
                            <div className="absolute bottom-2 left-0 w-full flex justify-around text-[10px] text-orange-600 font-medium px-4">
                              <span>5km</span>
                              <span>15km</span>
                              <span>25km</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1 flex items-center gap-1"><HeartHandshake size={14}/> 沿途补给与医疗</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed">
                                • <strong>饮水/饮料：</strong>每2.5km一个水站，5km后每隔5km设置运动饮料站。<br/>
                                • <strong>食物补给：</strong>15km后提供香蕉、小面包；25km后提供能量胶与特色折耳根小吃。<br/>
                                • <strong>医疗与降温：</strong>每100m一名医疗志愿者，全程配备60台AED。赛道后半程每2km设有降温喷淋站与海绵点，高温防暑保障极为完善。
                              </p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🚌 交通存包与氛围</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed">起点接驳地铁1号线直达，存包区按号码布分区，往年存取包流转平均耗时低于3分钟。沿途市民热情，多处设有苗族/布依族特色助威团和音乐加油站。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🌤️ 天气适配预案</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed">五月中旬贵阳气温约 18-25℃，湿度适中，极其适合马拉松。如遇突发雨天，组委会承诺终点增发姜汤与保温毯。</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Post-Race */}
                      {eventTab === 'post' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-green-500 rounded-full"></span> 赛后：体验与成绩口碑
                          </h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-green-50 p-2.5 rounded-lg border border-green-100">
                                <p className="text-[13px] font-bold text-green-800 flex items-center gap-1 mb-1"><Trophy size={14}/> 成绩与配速</p>
                                <p className="text-[12px] text-green-700">芯片计时精准，赛后1小时可下载含分段配速的官方净成绩证书。赛道PB友好度极高，往年完赛率98%。</p>
                              </div>
                              <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                                <p className="text-[13px] font-bold text-purple-800 flex items-center gap-1 mb-1"><Star size={14}/> 长期口碑</p>
                                <p className="text-[12px] text-purple-700">国内“零差评”赛事之一。跑友反馈整体体验极佳，复跑意愿强。</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1 mt-2">🏁 完赛物资与疏散</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed">特色苗银风格完赛奖牌、大浴巾、完赛恢复包（含牛奶、面包、当地特色粉面）。赛道摄影点密集，赛后当晚即可凭人脸免费下载高清照片。</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Services & Tourism */}
                      {eventTab === 'service' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-purple-500 rounded-full"></span> 跑者服务与周边游玩
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Accommodation Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Bed size={16} className="text-purple-500"/> 住宿推荐 (距离起点近)</p>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/贵州饭店.jpg`} className="w-full h-24 object-cover" alt="Hotel" />
                                  <div className="p-2.5">
                                    <h5 className="font-bold text-[13px] text-gray-800 truncate">贵阳中天凯悦酒店</h5>
                                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> 距起点 800m (步行可达)</p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-orange-500 font-bold text-[12px]">¥580<span className="text-[10px] font-normal text-gray-400">/晚起</span></span>
                                      <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded">五星优选</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/桔子酒店.jpg`} className="w-full h-24 object-cover" alt="Hotel" />
                                  <div className="p-2.5">
                                    <h5 className="font-bold text-[13px] text-gray-800 truncate">观山湖万达美华酒店</h5>
                                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> 距起点 1.2km</p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-orange-500 font-bold text-[12px]">¥320<span className="text-[10px] font-normal text-gray-400">/晚起</span></span>
                                      <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded">高性价比</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Food Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Coffee size={16} className="text-purple-500"/> 跑者必吃榜 (赛前赛后)</p>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`} className="w-full h-20 object-cover" alt="Food" />
                                  <div className="p-2.5">
                                    <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">赛后庆功</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">老凯俚酸汤鱼</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">三十年传承，地道凯里风味，赛后恢复绝佳选择。</p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/丝恋.jpg`} className="w-full h-20 object-cover" alt="Food" />
                                  <div className="p-2.5">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">赛前碳水</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">南门口肠旺面</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">贵阳人的过早必选，面条劲道，赛前补充碳水极佳。</p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                                    <img src={`${import.meta.env.BASE_URL}图片/丝恋.jpg`} className="w-full h-full object-cover opacity-80" alt="Food" />
                                  </div>
                                  <div className="p-2.5">
                                    <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">特色小吃</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">丝恋红汤丝娃娃</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">必吃榜餐厅，蔬菜裹卷蘸秘制红汤，开胃解腻。</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Scenic Spot Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Ticket size={16} className="text-purple-500"/> 凭号码布免费游景区</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 h-28">
                                  <img src={`${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`} className="absolute inset-0 w-full h-full object-cover" alt="Scenic" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h5 className="font-bold text-[13px] text-white drop-shadow-md">黄果树瀑布</h5>
                                    <p className="text-[10px] text-white/90">免门票 节省¥160</p>
                                  </div>
                                </div>
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 h-28">
                                  <img src={`${import.meta.env.BASE_URL}图片/小七孔.jpg`} className="absolute inset-0 w-full h-full object-cover" alt="Scenic" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h5 className="font-bold text-[13px] text-white drop-shadow-md">荔波小七孔</h5>
                                    <p className="text-[10px] text-white/90">免门票 节省¥120</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Traffic Info (Kept clean as it's policy info) */}
                            <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 mt-2">
                              <p className="text-[13px] font-bold text-purple-800 mb-1 flex items-center gap-1"><Bus size={14}/> 赛事专属交通政策</p>
                              <p className="text-[12px] text-purple-700 leading-relaxed">
                                • <strong>免费乘车：</strong>比赛当日，凭参赛号码布可<strong>免费无限次</strong>乘坐贵阳市地铁（1、2、3号线）及常规公交线路。<br/>
                                • <strong>提前运营：</strong>比赛日地铁线网将提前至 <strong>5:00</strong> 开始运营。<br/>
                                • <strong>官方接驳：</strong>赛前在机场/高铁站设免费领物接驳大巴；赛后终点设50辆疏散公交直达市中心。
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeSubPage.data?.type === 'music' ? (
                    <div className="space-y-4">
                      {/* Tabs */}
                      <div className="flex bg-gray-100/80 p-1 rounded-xl mb-4 overflow-x-auto scrollbar-hide">
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'pre' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('pre')}
                        >行前准备</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'mid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('mid')}
                        >现场指南</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'post' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('post')}
                        >周边文创</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'service' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('service')}
                        >吃住与游玩</button>
                      </div>

                      {/* Tab Content: Pre-Festival */}
                      {eventTab === 'pre' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span> 行前：票务与装备指南
                          </h4>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎫 票务与入场</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">单日预售票 ¥299，全价票 ¥399，三日通票 ¥799。采用【实名制购票+刷身份证入场】，不支持转赠退换。入场时间：13:00 - 20:30。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎤 演出阵容与时刻表</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">三大主题舞台：【黄果树舞台】主打流行/摇滚，【小七孔舞台】主打独立/民谣，【西江舞台】主打电音/说唱。核心压轴乐队将于每晚 20:40 登场。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎒 必备装备清单</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">建议携带：身份证原件、充电宝、防晒霜、一次性雨衣、野餐垫、防蚊贴。<br/><span className="text-red-500 font-medium">禁带物品：</span>长柄雨伞、充气沙发、冷焰火、航拍飞行器、宠物及各类瓶装饮料。</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Mid-Festival */}
                      {eventTab === 'mid' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-orange-500 rounded-full"></span> 现场：场地地图与生存指南
                          </h4>

                          {/* Map Placeholder */}
                          <div className="relative w-full h-32 bg-orange-50/50 rounded-xl mb-4 overflow-hidden border border-orange-100 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <circle cx="50" cy="50" r="30" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeDasharray="4 4" />
                              <circle cx="200" cy="80" r="25" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeDasharray="4 4" />
                              <circle cx="300" cy="40" r="20" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeDasharray="4 4" />
                            </svg>
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] px-2 py-1 rounded text-orange-700 font-bold shadow-sm">🗺️ 场地分布示意图</div>
                            <div className="absolute top-[40px] left-[35px] text-[10px] font-bold text-orange-800">黄果树舞台</div>
                            <div className="absolute top-[70px] left-[180px] text-[10px] font-bold text-blue-800">小七孔舞台</div>
                            <div className="absolute top-[30px] left-[285px] text-[10px] font-bold text-purple-800">西江舞台</div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1 flex items-center gap-1"><Coffee size={14}/> 餐饮与补给</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed">
                                场地中央设有“黄小西吃晚饭”官方美食街，汇聚贵州特色小吃（折耳根烤肉、丝娃娃、手搓冰粉等）。场内设有多个官方饮水售卖点，支持微信/支付宝支付。
                              </p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1 flex items-center gap-1"><HeartHandshake size={14}/> 现场医疗与洗手间</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed">
                                主舞台右侧及入口处设有医疗救护站。洗手间分布在场地三个边缘区域（高峰期黄果树舞台右侧洗手间排队较长，建议前往西江舞台附近）。
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Post-Festival */}
                      {eventTab === 'post' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-green-500 rounded-full"></span> 赛后：官方周边与回忆
                          </h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-green-50 p-2.5 rounded-lg border border-green-100">
                                <p className="text-[13px] font-bold text-green-800 flex items-center gap-1 mb-1"><Star size={14}/> 官方文创</p>
                                <p className="text-[12px] text-green-700">现场设有“黄小西”IP周边店，售卖限定联名T恤、帆布袋、贵州民族风挂件等。</p>
                              </div>
                              <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                                <p className="text-[13px] font-bold text-purple-800 flex items-center gap-1 mb-1"><Activity size={14}/> 照片直播</p>
                                <p className="text-[12px] text-purple-700">关注官方公众号，演出次日可获取高清大图与现场 Aftermovie 混剪视频。</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Services & Tourism */}
                      {eventTab === 'service' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-purple-500 rounded-full"></span> 乐迷吃住与游玩推荐
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Accommodation Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Bed size={16} className="text-purple-500"/> 住宿推荐 (近地铁/近场地)</p>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/桔子酒店.jpg`} className="w-full h-24 object-cover" alt="Hotel" />
                                  <div className="p-2.5">
                                    <h5 className="font-bold text-[13px] text-gray-800 truncate">观山湖万达美华酒店</h5>
                                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> 距场地 1.5km (步行20分)</p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-orange-500 font-bold text-[12px]">¥350<span className="text-[10px] font-normal text-gray-400">/晚起</span></span>
                                      <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded">步行可达</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`} className="w-full h-24 object-cover" alt="Hotel" />
                                  <div className="p-2.5">
                                    <h5 className="font-bold text-[13px] text-gray-800 truncate">喷水池亚朵酒店</h5>
                                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> 市中心地铁站旁</p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-orange-500 font-bold text-[12px]">¥420<span className="text-[10px] font-normal text-gray-400">/晚起</span></span>
                                      <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded">吃喝便利</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Food Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Coffee size={16} className="text-purple-500"/> 散场后的夜宵江湖</p>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`} className="w-full h-20 object-cover" alt="Food" />
                                  <div className="p-2.5">
                                    <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">深夜食堂</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">留一手烤鱼</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">贵阳夜宵顶流，折耳根蘸水配烤鱼，散场必吃。</p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/丝恋.jpg`} className="w-full h-20 object-cover" alt="Food" />
                                  <div className="p-2.5">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">贵州特色</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">烙锅</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">万物皆可烙，三五好友围坐一桌，配上冰镇啤酒绝了。</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Scenic Spot Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Ticket size={16} className="text-purple-500"/> 白天去哪玩？</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 h-28">
                                  <img src={`${import.meta.env.BASE_URL}图片/miao.png`} className="absolute inset-0 w-full h-full object-cover" alt="Scenic" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h5 className="font-bold text-[13px] text-white drop-shadow-md">西江千户苗寨</h5>
                                    <p className="text-[10px] text-white/90">建议预留2天行程</p>
                                  </div>
                                </div>
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 h-28">
                                  <img src={`${import.meta.env.BASE_URL}图片/旅行记录2.jpg`} className="absolute inset-0 w-full h-full object-cover" alt="Scenic" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h5 className="font-bold text-[13px] text-white drop-shadow-md">黔灵山公园</h5>
                                    <p className="text-[10px] text-white/90">市区内，看熊猫和猕猴</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Traffic Info */}
                            <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 mt-2">
                              <p className="text-[13px] font-bold text-purple-800 mb-1 flex items-center gap-1"><Bus size={14}/> 音乐节散场接驳指南</p>
                              <p className="text-[12px] text-purple-700 leading-relaxed">
                                • <strong>地铁延时：</strong>演出期间，观山湖公园站地铁 1 号线将延时运营至 <strong>23:30</strong>。<br/>
                                • <strong>接驳大巴：</strong>每晚 22:00 演出结束后，南门出口设有免费接驳大巴直达贵阳北站及喷水池商圈。
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeSubPage.data?.type === 'series' ? (
                    <div className="space-y-4">
                      {/* Tabs */}
                      <div className="flex bg-gray-100/80 p-1 rounded-xl mb-4 overflow-x-auto scrollbar-hide">
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'schedule' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('schedule')}
                        >超级赛程</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'pre' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('pre')}
                        >赛前规划</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'mid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('mid')}
                        >现场体验</button>
                        <button 
                          className={`flex-shrink-0 px-4 py-2 text-[14px] font-bold rounded-lg transition-colors ${eventTab === 'post' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`} 
                          onClick={() => setEventTab('post')}
                        >赛后周边</button>
                      </div>

                      {/* Tab Content: Schedule */}
                      {eventTab === 'schedule' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-red-500 rounded-full"></span> 联赛赛程一览表
                          </h4>
                          <div className="space-y-4">
                            {activeSubPage.data.schedule.map((day: any, idx: number) => (
                              <div key={idx}>
                                <h5 className="text-[14px] font-bold text-gray-700 mb-2">{day.date}</h5>
                                <div className="space-y-2">
                                  {day.items.map((m: any) => (
                                    <div key={m.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-[12px] text-gray-500 font-medium">{m.time}</span>
                                        {m.type === 'show' ? (
                                          <span className="bg-pink-100 text-pink-600 text-[10px] px-1.5 py-0.5 rounded font-bold">✨ 民俗展演</span>
                                        ) : (
                                          <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold">⚽ 足球比赛</span>
                                        )}
                                      </div>
                                      {m.type === 'match' ? (
                                        <div className="flex justify-between items-center px-2 py-1">
                                          <span className="font-bold text-[14px] text-gray-800">{m.teamA}</span>
                                          <div className="text-gray-400 font-bold text-[12px] italic">VS</div>
                                          <span className="font-bold text-[14px] text-gray-800">{m.teamB}</span>
                                        </div>
                                      ) : (
                                        <div className="text-center py-1">
                                          <span className="font-bold text-[13px] text-pink-600">{m.title}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-4 text-center">* 赛程可能会根据天气情况进行微调，请以现场广播为准。</p>
                        </div>
                      )}

                      {/* Tab Content: Pre-Trip */}
                      {eventTab === 'pre' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span> 赛前：出行与住宿规划
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Traffic Info */}
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                              <p className="text-[13px] font-bold text-blue-800 mb-1 flex items-center gap-1"><Bus size={14}/> 交通出行指南</p>
                              <p className="text-[12px] text-blue-700 leading-relaxed">
                                • <strong>大交通：</strong>推荐乘坐高铁至【榕江站】，全国多地有直达班次。贵阳出发约1.5小时可达。<br/>
                                • <strong>接驳专线：</strong>出站后乘坐“村超专线”公交（约15分钟/2元）直达城北新区体育馆。<br/>
                                • <strong>贴心提示：</strong>每逢周末比赛日，榕江站外会有身着民族服饰的志愿者免费接站，并派发当地西瓜解暑。
                              </p>
                            </div>

                            {/* Accommodation Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Bed size={16} className="text-blue-500"/> 住宿推荐 (需提前抢订)</p>
                              <p className="text-[12px] text-gray-500 mb-2">村超期间县城一房难求，务必提前半个月以上预订。若县城订满，可考虑住在周边的从江县（高铁15分钟）或三都县。</p>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <img src={`${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`} className="w-full h-24 object-cover" alt="Hotel" />
                                  <div className="p-2.5">
                                    <h5 className="font-bold text-[13px] text-gray-800 truncate">榕江尚品大酒店</h5>
                                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={10} /> 距赛场 1km</p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-orange-500 font-bold text-[12px]">¥280<span className="text-[10px] font-normal text-gray-400">/晚起</span></span>
                                      <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded">步行看球</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Mid-Experience */}
                      {eventTab === 'mid' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-orange-500 rounded-full"></span> 现场：沉浸式民族大联欢
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎟️ 观赛指南</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">村超比赛<strong>全程免费，免门票</strong>。观众席分为各村啦啦队专区和散客区，建议提前2小时进场占座。场内允许携带食物和饮料，倡导“无痕观赛”。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎭 赛前入场巡游</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">各村代表队入场时，村民们会身着盛装，吹着芦笙、敲着铜鼓，肩挑当地特产（如西瓜、香羊、本地稻花鱼）绕场巡游，是一场生动的民族服饰大秀。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">💃 中场万人多耶</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">比赛中场休息期间，侗族姑娘和小伙会邀请全场观众手拉手，在球场中央围成圆圈跳起传统的“多耶舞”，现场氛围极具感染力。</p>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-1">🎁 趣味奖品发放</p>
                              <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg">单场最佳球员（MVP）的奖品通常是活生生的猪、牛、羊或本地土鸡。观众也有机会在互动环节获得榕江卷粉、牛瘪等美食券。</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: Post-Tourism */}
                      {eventTab === 'post' && (
                        <div className="bg-white rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="font-bold text-[16px] text-gray-800 flex items-center gap-2 mb-3 border-b pb-2">
                            <span className="w-1 h-4 bg-green-500 rounded-full"></span> 赛后：地道美食与周边游
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Food Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Coffee size={16} className="text-green-500"/> 榕江地道美食</p>
                              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                                    <span className="text-[20px]">🥘</span>
                                  </div>
                                  <div className="p-2.5">
                                    <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">暗黑美食</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">牛瘪火锅</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">榕江特色，爱的人爱死，恨的人一口不沾，来都来了必须挑战一下。</p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
                                  <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                                    <span className="text-[20px]">🌯</span>
                                  </div>
                                  <div className="p-2.5">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium mb-1 inline-block">过早必吃</span>
                                    <h5 className="font-bold text-[13px] text-gray-800">榕江卷粉</h5>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">皮薄馅大，蘸上秘制辣椒水，绝对是榕江最接地气的早餐。</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Scenic Spot Cards */}
                            <div>
                              <p className="text-[14px] font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Map size={16} className="text-green-500"/> 周边景点延伸游</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 h-28">
                                  <img src={`${import.meta.env.BASE_URL}图片/西江2.jpg`} className="absolute inset-0 w-full h-full object-cover" alt="Scenic" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h5 className="font-bold text-[13px] text-white drop-shadow-md">肇兴侗寨</h5>
                                    <p className="text-[10px] text-white/90">高铁一站直达(从江站)</p>
                                  </div>
                                </div>
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 h-28">
                                  <img src={`${import.meta.env.BASE_URL}图片/miao.png`} className="absolute inset-0 w-full h-full object-cover" alt="Scenic" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h5 className="font-bold text-[13px] text-white drop-shadow-md">西江千户苗寨</h5>
                                    <p className="text-[10px] text-white/90">体验苗族风情</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-2">活动详情</h4>
                      <p className="text-gray-600 text-[14px] leading-relaxed text-justify">
                        欢迎来到 {activeSubPage.data.title} 的官方信息页！请大家注意安排好出行时间，提前做好行程规划。
                      </p>
                    </div>
                  )}
                  
                  {/* Action Button Sticky Footer */}
                  <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-4 pb-8 border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
                    <button 
                      className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-500/30 active:scale-95 transition-transform flex justify-center items-center gap-2" 
                      onClick={() => { 
                        const title = activeSubPage.data.title;
                        setActiveSubPage(null); 
                        setTimeout(() => handleAsk(`我想报名参加或了解${title}`), 300);
                      }}
                    >
                      <Sparkles size={18} />
                      一键咨询管家该赛事
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center h-72 text-center mt-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles size={28} className="text-blue-500" />
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-800 mb-2">{activeSubPage.title} 服务</h3>
                  <p className="text-gray-500 text-[13px] mb-8 leading-relaxed px-4">
                    正在为您接入最新的{activeSubPage.title}相关数据系统，请稍后...
                  </p>
                  <button 
                    className="bg-[#EAF0F6] text-[#2C3E50] px-8 py-2.5 rounded-full text-[14px] font-medium active:scale-95 transition-transform" 
                    onClick={() => setActiveSubPage(null)}
                  >
                    返回对话
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}