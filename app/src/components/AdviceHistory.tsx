import { useRef, useEffect } from 'react';
import type { DailyAdvice } from '@/types';
import { getCategoryColor, getCategoryIcon } from '@/lib/adviceGenerator';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AdviceHistoryProps {
  advices: DailyAdvice[];
}

export function AdviceHistory({ advices }: AdviceHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.history-item');
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            delay: index * 0.1,
            ease: 'power2.out',
          }
        );
      });
    }
  }, [advices]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (advices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>还没有历史记录</p>
        <p className="text-sm">完成你的第一个爱自己行动吧！</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3">
      {advices.map((advice) => (
        <div
          key={advice.id}
          className={`history-item group p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md ${
            advice.completed
              ? 'bg-green-50/50 border-green-200'
              : 'bg-white border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{getCategoryIcon(advice.category)}</span>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(advice.category)}`}>
                  {advice.category === 'food' && '美食'}
                  {advice.category === 'experience' && '体验'}
                  {advice.category === 'product' && '好物'}
                  {advice.category === 'service' && '服务'}
                  {advice.category === 'activity' && '活动'}
                  {advice.category === 'wellness' && ' wellness'}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(advice.date)}</span>
              </div>
              
              <h4 className={`font-medium truncate transition-all duration-300 ${
                advice.completed ? 'text-green-700 line-through opacity-70' : 'text-stone-800'
              }`}>
                {advice.title}
              </h4>
              
              <p className="text-sm text-muted-foreground truncate mt-1">
                {advice.estimatedCost}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              {advice.completed ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-amber-500 transition-colors" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
