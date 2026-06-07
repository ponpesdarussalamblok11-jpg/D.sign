// Enhanced Weather API utilities for Open-Meteo
// Free weather API with no authentication required

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

// Comprehensive weather code to description mapping
const weatherCodeMap = {
  0: { description: 'Clear sky', icon: '☀️', color: '#FFD700' },
  1: { description: 'Mainly clear', icon: '🌤️', color: '#FFA500' },
  2: { description: 'Partly cloudy', icon: '⛅', color: '#87CEEB' },
  3: { description: 'Overcast', icon: '☁️', color: '#B0C4DE' },
  45: { description: 'Foggy', icon: '🌫️', color: '#A9A9A9' },
  48: { description: 'Depositing rime fog', icon: '🌫️', color: '#A9A9A9' },
  51: { description: 'Light drizzle', icon: '🌦️', color: '#87CEEB' },
  53: { description: 'Moderate drizzle', icon: '🌧️', color: '#4169E1' },
  55: { description: 'Dense drizzle', icon: '🌧️', color: '#1E90FF' },
  61: { description: 'Slight rain', icon: '🌧️', color: '#4169E1' },
  63: { description: 'Moderate rain', icon: '🌧️', color: '#1E90FF' },
  65: { description: 'Heavy rain', icon: '⛈️', color: '#00008B' },
  71: { description: 'Slight snow', icon: '🌨️', color: '#F0F8FF' },
  73: { description: 'Moderate snow', icon: '❄️', color: '#E0FFFF' },
  75: { description: 'Heavy snow', icon: '❄️', color: '#B0E0E6' },
  77: { description: 'Snow grains', icon: '❄️', color: '#F0FFFF' },
  80: { description: 'Slight rain showers', icon: '🌦️', color: '#87CEEB' },
  81: { description: 'Moderate rain showers', icon: '⛈️', color: '#1E90FF' },
  82: { description: 'Violent rain showers', icon: '⛈️', color: '#00008B' },
  85: { description: 'Slight snow showers', icon: '🌨️', color: '#E0FFFF' },
  86: { description: 'Heavy snow showers', icon: '❄️', color: '#B0E0E6' },
  95: { description: 'Thunderstorm', icon: '⛈️', color: '#2F4F4F' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️', color: '#1C1C1C' },
  99: { description: 'Thunderstorm with hail', icon: '⛈️', color: '#1C1C1C' },
};

/**
 * Get weather description and icon from WMO weather code
 * @param {number} code - WMO weather code
 * @returns {Object} {description, icon, color}
 */
export const getWeatherInfo = (code) => {
  return (
    weatherCodeMap[code] || {
      description: 'Unknown',
      icon: '🌡️',
      color: '#808080',
    }
  );
};

/**
 * Fetch current weather and forecast data from Open-Meteo API
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Weather data
 */
export const fetchWeather = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current:
        'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,feels_like_temperature_2m,precipitation,weather_code,uv_index,weather_code,visibility,pressure_msl,dew_point_2m',
      hourly:
        'temperature_2m,weather_code,precipitation_probability,wind_speed_10m,wind_direction_10m',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}/forecast?${params}`);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

/**
 * Search for cities with geocoding
 * @param {string} query - City name or search query
 * @returns {Promise<Array>} Array of location results
 */
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

/**
 * Get coordinates for a city name
 * @param {string} city - City name
 * @returns {Promise<Object>} Location data with coordinates
 */
export const getLocationCoordinates = async (city) => {
  try {
    const results = await searchCities(city);
    if (results.length === 0) throw new Error('City not found');
    return results[0];
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
};

/**
 * Get user's current location using Geolocation API
 * @returns {Promise<Object>} {latitude, longitude}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  });
};

/**
 * Format time for display (HH:MM AM/PM)
 * @param {string} time - ISO time string
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date for display (Mon, Jan 1)
 * @param {string} date - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format full date and time
 * @param {string} datetime - ISO datetime string
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get wind direction from degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Cardinal direction (N, NE, E, etc.)
 */
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Get UV Index description
 * @param {number} index - UV Index value
 * @returns {string} Description
 */
export const getUVDescription = (index) => {
  if (index < 3) return 'Low';
  if (index < 6) return 'Moderate';
  if (index < 8) return 'High';
  if (index < 11) return 'Very High';
  return 'Extreme';
};

/**
 * Get cached weather data
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} Cached data or null if expired
 */
export const getCachedWeather = (cacheKey) => {
  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const cacheExpiry = 30 * 60 * 1000; // 30 minutes

    if (now - timestamp > cacheExpiry) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    localStorage.removeItem(cacheKey);
    return null;
  }
};

/**
 * Cache weather data in localStorage
 * @param {string} cacheKey - Cache key
 * @param {Object} data - Data to cache
 */
export const cacheWeather = (cacheKey, data) => {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

/**
 * Get all favorite locations
 * @returns {Array} Array of favorite locations
 */
export const getFavorites = () => {
  const favorites = localStorage.getItem('weatherFavorites');
  return favorites ? JSON.parse(favorites) : [];
};

/**
 * Add location to favorites
 * @param {Object} location - Location object {name, latitude, longitude}
 */
export const addFavorite = (location) => {
  const favorites = getFavorites();
  const exists = favorites.some(
    (fav) =>
      fav.latitude === location.latitude &&
      fav.longitude === location.longitude
  );

  if (!exists) {
    favorites.push({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country || '',
    });
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }
};

/**
 * Remove location from favorites
 * @param {string} name - Location name
 */
export const removeFavorite = (name) => {
  const favorites = getFavorites();
  const updated = favorites.filter((fav) => fav.name !== name);
  localStorage.setItem('weatherFavorites', JSON.stringify(updated));
};

/**
 * Check if location is in favorites
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {boolean} True if in favorites
 */
export const isFavorite = (latitude, longitude) => {
  const favorites = getFavorites();
  return favorites.some(
    (fav) => fav.latitude === latitude && fav.longitude === longitude
  );
};
