import { useState, useEffect } from "react";
import { 
  Droplets, 
  Thermometer, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Leaf,
  RotateCcw,
  Calendar,
  Zap,
  Camera
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "@/contexts/LocationContext";

interface SoilData {
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  lastUpdated: Date;
}

interface CropRecommendation {
  crop: string;
  suitability: "Excellent" | "Good" | "Fair" | "Poor";
  expectedYield: string;
  reason: string;
}

interface IrrigationSchedule {
  nextIrrigation: Date;
  duration: number;
  reason: string;
  waterAmount: number;
}

const CropSoilManagement = () => {
  const { t, language } = useLanguage();
  const { regionalData } = useLocation();
  const [soilData] = useState<SoilData>({
    moisture: 65,
    ph: 6.8,
    nitrogen: 78,
    phosphorus: 45,
    potassium: 82,
    temperature: 24,
    lastUpdated: new Date()
  });

  const [recommendations] = useState<CropRecommendation[]>([
    {
      crop: "Wheat",
      suitability: "Excellent", 
      expectedYield: "4.5 tons/hectare",
      reason: "Ideal soil conditions with optimal pH and nutrient levels"
    },
    {
      crop: "Rice",
      suitability: "Good",
      expectedYield: "6.2 tons/hectare", 
      reason: "High moisture content suitable, needs phosphorus supplement"
    },
    {
      crop: "Corn",
      suitability: "Fair",
      expectedYield: "3.8 tons/hectare",
      reason: "Requires nitrogen boost for optimal growth"
    }
  ]);

  const [irrigationSchedule] = useState<IrrigationSchedule>({
    nextIrrigation: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 45,
    reason: "Soil moisture at 65%, next irrigation in 2 days based on weather forecast",
    waterAmount: 25
  });

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "Excellent": return "bg-green-100 text-green-800 border-green-200";
      case "Good": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Fair": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Poor": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNutrientStatus = (value: number) => {
    if (value >= 70) return { status: "Optimal", color: "text-green-600", bgColor: "bg-green-100" };
    if (value >= 50) return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (value >= 30) return { status: "Low", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { status: "Critical", color: "text-red-600", bgColor: "bg-red-100" };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary text-white p-6 pt-12">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">{t('cropSoil.title')}</h1>
          <p className="text-white/90">
            {t('cropSoil.subtitle')} - {regionalData.name}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Real-time Soil Monitoring */}
        <Card className="card-farm -mt-8 relative z-10 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary" size={24} />
              {t('cropSoil.soilMonitoring.title')}
            </h2>
            <Badge className="bg-green-100 text-green-800">
              {t('cropSoil.soilMonitoring.live')}
            </Badge>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
              <Droplets className="text-accent mx-auto mb-2" size={24} />
              <p className="text-sm text-muted-foreground">{t('cropSoil.soilMonitoring.moisture')}</p>
              <p className="font-bold text-xl">{soilData.moisture}%</p>
              <Progress value={soilData.moisture} className="mt-2 h-2" />
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <Thermometer className="text-primary mx-auto mb-2" size={24} />
              <p className="text-sm text-muted-foreground">{t('cropSoil.soilMonitoring.temperature')}</p>
              <p className="font-bold text-xl">{soilData.temperature}°C</p>
              <div className="text-xs text-muted-foreground mt-1">
                {t('cropSoil.soilMonitoring.optimal')}
              </div>
            </div>
          </div>

          {/* Nutrient Levels */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{t('cropSoil.soilMonitoring.nutrients')}</h3>
            
            {[
              { name: 'N (Nitrogen)', value: soilData.nitrogen, key: 'nitrogen' },
              { name: 'P (Phosphorus)', value: soilData.phosphorus, key: 'phosphorus' },
              { name: 'K (Potassium)', value: soilData.potassium, key: 'potassium' }
            ].map((nutrient) => {
              const status = getNutrientStatus(nutrient.value);
              return (
                <div key={nutrient.key} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${status.bgColor}`}></div>
                    <span className="font-medium">{nutrient.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={nutrient.value} className="w-20 h-2" />
                    <span className="font-bold min-w-[3rem]">{nutrient.value}%</span>
                    <Badge className={`${status.color} text-xs`}>
                      {status.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-golden/10 border border-golden/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-golden" size={16} />
              <span className="text-sm font-medium text-golden-foreground">
                pH Level: {soilData.ph} - {t('cropSoil.soilMonitoring.phStatus')}
              </span>
            </div>
          </div>
        </Card>

        {/* AI Crop Recommendations */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Leaf className="text-primary" size={20} />
            {t('cropSoil.recommendations.title')}
          </h3>
          
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="border border-border rounded-lg p-4 animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base">{rec.crop}</h4>
                  <Badge className={getSuitabilityColor(rec.suitability)}>
                    {rec.suitability}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {t('cropSoil.recommendations.expectedYield')}: {rec.expectedYield}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Crop Rotation Suggestions */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <RotateCcw className="text-accent" size={20} />
            {t('cropSoil.rotation.title')}
          </h3>
          
          <div className="space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{t('cropSoil.rotation.currentSeason')}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {t('cropSoil.rotation.currentCrop')}: Wheat (Rabi Season)
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    {t('cropSoil.rotation.nextRecommended')}: {regionalData.name === 'Punjab' ? 'Rice' : 'Cotton'} (Kharif)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">
                    {t('cropSoil.rotation.afterNext')}: Mustard (Rabi) 
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-primary mb-1">
                    {t('cropSoil.rotation.benefit')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t('cropSoil.rotation.benefitDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Predictive Irrigation */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Droplets className="text-accent" size={20} />
            {t('cropSoil.irrigation.title')}
          </h3>
          
          <div className="space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{t('cropSoil.irrigation.next')}</h4>
                <Badge className="bg-accent/20 text-accent">
                  {t('cropSoil.irrigation.aiPredicted')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <Calendar className="text-accent mx-auto mb-1" size={20} />
                  <p className="text-xs text-muted-foreground">{t('cropSoil.irrigation.date')}</p>
                  <p className="font-bold">
                    {irrigationSchedule.nextIrrigation.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="text-accent mx-auto mb-1" size={20} />
                  <p className="text-xs text-muted-foreground">{t('cropSoil.irrigation.duration')}</p>
                  <p className="font-bold">{irrigationSchedule.duration} {t('cropSoil.irrigation.minutes')}</p>
                </div>
              </div>
              
              <div className="bg-accent/5 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  💧 {irrigationSchedule.waterAmount}L/m² • {irrigationSchedule.reason}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 border-2 border-primary text-primary hover:bg-primary/10"
              >
                <Droplets size={16} className="mr-2" />
                {t('cropSoil.irrigation.irrigateNow')}
              </Button>
              <Button 
                variant="outline"
                className="h-12 border-2 border-accent text-accent hover:bg-accent/10"
              >
                <Calendar size={16} className="mr-2" />
                {t('cropSoil.irrigation.schedule')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Disease Detection Integration */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Camera className="text-golden" size={20} />
            {t('cropSoil.diseaseDetection.title')}
          </h3>
          
          <div className="bg-golden/10 border border-golden/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-golden" size={20} />
              <span className="font-semibold text-golden-foreground">
                {t('cropSoil.diseaseDetection.aiMonitoring')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t('cropSoil.diseaseDetection.description')}
            </p>
            
            <Button className="w-full btn-golden">
              <Camera size={16} className="mr-2" />
              {t('cropSoil.diseaseDetection.scanNow')}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {t('cropSoil.diseaseDetection.lastScan')}: {t('cropSoil.diseaseDetection.noIssues')}
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CropSoilManagement;