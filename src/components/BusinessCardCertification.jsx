import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, Camera, CheckCircle, ShieldCheck } from 'lucide-react';

const BusinessCardCertification = ({ onComplete, onBack }) => {
  const [certType, setCertType] = useState('HUKOU');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    residentDocType: '居住证'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isSubmitting && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => prev + 5);
      }, 50);
      return () => clearTimeout(timer);
    } else if (isSubmitting && progress === 100) {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        onComplete(formData);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, progress, onComplete, formData]);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-50">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">认证成功</h2>
        <p className="text-gray-500">欢迎您，尊贵的“本地人”</p>
        <div className="mt-8 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          本地人标识已激活
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 overflow-y-auto pb-10 scrollbar-hide">
      <div className="flex items-center p-6 sticky top-0 bg-white z-10 border-b border-gray-50">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-6 text-gray-900">本地人认证</h1>
      </div>

      {/* Progress Bar (Only visible when submitting) */}
      {isSubmitting && (
        <div className="w-full bg-gray-100 h-1">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div className="p-6">
        {/* Type Selection Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            type="button"
            onClick={() => !isSubmitting && setCertType('HUKOU')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${certType === 'HUKOU' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            贵州户口
          </button>
          <button 
            type="button"
            onClick={() => !isSubmitting && setCertType('RESIDENT')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${certType === 'RESIDENT' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            贵州常住人口
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Common Fields */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">姓名</label>
            <input 
              required
              disabled={isSubmitting}
              type="text" 
              placeholder="请输入真实姓名" 
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">身份证号码</label>
            <input 
              required
              disabled={isSubmitting}
              type="text" 
              placeholder="18位身份证号" 
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
              value={formData.idNumber}
              onChange={e => setFormData({...formData, idNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">手机号</label>
            <input 
              required
              disabled={isSubmitting}
              type="tel" 
              placeholder="常用手机号码" 
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {certType === 'HUKOU' ? (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">身份证正面上传</label>
              <div className="mt-2 w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs text-gray-400">点击拍照或上传图片</span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">常住人附件类型</label>
                <div className="relative">
                    <select 
                    disabled={isSubmitting}
                    className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 appearance-none text-slate-700"
                    value={formData.residentDocType}
                    onChange={e => setFormData({...formData, residentDocType: e.target.value})}
                    >
                    <option value="居住证">居住证</option>
                    <option value="长期房屋租赁合同">长期房屋租赁合同</option>
                    <option value="房产证明">房产证明</option>
                    <option value="学生证">学生证</option>
                    <option value="在职证明">在职证明</option>
                    </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">附件上传</label>
                <div className="mt-2 w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-400">点击上传「{formData.residentDocType}」证明</span>
                </div>
              </div>
            </>
          )}

          <div className="pt-6">
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  正在智能审核 {progress}%
                </>
              ) : '提交认证'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 px-6">
              您的个人信息仅用于本地人身份校验，系统将采用AI自动审核技术确保隐私安全。
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessCardCertification;
