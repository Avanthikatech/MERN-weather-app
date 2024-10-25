const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;

// Use CORS middleware
app.use(cors());

let db;

// Connect to MongoDB
async function connectToDatabase() {
    const uri = process.env.MONGODB_URI;

    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db('weatherApp');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        const apiKey = process.env.API_KEY;
        console.log(`Fetching weather data for city: ${city}`); // Use backticks here
        
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`); // Use backticks here
        
        const weatherData = {
            city: weatherResponse.data.location.name,
            temperature: weatherResponse.data.current.temp_c,
            condition: weatherResponse.data.current.condition.text,
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
});

// Start the server
app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server running on port ${PORT}`); // Use backticks here
});
