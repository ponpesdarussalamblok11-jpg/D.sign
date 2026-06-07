import React, { useState } from 'react';
import { searchCities } from '../lib/weatherAPI';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const results = await searchCities(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    setQuery(city.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    }
  };

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        onSearch({ latitude, longitude, name: 'Your Location' });
        setQuery('Your Location');
        setSuggestions([]);
        setShowSuggestions(false);
      });
    } catch (error) {
      alert('Unable to access your location');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a city..."
            className="search-input"
            disabled={loading}
          />
          <button type="submit" className="search-button" disabled={loading}>
            🔍
          </button>
          <button
            type="button"
            className="geolocation-button"
            onClick={handleGeolocation}
            disabled={loading}
            title="Use my location"
          >
            📍
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((city, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSelectCity(city)}
              >
                <span className="city-name">{city.name}</span>
                {city.admin1 && <span className="city-region">, {city.admin1}</span>}
                <span className="city-country">, {city.country}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
