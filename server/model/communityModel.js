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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model("Community", communitySchema);
