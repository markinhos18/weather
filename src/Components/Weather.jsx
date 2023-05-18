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

  function converterDirecaoVento(graus) {
    // Definir os intervalos de graus para cada nome cardeal
    const intervalos = [
      { nome: 'Norte', de: 0, ate: 22.5 },
      { nome: 'Norte-Nordeste', de: 22.5, ate: 67.5 },
      { nome: 'Nordeste', de: 67.5, ate: 112.5 },
      { nome: 'Leste-Nordeste', de: 112.5, ate: 157.5 },
      { nome: 'Leste', de: 157.5, ate: 202.5 },
      { nome: 'Leste-Sudeste', de: 202.5, ate: 247.5 },
      { nome: 'Sudeste', de: 247.5, ate: 292.5 },
      { nome: 'Sul-Sudeste', de: 292.5, ate: 337.5 },
      { nome: 'Sul', de: 337.5, ate: 360 }
    ];
  
    // Verificar em qual intervalo o valor de graus se encaixa
    for (const intervalo of intervalos) {
      if (graus >= intervalo.de && graus < intervalo.ate) {
        return intervalo.nome;
      }
    }
  
    // Se o valor estiver fora do intervalo (por exemplo, 360), retornar 'N'
    return 'Direção do vento não encontrada';
  }




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
          
          <p>Temperatura {weatherData.current_weather.temperature}<b>°C</b></p>
          <p>Velocidade do vento {weatherData.current_weather.windspeed} km/h</p>
          {/* <p>Direção do vento {weatherData.current_weather.winddirection} </p> */}
          <p>Direção do vento {converterDirecaoVento(weatherData.current_weather.winddirection)} </p>
          <p>{formatarDataHora(weatherData.current_weather.time)} </p>

        </div>
      )}
      </div>
    
  );
}

export default App;
