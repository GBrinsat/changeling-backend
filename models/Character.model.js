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
    background: String,
    alignment: String,
    backstory: [{type: Schema.Types.ObjectId, ref: 'Backstory'}]        
})

const Character = model('Character', characterSchema)
module.exports = Character