import { useState } from "react";
import { 
  User, 
  MapPin, 
  Phone, 
  Award, 
  Coins, 
  Calendar,
  TrendingUp,
  Camera,
  Mic,
  BarChart3,
  Gift
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BottomNavigation } from "@/components/ui/navigation";

interface UserProfile {
  name: string;
  phone: string;
  location: string;
  farmSize: string;
  joinDate: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  totalCoins: number;
  achievements: Array<{
    title: string;
    description: string;
    icon: any;
    unlocked: boolean;
    date?: string;
  }>;
  stats: {
    scansCompleted: number;
    voiceQueries: number;
    weatherChecks: number;
    marketViews: number;
  };
}

const Profile = () => {
  const [user] = useState<UserProfile>({
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    location: "Village Khanna, Punjab",
    farmSize: "5 acres",
    joinDate: "January 2024",
    level: 3,
    experience: 750,
    nextLevelExp: 1000,
    totalCoins: 1250,
    achievements: [
      {
        title: "First Scan",
        description: "Completed your first crop scan",
        icon: Camera,
        unlocked: true,
        date: "Jan 15, 2024"
      },
      {
        title: "Voice Expert",
        description: "Asked 50+ voice queries",
        icon: Mic,
        unlocked: true,
        date: "Feb 3, 2024"
      },
      {
        title: "Weather Watcher",
        description: "Check weather daily for 30 days",
        icon: BarChart3,
        unlocked: false
      },
      {
        title: "Market Master",
        description: "Track prices for 100+ crops",
        icon: TrendingUp,
        unlocked: false
      }
    ],
    stats: {
      scansCompleted: 47,
      voiceQueries: 89,
      weatherChecks: 156,
      marketViews: 234
    }
  });

  const progressPercent = (user.experience / user.nextLevelExp) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-earth text-white p-6 pt-12">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-white/90">Track your farming journey</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="card-farm -mt-8 relative z-10 animate-slide-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Phone size={14} />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <MapPin size={14} />
                <span className="text-sm">{user.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium">Farm Size</p>
              <p className="font-bold text-lg">{user.farmSize}</p>
            </div>
            <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-accent font-medium">Member Since</p>
              <p className="font-bold text-lg">{user.joinDate}</p>
            </div>
          </div>
        </Card>

        {/* Level & Experience */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Farming Level</h3>
            <Badge className="bg-golden text-golden-foreground">
              Level {user.level}
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {user.experience} / {user.nextLevelExp} XP
              </span>
              <span className="text-sm font-medium text-primary">
                {user.nextLevelExp - user.experience} XP to next level
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>

          <div className="flex items-center gap-3 p-3 bg-golden/10 rounded-lg border border-golden/20">
            <Coins className="text-golden animate-float" size={24} />
            <div>
              <p className="font-bold text-golden text-lg">{user.totalCoins} Coins</p>
              <p className="text-sm text-golden-foreground">Earn more by using the app!</p>
            </div>
          </div>
        </Card>

        {/* Usage Statistics */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="text-accent" size={20} />
            Usage Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
              <Camera className="text-accent mx-auto mb-2 animate-bounce-subtle" size={24} />
              <p className="font-bold text-lg">{user.stats.scansCompleted}</p>
              <p className="text-xs text-muted-foreground">Scans Completed</p>
            </div>

            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <Mic className="text-primary mx-auto mb-2 animate-bounce-subtle" size={24} />
              <p className="font-bold text-lg">{user.stats.voiceQueries}</p>
              <p className="text-xs text-muted-foreground">Voice Queries</p>
            </div>

            <div className="text-center p-4 bg-golden/10 rounded-lg border border-golden/20">
              <TrendingUp className="text-golden mx-auto mb-2 animate-bounce-subtle" size={24} />
              <p className="font-bold text-lg">{user.stats.marketViews}</p>
              <p className="text-xs text-muted-foreground">Market Views</p>
            </div>

            <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <Calendar className="text-secondary mx-auto mb-2 animate-bounce-subtle" size={24} />
              <p className="font-bold text-lg">{user.stats.weatherChecks}</p>
              <p className="text-xs text-muted-foreground">Weather Checks</p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="text-golden" size={20} />
            Achievements
          </h3>

          <div className="space-y-3">
            {user.achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    <achievement.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${
                      achievement.unlocked ? "text-green-800" : "text-gray-500"
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.date && (
                      <p className="text-xs text-green-600 mt-1">
                        Unlocked: {achievement.date}
                      </p>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-100 text-green-800">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rewards */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Gift className="text-golden" size={20} />
            Redeem Rewards
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div>
                <p className="font-medium">Free Soil Test</p>
                <p className="text-sm text-muted-foreground">500 coins</p>
              </div>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Redeem
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-golden/10 border border-golden/20 rounded-lg">
              <div>
                <p className="font-medium">Fertilizer Discount</p>
                <p className="text-sm text-muted-foreground">750 coins</p>
              </div>
              <Button variant="outline" className="border-golden text-golden-foreground hover:bg-golden/10">
                Redeem
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div>
                <p className="font-medium">Expert Consultation</p>
                <p className="text-sm text-muted-foreground">1000 coins</p>
              </div>
              <Button variant="outline" className="border-accent text-accent-foreground hover:bg-accent/10">
                Redeem
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;