import { useState, useEffect } from "react";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle,
  Calendar,
  MapPin
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "@/contexts/LocationContext";

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: any;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: any;
    rain: number;
  }>;
  alerts: Array<{
    type: "warning" | "info";
    title: string;
    message: string;
  }>;
}

const Weather = () => {
  const { t } = useLanguage();
  const { regionalData } = useLocation();
  const [weather] = useState<WeatherData>({
    current: {
      temp: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      icon: Sun
    },
    forecast: [
      { day: "Today", high: 32, low: 22, condition: "Sunny", icon: Sun, rain: 0 },
      { day: "Tomorrow", high: 29, low: 20, condition: "Cloudy", icon: Cloud, rain: 20 },
      { day: "Wednesday", high: 25, low: 18, condition: "Rainy", icon: CloudRain, rain: 80 },
      { day: "Thursday", high: 27, low: 19, condition: "Partly Cloudy", icon: Cloud, rain: 10 },
      { day: "Friday", high: 30, low: 21, condition: "Sunny", icon: Sun, rain: 0 }
    ],
    alerts: [
      {
        type: "warning",
        title: "Heavy Rain Expected",
        message: "Heavy rainfall expected on Wednesday. Avoid irrigation and secure equipment."
      },
      {
        type: "info",
        title: "Perfect Harvesting Weather",
        message: "Next 2 days have ideal conditions for wheat harvesting with low humidity."
      }
    ]
  });

  const getAlertColor = (type: string) => {
    return type === "warning" 
      ? "bg-red-50 border-red-200 text-red-800" 
      : "bg-blue-50 border-blue-200 text-blue-800";
  };

  const getAlertIcon = (type: string) => {
    return type === "warning" ? AlertTriangle : Calendar;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-sky text-white p-6 pt-12">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">{t('weather.title')}</h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin size={16} />
            <span>{regionalData.name}, India</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Current Weather */}
        <Card className="card-farm -mt-8 relative z-10 animate-slide-up">
          <div className="text-center mb-6">
            <weather.current.icon 
              size={64} 
              className="text-golden mx-auto mb-4 animate-float" 
            />
            <h2 className="text-4xl font-bold text-foreground mb-2">
              {weather.current.temp}°C
            </h2>
            <p className="text-lg text-muted-foreground">
              {weather.current.condition}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-accent/10 rounded-xl border border-accent/20">
              <Droplets className="text-accent mx-auto mb-2" size={24} />
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-bold text-lg">{weather.current.humidity}%</p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
              <Wind className="text-primary mx-auto mb-2" size={24} />
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="font-bold text-lg">{weather.current.windSpeed} km/h</p>
            </div>
          </div>
        </Card>

        {/* Weather Alerts */}
        {weather.alerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Farming Alerts</h3>
            {weather.alerts.map((alert, index) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <Card 
                  key={index} 
                  className={`p-4 border-2 animate-slide-up ${getAlertColor(alert.type)}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold mb-1">{alert.title}</h4>
                      <p className="text-sm leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* 5-Day Forecast */}
        <div>
          <h3 className="font-bold text-lg mb-4">5-Day Forecast</h3>
          <div className="space-y-3">
            {weather.forecast.map((day, index) => (
              <Card 
                key={index} 
                className="card-farm p-4 animate-slide-up"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <day.icon 
                      size={32} 
                      className={`${
                        day.condition === "Sunny" ? "text-golden" :
                        day.condition === "Rainy" ? "text-accent" : "text-muted-foreground"
                      } animate-float`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                    <div>
                      <p className="font-semibold">{day.day}</p>
                      <p className="text-sm text-muted-foreground">{day.condition}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                    {day.rain > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Droplets size={12} className="text-accent" />
                        <span className="text-xs text-accent font-medium">
                          {day.rain}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Farming Tips */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Sun className="text-golden" size={20} />
            Weather-based Farming Tips
          </h4>
          
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm font-medium text-primary mb-1">Today's Recommendation</p>
              <p className="text-sm">
                Perfect conditions for field work. Consider applying fertilizers before tomorrow's clouds.
              </p>
            </div>
            
            <div className="bg-golden/10 border border-golden/20 rounded-lg p-3">
              <p className="text-sm font-medium text-golden-foreground mb-1">Irrigation Advisory</p>
              <p className="text-sm">
                Skip irrigation for next 2 days due to expected rainfall. Check soil moisture levels.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Weather;