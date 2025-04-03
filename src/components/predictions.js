// src/components/predictions.js
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de caché

const defaultPrices = {
  bitcoin: 85362,        // BTC
  ethereum: 1916,        // ETH
  // ... (resto de precios por defecto)
};

const historicalCache = {};

// Nueva función para obtener datos de velas de 5 minutos
const getMinuteData = async (cryptoId, minutes = 120) => {
  const cacheKey = `${cryptoId}-minutes-${minutes}`;
  
  if (historicalCache[cacheKey] && 
      Date.now() - historicalCache[cacheKey].timestamp < CACHE_DURATION) {
    return historicalCache[cacheKey].data;
  }

  try {
    const response = await axios.get(
      `${API_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${Math.ceil(minutes / 1440)}`
    );
    
    // Procesamos los datos para obtener velas de 5 minutos
    const minuteData = [];
    const prices = response.data.prices;
    
    for (let i = 0; i < prices.length - 5; i += 5) {
      const group = prices.slice(i, i + 5);
      const close = group[4][1]; // Precio de cierre del intervalo de 5 minutos
      
      minuteData.push({
        date: new Date(group[2][0]), // Usamos la marca de tiempo del punto medio
        price: close
      });
    }
    
    historicalCache[cacheKey] = {
      data: minuteData,
      timestamp: Date.now()
    };
    
    return minuteData;
  } catch (error) {
    console.error("Error obteniendo datos por minutos:", error);
    throw error;
  }
};

const getHistoricalData = async (cryptoId, days = 30) => {
  // ... (mantener la misma implementación)
};

const calculateVolatility = (prices) => {
  // ... (mantener la misma implementación)
};

// Función mejorada para predicciones a corto plazo (5 minutos)
const generateShortTermPredictions = (minuteData, steps, minutesInterval) => {
  const currentPrice = minuteData[minuteData.length - 1].price;
  const volatility = calculateVolatility(minuteData) / 100;
  
  const result = [{ 
    date: new Date().toISOString(), 
    price: currentPrice, 
    confidence: 1.0 
  }];
  
  // Analizar las últimas 12 velas (1 hora) para tendencia
  const lastHourData = minuteData.slice(-12);
  const hourTrend = lastHourData.length >= 2 ? 
    (lastHourData[lastHourData.length - 1].price - lastHourData[0].price) / lastHourData[0].price : 0;
  
  for (let i = 1; i <= steps; i++) {
    // Modelo que combina tendencia (60%), volatilidad (30%) y factor aleatorio (10%)
    const timeFactor = i / steps; // Aumenta el efecto de la volatilidad con el tiempo
    const randomFactor = (Math.random() * 2 - 1) * volatility * 0.3;
    const predictedChange = (hourTrend * 0.6) + randomFactor;
    
    result.push({
      date: new Date(Date.now() + i * minutesInterval * 60 * 1000).toISOString(),
      price: parseFloat((currentPrice * (1 + predictedChange)).toFixed(4)),
      confidence: Math.max(0.6, 0.9 - Math.abs(predictedChange) * 5)
    });
  }
  
  return result;
};

// Función para predicciones a largo plazo
const generateLongTermPredictions = (historicalData, steps, hoursInterval) => {
  // ... (similar a generateSimplePredictions pero con intervalos personalizados)
  const currentPrice = historicalData[historicalData.length - 1].price;
  const volatility = calculateVolatility(historicalData) / 100;
  
  const result = [{ 
    date: new Date().toISOString(), 
    price: currentPrice, 
    confidence: 1.0 
  }];
  
  for (let i = 1; i <= steps; i++) {
    const recentTrend = historicalData.length > 5 ? 
      (historicalData.slice(-5).reduce((sum, item) => sum + item.price, 0) / 5 - 
       historicalData.slice(-10, -5).reduce((sum, item) => sum + item.price, 0) / 5) / currentPrice : 0;
    
    const randomFactor = (Math.random() * 2 - 1) * volatility;
    const predictedChange = recentTrend * 0.7 + randomFactor * 0.3;
    
    result.push({
      date: new Date(Date.now() + i * hoursInterval * 60 * 60 * 1000).toISOString(),
      price: parseFloat((currentPrice * (1 + predictedChange)).toFixed(4)),
      confidence: Math.max(0.5, 1 - Math.abs(predictedChange) * 2)
    });
  }
  
  return result;
};

export const generatePredictions = async (cryptoName) => {
  const cryptoId = cryptoName.toLowerCase();
  
  try {
    // Datos de 5 minutos para predicciones de 1H
    const minuteData = await getMinuteData(cryptoId, 120); // Últimas 2 horas
    // Datos diarios para otras predicciones
    const historicalData = await getHistoricalData(cryptoId, 30);
    
    const volatility = calculateVolatility(historicalData);
    const currentPrice = minuteData[minuteData.length - 1].price;
    
    return {
      crypto: cryptoName,
      currentPrice: parseFloat(currentPrice.toFixed(4)),
      lastUpdated: new Date().toISOString(),
      predictions: {
        "1H": generateShortTermPredictions(minuteData, 12, 5),  // 12 puntos (cada 5 min)
        "1D": generateLongTermPredictions(historicalData, 24, 1),  // 24 puntos (cada 1h)
        "1W": generateLongTermPredictions(historicalData, 7, 24),  // 7 puntos (cada 24h)
        "1M": generateLongTermPredictions(historicalData, 30, 24)  // 30 puntos (cada 24h)
      },
      volatility: `${volatility.toFixed(2)}%`,
      modelInfo: {
        "1H": "Short-Term Model (5min intervals)",
        "1D": "Trend + Volatility Model (1h intervals)",
        "1W": "Trend + Volatility Model (daily intervals)",
        "1M": "Trend + Volatility Model (daily intervals)"
      }
    };
    
  } catch (error) {
    console.error("Error generando predicciones:", error);
    const currentPrice = defaultPrices[cryptoId] || 10000;
    const volatility = 3.0;
    
    const now = new Date();
    const generateFallback = (steps, minutes) => {
      return Array.from({ length: steps + 1 }, (_, i) => ({
        date: new Date(now.getTime() + i * minutes * 60 * 1000).toISOString(),
        price: parseFloat((currentPrice * (1 + (Math.random() * 0.02 - 0.01))).toFixed(4)),
        confidence: 0.6
      }));
    };
    
    return {
      crypto: cryptoName,
      currentPrice,
      lastUpdated: now.toISOString(),
      predictions: {
        "1H": generateFallback(12, 5),    // 12 puntos cada 5 min
        "1D": generateFallback(24, 60),   // 24 puntos cada 60 min
        "1W": generateFallback(7, 1440),  // 7 puntos cada 1440 min (24h)
        "1M": generateFallback(30, 1440)  // 30 puntos cada 1440 min (24h)
      },
      volatility: `${volatility}%`,
      modelInfo: {
        "1H": "Fallback Model (5min intervals)",
        "1D": "Fallback Model (1h intervals)",
        "1W": "Fallback Model (daily intervals)",
        "1M": "Fallback Model (daily intervals)"
      }
    };
  }
};