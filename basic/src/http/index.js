const startServer = require('./server');
const { get, post } = require('./client');

// 导出函数
module.exports = {
  startServer,
  get,
  post
};
