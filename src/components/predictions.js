// src/components/predictions.js
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de caché

const defaultPrices = {
  bitcoin: 85362,
  ethereum: 1916,
  // ... (mantén el resto de tus precios por defecto)
};

const priceCache = {};
const historicalCache = {};

const getHistoricalData = async (cryptoId, days = 30) => {
  const cacheKey = `${cryptoId}-${days}`;
  
  if (historicalCache[cacheKey] && 
      Date.now() - historicalCache[cacheKey].timestamp < CACHE_DURATION) {
    return historicalCache[cacheKey].data;
  }

  try {
    const response = await axios.get(
      `${API_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    const historicalData = response.data.prices.map(item => ({
      date: new Date(item[0]),
      price: item[1]
    }));
    
    historicalCache[cacheKey] = {
      data: historicalData,
      timestamp: Date.now()
    };
    
    return historicalData;
  } catch (error) {
    console.error("Error obteniendo datos históricos:", error);
    throw error;
  }
};

const calculateVolatility = (prices) => {
  if (prices.length < 2) return 2.0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    const dailyReturn = (prices[i].price - prices[i-1].price) / prices[i-1].price;
    returns.push(dailyReturn);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev * Math.sqrt(365) * 100;
};

const generateSimplePredictions = (historicalData, steps, hours) => {
  const currentPrice = historicalData[historicalData.length - 1].price;
  const volatility = calculateVolatility(historicalData) / 100;
  
  const result = [{ 
    date: new Date().toISOString(), 
    price: currentPrice, 
    confidence: 1.0 
  }];
  
  for (let i = 1; i <= steps; i++) {
    // Modelo simple basado en tendencia reciente y volatilidad
    const recentTrend = historicalData.length > 5 ? 
      (historicalData.slice(-5).reduce((sum, item) => sum + item.price, 0) / 5 - 
       historicalData.slice(-10, -5).reduce((sum, item) => sum + item.price, 0) / 5) / currentPrice : 0;
    
    const randomFactor = (Math.random() * 2 - 1) * volatility;
    const predictedChange = recentTrend * 0.7 + randomFactor * 0.3;
    
    result.push({
      date: new Date(Date.now() + i * hours * 60 * 60 * 1000).toISOString(),
      price: currentPrice * (1 + predictedChange),
      confidence: Math.max(0.5, 1 - Math.abs(predictedChange) * 2)
    });
  }
  
  return result;
};

export const generatePredictions = async (cryptoName) => {
  const cryptoId = cryptoName.toLowerCase();
  
  try {
    const historicalData = await getHistoricalData(cryptoId, 30);
    const volatility = calculateVolatility(historicalData);
    const currentPrice = historicalData[historicalData.length - 1].price;
    
    return {
      crypto: cryptoName,
      currentPrice,
      lastUpdated: new Date().toISOString(),
      predictions: {
        "1H": generateSimplePredictions(historicalData, 4, 0.25),
        "1D": generateSimplePredictions(historicalData, 24, 1),
        "1W": generateSimplePredictions(historicalData, 7, 24),
        "1M": generateSimplePredictions(historicalData, 30, 24)
      },
      volatility: `${volatility.toFixed(2)}%`,
      modelInfo: {
        "1H": "Trend + Volatility Model",
        "1D": "Trend + Volatility Model",
        "1W": "Trend + Volatility Model",
        "1M": "Trend + Volatility Model"
      }
    };
    
  } catch (error) {
    console.error("Error generando predicciones:", error);
    const currentPrice = defaultPrices[cryptoId] || 10000;
    const volatility = 3.0;
    
    return {
      crypto: cryptoName,
      currentPrice,
      lastUpdated: new Date().toISOString(),
      predictions: {
        "1H": [{ date: new Date().toISOString(), price: currentPrice, confidence: 1.0 }],
        "1D": [{ date: new Date().toISOString(), price: currentPrice, confidence: 1.0 }],
        "1W": [{ date: new Date().toISOString(), price: currentPrice, confidence: 1.0 }],
        "1M": [{ date: new Date().toISOString(), price: currentPrice, confidence: 1.0 }]
      },
      volatility: `${volatility}%`,
      modelInfo: {
        "1H": "Fallback (no data)",
        "1D": "Fallback (no data)",
        "1W": "Fallback (no data)",
        "1M": "Fallback (no data)"
      }
    };
  }
};