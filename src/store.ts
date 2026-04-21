import { Trip, TripDay, TripNode } from './types';

export const INITIAL_DAYS: TripDay[] = [
  {
    id: 'day1',
    title: 'Day 1',
    date: '5月1日',
    nodes: [
      {
        id: 'n1',
        type: '交通',
        time: '09:00',
        title: '抵达贵阳龙洞堡机场',
        status: '已完成',
        hasAgent: true,
        aiTips: '欢迎来到多彩贵州！建议出站后直接乘坐地铁或网约车前往市区。',
        details: { start: '出发地', end: '贵阳龙洞堡T2', duration: '2h' }
      },
      {
        id: 'n2',
        type: '景点',
        time: '10:30',
        title: '青岩古镇',
        status: '进行中',
        hasAgent: true,
        aiTips: '推荐品尝古镇特色卤猪脚和玫瑰糖，别忘了登上城墙俯瞰全景！',
        imageUrl: `${import.meta.env.BASE_URL}图片/小七孔.jpg`,
        details: { rating: '4.7', price: '￥10门票', level: 'AAAAA', location: '贵阳市花溪区青岩镇' }
      },
      {
        id: 'n3',
        type: '美食',
        time: '12:30',
        title: '青岩特色小吃',
        status: '未开始',
        hasAgent: false,
        imageUrl: `${import.meta.env.BASE_URL}图片/柏曼温泉酒店.jpg`,
        details: { rating: '4.8', price: '￥45/人', tags: ['卤猪脚', '糕粑稀饭', '豆腐圆子'], location: '青岩古镇内' }
      }
    ]
  },
  {
    id: 'day2',
    title: 'Day 2',
    date: '5月2日',
    nodes: [
      {
        id: 'n8',
        type: '美食',
        time: '08:30',
        title: '肠旺面',
        status: '未开始',
        hasAgent: false,
        details: { rating: '4.9', price: '￥15/人', tags: ['贵阳早餐王牌', '肥肠血旺'] }
      }
    ]
  }
];

export let TRIPS: Trip[] = [
  { id: '1', title: '黔东南苗寨深度体验3日游', status: '进行中', startTime: '2026-03-10', days: 3, imageUrl: `${import.meta.env.BASE_URL}图片/旅行记录2.jpg`, tripDays: INITIAL_DAYS },
  { id: '2', title: '黄果树瀑布全景游', status: '计划中', startTime: '2026-04-15', days: 2, imageUrl: `${import.meta.env.BASE_URL}图片/黄果树瀑布.jpg` },
  { id: '3', title: '梵净山徒步', status: '已完成', startTime: '2026-02-01', days: 1, imageUrl: `${import.meta.env.BASE_URL}图片/miao.png` },
];

export const getTrips = () => TRIPS;
export const setTripsStore = (newTrips: Trip[]) => { TRIPS = newTrips; };
export const addTrip = (trip: Trip) => { TRIPS = [trip, ...TRIPS]; };
