const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

//Middleware
app.use(express.json())


//Mongodb Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

//Port declaration
const port = process.env.PORT || 5000;

//Testing Route
app.get('/', (req, res) => {
    res.send('Server Running')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})