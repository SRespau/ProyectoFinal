const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,    
    mix: 50,
  },
  nombre: {
    type: String,
  },
  apellidos: {
    type: String,
  },
  direccion: {
    type: String,
  },
  telefono: {
    type: String,
  },
  isAvatarImageSet: { 
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);