const mongoose = require('mongoose');
const fs = require('fs');

// Replace with your MongoDB connection string
const uri = process.env.MONGODB_URI;

// Define your data model
const WeatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    condition: String
});

const Weather = mongoose.model('Weather', WeatherSchema);

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Read the JSON file
        fs.readFile('weatherData.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return;
            }
            // Parse JSON and insert into database
            const weatherData = JSON.parse(data);
            Weather.insertMany(weatherData)
                .then(() => {
                    console.log('Data inserted successfully');
                    mongoose.connection.close();
                })
                .catch(err => {
                    console.error('Error inserting data:', err);
                    mongoose.connection.close();
                });
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
