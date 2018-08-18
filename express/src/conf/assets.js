import path from "path";
import crypto from "crypto";
import fs from "fs";

const manifest = (() => {
    try {
        return require('../public/manifest.json')
    } catch (e) {
        return null
    }
})();

const FILE_HASH_MAP = {};

function calculateHash(file) {
    let hash = FILE_HASH_MAP[file];
    if (!hash) {
        const static_path = path.join(__dirname, '../public', file);
        const md5 = crypto.createHash('md5');
        hash = md5.update(fs.readFileSync(static_path)).digest('hex');
        FILE_HASH_MAP[file] = hash;
    }
    return hash;
}


function findAsset(prefix, name) {
    const key = path.join(prefix, name);
    let file = manifest[key];
    if (file) {
        return file;
    }

    file = path.join('/', file);
    return `${file}?v=${calculateHash(key)}`;
}

function makeAssetsPath(prefix, name) {
    const file = path.join(prefix, name);
    return `${path.join('/', file)}?v=${calculateHash(file)}`;
}


export default manifest ? {
    js(name) {
        return findAsset('js', name);
    },
    css(name) {
        return findAsset('css', name);
    },
    image(name) {
        return findAsset('images', name);
    }
} : {
    js(name) {
        return makeAssetsPath('js', name);
    },
    css(name) {
        return makeAssetsPath('css', name);
    },
    image(name) {
        return makeAssetsPath('images', name);
    }
};
