
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Plus, X } from 'lucide-react';

interface UserPreferences {
  allergies: string[];
  avoidIngredients: string[];
  medications: string;
  dietaryPreferences: string[];
}

const QuestionsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    allergies: [],
    avoidIngredients: [],
    medications: '',
    dietaryPreferences: []
  });
  const [customInput, setCustomInput] = useState('');
  const navigate = useNavigate();

  const questions = [
    {
      title: "Do you have any allergies?",
      subtitle: "Help us identify potentially harmful ingredients for you",
      type: "chips",
      field: "allergies",
      options: ["Nuts", "Dairy", "Gluten", "Soy", "Eggs", "Shellfish", "Sesame", "Sulfites"],
      allowCustom: true
    },
    {
      title: "Any ingredients you prefer to avoid?",
      subtitle: "We'll flag these in our analysis",
      type: "chips",
      field: "avoidIngredients",
      options: ["Artificial Colors", "Preservatives", "High Sodium", "Trans Fats", "Artificial Sweeteners", "MSG", "Parabens", "Sulfates"],
      allowCustom: true
    },
    {
      title: "Are you taking any medications?",
      subtitle: "Some ingredients may interact with medications",
      type: "textarea",
      field: "medications"
    },
    {
      title: "Dietary preferences",
      subtitle: "Help us provide more relevant insights",
      type: "chips",
      field: "dietaryPreferences",
      options: ["Vegetarian", "Vegan", "Keto", "Paleo", "Low Carb", "Low Fat", "Organic Only", "Non-GMO"],
      allowCustom: true
    }
  ];

  const handleChipToggle = (field: keyof UserPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const handleAddCustom = (field: keyof UserPreferences) => {
    if (customInput.trim() && !(preferences[field] as string[]).includes(customInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), customInput.trim()]
      }));
      setCustomInput('');
    }
  };

  const handleRemoveCustom = (field: keyof UserPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleTextareaChange = (field: keyof UserPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('User preferences:', preferences);
      navigate('/decode');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-foreground/70">
              Step {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-2 border-emerald-100 dark:border-emerald-900 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {currentQuestion.title}
              </h2>
              <p className="text-foreground/70 text-lg">
                {currentQuestion.subtitle}
              </p>
            </div>

            <div className="mb-8">
              {currentQuestion.type === 'chips' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {currentQuestion.options?.map((option) => {
                      const isSelected = (preferences[currentQuestion.field as keyof UserPreferences] as string[])?.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => handleChipToggle(currentQuestion.field as keyof UserPreferences, option)}
                          className={`px-6 py-3 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                          }`}
                        >
                          {isSelected && <CheckCircle className="inline mr-2" size={16} />}
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom selections display */}
                  {(preferences[currentQuestion.field as keyof UserPreferences] as string[])
                    .filter(item => !currentQuestion.options?.includes(item))
                    .map((customItem) => (
                      <div
                        key={customItem}
                        className="inline-flex items-center px-6 py-3 mr-3 mb-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl border-2 border-emerald-500 shadow-lg shadow-emerald-500/25"
                      >
                        <CheckCircle className="mr-2" size={16} />
                        {customItem}
                        <button
                          onClick={() => handleRemoveCustom(currentQuestion.field as keyof UserPreferences, customItem)}
                          className="ml-2 hover:bg-white/20 rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                  {/* Add custom input */}
                  {currentQuestion.allowCustom && (
                    <div className="max-w-md mx-auto">
                      <div className="flex gap-2">
                        <Input
                          placeholder={`Add custom ${currentQuestion.field}...`}
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddCustom(currentQuestion.field as keyof UserPreferences)}
                          className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500"
                        />
                        <Button
                          onClick={() => handleAddCustom(currentQuestion.field as keyof UserPreferences)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentQuestion.type === 'textarea' && (
                <div className="max-w-md mx-auto">
                  <Textarea
                    placeholder="List any medications you're currently taking..."
                    value={preferences[currentQuestion.field as keyof UserPreferences] as string}
                    onChange={(e) => handleTextareaChange(currentQuestion.field as keyof UserPreferences, e.target.value)}
                    className="min-h-[120px] border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-xl border-2 hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back
              </Button>

              <Button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {currentStep === questions.length - 1 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionsPage;
