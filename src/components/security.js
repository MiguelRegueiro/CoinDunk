export const generateSecureRandom = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint32Array(length));
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    
    return result;
  };
  
  // Función para validar rutas de predicción
  export const validatePredictionPath = (path) => {
    const pattern = /^\/predicciones-[a-zA-Z0-9]+-[a-zA-Z0-9]{8}$/;
    return pattern.test(path);
  };