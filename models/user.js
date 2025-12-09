const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: String,
  email: { type: String },

 

  googleId: { type: String },

   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", Schema);
