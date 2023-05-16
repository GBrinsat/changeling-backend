const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")
const jwt = require("jsonwebtoken")
const {isAuthenticated} = require("../middleware/jwt.middleware")

const router= express.Router()
const saltRounds = 10

//Post /auth/signup - create a new user in database

router.post("/signup", (req, res) => {
    const { name, password } = req.body

    //check if name or password are empty strings

    if(name === "" || password === "") {
        res.status(400).json({message: "Please provide username and password"})
        return 
    }

    /* const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    } */

    User.findOne({name})
        .then(foundUser => {
            if(foundUser) {
                res.status(400).json({message: "Username already taken"})
                return
            }

            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({name, password: hashedPassword})
        })
        .then(createdUser => {
            const{ name, _id } = createdUser
            const user = { name, _id }

            res.status(201).json({user: user})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: "Internal Server Error"})
        })
})

//Post /auth/login - verifies name and password and returns JWT

router.post("/login", (req, res) => {
    const {name, password} = req.body

    if(name === "" || password === "") {
        res.status(400).json({message: "Please provide username and password"})
        return
    }

    User.findOne({name})
        .then(foundUser => {
            if(!foundUser) {
                res.status(400).json({message: "Could not find user"})
                return
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password)

            if(passwordCorrect) {
                const {_id, name} = foundUser

                const payload = {_id, name}

                // Create and sign token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    {algorithm: "HS256", expiresIn: "6h"}
                )
                res.status(200).json({authToken: authToken})
            } else {
                res.status(401).json({message: "User is not authorized"})
            }
        })
        .catch(err => res.status(500).json({message: "Internal Server Error"}))
})

//Get /auth/verify - used to verify stored token

router.get("/verify", isAuthenticated, (req, res) => {
    res.status(200).json(req.payload)
})

module.exports = router