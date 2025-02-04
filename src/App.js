import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PredictionBasic from './pages/PredictionBasic';
import PredictionPro from './pages/PredictionPro';
import PredictionPremium from './pages/PredictionPremium';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prediction-basic" element={<PredictionBasic />} />
        <Route path="/prediction-pro" element={<PredictionPro />} />
        <Route path="/prediction-premium" element={<PredictionPremium />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;