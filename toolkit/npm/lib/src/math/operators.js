/**
 * 计算两个变量的和
 *
 * @param {number|string} a 加数
 * @param {number|string} b 加数
 * @returns {number|string} 变量和
 */
function add(a, b) {
  return a + b;
}

/**
 * 计算两个变量的差
 * @param {number} a 被减数
 * @param {number} b 减数
 * @returns {number} 变量差
 */
function sub(a, b) {
  return a - b;
}

module.exports = { add, sub };
