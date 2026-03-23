export type Page = 'home' | 'trip-list' | 'trip-detail' | 'trip-detail-preview' | 'trip-detail-adopted' | 'mall' | 'profile' | 'chat' | 'announcement' | 'translation' | 'settings' | 'login' | 'digital-avatar' | 'digital-card' | 'card-favorites';

export type TripStatus = '计划中' | '进行中' | '已完成';

export interface Trip {
  id: string;
  title: string;
  status: TripStatus;
  startTime: string;
  days: number;
  imageUrl: string;
}
