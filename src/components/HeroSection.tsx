import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const educationalQuotes = [
    "Overconsumption of salt can kill you!",
    "Hidden chemicals in cosmetics affect hormones",
    "Natural doesn't always mean safer",
    "Your skin absorbs 60% of what you apply",
    "Parabens may disrupt your endocrine system",
    "Some fragrances contain toxic compounds"
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
      
      <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 dark:bg-gradient-to-br dark:from-black dark:via-gray-950 dark:to-gray-900 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Molecular Structures */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100/30 dark:bg-emerald-900/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-teal-100/40 dark:bg-teal-900/30 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-60 left-20 w-40 h-40 bg-green-100/20 dark:bg-green-900/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 bg-emerald-200/25 dark:bg-emerald-800/20 rounded-full blur-xl animate-pulse delay-500"></div>
          
          {/* Hexagonal Pattern */}
          <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 border-2 border-emerald-200/30 dark:border-emerald-700/30 transform rotate-45 animate-spin-slow"></div>
          </div>
          <div className="absolute bottom-1/2 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <div className="w-12 h-12 border-2 border-teal-200/40 dark:border-teal-700/40 transform rotate-12 animate-spin-slow"></div>
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="grid grid-cols-12 gap-px h-full w-full">
              {Array.from({ length: 144 }, (_, i) => (
                <div key={i} className="bg-emerald-400 dark:bg-emerald-600"></div>
              ))}
            </div>
          </div>
        </div>

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
            <div className="mt-6 flex justify-center">
              <img 
                src="/chem1.png" 
                alt="Chemistry Analysis - Light Mode" 
                className="max-w-6xl w-full h-auto dark:hidden"
              />
              <img 
                src="/chem2.png" 
                alt="Chemistry Analysis - Dark Mode" 
                className="max-w-6xl w-full h-auto hidden dark:block"
              />
            </div>
          </div>
        </div>

        {/* Bottom Decorative Section */}
        <div className="flex-grow"></div>
        <div className="relative w-full h-32 bg-gradient-to-t from-emerald-100/50 to-transparent dark:from-emerald-900/30 dark:to-transparent">
        </div>
      </section>
    </>
  );
};

export default HeroSection;