const express = require("express")
const router = express.Router()
const axios = require("axios")

const Backstory = require("../models/Backstory.model")
const Character = require("../models/Character.model")

const {Configuration, OpenAIApi} = require("openai")
const configuration = new Configuration({
    apiKey: process.env.API_KEY
})
const openai = new OpenAIApi(configuration)


//create backstory and add to character

router.post("/create", (req, res, next) => {

    const {option1, option2, option3, character} = req.body

    Backstory.create(
        {
        option1: option1,
        option2: option2,
        option3: option3,
        text: "",
        character: character
        }
    )
        .then(newBackstory => {
            return Character.findByIdAndUpdate(character, {
                $push: {backstory: newBackstory._id},
            }, {new : true})
        })
            .then(response => res.json(response))
            .catch(err => res.json(err))
})

//generate backstory with chatGPT

router.get("/generate", async (req, res, next) => {
  /* res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Max-Age", "1800")
  res.setHeader("Access-Control-Allow-Headers", "content-type")
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ) */
  
    try {
    const backstoryId = req.headers.id
    const characterId = req.headers.character
    

    async function generatePrompt(){
        const characterResponse = await Character.findById(characterId)
        const backstoryResponse = await Backstory.findById(backstoryId)

                const characterName = characterResponse.name
                const race = characterResponse.race
                const characterClass = characterResponse.class
                const gender = characterResponse.gender
                const alignment = characterResponse.alignment
                const background = characterResponse.background

                const option1 = backstoryResponse.option1
                const option2 = backstoryResponse.option2
                const option3 = backstoryResponse.option3

                return `Write a backstory with these parameters:
                Name: ${characterName}
                Race: ${race}
                Gender: ${gender}
                Class: ${characterClass}
                Alignment: ${alignment}
                Background: ${background}

                Include the following:
                - ${option1}
                - ${option2}
                - ${option3}
                
                Do not repeat back any of the parameters. Omit them from the story if they are left empty.
                In the end of the backstory, the character has to be looking for new adventures.
                Write at least 100 words but no more than 120`
        }

    const prompt = await generatePrompt()

    const generateCompletion = async () => {
        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            
            {
              model: "gpt-3.5-turbo",
              messages: [{"role": "user", "content": prompt,"name": "testuser"},],
              temperature: 0.6
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`
              }
            }
          );
      
          let completion = response.data.choices[0];
          res.json(completion)
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
      
    await generateCompletion();

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }   
})


//find backstory

router.get("/:id", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Max-Age", "1800")
    res.setHeader("Access-Control-Allow-Headers", "content-type")
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" )

    const {id} = req.params

    Backstory.findById(id)
        .then(response => {
            res.status(200).json(response)
        })
})

//update backstory

router.put("/:id", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Max-Age", "1800")
    res.setHeader("Access-Control-Allow-Headers", "content-type")
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" )

    const{id} = req.params

    Backstory.findByIdAndUpdate(id, req.body, {new:true})
        .then(response => res.json(response))
        .catch(error => res.json(error))
})

module.exports = router