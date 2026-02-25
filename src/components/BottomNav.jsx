import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, ShoppingBag, User, Plus, X, Users, Link, ScanLine, Sparkles, FileText, Image, Upload, Check, Loader2, Plane, Utensils, Bed, Flag, MapPin, Calendar, Clock, ChevronDown, ChevronUp, ArrowLeft, AlertTriangle, Trash2, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaceholder } from '../utils/imageUtils';

const BottomNav = ({ onAdoptTrip, isAuthenticated, hasTrip }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0); // 0: none, 1: click plus, 2: click import, 3: paste link, 4: confirm, 5: finish

  const isActive = (path) => location.pathname === path;

  // Guide Logic
  useEffect(() => {
     if (location.pathname === '/trip' && !hasTrip && guideStep === 0) {
        // Trigger guide when on trip page with no trip
        setGuideStep(1);
     }
  }, [location.pathname, hasTrip, guideStep]);

  // Auth check helper
  const handleNav = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
     setIsMenuOpen(!isMenuOpen);
     if (guideStep === 1) setGuideStep(2);
  };

  const handleCreateTrip = () => {
    if (!isAuthenticated) {
        setIsMenuOpen(false);
        navigate('/login', { state: { from: { pathname: '/chat-planning' } } });
        return;
    }
    setIsMenuOpen(false);
    navigate('/chat-planning');
  };

  const handleImportTrip = () => {
    if (!isAuthenticated) {
        setIsMenuOpen(false);
        navigate('/login'); // Modal state is not preserved easily, so just login first
        return;
    }
    setIsMenuOpen(false);
    setIsImportModalOpen(true);
    if (guideStep === 2) setGuideStep(3);
  };

  return (
    <>
      {/* Guide Overlay - Full Screen Mask for Step 1 */}
      <AnimatePresence>
         {guideStep === 1 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 z-[35] pointer-events-auto"
               onClick={() => {
                 // Optional: Allow clicking background to skip? Better not for forced guide.
               }}
            />
         )}
      </AnimatePresence>

      {/* Guide Tooltip */}
      <AnimatePresence>
         {guideStep > 0 && (
            <div className="fixed inset-0 z-[60] pointer-events-none">
               {/* Step 1: Point to Plus Button */}
               {guideStep === 1 && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                     className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-6 py-3 rounded-xl shadow-xl flex flex-col items-center gap-2 pointer-events-auto"
                  >
                     <div className="text-base font-bold flex items-center gap-2">
                       <Sparkles size={18} className="text-yellow-300" />
                       点击这里开启行程
                     </div>
                     <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-cyan-500 absolute -bottom-2" />
                  </motion.div>
               )}
            </div>
         )}
      </AnimatePresence>

      <motion.div 
        key="navbar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-300 ${guideStep === 1 ? 'scale-105' : ''}`}
      >
        <div className={`backdrop-blur-xl border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-6 pt-2 pb-6 flex justify-between items-center relative ${guideStep === 1 ? 'bg-transparent border-white/20' : 'bg-white/95'}`}>
          
          {/* Inner Overlay for Guide Step 1 to dim other icons */}
          {guideStep === 1 && (
            <div className="absolute inset-0 bg-black/60 z-10" />
          )}

          <NavIcon 
            icon={Home} 
            label="首页" 
            active={isActive('/')} 
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }} 
            className="relative z-0"
          />
          <NavIcon 
            icon={Map} 
            label="行程" 
            active={isActive('/trip')} 
            onClick={() => handleNav('/trip')} 
            className="relative z-0"
          />
          
          {/* Central Plus Button */}
          <div className="relative z-20">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative ${isMenuOpen ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'} ${guideStep === 1 ? 'ring-4 ring-cyan-400/30 animate-pulse scale-110' : ''}`}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Plus size={20} strokeWidth={2} />
              </motion.div>
            </motion.button>
          </div>

          <NavIcon 
            icon={ShoppingBag} 
            label="优选" 
            active={isActive('/shop')} 
            onClick={() => {
              navigate('/shop');
              setIsMenuOpen(false);
            }} 
            className="relative z-0"
          />
          <NavIcon 
            icon={User} 
            label="我的" 
            active={isActive('/profile')} 
            onClick={() => handleNav('/profile')} 
            className="relative z-0"
          />
        </div>
      </motion.div>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-30 flex flex-col justify-end pb-32 px-6 backdrop-blur-md ${guideStep === 2 ? 'bg-slate-900/90' : 'bg-slate-900/60'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
               {/* Guide Step 2 Overlay */}
               {guideStep === 2 && (
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                     className="absolute bottom-[100px] left-10 z-[70] bg-white text-slate-900 px-4 py-2 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2"
                  >
                     <ArrowLeft className="rotate-180 text-cyan-500" size={16} /> 第二步：选择导入行程
                  </motion.div>
               )}

              <MenuOption 
                title="创建新行程" 
                subtitle="召唤智能行程规划师，为您定制规划"
                icon={Sparkles}
                gradient="bg-gradient-to-r from-violet-500 to-fuchsia-600"
                textColor="text-white"
                subtitleColor="text-white/80"
                delay={0.1}
                onClick={handleCreateTrip}
                disabled={guideStep === 2}
              />
              <MenuOption 
                title="扫码导入" 
                subtitle="扫码行程码或导游码进行行程绑定导入"
                icon={ScanLine}
                delay={0.2}
                onClick={handleImportTrip}
                isHighlight={guideStep === 2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        guideStep={guideStep}
        setGuideStep={setGuideStep}
        onConfirm={(data) => {
          setIsImportModalOpen(false);
          setGuideStep(5); // Finish
          setTimeout(() => setGuideStep(0), 3000); // Auto hide finish msg
          // Adopt trip immediately
          if (onAdoptTrip) {
            onAdoptTrip(data);
          }
          // Navigate to Trip page to show the result
          navigate('/trip');
        }}
      />
      
      {/* Finish Guide Message */}
      <AnimatePresence>
         {guideStep === 5 && (
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl z-[80] text-center w-[80%]"
            >
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-green-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">太棒了！</h3>
               <p className="text-slate-500 text-sm">您的行程已成功导入，黄小西已为您准备好所有服务，旅途愉快！</p>
            </motion.div>
         )}
      </AnimatePresence>
    </>
  );
};

const ImportModal = ({ isOpen, onClose, onConfirm, guideStep, setGuideStep }) => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
        setIsScanning(true);
        // Mock scanning process
        const timer = setTimeout(() => {
            const scannedData = {
                title: "识别到的行程：黄果树瀑布2日游",
                agency: {
                    name: "贵州风光国际旅行社",
                    license: "L-GZ-CJ0022",
                    level: "AAAA",
                    operator: "李四",
                    operatorId: "8888",
                    createTime: "2026-05-01 10:00"
                },
                days: 2,
                date: "05.01-05.02",
                itinerary: [
                    {
                        date: "05.01",
                        dayLabel: "Day 1",
                        tag: "自然奇观",
                        weather: { temp: "20°C", desc: "晴" }, 
                        highlights: "黄果树瀑布 — 陡坡塘 — 天星桥",
                        tips: "建议穿着舒适的运动鞋，注意防晒。",
                        timeline: [
                          {
                            id: 'p-arrival',
                            time: '08:30',
                            title: '抵达贵阳',
                            type: 'flight',
                            status: 'planned',
                            details: { 
                                flightNo: 'CZ3681', 
                                dep: '北京大兴', 
                                arr: '贵阳龙洞堡', 
                                desc: '准点率 98%' 
                            }
                          },
                          {
                            id: 'p-1',
                            time: '10:30',
                            title: '黄果树大瀑布',
                            type: 'scenic',
                            status: 'planned',
                            image: getPlaceholder(400, 300, 'Waterfall'),
                            details: { 
                                name: '黄果树大瀑布', 
                                desc: '亚洲第一大瀑布',
                                address: '安顺市关岭布依族苗族自治县'
                            }
                          },
                          {
                            id: 'p-stay',
                            time: '20:00',
                            title: '入住酒店',
                            type: 'hotel',
                            status: 'planned',
                            details: { 
                                name: '黄果树景区附近客栈', 
                                desc: '高级大床房 | 含早',
                                roomType: '高级大床房',
                                address: '黄果树风景名胜区新城'
                            }
                          }
                        ]
                    },
                    {
                        date: "05.02",
                        dayLabel: "Day 2",
                        tag: "文化探索",
                        weather: { temp: "22°C", desc: "多云" }, 
                        highlights: "龙宫 — 屯堡文化 — 返程",
                        tips: "龙宫内气温较低，建议带件薄外套。",
                        timeline: [
                          {
                            id: 'p-2-drive',
                            time: '08:30',
                            title: '自驾前往',
                            type: 'transport',
                            status: 'planned',
                            tips: "早高峰路况拥堵，建议提前出发。",
                            details: { 
                                name: '自驾出行', 
                                desc: '前往龙宫景区', 
                                flightNo: '自驾',
                                start: '酒店', 
                                end: '龙宫景区', 
                                duration: '1h' 
                            }
                          },
                          {
                            id: 'p-2-1',
                            time: '09:30',
                            title: '龙宫景区',
                            type: 'scenic',
                            status: 'planned',
                            image: getPlaceholder(400, 300, 'DragonCave'),
                            details: { 
                                name: '龙宫', 
                                desc: '中国最美水溶洞',
                                address: '安顺市西秀区龙宫镇'
                            }
                          },
                          {
                             id: 'p-group-meal',
                             time: '12:00',
                             title: '团队午餐',
                             type: 'group_meal',
                             status: 'planned',
                             details: {
                                name: '屯堡特色餐厅',
                                standard: '50元/人',
                                menu: '八菜一汤',
                                desc: '标准团餐',
                                address: '安顺市平坝区天龙屯堡景区内'
                             }
                          },
                          {
                            id: 'p-2-2',
                            time: '13:30',
                            title: '天龙屯堡',
                            type: 'scenic',
                            status: 'planned',
                            image: getPlaceholder(400, 300, 'Village'),
                            details: { 
                                name: '天龙屯堡', 
                                desc: '600年大明遗风',
                                address: '安顺市平坝区天龙镇'
                            }
                          },
                          {
                            id: 'p-2-end',
                            time: '17:00',
                            title: '行程结束',
                            type: 'transport',
                            status: 'planned',
                            details: { 
                                name: '送机返程', 
                                flightNo: 'CZ3682', 
                                dep: '贵阳龙洞堡', 
                                arr: '北京大兴', 
                                desc: '预计19:30抵达' 
                            }
                          }
                        ]
                    }
                ]
            };
            
            setIsScanning(false);
            onClose();
            navigate('/trip/confirm', { state: { scannedData } });
            
        }, 2000);
        return () => clearTimeout(timer);
    } else {
        setIsScanning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <AnimatePresence mode="wait">
        {isScanning && (
          <motion.div 
            key="scanning"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-sm aspect-square bg-transparent border-2 border-cyan-500/50 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden"
          >
             <div className="absolute inset-0 border-2 border-cyan-500 rounded-[2rem] opacity-50" />
             <motion.div 
               className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             />
             <ScanLine size={48} className="text-cyan-400 mb-4 animate-pulse" />
             <p className="text-white font-bold text-lg">正在识别行程码...</p>
             <p className="text-white/60 text-xs mt-2">请将取景框对准行程二维码</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimelineItem = ({ time, icon, iconBg, title, children }) => (
  <div className="relative pl-8">
    <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${iconBg} flex items-center justify-center shadow-sm z-10`}>
      {icon}
    </div>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs font-bold text-slate-800">{time}</span>
      <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-md">{title}</span>
    </div>
    {children}
  </div>
);

const MenuOption = ({ title, subtitle, icon: Icon, gradient = "bg-white", textColor = "text-slate-800", subtitleColor = "text-slate-500", delay, onClick, isHighlight, disabled }) => (
  <motion.button
    initial={{ y: 50, opacity: 0, scale: 0.9 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 50, opacity: 0, scale: 0.9 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={!disabled ? onClick : undefined}
    className={`w-full p-5 rounded-3xl shadow-lg text-left flex items-center justify-between ${gradient} ${isHighlight ? 'ring-4 ring-cyan-400/50 animate-pulse relative z-50' : ''} ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
  >
    <div>
      <h3 className={`text-lg font-bold mb-1 ${textColor}`}>{title}</h3>
      <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>
    </div>
    {Icon && (
      <div className={`p-2 rounded-full ${textColor === 'text-white' ? 'bg-white/20' : 'bg-slate-100'}`}>
        <Icon size={24} className={textColor === 'text-white' ? 'text-white' : 'text-slate-600'} />
      </div>
    )}
  </motion.button>
);

const NavIcon = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 gap-1 transition-all duration-300 ${active ? 'text-cyan-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-cyan-50' : 'bg-transparent'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-medium ${active ? 'text-cyan-600' : 'text-slate-400'}`}>
      {label}
    </span>
  </button>
);

export default BottomNav;
