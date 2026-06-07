import React from 'react';
import { getWeatherInfo, formatDate } from '../lib/weatherAPI';

const ForecastCard = ({ day }) => {
  const weather = getWeatherInfo(day.weather_code);
  const avgTemp = Math.round((day.temperature_2m_max + day.temperature_2m_min) / 2);

  return (
    <div className="forecast-card">
      <div className="forecast-date">{formatDate(day.date)}</div>
      <div className="forecast-icon" title={weather.description}>
        {weather.icon}
      </div>
      <div className="forecast-description">{weather.description}</div>
      <div className="forecast-temps">
        <span className="temp-max" title="Max temperature">
          {Math.round(day.temperature_2m_max)}°C
        </span>
        <span className="temp-min" title="Min temperature">
          {Math.round(day.temperature_2m_min)}°C
        </span>
      </div>
      <div className="forecast-stats">
        <div className="forecast-wind" title="Max wind speed">
          💨 {Math.round(day.wind_speed_10m_max)} km/h
        </div>
        {day.precipitation_sum > 0 && (
          <div className="forecast-rain" title="Precipitation">
            🌧️ {day.precipitation_sum.toFixed(1)} mm
          </div>
        )}
        {day.precipitation_probability_max > 0 && (
          <div className="forecast-rain-chance" title="Rain chance">
            💧 {day.precipitation_probability_max}%
          </div>
        )}
      </div>
      {day.uv_index_max > 0 && (
        <div className="forecast-uv" title="UV Index">
          ☀️ UV: {Math.round(day.uv_index_max)}
        </div>
      )}
    </div>
  );
};

export default ForecastCard;
