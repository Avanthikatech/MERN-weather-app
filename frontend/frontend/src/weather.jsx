// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getWeather = async () => {
        const trimmedCity = city.trim();  
        console.log(`City input: "${trimmedCity}"`); 

        if (!trimmedCity) {
            setError('Please enter a city name');
            console.log('Error: No city entered'); 
            return;
        }

        setLoading(true);
        try {
            console.log('Fetching weather data...'); 
            const response = await axios.get(`http://localhost:5000/api/weather?city=${trimmedCity}`);
            console.log('Weather data received:', response.data); 
            setWeather(response.data);
            setError('');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setError('City not found');
            } else {
                setError('Failed to fetch weather data');
            }
            setWeather(null);
        } finally {
            setLoading(false);
            console.log('Loading finished'); 
        }
    };

    return (
        <div className="weather-container">
            <h1>Weather App</h1>
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={() => { console.log('Button clicked'); getWeather(); }} disabled={loading}>
                {loading ? 'Loading...' : 'Get Weather'}
            </button>

            {weather && (
                <div className="weather-info">
                    <h2>{weather.city}</h2> {/* Adjusted to access the 'city' property */}
                    <p>Temperature: {Math.round(weather.temperature)}°C</p> {/* Directly using temperature */}
                    <p>Condition: {weather.condition}</p> {/* Directly using condition */}
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    );
};

export default Weather;
