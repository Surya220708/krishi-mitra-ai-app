import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SoilData {
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
}

export interface SoilAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  parameter: string;
  timestamp: Date;
}

export interface IrrigationEvent {
  id: string;
  timestamp: Date;
  duration: number;
  amount: number;
  type: 'manual' | 'scheduled' | 'emergency';
}

export const useSoilMonitoring = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(true);
  const [soilHistory, setSoilHistory] = useState<SoilData[]>([]);
  const [alerts, setAlerts] = useState<SoilAlert[]>([]);
  const [irrigationHistory, setIrrigationHistory] = useState<IrrigationEvent[]>([]);
  
  const [soilData, setSoilData] = useState<SoilData>({
    moisture: 65,
    ph: 6.8,
    nitrogen: 78,
    phosphorus: 45,
    potassium: 82,
    temperature: 24,
    lastUpdated: new Date(),
    trend: 'stable'
  });

  // Simulate real-time soil sensor updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSoilData(prev => {
        const trendValue = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable';
        const newData: SoilData = {
          ...prev,
          moisture: Math.max(20, Math.min(90, prev.moisture + (Math.random() - 0.5) * 3)),
          ph: Math.max(5.5, Math.min(8.5, prev.ph + (Math.random() - 0.5) * 0.2)),
          nitrogen: Math.max(10, Math.min(100, prev.nitrogen + (Math.random() - 0.5) * 4)),
          phosphorus: Math.max(10, Math.min(100, prev.phosphorus + (Math.random() - 0.5) * 3)),
          potassium: Math.max(10, Math.min(100, prev.potassium + (Math.random() - 0.5) * 2)),
          temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 1.5)),
          lastUpdated: new Date(),
          trend: trendValue as 'up' | 'down' | 'stable'
        };

        // Check for alerts
        checkSoilAlerts(newData, prev);
        
        // Store in history (keep last 50 readings)
        setSoilHistory(history => {
          const newHistory = [...history, newData];
          return newHistory.length > 50 ? newHistory.slice(-50) : newHistory;
        });

        return newData;
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  const checkSoilAlerts = (current: SoilData, previous: SoilData) => {
    const newAlerts: SoilAlert[] = [];

    // Moisture alerts
    if (current.moisture < 30) {
      newAlerts.push({
        id: Date.now() + '-moisture-low',
        type: 'warning',
        message: 'Soil moisture is critically low. Consider immediate irrigation.',
        parameter: 'moisture',
        timestamp: new Date()
      });
    } else if (current.moisture > 85) {
      newAlerts.push({
        id: Date.now() + '-moisture-high',
        type: 'warning',
        message: 'Soil moisture is very high. Check drainage system.',
        parameter: 'moisture',
        timestamp: new Date()
      });
    }

    // pH alerts
    if (current.ph < 6.0 || current.ph > 7.5) {
      newAlerts.push({
        id: Date.now() + '-ph',
        type: 'warning',
        message: `Soil pH (${current.ph.toFixed(1)}) is outside optimal range. Consider soil amendment.`,
        parameter: 'ph',
        timestamp: new Date()
      });
    }

    // Nutrient alerts
    if (current.nitrogen < 40) {
      newAlerts.push({
        id: Date.now() + '-nitrogen',
        type: 'warning',
        message: 'Nitrogen levels are low. Consider fertilizer application.',
        parameter: 'nitrogen',
        timestamp: new Date()
      });
    }

    if (current.phosphorus < 30) {
      newAlerts.push({
        id: Date.now() + '-phosphorus',
        type: 'warning',
        message: 'Phosphorus levels are low. Apply phosphate fertilizer.',
        parameter: 'phosphorus',
        timestamp: new Date()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const updatedAlerts = [...prev, ...newAlerts];
        // Keep only last 10 alerts
        return updatedAlerts.slice(-10);
      });

      // Show toast for critical alerts
      newAlerts.forEach(alert => {
        if (alert.type === 'warning') {
          toast({
            title: "Soil Alert",
            description: alert.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  const irrigateNow = async (duration: number = 30, amount: number = 20) => {
    const irrigationEvent: IrrigationEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      duration,
      amount,
      type: 'manual'
    };

    setIrrigationHistory(prev => [...prev, irrigationEvent]);
    
    toast({
      title: "Irrigation Started",
      description: `Manual irrigation for ${duration} minutes (${amount}L/m²)`,
    });

    // Simulate irrigation effect on soil moisture
    setTimeout(() => {
      setSoilData(prev => ({
        ...prev,
        moisture: Math.min(90, prev.moisture + amount * 0.8),
        lastUpdated: new Date(),
        trend: 'up'
      }));

      toast({
        title: "Irrigation Complete",
        description: "Soil moisture levels updated",
      });
    }, 3000); // Simulate 3 second irrigation
  };

  const scheduleIrrigation = (date: Date, duration: number, amount: number) => {
    const irrigationEvent: IrrigationEvent = {
      id: Date.now().toString(),
      timestamp: date,
      duration,
      amount,
      type: 'scheduled'
    };

    setIrrigationHistory(prev => [...prev, irrigationEvent]);
    
    toast({
      title: "Irrigation Scheduled",
      description: `Scheduled for ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`,
    });
  };

  const toggleMonitoring = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Monitoring Stopped" : "Monitoring Started",
      description: isActive ? "Soil sensors deactivated" : "Soil sensors activated",
    });
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSoilHealthScore = () => {
    const moistureScore = soilData.moisture >= 40 && soilData.moisture <= 70 ? 100 : 
                         Math.max(0, 100 - Math.abs(soilData.moisture - 55) * 2);
    
    const phScore = soilData.ph >= 6.0 && soilData.ph <= 7.5 ? 100 :
                   Math.max(0, 100 - Math.abs(soilData.ph - 6.75) * 40);
    
    const nitrogenScore = soilData.nitrogen >= 60 ? 100 : soilData.nitrogen * 1.67;
    const phosphorusScore = soilData.phosphorus >= 50 ? 100 : soilData.phosphorus * 2;
    const potassiumScore = soilData.potassium >= 60 ? 100 : soilData.potassium * 1.67;
    
    const overallScore = (moistureScore + phScore + nitrogenScore + phosphorusScore + potassiumScore) / 5;
    
    return {
      overall: Math.round(overallScore),
      moisture: Math.round(moistureScore),
      ph: Math.round(phScore),
      nitrogen: Math.round(nitrogenScore),
      phosphorus: Math.round(phosphorusScore),
      potassium: Math.round(potassiumScore)
    };
  };

  return {
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
  };
};
