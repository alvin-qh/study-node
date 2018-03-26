import gulp from "gulp";
import concat from "gulp-concat";
import cleanCss from "gulp-clean-css";
import merge from "merge-stream";

import listPath from "./list-path";
import config from "./config";
import cssBundle from "./css-folder-bundle";

gulp.task('css-bundle-vendor', () => {
	return gulp.src([
		config.paths.module('bootstrap/dist/css/bootstrap.css'),
		config.paths.module('bootstrap/dist/css/bootstrap-theme.css')
	])
		.pipe(concat('vendor.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(config.paths.dest('css')));
});

gulp.task('css-bundle-app', () => {
	const src = config.paths.source('css');
	const folders = listPath(src);
	return merge(folders.map((folder) => cssBundle(folder)));
});

export default ['css-bundle-vendor', 'css-bundle-app'];