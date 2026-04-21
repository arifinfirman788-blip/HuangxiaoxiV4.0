import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Trash2, Plane, MapPin, XCircle, RefreshCw } from 'lucide-react';
import { Page, Trip } from '../types';
import StartTripModal from '../components/StartTripModal';
import { getTrips, setTripsStore } from '../store';

const statusOrder = { '进行中': 0, '计划中': 1, '已完成': 2 };

export default function TripList({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [trips, setTrips] = useState<Trip[]>(getTrips());

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  const handleUpdateTrips = (newTrips: Trip[] | ((prev: Trip[]) => Trip[])) => {
    setTrips(prev => {
      const updated = typeof newTrips === 'function' ? newTrips(prev) : newTrips;
      setTripsStore(updated);
      return updated;
    });
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Custom Alert/Confirm State
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'alert', message: '' });

  const showDialog = (type: 'alert' | 'confirm', message: string, onConfirm?: () => void) => {
    setDialogConfig({ isOpen: true, type, message, onConfirm });
  };
  
  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, isOpen: false }));
  };
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const filteredAndSortedTrips = useMemo(() => {
    return trips
      .filter(trip => {
        if (filterStatus !== 'all' && trip.status !== filterStatus) return false;
        if (filterYear === 'date') {
          if (filterDate && trip.startTime !== filterDate) return false;
        } else if (filterYear !== 'all') {
          const tripYear = new Date(trip.startTime).getFullYear().toString();
          if (tripYear !== filterYear) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      });
  }, [trips, filterYear, filterStatus, filterDate]);

  const handleStartTrip = (trip: Trip) => {
    const hasActiveTrip = trips.some(t => t.status === '进行中');
    if (hasActiveTrip) {
      showDialog('alert', '已有在进行中的行程，请结束进行中的行程后再进行开始当前行程');
      return;
    }
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const confirmStartTrip = (date: string) => {
    if (selectedTrip) {
      handleUpdateTrips(prev => prev.map(t => 
        t.id === selectedTrip.id ? { ...t, status: '进行中', startTime: date } : t
      ));
      showDialog('alert', `已成功开启行程：${selectedTrip.title}`);
      setModalOpen(false);
      setSelectedTrip(null);
    }
  };

  const handleEndTrip = (trip: Trip) => {
    showDialog('confirm', '确定要提前结束该行程吗？结束行程后将停止行程提醒', () => {
      handleUpdateTrips(prev => prev.map(t => 
        t.id === trip.id ? { ...t, status: '已完成' } : t
      ));
    });
  };

  const handleDeleteTrip = (trip: Trip) => {
    if (trip.status === '进行中') {
      showDialog('alert', '进行中行程不支持删除');
      return;
    }
    showDialog('confirm', '确定要删除该行程吗？', () => {
      handleUpdateTrips(prev => prev.filter(t => t.id !== trip.id));
    });
  };

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      {/* Header Banner */}
      <div className="relative h-64 overflow-hidden rounded-b-[2.5rem]">
        <img src={`${import.meta.env.BASE_URL}图片/行程-首页背景.jpg`} alt="行程背景" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        
        <div className="relative pt-12 px-6 flex flex-col items-center">
          <h1 className="text-white text-2xl font-bold tracking-widest flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}left pic.png`} alt="left" className="h-6 object-contain" />
            精选线路
            <img src={`${import.meta.env.BASE_URL}right pic.png`} alt="right" className="h-6 object-contain" />
          </h1>
          
          {/* Horizontal Scroll Items */}
          <div className="w-full mt-8 flex gap-4 overflow-x-auto scrollbar-hide px-2">
            <div className="flex-shrink-0 w-64 bg-white/20 backdrop-blur-md rounded-full p-2 flex items-center gap-3 border border-white/30">
              <img src={`${import.meta.env.BASE_URL}图片/首页.jpg`} className="w-12 h-12 rounded-full object-cover" />
              <div className="text-white">
                <div className="font-bold text-sm">黄果树瀑布深度游</div>
                <div className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="flex items-center"><MapPin size={10} className="mr-0.5"/> 中国·贵州</span>
                  <span>📅 05月</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white/30">
              <img src={`${import.meta.env.BASE_URL}图片/凯里酸汤鱼.jpg`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">我的行程</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Explore Guizhou</p>
          </div>
          <div className="flex gap-2">
            {filterYear === 'date' ? (
              <div className="flex items-center bg-white border border-gray-200 rounded-full pl-3 pr-1 py-1">
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-xs font-medium outline-none bg-transparent"
                />
                <button 
                  onClick={() => { setFilterYear('all'); setFilterDate(''); }} 
                  className="ml-1 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <XCircle size={14} />
                </button>
              </div>
            ) : (
              <select 
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value);
                  if (e.target.value !== 'date') setFilterDate('');
                }}
                className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium outline-none appearance-none pr-8 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
              >
                <option value="all">📅 时间</option>
                {years.map(y => <option key={y} value={y}>{y}年</option>)}
                <option value="date">日期选择</option>
              </select>
            )}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium outline-none appearance-none pr-8 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              <option value="all">状态</option>
              <option value="进行中">进行中</option>
              <option value="计划中">计划中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
        </div>

        {filteredAndSortedTrips.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plane size={32} className="text-gray-300" />
            </div>
            <p className="text-sm">暂无行程，快去规划你的第一次旅行吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedTrips.map(trip => (
              <div 
                key={trip.id} 
                className="relative h-64 rounded-3xl overflow-hidden shadow-sm cursor-pointer group"
                onClick={() => onNavigate('trip-detail')}
              >
                <img src={trip.imageUrl} alt={trip.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className={`absolute top-4 left-4 backdrop-blur px-3 py-1 rounded-full text-xs font-bold ${
                  trip.status === '进行中' ? 'bg-green-500/90 text-white' : 
                  trip.status === '已完成' ? 'bg-gray-500/90 text-white' : 
                  'bg-white/90 text-gray-800'
                }`}>
                  {trip.status}
                </div>
                
                {trip.status !== '进行中' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTrip(trip);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end mb-4">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">{trip.title}</h3>
                      <p className="text-xs text-white/80">{trip.startTime}</p>
                    </div>
                    <div className="text-white text-sm flex items-center gap-1">
                      ⏱ {trip.days}天
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {trip.status === '进行中' ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEndTrip(trip);
                        }}
                        className="w-full py-3 bg-red-500/80 backdrop-blur-md border border-red-400/50 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-red-500 transition z-10"
                      >
                        <XCircle size={18} /> 提前结束
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTrip(trip);
                        }}
                        className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition z-10"
                      >
                        {trip.status === '已完成' ? <RefreshCw size={18} /> : <Plane size={18} />} 
                        {trip.status === '已完成' ? '重新开始' : '开始行程'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <StartTripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmStartTrip} />

      {/* Custom Dialog */}
      {dialogConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDialog} />
          <div className="bg-white rounded-3xl p-6 relative z-10 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">提示</h3>
            <p className="text-gray-600 text-sm mb-6">{dialogConfig.message}</p>
            <div className="flex gap-3">
              {dialogConfig.type === 'confirm' && (
                <button 
                  onClick={closeDialog}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  取消
                </button>
              )}
              <button 
                onClick={() => {
                  dialogConfig.onConfirm?.();
                  closeDialog();
                }}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
