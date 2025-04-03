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
      <div 
        className="loading-container" 
        style={{ 
          backgroundColor: theme.colors.background,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="spinner" 
          style={{ 
            border: `4px solid ${theme.colors.divider}`,
            borderTop: `4px solid ${theme.colors.primary}`,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite'
          }}
        ></div>
        <p style={{ 
          color: theme.colors.textPrimary,
          marginTop: '20px',
          fontSize: '1.1rem'
        }}>
          Cargando criptomonedas...
        </p>
      </div>
    );
  }

  return (
    <div 
      className="crypto-selection-container" 
      style={{ 
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div 
        className="selection-card" 
        style={{ 
          backgroundColor: theme.colors.surface,
          borderRadius: '12px',
          padding: '30px',
          width: '100%',
          maxWidth: '900px',
          boxShadow: theme.colors.shadow,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 
            style={{ 
              color: theme.colors.primary,
              fontSize: '2rem',
              marginBottom: '10px'
            }}
          >
            Selecciona tus criptomonedas
          </h2>
          
          <div 
            className="plan-info" 
            style={{ 
              color: theme.colors.textSecondary,
              fontSize: '1.1rem',
              marginBottom: '5px'
            }}
          >
            Plan: <span style={{ 
              color: theme.colors.primary, 
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>{userPlan}</span>
          </div>
          
          <div 
            className="selection-status" 
            style={{
              color: theme.colors.textSecondary,
              fontSize: '0.95rem'
            }}
          >
            {selectedCryptos.length} de {maxSelection} {maxSelection === 1 ? 'criptomoneda seleccionada' : 'criptomonedas seleccionadas'}
          </div>
        </div>

        {error && (
          <div 
            className="error-message" 
            style={{ 
              color: theme.colors.error,
              backgroundColor: `${theme.colors.error}15`,
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center',
              border: `1px solid ${theme.colors.error}`
            }}
          >
            {error}
          </div>
        )}

        <div 
          className="crypto-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}
        >
          {allCryptos.map(crypto => (
            <div 
              key={crypto.id}
              className={`crypto-card ${selectedCryptos.includes(crypto.id) ? 'selected' : ''}`}
              onClick={() => handleCryptoSelect(crypto.id)}
              style={{
                backgroundColor: selectedCryptos.includes(crypto.id) 
                  ? theme.colors.primary 
                  : theme.colors.cardBackground,
                color: selectedCryptos.includes(crypto.id)
                  ? theme.colors.textOnPrimary
                  : theme.colors.textPrimary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.colors.shadow
                }
              }}
              onMouseOver={(e) => {
                if (!selectedCryptos.includes(crypto.id)) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.colors.shadow;
                  e.currentTarget.style.backgroundColor = theme.colors.paper;
                }
              }}
              onMouseOut={(e) => {
                if (!selectedCryptos.includes(crypto.id)) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = theme.colors.cardBackground;
                }
              }}
            >
              <div 
                className="crypto-name" 
                style={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginBottom: '5px'
                }}
              >
                {crypto.name}
              </div>
              <div 
                className="crypto-symbol" 
                style={{
                  color: selectedCryptos.includes(crypto.id)
                    ? theme.colors.textOnPrimary
                    : theme.colors.textSecondary,
                  fontSize: '0.9rem'
                }}
              >
                {crypto.symbol}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={selectedCryptos.length === 0}
            style={{
              backgroundColor: selectedCryptos.length === 0 
                ? theme.colors.textDisabled 
                : theme.colors.primary,
              color: theme.colors.textOnPrimary,
              border: 'none',
              borderRadius: '6px',
              padding: '12px 30px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: selectedCryptos.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedCryptos.length === 0 
                ? 'none' 
                : `0 2px 10px ${theme.colors.primary}40`,
              width: '100%',
              maxWidth: '300px'
            }}
            onMouseOver={(e) => {
              if (selectedCryptos.length > 0) {
                e.target.style.backgroundColor = theme.colors.primaryHover;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 4px 12px ${theme.colors.primary}60`;
              }
            }}
            onMouseOut={(e) => {
              if (selectedCryptos.length > 0) {
                e.target.style.backgroundColor = theme.colors.primary;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 2px 10px ${theme.colors.primary}40`;
              }
            }}
          >
            {isLoading ? 'Procesando...' : 'Confirmar selección'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoSelection;