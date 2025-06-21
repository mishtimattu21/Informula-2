
import React, { useState } from 'react';
import { Camera, Upload, Type, Brain, Database, MessageCircle } from 'lucide-react';

const StepsSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Scan or Input",
      description: "Flip the product and scan the ingredient list, upload an image, or type ingredients manually",
      icon: Camera,
      color: "from-blue-500 to-cyan-500",
      details: "Use your device camera to capture ingredient lists instantly"
    },
    {
      number: "02", 
      title: "AI Processing",
      description: "Our AI analyzes each ingredient using scientific databases and research",
      icon: Brain,
      color: "from-emerald-500 to-teal-500",
      details: "Advanced algorithms cross-reference with PubChem and FDA databases"
    },
    {
      number: "03",
      title: "Detailed Analysis",
      description: "Get comprehensive analysis of each ingredient in an informative and concise manner",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      details: "Receive personalized insights based on your health profile"
    },
    {
      number: "04",
      title: "Interactive Results",
      description: "Click on any ingredient to get detailed analysis along with source links",
      icon: MessageCircle,
      color: "from-orange-500 to-red-500",
      details: "Ask follow-up questions and get expert-level explanations"
    }
  ];

  return (
    <section id="steps" className="py-20 bg-gradient-to-br from-background to-emerald-50/30 dark:to-emerald-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-center text-foreground/70 mb-16 text-lg max-w-2xl mx-auto">
            Our intelligent system makes ingredient analysis simple and comprehensive
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = activeStep === index;
                
                return (
                  <div 
                    key={index}
                    className={`group cursor-pointer transition-all duration-500 ${
                      isActive ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                      isActive 
                        ? 'border-emerald-300 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-xl shadow-emerald-500/10' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800'
                    }`}>
                      <div className="flex items-start space-x-4">
                        <div className={`relative flex-shrink-0`}>
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg transition-all duration-500 ${
                            isActive ? 'scale-110 shadow-2xl' : 'group-hover:scale-105'
                          }`}>
                            <IconComponent size={24} />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.number}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-foreground/70 leading-relaxed mb-2">
                            {step.description}
                          </p>
                          {isActive && (
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-fade-in">
                              {step.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-3xl p-8 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl bg-background shadow-xl">
                  {/* Phone mockup */}
                  <div className="aspect-[9/16] max-w-sm mx-auto relative">
                    <div className="absolute inset-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl overflow-hidden">
                      {activeStep === 0 && (
                        <div className="flex items-center justify-center h-full animate-fade-in">
                          <div className="text-center">
                            <Camera size={48} className="mx-auto mb-4 text-emerald-500" />
                            <p className="text-sm text-foreground/70">Camera Interface</p>
                          </div>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <div className="flex items-center justify-center h-full animate-fade-in">
                          <div className="text-center">
                            <Brain size={48} className="mx-auto mb-4 text-emerald-500 animate-pulse" />
                            <p className="text-sm text-foreground/70">AI Processing...</p>
                          </div>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div className="p-4 space-y-2 animate-fade-in">
                          <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                          <div className="h-3 bg-emerald-300 dark:bg-emerald-700 rounded w-3/4"></div>
                          <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded w-1/2"></div>
                        </div>
                      )}
                      {activeStep === 3 && (
                        <div className="p-4 space-y-2 animate-fade-in">
                          <div className="flex justify-between items-center p-2 bg-emerald-100 dark:bg-emerald-900 rounded">
                            <span className="text-xs">Ingredient 1</span>
                            <MessageCircle size={16} className="text-emerald-500" />
                          </div>
                          <div className="flex justify-between items-center p-2 bg-emerald-100 dark:bg-emerald-900 rounded">
                            <span className="text-xs">Ingredient 2</span>
                            <MessageCircle size={16} className="text-emerald-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
