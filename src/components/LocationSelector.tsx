import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocation, StateCode, REGIONAL_DATA } from '@/contexts/LocationContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const LocationSelector = () => {
  const { currentState, setCurrentState, regionalData } = useLocation();
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);

  const states: StateCode[] = ['punjab', 'tamilnadu', 'andhrapradesh'];

  const handleStateSelect = (state: StateCode) => {
    setCurrentState(state);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-background/10 border-white/20 text-white hover:bg-white/20">
          <MapPin size={16} />
          <span className="hidden sm:inline">{regionalData.name}</span>
          <span className="sm:hidden">{regionalData.nativeName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="text-primary" size={20} />
            Select Your State
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {states.map((state) => (
            <Card 
              key={state}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                currentState === state 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleStateSelect(state)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {REGIONAL_DATA[state].name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {REGIONAL_DATA[state].nativeName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Major crops: {REGIONAL_DATA[state].majorCrops.slice(0, 3).join(', ')}
                  </p>
                </div>
                {currentState === state && (
                  <Check className="text-primary" size={20} />
                )}
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};