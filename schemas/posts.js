const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: false,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
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

module.exports = mongoose.model("posts", postsSchema);
