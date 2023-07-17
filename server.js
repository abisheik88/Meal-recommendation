const express = require('express');
const cors = require("cors")
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const errorhandler = require('./middleware/errorMiddleware');
const userRoute = require('./routes/UserRoute');
const cookieParser = require('cookie-parser');

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

// Error Middleware
app.use(errorhandler);


// Route Middleware
app.use("/api/users", userRoute)

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.log('err');
    })

const PORT = process.env.PORT || 5001;
app.get('/', (req, res) => {

    res.send('Server Running')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})