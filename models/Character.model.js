const mongoose = require("mongoose")
const {Schema, model} = mongoose

const characterSchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref: 'User'},
    name: String,
    race: String,
    class: String,
    gender: String,
    stats: {
        str: Number,
        strmod: Number,
        dex: Number,
        dexmod: Number,
        con: Number,
        conmod: Number,
        int: Number,
        intmod: Number,
        wis: Number,
        wismod: Number,
        cha: Number,
        chamod: Number
    },
    savingThrows: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number
    },
    proficiencies: {
        acrobatics: Number,
        animalHandling: Number,
        arcana: Number,
        athletics: Number,
        deception: Number,
        history: Number,
        insight: Number,
        intimidation: Number,
        investigation: Number,
        medicine: Number,
        nature: Number,
        perception: Number,
        performance: Number,
        persuasion: Number,
        religion: Number,
        sleightOfHand: Number,
        stealth: Number,
        survival: Number,
    },
    armorclass: Number,
    hpmax: Number,
    hpcurrent: Number,
    initiative: Number,
    speed: Number,
    background: String,
    alignment: String,
    backstory: [{type: Schema.Types.ObjectId, ref: 'Backstory'}]        
})

const Character = model('Character', characterSchema)
module.exports = Character