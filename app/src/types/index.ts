export interface UserProfile {
  id: string;
  location: string;
  city: string;
  district?: string;
  organization?: string;
  age: number;
  budgetLevel: 'low' | 'medium' | 'high' | 'luxury';
  monthlyBudget?: number;
  preferences: string[];
  lifestyle: string;
  recentActivities: string;
  peopleAround: number;
  workType: 'office' | 'remote' | 'hybrid' | 'student' | 'freelance' | 'unemployed';
  stressLevel: number;
  sleepQuality: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyAdvice {
  id: string;
  date: string;
  title: string;
  description: string;
  estimatedCost: string;
  category: 'food' | 'experience' | 'product' | 'service' | 'activity' | 'wellness';
  tags: string[];
  completed: boolean;
  completedAt?: string;
  reason?: string;
}

export interface AppState {
  user: UserProfile | null;
  dailyAdvices: DailyAdvice[];
  currentAdvice: DailyAdvice | null;
  lastGeneratedDate: string | null;
}

export type Preference = 
  | '美食'
  | '旅行'
  | '购物'
  | '阅读'
  | '音乐'
  | '电影'
  | '运动'
  | '瑜伽'
  | '冥想'
  | '美容'
  | '社交'
  | '独处'
  | '户外'
  | '居家'
  | '艺术'
  | '学习'
  | '游戏';

export type Lifestyle = 
  | '忙碌上班族'
  | '自由职业'
  | '学生党'
  | '全职妈妈/爸爸'
  | '退休生活'
  | '创业中'
  | '间隔年';

export type RecentActivity = 
  | '加班工作'
  | '准备考试'
  | '照顾家人'
  | '搬家装修'
  | '刚刚离职'
  | '新项目启动'
  | '长期居家'
  | '频繁出差'
  | '健身减肥'
  | '恋爱中'
  | '刚分手'
  | ' nothing special';
