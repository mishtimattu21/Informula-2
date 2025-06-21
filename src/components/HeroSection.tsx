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
      }, 500); // This should match the transition duration
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, [educationalQuotes.length]);

  return (
    <section className="relative min-h-screen flex flex-col bg-transparent overflow-hidden">
      {/* Text Content */}
      <div className="container mx-auto px-4 text-center pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent leading-tight">
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
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Decode Now
          </Button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow max-h-32"></div>

      {/* Bottom Image */}
      <div className="relative w-full">
        <img src="/image.png" alt="Product Analysis Example" className="w-full" />
      </div>
    </section>
  );
};

export default HeroSection;
