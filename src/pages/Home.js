import React, { useEffect, useState, useContext, useCallback } from 'react';
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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Datos de planes fuera del componente para evitar recreación
const planInfo = {
  basic: { 
    name: 'Básico', 
    maxCryptos: 3,
    color: 'default',
    description: '3 criptomonedas'
  },
  pro: { 
    name: 'Profesional', 
    maxCryptos: 10,
    color: 'primary',
    description: '10 criptomonedas'
  },
  premium: { 
    name: 'Premium', 
    maxCryptos: 999,
    color: 'secondary',
    description: 'Ilimitado'
  },
};

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [timeRange, setTimeRange] = useState('1D');
  const [predictions, setPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [maxCryptos, setMaxCryptos] = useState(3);
  const [planDetails, setPlanDetails] = useState({});
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();

  // Función para seleccionar criptomoneda (memoizada)
  const handleCryptoSelect = useCallback(async (cryptoName) => {
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
  }, []);

  // Función para obtener datos del usuario (memoizada)
  const fetchUserData = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('coindunk_user'));
      if (!storedUser?.id) {
        navigate('/login');
        return;
      }
      
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/user/${storedUser.id}/cryptos`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`
          }
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al obtener datos');
      }

      const { cryptos, plan } = response.data;
      const planData = planInfo[plan.name.toLowerCase()] || planInfo.basic;
      
      setUserData(storedUser);
      setPlanDetails(planData);
      setUserPlan(planData.name);
      setMaxCryptos(plan.maxCryptos);
      setCryptos(cryptos);
      
      const savedCrypto = localStorage.getItem('selectedCrypto');
      const defaultCrypto = cryptos.length > 0 ? cryptos[0].name : null;
      
      if (defaultCrypto) {
        const cryptoToSelect = savedCrypto && cryptos.some(c => c.name === savedCrypto) 
          ? savedCrypto 
          : defaultCrypto;
        
        setSelectedCrypto(cryptoToSelect);
        await handleCryptoSelect(cryptoToSelect);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('coindunk_user');
        localStorage.removeItem('coindunk_token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, handleCryptoSelect]);

  // Efecto principal con cancelación de petición
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      await fetchUserData();
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchUserData]);

  // Función para cambiar el rango de tiempo
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Generar datos para el gráfico
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

  // Opciones del gráfico
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

  // Estados de carga
  if (!theme) {
    return <div className="loading-screen">Cargando tema...</div>;
  }

  if (!userData) {
    return (
      <div className="loading-screen" style={{ backgroundColor: theme.colors.background }}>
        <div className="spinner" style={{ borderTopColor: theme.colors.primary }} />
        <p style={{ color: theme.colors.textPrimary }}>Verificando autenticación...</p>
      </div>
    );
  }

  if (isLoading && !selectedCrypto) {
    return (
      <div className="loading-screen" style={{ backgroundColor: theme.colors.background }}>
        <div className="spinner" style={{ borderTopColor: theme.colors.primary }} />
        <p style={{ color: theme.colors.textPrimary }}>Cargando tus criptomonedas...</p>
      </div>
    );
  }

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
      }}
    >
      <div className="headerHome">
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
          Predicciones de precios para {selectedCrypto || '...'}
          {currentPrice > 0 && (
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
          opacity: 0.8,
          textAlign: 'center',
        }}>
          Predicciones basadas en el precio actual y volatilidad histórica.
          {isLoading && ' Actualizando...'}
        </p>
      </div>

      <div className="crypto-selector"
      style={{ margin: '0.5rem auto 0.5rem' }}>
        <h3 style={{ color: theme.colors.textprimary }}>
          Tus criptomonedas ({cryptos.length}/{maxCryptos})
        </h3>
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

      <div className="info-container" style={{
        width: 'fit-content',
        maxWidth: '100%',
        margin: '1rem auto 0',
        padding: '0.5rem 1rem',
        borderRadius: '50px',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.colors.shadow,
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '0.9rem',
            color: theme.colors.textSecondary,
            fontWeight: 500
          }}>
            Plan actual:
          </span>
          <span style={{
            padding: '3px 8px',
            borderRadius: '12px',
            backgroundColor: `${theme.colors.primary}15`,
            color: theme.colors.primary,
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'capitalize',
            letterSpacing: '0.3px',
            border: `1px solid ${theme.colors.primary}30`
          }}>
            {userPlan || '...'}
          </span>
          
          <span style={{ 
            fontSize: '0.85rem',
            color: theme.colors.textSecondary,
            opacity: 0.9,
            marginTop: '1px'
          }}>
            {planDetails.description || '...'}
          </span>
        </div>

        {userPlan && userPlan.toLowerCase() !== 'premium' && (
          <a href="/planes" style={{ 
            color: theme.colors.primary,
            fontWeight: 'bold',
            textDecoration: 'none',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            backgroundColor: theme.isDarkMode 
              ? `${theme.colors.primary}20` 
              : `${theme.colors.primary}10`,
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: theme.isDarkMode 
                ? `${theme.colors.primary}30` 
                : `${theme.colors.primary}20`
            }
          }}>
            Actualizar
          </a>
        )}
      </div>
    </div>
  );
};

export default Home;