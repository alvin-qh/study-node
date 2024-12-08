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
  function clearDir(dir) {
    try {
      const paths = fs.readdirSync(dir);
      if (paths.includes('.keep')) {
        console.log(`+ "${dir}" cannot be deleted, because it contain ".keep" file`);
      } else {
        paths.forEach(sub => {
          const fullpath = path.join(dir, sub);

          const stat = fs.statSync(fullpath);
          if (stat.isSymbolicLink() || stat.isFile()) {
            fs.unlinkSync(fullpath);
            if (stat.isSymbolicLink()) {
              console.log(`+ "${fullpath}" is a symbolic link, so it cannot be deleted`);
            }
          } else {
            clearDir(fullpath);
            fs.rmdirSync(fullpath);
          }
        });
      }
    } catch (e) {
      console.error(e);
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
