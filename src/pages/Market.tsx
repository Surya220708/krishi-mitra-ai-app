import { useState } from "react";
import { TrendingUp, TrendingDown, MapPin, Calendar, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/ui/navigation";

interface CropPrice {
  name: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  mandi: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
}

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", "Grains", "Vegetables", "Fruits", "Pulses"];
  
  const marketData: CropPrice[] = [
    {
      name: "Wheat",
      currentPrice: 2100,
      previousPrice: 2050,
      unit: "per quintal",
      mandi: "Ludhiana Mandi",
      trend: "up",
      changePercent: 2.4
    },
    {
      name: "Rice (Basmati)",
      currentPrice: 4500,
      previousPrice: 4600,
      unit: "per quintal",
      mandi: "Amritsar Mandi",
      trend: "down",
      changePercent: -2.2
    },
    {
      name: "Tomato",
      currentPrice: 25,
      previousPrice: 22,
      unit: "per kg",
      mandi: "Chandigarh Mandi",
      trend: "up",
      changePercent: 13.6
    },
    {
      name: "Onion",
      currentPrice: 18,
      previousPrice: 20,
      unit: "per kg",
      mandi: "Punjab Mandi",
      trend: "down",
      changePercent: -10.0
    },
    {
      name: "Potato",
      currentPrice: 12,
      previousPrice: 12,
      unit: "per kg",
      mandi: "Jalandhar Mandi",
      trend: "stable",
      changePercent: 0
    },
    {
      name: "Sugarcane",
      currentPrice: 320,
      previousPrice: 310,
      unit: "per quintal",
      mandi: "Patiala Mandi",
      trend: "up",
      changePercent: 3.2
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp size={16} className="text-green-600" />;
      case "down": return <TrendingDown size={16} className="text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600 bg-green-50 border-green-200";
      case "down": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredData = marketData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6 pt-12">
        <h1 className="text-2xl font-bold mb-2 animate-fade-in">Market Prices</h1>
        <div className="flex items-center gap-2 text-primary-foreground/90">
          <Calendar size={16} />
          <span>Updated: Today, 2:30 PM</span>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Search */}
        <div className="animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`px-4 py-2 cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-primary/20 text-primary hover:bg-primary/10"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Market Summary */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-bold text-lg mb-4">Today's Market Summary</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
              <p className="text-xs text-green-600 font-medium">Rising</p>
              <p className="font-bold text-green-800">3 crops</p>
            </div>
            
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <TrendingDown className="text-red-600 mx-auto mb-2" size={24} />
              <p className="text-xs text-red-600 font-medium">Falling</p>
              <p className="font-bold text-red-800">2 crops</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-gray-600 font-medium">Stable</p>
              <p className="font-bold text-gray-800">1 crop</p>
            </div>
          </div>
        </Card>

        {/* Price List */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg">Current Prices</h3>
          
          {filteredData.map((item, index) => (
            <Card 
              key={index} 
              className="card-farm animate-slide-up"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-foreground">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.mandi}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xl text-foreground">
                      ₹{item.currentPrice}
                    </span>
                    {getTrendIcon(item.trend)}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.unit}
                  </p>
                  
                  {item.trend !== "stable" && (
                    <Badge className={`text-xs ${getTrendColor(item.trend)}`}>
                      {item.trend === "up" ? "+" : ""}{item.changePercent}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Previous: ₹{item.previousPrice}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    View Details →
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Best Selling Tips */}
        <Card className="card-farm animate-slide-up" style={{ animationDelay: "0.9s" }}>
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
            <TrendingUp className="text-golden" size={20} />
            Selling Tips
          </h4>
          
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm font-medium text-primary mb-1">
                💡 Best Time to Sell
              </p>
              <p className="text-sm">
                Wheat prices are trending up. Consider selling within next 2-3 days for better rates.
              </p>
            </div>
            
            <div className="bg-golden/10 border border-golden/20 rounded-lg p-3">
              <p className="text-sm font-medium text-golden-foreground mb-1">
                📍 Nearby High-Price Mandis
              </p>
              <p className="text-sm">
                Ludhiana Mandi offering ₹50/quintal more for wheat compared to local markets.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Market;