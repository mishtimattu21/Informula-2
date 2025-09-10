 

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze thousands of ingredients in seconds',
    image: '/ai_powered.png',
    gradient: 'from-emerald-500 to-teal-500',
    className: 'lg:col-span-2 lg:row-span-2',
  },
  {
    title: 'Smart Scanning',
    description: 'Instant ingredient extraction from any product label',
    image: '/smart_scan.png',
    gradient: 'from-blue-500 to-cyan-500',
    className: 'lg:col-span-1',
  },
  {
    title: 'Interactive Chat',
    description: 'Ask follow-up questions and get detailed explanations about your analysis results',
    image: '/chat.png',
    gradient: 'from-purple-500 to-pink-500',
    className: 'lg:col-span-1',
  },
  {
    title: 'Personal Alerts',
    description: 'Custom notifications for your specific allergies and concerns',
    image: '/alerts.png',
    gradient: 'from-orange-500 to-red-500',
    className: 'lg:col-span-1',
  },
  {
    title: 'Export Reports',
    description: 'Download detailed analysis reports for your records',
    image: '/export_reports.png',
    gradient: 'from-green-500 to-emerald-500',
    className: 'lg:col-span-1',
  },
  {
    title: 'Smart Recommendations',
    description: 'Get personalized product suggestions based on your skin type and preferences',
    image: '/recommendation.png',
    gradient: 'from-indigo-500 to-purple-500',
    className: 'lg:col-span-1',
  },
  {
    title: 'Real-time Updates',
    description: 'Latest research and regulatory changes instantly reflected',
    image: '/realtime.png',
    gradient: 'from-yellow-500 to-orange-500',
    className: 'lg:col-span-1',
  },
  {
    title: 'Community Insights',
    description: 'Join thousands making informed choices about product safety',
    image: '/community.png',
    gradient: 'from-pink-500 to-rose-500',
    className: 'lg:col-span-2',
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to make informed decisions about the products you use every day.
          </p>
        </div>

        {/* Elegant Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const isLarge = feature.className.includes('lg:row-span-2');

            return (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 cursor-pointer bg-white/60 dark:bg-gray-800/60 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 ${feature.className}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Subtle Gradient Background (standardized to emerald on hover) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon Image (left-aligned, no colored box, larger image) */}
                <div className={`relative flex items-center justify-start mb-4 group-hover:scale-110 transition-transform duration-300 ${isLarge ? 'mb-6' : ''}`}>
                  <img src={feature.image} alt={feature.title} className={`${isLarge ? 'w-20 h-20' : 'w-14 h-14'} object-contain`} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 ${isLarge ? 'text-2xl mb-4' : 'text-lg'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
                    {feature.description}
                  </p>
                </div>

                {/* Hover Glow Effect (standardized to emerald) */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 blur-xl opacity-10`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
