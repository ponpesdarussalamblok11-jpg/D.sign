import React from 'react';
import { getWeatherInfo, formatDate } from '../lib/weatherAPI';

const HourlyForecast = ({ hourlyData }) => {
  return (
    <div className="hourly-forecast-container">
      <h2 className="forecast-title">📊 Hourly Forecast</h2>
      <div className="hourly-forecast">
        {hourlyData.map((hour, index) => {
          const weather = getWeatherInfo(hour.weather_code);
          return (
            <div key={index} className="hourly-item">
              <div className="hour-time">{hour.time}</div>
              <div className="hour-icon" title={weather.description}>
                {weather.icon}
              </div>
              <div className="hour-temp">{Math.round(hour.temperature)}°C</div>
              <div className="hour-wind" title="Wind speed">
                💨 {Math.round(hour.wind_speed)}km/h
              </div>
              <div className="hour-rain" title="Rain probability">
                💧 {hour.precipitation_probability}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
