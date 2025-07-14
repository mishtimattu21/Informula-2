import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white dark:bg-black">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-emerald-400 cursor-pointer" onClick={handleScrollToTop}>
              Informula
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering consumers with AI-driven insights into product ingredients. Make safer, healthier choices every day.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#feedback" className="text-gray-400 hover:text-emerald-400 transition-colors">Feedback</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and research.</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 rounded-r-none focus:ring-emerald-500 text-white placeholder-gray-500"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Follow Us</h4>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-transform duration-300 hover:scale-110"><Twitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-transform duration-300 hover:scale-110"><Linkedin size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-transform duration-300 hover:scale-110"><Github size={24} /></a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="text-center text-gray-500">
          <p>&copy; {currentYear} Informula. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            <a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 