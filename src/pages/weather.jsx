import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import HourlyForecast from '../components/HourlyForecast';
import FavoritesBar from '../components/FavoritesBar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchWeather,
  getLocationCoordinates,
  getCachedWeather,
  cacheWeather,
  formatTime,
  getFavorites,
} from '../lib/weatherAPI';
import '../styles/weather.css';

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('London');
  const [coordinates, setCoordinates] = useState({ latitude: 51.5085, longitude: -0.1257 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load favorites
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Fetch weather on mount
  useEffect(() => {
    fetchWeatherData(location, coordinates);
  }, []);

  const fetchWeatherData = async (city, coords = null) => {
    setLoading(true);
    setError(null);

    try {
      let lat, lon, cityName;

      if (coords && coords.latitude && coords.longitude) {
        // Use provided coordinates
        lat = coords.latitude;
        lon = coords.longitude;
        cityName = city;
      } else if (typeof city === 'object' && city.latitude && city.longitude) {
        // City object with coordinates
        lat = city.latitude;
        lon = city.longitude;
        cityName = city.name || 'Unknown Location';
      } else {
        // String city name - need to geocode
        try {
          const locationData = await getLocationCoordinates(city);
          lat = locationData.latitude;
          lon = locationData.longitude;
          cityName = locationData.name;
        } catch (err) {
          setError(`Could not find city: ${city}`);
          setLoading(false);
          return;
        }
      }

      // Check cache
      const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
      const cachedData = getCachedWeather(cacheKey);

      if (cachedData) {
        processWeatherData(cachedData, cityName, lat, lon);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const weatherData = await fetchWeather(lat, lon);
      cacheWeather(cacheKey, weatherData);
      processWeatherData(weatherData, cityName, lat, lon);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const processWeatherData = (weatherData, cityName, latitude, longitude) => {
    setWeather(weatherData);
    setLocation(cityName);
    setCoordinates({ latitude, longitude });

    // Process hourly forecast (next 48 hours)
    if (weatherData.hourly && weatherData.hourly.time) {
      const hourlyData = [];
      for (let i = 0; i < Math.min(48, weatherData.hourly.time.length); i++) {
        hourlyData.push({
          time: formatTime(weatherData.hourly.time[i]),
          temperature: weatherData.hourly.temperature_2m[i],
          weather_code: weatherData.hourly.weather_code[i],
          precipitation_probability: weatherData.hourly.precipitation_probability[i],
          wind_speed: weatherData.hourly.wind_speed_10m[i],
          wind_direction: weatherData.hourly.wind_direction_10m[i],
        });
      }
      setHourlyForecast(hourlyData);
    }

    // Process daily forecast
    if (weatherData.daily && weatherData.daily.time) {
      const dailyData = weatherData.daily.time.map((date, index) => ({
        date,
        weather_code: weatherData.daily.weather_code[index],
        temperature_2m_max: weatherData.daily.temperature_2m_max[index],
        temperature_2m_min: weatherData.daily.temperature_2m_min[index],
        precipitation_sum: weatherData.daily.precipitation_sum[index],
        precipitation_probability_max: weatherData.daily.precipitation_probability_max[index],
        wind_speed_10m_max: weatherData.daily.wind_speed_10m_max[index],
        uv_index_max: weatherData.daily.uv_index_max[index],
      }));
      setDailyForecast(dailyData);
    }
  };

  const handleSearch = (city) => {
    fetchWeatherData(city);
  };

  const handleFavoriteSelect = (favorite) => {
    fetchWeatherData(favorite.name, {
      latitude: favorite.latitude,
      longitude: favorite.longitude,
    });
  };

  return (
    <div className="weather-dashboard">
      <header className="weather-header-main">
        <h1 className="dashboard-title">🌤️ Advanced Weather Dashboard</h1>
        <p className="dashboard-subtitle">Real-time global weather forecasting</p>
      </header>

      <div className="dashboard-container">
        <aside className="sidebar">
          <FavoritesBar favorites={favorites} onSelectFavorite={handleFavoriteSelect} />
        </aside>

        <main className="main-content">
          <SearchBar onSearch={handleSearch} loading={loading} />

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {loading && <LoadingSpinner />}

          {weather && !loading && (
            <>
              <WeatherCard
                weather={weather}
                location={location}
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
                onFavoriteChange={() => setFavorites(getFavorites())}
              />

              {hourlyForecast.length > 0 && <HourlyForecast hourlyData={hourlyForecast} />}

              {dailyForecast.length > 0 && (
                <section className="forecast-section">
                  <h2>📅 7-Day Forecast</h2>
                  <div className="daily-forecast">
                    {dailyForecast.map((day, index) => (
                      <ForecastCard key={index} day={day} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
