import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage, LANGUAGES, Language } from "@/contexts/LanguageContext";
import heroImage from "@/assets/farm-hero.jpg";
import farmerPhone from "@/assets/farmer-phone.jpg";

interface OnboardingSlide {
  title: string;
  description: string;
  image: string;
  features: string[];
}

const Onboarding = () => {
  const { t, setLanguage } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const navigate = useNavigate();

  if (showLanguageSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary-glow flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-slide-up">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('onboarding.welcome')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('onboarding.selectLanguage')}
            </p>
            
            <div className="space-y-3 mb-8">
              {Object.entries(LANGUAGES).map(([code, { native }]) => (
                <Button
                  key={code}
                  variant="outline"
                  className="w-full justify-start text-left h-12 text-lg hover:bg-primary/10 hover:border-primary"
                  onClick={() => {
                    setLanguage(code as Language);
                    setShowLanguageSelection(false);
                  }}
                >
                  {native}
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={() => setShowLanguageSelection(false)}
              className="w-full btn-hero"
            >
              {t('common.continue')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const slides: OnboardingSlide[] = [
    {
      title: t('onboarding.welcome'),
      description: t('onboarding.subtitle'),
      image: heroImage,
      features: [
        "Get instant farming advice in your language",
        "Voice-powered assistance for all your questions",
        "Modern technology meets traditional farming"
      ]
    },
    {
      title: "Smart Crop Scanning 📸",
      description: "Detect diseases and pests instantly",
      image: farmerPhone,
      features: [
        "Take a photo of your crop",
        "Get instant disease identification", 
        "Receive treatment recommendations",
        "Prevention tips for future crops"
      ]
    },
    {
      title: "Weather & Market Intelligence 🌤️",
      description: "Stay ahead with real-time updates",
      image: heroImage,
      features: [
        "Live weather updates and alerts",
        "Best time recommendations for farming",
        "Real-time market prices",
        "Find the best mandis near you"
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      startApp();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const startApp = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/');
  };

  const skipOnboarding = () => {
    startApp();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          variant="ghost" 
          onClick={skipOnboarding}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ 
            backgroundImage: `url(${slides[currentSlide].image})`,
            transform: `scale(${1.05 + currentSlide * 0.02})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6 pb-32">
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-white mb-4 animate-fade-in">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-xl text-white/90 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {slides[currentSlide].description}
            </p>

            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 p-6 animate-slide-up" 
              style={{ animationDelay: "0.4s" }}
            >
              <div className="space-y-3">
                {slides[currentSlide].features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                    <p className="text-white/90 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125 animate-pulse-glow' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`text-white hover:bg-white/10 ${
                currentSlide === 0 ? 'invisible' : 'visible'
              }`}
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </Button>

            <Button
              onClick={nextSlide}
              className="btn-hero animate-pulse-glow"
            >
              {currentSlide === slides.length - 1 ? (
                "Start Farming! 🚀"
              ) : (
                <>
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;