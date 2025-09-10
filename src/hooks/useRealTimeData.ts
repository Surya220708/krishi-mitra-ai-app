import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  lastUpdated: Date;
}

export interface MarketPrice {
  crop: string;
  price: number;
  change: number;
  mandi: string;
  lastUpdated: Date;
}

// Simulate real-time weather updates
export const useRealTimeWeather = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    lastUpdated: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(5, Math.min(25, prev.windSpeed + (Math.random() - 0.5) * 3)),
        lastUpdated: new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return weather;
};

// Simulate real-time market price updates
export const useRealTimeMarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([
    { crop: 'Wheat', price: 2100, change: 2.4, mandi: 'Ludhiana Mandi', lastUpdated: new Date() },
    { crop: 'Rice', price: 4500, change: -1.2, mandi: 'Amritsar Mandi', lastUpdated: new Date() },
    { crop: 'Tomato', price: 25, change: 8.5, mandi: 'Chandigarh Mandi', lastUpdated: new Date() }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(price => ({
        ...price,
        price: Math.max(price.price * 0.8, price.price + (Math.random() - 0.5) * (price.price * 0.05)),
        change: (Math.random() - 0.5) * 10,
        lastUpdated: new Date()
      })));
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  return prices;
};

// Get farming tips based on weather
export const getFarmingTip = (weather: WeatherData): string => {
  if (weather.humidity > 80) {
    return "High humidity detected! Monitor your crops for fungal diseases and ensure proper ventilation.";
  } else if (weather.temperature > 35) {
    return "Very hot weather! Increase irrigation frequency and provide shade for sensitive crops.";
  } else if (weather.windSpeed > 20) {
    return "Strong winds expected! Secure your equipment and check for crop damage after the wind subsides.";
  } else {
    return "Perfect weather for field work! Consider applying fertilizers or pesticides today.";
  }
};

// Voice query responses
export const getVoiceResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('wheat') && lowerQuery.includes('harvest')) {
    return "The best time to harvest wheat is when the grain moisture is between 18-20%. Look for golden-yellow color and firm grains. Early morning harvesting is ideal to avoid grain loss.";
  } else if (lowerQuery.includes('pest') || lowerQuery.includes('insect')) {
    return "For pest control, first identify the pest type. Use integrated pest management - combine biological, cultural, and chemical methods. Always spray in evening hours to protect beneficial insects.";
  } else if (lowerQuery.includes('fertilizer')) {
    return "Apply fertilizers based on soil test results. For most crops, use NPK in 4:2:1 ratio. Apply nitrogen in split doses - 50% at sowing, 25% at tillering, and 25% at flowering stage.";
  } else if (lowerQuery.includes('water') || lowerQuery.includes('irrigation')) {
    return "Water requirements vary by crop and growth stage. Generally, water when top 2-3 cm soil is dry. Early morning irrigation is best to reduce evaporation losses.";
  } else {
    return "Thank you for your question! For specific farming advice, please provide more details about your crop, location, and the exact issue you're facing.";
  }
};

export default {
  useRealTimeWeather,
  useRealTimeMarketPrices,
  getFarmingTip,
  getVoiceResponse
};