'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');

const config = require('./config');

gulp.task('clear-dest', () => {
	return gulp.src([config.paths.dest()])
		.pipe(clean({force: true}));
});

gulp.task('clear-view', () => {
	return gulp.src([config.paths.view()])
		.pipe(clean({force: true}));
});

module.exports = ['clear-dest', 'clear-view'];