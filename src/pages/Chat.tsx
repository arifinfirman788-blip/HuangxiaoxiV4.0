import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, MoreHorizontal, Mic, Image as ImageIcon, Send, Sparkles, MapPin, Hotel } from 'lucide-react';
import { Page } from '../types';
import { motion } from 'motion/react';

const SCENIC_SPOTS = ['青岩古镇', '多彩贵州城', '青云市集', '甲秀楼', '太平路', '黔灵山公园', '越界影城', '红飘带艺术馆', '黄果树瀑布', '陡坡塘瀑布', '西江千户苗寨'];

const highlightText = (text: string) => {
  const regex = new RegExp(`(${SCENIC_SPOTS.join('|')})`, 'g');
  const parts = text.split(regex);
  return parts.map((part, i) => 
    SCENIC_SPOTS.includes(part) ? <span key={i} className="text-blue-500 font-bold cursor-pointer hover:underline">{part}</span> : part
  );
};

export default function Chat({ onNavigate, agentTitle = '黄小西', data }: { onNavigate: (page: Page) => void, agentTitle?: string, data?: any }) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: `你好！我是${agentTitle}。想去哪里玩？我可以帮你做规划哦！` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: text }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      if (text.includes('贵州') && (text.includes('3日') || text.includes('三日'))) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          type: 'ai', 
          text: `🌄 贵州3日游精华行程规划（贵阳+安顺）🌄

📅 第1天：贵阳文化古镇与现代风情之旅
🚗 上午：青岩古镇（10:00~12:00 | 游玩2小时）
开启旅程的第一站，穿越600年历史的【青岩古镇】！🏯 漫步青石板路，探秘明清古建筑，别忘了登上城墙俯瞰全景，感受“南方小长城”的雄浑。推荐品尝古镇特色卤猪脚和玫瑰糖，甜蜜开启旅途~
🍜 中午：多彩贵州城（13:30~15:00 | 游玩1.5小时）
驱车前往【多彩贵州城】，这里是贵州文化的微缩版！🎪 民族风情表演、非遗手工艺体验，还有互动式展览，让你瞬间融入贵州的多彩魅力。
🌃 晚上：市集与夜景狂欢
青云市集（18:00~19:00 | 游玩1小时）：贵阳最潮的市集！🍢 琳琅满目的小吃摊、创意手作，推荐试试“手搓冰粉”，清凉解暑~
甲秀楼（19:30~20:00 | 游玩0.5小时）：贵阳地标夜景！🌉 灯光映衬下的古楼与南明河交相辉映，拍照绝美。
太平路（20:30~21:30 | 游玩1小时）：年轻人的夜生活天堂！🍻 酒吧、Live音乐、街头小吃，结束一天的疲惫。
🍲 美食推荐
豆米火锅：麻辣咸香的贵州特色火锅，豆香浓郁，必尝！
手搓冰粉：手工搓制的冰粉搭配红糖水果，甜而不腻~
🏨 酒店推荐
如家精选酒店(贵阳黔灵山公园延安西路地铁站店)：交通便利，舒适中档，步行可达黔灵山公园！

📅 第2天：自然与艺术碰撞之旅
🌿 上午：黔灵山公园（09:00~11:00 | 游玩2小时）
“黔南第一山”名不虚传！🐒 登山看野生猕猴，探访弘福寺，泛舟黔灵湖，感受城市中的天然氧吧~
🎬 中午：越界影城（12:30~15:00 | 游玩2.5小时）
沉浸式电影主题乐园！🎞️ 4D影院、VR互动、电影场景复刻，影迷的天堂~
🎨 下午：红飘带艺术馆（15:30到达）
贵州长征文化的艺术呈现！🖼️ 巨型红色飘带建筑内，通过光影科技重温历史，震撼人心。
🍗 美食推荐
香酥鸭：麻辣酥脆，连骨头都香到嗦手指！
肠旺面：贵阳早餐王牌！肥肠+血旺+劲道面条，香辣过瘾~
🏨 酒店推荐
格美酒店(贵阳火车站鸿通城店)：近地铁站，性价比高，周边美食云集！

📅 第3天：黄果树瀑布自然奇观
💦 全天：黄果树瀑布（10:00~15:00 | 游玩5小时）
“亚洲第一大瀑布”等你征服！🌊 近距离感受水雾扑面，穿越水帘洞（记得带雨衣），还能打卡陡坡塘瀑布（86版《西游记》取景地）。景区内步行较多，建议穿舒适运动鞋~
🚗 返程贵阳（17:30抵达）
结束震撼的自然之旅，返回贵阳散团。
🍛 美食推荐
瀑布周边农家菜：酸汤鱼、野菜炒腊肉，原生态美味！

💰 费用总览（1人）
项目 | 预计费用（元）
车费（油费） | 395
住宿（2晚） | 444
门票 | 170
餐饮（3天） | 300
合计 | 1309

🌟 小贴士：贵州天气多变，建议携带雨具和防晒；自驾注意山区弯道，安全第一！`,
          hasTripPlan: true,
          cards: [
            { type: '景点', title: '青岩古镇', img: 'https://picsum.photos/seed/qingyan/200/200', icon: <MapPin size={12}/> },
            { type: '景点', title: '多彩贵州城', img: 'https://picsum.photos/seed/duocai/200/200', icon: <MapPin size={12}/> },
            { type: '景点', title: '甲秀楼', img: 'https://picsum.photos/seed/jiaxiu/200/200', icon: <MapPin size={12}/> },
            { type: '景点', title: '黔灵山公园', img: 'https://picsum.photos/seed/qianling/200/200', icon: <MapPin size={12}/> },
            { type: '景点', title: '红飘带艺术馆', img: 'https://picsum.photos/seed/hongpiaodai/200/200', icon: <MapPin size={12}/> },
            { type: '景点', title: '黄果树瀑布', img: 'https://picsum.photos/seed/waterfall/200/200', icon: <MapPin size={12}/> },
          ]
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          type: 'ai', 
          text: `为您推荐【西江千户苗寨】！这里是目前中国乃至全世界最大的苗族聚居村寨。晚上可以入住【苗界酒店】，品尝地道的【酸汤鱼】。`,
          hasTripPlan: true,
          cards: [
            { type: '景点', title: '西江千户苗寨', img: 'https://picsum.photos/seed/miao/200/200', icon: <MapPin size={12}/> },
            { type: '酒店', title: '苗界酒店', img: 'https://picsum.photos/seed/hotel/200/200', icon: <Hotel size={12}/> },
          ]
        }]);
      }
    }, 1500);
  };

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    setMessages([
      { id: 1, type: 'ai', text: `你好！我是${agentTitle}。想去哪里玩？我可以帮你做规划哦！` }
    ]);

    if (!data?.query) return;
    // 通过 cleanup 取消上一次定时器，避免重复发送
    const timer = setTimeout(() => {
      sendMessage(data.query);
    }, 500);
    return () => clearTimeout(timer);
  }, [agentTitle, data?.query]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center border-b border-gray-100">
        <button onClick={() => onNavigate('home')} className="p-2">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <div className="flex flex-col items-center">
          <div className="font-bold text-gray-900 flex items-center gap-1">
            <Sparkles size={16} className="text-indigo-500" />
            {agentTitle}
          </div>
          <div className="text-[10px] text-green-500 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> 在线
          </div>
        </div>
        <button className="p-2">
          <MoreHorizontal size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'ai' && (
              <img src="https://picsum.photos/seed/avatar/100/100" className="w-8 h-8 rounded-full mr-2 mt-1" />
            )}
            <div className={`max-w-[80%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.type === 'user' 
                  ? 'bg-indigo-500 text-white rounded-tr-sm' 
                  : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
              }`}>
                {msg.type === 'ai' ? highlightText(msg.text) : msg.text}
              </div>
              
              {/* Attached Cards */}
              {msg.cards && (
                <div className="mt-2 flex gap-2 overflow-x-auto w-full max-w-[280px] scrollbar-hide py-1">
                  {msg.cards.map((card: any, i: number) => (
                    <div key={i} className="flex-shrink-0 w-32 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <img src={card.img} className="w-full h-20 object-cover" />
                      <div className="p-2">
                        <div className="text-xs font-bold truncate">{card.title}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                          {card.icon} {card.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trip Plan Button */}
              {(msg as any).hasTripPlan && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => onNavigate('trip-detail-preview')}
                    className="flex-1 bg-white text-indigo-600 border border-indigo-100 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-50 transition-colors"
                  >
                    <MapPin size={12} /> 查看行程
                  </button>
                  <button 
                    onClick={() => {
                      alert('行程已采纳并加入“我的行程”！');
                      onNavigate('trip-detail-adopted');
                    }}
                    className="flex-1 bg-indigo-600 text-white border border-indigo-600 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                  >
                    <Sparkles size={12} /> 采纳行程
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <img src="https://picsum.photos/seed/avatar/100/100" className="w-8 h-8 rounded-full mr-2 mt-1" />
            <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex gap-1 items-center">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 pl-4">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={`告诉${agentTitle}你的想法...`}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button className="p-2 text-gray-500"><ImageIcon size={20} /></button>
          {input.trim() ? (
            <button onClick={handleSend} className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-1">
              <Send size={14} />
            </button>
          ) : (
            <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white mr-1">
              <Mic size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
