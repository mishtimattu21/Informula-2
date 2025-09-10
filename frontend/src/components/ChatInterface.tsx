
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, MessageSquare } from 'lucide-react';
import { chatAsk } from '@/services/api';
import { useUser } from '@clerk/clerk-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialAnalysis?: string;
  heightPx?: number;
  recommendations?: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialAnalysis, heightPx, recommendations }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (initialAnalysis) {
      const recs = (recommendations && recommendations.length > 0 ? recommendations : []).slice(0, 3);
      const recText = recs.length ? `\n\nRecommendations:\n- ${recs.join('\n- ')}` : '';
      setMessages([{
        id: '1',
        content: `${initialAnalysis}${recText}`,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [initialAnalysis, recommendations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = [...messages, userMessage].map(m => ({ role: (m.sender === 'user' ? 'user' : 'ai') as 'user' | 'ai', content: m.content }));
      const userId = isSignedIn && user ? user.id : undefined;
      const resp = await chatAsk(inputValue, history, initialAnalysis, userId);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: resp.answer,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (e: any) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I had trouble answering that. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getAIResponse = (userInput: string): string => {
    const responses = [
      "Based on the ingredients analyzed, I can provide more specific information about what you're asking. Could you be more specific about which ingredient concerns you?",
      "That's a great question! The ingredient you're asking about is generally considered safe in the concentrations typically used in consumer products.",
      "I understand your concern. This ingredient can have different effects depending on individual sensitivities. Would you like me to explain the potential interactions?",
      "From a scientific perspective, this compound serves as a preservative and is regulated by the FDA. Let me break down its safety profile for you.",
      "Excellent question! Based on current research and your dietary preferences, here's what you should know about this ingredient..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col border-2 border-emerald-200 dark:border-emerald-800" style={{ height: heightPx ? `${heightPx}px` : undefined }}>
      <CardContent className="flex flex-col h-full p-4">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-lg">Ask Follow-up Questions</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about specific ingredients, health effects, or alternatives..."
            className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl px-4"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
