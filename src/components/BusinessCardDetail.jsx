import React, { useState } from 'react';
import { ChevronLeft, Share2, Edit2, Eye, MessageCircle, Search, User } from 'lucide-react';
import WeChatSharePreview from './WeChatSharePreview';

const MOCK_CONTACTS = [
  { id: '1', name: '李思思', organization: '贵州省博物馆', position: '策展人', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', background: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800' },
  { id: '2', name: '张伟', organization: '黄果树旅游集团', position: '运营总监', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150', background: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800' },
  { id: '3', name: '王大力', organization: '西江千户苗寨', position: '民宿主理人', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', background: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' },
];

const BusinessCardDetail = ({ card, onEdit, onPreview, onBack, onViewCard }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWechatModal, setShowWechatModal] = useState(false);
  const [showWechatPreview, setShowWechatPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 搜索过滤逻辑
  const filteredContacts = MOCK_CONTACTS.filter(contact => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      contact.name.toLowerCase().includes(term) ||
      contact.organization.toLowerCase().includes(term) ||
      contact.position.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in fade-in duration-500 overflow-hidden relative font-sans">
      {/* 顶部导航 */}
      <div className="flex items-center p-6 bg-white z-20 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-800 hover:text-blue-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-6 text-gray-900">我的名片</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {/* 名片预览展示 */}
        <div 
          className="w-full aspect-[1.6/1] rounded-3xl overflow-hidden shadow-xl relative ring-1 ring-black/5"
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
              <img src={card.avatar} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0 bg-white" alt="Avatar" />
            </div>

            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-[10px] font-bold opacity-90">
                  <span>📱</span>
                  {card.phone}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                  <span>📧</span>
                  {card.email}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                  <span>📍</span>
                  {card.location}
               </div>
            </div>
          </div>
        </div>

        {/* 核心操作按钮 */}
        <div className="grid grid-cols-4 gap-3">
           <button 
             onClick={() => setShowWechatModal(true)}
             className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all group"
           >
             <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
               <MessageCircle size={16} />
             </div>
             <span className="text-[10px] font-bold text-gray-600">微信授权</span>
           </button>
           <button 
             onClick={onEdit}
             className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all group"
           >
             <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
               <Edit2 size={16} />
             </div>
             <span className="text-[10px] font-bold text-gray-600">修改</span>
           </button>
           <button 
             onClick={onPreview}
             className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all group"
           >
             <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
               <Eye size={16} />
             </div>
             <span className="text-[10px] font-bold text-gray-600">预览</span>
           </button>
           <button 
             onClick={() => setShowShareModal(true)}
             className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all group"
           >
             <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
               <Share2 size={16} />
             </div>
             <span className="text-[10px] font-bold text-gray-600">分享</span>
           </button>
        </div>

        {/* 数字分身入口 */}
        <button 
          onClick={() => alert('数字分身功能开发中...')}
          className="w-full relative overflow-hidden p-6 rounded-[2.5rem] bg-gradient-to-r from-gray-900 to-blue-900 text-white flex items-center justify-between shadow-xl active:scale-95 transition-all group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.5),transparent)] opacity-40"></div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-transform duration-500">
               <User size={28} className="text-blue-400" />
             </div>
             <div className="text-left">
               <p className="text-base font-black tracking-wide">生成我的数字分身</p>
               <p className="text-[10px] text-white/50 font-medium">基于AI技术的虚拟社交名片</p>
             </div>
          </div>
          <ChevronLeft className="w-6 h-6 text-white/30 group-hover:translate-x-1 transition-transform rotate-180" />
        </button>

        {/* 我收到的名片列表 */}
        <div className="mt-8 space-y-4 pb-10">
           <div className="flex items-center gap-2 ml-1">
             <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
             <h3 className="text-sm font-black text-gray-800">我收到的名片</h3>
           </div>
           
           {/* 新增搜索框 */}
           <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索姓名、公司名称、职务" 
                className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-transparent rounded-2xl focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/5 outline-none text-[11px] font-medium transition-all placeholder:text-gray-400 shadow-sm"
              />
           </div>

           <div className="space-y-3">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div 
                    key={contact.id} 
                    className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98] group"
                  >
                    <img src={contact.avatar} className="w-12 h-12 rounded-2xl object-cover" alt={contact.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-800 truncate group-hover:text-blue-600 transition-colors">{contact.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{contact.organization} · {contact.position}</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors rotate-180" />
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-400 text-xs font-medium">未找到相关名片</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 微信二维码弹框 */}
      {showWechatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setShowWechatModal(false)}>
          <div className="bg-white w-full max-w-xs rounded-[2.5rem] p-8 animate-in zoom-in duration-300 flex flex-col items-center" onClick={e => e.stopPropagation()}>
             <div className="w-full flex justify-end mb-2">
               <button onClick={() => setShowWechatModal(false)} className="text-gray-400 p-1">
                 <ChevronLeft className="w-6 h-6 rotate-180" /> {/* Using as Close icon substitute for style */}
               </button>
             </div>
             <div className="w-48 h-48 bg-gray-50 rounded-3xl p-4 border border-gray-100 mb-6">
                <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden rounded-xl border-2 border-green-500/20">
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #22c55e 0, #22c55e 2px, transparent 0, transparent 4px)', backgroundSize: '10px 10px' }}></div>
                   {/* Mock QR */}
                   <div className="w-32 h-32 bg-green-500/20 flex items-center justify-center rounded-lg">
                      <MessageCircle size={48} className="text-green-500" />
                   </div>
                </div>
             </div>
             <p className="text-sm font-black text-gray-800">扫一扫，加我微信</p>
             <p className="text-[10px] text-gray-400 mt-1">此二维码将随名片一同分享</p>
          </div>
        </div>
      )}

      {/* 分享弹窗 */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300" onClick={() => setShowShareModal(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900">分享名片</h3>
                <button onClick={() => setShowShareModal(false)} className="p-2 text-gray-400">
                  <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
             </div>
             
             <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { icon: '📱', name: '生成海报', color: 'bg-orange-50' },
                  { icon: '💾', name: '保存图片', color: 'bg-blue-50' },
                  { icon: '💬', name: '微信好友', color: 'bg-green-50', action: () => { setShowShareModal(false); setShowWechatPreview(true); } },
                  { icon: '🎡', name: '朋友圈', color: 'bg-red-50' }
                ].map(opt => (
                  <button 
                    key={opt.name} 
                    className="flex flex-col items-center gap-2 group"
                    onClick={opt.action}
                  >
                    <div className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center text-2xl group-active:scale-90 transition-transform`}>
                      {opt.icon}
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">{opt.name}</span>
                  </button>
                ))}
             </div>
             
             <button 
               onClick={() => setShowShareModal(false)}
               className="w-full py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl text-sm"
             >
               取消
             </button>
          </div>
        </div>
      )}

      {/* WeChat Preview Modal - Actually reusing the one from BusinessCardModal context if possible, 
          but BusinessCardDetail is a child. 
          To fix the "click not working" issue:
          The problem is that BusinessCardDetail is rendering its OWN WeChatSharePreview, 
          but it doesn't pass the `onViewCard` prop!
          
          We need to either:
          1. Pass `onViewCard` down from BusinessCardModal to BusinessCardDetail, and then to WeChatSharePreview.
          2. Or better, let BusinessCardModal handle the WeChat preview visibility entirely if it manages the viewMode.
          
          However, BusinessCardDetail has its own local state `showShareModal` (which seems to be the share OPTIONS modal)
          and it seems it was trying to use `WeChatSharePreview` as the share modal? No, wait.
          
          Line 241: 
          <WeChatSharePreview 
            isOpen={showShareModal}  <-- This is wrong. showShareModal is the options grid.
            onClose={() => setShowShareModal(false)} 
            cardData={card} 
          />
          
          And line 204 renders the Options Grid as `showShareModal`.
          So `WeChatSharePreview` is being rendered BEHIND the options grid or replacing it?
          Ah, `WeChatSharePreview` is rendered at the bottom.
          But `showShareModal` controls BOTH the options grid AND the WeChatPreview?
          That triggers both to open.
          
          Correction:
          We need a separate state for `showWechatPreview`.
          And we need to pass `onViewCard` (which switches to 'shared_preview') from parent.
      */}
      <WeChatSharePreview 
        isOpen={showWechatPreview} 
        onClose={() => setShowWechatPreview(false)} 
        cardData={card} 
        onViewCard={onViewCard} // We need this prop!
      />
    </div>
  );
};

export default BusinessCardDetail;
