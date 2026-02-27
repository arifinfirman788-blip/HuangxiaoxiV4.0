import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronRight, ChevronDown, Users, Clock, ArrowUpRight, Scale, CheckCircle2, Circle, X, Play, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlaceholder } from '../utils/imageUtils';

const formatTripDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('-').map(d => {
    const s = d.trim();
    if (s.match(/^\d{4}\//)) return s;
    if (s.match(/^\d{2}\.\d{2}$/)) return `2026/${s.replace('.', '/')}`;
    if (s.match(/^\d{2}\/\d{2}$/)) return `2026/${s}`;
    return s;
  }).join(' - ');
};

const FilterDropdown = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = value === 'all' ? label : selectedOption?.label || label;

  return (
    <div className="relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
      >
        <span>{displayLabel}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full right-0 mt-2 min-w-[100px] bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden py-1"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] font-bold transition-colors flex items-center justify-between ${
                    value === option.value 
                      ? 'bg-slate-50 text-slate-900' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {option.label}
                  {value === option.value && <CheckCircle2 size={10} className="text-cyan-500" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CalendarFilter = ({ value, onChange, years, availableYearMonths }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value === 'all') return years[0] ?? new Date().getFullYear();
    const parts = value.split('/');
    return parseInt(parts[0], 10) || years[0] || new Date().getFullYear();
  });

  const displayLabel = value === 'all' ? '时间' : value;

  const handleConfirm = (ym) => {
    onChange(ym);
    setIsOpen(false);
  };

  return (
    <div className="relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
      >
        <Calendar size={12} className="text-slate-400" />
        <span>{displayLabel}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100">
                <button
                  onClick={() => handleConfirm('all')}
                  className={`w-full py-2 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    value === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Calendar size={12} />
                  全部
                </button>
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">选择年</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(years.length ? years : [new Date().getFullYear()]).map(y => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                        selectedYear === y ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {y}年
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">选择月</div>
                <div className="flex flex-wrap gap-1.5">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
                    const ym = `${selectedYear}/${String(m).padStart(2, '0')}`;
                    const isAvailable = availableYearMonths.includes(ym);
                    const isSelected = value === ym;
                    return (
                      <button
                        key={m}
                        onClick={() => isAvailable && handleConfirm(ym)}
                        disabled={!isAvailable}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors min-w-[36px] ${
                          isSelected ? 'bg-slate-900 text-white' 
                            : isAvailable ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {m}月
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Trip = ({ adoptedTrip, onUpdateTrip }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'planned' | 'upcoming' | 'completed'
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tripToStart, setTripToStart] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null); // Track the currently active trip ID

  // Mock Data for Demo Purposes
  const [localTrips, setLocalTrips] = useState([
    {
      id: 'mock-1',
      title: '黔东南苗寨深度体验3日游',
      date: '2026/04/15 - 2026/04/17',
      days: 3,
      distance: '320km',
      rating: '9.6',
      image: getPlaceholder(400, 300, 'Miao Village Trip'),
      status: 'planned'
    },
    {
      id: 'mock-2',
      title: '遵义红色记忆之旅2日游',
      date: '2026/03/10 - 2026/03/11',
      days: 2,
      distance: '180km',
      rating: '9.5',
      image: getPlaceholder(400, 300, 'Zunyi Trip'),
      status: 'planned'
    }
  ]);

  const myTrips = adoptedTrip ? [adoptedTrip, ...localTrips] : [...localTrips];

  useEffect(() => {
    const active = myTrips.find(t => t.startTime && t.status !== 'completed');
    if (active) {
        setActiveTripId(active.id);
    } else {
        setActiveTripId(null);
    }
  }, [adoptedTrip, localTrips]);

  const handleOpenStartModal = (trip, e) => {
    e.stopPropagation();
    
    // Check for conflict
    if (activeTripId && activeTripId !== trip.id) {
        const activeTrip = myTrips.find(t => t.id === activeTripId);
        alert(`行程 "${activeTrip?.title || '未知行程'}" 正在进行中，请先结束该行程后再开始新的行程。`);
        return;
    }

    setTripToStart(trip);
    setIsStartModalOpen(true);
  };

  const handleStartTrip = () => {
    if (!tempStartDate || !tripToStart) return;
    const date = new Date(tempStartDate);
    if (date <= new Date()) {
        alert("请选择当前时间之后的时间");
        return;
    }
    
    // Set active trip ID
    setActiveTripId(tripToStart.id);

    // If it's the adopted trip, update it
    if (adoptedTrip && tripToStart.id === adoptedTrip.id) {
        onUpdateTrip({ startTime: date.toISOString(), status: 'upcoming' });
    } else {
        // Update local trips
        setLocalTrips(prev => prev.map(t => 
            t.id === tripToStart.id 
                ? { ...t, startTime: date.toISOString(), status: 'upcoming' }
                : t
        ));
        alert(`行程 "${tripToStart.title}" 已开启！`);
    }
    
    setIsStartModalOpen(false);
    setTripToStart(null);
    setTempStartDate('');
  };

  const handleTerminateTrip = (trip, e) => {
      e.stopPropagation();
      if (window.confirm('确定要提前结束该行程吗？结束行程后将停止行程提醒。')) {
          // Clear active trip ID
          setActiveTripId(null);

          if (adoptedTrip && trip.id === adoptedTrip.id) {
              onUpdateTrip({ startTime: null, status: 'completed' });
          } else {
              setLocalTrips(prev => prev.map(t => 
                  t.id === trip.id 
                      ? { ...t, startTime: null, status: 'completed' }
                      : t
              ));
              alert(`行程 "${trip.title}" 已结束！`);
          }
      }
  };

  const getYearMonth = (dateStr) => {
      if (!dateStr) return '';
      const start = dateStr.split('-')[0].trim();
      let year = '', month = '';
      if (start.match(/^\d{4}\/\d{1,2}/)) {
          const parts = start.split('/');
          year = parts[0];
          month = String(parseInt(parts[1], 10)).padStart(2, '0');
      } else if (start.match(/^\d{2}\.\d{2}$/)) {
          const [m, d] = start.split('.');
          year = '2026';
          month = String(parseInt(m, 10)).padStart(2, '0');
      } else if (start.match(/^\d{2}\/\d{2}$/)) {
          const [m, d] = start.split('/');
          year = '2026';
          month = String(parseInt(m, 10)).padStart(2, '0');
      }
      return year && month ? `${year}/${month}` : start;
  };

  const availableYearMonths = Array.from(new Set(
      myTrips.map(t => getYearMonth(t.date))
      .filter(d => d)
  )).sort();

  const years = Array.from(new Set(
      availableYearMonths.map(ym => parseInt(ym.split('/')[0], 10))
  )).sort();

  const statusOptions = [
    { value: 'all', label: '状态' },
    { value: 'planned', label: '计划中' },
    { value: 'upcoming', label: '进行中' },
    { value: 'completed', label: '已完成' }
  ];

  const filteredTrips = myTrips.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (activeTab !== 'all') {
          const ym = getYearMonth(t.date);
          if (ym !== activeTab) return false;
      }
      return true;
  }).sort((a, b) => {
        // Active trip comes first
        if (a.id === activeTripId) return -1;
        if (b.id === activeTripId) return 1;
        return 0;
    });

  const toggleTripSelection = (tripId) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else {
      if (selectedTrips.length >= 3) {
        // Optional: Alert max 3
        return;
      }
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };

  const handleStartCompare = () => {
    const tripsToCompare = myTrips.filter(t => selectedTrips.includes(t.id));
    navigate('/trip/compare', { state: { trips: tripsToCompare } });
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="h-full w-full overflow-y-auto scrollbar-hide pb-24 px-6 pt-12">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">精选线路</h1>
        <p className="text-sm text-slate-500 font-medium mt-1 tracking-wide">EXPLORE GUIZHOU</p>
      </header>

      {/* Featured Routes (Horizontal Scroll) - Shrunk */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 mb-8 flex gap-3">
        <HorizontalTripCard 
          title="黄果树瀑布深度游"
          tags={['5A景区', '瀑布奇观', '亲子优选']}
          price="1280"
          bgImage={getPlaceholder(600, 300, 'Waterfall Trip')}
        />
        <HorizontalTripCard 
          title="西江千户苗寨"
          tags={['苗族风情', '长桌宴', '夜景迷人']}
          price="980"
          bgImage={getPlaceholder(600, 300, 'Miao Village')}
        />
      </div>

      {/* My Trips Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 whitespace-nowrap">我的行程</h2>
          
          <div className="flex gap-2 relative z-20">
            <CalendarFilter 
              value={activeTab} 
              onChange={setActiveTab} 
              years={years}
              availableYearMonths={availableYearMonths}
            />
            <FilterDropdown 
              options={statusOptions} 
              value={statusFilter} 
              onChange={setStatusFilter} 
              label="状态"
            />
          </div>
        </div>

        {/* Trip List */}
        <div className="space-y-6 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredTrips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                isCompareMode={isCompareMode}
                isSelected={selectedTrips.includes(trip.id)}
                onSelect={() => toggleTripSelection(trip.id)}
                onStart={(e) => handleOpenStartModal(trip, e)}
                onTerminate={(e) => handleTerminateTrip(trip, e)}
              />
            ))}
          </AnimatePresence>
          {filteredTrips.length === 0 && (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
              <Calendar size={48} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">暂无行程，快去规划你的第一次旅行吧</p>
            </div>
          )}
        </div>
      </section>
      </div>

      {/* Floating Action Button for Compare */}
      <AnimatePresence>
        {isCompareMode && selectedTrips.length >= 2 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-28 right-6 z-50"
          >
            <div className="relative group">
               {/* Tooltip */}
               <div className="absolute bottom-full right-0 mb-3 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl mb-1">
                   点击开始对比
                 </div>
               </div>

               <button 
                onClick={handleStartCompare}
                className="w-16 h-16 bg-cyan-500 text-white rounded-full shadow-2xl shadow-cyan-200 flex flex-col items-center justify-center active:scale-95 transition-transform relative border-4 border-white gap-0.5"
               >
                <span className="text-[10px] font-bold leading-none">开始</span>
                <span className="text-[10px] font-bold leading-none">比对</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                  {selectedTrips.length}
                </div>
               </button>
            </div>
          </motion.div>
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
                 <h2 className="text-xl font-bold text-slate-800">开启行程：{tripToStart?.title}</h2>
                 <p className="text-sm text-slate-500 mt-2">请选择您的出发时间，我们将为您开启行程倒计时</p>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">选择出发日期</label>
                    <input 
                      type="date" 
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
    </div>
  );
};

const HorizontalTripCard = ({ title, tags, price, bgImage }) => (
  <div className="flex-shrink-0 w-[70%] h-48 rounded-[2rem] p-5 text-white relative overflow-hidden group">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img src={bgImage} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
    </div>

    <div className="relative z-10 h-full flex flex-col justify-end">
      <div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
           {tags && tags.map((tag, i) => (
             <span key={i} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/90">
               {tag}
             </span>
           ))}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold leading-tight mb-2 text-shadow-sm line-clamp-2">{title}</h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-xs font-medium opacity-80">¥</span>
          <span className="text-xl font-black text-cyan-400">{price}</span>
          <span className="text-[10px] opacity-60 ml-1">起</span>
        </div>
      </div>
    </div>
  </div>
);

const TripCard = ({ trip, isCompareMode, isSelected, onSelect, onStart, onTerminate }) => {
  const navigate = useNavigate();
  
  return (
  <motion.div 
    layout
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    onClick={() => {
      if (isCompareMode) {
        onSelect();
      } else {
        navigate(`/trip/${trip.id}`);
      }
    }}
    className={`w-full h-[280px] rounded-[2rem] relative overflow-hidden group cursor-pointer shadow-sm transition-all ${isCompareMode && isSelected ? 'ring-4 ring-cyan-500 scale-[0.98]' : ''}`}
  >
    <img 
      src={trip.image} 
      alt={trip.title} 
      crossOrigin="anonymous"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    
    <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
       <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
         {trip.status === 'upcoming' ? '即将开始' : trip.status === 'completed' ? '已完成' : '计划中'}
       </span>
    </div>

    {/* Start Trip Button (Only for planned/upcoming without start time) */}
    {!isCompareMode && !trip.startTime && trip.status !== 'completed' && (
      <div className="absolute top-5 right-5 z-10">
        <button 
          onClick={onStart}
          className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Play size={12} fill="currentColor" />
          开始行程
        </button>
      </div>
    )}

    {/* Terminate Trip Button (For trips that have started) */}
    {!isCompareMode && trip.startTime && trip.status !== 'completed' && (
      <div className="absolute top-5 right-5 z-10">
        <button 
          onClick={onTerminate}
          className="bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1.5 active:scale-95 transition-all backdrop-blur-md"
        >
          <X size={12} />
          提前结束
        </button>
      </div>
    )}

    {/* Selection Overlay */}
    {isCompareMode && (
      <div className="absolute top-5 right-5 z-30">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white/30 backdrop-blur-md border border-white/50'}`}>
          {isSelected ? <CheckCircle2 size={18} /> : <Circle size={18} className="text-white" />}
        </div>
      </div>
    )}

    <div className="absolute bottom-0 left-0 right-0 p-6">
      <div className="mb-4">
        <h3 className="text-white text-xl font-bold leading-tight mb-1 line-clamp-2">
          {trip.title}
        </h3>
        <p className="text-white/60 text-xs font-medium">{formatTripDate(trip.date).split(' - ')[0]}</p>
      </div>
      
      <div className="flex items-center gap-3 text-white/80 text-xs font-medium">
         <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
           <Clock size={12} />
           <span>{trip.days}天</span>
         </div>
         <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm hidden">
           <MapPin size={12} />
           <span>{trip.distance}</span>
         </div>
         <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm hidden">
           <Users size={12} />
           <span>{trip.rating}分</span>
         </div>
      </div>
    </div>
  </motion.div>
)};

export default Trip;
