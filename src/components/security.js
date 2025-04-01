// src/components/security.js
export const generateSecureRandom = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint32Array(length));
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  
  return result;
};

export const validatePredictionPath = (path) => {
  const user = JSON.parse(localStorage.getItem('coindunk_user'));
  if (!user) return false;
  
  const pattern = new RegExp(`^/predicciones-${user.username.toLowerCase()}-[a-zA-Z0-9]{8}$`);
  return pattern.test(path);
};