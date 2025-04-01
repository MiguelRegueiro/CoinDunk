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
  const [currentPrice, setCurrentPrice] = useState(0);
  const theme = useContext(ThemeContext);

  const cryptoData = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 42000, change: '+2.5%' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: '+1.8%' },
    { id: 3, name: 'Cardano', symbol: 'ADA', price: 2.5, change: '+0.5%' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 150, change: '+3.2%' },
    { id: 5, name: 'Polkadot', symbol: 'DOT', price: 25, change: '+1.1%' },
  ];

  useEffect(() => {
    const fetchUserPlan = () => {
      const plan = 'basic';
      setUserPlan(plan);
    };
    fetchUserPlan();
  }, []);

  useEffect(() => {
    if (userPlan === 'basic') {
      setCryptos(cryptoData.slice(0, 3));
    } else if (userPlan === 'pro') {
      setCryptos(cryptoData.slice(0, 10));
    } else if (userPlan === 'premium') {
      setCryptos(cryptoData);
    }
  }, [userPlan]);

  const handleCryptoSelect = async (cryptoName) => {
    setIsLoading(true);
    setSelectedCrypto(cryptoName);
    localStorage.setItem('selectedCrypto', cryptoName);
  
    try {
      const predictionData = await generatePredictions(cryptoName);
      setPredictions(predictionData.predictions);
      setCurrentPrice(predictionData.currentPrice);
      localStorage.setItem('lastPredictions', JSON.stringify(predictionData));
    } catch (error) {
      console.error("Error generando predicciones:", error);
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

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

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
            ? 'rgba(255, 167, 38, 0.2)' 
            : 'rgba(230, 126, 34, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
          pointBackgroundColor: theme.colors.primary,
          pointBorderColor: '#fff'
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.colors.textPrimary,
          font: {
            size: 14
          }
        },
      },
      title: {
        display: true,
        text: `Predicción de precios para ${selectedCrypto} (${timeRange})`,
        color: theme.colors.textPrimary,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: theme.colors.surface,
        titleColor: theme.colors.textPrimary,
        bodyColor: theme.colors.textPrimary,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        padding: 12,
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
          color: theme.colors.divider,
          drawBorder: false
        },
        ticks: {
          color: theme.colors.textSecondary,
          maxRotation: 45,
          minRotation: 45
        },
      },
      y: {
        grid: {
          color: theme.colors.divider,
          drawBorder: false
        },
        ticks: {
          color: theme.colors.textSecondary,
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
        color: theme.colors.textPrimary,
      }}
    >
      <div className="header">
        <div className="header-content">
          <img 
            src="CoinDunkNB.png" 
            alt="Logo de CoinDunk" 
            className="logohome" 
            style={{ filter: theme.isDarkMode ? 'brightness(0.8)' : 'brightness(1)' }}
          />
          <h1 className="app-name" style={{ color: theme.colors.textPrimary }}>
            Predicciones de Criptomonedas
          </h1>
        </div>
      </div>

      <div 
        className="chart-container"
        style={{
          backgroundColor: theme.colors.surface,
          boxShadow: theme.colors.shadow,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h2 style={{ color: theme.colors.primary }}>
          Predicciones de precios para {selectedCrypto}
          {currentPrice && (
            <span style={{ 
              fontSize: '1rem', 
              marginLeft: '10px',
              color: theme.colors.textSecondary
            }}>
              (Actual: ${currentPrice.toFixed(2)})
            </span>
          )}
        </h2>
        
        <div className="chart-wrapper">
          {isLoading ? (
            <div className="loading-indicator">
              <div 
                className="spinner" 
                style={{ 
                  borderTopColor: theme.colors.primary,
                  borderColor: theme.colors.divider
                }}
              />
              <p style={{ color: theme.colors.textSecondary }}>
                Generando predicciones...
              </p>
            </div>
          ) : (
            <Line data={getChartData()} options={chartOptions} height={300} />
          )}
        </div>
        
        <div className="time-range-selector">
          {['1D', '1W', '1M'].map((range) => (
            <button
              key={range}
              className={`time-range-button ${timeRange === range ? 'active' : ''}`}
              style={{
                backgroundColor: timeRange === range 
                  ? theme.colors.primary 
                  : theme.colors.paper,
                color: timeRange === range ? '#fff' : theme.colors.textPrimary,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleTimeRangeChange(range)}
              disabled={isLoading}
            >
              {range === '1D' ? '1 Día' : range === '1W' ? '1 Semana' : '1 Mes'}
            </button>
          ))}
        </div>
        
        <p style={{ 
          color: theme.colors.textSecondary, 
          marginTop: '10px',
          opacity: 0.8
        }}>
          Predicciones basadas en el precio actual y volatilidad histórica.
          {isLoading && ' Actualizando...'}
        </p>
      </div>

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

      <div 
        className="info-container"
        style={{
          backgroundColor: theme.colors.paper,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <p style={{ color: theme.colors.textSecondary }}>
          Usando el plan: <strong style={{ color: theme.colors.textPrimary }}>{userPlan}</strong>.
        </p>
        {userPlan === 'basic' && (
          <p style={{ color: theme.colors.textSecondary }}>
            ¿Quieres ver más criptomonedas?{' '}
            <a 
              href="/planes" 
              style={{ 
                color: theme.colors.primary,
                fontWeight: 500
              }}
            >
              Actualiza tu plan
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;