import { Home, Mic, Camera, Cloud, TrendingUp, User } from "lucide-react";
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
    { icon: Cloud, label: t('navigation.weather'), path: "/weather" },
    { icon: TrendingUp, label: t('navigation.market'), path: "/market" },
    { icon: User, label: t('navigation.profile'), path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 min-w-[60px]",
              location.pathname === item.path
                ? "text-primary bg-primary/10 transform scale-110"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <item.icon 
              size={24} 
              className={cn(
                "transition-all duration-300",
                location.pathname === item.path && "animate-bounce-subtle"
              )}
            />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};