import React from 'react';
import { Edit, ChevronRight, Heart, ShoppingCart, Gift, CalendarCheck, Map, Landmark, Store, PartyPopper, Navigation, LayoutGrid, LogOut, MoreHorizontal, Circle, SquarePen, CreditCard } from 'lucide-react';
import { Page } from '../types';

export default function Profile({ onNavigate, hasDigitalAvatar = false }: { onNavigate: (page: Page) => void, hasDigitalAvatar?: boolean }) {
  return (
    <div className="min-h-full bg-[#F7F8FA] pb-24 font-sans">
      {/* Header Background with Curve */}
      <div className="relative bg-gradient-to-br from-[#E2EFFF] via-[#EAE8FF] to-[#F4F7FF] pt-14 pb-28 px-6 rounded-b-[2.5rem] overflow-hidden">
        {/* Mock WeChat Capsule */}
        <div className="absolute top-12 right-4 flex items-center gap-2 z-20">
          <div className="w-[84px] h-[32px] bg-white/60 rounded-full border border-black/5 flex items-center justify-between px-3 backdrop-blur-md">
            <MoreHorizontal size={18} className="text-black" />
            <div className="w-[1px] h-4 bg-black/10"></div>
            <Circle size={14} className="text-black" strokeWidth={3} />
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-start justify-between relative z-10 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-sm">
              <img src="https://picsum.photos/seed/user2/200/200" className="w-full h-full rounded-full object-cover opacity-80" alt="Avatar" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">yee</h1>
              <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                <span>简介：</span>
                <SquarePen size={16} className="cursor-pointer text-gray-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Tags and Homepage Button */}
        <div className="flex items-center justify-between mt-5 relative z-10">
          <div className="flex gap-2">
            <span className="bg-white/60 text-gray-700 px-3.5 py-1 rounded-full text-xs font-medium">2岁</span>
            <span className="bg-white/60 text-gray-700 px-3.5 py-1 rounded-full text-xs font-medium">九江</span>
          </div>
          <button className="bg-white/60 text-gray-800 px-4 py-1.5 rounded-full text-xs font-medium">
            个人主页
          </button>
        </div>
      </div>

      <div className="px-4 -mt-16 relative z-20 space-y-6">
        {/* Travel Preferences Card */}
        <div className="bg-gradient-to-r from-[#E5F0FF] to-[#F5FAFF] rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌴</span>
              <h3 className="font-bold text-gray-900 text-[15px]">旅游偏好</h3>
            </div>
            <p className="text-xs text-gray-500">夜游出行、自然观光、休闲体验</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        {/* Digital Avatar Entry */}
        <div
          onClick={() => onNavigate(hasDigitalAvatar ? 'digital-card' : 'digital-avatar')}
          className="rounded-[30px] px-6 py-5 shadow-[0_6px_16px_rgba(99,102,241,0.10)] border border-indigo-100/80 flex items-center justify-between cursor-pointer relative overflow-hidden min-h-[108px]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #d9ecff 0%, #d6e7ff 46%, #e2dbff 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-12 -top-10 w-44 h-24 rounded-full bg-white/28 blur-2xl" />
            <div className="absolute left-1/2 -translate-x-1/2 w-[42%] bottom-4 h-px bg-indigo-300/45 rounded-full" />
          </div>

          <div className="relative z-10 pr-2 max-w-[220px]">
            <h3 className="text-[18px] leading-tight font-bold text-indigo-900">我的数字分身</h3>
            <p className="text-xs text-indigo-900/70 mt-1.5 leading-5">创建专属AI分身与数字名片，开启智能社交</p>
          </div>
          <div className="relative z-10 w-[90px] h-[66px] rounded-[18px] bg-white/72 border border-indigo-200/85">
            <div className="absolute left-3 top-3 w-6 h-6 rounded-[7px] bg-indigo-300/78" />
            <div className="absolute left-[34px] top-4 w-11 h-1.5 rounded-full bg-indigo-300/78" />
            <div className="absolute left-[34px] top-8 w-8 h-1.5 rounded-full bg-indigo-200/90" />
            <div className="absolute left-3 right-3 bottom-4 h-1.5 rounded-full bg-indigo-200/84" />
            <div className="absolute right-3 bottom-4 w-2 h-2 rounded-full bg-indigo-300/75" />
          </div>
        </div>

        {/* Huang Xiao Xia Entry */}
        <div
          className="rounded-[30px] px-6 py-4 shadow-[0_6px_16px_rgba(99,102,241,0.10)] border border-indigo-100/80 flex items-center justify-between cursor-pointer relative overflow-hidden min-h-[96px]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #dff8ff 0%, #dcf1ff 48%, #dff0ff 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-12 -top-10 w-44 h-24 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute left-1/2 -translate-x-1/2 w-[42%] bottom-4 h-px bg-cyan-300/55 rounded-full" />
          </div>

          <div className="relative z-10 pr-2 max-w-[220px]">
            <h3 className="text-[18px] leading-tight font-bold text-cyan-900">黄小虾</h3>
            <p className="text-xs text-cyan-900/70 mt-1.5 leading-5">AI数字员工团队，助力一人一公司</p>
          </div>
          <div className="relative z-10 w-[104px] h-[78px] rounded-[24px] bg-white/84 border border-cyan-200/90 shadow-[0_6px_12px_rgba(56,189,248,0.10)]">
            <div className="absolute left-3 top-3 w-8 h-8 rounded-[9px] bg-cyan-300/72" />
            <div className="absolute left-[46px] top-4 w-12 h-1.5 rounded-full bg-cyan-300/70" />
            <div className="absolute left-[46px] top-8 w-9 h-1.5 rounded-full bg-sky-200/90" />
            <div className="absolute left-4 right-4 bottom-4 h-1.5 rounded-full bg-sky-200/82" />
          </div>
        </div>

        {/* Services + Order Center (Order Center is subset) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-[17px] font-bold text-gray-800 mb-4 px-1">我的服务</h2>
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            <ServiceItem icon={<Heart size={24} className="text-pink-400" strokeWidth={1.5} />} label="我的收藏" bg="bg-pink-50" />
            <ServiceItem icon={<ShoppingCart size={24} className="text-orange-400" strokeWidth={1.5} />} label="购物车" bg="bg-orange-50" />
            <ServiceItem icon={<Gift size={24} className="text-yellow-500" strokeWidth={1.5} />} label="优惠券" bg="bg-yellow-50" />
            <ServiceItem
              icon={<CalendarCheck size={24} className="text-blue-400" strokeWidth={1.5} />}
              label="我的行程"
              bg="bg-blue-50"
              onClick={() => onNavigate('trip-list')}
            />
            <ServiceItem
              icon={<CreditCard size={24} className="text-indigo-500" strokeWidth={1.5} />}
              label="名片夹"
              bg="bg-indigo-50"
              onClick={() => onNavigate('card-favorites')}
            />
          </div>

          <div className="my-5 h-px bg-gray-100" />

          <h3 className="text-[17px] font-bold text-gray-800 mb-4 px-1">订单中心</h3>
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            <ServiceItem icon={<Map size={24} className="text-green-500" strokeWidth={1.5} />} label="线路" bg="bg-green-50" />
            <ServiceItem icon={<Landmark size={24} className="text-blue-400" strokeWidth={1.5} />} label="景区" bg="bg-blue-50" />
            <ServiceItem icon={<Store size={24} className="text-orange-400" strokeWidth={1.5} />} label="酒店" bg="bg-orange-50" />
            <ServiceItem icon={<PartyPopper size={24} className="text-purple-400" strokeWidth={1.5} />} label="活动" bg="bg-purple-50" />
            <ServiceItem icon={<Navigation size={24} className="text-blue-500" strokeWidth={1.5} />} label="出行" bg="bg-blue-50" />
          </div>
        </div>

        {/* General Functions */}
        <div className="bg-white rounded-2xl px-5 py-2 shadow-sm">
          <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer">
            <span className="text-[15px] text-gray-800">常用证件信息</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer">
            <span className="text-[15px] text-gray-800">协议规则</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer">
            <span className="text-[15px] text-gray-800">客服电话</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-between py-4 cursor-pointer" onClick={() => onNavigate('settings')}>
            <span className="text-[15px] text-gray-800">设置</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-400 space-y-2 pt-4 pb-8">
          <p>模型名称：多彩黄小西AI</p>
          <p>备案编号：GuizhouDuoCaiHuangXiaoXiaoXiAI-20250724S0002</p>
          <p>ICP号：黔ICP备2025044274号-1X</p>
        </div>
      </div>
    </div>
  );
}

function ServiceItem({ icon, label, bg, onClick, className = '' }: { icon: React.ReactNode, label: string, bg: string, onClick?: () => void, className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 cursor-pointer ${className}`} onClick={onClick}>
      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center`}>
        {icon}
      </div>
      {label && <span className="text-xs text-gray-700">{label}</span>}
    </div>
  );
}
