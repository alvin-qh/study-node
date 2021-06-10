/*
  Use '"type": "module"' to enable "ESM" mode (default is "CJS" mode)
  In "ESM" mode, use 'import / export' instead 'require(...) / module.exports`.
 */ 

import _ from 'lodash';
import pack from './package.json';
import semver from 'semver';  // https://github.com/npm/node-semver

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


/*
  `semver` demo
 */

console.log(`semver.valid('1.2.3'): ${semver.valid('1.2.3')}`); // '1.2.3'
console.log(`semver.valid('a.b.c'): ${semver.valid('a.b.c')}`); // null
console.log(`semver.clean('  =v1.2.3   '): ${semver.clean('  =v1.2.3   ')}`); // '1.2.3'
console.log(`semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3'): ${semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3')}`); // true
console.log(`semver.gt('1.2.3', '9.8.7'): ${semver.gt('1.2.3', '9.8.7')}`); // false
console.log(`semver.lt('1.2.3', '9.8.7'): ${semver.lt('1.2.3', '9.8.7')}`); // true
console.log(`semver.minVersion('>=1.0.0'): ${semver.minVersion('>=1.0.0')}`); // '1.0.0'
console.log(`semver.valid(semver.coerce('v2')): ${semver.valid(semver.coerce('v2'))}`); // '2.0.0'
console.log(`semver.valid(semver.coerce('42.6.7.9.3-alpha')): ${semver.valid(semver.coerce('42.6.7.9.3-alpha'))}`); // '42.6.7'
