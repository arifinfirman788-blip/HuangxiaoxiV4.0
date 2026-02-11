import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronLeft, ChevronRight, Check, Plus, Minus, Search, Settings, Upload } from 'lucide-react';
import GuizhouLandscapeImg from '../image/guizhou_landscape.jpg';

const CreateAgentModal = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    inputDescription: '我是一个专业的贵州本地向导，熟悉各大景区路线，提供包车、讲解和行程规划服务。',
    selectedType: '导游',
    services: [
        { name: '一日游带队', price: '300', unit: '元/天' },
        { name: '行程规划', price: '50', unit: '元/次' },
        { name: '代订门票', price: '10', unit: '元/张' }
    ],
    intro: '我是您的专属旅行管家，深耕贵州旅游多年。无论是小众秘境还是经典路线，我都能为您量身定制。带您避开人潮，品尝地道美食，感受最纯粹的风土人情。选择我，让您的旅程省心、省力更省钱！',
    name: '我的智能体', // Default name
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MyAgent', // Default avatar
    bgImage: GuizhouLandscapeImg
  });

  // Mock Categories for Step 1
  const categories = {
    '在地旅行服务': ['导游', '地陪', '研学导师', '探险向导', '徒步领队', '骑行队长'],
    '能工巧匠': ['维修', '疏通', '安装', '开锁'],
    '家政保洁': ['保洁', '收纳', '做饭', '看护'],
    '跑腿代办': ['跑腿', '排队', '代购', '送货']
  };

  // Step 1: Handle Text Input & Auto-Identify (Mock)
  const handleIdentify = () => {
    // Mock AI Identification logic
    let type = '';
    if (formData.inputDescription.includes('导游') || formData.inputDescription.includes('玩') || formData.inputDescription.includes('向导')) {
       type = '导游';
    } else if (formData.inputDescription.includes('保洁') || formData.inputDescription.includes('打扫')) {
       type = '保洁';
    } else {
       // Randomly pick one if no keyword match for demo
       type = '导游';
    }
    
    // Auto-generate services based on type
    let mockServices = [];
    if (['导游', '地陪'].includes(type)) {
       mockServices = [
           { name: '一日游带队', price: '300', unit: '元/天' },
           { name: '行程规划', price: '50', unit: '元/次' },
           { name: '代订门票', price: '10', unit: '元/张' }
       ];
    } else if (['保洁'].includes(type)) {
       mockServices = [
           { name: '全屋大扫除', price: '面议', unit: '' },
           { name: '空调清洗', price: '90', unit: '元/台' },
           { name: '冰箱清洗', price: '70', unit: '元/台' },
           { name: '深度保洁', price: '40', unit: '元/小时' }
       ];
    } else {
       mockServices = [
           { name: '基础服务', price: '100', unit: '元/次' }
       ];
    }
    
    setFormData(prev => ({ 
        ...prev, 
        selectedType: type,
        services: mockServices 
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, bgImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2: Handle Reference Price (Mock)
  const handleReferencePrice = () => {
     let mockServices = [];
     if (['导游', '地陪'].includes(formData.selectedType)) {
        mockServices = [
            { name: '一日游带队', price: '300', unit: '元/天' },
            { name: '行程规划', price: '50', unit: '元/次' },
            { name: '代订门票', price: '10', unit: '元/张' }
        ];
     } else if (['保洁'].includes(formData.selectedType)) {
        mockServices = [
            { name: '全屋大扫除', price: '面议', unit: '' },
            { name: '空调清洗', price: '90', unit: '元/台' },
            { name: '冰箱清洗', price: '70', unit: '元/台' },
            { name: '深度保洁', price: '40', unit: '元/小时' }
        ];
     } else {
        mockServices = [
            { name: '基础服务', price: '100', unit: '元/次' }
        ];
     }
     setFormData(prev => ({ ...prev, services: mockServices }));
  };

  const updateService = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData(prev => ({
        ...prev,
        services: [...prev.services, { name: '', price: '', unit: '' }]
    }));
  };

  // Step 3: Handle AI Polish (Mock)
  const handleAIPolish = () => {
     let polishedIntro = "";
     if (['导游', '地陪'].includes(formData.selectedType)) {
         polishedIntro = "我是您的专属旅行管家，深耕贵州旅游多年。无论是小众秘境还是经典路线，我都能为您量身定制。带您避开人潮，品尝地道美食，感受最纯粹的风土人情。选择我，让您的旅程省心、省力更省钱！";
     } else if (['保洁'].includes(formData.selectedType)) {
         polishedIntro = "专业保洁服务，十年行业经验。我承诺使用环保清洁剂，关注每一个卫生死角。从全屋大扫除到家电清洗，为您打造一尘不染的温馨家园。您的满意，就是我最大的追求！";
     } else {
         polishedIntro = `我是专业的${formData.selectedType}，致力于为您提供最优质的服务。经验丰富，技术精湛，期待为您解决难题！`;
     }
     setFormData(prev => ({ ...prev, intro: polishedIntro }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.selectedType) {
        alert('请先选择服务类型');
        setStep(1);
        return;
    }
    onSave(formData);
    onClose();
    // Reset state after closing
    setTimeout(() => {
        setStep(1);
        setFormData({
            inputDescription: '我是一个专业的贵州本地向导，熟悉各大景区路线，提供包车、讲解和行程规划服务。',
            selectedType: '导游',
            services: [
                { name: '一日游带队', price: '300', unit: '元/天' },
                { name: '行程规划', price: '50', unit: '元/次' },
                { name: '代订门票', price: '10', unit: '元/张' }
            ],
            intro: '我是您的专属旅行管家，深耕贵州旅游多年。无论是小众秘境还是经典路线，我都能为您量身定制。带您避开人潮，品尝地道美食，感受最纯粹的风土人情。选择我，让您的旅程省心、省力更省钱！',
            name: '我的智能体',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now(),
            bgImage: GuizhouLandscapeImg
        });
    }, 500);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
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
          className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col h-[85vh] max-h-[800px]"
          onClick={(e) => e.stopPropagation()}
        >
           {/* Header */}
           <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-lg font-bold text-slate-800">创建名片</h2>
              <div className="flex items-center gap-2">
                 <Settings size={20} className="text-slate-400" />
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-slate-50">
              {step === 1 && (
                  <div className="space-y-6">
                     {/* AI Input */}
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-sm font-bold text-slate-700 text-blue-600">AI 自动生成服务</span>
                           <button 
                             onClick={handleIdentify}
                             className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 active:scale-95 transition-transform"
                           >
                              <Sparkles size={12} />
                              识别
                           </button>
                        </div>
                        <textarea 
                           className="w-full h-24 bg-transparent outline-none text-sm text-slate-600 placeholder-slate-300 resize-none"
                           placeholder="输入文字自动识别。如：我是一个维修工。"
                           value={formData.inputDescription}
                           onChange={(e) => setFormData({...formData, inputDescription: e.target.value})}
                        />
                     </div>

                     {/* Selected Type Display */}
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="text-xs text-slate-400 mb-2">已选服务类型 ({formData.selectedType ? 1 : 0})</div>
                        {formData.selectedType ? (
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold inline-block">
                                {formData.selectedType}
                            </span>
                        ) : (
                            <div className="text-sm text-slate-300">请在下方选择服务类型</div>
                        )}
                     </div>

                     {/* Image Upload Section */}
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-3">智能体封面</label>
                        <div className="relative h-32 w-full rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group">
                            <img src={formData.bgImage} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                                <Upload size={24} />
                                <span className="text-xs font-bold mt-1">点击上传封面</span>
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                     </div>

                     {/* Categories */}
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">服务类型</h3>
                        <div className="flex gap-4">
                           {/* Sidebar Categories (Simplified for UI) */}
                           <div className="w-24 flex flex-col gap-4 border-r border-slate-100 pr-2">
                              {Object.keys(categories).map((cat, idx) => (
                                  <div key={idx} className={`text-sm font-medium ${idx === 0 ? 'text-slate-800 border-l-2 border-orange-500 pl-2' : 'text-slate-400 pl-2.5'}`}>
                                      {cat}
                                  </div>
                              ))}
                           </div>
                           {/* Tags */}
                           <div className="flex-1 flex flex-wrap gap-2 content-start">
                              {categories['在地旅行服务'].map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => setFormData({...formData, selectedType: tag})}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${formData.selectedType === tag ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                                  >
                                      {tag}
                                  </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
              )}

              {step === 2 && (
                  <div className="space-y-4">
                      {formData.services.map((service, index) => (
                          <div key={index} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 relative">
                             <button 
                               onClick={() => removeService(index)}
                               className="absolute top-3 right-3 text-slate-300 hover:text-red-500"
                             >
                                <X size={16} />
                             </button>
                             <div className="space-y-3">
                                <input 
                                  type="text" 
                                  value={service.name}
                                  onChange={(e) => updateService(index, 'name', e.target.value)}
                                  className="w-full text-sm font-bold text-slate-800 outline-none placeholder-slate-300"
                                  placeholder="服务名称"
                                />
                                <div className="flex gap-2">
                                   <input 
                                      type="text" 
                                      value={service.price}
                                      onChange={(e) => updateService(index, 'price', e.target.value)}
                                      className="flex-1 p-2 bg-slate-50 rounded-lg text-center text-sm font-medium outline-none"
                                      placeholder="价格"
                                   />
                                   <input 
                                      type="text" 
                                      value={service.unit}
                                      onChange={(e) => updateService(index, 'unit', e.target.value)}
                                      className="w-20 p-2 bg-slate-50 rounded-lg text-center text-sm font-medium outline-none"
                                      placeholder="单位"
                                   />
                                   <button className="px-3 py-1.5 bg-blue-50 text-blue-500 text-xs font-bold rounded-lg whitespace-nowrap" onClick={handleReferencePrice}>
                                      ✨ 参考价
                                   </button>
                                </div>
                             </div>
                          </div>
                      ))}
                      
                      <button 
                        onClick={addService}
                        className="w-full py-3 border-2 border-dashed border-blue-200 rounded-xl text-blue-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                      >
                         <Plus size={16} />
                         添加服务
                      </button>
                  </div>
              )}

              {step === 3 && (
                  <div className="space-y-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-sm font-bold text-slate-800 border-l-4 border-purple-500 pl-2">个人简介</span>
                             <button 
                               onClick={handleAIPolish}
                               className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold border border-purple-100 active:scale-95 transition-transform"
                             >
                                <Sparkles size={12} />
                                AI 美化
                             </button>
                          </div>
                          <textarea 
                             className="w-full h-40 bg-slate-50 rounded-xl p-3 outline-none text-sm text-slate-600 leading-relaxed resize-none"
                             placeholder="请输入个人简介..."
                             value={formData.intro}
                             onChange={(e) => setFormData({...formData, intro: e.target.value})}
                          />
                          <div className="text-right text-xs text-slate-300 mt-2">
                             {formData.intro.length}/100
                          </div>
                      </div>
                  </div>
              )}
           </div>

           {/* Footer Buttons */}
           <div className="p-6 bg-white border-t border-slate-100 z-10 shrink-0">
              <div className="flex gap-4">
                  {step > 1 && (
                      <button 
                        onClick={() => setStep(prev => prev - 1)}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-full font-bold active:scale-95 transition-transform"
                      >
                         上一步
                      </button>
                  )}
                  {step < 3 ? (
                      <button 
                        onClick={() => {
                            if (step === 1 && !formData.selectedType) {
                                alert("请先点击【识别】按钮或选择服务类型");
                                return;
                            }
                            setStep(prev => prev + 1);
                        }}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                      >
                         下一步
                      </button>
                  ) : (
                      <button 
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                      >
                         提交
                      </button>
                  )}
              </div>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default CreateAgentModal;