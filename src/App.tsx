import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Voice from "./pages/Voice";
import Camera from "./pages/Camera";
import Calendar from "./pages/Calendar";
import Sustainability from "./pages/Sustainability";
import Weather from "./pages/Weather";
import Market from "./pages/Market";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRouter = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    setShowOnboarding(!onboardingCompleted);
  }, []);

  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voice" element={<Voice />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/sustainability" element={<Sustainability />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/market" element={<Market />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
