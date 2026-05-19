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

export async function analyzeImage(
  base64Image: string,
  userId?: string,
  productName?: string,
  productType?: string,
  profile?: Record<string, unknown>
): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, userId, productName, productType, profile })
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

function shortenApiError(message: string): string {
  const lower = message.toLowerCase();
  if (
    message === 'API Key Limit Reached' ||
    message.includes('429') ||
    lower.includes('quota') ||
    lower.includes('api key') ||
    lower.includes('rate limit')
  ) {
    return 'API Key Limit Reached';
  }
  if (message.length > 180) return `${message.slice(0, 180)}...`;
  return message;
}

async function parseApiResponse(res: Response, label: string) {
  if (!res.ok) {
    let detail = `${label} failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) detail = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(shortenApiError(detail));
  }
  const data = await res.json();
  if (data?.error) throw new Error(shortenApiError(data.error));
  return data;
}

export async function analyzeText(
  ingredients: string,
  userId?: string,
  productName?: string,
  productType?: string,
  profile?: Record<string, unknown>
): Promise<AnalysisResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, userId, productName, productType, profile }),
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_BASE}. Start the backend with: cd backend_final && python main.py`
    );
  }
  return parseApiResponse(res, 'Text analysis');
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


