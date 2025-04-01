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
      return data[cryptoId].usd;
    } catch (error) {
      console.error("Error obteniendo precio:", error);
      // Valores por defecto basados en datos conocidos
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
      return defaultPrices[cryptoId] || 10000;
    }
  };
  
  // Función para generar datos de predicción realistas
  const generateRealisticPredictions = (currentPrice, volatility, periods) => {
    const predictions = [];
    let lastPrice = currentPrice;
    const volatilityFactor = volatility / 100; // Convertir porcentaje a decimal
    
    // Generar datos para cada periodo (horas)
    for (let i = 1; i <= periods; i++) {
      // Variación basada en volatilidad histórica
      const randomChange = (Math.random() * 2 - 1) * volatilityFactor;
      const priceChange = lastPrice * randomChange;
      
      // Nuevo precio con tendencia suave
      const newPrice = lastPrice + priceChange;
      
      // Fecha para este punto de datos
      const date = new Date();
      date.setHours(date.getHours() + i);
      
      predictions.push({
        date: date.toISOString(),
        price: parseFloat(newPrice.toFixed(4)) // Redondear a 4 decimales
      });
      
      lastPrice = newPrice;
    }
    
    return predictions;
  };
  
  // Función principal que exportamos
  export const generatePredictions = async (cryptoName) => {
    const cryptoId = cryptoName.toLowerCase();
    const volatility = cryptoVolatility[cryptoId] || 3.0; // Volatilidad por defecto 3%
    
    try {
      // 1. Obtener precio actual
      const currentPrice = await getCurrentCryptoPrice(cryptoId);
      console.log(`Precio actual de ${cryptoName}: $${currentPrice}`);
      
      // 2. Generar predicciones para diferentes periodos
      const now = new Date();
      
      const predictions = {
        "1D": generateRealisticPredictions(currentPrice, volatility, 24),    // 24 horas (1 día)
        "1W": generateRealisticPredictions(currentPrice, volatility, 168),   // 168 horas (1 semana)
        "1M": generateRealisticPredictions(currentPrice, volatility, 720)    // 720 horas (1 mes - 30 días)
      };
      
      // 3. Formatear respuesta como JSON
      return {
        crypto: cryptoName,
        currentPrice,
        lastUpdated: new Date().toISOString(),
        predictions
      };
      
    } catch (error) {
      console.error("Error generando predicciones:", error);
      throw error;
    }
  };