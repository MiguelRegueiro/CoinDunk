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
  const theme = useContext(ThemeContext);

  // Cargar datos de predicciones desde el archivo JSON
  useEffect(() => {
    fetch('/predictions.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Datos cargados:', data); // Verifica los datos cargados
        setPredictions(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  // Simulación de la obtención del plan del usuario
  useEffect(() => {
    const fetchUserPlan = async () => {
      const plan = 'basic'; // Cambia a 'pro' o 'premium' para probar otros planes
      setUserPlan(plan);
    };

    fetchUserPlan();
  }, []);

  // Filtra las criptomonedas según el plan del usuario
  useEffect(() => {
    const cryptoData = [
      { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 42000, change: '+2.5%' },
      { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: '+1.8%' },
      { id: 3, name: 'Cardano', symbol: 'ADA', price: 2.5, change: '+0.5%' },
      { id: 4, name: 'Solana', symbol: 'SOL', price: 150, change: '+3.2%' },
      { id: 5, name: 'Polkadot', symbol: 'DOT', price: 25, change: '+1.1%' },
    ];

    if (userPlan === 'basic') {
      setCryptos(cryptoData.slice(0, 3));
    } else if (userPlan === 'pro') {
      setCryptos(cryptoData.slice(0, 10));
    } else if (userPlan === 'premium') {
      setCryptos(cryptoData);
    }
  }, [userPlan]);

  // Función para manejar la selección de una criptomoneda
  const handleCryptoSelect = (cryptoName) => {
    setSelectedCrypto(cryptoName);
  };

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
        ? date.toLocaleTimeString() // Formatea la hora para "1D"
        : date.toLocaleDateString(); // Formatea la fecha para "1W" y "1M"
    });
    const data = selectedData.map((entry) => entry.price);

    console.log('Labels:', labels); // Verifica las etiquetas formateadas
    console.log('Data:', data); // Verifica los datos

    return {
      labels,
      datasets: [
        {
          label: `Predicción de precio para ${selectedCrypto}`,
          data,
          borderColor: theme.colors.primary,
          backgroundColor: theme.isDarkMode ? 'rgba(255, 165, 0, 0.1)' : 'rgba(230, 126, 34, 0.1)',
          fill: true,
          tension: 0.4,
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
        },
      },
      title: {
        display: true,
        text: `Predicción de precios para ${selectedCrypto} (${timeRange})`,
        color: theme.colors.text,
      },
      tooltip: {
        backgroundColor: theme.colors.cardBackground,
        titleColor: theme.colors.text,
        bodyColor: theme.colors.text,
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.colors.border,
        },
        ticks: {
          color: theme.colors.text,
        },
      },
      y: {
        grid: {
          color: theme.colors.border,
        },
        ticks: {
          color: theme.colors.text,
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
        </h2>
        <div className="chart-wrapper">
          <Line data={getChartData()} options={chartOptions} height={300} />
        </div>
        {/* Selector de rango de tiempo */}
        <div className="time-range-selector">
          {['1D', '1W', '1M'].map((range) => (
            <button
              key={range}
              className={`time-range-button ${
                timeRange === range ? 'active' : ''
              }`}
              style={{
                backgroundColor: timeRange === range ? theme.colors.primary : theme.colors.cardBackground,
                color: timeRange === range ? '#fff' : theme.colors.text,
              }}
              onClick={() => handleTimeRangeChange(range)}
            >
              {range === '1D' ? '1 Día' : range === '1W' ? '1 Semana' : '1 Mes'}
            </button>
          ))}
        </div>
        <p style={{ color: theme.colors.secondaryText, marginTop: '10px' }}>
          Los datos mostrados son predicciones simuladas basadas en modelos avanzados.
        </p>
      </div>

      {/* Selector de criptomonedas */}
      <div className="crypto-selector">
        <h3 style={{ color: theme.colors.primary }}>Selecciona una criptomoneda:</h3>
        <div className="crypto-buttons">
          {cryptos.map((crypto) => (
            <button
              key={crypto.id}
              className={`crypto-button ${
                selectedCrypto === crypto.name ? 'active' : ''
              }`}
              style={{
                backgroundColor: selectedCrypto === crypto.name ? theme.colors.primary : theme.colors.cardBackground,
                color: selectedCrypto === crypto.name ? '#fff' : theme.colors.text,
              }}
              onClick={() => handleCryptoSelect(crypto.name)}
            >
              {crypto.name} ({crypto.symbol})
            </button>
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