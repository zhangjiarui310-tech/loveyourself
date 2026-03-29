import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, Sparkles } from 'lucide-react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);

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

      // Images animation with 3D effect
      [image1Ref, image2Ref, image3Ref].forEach((ref, index) => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, rotateX: 45, scale: 0.8, y: 50 },
          {
            opacity: 1,
            rotateX: 0,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.8 + index * 0.2,
          }
        );
      });

      // Floating animation for images
      gsap.to(image1Ref.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(image2Ref.current, {
        y: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });

      gsap.to(image3Ref.current, {
        y: -15,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(image1Ref.current, {
        x: xPercent * 20,
        y: yPercent * 10 - 10,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.to(image2Ref.current, {
        x: xPercent * -15,
        y: yPercent * 15 + 10,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.to(image3Ref.current, {
        x: xPercent * 25,
        y: yPercent * -20 - 15,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
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
              className="text-xl md:text-2xl text-stone-600 mb-8 max-w-md mx-auto lg:mx-0"
            >
              每天花一点钱，
              <br />
              给自己一份小小的幸福。
            </p>
            
            <div className="flex items-center gap-4 justify-center lg:justify-start">
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
          
          {/* Right: Floating images */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Image 1 - Large, top right */}
            <div
              ref={image1Ref}
              className="absolute top-0 right-0 w-72 h-80 rounded-3xl overflow-hidden shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img 
                src="/hero-1.jpg" 
                alt="Love yourself" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Image 2 - Medium, center left */}
            <div
              ref={image2Ref}
              className="absolute top-32 left-0 w-56 h-64 rounded-3xl overflow-hidden shadow-xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img 
                src="/hero-2.jpg" 
                alt="Self care" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Image 3 - Small, bottom right */}
            <div
              ref={image3Ref}
              className="absolute bottom-0 right-20 w-48 h-56 rounded-3xl overflow-hidden shadow-lg"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img 
                src="/hero-3.jpg" 
                alt="Mindfulness" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Decorative shapes */}
            <div className="absolute top-10 left-1/2 w-20 h-20 bg-amber-400/30 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-0 w-32 h-32 bg-orange-400/20 rounded-full blur-xl" />
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
