import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [address, setAddress] = useState('');
  const [ dataAddress, setDataAddress] = useState('');


  const fetchWeatherData = async (data) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current_weather=true`
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
      
      const data = response.data[0];
      fetchWeatherData(data);
      setDataAddress(data);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCoordinates();
  };

  const formatarDataHora = (dataHora) => {
    const data = new Date(dataHora);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return data.toLocaleString('pt-BR', options);
  };


  // console.log(dataAddress);
  // console.log(weatherData);
  
  return (
    
      <div className='container'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escreva sua localização"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">
        
        <FontAwesomeIcon icon={faSearch} color='#FFF' />
        </button>
      </form>
      {weatherData && (
        <div className="weather-container">
          <h1>{dataAddress.display_name}</h1>
          
          <p>{weatherData.current_weather.temperature}<b>°C</b></p>
          <p>Velocidade {weatherData.current_weather.windspeed} km/h</p>
          <p>Direção do vento {weatherData.current_weather.winddirection} </p>
          <p>{formatarDataHora(weatherData.current_weather.time)} </p>

        </div>
      )}
      </div>
    
  );
}

export default App;
