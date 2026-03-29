import type { UserProfile, DailyAdvice, Preference, Lifestyle, RecentActivity } from '@/types';
import { generateAdviceWithLLM } from './llmService';

interface AdviceTemplate {
  title: string;
  description: string;
  estimatedCost: string;
  price: number; // 具体价格（元）
  category: DailyAdvice['category'];
  tags: string[];
  minBudget: 'low' | 'medium' | 'high' | 'luxury';
  maxBudget: 'low' | 'medium' | 'high' | 'luxury';
  preferences: Preference[];
  lifestyles: Lifestyle[];
  activities: RecentActivity[];
  stressLevel?: number;
  sleepQuality?: number;
  peopleAround?: number;
}

const budgetMap = {
  low: 1,
  medium: 2,
  high: 3,
  luxury: 4,
};

// 每日预算范围（元）
const dailyBudgetRanges = {
  low: { min: 17, max: 33 },     // 每月 500-1000
  medium: { min: 33, max: 100 },  // 每月 1000-3000
  high: { min: 100, max: 267 },   // 每月 3000-8000
  luxury: { min: 267, max: 10000 }, // 每月 8000+
};

const adviceTemplates: AdviceTemplate[] = [
  // 美食类
  {
    title: '去一家精致的咖啡馆',
    description: '找一家有氛围的独立咖啡馆，点一杯手冲咖啡和一块蛋糕，享受一个安静的下午。带上一本书或者只是发呆。',
    estimatedCost: '¥30-80',
    price: 55,
    category: 'food',
    tags: ['美食', '独处', '放松'],
    minBudget: 'low',
    maxBudget: 'high',
    preferences: ['美食', '阅读', '独处', '居家'],
    lifestyles: ['忙碌上班族', '自由职业', '学生党'],
    activities: ['加班工作', '准备考试', '长期居家'],
  },
  {
    title: '尝试一家新餐厅',
    description: '选一家你一直想尝试但还没去过的餐厅，可以是异国料理或者创意菜。好好享受一顿饭，不用赶时间。',
    estimatedCost: '¥100-300',
    price: 200,
    category: 'food',
    tags: ['美食', '体验', '犒赏'],
    minBudget: 'medium',
    maxBudget: 'luxury',
    preferences: ['美食', '社交'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '新项目启动', '刚分手'],
  },
  {
    title: '买一份高级水果',
    description: '去精品水果店买一份平时舍不得买的高级水果，比如日本蜜瓜、车厘子或者进口蓝莓。回家慢慢品尝。',
    estimatedCost: '¥50-150',
    price: 100,
    category: 'food',
    tags: ['美食', '健康', '小确幸'],
    minBudget: 'low',
    maxBudget: 'high',
    preferences: ['美食', '居家'],
    lifestyles: ['忙碌上班族', '全职妈妈/爸爸', '退休生活'],
    activities: ['照顾家人', '长期居家'],
  },
  // 体验类
  {
    title: '预约一次SPA按摩',
    description: '工作太累了，去享受一次专业的SPA或者按摩。让紧绷的肌肉放松下来，彻底放空大脑。',
    estimatedCost: '¥200-600',
    price: 400,
    category: 'service',
    tags: [' wellness', '放松', '犒赏'],
    minBudget: 'medium',
    maxBudget: 'luxury',
    preferences: ['美容', '瑜伽', '冥想', '独处'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '频繁出差', '新项目启动'],
    stressLevel: 7,
  },
  {
    title: '看一场电影',
    description: '选一部想看的电影，买最好的座位，配上爆米花和饮料。一个人或者约朋友都可以。',
    estimatedCost: '¥50-120',
    price: 85,
    category: 'experience',
    tags: ['电影', '娱乐', '放松'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['电影', '社交', '独处'],
    lifestyles: ['忙碌上班族', '学生党', '自由职业'],
    activities: ['加班工作', '准备考试', '刚分手'],
  },
  {
    title: '去美术馆或博物馆',
    description: '挑一个展览去看看，沉浸在艺术的世界里。有时候我们需要一些美的滋养。',
    estimatedCost: '¥0-100',
    price: 50,
    category: 'experience',
    tags: ['艺术', '文化', '独处'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['艺术', '学习', '独处'],
    lifestyles: ['学生党', '自由职业', '退休生活'],
    activities: ['长期居家', ' nothing special'],
  },
  // 产品类
  {
    title: '买一束鲜花',
    description: '去花店挑一束自己喜欢的花，放在家里最显眼的位置。鲜花能让心情瞬间变好。',
    estimatedCost: '¥30-100',
    price: 65,
    category: 'product',
    tags: ['生活美学', '小确幸', '居家'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['居家', '艺术'],
    lifestyles: ['忙碌上班族', '全职妈妈/爸爸', '自由职业'],
    activities: ['长期居家', '刚分手', ' nothing special'],
  },
  {
    title: '买一本心仪的书',
    description: '去实体书店逛逛，买一本一直想读的书。纸质书的触感和味道是电子书无法替代的。',
    estimatedCost: '¥40-80',
    price: 60,
    category: 'product',
    tags: ['阅读', '学习', '独处'],
    minBudget: 'low',
    maxBudget: 'low',
    preferences: ['阅读', '学习'],
    lifestyles: ['学生党', '忙碌上班族', '自由职业'],
    activities: ['准备考试', '长期居家'],
  },
  {
    title: '买一支喜欢的香薰蜡烛',
    description: '选一款让你放松的味道，比如薰衣草、雪松或者柑橘。晚上点燃它，让香气充满房间。',
    estimatedCost: '¥80-300',
    price: 190,
    category: 'product',
    tags: ['居家', ' wellness', '小确幸'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['居家', '冥想', '独处'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '长期居家', '刚分手'],
    sleepQuality: 6,
  },
  // 活动类
  {
    title: '去公园散步或野餐',
    description: '带上一块野餐垫和一些零食，去公园待上一下午。看看天空，听听鸟鸣，感受自然。',
    estimatedCost: '¥20-50',
    price: 35,
    category: 'activity',
    tags: ['户外', '自然', '放松'],
    minBudget: 'low',
    maxBudget: 'low',
    preferences: ['户外', '独处', '运动'],
    lifestyles: ['学生党', '自由职业', '退休生活'],
    activities: ['长期居家', ' nothing special'],
  },
  {
    title: '上一节瑜伽课',
    description: '找一家附近的瑜伽馆，体验一节课程。舒展身体，调整呼吸，找回内心的平静。',
    estimatedCost: '¥80-200',
    price: 140,
    category: 'wellness',
    tags: ['运动', ' wellness', '健康'],
    minBudget: 'medium',
    maxBudget: 'medium',
    preferences: ['瑜伽', '运动', '冥想'],
    lifestyles: ['忙碌上班族', '自由职业', '全职妈妈/爸爸'],
    activities: ['加班工作', '长期居家'],
    stressLevel: 6,
  },
  {
    title: '做一次美甲',
    description: '去美甲店做一个喜欢的款式，或者在家DIY。看着漂亮的指甲，心情也会变好。',
    estimatedCost: '¥50-300',
    price: 175,
    category: 'service',
    tags: ['美容', '小确幸', '犒赏'],
    minBudget: 'low',
    maxBudget: 'luxury',
    preferences: ['美容'],
    lifestyles: ['忙碌上班族', '学生党', '自由职业'],
    activities: ['加班工作', '准备考试', '刚分手'],
  },
  {
    title: '买一张演唱会或演出票',
    description: '看看最近有什么演出，买一张票给自己。音乐现场的魅力是无法替代的。',
    estimatedCost: '¥200-800',
    price: 500,
    category: 'experience',
    tags: ['音乐', '娱乐', '体验'],
    minBudget: 'medium',
    maxBudget: 'luxury',
    preferences: ['音乐'],
    lifestyles: ['忙碌上班族', '学生党', '自由职业'],
    activities: ['加班工作', '刚分手', ' nothing special'],
  },
  {
    title: '去一次短途旅行',
    description: '周末去附近的城市或乡村走走，住一晚民宿，换个环境换个心情。',
    estimatedCost: '¥500-1500',
    price: 1000,
    category: 'experience',
    tags: ['旅行', '体验', '放松'],
    minBudget: 'high',
    maxBudget: 'luxury',
    preferences: ['旅行'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '新项目启动', '刚分手'],
  },
  {
    title: '买一件舒适的家服',
    description: '投资一套高品质的家居服或者睡衣。在家的时间也要让自己感到舒适和美好。',
    estimatedCost: '¥150-500',
    price: 325,
    category: 'product',
    tags: ['居家', '舒适', '生活美学'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['居家'],
    lifestyles: ['忙碌上班族', '自由职业', '全职妈妈/爸爸'],
    activities: ['长期居家', '照顾家人'],
  },
  {
    title: '去健身房或游泳馆',
    description: '运动是最好的减压方式。去流一身汗，让身体分泌多巴胺，心情自然会变好。',
    estimatedCost: '¥50-150',
    price: 100,
    category: 'wellness',
    tags: ['运动', '健康', '减压'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['运动'],
    lifestyles: ['忙碌上班族', '学生党', '自由职业'],
    activities: ['加班工作', '准备考试'],
    stressLevel: 6,
  },
  {
    title: '做一次全面的皮肤护理',
    description: '去美容院做一次深层清洁或者补水护理。让皮肤也享受一次专业的呵护。',
    estimatedCost: '¥200-800',
    price: 500,
    category: 'service',
    tags: ['美容', ' wellness', '犒赏'],
    minBudget: 'medium',
    maxBudget: 'luxury',
    preferences: ['美容'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '频繁出差'],
  },
  {
    title: '买一款高品质的护肤品',
    description: '投资一款好的精华或者面霜。护肤是长期的自我投资，值得的。',
    estimatedCost: '¥300-1000',
    price: 650,
    category: 'product',
    tags: ['美容', '健康', '投资自己'],
    minBudget: 'high',
    maxBudget: 'luxury',
    preferences: ['美容'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '频繁出差'],
  },
  {
    title: '去一家精酿酒吧',
    description: '找一家有特色的精酿酒吧，尝试几款不同的啤酒。可以一个人去，也可以约朋友。',
    estimatedCost: '¥80-200',
    price: 140,
    category: 'food',
    tags: ['美食', '社交', '放松'],
    minBudget: 'medium',
    maxBudget: 'medium',
    preferences: ['美食', '社交'],
    lifestyles: ['忙碌上班族', '自由职业', '学生党'],
    activities: ['加班工作', '刚分手', ' nothing special'],
    peopleAround: 1,
  },
  {
    title: '买一张线上课程',
    description: '学一项新技能，比如摄影、绘画、编程或者烹饪。投资自己永远是最值得的。',
    estimatedCost: '¥100-500',
    price: 300,
    category: 'experience',
    tags: ['学习', '成长', '投资自己'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['学习', '艺术'],
    lifestyles: ['学生党', '自由职业', '间隔年'],
    activities: ['长期居家', ' nothing special'],
  },
  {
    title: '去一次温泉或汤泉',
    description: '找个周末去泡温泉，让温热的水流带走所有的疲惫。',
    estimatedCost: '¥150-400',
    price: 275,
    category: 'wellness',
    tags: [' wellness', '放松', '犒赏'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['冥想', '独处'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '频繁出差', '新项目启动'],
    stressLevel: 7,
  },
  {
    title: '买一份精致的下午茶',
    description: '去酒店或者甜品店，享受一份正宗的英式下午茶。让自己像贵族一样被对待。',
    estimatedCost: '¥150-400',
    price: 275,
    category: 'food',
    tags: ['美食', '体验', '犒赏'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['美食'],
    lifestyles: ['忙碌上班族', '自由职业', '全职妈妈/爸爸'],
    activities: ['加班工作', '照顾家人'],
  },
  {
    title: '做一次心理咨询',
    description: '如果最近压力很大，不妨找专业的心理咨询师聊聊。照顾心理健康也是爱自己的重要部分。',
    estimatedCost: '¥300-800',
    price: 550,
    category: 'wellness',
    tags: [' wellness', '心理健康', '投资自己'],
    minBudget: 'high',
    maxBudget: 'luxury',
    preferences: ['冥想', '独处'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '刚分手', '新项目启动'],
    stressLevel: 8,
  },
  {
    title: '买一盆绿植',
    description: '去花市挑一盆喜欢的绿植，比如龟背竹、琴叶榕或者多肉。照顾植物也是一种疗愈。',
    estimatedCost: '¥30-150',
    price: 90,
    category: 'product',
    tags: ['居家', '自然', '生活美学'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['居家', '户外'],
    lifestyles: ['忙碌上班族', '自由职业', '学生党'],
    activities: ['长期居家', ' nothing special'],
  },
  {
    title: '去一次陶艺或手作体验',
    description: '动手做一件东西，比如陶艺、木工或者皮具。专注于创作的过程本身就是一种冥想。',
    estimatedCost: '¥150-400',
    price: 275,
    category: 'activity',
    tags: ['艺术', '体验', '创作'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['艺术', '学习'],
    lifestyles: ['学生党', '自由职业', '间隔年'],
    activities: ['长期居家', ' nothing special'],
  },
  {
    title: '买一张优质的床垫或枕头',
    description: '睡眠质量太重要了。投资一个好的床垫或者枕头，让每个夜晚都能好好休息。',
    estimatedCost: '¥300-1500',
    price: 900,
    category: 'product',
    tags: ['居家', '健康', '投资自己'],
    minBudget: 'high',
    maxBudget: 'luxury',
    preferences: ['居家'],
    lifestyles: ['忙碌上班族', '自由职业', '全职妈妈/爸爸'],
    activities: ['加班工作', '长期居家'],
    sleepQuality: 5,
  },
  {
    title: '去一家猫咖或狗咖',
    description: '和可爱的小动物待在一起，被它们治愈。毛孩子们有神奇的疗愈力量。',
    estimatedCost: '¥50-120',
    price: 85,
    category: 'experience',
    tags: ['放松', '治愈', '小确幸'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['独处'],
    lifestyles: ['学生党', '忙碌上班族', '自由职业'],
    activities: ['刚分手', '长期居家', ' nothing special'],
    peopleAround: 1,
  },
  {
    title: '买一份高品质的巧克力',
    description: '买一盒高级的手工巧克力，慢慢品尝每一颗的不同风味。让自己享受这份甜蜜。',
    estimatedCost: '¥80-200',
    price: 140,
    category: 'food',
    tags: ['美食', '小确幸', '犒赏'],
    minBudget: 'medium',
    maxBudget: 'medium',
    preferences: ['美食'],
    lifestyles: ['忙碌上班族', '学生党', '自由职业'],
    activities: ['加班工作', '准备考试', '刚分手'],
  },
  {
    title: '去一次高空观景或摩天轮',
    description: '去城市的最高点看看风景，或者坐一次摩天轮。从高处看世界，心情也会开阔起来。',
    estimatedCost: '¥50-200',
    price: 125,
    category: 'experience',
    tags: ['体验', '浪漫', '放松'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['旅行', '独处'],
    lifestyles: ['学生党', '忙碌上班族', '自由职业'],
    activities: ['刚分手', ' nothing special'],
  },
  {
    title: '买一件设计师单品',
    description: '投资一件设计独特的单品，比如一个包包、一条围巾或者一件首饰。让自己与众不同。',
    estimatedCost: '¥500-2000',
    price: 1250,
    category: 'product',
    tags: ['时尚', '投资自己', '犒赏'],
    minBudget: 'high',
    maxBudget: 'luxury',
    preferences: ['购物'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '新项目启动'],
  },
  {
    title: '去一次声音疗愈或冥想课',
    description: '体验颂钵或者声音疗愈，让 vibrations 洗涤你的心灵。深度的放松体验。',
    estimatedCost: '¥150-400',
    price: 275,
    category: 'wellness',
    tags: ['冥想', ' wellness', '放松'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['冥想', '瑜伽'],
    lifestyles: ['忙碌上班族', '自由职业', '创业中'],
    activities: ['加班工作', '新项目启动'],
    stressLevel: 7,
  },
  { title: '买一份订阅服务',
    description: '订阅一个你喜欢的服务，比如音乐、视频、杂志或者鲜花配送。让美好定期来到生活中。',
    estimatedCost: '¥30-100/月',
    price: 65,
    category: 'product',
    tags: ['生活美学', '小确幸', '长期快乐'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['音乐', '电影', '阅读'],
    lifestyles: ['忙碌上班族', '学生党', '自由职业'],
    activities: ['长期居家', ' nothing special'],
  },
  // 游戏类
  { title: '购买一款心仪的游戏',
    description: '买一款你一直想玩的游戏，给自己一段沉浸式的游戏时光。可以是单机游戏或者在线游戏。',
    estimatedCost: '¥50-300',
    price: 175,
    category: 'product',
    tags: ['游戏', '娱乐', '放松'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['游戏'],
    lifestyles: ['学生党', '忙碌上班族', '自由职业'],
    activities: ['长期居家', '加班工作', '准备考试'],
  },
  { title: '去游戏主题咖啡馆',
    description: '找一家有游戏主机或PC的主题咖啡馆，和朋友一起玩游戏，享受社交游戏时光。',
    estimatedCost: '¥50-150',
    price: 100,
    category: 'experience',
    tags: ['游戏', '社交', '放松'],
    minBudget: 'low',
    maxBudget: 'medium',
    preferences: ['游戏', '社交'],
    lifestyles: ['学生党', '自由职业', '忙碌上班族'],
    activities: ['长期居家', '刚分手', ' nothing special'],
  },
  { title: '购买游戏周边',
    description: '买一件你喜欢的游戏角色手办或者周边产品，为你的游戏空间增添一份收藏。',
    estimatedCost: '¥100-500',
    price: 300,
    category: 'product',
    tags: ['游戏', '收藏', '生活美学'],
    minBudget: 'medium',
    maxBudget: 'high',
    preferences: ['游戏'],
    lifestyles: ['学生党', '自由职业', '忙碌上班族'],
    activities: ['长期居家', ' nothing special'],
  },
];

export async function generateAdvice(user: UserProfile): Promise<DailyAdvice> {
  try {
    // 尝试使用LLM生成个性化建议
    const llmAdvice = await generateAdviceWithLLM(user);
    
    return {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: llmAdvice.title,
      description: llmAdvice.description,
      estimatedCost: llmAdvice.estimatedCost,
      category: llmAdvice.category,
      tags: llmAdvice.tags,
      completed: false,
      reason: llmAdvice.reason,
    };
  } catch (error) {
    console.warn('LLM advice generation failed, falling back to template-based approach:', error);
    
    // 回退到基于模板的方法
    const userBudgetLevel = budgetMap[user.budgetLevel];
    const dailyBudgetRange = dailyBudgetRanges[user.budgetLevel];
    
    // 过滤符合预算的建议
    let eligibleAdvices = adviceTemplates.filter(advice => {
      const minBudget = budgetMap[advice.minBudget];
      const maxBudget = budgetMap[advice.maxBudget];
      const withinBudgetLevel = userBudgetLevel >= minBudget && userBudgetLevel <= maxBudget;
      const withinDailyBudget = advice.price >= dailyBudgetRange.min && advice.price <= dailyBudgetRange.max;
      return withinBudgetLevel && withinDailyBudget;
    });

    // 根据偏好加权
    eligibleAdvices = eligibleAdvices.filter(advice => 
      advice.preferences.some(pref => user.preferences.includes(pref))
    );

    // 如果没有匹配的建议，放宽条件
    if (eligibleAdvices.length === 0) {
      eligibleAdvices = adviceTemplates.filter(advice => {
        const minBudget = budgetMap[advice.minBudget];
        const withinBudgetLevel = userBudgetLevel >= minBudget;
        // 放宽每日预算限制，但仍确保价格合理
        const withinReasonableBudget = advice.price <= dailyBudgetRange.max * 2;
        return withinBudgetLevel && withinReasonableBudget;
      });
    }

    // 根据生活方式筛选
    const lifestyleMatches = eligibleAdvices.filter(advice => 
      advice.lifestyles.includes(user.lifestyle as Lifestyle)
    );
    if (lifestyleMatches.length > 0) {
      eligibleAdvices = lifestyleMatches;
    }

    // 根据最近活动筛选
    const activityMatches = eligibleAdvices.filter(advice => 
      advice.activities.includes(user.recentActivities as RecentActivity)
    );
    if (activityMatches.length > 0) {
      eligibleAdvices = activityMatches;
    }

    // 根据压力水平筛选
    if (user.stressLevel >= 7) {
      const stressRelief = eligibleAdvices.filter(advice => 
        advice.stressLevel !== undefined && user.stressLevel >= advice.stressLevel
      );
      if (stressRelief.length > 0) {
        eligibleAdvices = stressRelief;
      }
    }

    // 根据睡眠质量筛选
    if (user.sleepQuality <= 5) {
      const sleepImprovement = eligibleAdvices.filter(advice => 
        advice.sleepQuality !== undefined && user.sleepQuality <= advice.sleepQuality
      );
      if (sleepImprovement.length > 0) {
        eligibleAdvices = sleepImprovement;
      }
    }

    // 根据身边人数筛选
    if (user.peopleAround <= 1) {
      const soloFriendly = eligibleAdvices.filter(advice => 
        advice.peopleAround !== undefined && advice.peopleAround <= 1
      );
      if (soloFriendly.length > 0) {
        eligibleAdvices = soloFriendly;
      }
    }

    // 随机选择一个建议
    const selectedAdvice = eligibleAdvices[Math.floor(Math.random() * eligibleAdvices.length)] 
      || adviceTemplates[Math.floor(Math.random() * adviceTemplates.length)];

    return {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: selectedAdvice.title,
      description: selectedAdvice.description,
      estimatedCost: selectedAdvice.estimatedCost,
      category: selectedAdvice.category,
      tags: selectedAdvice.tags,
      completed: false,
    };
  }
}

export function shouldGenerateNewAdvice(lastGeneratedDate: string | null): boolean {
  if (!lastGeneratedDate) return true;
  
  const lastDate = new Date(lastGeneratedDate);
  const now = new Date();
  
  // 检查是否是同一天
  return lastDate.getDate() !== now.getDate() || 
         lastDate.getMonth() !== now.getMonth() || 
         lastDate.getFullYear() !== now.getFullYear();
}

export function getCategoryColor(category: DailyAdvice['category']): string {
  const colors = {
    food: 'bg-orange-100 text-orange-700 border-orange-200',
    experience: 'bg-purple-100 text-purple-700 border-purple-200',
    product: 'bg-blue-100 text-blue-700 border-blue-200',
    service: 'bg-pink-100 text-pink-700 border-pink-200',
    activity: 'bg-green-100 text-green-700 border-green-200',
    wellness: 'bg-teal-100 text-teal-700 border-teal-200',
  };
  return colors[category];
}

export function getCategoryIcon(category: DailyAdvice['category']): string {
  const icons = {
    food: '🍽️',
    experience: '✨',
    product: '🎁',
    service: '💆',
    activity: '🎯',
    wellness: '🧘',
  };
  return icons[category];
}
