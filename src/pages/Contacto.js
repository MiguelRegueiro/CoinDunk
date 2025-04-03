// src/pages/Contacto.js
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/Theme';
import './Contacto.css';

const Contacto = () => {
  const theme = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: ''
  });
  const [messages, setMessages] = useState([]);

  // Cargar mensajes existentes al montar el componente
  useEffect(() => {
    const loadMessages = () => {
      try {
        const savedMessages = localStorage.getItem('coindunk_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      }
    };
    loadMessages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setSubmitStatus({
        success: false,
        message: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generar un ID único para el mensaje
      const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const messageData = {
        id: messageId,
        ...formData,
        fecha: new Date().toISOString()
      };
      
      // Actualizar estado y localStorage
      const updatedMessages = [...messages, messageData];
      setMessages(updatedMessages);
      localStorage.setItem('coindunk_messages', JSON.stringify(updatedMessages));
      
      // Guardar también en un archivo en el proyecto (simulado)
      saveToProjectFile(updatedMessages);
      
      setSubmitStatus({
        success: true,
        message: '¡Mensaje enviado con éxito! (Guardado localmente)'
      });
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
      setSubmitStatus({
        success: false,
        message: 'Error al guardar el mensaje'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para simular guardado en archivo del proyecto
  const saveToProjectFile = (messagesData) => {
    // En un entorno real, aquí harías una petición a tu backend
    // para guardar los mensajes en un archivo del proyecto
    console.log('Mensajes para guardar en archivo:', messagesData);
    // Esto es solo para demostración - en producción necesitarías un backend
  };

  // Función para exportar mensajes a JSON
  const exportMessages = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `coindunk_messages_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!theme) {
    return (
      <div style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <div
      className="contacto-container"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        minHeight: '100vh'
      }}
    >
      {/* Encabezado */}
      <div className="contacto-header" style={{ position: 'relative' }}>
        <div style={{
          height: '150px',
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '60px',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            color: theme.colors.textOnPrimary,
            zIndex: 2,
            fontWeight: '700'
          }}>Contacto</h1>
          <p style={{
            fontSize: '1.2rem',
            color: theme.colors.textOnPrimary,
            maxWidth: '600px',
            zIndex: 2,
            opacity: 0.9
          }}>
            ¿Tienes alguna pregunta? ¡No dudes en contactarnos!
          </p>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: `${theme.colors.primaryLight}30`,
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-30px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: `${theme.colors.secondary}30`,
            zIndex: 1
          }}></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="contacto-content" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Información de contacto */}
        <div className="contacto-info" style={{
          backgroundColor: theme.colors.surface,
          borderRadius: '12px',
          padding: '30px',
          boxShadow: theme.colors.shadow,
          border: `1px solid ${theme.colors.border}`,
          height: 'fit-content'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '25px',
            color: theme.colors.primary,
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Información de contacto
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '50px',
              height: '3px',
              backgroundColor: theme.colors.primary,
              borderRadius: '3px'
            }}></span>
          </h2>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: '20px',
            paddingRight: '15px'
          }}>
            <div style={{
              backgroundColor: `${theme.colors.primary}20`,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                marginBottom: '5px',
                color: theme.colors.textPrimary
              }}>Dirección</h3>
              <p style={{ 
                color: theme.colors.textSecondary,
                lineHeight: '1.5'
              }}>Calle Gran Vía, 28, 28013 Madrid, España</p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: '20px',
            paddingRight: '15px'
          }}>
            <div style={{
              backgroundColor: `${theme.colors.primary}20`,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                marginBottom: '5px',
                color: theme.colors.textPrimary
              }}>Teléfono</h3>
              <p style={{ 
                color: theme.colors.textSecondary,
                lineHeight: '1.5'
              }}>+34 912 345 678</p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            paddingRight: '15px'
          }}>
            <div style={{
              backgroundColor: `${theme.colors.primary}20`,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '15px',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                marginBottom: '5px',
                color: theme.colors.textPrimary
              }}>Correo electrónico</h3>
              <p style={{ 
                color: theme.colors.textSecondary,
                lineHeight: '1.5'
              }}>contacto@coindunk.com</p>
            </div>
          </div>

          {/* Botón para exportar mensajes */}
          {messages.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <button
                onClick={exportMessages}
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.textOnPrimary,
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = theme.colors.secondaryHover;
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = theme.colors.secondary;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Exportar mensajes ({messages.length})
              </button>
            </div>
          )}
        </div>

        {/* Formulario de contacto */}
        <div className="contacto-form" style={{
          backgroundColor: theme.colors.surface,
          borderRadius: '12px',
          padding: '30px',
          boxShadow: theme.colors.shadow,
          border: `1px solid ${theme.colors.border}`
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '25px',
            color: theme.colors.primary,
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Envíanos un mensaje
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '50px',
              height: '3px',
              backgroundColor: theme.colors.primary,
              borderRadius: '3px',
            }}></span>
          </h2>
          
          {submitStatus.message && (
            <div style={{
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: submitStatus.success 
                ? `${theme.colors.success}20` 
                : `${theme.colors.error}20`,
              border: `1px solid ${submitStatus.success 
                ? theme.colors.success 
                : theme.colors.error}`,
              color: submitStatus.success 
                ? theme.colors.success 
                : theme.colors.error
            }}>
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ 
              marginBottom: '20px',
              paddingRight: '10px'
            }}>
              <label htmlFor="nombre" style={{
                display: 'block',
                fontSize: '1rem',
                marginBottom: '8px',
                color: theme.colors.textPrimary,
                fontWeight: '500'
              }}>Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.textPrimary,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div className="form-group" style={{ 
              marginBottom: '20px',
              paddingRight: '10px'
            }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '1rem',
                marginBottom: '8px',
                color: theme.colors.textPrimary,
                fontWeight: '500'
              }}>Correo electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo electrónico"
                required
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.textPrimary,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div className="form-group" style={{ 
              marginBottom: '20px',
              paddingRight: '10px'
            }}>
              <label htmlFor="asunto" style={{
                display: 'block',
                fontSize: '1rem',
                marginBottom: '8px',
                color: theme.colors.textPrimary,
                fontWeight: '500'
              }}>Asunto</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                placeholder="Asunto del mensaje"
                value={formData.asunto}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.textPrimary,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div className="form-group" style={{ 
              marginBottom: '25px',
              paddingRight: '10px'
            }}>
              <label htmlFor="mensaje" style={{
                display: 'block',
                fontSize: '1rem',
                marginBottom: '8px',
                color: theme.colors.textPrimary,
                fontWeight: '500'
              }}>Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe tu mensaje aquí"
                rows="5"
                required
                value={formData.mensaje}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.textPrimary,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting 
                  ? theme.colors.textDisabled 
                  : theme.colors.primary,
                color: theme.colors.textOnPrimary,
                padding: '14px 30px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                boxShadow: isSubmitting 
                  ? 'none' 
                  : `0 2px 10px ${theme.colors.primary}40`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = theme.colors.primaryHover;
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${theme.colors.primary}60`;
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = theme.colors.primary;
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 2px 10px ${theme.colors.primary}40`;
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4" opacity=".5" />
                    <path d="M12 18v4" opacity=".5" />
                    <path d="M4.93 4.93l2.83 2.83" opacity=".5" />
                    <path d="M16.24 16.24l2.83 2.83" opacity=".5" />
                    <path d="M2 12h4" opacity=".5" />
                    <path d="M18 12h4" opacity=".5" />
                    <path d="M4.93 19.07l2.83-2.83" opacity=".5" />
                    <path d="M16.24 7.76l2.83-2.83" opacity=".5" />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Enviar mensaje
                </>
              )}
            </button>
          </form>
        </div>

        {/* Mapa interactivo */}
        <div className="contacto-mapa" style={{
          gridColumn: '1 / -1',
          backgroundColor: theme.colors.surface,
          borderRadius: '12px',
          padding: '30px',
          boxShadow: theme.colors.shadow,
          border: `1px solid ${theme.colors.border}`
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '20px',
            color: theme.colors.primary,
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Nuestra ubicación
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '50px',
              height: '3px',
              backgroundColor: theme.colors.primary,
              borderRadius: '3px'
            }}></span>
          </h2>
          
          <iframe
            title="Ubicación de CoinDunk"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.454267787643!2d-3.703790384603823!3d40.41900837936478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e3a7a7a81%3A0x1b1b1b1b1b1b1b1b!2sCalle%20Gran%20V%C3%ADa%2C%2028%2C%2028013%20Madrid%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1622549404251!5m2!1ses!2ses"
            width="100%"
            height="400"
            style={{ 
              border: 0,
              borderRadius: '8px',
              filter: theme.isDarkMode ? 'grayscale(30%) invert(90%) hue-rotate(180deg)' : 'none'
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacto;