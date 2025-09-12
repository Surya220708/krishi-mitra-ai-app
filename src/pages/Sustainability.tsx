import React, { useState, useEffect } from "react";
import { Leaf, Award, Trophy, Target, Droplets, Bug, Recycle, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/use-toast";

interface SustainabilityPractice {
  id: string;
  type: 'water_saving' | 'organic_farming' | 'pest_control' | 'soil_health' | 'energy_saving';
  points: number;
  description: string;
  date: Date;
  verified: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: typeof Leaf;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const Sustainability = () => {
  const { t } = useLanguage();
  const [greenScore, setGreenScore] = useState(750);
  const [currentLevel, setCurrentLevel] = useState("Eco Champion");
  const [practices, setPractices] = useState<SustainabilityPractice[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyPoints, setWeeklyPoints] = useState(120);

  // Initialize sample data
  useEffect(() => {
    const samplePractices: SustainabilityPractice[] = [
      {
        id: "1",
        type: "water_saving",
        points: 50,
        description: t('sustainability.practices.dripIrrigation'),
        date: new Date(),
        verified: true
      },
      {
        id: "2", 
        type: "organic_farming",
        points: 75,
        description: t('sustainability.practices.organicFertilizer'),
        date: new Date(Date.now() - 86400000),
        verified: true
      },
      {
        id: "3",
        type: "pest_control",
        points: 60,
        description: t('sustainability.practices.biologicalPestControl'),
        date: new Date(Date.now() - 2 * 86400000),
        verified: false
      }
    ];

    const sampleAchievements: Achievement[] = [
      {
        id: "1",
        title: t('sustainability.achievements.waterSaver.title'),
        description: t('sustainability.achievements.waterSaver.description'),
        points: 100,
        icon: Droplets,
        unlocked: true,
        progress: 10,
        maxProgress: 10
      },
      {
        id: "2",
        title: t('sustainability.achievements.organicFarmer.title'), 
        description: t('sustainability.achievements.organicFarmer.description'),
        points: 200,
        icon: Leaf,
        unlocked: true,
        progress: 5,
        maxProgress: 5
      },
      {
        id: "3",
        title: t('sustainability.achievements.ecoWarrior.title'),
        description: t('sustainability.achievements.ecoWarrior.description'),
        points: 500,
        icon: Trophy,
        unlocked: false,
        progress: 7,
        maxProgress: 20
      }
    ];

    setPractices(samplePractices);
    setAchievements(sampleAchievements);
  }, [t]);

  const getScoreLevel = (score: number) => {
    if (score >= 1000) return { level: t('sustainability.levels.ecoMaster'), color: "bg-green-600", nextLevel: 1500 };
    if (score >= 750) return { level: t('sustainability.levels.ecoChampion'), color: "bg-green-500", nextLevel: 1000 };
    if (score >= 500) return { level: t('sustainability.levels.greenFarmer'), color: "bg-yellow-500", nextLevel: 750 };
    if (score >= 250) return { level: t('sustainability.levels.ecoLearner'), color: "bg-orange-500", nextLevel: 500 };
    return { level: t('sustainability.levels.beginner'), color: "bg-gray-500", nextLevel: 250 };
  };

  const addPractice = (type: SustainabilityPractice['type'], points: number, description: string) => {
    const newPractice: SustainabilityPractice = {
      id: Date.now().toString(),
      type,
      points,
      description,
      date: new Date(),
      verified: false
    };
    
    setPractices(prev => [newPractice, ...prev]);
    setGreenScore(prev => prev + points);
    setWeeklyPoints(prev => prev + points);
    
    toast({
      title: t('sustainability.practiceAdded'),
      description: `+${points} ${t('sustainability.points')}`,
    });
  };

  const scoreLevel = getScoreLevel(greenScore);
  const progressToNext = ((greenScore % 250) / 250) * 100;

  const practiceIcons = {
    water_saving: Droplets,
    organic_farming: Leaf,
    pest_control: Bug,
    soil_health: Recycle,
    energy_saving: TrendingUp
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 pt-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Leaf size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('sustainability.title')}</h1>
            <p className="text-white/90">{t('sustainability.subtitle')}</p>
          </div>
        </div>

        {/* Green Score Display */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="text-yellow-400" size={24} />
              <span className="text-3xl font-bold">{greenScore}</span>
              <span className="text-white/80">{t('sustainability.greenScore')}</span>
            </div>
            
            <Badge className={`${scoreLevel.color} text-white mb-4`}>
              {scoreLevel.level}
            </Badge>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>{t('sustainability.nextLevel')}</span>
                <span>{scoreLevel.nextLevel - greenScore} {t('sustainability.pointsToGo')}</span>
              </div>
              <Progress value={progressToNext} className="bg-white/20" />
            </div>
          </div>
        </Card>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Weekly Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('sustainability.weeklyProgress')}</h3>
            <Badge variant="outline" className="gap-1">
              <TrendingUp size={16} />
              +{weeklyPoints} {t('sustainability.thisWeek')}
            </Badge>
          </div>
          <Progress value={(weeklyPoints / 200) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {200 - weeklyPoints} {t('sustainability.pointsToWeeklyGoal')}
          </p>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">{t('sustainability.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => addPractice('water_saving', 50, t('sustainability.practices.dripIrrigation'))}
            >
              <Droplets className="text-blue-500" size={24} />
              <span className="text-xs text-center">{t('sustainability.actions.waterSaving')}</span>
              <Badge variant="secondary" className="text-xs">+50 pts</Badge>
            </Button>
            
            <Button
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => addPractice('organic_farming', 75, t('sustainability.practices.organicFertilizer'))}
            >
              <Leaf className="text-green-500" size={24} />
              <span className="text-xs text-center">{t('sustainability.actions.organicPractice')}</span>
              <Badge variant="secondary" className="text-xs">+75 pts</Badge>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => addPractice('pest_control', 60, t('sustainability.practices.biologicalPestControl'))}
            >
              <Bug className="text-orange-500" size={24} />
              <span className="text-xs text-center">{t('sustainability.actions.bioPestControl')}</span>
              <Badge variant="secondary" className="text-xs">+60 pts</Badge>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => addPractice('energy_saving', 40, t('sustainability.practices.solarPumps'))}
            >
              <TrendingUp className="text-purple-500" size={24} />
              <span className="text-xs text-center">{t('sustainability.actions.energySaving')}</span>
              <Badge variant="secondary" className="text-xs">+40 pts</Badge>
            </Button>
          </div>
        </Card>

        {/* Achievements */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">{t('sustainability.achievements.title')}</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-muted/50'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      {achievement.unlocked && <Badge className="bg-green-500 text-white text-xs">
                        {t('sustainability.unlocked')}
                      </Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="flex-1 h-2"
                      />
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {achievement.points} pts
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">{t('sustainability.recentActivities')}</h3>
          <div className="space-y-3">
            {practices.slice(0, 5).map((practice) => {
              const Icon = practiceIcons[practice.type];
              return (
                <div key={practice.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Icon size={18} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm">{practice.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {practice.date.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <Badge className="bg-green-500 text-white text-xs mb-1">
                      +{practice.points} pts
                    </Badge>
                    {practice.verified && (
                      <div className="text-xs text-green-600">
                        ✓ {t('sustainability.verified')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Sustainability;