// src/components/predictions.js
// Datos de volatilidad histórica de criptomonedas (porcentaje)
const cryptoVolatility = {
  bitcoin: 2.5,    // 2.5% de volatilidad diaria promedio
  ethereum: 3.2,
  cardano: 4.1,
  solana: 5.3,
  polkadot: 3.8,
  tether: 0.1,
  ripple: 3.5,
  dogecoin: 6.2
};

// Precios por defecto para cuando falle la API
const defaultPrices = {
  bitcoin: 42000,
  ethereum: 3000,
  cardano: 2.5,
  solana: 150,
  polkadot: 25,
  tether: 1,
  ripple: 0.75,
  dogecoin: 0.15
};

// Función para obtener el precio actual de una criptomoneda
const getCurrentCryptoPrice = async (cryptoId) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&precision=8`
    );
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    
    const data = await response.json();
    return data[cryptoId]?.usd || defaultPrices[cryptoId] || 10000;
  } catch (error) {
    console.error("Error obteniendo precio, usando valor por defecto:", error);
    return defaultPrices[cryptoId] || 10000;
  }
};

// Función para generar datos de predicción realistas
const generateRealisticPredictions = (currentPrice, volatility, periods) => {
  const predictions = [];
  let lastPrice = currentPrice;
  const volatilityFactor = volatility / 100;
  
  // Asegurarse que el precio inicial esté incluido
  predictions.push({
    date: new Date().toISOString(),
    price: parseFloat(currentPrice.toFixed(4))
  });

  for (let i = 1; i <= periods; i++) {
    // Variación basada en volatilidad histórica con tendencia más realista
    const randomChange = (Math.random() * 2 - 1) * volatilityFactor;
    
    // Suavizar cambios bruscos
    const smoothedChange = randomChange * (0.5 + Math.random() * 0.5);
    const priceChange = lastPrice * smoothedChange;
    
    const newPrice = lastPrice + priceChange;
    const date = new Date();
    date.setHours(date.getHours() + i);
    
    predictions.push({
      date: date.toISOString(),
      price: parseFloat(newPrice.toFixed(4))
    });
    
    lastPrice = newPrice;
  }
  
  return predictions;
};

// Función principal que exportamos
export const generatePredictions = async (cryptoName) => {
  const cryptoId = cryptoName.toLowerCase();
  const volatility = cryptoVolatility[cryptoId] || 3.0;

  try {
    const currentPrice = await getCurrentCryptoPrice(cryptoId);
    console.log(`Precio actual de ${cryptoName}: $${currentPrice}`);
    
    // Generar predicciones con periodos más realistas
    const predictions = {
      "1H": generateRealisticPredictions(currentPrice, volatility, 4).slice(0, 4), // 4 puntos en 1 hora
      "1D": generateRealisticPredictions(currentPrice, volatility, 24),   // 24 puntos (1 por hora)
      "1W": generateRealisticPredictions(currentPrice, volatility, 7),    // 7 puntos (1 por día)
      "1M": generateRealisticPredictions(currentPrice, volatility, 30)    // 30 puntos (1 por día)
    };
    
    return {
      crypto: cryptoName,
      currentPrice,
      lastUpdated: new Date().toISOString(),
      predictions,
      volatility: `${volatility}%`
    };
    
  } catch (error) {
    console.error("Error generando predicciones:", error);
    throw new Error("No se pudieron generar las predicciones");
  }
};