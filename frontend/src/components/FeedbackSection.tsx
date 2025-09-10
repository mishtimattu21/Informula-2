
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const FeedbackSection: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const emojis = ['😍', '😊', '😐', '😞', '😤'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    toast({
      title: "Thank you for your feedback!",
      description: "We appreciate your input and will use it to improve Informula.",
    });
    
    setFeedback('');
    setSelectedEmoji('');
  };

  return (
    <section id="feedback" className="py-20 bg-emerald-50/50 dark:bg-emerald-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            We Value Your Feedback
          </h2>
          
          <p className="text-center text-foreground/70 mb-12 text-lg">
            Help us improve Informula by sharing your thoughts and suggestions
          </p>

          <Card className="rounded-2xl shadow-lg border-2 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">How was your experience?</label>
                  <div className="flex justify-center space-x-4 mb-6">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-3xl p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                          selectedEmoji === emoji 
                            ? 'bg-emerald-100 dark:bg-emerald-900 ring-2 ring-emerald-500' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Textarea
                    placeholder="Tell us what you think about Informula..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
