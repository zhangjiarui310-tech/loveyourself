import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { UserProfile, Preference, Lifestyle, RecentActivity } from '@/types';
import { Heart, MapPin, Users, Briefcase, Sparkles, Moon, Zap } from 'lucide-react';

interface UserSetupFormProps {
  onSubmit: (user: UserProfile) => void;
  initialData?: UserProfile | null;
}

const PREFERENCES: Preference[] = [
  '美食', '旅行', '购物', '阅读', '音乐', '电影', 
  '运动', '瑜伽', '冥想', '美容', '社交', '独处',
  '户外', '居家', '艺术', '学习', '游戏'
];

const LIFESTYLES: { value: Lifestyle; label: string; icon: string }[] = [
  { value: '忙碌上班族', label: '忙碌上班族', icon: '💼' },
  { value: '自由职业', label: '自由职业', icon: '💻' },
  { value: '学生党', label: '学生党', icon: '📚' },
  { value: '全职妈妈/爸爸', label: '全职妈妈/爸爸', icon: '👶' },
  { value: '退休生活', label: '退休生活', icon: '🌅' },
  { value: '创业中', label: '创业中', icon: '🚀' },
  { value: '间隔年', label: '间隔年', icon: '🌏' },
];

const ACTIVITIES: { value: RecentActivity; label: string }[] = [
  { value: '加班工作', label: '加班工作' },
  { value: '准备考试', label: '准备考试' },
  { value: '照顾家人', label: '照顾家人' },
  { value: '搬家装修', label: '搬家装修' },
  { value: '刚刚离职', label: '刚刚离职' },
  { value: '新项目启动', label: '新项目启动' },
  { value: '长期居家', label: '长期居家' },
  { value: '频繁出差', label: '频繁出差' },
  { value: '健身减肥', label: '健身减肥' },
  { value: '恋爱中', label: '恋爱中' },
  { value: '刚分手', label: '刚分手' },
  { value: ' nothing special', label: '没什么特别的' },
];

const BUDGET_LEVELS = [
  { value: 'low', label: '精打细算', description: '每月可支配 ¥500-1000', emoji: '🌱' },
  { value: 'medium', label: '适度享受', description: '每月可支配 ¥1000-3000', emoji: '🌿' },
  { value: 'high', label: '品质生活', description: '每月可支配 ¥3000-8000', emoji: '🌳' },
  { value: 'luxury', label: '奢华体验', description: '每月可支配 ¥8000+', emoji: '💎' },
];

export function UserSetupForm({ onSubmit, initialData }: UserSetupFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    location: initialData?.location || '',
    city: initialData?.city || '',
    organization: initialData?.organization || '',
    age: initialData?.age || 25,
    budgetLevel: initialData?.budgetLevel || 'medium',
    preferences: initialData?.preferences || [],
    lifestyle: initialData?.lifestyle || '忙碌上班族',
    recentActivities: initialData?.recentActivities || ' nothing special',
    peopleAround: initialData?.peopleAround || 1,
    workType: initialData?.workType || 'office',
    stressLevel: initialData?.stressLevel || 5,
    sleepQuality: initialData?.sleepQuality || 6,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('你的浏览器不支持地理位置功能');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      // 获取位置坐标
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // 使用高德地图 API 进行反向地理编码
      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/regeo?key=0c914a3b67c9cfb22c3c4a7a42730a3d&location=${longitude},${latitude}&extensions=base`
      );
      
      const data = await response.json();
      
      if (data.status === '1') {
        const city = data.regeocode.addressComponent.city || 
                    data.regeocode.addressComponent.province || 
                    '未知城市';
        const district = data.regeocode.addressComponent.district || '';
        const street = data.regeocode.addressComponent.street || '';
        const address = data.regeocode.addressComponent.streetNumber || '';
        
        // 构建详细地址
        let detailedAddress = '';
        if (city) detailedAddress += city;
        if (district) detailedAddress += district;
        if (street) detailedAddress += street;
        if (address) detailedAddress += address;
        
        setFormData(prev => ({
          ...prev,
          city: detailedAddress || city.replace('市', ''),
          location: `${latitude},${longitude}`
        }));
      } else {
        setLocationError('无法获取位置信息');
      }
    } catch (error) {
      console.error('获取位置失败:', error);
      setLocationError('获取位置失败，请检查权限设置');
    } finally {
      setIsLocating(false);
    }
  };

  const handlePreferenceToggle = (pref: Preference) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences?.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...(prev.preferences || []), pref],
    }));
  };

  const handleSubmit = () => {
    const user: UserProfile = {
      id: initialData?.id || Date.now().toString(),
      location: formData.location || '',
      city: formData.city || '',
      organization: formData.organization || '',
      age: formData.age || 25,
      budgetLevel: formData.budgetLevel || 'medium',
      preferences: formData.preferences || [],
      lifestyle: formData.lifestyle || '忙碌上班族',
      recentActivities: formData.recentActivities || ' nothing special',
      peopleAround: formData.peopleAround || 1,
      workType: formData.workType || 'office',
      stressLevel: formData.stressLevel || 5,
      sleepQuality: formData.sleepQuality || 6,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(user);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.city && formData.age;
      case 2:
        return formData.preferences && formData.preferences.length >= 3;
      case 3:
        return formData.lifestyle && formData.recentActivities;
      case 4:
        return formData.budgetLevel;
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          你在哪里？
        </Label>
        <Input
          placeholder="例如：上海市浦东新区XX街道XX小区，越详细越好..."
          value={formData.city}
          onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
          className="h-12 text-base"
        />
        <Button
          variant="outline"
          onClick={handleGetLocation}
          disabled={isLocating}
          className="w-full mt-2 h-10 flex items-center justify-center gap-2"
        >
          {isLocating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              获取位置中...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              自动获取位置
            </>
          )}
        </Button>
        {locationError && (
          <p className="text-sm text-red-500 mt-1">{locationError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          单位/学校？（选填）
        </Label>
        <Input
          placeholder="例如：XX公司、XX大学..."
          value={formData.organization}
          onChange={e => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          你的年龄
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[formData.age || 25]}
            onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
            min={18}
            max={70}
            step={1}
            className="flex-1"
          />
          <span className="text-2xl font-semibold text-amber-600 w-16 text-center">
            {formData.age}岁
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          身边常有几个人？
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[formData.peopleAround !== undefined ? formData.peopleAround : 1]}
            onValueChange={([value]) => setFormData(prev => ({ ...prev, peopleAround: value }))}
            min={0}
            max={10}
            step={1}
            className="flex-1"
          />
          <span className="text-2xl font-semibold text-amber-600 w-16 text-center">
            {formData.peopleAround !== undefined ? formData.peopleAround : 1}人
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {formData.peopleAround === 0 && '独自一人'}
          {formData.peopleAround === 1 && '有一两个亲密的人'}
          {formData.peopleAround >= 2 && formData.peopleAround <= 4 && '有小圈子'}
          {formData.peopleAround >= 5 && '身边很热闹'}
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Heart className="w-4 h-4" />
          你的兴趣爱好（至少选3个）
        </Label>
        <div className="flex flex-wrap gap-2">
          {PREFERENCES.map(pref => (
            <button
              key={pref}
              onClick={() => handlePreferenceToggle(pref)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                formData.preferences?.includes(pref)
                  ? 'bg-amber-500 text-white shadow-lg scale-105'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          已选择 {formData.preferences?.length || 0} 个
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          你的生活状态
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {LIFESTYLES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setFormData(prev => ({ ...prev, lifestyle: value }))}
              className={`p-4 rounded-xl text-left transition-all duration-200 ${
                formData.lifestyle === value
                  ? 'bg-amber-500 text-white shadow-lg scale-105'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span className="text-2xl mb-1 block">{icon}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">最近主要在忙什么？</Label>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFormData(prev => ({ ...prev, recentActivities: value }))}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                formData.recentActivities === value
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Zap className="w-4 h-4" />
          最近压力水平
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[formData.stressLevel || 5]}
            onValueChange={([value]) => setFormData(prev => ({ ...prev, stressLevel: value }))}
            min={1}
            max={10}
            step={1}
            className="flex-1"
          />
          <span className="text-2xl font-semibold text-amber-600 w-12 text-center">
            {formData.stressLevel}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>很轻松</span>
          <span>压力山大</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Moon className="w-4 h-4" />
          睡眠质量
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[formData.sleepQuality || 6]}
            onValueChange={([value]) => setFormData(prev => ({ ...prev, sleepQuality: value }))}
            min={1}
            max={10}
            step={1}
            className="flex-1"
          />
          <span className="text-2xl font-semibold text-amber-600 w-12 text-center">
            {formData.sleepQuality}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>失眠严重</span>
          <span>睡得很好</span>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium">你的消费预算水平</Label>
        <div className="space-y-3">
          {BUDGET_LEVELS.map(({ value, label, description, emoji }) => (
            <button
              key={value}
              onClick={() => setFormData(prev => ({ ...prev, budgetLevel: value as UserProfile['budgetLevel'] }))}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                formData.budgetLevel === value
                  ? 'bg-amber-500 text-white shadow-lg scale-[1.02]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <div className="font-semibold text-lg">{label}</div>
                  <div className={`text-sm ${formData.budgetLevel === value ? 'text-amber-100' : 'text-muted-foreground'}`}>
                    {description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: '基本信息' },
    { number: 2, title: '兴趣爱好' },
    { number: 3, title: '生活状态' },
    { number: 4, title: '预算水平' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= s.number
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {s.number}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-1 transition-all duration-300 ${
                    step > s.number ? 'bg-amber-500' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          步骤 {step} / 4: {steps[step - 1].title}
        </p>
      </div>

      <Card className="border-stone-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === 1 && '让我们了解你'}
            {step === 2 && '你的兴趣是什么？'}
            {step === 3 && '你的生活状态'}
            {step === 4 && '设置预算水平'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && '这样我们才能给你最合适的建议'}
            {step === 2 && '选择至少3个你感兴趣的领域'}
            {step === 3 && '帮助我们理解你的日常'}
            {step === 4 && '我们会根据预算推荐合适的消费'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-12"
              >
                上一步
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white"
              >
                下一步
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white"
              >
                完成设置
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
