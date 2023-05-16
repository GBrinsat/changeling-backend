const mongoose = require("mongoose")
const { Schema, model } = mongoose

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      enum: ['player', 'dm'],
      default: 'player'
    },
    character: [{type: Schema.Types.ObjectId, ref:`Character`}]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
