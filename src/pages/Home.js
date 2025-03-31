import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/Theme';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Home.css';
import CryptoButton from '../components/CryptoButton';
import { generatePredictions } from '../components/predictions';

// Registra los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [userPlan, setUserPlan] = useState('basic');
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('Bitcoin');
  const [timeRange, setTimeRange] = useState('1D');
  const [predictions, setPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const theme = useContext(ThemeContext);

  // Datos iniciales de criptomonedas
  const cryptoData = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 42000, change: '+2.5%' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: '+1.8%' },
    { id: 3, name: 'Cardano', symbol: 'ADA', price: 2.5, change: '+0.5%' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 150, change: '+3.2%' },
    { id: 5, name: 'Polkadot', symbol: 'DOT', price: 25, change: '+1.1%' },
  ];

  // Simulación de la obtención del plan del usuario
  useEffect(() => {
    const fetchUserPlan = async () => {
      const plan = 'basic';
      setUserPlan(plan);
    };
    fetchUserPlan();
  }, []);

  // Filtra las criptomonedas según el plan del usuario
  useEffect(() => {
    if (userPlan === 'basic') {
      setCryptos(cryptoData.slice(0, 3));
    } else if (userPlan === 'pro') {
      setCryptos(cryptoData.slice(0, 10));
    } else if (userPlan === 'premium') {
      setCryptos(cryptoData);
    }
  }, [userPlan]);

  // Función para manejar la selección de una criptomoneda
  const handleCryptoSelect = async (cryptoName) => {
    setIsLoading(true);
    setSelectedCrypto(cryptoName);
    localStorage.setItem('selectedCrypto', cryptoName);
  
    try {
      // Generamos predicciones con el precio actual
      const predictionData = await generatePredictions(cryptoName);
      console.log("Datos de predicción:", predictionData);
      
      // Actualizamos el estado con las nuevas predicciones
      setPredictions(predictionData.predictions);
      setCurrentPrice(predictionData.currentPrice);
      
      // Guardamos los datos en localStorage
      localStorage.setItem('lastPredictions', JSON.stringify(predictionData));
      
    } catch (error) {
      console.error("Error generando predicciones:", error);
      // Datos de ejemplo en caso de error
      setPredictions({
        "1D": [{date: new Date().toISOString(), price: 42000}],
        "1W": [{date: new Date().toISOString(), price: 42000}],
        "1M": [{date: new Date().toISOString(), price: 42000}]
      });
      setCurrentPrice(42000);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar criptomoneda seleccionada desde localStorage al inicio
  useEffect(() => {
    const savedCrypto = localStorage.getItem('selectedCrypto');
    const savedPredictions = localStorage.getItem('lastPredictions');
    
    if (savedCrypto && cryptos.some(c => c.name === savedCrypto)) {
      setSelectedCrypto(savedCrypto);
      if (savedPredictions) {
        const parsed = JSON.parse(savedPredictions);
        setPredictions(parsed.predictions);
        setCurrentPrice(parsed.currentPrice);
      } else {
        handleCryptoSelect(savedCrypto);
      }
    } else {
      handleCryptoSelect('Bitcoin');
    }
  }, []);

  // Función para manejar el cambio de rango de tiempo
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Datos para el gráfico
  const getChartData = () => {
    const selectedData = predictions[timeRange] || [];
    const labels = selectedData.map((entry) => {
      const date = new Date(entry.date);
      return timeRange === '1D'
        ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}h`
        : date.toLocaleDateString();
    });
    
    const data = selectedData.map((entry) => entry.price);

    return {
      labels,
      datasets: [
        {
          label: `Predicción de precio para ${selectedCrypto}`,
          data,
          borderColor: theme.colors.primary,
          backgroundColor: theme.isDarkMode 
            ? 'rgba(255, 165, 0, 0.1)' 
            : 'rgba(230, 126, 34, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 2
        },
      ],
    };
  };

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.colors.text,
          font: {
            size: 14
          }
        },
      },
      title: {
        display: true,
        text: `Predicción de precios para ${selectedCrypto} (${timeRange})`,
        color: theme.colors.text,
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: theme.colors.cardBackground,
        titleColor: theme.colors.text,
        bodyColor: theme.colors.text,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.colors.border,
          drawBorder: false
        },
        ticks: {
          color: theme.colors.text,
          maxRotation: 45,
          minRotation: 45
        },
      },
      y: {
        grid: {
          color: theme.colors.border,
          drawBorder: false
        },
        ticks: {
          color: theme.colors.text,
          callback: (value) => `$${value}`
        },
      },
    },
  };

  if (!theme) {
    return <div>Cargando...</div>;
  }

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Encabezado con logo y nombre */}
      <div className="header">
        <div className="header-content">
          <img src={"CoinDunkNB.png"} alt="Logo de CoinDunk" className="logohome" />
          <h1 className="app-name">Predicciones de Criptomonedas</h1>
        </div>
      </div>

      {/* Gráfico de la criptomoneda seleccionada */}
      <div className="chart-container">
        <h2 style={{ color: theme.colors.primary }}>
          Predicciones de precios para {selectedCrypto}
          {currentPrice && (
            <span style={{ 
              fontSize: '1rem', 
              marginLeft: '10px',
              color: theme.colors.secondaryText
            }}>
              (Actual: ${currentPrice.toFixed(2)})
            </span>
          )}
        </h2>
        <div className="chart-wrapper">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Generando predicciones...</p>
            </div>
          ) : (
            <Line data={getChartData()} options={chartOptions} height={300} />
          )}
        </div>
        
        {/* Selector de rango de tiempo */}
        <div className="time-range-selector">
          {['1D', '1W', '1M'].map((range) => (
            <button
              key={range}
              className={`time-range-button ${timeRange === range ? 'active' : ''}`}
              style={{
                backgroundColor: timeRange === range 
                  ? theme.colors.primary 
                  : theme.colors.cardBackground,
                color: timeRange === range ? '#fff' : theme.colors.text,
                border: `1px solid ${theme.colors.border}`
              }}
              onClick={() => handleTimeRangeChange(range)}
              disabled={isLoading}
            >
              {range === '1D' ? '1 Día' : range === '1W' ? '1 Semana' : '1 Mes'}
            </button>
          ))}
        </div>
        
        <p style={{ color: theme.colors.secondaryText, marginTop: '10px' }}>
          Predicciones basadas en el precio actual y volatilidad histórica.
          {isLoading && ' Actualizando...'}
        </p>
      </div>

      {/* Selector de criptomonedas */}
      <div className="crypto-selector">
        <h3 style={{ color: theme.colors.primary }}>Selecciona una criptomoneda:</h3>
        <div className="crypto-buttons">
          {cryptos.map((crypto) => (
            <CryptoButton
              key={crypto.id}
              crypto={crypto}
              selectedCrypto={selectedCrypto}
              theme={theme}
              handleCryptoSelect={handleCryptoSelect}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="info-container">
        <p style={{ color: theme.colors.secondaryText }}>
          Usando el plan: <strong>{userPlan}</strong>.
        </p>
        {userPlan === 'basic' && (
          <p style={{ color: theme.colors.secondaryText }}>
            ¿Quieres ver más criptomonedas?{' '}
            <a href="/planes" style={{ color: theme.colors.primary }}>
              Actualiza tu plan
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;