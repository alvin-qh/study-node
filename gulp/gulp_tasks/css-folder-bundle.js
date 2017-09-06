'use strict';

const gulp = require('gulp');
const ifElse = require('gulp-if-else');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');

const path = require('path');

const config = require('./config');

module.exports = (folder) => {
	return gulp.src(path.join(config.paths.source('css'), folder, '/**/*.css'))
		.pipe(ifElse(!config.isPROD, sourcemaps.init))
		.pipe(concat(folder + '.css'))
		.pipe(ifElse(config.isPROD, cleanCss))
		.pipe(ifElse(!config.isPROD, () => sourcemaps.write('./')))
		.pipe(gulp.dest(config.paths.dest('css')));
};