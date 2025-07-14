
import React, { useState, useEffect } from 'react';

const quotes = [
  "Overconsumption of salt can increase blood pressure",
  "Common preservatives might trigger allergies",
  "Decode what you use",
  "Knowledge is the best ingredient",
  "Your health starts with what you consume"
];

const QuoteCarousel: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-8">
      <div className="h-16 flex items-center justify-center">
        <p className="text-lg md:text-xl text-foreground/80 italic max-w-md transition-all duration-500 ease-in-out">
          "{quotes[currentQuote]}"
        </p>
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {quotes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentQuote 
                ? 'bg-emerald-500' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteCarousel;
