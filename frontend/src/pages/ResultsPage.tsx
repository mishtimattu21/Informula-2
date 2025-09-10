
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiAnalysis = (location && (location as any).state && (location as any).state.analysis) ? (location as any).state.analysis : undefined;

  const analysisRaw = apiAnalysis && typeof apiAnalysis === 'object' ? apiAnalysis : {
    overallScore: 78,
    riskLevel: 'Medium',
    totalIngredients: 12,
    flaggedIngredients: 3,
    insights: [
      {
        ingredient: 'Sodium Lauryl Sulfate',
        risk: 'medium',
        description: 'Common surfactant that may cause skin irritation in sensitive individuals.',
        source: 'FDA Safety Database',
        sources: []
      },
      {
        ingredient: 'Methylparaben',
        risk: 'low',
        description: 'Preservative with potential endocrine disruption concerns.',
        source: 'Environmental Working Group',
        sources: []
      },
      {
        ingredient: 'Vitamin E (Tocopherol)',
        risk: 'safe',
        description: 'Natural antioxidant that helps preserve product freshness.',
        source: 'Scientific Literature',
        sources: []
      }
    ],
    initialAnalysis: 'Analysis summary unavailable.'
  };
  // Normalize to robust types
  const analysisData = {
    overallScore: Number((analysisRaw as any).overallScore ?? 0),
    riskLevel: (analysisRaw as any).riskLevel ?? 'Medium',
    totalIngredients: Number((analysisRaw as any).totalIngredients ?? 0),
    flaggedIngredients: Number((analysisRaw as any).flaggedIngredients ?? 0),
    insights: Array.isArray((analysisRaw as any).insights) ? (analysisRaw as any).insights : [],
    initialAnalysis: (analysisRaw as any).initialAnalysis ?? ''
  };

  const initialAnalysis = analysisData.initialAnalysis || '';

  const ingredientRef = useRef<HTMLDivElement | null>(null);
  const overallRef = useRef<HTMLDivElement | null>(null);
  const [chatHeight, setChatHeight] = useState<number | undefined>(undefined);
  const breakdownContentRef = useRef<HTMLDivElement | null>(null);
  const [breakdownMaxPx, setBreakdownMaxPx] = useState<number | undefined>(undefined);

  // Compute deterministic score and risk band from insight risks
  const risks = (analysisData.insights || []).map((i: any) => (i?.risk || '').toLowerCase());
  const numHigh = risks.filter(r => r === 'high').length;
  const numMedium = risks.filter(r => r === 'medium').length;
  const numLow = risks.filter(r => r === 'low').length;
  const numSafe = risks.filter(r => r === 'safe').length;
  const totalCount = analysisData.totalIngredients || (analysisData.insights ? analysisData.insights.length : 0);
  const flaggedCount = (numHigh + numMedium + numLow);

  // Improved risk calculation that considers both severity and proportion
  const calculateRiskScore = () => {
    if (totalCount === 0) return { score: 0, riskLevel: 'Unknown' };
    
    // Base score starts at 100
    let score = 100;
    
    // Calculate severity penalty based on ingredient risk levels
    const severityPenalty = (numHigh * 25) + (numMedium * 12) + (numLow * 4);
    
    // Calculate proportion penalty - higher penalty if more ingredients are flagged
    const flaggedProportion = flaggedCount / totalCount;
    const proportionPenalty = flaggedProportion * 20; // Up to 20 points for 100% flagged
    
    // Apply penalties
    score -= severityPenalty;
    score -= proportionPenalty;
    
    // Additional penalty for high-risk ingredients (exponential impact)
    if (numHigh > 0) {
      score -= numHigh * 5; // Extra penalty for each high-risk ingredient
    }
    
    // Bonus for safe ingredients (up to 10 points)
    const safeProportion = numSafe / totalCount;
    score += safeProportion * 10;
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Determine risk level with more nuanced thresholds
    let riskLevel: string;
    if (score >= 85) {
      riskLevel = 'Low';
    } else if (score >= 65) {
      riskLevel = 'Medium';
    } else if (score >= 35) {
      riskLevel = 'High';
    } else {
      riskLevel = 'Very High';
    }
    
    return { score: Math.round(score), riskLevel };
  };

  const { score: computedScore, riskLevel: computedRiskLevel } = calculateRiskScore();

  // Debug logging for risk calculation (remove in production)
  console.log('Risk Calculation Debug:', {
    totalCount,
    flaggedCount,
    numHigh,
    numMedium,
    numLow,
    numSafe,
    computedScore,
    computedRiskLevel
  });

  useEffect(() => {
    const ing = ingredientRef.current;
    const ovl = overallRef.current;
    if (!ing && !ovl) return;

    const update = () => {
      const ingH = ing ? ing.getBoundingClientRect().height : 0;
      const ovlH = ovl ? ovl.getBoundingClientRect().height : 0;
      const ingMarginTop = ing ? parseFloat(getComputedStyle(ing).marginTop || '0') : 0; // gap from space-y-*
      setChatHeight(ingH + ovlH + ingMarginTop);
    };

    update();

    const ro = new ResizeObserver(() => update());
    if (ing) ro.observe(ing);
    if (ovl) ro.observe(ovl);

    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Compute max height so exactly three ingredient items fit; if more than 3, scroll
  useEffect(() => {
    const content = breakdownContentRef.current;
    if (!content) return;
    const items = Array.from(content.querySelectorAll('.ingredient-item')) as HTMLElement[];
    if (items.length === 0) return;
    // Sum heights of first three items plus vertical gaps from computed styles
    const count = Math.min(3, items.length);
    let total = 0;
    for (let i = 0; i < count; i++) {
      const el = items[i];
      const rect = el.getBoundingClientRect();
      total += rect.height;
      if (i < count - 1) {
        const style = getComputedStyle(content);
        const gap = parseFloat(style.rowGap || style.gap || '0');
        total += isNaN(gap) ? 0 : gap;
      }
    }
    setBreakdownMaxPx(total);
  }, [analysisData.insights]);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent pb-2 leading-tight">
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
              <div ref={overallRef}>
                <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Overall Safety Score
                      <Badge 
                        variant={
                          computedRiskLevel === 'Low' ? 'default' : 
                          computedRiskLevel === 'Medium' ? 'secondary' :
                          computedRiskLevel === 'High' ? 'destructive' : 'destructive'
                        }
                        className={
                          computedRiskLevel === 'Very High' ? 'bg-red-600 hover:bg-red-700' : ''
                        }
                      >
                        {computedRiskLevel} Risk
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className={`text-4xl font-bold ${
                        computedRiskLevel === 'Low' ? 'text-emerald-600' :
                        computedRiskLevel === 'Medium' ? 'text-yellow-600' :
                        computedRiskLevel === 'High' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {isNaN(computedScore) ? '-' : computedScore}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              computedRiskLevel === 'Low' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                              computedRiskLevel === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              computedRiskLevel === 'High' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                              'bg-gradient-to-r from-red-500 to-red-700'
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, computedScore || 0))}%` }}
                          />
                        </div>
                        <p className="text-sm text-foreground/70 mt-2">
                          {(flaggedCount || 0)} of {(totalCount || 0)} ingredients flagged
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ingredient Analysis */}
              <div ref={ingredientRef}>
                <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle>Ingredient Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent ref={breakdownContentRef} className="space-y-5 overflow-y-auto pr-1" style={{ maxHeight: breakdownMaxPx ? `${breakdownMaxPx}px` : undefined }}>
                    {[...(analysisData.insights || [])]
                      .sort((a: any, b: any) => {
                        const rank = (risk: string) => {
                          const r = (risk || '').toLowerCase();
                          if (r === 'high') return 3;
                          if (r === 'medium') return 2;
                          if (r === 'low') return 1;
                          if (r === 'safe') return 0;
                          return 0;
                        };
                        return rank(b.risk) - rank(a.risk);
                      })
                      .map((insight: any, index: number) => (
                      <div key={index} className="ingredient-item flex items-start space-x-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                        <div className="mt-1">
                          {(() => {
                            const r = (insight.risk || '').toLowerCase();
                            if (r === 'safe' || r === 'low') {
                              return <CheckCircle className="w-6 h-6 text-emerald-500" />;
                            }
                            if (r === 'high') {
                              return <AlertTriangle className="w-6 h-6 text-red-500" />;
                            }
                            if (r === 'medium') {
                              return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
                            }
                            return <Info className="w-6 h-6 text-blue-500" />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{insight.ingredient}</h4>
                          <p className="text-sm text-foreground/70 mt-1" dangerouslySetInnerHTML={{ __html: insight.description }}></p>
                          <p className="text-xs text-foreground/50 mt-2">Source: {insight.source}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="space-y-6">
              <ChatInterface 
                initialAnalysis={initialAnalysis} 
                heightPx={chatHeight}
                recommendations={(analysisData as any).recommendations}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
