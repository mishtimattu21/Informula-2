import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';
import { useUser, UserButton } from '@clerk/clerk-react';

const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler for custom navigation in Clerk UserButton
  const handleMyDataClick = () => {
    navigate('/my-data');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent ml-4">
              Informula
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('steps')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="text-foreground/80 hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <MessageSquare size={16} />
                <span>Feedback</span>
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full p-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              {isSignedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/my-data')}
                    className="rounded-full"
                  >
                    My Data
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
};

export default Navigation;
