const express = require("express")
const User = require("../models/User.model")
const Backstory = require("../models/Backstory.model")
const Character = require("../models/Character.model")

const router= express.Router()

//Post - create a character

router.post("/create", (req, res, next) => {
    
    const {user} = req.body

    Character.create(
        {user: user,
         name: "", 
         race: "", 
         class: "", 
         gender: "",
         stats: {
            str: 10, 
            strmod: 0, 
            dex: 10, 
            dexmod: 0, 
            con: 10, 
            conmod: 0, 
            int: 10, 
            intmod: 0, 
            wis: 10, 
            wismod: 0, 
            cha: 10, 
            chamod: 0},
            background: "",
            alignment: "",
            backstory: []
        })
        .then((newCharacter) => {
            return User.findByIdAndUpdate(user, {
                $push: {character: newCharacter._id}
            }, {new : true})
        })
            .then((response) => res.json(response))
            .catch((err) => res.json(err))
})

//update character

router.put("/update/:id", (req, res, next) => {

    const {id} = req.params

    Character.findByIdAndUpdate(id, req.body, {new:true})
        .then(response => res.json(response))
        .catch(error => res.json(error))
})

//delete character

router.post("/delete", (req, res, next) => {

    const {id, backstoryId, userId} = req.body
    console.log(id)

            User.findByIdAndUpdate(userId, {
                $pull: {character: id},
            }, {new : true})
                .then(() => {
                    Backstory.findByIdAndDelete(backstoryId)
                    .then(() => {
                        Character.findByIdAndDelete(id)
                        .then(response => res.json(response))
                        .catch(error => res.json(error))
                        })
                    })   
})

//find character

router.get("/find/:characterId", (req, res, next) => {

    characterId = req.params.characterId

    Character.findById(characterId)
        .then(response => {
            console.log(response)
            res.json(response)
        })
        .catch(error => res.json(error))
})

module.exports = router