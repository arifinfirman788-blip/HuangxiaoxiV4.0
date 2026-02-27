import React from 'react';
import { 
  Plane, Train, Car, Navigation, CheckCircle2, FileText, Phone, Info, Hotel, 
  Ticket, Headphones, Utensils, Map, Coffee, ArrowRight, Clock, Star, Sparkles, 
  MapPin, Camera 
} from 'lucide-react';
import { getPlaceholder } from '../utils/imageUtils';

// Helper for status styles
const getStatusInfo = (status) => {
  switch(status) {
    case 'arrived': case 'completed': return { label: '已完成', color: 'text-slate-400 bg-slate-100' };
    case 'ongoing': return { label: '进行中', color: 'text-blue-600 bg-blue-50' };
    default: return { label: '未开始', color: 'text-orange-600 bg-orange-50' };
  }
};

// Helper for Agent Info (Smart Agent Badge)
const getAgentInfo = (type) => {
    switch(type) {
      case 'scenic': return { name: '景区智慧服务·景区智能体', icon: Camera, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-100' };
      case 'hotel': return { name: '酒店住宿服务·酒店智能体', icon: Hotel, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100' };
      case 'food': return { name: '美食餐饮服务·美食智能体', icon: Utensils, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100' };
      case 'group_meal': return { name: '团餐服务·餐饮智能体', icon: Utensils, color: 'text-orange-800', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' };
      case 'transport': return { name: '交通出行服务·交通智能体', icon: Car, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-100' };
      case 'flight': return { name: '民航运行中心·交通智能体', icon: Plane, color: 'text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-100' };
      case 'free_time': return { name: '自定义活动', icon: Coffee, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-100' };
      default: return { name: '行程助手', icon: MapPin, color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-100' };
  }
};

const hasAgent = (type) => ['scenic', 'hotel', 'transport', 'flight'].includes(type);
const shouldShowAgent = (node) => hasAgent(node.type) && node.showAgent !== false;

// Helper to get default tips if missing
const getDefaultTips = (node) => {
  if (node.tips) return node.tips;
  
  const { type, details } = node;
  
  switch(type) {
    case 'flight':
      return '建议提前2小时到达机场办理值机手续，携带好有效身份证件。';
    case 'transport':
      // Check if it's driving or train
      if (details?.flightNo === '自驾') {
         return '山路崎岖，请注意控制车速，保持安全车距，避免疲劳驾驶。';
      }
      return '建议提前30分钟到达车站，携带好身份证件，注意保管好个人财物。';
    case 'hotel':
       return '入住时间通常为14:00后，退房时间为12:00前。请携带身份证办理入住，贵重物品请存放保险箱。';
    case 'scenic':
       return '建议穿着舒适的鞋子，注意防晒防雨。游览期间请注意安全，遵守景区规定，保管好随身物品。';
    case 'food':
    case 'group_meal':
       return '建议提前预约，避开用餐高峰期。如有饮食忌口请提前告知服务人员。';
    case 'free_time':
       return '自由活动期间请注意人身财产安全，保持通讯畅通，遇到紧急情况请及时联系。';
    default:
       return '出行期间请注意安全，如有需要请联系行程管家。';
  }
};

// --- Sub-components for specific card types ---

// 1. Flight Card
const FlightCard = ({ node, agent, onClick, className }) => {
  const { details } = node;
  const tips = getDefaultTips(node);

  console.log('[DEBUG] Rendering ItineraryNodeCard', node.type, tips);
  console.log('[DEBUG] Rendering TrainCard', node.type, tips);
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
             <Plane size={16} />
           </div>
           <div>
             <div className="text-lg font-bold text-slate-800">{details.flightNo}</div>
             <div className="text-[10px] text-slate-400">{details.desc || '预计提前10分钟抵达'}</div>
           </div>
        </div>
        {shouldShowAgent(node) && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${agent.bgColor} ${agent.color}`}>
                智能体
            </span>
        )}
      </div>

      {/* Flight Route Info */}
      <div className="flex justify-between items-center mb-4 px-2">
         <div className="text-center">
            <div className="text-sm font-bold text-slate-800 mb-1">{details.dep}</div>
            <div className="text-lg font-black text-blue-600 font-mono">{details.depTime}</div>
            <div className="text-[10px] text-slate-400 mt-1">准点率{details.punctuality || '95%'}</div>
         </div>
         <div className="flex-1 flex flex-col items-center px-4">
            <div className="text-[10px] text-slate-400 mb-1">{details.duration || '2h 10m'}</div>
            <div className="w-full h-px bg-slate-200 relative">
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-white flex items-center justify-center">
                  <Plane size={12} className="text-slate-300 rotate-90" />
               </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">经济舱</div>
         </div>
         <div className="text-center">
            <div className="text-sm font-bold text-slate-800 mb-1">{details.arr}</div>
            <div className="text-lg font-black text-blue-600 font-mono">{details.arrTime}</div>
            <div className="text-[10px] text-slate-400 mt-1">{details.status || '飞行中'}</div>
         </div>
      </div>

      {/* Tips */}
      <div className="bg-orange-50/50 rounded-lg p-2.5 mb-4 flex gap-2 items-start border border-orange-100/50">
          <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
          <div className="text-[10px] text-slate-600 leading-relaxed">
              <span className="font-bold text-orange-600">黄小西Tips：</span>
              {tips}
          </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
         <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-blue-200 shadow-sm flex items-center justify-center gap-1">
            <Navigation size={14} /> 一键导航
         </button>
         <button className="flex-1 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> 值机选座
         </button>
         <button className="flex-1 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
            <FileText size={14} /> 改签退票
         </button>
      </div>
    </div>
  );
};

// 2. Train Card
const TrainCard = ({ node, agent, onClick, className }) => {
  const { details } = node;
  const tips = getDefaultTips(node);

  return (
    <div onClick={onClick} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
             <Train size={16} />
           </div>
           <div>
             <div className="text-lg font-bold text-slate-800">{details.flightNo}</div>
             <div className="text-[10px] text-slate-400">{details.desc || '二等座 · 7车厢12A'}</div>
           </div>
        </div>
        {shouldShowAgent(node) && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${agent.bgColor} ${agent.color}`}>
                智能体
            </span>
        )}
      </div>

      {/* Train Route Info */}
      <div className="flex justify-between items-center mb-4 px-2">
         <div className="text-center">
            <div className="text-sm font-bold text-slate-800 mb-1">{details.start}</div>
            <div className="text-[10px] text-slate-400 mt-1">高铁直达</div>
         </div>
         <div className="flex-1 flex flex-col items-center px-4">
            <div className="text-[10px] text-slate-400 mb-1">{details.duration || '4h 30m'}</div>
            <div className="w-full h-px bg-slate-200 relative">
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-white flex items-center justify-center">
                  <ArrowRight size={12} className="text-slate-300" />
               </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">可改签</div>
         </div>
         <div className="text-center">
            <div className="text-sm font-bold text-slate-800 mb-1">{details.end}</div>
            <div className="text-[10px] text-slate-400 mt-1">有充电口</div>
         </div>
      </div>

      {/* Tips */}
      <div className="bg-orange-50/50 rounded-lg p-2.5 mb-4 flex gap-2 items-start border border-orange-100/50">
          <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
          <div className="text-[10px] text-slate-600 leading-relaxed">
              <span className="font-bold text-orange-600">黄小西Tips：</span>
              {tips}
          </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
         <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-blue-200 shadow-sm flex items-center justify-center gap-1">
            <Navigation size={14} /> 一键导航
         </button>
         <button className="flex-1 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> 在线选座
         </button>
         <button className="flex-1 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
            <FileText size={14} /> 改签退票
         </button>
      </div>
    </div>
  );
};

// 3. Driving Card
const DrivingCard = ({ node, agent, onClick, className }) => {
    const { details } = node;
    const tips = getDefaultTips(node);

  console.log('[DEBUG] Rendering DrivingCard', node.type, tips);
    return (
      <div onClick={onClick} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative overflow-hidden ${className || ''}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
               <Car size={16} />
             </div>
             <div>
               <div className="text-lg font-bold text-slate-800">自驾出行</div>
               <div className="text-[10px] text-slate-400">{details.desc || '全程约15km · 经花溪大道'}</div>
             </div>
          </div>
          {shouldShowAgent(node) && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${agent.bgColor} ${agent.color}`}>
                  智能体
              </span>
          )}
        </div>
  
        {/* Route Info */}
        <div className="flex justify-between items-center mb-4 px-2">
           <div className="text-center">
              <div className="text-sm font-bold text-slate-800 mb-1">{details.start}</div>
              <div className="text-[10px] text-slate-400 mt-1">实时路况</div>
           </div>
           <div className="flex-1 flex flex-col items-center px-4">
              <div className="text-[10px] text-slate-400 mb-1">预计 {details.duration || '30m'}</div>
              <div className="w-full h-px bg-slate-200 relative">
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-white flex items-center justify-center">
                    <ArrowRight size={12} className="text-slate-300" />
                 </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">有停车场</div>
           </div>
           <div className="text-center">
              <div className="text-sm font-bold text-slate-800 mb-1">{details.end}</div>
              <div className="text-[10px] text-slate-400 mt-1">沿途服务区</div>
           </div>
        </div>
  
        {/* Tips */}
        <div className="bg-orange-50/50 rounded-lg p-2.5 mb-4 flex gap-2 items-start border border-orange-100/50">
            <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
            <div className="text-[10px] text-slate-600 leading-relaxed">
                <span className="font-bold text-orange-600">黄小西Tips：</span>
                {tips}
            </div>
        </div>
  
        {/* Actions */}
        <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-blue-200 shadow-sm flex items-center justify-center gap-2">
           <Navigation size={16} /> 一键导航
        </button>
      </div>
    );
  };

// 4. Content Card (Scenic, Hotel, Food)
const ContentCard = ({ node, agent, onClick, className }) => {
  const { details, type } = node;
  const isFood = type === 'food' || type === 'group_meal';
  const isHotel = type === 'hotel';
  const tips = getDefaultTips(node);

  console.log('[DEBUG] Rendering ContentCard', node.type, tips);
  // Action Buttons Config
  const getButtons = () => {
    if (type === 'scenic') {
        return [
            { label: '购买门票', icon: Ticket, primary: true, color: 'bg-green-600 text-white shadow-green-200' },
            { label: '一键导航', icon: Navigation, primary: false, color: 'bg-white text-slate-600 border border-slate-200' },
            { label: '电话咨询', icon: Phone, primary: false, color: 'bg-white text-slate-600 border border-slate-200' },
            { label: '智能导览', icon: Headphones, primary: false, color: 'bg-white text-slate-600 border border-slate-200' }
        ];
    } else if (isHotel) {
        return [
            { label: '一键导航', icon: Navigation, primary: true, color: 'bg-indigo-600 text-white shadow-indigo-200' },
            { label: '联系前台', icon: Phone, primary: false, color: 'bg-white text-slate-600 border border-slate-200' },
            { label: '设施问询', icon: Info, primary: false, color: 'bg-white text-slate-600 border border-slate-200' },
            { label: '客房服务', icon: Hotel, primary: false, color: 'bg-white text-slate-600 border border-slate-200' },
            { label: '周边推荐', icon: MapPin, primary: false, color: 'bg-white text-slate-600 border border-slate-200' }
        ];
    } else if (isFood) {
        return [
             { label: '餐厅推荐', icon: Utensils, primary: true, color: 'bg-orange-500 text-white shadow-orange-200' }
        ];
    }
    return [];
  };

  const buttons = getButtons();

  return (
    <div onClick={onClick} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative overflow-hidden ${className || ''}`}>
       {/* Header with Name and Badge */}
       <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-1">
             <h3 className="text-lg font-bold text-slate-800">{details.name || node.title}</h3>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                   {[1,2,3,4,5].map(i => <Star key={i} size={10} className={`text-orange-400 ${i <= Math.round(parseFloat(details.score || 4.8)) ? 'fill-orange-400' : ''}`} />)}
                </div>
                <span className="text-xs font-bold text-slate-600">{details.score || '4.8'}</span>
                <span className="text-[10px] text-slate-300">|</span>
                <span className="text-[10px] text-slate-500">
                    {details.price && (isFood ? `¥${details.price}/人` : details.price)}
                    {!details.price && '免费'}
                </span>
             </div>
          </div>
          {shouldShowAgent(node) && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${agent.bgColor} ${agent.color}`}>
                智能体
            </span>
          )}
       </div>

       {/* Middle Content: Image Left, Info Right */}
       <div className="flex gap-4 mb-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
             {node.image ? (
                <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                   <Camera size={24} />
                </div>
             )}
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
             <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                   {isFood ? <Utensils size={12} className="text-orange-400"/> : isHotel ? <Hotel size={12} className="text-blue-400"/> : <Clock size={12} className="text-green-400"/>}
                   <span>{details.desc || details.openTime || '暂无描述'}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                   {['必打卡', '好评如潮', '老字号'].map((tag, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">{tag}</span>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {/* Tips */}
       <div className="bg-orange-50/50 rounded-lg p-2.5 mb-4 flex gap-2 items-start border border-orange-100/50">
           <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
           <div className="text-[10px] text-slate-600 leading-relaxed">
               <span className="font-bold text-orange-600">黄小西Tips：</span>
               {tips}
           </div>
       </div>

      {/* Buttons */}
      {buttons.length > 0 && (
         <div className={`flex gap-2 ${buttons.length > 3 ? 'overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1' : ''}`}>
             {buttons.map((btn, idx) => (
                 <button
                    key={idx}
                    className={`py-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${btn.color} ${buttons.length <= 3 ? 'flex-1' : 'min-w-[70px] shrink-0'}`}
                 >
                    <btn.icon size={16} />
                    {btn.label}
                 </button>
             ))}
         </div>
      )}
    </div>
  );
};

// 5. Custom Activity Card
const CustomActivityCard = ({ node, onClick, className }) => {
    const { details } = node;
    const tips = getDefaultTips(node);

  console.log('[DEBUG] Rendering CustomActivityCard', node.type, tips);
    return (
      <div onClick={onClick} className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 relative overflow-hidden ${className || ''}`}>
         {/* Header */}
         <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                 <Coffee size={16} />
               </div>
               <div className="text-lg font-bold text-slate-800">{details.name || '自由活动时间'}</div>
            </div>
         </div>
   
         {/* Content Box */}
         <div className="border border-dashed border-slate-300 rounded-xl p-4 mb-4 relative">
             <div className="absolute -left-1 top-4 w-2 h-8 bg-teal-500 rounded-r-full" />
             <div className="pl-3">
                <div className="text-sm font-bold text-slate-800 mb-1">{details.desc || '自由安排'}</div>
                <div className="text-xs text-slate-400">{details.duration ? `自由安排约 ${details.duration}` : '暂无描述。'}</div>
             </div>
             {details.duration && (
                <div className="absolute right-4 top-4 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                    {details.duration}
                </div>
             )}
         </div>
   
         {/* Tips */}
         <div className="bg-orange-50/50 rounded-lg p-2.5 mb-4 flex gap-2 items-start border border-orange-100/50">
             <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
             <div className="text-[10px] text-slate-600 leading-relaxed">
                 <span className="font-bold text-orange-600">黄小西Tips：</span>
                 {tips}
             </div>
         </div>
   
         {/* Action */}
         <button className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-teal-200 shadow-sm flex items-center justify-center gap-2">
            <Map size={16} /> 查看地图
         </button>
      </div>
    );
};


const ItineraryNodeCard = ({ node, onClick, className }) => {
  const agent = getAgentInfo(node.type);
  const isTransport = node.type === 'transport' || node.type === 'flight';
  const isDriving = node.type === 'transport' && node.details?.flightNo === '自驾';

  if (node.type === 'flight') {
    return <FlightCard node={node} agent={agent} onClick={onClick} className={className} />;
  }

  if (isDriving) {
      return <DrivingCard node={node} agent={agent} onClick={onClick} className={className} />;
  }

  if (node.type === 'transport') {
      return <TrainCard node={node} agent={agent} onClick={onClick} className={className} />;
  }

  if (node.type === 'free_time') {
      return <CustomActivityCard node={node} onClick={onClick} className={className} />;
  }

  // Fallback for Scenic, Hotel, Food
  return <ContentCard node={node} agent={agent} onClick={onClick} className={className} />;
};

export default ItineraryNodeCard;
