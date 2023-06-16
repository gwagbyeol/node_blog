const mongoose = require("mongoose");

const comentsSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: false,
  },
  commentId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("comments", comentsSchema);
