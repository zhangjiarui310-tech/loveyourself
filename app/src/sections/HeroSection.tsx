import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, Sparkles } from 'lucide-react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="w-full py-20">
          {/* Text content */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 fill-amber-500" />
              每天一个爱自己的小建议
            </div>
            
            <h1 
              ref={titleRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-800 mb-6 leading-tight"
            >
              <span className="block">爱</span>
              <span className="block text-amber-500">自己</span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl md:text-2xl text-stone-600 mb-8 max-w-md mx-auto"
            >
              每天花一点钱，
              <br />
              给自己一份小小的幸福。
            </p>
            
            <div className="flex items-center gap-4 justify-center">
              <div className="flex items-center gap-2 text-stone-500">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm">个性化推荐</span>
              </div>
              <div className="w-1 h-1 bg-stone-300 rounded-full" />
              <div className="flex items-center gap-2 text-stone-500">
                <Heart className="w-5 h-5 text-amber-500" />
                <span className="text-sm">基于你的喜好</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
