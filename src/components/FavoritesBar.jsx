import React from 'react';
import { removeFavorite } from '../lib/weatherAPI';

const FavoritesBar = ({ favorites, onSelectFavorite }) => {
  const handleRemove = (e, name) => {
    e.stopPropagation();
    removeFavorite(name);
    window.location.reload();
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-bar empty">
        <p>⭐ Click star to add favorites</p>
      </div>
    );
  }

  return (
    <div className="favorites-bar">
      <h3>⭐ Saved Locations</h3>
      <div className="favorites-list">
        {favorites.map((favorite, index) => (
          <div key={index} className="favorite-item" onClick={() => onSelectFavorite(favorite)}>
            <span className="favorite-name">{favorite.name}</span>
            {favorite.country && <span className="favorite-country">{favorite.country}</span>}
            <button
              className="favorite-remove"
              onClick={(e) => handleRemove(e, favorite.name)}
              title="Remove from favorites"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesBar;
