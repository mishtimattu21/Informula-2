
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import QuoteCarousel from './QuoteCarousel';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/30 pt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent leading-tight">
            Decode Your Products
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Analyze ingredients instantly. Make informed choices. Protect your health with AI-powered insights.
          </p>

          <QuoteCarousel />

          <Button 
            onClick={() => navigate('/decode')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="mr-2">🧪</span>
            Decode Now
          </Button>

          <div className="mt-16 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 w-24 h-24 mx-auto my-4 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-30 animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
