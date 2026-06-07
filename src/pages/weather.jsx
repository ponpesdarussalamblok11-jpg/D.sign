import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchWeather,
  getLocationCoordinates,
  getCachedWeather,
  cacheWeather,
  formatTime,
} from '../lib/weatherAPI';
import '../styles/weather.css';

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('London');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);

  // Fetch weather on mount (default to London)
  useEffect(() => {
    fetchWeatherData('London');
  }, []);

  // Fetch weather data
  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const cacheKey = `weather_${city.toLowerCase()}`;
      
      // Check cache first
      const cachedData = getCachedWeather(cacheKey);
      if (cachedData) {
        processWeatherData(cachedData, city);
        setLoading(false);
        return;
      }

      // Get coordinates
      let coords;
      if (typeof city === 'object' && city.latitude && city.longitude) {
        coords = city;
      } else {
        const locationData = await getLocationCoordinates(city);
        coords = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
      }

      setCoordinates(coords);

      // Fetch weather
      const weatherData = await fetchWeather(coords.latitude, coords.longitude);

      // Cache the data
      cacheWeather(cacheKey, weatherData);

      // Process data
      processWeatherData(weatherData, city?.name || city);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const processWeatherData = (weatherData, cityName) => {
    setWeather(weatherData);
    setLocation(cityName);

    // Process hourly forecast (next 24 hours)
    if (weatherData.hourly) {
      const hourlyData = [];
      const now = new Date();
      const nextHours = now.getHours() + 1;

      for (let i = 0; i < 24; i++) {
        const time = new Date(now);
        time.setHours(nextHours + i);
        const timeStr = time.toISOString().split('T')[0];
        const hourIndex = weatherData.hourly.time.findIndex(
          (t) => t.startsWith(timeStr) && parseInt(t.split('T')[1]) === time.getHours()
        );

        if (hourIndex !== -1) {
          hourlyData.push({
            time: formatTime(weatherData.hourly.time[hourIndex]),
            temperature: weatherData.hourly.temperature_2m[hourIndex],
            weather_code: weatherData.hourly.weather_code[hourIndex],
            precipitation_probability: weatherData.hourly.precipitation_probability[hourIndex],
          });
        }
      }
      setHourlyForecast(hourlyData);
    }

    // Process daily forecast
    if (weatherData.daily) {
      const dailyData = weatherData.daily.time.map((date, index) => ({
        date,
        weather_code: weatherData.daily.weather_code[index],
        temperature_2m_max: weatherData.daily.temperature_2m_max[index],
        temperature_2m_min: weatherData.daily.temperature_2m_min[index],
        precipitation_sum: weatherData.daily.precipitation_sum[index],
        wind_speed_10m_max: weatherData.daily.wind_speed_10m_max[index],
      }));
      setDailyForecast(dailyData.slice(0, 7)); // Show next 7 days
    }
  };

  const handleSearch = (city) => {
    fetchWeatherData(city);
  };

  return (
    <div className="weather-dashboard">
      <header className="weather-header-main">
        <h1 className="dashboard-title">🌤️ Weather Dashboard</h1>
        <p className="dashboard-subtitle">Real-time weather for your location</p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {weather && !loading && (
        <>
          <WeatherCard weather={weather} location={location} />

          {hourlyForecast.length > 0 && (
            <section className="forecast-section">
              <h2>Hourly Forecast</h2>
              <div className="hourly-forecast">
                {hourlyForecast.map((hour, index) => {
                  const { icon } = require('../lib/weatherAPI').getWeatherInfo(hour.weather_code);
                  return (
                    <div key={index} className="hourly-item">
                      <div className="hour-time">{hour.time}</div>
                      <div className="hour-icon">{icon}</div>
                      <div className="hour-temp">{Math.round(hour.temperature)}°C</div>
                      <div className="hour-rain">💧 {hour.precipitation_probability}%</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {dailyForecast.length > 0 && (
            <section className="forecast-section">
              <h2>7-Day Forecast</h2>
              <div className="daily-forecast">
                {dailyForecast.map((day, index) => (
                  <ForecastCard key={index} day={day} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
