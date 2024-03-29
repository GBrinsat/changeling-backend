const express = require("express");
const User = require("../models/User.model");
const Backstory = require("../models/Backstory.model");
const Character = require("../models/Character.model");

const router = express.Router();

//Post - create a character

router.post("/create", (req, res, next) => {
  const { user } = req.body;

  Character.create({
    user: user,
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
      chamod: 0,
    },
    savingThrows: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    proficiencies: {
      acrobatics: 0,
      animalHandling: 0,
      arcana: 0,
      athletics: 0,
      deception: 0,
      history: 0,
      insight: 0,
      intimidation: 0,
      investigation: 0,
      medicine: 0,
      nature: 0,
      perception: 0,
      performance: 0,
      persuasion: 0,
      religion: 0,
      sleightOfHand: 0,
      stealth: 0,
      survival: 0,
    },
    armorclass: 10,
    hpmax: 6,
    hpcurrent: 6,
    initiative: 0,
    speed: 30,
    background: "",
    alignment: "",
    backstory: [],
  })
    .then((newCharacter) => {
      return User.findByIdAndUpdate(
        user,
        {
          $push: { character: newCharacter._id },
        },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//update character

router.put("/update/:id", (req, res, next) => {
  const { id } = req.params;

  Character.findByIdAndUpdate(id, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((error) => res.json(error));
});

//delete character

router.post("/delete", (req, res, next) => {
  const { id, backstoryId, userId } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      $pull: { character: id },
    },
    { new: true }
  ).then(() => {
    Backstory.findByIdAndDelete(backstoryId).then(() => {
      Character.findByIdAndDelete(id)
        .then((response) => res.json(response))
        .catch((error) => res.json(error));
    });
  });
});

//find character

router.get("/find/:characterId", (req, res, next) => {
  characterId = req.params.characterId;

  Character.findById(characterId)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => res.json(error));
});

module.exports = router;
