
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            What is Informula?
          </h2>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
            Informula is your personal ingredient decoder that helps you make informed choices about 
            the products you use every day. Using advanced AI and scientific databases, we analyze 
            ingredient lists to provide you with clear, actionable insights about potential health impacts.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🔬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Science-Backed</h3>
              <p className="text-foreground/70">
                Data sourced from PubChem, FDA databases, and peer-reviewed research
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Analysis</h3>
              <p className="text-foreground/70">
                Get comprehensive ingredient analysis in seconds, not hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-foreground/70">
                Tailored insights based on your allergies, preferences, and health goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
