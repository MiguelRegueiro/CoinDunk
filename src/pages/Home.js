// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Archivo de estilos

const Home = () => {
  // Estado para almacenar el plan del usuario
  const [userPlan, setUserPlan] = useState('basic'); // Puede ser 'basic', 'pro', o 'premium'
  const [cryptos, setCryptos] = useState([]); // Estado para almacenar las criptomonedas

  // Simulación de datos de criptomonedas
  const cryptoData = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 42000, change: '+2.5%' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: '+1.8%' },
    { id: 3, name: 'Cardano', symbol: 'ADA', price: 2.5, change: '+0.5%' },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 150, change: '+3.2%' },
    { id: 5, name: 'Polkadot', symbol: 'DOT', price: 25, change: '+1.1%' },
  ];

  // Simulación de la obtención del plan del usuario desde la base de datos
  useEffect(() => {
    // Aquí iría la lógica para obtener el plan del usuario desde la base de datos
    // Por ahora, lo simulamos con un valor fijo
    const fetchUserPlan = async () => {
      // Simulación de una llamada a la API o base de datos
      const plan = 'basic'; // Cambia a 'pro' o 'premium' para probar otros planes
      setUserPlan(plan);
    };

    fetchUserPlan();
  }, []);

  // Filtra las criptomonedas según el plan del usuario
  useEffect(() => {
    if (userPlan === 'basic') {
      setCryptos(cryptoData.slice(0, 3)); // Muestra solo 3 criptomonedas
    } else if (userPlan === 'pro') {
      setCryptos(cryptoData.slice(0, 10)); // Muestra 10 criptomonedas
    } else if (userPlan === 'premium') {
      setCryptos(cryptoData); // Muestra todas las criptomonedas
    }
  }, [userPlan]);

  return (
    <div className="home-container">
      <h1>Bienvenido a CoinDunk</h1>
      <p className="description">
        Predice el futuro de las criptomonedas con nuestro plan {userPlan}.
      </p>

      {/* Mostrar las criptomonedas */}
      <div className="crypto-grid">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="crypto-card">
            <h2>{crypto.name} ({crypto.symbol})</h2>
            <p>Precio: ${crypto.price.toLocaleString()}</p>
            <p>Cambio: <span className={crypto.change.includes('+') ? 'positive' : 'negative'}>
              {crypto.change}
            </span></p>
          </div>
        ))}
      </div>

      {/* Comentario para criptomonedas no incluidas en el plan básico */}
      {userPlan === 'basic' && (
        <div className="upgrade-message">
          <p>
            ¿Quieres ver más criptomonedas?{' '}
            <Link to="/planes" className="upgrade-link">
              Actualiza tu plan
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;