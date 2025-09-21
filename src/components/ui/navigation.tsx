import { Home, Mic, Camera, Calendar, Cloud, TrendingUp, User, Leaf, Sprout } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";


export const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('navigation.home'), path: "/" },
    { icon: Mic, label: t('navigation.voice'), path: "/voice" },
    { icon: Camera, label: t('navigation.scan'), path: "/camera" },
    { icon: Sprout, label: t('navigation.cropSoil'), path: "/crop-soil" },
    { icon: Calendar, label: t('navigation.calendar'), path: "/calendar" },
    { icon: Leaf, label: t('navigation.sustainability'), path: "/sustainability" },
    { icon: Cloud, label: t('navigation.weather'), path: "/weather" },
    { icon: TrendingUp, label: t('navigation.market'), path: "/market" },
    { icon: User, label: t('navigation.profile'), path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex justify-around items-center py-2 px-1 overflow-x-auto scrollbar-hide">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 min-w-[55px] flex-shrink-0",
              location.pathname === item.path
                ? "text-primary bg-primary/10 transform scale-110"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <item.icon 
              size={20} 
              className={cn(
                "transition-all duration-300",
                location.pathname === item.path && "animate-bounce-subtle"
              )}
            />
            <span className="text-[10px] mt-1 font-medium leading-tight text-center">{item.label}</span>
          </Link>
        ))}
      </div>
      
      {/* Second row for remaining items */}
      {navItems.length > 5 && (
        <div className="flex justify-around items-center py-2 px-1 border-t border-border/50">
          {navItems.slice(5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 min-w-[55px] flex-shrink-0",
                location.pathname === item.path
                  ? "text-primary bg-primary/10 transform scale-110"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-all duration-300",
                  location.pathname === item.path && "animate-bounce-subtle"
                )}
              />
              <span className="text-[10px] mt-1 font-medium leading-tight text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};