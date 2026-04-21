import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, Link2, FileText, Image as ImageIcon, Sparkles, CheckCircle2, Circle, Plus, Edit2, Trash2, MapPin, Calendar, Check, X, ArrowRight, Loader2, Plane, Utensils, Bed, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Trip, TripDay, TripNode, NodeType, NodeStatus } from '../types';
import { addTrip } from '../store';

const DB_PLACES: Record<string, Partial<TripNode>> = {
  '贵阳龙洞堡机场': {
    type: '交通',
    hasAgent: true,
    aiTips: '欢迎来到多彩贵州！建议出站后直接乘坐地铁或网约车前往市区。',
    details: { start: '出发地', end: '贵阳龙洞堡T2', duration: '2h' }
  },
  '青岩古镇': {
    type: '景点',
    hasAgent: true,
    aiTips: '推荐品尝古镇特色卤猪脚和玫瑰糖，别忘了登上城墙俯瞰全景！',
    imageUrl: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`,
    details: { rating: '4.7', price: '￥10门票', level: 'AAAAA', location: '贵阳市花溪区青岩镇' }
  },
  '甲秀楼': {
    type: '景点',
    hasAgent: true,
    aiTips: '甲秀楼夜景绝美，逛完去青云市集吃一碗手搓冰粉解暑~',
    imageUrl: `${import.meta.env.BASE_URL}图片/旅行记录2.jpg`,
    details: { rating: '4.8', price: '免费', location: '贵阳市南明区翠微巷8号' }
  },
  '黄果树瀑布': {
    type: '景点',
    hasAgent: true,
    aiTips: '记得带雨衣穿越水帘洞，景区内步行较多，请穿舒适的运动鞋！',
    imageUrl: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`,
    details: { rating: '5.0', price: '￥160门票', level: 'AAAAA', location: '安顺市镇宁布依族苗族自治县' }
  },
  '豆米火锅': {
    type: '美食',
    hasAgent: true,
    aiTips: '麻辣咸香的贵州特色火锅，豆香浓郁，非常下饭！',
    imageUrl: `${import.meta.env.BASE_URL}图片/miao.png`,
    details: { rating: '4.9', price: '￥68/人', tags: ['贵州特色', '老字号'], location: '贵阳市南明区护国路', level: '黑珍珠一钻' }
  },
  '如家精选酒店': {
    type: '酒店',
    hasAgent: true,
    imageUrl: `${import.meta.env.BASE_URL}图片/首页.jpg`,
    details: { level: '舒适型', location: '贵阳市云岩区延安西路地铁站店' }
  }
};

type Step = 'input' | 'processing' | 'edit' | 'preview';

interface RecognizedPlace {
  id: string;
  name: string;
  originalText: string;
  category: string;
  address: string;
  imageUrl: string;
  selected: boolean;
}

export default function SmartImport({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [step, setStep] = useState<Step>('input');
  const [inputValue, setInputValue] = useState('');
  const [places, setPlaces] = useState<RecognizedPlace[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [previewNodes, setPreviewNodes] = useState<TripNode[]>([]);
  const [processingText, setProcessingText] = useState('正在提取文本...');

  // Handlers for Input Step
  const handleAnalyze = () => {
    if (!inputValue.trim()) {
      alert('请输入链接或文本内容');
      return;
    }
    setStep('processing');
    
    // Rotate processing texts
    const texts = ['正在提取文本...', '正在分析路程节点...', '正在匹配地理位置...', '生成预览中...'];
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setProcessingText(texts[textIndex]);
    }, 1100);
    
    // Mock processing delay (extended to 4.5s)
    setTimeout(() => {
      clearInterval(textInterval);
      // Mock OCR/LLM result
      const mockResult: RecognizedPlace[] = [
        { 
          id: 'p1', 
          name: '中国百里杜鹃风景名胜区', 
          originalText: '百里杜鹃',
          category: '景点',
          address: '毕节市百里杜鹃管理区普底乡大荒村',
          imageUrl: `${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`,
          selected: true 
        },
        { 
          id: 'p2', 
          name: '小七孔景区-鸳鸯湖', 
          originalText: '鸳鸯湖',
          category: '景点',
          address: '黔南布依族苗族自治州荔波县小七孔镇景区路6号',
          imageUrl: `${import.meta.env.BASE_URL}图片/小七孔.jpg`,
          selected: true 
        },
        { 
          id: 'p3', 
          name: '荔波齐宿·拉珈瑶族主题民宿', 
          originalText: '住宿...',
          category: '住宿',
          address: '黔南布依族苗族自治州荔波县朝阳镇板麦桥南20米',
          imageUrl: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`,
          selected: true 
        },
        { 
          id: 'p4', 
          name: '稻田汇', 
          originalText: '稻田',
          category: '其他',
          address: '贵阳市云岩区中坝路49号',
          imageUrl: `${import.meta.env.BASE_URL}图片/旅行记录2.jpg`,
          selected: true 
        }
      ];
      setPlaces(mockResult);
      setStep('edit');
    }, 4500);
  };

  // Handlers for Edit Step
  const togglePlace = (id: string) => {
    setPlaces(places.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };
  
  const startEdit = (p: RecognizedPlace) => {
    setEditingId(p.id);
    setEditName(p.name);
  };

  const saveEdit = (id: string) => {
    setPlaces(places.map(p => p.id === id ? { ...p, name: editName } : p));
    setEditingId(null);
  };

  const removePlace = (id: string) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  const addNewPlace = () => {
    const newPlace: RecognizedPlace = {
      id: `p_${Date.now()}`,
      name: '新增地点',
      originalText: '手动添加',
      category: '其他',
      address: '自定义地址',
      imageUrl: `${import.meta.env.BASE_URL}图片/custom_activity_default.svg`,
      selected: true
    };
    setPlaces([...places, newPlace]);
    startEdit(newPlace);
  };

  const generateAndSave = () => {
    const selectedPlaces = places.filter(p => p.selected);
    if (selectedPlaces.length === 0) {
      alert('请至少选择一个地点');
      return;
    }

    // 1. 回到首页
    onNavigate('home');
    
    // 2. 呼起全局 Toast，提示规划中
    if (typeof (window as any).showGlobalToast === 'function') {
      (window as any).showGlobalToast('loading', '正在为您规划行程...');
    }

    // 3. 后台生成逻辑
    setTimeout(() => {
      const nodes: TripNode[] = selectedPlaces.map((p, idx) => {
        const matched = DB_PLACES[p.name];
        const baseTime = new Date();
        baseTime.setHours(9 + idx * 2, 0, 0);
        const timeStr = baseTime.toTimeString().substring(0, 5);

        if (matched) {
          return {
            id: `node_${Date.now()}_${Math.random()}`,
            title: p.name,
            time: timeStr,
            status: '未开始',
            isManual: false,
            hasAgent: true,
            type: matched.type || '景点',
            aiTips: matched.aiTips,
            imageUrl: matched.imageUrl,
            details: matched.details || {}
          } as TripNode;
        } else {
          return {
            id: `node_${Date.now()}_${Math.random()}`,
            title: p.name,
            time: timeStr,
            status: '未开始',
            type: '自定义活动',
            isManual: true,
            hasAgent: false,
            details: { location: p.name }
          } as TripNode;
        }
      });

      nodes.sort((a, b) => a.time.localeCompare(b.time));

      const newTrip: Trip = {
        id: `trip_${Date.now()}`,
        title: '智能导入行程 - 贵阳',
        status: '计划中',
        startTime: new Date().toISOString().split('T')[0],
        days: 1,
        imageUrl: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg`,
        tripDays: [
          {
            id: 'day1',
            title: 'Day 1',
            date: '今天',
            nodes: nodes
          }
        ]
      };
      
      addTrip(newTrip);

      // 4. 成功提示
      if (typeof (window as any).showGlobalToast === 'function') {
        (window as any).showGlobalToast('success', '行程已新增完成，点击查看！');
      }

      // Toast 3 秒后自动消失
      setTimeout(() => {
        if (typeof (window as any).hideGlobalToast === 'function') {
          (window as any).hideGlobalToast();
        }
      }, 4000);

    }, 3000);
  };

  const renderNodeCard = (node: TripNode) => {
    const isManualNode = !!node.isManual;
    let typeIcon = <MapPin size={12} />;
    if (node.type === '交通') typeIcon = <Plane size={12} />;
    if (node.type === '美食') typeIcon = <Utensils size={12} />;
    if (node.type === '酒店') typeIcon = <Bed size={12} />;
    if (node.type === '自定义活动') typeIcon = <Calendar size={12} />;

    return (
      <div key={node.id} className="relative mb-6">
        <div className="absolute left-[7px] top-8 bottom-[-24px] w-0.5 bg-gray-200 z-0" />
        <div className="relative pl-6">
          <div className="flex items-center justify-between mb-3 relative">
            <div className="absolute -left-[29px] w-4 h-4 rounded-full border-4 border-white z-10 bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{node.time}</span>
              <span className="flex items-center gap-1 text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full bg-gray-50">
                {typeIcon} {node.type}
              </span>
            </div>
          </div>
          
          <div className={`bg-white border ${isManualNode ? 'border-amber-300 border-dashed shadow-amber-100/60' : 'border-indigo-100 shadow-indigo-100/50'} rounded-3xl p-4 shadow-sm relative`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-900">{node.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isManualNode && (
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

            <div className="flex gap-4 mb-4">
              {node.type !== '交通' && (
                <div className="flex-shrink-0">
                  <img src={node.imageUrl || (isManualNode ? '/图片/custom_activity_default.svg' : 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200&h=200')} alt={node.title} className="w-24 h-24 object-cover rounded-2xl shadow-sm" referrerPolicy="no-referrer" />
                </div>
              )}
              
              <div className="flex flex-col flex-1 justify-center gap-2">
                {node.type === '交通' && node.details && (
                  <div className="bg-gray-50 rounded-xl p-2.5 flex items-center justify-between border border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{node.details.start || '出发地'}</span>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <div className="flex items-center gap-1 text-indigo-300">
                        <div className="w-4 h-[1px] bg-indigo-200"></div>
                        <Plane size={12} className="text-indigo-500" />
                        <div className="w-4 h-[1px] bg-indigo-200"></div>
                      </div>
                      <span className="text-[10px] text-indigo-500 mt-0.5 font-medium">约{node.details.duration}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-900">{node.details.end || '目的地'}</span>
                    </div>
                  </div>
                )}
                {node.details?.location && (
                  <div className="flex items-start gap-1">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 font-medium leading-snug line-clamp-2">{node.details.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {node.aiTips && (
              <div className="bg-orange-50 rounded-xl p-3 flex items-start gap-3 mb-4">
                <img alt="AI" className="w-8 h-8 rounded-full object-cover bg-white" src={`${import.meta.env.BASE_URL}IP_1.png`} />
                <div className="text-sm text-orange-800">
                  <span className="font-bold">黄小西 TIPS:</span> {node.aiTips}
                </div>
              </div>
            )}
            
            <div className="flex overflow-x-auto gap-2 mt-4 scrollbar-hide pb-1">
              <button className="flex flex-col items-center justify-center py-3 flex-1 min-w-[72px] rounded-2xl gap-1.5 bg-blue-50 text-blue-600">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <img className="w-[18px] h-[18px]" alt="查看地图" src={`${import.meta.env.BASE_URL}icno/行程icon/查看地图.svg`} />
                </div>
                <span className="text-[10px] font-medium">查看地图</span>
              </button>
              {node.hasAgent ? (
                <button className="flex flex-col items-center justify-center py-3 flex-1 min-w-[72px] rounded-2xl gap-1.5 bg-indigo-50 text-indigo-600">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img className="w-[18px] h-[18px]" alt="智能服务" src={`${import.meta.env.BASE_URL}icno/行程icon/智能体.svg`} />
                  </div>
                  <span className="text-[10px] font-medium">智能服务</span>
                </button>
              ) : (
                <button className="flex flex-col items-center justify-center py-3 flex-1 min-w-[72px] rounded-2xl gap-1.5 bg-gray-50 text-gray-600">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img className="w-[18px] h-[18px]" alt="定制服务" src={`${import.meta.env.BASE_URL}icno/行程icon/智能体.svg`} />
                  </div>
                  <span className="text-[10px] font-medium">定制服务</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-white flex flex-col font-sans">
      {/* Header */}
      <div className={`pt-12 px-4 pb-2 flex items-center justify-between sticky top-0 bg-white z-20 ${step === 'edit' ? 'border-b border-gray-100/0' : ''}`}>
        <button onClick={() => {
          if (step === 'edit') setStep('input');
          else onNavigate('home');
        }} className="w-10 h-10 flex items-center justify-center -ml-2 text-gray-900">
          {step === 'edit' ? <X size={28} strokeWidth={2.5} /> : <ChevronLeft size={28} />}
        </button>
        {step !== 'edit' && (
          <h1 className="text-lg font-bold text-gray-900 tracking-wide">
            {step === 'input' && '智能识别导入'}
            {step === 'processing' && 'AI 识别中'}
          </h1>
        )}
        <div className="w-10" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {(step === 'input' || step === 'processing') && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center shadow-inner border border-indigo-100">
                  <Sparkles size={36} className="text-indigo-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">一键提取行程</h2>
                <p className="text-sm text-gray-500">支持小红书、携程链接，或上传行程截图</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 shadow-sm transition-all relative overflow-hidden">
                {step === 'processing' && (
                  <motion.div 
                    className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <textarea
                  disabled={step === 'processing'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="粘贴行程链接或文本内容..."
                  className="w-full bg-transparent border-none outline-none resize-none h-32 text-gray-700 placeholder-gray-400 text-base disabled:opacity-50"
                />
                <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-3 relative z-10">
                  <div className="flex gap-3 text-gray-400">
                    <button className="flex items-center gap-1 hover:text-indigo-600 transition" disabled={step === 'processing'}>
                      <Link2 size={16} /> <span className="text-xs font-medium">链接</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-indigo-600 transition" disabled={step === 'processing'}>
                      <ImageIcon size={16} /> <span className="text-xs font-medium">图片</span>
                    </button>
                  </div>
                  <button 
                    disabled={step === 'processing'}
                    onClick={handleAnalyze}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95 disabled:bg-indigo-400 flex items-center gap-2"
                  >
                    {step === 'processing' ? (
                      <motion.div
                        key={processingText}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={14} className="animate-spin" />
                        {processingText}
                      </motion.div>
                    ) : (
                      '开始识别'
                    )}
                  </button>
                </div>
              </div>
              
              <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-50 flex items-start gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm text-indigo-500 mt-0.5">
                  <Sparkles size={14} />
                </div>
                <p className="text-xs text-indigo-900/80 leading-relaxed">
                  黄小西搭载最新大语言模型与OCR视觉识别，能够精准提取杂乱文本或图片中的地点信息，自动为您匹配数据库中的优质节点。
                </p>
              </div>
            </motion.div>
          )}

          {step === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-0"
            >
              {/* Source Post Info */}
              <div className="px-2 py-2 flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`} className="w-16 h-12 object-cover rounded-md shadow-sm" />
                <div className="font-bold text-gray-900 text-sm line-clamp-2">
                  贵州不赶路指南 | 私人定制游请查收✅
                </div>
              </div>

              {/* Warning Banner */}
              <div className="bg-[#EAF5FF] px-4 py-3 flex items-center gap-2 mt-2 -mx-6">
                <div className="w-5 h-5 bg-[#4AA6FF] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  <Info size={12} />
                </div>
                <span className="text-[#4AA6FF] text-[13px] font-bold">地点和行程可能会不准确或失败，请您仔细核对</span>
              </div>

              {/* List Header */}
              <div className="py-5 flex items-center justify-between">
                <h2 className="text-[22px] font-extrabold text-gray-900 tracking-wide">地点·{places.length}</h2>
                <button
                  onClick={() => {
                    const allSelected = places.every(p => p.selected);
                    setPlaces(places.map(p => ({ ...p, selected: !allSelected })));
                  }}
                  className="text-[15px] font-bold text-gray-900"
                >
                  {places.every(p => p.selected) ? '取消全选' : '全选'}
                </button>
              </div>

              {/* List Items */}
              <div className="space-y-6">
                {places.map(place => (
                  <div key={place.id} className="flex gap-3">
                    <img src={place.imageUrl} className="w-[72px] h-[72px] rounded-[14px] object-cover flex-shrink-0 border border-gray-100" />
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      {editingId === place.id ? (
                        <input 
                          autoFocus
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => saveEdit(place.id)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(place.id)}
                          className="font-bold text-[17px] text-gray-900 bg-gray-100 px-2 py-1 rounded outline-none focus:ring-2 ring-indigo-500 w-full"
                        />
                      ) : (
                        <div onClick={() => startEdit(place)} className="font-bold text-[17px] text-gray-900 truncate flex items-center gap-2 cursor-pointer group">
                          {place.name}
                          <Edit2 size={14} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      )}
                      <div className="text-[13px] text-gray-400 truncate">原文: {place.originalText}</div>
                      <div className="text-[12px] truncate flex items-center">
                        <span className={place.category === '景点' ? 'text-green-500 font-bold' : place.category === '住宿' ? 'text-blue-500 font-bold' : 'text-gray-500 font-bold'}>
                          {place.category}
                        </span>
                        <span className="text-gray-300 mx-1.5">|</span>
                        <span className="text-gray-400">{place.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center flex-shrink-0 pl-2">
                      <button onClick={() => togglePlace(place.id)} className="w-6 h-6 rounded-full flex items-center justify-center transition-colors">
                        {place.selected ? (
                          <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full border-[2px] border-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Custom Place Button */}
                <button 
                  onClick={addNewPlace}
                  className="w-full py-4 mt-4 border-[2px] border-dashed border-gray-200 rounded-[14px] text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
                >
                  <Plus size={18} strokeWidth={3} /> 新增自定义地点
                </button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-2"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">行程预览</h2>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                  共 {previewNodes.length} 个节点
                </span>
              </div>
              
              <div className="mt-4">
                {previewNodes.map(node => renderNodeCard(node))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent pb-safe z-30 flex justify-center pointer-events-none">
        {step === 'edit' && (
          <button 
            onClick={generateAndSave}
            className="pointer-events-auto bg-white border-[2.5px] border-gray-900 text-gray-900 px-10 py-3.5 rounded-full font-extrabold text-[17px] shadow-[0_8px_20px_rgba(0,0,0,0.08)] active:scale-95 transition-transform flex items-center justify-center min-w-[200px]"
          >
            添加至行程
          </button>
        )}
      </div>
    </div>
  );
}
