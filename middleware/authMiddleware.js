const asyncHandler = require("express-async-handler")
const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")

const protect = asyncHandler(async (req, res, next) => {


    try {
        const token = req.cookies.token
        if (!token) {
            res.status(401)
            throw new Error("User not authorized , Please Log in")
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(verified.id).select("-password")
        if (!user) {
            res.status(401)
            throw new Error("User not Found")
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401)
        throw new Error("User not authorized, Please Log in")
    }
})

module.exports = protect;