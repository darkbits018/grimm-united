import React from 'react';
import { useInView } from './hooks/useInView';
import { Sparkles } from 'lucide-react';

export function About() {
  const [ref, isVisible] = useInView();

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#1a1a1a] transition-colors duration-200">
      <div className="max-w-4xl mx-auto my-24 px-4 text-center">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Sparkles className="w-8 h-8 text-[#FF4B8C] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-noto text-[#2C2C2C] dark:text-white mb-6">Our Mission</h2>
          <p className="text-lg text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed mb-8">
            At Grimm United, we dream of uniting two worlds: the intricate beauty of Japanese art and the profound stories of Indian mythology. Imagine anime characters infused with the essence of mythological figures or Japanese-inspired designs with a mythological twist. That's the magic we bring to life—for anime enthusiasts, culture lovers, and anyone drawn to these powerful stories.
          </p>
        </div>
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Sparkles className="w-8 h-8 text-[#FF4B8C] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-noto text-[#2C2C2C] dark:text-white mb-6">Our Vision</h2>
          <p className="text-lg text-[#2C2C2C]/80 dark:text-white/80 leading-relaxed mb-8">
            Our vision is to create a unique brand where anime, Japanese art, and Indian mythology converge. We aim to reimagine mythological figures through anime, crafting designs that blend ancient tales with modern creativity. Starting with high-quality clothing and expanding thoughtfully, we're building a community around bold, exclusive designs and collaborations that celebrate culture and artistry.
          </p>
        </div>
      </div>
    </section>
  );
}
