import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DailyAdvice } from '@/types';
import { getCategoryColor, getCategoryIcon } from '@/lib/adviceGenerator';
import { Check, RefreshCw, Sparkles, Clock, Tag } from 'lucide-react';
import gsap from 'gsap';

interface DailyAdviceCardProps {
  advice: DailyAdvice;
  onComplete: () => void;
  onRefresh: () => void;
  isGenerating?: boolean;
}

export function DailyAdviceCard({ advice, onComplete, onRefresh, isGenerating }: DailyAdviceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isReasonCollapsed, setIsReasonCollapsed] = useState(true);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [advice.id]);

  const handleComplete = () => {
    setShowConfetti(true);
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });
    }

    setTimeout(() => {
      onComplete();
      setShowConfetti(false);
    }, 800);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return '今天';
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={cardRef} className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#f1bf45', '#e99a75', '#f1d546', '#90EE90', '#87CEEB'][i % 5],
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                top: '50%',
                animation: `confetti-fall 1s ease-out forwards`,
                animationDelay: `${Math.random() * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card 
        ref={contentRef}
        className={`overflow-hidden border-2 transition-all duration-500 ${
          advice.completed 
            ? 'border-green-400 bg-green-50/50' 
            : 'border-amber-200 bg-white'
        }`}
      >
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getCategoryIcon(advice.category)}</span>
              <div>
                <Badge className={`${getCategoryColor(advice.category)} mb-1`}>
                  {advice.category === 'food' && '美食'}
                  {advice.category === 'experience' && '体验'}
                  {advice.category === 'product' && '好物'}
                  {advice.category === 'service' && '服务'}
                  {advice.category === 'activity' && '活动'}
                  {advice.category === 'wellness' && ' wellness'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(advice.date)}
                </div>
              </div>
            </div>
            
            {!advice.completed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isGenerating}
                className="text-muted-foreground hover:text-amber-600"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                换一条
              </Button>
            )}
          </div>

          {/* Title */}
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-500 ${
            advice.completed ? 'text-green-700 line-through opacity-70' : 'text-stone-800'
          }`}>
            {advice.title}
          </h2>

          {/* Description */}
          <p className={`text-base md:text-lg leading-relaxed mb-6 transition-all duration-500 ${
            advice.completed ? 'text-green-600/70' : 'text-stone-600'
          }`}>
            {advice.description}
          </p>

          {/* Tags & Cost */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4" />
              预计花费: {advice.estimatedCost}
            </div>
            {advice.tags.map(tag => (
              <div key={tag} className="flex items-center gap-1 text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                {tag}
              </div>
            ))}
          </div>

          {/* Reason */}
          {advice.reason && (
            <div className="mb-6">
              <button 
                onClick={() => setIsReasonCollapsed(!isReasonCollapsed)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-700" />
                  <span className="text-sm font-semibold text-blue-700">推荐理由</span>
                </div>
                {isReasonCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-blue-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-blue-500" />
                )}
              </button>
              {!isReasonCollapsed && (
                <div className="p-4 bg-blue-50/50 border-x border-b border-blue-100 rounded-b-lg">
                  <p className="text-sm text-blue-600 leading-relaxed">
                    {advice.reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {!advice.completed ? (
            <Button
              onClick={handleComplete}
              className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Check className="w-5 h-5 mr-2" />
              完成这个爱自己行动
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold py-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span>已完成！你真棒！</span>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(720deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
