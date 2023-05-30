const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    
    required: true
  }],
  messages: [{
    user: {
      type: String, // aqui tenia mongoose.Schema.Types.ObjectId,
      ref: "User",      
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
},
{
  timestamps: true,
});

module.exports = mongoose.model("Community", communitySchema);
