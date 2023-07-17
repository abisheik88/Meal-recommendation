const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please Enter a Valid Email"
        ]
    },
    password: {
        type: String,
        require: [true, "Please enter the password"],
        minLength: [6, "Password minimum contain 6 characters"],
        maxLength: [200, "Password shouldn't exceed 12 characters"]
    },
    dietary_preference: {
        type: String,
        required: true,
        default: ""
    },
    cuisine: {
        type: String,
        required: true,
        default: "",
    },
    diet_type: {
        type: String,
        required: true,
        default: ""
    }
}, { timeStamps: true })


//Password encryption even after modifiying
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword;
    next()
})

const User = mongoose.model('User', userSchema);
module.exports = User;