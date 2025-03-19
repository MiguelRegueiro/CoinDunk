// src/pages/Contacto.js
import React, { useContext } from 'react';
import { ThemeContext } from '../context/Theme'; // Importa el contexto del tema
import './Contacto.css'; // Archivo de estilos

const Contacto = () => {
  const theme = useContext(ThemeContext); // Accede al tema

  if (!theme) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga si el tema no está disponible
  }

  return (
    <div
      className="contacto-container"
      style={{
        backgroundColor: theme.colors.background, // Fondo dinámico
        color: theme.colors.text, // Texto dinámico
      }}
    >
      {/* Encabezado */}
      <div className="contacto-header">
        <h1>Contacto</h1>
        <p>¿Tienes alguna pregunta? ¡No dudes en contactarnos!</p>
      </div>

      {/* Contenido principal */}
      <div className="contacto-content">
        {/* Información de contacto */}
        <div className="contacto-info">
          <h2>Información de contacto</h2>
          <p>
            <strong>Dirección:</strong> Calle Gran Vía, 28, 28013 Madrid, España
          </p>
          <p>
            <strong>Teléfono:</strong> +34 912 345 678
          </p>
          <p>
            <strong>Correo electrónico:</strong> contacto@coindunk.com
          </p>
        </div>

        {/* Formulario de contacto */}
        <div className="contacto-form">
          <h2>Envíanos un mensaje</h2>
          <form>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo electrónico"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="asunto">Asunto</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                placeholder="Asunto del mensaje"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe tu mensaje aquí"
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Enviar mensaje
            </button>
          </form>
        </div>

        {/* Mapa interactivo */}
        <div className="contacto-mapa">
          <h2>Nuestra ubicación</h2>
          <iframe
            title="Ubicación de CoinDunk"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.454267787643!2d-3.703790384603823!3d40.41900837936478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e3a7a7a81%3A0x1b1b1b1b1b1b1b1b!2sCalle%20Gran%20V%C3%ADa%2C%2028%2C%2028013%20Madrid%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1622549404251!5m2!1ses!2ses"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacto;