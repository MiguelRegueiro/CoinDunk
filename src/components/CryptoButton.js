import React from 'react';

const CryptoButton = ({ crypto, selectedCrypto, theme, handleCryptoSelect }) => {
  const isSelected = crypto.name === selectedCrypto;

  return (
    <button
      className={`crypto-button ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundColor: isSelected ? theme.colors.primary : theme.colors.cardBackground,
        color: isSelected ? '#fff' : theme.colors.text,
      }}
      onClick={() => handleCryptoSelect(crypto.name)}
    >
      {crypto.name}
    </button>
  );
};

export default CryptoButton;