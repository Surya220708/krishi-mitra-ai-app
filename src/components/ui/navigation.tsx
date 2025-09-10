import { Home, Mic, Camera, Cloud, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Mic, label: "Voice", path: "/voice" },
  { icon: Camera, label: "Scan", path: "/camera" },
  { icon: Cloud, label: "Weather", path: "/weather" },
  { icon: TrendingUp, label: "Market", path: "/market" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();

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