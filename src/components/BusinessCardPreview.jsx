import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, MapPin, Download, Share2, Check, Mic, Send, MessageCircle, Star } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { agents } from '../data/agents';
import HuangXiaoXiAvatar from '../image/huangxiaoxi_ai_avatar_v2.png';

// Mini Agent Card Component
const MiniAgentCard = ({ agent, onConnect }) => {
  return (
    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full mt-3 flex items-start gap-3 text-left">
      <div className="w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden shadow-sm">
           {agent.avatar?.length < 5 ? (
             <div className="w-full h-full flex items-center justify-center text-xl">{agent.avatar}</div>
           ) : (
             <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
           )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-black text-slate-800 truncate">{agent.name}</h4>
        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{agent.intro}</p>
        <button 
          onClick={(e) => { e.stopPropagation(); onConnect(agent); }}
          className="mt-2 px-3 py-1.5 bg-cyan-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-cyan-600 transition-colors shadow-sm shadow-cyan-200"
        >
          <MessageCircle size={10} />
          立即咨询
        </button>
      </div>
    </div>
  );
};

const BusinessCardPreview = ({ card, mode = 'own', onConfirm, onBack, onShare, onCloseModal }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `您好！我是黄小西，任何关于贵州旅游的问题都可以问我哦！` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Find the last assistant message to display
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant') || { text: "" };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Intent Recognition Logic
    const lowerMsg = userMsg.toLowerCase();
    console.log('User input:', lowerMsg);
    
    let matchedAgent = null;

    // More flexible matching logic
    const isIntent = (keywords) => keywords.some(k => lowerMsg.includes(k));
    const hasAction = isIntent(['我想', '我要', '想', '要', '买', '订', '吃', '推荐', '找', '有', '去']);
    console.log('Has action:', hasAction);

    // Generic search across all agents
    const fillers = ['我想', '我要', '推荐', '去', '吃', '住', '玩', '找', '一个', '订', '有', '想', '要', '看'];
    let cleanedContent = lowerMsg;
    fillers.forEach(filler => {
        cleanedContent = cleanedContent.replaceAll(filler, '');
    });

    if (hasAction || lowerMsg.length > 1) {
        // Split by delimiters
        const keywords = cleanedContent.split(/也|和|，|,| |、/);
        const allMatchedAgents = [];

        keywords.forEach(keyword => {
            const k = keyword.trim();
            if (k.length > 0) {
                 const matched = agents.find(a => 
                    a.name.includes(k) || 
                    a.intro.includes(k) || 
                    a.skills.some(s => s.includes(k)) ||
                    (a.category === 'scenic' && k.includes('景区')) ||
                    (a.category === 'hotel' && k.includes('酒店')) ||
                    (a.category === 'dining' && k.includes('吃'))
                 );
                 if (matched) allMatchedAgents.push(matched);
            }
        });
        
        // Deduplicate
        const uniqueAgents = Array.from(new Set(allMatchedAgents.map(a => a.id)))
            .map(id => allMatchedAgents.find(a => a.id === id));
        
        if (uniqueAgents.length > 0) {
             matchedAgent = uniqueAgents; // Assign array
        }
    }
    
    // Fallback for specific demos if not found in generic search
    if (!matchedAgent) {
        if (lowerMsg.includes('辣子鸡')) {
             matchedAgent = {
                id: 'custom-food-1',
                name: '王阿姨辣子鸡智能体',
                avatar: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop',
                intro: '三十年老字号，地道贵阳味，现炒现卖，香辣过瘾。',
                skills: ['排队取号', '外卖预订', '口味定制'],
                category: 'food'
             };
        } else if ((lowerMsg.includes('酒店') || lowerMsg.includes('住')) && hasAction) {
             matchedAgent = {
                id: 'custom-hotel-1',
                name: '附近的酒店智能体',
                avatar: '🏨',
                intro: '为您推荐周边高评分舒适酒店，性价比之选。',
                skills: ['房型查询', '价格对比', '快速预订'],
                category: 'hotel'
             };
        }
    }

    if (matchedAgent) {
       console.log('Agent found:', matchedAgent);
       // Handle array or single object
       const agentResponse = Array.isArray(matchedAgent) ? matchedAgent : [matchedAgent];
       
       setTimeout(() => {
         console.log('Dispatching agent response');
         setMessages(prev => {
            const newMessages = [
               ...prev, 
               { 
                 role: 'assistant', 
                 text: `太棒了！为您找到以下${agentResponse.length}个智能体，能帮您解决需求哦～`,
                 agents: agentResponse, // Store array
                 agent: agentResponse[0], // Fallback for old code
                 type: 'recommendation'
               }
            ];
            return newMessages;
         });
         setIsTyping(false);
       }, 800);
       return;
    }

    try {
      // Note: You should replace 'process.env.API_KEY' with your actual key handling strategy
      // For now, we assume it's available or mocked
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE"; 
      
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
         setTimeout(() => {
             setMessages(prev => [...prev, { role: 'assistant', text: "请配置 VITE_GEMINI_API_KEY 以启用 AI 对话功能。" }]);
             setIsTyping(false);
         }, 1000);
         return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          {
            role: 'user',
            parts: [{ text: `你叫黄小西，是LocalPro Connect的AI助手，也是贵州旅游达人。用户现在的名片信息是：姓名 ${card.name}, 职位 ${card.title}, 公司 ${card.organization}。用户说：${userMsg}` }]
          }
        ],
        config: {
          systemInstruction: "你是一个热情、专业的社交及贵州旅游助手黄小西。语气要轻快、幽默，多使用表情符号。你的回复要简短，适合放在对话气泡里。如果用户询问旅游建议，请提供地道的贵州当地推荐。"
        }
      });

      const aiText = response.text || "哎呀，刚才走神了，再说一遍好吗？";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "哎呀，信号不太好，我没听清楚..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isOwn = mode === 'own';
  const isShared = mode === 'shared';
  const [hasSaved, setHasSaved] = useState(false);

  const handleSaveCard = () => {
      setHasSaved(true);
      // Here you would typically save to local storage or backend
      // For demo, we just switch state
      setTimeout(() => {
         // Optional: Navigate to profile or just show success
      }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans overflow-hidden relative">
      {/* 顶部导航 */}
      <div className="flex items-center p-6 border-b border-gray-100 shrink-0 bg-white z-30">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-800">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-6 text-gray-900">
          {isOwn ? '预览名片' : (isShared ? '名片预览' : '名片详情')}
        </h1>
      </div>

      <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-8 ${isOwn ? 'pb-40' : 'pb-10'} scrollbar-hide`}>
        {/* 1. 名片预览 */}
        <div 
          className="w-full aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl relative ring-1 ring-black/5 animate-in zoom-in duration-500"
          style={{ 
            backgroundImage: `url(${card.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent"></div>
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-2xl font-black tracking-wider truncate">{card.name}</h2>
                <div className="w-8 h-[1px] bg-white/40 my-2"></div>
                <p className="text-sm font-bold text-white/90 uppercase tracking-widest truncate">{card.title}</p>
                <p className="text-xs text-white/70 mt-1 font-medium truncate">{card.organization}</p>
              </div>
              {/* 头像变大 */}
              <img src={card.avatar} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0 bg-white" alt="Avatar" />
            </div>

            <div className="space-y-1">
               <div className="flex items-center gap-2 text-[10px] font-bold opacity-90">
                  <Phone size={12} />
                  {card.phone}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                  <Mail size={12} />
                  {card.email}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                  <MapPin size={12} />
                  {card.location}
               </div>
            </div>
          </div>
        </div>

        {/* 2. 按钮区域 - 样式完全统一 */}
        <div className="flex gap-3">
           {/* Shared Mode: Save/Download Buttons */}
           {isShared ? (
             <>
               <button 
                 onClick={() => alert('已下载名片图片')}
                 className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 active:scale-95 transition-all shadow-sm"
               >
                 <Download size={20} className="mb-1" />
                 <span className="text-[11px] font-black uppercase tracking-widest">下载名片</span>
               </button>

               {!hasSaved ? (
                    <button 
                      onClick={handleSaveCard}
                      className="flex-1 flex flex-col items-center justify-center py-4 bg-cyan-500 rounded-2xl border border-cyan-500 text-white active:scale-95 transition-all shadow-lg shadow-cyan-200"
                    >
                      <Download size={20} className="mb-1" />
                      <span className="text-[11px] font-black uppercase tracking-widest">保存名片</span>
                    </button>
                ) : (
                    <button 
                      onClick={() => {
                        if (onBack) {
                          onBack();
                        } else {
                          navigate('/business-card');
                        }
                      }}
                      className="flex-1 flex flex-col items-center justify-center py-4 bg-green-500 rounded-2xl border border-green-500 text-white active:scale-95 transition-all shadow-lg shadow-green-200"
                    >
                      <Check size={20} className="mb-1" />
                      <span className="text-[11px] font-black uppercase tracking-widest">我的名片</span>
                    </button>
                )}
             </>
           ) : (
             // Own Mode Buttons
             <>
               <button 
                 onClick={() => alert('已保存到相册')}
                 className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 active:scale-95 transition-all shadow-sm"
               >
                 <Download size={20} className="mb-1" />
                 <span className="text-[11px] font-black uppercase tracking-widest">保存名片</span>
               </button>
               
               <button 
                 onClick={onShare}
                 className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 active:scale-95 transition-all shadow-sm"
               >
                 <Share2 size={20} className="mb-1" />
                 <span className="text-[11px] font-black uppercase tracking-widest">分享名片</span>
               </button>

               <button 
                 onClick={() => onConfirm(card)}
                 className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 active:scale-95 transition-all shadow-sm"
               >
                 <Check size={20} className="mb-1" />
                 <span className="text-[11px] font-black uppercase tracking-widest">我的名片</span>
               </button>
             </>
           )}
        </div>

        {/* 3. AI 角色与气泡对话区域 - Only for 'own' mode */}
        {isOwn && (
          <div className="relative pt-6 flex flex-col items-center">
             {/* 对话气泡 */}
             <div className="relative mb-6 w-full flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white px-8 py-7 rounded-[3rem] shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100 relative z-10 max-w-[92%] min-h-[110px] flex flex-col items-center justify-center text-center">
                  <div className="text-lg font-black text-gray-800 leading-relaxed w-full">
                     {isTyping ? "黄小西正在思考中..." : (
                        <>
                           <p>{lastAssistantMsg.text}</p>
                           {lastAssistantMsg.agents && lastAssistantMsg.agents.length > 0 ? (
                              <div className="w-full flex flex-col gap-2">
                                  {lastAssistantMsg.agents.map(agent => (
                                      <MiniAgentCard 
                                        key={agent.id}
                                        agent={agent} 
                                        onConnect={(agent) => {
                                           if (onCloseModal) onCloseModal();
                                           navigate(`/message/agent-${agent.id}`);
                                        }}
                                      />
                                  ))}
                              </div>
                           ) : lastAssistantMsg.agent && (
                              <MiniAgentCard 
                                agent={lastAssistantMsg.agent} 
                                onConnect={(agent) => {
                                   if (onCloseModal) onCloseModal();
                                   navigate(`/message/agent-${agent.id}`); // Assuming chat route
                                }}
                              />
                           )}
                        </>
                     )}
                  </div>
                  <div className="absolute -bottom-4 right-1/4 w-8 h-8 bg-white border-r border-b border-gray-100 transform rotate-[35deg] z-0"></div>
                </div>
             </div>

             {/* AI 角色形象 */}
             <div className="relative w-full h-40 flex justify-end pr-10 mt-2">
                <div className="w-56 h-full relative group">
                   <img 
                      src={HuangXiaoXiAvatar} 
                      alt="黄小西AI助手" 
                      className="w-full h-full object-contain object-bottom drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                   />
                   <div className="absolute -top-4 left-6 animate-pulse text-2xl">☁️</div>
                   <div className="absolute top-8 -right-2 animate-bounce text-xl">✨</div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 4. 底部输入框 - Only for 'own' mode */}
      {isOwn && (
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-3xl border-t border-gray-100 z-40 pb-10">
          <div className="max-w-md mx-auto flex items-center gap-3">
             {/* 语音输入按钮 */}
             <button 
               onClick={() => alert('语音输入功能正在接入中...')}
               className="h-12 w-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm shrink-0 border border-gray-100"
             >
               <Mic size={20} />
             </button>

             {/* 输入框 */}
             <div className="flex-1 flex items-center">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="对黄小西说点什么..."
                  className="h-12 w-full px-6 bg-gray-100 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
             </div>

             {/* 发送按钮 */}
             <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30 shrink-0"
             >
                <Send size={20} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCardPreview;
