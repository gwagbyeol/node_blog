const express = require("express");
const router = express.Router();
const comments = require("../schemas/comments.js");
const time = require("./time.js");

// GET으로 모든 댓글 조회
router.get("/posts/comments", async (req, res) => {
  const comments = await comments.find({});
  comments.reverse();
  res.json({ comments: comments });
});

// GET으로 postId에 맞는 댓글 조회
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const comments = await comments.find({ postId: postId });
  comments.reverse();
  res.json({ comments: comments });
});

// POST로 댓글 작성
router.post("/posts/:postId/comments", async (req, res) => {
  const { user, password, content } = req.body;
  const { postId } = req.params;
  const commentId = time.makeId();
  const createdAt = time.makeTime();

  if (user === "" || password == "") {
    return res
      .status(400)
      .json({ errorMessage: "이름과 비밀번호를 모두 채워주세요." });
  }

  if (content === "") {
    return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." });
  }

  const comments = await comments.find({ commentId });
  if (comments.length) {
    return res.status(400).json({
      sucess: false,
      errorMessage: "commentId가 중복되었습니다. 재시도 해주세요.",
    });
  }
  const createdPosts = await comments.create({
    postId,
    commentId,
    user,
    password,
    content,
    createdAt,
  });
  res.json({ posts: createdPosts });
});

// PUT으로 댓글 수정
router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.params;
  const { password } = req.body;
  const { content } = req.body;
  if (password == "") {
    return res.status(400).json({ errorMessage: "비밀번호를 입력해주세요." });
  }

  if (content === "") {
    return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." });
  }
  const existscommentUpdate = await comments.find({
    postId: postId,
    commentId: commentId,
  });
  if (existscommentUpdate.length > 0) {
    if (existscommentUpdate[0].password !== password) {
      return res.status(400).json({
        sucess: false,
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
    }
    await comments.updateOne(
      { postId: postId, commentId: commentId },
      { $set: { content } }
    );
  } else {
    return res.status(400).json({ errorMessage: "잘못된 접근입니다." });
  }
  res.json({ message: "댓글을 수정하였습니다." });
});

// DELETE로 댓글 삭제
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.params;
  const { password } = req.body;
  if (password == "") {
    return res.status(400).json({ errorMessage: "비밀번호를 입력해주세요." });
  }
  const existscommentUpdate = await comments.find({
    postId: postId,
    commentId: commentId,
  });
  if (existscommentUpdate.length > 0) {
    if (existscommentUpdate[0].password !== password) {
      return res.status(400).json({
        sucess: false,
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
    }
    await comments.deleteOne({ postId: postId, commentId: commentId });
  } else {
    return res.status(400).json({ errorMessage: "잘못된 접근입니다." });
  }
  res.json({ message: "댓글이 삭제되었습니다." });
});

module.exports = router;
