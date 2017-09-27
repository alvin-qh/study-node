import path from "path";
import uuid from "uuid";

const isDev = process.env.NODE_ENV !== 'production';

let manifest = {};
try {
    manifest = require('./manifest.json')
} catch (e) {
}

function findAsset(name, type) {
    const asset = manifest[name];
    if (!asset) {
        return '';
    }
    return asset[type] || '';
}

const assets = isDev ? {
    js(name) {
        return path.join('/js', name + '.js') + `?v=${uuid()}`;
    },
    css(name) {
        return path.join('/css', name + '.css') + `?v=${uuid()}`;
    }
} : {
    js(name) {
        return path.join('/', findAsset(name, 'js'));
    },
    css(name) {
        return path.join('/', findAsset(name, 'css'));
    }
};

export default assets;