// src/pages/Home.js
import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/Theme'; // Importa el contexto del tema
import { Line } from 'react-chartjs-2'; // Importa el componente de gráfico de línea
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Importa los componentes de Chart.js
import './Home.css'; // Archivo de estilos


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
  const [userPlan, setUserPlan] = useState('basic'); // Puede ser 'basic', 'pro', o 'premium'
  const [cryptos, setCryptos] = useState([]); // Estado para almacenar las criptomonedas
  const [selectedCrypto, setSelectedCrypto] = useState('Bitcoin'); // Estado para la criptomoneda seleccionada
  const [timeRange, setTimeRange] = useState('1D'); // Estado para el rango de tiempo (1D, 1W, 1M, etc.)
  const theme = useContext(ThemeContext); // Accede al tema

  // Simulación de la obtención del plan del usuario desde la base de datos
  useEffect(() => {
    const fetchUserPlan = async () => {
      const plan = 'basic'; // Cambia a 'pro' o 'premium' para probar otros planes
      setUserPlan(plan);
    };

    fetchUserPlan();
  }, []);

  // Filtra las criptomonedas según el plan del usuario
  useEffect(() => {
    // Mueve cryptoData dentro del useEffect para evitar la advertencia de dependencia
    const cryptoData = [
      { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 42000, change: '+2.5%' },
      { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: '+1.8%' },
      { id: 3, name: 'Cardano', symbol: 'ADA', price: 2.5, change: '+0.5%' },
      { id: 4, name: 'Solana', symbol: 'SOL', price: 150, change: '+3.2%' },
      { id: 5, name: 'Polkadot', symbol: 'DOT', price: 25, change: '+1.1%' },
    ];

    if (userPlan === 'basic') {
      setCryptos(cryptoData.slice(0, 3)); // Muestra solo 3 criptomonedas
    } else if (userPlan === 'pro') {
      setCryptos(cryptoData.slice(0, 10)); // Muestra 10 criptomonedas
    } else if (userPlan === 'premium') {
      setCryptos(cryptoData); // Muestra todas las criptomonedas
    }
  }, [userPlan]); // Solo userPlan es necesario en el array de dependencias

  // Función para manejar la selección de una criptomoneda
  const handleCryptoSelect = (cryptoName) => {
    setSelectedCrypto(cryptoName);
  };

  // Función para manejar el cambio de rango de tiempo
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Datos simulados para el gráfico según el rango de tiempo
  const getChartData = () => {
    let labels = [];
    let data = [];

    switch (timeRange) {
      case '1D': // 1 día
        labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
        data = [41000, 41500, 42000, 41800, 42200, 42500, 43000];
        break;
      case '1W': // 1 semana
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        data = [40000, 40500, 41000, 41500, 42000, 42500, 43000];
        break;
      case '1M': // 1 mes
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
          borderColor: '#FFA500', // Color naranja para la línea
          backgroundColor: 'rgba(255, 165, 0, 0.1)', // Fondo naranja suave
          fill: true, // Relleno debajo de la línea
          tension: 0.4, // Suaviza la línea
        },
      ],
    };
  };

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar el tamaño del gráfico
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Gráfico de ${selectedCrypto} (${timeRange})`,
        color: '#333', // Color del título
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e0e0e0', // Color de la cuadrícula del eje X
        },
      },
      y: {
        grid: {
          color: '#e0e0e0', // Color de la cuadrícula del eje Y
        },
      },
    },
  };

  if (!theme) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga si el tema no está disponible
  }

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: theme.colors.background, // Fondo dinámico
        color: theme.colors.text, // Texto dinámico
      }}
    >
      {/* Encabezado con logo y nombre */}
      <div className="header">
        <img src={"CoinDunkNB.png"} alt="Logo de CoinDunk" className="logohome" />
        <h1 className="app-name">Home</h1>
      </div>

      {/* Gráfico de la criptomoneda seleccionada */}
      <div className="chart-container">
        <div className="chart-wrapper">
          <Line data={getChartData()} options={chartOptions} height={300} /> {/* Ajusta la altura del gráfico */}
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
                backgroundColor: timeRange === range ? '#FFA500' : '#f0f0f0',
                color: timeRange === range ? '#fff' : '#333',
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
                backgroundColor: selectedCrypto === crypto.name ? '#FFA500' : '#f0f0f0',
                color: selectedCrypto === crypto.name ? '#fff' : '#333',
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
            <a href="/planes" style={{ color: '#FFA500' }}>
              Actualiza tu plan
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;