import React, { useState, useEffect } from 'react';
import { searchCities, getUserLocation } from '../lib/weatherAPI';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchCities(value);
        setSuggestions(results.slice(0, 8));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
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
    } else if (query.length > 0) {
      // Try searching with the entered query
      handleSelectCity({ name: query });
    }
  };

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await getUserLocation();
      onSearch({
        latitude: position.latitude,
        longitude: position.longitude,
        name: 'Your Location',
      });
      setQuery('Your Location');
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      alert('Unable to access your location: ' + error.message);
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
            placeholder="🔍 Search for a city..."
            className="search-input"
            disabled={loading || isSearching}
            autoComplete="off"
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading || isSearching}
            title="Search"
          >
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
                {city.admin1 && (
                  <span className="city-region">, {city.admin1}</span>
                )}
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
