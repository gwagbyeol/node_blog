const express = require('express');
const app = express();
const port = 3000;
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const connect = require("./schemas");
connect();

app.use(express.json());

// locaclhost:3000/api => postsRouter, commentsRouter 연결
app.use("/api", [postsRouter, commentsRouter]);

app.get("/", (req,res) => {
  console.log(req.query);
  const obj = {
    "Key" : "value",
  }
  res.status(400).json(obj);
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
