import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Type, Brain, Database, MessageCircle } from 'lucide-react';

const StepsSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !stepsContainerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Calculate how much of the container is visible
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - containerTop) / (containerHeight + windowHeight)
      ));

      // Determine which step should be active based on scroll progress
      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(scrollProgress * steps.length)
      );

      setActiveStep(stepIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div>
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-br from-background to-emerald-50/30 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            How It <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-foreground/70 text-base max-w-xl mx-auto">
            Our intelligent system makes ingredient analysis simple and comprehensive
          </p>
        </div>
      </section>

      {/* Sticky Steps Section */}
      <section 
        ref={containerRef}
        className="relative"
        style={{ height: `${steps.length * 80}vh` }}
      >
        <div className="sticky top-0 h-screen flex items-center bg-gradient-to-br from-background to-emerald-50/30 dark:to-emerald-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                
                {/* Left Side - Steps List (Fixed) */}
                <div ref={stepsContainerRef} className="space-y-4">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = activeStep >= index;
                    const isCurrent = activeStep === index;
                    
                    return (
                      <div 
                        key={index}
                        className={`transition-all duration-700 ease-out ${
                          isCurrent 
                            ? 'scale-105 opacity-100' 
                            : isActive 
                              ? 'scale-100 opacity-80' 
                              : 'scale-95 opacity-40'
                        }`}
                      >
                        <div 
                          onClick={() => setActiveStep(index)}
                          className={`p-4 rounded-xl border-2 transition-all duration-700 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                          isCurrent
                            ? 'border-emerald-300 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 shadow-lg shadow-emerald-500/10' 
                            : isActive
                              ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10 hover:border-emerald-300 dark:hover:border-emerald-600'
                              : 'border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className="relative flex-shrink-0">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-md transition-all duration-700 ${
                                isCurrent ? 'scale-110 shadow-lg' : isActive ? 'scale-105' : ''
                              }`}>
                                <IconComponent size={18} />
                              </div>
                              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-700 ${
                                isActive 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-gray-400 text-white'
                              }`}>
                                {step.number}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1 text-foreground">
                                {step.title}
                              </h3>
                              <p className="text-foreground/70 leading-relaxed mb-2 text-sm">
                                {step.description}
                              </p>
                              <div className={`overflow-hidden transition-all duration-500 ${
                                isCurrent ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                              }`}>
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                  {step.details}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side - Dynamic Mockup (Fixed) */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl p-6 shadow-xl">
                      <div className="relative overflow-hidden rounded-xl bg-background shadow-lg">
                        <div className="aspect-[9/16] w-64 relative">
                          <div className="absolute inset-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg overflow-hidden">
                            
                            {/* Step 1 - Camera */}
                            <div className={`absolute inset-0 transition-all duration-700 ${
                              activeStep === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}>
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <div className="relative mb-3">
                                    <Camera size={36} className="mx-auto text-emerald-500" />
                                    <div className="absolute inset-0 border-2 border-emerald-300 rounded-lg animate-pulse opacity-50"></div>
                                  </div>
                                  <p className="text-xs text-foreground/70 font-medium mb-2">Camera Ready</p>
                                  <div className="w-16 h-1.5 bg-emerald-300 rounded mx-auto animate-pulse"></div>
                                </div>
                              </div>
                            </div>

                            {/* Step 2 - AI Processing */}
                            <div className={`absolute inset-0 transition-all duration-700 ${
                              activeStep === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}>
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <Brain size={36} className="mx-auto mb-3 text-emerald-500 animate-bounce" />
                                  <p className="text-xs text-foreground/70 font-medium mb-2">AI Processing...</p>
                                  <div className="flex space-x-1 justify-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Step 3 - Analysis */}
                            <div className={`absolute inset-0 transition-all duration-700 ${
                              activeStep === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}>
                              <div className="p-3 h-full">
                                <div className="flex items-center space-x-2 mb-3">
                                  <Database size={18} className="text-emerald-500" />
                                  <span className="text-xs font-medium">Analysis Complete</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-medium">Sodium Chloride</span>
                                      <span className="text-xs text-emerald-600">Safe</span>
                                    </div>
                                    <div className="h-1 bg-emerald-200 dark:bg-emerald-800 rounded">
                                      <div className="h-1 bg-emerald-500 rounded w-3/4"></div>
                                    </div>
                                  </div>
                                  <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-medium">Citric Acid</span>
                                      <span className="text-xs text-yellow-600">Moderate</span>
                                    </div>
                                    <div className="h-1 bg-yellow-200 dark:bg-yellow-800 rounded">
                                      <div className="h-1 bg-yellow-500 rounded w-1/2"></div>
                                    </div>
                                  </div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-medium">Vitamin C</span>
                                      <span className="text-xs text-emerald-600">Beneficial</span>
                                    </div>
                                    <div className="h-1 bg-emerald-200 dark:bg-emerald-800 rounded">
                                      <div className="h-1 bg-emerald-500 rounded w-full"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Step 4 - Interactive */}
                            <div className={`absolute inset-0 transition-all duration-700 ${
                              activeStep === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}>
                              <div className="p-3 h-full">
                                <div className="flex items-center space-x-2 mb-3">
                                  <MessageCircle size={18} className="text-emerald-500" />
                                  <span className="text-xs font-medium">Interactive Mode</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors cursor-pointer">
                                    <span className="text-xs font-medium">Sodium Chloride</span>
                                    <MessageCircle size={12} className="text-emerald-500" />
                                  </div>
                                  <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded text-xs text-emerald-600 dark:text-emerald-400">
                                    "Common table salt, generally safe in moderation..."
                                  </div>
                                  <div className="flex justify-between items-center p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors cursor-pointer">
                                    <span className="text-xs font-medium">Ask follow-up</span>
                                    <MessageCircle size={12} className="text-emerald-500" />
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating decoration elements */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepsSection;