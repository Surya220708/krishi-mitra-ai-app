import React, { createContext, useContext, useState, useEffect } from 'react';

export type StateCode = 'punjab' | 'tamilnadu' | 'andhrapradesh';

export interface RegionalData {
  name: string;
  nativeName: string;
  majorCrops: string[];
  seasons: {
    kharif: string[];
    rabi: string[];
    summer: string[];
  };
  soilTypes: string[];
  avgRainfall: string;
  temperature: {
    min: string;
    max: string;
  };
  marketCenters: string[];
  tips: string[];
}

export const REGIONAL_DATA: Record<StateCode, RegionalData> = {
  punjab: {
    name: "Punjab",
    nativeName: "ਪੰਜਾਬ",
    majorCrops: ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize"],
    seasons: {
      kharif: ["Rice", "Cotton", "Sugarcane"],
      rabi: ["Wheat", "Barley", "Mustard"],
      summer: ["Fodder", "Vegetables"]
    },
    soilTypes: ["Alluvial", "Sandy Loam", "Clay Loam"],
    avgRainfall: "600-800mm",
    temperature: { min: "5°C", max: "45°C" },
    marketCenters: ["Chandigarh", "Ludhiana", "Amritsar"],
    tips: [
      "Best irrigation time: Early morning (5-7 AM)",
      "Rice transplanting: June-July",
      "Wheat sowing: November"
    ]
  },
  tamilnadu: {
    name: "Tamil Nadu",
    nativeName: "தமிழ்நாடு",
    majorCrops: ["Rice", "Sugarcane", "Cotton", "Groundnut", "Millets"],
    seasons: {
      kharif: ["Rice", "Cotton", "Sugarcane"],
      rabi: ["Rice", "Pulses", "Oilseeds"],
      summer: ["Groundnut", "Sesame", "Fodder"]
    },
    soilTypes: ["Red Soil", "Black Cotton Soil", "Alluvial", "Coastal Sandy"],
    avgRainfall: "800-1200mm",
    temperature: { min: "20°C", max: "40°C" },
    marketCenters: ["Chennai", "Coimbatore", "Madurai", "Salem"],
    tips: [
      "Northeast monsoon: October-December is main season",
      "Summer irrigation essential for groundnut",
      "Drip irrigation recommended for water conservation"
    ]
  },
  andhrapradesh: {
    name: "Andhra Pradesh",
    nativeName: "ఆంధ్రప్రదేశ్",
    majorCrops: ["Rice", "Cotton", "Sugarcane", "Chilli", "Turmeric"],
    seasons: {
      kharif: ["Rice", "Cotton", "Sugarcane"],
      rabi: ["Rice", "Groundnut", "Sunflower"],
      summer: ["Watermelon", "Fodder", "Vegetables"]
    },
    soilTypes: ["Black Cotton Soil", "Red Soil", "Alluvial", "Coastal Sandy"],
    avgRainfall: "900-1100mm",
    temperature: { min: "18°C", max: "42°C" },
    marketCenters: ["Hyderabad", "Vijayawada", "Visakhapatnam", "Guntur"],
    tips: [
      "Southwest monsoon: June-September is crucial",
      "Chilli cultivation best in Krishna-Godavari delta",
      "Integrated pest management essential for cotton"
    ]
  }
};

interface LocationContextType {
  currentState: StateCode;
  setCurrentState: (state: StateCode) => void;
  regionalData: RegionalData;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentState, setCurrentStateInternal] = useState<StateCode>('punjab');

  const setCurrentState = (state: StateCode) => {
    setCurrentStateInternal(state);
    localStorage.setItem('krishiMitraLocation', state);
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('krishiMitraLocation') as StateCode;
    if (savedLocation && REGIONAL_DATA[savedLocation]) {
      setCurrentStateInternal(savedLocation);
    }
  }, []);

  const regionalData = REGIONAL_DATA[currentState];

  return (
    <LocationContext.Provider value={{ currentState, setCurrentState, regionalData }}>
      {children}
    </LocationContext.Provider>
  );
};