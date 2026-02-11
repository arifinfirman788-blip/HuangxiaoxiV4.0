import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, MessageCircle, Check } from 'lucide-react';
import TuoSaiImage from '../image/托腮_1.png';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [shake, setShake] = useState(false);
  
  const from = location.state?.from?.pathname || '/';

  const handleWechatLogin = () => {
    if (!isPrivacyAgreed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    
    // Simulate WeChat Authorization
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      navigate(from, { replace: true });
    }, 1500);
  };

  return (
    <div className="h-full w-full relative bg-white overflow-hidden font-sans flex flex-col items-center justify-between py-12 px-6">
      
      {/* Header / Title */}
      <div className="w-full pt-12 flex flex-col items-center z-10">
         <div className="relative">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 text-center leading-tight tracking-tight drop-shadow-sm font-serif">
              <span className="font-sans font-light text-2xl text-slate-400 block mb-2 tracking-widest">WELCOME</span>
              欢迎使用
              <br />
              <span className="text-5xl mt-2 relative inline-block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent filter drop-shadow-md">
                多彩黄小西
                <svg className="absolute -bottom-3 left-0 w-full h-4 text-yellow-300 -z-10 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
         </div>
      </div>

      {/* Character Image */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm relative z-0">
          <div className="relative w-full aspect-square bg-cyan-50 rounded-[3rem] rotate-3 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
             <div className="absolute top-4 left-4 text-cyan-200">
                <MessageCircle size={32} />
             </div>
             <div className="absolute bottom-12 right-4 text-cyan-200 rotate-12">
                <MessageCircle size={24} />
             </div>
             <img 
               src={TuoSaiImage} 
               alt="黄小西" 
               className="w-[90%] h-[90%] object-contain -rotate-3 mt-4"
             />
             
             {/* Decorative Elements */}
             <div className="absolute top-1/2 -left-4 text-cyan-400 font-bold text-xl rotate-[-15deg]">?!</div>
             <div className="absolute bottom-10 -right-2 text-cyan-400 font-bold text-xl rotate-[15deg]">✓</div>
          </div>
          
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-8 -left-4 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Button */}
      <div className="w-full max-w-xs space-y-4 z-10 pb-8">
        <button 
          onClick={handleWechatLogin}
          disabled={isLoading}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 rounded-full text-white font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center relative overflow-hidden"
        >
          {isLoading ? (
             <div className="flex items-center gap-2">
               <Loader2 size={24} className="animate-spin" />
               <span className="text-sm">授权中...</span>
             </div>
          ) : (
             <span>微信一键登录</span>
          )}
        </button>
        
        <div className={`flex items-center justify-center gap-2 text-[10px] text-slate-400 ${shake ? 'animate-shake' : ''}`}>
           <div 
             onClick={() => setIsPrivacyAgreed(!isPrivacyAgreed)}
             className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${isPrivacyAgreed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 bg-white'}`}
           >
              {isPrivacyAgreed && <Check size={10} className="text-white" />}
           </div>
           <p onClick={() => setIsPrivacyAgreed(!isPrivacyAgreed)} className="cursor-pointer">
             点击登录即表示同意《用户协议》和《隐私政策》
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
