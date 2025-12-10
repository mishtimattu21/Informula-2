# Informula - AI-Powered Ingredient Analysis Platform

**Informula** is a comprehensive web application that uses AI to analyze product ingredients and provide personalized health insights. Users can scan, upload, or manually input ingredient lists to receive detailed safety analysis and recommendations.

## 🌟 Features

### Core Functionality
- **Multi-Modal Input**: Scan products with camera, upload images, or manually type ingredients
- **AI-Powered Analysis**: Uses Google Gemini AI for intelligent ingredient analysis
- **Personalized Insights**: Tailored recommendations based on user health profiles
- **Real-time Chat**: Interactive Q&A about ingredient analysis results
- **Safety Scoring**: Comprehensive risk assessment with detailed breakdowns

### User Experience
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Theme switching with smooth transitions
- **Progressive Onboarding**: Guided profile setup for personalized analysis
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

### Technical Features
- **OCR Integration**: Azure Computer Vision for text extraction from images
- **Authentication**: Clerk-based user management
- **Database**: Supabase for user profiles and data persistence
- **Real-time Updates**: Live chat interface with context-aware responses

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Authentication**: Clerk React SDK

### Backend (`/backend_final`)
- **Framework**: FastAPI (Python)
- **AI Integration**: Google Gemini 1.5 Flash
- **OCR Service**: Azure Computer Vision API
- **Database**: Supabase client
- **Server**: Uvicorn with Gunicorn

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- Supabase account
- Clerk account
- Google AI API key
- Azure Computer Vision API key

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend_final
pip install -r requirements.txt
python main.py
```

### Environment Variables

#### Frontend (`.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_BASE_URL=http://127.0.0.1:8000
```

#### Backend (`.env`)
```env
GOOGLE_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
AZURE_VISION_KEY=your_azure_key
AZURE_VISION_ENDPOINT=your_azure_endpoint
```

## 📱 Usage

### Getting Started
1. **Sign Up/Login**: Create account using Clerk authentication
2. **Profile Setup**: Complete onboarding with health information
3. **Analyze Products**: Choose from three input methods:
   - **Camera Scan**: Real-time product scanning
   - **Image Upload**: Drag & drop or browse files
   - **Manual Input**: Type ingredient lists

### Analysis Process
1. **Input Processing**: OCR extracts text from images
2. **AI Analysis**: Gemini AI analyzes ingredients against user profile
3. **Results Display**: Comprehensive safety score and ingredient breakdown
4. **Interactive Chat**: Ask follow-up questions about the analysis

## 🛠️ Development

### Project Structure
```
informula-readmem/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── services/       # API service layer
│   │   └── lib/            # Utilities and configurations
│   ├── public/             # Static assets
│   └── package.json
├── backend_final/           # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── server.py           # FastAPI routes and middleware
│   ├── gemini_client.py    # AI service integration
│   ├── processing_ocr.py   # OCR text extraction
│   └── requirements.txt
└── README.md
```

### Key Components

#### Frontend Components
- **DecodePage**: Main analysis interface with input methods
- **ResultsPage**: Analysis results display with chat interface
- **OnboardingPage**: User profile setup wizard
- **ChatInterface**: Interactive Q&A component
- **CameraInterface**: Real-time camera scanning

#### Backend Services
- **Image Analysis**: `/api/analyze-image` - Process images and extract ingredients
- **Text Analysis**: `/api/analyze-text` - Analyze manually entered ingredients
- **Chat Interface**: `/api/chat` - Handle follow-up questions
- **OCR Processing**: Azure Computer Vision integration
- **AI Analysis**: Google Gemini prompt engineering

### Database Schema
```sql
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  age INTEGER,
  gender TEXT,
  diet_type TEXT,
  past_medication TEXT[],
  allergies TEXT[],
  avoid_list TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuration

### Deployment
- **Frontend**: Vercel-ready with `vercel.json`
- **Backend**: Vercel serverless functions
- **Database**: Supabase cloud PostgreSQL
- **Authentication**: Clerk hosted service

### Customization
- **AI Prompts**: Modify `prompt_formatter.py` for different analysis styles
- **UI Themes**: Update Tailwind config and theme provider
- **OCR Settings**: Adjust Azure Vision parameters in `processing_ocr.py`

## 📊 Analysis Features

### Safety Scoring
- **Risk Levels**: Low, Medium, High, Very High
- **Ingredient Categorization**: Safe, Low Risk, Medium Risk, High Risk
- **Personalized Alerts**: Based on user allergies and avoid lists
- **Source Citations**: Reputable scientific sources for each insight

### Health Profile Integration
- **Age Considerations**: Age-appropriate ingredient warnings
- **Gender-Specific**: Hormonal impact assessments
- **Dietary Restrictions**: Vegan/vegetarian compatibility
- **Medical History**: Medication interaction warnings
- **Allergy Management**: Comprehensive allergy checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini**: AI analysis capabilities
- **Azure Computer Vision**: OCR text extraction
- **Clerk**: Authentication services
- **Supabase**: Database and real-time features
- **shadcn/ui**: Beautiful UI components

---

**Informula** - Making ingredient analysis accessible and personalized through AI technology.
