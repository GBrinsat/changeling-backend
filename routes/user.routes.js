const express = require("express")
const User = require("../models/User.model")

const router= express.Router()

//Get - find user

router.get("/find/:userId", (req, res, next) => {
    const {userId} = req.params
    User.findById(userId)
        .populate("character")
        .then(foundUser => {
            if(!foundUser) {
                res.status(400).json({message: "Could not find user"})
                return
            }

            const user = foundUser
            res.status(200).json({user})
        })

})

module.exports = router