# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from a public weather API.

## Features

- 🌡️ Real-time weather data
- 📍 Location-based weather search
- 📊 Hourly & 7-day forecast
- 🌍 Global city support
- 📱 Fully responsive design
- 🎨 Beautiful UI with weather icons
- ⚡ Fast and lightweight
- 🔄 Auto-refresh weather data

## Tech Stack

- **Frontend**: React, Next.js, HTML/CSS
- **API**: Open-Meteo Weather API (Free, no API key required)
- **State Management**: React Hooks
- **Styling**: CSS Grid & Flexbox

## API Used

**Open-Meteo API** - Free weather API with no authentication required
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Documentation: https://open-meteo.com/en/docs

## Quick Start

```bash
# Navigate to project
cd path/to/D.sign

# Install dependencies
npm install

# Run development server
npm run dev

# Visit the weather dashboard
http://localhost:3000/weather
```

## Project Structure

```
src/
├── pages/
│   └── weather.jsx              # Main weather dashboard page
├── components/
│   ├── WeatherCard.jsx          # Weather display card
│   ├── ForecastCard.jsx         # Forecast card component
│   ├── SearchBar.jsx            # City search component
│   └── LoadingSpinner.jsx       # Loading indicator
├── lib/
│   └── weatherAPI.js            # Weather API utilities
└── styles/
    └── weather.css              # Weather dashboard styles
```

## Features Explained

### Current Weather Display
- Temperature, humidity, wind speed
- Weather condition with icon
- Feels-like temperature
- UV index and precipitation chance

### Forecast
- Hourly forecast (next 24 hours)
- 7-day weather forecast
- Min/max temperatures
- Weather conditions for each day

### Location Search
- Search by city name
- Auto-suggestions from geocoding API
- Save favorite locations (LocalStorage)
- Geolocation support

## Usage

1. **Enter a city name** in the search bar
2. **Select from suggestions** or press Enter
3. **View current weather** and forecasts
4. **Check hourly details** for the next 24 hours
5. **Plan ahead** with 7-day forecast

## API Integration

The dashboard uses the **Open-Meteo API** which provides:
- No rate limits for non-commercial use
- Real-time weather data
- Historical data
- Forecast data
- Air quality data

```javascript
// Example API call
const response = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min`
);
```

## Customization

### Change Units
Modify the API parameters to switch between:
- Temperature: Celsius/Fahrenheit
- Wind Speed: km/h, m/s, mph, kn
- Precipitation: mm, inches

### Add More Weather Data
- Air quality index
- Pressure levels
- Visibility
- Pollen counts

## Deployment

### Vercel (Recommended)
```bash
git push origin weather-dashboard
# Create PR and merge
# Vercel auto-deploys
```

### Other Platforms
Just push to your hosting service - no environment variables needed!

## Performance

- API calls cached for 30 minutes
- Images lazy-loaded
- CSS optimized
- Responsive images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### "City not found"
- Try alternative city name
- Check spelling
- Some small cities may not be in the database

### "Unable to get location"
- Check geolocation permissions in browser
- Allow location access when prompted

### Forecast data is outdated
- Wait 30 minutes for cache to refresh
- Manually refresh browser (Ctrl+F5)

## License

MIT - Free to use and modify

## Contributing

Feel free to fork and submit pull requests with improvements!

## Resources

- [Open-Meteo API Docs](https://open-meteo.com/en/docs)
- [Weather Codes Reference](https://open-meteo.com/en/docs#wmo_weather_codes)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Version**: 1.0.0
**Last Updated**: 2024