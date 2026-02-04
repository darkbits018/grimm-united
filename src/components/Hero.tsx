import React, { RefObject } from 'react';
import { Sword, Cherry } from 'lucide-react';
import { useInView } from './hooks/useInView';
import { useInterestCounter } from './hooks/useInterestCounter';
import { BrandLogo } from './BrandLogo';


interface HeroProps {
  interestFormRef: RefObject<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({ interestFormRef }) => {
  const [ref, isVisible] = useInView();
  const interestCount = useInterestCounter();

  const handleScrollToForm = () => {
    if (interestFormRef.current) {
      interestFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFB7C5]/20 to-white/90 dark:from-[#FFB7C5]/10 dark:to-[#1a1a1a]/90" />
        <img
          src="https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=2000"
          alt="Japanese street"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <BrandLogo />
          <p className="text-xl md:text-2xl mb-8 text-[#2C2C2C]/80 dark:text-white/80 font-noto">
            Holy Roots, Grimm Heart, Fearless Soul
          </p>
          <button
            onClick={handleScrollToForm}
            className="bg-[#FF4B8C] text-white px-8 py-4 rounded-full font-semibold shadow-lg
                     hover:bg-[#FF4B8C]/90 transform hover:scale-105 transition-all duration-300
                     flex items-center justify-center space-x-2 mx-auto"
          >
            <Sword className="w-5 h-5" />
            <span>Show Interest & Get 10% Cashback</span>
          </button>

          <div className="mt-8 flex items-center justify-center text-[#2C2C2C]/70 dark:text-white/70">
            <Cherry className="w-5 h-5 mr-2" />
            <span>{interestCount.toLocaleString()} people interested</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animation: `float ${10 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;