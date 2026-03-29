import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { UserSetupForm } from '@/components/UserSetupForm';
import { DailyAdviceCard } from '@/components/DailyAdviceCard';
import { AdviceHistory } from '@/components/AdviceHistory';
import { HeroSection } from '@/sections/HeroSection';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateAdvice, shouldGenerateNewAdvice } from '@/lib/adviceGenerator';
import type { UserProfile } from '@/types';
import { Heart, Settings, History, Sparkles, RotateCcw, User, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { state, isLoaded, setUser, addAdvice, completeAdvice, updateAdvice, resetAll } = useLocalStorage();
  const [showSetup, setShowSetup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [, setShowScrollHint] = useState(true);

  // Generate new advice if needed
  useEffect(() => {
    const generateNewAdvice = async () => {
      if (isLoaded && state.user && shouldGenerateNewAdvice(state.lastGeneratedDate)) {
        try {
          const newAdvice = await generateAdvice(state.user);
          addAdvice(newAdvice);
        } catch (error) {
          console.error('Error generating new advice:', error);
        }
      }
    };
    
    generateNewAdvice();
  }, [isLoaded, state.user, addAdvice]);

  // Hide scroll hint on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserSubmit = async (user: UserProfile) => {
    setUser(user);
    setShowSetup(false);
  };

  const handleRefreshAdvice = useCallback(async () => {
    if (!state.user || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const newAdvice = await generateAdvice(state.user!);
      updateAdvice(newAdvice);
    } catch (error) {
      console.error('Error refreshing advice:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [state.user, isGenerating, updateAdvice]);

  const handleCompleteAdvice = useCallback(() => {
    if (state.currentAdvice) {
      completeAdvice(state.currentAdvice.id);
    }
  }, [state.currentAdvice, completeAdvice]);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    resetAll();
    setShowResetConfirm(false);
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-amber-500 animate-pulse mx-auto mb-4" />
          <p className="text-stone-600">加载中...</p>
        </div>
      </div>
    );
  }

  // First time user - show setup
  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center mb-8">
          <Heart className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Love Yourself</h1>
          <p className="text-stone-600">每天一个爱自己的小建议</p>
        </div>
        <UserSetupForm onSubmit={handleUserSubmit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-20 relative z-20">
        {/* Daily Advice Card */}
        <div className="max-w-2xl mx-auto mb-12">
          {state.currentAdvice && (
            <DailyAdviceCard
              advice={state.currentAdvice}
              onComplete={handleCompleteAdvice}
              onRefresh={handleRefreshAdvice}
              isGenerating={isGenerating}
            />
          )}
        </div>
        
        {/* Stats & Actions */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-stone-100">
              <div className="text-3xl font-bold text-amber-500">
                {state.dailyAdvices.filter(a => a.completed).length}
              </div>
              <div className="text-sm text-stone-500">已完成</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-stone-100">
              <div className="text-3xl font-bold text-stone-700">
                {state.dailyAdvices.length}
              </div>
              <div className="text-sm text-stone-500">总建议</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-stone-100">
              <div className="text-3xl font-bold text-green-500">
                {Math.round((state.dailyAdvices.filter(a => a.completed).length / Math.max(state.dailyAdvices.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-stone-500">完成率</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowSetup(true)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              修改资料
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              查看历史
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4" />
              重置数据
            </Button>
          </div>
        </div>
        
        {/* Quote Section */}
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-stone-700 mb-4 italic">
            "爱自己，是终身浪漫的开始。"
          </blockquote>
          <cite className="text-stone-500">— 奥斯卡·王尔德</cite>
        </div>
        
        {/* User Profile Summary */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800">我的资料</h3>
                <p className="text-sm text-stone-500">{state.user.city} · {state.user.age}岁 · {state.user.lifestyle}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.user.preferences.slice(0, 6).map(pref => (
                <span 
                  key={pref} 
                  className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm"
                >
                  {pref}
                </span>
              ))}
              {state.user.preferences.length > 6 && (
                <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-sm">
                  +{state.user.preferences.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm">Love Yourself — 每天花一点钱爱自己</p>
          <p className="text-xs text-stone-600 mt-1">记住，你值得被温柔以待</p>
        </div>
      </footer>
      
      {/* Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">修改个人资料</DialogTitle>
          </DialogHeader>
          <UserSetupForm onSubmit={handleUserSubmit} initialData={state.user} />
        </DialogContent>
      </Dialog>
      
      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              历史记录
            </DialogTitle>
          </DialogHeader>
          <AdviceHistory advices={state.dailyAdvices} />
        </DialogContent>
      </Dialog>
      
      {/* Reset Confirm Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              确认重置
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-stone-600 mb-2">确定要重置所有数据吗？</p>
            <p className="text-stone-500 text-sm">这将清除你的所有记录，包括：</p>
            <ul className="text-stone-500 text-sm list-disc list-inside mt-2 space-y-1">
              <li>个人资料</li>
              <li>所有历史建议</li>
              <li>完成记录</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleResetConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              确认重置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
