import React from 'react';

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="spinner">
      <div className="spinner-circle"></div>
      <div className="spinner-circle"></div>
      <div className="spinner-circle"></div>
    </div>
    <p>Fetching weather data...</p>
  </div>
);

export default LoadingSpinner;
