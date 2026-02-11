import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share, MoreHorizontal, Sun, Cloud, CloudRain, Info, Plane, Train, MapPin, ChevronRight, QrCode, AlertCircle, Clock, CheckCircle2, Utensils, Hotel, Camera, Coffee, Navigation, Phone, FileText, Headphones, Ticket, Car, Sparkles, Plus, Search, Edit3, GripVertical, Map, Calendar, X, List, Layout, Wand2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { getPlaceholder } from '../utils/imageUtils';

// Import avatars
import ScenicAvatar from '../image/huangguoshu.png';
import HotelAvatar from '../image/jiudian.png';
import GuideAvatar from '../image/daoyou.png';
import FoodAvatar from '../image/wangayi.png';

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
                      price: "¥12/人",
                      score: "4.8分",
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
            highlights: "黔灵山公园 — 弘福寺 — 贵州省博物馆",
            tips: "今日有小雨，出行请记得携带雨具。",
            timeline: [
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
                  title: "午餐·丝娃娃", 
                  type: "food", 
                  status: "planned", 
                  tips: "建议搭配酸汤食用。", 
                  image: getPlaceholder(400, 300, 'Lunch'), 
                  details: { 
                      name: "丝恋红汤丝娃娃", 
                      desc: "必吃榜餐厅",
                      cuisine: "贵州菜",
                      price: "¥60/人",
                      score: "4.7分",
                      mustEat: "红酸汤, 脆哨洋芋",
                      avoid: "周末需提前取号"
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
                  title: "前往机场", 
                  type: "transport", 
                  status: "planned", 
                  tips: "请检查随身物品。", 
                  image: null, 
                  details: { 
                      name: "送机服务", 
                      desc: "预计 45 分钟抵达机场",
                      flightNo: "专车",
                      start: "青岩古镇",
                      end: "龙洞堡机场",
                      duration: "45m"
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
      case 'transport': return { name: '交通出行服务·交通智能体', icon: Car, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-100', avatar: GuideAvatar, tag: '行程规划', headerBg: 'bg-green-50/50', border: 'border-green-100' };
      case 'flight': return { name: '民航运行中心·交通智能体', icon: Plane, color: 'text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', avatar: GuideAvatar, tag: '实时监控航路', headerBg: 'bg-blue-50/50', border: 'border-blue-100' };
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
                               <span className="text-sm font-bold text-slate-800">{node.title}</span>
                            </div>
                            <div className="ml-6">
                              <div onClick={() => navigate('/chat-planning', { state: { nodeContext: node } })} className={`bg-white rounded-[2rem] p-4 shadow-sm border ${agent.border} overflow-hidden cursor-pointer active:scale-98 transition-transform`}>
                                 {/* Agent Header */}
                                 <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-8 h-8 rounded-full ${agent.bgColor} flex items-center justify-center`}>
                                          <agent.icon size={16} className={agent.color} />
                                       </div>
                                       <div className="flex flex-col">
                                          <span className={`text-xs font-bold ${agent.color}`}>{agent.name.split('·')[0]}</span>
                                          <div className="flex items-center gap-1">
                                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                             <span className="text-[10px] text-slate-400">在线</span>
                                          </div>
                                       </div>
                                    </div>
                                    <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">
                                      {agent.tag}
                                    </span>
                                 </div>

                                 {/* Main Content */}
                                 <div className="flex gap-4 mb-3">
                                    {/* Left Image */}
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative">
                                      {node.image ? (
                                          <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
                                      ) : (
                                          <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-[10px] uppercase tracking-wider">
                                              {node.type === 'scenic' ? 'Scenic' : node.type}
                                          </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                       <div className="flex items-center gap-2 mb-1">
                                          <h3 className="text-xl font-bold text-slate-800 truncate">{node.details.name || node.title}</h3>
                                          {/* Type specific badges */}
                                          {node.type === 'scenic' && node.details.level && (
                                              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">{node.details.level}</span>
                                          )}
                                          {node.type === 'food' && node.details.score && (
                                              <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded flex items-center gap-0.5">
                                                  ★ {node.details.score}
                                              </span>
                                          )}
                                       </div>
                                       
                                       <p className="text-xs text-slate-500 mb-2 truncate">{node.details.desc || '暂无描述'}</p>
                                       
                                       {/* Rich Info Grid */}
                                       <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                                           {node.type === 'scenic' && (
                                               <>
                                                   {node.details.price && <div className="text-[10px] text-slate-500 truncate"><span className="font-bold text-slate-700">门票:</span> {node.details.price}</div>}
                                                   {node.details.openTime && <div className="text-[10px] text-slate-500 truncate"><span className="font-bold text-slate-700">开放:</span> {node.details.openTime}</div>}
                                               </>
                                           )}
                                           {node.type === 'food' && (
                                               <>
                                                   {node.details.cuisine && <div className="text-[10px] text-slate-500 truncate"><span className="font-bold text-slate-700">菜系:</span> {node.details.cuisine}</div>}
                                                   {node.details.price && <div className="text-[10px] text-slate-500 truncate"><span className="font-bold text-slate-700">人均:</span> {node.details.price}</div>}
                                               </>
                                           )}
                                            {node.type === 'transport' && node.details.duration && (
                                               <div className="text-[10px] text-slate-500 col-span-2 truncate"><span className="font-bold text-slate-700">耗时:</span> {node.details.duration}</div>
                                           )}
                                       </div>
                                    </div>
                                 </div>

                                 {/* AI Recommendations - Full Width Row */}
                                 <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded font-medium">计划中</span>
                                    
                                    {node.type === 'scenic' && node.details.reasons && (
                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded font-bold border border-purple-100">
                                            推荐: {node.details.reasons}
                                        </span>
                                    )}
                                    
                                    {node.type === 'food' && node.details.mustEat && (
                                        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded font-bold border border-orange-100">
                                            必吃: {node.details.mustEat}
                                        </span>
                                    )}

                                    {node.type === 'scenic' && node.details.photoSpot && (
                                        <span className="px-2 py-0.5 bg-pink-50 text-pink-600 text-[10px] rounded font-bold border border-pink-100">
                                            机位: {node.details.photoSpot}
                                        </span>
                                    )}
                                 </div>

                                 {/* Huang Xiaoxi TIPS */}
                                 {node.tips && (
                                    <div className="mb-4 mx-1 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-3 border border-cyan-100 flex gap-3 items-start">
                                       <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                                          <Sparkles size={12} className="text-cyan-600" />
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center gap-1.5 mb-1">
                                             <span className="text-xs font-bold text-cyan-700">黄小西 TIPS</span>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed">{node.tips}</p>
                                       </div>
                                    </div>
                                 )}

                                 {/* Action Buttons */}
                                 <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                                    {node.type === 'scenic' ? (
                                      <>
                                          <button className="flex-1 min-w-[100px] py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Headphones size={16} />
                                             语音讲解
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <MapPin size={16} />
                                             地图导览
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Ticket size={16} />
                                             购票/预约
                                         </button>
                                     </>
                                   ) : node.type === 'hotel' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Navigation size={16} />
                                             一键导航
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Phone size={16} />
                                             联系前台
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Coffee size={16} />
                                             客房服务
                                         </button>
                                     </>
                                   ) : node.type === 'transport' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Phone size={16} />
                                             联系司机
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Share size={16} />
                                             分享行程
                                         </button>
                                     </>
                                   ) : node.type === 'flight' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <QrCode size={16} />
                                             电子登机牌
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <AlertCircle size={16} />
                                             遇到问题
                                         </button>
                                     </>
                                   ) : node.type === 'food' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Navigation size={16} />
                                             一键导航
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <FileText size={16} />
                                             查看菜单
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Clock size={16} />
                                             排队取号
                                         </button>
                                     </>
                                   ) : (
                                     <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                         <Info size={16} />
                                         查看详情
                                     </button>
                                   )}
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
                       <button
                          key={index}
                          onClick={() => setSelectedDayIndex(index)}
                          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                             selectedDayIndex === index 
                             ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                             : 'bg-white text-slate-500 border-slate-200'
                          }`}
                       >
                          {day.dayLabel}
                       </button>
                    ))}
                    <button 
                       onClick={handleAddDay}
                       className="flex-shrink-0 w-10 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 hover:bg-slate-50"
                    >
                       <Plus size={16} />
                    </button>
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
                               <span className="text-sm font-bold text-slate-800">{node.type === 'hotel' ? '入住酒店' : node.type === 'scenic' ? '游玩景点' : node.title}</span>
                            </div>

                            <motion.div 
                               drag="x"
                               dragConstraints={{ left: -80, right: 0 }}
                               dragElastic={0.1}
                               className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 overflow-hidden relative z-10"
                               style={{ touchAction: "pan-y" }}
                            >
                               {/* Agent Header */}
                               <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-8 h-8 rounded-full ${agent.bgColor} flex items-center justify-center`}>
                                        <agent.icon size={16} className={agent.color} />
                                     </div>
                                     <div className="flex flex-col">
                                        <span className={`text-xs font-bold ${agent.color}`}>{agent.name.split('·')[0]}</span>
                                        <div className="flex items-center gap-1">
                                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                           <span className="text-[10px] text-slate-400">在线</span>
                                        </div>
                                     </div>
                                  </div>
                                  <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">
                                    {agent.tag}
                                  </span>
                               </div>

                               {/* Main Content */}
                                 <div className="flex gap-4 mb-5">
                                    {/* Left Image (Optional) or Placeholder */}
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative">
                                      {node.image ? (
                                          <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
                                      ) : (
                                          <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-[10px] uppercase tracking-wider">
                                              {node.type === 'scenic' ? 'Scenic' : node.type}
                                          </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                       <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{node.title}</h3>
                                       <p className="text-xs text-slate-500 mb-2 truncate">{node.details.desc || '暂无描述'}</p>
                                       <div className="flex items-center gap-2">
                                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded font-medium">计划中</span>
                                          {node.type === 'scenic' && (
                                              <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded font-bold">建议游玩 2h</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Huang Xiaoxi TIPS */}
                                 {node.tips && (
                                    <div className="mb-4 mx-1 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-3 border border-cyan-100 flex gap-3 items-start">
                                       <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                                          <Sparkles size={12} className="text-cyan-600" />
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center gap-1.5 mb-1">
                                             <span className="text-xs font-bold text-cyan-700">黄小西 TIPS</span>
                                             <div className="px-1.5 py-0.5 rounded-full bg-cyan-100 text-[8px] font-bold text-cyan-600">AI 生成</div>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed">{node.tips}</p>
                                       </div>
                                    </div>
                                 )}

                                 {/* Action Buttons */}
                               <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                                  {node.type === 'scenic' ? (
                                    <>
                                        <button className="flex-1 min-w-[100px] py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Headphones size={16} />
                                             语音讲解
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <MapPin size={16} />
                                             地图导览
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Ticket size={16} />
                                             购票/预约
                                         </button>
                                     </>
                                   ) : node.type === 'hotel' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Navigation size={16} />
                                             一键导航
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Phone size={16} />
                                             联系前台
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Coffee size={16} />
                                             客房服务
                                         </button>
                                     </>
                                   ) : node.type === 'transport' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Phone size={16} />
                                             联系司机
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Share size={16} />
                                             分享行程
                                         </button>
                                     </>
                                   ) : node.type === 'flight' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <QrCode size={16} />
                                             电子登机牌
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <AlertCircle size={16} />
                                             遇到问题
                                         </button>
                                     </>
                                   ) : node.type === 'food' ? (
                                     <>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Navigation size={16} />
                                             一键导航
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <FileText size={16} />
                                             查看菜单
                                         </button>
                                         <button className="flex-1 min-w-[100px] py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                             <Clock size={16} />
                                             排队取号
                                         </button>
                                     </>
                                   ) : (
                                     <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
                                         <Info size={16} />
                                         查看详情
                                     </button>
                                   )}
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
