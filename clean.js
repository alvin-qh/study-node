const { exec } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { stdout, stderr } = require('node:process');

const _targets = new Set(
  [
    'node_modules',
    'dist',
    '.history',
    '.next',
    '.yarn'
  ].map(s => s.toLowerCase())
);

function main() {
  function deleteDir(dir) {
    if (!fs.existsSync(dir)) {
      return;
    }

    try {
      const stat = fs.lstatSync(dir);
      if (stat.isSymbolicLink() || stat.isFile()) {
        fs.rmSync(dir, { recursive: true, force: true });
        return;
      }

      if (fs.readdirSync(dir).includes('.keep')) {
        console.log(`+ "${dir}" cannot be deleted, because it contain ".keep" file`);
      } else {
        fs.rmSync(dir, { recursive: true, force: true });
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
    deleteDir(fullpath);
  });

  console.log();

  exec('du -h -d1', (err, stdout, stderr)=>{
    if (err) {
      console.error(stderr);
    } else {
      console.log(stdout);
    }
  });
}

main();
