'use strict';

const gulp = require('gulp');

const config = require('./config');

gulp.task('static-template', () => {
	return gulp.src([config.paths.template('**/*.html')])
		.pipe(gulp.dest(config.paths.view()));
});

gulp.task('static-font', () => {
	return gulp.src([config.paths.module('bootstrap/dist/fonts/**')])
		.pipe(gulp.dest(config.paths.dest('fonts')));
});

gulp.task('static-image', () => {
	return gulp.src([config.paths.source('image/**')])
		.pipe(gulp.dest(config.paths.dest('image')));
});

module.exports = ['static-template', 'static-font', 'static-image'];