// src/components/predictions.js
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de caché

const defaultPrices = {
  bitcoin: 85362,        // BTC
  ethereum: 1916,        // ETH
  cardano: 2.5,          // ADA
  solana: 166,           // SOL
  polkadot: 7.20,        // DOT
  tether: 1,             // USDT
  ripple: 1.00,          // XRP
  dogecoin: 0.16,        // DOGE
  binancecoin: 600,      // BNB
  litecoin: 84,          // LTC
  chainlink: 18,         // LINK
  polygon: 0.72,         // MATIC
  stellar: 0.11,         // XLM
  uniswap: 11,           // UNI
  avalanche: 36,         // AVAX
  cosmos: 8.50,          // ATOM
  monero: 165,           // XMR
  algorand: 0.18,        // ALGO
  vechain: 0.035,        // VET
  filecoin: 6.20,        // FIL
  tron: 0.12,            // TRX
  eos: 0.82              // EOS
};

// Solo mantenemos historicalCache ya que priceCache no se usaba
const historicalCache = {};

/**
 * Obtiene datos históricos de precios con caché
 * @param {string} cryptoId - ID de la criptomoneda
 * @param {number} days - Número de días de datos a obtener
 * @returns {Promise<Array>} Datos históricos
 */
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

/**
 * Calcula la volatilidad anualizada
 * @param {Array} prices - Array de precios históricos
 * @returns {number} Volatilidad porcentual anualizada
 */
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

/**
 * Genera predicciones basadas en tendencia y volatilidad
 * @param {Array} historicalData - Datos históricos
 * @param {number} steps - Número de predicciones a generar
 * @param {number} hours - Intervalo entre predicciones en horas
 * @returns {Array} Predicciones generadas
 */
const generateSimplePredictions = (historicalData, steps, hours) => {
  const currentPrice = historicalData[historicalData.length - 1].price;
  const volatility = calculateVolatility(historicalData) / 100;
  
  const result = [{ 
    date: new Date().toISOString(), 
    price: currentPrice, 
    confidence: 1.0 
  }];
  
  for (let i = 1; i <= steps; i++) {
    // Modelo mejorado que considera tendencia reciente
    const recentTrend = historicalData.length > 5 ? 
      (historicalData.slice(-5).reduce((sum, item) => sum + item.price, 0) / 5 - 
       historicalData.slice(-10, -5).reduce((sum, item) => sum + item.price, 0) / 5) / currentPrice : 0;
    
    // Suavizamos el factor aleatorio con la volatilidad
    const randomFactor = (Math.random() * 2 - 1) * volatility;
    const predictedChange = recentTrend * 0.7 + randomFactor * 0.3;
    
    result.push({
      date: new Date(Date.now() + i * hours * 60 * 60 * 1000).toISOString(),
      price: parseFloat((currentPrice * (1 + predictedChange)).toFixed(4)),
      confidence: Math.max(0.5, 1 - Math.abs(predictedChange) * 2)
    });
  }
  
  return result;
};

/**
 * Genera predicciones para diferentes intervalos de tiempo
 * @param {string} cryptoName - Nombre de la criptomoneda
 * @returns {Promise<Object>} Objeto con predicciones y metadatos
 */
export const generatePredictions = async (cryptoName) => {
  const cryptoId = cryptoName.toLowerCase();
  
  try {
    const historicalData = await getHistoricalData(cryptoId, 30);
    const volatility = calculateVolatility(historicalData);
    const currentPrice = historicalData[historicalData.length - 1].price;
    
    return {
      crypto: cryptoName,
      currentPrice: parseFloat(currentPrice.toFixed(4)),
      lastUpdated: new Date().toISOString(),
      predictions: {
        "1H": generateSimplePredictions(historicalData, 4, 0.25),  // 4 puntos en 1 hora (cada 15 min)
        "1D": generateSimplePredictions(historicalData, 24, 1),    // 24 puntos en 1 día (cada 1 hora)
        "1W": generateSimplePredictions(historicalData, 7, 24),    // 7 puntos en 1 semana (cada 1 día)
        "1M": generateSimplePredictions(historicalData, 30, 24)    // 30 puntos en 1 mes (cada 1 día)
      },
      volatility: `${volatility.toFixed(2)}%`,
      modelInfo: {
        "1H": "Trend + Volatility Model (15min intervals)",
        "1D": "Trend + Volatility Model (1h intervals)",
        "1W": "Trend + Volatility Model (daily intervals)",
        "1M": "Trend + Volatility Model (daily intervals)"
      }
    };
    
  } catch (error) {
    console.error("Error generando predicciones:", error);
    const currentPrice = defaultPrices[cryptoId] || 10000;
    const volatility = 3.0;
    
    // Datos de fallback más realistas
    const now = new Date();
    const generateFallbackPredictions = (steps, hours) => {
      return Array.from({ length: steps + 1 }, (_, i) => ({
        date: new Date(now.getTime() + i * hours * 60 * 60 * 1000).toISOString(),
        price: parseFloat((currentPrice * (1 + (Math.random() * 0.04 - 0.02))).toFixed(4)),
        confidence: 0.6
      }));
    };
    
    return {
      crypto: cryptoName,
      currentPrice,
      lastUpdated: now.toISOString(),
      predictions: {
        "1H": generateFallbackPredictions(4, 0.25),
        "1D": generateFallbackPredictions(24, 1),
        "1W": generateFallbackPredictions(7, 24),
        "1M": generateFallbackPredictions(30, 24)
      },
      volatility: `${volatility}%`,
      modelInfo: {
        "1H": "Fallback Model (limited data)",
        "1D": "Fallback Model (limited data)",
        "1W": "Fallback Model (limited data)",
        "1M": "Fallback Model (limited data)"
      }
    };
  }
};