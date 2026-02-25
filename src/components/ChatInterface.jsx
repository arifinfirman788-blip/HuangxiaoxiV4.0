import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Send, Mic, Plane, Utensils, Flag, Sparkles, Check, ChevronDown, ChevronUp, ChevronRight, Star, Info, Car, Camera, Hotel, Loader2, Wand2, RefreshCcw, ArrowRight, Bed, MapPin, X, ZoomIn, ZoomOut, MessageSquare, Phone, BadgeCheck, MoreHorizontal, MessageCircle } from 'lucide-react';
import TuoSaiImage from '../image/托腮_1.png';
import { agents as availableAgents } from '../data/agents';
import { getPlaceholder } from '../utils/imageUtils';
import ReservationLetterCard from './ReservationLetterCard';
import MuseumAvatar from '../image/bowuguan.png';
import WangAyiAvatar from '../image/wangayi.png';
import LiuDaGeAvatar from '../image/liudage.png';
import HotelAvatar from '../image/jiudian.png';
import GuideAvatar from '../image/daoyou.png';
import ScenicAvatar from '../image/huangguoshu.png';
import PeasantAvatar from '../image/avatars/peasant.png';
import CarAvatar from '../image/zhuanche.png';

const mockUser = {
    name: "陈小明",
    phone: "13800138000",
    idCard: "520102199001011234"
};

const getAutoFilledValue = (req) => {
    if (req.includes('姓名') || req.includes('人名')) return mockUser.name;
    if (req.includes('电话') || req.includes('手机')) return mockUser.phone;
    if (req.includes('身份证') || req.includes('证件')) return mockUser.idCard;
    return '';
};

const VideoPlayerModal = ({ videoUrl, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
    onClick={onClose}
  >
    <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <video 
            src={videoUrl} 
            className="w-full h-full object-contain" 
            controls 
            autoPlay
        />
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-colors z-50"
        >
            <X size={20} />
        </button>
    </div>
  </motion.div>
);

const ImageViewer = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    
    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative w-full h-full flex items-center justify-center">
                <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: scale, opacity: 1 }}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    src={imageUrl} 
                    alt="Full view"
                    onClick={(e) => e.stopPropagation()}
                />
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <button onClick={handleZoomOut} className="p-2 text-white hover:text-cyan-400 disabled:opacity-50" disabled={scale <= 1}>
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-white text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={handleZoomIn} className="p-2 text-white hover:text-cyan-400 disabled:opacity-50" disabled={scale >= 3}>
                        <ZoomIn size={20} />
                    </button>
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                >
                    <X size={20} />
                </button>
            </div>
        </motion.div>
    );
};

const HotelServiceCard = ({ title, requirements, onSubmit, onViewImage }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState(() => {
        const initial = {};
        requirements.forEach(req => {
            initial[req] = getAutoFilledValue(req);
        });
        return initial;
    });

    const hasAutoFill = requirements.some(req => getAutoFilledValue(req));

    const rooms = [
        { id: 1, name: '高级大床房', price: '¥458', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300&auto=format&fit=crop', tags: ['25㎡', '大窗', '含早'] },
        { id: 2, name: '行政双床房', price: '¥588', image: 'https://images.unsplash.com/photo-1590490360182-c87295ecc059?q=80&w=300&auto=format&fit=crop', tags: ['35㎡', '浴缸', '双早'] },
        { id: 3, name: '全景套房', price: '¥888', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300&auto=format&fit=crop', tags: ['50㎡', '落地窗', '行政礼遇'] },
    ];

    const handleSubmit = () => {
        if (!selectedRoom) return;
        setIsSubmitted(true);
        if (onSubmit) onSubmit({ ...formData, roomType: selectedRoom.name, price: selectedRoom.price });
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 w-full">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Hotel size={16} className="text-indigo-500" />
                {title}
            </h4>
            
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {rooms.map(room => (
                    <div 
                        key={room.id}
                        onClick={() => !isSubmitted && setSelectedRoom(room)}
                        className={`shrink-0 w-32 rounded-xl border overflow-hidden transition-all cursor-pointer ${selectedRoom?.id === room.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'}`}
                    >
                        <div className="h-20 bg-slate-100 relative group">
                            <img 
                                src={room.image} 
                                alt={room.name} 
                                className="w-full h-full object-cover" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onViewImage) onViewImage(room.image);
                                }}
                            />
                            <div className="absolute top-1 right-1 bg-black/30 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <ZoomIn size={12} className="text-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 pointer-events-none">
                                <span className="text-white text-xs font-bold">{room.price}</span>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="text-[10px] font-bold text-slate-800 truncate mb-1">{room.name}</div>
                            <div className="flex flex-wrap gap-1">
                                {room.tags.map((tag, i) => (
                                    <span key={i} className="text-[8px] bg-slate-50 text-slate-500 px-1 rounded">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-50">
                {hasAutoFill && !isSubmitted && (
                    <div className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 border border-indigo-100">
                        <Sparkles size={12} />
                        黄小西已为您自动填充用户信息
                    </div>
                )}
                {requirements.filter(r => r !== '房型需求').map((req, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-xs text-slate-600">
                        <label className="font-bold">{req}</label>
                        <input 
                            type="text" 
                            disabled={isSubmitted}
                            value={formData[req] || ''}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                            placeholder={`请输入${req}`}
                            onChange={(e) => setFormData(prev => ({ ...prev, [req]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>
            
            {!isSubmitted ? (
                <button 
                    onClick={handleSubmit}
                    disabled={!selectedRoom}
                    className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
                >
                    确认预订
                </button>
            ) : (
                <div className="w-full mt-2 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-xs flex items-center justify-center gap-1 border border-green-200">
                    <Check size={14} /> 已提交
                </div>
            )}
        </div>
    );
};

const DiningServiceCard = ({ title, requirements, onSubmit, onViewImage }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState(() => {
        const initial = {};
        requirements.forEach(req => {
            initial[req] = getAutoFilledValue(req);
        });
        return initial;
    });

    const hasAutoFill = requirements.some(req => getAutoFilledValue(req));

    const types = [
        { id: 1, name: '景观散台', label: '2-4人', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop' },
        { id: 2, name: '商务包间', label: '6-10人', image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=300&auto=format&fit=crop' },
        { id: 3, name: '豪华包房', label: '10-16人', image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=300&auto=format&fit=crop' },
    ];

    const handleSubmit = () => {
        if (!selectedType) return;
        setIsSubmitted(true);
        if (onSubmit) onSubmit({ ...formData, tableType: selectedType.name });
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 w-full">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Utensils size={16} className="text-orange-500" />
                {title}
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
                {types.map(type => (
                    <div 
                        key={type.id}
                        onClick={() => !isSubmitted && setSelectedType(type)}
                        className={`rounded-xl border overflow-hidden transition-all cursor-pointer relative ${selectedType?.id === type.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-200'}`}
                    >
                        <div className="h-16 bg-slate-100 relative group">
                            <img 
                                src={type.image} 
                                alt={type.name} 
                                className="w-full h-full object-cover"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onViewImage) onViewImage(type.image);
                                }}
                            />
                            <div className="absolute top-1 right-1 bg-black/30 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <ZoomIn size={12} className="text-white" />
                            </div>
                        </div>
                        <div className="p-1.5 text-center bg-white">
                            <div className="text-[9px] font-bold text-slate-800">{type.name}</div>
                            <div className="text-[8px] text-slate-400">{type.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-2">
                {hasAutoFill && !isSubmitted && (
                    <div className="bg-orange-50 text-orange-600 text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 border border-orange-100">
                        <Sparkles size={12} />
                        黄小西已为您自动填充用户信息
                    </div>
                )}
                {requirements.map((req, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-xs text-slate-600">
                        <label className="font-bold">{req}</label>
                        <input 
                            type="text" 
                            disabled={isSubmitted}
                            value={formData[req] || ''}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-500"
                            placeholder={`请输入${req}`}
                            onChange={(e) => setFormData(prev => ({ ...prev, [req]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>
            
            {!isSubmitted ? (
                <button 
                    onClick={handleSubmit}
                    disabled={!selectedType}
                    className="w-full mt-2 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-200 active:scale-95 transition-all disabled:opacity-50"
                >
                    确认订座
                </button>
            ) : (
                <div className="w-full mt-2 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-xs flex items-center justify-center gap-1 border border-green-200">
                    <Check size={14} /> 已提交
                </div>
            )}
        </div>
    );
};

const AgentRecommendationCard = ({ title, agents, onConnect }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 w-full">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-500" />
                {title}
            </h4>
            
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
                {agents.map(agent => (
                    <div 
                        key={agent.id}
                        className="shrink-0 w-48 h-64 rounded-[1.5rem] overflow-hidden relative border-[3px] border-white shadow-lg cursor-pointer group bg-slate-900"
                        onClick={() => onConnect(agent)}
                    >
                        {/* Full Background Image */}
                        <img 
                            src={agent.avatar} 
                            alt={agent.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

                        {/* Right Side Actions (Visual Only) */}
                        <div className="absolute right-3 top-[35%] -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                <ArrowRight size={14} className="-rotate-45" />
                             </div>
                             <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                <MessageCircle size={14} />
                             </div>
                             <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                <MoreHorizontal size={14} />
                             </div>
                        </div>

                        {/* Bottom Glass Overlay Info */}
                        <div className="absolute bottom-2 left-2 right-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white shadow-sm z-20">
                             {/* Name & Status Row */}
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 min-w-0">
                                   <h3 className="text-xs font-bold leading-none text-white shadow-sm truncate">{agent.name}</h3>
                                   {agent.type === 'enterprise' && <BadgeCheck size={12} className="text-blue-400 shrink-0" fill="currentColor" stroke="white" />}
                                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)] shrink-0"></div>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                   <ChevronDown size={10} className="-rotate-90 text-white" />
                                </div>
                             </div>
                             
                             {/* Description Line */}
                             <p className="text-[9px] text-white/80 font-medium line-clamp-1 mt-1">{agent.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScenicServiceCard = ({ title, requirements, onSubmit, onViewImage }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState(() => {
        const initial = {};
        requirements.forEach(req => {
            initial[req] = getAutoFilledValue(req);
        });
        return initial;
    });

    const hasAutoFill = requirements.some(req => getAutoFilledValue(req));

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (onSubmit) onSubmit(formData);
    };

    const imageUrl = "https://images.unsplash.com/photo-1527684651001-731c474bbb5a?q=80&w=600&auto=format&fit=crop";

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 w-full">
            <div 
                className="h-32 relative group cursor-pointer"
                onClick={() => onViewImage && onViewImage(imageUrl)}
            >
                <img src={imageUrl} alt="Huangguoshu" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/30 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <ZoomIn size={16} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white pointer-events-none">
                    <h4 className="font-bold text-sm flex items-center gap-1">
                        <Camera size={14} />
                        {title}
                    </h4>
                    <p className="text-[10px] opacity-90 line-clamp-1">亚洲第一大瀑布，86版西游记取景地</p>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="bg-purple-50 p-2.5 rounded-xl text-[10px] text-purple-800 leading-relaxed border border-purple-100">
                    <span className="font-bold">文化背景：</span>
                    黄果树瀑布群是世界上典型的喀斯特瀑布群。除主瀑布外，还有螺丝滩、陡坡塘等18个瀑布，组成了庞大的瀑布家族。
                </div>

                <div className="space-y-3">
                    {hasAutoFill && !isSubmitted && (
                        <div className="bg-purple-50 text-purple-600 text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 border border-purple-100">
                            <Sparkles size={12} />
                            黄小西已为您自动填充用户信息
                        </div>
                    )}
                    {requirements.map((req, idx) => (
                        <div key={idx} className="flex flex-col gap-1 text-xs text-slate-600">
                            <label className="font-bold">{req}</label>
                            <input 
                                type="text" 
                                disabled={isSubmitted}
                                value={formData[req] || ''}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-500"
                                placeholder={`请输入${req}`}
                                onChange={(e) => setFormData(prev => ({ ...prev, [req]: e.target.value }))}
                            />
                        </div>
                    ))}
                </div>
                
                {!isSubmitted ? (
                    <button 
                        onClick={handleSubmit}
                        className="w-full mt-2 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-200 active:scale-95 transition-all hover:bg-purple-700"
                    >
                        提交预约
                    </button>
                ) : (
                    <div className="w-full mt-2 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-xs flex items-center justify-center gap-1 border border-green-200">
                        <Check size={14} /> 已提交
                    </div>
                )}
            </div>
        </div>
    );
};

const TransportServiceCard = ({ title, requirements, onSubmit, onViewImage }) => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState(() => {
        const initial = {};
        requirements.forEach(req => {
            initial[req] = getAutoFilledValue(req);
        });
        return initial;
    });

    const hasAutoFill = requirements.some(req => getAutoFilledValue(req));

    const cars = [
        { id: 1, name: '舒适5座', model: '大众帕萨特或同级', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=300&auto=format&fit=crop' },
        { id: 2, name: '商务7座', model: '别克GL8', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=300&auto=format&fit=crop' },
    ];

    const handleSubmit = () => {
        if (!selectedCar) return;
        setIsSubmitted(true);
        if (onSubmit) onSubmit({ ...formData, carType: selectedCar.name });
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 w-full">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Car size={16} className="text-green-600" />
                {title}
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
                {cars.map(car => (
                    <div 
                        key={car.id}
                        onClick={() => !isSubmitted && setSelectedCar(car)}
                        className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${selectedCar?.id === car.id ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200'}`}
                    >
                        <div className="h-20 bg-slate-100 relative group">
                             <img 
                                src={car.image} 
                                alt={car.name} 
                                className="w-full h-full object-cover" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onViewImage) onViewImage(car.image);
                                }}
                             />
                             <div className="absolute top-1 right-1 bg-black/30 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <ZoomIn size={12} className="text-white" />
                             </div>
                        </div>
                        <div className="p-2 bg-white">
                            <div className="text-xs font-bold text-slate-800">{car.name}</div>
                            <div className="text-[9px] text-slate-400 truncate">{car.model}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-2">
                {hasAutoFill && !isSubmitted && (
                    <div className="bg-green-50 text-green-600 text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 border border-green-100">
                        <Sparkles size={12} />
                        黄小西已为您自动填充用户信息
                    </div>
                )}
                {requirements.filter(r => r !== '车型要求').map((req, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-xs text-slate-600">
                        <label className="font-bold">{req}</label>
                        <input 
                            type="text" 
                            disabled={isSubmitted}
                            value={formData[req] || ''}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-green-500"
                            placeholder={`请输入${req}`}
                            onChange={(e) => setFormData(prev => ({ ...prev, [req]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>
            
            {!isSubmitted ? (
                <button 
                    onClick={handleSubmit}
                    disabled={!selectedCar}
                    className="w-full mt-2 py-2.5 rounded-xl bg-green-600 text-white font-bold text-xs shadow-md shadow-green-200 active:scale-95 transition-all disabled:opacity-50"
                >
                    确认用车
                </button>
            ) : (
                <div className="w-full mt-2 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-xs flex items-center justify-center gap-1 border border-green-200">
                    <Check size={14} /> 已提交
                </div>
            )}
        </div>
    );
};

const InfoRequirementCard = ({ title, requirements, onSubmit }) => {
    const [formData, setFormData] = useState(() => {
        const initial = {};
        requirements.forEach(req => {
            initial[req] = getAutoFilledValue(req);
        });
        return initial;
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const hasAutoFill = requirements.some(req => getAutoFilledValue(req));

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (onSubmit) onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Info size={16} className="text-cyan-500" />
                {title}
            </h4>
            <div className="space-y-3">
                {hasAutoFill && !isSubmitted && (
                    <div className="bg-cyan-50 text-cyan-600 text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 border border-cyan-100">
                        <Sparkles size={12} />
                        黄小西已为您自动填充用户信息
                    </div>
                )}
                {requirements.map((req, idx) => (
                    <div key={idx} className="flex flex-col gap-1 text-xs text-slate-600">
                        <label className="font-bold flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {idx + 1}
                            </div>
                            {req}
                        </label>
                        <input 
                            type="text" 
                            disabled={isSubmitted}
                            value={formData[req] || ''}
                            className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 outline-none focus:border-cyan-500 transition-colors ${isSubmitted ? 'opacity-70 bg-slate-100' : ''}`}
                            placeholder={`请输入${req}`}
                            onChange={(e) => setFormData(prev => ({ ...prev, [req]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>
            
            {!isSubmitted ? (
                <button 
                    onClick={handleSubmit}
                    className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-200 active:scale-95 transition-all hover:bg-cyan-600"
                >
                    提交信息
                </button>
            ) : (
                <div className="w-full mt-2 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-xs flex items-center justify-center gap-1 border border-green-200">
                    <Check size={14} /> 已提交
                </div>
            )}
        </div>
    );
};

const AgentGeneratedCard = ({ agent, onConnect }) => {
  return (
    <div className="bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-lg border-[3px] border-white w-full max-w-sm relative group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* Floating Sparkles Icon */}
      <div className="absolute top-4 right-4 animate-pulse">
         <Wand2 size={24} className="text-white/50" />
      </div>

      {/* Content */}
      <div className="relative z-20 pt-28 p-4">
         <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white shadow-sm space-y-3">
             {/* Header */}
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-white/20 shadow-inner">
                   <Sparkles size={20} className="text-white" />
                </div>
                <div>
                   <div className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider">AI Generated</div>
                   <h3 className="font-bold text-lg text-white leading-none">{agent.name}</h3>
                </div>
             </div>

             {/* Tags */}
             <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-100 text-[9px] font-bold rounded-md border border-indigo-500/30">
                   {agent.type === 'scenic' ? '景区服务' : agent.type === 'hotel' ? '酒店服务' : agent.type === 'food' ? '餐饮服务' : '生活服务'}
                </span>
                <span className="px-2 py-0.5 bg-white/10 text-white/70 text-[9px] font-bold rounded-md border border-white/10">
                   智能体V3.0
                </span>
             </div>
             
             {/* Description */}
             <p className="text-[10px] text-white/80 font-medium leading-relaxed">
                {agent.description || '该智能体由AI自动生成，已接入相关服务数据，可为您提供专业的咨询与服务。'}
             </p>
    
             {/* Action Button */}
             <button 
               onClick={onConnect}
               className="w-full py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-95 transition-all hover:bg-indigo-50"
             >
                <MessageSquare size={14} /> 立即对话
             </button>
         </div>
      </div>
    </div>
  );
};

const ChatInterface = ({ onAdoptTrip, onClose, initialMode, initialContext, onServiceSubmit, onConnectAgent, agentFeedback, merchantMessage, onUserMessage, isHumanMode }) => {
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: '你好！我是黄小西。不仅仅是行程规划，关于贵州旅游的一切，例如景点推荐、美食打卡、酒店预订等，您都可以问我哦！',
      time: '10:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [currentNode, setCurrentNode] = useState('root');
    const [planningContext, setPlanningContext] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [viewingVideoUrl, setViewingVideoUrl] = useState(null);

  // Helper to get agent info based on type
  const getAgentInfo = (type) => {
    switch (type) {
      case 'flight':
        return { name: "民航运行中心·交通智能体", icon: Plane, color: "text-blue-800", bgColor: "bg-blue-100", iconColor: "text-blue-600", headerBg: "bg-blue-50", border: "border-blue-100", tag: "实时监控航路", btnBg: "bg-blue-600", description: "接入民航数据中心，提供实时航班动态与保障服务" };
      case 'train':
      case 'transport':
        return { name: "交通出行服务·调度智能体", icon: Car, color: "text-green-800", bgColor: "bg-green-100", iconColor: "text-green-600", headerBg: "bg-green-50", border: "border-green-100", tag: "智能调度中", btnBg: "bg-green-600", description: "连接全网约车运力，提供最优出行方案" };
      case 'food':
        return { name: "本地生活服务·餐饮智能体", icon: Utensils, color: "text-orange-800", bgColor: "bg-orange-100", iconColor: "text-orange-600", headerBg: "bg-orange-50", border: "border-orange-100", tag: "美味推荐", btnBg: "bg-orange-600", description: "汇集本地必吃榜单，提供排队预约服务" };
      case 'scenic':
        return { name: "景区智慧服务·景区智能体", icon: Camera, color: "text-purple-800", bgColor: "bg-purple-100", iconColor: "text-purple-600", headerBg: "bg-purple-50", border: "border-purple-100", tag: "景点导览", btnBg: "bg-purple-600", description: "景区官方授权接入，提供语音讲解与购票服务" };
      case 'hotel':
        return { name: "酒店住宿服务·酒店智能体", icon: Hotel, color: "text-indigo-800", bgColor: "bg-indigo-100", iconColor: "text-indigo-600", headerBg: "bg-indigo-50", border: "border-indigo-100", tag: "贴心管家", btnBg: "bg-indigo-600", description: "酒店PMS直连，提供客房服务与入住办理" };
      default:
        return { name: "行程助手·智能体", icon: Info, color: "text-slate-800", bgColor: "bg-slate-100", iconColor: "text-slate-600", headerBg: "bg-slate-50", border: "border-slate-100", tag: "行程服务", btnBg: "bg-slate-800", description: "您的全能行程助手" };
    }
  };

  // Default trip data
  const defaultTrip = {
    id: Date.now(),
    title: "贵阳市经典路线3日游",
    days: 3,
    itinerary: [
      {
        date: "06.06",
        dayLabel: "Day 1",
        tag: "抵达日",
        weather: { temp: "22°C", desc: "多云" },
        highlights: "航班抵达 — 特色早餐 — 文昌阁 — 住宿",
        tips: "建议提前预订接机服务，避开早高峰。",
        timeline: [
          {
            id: 'flight-1',
            time: '08:00',
            title: '航班抵达',
            type: 'flight',
            status: 'upcoming',
            tips: "建议提前2小时到达机场，凭身份证办理值机。",
            details: {
              flightNo: 'CZ3685',
              dep: '北京大兴',
              arr: '龙洞堡T2',
              depTime: '06:00',
              arrTime: '08:10',
              status: '飞行中',
              desc: "预计准点到达"
            }
          },
          {
            id: 'breakfast-1',
            time: '09:30',
            title: '早餐·糯米饭',
            type: 'food',
            status: 'upcoming',
            tips: "这家店排队人较多，建议预留充足时间。",
            image: getPlaceholder(200, 200, 'Breakfast'),
            details: {
              name: '六广门毛阿姨糯米饭',
              desc: '距离机场 2.5km'
            }
          },
          {
            id: 'attr-1',
            time: '10:00',
            title: '文昌阁',
            type: 'scenic',
            status: 'upcoming',
            tips: "阁楼内楼梯较陡，上下请注意安全。",
            image: getPlaceholder(400, 300, 'Attraction'),
            details: {
              name: '文昌阁',
              desc: '建议游览时长 1.5h'
            }
          },
          {
            id: 'lunch-1',
            time: '12:30',
            title: '午餐·酸汤鱼',
            type: 'food',
            status: 'upcoming',
            tips: "酸汤鱼是贵州特色，建议搭配糊辣椒蘸水。",
            image: getPlaceholder(200, 200, 'Food'),
            details: {
              name: '老凯里酸汤鱼',
              desc: '人均 ¥80'
            }
          },
          {
            id: 'attr-2',
            time: '14:30',
            title: '甲秀楼',
            type: 'scenic',
            status: 'upcoming',
            tips: "贵阳地标建筑，夜景非常漂亮。",
            image: getPlaceholder(400, 300, 'Scenic'),
            details: {
              name: '甲秀楼',
              desc: '建议游览时长 1h'
            }
          },
          {
            id: 'hotel-1',
            time: '18:30',
            title: '住宿·桔子水晶',
            type: 'hotel',
            status: 'upcoming',
            tips: "酒店位于市中心，夜间休息请注意关好门窗。",
            image: getPlaceholder(400, 300, 'Hotel'),
            details: {
              name: '桔子水晶酒店',
              desc: '评分 5.0'
            }
          }
        ]
      },
      {
        date: "06.07",
        dayLabel: "Day 2",
        tag: "文化之旅",
        weather: { temp: "24°C", desc: "晴" },
        highlights: "青岩古镇 — 特色猪脚 — 花溪夜郎谷",
        tips: "古镇石板路较多，建议穿舒适的平底鞋。",
        timeline: [
          {
            id: 'breakfast-2',
            time: '09:00',
            title: '早餐·肠旺面',
            type: 'food',
            status: 'upcoming',
            tips: "金牌罗记肠旺面，汤鲜味美。",
            image: getPlaceholder(200, 200, 'Breakfast'),
            details: {
              name: '金牌罗记肠旺面',
              desc: '人均 ¥15'
            }
          },
          {
            id: 'attr-3',
            time: '10:30',
            title: '青岩古镇',
            type: 'scenic',
            status: 'upcoming',
            tips: "明清风格古镇，推荐品尝状元蹄。",
            image: getPlaceholder(400, 300, 'AncientTown'),
            details: {
              name: '青岩古镇',
              desc: '建议游览时长 3h'
            }
          },
          {
            id: 'lunch-2',
            time: '13:00',
            title: '午餐·青岩猪脚',
            type: 'food',
            status: 'upcoming',
            tips: "软糯入味，肥而不腻。",
            image: getPlaceholder(200, 200, 'Food'),
            details: {
              name: '王万妈卤猪脚',
              desc: '人均 ¥45'
            }
          },
          {
            id: 'attr-4',
            time: '15:30',
            title: '花溪夜郎谷',
            type: 'scenic',
            status: 'upcoming',
            tips: "石头城堡，独特的艺术风格。",
            image: getPlaceholder(400, 300, 'Scenic'),
            details: {
              name: '夜郎谷',
              desc: '建议游览时长 2h'
            }
          },
          {
            id: 'hotel-2',
            time: '19:00',
            title: '住宿·花溪迎宾馆',
            type: 'hotel',
            status: 'upcoming',
            tips: "环境清幽，毗邻花溪公园。",
            image: getPlaceholder(400, 300, 'Hotel'),
            details: {
              name: '花溪迎宾馆',
              desc: '评分 4.8'
            }
          }
        ]
      },
      {
        date: "06.08",
        dayLabel: "Day 3",
        tag: "自然与返程",
        weather: { temp: "23°C", desc: "阴" },
        highlights: "黔灵山公园 — 丝娃娃 — 返程",
        tips: "公园内有野生猕猴，请注意保管好个人物品。",
        timeline: [
          {
            id: 'attr-5',
            time: '09:00',
            title: '黔灵山公园',
            type: 'scenic',
            status: 'upcoming',
            tips: "早起可以看熊猫，还可以去弘福寺祈福。",
            image: getPlaceholder(400, 300, 'Park'),
            details: {
              name: '黔灵山公园',
              desc: '建议游览时长 2.5h'
            }
          },
          {
            id: 'lunch-3',
            time: '12:00',
            title: '午餐·丝娃娃',
            type: 'food',
            status: 'upcoming',
            tips: "各种素菜丝包在小面皮里，注入酸汤，口感丰富。",
            image: getPlaceholder(200, 200, 'Food'),
            details: {
              name: '丝恋红汤丝娃娃',
              desc: '人均 ¥40'
            }
          },
          {
            id: 'transport-2',
            time: '14:30',
            title: '前往机场',
            type: 'transport',
            status: 'upcoming',
            tips: "建议提前预约送机服务。",
            image: getPlaceholder(400, 300, 'Car'),
            details: {
              name: '专车送机',
              desc: '预计40分钟抵达'
            }
          },
          {
            id: 'flight-2',
            time: '17:00',
            title: '返程航班',
            type: 'flight',
            status: 'upcoming',
            tips: "祝您旅途愉快，期待下次相遇。",
            details: {
              flightNo: 'CZ3686',
              dep: '龙洞堡T2',
              arr: '北京大兴',
              depTime: '17:00',
              arrTime: '19:40',
              status: '计划',
              desc: "准点率 95%"
            }
          }
        ]
      }
    ]
  };

  // Listen for agent feedback
  useEffect(() => {
    if (agentFeedback) {
        // Add a message from the agent (Huang Xiaoxi relaying the feedback)
        const feedbackMsg = {
            id: Date.now(),
            sender: 'agent',
            text: agentFeedback.text,
            type: agentFeedback.type,
            data: agentFeedback.data,
            time: typeof agentFeedback.timestamp === 'string' 
                ? agentFeedback.timestamp 
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, feedbackMsg]);
        
        // Revert to Huang Xiaoxi (Service Agent hides)
        setActiveAgent(null);
    }
  }, [agentFeedback]);

  useEffect(() => {
    let timer;
    if (initialContext?.importedData) {
      const imported = initialContext.importedData;
      setCurrentTrip(imported);
      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: '已为您识别到行程信息，请确认👇',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 2,
          sender: 'agent',
          type: 'itinerary',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (initialContext?.nodeContext) {
      const node = initialContext.nodeContext;
      setCurrentNode(node);
      const agentInfo = getAgentInfo(node.type);
      setCurrentTrip(defaultTrip); 
      
      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: `请问您针对【${node.title || node.details?.name}】景区有什么问题，全都可以问小西哦`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (initialContext?.fromSquare) {
      // Direct Agent Mode for Agent Square - Modified to start with Huang Xiaoxi
      // We don't set activeAgent here anymore, letting Huang Xiaoxi handle the intro.
      
      setCurrentTrip(defaultTrip);
      
      const serviceChips = initialContext.services ? initialContext.services.map(s => `我想${s}`) : ['我想咨询', '我想预订'];
      // Add "Contact Merchant" chip
      serviceChips.push(`联系${initialContext.name}`);
      // Add Guizhou Selected chip
      serviceChips.push('贵州优选');

      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: `你好！我是黄小西。看到您对【${initialContext.name}】感兴趣，我可以为您调度该智能体为您服务，或者您可以直接告诉我您的需求。`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 2,
          sender: 'agent',
          type: 'chips',
          chips: serviceChips,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (initialContext?.role) {
      setCurrentTrip(defaultTrip);
      
      // Generate welcome message from Huang Xiaoxi (Dispatcher)
      const welcomeText = `你好！我是黄小西。看到您对【${initialContext.desc}】感兴趣，我可以为您调度该智能体为您服务，或者您可以直接告诉我您的需求。`;
      
      const prompts = initialContext.services ? initialContext.services.slice(0, 2).map(s => `我想${s}`) : ['我想咨询', '我想预订'];
      
      // Add "Connect to" prompt as the last option
      prompts.push(`联系${initialContext.desc}`);
      // Add Guizhou Selected prompt
      prompts.push('贵州优选');

      setMessages([
        {
          id: 1,
          sender: 'agent',
          text: welcomeText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 1.5,
          sender: 'agent',
          type: 'chips',
          chips: prompts,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        // REMOVED immediate Service Card
      ]);

      // Do NOT set activeAgent, so it defaults to Huang Xiaoxi (null)
      // setActiveAgent({...}); 

    } else if (initialMode === 'day_planning') {
        const { startPoint, endPoint, dayIndex, currentItinerary } = initialContext;
        setPlanningContext(initialContext);
        setCurrentTrip({ ...defaultTrip, itinerary: currentItinerary }); 
        
        setMessages([
            {
                id: 1,
                sender: 'user',
                text: `我计划今天从【${startPoint}】出发，前往【${endPoint}】，请帮我规划一下今天的行程。`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
                id: 2,
                sender: 'agent',
                text: `收到！正在结合您前几天的行程，为您规划从 ${startPoint} 到 ${endPoint} 的最佳路线...`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);

             setIsTyping(true);
             timer = setTimeout(() => {
                 setIsTyping(false);
            const planMsg = {
                id: 3,
                sender: 'agent',
                type: 'day_plan_card',
                plan: {
                    day: dayIndex + 1,
                    start: startPoint,
                    end: endPoint,
                    spots: [
                        { time: '09:00', title: startPoint, type: 'hotel', desc: '出发' },
                        { time: '10:30', title: '黔灵山公园', type: 'scenic', desc: '观赏野生猕猴，游览弘福寺', tag: '推荐' },
                        { time: '12:30', title: '民生路美食街', type: 'food', desc: '品尝贵阳地道小吃', tag: '必吃' },
                        { time: '14:30', title: '甲秀楼', type: 'scenic', desc: '贵阳地标，拍照打卡', tag: '地标' },
                        { time: '16:00', title: endPoint, type: 'transport', desc: '抵达目的地' }
                    ]
                },
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, planMsg]);

            // Follow-up with service recommendation
            setTimeout(() => {
                const followUpMsg = {
                    id: 4,
                    sender: 'agent',
                    text: '为了让您的行程更顺畅，我为您精选了以下配套服务智能体，您可以直接联系他们安排细节。',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, followUpMsg]);

                const serviceAgents = [
                    {
                        id: 301,
                        name: '出行调度智能体',
                        desc: '提供专车接送、包车服务',
                        avatar: CarAvatar,
                        type: 'enterprise',
                        role: 'transport',
                        rating: 4.9,
                        details: { name: '出行调度智能体', desc: '专属司机' },
                        color: 'blue'
                    },
                    {
                        id: 102,
                        name: '金牌导游小张',
                        desc: '十年贵州通，带你玩转地道贵州',
                        avatar: GuideAvatar,
                        type: 'personal',
                        role: 'scenic',
                        rating: 4.8,
                        details: { name: '金牌导游小张', desc: '金牌地陪' },
                        color: 'green'
                    },
                    {
                        id: 202,
                        name: '美食达人王阿姨',
                        desc: '深巷美食挖掘机，跟着吃不踩雷',
                        avatar: WangAyiAvatar,
                        type: 'personal',
                        role: 'food',
                        rating: 4.9,
                        details: { name: '美食达人王阿姨', desc: '美食达人' },
                        color: 'orange'
                    }
                ];

                const recMsg = {
                    id: 5,
                    sender: 'agent',
                    type: 'agent_recommendation',
                    title: '行程配套服务推荐',
                    agents: serviceAgents,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, recMsg]);
            }, 1000);

        }, 2000);

    } else {
      setCurrentTrip(defaultTrip);
    }
    return () => clearTimeout(timer);
  }, [initialMode, initialContext]);

  // Listen for merchant manual messages
  useEffect(() => {
    if (merchantMessage) {
        setMessages(prev => [...prev, merchantMessage]);
        // Also report to App that a message was added (handled by App already, but we need to ensure local state is in sync)
    }
  }, [merchantMessage]);

  // Helper to dispatch AI response (either to user or as suggestion to merchant)
  const dispatchAiResponse = (msg) => {
      if (isHumanMode) {
          const suggestion = { 
              ...msg, 
              isSuggestion: true, 
              // Ensure text is present for the merchant to see/use
              text: msg.text || (msg.title ? `[卡片] ${msg.title}` : `[服务] ${msg.type}`)
          };
          if (activeAgent && onUserMessage) {
              onUserMessage(suggestion);
          }
      } else {
          setMessages(prev => [...prev, msg]);
          if (activeAgent && onUserMessage) {
              onUserMessage(msg);
          }
      }
  };

  const handleServiceCompletion = (serviceType, data, entityContext) => {
      // 1. Call the prop callback if it exists
      if (onServiceSubmit) {
          let contextToPass = activeAgent || initialContext;
          if (entityContext) {
             const type = entityContext.name.includes('酒店') ? 'hotel' :
                          entityContext.name.includes('餐饮') ? 'food' :
                          entityContext.name.includes('车') ? 'transport' : 'scenic';
             const agentInfo = getAgentInfo(type);
             contextToPass = {
                 ...agentInfo,
                 name: entityContext.name,
                 description: `${entityContext.desc}专属服务`,
             };
          }

          onServiceSubmit({
              serviceType,
              data,
              agentContext: contextToPass
          });
      }

      // 2. Generate Follow-up Message
      setTimeout(() => {
          let followUpText = '';
          let chips = [];
          
          // Determine the contact chip based on context
          let contactChip = '联系人工客服';
          
          // Priority: entityContext (from specific chat) > activeAgent (current session) > initialContext (entry point)
          if (entityContext) {
              contactChip = `联系${entityContext.desc || entityContext.name}`;
          } else if (activeAgent) {
              contactChip = `联系${activeAgent.name}`;
          } else if (initialContext && (initialContext.desc || initialContext.name)) {
              contactChip = `联系${initialContext.desc || initialContext.name}`;
          }

          if (serviceType.includes('酒店') || serviceType.includes('住宿')) {
              followUpText = '酒店预订已提交！还需要为您安排接送机服务吗？或者为您推荐附近的必吃美食？';
              chips = [contactChip, '预约接送机', '附近美食'];
          } else if (serviceType.includes('订座') || serviceType.includes('餐饮') || serviceType.includes('用餐') || serviceType.includes('排队')) {
               followUpText = '餐厅座位已锁定！建议您提前规划好行程路线。需要为您呼叫网约车前往吗？';
               chips = [contactChip, '呼叫网约车', '查看路线'];
          } else if (serviceType.includes('门票') || serviceType.includes('景区') || serviceType.includes('导览') || serviceType.includes('预约')) {
               followUpText = '门票预约成功！该景区较大，建议您预订一位金牌讲解员，体验更好哦。';
               chips = [contactChip, '周边住宿', '美食推荐'];
          } else if (serviceType.includes('用车') || serviceType.includes('交通') || serviceType.includes('接机') || serviceType.includes('包车')) {
               followUpText = '用车服务已安排！司机稍后会联系您。还需要为您推荐目的地附近的玩法吗？';
               chips = [contactChip, '目的地玩法', '预订酒店'];
          } else {
               followUpText = '服务需求已提交！请问还有什么可以帮您的吗？';
               chips = [contactChip, '查看行程', '预订酒店'];
          }

          const followUpMsg = {
              id: Date.now(),
              sender: 'agent',
              text: followUpText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          dispatchAiResponse(followUpMsg);

          // 3. Push Chips
          setTimeout(() => {
               const chipsMsg = {
                  id: Date.now() + 1,
                  sender: 'agent',
                  type: 'chips',
                  chips: chips,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
               };
               dispatchAiResponse(chipsMsg);
          }, 800);

      }, 1500);
  };

  const handleSend = (text) => {
    const content = typeof text === 'string' ? text : inputText;
    if (!content.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Sync to App if agent active
    if (activeAgent && onUserMessage) {
        onUserMessage(newMsg);
    }

    // Check for "Generate Agent" intent
    if (content.includes('生成') && content.includes('智能体')) {
        setTimeout(() => {
            setIsTyping(false);
            
            // 1. Acknowledge
            const ackMsg = {
                id: Date.now() + 1,
                sender: 'agent',
                text: '收到！正在为您解析需求并构建智能体模型...',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            dispatchAiResponse(ackMsg);

            // 2. Simulate Generation Process
            setTimeout(() => {
                // Determine type and name
                let type = 'scenic';
                
                if (content.includes('酒店')) { type = 'hotel'; }
                else if (content.includes('餐饮') || content.includes('美食')) { type = 'food'; }
                else if (content.includes('交通') || content.includes('车')) { type = 'transport'; }
                
                // Get base info from helper
                const baseInfo = getAgentInfo(type);

                // Simple name extraction
                let name = baseInfo.name;
                const match = content.match(/生成(?:一个)?(.*?)智能体/);
                if (match && match[1]) {
                    name = match[1] + '智能体';
                }
                
                const newAgent = {
                    ...baseInfo,
                    name: name,
                    description: `根据您的需求"${content}"生成的专属智能体。`,
                    tag: 'AI Generated' 
                };

                const cardMsg = {
                    id: Date.now() + 2,
                    sender: 'agent',
                    type: 'agent_generated_card',
                    agent: newAgent,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                dispatchAiResponse(cardMsg);

            }, 2000);

        }, 1000);
        return;
    }

    // Guizhou Products Recommendation (Prompt handling)
    if (content.includes('贵州优选')) {
        setTimeout(() => {
            setIsTyping(false);
            
            // 1. Intro Message
            const introMsg = {
                id: Date.now() + 1,
                sender: 'agent',
                text: '为您精选了以下贵州特色好物，都是地道正宗的伴手礼哦～',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            dispatchAiResponse(introMsg);

            // 2. Push Product Cards
            setTimeout(() => {
                const products = [
                    {
                        id: 'prod-1',
                        name: '贵州茅台酒',
                        desc: '酱香型白酒典范',
                        avatar: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?w=300&h=300&fit=crop',
                        type: 'product',
                        role: 'food',
                        rating: 5.0,
                        details: { name: '贵州茅台酒', desc: '53度飞天茅台' },
                        color: 'red'
                    },
                    {
                        id: 'prod-2',
                        name: '都匀毛尖',
                        desc: '中国十大名茶之一',
                        avatar: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=300&h=300&fit=crop',
                        type: 'product',
                        role: 'food',
                        rating: 4.9,
                        details: { name: '都匀毛尖', desc: '明前特级' },
                        color: 'green'
                    },
                    {
                        id: 'prod-3',
                        name: '老干妈风味豆豉',
                        desc: '国民女神，下饭神器',
                        avatar: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=300&h=300&fit=crop',
                        type: 'product',
                        role: 'food',
                        rating: 4.8,
                        details: { name: '老干妈', desc: '风味豆豉油辣椒' },
                        color: 'orange'
                    }
                ];

                const prodCard = {
                    id: Date.now() + 2,
                    sender: 'agent',
                    type: 'agent_recommendation',
                    title: '贵州优选好物',
                    agents: products,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                dispatchAiResponse(prodCard);
            }, 800);

        }, 1000);
        return;
    }

    setTimeout(() => {
      setIsTyping(false);


      if (content.includes('门票修改') && currentNode) {
         const policyText = `【${currentNode.title || currentNode.details?.name}】门票修改政策：\n1. 提前24小时可免费修改；\n2. 当日修改需收取10%手续费；\n3. 已使用门票不可修改`;
         
         const policyMsg = {
            id: Date.now() + 1,
            sender: 'agent',
            text: policyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         dispatchAiResponse(policyMsg);

         setTimeout(() => {
             const agentInfo = getAgentInfo(currentNode.type);
             const cardMsg = {
               id: Date.now() + 2,
               sender: 'agent',
               type: 'service_card',
               node: currentNode,
               agentInfo: agentInfo,
               time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
             };
             dispatchAiResponse(cardMsg);
         }, 1000);
         return;
      }

      // NEW: Intent Recognition for "我想..." (Dynamic Agent Matching)
      if (content.includes('我想') || content.includes('我要') || content.includes('推荐')) {
           // Clean the string
           let cleanedContent = content;
           const fillers = ['我想', '我要', '推荐', '去', '吃', '住', '玩', '找', '一个', '订', '有', '想', '要', '看'];
           fillers.forEach(filler => {
               cleanedContent = cleanedContent.replaceAll(filler, '');
           });

           // Split by delimiters
           const keywords = cleanedContent.split(/也|和|，|,| |、/);
           
           const allMatchedAgents = [];
           
           keywords.forEach(keyword => {
               const k = keyword.trim();
               if (k.length > 0) {
                   const matched = availableAgents.filter(a => 
                       a.name.includes(k) || 
                       a.intro.includes(k) || 
                       a.skills.some(s => s.includes(k)) ||
                       (a.category === 'scenic' && k.includes('景区')) ||
                       (a.category === 'hotel' && k.includes('酒店')) ||
                       (a.category === 'dining' && k.includes('吃'))
                   );
                   allMatchedAgents.push(...matched);
               }
           });
           
           // Deduplicate
           const uniqueAgents = Array.from(new Set(allMatchedAgents.map(a => a.id)))
               .map(id => allMatchedAgents.find(a => a.id === id));

           if (uniqueAgents.length > 0) {
               const mappedAgents = uniqueAgents.slice(0, 5).map(agent => { // Allow up to 5
                   let avatarImg = agent.avatar;
                   // Map emoji avatars to images if needed
                   if (!agent.avatar || agent.avatar.length < 5) {
                       switch(agent.category) {
                           case 'scenic': avatarImg = ScenicAvatar; break;
                           case 'hotel': avatarImg = HotelAvatar; break;
                           case 'dining': avatarImg = WangAyiAvatar; break;
                           case 'gov': avatarImg = getPlaceholder(200, 200, 'Gov'); break;
                           default: avatarImg = TuoSaiImage;
                       }
                   }
                   
                   return {
                       id: agent.id,
                       name: agent.name,
                       desc: agent.intro,
                       avatar: avatarImg,
                       type: 'enterprise',
                       role: agent.category,
                       rating: 4.9,
                       details: { name: agent.name, desc: agent.intro },
                       color: agent.category === 'scenic' ? 'green' : agent.category === 'hotel' ? 'indigo' : 'orange'
                   };
               });
               
               const recMsg = {
                   id: Date.now() + 1,
                   sender: 'agent',
                   type: 'agent_recommendation',
                   title: `为您找到相关智能体`,
                   agents: mappedAgents,
                   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
               };
               dispatchAiResponse(recMsg);
               return;
           }
      }
      
      let aiText = '';
      const isConnectRequest = content.includes('联系') || content.includes('接入') || content.includes('connect');
      
      // Entity Detection from User Input
      let detectedEntity = null;
      if (content.includes('黄果树')) {
          detectedEntity = { name: '黄果树瀑布智能体', desc: '黄果树瀑布' };
      } else if (content.includes('亚朵')) {
          detectedEntity = { name: '亚朵酒店服务智能体', desc: '亚朵酒店' };
      } else if (content.includes('贵州饭店') || content.includes('迎宾楼')) {
          detectedEntity = { name: '贵州饭店智能体', desc: '贵州饭店迎宾楼' };
      } else if (content.includes('全聚德')) {
          detectedEntity = { name: '全聚德服务智能体', desc: '全聚德' };
      } else if (content.includes('神州')) {
          detectedEntity = { name: '神州专车智能体', desc: '神州专车' };
      } else if (content.includes('博物馆')) {
          detectedEntity = { name: '省博物馆智能体', desc: '省博物馆' };
      }

      // Check for Info Requirements (Ticket/Guide)
      // 1. Scenic - Ticket (Huangguoshu)
      if (content.includes('购票') || content.includes('门票')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'info_card',
              title: '景区购票所需信息',
              requirements: ['游客姓名', '身份证号', '联系电话', '入园日期', '优待证件(如有)'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);
          
          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('scenic');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }

      // 2. Scenic - Guide (Huangguoshu)
      if (content.includes('导览') || content.includes('讲解')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'scenic_card',
              title: '预约导览所需信息',
              requirements: ['预约时间', '语种需求', '团队人数', '特殊偏好'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);

          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('scenic');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }

      // 3. Hotel - Booking (Atour)
      if (content.includes('订房') || content.includes('住宿') || (content.includes('订') && content.includes('酒店'))) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'hotel_card',
              title: '酒店预订所需信息',
              requirements: ['入住人姓名', '联系电话', '入住日期', '离店日期', '房型需求'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);

          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('hotel');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }

      // 4. Transport - Pickup/Charter (Shenzhou)
      if (content.includes('接机') || content.includes('包车') || content.includes('用车')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'transport_card',
              title: '用车预约所需信息',
              requirements: ['出发时间', '出发地点', '目的地', '乘车人数', '车型要求'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);

          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('transport');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }

      // 5. Museum - Reservation (Provincial Museum)
      if (content.includes('预约') || content.includes('展馆')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'info_card',
              title: '展馆预约所需信息',
              requirements: ['参观日期', '入馆时段', '参观人姓名', '身份证号'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);

          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('scenic');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }

      // 6. Food - Queue/Order (Auntie Wang, Brother Liu)
      if (content.includes('排队') || content.includes('取号')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'info_card',
              title: '餐厅排队所需信息',
              requirements: ['用餐人数', '联系电话', '预计到店时间', '儿童椅需求'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);

          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('food');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }
      
      if (content.includes('点餐') || content.includes('订座') || content.includes('订包房')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'dining_card',
              title: content.includes('订包房') ? '预订包房所需信息' : '预订座位所需信息',
              requirements: ['预订人姓名', '联系电话', '用餐时间', '用餐人数', '包间需求'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity,
              autoConnect: !!detectedEntity
          };
          dispatchAiResponse(infoMsg);

          if (detectedEntity) {
            //  setTimeout(() => {
            //      const agentInfo = getAgentInfo('food');
            //      agentInfo.name = detectedEntity.name;
            //      agentInfo.description = `${detectedEntity.desc}专属服务`;
                 
            //      const cardMsg = {
            //        id: Date.now() + 2,
            //        sender: 'agent',
            //        type: 'service_card',
            //        node: {
            //           title: detectedEntity.desc,
            //           type: 'agent_context',
            //           details: { name: detectedEntity.name, desc: detectedEntity.desc }
            //        },
            //        agentInfo: agentInfo,
            //        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //      };
            //      dispatchAiResponse(cardMsg);
            //  }, 1000);
          }
          return;
      }
      
      // 7. Personal Guide - Charter/Custom (Xiao Zhang)
      if (content.includes('定制') || content.includes('地陪')) {
          const infoMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'scenic_card',
              title: '定制行程所需信息',
              requirements: ['游玩天数', '预算范围', '兴趣偏好', '住宿要求', '同行人数'],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              entityContext: detectedEntity
          };
          dispatchAiResponse(infoMsg);
          return;
      }

      // 8. View Environment (Guizhou Hotel)
      if (content.includes('看环境')) {
          const envMsg = {
             id: Date.now() + 1,
             sender: 'agent',
             text: '为您展示贵州饭店迎宾楼的优雅环境。我们拥有多个风格迥异的豪华包房，大厅宽敞明亮，充满浓郁的文化气息。',
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          dispatchAiResponse(envMsg);
          return;
      }

      // 9. Recommendation Logic (Fun/Food)
      if (content.includes('好玩') || content.includes('景点') || content.includes('玩什么')) {
          const enterpriseAgents = [
              {
                  id: 101,
                  name: '黄果树瀑布智能体',
                  desc: '亚洲第一大瀑布，壮观宏伟',
                  avatar: ScenicAvatar,
                  type: 'enterprise',
                  role: 'scenic',
                  rating: 4.9,
                  details: { name: '黄果树瀑布智能体', desc: '黄果树瀑布' },
                  color: 'green'
              },
              {
                  id: 103,
                  name: '省博物馆智能体',
                  desc: '探寻古夜郎文化的奥秘',
                  avatar: MuseumAvatar,
                  type: 'enterprise',
                  role: 'scenic',
                  rating: 4.7,
                  details: { name: '省博物馆智能体', desc: '省博物馆' },
                  color: 'green'
              }
          ];

          const recMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'agent_recommendation',
              title: '推荐热门景区',
              agents: enterpriseAgents,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          dispatchAiResponse(recMsg);

          // Direct Recommendation of Personal Agents
          setTimeout(() => {
              const introMsg = {
                  id: Date.now() + 2,
                  sender: 'agent',
                  text: '为了给您提供更深度的游玩体验，我为您精选了以下几类专业服务人员，您可以按需选择：',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              dispatchAiResponse(introMsg);

              // Chain the next recommendations
              setTimeout(() => {
                  // 1. Professional Guides
                  const guides = [
                      {
                          id: 102,
                          name: '金牌导游小张',
                          desc: '十年贵州通，带你玩转地道贵州',
                          avatar: GuideAvatar,
                          type: 'personal',
                          role: 'scenic',
                          rating: 4.8,
                          details: { name: '金牌导游小张', desc: '金牌地陪' },
                          color: 'green'
                      },
                      {
                          id: 105,
                          name: '资深导游王姐',
                          desc: '专注人文历史讲解，风趣幽默',
                          avatar: WangAyiAvatar, 
                          type: 'personal',
                          role: 'scenic',
                          rating: 4.9,
                          details: { name: '资深导游王姐', desc: '人文讲解' },
                          color: 'green'
                      }
                  ];
                  const guideCard = {
                      id: Date.now() + 3,
                      sender: 'agent',
                      type: 'agent_recommendation',
                      title: '金牌导游推荐',
                      agents: guides,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                  dispatchAiResponse(guideCard);

                  // 2. Local Companions & Experts
                  setTimeout(() => {
                      const locals = [
                          {
                              id: 104,
                              name: '摄影师小李',
                              desc: '专业跟拍，记录旅行美好瞬间',
                              avatar: PeasantAvatar,
                              type: 'personal',
                              role: 'scenic',
                              rating: 4.9,
                              details: { name: '摄影师小李', desc: '旅拍服务' },
                              color: 'green'
                          },
                          {
                              id: 302,
                              name: '包车师傅老陈',
                              desc: '十五年驾龄，熟悉各种小众路线',
                              avatar: LiuDaGeAvatar, 
                              type: 'personal',
                              role: 'transport',
                              rating: 4.8,
                              details: { name: '包车师傅老陈', desc: '老司机' },
                              color: 'blue'
                          }
                      ];
                      const localCard = {
                          id: Date.now() + 4,
                          sender: 'agent',
                          type: 'agent_recommendation',
                          title: '地陪与特色服务推荐',
                          agents: locals,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      dispatchAiResponse(localCard);
                  }, 800);

              }, 800);

          }, 1000);
          
          return;
      }

      // Removed interactive logic for guide selection since we push directly now

      if (content.includes('好吃') || content.includes('美食') || content.includes('吃什么')) {
          // 1. Formal Dining (Enterprise)
          const formalDining = [
              {
                  id: 201,
                  name: '全聚德服务智能体',
                  desc: '百年老字号，正宗烤鸭',
                  avatar: HotelAvatar, // Reusing hotel avatar as generic formal dining for now
                  type: 'enterprise',
                  role: 'food',
                  rating: 4.8,
                  details: { name: '全聚德服务智能体', desc: '全聚德' },
                  color: 'orange'
              },
              {
                  id: 204,
                  name: '雅园餐厅智能体',
                  desc: '精致黔菜，商务宴请首选',
                  avatar: ScenicAvatar, // Placeholder
                  type: 'enterprise',
                  role: 'food',
                  rating: 4.9,
                  details: { name: '雅园餐厅智能体', desc: '雅园' },
                  color: 'orange'
              }
          ];

          const formalMsg = {
              id: Date.now() + 1,
              sender: 'agent',
              type: 'agent_recommendation',
              title: '正餐推荐',
              agents: formalDining,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          dispatchAiResponse(formalMsg);

          setTimeout(() => {
              // 2. Local Specialties & Snacks (Personal/Small Biz)
              const localFood = [
                  {
                      id: 202,
                      name: '美食达人王阿姨',
                      desc: '深巷美食挖掘机，跟着吃不踩雷',
                      avatar: WangAyiAvatar,
                      type: 'personal',
                      role: 'food',
                      rating: 4.9,
                      details: { name: '美食达人王阿姨', desc: '美食达人' },
                      color: 'orange'
                  },
                  {
                      id: 203,
                      name: '烤鱼大师刘大哥',
                      desc: '三十年专注烤鱼，独家秘制酱料',
                      avatar: LiuDaGeAvatar,
                      type: 'personal',
                      role: 'food',
                      rating: 4.7,
                      details: { name: '烤鱼大师刘大哥', desc: '烤鱼大师' },
                      color: 'orange'
                  }
              ];

              const localMsg = {
                  id: Date.now() + 2,
                  sender: 'agent',
                  type: 'agent_recommendation',
                  title: '本地特色与小吃推荐',
                  agents: localFood,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              dispatchAiResponse(localMsg);
          }, 800);

          return;
      }

      // Check if user wants to connect to a specific agent context (Auto Connect Logic)
      if (isConnectRequest || detectedEntity) {
          let targetAgentType = null;
          let targetAgentName = '';
          let targetAgentDesc = '';
          
          // Use detectedEntity if available
          if (detectedEntity) {
              if (detectedEntity.name.includes('酒店')) targetAgentType = 'hotel';
              else if (detectedEntity.name.includes('餐饮') || detectedEntity.name.includes('全聚德')) targetAgentType = 'food';
              else if (detectedEntity.name.includes('车') || detectedEntity.name.includes('交通')) targetAgentType = 'transport';
              else targetAgentType = 'scenic';

              targetAgentName = detectedEntity.name;
              targetAgentDesc = detectedEntity.desc;
          }
          // Determine agent type based on content or initialContext
          else if (content.includes('酒店') || content.includes('前台')) {
              targetAgentType = 'hotel';
              targetAgentName = '酒店前台智能体';
              targetAgentDesc = '酒店专属管家';
          } else if (content.includes('餐厅') || content.includes('餐饮')) {
              targetAgentType = 'food';
              targetAgentName = '餐厅服务智能体';
              targetAgentDesc = '餐厅服务员';
          } else if (content.includes('景区') || content.includes('导览') || content.includes('讲解')) {
              targetAgentType = 'scenic';
              targetAgentName = '景区服务智能体';
              targetAgentDesc = '金牌讲解员';
          } else if (content.includes('司机') || content.includes('交通') || content.includes('车')) {
              targetAgentType = 'transport';
              targetAgentName = '出行调度智能体';
              targetAgentDesc = '专属司机';
          } else if (initialContext && isConnectRequest) {
             // Fallback to initialContext if available
             const colorMap = {
                green: { color: "text-green-800", bgColor: "bg-green-100", iconColor: "text-green-600", headerBg: "bg-green-50", border: "border-green-100", btnBg: "bg-green-600" },
                indigo: { color: "text-indigo-800", bgColor: "bg-indigo-100", iconColor: "text-indigo-600", headerBg: "bg-indigo-50", border: "border-indigo-100", btnBg: "bg-indigo-600" },
                blue: { color: "text-blue-800", bgColor: "bg-blue-100", iconColor: "text-blue-600", headerBg: "bg-blue-50", border: "border-blue-100", btnBg: "bg-blue-600" },
                teal: { color: "text-teal-800", bgColor: "bg-teal-100", iconColor: "text-teal-600", headerBg: "bg-teal-50", border: "border-teal-100", btnBg: "bg-teal-600" },
                orange: { color: "text-orange-800", bgColor: "bg-orange-100", iconColor: "text-orange-600", headerBg: "bg-orange-50", border: "border-orange-100", btnBg: "bg-orange-600" },
                purple: { color: "text-purple-800", bgColor: "bg-purple-100", iconColor: "text-purple-600", headerBg: "bg-purple-50", border: "border-purple-100", btnBg: "bg-purple-600" },
             };
             const colors = colorMap[initialContext.color] || colorMap.green;
             
             const targetAgentInfo = {
                name: initialContext.name,
                description: initialContext.intro,
                tag: initialContext.role,
                icon: Info, 
                ...colors,
                avatar: initialContext.avatar
             };

             const cardMsg = {
                 id: Date.now() + 1,
                 sender: 'agent',
                 type: 'service_card',
                 node: {
                    title: initialContext.desc,
                    type: 'agent_context',
                    details: { name: initialContext.name, desc: initialContext.intro }
                 },
                 agentInfo: targetAgentInfo,
                 autoConnect: true, // Trigger auto-connect logic in ServiceAgentCard
                 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
             };
             dispatchAiResponse(cardMsg);
             return;
          }

          if (targetAgentType && isConnectRequest) {
              const agentInfo = getAgentInfo(targetAgentType);
              // Override name/desc if we have specific ones
              if (targetAgentName) agentInfo.name = targetAgentName;
              
              const cardMsg = {
                 id: Date.now() + 1,
                 sender: 'agent',
                 type: 'service_card',
                 node: {
                    title: targetAgentDesc,
                    type: 'agent_context',
                    details: { name: targetAgentName, desc: targetAgentDesc }
                 },
                 agentInfo: agentInfo,
                 autoConnect: true, // Trigger auto-connect logic in ServiceAgentCard
                 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              dispatchAiResponse(cardMsg);
              return;
          }
      }

      if (activeAgent) {
         if (activeAgent.name.includes('景区')) {
            aiText = `【${activeAgent.name}】为您服务：收到您的需求！作为您的专属导游，我建议您可以错峰游览，避开人流高峰。还需要为您介绍具体的游玩路线吗？`;
         } else if (activeAgent.name.includes('酒店')) {
            aiText = `【${activeAgent.name}】为您服务：好的，这就为您安排。我们酒店提供24小时管家服务，请问还需要帮您预订早餐吗？`;
         } else if (activeAgent.name.includes('餐饮')) {
            aiText = `【${activeAgent.name}】为您服务：收到！这边已经为您关注了排队情况。如果您需要，我可以为您提前取号。`;
         } else if (activeAgent.name.includes('交通')) {
            aiText = `【${activeAgent.name}】为您服务：明白，已为您规划最优路线。现在的路况比较通畅，预计车程20分钟。`;
         } else {
            aiText = `【${activeAgent.name}】收到您的指令，正在为您处理...`;
         }
      } else {
         aiText = '收到！根据您的需求，我为您规划了“贵阳3日经典游”方案。第一天入住市中心，第二天游览地标景点，第三天体验古镇风情。详情如下👇';
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      dispatchAiResponse(aiMsg);

      if (!activeAgent) {
          setTimeout(() => {
            const serviceAgents = [
                {
                    id: 301,
                    name: '出行调度智能体',
                    desc: '提供专车接送、包车服务',
                    avatar: CarAvatar,
                    type: 'enterprise',
                    role: 'transport',
                    rating: 4.9,
                    details: { name: '出行调度智能体', desc: '专属司机' },
                    color: 'blue'
                },
                {
                    id: 102,
                    name: '金牌导游小张',
                    desc: '十年贵州通，带你玩转地道贵州',
                    avatar: GuideAvatar,
                    type: 'personal',
                    role: 'scenic',
                    rating: 4.8,
                    details: { name: '金牌导游小张', desc: '金牌地陪' },
                    color: 'green'
                },
                {
                    id: 202,
                    name: '美食达人王阿姨',
                    desc: '深巷美食挖掘机，跟着吃不踩雷',
                    avatar: WangAyiAvatar,
                    type: 'personal',
                    role: 'food',
                    rating: 4.9,
                    details: { name: '美食达人王阿姨', desc: '美食达人' },
                    color: 'orange'
                }
            ];

            const cardMsg = {
              id: Date.now() + 2,
              sender: 'agent',
              type: 'itinerary',
              recommendations: serviceAgents,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            dispatchAiResponse(cardMsg);
          }, 600);
      }
    }, 1500);
  };

  const handleAdopt = () => {
    if (onAdoptTrip) onAdoptTrip(currentTrip);
    if (onClose) onClose();
  };

  return (
    <motion.div 
      layoutId={initialContext?.fromSquare ? null : "chat-container"}
      initial={initialContext?.fromSquare ? { opacity: 0 } : undefined}
      animate={initialContext?.fromSquare ? { opacity: 1 } : undefined}
      exit={initialContext?.fromSquare ? { opacity: 0 } : undefined}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-[100] bg-slate-50 flex flex-col overflow-hidden"
      style={initialContext?.fromSquare ? { top: 0, bottom: 0, left: 0, right: 0 } : undefined}
    >
      {/* Header */}
      <header className={`px-4 pb-4 pt-14 flex items-center gap-3 backdrop-blur-md sticky top-0 z-50 border-b transition-colors ${activeAgent ? `${activeAgent.headerBg} ${activeAgent.border}` : 'bg-white/80 border-slate-100'}`}>
        <button 
          onClick={onClose}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeAgent ? 'bg-white/50 hover:bg-white/80' : 'bg-slate-100 hover:bg-slate-200'}`}
        >
          <ArrowLeft size={20} className={activeAgent ? activeAgent.color : "text-slate-700"} />
        </button>
        <div className="flex-1">
          <h1 className={`text-lg font-bold ${activeAgent ? activeAgent.color : "text-slate-800"}`}>
            {activeAgent ? activeAgent.name : '黄小西'}
          </h1>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full animate-pulse ${activeAgent ? 'bg-green-600' : 'bg-green-500'}`} />
            <span className={`text-xs ${activeAgent ? activeAgent.color : "text-slate-500"}`}>在线</span>
          </div>
        </div>
        <button className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeAgent ? 'bg-white/50 hover:bg-white/80' : 'bg-slate-100 hover:bg-slate-200'}`}>
          {activeAgent ? (
             <Phone size={20} className={activeAgent.iconColor} />
          ) : (
             <Sparkles size={20} className="text-cyan-600" />
          )}
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 overflow-hidden ${
              msg.sender === 'agent' 
                ? (activeAgent ? `${activeAgent.bgColor} ${activeAgent.border}` : 'bg-cyan-100 border-white')
                : 'bg-slate-200 border-white'
            }`}>
              {msg.sender === 'agent' ? (
                activeAgent ? (
                  activeAgent.avatar ? (
                    <img src={activeAgent.avatar} alt={activeAgent.name} className="w-full h-full object-cover" />
                  ) : (
                    <activeAgent.icon size={20} className={activeAgent.iconColor} />
                  )
                ) : (
                  <img src={TuoSaiImage} alt="Agent" className="w-full h-full object-contain" />
                )
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end flex flex-col' : ''}`}>
              {msg.type === 'itinerary' ? (
                <div className="w-full min-w-[300px]">
                  <ItineraryCard 
                    onAdopt={handleAdopt} 
                    tripData={currentTrip} 
                    onViewImage={setViewingImage}
                    recommendations={msg.recommendations}
                    onConnectAgent={(agent) => {
                        if (onConnectAgent) onConnectAgent(agent);
                        
                        setTimeout(() => {
                           const connectedMsg = {
                               id: Date.now(),
                               sender: 'agent',
                               text: `已为您成功接入${agent.name}，现在您可以直接与它对话了。`,
                               time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                           };
                           setMessages(prev => [...prev, connectedMsg]);
                           setActiveAgent(agent);
                        }, 1500);
                    }}
                  />
                </div>
              ) : msg.type === 'service_card' ? (
                <div className="w-full min-w-[300px]">
                   <ServiceAgentCard 
                     node={msg.node} 
                     agentInfo={msg.agentInfo} 
                     autoConnect={msg.autoConnect}
                     onConnect={() => {
                        // Notify App to open workspace (Split View)
                        if (onConnectAgent) {
                            onConnectAgent(msg.agentInfo);
                        }

                        setTimeout(() => {
                          const connectedMsg = {
                             id: Date.now(),
                             sender: 'agent',
                             text: `已为您成功接入${msg.agentInfo.name}，现在您可以直接与它对话了。`,
                             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setMessages(prev => [...prev, connectedMsg]);
                          setActiveAgent(msg.agentInfo);
                        }, 1500);
                     }} 
                   />
                </div>
              ) : msg.type === 'agent_generated_card' ? (
                <div className="w-full min-w-[300px]">
                   <AgentGeneratedCard 
                     agent={msg.agent} 
                     onConnect={() => {
                        // Notify App to open workspace (Split View)
                        if (onConnectAgent) {
                            onConnectAgent(msg.agent);
                        }

                        setTimeout(() => {
                          const connectedMsg = {
                             id: Date.now(),
                             sender: 'agent',
                             text: `已为您成功接入${msg.agent.name}，现在您可以直接与它对话了。`,
                             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setMessages(prev => [...prev, connectedMsg]);
                          setActiveAgent(msg.agent);
                        }, 1500);
                     }} 
                   />
                </div>
              ) : msg.type === 'day_plan_card' ? (
                <div className="w-full min-w-[300px]">
                   <DayPlanCard 
                     plan={msg.plan}
                     onConfirm={() => {
                        // 1. Update Trip Data
                        if (planningContext && currentTrip) {
                           const { dayIndex } = planningContext;
                           const newSpots = msg.plan.spots;
                           
                           // Convert spots to timeline items
                           const newTimeline = newSpots.map((spot, idx) => ({
                               id: `ai-${Date.now()}-${idx}`,
                               time: spot.time,
                               title: spot.title,
                               type: spot.type,
                               status: 'planned',
                               tips: spot.desc,
                               details: {
                                   name: spot.title,
                                   desc: spot.desc
                               },
                               image: getPlaceholder(200, 200, spot.type)
                           }));
                           
                           const updatedItinerary = [...currentTrip.itinerary];
                           if (updatedItinerary[dayIndex]) {
                               updatedItinerary[dayIndex] = {
                                   ...updatedItinerary[dayIndex],
                                   timeline: newTimeline,
                                   highlights: newSpots.map(s => s.title).join(' — ')
                               };
                               
                               const updatedTrip = { ...currentTrip, itinerary: updatedItinerary };
                               
                               if (onAdoptTrip) {
                                   onAdoptTrip(updatedTrip);
                               }
                           }
                        }

                        const confirmMsg = {
                            id: Date.now(),
                            sender: 'agent',
                            text: '已成功将该方案加入您的行程！',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setMessages(prev => [...prev, confirmMsg]);
                        setTimeout(() => onClose(), 800);
                     }}
                     onRegenerate={() => {
                        const regenMsg = {
                            id: Date.now(),
                            sender: 'user',
                            text: '我对这个方案不太满意，请重新规划。',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setMessages(prev => [...prev, regenMsg]);
                        setIsTyping(true);
                        setTimeout(() => {
                            setIsTyping(false);
                            const newPlanMsg = {
                                id: Date.now() + 1,
                                sender: 'agent',
                                type: 'day_plan_card',
                                plan: { ...msg.plan, spots: [...msg.plan.spots].reverse() },
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setMessages(prev => [...prev, newPlanMsg]);
                        }, 1500);
                     }}
                   />
                </div>
              ) : msg.type === 'info_card' ? (
                <div className="w-full min-w-[260px]">
                    <InfoRequirementCard 
                        title={msg.title} 
                        requirements={msg.requirements} 
                        onSubmit={(data) => handleServiceCompletion(msg.title, data, msg.entityContext)}
                    />
                </div>
              ) : msg.type === 'hotel_card' ? (
                <div className="w-full min-w-[300px]">
                    <HotelServiceCard 
                        title={msg.title} 
                        requirements={msg.requirements} 
                        onViewImage={setViewingImage}
                        onSubmit={(data) => handleServiceCompletion(msg.title, data, msg.entityContext)}
                    />
                </div>
              ) : msg.type === 'dining_card' ? (
                <div className="w-full min-w-[300px]">
                    <DiningServiceCard 
                        title={msg.title} 
                        requirements={msg.requirements} 
                        onViewImage={setViewingImage}
                        onSubmit={(data) => handleServiceCompletion(msg.title, data, msg.entityContext)}
                    />
                </div>
              ) : msg.type === 'scenic_card' ? (
                <div className="w-full min-w-[300px]">
                    <ScenicServiceCard 
                        title={msg.title} 
                        requirements={msg.requirements} 
                        onViewImage={setViewingImage}
                        onSubmit={(data) => handleServiceCompletion(msg.title, data, msg.entityContext)}
                    />
                </div>
              ) : msg.type === 'transport_card' ? (
                <div className="w-full min-w-[300px]">
                    <TransportServiceCard 
                        title={msg.title} 
                        requirements={msg.requirements} 
                        onViewImage={setViewingImage}
                        onSubmit={(data) => handleServiceCompletion(msg.title, data, msg.entityContext)}
                    />
                </div>
              ) : msg.type === 'reservation_letter' ? (
                <div className="w-full min-w-[300px]">
                    <ReservationLetterCard
                        videoUrl={msg.data.videoUrl}
                        onClick={() => setViewingVideoUrl(msg.data.videoUrl)}
                    />
                </div>
              ) : msg.type === 'agent_recommendation' ? (
                <div className="w-full min-w-[300px]">
                   <AgentRecommendationCard 
                       title={msg.title}
                       agents={msg.agents}
                       onConnect={(agent) => {
                            // Notify App to open workspace
                            const agentInfo = getAgentInfo(agent.role);
                            // Override
                            const targetAgent = {
                               ...agentInfo,
                               name: agent.name,
                               description: agent.desc,
                               avatar: agent.avatar
                            };
                            
                            if (onConnectAgent) {
                                onConnectAgent(targetAgent);
                            }

                            setTimeout(() => {
                               const connectedMsg = {
                                   id: Date.now(),
                                   sender: 'agent',
                                   text: `已为您成功接入${agent.name}，现在您可以直接与它对话了。`,
                                   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                               };
                               setMessages(prev => [...prev, connectedMsg]);
                               setActiveAgent(targetAgent);
                            }, 1500);
                       }}
                   />
               </div>
              ) : msg.type === 'chips' ? (
                <div className="flex flex-wrap gap-2 my-1">
                  {msg.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="px-3 py-1.5 bg-white text-cyan-600 text-xs font-bold rounded-full border border-cyan-100 shadow-sm active:scale-95 transition-transform hover:bg-cyan-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              )}
              <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 overflow-hidden ${
               activeAgent ? `${activeAgent.bgColor} ${activeAgent.border}` : 'bg-cyan-100 border-white'
             }`}>
                {activeAgent ? (
                   activeAgent.avatar ? (
                     <img src={activeAgent.avatar} alt={activeAgent.name} className="w-full h-full object-cover" />
                   ) : (
                     <activeAgent.icon size={20} className={activeAgent.iconColor} />
                   )
                ) : (
                   <img src={TuoSaiImage} alt="Agent" className="w-full h-full object-contain" />
                )}
             </div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </motion.div>
        )}

      </div>

      <AnimatePresence>
        {viewingImage && (
          <ImageViewer imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
        )}
        {viewingVideoUrl && (
          <VideoPlayerModal videoUrl={viewingVideoUrl} onClose={() => setViewingVideoUrl(null)} />
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div 
        layoutId={initialContext?.fromSquare ? undefined : "input-container"}
        className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50"
      >
          <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1.5 pl-4">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入您的旅行计划..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
            />
            <button className="p-2 text-slate-500 hover:text-slate-700">
              <Mic size={18} />
            </button>
            <button 
              onClick={handleSend}
              className={`p-2 rounded-full transition-all ${inputText.trim() ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-300 text-white'}`}
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>
    </motion.div>
  );
};

const ItineraryCard = ({ onAdopt, tripData, onViewImage, recommendations, onConnectAgent }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);
  const [isAdopted, setIsAdopted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdoptClick = () => {
    setIsAdopted(true);
    onAdopt();
  };

  if (!tripData) return null;

  if (!isExpanded) {
    const previewImages = tripData.itinerary
      .flatMap(day => day.timeline)
      .filter(item => item.image)
      .slice(0, 3)
      .map(item => item.image);

    const tripOverviewMarkdown = `
### 🌄 ${tripData.title}

#### **📅 第1天：贵阳→西江千户苗寨（沉浸式苗族文化体验）**
**🚗 交通**：13:00从贵阳自驾出发（2.5小时），沿途欣赏黔东南的青山绿水。
**🏞 景点**：
- **15:30-20:30 西江千户苗寨**（游玩5小时）
🌟 **亮点**：全球最大苗族聚居地！层层叠叠的吊脚楼铺满山坡，傍晚万家灯火亮起时宛如星空坠落人间。建议穿苗族服饰拍照，参与拦门酒仪式，感受高山流水的热情敬酒。
![西江千户苗寨](https://images.weserv.nl/?url=images.unsplash.com/photo-1558230559-0590892c57e8&w=800&h=600&fit=crop)

**🍜 美食推荐**：
- **苗家糍粑肉**（咸香软糯，苗家待客必备）
- **苗王鱼**（酸辣鲜香，用秘制红酸汤炖煮，超开胃！）

**🏨 酒店推荐**：
**云隐仙居·陌野高空全景美宿(四号风雨桥博物馆店)**
👉 推窗即见苗寨全景，位置靠近博物馆，夜观灯火超方便！

---

#### **📅 第2天：黔东南→贵阳（艺术与自然的碰撞）**
**🌅 上午**：
- **8:30-10:30** 自驾至**红飘带艺术馆**（2小时车程）
- **10:30-12:30 红飘带艺术馆**（游玩2小时）
🎨 **亮点**：巨型红色飘带建筑盘旋山间，拍照极出片！馆内展示贵州长征文化，光影互动体验超震撼。
![红飘带艺术馆](https://images.weserv.nl/?url=images.unsplash.com/photo-1599571233056-11f486414704&w=800&h=600&fit=crop)

**🍜 午餐**：途经贵阳可尝试**豆米火锅**（豆香浓郁，麻辣汤底涮野菜绝配！）

**🌿 下午**：
- **13:00-15:00 黔灵山公园**（游玩2小时）
🐒 **亮点**：与野生猕猴互动，登瞰筑亭俯瞰贵阳全景，弘福寺香火缭绕求个平安符~
- **15:30-17:30 青岩古镇**（游玩2小时）
🏮 **亮点**：600年军事古镇！爬城墙、钻背街小巷，推荐试试**玫瑰糖**和**卤猪脚**。
![青岩古镇](https://images.weserv.nl/?url=images.unsplash.com/photo-1543152648-933e08f5d05e&w=800&h=600&fit=crop)

**🍜 美食推荐**：
- **青岩糕粑稀饭**（清甜软糯，用古镇井水熬制！）

**🏨 酒店推荐**：
**新状元时光民宿(青岩古镇店)**
👉 明清风格小院，步行3分钟到古镇核心区，晚上还能听打更声！

---

#### **📅 第3天：贵阳→黄果树瀑布→返程（大自然的终极震撼）**
**💦 全天亮点**：
- **8:30-10:00** 自驾至**黄果树瀑布**（1.5小时）
- **10:00-15:00 黄果树瀑布**（游玩5小时）
🌊 **必玩**：
1. **大瀑布**（近距离感受“银河落九天”的水雾扑面）
2. **陡坡塘**（86版《西游记》取景地，彩虹常现！）
3. **天星桥**（水上石林+银链坠潭瀑布，徒步探险超有趣）
📌 **提示**：穿防滑鞋，带雨衣！
![黄果树瀑布](https://images.weserv.nl/?url=images.unsplash.com/photo-1463695973559-94b3c95eb73e&w=800&h=600&fit=crop)

**🚗 返程**：15:00自驾回贵阳（1.5小时），结束行程。

---

### **💰 费用总览（1人）**
| **项目** | **费用（元）** |
|----------------|---------------|
| 车费（油费） | 502 |
| 住宿（2晚） | 463 |
| 门票 | 260 |
| 餐饮（3天） | 300 |
| **合计** | **1525** |

🌟 **小贴士**：贵州多山路，自驾注意安全；景区内步行多，建议轻装出行！
    `;

    return (
      <div className="space-y-3">
        <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed markdown-content">
           <ReactMarkdown
             remarkPlugins={[remarkGfm]}
             components={{
               h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-900 mb-2 mt-4 first:mt-0" {...props} />,
               h4: ({node, ...props}) => <h4 className="text-base font-bold text-slate-800 mb-2 mt-4" {...props} />,
               p: ({node, ...props}) => <p className="mb-2 leading-relaxed text-slate-600" {...props} />,
               ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1 ml-1" {...props} />,
               ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-1" {...props} />,
               li: ({node, ...props}) => <li className="text-slate-600" {...props} />,
               strong: ({node, ...props}) => <strong className="font-bold text-slate-800" {...props} />,
               img: ({node, ...props}) => (
                 <div className="my-3 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                    <img 
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" 
                      {...props} 
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                 </div>
               ),
               table: ({node, ...props}) => (
                 <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm bg-white">
                   <table className="w-full text-xs text-left divide-y divide-slate-100" {...props} />
                 </div>
               ),
               thead: ({node, ...props}) => <thead className="bg-slate-50 text-slate-700 font-bold" {...props} />,
               tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-50 bg-white" {...props} />,
               tr: ({node, ...props}) => <tr className="hover:bg-slate-50/50 transition-colors" {...props} />,
               th: ({node, ...props}) => <th className="px-4 py-3 whitespace-nowrap text-slate-600" {...props} />,
               td: ({node, ...props}) => <td className="px-4 py-3 text-slate-600 whitespace-nowrap" {...props} />,
               hr: ({node, ...props}) => <hr className="my-4 border-slate-100" {...props} />,
             }}
           >
             {tripOverviewMarkdown}
           </ReactMarkdown>
        </div>
        
        <div className="px-1 grid grid-cols-3 gap-3">
          <button
            onClick={() => setIsExpanded(true)}
            className="py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm border border-slate-100"
          >
            查看详情
          </button>
          <button
            className="py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm border border-slate-100"
          >
            一键购买
          </button>
          <button
            onClick={handleAdoptClick}
            disabled={isAdopted}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-lg ${
              isAdopted 
                ? 'bg-green-50 text-green-600 border border-green-200 shadow-none' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
            }`}
          >
            {isAdopted ? (
              <>
                <Check size={14} /> 已采纳
              </>
            ) : (
              <>
                <Check size={14} /> 采纳行程
              </>
            )}
          </button>
        </div>

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
           <div className="mt-4 space-y-3">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 px-1">
                 <Sparkles size={16} className="text-cyan-500" />
                 行程配套服务推荐
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
                 {recommendations.map((agent) => (
                   <div 
                     key={agent.id}
                     onClick={() => onConnectAgent && onConnectAgent(agent)}
                     className="shrink-0 w-40 h-56 rounded-[1.5rem] overflow-hidden relative border-[3px] border-white shadow-lg cursor-pointer group bg-slate-900"
                   >
                      <img 
                        src={agent.avatar} 
                        alt={agent.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
                      
                      {/* Hover Overlay */}
                      <div className="absolute right-3 top-[35%] -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                           <ArrowRight size={14} className="-rotate-45" />
                         </div>
                         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                           <MessageCircle size={14} />
                         </div>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white shadow-sm z-20">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                               <h3 className="text-xs font-bold leading-none text-white shadow-sm truncate">{agent.name}</h3>
                               {agent.type === 'enterprise' && <BadgeCheck size={12} className="text-blue-400 shrink-0" fill="currentColor" stroke="white" />}
                               <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)] shrink-0" />
                            </div>
                         </div>
                         <p className="text-[9px] text-white/80 font-medium line-clamp-1 mt-1">{agent.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mb-6">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-50 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{tripData.title}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {['7人参考', '经济型', '行程紧凑', '景点最多'].map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-500 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Map Preview */}
      <div className="h-40 bg-slate-100 relative group cursor-pointer overflow-hidden">
        <img 
          src="https://placehold.co/800x400?text=Map+Preview" 
          alt="Map" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
           <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
             <MapPin size={12} className="text-cyan-600" />
             点击查看路线地图
           </div>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex border-b border-slate-100">
        {[1, 2, 3].map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${activeDay === day ? 'text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            DAY {day}
            {activeDay === day && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div className="p-5 bg-white min-h-[300px]">
        {tripData.itinerary.map((day, idx) => (
          activeDay === idx + 1 && (
            <div key={idx} className="space-y-6 relative">
              <div className="absolute top-2 bottom-0 left-[7px] w-0.5 bg-slate-100" />
              {day.timeline.map((item) => (
                <TimelineItem 
                  key={item.id}
                  time={item.time}
                  icon={
                    item.type === 'flight' || item.type === 'transport' ? <Plane size={14} className="text-white" /> :
                    item.type === 'food' ? <Utensils size={14} className="text-white" /> :
                    item.type === 'hotel' ? <Bed size={14} className="text-white" /> :
                    <Flag size={14} className="text-white" />
                  }
                  iconBg={
                    item.type === 'flight' || item.type === 'transport' ? "bg-blue-500" :
                    item.type === 'food' ? "bg-orange-400" :
                    item.type === 'hotel' ? "bg-indigo-500" :
                    "bg-green-500"
                  }
                  title={item.title}
                >
                  <div className="mt-3 bg-white rounded-xl border border-slate-100 p-3 shadow-sm hover:shadow-md transition-shadow">
                     {/* 1. Header: H3 Theme Name + Rating */}
                     <div className="flex justify-between items-start mb-3 pb-2 border-b border-slate-50">
                        <div className="flex flex-col gap-1">
                           <h3 className="font-bold text-sm text-slate-800">{item.details.name || item.title}</h3>
                           <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={8} className="text-orange-400 fill-orange-400" />)}
                              </div>
                              <span className="text-[10px] font-bold text-slate-600">4.9</span>
                              <span className="text-[9px] text-slate-300">|</span>
                              <span className="text-[9px] text-slate-400">¥{item.details.desc?.match(/\d+/)?.[0] || '88'}/人</span>
                           </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                           item.type === 'flight' || item.type === 'transport' ? 'bg-blue-50 text-blue-600' :
                           item.type === 'food' ? 'bg-orange-50 text-orange-600' :
                           item.type === 'hotel' ? 'bg-indigo-50 text-indigo-600' :
                           'bg-green-50 text-green-600'
                        }`}>
                           {item.type === 'flight' ? '航班' : 
                            item.type === 'transport' ? '交通' : 
                            item.type === 'food' ? '餐饮' : 
                            item.type === 'hotel' ? '酒店' : '景点'}
                        </span>
                     </div>

                     {/* 2. Middle: Left Image | Right Info */}
                     <div className="flex gap-3 mb-3">
                        {/* Left: Image */}
                        <div 
                           className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 cursor-pointer group relative"
                           onClick={() => onViewImage && onViewImage(item.image)}
                        >
                           {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                 <Camera size={20} />
                              </div>
                           )}
                        </div>

                        {/* Right: Address + Tags */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                           <div className="space-y-1.5">
                              <div className="flex items-start gap-1 text-[10px] text-slate-500">
                                 <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                                 <span className="line-clamp-2">{item.details.desc || '贵州省贵阳市云岩区...'}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                 {['必打卡', '好评如潮', '老字号'].map((tag, i) => (
                                    <span key={i} className="text-[8px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">{tag}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     {/* 3. TIPS Section */}
                     {item.tips && (
                        <div className="bg-orange-50/50 rounded-lg p-2.5 mb-3 flex gap-2 items-start border border-orange-100/50">
                           <div className="mt-0.5"><Sparkles size={10} className="text-orange-500"/></div>
                           <div className="text-[10px] text-slate-600 leading-relaxed">
                              <span className="font-bold text-orange-600">黄小西Tips：</span>
                              {item.tips}
                           </div>
                        </div>
                     )}

                     {/* 4. Footer Service Button */}
                     <button
                        onClick={() => {
                           if (onConnectAgent) {
                              const agentInfo = getAgentInfo(item.type);
                              onConnectAgent({
                                 ...agentInfo,
                                 name: item.details.name,
                                 desc: item.details.desc
                              });
                           }
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm ${
                           item.type === 'flight' || item.type === 'transport' ? 'bg-blue-600 text-white shadow-blue-200' :
                           item.type === 'food' ? 'bg-orange-500 text-white shadow-orange-200' :
                           item.type === 'hotel' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                           'bg-green-600 text-white shadow-green-200'
                        }`}
                     >
                        {item.type === 'flight' || item.type === 'transport' ? '预订行程' : 
                         item.type === 'food' ? '立即订座' : 
                         item.type === 'hotel' ? '查看房型' : '购买门票'}
                        <ArrowRight size={12} />
                     </button>
                  </div>
                </TimelineItem>
              ))}
            </div>
          )
        ))}
      </div>
      
      {/* Budget Summary */}
      <div className="bg-slate-50 border-t border-slate-100">
        <button 
          onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="text-xs font-bold text-slate-500">预算参考</span>
          <div className="flex items-center gap-1">
             <span className="text-sm font-bold text-red-500">约 ¥ 3,060</span>
             {isBudgetExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </div>
        </button>
        
        <AnimatePresence>
          {isBudgetExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                 <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-2 bg-slate-50 p-2 text-[10px] text-slate-500 font-bold border-b border-slate-100">
                       <div className="text-center">项目</div>
                       <div className="text-center">单人费用</div>
                    </div>
                    <div className="divide-y divide-slate-50">
                       <div className="grid grid-cols-2 p-2.5 text-xs text-slate-700">
                          <div className="text-center">往返交通</div>
                          <div className="text-center font-bold">¥ 1080 起</div>
                       </div>
                       <div className="grid grid-cols-2 p-2.5 text-xs text-slate-700">
                          <div className="text-center">住宿</div>
                          <div className="text-center font-bold">¥ 1000 起</div>
                       </div>
                       <div className="grid grid-cols-2 p-2.5 text-xs text-slate-700">
                          <div className="text-center">门票</div>
                          <div className="text-center font-bold">¥ 980 起</div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-3 gap-3">
         <button className="py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
           查看详情
         </button>
         <button className="py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
           一键购买
         </button>
         <button 
           onClick={handleAdoptClick}
           disabled={isAdopted}
           className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-lg ${
             isAdopted 
               ? 'bg-green-50 text-green-600 border border-green-200 shadow-none' 
               : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
           }`}
         >
           {isAdopted ? (
             <>
               <Check size={14} /> 已采纳
             </>
           ) : (
             <>
               <Check size={14} /> 采纳行程
             </>
           )}
         </button>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, icon, iconBg, title, children }) => (
  <div className="relative pl-8">
    <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${iconBg} flex items-center justify-center shadow-sm z-10`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-800 mr-2 inline-block mb-1">{time}</span>
    <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-md inline-block mb-1">{title}</span>
    {children}
  </div>
);

const ServiceAgentCard = ({ node, agentInfo, onConnect, autoConnect }) => {
  const [status, setStatus] = useState(autoConnect ? 'connecting' : 'idle'); // idle, connecting, connected
  const hasConnected = useRef(false);

  useEffect(() => {
    if (autoConnect && status === 'connecting' && !hasConnected.current) {
        hasConnected.current = true;
        onConnect();
        setTimeout(() => {
            setStatus('connected');
        }, 1500);
    }
  }, [autoConnect, status, onConnect]);

  const handleConnect = () => {
    if (status !== 'idle') return;
    setStatus('connecting');
    onConnect(); // Trigger parent handler
    
    setTimeout(() => {
      setStatus('connected');
    }, 1500);
  };

  return (
    <div className="bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-lg border-[3px] border-white w-full max-w-sm relative group">
       {/* Full Background Image */}
       {agentInfo.avatar ? (
         <img 
           src={agentInfo.avatar} 
           alt={agentInfo.name} 
           className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
         />
       ) : (
         <div className={`absolute inset-0 w-full h-full ${agentInfo.bgColor} flex items-center justify-center`}>
            <agentInfo.icon size={64} className={`${agentInfo.iconColor} opacity-50`} />
         </div>
       )}
       
       {/* Gradient Overlay */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

       {/* Right Side Actions (Visual Only) */}
       <div className="absolute right-3 top-4 flex flex-col gap-2 z-20">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
               <ArrowRight size={14} className="-rotate-45" />
            </div>
       </div>

       {/* Content */}
       <div className="relative z-20 pt-32 p-4">
         <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white shadow-sm space-y-3">
             {/* Name & Status Row */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                   <h3 className="text-sm font-bold leading-none text-white shadow-sm truncate">{agentInfo.name}</h3>
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)] shrink-0"></div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold border border-white/20">
                   {agentInfo.tag}
                </div>
             </div>
             
             {/* Description Line */}
             <p className="text-[10px] text-white/80 font-medium leading-relaxed line-clamp-2">{agentInfo.description}</p>
             
             {/* Action Button */}
             <button
               onClick={handleConnect}
               disabled={status !== 'idle'}
               className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                 status === 'idle' 
                   ? 'bg-white text-slate-900 hover:bg-slate-100 active:scale-95 shadow-lg' 
                   : status === 'connecting'
                     ? 'bg-white/50 text-white cursor-wait'
                     : 'bg-green-500 text-white border border-green-400 cursor-default'
               }`}
             >
               {status === 'idle' && (
                 <>
                   <Sparkles size={14} className="text-cyan-500" /> 接入服务
                 </>
               )}
               {status === 'connecting' && (
                 <>
                   <Loader2 size={14} className="animate-spin" /> 正在接入...
                 </>
               )}
               {status === 'connected' && (
                 <>
                   <Check size={14} /> 已接入
                 </>
               )}
             </button>
         </div>
       </div>
    </div>
  );
};

const DayPlanCard = ({ plan, onConfirm, onRegenerate }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-purple-100">
       <div className="bg-purple-50/50 p-4 border-b border-purple-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Wand2 size={16} className="text-purple-600" />
             </div>
             <div>
                <h3 className="font-bold text-sm text-slate-800">AI 推荐行程</h3>
                <p className="text-[10px] text-purple-600 font-bold">基于起点终点智能生成</p>
             </div>
          </div>
       </div>
       
       <div className="p-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-bold">{plan.start}</span>
             </div>
             <ArrowRight size={14} className="text-slate-300" />
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-bold">{plan.end}</span>
             </div>
          </div>

          <div className="space-y-3 relative pl-2">
             <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
             {plan.spots.map((spot, i) => (
                <div key={i} className="flex gap-3 relative">
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${
                      i === 0 ? 'bg-green-500 text-white' : 
                      i === plan.spots.length - 1 ? 'bg-red-500 text-white' : 
                      'bg-purple-100 text-purple-500'
                   }`}>
                      {i === 0 || i === plan.spots.length - 1 ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                   </div>
                   <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-bold text-xs text-slate-800">{spot.title}</h4>
                         <span className="text-[10px] font-mono text-slate-400">{spot.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{spot.desc}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="flex gap-3 pt-2">
             <button 
               onClick={onRegenerate}
               className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
             >
                <RefreshCcw size={14} /> 重新规划
             </button>
             <button 
               onClick={onConfirm}
               className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 shadow-lg shadow-slate-200"
             >
                <Check size={14} /> 加入原行程
             </button>
          </div>
       </div>
    </div>
  );
};

export default ChatInterface;