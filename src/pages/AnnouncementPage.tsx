import React, { useState } from 'react';
import { ArrowLeft, Bell, Newspaper, CloudRain } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../types';

const NOTIFICATIONS = [
  { id: 1, type: '通知', title: '系统维护公告', time: '2026-03-10' },
  { id: 2, type: '资讯', title: '贵州旅游新政策', time: '2026-03-09' },
  { id: 3, type: '天气预警', title: '未来三天有雨', time: '2026-03-10' },
];

const TABS = ['通知', '资讯', '天气预警'];

export default function AnnouncementPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [activeTab, setActiveTab] = useState('通知');

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="pt-12 px-6 pb-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => onNavigate('home')} className="p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">公告中心</h1>
      </div>

      <div className="flex px-6 mt-4 gap-6 border-b border-gray-100">
        {TABS.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-base font-medium transition-colors ${
              activeTab === tab 
                ? 'text-[#7786FC] border-b-2 border-[#7786FC]' 
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {NOTIFICATIONS.filter(n => n.type === activeTab).map(n => (
          <div key={n.id} className="p-4 bg-gray-50 rounded-xl mb-4">
            <div className="font-bold text-gray-900">{n.title}</div>
            <div className="text-xs text-gray-400 mt-1">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
