export type Page = 'home' | 'trip-list' | 'trip-detail' | 'trip-detail-preview' | 'trip-detail-adopted' | 'smart-import' | 'mall' | 'profile' | 'chat' | 'announcement' | 'translation' | 'settings' | 'login' | 'digital-avatar' | 'digital-card' | 'card-favorites';

export type TripStatus = '计划中' | '进行中' | '已完成';
export type NodeType = '交通' | '景点' | '美食' | '酒店' | '自定义活动' | '数字分身';
export type NodeStatus = '未开始' | '进行中' | '已完成';

export interface TripNode {
  id: string;
  type: NodeType;
  time: string;
  title: string;
  status: NodeStatus;
  isManual?: boolean;
  hasAgent: boolean;
  aiTips?: string;
  imageUrl?: string;
  details: any;
}

export interface TripDay {
  id: string;
  title: string;
  date: string;
  nodes: TripNode[];
}

export interface Trip {
  id: string;
  title: string;
  status: TripStatus;
  startTime: string;
  days: number;
  imageUrl: string;
  tripDays?: TripDay[];
}
