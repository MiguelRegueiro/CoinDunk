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
  const theme = useContext(ThemeContext);

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

  // Datos simulados para el gráfico
  const getChartData = () => {
    let labels = [];
    let data = [];

    switch (timeRange) {
      case '1D':
        labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
        data = [41000, 41500, 42000, 41800, 42200, 42500, 43000];
        break;
      case '1W':
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        data = [40000, 40500, 41000, 41500, 42000, 42500, 43000];
        break;
      case '1M':
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        data = [38000, 39000, 40000, 42000];
        break;
      default:
        labels = [];
        data = [];
    }

    return {
      labels,
      datasets: [
        {
          label: `Precio de ${selectedCrypto}`,
          data,
          borderColor: theme.colors.primary, // Color dinámico del tema
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
          color: theme.colors.text, // Color dinámico del texto
        },
      },
      title: {
        display: true,
        text: `Gráfico de ${selectedCrypto} (${timeRange})`,
        color: theme.colors.text, // Color dinámico del texto
      },
      tooltip: {
        backgroundColor: theme.colors.cardBackground, // Fondo dinámico
        titleColor: theme.colors.text, // Color dinámico del texto
        bodyColor: theme.colors.text, // Color dinámico del texto
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.colors.border, // Color dinámico de la cuadrícula
        },
        ticks: {
          color: theme.colors.text, // Color dinámico del texto
        },
      },
      y: {
        grid: {
          color: theme.colors.border, // Color dinámico de la cuadrícula
        },
        ticks: {
          color: theme.colors.text, // Color dinámico del texto
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
          <h1 className="app-name">Predicciones</h1>
        </div>
      </div>

      {/* Gráfico de la criptomoneda seleccionada */}
      <div className="chart-container">
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
              {range}
            </button>
          ))}
        </div>
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