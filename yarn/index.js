import _ from 'lodash';
import pack from './package.json';

/*
  Run demo
 */

function* range(min, max) {
  for (let i = min; i < max; i++) {
    yield i;
  }
}

const createRandomList = (min, max, generator) => {
  return _.map([...generator], n => _.random(min, max, false));
}

console.log(`* The random list is: ${createRandomList(1, 100, range(1, 100))}`);


/*
  Load `package.json` file.
  Run script by `node --experimental-json-modules index.js` to enable import `json` file as module
*/

console.log(`* Load "setting" from "package.json": `);
console.log(`  - log: "${pack.setting.log}"`);
