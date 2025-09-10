export type AnalysisInsight = {
  ingredient: string;
  risk: 'safe' | 'medium' | 'high';
  description: string;
  source: string;
  sources: string[];
};

export type AnalysisResponse = {
  overallScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  totalIngredients: number;
  flaggedIngredients: number;
  insights: AnalysisInsight[];
  initialAnalysis: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000';

export async function analyzeImage(base64Image: string, userId?: string, productName?: string, productType?: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, userId, productName, productType })
  });
  if (!res.ok) throw new Error(`Image analysis failed: ${res.status}`);
  return res.json();
}

export async function analyzeImageFile(file: File, userId?: string, productName?: string, productType?: string): Promise<AnalysisResponse> {
  const form = new FormData();
  form.append('file', file);
  if (userId) form.append('userId', userId);
  if (productName) form.append('productName', productName);
  if (productType) form.append('productType', productType);

  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error(`Image analysis failed: ${res.status}`);
  return res.json();
}

export async function analyzeText(ingredients: string, userId?: string, productName?: string, productType?: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/api/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, userId, productName, productType })
  });
  if (!res.ok) throw new Error(`Text analysis failed: ${res.status}`);
  return res.json();
}

export async function chatAsk(question: string, history: { role: 'user' | 'ai'; content: string }[], initialAnalysis?: string, userId?: string): Promise<{ answer: string }> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history, initialAnalysis, userId })
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}


