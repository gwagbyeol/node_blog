const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const time = require("./time.js");
const comments = require("../schemas/comments.js");

// GET으로 모든 게시글 조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.find({});
  const priPosts = posts.map((e) => {
    return {
      postId: e.postId,
      user: e.user,
      title: e.title,
      createdAt: e.createdAt,
    };
  });
  priPosts.reverse();
  res.json({ posts: priPosts });
});

// GET으로 postId 상세페이지이동
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const posts = await Posts.find({ postId: postId });
  const priPosts = posts.map((e) => {
    return {
      postId: e.postId,
      user: e.user,
      title: e.title,
      content: e.content,
      createdAt: e.createdAt,
    };
  });
  const comments = await comments.find({ postId: postId });
  const pricomments = comments.map((e) => {
    return {
      postId: e.postId,
      commentId: e.commentId,
      user: e.user,
      content: e.content,
      createdAt: e.createdAt,
    };
  });
  pricomments.reverse();
  res.status(200).json({ posts: priPosts, comments: pricomments });
});

// POST로 게시글 작성
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  const createdAt = time.makeTime();
  const postId = time.makeId();
  if (
    postId === "" ||
    user === "" ||
    password == "" ||
    title === "" ||
    content === ""
  ) {
    return res
      .status(400)
      .json({ errorMessage: "모든 항목에 내용을 채워주세요." });
  }

  const posts = await Posts.find({ postId });
  if (posts.length) {
    return res.status(400).json({
      sucess: false,
      errorMessage: "이미 있는 postId입니다. 재시도 해주세요.",
    });
  }
  const createdPosts = await Posts.create({
    postId,
    user,
    password,
    title,
    content,
    createdAt,
  });
  res.json({ posts: createdPosts });
});

// PUT으로 게시글 수정
router.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  const { content } = req.body;

  if (password == "") {
    return res.status(400).json({ errorMessage: "비밀번호를 입력해주세요." });
  }

  if (content == "") {
    return res
      .status(400)
      .json({ errorMessage: "수정할 내용을 입력해주세요." });
  }

  const existsPostUpdate = await Posts.find({ postId: postId });
  if (existsPostUpdate.length > 0) {
    if (existsPostUpdate[0].password !== password) {
      return res.status(400).json({
        sucess: false,
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
    }
    await Posts.updateOne({ postId: postId }, { $set: { content } });
  } else {
    return res.status(400).json({ errorMessage: "잘못된 접근입니다." });
  }
  res.json({ message: "게시글을 수정하였습니다." });
});

// DELETE로 게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  if (password == "") {
    return res.status(400).json({ errorMessage: "비밀번호를 입력해주세요." });
  }

  const existsPostDelete = await Posts.find({ postId });
  const existscommentsDelete = await comments.find({ postId });

  // 게시글에 딸린 하위 댓글들 모두 삭제
  if (existscommentsDelete.length > 0) {
    if (existsPostDelete.length > 0) {
      if (existsPostDelete[0].password !== password) {
        return res.status(400).json({
          sucess: false,
          errorMessage: "패스워드가 일치하지 않습니다.",
        });
      }
      await Posts.deleteOne({ postId: postId });
      await comments.deleteMany({ postId: postId });
    } else {
      return res.status(400).json({ message: "잘못된 접근입니다." });
    }
  } else {
    return res.status(400).json({ message: "잘못된 접근입니다." });
  }
  res.json({ message: "게시글을 삭제하였습니다." });
});

module.exports = router;
