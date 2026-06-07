import React from 'react';
import { getWeatherInfo } from '../lib/weatherAPI';

const WeatherCard = ({ weather, location }) => {
  const current = weather.current;
  const weatherInfo = getWeatherInfo(current.weather_code);

  return (
    <div className="weather-card-main">
      <div className="weather-header">
        <h1 className="location-name">{location}</h1>
        <p className="update-time">
          Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="weather-content">
        <div className="weather-main">
          <div className="weather-icon-large">{weatherInfo.icon}</div>
          <div className="weather-temp">
            <span className="temperature">{Math.round(current.temperature_2m)}°C</span>
            <span className="feels-like">Feels like {Math.round(current.feels_like_temperature_2m)}°C</span>
          </div>
        </div>

        <div className="weather-description">{weatherInfo.description}</div>

        <div className="weather-grid">
          <div className="weather-item">
            <span className="weather-label">Humidity</span>
            <span className="weather-value">{current.relative_humidity_2m}%</span>
          </div>
          <div className="weather-item">
            <span className="weather-label">Wind Speed</span>
            <span className="weather-value">{Math.round(current.wind_speed_10m)} km/h</span>
          </div>
          <div className="weather-item">
            <span className="weather-label">Precipitation</span>
            <span className="weather-value">{current.precipitation || 0} mm</span>
          </div>
          <div className="weather-item">
            <span className="weather-label">UV Index</span>
            <span className="weather-value">{Math.round(current.uv_index)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
