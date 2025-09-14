import { StateCode } from '@/contexts/LocationContext';

export interface MarketPrice {
  crop: string;
  variety: string;
  price: number;
  unit: string;
  market: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const MARKET_PRICES: Record<StateCode, MarketPrice[]> = {
  punjab: [
    { crop: 'Rice', variety: 'Basmati 1121', price: 3200, unit: 'per quintal', market: 'Chandigarh', trend: 'up', change: 5.2 },
    { crop: 'Wheat', variety: 'HD 2967', price: 2150, unit: 'per quintal', market: 'Ludhiana', trend: 'stable', change: 0.8 },
    { crop: 'Cotton', variety: 'Bt Cotton', price: 6800, unit: 'per quintal', market: 'Bathinda', trend: 'down', change: -2.1 },
    { crop: 'Sugarcane', variety: 'Co 0238', price: 380, unit: 'per quintal', market: 'Amritsar', trend: 'up', change: 3.5 },
    { crop: 'Maize', variety: 'Hybrid', price: 1850, unit: 'per quintal', market: 'Patiala', trend: 'stable', change: 1.2 }
  ],
  tamilnadu: [
    { crop: 'Rice', variety: 'Ponni', price: 2800, unit: 'per quintal', market: 'Chennai', trend: 'up', change: 4.3 },
    { crop: 'Sugarcane', variety: 'Co 86032', price: 340, unit: 'per quintal', market: 'Coimbatore', trend: 'stable', change: 1.1 },
    { crop: 'Cotton', variety: 'MCU 5', price: 6200, unit: 'per quintal', market: 'Salem', trend: 'up', change: 6.8 },
    { crop: 'Groundnut', variety: 'TMV 2', price: 5400, unit: 'per quintal', market: 'Madurai', trend: 'down', change: -1.5 },
    { crop: 'Millets', variety: 'Pearl Millet', price: 2200, unit: 'per quintal', market: 'Tirupur', trend: 'up', change: 7.2 },
    { crop: 'Turmeric', variety: 'Salem', price: 8500, unit: 'per quintal', market: 'Erode', trend: 'stable', change: 2.1 }
  ],
  andhrapradesh: [
    { crop: 'Rice', variety: 'BPT 5204', price: 2650, unit: 'per quintal', market: 'Vijayawada', trend: 'stable', change: 0.9 },
    { crop: 'Cotton', variety: 'Narasimha', price: 6500, unit: 'per quintal', market: 'Guntur', trend: 'up', change: 4.7 },
    { crop: 'Chilli', variety: 'Teja', price: 12000, unit: 'per quintal', market: 'Warangal', trend: 'up', change: 8.5 },
    { crop: 'Turmeric', variety: 'Duggirala', price: 9200, unit: 'per quintal', market: 'Nizamabad', trend: 'down', change: -3.2 },
    { crop: 'Sugarcane', variety: 'Co 7704', price: 360, unit: 'per quintal', market: 'East Godavari', trend: 'stable', change: 1.8 },
    { crop: 'Groundnut', variety: 'Kadiri 3', price: 5100, unit: 'per quintal', market: 'Anantapur', trend: 'up', change: 2.9 }
  ]
};

export const getMarketPricesForState = (state: StateCode): MarketPrice[] => {
  return MARKET_PRICES[state] || MARKET_PRICES.punjab;
};