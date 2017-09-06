'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge-stream');

const path = require('path');

const listPath = require('./list-path');
const config = require('./config');
const cssBundle = require('./css-folder-bundle');

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

module.exports = ['css-bundle-vendor', 'css-bundle-app'];