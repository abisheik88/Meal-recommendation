const mongoose = require('mongoose')

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dietary_preference: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    diet_type: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Food = mongoose.model('Food', FoodSchema)

module.exports = Food;

