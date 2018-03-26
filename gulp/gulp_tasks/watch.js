import gulp from "gulp";
import path from "path";
import gUtil from "gulp-util";
import cssBundle from "./css-folder-bundle";

import config from "./config";

gulp.task('watch-css', () => {
    gulp.watch(config.paths.source('css/**/*.css'), e => {
        gUtil.log('file "' + e.path + '" is ' + e.type);

        const pathName = path.dirname(e.path);
        const folder = path.relative(config.paths.source('css'), pathName);

        cssBundle(folder);
    });
});

gulp.task('watch-template', () => {
    gulp.watch(config.paths.template('**/*.html'), e => {
        gUtil.log('file "' + e.path + '" is ' + e.type);
        gulp.src(e.path).pipe(gulp.dest(config.paths.view()));
    });
});

export default ['watch-css', 'watch-template'];