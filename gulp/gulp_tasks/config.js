import path from 'path';

export default {
    isPROD: (process.env.NODE_ENV === 'production'),
    paths: {
        source: (file) => path.join('asset/', file || ''),
        dest: (file) => path.join('www/asset/', file || ''),
        module: (file) => path.join('node_modules/', file || ''),
        bower: (file) => path.join('bower_components/', file || ''),
        template: (file) => path.join('template/', file || ''),
        view: (file) => path.join('www/view/', file || ''),
    }
};