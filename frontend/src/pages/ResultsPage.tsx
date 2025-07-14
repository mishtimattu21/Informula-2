
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();

  const analysisData = {
    overallScore: 78,
    riskLevel: 'Medium',
    totalIngredients: 12,
    flaggedIngredients: 3,
    insights: [
      {
        ingredient: 'Sodium Lauryl Sulfate',
        risk: 'medium',
        description: 'Common surfactant that may cause skin irritation in sensitive individuals.',
        source: 'FDA Safety Database'
      },
      {
        ingredient: 'Methylparaben',
        risk: 'low',
        description: 'Preservative with potential endocrine disruption concerns.',
        source: 'Environmental Working Group'
      },
      {
        ingredient: 'Vitamin E (Tocopherol)',
        risk: 'safe',
        description: 'Natural antioxidant that helps preserve product freshness.',
        source: 'Scientific Literature'
      }
    ]
  };

  const initialAnalysis = `Based on my analysis of the 12 ingredients in this product, I've identified 3 ingredients that require attention based on your health profile:

**Overall Assessment:** Medium Risk (Score: 78/100)

**Key Findings:**
• Sodium Lauryl Sulfate may cause skin irritation given your sensitive skin profile
• Methylparaben detected - you indicated preference to avoid preservatives
• Most other ingredients are considered safe for your dietary preferences

**Recommendations:**
• Consider alternatives with gentler surfactants like Cocamidopropyl Betaine
• Look for paraben-free versions of this product type
• The antioxidants present (Vitamin E) are beneficial for product stability

Feel free to ask me specific questions about any ingredient or health concern!`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30">
      {/* Header */}
      <div className="border-b border-border/40 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent"
            >
              Informula
            </button>
            
            <Button
              onClick={() => navigate('/decode')}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              <ArrowLeft className="mr-2" size={16} />
              Analyze Another
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Analysis Results
            </h1>
            <p className="text-lg text-foreground/70">
              AI-powered ingredient analysis based on your health profile
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Analysis Results */}
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Overall Safety Score
                    <Badge variant={analysisData.riskLevel === 'Low' ? 'default' : 'secondary'}>
                      {analysisData.riskLevel} Risk
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-emerald-600">
                      {analysisData.overallScore}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${analysisData.overallScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-foreground/70 mt-2">
                        {analysisData.flaggedIngredients} of {analysisData.totalIngredients} ingredients flagged
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredient Analysis */}
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle>Ingredient Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="mt-1">
                        {insight.risk === 'safe' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : insight.risk === 'medium' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{insight.ingredient}</h4>
                        <p className="text-sm text-foreground/70 mt-1">{insight.description}</p>
                        <p className="text-xs text-foreground/50 mt-2">Source: {insight.source}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 w-5 h-5 text-yellow-500" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                      <p className="text-sm">✓ Consider sulfate-free alternatives for sensitive skin</p>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                      <p className="text-sm">✓ Look for products with natural preservatives</p>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                      <p className="text-sm">✓ The antioxidants present are beneficial for your skin type</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="space-y-6">
              <ChatInterface initialAnalysis={initialAnalysis} />
              
              {/* Quick Actions */}
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/decode')}
                    variant="outline" 
                    className="w-full justify-start rounded-xl"
                  >
                    Analyze Another Product
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-xl"
                  >
                    Save to My Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-xl"
                  >
                    Share Results
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-xl"
                  >
                    Find Alternatives
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
