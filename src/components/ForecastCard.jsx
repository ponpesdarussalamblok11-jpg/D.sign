import React from 'react';
import { getWeatherInfo, formatDate } from '../lib/weatherAPI';

const ForecastCard = ({ day }) => {
  const weather = getWeatherInfo(day.weather_code);
  const temp = Math.round((day.temperature_2m_max + day.temperature_2m_min) / 2);

  return (
    <div className="forecast-card">
      <div className="forecast-date">{formatDate(day.date)}</div>
      <div className="forecast-icon">{weather.icon}</div>
      <div className="forecast-description">{weather.description}</div>
      <div className="forecast-temps">
        <span className="temp-max">{Math.round(day.temperature_2m_max)}°C</span>
        <span className="temp-min">{Math.round(day.temperature_2m_min)}°C</span>
      </div>
      <div className="forecast-wind">💨 {Math.round(day.wind_speed_10m_max)} km/h</div>
      {day.precipitation_sum > 0 && (
        <div className="forecast-rain">🌧️ {day.precipitation_sum.toFixed(1)} mm</div>
      )}
    </div>
  );
};

export default ForecastCard;
