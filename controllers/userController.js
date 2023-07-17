const asyncHandler = require("express-async-handler")
const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs/dist/bcrypt")


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body


    //if User did not enter any field
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all the required fields")
    }

    //Check the password length
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must have atleast 6 Characters")
    }

    //Check the email is unique
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error("Email is already Registered")
    }



    //Create new user
    const newUser = await User.create({
        name,
        email,
        password
    })

    //Generate Token
    const token = generateToken(newUser._id)

    //Http only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })

    //Read the newly registered user data
    if (newUser) {
        const { _id, name, password, email } = newUser
        res.status(200).json({
            _id,
            name,
            password,
            email,
            token
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation

    // Check for both email password field is filled
    if (!email || !password) {
        res.status(400)
        throw new Error("Please enter all the required Fields")
    }

    //Check email existence
    const emailUser = await User.findOne({ email })
    if (!emailUser) {
        res.status(400);
        throw new Error("The User is not registered, Please Register")
    }

    // Check the password
    const checkPassword = await bcrypt.compare(password, emailUser.password);

    //Token for Login

    const token = generateToken(emailUser._id);
    if (checkPassword) {
        // Saving the token in cookie form
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        })
    }

    // See the details of the login user
    if (checkPassword && emailUser) {
        const { _id, name, email, password, token } = emailUser
        res.status(200).json({
            _id, name, email, password, token
        })
    } else {
        res.status(400);
        throw new Error("Something went wrong")
    }


})


//LOgout using cookie expiration
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });

    return res.status(200).json({ message: "User Successfully logged out" })
})

//Get user Data

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const { _id, name, email } = user
        res.status(200).json({
            _id,
            name,
            email
        })
    }
    else {
        res.status(400)
        throw new Error("User not Authorized , Please Log in")
    }
})


// User Status

const userStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.json(false)
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET)

    if (verified) {
        return res.json(true)
    } else {
        return res.json(false)
    }
})


//Update User

const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {
        const { name, email } = user
        user.name = req.body.name || name;
        user.email = email;

        const updated = await user.save();
        res.status(200).json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
        })
    } else {
        res.status(404)
        throw new Error("User not Found")
    }
})

// Chnage password

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    const { oldPassword, password } = req.body

    // Check wheather the user is there or not
    if (!user) {
        res.status(400)
        throw new Error("User is not found , Please Sign up")
    }

    //Check for Fields
    if (!oldPassword || !password) {
        res.status(400)
        throw new Error("Enter all the required fields")
    }

    // Check whether old password matches with DB
    const passwordCorrect = await bcrypt.compare(oldPassword, user.password)

    if (user && passwordCorrect) {

        user.password = password
        await user.save();
        res.status(200).send(("Password changed successfully"))

    } else {
        res.status(400)
        throw new Error("Old password is wrong")
    }
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    userStatus,
    updateUser,
    changePassword

}