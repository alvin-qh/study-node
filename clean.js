const fs = require('node:fs');
const path = require('node:path');

const _targets = new Set(
  [
    'node_modules',
    'dist',
    '.history',
  ].map(s => s.toLowerCase())
);

function main() {
  function clearDir(fullpath) {
    try {
      const paths = fs.readdirSync(fullpath);
      if (paths.includes('.keep')) {
        console.log(`+ "${fullpath}" cannot be deleted, because it contain ".keep" file`);
      } else {
        paths.forEach(sub => {
          const subpath = path.join(fullpath, sub);
          const stat = fs.statSync(subpath);

          if (stat.isDirectory()) {
            clearDir(subpath);
            fs.rmdirSync(subpath);
          } else {
            fs.unlinkSync(subpath);
          }
        });
      }
    } catch {
      // do nothing
    }
  }

  function find(dir) {
    let result = [];

    fs.readdirSync(dir).forEach(sub => {
      const fullpath = path.join(dir, sub);

      if (_targets.has(sub.toLowerCase())) {
        result.push(fullpath);
      } else {
        if (fs.statSync(fullpath).isDirectory()) {
          result = result.concat(find(fullpath));
        }
      }
    });

    return result;
  }

  find(__dirname).forEach(fullpath => {
    console.log(`- Deleting "${fullpath}" ...`);
    clearDir(fullpath);
  });
}

main();
