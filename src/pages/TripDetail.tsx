import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, Map as MapIcon, Plane, MapPin, Navigation, Phone, Ticket, Sparkles, Utensils, Bed, Plus, Trash2, Calendar, Clock, X, Info, Globe, Camera, Heart, Minus } from 'lucide-react';
import { Page } from '../types';

type NodeType = '交通' | '景点' | '美食' | '酒店' | '自定义活动' | '数字分身';
type NodeStatus = '未开始' | '进行中' | '已完成';

interface TripNode {
  id: string;
  type: NodeType;
  time: string;
  title: string;
  status: NodeStatus;
  isManual?: boolean;
  hasAgent: boolean;
  aiTips?: string;
  imageUrl?: string;
  details: any;
}

interface TripDay {
  id: string;
  title: string;
  date: string;
  nodes: TripNode[];
}

const INITIAL_DAYS: TripDay[] = [
  {
    id: 'day1',
    title: 'Day 1',
    date: '5月1日',
    nodes: [
      {
        id: 'n1',
        type: '交通',
        time: '09:00',
        title: '抵达贵阳龙洞堡机场',
        status: '已完成',
        hasAgent: true,
        aiTips: '欢迎来到多彩贵州！建议出站后直接乘坐地铁或网约车前往市区。',
        details: { start: '出发地', end: '贵阳龙洞堡T2', duration: '2h' }
      },
      {
        id: 'n2',
        type: '景点',
        time: '10:30',
        title: '青岩古镇',
        status: '进行中',
        hasAgent: true,
        aiTips: '推荐品尝古镇特色卤猪脚和玫瑰糖，别忘了登上城墙俯瞰全景！',
        imageUrl: `${import.meta.env.BASE_URL}图片/miao.png`,
        details: { rating: '4.7', price: '￥10门票', level: 'AAAAA', location: '贵阳市花溪区青岩镇' }
      },
      {
        id: 'n3',
        type: '美食',
        time: '12:30',
        title: '青岩特色小吃',
        status: '未开始',
        hasAgent: false,
        imageUrl: `${import.meta.env.BASE_URL}图片/首页.jpg`,
        details: { rating: '4.8', price: '￥45/人', tags: ['卤猪脚', '糕粑稀饭', '豆腐圆子'], location: '青岩古镇内' }
      },
      {
        id: 'n4',
        type: '景点',
        time: '14:30',
        title: '多彩贵州城',
        status: '未开始',
        hasAgent: false,
        details: { rating: '4.5', price: '免费' }
      },
      {
        id: 'n5',
        type: '美食',
        time: '18:00',
        title: '豆米火锅',
        status: '未开始',
        hasAgent: true,
        aiTips: '麻辣咸香的贵州特色火锅，豆香浓郁，非常下饭！',
        imageUrl: `${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`,
        details: { rating: '4.9', price: '￥68/人', tags: ['贵州特色', '老字号'], location: '贵阳市南明区护国路', level: '黑珍珠一钻' }
      },
      {
        id: 'n6',
        type: '景点',
        time: '19:30',
        title: '甲秀楼 & 青云市集',
        status: '未开始',
        hasAgent: true,
        aiTips: '甲秀楼夜景绝美，逛完去青云市集吃一碗手搓冰粉解暑~',
        imageUrl: `${import.meta.env.BASE_URL}图片/小七孔.jpg`,
        details: { rating: '4.8', price: '免费', location: '贵阳市南明区翠微巷8号' }
      },
      {
        id: 'n7',
        type: '酒店',
        time: '21:30',
        title: '如家精选酒店',
        status: '未开始',
        hasAgent: true,
        imageUrl: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`,
        details: { level: '舒适型', location: '贵阳市云岩区延安西路地铁站店' }
      }
    ]
  },
  {
    id: 'day2',
    title: 'Day 2',
    date: '5月2日',
    nodes: [
      {
        id: 'n8',
        type: '美食',
        time: '08:30',
        title: '肠旺面',
        status: '未开始',
        hasAgent: false,
        details: { rating: '4.9', price: '￥15/人', tags: ['贵阳早餐王牌', '肥肠血旺'] }
      },
      {
        id: 'n9',
        type: '景点',
        time: '09:30',
        title: '黔灵山公园',
        status: '未开始',
        hasAgent: true,
        aiTips: '“黔南第一山”，小心野生猕猴，不要把食物拿在手上哦！',
        imageUrl: `${import.meta.env.BASE_URL}图片/旅行记录2.jpg`,
        details: { rating: '4.8', price: '￥5门票', level: 'AAAA', location: '贵阳市云岩区枣山路187号' }
      },
      {
        id: 'n10',
        type: '美食',
        time: '12:30',
        title: '香酥鸭',
        status: '未开始',
        hasAgent: false,
        details: { rating: '4.8', price: '￥35/人', tags: ['麻辣酥脆', '特色小吃'] }
      },
      {
        id: 'n11',
        type: '景点',
        time: '14:00',
        title: '越界影城',
        status: '未开始',
        hasAgent: false,
        details: { rating: '4.6', price: '￥60' }
      },
      {
        id: 'n12',
        type: '景点',
        time: '16:00',
        title: '红飘带艺术馆',
        status: '未开始',
        hasAgent: true,
        aiTips: '沉浸式光影体验，重温长征历史，非常震撼！',
        imageUrl: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`,
        details: { rating: '4.9', price: '￥128', location: '贵阳市双龙航空港经济区' }
      },
      {
        id: 'n13',
        type: '酒店',
        time: '20:00',
        title: '格美酒店',
        status: '未开始',
        hasAgent: true,
        details: { level: '高档型', location: '贵阳市南明区火车站鸿通城店' }
      }
    ]
  },
  {
    id: 'day3',
    title: 'Day 3',
    date: '5月3日',
    nodes: [
      {
        id: 'n14',
        type: '交通',
        time: '08:00',
        title: '前往黄果树瀑布',
        status: '未开始',
        hasAgent: true,
        aiTips: '车程约2小时，建议提前备好晕车药和零食。',
        details: { start: '贵阳市区', end: '黄果树景区', duration: '2h' }
      },
      {
        id: 'n15',
        type: '景点',
        time: '10:00',
        title: '黄果树瀑布景区',
        status: '未开始',
        hasAgent: true,
        aiTips: '记得带雨衣穿越水帘洞，景区内步行较多，请穿舒适的运动鞋！',
        imageUrl: `${import.meta.env.BASE_URL}图片/miao.png`,
        details: { rating: '5.0', price: '￥160门票', level: 'AAAAA', location: '安顺市镇宁布依族苗族自治县' }
      },
      {
        id: 'n16',
        type: '美食',
        time: '13:30',
        title: '瀑布周边农家菜',
        status: '未开始',
        hasAgent: false,
        details: { rating: '4.7', price: '￥60/人', tags: ['酸汤鱼', '野菜炒腊肉'] }
      },
      {
        id: 'n17',
        type: '景点',
        time: '15:00',
        title: '陡坡塘瀑布',
        status: '未开始',
        hasAgent: true,
        aiTips: '86版《西游记》片尾曲取景地，拍照打卡必去！',
        details: { rating: '4.8', price: '包含在套票内' }
      },
      {
        id: 'n18',
        type: '交通',
        time: '17:30',
        title: '返程贵阳',
        status: '未开始',
        hasAgent: true,
        details: { start: '黄果树景区', end: '贵阳市区/机场', duration: '2h' }
      }
    ]
  }
];

const getDefaultImage = (type: NodeType) => {
  switch (type) {
    case '交通': return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=200&h=200';
    case '景点': return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200&h=200';
    case '美食': return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200&h=200';
    case '酒店': return 'https://images.unsplash.com/photo-1566073171614-6f2259a1ab15?auto=format&fit=crop&q=80&w=200&h=200';
    case '自定义活动': return 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=200&h=200';
    case '数字分身': return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200';
    default: return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=200&h=200';
  }
};

const OVERVIEW_FILTERS = [
  { id: '全部', label: '全部', iconActive: `${import.meta.env.BASE_URL}icno/tab/选中状态/全部.png`, iconInactive: `${import.meta.env.BASE_URL}icno/tab/未选中状态/全部.png`, labelColor: 'text-blue-600' },
  { id: '交通', label: '交通', iconActive: `${import.meta.env.BASE_URL}icno/tab/选中状态/交通.png`, iconInactive: `${import.meta.env.BASE_URL}icno/tab/未选中状态/交通.png`, labelColor: 'text-indigo-600' },
  { id: '美食', label: '美食', iconActive: `${import.meta.env.BASE_URL}icno/tab/选中状态/餐饮.png`, iconInactive: `${import.meta.env.BASE_URL}icno/tab/未选中状态/餐饮.png`, labelColor: 'text-orange-600' },
  { id: '景点', label: '景点', iconActive: `${import.meta.env.BASE_URL}icno/tab/选中状态/景点.png`, iconInactive: `${import.meta.env.BASE_URL}icno/tab/未选中状态/景点.png`, labelColor: 'text-red-600' },
  { id: '酒店', label: '住宿', iconActive: `${import.meta.env.BASE_URL}icno/tab/选中状态/住宿.png`, iconInactive: `${import.meta.env.BASE_URL}icno/tab/未选中状态/住宿.png`, labelColor: 'text-rose-600' },
  { id: '自定义活动', label: '自定义', iconActive: `${import.meta.env.BASE_URL}icno/tab/选中状态/自定义.png`, iconInactive: `${import.meta.env.BASE_URL}icno/tab/未选中状态/自定义.png`, labelColor: 'text-gray-800' },
];

export default function TripDetail({ onNavigate, isPreview = false, fromChat = false }: { onNavigate: (page: Page) => void, isPreview?: boolean, fromChat?: boolean }) {
  const [view, setView] = useState<'overview' | 'daily'>('overview');
  const [overviewFilter, setOverviewFilter] = useState('全部');
  const [days, setDays] = useState<TripDay[]>(INITIAL_DAYS);
  const [activeDayId, setActiveDayId] = useState(INITIAL_DAYS[0].id);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [localPreview, setLocalPreview] = useState(isPreview);
  const [isDirty, setIsDirty] = useState(false);
  
  const [isAdopted, setIsAdopted] = useState(fromChat);
  
  // Add Node Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addNodeData, setAddNodeData] = useState({
    dayId: INITIAL_DAYS[0].id,
    type: '景点',
    time: '10:00',
    title: '',
    description: ''
  });
  
  // 模拟行程是否进行中
  const isTripInProgress = false;
  const canEdit = !isTripInProgress && !localPreview;

  const handleBack = () => {
    if (isDirty) {
      if (!window.confirm('您有未保存的修改，确定要离开吗？')) {
        return;
      }
    }
    onNavigate(isPreview ? 'chat' : 'trip-list');
  };

  const handleCustomAction = () => {
    alert('敬请期待');
  };

  const handleNodeClick = (node: TripNode) => {
    if (node.hasAgent) {
      onNavigate('chat');
    } else if (node.type !== '自定义活动') {
      // Navigate to detail page (mock)
      console.log('Navigate to detail for', node.title);
    }
  };

  const handleAddDay = () => {
    if (!canEdit) return;
    const newDayNum = days.length + 1;
    const newDay: TripDay = {
      id: `day${newDayNum}`,
      title: `Day ${newDayNum}`,
      date: `12月${10 + newDayNum}日`,
      nodes: []
    };
    setDays([...days, newDay]);
    setActiveDayId(newDay.id);
    setIsDirty(true);
  };

  const handleDeleteDay = (id: string) => {
    if (!canEdit || days.length <= 1) return;
    const newDays = days.filter(d => d.id !== id).map((d, idx) => ({
      ...d,
      title: `Day ${idx + 1}`
    }));
    setDays(newDays);
    if (activeDayId === id) {
      setActiveDayId(newDays[0].id);
    }
    setIsDirty(true);
  };

  const handleAddNode = () => {
    if (!canEdit) return;
    setAddNodeData(prev => ({ ...prev, dayId: activeDayId, title: '', description: '' }));
    setIsAddModalOpen(true);
  };

  const confirmAddNode = () => {
    if (!addNodeData.title) {
      alert('请输入名称');
      return;
    }
    
    let defaultImageUrl = '';
    if (addNodeData.type === '景点') {
      defaultImageUrl = '/图片/scenic_default.svg';
    } else if (addNodeData.type === '自定义活动') {
      defaultImageUrl = '/图片/custom_activity_default.svg'; 
    }

    const newNode: TripNode = {
      id: `node-${Date.now()}`,
      type: addNodeData.type as any,
      time: addNodeData.time,
      title: addNodeData.title,
      status: '未开始',
      isManual: true,
      hasAgent: false,
      imageUrl: defaultImageUrl || undefined,
      details: { content: addNodeData.description }
    };
    
    setDays(days.map(d => {
      if (d.id === addNodeData.dayId) {
        const newNodes = [...d.nodes, newNode].sort((a, b) => a.time.localeCompare(b.time));
        return { ...d, nodes: newNodes };
      }
      return d;
    }));
    setIsDirty(true);
    setIsAddModalOpen(false);
  };

  const handleDeleteNode = (dayId: string, nodeId: string) => {
    if (!canEdit) return;
    setDays(days.map(d => {
      if (d.id === dayId) {
        return { ...d, nodes: d.nodes.filter(n => n.id !== nodeId) };
      }
      return d;
    }));
    setIsDirty(true);
  };

  const renderNodeCard = (node: TripNode, dayId: string) => {
    const isManualNode = !!node.isManual;
    const isFirst = !isManualNode && node.status === '进行中';
    const statusColor = node.status === '已完成' ? 'text-gray-500' : node.status === '进行中' ? 'text-green-500' : 'text-red-500';
    
    let typeIcon = <MapPin size={12} />;
    if (node.type === '交通') typeIcon = <Plane size={12} />;
    if (node.type === '美食') typeIcon = <Utensils size={12} />;
    if (node.type === '酒店') typeIcon = <Bed size={12} />;
    if (node.type === '自定义活动') typeIcon = <Calendar size={12} />;

    return (
      <div key={node.id} className="relative mb-6">
        {/* Timeline line - fixed */}
        <div className="absolute left-[7px] top-8 bottom-[-24px] w-0.5 bg-gray-200 z-0" />
        
        <SwipeToDelete onDelete={() => handleDeleteNode(dayId, node.id)} canEdit={canEdit}>
          <div className="relative pl-6">
            <div className="flex items-center justify-between mb-3 relative">
              <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-4 border-white z-10 ${isFirst ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{node.time}</span>
                <span className="flex items-center gap-1 text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full bg-gray-50">
                  {typeIcon} {node.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isManualNode && (
                  <div className={`text-xs flex items-center gap-1 ${statusColor}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusColor.replace('text-', 'bg-')}`} /> {node.status}
                  </div>
                )}
              </div>
            </div>
            
            <div 
              onClick={() => handleNodeClick(node)}
              className={`bg-white border ${node.isManual ? 'border-amber-300 border-dashed shadow-amber-100/60' : node.hasAgent ? 'border-indigo-100 shadow-indigo-100/50' : 'border-gray-100'} rounded-3xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{node.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {node.isManual && (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Calendar size={12} /> 手动添加
                    </span>
                  )}
                  {node.hasAgent && (
                    <button className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles size={12} /> 智能体
                    </button>
                  )}
                </div>
              </div>

              {/* Core Fields - Redesigned for prominence & compactness */}
              <div className="flex gap-4 mb-4">
                {/* Image Section (Left) */}
                {node.type !== '交通' && (
                  <div className="flex-shrink-0">
                    <img src={node.imageUrl || getDefaultImage(node.type)} alt={node.title} className="w-24 h-24 object-cover rounded-2xl shadow-sm" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Info Section (Right) */}
                <div className="flex flex-col flex-1 justify-center gap-2">
                  {/* Tags (if any) */}
                  {node.details?.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {node.details.tags.map((tag: string) => (
                        <span key={tag} className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-orange-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Location / Key Info */}
                  {node.type === '交通' && node.details && (
                    <div className="bg-gray-50 rounded-xl p-2.5 flex items-center justify-between border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{node.details.start || '出发地'}</span>
                        <span className="text-[10px] text-gray-500">{node.details.timeRange?.split('-')[0] || node.time}</span>
                      </div>
                      <div className="flex flex-col items-center px-2">
                        <span className="text-[10px] text-gray-400 mb-0.5">{node.details.flightNo || '班次'}</span>
                        <div className="flex items-center gap-1 text-indigo-300">
                          <div className="w-4 h-[1px] bg-indigo-200"></div>
                          <Plane size={12} className="text-indigo-500" />
                          <div className="w-4 h-[1px] bg-indigo-200"></div>
                        </div>
                        <span className="text-[10px] text-indigo-500 mt-0.5 font-medium">约{node.details.duration}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900">{node.details.end || '目的地'}</span>
                        <span className="text-[10px] text-gray-500">{node.details.timeRange?.split('-')[1] || '--:--'}</span>
                      </div>
                    </div>
                  )}

                  {node.type === '景点' && node.details && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {node.details.rating && <span className="text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">{node.details.rating}分</span>}
                        {node.details.level && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{node.details.level}</span>}
                        {node.details.price && <span className="text-xs font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">{node.details.price}</span>}
                      </div>
                      {node.details.location && (
                        <div className="flex items-start gap-1">
                          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600 font-medium leading-snug line-clamp-2">{node.details.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === '美食' && node.details && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {node.details.rating && <span className="text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">{node.details.rating}分</span>}
                        {node.details.price && <span className="text-xs font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">{node.details.price}</span>}
                        {node.details.level && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{node.details.level}</span>}
                      </div>
                      {node.details.location && (
                        <div className="flex items-start gap-1">
                          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600 font-medium leading-snug line-clamp-2">{node.details.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === '酒店' && node.details && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        {node.details.level && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{node.details.level}</span>}
                      </div>
                      {node.details.location && (
                        <div className="flex items-start gap-1">
                          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600 font-medium leading-snug line-clamp-2">{node.details.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === '自定义活动' && node.details && (
                    <div className="flex flex-col gap-1.5">
                      {node.details.location && (
                        <div className="flex items-start gap-1">
                          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600 font-medium leading-snug line-clamp-2">{node.details.location}</span>
                        </div>
                      )}
                      {node.details.content && (
                        <div className="bg-gray-50 p-2 rounded-lg text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {node.details.content}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {node.aiTips && (
                <div className="bg-orange-50 rounded-xl p-3 flex items-start gap-3 mb-4">
                  <img src={`${import.meta.env.BASE_URL}IP_1.png`} alt="AI" className="w-8 h-8 rounded-full object-cover bg-white" />
                  <div className="text-sm text-orange-800">
                    <span className="font-bold">黄小西 TIPS:</span> {node.aiTips}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex overflow-x-auto gap-2 mt-4 scrollbar-hide pb-1" onClick={e => e.stopPropagation()}>
                {/* 交通 */}
                {node.type === '交通' && (
                  <>
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/一键导航.svg`} className="w-[18px] h-[18px]" alt="一键导航" />} label="一键导航" color="bg-blue-50 text-blue-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/值机选座.svg`} className="w-[18px] h-[18px]" alt="值机选座" />} label="值机选座" color="bg-green-50 text-green-600" onClick={() => onNavigate('chat')} />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/改签退票.svg`} className="w-[18px] h-[18px]" alt="改签退票" />} label="改签退票" color="bg-red-50 text-red-600" onClick={() => onNavigate('chat')} />
                  </>
                )}
                {/* 景点 */}
                {node.type === '景点' && (
                  <>
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/购买门票.svg`} className="w-[18px] h-[18px]" alt="购买门票" />} label="购买门票" color="bg-green-50 text-green-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/一键导航.svg`} className="w-[18px] h-[18px]" alt="一键导航" />} label="一键导航" color="bg-blue-50 text-blue-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/电话咨询.svg`} className="w-[18px] h-[18px]" alt="电话咨询" />} label="电话咨询" color="bg-red-50 text-red-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/智能导览.svg`} className="w-[18px] h-[18px]" alt="游玩攻略" />} label="游玩攻略" color="bg-indigo-50 text-indigo-600" onClick={() => node.hasAgent ? onNavigate('chat') : handleCustomAction()} />
                  </>
                )}
                {/* 美食 - 无智能体 */}
                {node.type === '美食' && !node.hasAgent && (
                  <>
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/餐厅推荐.svg`} className="w-[18px] h-[18px]" alt="餐厅推荐" />} label="餐厅推荐" color="bg-orange-50 text-orange-600" />
                  </>
                )}
                {/* 美食 - 有智能体 */}
                {node.type === '美食' && node.hasAgent && (
                  <>
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/一键导航.svg`} className="w-[18px] h-[18px]" alt="一键导航" />} label="一键导航" color="bg-blue-50 text-blue-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/电话咨询.svg`} className="w-[18px] h-[18px]" alt="电话咨询" />} label="电话咨询" color="bg-red-50 text-red-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/预定包厢.svg`} className="w-[18px] h-[18px]" alt="预定包厢" />} label="预定包厢" color="bg-indigo-50 text-indigo-600" onClick={() => onNavigate('chat')} />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/查看菜单.svg`} className="w-[18px] h-[18px]" alt="查看菜单" />} label="查看菜单" color="bg-indigo-50 text-indigo-600" onClick={() => onNavigate('chat')} />
                  </>
                )}
                {/* 酒店 */}
                {node.type === '酒店' && (
                  <>
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/在线选座.svg`} className="w-[18px] h-[18px]" alt="酒店订房" />} label="酒店订房" color="bg-green-50 text-green-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/一键导航.svg`} className="w-[18px] h-[18px]" alt="一键导航" />} label="一键导航" color="bg-blue-50 text-blue-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/联系前台.svg`} className="w-[18px] h-[18px]" alt="联系前台" />} label="联系前台" color="bg-red-50 text-red-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/设施问询.svg`} className="w-[18px] h-[18px]" alt="酒店服务" />} label="酒店服务" color="bg-indigo-50 text-indigo-600" onClick={() => node.hasAgent ? onNavigate('chat') : handleCustomAction()} />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/客房服务.svg`} className="w-[18px] h-[18px]" alt="客房服务" />} label="客房服务" color="bg-indigo-50 text-indigo-600" onClick={() => node.hasAgent ? onNavigate('chat') : handleCustomAction()} />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/周边推荐.svg`} className="w-[18px] h-[18px]" alt="周边推荐" />} label="周边推荐" color="bg-indigo-50 text-indigo-600" onClick={() => node.hasAgent ? onNavigate('chat') : handleCustomAction()} />
                  </>
                )}
                {/* 自定义活动 */}
                {node.type === '自定义活动' && (
                  <>
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/查看地图.svg`} className="w-[18px] h-[18px]" alt="查看地图" />} label="查看地图" color="bg-blue-50 text-blue-600" />
                    <ActionButton icon={<img src={`${import.meta.env.BASE_URL}icno/行程icon/智能体.svg`} className="w-[18px] h-[18px]" alt="定制服务" />} label="定制服务" color="bg-gray-50 text-gray-600" onClick={handleCustomAction} />
                  </>
                )}
              </div>
            </div>
          </div>
        </SwipeToDelete>
      </div>
    );
  };

  const allNodes = days.flatMap(d => d.nodes.map(n => ({ ...n, dayId: d.id, dayTitle: d.title, dayDate: d.date })));
  const filteredNodes = overviewFilter === '全部' ? allNodes : allNodes.filter(n => n.type === overviewFilter || (overviewFilter === '住宿' && n.type === '酒店'));

  // Group filtered nodes by day
  const groupedNodes = filteredNodes.reduce((acc, node) => {
    if (!acc[node.dayId]) {
      acc[node.dayId] = { title: node.dayTitle, date: node.dayDate, nodes: [] };
    }
    acc[node.dayId].nodes.push(node);
    return acc;
  }, {} as Record<string, { title: string, date: string, nodes: typeof filteredNodes }>);

  let mapNodes: { id: string; title: string; status?: NodeStatus; type?: string; isManual?: boolean }[] = [];
  
  if (view === 'overview') {
    // 总览：每日要去的城市
    mapNodes = days.map(day => {
      let city = '贵阳市';
      const locNode = day.nodes.find(n => n.details?.location);
      if (locNode) {
        if (locNode.details.location.includes('安顺')) city = '安顺市';
        else if (locNode.details.location.includes('遵义')) city = '遵义市';
        else if (locNode.details.location.includes('黔南')) city = '黔南州';
        else if (locNode.details.location.includes('黔东南')) city = '黔东南州';
        else if (locNode.details.location.includes('铜仁')) city = '铜仁市';
        else if (locNode.details.location.includes('毕节')) city = '毕节市';
        else if (locNode.details.location.includes('六盘水')) city = '六盘水市';
        else if (locNode.details.location.includes('黔西南')) city = '黔西南州';
      }
      
      const isCompleted = day.nodes.length > 0 && day.nodes.every(n => n.status === '已完成');
      const isStarted = day.nodes.some(n => n.status !== '未开始');
      const status: NodeStatus = isCompleted ? '已完成' : isStarted ? '进行中' : '未开始';
      
      return { id: `overview-${day.id}`, title: `${day.title} · ${city}`, status, type: '城市' };
    });
  } else {
    // 每日：当前天的景点和交通
    const activeDayNodes = days.find(d => d.id === activeDayId)?.nodes || [];
    mapNodes = activeDayNodes
      .filter(n => n.type === '景点' || n.type === '交通')
      .map(n => ({ id: n.id, title: n.title, status: n.isManual ? undefined : n.status, type: n.type, isManual: n.isManual }));
  }

  const mapPoints = mapNodes.map((_, i) => {
    const x = 15 + (70 * i) / Math.max(1, mapNodes.length - 1);
    const y = 50 + Math.sin(i * 1.2) * 25;
    return { x, y };
  });

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-12 px-4 flex justify-between items-center">
        <button onClick={handleBack} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
          <ChevronLeft size={24} />
        </button>
        
        <div className="bg-white/80 backdrop-blur rounded-full p-1 flex shadow-sm">
          <button 
            onClick={() => setView('overview')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${view === 'overview' ? 'bg-indigo-500 text-white' : 'text-gray-600'}`}
          >
            <div className="flex items-center gap-1"><MapIcon size={14}/> 总览</div>
          </button>
          <button 
            onClick={() => setView('daily')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${view === 'daily' ? 'bg-indigo-500 text-white' : 'text-gray-600'}`}
          >
            <div className="flex items-center gap-1"><Clock size={14}/> 每日</div>
          </button>
        </div>
        
        <div className="w-10 h-10"></div> {/* Placeholder to keep center alignment */}
      </div>

      {/* Map Area */}
      <div className="h-72 relative bg-gray-200 flex-shrink-0 overflow-hidden">
        <img 
          src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/export?bbox=106.5,26.4,106.9,26.8&bboxSR=4326&imageSR=4326&size=800,600&format=png32&f=image" 
          alt="Route Map" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        
        {/* Map Route Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline 
            points={mapPoints.map(p => `${p.x},${p.y}`).join(' ')} 
            fill="none" 
            stroke="#4f46e5" 
            strokeWidth="1.5" 
            strokeDasharray="2,2"
          />
        </svg>
        
        {mapNodes.map((node, i) => (
          <div 
            key={node.id} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            style={{ left: `${mapPoints[i].x}%`, top: `${mapPoints[i].y}%` }}
          >
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${node.isManual ? 'bg-amber-400' : node.status === '已完成' ? 'bg-gray-400' : node.status === '进行中' ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
            <div className="mt-1 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded text-[8px] font-bold text-gray-800 shadow-sm whitespace-nowrap scale-75 origin-top">
              {node.title.length > 10 ? node.title.substring(0, 10) + '..' : node.title}
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white -mt-6 rounded-t-[2rem] relative z-20 px-6 pt-6 pb-8 flex flex-col">
        
        {/* Global Hints */}
        {isTripInProgress && (
          <div className="bg-blue-50 text-blue-600 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-2 flex-shrink-0">
            <Info size={14} /> 行程进行中，不支持编辑行程内容
          </div>
        )}
        {localPreview && (
          <div className="bg-indigo-50 text-indigo-600 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-2 flex-shrink-0">
            <Info size={14} /> 预览模式，点击下方按钮采纳后可编辑
          </div>
        )}
        {isAdopted && !isDirty && !isTripInProgress && (
          <div className="bg-green-50 text-green-600 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-2 flex-shrink-0">
            <Sparkles size={14} /> 行程已采纳！您可以自由编辑，修改后请保存
          </div>
        )}
        {!localPreview && isDirty && !isTripInProgress && (
          <div className="bg-green-50 text-green-600 text-xs px-3 py-2 rounded-lg mb-4 flex items-center gap-2 flex-shrink-0">
            <Info size={14} /> 当前为编辑模式，修改完成后请保存
          </div>
        )}

        {view === 'overview' && (
          <>
            {/* Overview Filters */}
            <div className="flex justify-between mb-8 overflow-x-auto scrollbar-hide gap-4 pb-2">
              {OVERVIEW_FILTERS.map(f => {
                const isSelected = overviewFilter === f.id;
                return (
                  <div key={f.id} onClick={() => setOverviewFilter(f.id)} className="flex flex-col items-center gap-2 min-w-[60px] cursor-pointer group">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105'}`}>
                      <img src={isSelected ? f.iconActive : f.iconInactive} alt={f.label} className="w-full h-full object-contain" />
                    </div>
                    <span className={`text-xs transition-colors duration-300 ${isSelected ? `${f.labelColor} font-bold` : 'text-gray-500 font-medium'}`}>{f.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Overview List */}
            <div className="flex-1 overflow-y-auto">
              {Object.keys(groupedNodes).length > 0 ? (
                Object.values(groupedNodes).map((group: any) => (
                  <div key={group.title} className="mb-8">
                    <DayHeader title={group.title} date={group.date} />
                    <div className="mt-4">
                      {group.nodes.map((node: any) => renderNodeCard(node, node.dayId))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-10">暂无该类型行程</div>
              )}
            </div>
          </>
        )}

        {view === 'daily' && (
          <>
            {/* Daily Tabs & Management */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 flex-1">
                {days.map(day => (
                  <button
                    key={day.id}
                    onClick={() => setActiveDayId(day.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors relative flex items-center gap-2 ${
                      activeDayId === day.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {day.title}
                    {isDeleteMode && canEdit && days.length > 1 && (
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleDeleteDay(day.id); }}
                        className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={10} />
                      </div>
                    )}
                  </button>
                ))}
                {canEdit && (
                  <button onClick={handleAddDay} className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center border border-dashed border-gray-300 flex-shrink-0">
                    <Plus size={16} />
                  </button>
                )}
                {canEdit && days.length > 1 && (
                  <button onClick={() => handleDeleteDay(activeDayId)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center border border-dashed border-gray-300 flex-shrink-0">
                    <Minus size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Active Day Content */}
            <div className="flex-1 overflow-y-auto">
              {days.find(d => d.id === activeDayId) && (
                <div className="mb-6">
                  <DayHeader 
                    title={days.find(d => d.id === activeDayId)!.title} 
                    date={days.find(d => d.id === activeDayId)!.date} 
                  />
                  <div className="mt-4">
                    {days.find(d => d.id === activeDayId)?.nodes.map(node => renderNodeCard(node, activeDayId))}
                  </div>
                </div>
              )}
              
              {canEdit && (
                <button 
                  onClick={handleAddNode}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mt-4"
                >
                  <Plus size={20} /> 添加行程节点
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      {(localPreview || isDirty) && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-30 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {localPreview ? (
            <button 
              onClick={() => {
                setLocalPreview(false);
                setView('daily');
                setIsDirty(true);
                alert('已进入编辑模式，您可以自由调整行程了！');
              }}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-full font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform"
            >
              采纳或编辑
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsDirty(false);
                setIsAdopted(false);
                alert('行程已保存到“我的行程”！');
              }}
              className="w-full bg-gray-900 text-white py-3.5 rounded-full font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-transform"
            >
              保存行程
            </button>
          )}
        </div>
      )}

      {/* Add Node Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 pb-safe animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">添加行程节点</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">节点类型</label>
                <div className="flex flex-wrap gap-2">
                  {['景点', '美食', '交通', '酒店', '自定义活动'].map(type => (
                    <button
                      key={type}
                      onClick={() => setAddNodeData(prev => ({ ...prev, type }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        addNodeData.type === type ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择天数</label>
                  <select 
                    value={addNodeData.dayId}
                    onChange={e => setAddNodeData(prev => ({ ...prev, dayId: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {days.map(d => <option key={d.id} value={d.id}>{d.title} ({d.date})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                  <input 
                    type="time" 
                    value={addNodeData.time}
                    onChange={e => setAddNodeData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Title / Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {['景点', '美食', '酒店'].includes(addNodeData.type) ? '搜索选择' : '名称'}
                </label>
                <input 
                  type="text" 
                  placeholder={['景点', '美食', '酒店'].includes(addNodeData.type) ? `搜索${addNodeData.type}...` : '输入节点名称'}
                  value={addNodeData.title}
                  onChange={e => setAddNodeData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">活动描述 (选填)</label>
                <textarea 
                  placeholder="输入详细描述或备注..."
                  value={addNodeData.description}
                  onChange={e => setAddNodeData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                />
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                小西提醒：手动添加的节点仅用于展示，不会触发行程通知。
              </div>

              <button 
                onClick={confirmAddNode}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform mt-4"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeToDelete({ children, onDelete, canEdit }: { children: React.ReactNode, onDelete: () => void, canEdit: boolean }) {
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canEdit) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canEdit) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -80));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    if (!canEdit) return;
    if (offsetX < -40) {
      setOffsetX(-80);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-end pr-4">
        <button onClick={onDelete} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
          <Trash2 size={20} />
        </button>
      </div>
      <div
        className="relative z-10 transition-transform duration-200 ease-out bg-gray-50"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center py-3 flex-1 min-w-[72px] rounded-2xl gap-1.5 ${color} hover:opacity-80 transition-opacity`}>
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
    </button>
  );
}

function DayHeader({ title, date }: { title: string, date: string }) {
  return (
    <div 
      className="relative h-14 flex items-center justify-between px-4 mb-4 rounded-tl-3xl rounded-br-3xl overflow-hidden shadow-sm"
      style={{
        backgroundImage: 'url(/图片/Day-title-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Semi-transparent overlay to ensure text readability if the image is too bright */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F27D59] flex items-center justify-center shadow-sm">
          <img src={`${import.meta.env.BASE_URL}icno/行程icon/爱心-实心.svg`} alt="heart" className="w-4 h-4" />
        </div>
        <span className="text-xl font-bold text-gray-800">{title}</span>
      </div>
      <span className="relative z-10 text-gray-700 font-medium">{date}</span>
    </div>
  );
}

