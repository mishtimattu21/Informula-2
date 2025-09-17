import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const educationalQuotes = [
    "Reading labels is the first step to protecting your health",
    "Many everyday products contain hidden toxins you’ve never heard of",
    "Small exposures add up — what you use daily matters most",
    "Your skin is your body’s largest organ — treat it with care",
    "Some preservatives extend shelf life, but shorten yours",
    "Fragrance doesn’t always mean safe — hidden chemicals may lurk",
    "Even 'dermatologist tested' doesn’t guarantee toxin-free",
    "Hormone disruptors can be found in soaps, shampoos, and lotions",
    "Natural ingredients can still cause allergies and reactions",
    "Awareness is the strongest ingredient you can add to your routine"
  ];
  
  
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prevQuote) => (prevQuote + 1) % educationalQuotes.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [educationalQuotes.length]);

  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
      
      <section className="relative h-svh flex flex-col bg-background dark:bg-gradient-to-br dark:from-black dark:via-gray-950 dark:to-gray-900 overflow-hidden">

        {/* Text Content */}
        <div className="container mx-auto px-4 text-center pt-20 md:pt-24 relative z-10">
          <div className="mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent leading-tight">
              Decode Your Products
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Analyze ingredients instantly. Make informed choices. Protect your health with AI-powered insights.
            </p>
            <div className="mb-10">
              <div
                className={`transition-all duration-300 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <p className="text-lg sm:text-xl font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-6 py-3 rounded-full border border-emerald-200 dark:border-emerald-800 inline-block">
                  ⚠️ {educationalQuotes[currentQuote]}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/decode')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Decode Now
            </Button>
            
             {/* Chemistry Image - Different for Light/Dark Mode */}
            <div className="mt-auto mb-12 md:mb-24 flex justify-center px-0 md:px-4 relative -z-10 overflow-visible -top-6 md:top-0">
              <img 
                src="/chem1.png" 
                alt="Chemistry Analysis - Light Mode" 
                className="max-w-none w-[160vw] md:w-full h-auto max-h-[90svh] md:max-h-[40svh] object-contain dark:hidden"
              />
              <img 
                src="/chem2.png" 
                alt="Chemistry Analysis - Dark Mode" 
                className="max-w-none w-[160vw] md:w-full h-auto max-h-[90svh] md:max-h-[40svh] object-contain hidden dark:block"
              />
            </div>
          </div>
        </div>

        {/* Bottom Decorative Section */}
        <div className="absolute inset-x-0 bottom-0 w-full h-48 bg-gradient-to-t from-emerald-300/50 to-transparent dark:from-emerald-500/30 dark:to-transparent pointer-events-none">
        </div>
      </section>
    </>
  );
};

export default HeroSection;