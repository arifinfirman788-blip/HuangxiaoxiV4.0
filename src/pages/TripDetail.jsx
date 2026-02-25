import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share, MoreHorizontal, Sun, Cloud, CloudRain, Info, Plane, Train, MapPin, ChevronRight, QrCode, AlertCircle, Clock, CheckCircle2, Utensils, Hotel, Camera, Coffee, Navigation, Phone, FileText, Headphones, Ticket, Car, Sparkles, Plus, Minus, Search, Edit3, GripVertical, Map, Calendar, X, List, Layout, Wand2, Trash2, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { getPlaceholder } from '../utils/imageUtils';

// Import avatars
import ScenicAvatar from '../image/huangguoshu.png';
import HotelAvatar from '../image/jiudian.png';
import GuideAvatar from '../image/daoyou.png';
import FoodAvatar from '../image/wangayi.png';

const getStatusInfo = (status) => {
  switch(status) {
    case 'arrived': case 'completed': return { label: '已完成', color: 'text-slate-400 bg-slate-100' };
    case 'ongoing': return { label: '进行中', color: 'text-blue-600 bg-blue-50' };
    default: return { label: '未开始', color: 'text-orange-600 bg-orange-50' };
  }
};

const getServiceButtons = (type, details) => {
  if (details?.flightNo === '自驾') {
     return [
        { label: '开始导航', icon: Navigation, primary: true, color: 'bg-blue-600 text-white shadow-blue-200' },
        { label: '查看路况', icon: Map, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' },
        { label: '周边停车场', icon: Car, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
     ];
  }

  switch(type) {
    case 'flight': case 'transport':
      return [
        { label: '值机选座', icon: CheckCircle2, primary: true, color: 'bg-blue-600 text-white shadow-blue-200' },
        { label: '打车前往', icon: Car, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' },
        { label: '改签退票', icon: FileText, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
      ];
    case 'hotel':
      return [
        { label: '查看房型', icon: Hotel, primary: true, color: 'bg-indigo-600 text-white shadow-indigo-200' },
        { label: '联系前台', icon: Phone, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' },
        { label: '一键续住', icon: Clock, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
      ];
    case 'scenic':
      return [
        { label: '购买门票', icon: Ticket, primary: true, color: 'bg-green-600 text-white shadow-green-200' },
        { label: '语音导览', icon: Headphones, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' },
        { label: '周边服务', icon: Map, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
      ];
    case 'food':
      return [
        { label: '立即订座', icon: Utensils, primary: true, color: 'bg-orange-500 text-white shadow-orange-200' },
        { label: '在线排号', icon: List, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' },
        { label: '查看菜单', icon: FileText, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
      ];
    case 'group_meal':
      return [
        { label: '查看菜单', icon: FileText, primary: true, color: 'bg-orange-600 text-white shadow-orange-200' },
        { label: '联系领队', icon: Phone, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
      ];
    case 'free_time':
      return [
        { label: '周边推荐', icon: MapPin, primary: true, color: 'bg-teal-600 text-white shadow-teal-200' },
        { label: '打车前往', icon: Car, primary: false, color: 'bg-white text-slate-600 border border-slate-200 shadow-sm' }
      ];
    default:
      return [{ label: '查看详情', icon: ArrowRight, primary: true, color: 'bg-slate-900 text-white shadow-slate-200' }];
  }
};

const AIPlanningModal = ({ isOpen, onClose, onConfirm }) => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full sm:w-[90%] sm:max-w-md sm:rounded-2xl rounded-t-[2rem] p-6 pointer-events-auto relative z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
               <Wand2 size={16} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">AI 智能规划</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
           <p className="text-sm text-slate-500 leading-relaxed">
             请告诉小西您的今日起止点，AI将结合您的已有行程，为您智能规划合理路线。
           </p>
           
           <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                 <input 
                   type="text" 
                   placeholder="今日起点 (如: 酒店名称)" 
                   className="flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 border-none outline-none"
                   value={startPoint}
                   onChange={(e) => setStartPoint(e.target.value)}
                 />
              </div>
              <div className="w-full h-px bg-slate-200 ml-5" />
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                 <input 
                   type="text" 
                   placeholder="今日终点 (如: 机场/下一站)" 
                   className="flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 border-none outline-none"
                   value={endPoint}
                   onChange={(e) => setEndPoint(e.target.value)}
                 />
              </div>
           </div>
        </div>

        <button 
          onClick={() => onConfirm(startPoint, endPoint)}
          disabled={!startPoint || !endPoint}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
        >
          <Wand2 size={16} />
          开始智能规划
        </button>
      </motion.div>
    </div>
  );
};

const AddSpotModal = ({ isOpen, onClose, onAdd, days, currentDayIndex }) => {
  const [customData, setCustomData] = useState({ 
    name: '', 
    type: 'scenic', 
    desc: '', 
    time: '10:00',
    dayIndex: currentDayIndex 
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock database for search
  const mockPlaces = [
    { name: '黄果树瀑布', type: 'scenic', address: '安顺市关岭布依族苗族自治县', desc: '亚洲第一大瀑布' },
    { name: '甲秀楼', type: 'scenic', address: '贵阳市南明区翠微巷', desc: '贵阳地标建筑' },
    { name: '青岩古镇', type: 'scenic', address: '贵阳市花溪区', desc: '四大古镇之一' },
    { name: '丝恋红汤丝娃娃', type: 'food', address: '贵阳市云岩区', desc: '贵州特色美食' },
    { name: '老凯俚酸汤鱼', type: 'food', address: '贵阳市南明区', desc: '正宗酸汤鱼' },
    { name: '桔子水晶酒店', type: 'hotel', address: '贵阳市中心', desc: '舒适型酒店' },
    { name: '贵阳北站', type: 'transport', address: '贵阳市观山湖区', desc: '高铁站' },
    { name: '龙洞堡机场', type: 'transport', address: '贵阳市南明区', desc: '国际机场' },
    { name: '小车河湿地公园', type: 'scenic', address: '贵阳市南明区', desc: '城市湿地' },
    { name: '花溪夜郎谷', type: 'scenic', address: '贵阳市花溪区', desc: '石头城堡' },
  ];

  useEffect(() => {
    if (customData.name.trim()) {
      const results = mockPlaces.filter(place => 
        place.name.includes(customData.name) || place.address.includes(customData.name)
      );
      setSearchResults(results);
      // setShowDropdown(true); // Removed to avoid re-opening after selection
    } else {
      setSearchResults([]);
    }
  }, [customData.name]);

  if (!isOpen) return null;

  const handleSelectPlace = (place) => {
    setCustomData({
      ...customData,
      name: place.name,
      type: place.type,
      desc: place.desc || place.address
    });
    setShowDropdown(false);
  };

  const handleConfirm = () => {
    if (!customData.name) return;

    const newSpot = {
      id: Date.now(),
      time: customData.time || "12:00",
      title: customData.name,
      type: customData.type,
      status: "planned",
      details: {
        name: customData.name,
        desc: customData.desc || "用户自定义添加"
      }
    };
    // Pass dayIndex along with the spot data
    onAdd(newSpot, parseInt(customData.dayIndex));
    onClose();
    setCustomData({ name: '', type: 'scenic', desc: '', time: '10:00', dayIndex: currentDayIndex });
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full sm:w-[90%] sm:max-w-md sm:rounded-2xl rounded-t-[2rem] p-6 pointer-events-auto relative z-10 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">添加行程节点</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-3">
            {/* Row 1: Type, Time, Day */}
            <div className="flex gap-3">
               <select 
                  className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none appearance-none"
                  value={customData.type}
                  onChange={(e) => setCustomData({...customData, type: e.target.value})}
               >
                  <option value="scenic">景点</option>
                  <option value="food">餐饮</option>
                  <option value="hotel">住宿</option>
                  <option value="transport">交通</option>
                  <option value="custom">自定义活动</option>
               </select>
               <input 
                  type="time" 
                  className="w-24 px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none"
                  value={customData.time}
                  onChange={(e) => setCustomData({...customData, time: e.target.value})}
               />
               <select 
                  className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none appearance-none"
                  value={customData.dayIndex}
                  onChange={(e) => setCustomData({...customData, dayIndex: e.target.value})}
               >
                  {days.map((day, index) => (
                    <option key={index} value={index}>{day.dayLabel}</option>
                  ))}
               </select>
            </div>

            {/* Row 2: Name Input with Search Dropdown */}
            <div className="relative">
                <input 
                  type="text" 
                  placeholder="地点/活动名称" 
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 border-none outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  value={customData.name}
                  onChange={(e) => {
                    setCustomData({...customData, name: e.target.value});
                    if (e.target.value.trim()) setShowDropdown(true);
                    else setShowDropdown(false);
                  }}
                  onFocus={() => {
                    if (customData.name && searchResults.length > 0) setShowDropdown(true);
                  }}
                />
                
                {/* Search Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-[200px] overflow-y-auto z-20">
                     {searchResults.map((result, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleSelectPlace(result)}
                          className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-50 last:border-none"
                        >
                           <div>
                              <div className="font-bold text-slate-800 text-sm">{result.name}</div>
                              <div className="text-[10px] text-slate-400">{result.address}</div>
                           </div>
                           <div className="text-[10px] font-bold px-2 py-1 bg-slate-50 rounded text-slate-500">
                              {result.type === 'scenic' ? '景点' : result.type === 'food' ? '美食' : result.type === 'hotel' ? '酒店' : '交通'}
                           </div>
                        </div>
                     ))}
                  </div>
                )}
            </div>

            <textarea 
              placeholder="备注说明 (选填)" 
              className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-800 border-none outline-none resize-none h-24 focus:ring-2 focus:ring-slate-200 transition-all"
              value={customData.desc}
              onChange={(e) => setCustomData({...customData, desc: e.target.value})}
            />
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!customData.name}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          确认添加
        </button>
      </motion.div>
    </div>
  );
};

const TripDetail = ({ adoptedTrip }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'daily'
  const [activeTab, setActiveTab] = useState('all'); // For overview filtering
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [isAIPlanningOpen, setIsAIPlanningOpen] = useState(false);
  
  // Initialize state with default or adopted trip
  const [trip, setTrip] = useState(() => {
    const baseTrip = (adoptedTrip && adoptedTrip.itinerary) ? adoptedTrip : {
        title: "贵阳市经典路线3日游",
        days: 3,
        itinerary: [
          {
            date: "12月11日",
            dayLabel: "Day 1",
            tag: "抵达日",
            weather: { temp: "12°C - 18°C", desc: "多云转晴", icon: Cloud },
            highlights: "抵达贵阳 — 特色早餐 — 文昌阁 — 甲秀楼夜景",
            tips: "为您监控到今日进港航班流量较大，建议下机后直接使用下方「一键叫车」服务。",
            timeline: [
              { 
                  time: "08:00", 
                  title: "航班抵达", 
                  type: "flight", 
                  status: "arrived", 
                  tips: "建议提前2小时到达机场。", 
                  details: { 
                      flightNo: "CZ3685", 
                      dep: "北京大兴", 
                      arr: "龙洞堡T2", 
                      depTime: "06:00", 
                      arrTime: "08:10", 
                      status: "飞行中", 
                      desc: "预计提前10分钟抵达",
                      punctuality: "95%"
                  } 
              },
              { 
                  time: "09:30", 
                  title: "早餐·糯米饭", 
                  type: "food", 
                  status: "upcoming", 
                  tips: "这家店排队人较多。", 
                  image: getPlaceholder(400, 300, 'Breakfast'), 
                  details: { 
                      name: "六广门毛阿姨糯米饭", 
                      desc: "距离下个节点 2.5km",
                      cuisine: "贵阳小吃",
                      price: "12",
                      score: "4.8",
                      mustEat: "招牌糯米饭, 脆哨",
                      avoid: "排队较久"
                  } 
              },
              { 
                  time: "14:00", 
                  title: "文昌阁", 
                  type: "scenic", 
                  status: "upcoming", 
                  tips: "阁楼内楼梯较陡。", 
                  image: getPlaceholder(400, 300, 'Attraction'), 
                  details: { 
                      name: "文昌阁", 
                      desc: "游玩时长约 1.5 小时",
                      level: "3A",
                      openTime: "09:00-18:00",
                      price: "免费",
                      reasons: "古城墙遗址，俯瞰南明河",
                      photoSpot: "城墙转角处"
                  } 
              }
            ]
          },
          {
            date: "12月12日",
            dayLabel: "Day 2",
            tag: "文化探索",
            weather: { temp: "10°C - 15°C", desc: "小雨", icon: CloudRain },
            highlights: "黔灵山公园 — 团队午餐 — 自由活动",
            tips: "今日有小雨，出行请记得携带雨具。",
            timeline: [
              { 
                  time: "08:30", 
                  title: "自驾前往", 
                  type: "transport", 
                  status: "planned", 
                  tips: "早高峰路况拥堵，建议提前出发。", 
                  image: null, 
                  details: { 
                      name: "自驾出行", 
                      desc: "前往黔灵山公园", 
                      flightNo: "自驾", 
                      start: "酒店", 
                      end: "黔灵山公园", 
                      duration: "30m" 
                  } 
              },
              { 
                  time: "09:00", 
                  title: "黔灵山公园", 
                  type: "scenic", 
                  status: "planned", 
                  tips: "公园内猴子较多。", 
                  image: getPlaceholder(400, 300, 'Park'), 
                  details: { 
                      name: "黔灵山公园", 
                      desc: "游玩时长约 3 小时",
                      level: "4A",
                      openTime: "07:00-20:00",
                      price: "¥5",
                      reasons: "黔南第一山，性价比极高",
                      photoSpot: "弘福寺观景台"
                  } 
              },
              { 
                  time: "12:30", 
                  title: "团队午餐", 
                  type: "group_meal", 
                  status: "planned", 
                  tips: "请按桌号入座，禁止饮酒。", 
                  image: getPlaceholder(400, 300, 'GroupMeal'), 
                  details: { 
                      name: "黔灵山庄·团队餐厅", 
                      desc: "标准团餐",
                      standard: "50元/人",
                      menu: "八菜一汤，含特色酸汤鱼",
                      tableNo: "A1-A5",
                      seats: "10人/桌"
                  } 
              },
              { 
                  time: "14:00", 
                  title: "自由活动", 
                  type: "free_time", 
                  status: "planned", 
                  tips: "推荐前往附近的甲秀楼或亨特国际购物中心。", 
                  image: null, 
                  details: { 
                      name: "自由活动时间", 
                      desc: "自由安排约 3 小时",
                      duration: "3h",
                      location: "南明区中心",
                      gatheringTime: "17:30",
                      gatheringPoint: "亨特国际广场正门"
                  } 
              }
            ]
          },
          {
            date: "12月13日",
            dayLabel: "Day 3",
            tag: "返程日",
            weather: { temp: "11°C - 17°C", desc: "晴", icon: Sun },
            highlights: "青岩古镇 — 状元蹄 — 送机",
            tips: "古镇石板路较多，建议穿着舒适的鞋子。",
            timeline: [
              { 
                  time: "10:00", 
                  title: "青岩古镇", 
                  type: "scenic", 
                  status: "planned", 
                  tips: "建议穿着舒适的运动鞋。", 
                  image: getPlaceholder(400, 300, 'Ancient Town'), 
                  details: { 
                      name: "青岩古镇", 
                      desc: "游玩时长约 4 小时",
                      level: "5A",
                      openTime: "08:30-17:00",
                      price: "¥10 (门票)",
                      reasons: "四大古镇之一，建筑保存完好",
                      photoSpot: "定广门城楼"
                  } 
              },
              { 
                  time: "16:00", 
                  title: "高铁返程", 
                  type: "transport", 
                  status: "planned", 
                  tips: "请检查随身物品，提前30分钟进站。", 
                  image: null, 
                  details: { 
                      name: "高铁出行", 
                      desc: "贵阳北站 - 广州南站", 
                      flightNo: "G2986", 
                      start: "贵阳北站", 
                      end: "广州南站", 
                      duration: "4h 30m" 
                  } 
              }
            ]
          }
        ]
    };
    return baseTrip;
  });

  // Sync state with prop
  useEffect(() => {
    if (adoptedTrip && adoptedTrip.itinerary) {
      setTrip(adoptedTrip);
    }
  }, [adoptedTrip]);

  const getAgentInfo = (type) => {
    switch(type) {
      case 'scenic': return { name: '景区智慧服务·景区智能体', icon: Camera, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-100', avatar: ScenicAvatar, tag: '景点导览', headerBg: 'bg-purple-50/50', border: 'border-purple-100' };
      case 'hotel': return { name: '酒店住宿服务·酒店智能体', icon: Hotel, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', avatar: HotelAvatar, tag: '贴心管家', headerBg: 'bg-blue-50/50', border: 'border-blue-100' };
      case 'food': return { name: '美食餐饮服务·美食智能体', icon: Utensils, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100', avatar: FoodAvatar, tag: '美食推荐', headerBg: 'bg-orange-50/50', border: 'border-orange-100' };
    case 'group_meal': return { name: '团餐服务·餐饮智能体', icon: Utensils, color: 'text-orange-800', bgColor: 'bg-orange-100', borderColor: 'border-orange-200', avatar: FoodAvatar, tag: '团队用餐', headerBg: 'bg-orange-100/50', border: 'border-orange-200' };
    case 'transport': return { name: '交通出行服务·交通智能体', icon: Car, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-100', avatar: GuideAvatar, tag: '行程规划', headerBg: 'bg-green-50/50', border: 'border-green-100' };
    case 'flight': return { name: '民航运行中心·交通智能体', icon: Plane, color: 'text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', avatar: GuideAvatar, tag: '实时监控航路', headerBg: 'bg-blue-50/50', border: 'border-blue-100' };
    case 'free_time': return { name: '自由活动·行程助手', icon: Coffee, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-100', avatar: GuideAvatar, tag: '自由探索', headerBg: 'bg-teal-50/50', border: 'border-teal-100' };
    default: return { name: '行程助手', icon: MapPin, color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-100', avatar: GuideAvatar, tag: '旅行助手', headerBg: 'bg-slate-50/50', border: 'border-slate-100' };
  }
};

  const handleAddDay = () => {
    const newDayIndex = trip.itinerary.length + 1;
    const newDay = {
      date: `Day ${newDayIndex}`, // Placeholder date
      dayLabel: `Day ${newDayIndex}`,
      tag: "新行程",
      weather: { temp: "20°C", desc: "晴", icon: Sun },
      highlights: "点击添加行程亮点",
      timeline: []
    };
    setTrip({
      ...trip,
      days: trip.days + 1,
      itinerary: [...trip.itinerary, newDay]
    });
    // Scroll to the new day in daily view
    setSelectedDayIndex(newDayIndex - 1);
  };

  const handleDeleteDay = (indexToDelete) => {
    if (trip.itinerary.length <= 1) {
      // alert("至少保留一天行程"); // Using UI feedback instead or just prevent action
      return;
    }
    
    // Filter out the day
    const newItinerary = trip.itinerary.filter((_, index) => index !== indexToDelete);
    
    // Re-label days sequentially
    const updatedItinerary = newItinerary.map((day, index) => ({
        ...day,
        dayLabel: `Day ${index + 1}`
    }));

    setTrip({
        ...trip,
        days: trip.days - 1,
        itinerary: updatedItinerary
    });

    // Adjust selected index if needed
    if (selectedDayIndex >= updatedItinerary.length) {
        setSelectedDayIndex(Math.max(0, updatedItinerary.length - 1));
    } else if (selectedDayIndex > indexToDelete) {
        setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  const handleDayUpdate = (index, field, value) => {
    const newItinerary = [...trip.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleTimelineReorder = (newTimeline) => {
    const newItinerary = [...trip.itinerary];
    newItinerary[selectedDayIndex] = { ...newItinerary[selectedDayIndex], timeline: newTimeline };
    setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleAddSpot = (newSpot, dayIndex) => {
     const targetDayIndex = dayIndex !== undefined ? dayIndex : selectedDayIndex;
     const newItinerary = [...trip.itinerary];
     newItinerary[targetDayIndex].timeline.push(newSpot);
     // Simple sort by time (optional, but good for UX)
     newItinerary[targetDayIndex].timeline.sort((a, b) => a.time.localeCompare(b.time));
     setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleDeleteNode = (nodeId) => {
    const newItinerary = [...trip.itinerary];
    newItinerary[selectedDayIndex].timeline = newItinerary[selectedDayIndex].timeline.filter(
        node => (node.id || node.time + node.title) !== nodeId
    );
    setTrip({ ...trip, itinerary: newItinerary });
  };

  const handleAIPlanning = (start, end) => {
    setIsAIPlanningOpen(false);
    
    // Sanitize itinerary to remove non-serializable data (like React components/icons)
    const sanitizedItinerary = trip.itinerary.map(day => ({
        ...day,
        weather: { 
            temp: day.weather.temp, 
            desc: day.weather.desc 
            // Exclude icon component
        },
        timeline: day.timeline.map(node => ({
            ...node,
            // Ensure no circular refs or non-serializable fields
        }))
    }));

    // Navigate to ChatPlanning with context
    navigate('/chat-planning', { 
        state: { 
            mode: 'day_planning',
            dayIndex: selectedDayIndex,
            currentItinerary: sanitizedItinerary,
            startPoint: start,
            endPoint: end,
            tripId: id
        } 
    });
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="pt-12 pb-4 px-4 flex items-center justify-between bg-white border-b border-slate-100 z-[60] relative">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-800" />
        </button>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
           <button 
            onClick={() => setViewMode('overview')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${viewMode === 'overview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            <Map size={14} /> 总览
          </button>
          <button 
            onClick={() => setViewMode('daily')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${viewMode === 'daily' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
           >
             <Layout size={14} /> 每日
           </button>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <MoreHorizontal size={20} className="text-slate-800" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 relative">
        
        {/* OVERVIEW MODE */}
        {viewMode === 'overview' && (
          <>
            {/* Map Placeholder - Always Visible in Overview */}
            <div className="w-full h-48 bg-slate-200 relative mb-4 group cursor-pointer overflow-hidden">
               <img 
                 src={getPlaceholder(800, 400, 'Map Overview')} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                 alt="Trip Map" 
               />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-slate-800">
                     <Map size={16} className="text-blue-600" />
                     查看路线地图
                  </div>
               </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white px-4 pb-4 pt-2 sticky top-0 z-40 shadow-sm">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {[{ id: 'all', label: '全部' }, { id: 'transport', label: '交通' }, { id: 'food', label: '餐饮' }, { id: 'scenic', label: '景点' }, { id: 'hotel', label: '住宿' }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-8">
              {trip.itinerary.map((day, index) => (
                <div key={index} className="space-y-6" id={`day-${index}`}>
                  {/* Date Header */}
                  <div className="flex items-center justify-between sticky z-30 py-3 bg-slate-50/95 backdrop-blur-sm -mx-4 px-4 shadow-sm border-b border-slate-100 transition-all" style={{ top: `${0 + (index * 60)}px` }}>
                     <div className="flex items-center gap-3">
                       <h1 className="text-2xl font-black text-slate-800 italic tracking-tight">{day.dayLabel}</h1>
                       <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md">{day.tag}</span>
                     </div>
                     <span className="text-xs font-bold text-slate-400">{day.date}</span>
                  </div>

                  {/* Timeline */}
                  <div className="relative space-y-8 pl-4">
                     <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-slate-200" />
                     {day.timeline.filter(t => activeTab === 'all' || t.type === activeTab).map((node, nodeIndex) => {
                       const agent = getAgentInfo(node.type);
                       const statusInfo = getStatusInfo(node.status);
                       const serviceButtons = getServiceButtons(node.type, node.details);
                       
                       return (
                         <div key={nodeIndex} className="relative">
                            <div className={`absolute -left-[5px] top-0 w-3 h-3 rounded-full ring-4 ring-white z-10 ${node.status === 'arrived' || node.status === 'completed' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                            <div className="flex justify-between items-center mb-3 pl-6">
                               <div className="flex items-center gap-3">
                                   <span className="text-sm font-bold text-slate-400 font-mono">{node.time}</span>
                                   <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${agent.bgColor} ${agent.color} border ${agent.borderColor}`}>
                                      <agent.icon size={10} />
                                      {agent.name.split('·')[1] || agent.name}
                                   </div>
                               </div>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                                  {statusInfo.label}
                               </span>
                            </div>
                            <div className="ml-6">
                              <div onClick={() => navigate('/chat-planning', { state: { nodeContext: node } })} className={`bg-white rounded-[2rem] p-4 shadow-sm border ${agent.border} overflow-hidden cursor-pointer active:scale-98 transition-transform`}>
                                 {/* 1. Header: H3 Theme Name + Rating */}
                                 <div className="flex justify-between items-start mb-3 pb-2 border-b border-slate-50">
                                    <div className="flex flex-col gap-1">
                                       <h3 className="font-bold text-sm text-slate-800">
                                          {(node.type === 'flight' || node.type === 'transport') && node.details.flightNo 
                                            ? node.details.flightNo 
                                            : (node.details.name || node.title)}
                                       </h3>
                                       {(node.type === 'flight' || node.type === 'transport') ? (
                                           <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                               <span>{node.details.dep || '出发地'}</span>
                                               <ArrowRight size={8} />
                                               <span>{node.details.arr || '目的地'}</span>
                                           </div>
                                       ) : (
                                           <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-0.5">
                                                 {[1,2,3,4,5].map(i => <Star key={i} size={8} className={`text-orange-400 ${i <= Math.round(parseFloat(node.details.score || 4.8)) ? 'fill-orange-400' : ''}`} />)}
                                              </div>
                                              <span className="text-[10px] font-bold text-slate-600">{node.details.score || '4.8'}</span>
                                              <span className="text-[9px] text-slate-300">|</span>
                                              <span className="text-[9px] text-slate-400">
                                                {node.type === 'food' ? `¥${node.details.price || '88'}/人` : (node.details.price || '¥88')}
                                              </span>
                                           </div>
                                       )}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                       node.type === 'flight' || node.type === 'transport' ? 'bg-blue-50 text-blue-600' :
                                       node.type === 'food' ? 'bg-orange-50 text-orange-600' :
                                       node.type === 'hotel' ? 'bg-indigo-50 text-indigo-600' :
                                       'bg-green-50 text-green-600'
                                    }`}>
                                       {node.type === 'flight' ? '航班' : 
                                        node.type === 'transport' ? '交通' : 
                                        node.type === 'food' ? '餐饮' : 
                                        node.type === 'hotel' ? '酒店' : '景点'}
                                    </span>
                                 </div>

                                 {/* 2. Middle: Left Image | Right Info */}
                                 <div className="flex gap-3 mb-3">
                                    {/* Left: Image */}
                                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                                       {node.image ? (
                                          <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
                                       ) : (
                                          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                             {node.type === 'flight' ? <Plane size={24} /> : <Camera size={20} />}
                                          </div>
                                       )}
                                    </div>

                                    {/* Right: Address + Tags */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                       <div className="space-y-1.5">
                                          <div className="flex items-start gap-1 text-[10px] text-slate-500">
                                             <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                             <span className="line-clamp-2">{node.details.desc || '贵州省贵阳市...'}</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                             {((node.type === 'flight' || node.type === 'transport') 
                                                ? ['准点率95%', '经济舱', '有餐食'] 
                                                : ['必打卡', '好评如潮', '老字号']
                                             ).map((tag, i) => (
                                                <span key={i} className="text-[8px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">{tag}</span>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* 3. TIPS Section */}
                                 {node.tips && (
                                    <div className="bg-orange-50/50 rounded-lg p-2.5 mb-3 flex gap-2 items-start border border-orange-100/50">
                                       <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
                                       <div className="text-[10px] text-slate-600 leading-relaxed">
                                          <span className="font-bold text-orange-600">黄小西Tips：</span>
                                          {node.tips}
                                       </div>
                                    </div>
                                 )}

                                 {/* 4. Footer Service Buttons */}
                                 <div className="grid grid-cols-3 gap-2">
                                     {serviceButtons.map((btn, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            className={`py-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${btn.color} ${serviceButtons.length === 1 ? 'col-span-3 flex-row py-3 text-xs' : ''}`}
                                        >
                                            <btn.icon size={serviceButtons.length === 1 ? 14 : 16} />
                                            {btn.label}
                                        </button>
                                     ))}
                                 </div>
                              </div>
                            </div>
                         </div>
                       );
                     })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DAILY MODE */}
        {viewMode === 'daily' && (
           <div className="flex flex-col min-h-full">
              {/* Day Selector */}
              <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
                 <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-3">
                    {trip.itinerary.map((day, index) => (
                       <div key={index} className="relative group">
                          <button
                             onClick={() => setSelectedDayIndex(index)}
                             className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                selectedDayIndex === index 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                                : 'bg-white text-slate-500 border-slate-200'
                             }`}
                          >
                             {day.dayLabel}
                          </button>
                          {isDeleteMode && trip.itinerary.length > 1 && (
                             <button
                                onClick={(e) => {
                                   e.stopPropagation();
                                   handleDeleteDay(index);
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white shadow-sm z-10 hover:bg-red-600 transition-colors"
                             >
                                <X size={10} />
                             </button>
                          )}
                       </div>
                    ))}
                    <div className="flex items-center gap-2 flex-shrink-0">
                       <button 
                          onClick={handleAddDay}
                          className="w-10 h-9 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                       >
                          <Plus size={16} />
                       </button>
                       <button 
                          onClick={() => setIsDeleteMode(!isDeleteMode)}
                          className={`w-10 h-9 flex items-center justify-center rounded-xl border border-dashed transition-colors ${
                             isDeleteMode 
                             ? 'border-red-400 bg-red-50 text-red-500' 
                             : 'border-slate-300 text-slate-400 hover:bg-slate-50 hover:border-slate-400'
                          }`}
                       >
                          <Minus size={16} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Editable Day Header */}
              <div className="px-6 py-6 bg-white mb-2">
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                       <input 
                          type="text" 
                          value={trip.itinerary[selectedDayIndex].dayLabel}
                          onChange={(e) => handleDayUpdate(selectedDayIndex, 'dayLabel', e.target.value)}
                          className="text-3xl font-black text-slate-800 italic tracking-tight bg-transparent border-none outline-none w-full placeholder-slate-300"
                       />
                       <input 
                          type="text" 
                          value={trip.itinerary[selectedDayIndex].tag}
                          onChange={(e) => handleDayUpdate(selectedDayIndex, 'tag', e.target.value)}
                          className="mt-1 text-sm font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border-none outline-none w-auto inline-block"
                       />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-purple-50 hover:text-purple-500 transition-colors hidden" onClick={() => setIsAIPlanningOpen(true)}>
                       <Wand2 size={20} />
                    </div>
                 </div>
                 
                 {/* Reorderable List */}
                 <Reorder.Group 
                    axis="y" 
                    values={trip.itinerary[selectedDayIndex].timeline} 
                    onReorder={handleTimelineReorder}
                    className="space-y-3"
                 >
                    {trip.itinerary[selectedDayIndex].timeline.map((node) => {
                       // Need a stable ID for reorder
                       const itemKey = node.id || node.time + node.title; 
                       const agent = getAgentInfo(node.type);
                       const statusInfo = getStatusInfo(node.status);
                       const serviceButtons = getServiceButtons(node.type);
                       
                       return (
                         <Reorder.Item key={itemKey} value={node} className="relative mb-6 group">
                            {/* Delete Button Layer */}
                            <div className="absolute right-0 top-[40px] bottom-0 w-20 flex items-center justify-center bg-red-100 rounded-r-[2rem] z-0">
                                <button 
                                    onClick={() => handleDeleteNode(itemKey)}
                                    className="w-full h-full flex items-center justify-center text-red-600 hover:bg-red-200 rounded-r-[2rem] transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {/* Time Display */}
                            <div className="flex items-center justify-between mb-3 px-1 relative z-20 pointer-events-none">
                               <div className="flex items-center gap-3">
                                   <span className="text-xl font-bold text-slate-400 font-mono tracking-wider">{node.time}</span>
                                   <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${agent.bgColor} ${agent.color} border ${agent.borderColor}`}>
                                      <agent.icon size={10} />
                                      {agent.name.split('·')[1] || agent.name}
                                   </div>
                               </div>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                                  {statusInfo.label}
                               </span>
                            </div>

                            <motion.div 
                               drag="x"
                               dragConstraints={{ left: -80, right: 0 }}
                               dragElastic={0.1}
                               onClick={() => navigate('/chat-planning', { state: { nodeContext: node } })}
                               className={`bg-white rounded-[2rem] p-4 shadow-sm border ${agent.border} overflow-hidden relative z-10 cursor-pointer active:scale-98 transition-transform`}
                               style={{ touchAction: "pan-y" }}
                            >
                               {/* 1. Header: H3 Theme Name + Rating */}
                               <div className="flex justify-between items-start mb-3 pb-2 border-b border-slate-50">
                                  <div className="flex flex-col gap-1">
                                     <h3 className="font-bold text-sm text-slate-800">
                                        {(node.type === 'flight' || node.type === 'transport') && node.details.flightNo 
                                          ? node.details.flightNo 
                                          : (node.details.name || node.title)}
                                     </h3>
                                     
                                     {/* Sub-header Info Line */}
                                     <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                        {(node.type === 'flight' || node.type === 'transport') ? (
                                            <>
                                                <span>{node.details.dep || '出发地'}</span>
                                                <ArrowRight size={8} />
                                                <span>{node.details.arr || '目的地'}</span>
                                            </>
                                        ) : node.type === 'group_meal' ? (
                                            <>
                                                <span className="text-orange-600 font-bold">{node.details.standard || '团餐标准'}</span>
                                                <span className="text-slate-300">|</span>
                                                <span>{node.details.seats || '10人/桌'}</span>
                                            </>
                                        ) : node.type === 'free_time' ? (
                                            <>
                                                <span className="bg-teal-50 text-teal-600 px-1.5 rounded font-bold">{node.details.duration || '2h'}</span>
                                                <span>{node.details.location || '自由活动区域'}</span>
                                            </>
                                        ) : (
                                            <>
                                               <div className="flex items-center gap-0.5">
                                                  {[1,2,3,4,5].map(i => <Star key={i} size={8} className={`text-orange-400 ${i <= Math.round(parseFloat(node.details.score || 4.8)) ? 'fill-orange-400' : ''}`} />)}
                                               </div>
                                               <span className="font-bold text-slate-600">{node.details.score || '4.8'}</span>
                                               {node.details.level && (
                                                  <>
                                                    <span className="text-slate-300">|</span>
                                                    <span className="font-bold text-blue-600">{node.details.level}</span>
                                                  </>
                                               )}
                                               {node.details.price && (
                                                  <>
                                                    <span className="text-slate-300">|</span>
                                                    <span>
                                                      {node.type === 'food' ? `¥${node.details.price}/人` : node.details.price}
                                                    </span>
                                                  </>
                                               )}
                                            </>
                                        )}
                                     </div>
                                  </div>
                                  
                                  {/* Type Badge */}
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                     node.type === 'flight' || node.type === 'transport' ? 'bg-blue-50 text-blue-600' :
                                     node.type === 'food' ? 'bg-orange-50 text-orange-600' :
                                     node.type === 'group_meal' ? 'bg-orange-100 text-orange-800' :
                                     node.type === 'hotel' ? 'bg-indigo-50 text-indigo-600' :
                                     node.type === 'free_time' ? 'bg-teal-50 text-teal-600' :
                                     'bg-green-50 text-green-600'
                                  }`}>
                                     {node.type === 'flight' ? '航班' : 
                                      node.type === 'transport' ? '交通' : 
                                      node.type === 'food' ? '餐饮' : 
                                      node.type === 'group_meal' ? '团餐' :
                                      node.type === 'hotel' ? '酒店' : 
                                      node.type === 'free_time' ? '自由活动' : '景点'}
                                  </span>
                               </div>

                               {/* 2. Middle: Left Image | Right Info */}
                               <div className="flex gap-3 mb-3">
                                  {/* Left: Image (Hidden for free_time if no image) */}
                                  {node.type !== 'free_time' && (
                                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                                         {node.image ? (
                                            <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
                                         ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                               {node.type === 'flight' ? <Plane size={24} /> : 
                                                node.type === 'group_meal' ? <Utensils size={24} /> :
                                                <Camera size={20} />}
                                            </div>
                                         )}
                                      </div>
                                  )}

                                  {/* Right: Address + Tags */}
                                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                     <div className="space-y-1.5">
                                        {/* Description / Address */}
                                        <div className="flex items-start gap-1 text-[10px] text-slate-500">
                                           {node.type === 'free_time' ? (
                                               <div className="flex flex-col gap-1 w-full">
                                                   <div className="flex items-center gap-1">
                                                       <Clock size={12} className="shrink-0 text-teal-500" />
                                                       <span className="font-bold text-slate-700">集合时间：{node.details.gatheringTime || '待定'}</span>
                                                   </div>
                                                   <div className="flex items-center gap-1">
                                                       <MapPin size={12} className="shrink-0 text-teal-500" />
                                                       <span>{node.details.gatheringPoint || '待定'}</span>
                                                   </div>
                                               </div>
                                           ) : node.type === 'group_meal' ? (
                                               <div className="flex flex-col gap-1 w-full">
                                                   <div className="flex items-center gap-1">
                                                       <Utensils size={12} className="shrink-0 text-orange-500" />
                                                       <span className="font-bold text-slate-700">餐标：{node.details.menu || '标准团餐'}</span>
                                                   </div>
                                                   <div className="flex items-center gap-1">
                                                       <MapPin size={12} className="shrink-0 text-orange-500" />
                                                       <span>桌号：{node.details.tableNo || '待定'}</span>
                                                   </div>
                                               </div>
                                           ) : (
                                               <>
                                                   <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                                   <span className="line-clamp-2">{node.details.desc || '贵州省贵阳市...'}</span>
                                               </>
                                           )}
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1">
                                           {((node.type === 'flight' || node.type === 'transport') 
                                              ? ['准点率95%', '经济舱', '有餐食'] 
                                              : node.type === 'group_meal'
                                              ? ['特色菜', '十人一桌', '禁酒']
                                              : node.type === 'free_time'
                                              ? ['自由购物', '拍照打卡', '自行解散']
                                              : node.type === 'hotel'
                                              ? ['含早', '无窗', '大床']
                                              : ['必打卡', '好评如潮', '老字号']
                                           ).map((tag, i) => (
                                              <span key={i} className="text-[8px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">{tag}</span>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               {/* 3. TIPS Section */}
                               {node.tips && (
                                  <div className="bg-orange-50/50 rounded-lg p-2.5 mb-3 flex gap-2 items-start border border-orange-100/50">
                                     <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
                                     <div className="text-[10px] text-slate-600 leading-relaxed">
                                        <span className="font-bold text-orange-600">黄小西Tips：</span>
                                        {node.tips}
                                     </div>
                                  </div>
                               )}

                               {/* 4. Footer Service Buttons */}
                               <div className="grid grid-cols-3 gap-2">
                                   {serviceButtons.map((btn, idx) => (
                                      <button
                                          key={idx}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                          }}
                                          className={`py-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${btn.color} ${serviceButtons.length === 1 ? 'col-span-3 flex-row py-3 text-xs' : ''}`}
                                      >
                                          <btn.icon size={serviceButtons.length === 1 ? 14 : 16} />
                                          {btn.label}
                                      </button>
                                   ))}
                               </div>
                            </motion.div>
                         </Reorder.Item>
                       );
                    })}
                 </Reorder.Group>

                 {/* Add Spot Button */}
                 <button 
                    onClick={() => setIsAddSpotOpen(true)}
                    className="w-full py-4 mt-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                 >
                    <Plus size={18} />
                    添加行程节点
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* Add Spot Modal */}
      <AnimatePresence>
        {isAddSpotOpen && (
          <AddSpotModal 
            isOpen={isAddSpotOpen} 
            onClose={() => setIsAddSpotOpen(false)} 
            onAdd={handleAddSpot}
            days={trip.itinerary}
            currentDayIndex={selectedDayIndex}
          />
        )}
      </AnimatePresence>

      {/* AI Planning Modal */}
      <AnimatePresence>
        {isAIPlanningOpen && (
          <AIPlanningModal 
            isOpen={isAIPlanningOpen} 
            onClose={() => setIsAIPlanningOpen(false)} 
            onConfirm={handleAIPlanning}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default TripDetail;
