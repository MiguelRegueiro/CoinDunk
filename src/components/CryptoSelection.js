import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import axios from 'axios';
import './CryptoSelection.css';

const CryptoSelection = () => {
  const [allCryptos, setAllCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [maxSelection, setMaxSelection] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('coindunk_user'));
        if (!user?.id) {
          navigate('/login');
          return;
        }

        // Obtener información del plan del usuario
        const planResponse = await axios.get(
          `http://localhost:5000/api/user/${user.id}/cryptos`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`
            }
          }
        );

        const { plan } = planResponse.data;
        setUserPlan(plan.name.toLowerCase());
        setMaxSelection(plan.maxCryptos);

        // Obtener todas las criptomonedas disponibles
        const cryptosResponse = await axios.get(
          'http://localhost:5000/api/cryptos',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`
            }
          }
        );

        setAllCryptos(cryptosResponse.data.cryptos);
        setIsLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar las criptomonedas');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCryptoSelect = (cryptoId) => {
    setSelectedCryptos(prev => {
      if (prev.includes(cryptoId)) {
        return prev.filter(id => id !== cryptoId);
      } else {
        if (prev.length < maxSelection) {
          return [...prev, cryptoId];
        }
        return prev;
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedCryptos.length === 0) {
      setError('Debes seleccionar al menos 1 criptomoneda');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const user = JSON.parse(localStorage.getItem('coindunk_user'));
      if (!user?.id) {
        throw new Error('No se encontró información del usuario');
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/user/${user.id}/cryptos`,
        { cryptos: selectedCryptos },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al guardar');
      }
  
      // Redirigir a la página principal con mensaje de éxito
      navigate('/predicciones', { 
        state: { 
          successMessage: `Se guardaron ${selectedCryptos.length} criptomonedas correctamente` 
        } 
      });
  
    } catch (err) {
      console.error('Error al guardar criptomonedas:', err);
      
      let errorMessage = 'Error al guardar tus selecciones';
      if (err.response) {
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
          navigate('/login');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container" style={{ backgroundColor: theme.colors.background }}>
        <div className="spinner" style={{ borderTopColor: theme.colors.primary }}></div>
        <p style={{ color: theme.colors.textPrimary }}>Cargando criptomonedas...</p>
      </div>
    );
  }

  return (
    <div className="crypto-selection-container" style={{ backgroundColor: theme.colors.background }}>
      <div className="selection-card" style={{ backgroundColor: theme.colors.surface }}>
        <h2 style={{ color: theme.colors.primary }}>Selecciona tus criptomonedas</h2>
        
        <div className="plan-info" style={{ color: theme.colors.textSecondary }}>
          Plan: <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{userPlan}</span> 
          (Máximo {maxSelection} {maxSelection === 1 ? 'criptomoneda' : 'criptomonedas'})
        </div>
        
        <div className="selection-status">
          Seleccionadas: {selectedCryptos.length}/{maxSelection}
        </div>

        {error && (
          <div className="error-message" style={{ color: theme.colors.error }}>
            {error}
          </div>
        )}

        <div className="crypto-grid">
          {allCryptos.map(crypto => (
            <div 
              key={crypto.id}
              className={`crypto-card ${selectedCryptos.includes(crypto.id) ? 'selected' : ''}`}
              onClick={() => handleCryptoSelect(crypto.id)}
              style={{
                backgroundColor: selectedCryptos.includes(crypto.id) 
                  ? theme.colors.primary 
                  : theme.colors.paper,
                color: selectedCryptos.includes(crypto.id)
                  ? theme.colors.textOnPrimary
                  : theme.colors.textPrimary,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div className="crypto-name">{crypto.name}</div>
              <div className="crypto-symbol">{crypto.symbol}</div>
            </div>
          ))}
        </div>

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={selectedCryptos.length === 0}
          style={{
            backgroundColor: selectedCryptos.length === 0 
              ? theme.colors.disabled 
              : theme.colors.primary,
            color: theme.colors.textOnPrimary
          }}
        >
          Confirmar selección
        </button>
      </div>
    </div>
  );
};

export default CryptoSelection;