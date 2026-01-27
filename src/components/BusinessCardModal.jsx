import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download, Edit2, User, Briefcase, Phone, Mail, Building, MapPin, Check, Sparkles } from 'lucide-react';
import WeChatSharePreview from './WeChatSharePreview';
import GuizhouLandscapeImg from '../image/guizhou_landscape.jpg';
import GenericQRCode from '../image/qrcode_generic.png'; 

const BusinessCardModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [showSharePreview, setShowSharePreview] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    phone: '',
    email: '',
    location: '贵州 · 贵阳',
    slogan: '山地公园省，多彩贵州风',
    avatar: null,
    bgImage: GuizhouLandscapeImg
  });

  useEffect(() => {
    if (initialData) {
      // Force update the background image to the new one, even if one was saved
      setFormData({ 
        ...formData, 
        ...initialData,
        bgImage: GuizhouLandscapeImg 
      });
      setIsEditing(false);
    } else {
        // Pre-fill defaults for new card
        setFormData(prev => ({
            ...prev,
            name: '旅行者_9527',
            organization: '贵州省文化和旅游厅',
            title: '特邀体验官',
            phone: '138 **** 8888',
            email: 'traveler@guizhou.gov.cn'
        }));
        setIsEditing(true);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleShare = () => {
    setShowSharePreview(true);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? '编辑名片' : '我的名片'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {isEditing ? (
                <div className="space-y-5">
                  <div className="bg-cyan-50 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="text-cyan-500 flex-shrink-0 mt-1" size={20} />
                    <p className="text-sm text-cyan-700 leading-relaxed">
                      黄小西为您自动填充了部分信息，您可以根据需要进行修改。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <InputField icon={User} label="姓名" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    <InputField icon={Building} label="单位/组织" value={formData.organization} onChange={v => setFormData({...formData, organization: v})} />
                    <InputField icon={Briefcase} label="职务/头衔" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                    <InputField icon={Phone} label="联系电话" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    <InputField icon={Mail} label="电子邮箱" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                    <InputField icon={MapPin} label="所在地区" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* The Digital Card */}
                  <div className="w-full aspect-[3/5] relative rounded-[1.5rem] overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-300 group">
                    {/* Background Image */}
                    <img src={formData.bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                    {/* Glassmorphism Content Layer */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      {/* Top Info */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                           <div className="w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                             <span className="text-[8px] font-bold text-white">黔</span>
                           </div>
                           <span className="text-xs font-medium tracking-wide">黄小西</span>
                        </div>
                        <img src={GenericQRCode} className="w-12 h-12 rounded-lg border-2 border-white/50 opacity-90 bg-white" alt="QR" />
                      </div>

                      {/* Main Center Info */}
                      <div className="mt-auto mb-8">
                         <h3 className="text-lg font-medium opacity-90 mb-1 tracking-wider">{formData.organization}</h3>
                         <h1 className="text-3xl font-bold mb-2 tracking-wide">{formData.name}</h1>
                         <div className="h-1 w-12 bg-cyan-400 mb-4 rounded-full"></div>
                         <p className="text-base font-light mb-6 opacity-90">{formData.title}</p>
                         
                         <div className="space-y-2 text-sm font-light opacity-80">
                            <div className="flex items-center gap-2">
                                <Phone size={14} /> <span>{formData.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} /> <span>{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} /> <span>{formData.location}</span>
                            </div>
                         </div>
                      </div>

                      {/* Bottom Slogan */}
                      <div className="border-t border-white/20 pt-4 flex justify-between items-end">
                        <p className="text-xs italic font-serif opacity-70">"{formData.slogan}"</p>
                        <div className="flex flex-col items-end">
                             <span className="text-[10px] opacity-60">扫码加我</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-white z-10">
              {isEditing ? (
                <button 
                  onClick={handleSave}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  生成名片
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    编辑信息
                  </button>
                  <button 
                    onClick={handleShare}
                    className="py-3 bg-[#07C160] text-white rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    分享给好友
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* WeChat Preview Modal */}
      <WeChatSharePreview 
        isOpen={showSharePreview} 
        onClose={() => setShowSharePreview(false)} 
        cardData={formData} 
      />
    </>,
    document.body
  );
};

const InputField = ({ icon: Icon, label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={18} />
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-slate-800"
        placeholder={`请输入${label}`}
      />
    </div>
  </div>
);

export default BusinessCardModal;
