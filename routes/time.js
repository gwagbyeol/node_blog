//글 작성 시간
const makeTime = () => {
    let date = new Date();
    let createdAt = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()} ${date.toLocaleTimeString()}`;
    return createdAt;
  };
  
  const makeId = () => {
    let postId = Date.now() + String(Math.floor(Math.random() * 100));
    return postId;
  };
  
  module.exports = {
    makeTime,
    makeId,
  };
  