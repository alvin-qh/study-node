const { add } = require('@lang/cjs-lib');

function main() {
  console.log(`Hello CommonJS, the add(1, 2) is: ${add(1, 2)}`);
}

main();

module.exports = main;
