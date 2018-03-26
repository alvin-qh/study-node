import gulp from "gulp";
import ifElse from "gulp-if-else";
import sourceMaps from "gulp-sourcemaps";
import cleanCss from "gulp-clean-css";
import concat from "gulp-concat";
import path from "path";
import config from "./config";

export default (folder) => {
    return gulp.src(path.join(config.paths.source('css'), folder, '/**/*.css'))
        .pipe(ifElse(!config.isPROD, sourceMaps.init))
        .pipe(concat(folder + '.css'))
        .pipe(ifElse(config.isPROD, cleanCss))
        .pipe(ifElse(!config.isPROD, () => sourceMaps.write('./')))
        .pipe(gulp.dest(config.paths.dest('css')));
}