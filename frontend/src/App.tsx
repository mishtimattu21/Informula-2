
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './components/ThemeProvider';
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import PostAuthGate from "./pages/PostAuthGate";
import FirstLoginGuard from "./pages/FirstLoginGuard";
import DecodePage from "./pages/DecodePage";
import ResultsPage from "./pages/ResultsPage";
import MyDataPage from "./pages/MyDataPage";
import DebugPage from "./pages/DebugPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Global guard to redirect new users to onboarding anywhere */}
          <FirstLoginGuard />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/post-auth" element={<PostAuthGate />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/decode" element={<DecodePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/my-data" element={<MyDataPage />} />
            <Route path="/debug" element={<DebugPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
