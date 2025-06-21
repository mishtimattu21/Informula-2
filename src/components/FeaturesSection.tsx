
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Type, Brain, Database, MessageCircle } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Smart Camera Scanning",
      description: "Instantly capture and analyze ingredient lists with advanced OCR technology",
      icon: Camera,
      highlight: true,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Drag & Drop Upload",
      description: "Seamlessly upload images of ingredient lists from your device",
      icon: Upload,
      highlight: false,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Manual Input",
      description: "Type ingredients with intelligent auto-suggestions and validation",
      icon: Type,
      highlight: false,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze health impacts and safety",
      icon: Brain,
      highlight: true,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Scientific Database",
      description: "Cross-referenced data from PubChem, FDA, and peer-reviewed research",
      icon: Database,
      highlight: false,
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      title: "Interactive Q&A",
      description: "Ask detailed questions about ingredients and get expert-level answers",
      icon: MessageCircle,
      highlight: true,
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-center text-foreground/70 mb-16 text-lg max-w-2xl mx-auto">
            Everything you need to make informed decisions about the products you use
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 border-2 ${
                    feature.highlight 
                      ? 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-xl' 
                      : 'border-border hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl'
                  } rounded-2xl overflow-hidden`}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
