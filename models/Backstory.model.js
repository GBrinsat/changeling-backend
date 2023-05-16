const mongoose = require("mongoose")
const {Schema, model} = mongoose

const backstorySchema = new Schema({
    option1: String,
    option2: String,
    option3: String,
    text: String,
    character: {type: Schema.Types.ObjectId, ref:`Character`}

})

const Backstory = model("Backstory", backstorySchema)
module.exports = Backstory