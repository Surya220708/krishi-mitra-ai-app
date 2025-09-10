import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mic, 
  Camera, 
  Cloud, 
  TrendingUp, 
  MapPin, 
  Thermometer,
  Droplets,
  Wind,
  Sun
} from "lucide-react";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/farm-hero.jpg";
import { BottomNavigation } from "@/components/ui/navigation";

const featureCards = [
  {
    icon: Mic,
    title: "Ask by Voice",
    description: "Get instant farming advice in your language",
    path: "/voice",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30"
  },
  {
    icon: Camera,
    title: "Scan & Detect",
    description: "Identify pests and diseases instantly",
    path: "/camera",
    color: "text-golden",
    bgColor: "bg-golden/10",
    borderColor: "border-golden/30"
  },
  {
    icon: Cloud,
    title: "Weather Alerts",
    description: "Get weather updates and farming tips",
    path: "/weather",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30"
  },
  {
    icon: TrendingUp,
    title: "Market Prices",
    description: "Track crop prices and find best deals",
    path: "/market",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30"
  }
];

const Home = () => {
  const [farmerName] = useState("Ravi");
  const [greeting, setGreeting] = useState("Good Morning");
  const [currentWeather] = useState({
    temp: "28°C",
    humidity: "65%",
    wind: "12 km/h",
    condition: "Partly Cloudy"
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center overflow-hidden rounded-b-3xl"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 p-6 pt-12 text-white">
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold mb-2">
              {greeting}, {farmerName}! 👨‍🌾
            </h1>
            <p className="text-white/90 text-lg">
              Welcome to KrishiMitra AI
            </p>
            <p className="text-white/80 mt-1">
              Your smart farming companion
            </p>
          </div>
        </div>
      </div>

      {/* Quick Weather Card */}
      <div className="px-6 -mt-8 relative z-10">
        <Card className="card-farm gradient-sky border-0 text-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="text-golden animate-pulse-glow" size={28} />
              <div>
                <p className="font-semibold text-lg">{currentWeather.temp}</p>
                <p className="text-white/90">{currentWeather.condition}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Droplets size={16} />
                <span>{currentWeather.humidity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind size={16} />
                <span>{currentWeather.wind}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Features */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          What can I help you with today?
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {featureCards.map((feature, index) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="block animate-slide-up"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <Card className={`btn-feature ${feature.bgColor} border-2 ${feature.borderColor} hover:scale-105`}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-4 rounded-2xl ${feature.bgColor} ${feature.borderColor} border`}>
                    <feature.icon 
                      size={32} 
                      className={`${feature.color} animate-float`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Location & Quick Tips */}
      <div className="px-6 mt-8">
        <Card className="card-farm">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-primary" size={20} />
            <div>
              <p className="font-semibold">Your Farm Location</p>
              <p className="text-sm text-muted-foreground">Punjab, India</p>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">💡 Today's Tip</h4>
            <p className="text-sm text-foreground">
              Perfect weather for irrigation! Consider watering your crops early morning for best results.
            </p>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;