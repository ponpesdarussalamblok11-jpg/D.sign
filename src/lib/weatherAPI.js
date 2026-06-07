// Weather API utilities for Open-Meteo API

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

// Weather code to description mapping
const weatherCodeMap = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌦️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '🌨️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌧️' },
  81: { description: 'Moderate rain showers', icon: '⛈️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with hail', icon: '⛈️' },
};

// Get weather description and icon from weather code
export const getWeatherInfo = (code) => {
  return weatherCodeMap[code] || { description: 'Unknown', icon: '🌡️' };
};

// Fetch current weather and forecast data
export const fetchWeather = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,feels_like_temperature_2m,precipitation,weather_code,uv_index',
      hourly: 'temperature_2m,weather_code,precipitation_probability',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}/forecast?${params}`);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    return await response.json();
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

// Search for cities
export const searchCities = async (query) => {
  try {
    const params = new URLSearchParams({
      name: query,
      count: 10,
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_URL}/search?${params}`);
    if (!response.ok) throw new Error('Failed to search cities');
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Geocoding API error:', error);
    throw error;
  }
};

// Get location coordinates from city name
export const getLocationCoordinates = async (city) => {
  try {
    const results = await searchCities(city);
    if (results.length === 0) throw new Error('City not found');
    return results[0]; // Return first result
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
};

// Get user's geolocation
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
};

// Format time for display
export const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Get cached weather data
export const getCachedWeather = (cacheKey) => {
  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  const now = Date.now();
  const cacheExpiry = 30 * 60 * 1000; // 30 minutes

  if (now - timestamp > cacheExpiry) {
    localStorage.removeItem(cacheKey);
    return null;
  }

  return data;
};

// Cache weather data
export const cacheWeather = (cacheKey, data) => {
  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};
