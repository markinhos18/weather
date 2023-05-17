import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [address, setAddress] = useState('');


  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://geocode.maps.co/search?q=${address}`
      );
      const { latitude, longitude } = response.data.results[0].geometry;
      fetchWeatherData(latitude, longitude);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCoordinates();
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>
      {weatherData && (
        <div className="weather-container">
          <h2>{weatherData.city.name}</h2>
          <p>{weatherData.current_condition.temperature}°C</p>
          <p>{weatherData.current_condition.weather}</p>
        </div>
      )}
    </div>
  );
}

export default App;
