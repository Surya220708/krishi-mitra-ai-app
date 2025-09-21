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
  Camera,
  X,
  Play,
  Pause,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "@/contexts/LocationContext";
import { useSoilMonitoring } from "@/hooks/useSoilMonitoring";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const {
    soilData,
    soilHistory,
    alerts,
    irrigationHistory,
    isActive,
    irrigateNow,
    scheduleIrrigation,
    toggleMonitoring,
    dismissAlert,
    getSoilHealthScore
  } = useSoilMonitoring();

  const [showAlerts, setShowAlerts] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isIrrigating, setIsIrrigating] = useState(false);
  
  const healthScore = getSoilHealthScore();

  // Dynamic crop recommendations based on real soil data
  const getRecommendations = (): CropRecommendation[] => {
    const recs: CropRecommendation[] = [];
    
    if (soilData.moisture >= 60 && soilData.nitrogen >= 70 && soilData.ph >= 6.0 && soilData.ph <= 7.0) {
      recs.push({
        crop: regionalData.name === 'Punjab' ? 'Wheat' : 'Cotton',
        suitability: "Excellent",
        expectedYield: regionalData.name === 'Punjab' ? "4.8 tons/hectare" : "2.2 tons/hectare",
        reason: "Optimal soil conditions with excellent moisture, pH, and nutrients"
      });
    }
    
    if (soilData.moisture >= 70) {
      recs.push({
        crop: 'Rice',
        suitability: soilData.phosphorus >= 50 ? "Excellent" : "Good",
        expectedYield: "6.5 tons/hectare",
        reason: soilData.phosphorus >= 50 ? "Perfect moisture and nutrients" : "High moisture, needs phosphorus boost"
      });
    }
    
    if (soilData.nitrogen < 60) {
      recs.push({
        crop: 'Legumes (Peas)',
        suitability: "Good",
        expectedYield: "2.8 tons/hectare",
        reason: "Will naturally fix nitrogen in soil while producing yield"
      });
    }
    
    return recs.length > 0 ? recs : [{
      crop: 'Corn',
      suitability: "Fair",
      expectedYield: "3.5 tons/hectare",
      reason: "Requires soil improvement for optimal growth"
    }];
  };

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>(getRecommendations());

  // Update recommendations when soil data changes
  useEffect(() => {
    setRecommendations(getRecommendations());
  }, [soilData, regionalData]);

  const [irrigationSchedule] = useState<IrrigationSchedule>({
    nextIrrigation: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 45,
    reason: `Soil moisture at ${soilData.moisture}%, next irrigation based on AI prediction`,
    waterAmount: 25
  });

  const handleIrrigateNow = async () => {
    setIsIrrigating(true);
    await irrigateNow(30, 22);
    setTimeout(() => setIsIrrigating(false), 3000);
  };

  const handleScheduleIrrigation = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0); // 6 AM tomorrow
    scheduleIrrigation(tomorrow, 45, 25);
  };

  const handleScanCrop = () => {
    navigate('/camera');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp size={14} className="text-green-600" />;
      case 'down': return <ArrowDown size={14} className="text-red-600" />;
      default: return <Minus size={14} className="text-gray-600" />;
    }
  };

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
        {/* Real-time Alerts */}
        {showAlerts && alerts.length > 0 && (
          <div className="space-y-2 -mt-8 relative z-20 animate-slide-up">
            {alerts.slice(0, 3).map((alert) => (
              <Card key={alert.id} className={`p-3 border-l-4 ${
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                alert.type === 'error' ? 'border-l-red-500 bg-red-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className={
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'error' ? 'text-red-600' : 'text-blue-600'
                    } />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X size={12} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Soil Health Score */}
        <Card className="card-farm -mt-8 relative z-10 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              Soil Health Score
            </h2>
            <div className="flex items-center gap-2">
              <Badge className={`${healthScore.overall >= 80 ? 'bg-green-100 text-green-800' :
                healthScore.overall >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthScore.overall}%
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Moisture:</span>
              <span className="font-medium">{healthScore.moisture}%</span>
            </div>
            <div className="flex justify-between">
              <span>pH Balance:</span>
              <span className="font-medium">{healthScore.ph}%</span>
            </div>
            <div className="flex justify-between">
              <span>Nitrogen:</span>
              <span className="font-medium">{healthScore.nitrogen}%</span>
            </div>
            <div className="flex justify-between">
              <span>Phosphorus:</span>
              <span className="font-medium">{healthScore.phosphorus}%</span>
            </div>
          </div>
          
          <Progress value={healthScore.overall} className="mt-3 h-3" />
        </Card>

        {/* Real-time Soil Monitoring */}
        <Card className="card-farm animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary" size={24} />
              {t('cropSoil.soilMonitoring.title')}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {isActive ? t('cropSoil.soilMonitoring.live') : 'Paused'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMonitoring}
                className="h-8 w-8 p-0"
              >
                {isActive ? <Pause size={14} /> : <Play size={14} />}
              </Button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center relative">
              <div className="absolute top-2 right-2">
                {getTrendIcon(soilData.trend)}
              </div>
              <Droplets className="text-accent mx-auto mb-2" size={24} />
              <p className="text-sm text-muted-foreground">{t('cropSoil.soilMonitoring.moisture')}</p>
              <p className="font-bold text-xl">{soilData.moisture.toFixed(1)}%</p>
              <Progress value={soilData.moisture} className="mt-2 h-2" />
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <Thermometer className="text-primary mx-auto mb-2" size={24} />
              <p className="text-sm text-muted-foreground">{t('cropSoil.soilMonitoring.temperature')}</p>
              <p className="font-bold text-xl">{soilData.temperature.toFixed(1)}°C</p>
              <div className="text-xs text-muted-foreground mt-1">
                {soilData.temperature >= 20 && soilData.temperature <= 28 ? 
                  t('cropSoil.soilMonitoring.optimal') : 
                  soilData.temperature < 20 ? 'Cool' : 'Hot'
                }
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
                    <span className="font-bold min-w-[3rem]">{nutrient.value.toFixed(0)}%</span>
                    <Badge className={`${status.color} text-xs min-w-[60px] text-center`}>
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
                pH Level: {soilData.ph.toFixed(1)} - {
                  soilData.ph >= 6.0 && soilData.ph <= 7.5 ? 
                    t('cropSoil.soilMonitoring.phStatus') : 
                    soilData.ph < 6.0 ? 'Acidic - Needs Lime' : 'Alkaline - Needs Sulfur'
                }
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Last updated: {soilData.lastUpdated.toLocaleTimeString()}
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
                className={`h-12 border-2 transition-all ${
                  isIrrigating 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
                onClick={handleIrrigateNow}
                disabled={isIrrigating}
              >
                {isIrrigating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2" />
                    Irrigating...
                  </>
                ) : (
                  <>
                    <Droplets size={16} className="mr-2" />
                    {t('cropSoil.irrigation.irrigateNow')}
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                className="h-12 border-2 border-accent text-accent hover:bg-accent/10"
                onClick={handleScheduleIrrigation}
              >
                <Calendar size={16} className="mr-2" />
                {t('cropSoil.irrigation.schedule')}
              </Button>
            </div>
            
            {/* Irrigation History */}
            {irrigationHistory.length > 0 && (
              <div className="mt-4 p-3 bg-accent/5 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Recent Irrigation</h5>
                <div className="space-y-1">
                  {irrigationHistory.slice(-3).reverse().map((event) => (
                    <div key={event.id} className="flex justify-between text-xs text-muted-foreground">
                      <span>{event.timestamp.toLocaleDateString()} - {event.type}</span>
                      <span>{event.amount}L/m² • {event.duration}min</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            
            <Button 
              className="w-full btn-golden"
              onClick={handleScanCrop}
            >
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